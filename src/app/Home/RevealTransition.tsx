"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

interface RevealTransitionProps {
  testimonial: ReactNode;
  service: ReactNode;
}

export default function RevealTransition({ testimonial, service }: RevealTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"], // transition ends when testimonial scrolls away
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={containerRef} className="relative h-[100vh] w-screen">
      {/* Services pinned underneath */}
      <div className="sticky top-0 h-screen w-screen z-0">
        {service}
      </div>

      {/* Testimonial on top */}
      <motion.div
        className="sticky top-0 h-screen w-screen z-10"
        style={{ opacity }}
      >
        {testimonial}
      </motion.div>
    </section>
  );
}
