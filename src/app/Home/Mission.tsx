'use client';

import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext'; // Adjust path as needed
import { translations } from '../lib/translations'; // Adjust path as needed

interface MissionProps {
  preloaderCompleted: boolean;
}

export default function Mission({ preloaderCompleted }: MissionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isReady, setIsReady] = useState(false);
  const [finalScale, setFinalScale] = useState(4);
  const [showMissionText, setShowMissionText] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  
  // Add language hook
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    function updateScale() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      
      // Determine if we are on a phone-sized screen
      const isMobile = vw < 768;

      let iw: number;
      let ih: number;

      if (isMobile) {
        // On mobile:
        // The grid container is 92vw wide and 75vh tall.
        // It has a grid-cols-3 and grid-rows-3 layout with gap-2 (8px gap).
        // There are 2 gaps (16px total) subtracted from the grid dimensions.
        iw = (vw * 0.92 - 16) / 3;
        ih = (vh * 0.75 - 16) / 3;
      } else {
        // On desktop:
        // The center image has a fixed width of 25vw and height of 25vh.
        iw = vw * 0.25;
        ih = vh * 0.25;
      }

      const scaleX = vw / iw;
      const scaleY = vh / ih;
      
      // We take the max of scaleX and scaleY so that the image fills the screen,
      // and multiply by a small buffer (1.05) to eliminate any subpixel gaps.
      setFinalScale(Math.max(scaleX, scaleY) * 1.05);
    }
    
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    if (!preloaderCompleted) return;
    const t = setTimeout(() => {
      if (sectionRef.current) setIsReady(true);
    }, 80);
    return () => clearTimeout(t);
  }, [preloaderCompleted]);

  const { scrollYProgress: zoomScrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(zoomScrollYProgress, 'change', (latest) => {
    if (latest > 0.88 && !showMissionText) {
      setShowMissionText(true);
      setIsAnimatingOut(false);
    } else if (latest <= 0.88 && showMissionText) {
      setIsAnimatingOut(true);
      setTimeout(() => {
        setShowMissionText(false);
        setIsAnimatingOut(false);
      }, 700);
    }
  });

  const scaleCenter = useTransform(zoomScrollYProgress, [0.1, 0.9], [1, finalScale]);

  const moveFar = (x: string, y: string) => ({
    x: useTransform(zoomScrollYProgress, [0.1, 0.8], ['0%', x]),
    y: useTransform(zoomScrollYProgress, [0.1, 0.8], ['0%', y]),
    opacity: useTransform(zoomScrollYProgress, [0.4, 0.8], [1, 0]),
  });

  const missionTitle = t.mission.missionTitle;

  return (
    <div className="bg-black">
      {/* INTRO */}
      <section ref={sectionRef as any} className="relative pt-32 pb-16 flex flex-col items-center text-center px-6">
        <h2 className="text-white text-xl md:text-xl uppercase tracking-[0.2em]">
          {t.mission.livingTheGospel}
        </h2>
        <div className="h-[2px] w-[80px] bg-[#F79520] my-4" />
        <p className="text-white/70 max-w-sm text-[15px] md:text-[.8em] ">
          {t.mission.commitmentText}
        </p>
      </section>

      {/* PARALLAX ZOOM */}
      <section ref={containerRef} className="relative h-[400vh] bg-black">
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          
          {/* GRID CONTAINER - h-[75vh] on mobile for better vertical presence */}
          <div className="relative w-[92vw] md:w-[75.8vw] h-[75vh] md:h-[90vh]">
            
            {/* --- PHONE LAYOUT --- */}
            {/* Using col-span-2 to make the corner images occupy double space (2 out of 3 columns) */}
            <div className="md:hidden grid grid-cols-3 grid-rows-3 gap-2 w-full h-full">
               
               {/* ROW 1: Top-Left (2 units wide) and Top-Right (1 unit wide) */}
               <motion.div style={moveFar('-150%', '-150%')} className="col-span-2 relative overflow-hidden">
                 <Image src="/MissionImg1A.jpg" fill className="object-cover" alt="" />
               </motion.div>
               <motion.div style={moveFar('150%', '-150%')} className="col-span-1 relative overflow-hidden">
                 <Image src="/missionImg3.jpg" fill className="object-cover" alt="" />
               </motion.div>

               {/* ROW 2: Middle-Left, Center (Target), Middle-Right (All 1 unit wide) */}
               <motion.div style={moveFar('-200%', '0%')} className="col-span-1 relative overflow-hidden">
                 <Image src="/missionImg4.jpg" fill className="object-cover" alt="" />
               </motion.div>
               
               {/* Center Image that zooms in */}
               <motion.div style={{ scale: scaleCenter }} className="col-span-1 relative z-20 overflow-hidden">
                 <Image src="/center-mission1-phone.jpg" fill className="object-cover" alt="Main Mission" priority />
               </motion.div>

               <motion.div style={moveFar('200%', '0%')} className="col-span-1 relative overflow-hidden">
                 <Image src="/missionImg5.jpg" fill className="object-cover" alt="" />
               </motion.div>

               {/* ROW 3: Bottom-Left (1 unit wide) and Bottom-Right (2 units wide) */}
               <motion.div style={moveFar('-150%', '150%')} className="col-span-1 relative overflow-hidden">
                 <Image src="/missionImg6.jpg" fill className="object-cover" alt="" />
               </motion.div>
               <motion.div style={moveFar('150%', '150%')} className="col-span-2 relative overflow-hidden">
                 <Image src="/MissionImg8A.jpg" fill className="object-cover" alt="" />
               </motion.div>
            </div>

            {/* --- DESKTOP LAYOUT (Stays original 3x3) --- */}
            <div className="hidden md:block w-full h-full relative">
              <motion.div style={moveFar('-160%', '-160%')} className="absolute top-0 left-0 w-[25vw] h-[32vh] aspect-square overflow-hidden">
                <Image src="/MissionImg1A.jpg" fill className="object-cover" alt="" />
              </motion.div>

              <motion.div style={moveFar('0%', '-200%')} className="absolute top-0 left-1/2 -translate-x-1/2 w-[25vw] h-[32vh] aspect-square overflow-hidden">
                <Image src="/MissionImg1B.jpg" fill className="object-cover" alt="" />
              </motion.div>

              <motion.div style={moveFar('160%', '-160%')} className="absolute top-0 right-0 w-[25vw] h-[32vh] aspect-square overflow-hidden">
                <Image src="/missionImg3.jpg" fill className="object-cover" alt="" />
              </motion.div>

              <motion.div style={moveFar('-200%', '0%')} className="absolute top-1/2 left-0 -translate-y-1/2 w-[25vw] h-[25vh] aspect-square overflow-hidden">
                <Image src="/missionImg4.jpg" fill className="object-cover" alt="" />
              </motion.div>

              <motion.div style={{ scale: scaleCenter }} className="absolute top-1/2 left-1/2 w-[25vw] h-[25vh] -translate-x-1/2 -translate-y-1/2 z-20 overflow-hidden">
                <Image src="/center-mission1.jpg" fill className="object-cover" alt="Main Mission" priority />
              </motion.div>

              <motion.div style={moveFar('200%', '0%')} className="absolute top-1/2 right-0 -translate-y-1/2 w-[25vw] h-[25vh] aspect-square overflow-hidden">
                <Image src="/missionImg5.jpg" fill className="object-cover" alt="" />
              </motion.div>

              <motion.div style={moveFar('-160%', '160%')} className="absolute bottom-0 left-0 w-[25vw] h-[32vh] aspect-square overflow-hidden">
                <Image src="/missionImg6.jpg" fill className="object-cover" alt="" />
              </motion.div>

              <motion.div style={moveFar('0%', '200%')} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[25vw] h-[32vh] aspect-square overflow-hidden">
                <Image src="/MissionImg8B.jpg" fill className="object-cover" alt="" />
              </motion.div>

              <motion.div style={moveFar('160%', '160%')} className="absolute bottom-0 right-0 w-[25vw] h-[32vh] aspect-square overflow-hidden">
                <Image src="/MissionImg8A.jpg" fill className="object-cover" alt="" />
              </motion.div>
            </div>
          </div>

          {/* MISSION CONTENT OVERLAY */}
          <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-end items-start p-4 sm:p-6 md:p-10 lg:p-20">
            <AnimatePresence>
              {showMissionText && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-tr from-black/95 via-black/20 to-transparent"
                />
              )}
            </AnimatePresence>

            <div className="relative z-40 flex flex-col items-start text-left max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl">
              {showMissionText && (
                <>
                  <div className="flex overflow-hidden">
                    {missionTitle.split('').map((char, index) => (
                      <motion.span
                        key={index}
                        initial={{ y: '100%', opacity: 0 }}
                        animate={isAnimatingOut ? { y: '100%', opacity: 0 } : { y: '0%', opacity: 1 }}
                        transition={{ duration: 0.6, delay: index * 0.05 }}
                        className="text-white font-normal text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl" 
                      >
                        {char}
                      </motion.span>
                    ))}
                  </div>
                  
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={isAnimatingOut ? { width: 0 } : { width: '80px' }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="h-[4px] bg-[#F79520] mt-2 mb-6 ml-[1%]" 
                  />

                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={isAnimatingOut ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="text-white/80 font-light text-xs xs:text-sm sm:text-base md:text-lg leading-relaxed max-w-full"
                  >
                    {t.mission.missionDescription}
                  </motion.p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}