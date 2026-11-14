
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";

const staticImages = [
  {
    id: 1,
    image: "/TestimonialDawitGetachewBg.webp",
    cardImage: "/TestimonialCardImgDawit.webp",
  },
  {
    id: 2,
    image: "/TestimonialTsadikuAbdoBg.webp",
    cardImage: "/TestimonialCardImgTsadiku.webp",
  },
  {
    id: 3,
    image: "/TestimonialMesfinMamoBg.webp",
    cardImage: "/TestimonialCardImgMesfin.webp",
  },
  {
    id: 4,
    image: "/TestimonialEndalkachewHawazBg.webp",
    cardImage: "/TestimonialCardImgEnawa.webp",
  },
];

const BACKGROUND_TRANSITION = {
  duration: 0.7,
  ease: "easeInOut" as const,
};

const CONTENT_TRANSITION = {
  duration: 0.7,
  ease: "easeOut" as const,
};

const CARD_TRANSITION = {
  duration: 0.6,
  ease: [0.25, 1, 0.5, 1] as const,
};

export default function TravelSlider() {
  const { language } = useLanguage();
  const t = translations[language];

  const prefersReducedMotion = useReducedMotion();

  // Create testimonial data only when the language changes.
  const baseData = useMemo(
    () =>
      t.testimonials.map((item, index) => ({
        ...item,
        ...staticImages[index],
      })),
    [t.testimonials]
  );

  // Store only the active index instead of repeatedly copying and
  // rearranging the entire testimonial array.
  const [carouselState, setCarouselState] = useState(() => ({
    source: t.testimonials,
    index: 0,
  }));

  // Automatically reset the carousel when the language changes.
  const activeIndex =
    carouselState.source === t.testimonials
      ? carouselState.index
      : 0;

  // Derive the current card order without additional state updates.
  const data = useMemo(() => {
    if (baseData.length === 0) return [];

    const normalizedIndex =
      ((activeIndex % baseData.length) + baseData.length) %
      baseData.length;

    return [
      ...baseData.slice(normalizedIndex),
      ...baseData.slice(0, normalizedIndex),
    ];
  }, [baseData, activeIndex]);

  const activeItem = data[0];

  // Advance to the next testimonial.
  const handleNext = useCallback(() => {
    if (baseData.length <= 1) return;

    setCarouselState((current) => {
      const currentIndex =
        current.source === t.testimonials ? current.index : 0;

      return {
        source: t.testimonials,
        index: (currentIndex + 1) % baseData.length,
      };
    });
  }, [baseData.length, t.testimonials]);

  // Return to the previous testimonial.
  const handlePrev = useCallback(() => {
    if (baseData.length <= 1) return;

    setCarouselState((current) => {
      const currentIndex =
        current.source === t.testimonials ? current.index : 0;

      return {
        source: t.testimonials,
        index:
          (currentIndex - 1 + baseData.length) %
          baseData.length,
      };
    });
  }, [baseData.length, t.testimonials]);

  // Select a testimonial directly from its card.
  const handleSelect = useCallback(
    (id: number) => {
      const selectedIndex = data.findIndex(
        (item) => item.id === id
      );

      if (selectedIndex <= 0) return;

      setCarouselState((current) => {
        const currentIndex =
          current.source === t.testimonials ? current.index : 0;

        return {
          source: t.testimonials,
          index:
            (currentIndex + selectedIndex) % baseData.length,
        };
      });
    },
    [data, baseData.length, t.testimonials]
  );

  // Autoplay with automatic cleanup.
  useEffect(() => {
    if (baseData.length <= 1) return;

    const timer = window.setInterval(() => {
      // Avoid unnecessary updates while the tab is in the background.
      if (document.visibilityState === "visible") {
        handleNext();
      }
    }, 7000);

    return () => {
      window.clearInterval(timer);
    };
  }, [handleNext, baseData.length]);

  // Respect the device's reduced-motion accessibility preference.
  const backgroundTransition = prefersReducedMotion
    ? { duration: 0 }
    : BACKGROUND_TRANSITION;

  const contentTransition = prefersReducedMotion
    ? { duration: 0 }
    : CONTENT_TRANSITION;

  const cardTransition = prefersReducedMotion
    ? { duration: 0 }
    : CARD_TRANSITION;

  if (!activeItem) return null;

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black font-sans text-white">

      {/* BACKGROUND */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeItem.id}
          initial={
            prefersReducedMotion
              ? false
              : { opacity: 0, scale: 1.05 }
          }
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={backgroundTransition}
          className="absolute inset-0 z-0"
        >
          <img
            src={activeItem.image}
            alt={activeItem.title}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable={false}
            className="h-full w-full object-cover brightness-[0.4]"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/20 to-transparent lg:from-black/80" />
        </motion.div>
      </AnimatePresence>

      {/* TEXT CONTENT */}
      <div className="relative z-10 flex h-full flex-col justify-end lg:justify-center landscape:justify-center px-6 sm:px-12 lg:px-24 pb-[280px] sm:pb-[350px] md:pb-[420px] lg:pb-0 landscape:pb-0">

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeItem.id}
            initial={
              prefersReducedMotion
                ? false
                : { y: 20, opacity: 0 }
            }
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={contentTransition}
            className="max-w-2xl landscape:max-w-[45%] lg:max-w-xl xl:max-w-3xl"
          >
            <div className="mb-4 flex items-center gap-3">

              <motion.span
                initial={
                  prefersReducedMotion
                    ? false
                    : { width: 0 }
                }
                animate={{ width: 30 }}
                transition={contentTransition}
                className="h-[1px] bg-white/50"
              />

            </div>

            <p
              className="mt-4 lg:mt-8 text-xs md:text-sm lg:text-2xl xl:text-3xl leading-relaxed text-white/70
                         max-w-[320px] sm:max-w-md lg:max-w-xl xl:max-w-3xl
                         landscape:text-[15px] landscape:leading-tight landscape:max-w-[300px]"
            >
              {activeItem.description}
            </p>

          </motion.div>
        </AnimatePresence>

      </div>

      {/* CARDS CONTAINER */}
      <div
        className="absolute bottom-8 sm:bottom-12 lg:bottom-16 xl:bottom-20 right-0 z-20 w-full pl-6 lg:pl-0 lg:w-[75%]
                   landscape:w-[50%] landscape:bottom-6"
      >

        <div className="flex items-end gap-3 md:gap-5 lg:gap-6 overflow-visible landscape:gap-3">

          <AnimatePresence mode="popLayout" initial={false}>

            {data.slice(1).map((item) => (

              <motion.div
                key={item.id}
                layout="position"
                initial={
                  prefersReducedMotion
                    ? false
                    : { opacity: 0, x: 50 }
                }
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={cardTransition}
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
                  loading="lazy"
                  decoding="async"
                  draggable={false}
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
