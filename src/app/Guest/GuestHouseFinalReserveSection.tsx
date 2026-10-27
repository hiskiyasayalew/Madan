import React from "react";
import Link from "next/link";

const GuestHouseFinalReserveSection: React.FC = () => {
  return (
    <section className="relative w-full h-screen flex items-center justify-center bg-neutral-950 overflow-hidden">

      {/* Background - Themed with Orange Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Soft Orange Glow from the center-bottom */}
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-orange-500/10 blur-[150px] opacity-60 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        

        <img
          src="/MADAN-White.png"
          alt="Logo"
          className="w-24 h-24 mb-12 object-contain"
        />

        <Link
          href="/reservation"
          className="px-14 py-5 text-[18px] font-black uppercase tracking-[0.2em] text-black bg-orange-500 rounded-xl hover:bg-orange-600 hover:scale-105 transition-all duration-300 cursor-pointer shadow-2xl shadow-orange-500/20"
        >
          Reserve Now
        </Link>
      </div>

      {/* Bottom Center Paragraph - Color Themed */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10 text-center w-full px-4">
        <p className="text-neutral-300 text-sm md:text-lg font-light tracking-[0.1em] uppercase">
          Experience the warmth of community and the peace of nature
        </p>
        <div className="flex items-center justify-center gap-4 mt-3">
          <div className="w-8 h-px bg-orange-500/30" />
          <p className="text-orange-500/80 text-xs md:text-sm font-bold tracking-[0.2em] uppercase">
            Book your stay today
          </p>
          <div className="w-8 h-px bg-orange-500/30" />
        </div>
      </div>
    </section>
  );
};

export default GuestHouseFinalReserveSection;