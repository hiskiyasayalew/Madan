'use client';

import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  MotionValue,
} from 'framer-motion';

import { useEffect, useRef, useState } from 'react';  
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext'; // Adjust path as needed
import { translations } from '../lib/translations'; // Adjust path as needed

interface CommunityProps {
  preloaderCompleted: boolean;
}

export default function Community({ preloaderCompleted }: CommunityProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLargeDesktop, setIsLargeDesktop] = useState(false);
  
  // Add language hook
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    if (!preloaderCompleted) return;
    const t = setTimeout(() => {
      if (sectionRef.current) setIsReady(true);
    }, 80);
    return () => clearTimeout(t);
  }, [preloaderCompleted]);

  // Check if device is large desktop (1400px or larger)
  useEffect(() => {
    const checkDevice = () => {
      setIsLargeDesktop(window.innerWidth >= 1400);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // 1. Sync Background & Cutout Parallax
  const yParallax: MotionValue<string> = useTransform(
    scrollYProgress,
    [0, 1],
    ['-15%', '15%']
  );

  // 2. SMOOTHER TEXT REVEAL LOGIC
  const line1Y = useTransform(scrollYProgress, [0.1, 0.5], ['180px', '0px']);
  const line2Y = useTransform(scrollYProgress, [0.15, 0.55], ['180px', '0px']);
  const line3Y = useTransform(scrollYProgress, [0.2, 0.6], ['180px', '0px']);

  const textOpacity = useTransform(scrollYProgress, [0.08, 0.45], [0, 1]);

  const textBlur = useTransform(
    scrollYProgress,
    [0.08, 0.22, 0.45],
    [18, 8, 0]
  );

  const blurFilter = useMotionTemplate`blur(${textBlur}px)`;

  // Use translated text
  const communityHeadings = [
    { text: t.community.loving, y: line1Y, align: 'justify-center' },
    { text: t.community.one, y: line2Y, align: 'justify-start' },
    { text: t.community.another, y: line3Y, align: 'justify-end' },
  ];

  // Get font size based on device - LARGER for non-desktop
  const getFontSize = (text: string) => {
    if (isLargeDesktop) {
      return 'clamp(5.5rem, 18vw, 20rem)'; // Desktop size - perfect, untouched
    }
    // Mobile/Tablet - much larger now
    return text === t.community.another 
      ? 'clamp(4rem, 15vw, 7rem)' 
      : 'clamp(5rem, 18vw, 8rem)';
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center h-[130vh] 2xl:h-[150vh] w-full overflow-hidden px-4 sm:px-6 md:px-12 lg:px-24"
    >
      {/* 1. BACKGROUND LAYER (Z-0) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {isReady ? (
          <motion.div style={{ y: yParallax }} className="relative w-full h-full">
            <Image
              src="/Community2.jpg"
              alt="Community Background"
              fill
              style={{ objectFit: 'cover' }}
              className="brightness-[0.6]"
              priority
            />
          </motion.div>
        ) : (
          <div className="relative w-full h-full bg-neutral-900" />
        )}
      </div>

      {/* 2. TEXT CONTENT */}
      <div className="relative w-full max-w-[2000px] flex flex-col">
        {communityHeadings.map((item, i) => (
          <motion.div
            key={i}
            style={{
              opacity: textOpacity,
              filter: blurFilter,
              y: item.y 
            }}
                      className={`
            relative overflow-hidden w-full
            ${item.text === t.community.another 
              ? 'px-1 sm:px-2 md:px-4 lg:px-10' // Reduced padding: px-1 on mobile, gradually increasing
              : 'px-2 sm:px-4' // Normal padding for first two words
            }
            /* Responsive heights - increased for larger fonts */
            h-[100px]       /* mobile - increased */
            sm:h-[120px]    /* small tablets - increased */
            md:h-[150px]    /* large tablets - increased */
            lg:h-[120px]    /* small desktop - unchanged */
            xl:h-[250px]    /* medium desktop - unchanged */
            2xl:h-[320px]   /* large desktop - original restored */
            ${item.text === t.community.another 
              ? 'z-[60] mt-0 sm:mt-1 md:mt-2 lg:mt-4 xl:mt-10 2xl:mt-20' 
              : 'z-0'
            }
          `}
          >
            <div className={`flex w-full ${item.align} items-center`}>
              {item.text.split('').map((char, index) => (
                <span 
                key={index} 
                className={`
                  inline-block font-normal uppercase
                  ${item.text === t.community.another 
                    ? 'tracking-[0.03em]'
                    : 'tracking-tighter'
                  }
                  bg-clip-text text-transparent
                  leading-[0.85] sm:leading-[0.8] md:leading-[0.75] 
                  lg:leading-[0.7] xl:leading-[0.75] 2xl:leading-[0.8]
                  bg-gradient-to-b from-white via-[#F79520]/25 to-transparent
                `}
                style={{ fontSize: getFontSize(item.text) }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. CUTOUT IMAGE - ONLY ON LARGE DESKTOP (1400px AND ABOVE) */}
      {/* Completely hidden on all devices below 1400px including regular desktops, laptops, tablets, iPads, and phones */}
      {isLargeDesktop && (
        <motion.div 
          style={{ y: yParallax }} 
          className="
            absolute bottom-0 left-1/2 -translate-x-1/2 
            z-10                          
            pointer-events-none           
            hidden 2xl:block
            w-[450vw] 2xl:w-[110vw]
          "
        >
          <div className="relative h-[100vh] 2xl:h-[150vh] w-full">
            <Image
              src="/Comminity2-cutout.png" 
              alt="Cutout Decoration"
              fill
              className="object-cover 2xl:object-contain object-bottom"
              priority
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/55 to-transparent" />
          </div>
        </motion.div>
      )}
    </section>
  );
}