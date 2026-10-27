import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const PACKAGES = [
  {
    title: "Musical Instruments",
    description: "Enhance our worship experience by providing high-quality instruments. Your contribution helps us purchase keyboards, drum sets, and sound systems to lift our voices in praise.",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070", // Replace with your assets
  },
  {
    title: "Church Construction",
    description: "Help us build a sanctuary that stands as a testament to faith. These funds go directly toward raw materials and labor for our ongoing architectural projects.",
    image: "https://images.unsplash.com/photo-1433621462029-3b22bc047f3b?q=80&w=2071",
  },
  {
    title: "Church Equipments",
    description: "From seating to lighting and air conditioning, we aim to make the House of God a comfortable place for all congregants to gather and meditate.",
    image: "https://images.unsplash.com/photo-1545042746-ec9e5a59b359?q=80&w=1974",
  },
  {
    title: "Guest House Support",
    description: "Our guest houses provide refuge and hospitality for visiting ministers and traveling believers. Support the maintenance and hospitality services of these facilities.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070",
  },
  {
    title: "Other Projects",
    description: "A general fund that allows us to respond to urgent needs, community outreach, and administrative essentials that keep our mission moving forward.",
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070",
  },
];

const DonatePackages = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={containerRef} className="relative h-[500vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* BACKGROUND IMAGES LAYER */}
        {PACKAGES.map((pkg, index) => {
          // Calculate opacity for background: fades in and out based on 20% increments
          const start = index / PACKAGES.length;
          const end = (index + 1) / PACKAGES.length;
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const opacity = useTransform(scrollYProgress, 
            [start, start + 0.05, end - 0.05, end], 
            [0, 1, 1, 0]
          );

          return (
            <motion.div
              key={`bg-${index}`}
              style={{ opacity }}
              className="absolute inset-0 z-0"
            >
              <img
                src={pkg.image}
                alt={pkg.title}
                className="w-full h-full object-cover scale-105"
              />
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/60" />
            </motion.div>
          );
        })}

        {/* CONTENT LAYER */}
        <div className="relative z-10 flex h-full items-center justify-center px-6">
          <div className="max-w-4xl w-full text-center relative h-[400px]">
            
            {PACKAGES.map((pkg, index) => {
              const start = index / PACKAGES.length;
              const end = (index + 1) / PACKAGES.length;
              
              // Text Fade In/Out logic
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const opacity = useTransform(scrollYProgress, 
                [start + 0.02, start + 0.08, end - 0.08, end - 0.02], 
                [0, 1, 1, 0]
              );

              return (
                <motion.div
                  key={`text-${index}`}
                  style={{ opacity }}
                  className="absolute inset-0 flex flex-col items-center justify-center"
                >
                  <span className="text-[#F79520] font-bold tracking-[0.3em] uppercase mb-4 text-sm md:text-base">
                    Package 0{index + 1}
                  </span>
                  
                  <h2 className="text-white text-5xl md:text-7xl font-bold mb-6">
                    {pkg.title.toUpperCase()}
                  </h2>
                  
                  <div className="w-24 h-1 bg-[#F79520] mb-8" />
                  
                  <p className="text-white/80 text-lg md:text-xl max-w-2xl leading-relaxed">
                    {pkg.description}
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-10 px-8 py-3 bg-[#F79520] text-white font-bold rounded-sm uppercase tracking-widest text-sm transition-colors hover:bg-white hover:text-black"
                  >
                    Select Amount
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* SIDE PROGRESS INDICATOR (Optional) */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20 hidden md:flex">
          {PACKAGES.map((_, index) => {
            const start = index / PACKAGES.length;
            const end = (index + 1) / PACKAGES.length;
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const scaleY = useTransform(scrollYProgress, [start, end], [0.3, 1]);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const color = useTransform(scrollYProgress, 
                [start, start + 0.05, end - 0.05, end], 
                ["#444", "#F79520", "#F79520", "#444"]
            );

            return (
              <motion.div 
                key={`indicator-${index}`}
                style={{ scaleY, backgroundColor: color }}
                className="w-1 h-12 origin-center"
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DonatePackages;