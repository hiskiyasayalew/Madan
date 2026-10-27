import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";

const PAPER_BG_IMAGE = "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=1974&auto=format&fit=crop";
const STUDIO_IMAGE = "/About-SectionImg2.png";
const TEAM_IMAGE = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop";
const MATERIAL_IMAGE = "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?q=80&w=2070&auto=format&fit=crop";
const FINAL_ARCH_IMAGE = "/AboutHeroImg1.png";

// New Gallery Content
const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069",
  "https://images.unsplash.com/photo-1449156001935-d28734751e13?q=80&w=2070"
];

const AboutVerticalFinal = () => {

  const rootContainerRef1 = useRef<HTMLDivElement | null>(null);
  const rootContainerRef2 = useRef<HTMLDivElement | null>(null);
  const churchSectionRef = useRef(null);
  const [churchVisible, setChurchVisible] = useState(false);
  const [dustActive, setDustActive] = useState(false);
  
  // Generate dust particles on demand
  const [dustParticles, setDustParticles] = useState<Array<{ id: number; left: string; top: string; size: number; angle: number; distance: number; duration: number }>>([]);
  
  const { language } = useLanguage();
  const t = translations[language];
  
  // Particles for background
  const [particles, setParticles] = useState<{ id: number; left: string; top: string; size: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    // Generate floating particles for background
    const generatedParticles = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 10,
      duration: Math.random() * 8 + 4,
    }));
    setParticles(generatedParticles);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-roots-trigger");
          }
        });
      },
      { threshold: 0.2 }
    );

    if (rootContainerRef1.current) {
      observer.observe(rootContainerRef1.current);
    }

    if (rootContainerRef2.current) {
      observer.observe(rootContainerRef2.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setChurchVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (churchSectionRef.current) observer.observe(churchSectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Trigger dust after fall animation completes
  useEffect(() => {
    if (churchVisible) {
      const timer = setTimeout(() => {
        setDustActive(true);
        // Generate dust particles
        const newParticles = Array.from({ length: 40 }).map((_, i) => ({
          id: i,
          left: `${50 + (Math.random() - 0.5) * 60}%`, // spread around center
          top: `${70 + (Math.random() - 0.5) * 20}%`, // near ground
          size: Math.random() * 6 + 2,
          angle: Math.random() * 360,
          distance: Math.random() * 120 + 60,
          duration: Math.random() * 0.8 + 0.6,
        }));
        setDustParticles(newParticles);
        // Remove dust after animation
        setTimeout(() => {
          setDustActive(false);
          setDustParticles([]);
        }, 2000);
      }, 1500); // match fall duration (1.5s)
      return () => clearTimeout(timer);
    }
  }, [churchVisible]);

  return (
    <div className="relative w-full bg-black font-['Montserrat'] overflow-hidden -mt-[1px]">
      
      {/* Dark Background with Particle Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#0a0500] overflow-hidden pointer-events-none">
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full bg-[#F79520] opacity-0 animate-particle-float"
              style={{
                left: p.left,
                top: p.top,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                boxShadow: `0 0 ${p.size * 2}px rgba(247,149,32,0.4)`,
              }}
            />
          ))}
        </div>
        
        {/* Ambient Orange Glow */}
        <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] rounded-full bg-[#F79520]/5 blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full bg-[#E05E10]/5 blur-[120px] animate-pulse-slow delay-1000" />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#F7952008_1px,transparent_1px),linear-gradient(to_bottom,#F7952008_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* SECTION 1: THE STUDIO + NEW COMPLEX ROOT SYSTEM */}
      <section className="relative pt-32 pb-20 px-6 md:px-24 max-w-7xl mx-auto z-10">
        
        {/* LARGE TOP-LEFT ROOT SYSTEM - Orange Themed */}
        <div 
          ref={rootContainerRef1} 
          className="absolute -top-20 right-0 w-[100vw] h-[100vh] pointer-events-none opacity-0 transition-all duration-1000"
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1800 2000"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            style={{ transform: "scaleX(-1)" }}
          >
            {/* ====== MAIN TRUNK (primary) ====== */}
            <path className="root-path root-primary"
              d="M80 0 
                 C60 150, 100 300, 120 500
                 C140 700, 100 900, 130 1100"
              stroke="#F79520" strokeWidth="3.5" strokeOpacity="0.9" />

            {/* ====== SECONDARY BRANCHES ====== */}
            <path className="root-path root-secondary"
              d="M110 250 
                 C200 260, 280 300, 340 400"
              stroke="#E05E10" strokeWidth="2.2" strokeOpacity="0.8" />

            <path className="root-path root-secondary"
              d="M120 450 
                 C60 480, 20 520, 10 650"
              stroke="#F79520" strokeWidth="2.0" strokeOpacity="0.8" />

            <path className="root-path root-secondary"
              d="M115 700 
                 C210 740, 290 790, 370 900"
              stroke="#E05E10" strokeWidth="2.4" strokeOpacity="0.8" />

            <path className="root-path root-secondary"
              d="M130 950 
                 C220 980, 300 1040, 380 1150"
              stroke="#F79520" strokeWidth="2.0" strokeOpacity="0.7" />

            {/* ====== TERTIARY BRANCHES ====== */}
            <path className="root-path root-fine"
              d="M220 280 
                 C280 290, 320 320, 380 380"
              stroke="#F79520" strokeWidth="1.0" strokeOpacity="0.6" />

            <path className="root-path root-fine"
              d="M260 330 
                 C310 350, 350 380, 400 450"
              stroke="#E05E10" strokeWidth="0.9" strokeOpacity="0.5" />

            <path className="root-path root-fine"
              d="M280 400 
                 C340 420, 390 460, 450 540"
              stroke="#F79520" strokeWidth="0.8" strokeOpacity="0.5" />

            <path className="root-path root-fine"
              d="M30 550 
                 C15 580, 5 620, 2 700"
              stroke="#E05E10" strokeWidth="0.9" strokeOpacity="0.5" />

            <path className="root-path root-fine"
              d="M20 630 
                 C10 660, 5 700, 2 780"
              stroke="#F79520" strokeWidth="0.7" strokeOpacity="0.4" />

            <path className="root-path root-fine"
              d="M230 750 
                 C290 780, 340 820, 400 890"
              stroke="#F79520" strokeWidth="1.0" strokeOpacity="0.6" />

            <path className="root-path root-fine"
              d="M280 800 
                 C340 830, 400 870, 470 950"
              stroke="#E05E10" strokeWidth="0.8" strokeOpacity="0.5" />

            <path className="root-path root-fine"
              d="M210 1020 
                 C280 1050, 350 1090, 430 1160"
              stroke="#F79520" strokeWidth="0.8" strokeOpacity="0.5" />

            <path className="root-path root-fine"
              d="M250 1080 
                 C320 1110, 390 1150, 480 1230"
              stroke="#E05E10" strokeWidth="0.7" strokeOpacity="0.4" />

            {/* ====== MICRO ROOTS / HAIRS ====== */}
            <path className="root-path root-fine"
              d="M340 380 
                 C370 390, 400 410, 430 450"
              stroke="#F79520" strokeWidth="0.4" strokeOpacity="0.3" />

            <path className="root-path root-fine"
              d="M380 420 
                 C420 440, 460 470, 500 520"
              stroke="#E05E10" strokeWidth="0.4" strokeOpacity="0.3" />

            <path className="root-path root-fine"
              d="M45 650 
                 C30 680, 20 720, 15 780"
              stroke="#F79520" strokeWidth="0.4" strokeOpacity="0.3" />

            <path className="root-path root-fine"
              d="M35 720 
                 C25 750, 15 790, 10 850"
              stroke="#E05E10" strokeWidth="0.3" strokeOpacity="0.3" />

            <path className="root-path root-fine"
              d="M330 840 
                 C380 870, 420 910, 470 980"
              stroke="#F79520" strokeWidth="0.5" strokeOpacity="0.4" />

            <path className="root-path root-fine"
              d="M370 890 
                 C430 920, 480 960, 540 1040"
              stroke="#E05E10" strokeWidth="0.4" strokeOpacity="0.3" />

            {/* Extra fine tendrils */}
            <path className="root-path root-fine"
              d="M420 520 
                 C450 540, 480 570, 520 620"
              stroke="#F79520" strokeWidth="0.3" strokeOpacity="0.2" />

            <path className="root-path root-fine"
              d="M15 780 
                 C5 810, 2 850, 1 900"
              stroke="#E05E10" strokeWidth="0.3" strokeOpacity="0.2" />
          </svg>
        </div>

        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/2">
            <span className="text-[10px] tracking-[0.3em] text-[#F79520] uppercase mb-4 block font-bold">{t.aboutVertical.choirTagline}</span>
            <h2 className="text-5xl md:text-7xl font-bold font-[Montserrat] text-white leading-none mb-8">
            {t.aboutVertical.echoesTitle}
          </h2>
            <p className="text-[14px] text-zinc-300 leading-relaxed mb-8 max-w-md">
              {t.aboutVertical.studioDescription}
            </p>
          </div>
          <div className="w-full md:w-2/3 aspect-[10/6] overflow-hidden shadow-2xl rounded-sm group relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-[#F79520]/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <img 
              src={STUDIO_IMAGE} 
              alt="Studio" 
              className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-all duration-1000 brightness-90 group-hover:brightness-100" 
            />
            <div className="absolute inset-0 border border-[#F79520]/20 group-hover:border-[#F79520]/60 transition-all duration-500 pointer-events-none" />
          </div>
        </div>
      </section>
      
      <section className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-24 min-h-auto flex flex-col justify-between">
        {/* LEFT SIDE ROOT SYSTEM - Orange Themed */}
        <div
          className="absolute top-0 left-0 w-[40vw] h-[40vh] pointer-events-none opacity-0 transition-all duration-1000"
          ref={rootContainerRef2}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            {/* ====== PRIMARY TRUNK (horizontal from left) ====== */}
            <path className="root-path root-primary"
              d="M0 100 
                 C120 110, 240 140, 380 170
                 C500 200, 620 230, 720 260"
              stroke="#F79520" strokeWidth="3.0" strokeOpacity="0.9" />

            {/* ====== SECONDARY BRANCHES ====== */}
            <path className="root-path root-secondary"
              d="M200 130 
                 C240 90, 290 70, 350 50"
              stroke="#E05E10" strokeWidth="1.8" strokeOpacity="0.8" />

            <path className="root-path root-secondary"
              d="M280 165 
                 C250 210, 230 260, 210 320"
              stroke="#F79520" strokeWidth="1.6" strokeOpacity="0.7" />

            <path className="root-path root-secondary"
              d="M420 200 
                 C500 180, 560 160, 640 140"
              stroke="#E05E10" strokeWidth="1.7" strokeOpacity="0.8" />

            <path className="root-path root-secondary"
              d="M520 225 
                 C580 210, 640 190, 700 170"
              stroke="#F79520" strokeWidth="1.5" strokeOpacity="0.7" />

            {/* ====== TERTIARY BRANCHES ====== */}
            <path className="root-path root-fine"
              d="M310 90 
                 C350 75, 390 60, 430 45"
              stroke="#F79520" strokeWidth="1.0" strokeOpacity="0.6" />

            <path className="root-path root-fine"
              d="M260 210 
                 C240 250, 220 290, 200 330"
              stroke="#E05E10" strokeWidth="0.9" strokeOpacity="0.5" />

            <path className="root-path root-fine"
              d="M500 190 
                 C560 170, 620 160, 680 150"
              stroke="#F79520" strokeWidth="0.8" strokeOpacity="0.5" />

            <path className="root-path root-fine"
              d="M600 215 
                 C660 200, 710 180, 750 160"
              stroke="#E05E10" strokeWidth="0.8" strokeOpacity="0.5" />

            {/* ====== MICRO ROOTS / HAIRS ====== */}
            <path className="root-path root-fine"
              d="M370 60 
                 C410 45, 450 35, 490 25"
              stroke="#F79520" strokeWidth="0.5" strokeOpacity="0.4" />

            <path className="root-path root-fine"
              d="M230 280 
                 C210 320, 190 360, 170 400"
              stroke="#E05E10" strokeWidth="0.5" strokeOpacity="0.4" />

            <path className="root-path root-fine"
              d="M560 180 
                 C620 160, 680 150, 740 140"
              stroke="#F79520" strokeWidth="0.5" strokeOpacity="0.4" />

            <path className="root-path root-fine"
              d="M660 200 
                 C720 185, 770 165, 790 150"
              stroke="#E05E10" strokeWidth="0.4" strokeOpacity="0.3" />

            {/* Extra fine tendrils */}
            <path className="root-path root-fine"
              d="M440 45 
                 C480 30, 520 20, 560 15"
              stroke="#F79520" strokeWidth="0.3" strokeOpacity="0.3" />

            <path className="root-path root-fine"
              d="M190 360 
                 C170 400, 150 440, 130 480"
              stroke="#E05E10" strokeWidth="0.3" strokeOpacity="0.3" />
          </svg>
        </div>

        {/* TOP BLOCK (TITLE + PARAGRAPH) */}
        <div className="flex flex-col items-center text-center gap-10 sm:gap-14 md:gap-16">

          {/* TITLE */}
          <div className="w-auto">
            <h3 className="text-3xl sm:text-4xl md:text-[60px] font-bold text-white uppercase leading-[.9]">
              <span className="text-[1.5rem] sm:text-[1.8rem] md:text-[2rem] text-[#F79520]">
                {t.aboutVertical.theChoir}
              </span>
              <br />
              {t.aboutVertical.beyondTime}
            </h3>
          </div>

          {/* PARAGRAPH */}
          <div className="max-w-4xl px-2">
            <p className="text-[13px] sm:text-[14px] md:text-[16px] leading-relaxed text-zinc-300">
              {t.aboutVertical.choirDescription}
            </p>
          </div>
        </div>

        {/* IMAGE BLOCK (BOTTOM LOCKED) */}
        <div className="max-w-7xl mx-auto w-auto mt-[7%]">
          <div className="relative h-auto w-full overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] rounded-[10px] group">
            <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-[#F79520]/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <img 
              src={FINAL_ARCH_IMAGE} 
              alt="Final Architecture" 
              className="w-auto m-auto h-auto object-contain transition-all duration-[2s] group-hover:scale-105 brightness-90 group-hover:brightness-100" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute inset-0 border border-[#F79520]/20 group-hover:border-[#F79520]/60 transition-all duration-500 pointer-events-none rounded-[10px]" />
          </div>
        </div>
      </section>

      {/* SECTION 2: THE MANIFESTO - MADAN CHURCH */}
      <section 
        ref={churchSectionRef}
        className="relative bg-black text-white overflow-hidden h-screen flex flex-col items-center justify-center"
      >
        {/* Background Orange Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F79520]/10 via-transparent to-transparent pointer-events-none" />
        
        <div className={`absolute right-[5%] md:right-[15%] inset-y-0 w-32 md:w-48 pointer-events-none z-20 ${churchVisible ? 'is-active' : ''}`}>
          {/* Church Icon - Detailed */}
          <div className="church-icon-container absolute left-1/2 -translate-x-1/2 opacity-0">
            <svg viewBox="0 0 120 140" className="w-20 h-28 md:w-28 md:h-36" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Shadow on ground - placed at bottom */}
              <ellipse cx="60" cy="135" rx="35" ry="5" fill="rgba(247,149,32,0.25)" className="church-shadow" />
              
              {/* Church Body - main rectangle */}
              <rect x="30" y="40" width="60" height="80" fill="#F79520" fillOpacity="0.85" stroke="#F79520" strokeWidth="1.5" rx="2" />
              
              {/* Main Roof - triangle */}
              <path d="M20 45 L60 15 L100 45 Z" fill="#E05E10" fillOpacity="0.9" stroke="#F79520" strokeWidth="1.5" strokeLinejoin="round" />
              
              {/* Steeple base */}
              <rect x="52" y="10" width="16" height="10" fill="#E05E10" fillOpacity="0.8" stroke="#F79520" strokeWidth="1" />
              
              {/* Steeple tip */}
              <path d="M56 10 L60 2 L64 10 Z" fill="#F79520" stroke="#F79520" strokeWidth="1" />
              
              {/* Cross on top */}
              <line x1="60" y1="2" x2="60" y2="-8" stroke="#F79520" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="54" y1="-4" x2="66" y2="-4" stroke="#F79520" strokeWidth="2" strokeLinecap="round" />
              
              {/* Arched Windows (left and right) */}
              <path d="M38 60 Q38 52 46 52 Q54 52 54 60 V80 H38 Z" fill="rgba(255,255,255,0.15)" stroke="#F79520" strokeWidth="1.2" />
              <path d="M66 60 Q66 52 74 52 Q82 52 82 60 V80 H66 Z" fill="rgba(255,255,255,0.15)" stroke="#F79520" strokeWidth="1.2" />
              
              {/* Central Window (arched, larger) */}
              <path d="M52 70 Q52 60 60 60 Q68 60 68 70 V85 H52 Z" fill="rgba(255,255,255,0.25)" stroke="#F79520" strokeWidth="1.2" />
              
              {/* Door */}
              <rect x="50" y="100" width="20" height="20" rx="2" fill="rgba(0,0,0,0.3)" stroke="#F79520" strokeWidth="1.2" />
              <line x1="60" y1="100" x2="60" y2="120" stroke="#F79520" strokeWidth="1" />
              
              {/* Small details - horizontal band */}
              <line x1="30" y1="50" x2="90" y2="50" stroke="#F79520" strokeWidth="1.5" />
              <line x1="30" y1="95" x2="90" y2="95" stroke="#F79520" strokeWidth="1" />
            </svg>
          </div>
          
          {/* Realistic Ground */}
          <div className="absolute bottom-[15%] left-0 w-[80%] h-3 bg-gradient-to-r from-transparent via-[#F79520]/60 to-transparent rounded-full shadow-[0_0_20px_rgba(247,149,32,0.4)]" />
          <div className="absolute bottom-[15%] left-[10%] w-[60%] h-[1px] bg-[#F79520]/20" />
          <div className="absolute bottom-[16%] left-[20%] w-[40%] h-[1px] bg-[#F79520]/10" />
          
          {/* Dust Particles Container */}
          {dustActive && (
            <div className="absolute inset-0 pointer-events-none">
              {dustParticles.map((p) => (
                <div
                  key={p.id}
                  className="dust-particle"
                  style={{
                    left: p.left,
                    top: p.top,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    '--angle': `${p.angle}deg`,
                    '--distance': `${p.distance}px`,
                    '--duration': `${p.duration}s`,
                  } as React.CSSProperties}
                />
              ))}
            </div>
          )}
        </div>

        <style>{`
          .is-active .church-icon-container {
            animation: church-fall 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          }

          @keyframes church-fall {
            0% { 
              transform: translate(-50%, -100vh); 
              opacity: 0; 
            }
            20% { 
              opacity: 1; 
            }
            100% { 
              transform: translate(-50%, calc(85vh - 100%)); 
              opacity: 1; 
            }
          }

          /* Shadow grows as it lands */
          .is-active .church-shadow {
            animation: shadow-grow 1.5s ease forwards;
          }
          @keyframes shadow-grow {
            0% { opacity: 0; transform: scale(0.5); }
            100% { opacity: 1; transform: scale(1); }
          }

          /* Dust Particle Animation */
          @keyframes dust-burst {
            0% {
              transform: translate(0, 0) scale(0.5);
              opacity: 0.9;
            }
            100% {
              transform: translate(calc(var(--distance) * cos(var(--angle))), calc(var(--distance) * sin(var(--angle)) - 20px)) scale(0);
              opacity: 0;
            }
          }

          .dust-particle {
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, #F79520 0%, #E05E10 100%);
            animation: dust-burst var(--duration) ease-out forwards;
            filter: blur(1px);
            box-shadow: 0 0 6px rgba(247,149,32,0.3);
          }
        `}</style>

        {/* Background Text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <h2 className="text-[20vw] font-['Bebas_Neue'] text-[#F79520] whitespace-nowrap">{t.aboutVertical.covenant}</h2>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl text-center px-6">
          <h2 className="text-3xl md:text-6xl font-['Montserrat'] font-bold mb-6 md:mb-12 tracking-wide bg-gradient-to-r from-white via-[#F79520] to-[#E05E10] bg-clip-text text-transparent">
            {t.aboutVertical.madanChurch}
          </h2>
          <div className="w-20 h-[1px] bg-[#F79520] mx-auto mb-6"></div>
          <p className="text-[11px] md:text-[13px] tracking-[0.4em] uppercase opacity-80 font-light font-['Montserrat'] text-[#F79520]">
            {t.aboutVertical.churchDate}
          </p>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@100;300;400;500;700&display=swap');
        
        .bg-radial-gradient {
          background: radial-gradient(circle, var(--tw-gradient-from), var(--tw-gradient-to));
        }

        /* ROOT ANIMATION STYLES */
        @keyframes root-draw-vertical {
            0% { stroke-dashoffset: 1500; opacity: 0; }
            10% { opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 1; }
        }

        @keyframes particle-float {
          0% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
          }
          20% {
            opacity: 0.6;
          }
          80% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-100px) translateX(30px);
            opacity: 0;
          }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        .root-path {
            stroke-dasharray: 1500;
            stroke-dashoffset: 1500;
            opacity: 0;
            transition: opacity 1s ease;
        }

        .animate-roots-trigger {
            opacity: 1 !important;
        }

        .animate-roots-trigger .root-path {
            animation: root-draw-vertical 10s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-particle-float {
          animation: particle-float ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }

        /* Staggering the paths slightly for complexity */
        .animate-roots-trigger path:nth-child(2) { animation-delay: 0.5s; }
        .animate-roots-trigger path:nth-child(3) { animation-delay: 1.2s; }
        .animate-roots-trigger path:nth-child(4) { animation-delay: 2s; }
        .animate-roots-trigger path:nth-child(odd) { animation-duration: 12s; }
        /* Additional stagger for new paths */
        .animate-roots-trigger path:nth-child(5) { animation-delay: 0.8s; }
        .animate-roots-trigger path:nth-child(6) { animation-delay: 1.5s; }
        .animate-roots-trigger path:nth-child(7) { animation-delay: 2.3s; }
        .animate-roots-trigger path:nth-child(8) { animation-delay: 1.0s; }
        .animate-roots-trigger path:nth-child(9) { animation-delay: 1.8s; }
        .animate-roots-trigger path:nth-child(10) { animation-delay: 2.6s; }
        .animate-roots-trigger path:nth-child(11) { animation-delay: 0.6s; }
        .animate-roots-trigger path:nth-child(12) { animation-delay: 1.3s; }
        .animate-roots-trigger path:nth-child(13) { animation-delay: 2.1s; }
        .animate-roots-trigger path:nth-child(14) { animation-delay: 0.9s; }
        .animate-roots-trigger path:nth-child(15) { animation-delay: 1.6s; }
        .animate-roots-trigger path:nth-child(16) { animation-delay: 2.4s; }
        .animate-roots-trigger path:nth-child(17) { animation-delay: 1.1s; }
        .animate-roots-trigger path:nth-child(18) { animation-delay: 1.9s; }
        .animate-roots-trigger path:nth-child(19) { animation-delay: 2.7s; }
        .animate-roots-trigger path:nth-child(20) { animation-delay: 0.7s; }
        .animate-roots-trigger path:nth-child(21) { animation-delay: 1.4s; }
        .animate-roots-trigger path:nth-child(22) { animation-delay: 2.2s; }
      `}</style>
    </div>
  );
};

export default AboutVerticalFinal;