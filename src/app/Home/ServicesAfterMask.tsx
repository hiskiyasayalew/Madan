"use client";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ServicesAfterMask() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // --- AUDIOVISUAL ---
  const logoX = useTransform(scrollYProgress, [0, 0.25, 0.35], ["0%", "11vw", "11vw"]);
  const logoY = useTransform(scrollYProgress, [0, 0.25, 0.35], ["0%", "0%", "-5vh"]);
  const logoScale = useTransform(scrollYProgress, [0, 0.25, 0.35], [1, 1, 1.25]);
  const audiovisualOpacity = useTransform(scrollYProgress, [0.05, 0.15, 0.3, 0.4], [0, 1, 1, 0]);
  const audiovisualBlur = useTransform(scrollYProgress, [0, 0.05, 0.15, 0.3, 0.4], [
    "blur(0px)",
    "blur(8px)",
    "blur(0px)",
    "blur(0px)",
    "blur(8px)",
  ]);
  const firstLogoOpacity = useTransform(scrollYProgress, [0, 0.3, 0.4], [1, 1, 0]);

  // --- BACKGROUNDS ---
  const bgOpacity1 = useTransform(scrollYProgress, [0, 0.1, 0.3, 0.4], [0, 1, 1, 0]);
  const bgBlur1 = useTransform(scrollYProgress, [0, 0.1, 0.3, 0.4], [
    "blur(20px)",
    "blur(0px)",
    "blur(0px)",
    "blur(20px)",
  ]);

  const bgOpacity3 = useTransform(scrollYProgress, [0.4, 0.5, 0.65, 0.75], [0, 1, 1, 0]);
  const bgBlur3 = useTransform(scrollYProgress, [0.4, 0.5, 0.65, 0.75], [
    "blur(20px)",
    "blur(0px)",
    "blur(0px)",
    "blur(20px)",
  ]);

  const bgOpacity4 = useTransform(scrollYProgress, [0.75, 0.85, 0.95, 1.0], [0, 1, 1, 0]);
  const bgBlur4 = useTransform(scrollYProgress, [0.75, 0.85, 0.95, 1.0], [
    "blur(20px)",
    "blur(0px)",
    "blur(0px)",
    "blur(20px)",
  ]);

  const bgOpacityPrayer = useTransform(scrollYProgress, [0.9, 1.0, 1.15], [0, 1, 0]);
  const bgBlurPrayer = useTransform(scrollYProgress, [0.9, 1.0, 1.15], [
    "blur(20px)",
    "blur(0px)",
    "blur(20px)",
  ]);

  // --- OTHER LOGOS ---
  const otherOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const otherBlur = useTransform(scrollYProgress, [0, 0.2], ["blur(0px)", "blur(20px)"]);

  // --- KIDS ---
  const kidsOpacity = useTransform(scrollYProgress, [0.4, 0.5, 0.65, 0.75], [0, 1, 1, 0]);
  const kidsBlur = useTransform(scrollYProgress, [0.4, 0.5, 0.65, 0.75], [
    "blur(8px)",
    "blur(0px)",
    "blur(0px)",
    "blur(8px)",
  ]);
  const kidsLogoX = useTransform(scrollYProgress, [0.4, 0.5, 0.65], ["0%", "0%", "-10%"]);
  const kidsLogoY = useTransform(scrollYProgress, [0.4, 0.5, 0.65], ["0%", "0%", "-65%"]);
  const kidsLogoScale = useTransform(scrollYProgress, [0.4, 0.5, 0.65], [1, 1, 1.2]);
  const kidsLogoOpacity = useTransform(scrollYProgress, [0.4, 0.5, 0.65, 0.75], [0, 1, 1, 0]);
  const kidsLogoBlur = useTransform(scrollYProgress, [0.4, 0.5, 0.65, 0.75], [
    "blur(20px)",
    "blur(0px)",
    "blur(0px)",
    "blur(20px)",
  ]);

  // --- YOUTH ---
  const youthOpacity = useTransform(scrollYProgress, [0.75, 0.85, 0.95, 1.0], [0, 1, 1, 0]);
  const youthBlur = useTransform(scrollYProgress, [0.75, 0.85, 0.95, 1.0], [
    "blur(8px)",
    "blur(0px)",
    "blur(0px)",
    "blur(8px)",
  ]);
  const youthLogoX = useTransform(scrollYProgress, [0.75, 0.85, 0.95], ["0%", "0%", "-10%"]);
  const youthLogoY = useTransform(scrollYProgress, [0.75, 0.85, 0.95], ["0%", "0%", "-65%"]);
  const youthLogoScale = useTransform(scrollYProgress, [0.75, 0.85, 0.95], [1, 1, 1.2]);
  const youthLogoOpacity = useTransform(scrollYProgress, [0.75, 0.85, 0.95, 1.0], [0, 1, 1, 0]);
  const youthLogoBlur = useTransform(scrollYProgress, [0.75, 0.85, 0.95, 1.0], [
    "blur(20px)",
    "blur(0px)",
    "blur(0px)",
    "blur(20px)",
  ]);

  // --- BLACK FADE (Kids -> Youth) ---
  const blackFade1 = useTransform(scrollYProgress, [0.7, 0.75, 0.8], [0, 1, 0]);

  // --- BLACK FADE (Youth -> Prayer) ---
  const blackFade2 = useTransform(scrollYProgress, [0.9, 0.95, 1.0], [0, 1, 0]);

  // --- PRAYER ---
// --- PRAYER ---
const prayerOpacity = useTransform(scrollYProgress, [0.95, 1.0, 1.1], [0, 1, 0]);
const prayerBlur = useTransform(scrollYProgress, [0.95, 1.0, 1.1], [
  "blur(8px)",
  "blur(0px)",
  "blur(8px)",
]);

