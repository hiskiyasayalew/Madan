import React, { useState } from "react";

const GuestHousePackages = () => {

  const packages = {
    single: {
      titleTop: "Solitary With",
      titleMain: "GOD",
      desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Impedit nobis magni, mollitia quo consequatur amet sapiente corrupti explicabo natus dignissimos? Aliquid similique minus corrupti a.",
      img: "/GuestHousePackageImg1.jpg"
    },
    group: {
      titleTop: "Together In",
      titleMain: "UNITY",
      desc: "Group retreats designed to build deeper spiritual connection through shared silence, prayer and reflection in nature.",
      img: "/GuestHousePackageIMG2.jpg"
    },
    culinary: {
      titleTop: "Sacred",
      titleMain: "MEALS",
      desc: "Experience traditional spiritual fasting meals prepared with intention, purity and care for your journey.",
      img: "/GuestHousePackageIMG3.jpg"
    },
    camp: {
      titleTop: "Nightly",
      titleMain: "FIRE",
      desc: "Camp fire evenings for deep reflection, storytelling and peaceful silence beneath the open sky.",
      img: "/GuestHousePackageIMG4.jpg"
    }
  };

  const [active, setActive] = useState<keyof typeof packages>("single");

  return (
    <div className="relative w-full h-screen overflow-hidden bg-neutral-900 text-white font-sans">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&display=swap');
        .font-oswald { font-family: 'Oswald', sans-serif; }
      `}</style>

      {Object.entries(packages).map(([key, value]) => (
        <div
          key={key}
          className={`absolute inset-0 z-0 transition-opacity duration-700 ease-in-out ${active === key ? "opacity-100" : "opacity-0"}`}
        >
          <img
            src={value.img}
            alt=""
            className="w-full h-full object-cover brightness-100 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/60" />
        </div>
      ))}

      <div className="relative z-10 w-full h-full flex flex-col md:flex-row">
        
        <div className="w-full md:w-1/3 h-full flex items-center pl-10 md:pl-24">
          <div className="flex flex-row gap-6 h-auto">
            <div className="w-[1px] bg-white/40 h-auto self-stretch my-2"></div>
            <div className="flex flex-col justify-center gap-8 py-4">
              <MenuItem text="SINGLE" onHover={() => setActive("single")} />
              <MenuItem text="GROUP" onHover={() => setActive("group")} />
              <MenuItem text="Culinary Services" onHover={() => setActive("culinary")} />
              <MenuItem text="CAMP FIRE" onHover={() => setActive("camp")} />
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/3 h-full flex flex-col justify-end items-end pb-16 pr-8 md:pr-20 text-right transition-all duration-700">
          
          <div className="flex flex-col items-end leading-none transition-all duration-700">
            <h2 className="font-oswald text-5xl md:text-7xl lg:text-6xl font-bold uppercase tracking-wide text-white drop-shadow-lg transition-all duration-700">
              {packages[active].titleTop}
            </h2>

            <h1 className="font-oswald text-8xl md:text-[10rem] lg:text-[8rem] font-bold text-[#ea8b2e] leading-[0.85] tracking-tight drop-shadow-2xl transition-all duration-700">
              {packages[active].titleMain}
            </h1>
          </div>

          <p className="mt-8 text-neutral-400 text-sm md:text-base max-w-lg leading-relaxed font-light text-center transition-all duration-700">
            {packages[active].desc}
          </p>

        </div>
      </div>
    </div>
  );
};

const MenuItem = ({ text, onHover }: { text: string, onHover: () => void }) => {
  return (
    <div
      onMouseEnter={onHover}
      className="group cursor-pointer"
    >
      <span className="text-xl md:text-2xl font-light tracking-wide text-white transition-all duration-300 group-hover:text-[#ea8b2e] group-hover:pl-2">
        {text}
      </span>
    </div>
  );
};

export default GuestHousePackages;