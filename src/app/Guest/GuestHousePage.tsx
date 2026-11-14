
"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";

const GuestHousePage = () => {
  /* ---------------- Smooth Scrolling ---------------- */

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) =>
        Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let animationFrameId = 0;
    let isActive = true;

    const raf = (time: number) => {
      if (!isActive) return;

      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    };

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      isActive = false;
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-montserrat">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800&display=swap');

        .font-montserrat {
          font-family: 'Montserrat', sans-serif !important;
        }

        /* FLUID FONT SIZES */

        .retreat-text-logic {
          font-size: clamp(2.5rem, 8vw, 6rem);
        }

        .description-text {
          font-size: clamp(0.875rem, 1.1vw, 1.125rem);
        }

        .cta-text {
          font-size: clamp(0.75rem, 1vw, 1rem);
        }

        .btn-text {
          font-size: clamp(0.7rem, 1vw, 1rem);
        }

        /* DEFAULT: HORIZONTAL LAYOUT */

        .glass-side {
          width: 50%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .retreat-side {
          width: 50%;
          height: 100%;
          top: 0;
          right: 0;
        }

        .bg-grad-logic {
          background: linear-gradient(
            to right,
            rgba(0, 0, 0, 0.3),
            transparent,
            rgba(0, 0, 0, 0.3)
          );
        }

        .divider-logic {
          display: block;
        }

        /* VERTICAL LAYOUT: SMALL WIDTH + PORTRAIT */

        @media (max-width: 1023px) and (orientation: portrait) {
          .glass-side {
            width: 100%;
            height: 50%;
            top: 0;
            left: 0;
          }

          .retreat-side {
            width: 100%;
            height: 50%;
            top: 50%;
            left: 0;
          }

          .bg-grad-logic {
            background: linear-gradient(
              to bottom,
              rgba(0, 0, 0, 0.3),
              transparent,
              rgba(0, 0, 0, 0.3)
            );
          }

          .divider-logic {
            display: none;
          }

          .text-container-logic {
            align-items: center !important;
            text-align: center !important;
          }

          .cta-logic {
            margin-left: auto !important;
            margin-right: auto !important;
          }

          .retreat-text-logic {
            font-size: clamp(3rem, 15vw, 7rem) !important;
            transform: translateY(-10%);
          }
        }

        /* EXTRA SMALL DEVICES */

        @media (max-width: 360px) and (orientation: portrait) {
          .retreat-text-logic {
            font-size: 2.5rem !important;
            transform: translateY(-5%) !important;
          }

          .description-text {
            font-size: 0.75rem !important;
            max-width: 90% !important;
          }

          .btn-text {
            font-size: 0.65rem !important;
            padding: 0.5rem 1rem !important;
          }

          .logo-small {
            width: 1.5rem !important;
            height: 1.5rem !important;
          }

          .glass-side .absolute.bottom-0 {
            padding: 1rem !important;
          }

          .glass-side .absolute.bottom-0 div {
            max-width: 90% !important;
          }
        }

        /* ENTRANCE ANIMATIONS */

        .subtitle-reveal {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 1s ease forwards 0.8s;
          will-change: opacity, transform;
        }

        .glass-reveal {
          opacity: 0;
          animation: fadeIn 1s ease forwards 0.2s;
          will-change: opacity;
        }

        .image-reveal {
          opacity: 0;
          transform: scale(1.1);
          animation: imageReveal 1.2s ease forwards 0.3s;
          will-change: opacity, transform;
        }

        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }

          100% {
            opacity: 1;
          }
        }

        @keyframes imageReveal {
          0% {
            opacity: 0;
            transform: scale(1.1);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* ACCESSIBILITY */

        @media (prefers-reduced-motion: reduce) {
          .subtitle-reveal,
          .glass-reveal,
          .image-reveal {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            will-change: auto !important;
          }

          .image-reveal {
            transform: scale(1) !important;
          }

          * {
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      {/* SVG MASK */}

      <svg
        className="absolute w-0 h-0"
        aria-hidden="true"
      >
        <defs>
          <mask
            id="cutout-mask"
            maskUnits="objectBoundingBox"
            maskContentUnits="objectBoundingBox"
          >
            <rect
              width="1"
              height="1"
              fill="white"
            />

            <text
              x="0.5"
              y="0.43"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="black"
              fontWeight="800"
              style={{
                fontSize: "0.14px",
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              YOUR
            </text>

            <text
              x="0.5"
              y="0.57"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="black"
              fontWeight="800"
              style={{
                fontSize: "0.14px",
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              HOLY
            </text>
          </mask>
        </defs>
      </svg>

      {/* BACKGROUND IMAGE */}

      <div className="absolute inset-0 w-full h-full z-0 image-reveal">
        <img
          src="/GuestHouseHero3.webp"
          alt="Guest House Landscape"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-grad-logic" />
      </div>

      {/* RETREAT SECTION */}

      <div className="retreat-side absolute z-20 flex items-center justify-center pointer-events-none">
        <h1 className="retreat-text-logic text-white font-bold leading-none tracking-tighter">
          RETREAT
        </h1>
      </div>

      {/* GLASS PANEL SECTION */}

      <div className="glass-side absolute z-10">
        <div
          className="absolute inset-0 w-full h-full glass-reveal"
          style={{
            backdropFilter: "blur(24px) saturate(150%)",
            WebkitBackdropFilter: "blur(24px) saturate(150%)",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            mask: "url(#cutout-mask)",
            WebkitMask: "url(#cutout-mask)",
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
          }}
        />

        <div className="divider-logic hidden lg:block absolute right-0 top-0 h-full w-[1px] bg-white/20" />

        {/* DESCRIPTION AND LOGO */}

        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none p-8 sm:p-12 lg:p-20">
          {/* LOGO */}

          <div className="pointer-events-auto mb-4">
            <img
              src="/MADAN-GuestHouseLogo.png"
              alt="MADAN Guest House Logo"
              width={48}
              height={48}
              loading="eager"
              decoding="async"
              className="w-8 h-8 lg:w-12 lg:h-12 object-contain logo-small"
            />
          </div>

          {/* DESCRIPTION */}

          <div className="description-text subtitle-reveal text-white max-w-xs lg:max-w-md drop-shadow-lg leading-relaxed pointer-events-auto text-left">
            Travel leaves you speechless and then makes you a storyteller.
            Experience serenity, architecture.
          </div>
        </div>
      </div>

      {/* RESERVE NOW BUTTON */}

      <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 z-40 pointer-events-auto">
        <button
          type="button"
          className="btn-text px-8 py-3 lg:px-12 lg:py-4 font-bold text-black bg-white hover:bg-neutral-100 transition-all duration-300 cursor-pointer rounded-lg shadow-2xl uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-black"
        >
          Reserve Now
        </button>
      </div>
    </div>
  );
};

export default GuestHousePage;
