import React, { useEffect, useRef } from "react";
import Lenis from "lenis";

const GuestHouseLayoutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const topParagraphRef = useRef<HTMLParagraphElement>(null);
  const prayerTitleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // 1) LENIS SMOOTH SCROLL
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2) INTERSECTION OBSERVER
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === topParagraphRef.current) {
            const paragraph = entry.target as HTMLElement;
            paragraph.style.opacity = "0";
            paragraph.style.transform = "translateY(-20px)";
            paragraph.style.animation = `fadeDown 0.8s ease forwards`;
            paragraph.style.animationDelay = "0.2s";
          }
          
          if (entry.target === prayerTitleRef.current) {
            const title = entry.target as HTMLElement;
            const text = title.innerText;
            title.innerHTML = ""; 
            
            [...text].forEach((char, index) => {
              const span = document.createElement("span");
              span.innerText = char === " " ? "\u00A0" : char;
              span.style.display = "inline-block";
              span.style.opacity = "0";
              span.style.transform = "translateY(40px)";
              span.style.animation = `letterFadeInUp 0.5s ease forwards`;
              span.style.animationDelay = `${0.03 * index + 0.3}s`;
              title.appendChild(span);
            });
          }
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: "0px 0px -50px 0px"
    });

    if (topParagraphRef.current) observer.observe(topParagraphRef.current);
    if (prayerTitleRef.current) observer.observe(prayerTitleRef.current);

    return () => {
      lenis.destroy();
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={sectionRef} className="relative w-full min-h-screen bg-neutral-950 flex flex-col items-center justify-between py-24 px-4 font-['Montserrat',sans-serif] overflow-hidden">
      
      {/* Decorative ambient orange glow - High Contrast Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-orange-500/10 blur-[140px] opacity-50 pointer-events-none -z-0" />
      
      {/* Top decorative line accent - High Contrast Orange */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

      {/* TOP MIDDLE PARAGRAPH */}
      <div className="w-full max-w-4xl mx-auto text-center relative z-10">
        <div className="mb-10 inline-block">
          <div className="w-16 h-1 bg-orange-500 mx-auto mb-4 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
          <div className="w-8 h-1 bg-neutral-800 mx-auto rounded-full" />
        </div>
        
        <p
          ref={topParagraphRef}
          className="text-neutral-400 leading-relaxed font-normal tracking-tight"
        >
          <span className="font-black text-3xl md:text-5xl text-white block mb-8 uppercase tracking-tighter italic">
            "A place of quiet contemplation"
          </span>
          
          <span className="block max-w-2xl mx-auto text-lg md:text-xl font-light text-neutral-300 mb-6">
            Where centuries of spiritual tradition meet contemporary design. The Prayer Chamber stands as a testament to the belief that architecture can elevate the human spirit.
          </span>
          
          <span className="block max-w-2xl mx-auto text-base text-neutral-500 font-light">
            Here, light dances across architectural lines and silence speaks in volumes. Every detail invites you into deeper reflection—this is a threshold between the mundane and the sacred.
          </span>

          <span className="block mt-12 text-sm font-bold text-orange-500 uppercase tracking-[0.4em]">
            — Designed for the soul —
          </span>
        </p>
      </div>

      {/* MIDDLE CONTENT - Orange visual divider */}
      <div className="flex-grow flex items-center justify-center w-full relative z-10 py-12">
        <div className="w-px h-32 bg-gradient-to-b from-transparent via-orange-500/30 to-transparent" />
      </div>

      {/* BOTTOM - TITLE SECTION */}
      <div className="relative z-10 w-full pb-16">
        {/* Background Large Text for Contrast */}
        <h2
          className="text-7xl md:text-9xl lg:text-[12rem] font-black tracking-tighter text-center text-white/[0.03] absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none select-none uppercase"
        >
          SACRED
        </h2>
        
        <div className="relative pt-12 md:pt-20">
          <h2
            ref={prayerTitleRef}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-center text-white uppercase italic"
          >
            The Prayer Chamber
          </h2>
          <div className="w-24 h-2 bg-orange-500 mx-auto mt-8 rounded-full shadow-xl shadow-orange-500/40" />
        </div>
      </div>

      {/* GLOBAL KEYFRAMES */}
      <style>{`
        @keyframes letterFadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeDown {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;800;900&display=swap');
      `}</style>
    </div>
  );
};

export default GuestHouseLayoutSection;