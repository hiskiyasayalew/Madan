
"use client";

import {
  motion,
  useTransform,
  MotionValue,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { useEffect } from "react";

interface ServicesMaskProps {
  progress: MotionValue<number>;
}

export default function ServicesMask({ progress }: ServicesMaskProps) {
  const maxRadius = useMotionValue(0);

  useEffect(() => {
    const updateMaxRadius = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      maxRadius.set(Math.hypot(width, height) / 2);
    };

    updateMaxRadius();

    window.addEventListener("resize", updateMaxRadius, {
      passive: true,
    });

    return () => {
      window.removeEventListener("resize", updateMaxRadius);
    };
  }, [maxRadius]);

  const holeRadiusRaw = useTransform(() => {
  const currentProgress = progress.get();
  const radius = maxRadius.get();

  return 60 + currentProgress * (radius - 60);
});

  const holeRadius = useSpring(holeRadiusRaw, {
    stiffness: 90,
    damping: 20,
  });

  const maskImage = useTransform(holeRadius, (radius) => {
    const roundedRadius = Math.round(radius);

    return `radial-gradient(circle at center, transparent ${roundedRadius}px, black ${roundedRadius + 1}px)`;
  });

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
            backgroundColor: "#f8f5e5ff",
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
