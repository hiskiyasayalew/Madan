
"use client";

import React, { useCallback, useEffect, useState } from "react";

/* ---------------- Types ---------------- */

type PackageKey = "single" | "group" | "culinary" | "camp";

type PackageInfo = {
  titleTop: string;
  titleMain: string;
  desc: string;
  img: string;
};

/* ---------------- Package Data ---------------- */

const PACKAGES: Record<PackageKey, PackageInfo> = {
  single: {
    titleTop: "Solitary With",
    titleMain: "GOD",
    desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Impedit nobis magni, mollitia quo consequatur amet sapiente corrupti explicabo natus dignissimos? Aliquid similique minus corrupti a.",
    img: "/GuestHousePackageImg1.webp",
  },

  group: {
    titleTop: "Together In",
    titleMain: "UNITY",
    desc: "Group retreats designed to build deeper spiritual connection through shared silence, prayer and reflection in nature.",
    img: "/GuestHousePackageIMG2.webp",
  },

  culinary: {
    titleTop: "Sacred",
    titleMain: "MEALS",
    desc: "Experience traditional spiritual fasting meals prepared with intention, purity and care for your journey.",
    img: "/GuestHousePackageIMG3.webp",
  },

  camp: {
    titleTop: "Nightly",
    titleMain: "FIRE",
    desc: "Camp fire evenings for deep reflection, storytelling and peaceful silence beneath the open sky.",
    img: "/GuestHousePackageIMG4.webp",
  },
};

const MENU_ITEMS: { key: PackageKey; text: string }[] = [
  { key: "single", text: "SINGLE" },
  { key: "group", text: "GROUP" },
  { key: "culinary", text: "Culinary Services" },
  { key: "camp", text: "CAMP FIRE" },
];

/* ---------------- Menu Item ---------------- */

type MenuItemProps = {
  text: string;
  active: boolean;
  onSelect: () => void;
};

const MenuItem = ({
  text,
  active,
  onSelect,
}: MenuItemProps) => {
  return (
    <button
      type="button"
      onMouseEnter={onSelect}
      onFocus={onSelect}
      onClick={onSelect}
      aria-pressed={active}
      className={`group cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ea8b2e] focus-visible:ring-offset-4 focus-visible:ring-offset-transparent rounded-sm ${
        active ? "text-[#ea8b2e]" : "text-white"
      }`}
    >
      <span
        className={`block text-xl md:text-2xl font-light tracking-wide transition-all duration-300 ${
          active
            ? "text-[#ea8b2e] pl-2"
            : "text-white group-hover:text-[#ea8b2e] group-hover:pl-2"
        }`}
      >
        {text}
      </span>
    </button>
  );
};

/* ---------------- Main Component ---------------- */

const GuestHousePackages = () => {
  const [active, setActive] = useState<PackageKey>("single");

  const [loadedImages, setLoadedImages] = useState<
    Partial<Record<PackageKey, boolean>>
  >({});

  const activePackage = PACKAGES[active];

  /* ---------------- Image Preloading ---------------- */

  useEffect(() => {
    let isMounted = true;

    MENU_ITEMS.forEach(({ key }) => {
      const image = new window.Image();

      image.src = PACKAGES[key].img;

      image.onload = () => {
        if (isMounted) {
          setLoadedImages((previous) => ({
            ...previous,
            [key]: true,
          }));
        }
      };

      image.onerror = () => {
        if (isMounted) {
          setLoadedImages((previous) => ({
            ...previous,
            [key]: false,
          }));
        }
      };
    });

    return () => {
      isMounted = false;
    };
  }, []);

  /* ---------------- Package Selection ---------------- */

  const handleSelect = useCallback((key: PackageKey) => {
    setActive((current) => (current === key ? current : key));
  }, []);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="relative w-full h-screen min-h-[600px] overflow-hidden bg-neutral-900 text-white font-sans">
      {/* Background Images */}

      <div className="absolute inset-0 z-0">
        {MENU_ITEMS.map(({ key }) => (
          <div
            key={key}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              active === key ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden="true"
          >
            <img
              src={PACKAGES[key].img}
              alt=""
              loading={key === "single" ? "eager" : "lazy"}
              decoding="async"
              className="w-full h-full object-cover brightness-100 contrast-125"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/60" />
          </div>
        ))}
      </div>

      {/* Main Content */}

      <div className="relative z-10 w-full h-full flex flex-col md:flex-row">
        {/* Left Navigation */}

        <div className="w-full md:w-1/3 h-full flex items-center pl-10 md:pl-24">
          <div className="flex flex-row gap-6 h-auto">
            <div className="w-[1px] bg-white/40 h-auto self-stretch my-2" />

            <nav
              aria-label="Guest house packages"
              className="flex flex-col justify-center gap-8 py-4"
            >
              {MENU_ITEMS.map(({ key, text }) => (
                <MenuItem
                  key={key}
                  text={text}
                  active={active === key}
                  onSelect={() => handleSelect(key)}
                />
              ))}
            </nav>
          </div>
        </div>

        {/* Right Content */}

        <div className="w-full md:w-2/3 h-full flex flex-col justify-end items-end pb-16 pr-8 md:pr-20 text-right">
          <div
            key={active}
            className={`flex flex-col items-end leading-none ${
              prefersReducedMotion
                ? ""
                : "animate-[packageReveal_600ms_ease-out_both]"
            }`}
          >
            <h2 className="font-oswald text-5xl md:text-7xl lg:text-6xl font-bold uppercase tracking-wide text-white drop-shadow-lg transition-all duration-700">
              {activePackage.titleTop}
            </h2>

            <h1 className="font-oswald text-8xl md:text-[10rem] lg:text-[8rem] font-bold text-[#ea8b2e] leading-[0.85] tracking-tight drop-shadow-2xl transition-all duration-700">
              {activePackage.titleMain}
            </h1>
          </div>

          <p
            key={`${active}-description`}
            className={`mt-8 text-neutral-400 text-sm md:text-base max-w-lg leading-relaxed font-light text-center ${
              prefersReducedMotion
                ? ""
                : "animate-[packageReveal_600ms_ease-out_100ms_both]"
            }`}
          >
            {activePackage.desc}
          </p>
        </div>
      </div>

      {/* Animation Styles */}

      <style jsx>{`
        @keyframes packageReveal {
          from {
            opacity: 0;
            transform: translateY(15px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default GuestHousePackages;
