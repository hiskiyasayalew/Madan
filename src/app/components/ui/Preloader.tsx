"use client";

import { useEffect, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useLoading } from "../LoadingContext";

export default function Preloader({
  children,
}: {
  children: ReactNode;
}) {
  const { isAssetLoaded, setAssetLoaded } = useLoading();

  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    // Always remove preloader after max 4s
    const forceOpen = setTimeout(() => {
      console.log("Force opening site");
      setAssetLoaded(true);
      setShowPreloader(false);
    }, 4000);

    // If assets load naturally, wait minimum branding time
    if (isAssetLoaded) {
      const timer = setTimeout(() => {
        setShowPreloader(false);
      }, 2000);

      return () => {
        clearTimeout(timer);
        clearTimeout(forceOpen);
      };
    }

    return () => clearTimeout(forceOpen);
  }, [isAssetLoaded, setAssetLoaded]);

  return (
    <>
      <AnimatePresence mode="wait">
  {showPreloader && (
    <motion.div
      key="preloader"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="fixed inset-0 z-[99999] bg-black flex items-center justify-center"
    >
      {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
            delay: 0.2,
          }}
          className="relative w-20 h-20"
        >
          <Image
            src="/MADAN-White.png"
            alt="Logo"
            fill
            priority
            className="object-contain"
          />
        </motion.div>

      {/* Sound text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1 }}
        className="absolute bottom-10 left-0 w-full text-center"
      >
        <p className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-white/80 font-light">
          Sound on for best experience
        </p>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showPreloader ? 0 : 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="bg-black min-h-screen"
          >
            {children}
          </motion.div>
    </>
  );
}