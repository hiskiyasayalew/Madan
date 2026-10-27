import React from 'react';

const AboutFinale = () => {
  return (
    <section className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden">
      
      {/* 1. CENTERED LOGO */}
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 md:w-48 md:h-38 rounded-full flex items-center justify-center shadow-2xl">
          <span className="text-black font-black text-2xl uppercase tracking-widest">
            <img className='w-12' src="/MADAN-White.png" alt="Logo" /> 
          </span>
        </div>
        <p className="mt-8 text-white tracking-[0.5em] uppercase text-sm font-light">
          ESTABLISHED 1982
        </p>
      </div>

    </section>
  );
};

export default AboutFinale;