"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";

interface VisionProps {
  preloaderCompleted: boolean;
}

export default function Vision({ preloaderCompleted }: VisionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

 const { language } = useLanguage();
const t = translations[language];

const titleFirst = t.faithStatement.titleFirst;
const titleSecond = t.faithStatement.titleSecond;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && preloaderCompleted) {
          setIsAnimatingOut(false);
          setIsVisible(true);
        } else if (!entry.isIntersecting && isVisible) {
          setIsAnimatingOut(true);
          setTimeout(() => {
            setIsVisible(false);
            setIsAnimatingOut(false);
          }, 600);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [preloaderCompleted, isVisible]);

const pdfUrl =
  language === "am"
    ? "https://icrrweaqbyspmhgffwpl.supabase.co/storage/v1/object/public/documents/faith-statement-am.pdf"
    : "https://icrrweaqbyspmhgffwpl.supabase.co/storage/v1/object/public/documents/faith-statement-en.pdf";

  return (
    <motion.section
      ref={ref}
      className="relative w-full min-h-screen flex items-center justify-center bg-[#FFFFFF] overflow-hidden px-6"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Content Container */}
      <div className="z-20 flex flex-col justify-center items-center text-center w-full">
        <div className="max-w-4xl flex flex-col items-center relative">

          {/* Title */}
          <div className="overflow-hidden">
            {isVisible && (
              <div className="flex flex-col items-center">

                {/* Faith */}
                <div className="flex justify-center">
                  {titleFirst.split("").map((char, index) => (
                    <motion.span
                      key={`first-${index}`}
                      initial={{ y: "100%", opacity: 0 }}
                      animate={
                        isAnimatingOut
                          ? { y: "100%", opacity: 0 }
                          : { y: "0%", opacity: 1 }
                      }
                      transition={{
                        duration: 0.6,
                        ease: [0.33, 1, 0.68, 1],
                        delay: isAnimatingOut
                          ? (titleFirst.length - 1 - index) * 0.03
                          : index * 0.03,
                      }}
                      className="inline-block text-black font-black font-normal text-4xl sm:text-5xl md:text-5xl leading-[0.7] uppercase"
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>

                {/* Statement */}
                <div className="flex justify-center mt-2 md:mt-4">
                  {titleSecond.split("").map((char, index) => (
                    <motion.span
                      key={`second-${index}`}
                      initial={{ y: "100%", opacity: 0 }}
                      animate={
                        isAnimatingOut
                          ? { y: "100%", opacity: 0 }
                          : { y: "0%", opacity: 1 }
                      }
                      transition={{
                        duration: 0.6,
                        ease: [0.33, 1, 0.68, 1],
                        delay: isAnimatingOut
                          ? (titleSecond.length - 1 - index) * 0.03 + 0.3
                          : index * 0.03 + 0.3,
                      }}
                      className="inline-block text-black font-black text-4xl sm:text-5xl md:text-6xl leading-none uppercase"
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Orange Line */}
          <motion.div
            initial={{ width: 0 }}
            animate={isVisible && !isAnimatingOut ? { width: "100px" } : { width: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="h-[4px] bg-[#F79520] mt-6 mb-8"
          />

          {/* Paragraph */}
         <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={
            isVisible && !isAnimatingOut
              ? { y: 0, opacity: 1 }
              : { y: 20, opacity: 0 }
          }
          transition={{
            duration: 0.7,
            ease: [0.33, 1, 0.68, 1],
            delay: 1,
          }}
          className="text-black/80 font-light text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto"
        >
          {t.faithStatement.description}
        </motion.p>

          {/* PDF Download Button - Bottom center of section */}
          <a
          href={pdfUrl}
          download
          target="_blank"
          rel="noopener noreferrer"
        >
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              isVisible && !isAnimatingOut
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.8 }
            }
            transition={{
              duration: 0.5,
              delay: 1.3,
              ease: [0.33, 1, 0.68, 1],
            }}
            
            className="mt-12 bg-[#F79520] hover:bg-[#e08610] text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#F79520] focus:ring-offset-2"
            aria-label="Download PDF"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </motion.button>
          </a>
        </div>
      </div>
    </motion.section>
  );
}