
"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";

const Donate = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const shouldReduceMotion = useReducedMotion() ?? false;

  const containerRef = useRef<HTMLElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Track scroll progress through the donation information section.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Scroll-based opacity transitions.
  const opacity1 = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.6, 1], [0, 1]);

  // Subtle scale transitions.
  const scale1 = useTransform(scrollYProgress, [0, 0.4], [1, 0.95]);
  const scale2 = useTransform(scrollYProgress, [0.6, 1], [0.95, 1]);

  // Scroll indicator fades away as the user progresses.
  const progressOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [1, 1, 0, 0]
  );

  // Initialize and clean up Lenis smooth scrolling.
  useEffect(() => {
    if (shouldReduceMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (time: number) =>
        Math.min(1, 1.001 - Math.pow(2, -10 * time)),
    });

    const raf = (time: number) => {
      lenis.raf(time);
      animationFrameRef.current = requestAnimationFrame(raf);
    };

    animationFrameRef.current = requestAnimationFrame(raf);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      lenis.destroy();
    };
  }, [shouldReduceMotion]);

  const heroSubtitle =
    t.Donate?.heroSubtitle || "Support Our Mission";

  const heroTitle1 =
    language === "am"
      ? t.Donate?.heroTitle1 || "የ እግዚአብሔርን ቤት"
      : "BLESS THE";

  const heroTitle2 =
    language === "am"
      ? t.Donate?.heroTitle2 || "ይባርኩ"
      : "HOUSE OF GOD";

  const howDonationHelps =
    t.Donate?.howDonationHelps || "HOW YOUR DONATION HELPS";

  const howDonationHelpsDesc =
    t.Donate?.howDonationHelpsDesc ||
    "Your donation helps us continue our mission of serving the community, supporting those and creating a welcoming place of worship for all. Through your generosity, we are able to fund outreach programs, maintain our church, and provide spiritual guidance.";

  const howDonationsUsed =
    t.Donate?.howDonationsUsed || "HOW ARE DONATIONS USED";

  const howDonationsUsedDesc =
    t.Donate?.howDonationsUsedDesc ||
    "Your donations are used to support the daily life and mission of the church. They help maintain our place of worship, fund community outreach programs, assist those in need, and provide resources for spiritual growth, events, and ministry activities. Through your generosity, we are able to serve, uplift, and make a meaningful impact in the lives of others.";

  const scrollToContinue =
    t.Donate?.scrollToContinue || "Scroll to continue";

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative z-20 h-screen w-full overflow-hidden bg-black">
        {/* Background image */}
        <div className="donate-image-reveal absolute inset-0 z-0">
          <img
            src="/DonatePageBg.webp"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            draggable={false}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Background overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-l from-black via-black/90 to-transparent" />

        {/* Hero content */}
        <div className="relative z-20 mt-[5%] flex h-full flex-col items-end justify-center px-6 text-right sm:px-10 md:px-16 lg:px-20">
          <motion.h4
            initial={shouldReduceMotion ? false : { y: "120%", rotate: 5 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.8,
              delay: shouldReduceMotion ? 0 : 0.5,
              ease: [0.33, 1, 0.68, 1],
            }}
            className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80 sm:text-sm md:text-base"
          >
            {heroSubtitle}
          </motion.h4>

          <motion.h1
            initial={shouldReduceMotion ? false : { y: "120%", rotate: 5 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.9,
              delay: shouldReduceMotion ? 0 : 0.6,
              ease: [0.33, 1, 0.68, 1],
            }}
            className="text-[2.5rem] font-bold leading-[0.9] text-white sm:text-[4rem] md:text-[6rem] lg:text-[7rem] xl:text-[8rem]"
          >
            {heroTitle1}
            <span className="block text-[#F79520]">
              {language === "am" ? heroTitle2 : (
                <>
                  HOUSE OF <span>GOD</span>
                </>
              )}
            </span>
          </motion.h1>
        </div>
      </section>

      {/* SCROLL CONTAINER */}
      <section
        ref={containerRef}
        className="relative z-10 h-[200vh] bg-transparent"
      >
        {/* Sticky content area */}
        <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#EAEAEA] to-[#D4D4D4]">
          {/* Decorative background elements */}
          <div
            className="pointer-events-none absolute inset-0 opacity-5"
            aria-hidden="true"
          >
            <div className="absolute left-10 top-20 h-64 w-64 rounded-full bg-[#F79520] blur-3xl" />
            <div className="absolute bottom-20 right-10 h-80 w-80 rounded-full bg-[#F79520] blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F79520] blur-3xl" />
          </div>

          {/* Overlapping content blocks */}
          <div className="relative flex h-[400px] w-full max-w-5xl items-center justify-center px-4 text-center sm:px-6 md:px-8">
            {/* FIRST CONTENT BLOCK */}
            <motion.div
              style={{
                opacity: shouldReduceMotion ? 1 : opacity1,
                scale: shouldReduceMotion ? 1 : scale1,
              }}
              className="absolute inset-0 flex w-full flex-col items-center justify-center px-4 sm:px-6 md:px-8"
            >
              <div className="relative">
                <motion.h2
                  initial={shouldReduceMotion ? false : { y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.6,
                  }}
                  className="relative mb-6 inline-block text-2xl font-bold text-black sm:text-3xl md:text-4xl lg:text-5xl"
                >
                  {howDonationHelps}

                  <div className="absolute -bottom-3 left-1/2 h-1 w-[30%] -translate-x-1/2 bg-[#F79520]" />
                </motion.h2>
              </div>

              <motion.p
                initial={shouldReduceMotion ? false : { y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.6,
                  delay: shouldReduceMotion ? 0 : 0.2,
                }}
                className="mt-[2%] w-full max-w-[90%] text-sm leading-relaxed text-black/80 sm:mt-[1.5%] sm:max-w-[85%] sm:text-base md:mt-[1%] md:max-w-[75%] md:text-lg lg:max-w-[65%]"
              >
                {howDonationHelpsDesc}
              </motion.p>
            </motion.div>

            {/* SECOND CONTENT BLOCK */}
            <motion.div
              style={{
                opacity: shouldReduceMotion ? 1 : opacity2,
                scale: shouldReduceMotion ? 1 : scale2,
              }}
              className="absolute inset-0 flex w-full flex-col items-center justify-center px-4 sm:px-6 md:px-8"
            >
              <div className="relative">
                <motion.h2
                  initial={shouldReduceMotion ? false : { y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.6,
                  }}
                  className="relative mb-6 inline-block text-2xl font-bold text-black sm:text-3xl md:text-4xl lg:text-5xl"
                >
                  {howDonationsUsed}

                  <div className="absolute -bottom-3 left-1/2 h-1 w-[30%] -translate-x-1/2 bg-[#F79520]" />
                </motion.h2>
              </div>

              <motion.p
                initial={shouldReduceMotion ? false : { y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.6,
                  delay: shouldReduceMotion ? 0 : 0.2,
                }}
                className="mt-[2%] w-full max-w-[90%] text-sm leading-relaxed text-black/80 sm:mt-[1.5%] sm:max-w-[85%] sm:text-base md:mt-[1%] md:max-w-[75%] md:text-lg lg:max-w-[65%]"
              >
                {howDonationsUsedDesc}
              </motion.p>
            </motion.div>

            {/* PROGRESS INDICATOR */}
            <motion.div
              className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-3 sm:bottom-10 md:bottom-12"
              style={{
                opacity: shouldReduceMotion ? 0 : progressOpacity,
              }}
              aria-hidden="true"
            >
              <span className="whitespace-nowrap text-[8px] font-mono uppercase tracking-[0.2em] text-black/30 sm:text-[9px] sm:tracking-[0.25em] md:text-[10px] md:tracking-[0.3em]">
                {scrollToContinue}
              </span>

              <motion.div
                animate={
                  shouldReduceMotion
                    ? undefined
                    : { y: [0, 6, 0] }
                }
                transition={{
                  repeat: shouldReduceMotion ? 0 : Infinity,
                  duration: 1.5,
                }}
                className="flex h-3 w-3 items-center justify-center rounded-full border-2 border-black/30 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4"
              >
                <div className="h-1 w-0.5 rounded-full bg-black/30 sm:h-1.5" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* IMAGE REVEAL ANIMATION */}
      <style jsx>{`
        .donate-image-reveal {
          opacity: 0;
          transform: scale(1.05);
          animation: donateImageReveal 1.4s ease forwards 0.2s;
        }

        @keyframes donateImageReveal {
          0% {
            opacity: 0;
            transform: scale(1.05);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .donate-image-reveal {
            opacity: 1;
            transform: none;
            animation: none;
          }
        }
      `}</style>
    </>
  );
};

export default Donate;
