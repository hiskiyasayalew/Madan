"use client";
import React, { useEffect, useRef } from "react";
import { useLoading } from "../components/LoadingContext";
import { useTranslation } from "../../hooks/useTranslation";

const Hero = () => {
  const { setAssetLoaded } = useLoading();
  const videoRef = useRef<HTMLVideoElement>(null);
    const t = useTranslation();

    


  return (
    
    <section className="relative w-full h-screen overflow-hidden bg-black flex flex-col justify-end p-6 sm:p-10 md:p-12 lg:p-16 text-white">
      <video
  ref={videoRef}
  autoPlay
  muted
  loop
  playsInline
  preload="auto"
  className="absolute top-0 left-0 w-full h-full object-cover opacity-80"
  onCanPlay={() => {
    console.log("Hero video ready");
    setAssetLoaded(true);
  }}
  onError={() => {
    console.log("Video failed — continue");
    setAssetLoaded(true);
  }}
>
  <source src="/Hero.mp4" type="video/mp4" />
</video>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

      {/* NOISE OVERLAY - Fixed to use data URI so no 404 error */}
      <div 
        className="absolute inset-0 opacity-[0.12] pointer-events-none mix-blend-overlay" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` 
        }} 
      />
      
      <div className="relative z-10 w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-8 md:gap-10">
        <p className="max-w-[450px] text-[3.2vw] sm:text-lg md:text-xl font-light text-white/80 leading-relaxed">
           {t.heroVerse} <br/>
           {t.heroSubtitle}
        </p>
        <h1 className="relative text-[24vw] sm:text-[18vw] md:text-[20vw] font-normal text-[#FAF6E2] tracking-tighter leading-[0.8] select-none">
           {t.heroTitle}
            <span className="absolute top-0 m-auto text-[0.25em] align-top font-bold">
              <svg
                viewBox="0 0 28 23"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.8"
                className="w-[.8em] h-[.8em] text-[#F79520]"
              >
                <line x1="12" y1="2" x2="12" y2="22" />
                <line x1="5" y1="9" x2="19" y2="9" />
              </svg>
            </span>
          </h1>
        
      </div>
    </section>
  );
};



export default Hero;