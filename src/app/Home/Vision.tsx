"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from '../context/LanguageContext'; // Adjust path as needed
import { translations } from '../lib/translations'; // Adjust path as needed

interface VisionProps {
  preloaderCompleted: boolean;
}

export default function Vision({ preloaderCompleted }: VisionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const { language } = useLanguage();
  const t = translations[language];

  const title = t.vision.visionTitle;

  // Handle window resize for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    handleResize(); // Set initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && preloaderCompleted) {
          setIsAnimatingOut(false);
          setIsVisible(true);
        } else if (!entry.isIntersecting && isVisible) {
          setIsAnimatingOut(true);
          setTimeout(() => {
            setIsVisible(false);
            setIsAnimatingOut(false);
          }, 600);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [preloaderCompleted, isVisible]);

  // Responsive font sizes and spacing
  const getResponsiveValues = () => {
    const { width } = windowSize;
    
    // Mobile first approach - INCREASED LINE WIDTHS TO MATCH MISSION
    if (width < 640) { // sm
      return {
        titleSize: "text-5xl",
        padding: "p-6",
        maxWidth: "max-w-sm",
        lineWidth: "w-24", // Increased from w-16 to match Mission
        paragraphSize: "text-xs",
        spacing: "mt-2 mb-5",
        gap: "gap-1"
      };
    } else if (width < 768) { // md
      return {
        titleSize: "text-6xl",
        padding: "p-8",
        maxWidth: "max-w-md",
        lineWidth: "w-32", // Increased from w-20 to match Mission
        paragraphSize: "text-sm",
        spacing: "mt-2 mb-6",
        gap: "gap-1"
      };
    } else if (width < 1024) { // lg
      return {
        titleSize: "text-7xl",
        padding: "p-10 md:p-16",
        maxWidth: "max-w-lg",
        lineWidth: "w-40", // Increased from w-24 to match Mission
        paragraphSize: "text-base",
        spacing: "mt-3 mb-7",
        gap: "gap-2"
      };
    } else if (width < 1280) { // xl
      return {
        titleSize: "text-8xl",
        padding: "p-12 md:p-20",
        maxWidth: "max-w-xl",
        lineWidth: "w-48", // Increased from w-28 to match Mission
        paragraphSize: "text-base md:text-lg",
        spacing: "mt-3 mb-8",
        gap: "gap-2"
      };
    } else { // 2xl and above
      return {
        titleSize: "text-8xl lg:text-9xl",
        padding: "p-14 md:p-24",
        maxWidth: "max-w-2xl",
        lineWidth: "w-56", // Increased from w-32 to match Mission
        paragraphSize: "text-lg lg:text-lg",
        spacing: "mt-3 mb-8",
        gap: "gap-3"
      };
    }
  };

  const responsive = getResponsiveValues();

  // Responsive background positioning
  const getBackgroundStyle = () => {
    const { width } = windowSize;
    
    // Adjust background position for mobile to ensure focal point is visible
    if (width < 640) {
      return {
        backgroundImage: "url('/VisionBg.jpg')",
        backgroundPosition: "70% center",
        backgroundSize: "cover"
      };
    }
    return {
      backgroundImage: "url('/VisionBg.jpg')",
      backgroundPosition: "center",
      backgroundSize: "cover"
    };
  };

  // Responsive gradient intensity
  const getGradientClass = () => {
    const { width } = windowSize;
    
    if (width < 640) {
      return "bg-gradient-to-tl from-black/95 via-black/60 to-transparent";
    }
    return "bg-gradient-to-tl from-black/95 via-black/40 to-transparent";
  };

  return (
    <motion.section
      ref={ref}
      className="relative top-0 w-full h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={getBackgroundStyle()}
      initial={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* 1. Gradient Overlay - Responsive */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 z-10 ${getGradientClass()}`}
          />
        )}
      </AnimatePresence>

      {/* 2. Content Container - Responsive positioning */}
      <div className={`absolute inset-0 z-20 flex flex-col justify-end items-end ${responsive.padding} text-right pointer-events-none`}>
        <div className={`flex flex-col items-end ${responsive.maxWidth} w-full`}>
          
          {/* Title Reveal - Mission style font (normal weight) */}
          <div className="overflow-hidden">
            {isVisible && (
              <div className={`flex flex-wrap justify-end ${responsive.gap}`}>
                {title.split("").map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={isAnimatingOut ? { y: "100%", opacity: 0 } : { y: "0%", opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      ease: [0.33, 1, 0.68, 1],
                      delay: isAnimatingOut ? (title.length - 1 - index) * 0.05 : index * 0.05,
                    }}
                    className={`inline-block text-white font-normal ${responsive.titleSize} leading-none uppercase `}
                    style={{
                      letterSpacing: windowSize.width < 380 ? '0em' : '-0.05em',
                      fontFamily: 'var(--font-montserrat), sans-serif'
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </div>
            )}
          </div>

          {/* Orange Line under title - RESTORED */}
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={isAnimatingOut ? { width: 0 } : { width: '80px' }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="h-[4px] bg-[#F79520] mt-2 mb-6 mr-[0%]" 
                  />

          {/* Paragraph Reveal */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={isVisible && !isAnimatingOut ? { x: 0, opacity: 1 } : { x: 20, opacity: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.33, 1, 0.68, 1],
              delay: 0.5,
            }}
            className="w-full"
          >
            <p
          className={`text-white/80 font-light ${responsive.paragraphSize} leading-relaxed mb-3 sm:mb-4`}
        >
          {t.vision.visionDescription}
        </p>
           
          </motion.div>
        </div>
      </div>

      {/* Base Background Dimmer */}
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          backgroundColor: `rgba(0,0,0,${windowSize.width < 640 ? 0.3 : 0.2})` 
        }}
      />

      {/* Optional pattern overlay */}
      {windowSize.width >= 1024 && (
        <div className="absolute inset-0 z-[1] opacity-10 pointer-events-none" 
             style={{ backgroundImage: "url('/subtle-pattern.png')", backgroundRepeat: "repeat" }} />
      )}
    </motion.section>
  );
}