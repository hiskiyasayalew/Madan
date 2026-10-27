"use client";

import React from "react";
import { motion } from "framer-motion";

const Belt1 = () => {
  return (
    <section className="h-[4.5vh] w-full bg-[#2589ce] text-white overflow-hidden relative flex items-center justify-center">
      
      {/* 1. THE ORANGE BURST BACKGROUND (from previous design) */}
      <div className="absolute inset-0 z-0">
        {/* Top Right Orange Glow */}
        <div className="absolute -top-[10%] -right-[10%] w-[70%] h-[70%] bg-orange-600/30 blur-[120px] rounded-full" />
        {/* Bottom Left Subtle Purple Glow */}
        <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-purple-900/20 blur-[100px] rounded-full" />
        {/* Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* BELT TEXT */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center w-full px-2 sm:px-4"
      >
        <p className="text-black/80 text-[0.6rem] xs:text-[0.7rem] sm:text-xs md:text-sm lg:text-base font-medium uppercase flex flex-wrap items-center justify-center gap-1">
          <span className="font-bold whitespace-nowrap">psalms 23:1</span> 
          <span className="tracking-[.1em] text-[0.55rem] xs:text-[0.65rem] sm:text-[0.7rem] md:text-xs lg:text-sm truncate max-w-[90%] sm:max-w-full">
            The Lord is my shepherd; I shall not want
          </span>
        </p>
      </motion.div>
    </section>
  );
};

export default Belt1;