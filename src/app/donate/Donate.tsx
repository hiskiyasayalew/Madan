import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../lib/translations';

const Donate = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const imageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Hook to track scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth Opacity Transitions
  const opacity1 = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.6, 1], [0, 1]);

  // Scale transforms for subtle zoom effects
  const scale1 = useTransform(scrollYProgress, [0, 0.4], [1, 0.95]);
  const scale2 = useTransform(scrollYProgress, [0.6, 1], [0.95, 1]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (imageRef.current) {
      imageRef.current.style.opacity = "0";
      imageRef.current.style.transform = "scale(1.05)";
      imageRef.current.style.animation = "imageReveal 1.4s ease forwards 0.2s";
    }

    return () => lenis.destroy();
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative z-20 w-full h-screen overflow-hidden bg-black">
        <div ref={imageRef} className="absolute inset-0 z-0">
          <img
            src="/DonatePageBg.jpg"
            alt="Donate Background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute inset-0 z-10 bg-gradient-to-l from-black via-black/90 to-transparent" />

        <div className="relative z-20 flex flex-col justify-center items-end h-full mt-[5%] px-6 sm:px-10 md:px-16 lg:px-20 text-right">
          <motion.h4
            initial={{ y: "120%", rotate: 5 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.33, 1, 0.68, 1] }}
            className="text-white/80 uppercase tracking-[0.35em] text-xs sm:text-sm md:text-base font-semibold"
          >
            {t.Donate?.heroSubtitle || "Support Our Mission"}
          </motion.h4>

          <motion.h1
            initial={{ y: "120%", rotate: 5 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: [0.33, 1, 0.68, 1] }}
            className="text-white text-[2.5rem] sm:text-[4rem] md:text-[6rem] lg:text-[7rem] xl:text-[8rem] font-bold leading-[0.9]"
          >
            {language === 'am' ? t.Donate?.heroTitle1 || "የ እግዚአብሔርን ቤት" : "BLESS THE"}
          </motion.h1>

          <motion.h1
            initial={{ y: "120%", rotate: 5 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: [0.33, 1, 0.68, 1] }}
            className="text-white text-[2.5rem] sm:text-[4rem] md:text-[6rem] lg:text-[7rem] xl:text-[8rem] font-bold leading-[0.9]"
          ><div className="text-[#F79520]">
            {language === 'am' ? (
              t.Donate?.heroTitle2 ||  "ይባርኩ"
            ) : (
              <>
                HOUSE OF <span className="text-[#F79520]">GOD</span>
              </>
            )}
            </div>
          </motion.h1>
        </div>

        <style>{`
          @keyframes imageReveal {
            0% { opacity: 0; transform: scale(1.05); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </section>

      {/* SCROLL CONTAINER */}
      <section ref={containerRef} className="relative h-[200vh] bg-transparent z-10">
        <div className="sticky top-0 h-screen w-full bg-gradient-to-b from-[#EAEAEA] to-[#D4D4D4] flex items-center justify-center overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#F79520] blur-3xl" />
            <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-[#F79520] blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#F79520] blur-3xl" />
          </div>

          {/* Container for the overlapping text blocks */}
          <div className="max-w-5xl w-full text-center px-4 sm:px-6 md:px-8 relative h-[400px] flex items-center justify-center">
            
            {/* FIRST CONTENT BLOCK */}
            <motion.div 
              style={{ opacity: opacity1, scale: scale1 }} 
              className="fixed inset-0 flex flex-col items-center justify-center w-full px-4 sm:px-6 md:px-8"
            >
              <div className="relative">
                <motion.h2 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="text-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 relative inline-block"
                >
                  {t.Donate?.howDonationHelps || "HOW YOUR DONATION HELPS"}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[30%] h-1 bg-[#F79520]" />
                </motion.h2>
              </div>
              
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-black/80 text-sm sm:text-base md:text-lg w-full max-w-[90%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[65%] mt-[2%] sm:mt-[1.5%] md:mt-[1%] leading-relaxed"
              >
                {t.Donate?.howDonationHelpsDesc || "Your donation helps us continue our mission of serving the community, supporting those and creating a welcoming place of worship for all. Through your generosity, we are able to fund outreach programs, maintain our church, and provide spiritual guidance."}
              </motion.p>

              {/* Decorative icon */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-6 sm:mt-7 md:mt-8 text-[#F79520]"
              />
            </motion.div>

            {/* SECOND CONTENT BLOCK */}
            <motion.div 
              style={{ opacity: opacity2, scale: scale2 }} 
              className="absolute inset-0 flex flex-col items-center justify-center w-full px-4 sm:px-6 md:px-8"
            >
              <div className="relative">
                <motion.h2 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="text-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 relative inline-block"
                >
                  {t.Donate?.howDonationsUsed || "HOW ARE DONATIONS USED"}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[30%] h-1 bg-[#F79520]" />
                </motion.h2>
              </div>
              
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-black/80 text-sm sm:text-base md:text-lg w-full max-w-[90%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[65%] mt-[2%] sm:mt-[1.5%] md:mt-[1%] leading-relaxed"
              >
                {t.Donate?.howDonationsUsedDesc || "Your donations are used to support the daily life and mission of the church. They help maintain our place of worship, fund community outreach programs, assist those in need, and provide resources for spiritual growth, events, and ministry activities. Through your generosity, we are able to serve, uplift, and make a meaningful impact in the lives of others."}
              </motion.p>

              {/* Decorative icon */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-6 sm:mt-7 md:mt-8 text-[#F79520]"
              />
            </motion.div>

            {/* Progress indicator */}
            <motion.div 
              className="absolute bottom-8 sm:bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3"
              style={{ opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [1, 1, 0, 0]) }}
            >
              <span className="text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] font-mono uppercase text-black/30">
                {t.Donate?.scrollToContinue || "Scroll to continue"}
              </span>
              <motion.div 
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 border-2 border-black/30 rounded-full flex items-center justify-center"
              >
                <div className="w-0.5 h-1 sm:h-1.5 bg-black/30 rounded-full" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Donate;