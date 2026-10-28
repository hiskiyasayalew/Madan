
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

/* ---------------- Reveal Animations ---------------- */

const rainContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.3,
    },
  },
};

const rainItem: Variants = {
  hidden: { opacity: 0, y: -20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

type RoomKey =
  | "bedroomA"
  | "bedroomB"
  | "bedroomCTop"
  | "bedroomCBottom"
  | "hall"
  | "balcony"
  | "kitchen";

type RoomProps = {
  id: RoomKey;
  label: string;
  className?: string;
  onClick?: (id: RoomKey) => void;
  children?: React.ReactNode;
};

type LabeledBlockProps = {
  label: string;
  className?: string;
};

/* ---------------- Room Info ---------------- */

const ROOM_INFO: Record<RoomKey, string> = {
  bedroomA:
    "Primary guest bedroom featuring a triple-bed configuration, premium linens, and integrated storage solutions for long-term stays.",
  bedroomB:
    "Secondary guest suite optimized for shared occupancy, featuring high ceilings and easy access to the main restroom facilities.",
  bedroomCTop:
    "The Grand Family Suite. Our largest sleeping area designed with a master layout and additional bedding for children or groups.",
  bedroomCBottom:
    "Executive Double Room. A compact yet highly functional space designed for comfort and flexible furniture arrangements.",
  hall:
    "The heart of the house. A spacious communal area designed for relaxation, group activities, and seamless circulation between wings.",
  balcony:
    "An expansive open-air transition zone. Perfect for morning coffee, evening relaxation, and providing natural cross-ventilation.",
  kitchen:
    "A fully equipped culinary space featuring modern appliances, prep surfaces, and essential utilities for guest meal preparation.",
};

/* ---------------- Modal ---------------- */

const RoomModal = ({
  room,
  onClose,
}: {
  room: RoomKey | null;
  onClose: () => void;
}) => (
  <AnimatePresence>
    {room && (
      <motion.div
        className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-neutral-900 rounded-3xl overflow-hidden w-full max-w-md shadow-2xl border border-orange-500/30"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-2 bg-orange-500 w-full" />

          <div className="p-8">
            <h2 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">
              {room.replace(/([A-Z])/g, " $1").trim()}
            </h2>

            <div className="w-12 h-1 bg-orange-500 mb-6 rounded-full" />

            <p className="text-neutral-300 leading-relaxed text-lg font-light italic">
              &quot;{ROOM_INFO[room]}&quot;
            </p>

            <button
              onClick={onClose}
              className="mt-8 w-full py-4 bg-orange-500 hover:bg-orange-600 text-black rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-500/20"
            >
              Back to Plan
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ---------------- Room Component ---------------- */

const Room = ({
  id,
  label,
  className = "",
  onClick,
  children,
}: RoomProps) => {
  return (
    <motion.div
      variants={rainItem}
      whileHover={{ scale: 1.02, zIndex: 10 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick?.(id)}
      className={`group relative cursor-pointer border-2 border-black bg-orange-500 rounded-xl flex items-center justify-center text-xs md:text-sm font-black text-black shadow-[0_4px_20px_rgba(249,115,22,0.1)] hover:shadow-[0_10px_30px_rgba(249,115,22,0.4)] transition-all duration-300 overflow-hidden ${className}`}
    >
      <span className="z-10 text-center px-2 uppercase tracking-tighter">
        {label}
      </span>

      {children}
    </motion.div>
  );
};

/* ---------------- High Contrast Bed Components ---------------- */

const BedStyle =
  "bg-black border border-neutral-800 rounded-sm shadow-lg flex items-start justify-center pt-1";

const Pillow = () => (
  <div className="w-1/2 h-1 bg-neutral-700 rounded-full" />
);

const HorizontalBed = ({ className }: { className: string }) => (
  <motion.div
    variants={rainItem}
    className={`absolute ${className} ${BedStyle}`}
  >
    <Pillow />
  </motion.div>
);

const VerticalBed = ({ className }: { className: string }) => (
  <motion.div
    variants={rainItem}
    className={`absolute ${className} ${BedStyle} flex-col items-center pt-0 pl-1`}
  >
    <div className="w-1 h-1/2 bg-neutral-700 rounded-full" />
  </motion.div>
);

const BedsBedroomA = () => (
  <>
    <HorizontalBed className="top-2 left-2 w-16 h-8" />
    <VerticalBed className="bottom-2 left-2 w-8 h-16" />
    <VerticalBed className="bottom-2 right-2 w-8 h-16" />
  </>
);

const BedsBedroomB = () => (
  <>
    <HorizontalBed className="top-2 right-2 w-16 h-8" />
    <VerticalBed className="bottom-2 left-2 w-8 h-16" />
    <VerticalBed className="bottom-2 right-2 w-8 h-16" />
  </>
);

const BedsBedroomCTop = () => (
  <>
    <HorizontalBed className="top-2 left-4 w-20 h-10" />
    <HorizontalBed className="top-2 right-4 w-20 h-10" />
    <VerticalBed className="bottom-4 right-2 w-10 h-16" />
  </>
);

const BedsBedroomCBottom = () => (
  <>
    <HorizontalBed className="top-4 left-4 w-24 h-10" />
    <HorizontalBed className="bottom-4 left-4 w-24 h-10" />
  </>
);

/* ---------------- Bathroom & Utility Blocks ---------------- */

const Bathroom = ({ label, className = "" }: LabeledBlockProps) => (
  <div
    className={`border-2 border-black bg-neutral-900 text-orange-500 rounded-xl flex items-center justify-center text-[10px] md:text-xs font-black uppercase tracking-widest ${className}`}
  >
    {label}
  </div>
);

const UtilityBlock = ({ label, className = "" }: LabeledBlockProps) => (
  <div
    className={`border-2 border-black bg-orange-600 text-black rounded-xl flex items-center justify-center text-[10px] md:text-xs font-black uppercase tracking-widest ${className}`}
  >
    {label}
  </div>
);

/* ---------------- Stats Dashboard ---------------- */

const Counter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const step = value / (duration / 16);

    const timer = setInterval(() => {
      start += step;

      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}</span>;
};

const StatsSection = () => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const statsData = [
    { label: "Kitchens", value: 2 },
    { label: "Bedrooms", value: 4 },
    { label: "Bathrooms", value: 4 },
    { label: "Total Beds", value: 20 },
  ];

  useEffect(() => {
    const element = sectionRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="w-[90%] max-w-6xl m-auto mt-20 mb-20 p-8 bg-neutral-900 rounded-[2.5rem] border border-neutral-800 shadow-2xl"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => (
          <div key={stat.label} className="text-center p-6">
            <div className="text-5xl font-black text-orange-500 mb-2">
              {hasAnimated ? <Counter value={stat.value} /> : 0}
            </div>

            <p className="font-bold text-neutral-500 uppercase tracking-widest text-[10px]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- Main Layout ---------------- */

export default function GuestHouseLayout() {
  const [selectedRoom, setSelectedRoom] = useState<RoomKey | null>(null);

  return (
    <div className="min-h-screen bg-neutral-950 py-16 px-4">
      <RoomModal
        room={selectedRoom}
        onClose={() => setSelectedRoom(null)}
      />

      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <div className="overflow-x-auto pb-12 scrollbar-hide">
          <motion.div
            className="min-w-[1000px] lg:min-w-0 p-10 bg-black rounded-[3rem] border-2 border-neutral-900 shadow-[0_0_100px_rgba(0,0,0,1)]"
            variants={rainContainer}
            initial="hidden"
            whileInView="show"
          >
            {/* Grid Layout */}

            <div className="grid grid-cols-12 gap-3">
              {/* Left Wing */}

              <div className="col-span-4 grid grid-cols-2 gap-3">
                <Room
                  id="bedroomA"
                  label="Bedroom A"
                  className="h-44"
                  onClick={setSelectedRoom}
                >
                  <BedsBedroomA />
                </Room>

                <Room
                  id="bedroomB"
                  label="Bedroom B"
                  className="h-44"
                  onClick={setSelectedRoom}
                >
                  <BedsBedroomB />
                </Room>

                <Room
                  id="kitchen"
                  label="Service Kitchen"
                  className="h-20 bg-orange-600"
                  onClick={setSelectedRoom}
                />

                <Bathroom label="Bath A" className="h-20" />

                <div className="col-span-2">
                  <Bathroom
                    label="Outdoor Restroom"
                    className="h-16 w-full"
                  />
                </div>
              </div>

              {/* Center */}

              <Room
                id="hall"
                label="Main Gathering Hall"
                className="col-span-4 h-full min-h-[340px]"
                onClick={setSelectedRoom}
              />

              {/* Right Wing */}

              <div className="col-span-4 grid grid-cols-3 gap-3">
                <Room
                  id="bedroomCTop"
                  label="Bedroom C"
                  className="col-span-3 h-44"
                  onClick={setSelectedRoom}
                >
                  <BedsBedroomCTop />
                </Room>

                <Room
                  id="bedroomCBottom"
                  label="Bedroom D"
                  className="col-span-2 h-32"
                  onClick={setSelectedRoom}
                >
                  <BedsBedroomCBottom />
                </Room>

                <div className="col-span-1 grid grid-rows-2 gap-3">
                  <Bathroom label="Bath C" />
                  <Bathroom label="Bath B" />
                </div>
              </div>
            </div>

            {/* Bottom Row */}

            <div className="grid grid-cols-12 gap-3 mt-3">
              <UtilityBlock
                label="Main Kitchen"
                className="col-span-2 h-32"
              />

              <Room
                id="balcony"
                label="Open Air Balcony"
                className="col-span-8 h-32 bg-orange-400 border-dashed border-black/30"
                onClick={setSelectedRoom}
              />

              <div className="col-span-2 h-32 bg-neutral-900 border-2 border-neutral-800 rounded-xl flex items-center justify-center text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                Storage
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <StatsSection />
    </div>
  );
}
