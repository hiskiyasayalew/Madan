
"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ImageWithFallbackProps {
  src: string;
  fallback: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: "eager" | "lazy";
}

// Optimized image component with fallback and loading transition.
const ImageWithFallback = ({
  src,
  fallback,
  alt,
  className = "",
  style,
  loading = "lazy",
}: ImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleError = () => {
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
      setIsLoaded(false);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#0c0c0c] animate-pulse flex items-center justify-center">
          <div className="text-neutral-700 font-mono text-xs tracking-widest uppercase">
            Loading backdrop...
          </div>
        </div>
      )}

      <img
        src={imgSrc}
        alt={alt}
        loading={loading}
        decoding="async"
        draggable={false}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={`${className} transition-opacity duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={style}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

const ServiceIntroduction = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [scrollWidth, setScrollWidth] = useState(0);
  const [zoomImageSrc, setZoomImageSrc] = useState(
    "/HomePageServiceIntroBg.webp"
  );

  const resizeFrameRef = useRef<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // --------------------------------------------------
  // RESPONSIVE HORIZONTAL SCROLL MEASUREMENT
  // --------------------------------------------------

  useEffect(() => {
    const element = scrollRef.current;

    if (!element) return;

    const updateWidth = () => {
      if (resizeFrameRef.current !== null) {
        window.cancelAnimationFrame(resizeFrameRef.current);
      }

      resizeFrameRef.current = window.requestAnimationFrame(() => {
        const currentElement = scrollRef.current;

        if (currentElement) {
          const nextWidth = Math.max(
            0,
            currentElement.scrollWidth - window.innerWidth
          );

          setScrollWidth((current) =>
            current === nextWidth ? current : nextWidth
          );
        }

        resizeFrameRef.current = null;
      });
    };

    const resizeObserver = new ResizeObserver(updateWidth);

    resizeObserver.observe(element);

    window.addEventListener("resize", updateWidth, {
      passive: true,
    });

    window.addEventListener("orientationchange", updateWidth, {
      passive: true,
    });

    // Initial measurement.
    updateWidth();

    return () => {
      resizeObserver.disconnect();

      window.removeEventListener("resize", updateWidth);
      window.removeEventListener("orientationchange", updateWidth);

      if (resizeFrameRef.current !== null) {
        window.cancelAnimationFrame(resizeFrameRef.current);
        resizeFrameRef.current = null;
      }
    };
  }, []);

  // --------------------------------------------------
  // STAGE 1: ZOOM PARALLAX
  // --------------------------------------------------

  const zoomEnd = 0.4;

  const bgScale = useTransform(
    scrollYProgress,
    [0, zoomEnd],
    [1, 1.25]
  );

  const bgOpacity = useTransform(
    scrollYProgress,
    [zoomEnd * 0.8, zoomEnd],
    [1, 0]
  );

  const windowWidth = useTransform(
    scrollYProgress,
    [0, zoomEnd],
    ["40vh", "100vw"]
  );

  const windowHeight = useTransform(
    scrollYProgress,
    [0, zoomEnd],
    ["40vh", "100vh"]
  );

  const windowBorderRadius = useTransform(
    scrollYProgress,
    [0, zoomEnd * 0.9, zoomEnd],
    ["40px", "20px", "0px"]
  );

  const innerImageScale = useTransform(
    scrollYProgress,
    [0, zoomEnd],
    [1.8, 1]
  );

  // --------------------------------------------------
  // STAGE 2: HORIZONTAL SLIDE
  // --------------------------------------------------

  const x = useTransform(
    scrollYProgress,
    [zoomEnd, 1],
    [0, -scrollWidth]
  );

  // Reuse the scroll indicator motion value instead of
  // creating a new transform inside JSX.
  const scrollIndicatorOpacity = useTransform(
    scrollYProgress,
    [0, zoomEnd * 0.35],
    [1, 0]
  );

  // --------------------------------------------------
  // ZOOM IMAGE FALLBACK
  // --------------------------------------------------

  const handleZoomImageError = () => {
    setZoomImageSrc((current) =>
      current === "/HomePageServiceIntroBg.webp"
        ? "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=2000&auto=format&fit=crop"
        : current
    );
  };

  return (
    <section
      ref={containerRef}
      className="relative h-[950vh] bg-[#050505]"
    >
      {/* STICKY VIEWPORT CONTAINER */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center touch-action-pan-y">

        {/* BACKGROUND LAYER */}
        <motion.div
          style={{
            scale: bgScale,
            opacity: bgOpacity,
          }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <ImageWithFallback
            src="/HomePageServiceIntroBg1.webp"
            fallback="https://images.unsplash.com/photo-1544084944-15269ec7b5a0?q=80&w=2000&auto=format&fit=crop"
            alt="Nature Background"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </motion.div>

        {/* HORIZONTAL MOVING STRIP */}
        <motion.div
          ref={scrollRef}
          style={{ x }}
          className="flex flex-nowrap h-full w-max relative z-10 will-change-transform"
        >

          {/* ==========================================
              CARD 1: THE ZOOM WINDOW
          ========================================== */}

          <div className="w-screen min-w-[100vw] h-screen flex-shrink-0 flex items-center justify-center relative bg-transparent">

            <motion.div
              style={{
                width: windowWidth,
                height: windowHeight,
                borderRadius: windowBorderRadius,
              }}
              className="overflow-hidden flex items-center justify-center origin-center relative border border-white/5"
            >

              <motion.img
                style={{ scale: innerImageScale }}
                src={zoomImageSrc}
                onError={handleZoomImageError}
                alt="Central Focus"
                loading="eager"
                decoding="async"
                draggable={false}
                className="w-full h-full object-cover"
              />

              {/* SCROLL-DOWN INDICATOR */}
              <div className="absolute inset-x-0 bottom-12 flex justify-center pointer-events-none z-20">

                <motion.div
                  style={{ opacity: scrollIndicatorOpacity }}
                  className="flex flex-col items-center gap-2"
                >

                  <div className="h-10 w-6 border-2 border-white/30 rounded-full flex justify-center p-1 animate-bounce">
                    <div className="h-2 w-1.5 bg-white rounded-full" />
                  </div>

                </motion.div>

              </div>

            </motion.div>

          </div>

          {/* ==========================================
              CARD 2: AUDIOVISUAL
          ========================================== */}

          <div className="w-screen min-w-[100vw] h-screen flex-shrink-0 relative bg-[#050505] overflow-hidden">

            <div className="absolute inset-0 z-0 hidden lg:block">
              <ImageWithFallback
                src="/AudioVisiualServiceSection.webp"
                fallback="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2000&auto=format&fit=crop"
                alt="Audiovisual Production Setup"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute inset-0 z-0 block lg:hidden">
              <ImageWithFallback
                src="/AUDIOVISUAL CARD-Portrait.webp"
                fallback="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop"
                alt="Audiovisual Production Setup"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute bottom-12 left-8 z-10 block lg:hidden">
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-2xl uppercase">
                Audiovisual
              </h2>
            </div>

          </div>

          {/* ==========================================
              CARD 3: KIDS
          ========================================== */}

          <div className="w-screen min-w-[100vw] h-screen flex-shrink-0 relative bg-[#050505] overflow-hidden">

            <div className="absolute inset-0 z-0 hidden lg:block">
              <ImageWithFallback
                src="/Service Page - KIDS.webp"
                fallback="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=2000&auto=format&fit=crop"
                alt="Sunday School Kids Ministry"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute inset-0 z-0 block lg:hidden">
              <ImageWithFallback
                src="/KIDS CARD-Portrait.webp"
                fallback="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=1200&auto=format&fit=crop"
                alt="Sunday School Kids Ministry"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute bottom-12 left-8 z-10 block lg:hidden">
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-2xl uppercase">
                Kids
              </h2>
            </div>

          </div>

          {/* ==========================================
              CARD 4: PRAYER
          ========================================== */}

          <div className="w-screen min-w-[100vw] h-screen flex-shrink-0 relative bg-[#050505] overflow-hidden">

            <div className="absolute inset-0 z-0 hidden lg:block">
              <ImageWithFallback
                src="/Service Page-11.webp"
                fallback="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?q=80&w=2000&auto=format&fit=crop"
                alt="Prayer and Meditation Service Team"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute inset-0 z-0 block lg:hidden">
              <ImageWithFallback
                src="/PRAYER CARD-Portrait 2.webp"
                fallback="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?q=80&w=1200&auto=format&fit=crop"
                alt="Prayer and Meditation Service Team"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute bottom-12 left-8 z-10 block lg:hidden">
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-2xl uppercase">
                Prayer
              </h2>
            </div>

          </div>

          {/* ==========================================
              CARD 5: YOUTH
          ========================================== */}

          <div className="w-screen min-w-[100vw] h-screen flex-shrink-0 relative bg-[#050505] overflow-hidden">

            <div className="absolute inset-0 z-0 hidden lg:block">
              <ImageWithFallback
                src="/ServicesPageYouth.webp"
                fallback="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2000&auto=format&fit=crop"
                alt="Active Youth Fellowship Band"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute inset-0 z-0 block lg:hidden">
              <ImageWithFallback
                src="/YOUTH CARD-Portrait.webp"
                fallback="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop"
                alt="Active Youth Fellowship Band"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute bottom-12 left-8 z-10 block lg:hidden">
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-2xl uppercase">
                Youth
              </h2>
            </div>

          </div>

        </motion.div>

        {/* BOTTOM NAVIGATION - KEPT COMMENTED */}
        {/*
          <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center px-4">
            ...
          </div>
        */}

      </div>
    </section>
  );
};

export default ServiceIntroduction;
