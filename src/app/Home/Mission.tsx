'use client';

import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
  type MotionValue,
} from 'framer-motion';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { useLanguage } from '../context/LanguageContext';
import { translations } from '../lib/translations';

interface MissionProps {
  preloaderCompleted: boolean;
}

interface MissionImageProps {
  src: string;
  alt?: string;
  className: string;
  scrollProgress: MotionValue<number>;
  x: string;
  y: string;
  priority?: boolean;
}

function MissionImage({
  src,
  alt = '',
  className,
  scrollProgress,
  x,
  y,
  priority = false,
}: MissionImageProps) {
  const moveX = useTransform(
    scrollProgress,
    [0.1, 0.8],
    ['0%', x]
  );

  const moveY = useTransform(
    scrollProgress,
    [0.1, 0.8],
    ['0%', y]
  );

  const opacity = useTransform(
    scrollProgress,
    [0.4, 0.8],
    [1, 0]
  );

  return (
    <motion.div
      style={{
        x: moveX,
        y: moveY,
        opacity,
      }}
      className={className}
    >
      <Image
        src={src}
        fill
        className="object-cover"
        alt={alt}
        priority={priority}
      />
    </motion.div>
  );
}

export default function Mission({
  preloaderCompleted,
}: MissionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [finalScale, setFinalScale] = useState(4);
  const [showMissionText, setShowMissionText] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    function updateScale() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isMobile = vw < 768;

      let iw: number;
      let ih: number;

      if (isMobile) {
        iw = (vw * 0.92 - 16) / 3;
        ih = (vh * 0.75 - 16) / 3;
      } else {
        iw = vw * 0.25;
        ih = vh * 0.25;
      }

      const scaleX = vw / iw;
      const scaleY = vh / ih;

      setFinalScale(Math.max(scaleX, scaleY) * 1.05);
    }

    updateScale();

    window.addEventListener('resize', updateScale);

    return () => {
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  useEffect(() => {
    if (!preloaderCompleted) return;

    const timeout = window.setTimeout(() => {
      if (sectionRef.current) {
        setIsReady(true);
      }
    }, 80);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [preloaderCompleted]);

  const { scrollYProgress: zoomScrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(
    zoomScrollYProgress,
    'change',
    (latest) => {
      if (latest > 0.88 && !showMissionText) {
        setShowMissionText(true);
        setIsAnimatingOut(false);
      } else if (latest <= 0.88 && showMissionText) {
        setIsAnimatingOut(true);

        window.setTimeout(() => {
          setShowMissionText(false);
          setIsAnimatingOut(false);
        }, 700);
      }
    }
  );

  const scaleCenter = useTransform(
    zoomScrollYProgress,
    [0.1, 0.9],
    [1, finalScale]
  );

  const missionTitle = t.mission.missionTitle;

  return (
    <div className="bg-black">
      {/* INTRO */}
      <section
        ref={sectionRef}
        className="relative pt-32 pb-16 flex flex-col items-center text-center px-6"
      >
        <h2 className="text-white text-xl md:text-xl uppercase tracking-[0.2em]">
          {t.mission.livingTheGospel}
        </h2>

        <div className="h-[2px] w-[80px] bg-[#F79520] my-4" />

        <p className="text-white/70 max-w-sm text-[15px] md:text-[.8em]">
          {t.mission.commitmentText}
        </p>
      </section>

      {/* PARALLAX ZOOM */}
      <section
        ref={containerRef}
        className="relative h-[400vh] bg-black"
      >
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          {/* GRID CONTAINER */}
          <div className="relative w-[92vw] md:w-[75.8vw] h-[75vh] md:h-[90vh]">
            {/* PHONE LAYOUT */}
            <div className="md:hidden grid grid-cols-3 grid-rows-3 gap-2 w-full h-full">
              <MissionImage
                src="/MissionImg1A.jpg"
                className="col-span-2 relative overflow-hidden"
                scrollProgress={zoomScrollYProgress}
                x="-150%"
                y="-150%"
              />

              <MissionImage
                src="/missionImg3.jpg"
                className="col-span-1 relative overflow-hidden"
                scrollProgress={zoomScrollYProgress}
                x="150%"
                y="-150%"
              />

              <MissionImage
                src="/missionImg4.jpg"
                className="col-span-1 relative overflow-hidden"
                scrollProgress={zoomScrollYProgress}
                x="-200%"
                y="0%"
              />

              <motion.div
                style={{ scale: scaleCenter }}
                className="col-span-1 relative z-20 overflow-hidden"
              >
                <Image
                  src="/center-mission1-phone.jpg"
                  fill
                  className="object-cover"
                  alt="Main Mission"
                  priority
                />
              </motion.div>

              <MissionImage
                src="/missionImg5.jpg"
                className="col-span-1 relative overflow-hidden"
                scrollProgress={zoomScrollYProgress}
                x="200%"
                y="0%"
              />

              <MissionImage
                src="/missionImg6.jpg"
                className="col-span-1 relative overflow-hidden"
                scrollProgress={zoomScrollYProgress}
                x="-150%"
                y="150%"
              />

              <MissionImage
                src="/MissionImg8A.jpg"
                className="col-span-2 relative overflow-hidden"
                scrollProgress={zoomScrollYProgress}
                x="150%"
                y="150%"
              />
            </div>

            {/* DESKTOP LAYOUT */}
            <div className="hidden md:block w-full h-full relative">
              <MissionImage
                src="/MissionImg1A.jpg"
                className="absolute top-0 left-0 w-[25vw] h-[32vh] aspect-square overflow-hidden"
                scrollProgress={zoomScrollYProgress}
                x="-160%"
                y="-160%"
              />

              <MissionImage
                src="/MissionImg1B.jpg"
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[25vw] h-[32vh] aspect-square overflow-hidden"
                scrollProgress={zoomScrollYProgress}
                x="0%"
                y="-200%"
              />

              <MissionImage
                src="/missionImg3.jpg"
                className="absolute top-0 right-0 w-[25vw] h-[32vh] aspect-square overflow-hidden"
                scrollProgress={zoomScrollYProgress}
                x="160%"
                y="-160%"
              />

              <MissionImage
                src="/missionImg4.jpg"
                className="absolute top-1/2 left-0 -translate-y-1/2 w-[25vw] h-[25vh] aspect-square overflow-hidden"
                scrollProgress={zoomScrollYProgress}
                x="-200%"
                y="0%"
              />

              <motion.div
                style={{ scale: scaleCenter }}
                className="absolute top-1/2 left-1/2 w-[25vw] h-[25vh] -translate-x-1/2 -translate-y-1/2 z-20 overflow-hidden"
              >
                <Image
                  src="/center-mission1.jpg"
                  fill
                  className="object-cover"
                  alt="Main Mission"
                  priority
                />
              </motion.div>

              <MissionImage
                src="/missionImg5.jpg"
                className="absolute top-1/2 right-0 -translate-y-1/2 w-[25vw] h-[25vh] aspect-square overflow-hidden"
                scrollProgress={zoomScrollYProgress}
                x="200%"
                y="0%"
              />

              <MissionImage
                src="/missionImg6.jpg"
                className="absolute bottom-0 left-0 w-[25vw] h-[32vh] aspect-square overflow-hidden"
                scrollProgress={zoomScrollYProgress}
                x="-160%"
                y="160%"
              />

              <MissionImage
                src="/MissionImg8B.jpg"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[25vw] h-[32vh] aspect-square overflow-hidden"
                scrollProgress={zoomScrollYProgress}
                x="0%"
                y="200%"
              />

              <MissionImage
                src="/MissionImg8A.jpg"
                className="absolute bottom-0 right-0 w-[25vw] h-[32vh] aspect-square overflow-hidden"
                scrollProgress={zoomScrollYProgress}
                x="160%"
                y="160%"
              />
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
                        key={`${char}-${index}`}
                        initial={{ y: '100%', opacity: 0 }}
                        animate={
                          isAnimatingOut
                            ? { y: '100%', opacity: 0 }
                            : { y: '0%', opacity: 1 }
                        }
                        transition={{
                          duration: 0.6,
                          delay: index * 0.05,
                        }}
                        className="text-white font-normal text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </div>

                  <motion.div
                    initial={{ width: 0 }}
                    animate={
                      isAnimatingOut
                        ? { width: 0 }
                        : { width: '80px' }
                    }
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="h-[4px] bg-[#F79520] mt-2 mb-6 ml-[1%]"
                  />

                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={
                      isAnimatingOut
                        ? { opacity: 0, x: -20 }
                        : { opacity: 1, x: 0 }
                    }
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
