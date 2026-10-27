import React, { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";

const BACKGROUND_IMAGE = "/HomePageServiceIntroBg1.jpg";
const PAPER_BG_IMAGE = "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=1974&auto=format&fit=crop"; 
const LEGACY_IMAGE = "/About-SectionImg1.png ";
const CRAFT_IMAGE = "/AboutHeroImg2.png";
const VISION_IMAGE = "/About-Vertical.jpg";
const FUTURE_IMAGE = "/AboutRootImg.jpg";


const AboutHeroSection = () => {
  const fadeLayerRef = useRef<HTMLDivElement>(null); 
  const bg1Ref = useRef<HTMLDivElement>(null);
  const horizontalWrapperRef = useRef<HTMLDivElement>(null); 
  const foundationContentRef = useRef<HTMLDivElement>(null); 
  const seedRef = useRef<HTMLDivElement>(null);
  const seedRootsRef = useRef<HTMLDivElement>(null); 
  const rootsRef = useRef<HTMLDivElement>(null); 
  const rootsTopRef = useRef<HTMLDivElement>(null); 
  const hasAnimatedRef = useRef(false);
  const hasRootsAnimatedRef = useRef(false); 
  const hasRootsTopAnimatedRef = useRef(false); 
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];
  
  // Sparkles state for the "OUR STORY" cutout
  const [sparkles, setSparkles] = useState<{ id: number; left: string; top: string; size: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate organic ambient sparkles around the cutout region
    const generatedSparkles = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      left: `${6 + Math.random() * 24}%`,
      top: `${35 + Math.random() * 30}%`,
      size: Math.random() * 6 + 2,
      delay: Math.random() * 4,
    }));
    setSparkles(generatedSparkles);

    // Initialize audio
    audioRef.current = new Audio("/Hero.mp3");
    audioRef.current.loop = true;
    audioRef.current.muted = true;
    audioRef.current.play().catch(err => console.log("Audio autoplay failed:", err));
    
    setTimeout(() => setShowButton(true), 500);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.muted = false;
        audioRef.current.play().catch(err => console.log("Audio play failed:", err));
      } else {
        audioRef.current.muted = true;
      }
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    // Cache the window height to avoid layout thrashing on scroll
    let wh = window.innerHeight;

    const handleResize = () => {
      wh = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const lenis = new Lenis({
        lerp: 0.08,
        smoothWheel: true,
        syncTouch: true // Synchronizes touch-momentum with animations on phones/iPads
    });
    
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ({ scroll }: { scroll: number }) => {
      if (!fadeLayerRef.current || !bg1Ref.current || !horizontalWrapperRef.current || !foundationContentRef.current) return;
      
      const heroOpacity = Math.max(0, 1 - scroll / (wh * 0.8));
      fadeLayerRef.current.style.opacity = heroOpacity.toString();

      const startFade = wh * 0.7;
      const endFade = wh * 1.5;
      const progress = Math.min(Math.max((scroll - startFade) / (endFade - startFade), 0), 1);
      
      bg1Ref.current.style.opacity = (1 - progress).toString();
      foundationContentRef.current.style.opacity = progress.toString();

      if (progress > 0.6 && seedRef.current && !hasAnimatedRef.current) {
        hasAnimatedRef.current = true;
        setTimeout(() => {
          if (seedRef.current) {
            seedRef.current.classList.add("animate-seed-fall");
          }
        }, 800);
        
        setTimeout(() => {
          if (seedRootsRef.current) {
            seedRootsRef.current.classList.add("animate-roots-trigger");
          }
        }, 3400);
      }

      const horizontalStart = wh * 2.0; 
      const horizontalEnd = wh * 6.5; 
      
      if (scroll > horizontalStart) {
        const hProgress = Math.min(Math.max((scroll - horizontalStart) / (horizontalEnd - horizontalStart), 0), 1);
        
        // Translating utilizing hardware-accelerated percentages reduces paint layout overhead
        const xPercent = hProgress * -80; 
        horizontalWrapperRef.current.style.transform = `translate3d(${xPercent}%, 0, 0)`;

        if (hProgress > 0.18 && rootsRef.current && !hasRootsAnimatedRef.current) {
            hasRootsAnimatedRef.current = true;
            rootsRef.current.classList.add("animate-roots-trigger");
        }

        if (hProgress > 0.40 && rootsTopRef.current && !hasRootsTopAnimatedRef.current) {
            hasRootsTopAnimatedRef.current = true;
            rootsTopRef.current.classList.add("animate-roots-trigger");
        }
      } else {
        horizontalWrapperRef.current.style.transform = `translate3d(0%, 0, 0)`;
      }
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative w-full h-[700vh] bg-black font-['Montserrat']">
      
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        <div 
          ref={horizontalWrapperRef} 
          className="absolute top-0 left-0 h-full w-[500vw] flex will-change-transform"
        >
          {/* THE FOUNDATION WRAPPER - Dark Theme */}
          <div ref={foundationContentRef} className="relative w-full h-full opacity-0 flex">
            
            {/* Dark Background with Orange Accents */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#0a0500]">
              {/* Ambient Orange Glow */}
              <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] rounded-full bg-[#F79520]/5 blur-[150px] animate-pulse-slow" />
              <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full bg-[#E05E10]/5 blur-[120px] animate-pulse-slow delay-1000" />
              
              {/* Subtle Grid Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#F7952008_1px,transparent_1px),linear-gradient(to_bottom,#F7952008_1px,transparent_1px)] bg-[size:4rem_4rem]" />
              
              {/* Dust Particles */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#F79520_1px,transparent_1px)] bg-[size:24px_24px]" />
            </div>

            {/* CHAPTER 1: THE GENESIS */}
            <section className="relative w-[100vw] flex-shrink-0 h-full flex flex-col items-center justify-center text-center px-6 z-10">
              <div className="flex items-center gap-4 md:gap-14 mb-4 md:mb-6">
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight uppercase bg-gradient-to-r from-white via-[#F79520] to-[#E05E10] bg-clip-text text-transparent font-['Montserrat'] animate-glow-text">
                  {t.aboutHero.foundation}
                </h1>
              </div>

              <p className="max-w-[90%] sm:max-w-[600px] text-[10px] sm:text-[12px] md:text-sm leading-relaxed md:leading-loose font-medium tracking-[0.05em] uppercase text-zinc-300">
                {t.aboutHero.foundationDescription}
              </p>

              <div className="relative w-16 h-16 md:w-24 md:h-24 flex flex-col items-center justify-end mt-8">
                  {/* Enhanced Seed with Glow */}
                  <div 
                    ref={seedRef}
                    className="w-2.5 h-5 md:w-3.5 md:h-6 bg-gradient-to-br from-[#F79520] to-[#E05E10] rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] absolute opacity-0 rotate-[25deg] shadow-[0_0_20px_rgba(247,149,32,0.8)] z-20 animate-pulse-glow" 
                  >
                      <div className="absolute top-0 right-1 w-1 h-2 bg-white/60 rounded-full blur-[0.5px] rotate-[-10deg]" />
                  </div>
                  
                  {/* Enhanced Golden Ribbon */}
                  <svg width="80" height="25" viewBox="0 0 80 25" fill="none" className="md:w-[90px] md:h-[25px] mb-[-2px] relative z-10">
                      <defs>
                          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#F79520" />
                              <stop offset="50%" stopColor="#E05E10" />
                              <stop offset="100%" stopColor="#F79520" />
                          </linearGradient>
                      </defs>
                      <path d="M2 20C10 20 15 8 25 8C35 8 38 18 45 18C52 18 55 10 65 10C75 10 78 20 88 20" stroke="url(#goldGradient)" strokeWidth="5" strokeLinecap="round" className="opacity-100 drop-shadow-[0_0_10px_rgba(247,149,32,0.6)]"/>
                  </svg>
                  
                  {/* Enhanced Roots System with More Branches */}
                  <div ref={seedRootsRef} className="absolute top-[80%] left-1/2 -translate-x-1/2 w-20 h-16 pointer-events-none opacity-0 transition-all duration-1000">
                    <svg width="100%" height="100%" viewBox="0 0 80 60" fill="none">
                      <defs>
                          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                              <feMerge>
                                  <feMergeNode in="coloredBlur"/>
                                  <feMergeNode in="SourceGraphic"/>
                              </feMerge>
                          </filter>
                          <linearGradient id="rootGradSeed" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#F79520" />
                              <stop offset="100%" stopColor="#E05E10" />
                          </linearGradient>
                      </defs>
                      {/* Main taproot */}
                      <path className="root-path" d="M40 0 C40 15 38 25 35 35" stroke="url(#rootGradSeed)" strokeWidth="2.5" filter="url(#glow)" />
                      <path className="root-path" d="M40 0 C40 15 42 25 45 35" stroke="url(#rootGradSeed)" strokeWidth="2" />
                      {/* Primary branches */}
                      <path className="root-path" d="M38 12 C32 18 28 22 24 28" stroke="#F79520" strokeWidth="1.8" />
                      <path className="root-path" d="M42 14 C48 20 52 24 56 30" stroke="#E05E10" strokeWidth="1.8" />
                      <path className="root-path" d="M37 22 C30 28 26 32 22 38" stroke="#F79520" strokeWidth="1.5" />
                      <path className="root-path" d="M43 24 C50 30 54 34 58 40" stroke="#E05E10" strokeWidth="1.5" />
                      {/* Secondary branches */}
                      <path className="root-path" d="M35 8 C28 14 24 18 20 24" stroke="#F79520" strokeWidth="1.2" opacity="0.7" />
                      <path className="root-path" d="M45 10 C52 16 56 20 60 26" stroke="#E05E10" strokeWidth="1.2" opacity="0.7" />
                      <path className="root-path" d="M33 18 C26 24 22 28 18 34" stroke="#F79520" strokeWidth="1" opacity="0.6" />
                      <path className="root-path" d="M47 20 C54 26 58 30 62 36" stroke="#E05E10" strokeWidth="1" opacity="0.6" />
                      {/* Tiny root hairs */}
                      <path className="root-path" d="M24 28 C20 30 18 32 16 34" stroke="#F79520" strokeWidth="0.8" opacity="0.5" />
                      <path className="root-path" d="M56 30 C60 32 62 34 64 36" stroke="#E05E10" strokeWidth="0.8" opacity="0.5" />
                      <path className="root-path" d="M22 38 C18 40 16 42 14 44" stroke="#F79520" strokeWidth="0.8" opacity="0.5" />
                      <path className="root-path" d="M58 40 C62 42 64 44 66 46" stroke="#E05E10" strokeWidth="0.8" opacity="0.5" />
                    </svg>
                  </div>
              </div>
            </section>

            {/* CHAPTER 2: THE LEGACY (MADAN CHOIR) */}
            <section className="relative w-[100vw] flex-shrink-0 h-full flex items-center justify-center px-6 md:px-24 z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-7xl items-center gap-8 md:gap-24 overflow-y-auto md:overflow-visible max-h-full py-10 md:py-0">
                <div className="order-2 md:order-1 text-center md:text-left">
                  <span className="text-[8px] md:text-[10px] tracking-[0.3em] text-[#F79520] uppercase mb-2 md:mb-4 block font-bold animate-fade-in">{t.aboutHero.heritageLabel}</span>
                  <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white font-['Montserrat'] leading-none mb-4 md:mb-8 tracking-tighter">
                    {t.aboutHero.choir}
                  </h2>
                  <p className="text-[11px] md:text-[14px] text-zinc-300 leading-relaxed tracking-wide max-w-md mx-auto md:mx-0 mb-4 md:mb-6">
                    {t.aboutHero.holinessTitle}
                  </p>
                  <p className="hidden sm:block text-[11px] md:text-[14px] text-zinc-400 leading-relaxed tracking-wide max-w-md italic mx-auto md:mx-0 border-l-2 border-[#F79520] pl-4">
                    {t.aboutHero.holinessDescription3}
                  </p>
                </div>
                <div className="order-1 md:order-2 relative overflow-hidden shadow-2xl rounded-sm max-w-[300px] md:max-w-none mx-auto group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  <img
                    src={LEGACY_IMAGE}
                    alt="Legacy"
                    decoding="async"
                    className="w-full h-auto contrast-125 brightness-90 group-hover:brightness-100 group-hover:scale-110 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 border border-[#F79520]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              </div>

              {/* Enhanced Roots at bottom with more branches */}
              <div ref={rootsRef} className="absolute bottom-0 left-0 w-full h-40 md:h-72 pointer-events-none overflow-hidden opacity-0 translate-y-4 transition-all duration-1000">
                <svg width="100%" height="100%" viewBox="0 0 1200 180" preserveAspectRatio="none" fill="none">
                  <defs>
                    <linearGradient id="rootGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#F79520" />
                      <stop offset="100%" stopColor="#E05E10" />
                    </linearGradient>
                    <linearGradient id="rootGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#E05E10" />
                      <stop offset="100%" stopColor="#F79520" />
                    </linearGradient>
                  </defs>
                  {/* Main taproots */}
                  <path className="root-path root-primary" d="M600 180 C600 160 595 140 590 120 C585 100 590 80 595 60" stroke="url(#rootGrad1)" strokeWidth="3" style={{ filter: "drop-shadow(0 0 8px rgba(247,149,32,0.5))" }} />
                  <path className="root-path root-primary" d="M600 180 C605 160 610 140 615 120 C620 100 615 80 610 60" stroke="url(#rootGrad2)" strokeWidth="2.5" style={{ filter: "drop-shadow(0 0 6px rgba(224,94,16,0.4))" }} />
                  
                  {/* Primary branches */}
                  <path className="root-path root-secondary" d="M600 180 C620 165 640 150 655 130 C670 110 660 90 680 70" stroke="#E05E10" strokeWidth="2.5" style={{ filter: "drop-shadow(0 0 5px rgba(224,94,16,0.4))" }} />
                  <path className="root-path root-secondary" d="M600 180 C580 165 550 155 530 135 C510 115 520 95 500 75" stroke="#E05E10" strokeWidth="2.5" style={{ filter: "drop-shadow(0 0 5px rgba(224,94,16,0.4))" }} />
                  <path className="root-path root-secondary" d="M600 180 C610 160 625 145 640 125 C655 105 650 85 660 65" stroke="#F79520" strokeWidth="2" style={{ filter: "drop-shadow(0 0 4px rgba(247,149,32,0.3))" }} />
                  <path className="root-path root-secondary" d="M600 180 C590 160 575 145 560 125 C545 105 550 85 540 65" stroke="#F79520" strokeWidth="2" style={{ filter: "drop-shadow(0 0 4px rgba(247,149,32,0.3))" }} />
                  
                  {/* Secondary branches */}
                  <path className="root-path root-tertiary" d="M640 100 C655 90 670 80 685 75" stroke="#E05E10" strokeWidth="1.5" opacity="0.7" />
                  <path className="root-path root-tertiary" d="M560 100 C545 90 530 80 515 75" stroke="#E05E10" strokeWidth="1.5" opacity="0.7" />
                  <path className="root-path root-tertiary" d="M625 120 C635 110 650 100 665 95" stroke="#F79520" strokeWidth="1.5" opacity="0.6" />
                  <path className="root-path root-tertiary" d="M575 120 C565 110 550 100 535 95" stroke="#F79520" strokeWidth="1.5" opacity="0.6" />
                  <path className="root-path root-tertiary" d="M655 80 C670 75 680 65 690 60" stroke="#E05E10" strokeWidth="1.2" opacity="0.5" />
                  <path className="root-path root-tertiary" d="M545 80 C530 75 520 65 510 60" stroke="#E05E10" strokeWidth="1.2" opacity="0.5" />
                  
                  {/* Tiny root hairs */}
                  <path className="root-path root-quaternary" d="M660 90 C668 85 675 80 680 78" stroke="#F79520" strokeWidth="1" opacity="0.4" />
                  <path className="root-path root-quaternary" d="M540 90 C532 85 525 80 520 78" stroke="#F79520" strokeWidth="1" opacity="0.4" />
                  <path className="root-path root-quaternary" d="M640 110 C648 105 655 100 660 98" stroke="#E05E10" strokeWidth="1" opacity="0.4" />
                  <path className="root-path root-quaternary" d="M560 110 C552 105 545 100 540 98" stroke="#E05E10" strokeWidth="1" opacity="0.4" />
                </svg>
              </div>
            </section>

            {/* CHAPTER 3: THE CRAFT - 32 YEARS OF HARMONY */}
            <section className="relative w-[100vw] flex-shrink-0 h-full flex items-center justify-center px-6 md:px-24 z-10">
              <div ref={rootsTopRef} className="absolute top-0 left-[75%] w-full h-48 md:h-72 pointer-events-none overflow-hidden opacity-0 -translate-y-4 transition-all duration-1000">
                <svg width="100%" height="100%" viewBox="0 0 2200 280" preserveAspectRatio="none" fill="none">
                  <defs>
                    <linearGradient id="rootGradTop" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#F79520" />
                      <stop offset="100%" stopColor="#E05E10" />
                    </linearGradient>
                  </defs>
                  {/* Main descending root */}
                  <path className="root-path root-primary" d="M400 0 C400 40 410 70 420 100 C430 130 425 160 430 190" stroke="url(#rootGradTop)" strokeWidth="3" style={{ filter: "drop-shadow(0 0 10px rgba(247,149,32,0.5))" }} />
                  <path className="root-path root-primary" d="M400 0 C395 40 390 70 380 100 C370 130 375 160 370 190" stroke="#E05E10" strokeWidth="2.5" style={{ filter: "drop-shadow(0 0 6px rgba(224,94,16,0.4))" }} />
                  
                  {/* Primary branches */}
                  <path className="root-path root-branch" d="M410 50 C440 65 460 55 480 80 C500 105 490 120 510 140" stroke="#F79520" strokeWidth="2.5" style={{ filter: "drop-shadow(0 0 5px rgba(247,149,32,0.4))" }} />
                  <path className="root-path root-branch" d="M390 55 C360 70 340 60 320 85 C300 110 310 125 290 145" stroke="#E05E10" strokeWidth="2.5" style={{ filter: "drop-shadow(0 0 5px rgba(224,94,16,0.4))" }} />
                  <path className="root-path root-branch" d="M415 80 C445 95 465 85 485 110" stroke="#F79520" strokeWidth="2" style={{ filter: "drop-shadow(0 0 4px rgba(247,149,32,0.3))" }} />
                  <path className="root-path root-branch" d="M385 85 C355 100 335 90 315 115" stroke="#E05E10" strokeWidth="2" style={{ filter: "drop-shadow(0 0 4px rgba(224,94,16,0.3))" }} />
                  
                  {/* Secondary branches */}
                  <path className="root-path root-branch-secondary" d="M450 80 C470 75 490 70 510 72" stroke="#F79520" strokeWidth="1.5" opacity="0.7" />
                  <path className="root-path root-branch-secondary" d="M350 85 C330 80 310 75 290 77" stroke="#E05E10" strokeWidth="1.5" opacity="0.7" />
                  <path className="root-path root-branch-secondary" d="M430 110 C450 105 470 100 490 102" stroke="#F79520" strokeWidth="1.2" opacity="0.6" />
                  <path className="root-path root-branch-secondary" d="M370 115 C350 110 330 105 310 107" stroke="#E05E10" strokeWidth="1.2" opacity="0.6" />
                  
                  {/* Tiny root hairs */}
                  <path className="root-path root-hair" d="M490 85 C500 82 510 80 518 82" stroke="#F79520" strokeWidth="1" opacity="0.4" />
                  <path className="root-path root-hair" d="M310 90 C300 87 290 85 282 87" stroke="#E05E10" strokeWidth="1" opacity="0.4" />
                  <path className="root-path root-hair" d="M470 105 C478 100 486 98 492 100" stroke="#F79520" strokeWidth="1" opacity="0.4" />
                  <path className="root-path root-hair" d="M330 110 C322 105 314 103 308 105" stroke="#E05E10" strokeWidth="1" opacity="0.4" />
                </svg>
              </div>

              <div className="relative w-full max-w-7xl max-h-full py-10 md:py-0 overflow-y-auto md:overflow-visible">
                <div className="absolute -top-6 md:-top-12 -left-10 md:-left-38 text-[60px] md:text-[160px] font-['Montserrat'] font-bold text-white/[0.03] leading-none pointer-events-none uppercase select-none">
                 {t.aboutHero.blessing}
                </div>
                
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-12">
                  <div className="w-full md:w-2/3 h-[40vh] md:h-[60vh] shadow-2xl overflow-hidden rounded-sm group relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-[#F79520]/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <img 
                      src={CRAFT_IMAGE} 
                      alt="Craftmanship" 
                      decoding="async"
                      className="w-full h-full object-contain md:object-cover brightness-90 group-hover:brightness-100 group-hover:scale-110 transition-all duration-1000" 
                    />
                    <div className="absolute inset-0 border border-[#F79520]/20 group-hover:border-[#F79520]/60 transition-all duration-500 pointer-events-none" />
                  </div>
                  
                  <div className="w-full md:w-1/3 text-center md:text-left">
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white font-['Montserrat'] mb-4 md:mb-6">
                      {t.aboutHero.harmonyYears}
                    </h2>
                    <p className="text-[10px] md:text-[13px] text-[#F79520] italic border-l-0 md:border-l-2 border-[#F79520] px-4 md:pl-6 mb-4 md:mb-8 font-medium">
                      "{t.aboutHero.harmonyQuote}"
                    </p>
                    <p className="hidden md:block text-[12px] text-zinc-400 leading-relaxed mb-8">
                      {t.aboutHero.harmonyDescription}
                    </p>
                    <div className="flex justify-center md:justify-start gap-4">
                      <div className="hidden md:block w-12 h-[1px] bg-[#F79520] mt-2 animate-pulse"></div>
                      <span className="text-[9px] md:text-[10px] tracking-widest uppercase text-[#F79520] font-bold">{t.aboutHero.mastersVision}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CHAPTER 4: THE PHILOSOPHY - A PURSUIT OF HOLINESS */}
            <section className="relative w-[100vw] flex-shrink-0 h-full flex items-center justify-center px-6 md:px-24 z-10">
              <div className="grid grid-cols-1 md:grid-cols-12 w-full max-w-7xl items-center gap-8 md:gap-12 max-h-full py-10 overflow-y-auto md:overflow-visible">
                <div className="md:col-span-5 relative max-w-[250px] md:max-w-none mx-auto group">
                   <div className="absolute -inset-2 md:-inset-4 border border-[#F79520]/40 -z-10 translate-x-3 translate-y-3 md:translate-x-4 md:translate-y-4 group-hover:translate-x-5 group-hover:translate-y-5 transition-transform duration-500"></div>
                   <div className="absolute -inset-2 md:-inset-4 border border-[#F79520]/20 -z-20 translate-x-1 translate-y-1"></div>
                   <img src={VISION_IMAGE} alt="Vision" decoding="async" className="w-full aspect-[3/4] object-cover rounded-sm shadow-2xl brightness-90 group-hover:brightness-100 transition-all duration-700" />
                </div>
                <div className="md:col-span-7 text-center md:text-left">
                   <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white font-['Montserrat'] leading-[0.9] mb-6 md:mb-8 tracking-tighter">
                     {t.aboutHero.holinessTitle}
                   </h2>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                      <p className="text-[11px] md:text-[13px] text-zinc-300 leading-relaxed">
                        {t.aboutHero.holinessDescription1}
                      </p>
                      <p className="hidden sm:block text-[11px] md:text-[13px] text-zinc-400 leading-relaxed">
                        {t.aboutHero.holinessDescription2}
                      </p>
                   </div>
                   <div className="mt-6 md:mt-12 pt-4 md:pt-8 border-t border-[#F79520]/40 flex justify-between items-center">
                      <span className="text-[8px] md:text-[10px] tracking-[0.3em] uppercase text-zinc-500 font-medium">{t.aboutHero.blessing}</span>
                      <div className="w-10 h-10 md:w-16 md:h-16 rounded-full border-2 border-[#F79520] bg-[#F79520]/10 flex items-center justify-center text-[8px] md:text-[10px] text-[#F79520] font-bold shadow-[0_0_20px_rgba(247,149,32,0.3)]">
                        1982
                      </div>
                   </div>
                </div>
              </div>
            </section>

            {/* CHAPTER 5: THE HORIZON */}
            <section className="relative w-[100vw] flex-shrink-0 h-full flex items-center justify-center overflow-hidden">
  
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={FUTURE_IMAGE}
                  alt="Future"
                  decoding="async"
                  className="w-full h-full object-cover brightness-50"
                />
              </div>

              {/* Enhanced Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>

              {/* Content */}
              <div className="relative w-full h-full">
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-center px-6 w-full">
                  <div className="overflow-hidden">
                    <h2 className="text-[40px] sm:text-[80px] md:text-[140px] font-['Montserrat'] font-bold text-[#F79520] leading-none tracking-tighter animate-slide-up">
                      {t.aboutHero.heritageFooter}
                    </h2>
                  </div>
                  <div className="w-24 h-[1px] bg-[#F79520] mx-auto mt-4 mb-3 animate-pulse"></div>
                  <p className="text-[8px] sm:text-[10px] text-zinc-400 tracking-[0.3em] uppercase animate-fade-in">{t.aboutHero.eternalEchoes}</p>
                </div>
              </div>

            </section>
          </div>
        </div>

        {/* LAYER: Original Art */}
        <div ref={bg1Ref} className="absolute inset-0 z-10 pointer-events-none">
          <img
            src={BACKGROUND_IMAGE}
            alt="Background Art"
            className="w-full h-full object-cover scale-110 animate-subtle-zoom"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* UPDATED OUR STORY LAYER: Text Mask Cutout Design with Sparkles */}
        <div 
          ref={fadeLayerRef} 
          className="absolute inset-0 z-30 pointer-events-none"
        >
          {/* Mask Elements */}
          <div className="absolute inset-0 z-10">
            <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice">
              <defs>
                <mask id="hero-text-mask">
                  <rect width="100%" height="100%" fill="white" />
                  <text
                    x="6%" 
                    y="50%" 
                    dominantBaseline="middle"
                    className="responsive-headline font-['Montserrat'] font-bold fill-black"
                    style={{ fontSize: 'clamp(3rem, 18vw, 18rem)', letterSpacing: '-0.06em' }}
                  >
                    {language === "en" ? (
                      <>
                        <tspan x="6%" dy="-0.1em">OUR</tspan>
                        <tspan x="6%" dy="0.75em">STORY</tspan>
                      </>
                    ) : (
                      <tspan x="6%" dy="0.3em">ታሪካችን</tspan>
                    )}
                  </text>
                </mask>
              </defs>
              <rect width="100%" height="100%" fill="#000000" mask="url(#hero-text-mask)" />
            </svg>
          </div>

          {/* Interactive Floating Sparkles in Background behind/within Cutout area */}
          <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            {sparkles.map((sp) => (
              <div
                key={sp.id}
                className="absolute rounded-full bg-gradient-to-tr from-[#F79520] to-[#E05E10] opacity-0 animate-gold-amber-shimmer"
                style={{
                  left: sp.left,
                  top: sp.top,
                  width: `${sp.size}px`,
                  height: `${sp.size}px`,
                  animationDelay: `${sp.delay}s`,
                  boxShadow: "0 0 10px rgba(247, 149, 32, 0.9)",
                }}
              />
            ))}
          </div>

          {/* Top/Bottom Details & Letter grids */}
          <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 md:p-12 text-white">
            <div className="flex justify-end items-start w-full">
              <div className="grid grid-cols-6 gap-x-2 md:gap-x-6 gap-y-1 text-[8px] md:text-[10px] text-[#F79520] font-['Montserrat'] font-light opacity-75 text-right">
                {Array.from("BLESSSSPIRITLOVINGPRAISE").map((char, i) => (
                  <span key={i} className="hover:text-white transition-colors duration-300 pointer-events-auto cursor-default">{char}</span>
                ))}
              </div>
            </div>

            {/* Custom Paragraph Description adjacent to cutout */}
            <div className="hero-paragraph-container absolute z-30 left-[8%] bottom-[22%] sm:bottom-[28%] md:top-[50%] md:-translate-y-[100%] max-w-[170px] md:left-[60vw] md:max-w-[320px]">
              <p className="text-[8px] sm:text-[10px] md:text-[12px] leading-relaxed opacity-70 font-['Montserrat'] font-light tracking-widest uppercase">
                {t.aboutHero.storyDescription}
              </p>
            </div>

            <div className="flex justify-end items-end w-full">
              <div className="hidden sm:grid grid-cols-6 gap-x-3 md:gap-x-6 gap-y-1 text-[8px] md:text-[10px] text-[#F79520] font-['Montserrat'] font-light opacity-75 mr-auto">
                {Array.from("CHRISTSAVIORGOSPELDIVINE").map((char, i) => (
                  <span key={i} className="hover:text-white transition-colors duration-300 pointer-events-auto cursor-default">{char}</span>
                ))}
              </div>
              <div className="text-right space-y-0.5 ml-auto mb-[2%]">
                <h3 className="text-xl md:text-4xl font-['Montserrat'] text-[#F79520] font-medium tracking-tight leading-none uppercase">MADAN</h3>
                <p className="text-[8px] md:text-[10px] tracking-[0.4em] font-['Montserrat'] font-light opacity-60">EST 1982</p>
              </div>
            </div>
          </div>
        </div>
      </div>

     

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;400;500;700;900&display=swap');

        /* HTML and Body Lenis overrides to prevent conflicting physical scrolls */
        html.lenis, html.lenis body {
          height: auto;
        }
        .lenis.lenis-smooth {
          scroll-behavior: auto !important;
        }
        .lenis.lenis-smooth [data-lenis-prevent] {
          overscroll-behavior: contain;
        }
        .lenis.lenis-stopped {
          overflow: hidden;
        }

        .will-change-transform {
          will-change: transform;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
        }

        @keyframes subtle-zoom {
          0% { transform: scale(1.1); }
          100% { transform: scale(1.25); }
        }

        @keyframes seed-fall-enhanced {
          0% { transform: translate(-40px, -100vh) rotate(-15deg); opacity: 0; }
          15% { opacity: 1; transform: translate(30px, -80vh) rotate(20deg); }
          40% { transform: translate(-50px, -60vh) rotate(-10deg); }
          65% { transform: translate(40px, -40vh) rotate(30deg); }
          85% { transform: translate(0px, -8px) rotate(25deg); }
          100% { transform: translate(0px, -8px) rotate(25deg); opacity: 1; }
        }

        @keyframes root-draw {
          0% { stroke-dashoffset: 1000; opacity: 0; }
          10% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }

        @keyframes gold-amber-shimmer {
          0%, 100% {
            transform: translateY(0px) scale(0.5);
            opacity: 0;
          }
          50% {
            opacity: 0.85;
            transform: translateY(-25px) scale(1.2);
          }
        }

        @keyframes glow-text {
          0%, 100% { text-shadow: 0 0 20px rgba(247,149,32,0.3); }
          50% { text-shadow: 0 0 40px rgba(247,149,32,0.6); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        @keyframes slide-up {
          0% { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        .root-path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          opacity: 0;
          transition: opacity 0.8s ease;
        }

        .animate-seed-fall {
          animation: seed-fall-enhanced 2.8s cubic-bezier(0.45, 0.05, 0.55, 0.95) 1 forwards;
        }

        .animate-roots-trigger {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        .animate-roots-trigger .root-path {
          animation: root-draw 8.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-subtle-zoom {
          animation: subtle-zoom 25s infinite alternate ease-in-out;
        }

        .animate-gold-amber-shimmer {
          animation: gold-amber-shimmer 4.5s ease-in-out infinite;
        }

        .animate-glow-text {
          animation: glow-text 3s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }

        .animate-slide-up {
          animation: slide-up 1.2s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        /* Landscape Responsiveness Fixes */
        @media (max-height: 500px) and (orientation: landscape) {
          .responsive-headline { font-size: 32vh !important; }
          section h2 { font-size: 1.5rem !important; }
          section p { font-size: 9px !important; }
          .hero-paragraph-container { bottom: 15% !important; max-width: 200px !important; }
        }

        @media (max-width: 480px) and (orientation: portrait) {
          .responsive-headline { font-size: 22vw !important; }
        }
      `}</style>
    </div>
  );
};

export default AboutHeroSection;