const prayerLogoX = useTransform(scrollYProgress, [0.95, 1.0, 1.1], ["0%", "0%", "-10%"]);
const prayerLogoY = useTransform(scrollYProgress, [0.95, 1.0, 1.1], ["0%", "0%", "-65%"]);
const prayerLogoScale = useTransform(scrollYProgress, [0.95, 1.0, 1.1], [1, 1, 1.2]);
const prayerLogoOpacity = useTransform(scrollYProgress, [0.95, 1.0, 1.1], [0, 1, 0]);
const prayerLogoBlur = useTransform(scrollYProgress, [0.95, 1.0, 1.1], [
  "blur(20px)",
  "blur(0px)",
  "blur(20px)",
]);



  return (
    <section ref={containerRef} className="relative w-full h-[1300vh] bg-black">
      {/* BACKGROUNDS */}
      <motion.div
        className="fixed inset-0 w-full h-full z-0"
        style={{
          backgroundImage: "url('/AudioVisiualServiceSection.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: bgOpacity1,
          filter: bgBlur1,
        }}
      />
      <motion.div
        className="fixed inset-0 w-full h-full z-0"
        style={{
          backgroundImage: "url('/Kids.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: bgOpacity3,
          filter: bgBlur3,
        }}
      />
      <motion.div
        className="fixed inset-0 w-full h-full z-0"
        style={{
          backgroundImage: "url('/YouthService.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: bgOpacity4,
          filter: bgBlur4,
        }}
      />
      <motion.div
        className="fixed inset-0 w-full h-full z-0"
        style={{
          backgroundImage: "url('/PrayerServiceSection.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: bgOpacityPrayer,
          filter: bgBlurPrayer,
        }}
      />

      {/* BLACK FADE LAYERS */}
      <motion.div className="fixed inset-0 bg-black z-20" style={{ opacity: blackFade1 }} />
      <motion.div className="fixed inset-0 bg-black z-20" style={{ opacity: blackFade2 }} />

      {/* Logos + titles */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center z-30">
        <div className="flex items-center justify-center gap-12 z-10">
          {/* Audiovisual logo */}
          <motion.div
            style={{
              x: logoX,
              y: logoY,
              scale: logoScale,
              opacity: firstLogoOpacity,
              filter: audiovisualBlur,
            }}
          >
            <Image src="/MADAN-Audiovisual.png" alt="Audiovisual Logo" width={40} height={40} />
          </motion.div>

          {/* Other small logos */}
          <motion.div style={{ opacity: otherOpacity, filter: otherBlur }}>
            <Image src="/MADAN-Kids.png" alt="Kids Small Logo" width={40} height={40} />
          </motion.div>
          <motion.div style={{ opacity: otherOpacity, filter: otherBlur }}>
            <Image src="/MADAN-White.png" alt="White Logo" width={40} height={40} />
          </motion.div>
          <motion.div style={{ opacity: otherOpacity, filter: otherBlur }}>
            <Image src="/MADAN-Prayer.png" alt="Prayer Logo" width={40} height={40} />
          </motion.div>
          <motion.div style={{ opacity: otherOpacity, filter: otherBlur }}>
            <Image src="/MADAN-Youth.png" alt="Youth Small Logo" width={40} height={40} />
          </motion.div>

          {/* Kids logo */}
          <motion.div
            style={{
              x: kidsLogoX,
              y: kidsLogoY,
              scale: kidsLogoScale,
              opacity: kidsLogoOpacity,
              filter: kidsLogoBlur,
              position: "absolute",
            }}
          >
            <Image src="/MADAN-Kids.png" alt="Kids Logo" width={40} height={40} />
          </motion.div>

          {/* Prayer logo */}
          <motion.div
            style={{
              x: prayerLogoX,
              y: prayerLogoY,
              scale: prayerLogoScale,
              opacity: prayerLogoOpacity,
              filter: prayerLogoBlur,
              position: "absolute",
            }}
          >
            <Image src="/MADAN-Prayer.png" alt="Prayer Logo" width={40} height={40} />
          </motion.div>

          {/* Youth logo */}
          <motion.div
            style={{
              x: youthLogoX,
              y: youthLogoY,
              scale: youthLogoScale,
              opacity: youthLogoOpacity,
              filter: youthLogoBlur,
              position: "absolute",
            }}
          >
            <Image src="/MADAN-Youth.png" alt="Youth Logo" width={40} height={40} />
          </motion.div>
        </div>

        {/* Titles */}
        <motion.h1
          className="text-4xl md:text-8xl font-bold mb-2 text-white fixed bottom-10 left-8"
          style={{ opacity: audiovisualOpacity, filter: audiovisualBlur }}
        >
          AUDIOVISUAL
        </motion.h1>

        <motion.h1
          className="text-4xl md:text-8xl font-bold mb-2 text-white fixed bottom-10 left-8"
          style={{ opacity: kidsOpacity, filter: kidsBlur }}
        >
          KIDS
        </motion.h1>

        <motion.h1
          className="text-4xl md:text-8xl font-bold mb-2 text-white fixed bottom-10 left-8"
          style={{ opacity: youthOpacity, filter: youthBlur }}
        >
          YOUTH
        </motion.h1>

        <motion.h1
          className="text-4xl md:text-8xl font-bold mb-2 text-white absolute bottom-10 left-8"
          style={{ opacity: prayerOpacity, filter: prayerBlur }}
        >
          PRAYER
        </motion.h1>
      </div>
    </section>
  );
}
