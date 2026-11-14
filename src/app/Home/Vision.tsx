"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";

interface VisionProps {
  preloaderCompleted: boolean;
}

const getWidthBreakpoint = (width: number) => {
  if (width < 380) return 0;
  if (width < 640) return 380;
  if (width < 768) return 640;
  if (width < 1024) return 768;
  if (width < 1280) return 1024;
  return 1280;
};

export default function Vision({ preloaderCompleted }: VisionProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [responsiveWidth, setResponsiveWidth] = useState(0);

  const isVisibleRef = useRef(false);
  const exitTimeoutRef = useRef<number | null>(null);
  const resizeFrameRef = useRef<number | null>(null);

  const { language } = useLanguage();
  const t = translations[language];
  const title = t.vision.visionTitle;

  // Update responsive state only when crossing a breakpoint used by this section.
  useEffect(() => {
    const updateResponsiveWidth = () => {
      if (resizeFrameRef.current !== null) {
        window.cancelAnimationFrame(resizeFrameRef.current);
      }

      resizeFrameRef.current = window.requestAnimationFrame(() => {
        const nextBreakpoint = getWidthBreakpoint(window.innerWidth);
        setResponsiveWidth((current) =>
          current === nextBreakpoint ? current : nextBreakpoint
        );
        resizeFrameRef.current = null;
      });
    };

    updateResponsiveWidth();
    window.addEventListener("resize", updateResponsiveWidth, { passive: true });

    return () => {
      window.removeEventListener("resize", updateResponsiveWidth);
      if (resizeFrameRef.current !== null) {
        window.cancelAnimationFrame(resizeFrameRef.current);
      }
    };
  }, []);

  // Keep one observer instance and cancel the exit timer if the section re-enters view.
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && preloaderCompleted) {
          if (exitTimeoutRef.current !== null) {
            window.clearTimeout(exitTimeoutRef.current);
            exitTimeoutRef.current = null;
          }

          isVisibleRef.current = true;
          setIsAnimatingOut(false);
          setIsVisible(true);
        } else if (!entry.isIntersecting && isVisibleRef.current) {
          isVisibleRef.current = false;
          setIsAnimatingOut(true);

          if (exitTimeoutRef.current !== null) {
            window.clearTimeout(exitTimeoutRef.current);
          }

          exitTimeoutRef.current = window.setTimeout(() => {
            setIsVisible(false);
            setIsAnimatingOut(false);
            exitTimeoutRef.current = null;
          }, 600);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (exitTimeoutRef.current !== null) {
        window.clearTimeout(exitTimeoutRef.current);
        exitTimeoutRef.current = null;
      }
    };
  }, [preloaderCompleted]);

  // The stored value is the active breakpoint, not the continuously changing viewport width.
  const width = responsiveWidth;

  const getResponsiveValues = () => {
    if (width < 640) {
      return {
        titleSize: "text-5xl",
        padding: "p-6",
        maxWidth: "max-w-sm",
        lineWidth: "w-24",
        paragraphSize: "text-xs",
        spacing: "mt-2 mb-5",
        gap: "gap-1",
      };
    } else if (width < 768) {
      return {
        titleSize: "text-6xl",
        padding: "p-8",
        maxWidth: "max-w-md",
        lineWidth: "w-32",
        paragraphSize: "text-sm",
        spacing: "mt-2 mb-6",
        gap: "gap-1",
      };
    } else if (width < 1024) {
      return {
        titleSize: "text-7xl",
        padding: "p-10 md:p-16",
        maxWidth: "max-w-lg",
        lineWidth: "w-40",
        paragraphSize: "text-base",
        spacing: "mt-3 mb-7",
        gap: "gap-2",
      };
    } else if (width < 1280) {
      return {
        titleSize: "text-8xl",
        padding: "p-12 md:p-20",
        maxWidth: "max-w-xl",
        lineWidth: "w-48",
        paragraphSize: "text-base md:text-lg",
        spacing: "mt-3 mb-8",
        gap: "gap-2",
      };
    }

    return {
      titleSize: "text-8xl lg:text-9xl",
      padding: "p-14 md:p-24",
      maxWidth: "max-w-2xl",
      lineWidth: "w-56",
      paragraphSize: "text-lg lg:text-lg",
      spacing: "mt-3 mb-8",
      gap: "gap-3",
    };
  };

  const responsive = getResponsiveValues();
  const isSmallPhone = width < 380;
  const isMobile = width < 640;
  const showPattern = width >= 1024;

  const backgroundStyle = {
    backgroundImage: "url('/VisionBg.webp')",
    backgroundPosition: isMobile ? "70% center" : "center",
    backgroundSize: "cover",
  };

  const gradientClass = isMobile
    ? "bg-gradient-to-tl from-black/95 via-black/60 to-transparent"
    : "bg-gradient-to-tl from-black/95 via-black/40 to-transparent";

  return (
    <motion.section
      ref={ref}
      className="relative top-0 w-full h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={backgroundStyle}
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
            className={`absolute inset-0 z-10 ${gradientClass}`}
          />
        )}
      </AnimatePresence>

      {/* 2. Content Container - Responsive positioning */}
      <div
        className={`absolute inset-0 z-20 flex flex-col justify-end items-end ${responsive.padding} text-right pointer-events-none`}
      >
        <div className={`flex flex-col items-end ${responsive.maxWidth} w-full`}>
          {/* Title Reveal - Mission style font (normal weight) */}
          <div className="overflow-hidden">
            {isVisible && (
              <div className={`flex flex-wrap justify-end ${responsive.gap}`}>
                {title.split("").map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={
                      isAnimatingOut
                        ? { y: "100%", opacity: 0 }
                        : { y: "0%", opacity: 1 }
                    }
                    transition={{
                      duration: 0.6,
                      ease: [0.33, 1, 0.68, 1],
                      delay: isAnimatingOut
                        ? (title.length - 1 - index) * 0.05
                        : index * 0.05,
                    }}
                    className={`inline-block text-white font-normal ${responsive.titleSize} leading-none uppercase`}
                    style={{
                      letterSpacing: isSmallPhone ? "0em" : "-0.05em",
                      fontFamily: "var(--font-montserrat), sans-serif",
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
            animate={isAnimatingOut ? { width: 0 } : { width: "80px" }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="h-[4px] bg-[#F79520] mt-2 mb-6 mr-[0%]"
          />

          {/* Paragraph Reveal */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={
              isVisible && !isAnimatingOut
                ? { x: 0, opacity: 1 }
                : { x: 20, opacity: 0 }
            }
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
        style={{ backgroundColor: `rgba(0,0,0,${isMobile ? 0.3 : 0.2})` }}
      />

      {/* Optional pattern overlay */}
      {showPattern && (
        <div
          className="absolute inset-0 z-[1] opacity-10 pointer-events-none"
          style={{
            backgroundImage: "url('/subtle-pattern.png')",
            backgroundRepeat: "repeat",
          }}
        />
      )}
    </motion.section>
  );
}
