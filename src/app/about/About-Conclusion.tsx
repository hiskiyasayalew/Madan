import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../lib/translations';

const AboutConclusion = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden bg-white">
      
      {/* 1. BACKGROUND IMAGE - Desktop (default) */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat hidden md:block"
        style={{ 
          backgroundImage: "url('/AboutTreeImg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
      </div>

      {/* 1. BACKGROUND IMAGE - Mobile (smaller devices only) */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat md:hidden"
        style={{ 
          backgroundImage: "url('/AboutTreeImg-Phone.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
      </div>

      {/* 2. OVERLAY TEXT (Bottom Right) */}
      <div className="relative h-full w-full flex flex-col justify-end items-end p-8 md:p-16 lg:p-24 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-right"
        >
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-gray-400 leading-[0.85] uppercase tracking-tighter font-['Montserrat']">
            {t.aboutConclusion.byHisGrace}
          </h2>
          <h2 className="mt-2 text-4xl md:text-7xl lg:text-8xl font-black text-orange-400 leading-[0.85] uppercase tracking-tighter font-['Montserrat']">
            {t.aboutConclusion.weAreHere}
          </h2>
        </motion.div>
      </div>

      {/* Bottom black line */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-black z-20"></div>
      
    </section>
  );
};

export default AboutConclusion;