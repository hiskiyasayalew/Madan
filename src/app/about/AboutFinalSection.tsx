import React, { useEffect, useState, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";

const PAPER_BG_IMAGE = "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=1974&auto=format&fit=crop";

const AboutFinalSection = () => {
  const [isActive, setIsActive] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const linePathRef = useRef<SVGPathElement | null>(null);
  const [pathLength, setPathLength] = useState(0);
  
  const { language } = useLanguage();
  const t = translations[language];
  
  // REFS FOR ROOTS
  const rootRefTop = useRef<HTMLDivElement | null>(null);
  
  // Particles for background
  const [particles, setParticles] = useState<{ id: number; left: string; top: string; size: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    // Generate floating particles for background
    const generatedParticles = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 10,
      duration: Math.random() * 8 + 4,
    }));
    setParticles(generatedParticles);
  }, []);

  // Observer to trigger background change when section is scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsActive(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Scroll progress for drawing animation within the section
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate continuous progress from 0 (entering screen) to 1 (leaving screen)
      const totalDistance = windowHeight + rect.height;
      const currentDistance = windowHeight - rect.top;
      const progress = Math.min(Math.max(currentDistance / totalDistance, 0), 1);
      
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get path length for drawing animation
  useEffect(() => {
    if (linePathRef.current) {
      setPathLength(linePathRef.current.getTotalLength());
    }
  }, []);

  // OBSERVER FOR ROOT ANIMATIONS
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-roots-trigger");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (rootRefTop.current) observer.observe(rootRefTop.current);

    return () => observer.disconnect();
  }, []);

  // Fixed spiral path that goes from top to bottom
  const spiralPath = "M 22 32 C 80 30, 95 55, 50 78 C 50 82, 75 82, 75 85 C 75 88, 25 88, 25 91 C 25 94, 75 94, 75 97";

  return (
    <div 
      ref={sectionRef}
      className="relative w-full font-['Montserrat'] overflow-hidden transition-all duration-1000"
      style={{ 
        backgroundColor: isActive ? "#FFFFFF" : "#000000",
        color: isActive ? "#190E01" : "#FFFFFF"
      }}
    >
      {/* Dark Background with Particle Animation */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black via-black to-black overflow-hidden pointer-events-none transition-opacity duration-1000"
        style={{ opacity: isActive ? 0 : 1 }}
      >
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
        <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] rounded-full bg-[#F79520]/5 blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full bg-[#E05E10]/5 blur-[120px] animate-pulse-slow delay-1000" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#F7952008_1px,transparent_1px),linear-gradient(to_bottom,#F7952008_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* White/Light Background - Removed the bottom left gradient */}
      <div 
        className="absolute inset-0 bg-white overflow-hidden pointer-events-none transition-opacity duration-1000"
        style={{ opacity: isActive ? 1 : 0 }}
      >
        <div className="absolute inset-0">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full bg-[#F79520]/20 opacity-0 animate-particle-float-light"
              style={{
                left: p.left,
                top: p.top,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* --- ROOT 1: TOP RIGHT --- */}
      <div 
        ref={rootRefTop}
        className="absolute top-0 right-0 w-[50vw] h-[70vh] pointer-events-none opacity-0 transition-all duration-1000 z-10"
      >
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 1000 1000" 
          fill="none" 
          preserveAspectRatio="none" 
          style={{ transform: "scaleX(-1)" }}
        >
          <path 
            className="root-path root-primary"
            d="M80 0 C100 150, 120 300, 140 500 C150 650, 140 800, 120 1000"
            stroke={isActive ? "#190E01" : "#F79520"}
            strokeWidth="3"
            strokeOpacity={isActive ? 0.8 : 0.9}
          />
          <path 
            className="root-path root-secondary"
            d="M120 300 C200 320, 260 380, 320 500"
            stroke={isActive ? "#190E01" : "#E05E10"}
            strokeWidth="1.8"
            strokeOpacity={isActive ? 0.6 : 0.8}
          />
          <path 
            className="root-path root-secondary"
            d="M135 450 C60 500, 40 600, 30 750"
            stroke={isActive ? "#190E01" : "#F79520"}
            strokeWidth="1.6"
            strokeOpacity={isActive ? 0.5 : 0.7}
          />
          <path 
            className="root-path root-secondary"
            d="M140 600 C200 650, 260 720, 300 820"
            stroke={isActive ? "#190E01" : "#E05E10"}
            strokeWidth="1.4"
            strokeOpacity={isActive ? 0.5 : 0.7}
          />
          <path d="M180 350 C240 360, 300 390, 360 430" className="root-path root-fine" stroke={isActive ? "#190E01" : "#F79520"} strokeWidth="0.9" strokeOpacity={isActive ? 0.4 : 0.6}/>
          <path d="M200 370 C250 400, 300 440, 350 500" className="root-path root-fine" stroke={isActive ? "#190E01" : "#E05E10"} strokeWidth="0.7" strokeOpacity={isActive ? 0.3 : 0.5}/>
          <path d="M220 390 C260 430, 300 470, 340 540" className="root-path root-fine" stroke={isActive ? "#190E01" : "#F79520"} strokeWidth="0.6" strokeOpacity={isActive ? 0.3 : 0.5}/>
          <path d="M100 500 C60 540, 40 580, 30 620" className="root-path root-fine" stroke={isActive ? "#190E01" : "#E05E10"} strokeWidth="0.8" strokeOpacity={isActive ? 0.3 : 0.5}/>
          <path d="M110 530 C70 580, 50 620, 40 670" className="root-path root-fine" stroke={isActive ? "#190E01" : "#F79520"} strokeWidth="0.7" strokeOpacity={isActive ? 0.3 : 0.5}/>
          <path d="M120 560 C80 610, 60 660, 50 720" className="root-path root-fine" stroke={isActive ? "#190E01" : "#E05E10"} strokeWidth="0.6" strokeOpacity={isActive ? 0.2 : 0.4}/>
          <path d="M60 700 C40 740, 25 780, 15 830" className="root-path root-fine" stroke={isActive ? "#190E01" : "#F79520"} strokeWidth="0.5" strokeOpacity={isActive ? 0.2 : 0.4}/>
          <path d="M50 720 C30 760, 20 800, 10 860" className="root-path root-fine" stroke={isActive ? "#190E01" : "#E05E10"} strokeWidth="0.45" strokeOpacity={isActive ? 0.2 : 0.4}/>
          <path d="M40 740 C20 780, 10 820, 5 900" className="root-path root-fine" stroke={isActive ? "#190E01" : "#F79520"} strokeWidth="0.4" strokeOpacity={isActive ? 0.2 : 0.4}/>
          <path d="M260 420 C300 430, 340 460, 420 520" className="root-path root-fine" stroke={isActive ? "#190E01" : "#E05E10"} strokeWidth="0.8" strokeOpacity={isActive ? 0.3 : 0.5}/>
          <path d="M300 460 C340 480, 380 520, 460 600" className="root-path root-fine" stroke={isActive ? "#190E01" : "#F79520"} strokeWidth="0.6" strokeOpacity={isActive ? 0.3 : 0.5}/>
          <path d="M320 500 C360 540, 400 580, 480 660" className="root-path root-fine" stroke={isActive ? "#190E01" : "#E05E10"} strokeWidth="0.5" strokeOpacity={isActive ? 0.2 : 0.4}/>
          <path d="M20 780 C10 800, 5 830, 2 870" className="root-path root-fine" stroke={isActive ? "#190E01" : "#F79520"} strokeWidth="0.35" strokeOpacity={isActive ? 0.2 : 0.4}/>
          <path d="M25 800 C15 830, 8 860, 4 920" className="root-path root-fine" stroke={isActive ? "#190E01" : "#E05E10"} strokeWidth="0.3" strokeOpacity={isActive ? 0.2 : 0.4}/>
          <path d="M30 820 C20 850, 10 880, 6 950" className="root-path root-fine" stroke={isActive ? "#190E01" : "#F79520"} strokeWidth="0.25" strokeOpacity={isActive ? 0.2 : 0.4}/>
        </svg>
      </div>

      {/* LINE ANIMATION - Elongates following scroll from top to bottom */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-20" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <path
          ref={linePathRef}
          d={spiralPath}
          fill="none"
          stroke="#F79520"
          strokeWidth="0.15"
          strokeOpacity="0.8"
          strokeLinecap="round"
          strokeDasharray={pathLength}
          strokeDashoffset={pathLength * (1 - scrollProgress)}
        />
      </svg>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-24 py-32">
        
        {/* PART 1: TOP CENTER */}
        <section className="flex flex-col items-center text-center mb-40">
          <h2 
            className="text-[15px] tracking-[0.3em] uppercase mb-6 transition-colors duration-500"
            style={{ color: "#F79520" }}
          >
            {t.aboutFinal.scripture}
          </h2>
          <h1 
            className="text-4xl md:text-5xl font-[Montserrat] leading-none mb-6 transition-colors duration-500"
            style={{ color: isActive ? "#190E01" : "#FFFFFF" }}
          >
            {t.aboutFinal.godTitle}
          </h1>
          <p 
            className="max-w-md text-[13px] leading-relaxed transition-colors duration-500"
            style={{ opacity: 0.8, color: isActive ? "#190E01" : "#FFFFFF" }}
          >
            {t.aboutFinal.godDescription}
          </p>
        </section>

        {/* PART 2: LEFT SIDE */}
        <section className="flex justify-start mb-20">
          <div className="max-w-sm">
            <h2 
              className="text-3xl font-[Montserrat] mb-4 tracking-tight transition-colors duration-500"
              style={{ color: isActive ? "#190E01" : "#FFFFFF" }}
            >
              <span style={{ color: "#F79520" }}>01.</span> {t.aboutFinal.firstLocation}
            </h2>
            <p 
              className="text-[14px] leading-relaxed transition-colors duration-500"
              style={{ opacity: 0.7, color: isActive ? "#190E01" : "#FFFFFF" }}
            >
              {t.aboutFinal.firstLocationDescription}
            </p>
          </div>
        </section>

        {/* PART 3: RIGHT SIDE */}
        <section className="flex justify-end mb-40 mt-32">
          <div className="max-w-sm text-right">
            <h2 
              className="text-3xl font-[Montserrat] mb-4 tracking-tight transition-colors duration-500"
              style={{ color: isActive ? "#190E01" : "#FFFFFF" }}
            >
              <span style={{ color: "#F79520" }}>02.</span> {t.aboutFinal.secondLocation}
            </h2>
            <p 
              className="text-[14px] leading-relaxed transition-colors duration-500"
              style={{ opacity: 0.7, color: isActive ? "#190E01" : "#FFFFFF" }}
            >
              {t.aboutFinal.secondLocationDescription}
            </p>
          </div>
        </section>

        {/* PART 4: FINAL CENTER + VERTICAL LOGOS - Now with 3 logos */}
        <section className="flex flex-col items-center text-center border-t transition-colors duration-500" style={{ borderColor: isActive ? "#190E0110" : "#F7952010" }}>
          <h2 
            className="text-4xl md:text-7xl font-[Montserrat] mb-8 mt-12 transition-colors duration-500"
            style={{ color: isActive ? "#190E01" : "#FFFFFF" }}
          >
            {t.aboutFinal.presentLocation}
          </h2>
          <p 
            className="max-w-xl text-[15px] leading-relaxed mb-16 transition-colors duration-500"
            style={{ opacity: 0.7, color: isActive ? "#190E01" : "#FFFFFF" }}
          >
            {t.aboutFinal.presentLocationQuote}
          </p>

          <div className="flex flex-col items-center justify-center gap-16 mt-[15%]">
            {/* Logo 1 - Added at the top */}
            <div className="w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500">
              <div 
                className="w-full h-full flex items-center justify-center text-xs font-bold transition-colors duration-500"
                style={{ color: isActive ? "#190E01" : "#FFFFFF" }}
              >
                MADAN
              </div>
            </div>
            {/* Logo 2 */}
            <div className="w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500">
              <img 
                src="/Madan-Old1.png" 
                alt="Partner Logo 2" 
                className="max-w-full max-h-full object-contain"
                style={{ filter: isActive ? 'none' : 'brightness(0) invert(1)' }}
              />
            </div>
            {/* Logo 3 */}
            <div className="w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500">
              <img 
                src="/MADAN-Black.png" 
                alt="Partner Logo 3" 
                className="max-w-full max-h-full object-contain"
                style={{ filter: isActive ? 'none' : 'brightness(0) invert(1)' }}
              />
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@100;300;400;500;700&display=swap');
        
        section {
          animation: fadeInUp 1.2s ease forwards;
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
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

        @keyframes particle-float-light {
          0% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
          }
          20% {
            opacity: 0.4;
          }
          80% {
            opacity: 0.2;
          }
          100% {
            transform: translateY(-80px) translateX(20px);
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

        .animate-particle-float-light {
          animation: particle-float-light ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }

        .animate-roots-trigger path:nth-child(2) { animation-delay: 0.5s; }
        .animate-roots-trigger path:nth-child(3) { animation-delay: 1.2s; }
        .animate-roots-trigger path:nth-child(4) { animation-delay: 2s; }
        .animate-roots-trigger path:nth-child(odd) { animation-duration: 12s; }
      `}</style>
    </div>
  );
};

export default AboutFinalSection;