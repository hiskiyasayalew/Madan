"use client";

import { motion, useTransform, MotionValue, useSpring } from "framer-motion";

interface ServicesMaskProps {
  progress: MotionValue<number>;
}

export default function ServicesMask({ progress }: ServicesMaskProps) {
  const maxRadius = Math.sqrt(
    window.innerWidth ** 2 + window.innerHeight ** 2
  ) / 2;

  const holeRadiusRaw = useTransform(progress, [0, 1], [60, maxRadius]);
  const holeRadius = useSpring(holeRadiusRaw, { stiffness: 90, damping: 20 });

  const maskImage = useTransform(
    holeRadius,
    (radius: number) =>
      `radial-gradient(circle at center, transparent ${Math.round(
        radius
      )}px, black ${Math.round(radius) + 1}px)`
  );

  return (
    <section className="fixed w-screen h-screen">
      <div className="fixed top-0 w-full h-screen">
        {/* Video background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="sticky inset-0 w-full h-full object-cover z-0"
        >
          <source src="/Services-Mask.mp4" type="video/mp4" />
        </video>

        {/* White text underneath the mask */}
        <div className="absolute inset-0 flex flex-col items-start justify-end p-8 z-0">
            <p className="text-lg md:text-2xl font-light text-white">
            A Great
          </p>
          <h1 className="text-4xl md:text-9xl font-bold mb-2 text-white">
           LIGHT
          </h1>
          <p className="text-lg md:text-4xl font-light text-white">
           Cannot be Hidden
          </p>
        </div>

        {/* Mask overlay with black text */}
        <motion.div
          className="absolute inset-0 z-10 flex flex-col items-start justify-end p-8"
          style={{
            WebkitMaskImage: maskImage,
            maskImage: maskImage,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            WebkitMaskSize: "cover",
            maskSize: "cover",
            backgroundColor: "#f8f5e5ff", // the "mask" color that hides the video and white text
          }}
        >
              <p className="text-lg md:text-2xl font-light text-black">
            A Great
          </p>
          <h1 className="text-4xl md:text-9xl font-bold mb-2 text-black">
            LIGHT
          </h1>
           <p className="text-lg md:text-4xl font-light text-white">
           Cannot be Hidden
          </p>
        </motion.div>
      </div>
    </section>
  );
}
