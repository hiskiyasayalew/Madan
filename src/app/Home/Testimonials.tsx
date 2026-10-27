"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";

const staticImages = [
  {
    id: 1,
    image: "/TestimonialDawitGetachewBg.png",
    cardImage: "/TestimonialCardImgDawit.jpg",
  },
  {
    id: 2,
    image: "/TestimonialTsadikuAbdoBg.png",
    cardImage: "/TestimonialCardImgTsadiku.jpg",
  },
  {
    id: 3,
    image: "/TestimonialMesfinMamoBg.png",
    cardImage: "/TestimonialCardImgMesfin.png",
  },
  {
    id: 4,
    image: "/TestimonialEndalkachewHawazBg.png",
    cardImage: "/TestimonialCardImgEnawa.png",
  },
];

export default function TravelSlider() {
  const { language } = useLanguage();
  const t = translations[language];
  
  // Create locations based on current language
  const createLocations = useCallback(() => {
    return t.testimonials.map((item, index) => ({
      ...item,
      ...staticImages[index],
    }));
  }, [t.testimonials]); // Re-create when testimonials change (which happens when language changes)

  const [data, setData] = useState(createLocations);

  // Update data when language changes
  useEffect(() => {
    setData(createLocations());
  }, [createLocations]);

  const activeItem = data[0];

  const handleNext = useCallback(() => {
    setData((prev) => {
      const newData = [...prev];
      const first = newData.shift();
      if (first) newData.push(first);
      return newData;
    });
  }, []);

  const handlePrev = useCallback(() => {
    setData((prev) => {
      const newData = [...prev];
      const last = newData.pop();
      if (last) newData.unshift(last);
      return newData;
    });
  }, []);

  const handleSelect = (id: number) => {
    const index = data.findIndex((item) => item.id === id);
    if (index === 0) return;

    setData((prev) => {
      const newData = [...prev];
      const part1 = newData.slice(index);
      const part2 = newData.slice(0, index);
      return [...part1, ...part2];
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 7000);

    return () => clearInterval(timer);
  }, [handleNext]);

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black font-sans text-white">
      {/* BACKGROUND */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeItem?.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            src={activeItem?.image}
            alt={activeItem?.title}
            className="h-full w-full object-cover brightness-[0.4]"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/20 to-transparent lg:from-black/80" />
        </motion.div>
      </AnimatePresence>

      {/* TEXT CONTENT */}
      <div className="relative z-10 flex h-full flex-col justify-end lg:justify-center landscape:justify-center px-6 sm:px-12 lg:px-24 pb-[280px] sm:pb-[350px] md:pb-[420px] lg:pb-0 landscape:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem?.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl landscape:max-w-[45%] lg:max-w-xl xl:max-w-3xl"
          >
            <div className="mb-4 flex items-center gap-3">
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: 30 }}
                className="h-[1px] bg-white/50"
              />
              {/* You can add location here if needed */}
            </div>

            <p className="mt-4 lg:mt-8 text-xs md:text-sm lg:text-2xl xl:text-3xl leading-relaxed text-white/70 
                          max-w-[320px] sm:max-w-md lg:max-w-xl xl:max-w-3xl
                          landscape:text-[15px] landscape:leading-tight landscape:max-w-[300px]">
              {activeItem?.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CARDS CONTAINER */}
      <div className="absolute bottom-8 sm:bottom-12 lg:bottom-16 xl:bottom-20 right-0 z-20 w-full pl-6 lg:pl-0 lg:w-[75%] 
                landscape:w-[50%] landscape:bottom-6">
        <div className="flex items-end gap-3 md:gap-5 lg:gap-6 overflow-visible landscape:gap-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {data.slice(1).map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                className="group relative flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-white/10 shadow-2xl
                           h-[160px] w-[110px] 
                           sm:h-[220px] sm:w-[160px]  
                           md:h-[280px] md:w-[190px] 
                           lg:h-[430px] lg:w-[300px] 
                           xl:h-[700px] xl:w-[460px]
                           landscape:h-[130px] landscape:w-[95px] landscape:sm:h-[250px] landscape:sm:w-[160px]"
                onClick={() => handleSelect(item.id)}
              >
                <img
                  src={item.cardImage}
                  alt={item.title}
                  className="absolute h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-95" />

                {/* NAME — ALWAYS BOTTOM LEFT */}
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-[10px] sm:text-sm md:text-xl lg:text-lg xl:text-sm font-normal leading-tight tracking-tight uppercase">
                    {item.title} {item.subtitle}
                  </h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}