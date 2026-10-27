import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ArrowUpRight, 
  Sliders, 
  Volume2, 
  Activity, 
  Zap, 
  Play, 
  Pause, 
  RefreshCw, 
  Smile, 
  Shield, 
  Heart, 
  Sparkles, 
  Send, 
  Compass, 
  Clock, 
  Disc, 
  Info, 
  MapPin, 
  Flame, 
  Award, 
  Radio, 
  Music, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight 
} from "lucide-react";
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../lib/translations';

// ==========================================
// 1. TYPES & DATA STRUCTURES
// ==========================================
export interface Service {
  id: string;
  titleKey: string;
  taglineKey: string;
  descKey: string;
  longKeys: string[];
  accent: string;
  cardImg: string;
  bgImg: string;
}

export const SERVICES: Service[] = [
  {
    id: "audiovisual",
    titleKey: "servicesPage.audiovisualTitle",
    taglineKey: "servicesPage.audiovisualTagline",
    descKey: "servicesPage.audiovisualDesc",
    longKeys: ["servicesPage.audiovisualLong1", "servicesPage.audiovisualLong2", "servicesPage.audiovisualLong3"],
    accent: "#a1a1aa",
    cardImg: "/AUDIOVISUAL CARD-Portrait.jpg",
    bgImg: "/AUDIOVISUAL CARD-Landscape.jpg",
  },
  {
    id: "kids",
    titleKey: "servicesPage.kidsTitle",
    taglineKey: "servicesPage.kidsTagline",
    descKey: "servicesPage.kidsDesc",
    longKeys: ["servicesPage.kidsLong1", "servicesPage.kidsLong2", "servicesPage.kidsLong3"],
    accent: "#f59e0b",
    cardImg: "/KIDS CARD-Portrait.jpg",
    bgImg: "/KIDS CARD-Landscape.jpg",
  },
  {
    id: "prayer",
    titleKey: "servicesPage.prayerTitle",
    taglineKey: "servicesPage.prayerTagline",
    descKey: "servicesPage.prayerDesc",
    longKeys: ["servicesPage.prayerLong1", "servicesPage.prayerLong2", "servicesPage.prayerLong3"],
    accent: "#3b82f6",
    cardImg: "/PRAYER CARD-Portrait 1.jpg",
    bgImg: "/PRAYER CARD-Landscape.jpg",
  },
  {
    id: "youth",
    titleKey: "servicesPage.youthTitle",
    taglineKey: "servicesPage.youthTagline",
    descKey: "servicesPage.youthDesc",
    longKeys: ["servicesPage.youthLong1", "servicesPage.youthLong2", "servicesPage.youthLong3"],
    accent: "#ef4444",
    cardImg: "YOUTH CARD-Portrait.jpg",
    bgImg: "YOUTH CARD-Landscape.jpg",
  },
];

// Helper function to get nested translation values
function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => current?.[key], obj) || '';
}

// ==========================================
// 2. SUB-COMPONENTS
// ==========================================

// --- service card component ---
interface ServiceCardProps {
  key?: string;
  service: Service;
  onClick: () => void;
  index: number;
  t: any;
}

function ServiceCard({ service, onClick, index, t }: ServiceCardProps) {
  const title = getNestedValue(t, service.titleKey);
  const tagline = getNestedValue(t, service.taglineKey);
  const description = getNestedValue(t, service.descKey);

  // Map service IDs to their logo filenames
  const getLogoFileName = (id: string) => {
    switch (id) {
      case "audiovisual":
        return "MADAN-Audiovisual.png";
      case "kids":
        return "MADAN-Kids.png";
      case "prayer":
        return "MADAN-Prayer.png";
      case "youth":
        return "MADAN-Youth.png";
      default:
        return `${id}-logo.png`;
    }
  };

  return (
    <motion.div
      id={`service-card-${service.id}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
      whileHover="hover"
      className="relative group h-[400px] md:h-[500px] lg:h-[580px] overflow-hidden rounded-3xl cursor-pointer bg-zinc-950/70 border border-white/5 shadow-2xl transition-all duration-500 hover:border-white/15 hover:shadow-[0_0_50px_rgba(255,255,255,0.08)]"
      style={{
        borderLeft: `3px solid ${service.accent}`
      }}
    >
      <motion.div className="absolute inset-0 z-0 transition-transform duration-1000 group-hover:scale-105">
        <img 
          src={service.cardImg}
          alt={title} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-1000" 
        />
      </motion.div>

      <div className="absolute inset-0 z-10 p-6 md:p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 rounded-xl bg-zinc-850/80 border border-white/10 flex items-center justify-center overflow-hidden backdrop-blur-sm">
            <img 
              src={`/${getLogoFileName(service.id)}`}
              alt={`${title} logo`}
              className="w-full h-full object-contain p-1"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const fallback = document.createElement('span');
                  fallback.className = 'text-white font-bold text-lg';
                  fallback.textContent = title.charAt(0);
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
          
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-md bg-black/60 group-hover:bg-white group-hover:text-black hover:scale-105 transition-all duration-300 shadow-lg">
            <ArrowUpRight size={15} />
          </div>
        </div>

        <div>
          <span 
            className="text-[9px] tracking-[0.4em] uppercase font-black mb-1.5 block font-mono" 
            style={{ color: service.accent }}
          >
            {tagline}
          </span>
          <h2 className="text-3xl font-bold uppercase tracking-tighter text-white mb-2 font-display drop-shadow-lg">
            {title}
          </h2>

          <motion.div 
            variants={{
              hover: { width: "100%", opacity: 1 }
            }}
            initial={{ width: "0%", opacity: 0 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="h-[1px] my-2.5 origin-left"
            style={{ backgroundColor: service.accent }}
          />

          <p className="text-xs text-zinc-300 line-clamp-2 md:line-clamp-3 leading-relaxed font-light mt-1 drop-shadow-lg">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// --- mobile stacked viewer ---
interface MobileStackedPortalProps {
  services: Service[];
  onSelect: (id: string) => void;
  t: any;
}

function MobileStackedPortal({ services, onSelect, t }: MobileStackedPortalProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % services.length);
  };

  const prevCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + services.length) % services.length);
  };

  const handleCardTap = (index: number, id: string) => {
    if (index === activeIndex) {
      onSelect(id);
    } else {
      setActiveIndex(index);
    }
  };

  // Map service IDs to their logo filenames
  const getLogoFileName = (id: string) => {
    switch (id) {
      case "audiovisual":
        return "MADAN-Audiovisual.png";
      case "kids":
        return "MADAN-Kids.png";
      case "prayer":
        return "MADAN-Prayer.png";
      case "youth":
        return "MADAN-Youth.png";
      default:
        return `${id}-logo.png`;
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[75vh] px-4 py-4 w-full select-none overflow-hidden">
      <div className="text-center mb-1">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/5 text-[9px] font-mono tracking-widest text-zinc-400 uppercase">
          <Sparkles size={11} className="text-amber-400 animate-pulse" /> {t.servicesPage.tapFrontCard}
        </span>
      </div>

      <div className="relative w-full max-w-[320px] aspect-[4/5] flex items-center justify-center h-[380px] mt-2 landscape:h-[300px] landscape:max-h-[300px]">
        {services.map((service, index) => {
          const total = services.length;
          const relativePos = (index - activeIndex + total) % total;
          const isFront = relativePos === 0;
          const title = getNestedValue(t, service.titleKey);
          const tagline = getNestedValue(t, service.taglineKey);
          const description = getNestedValue(t, service.descKey);
          
          const scale = 1 - relativePos * 0.05;
          const yOffset = relativePos * 20; 
          const zIndex = total - relativePos;
          const opacity = 1 - relativePos * 0.22;

          return (
            <motion.div
              key={service.id}
              onClick={() => handleCardTap(index, service.id)}
              animate={{
                scale,
                y: yOffset,
                zIndex,
                opacity,
              }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 24,
              }}
              style={{ originY: "bottom" }}
              className={`absolute top-0 w-full h-full rounded-2xl overflow-hidden cursor-pointer shadow-2xl border ${
                isFront ? "border-white/10" : "border-white/5"
              } bg-zinc-950 flex flex-col justify-between p-6 landscape:p-4`}
            >
              <div className="absolute inset-0 z-0">
                <img 
                  src={service.cardImg}
                  alt={title} 
                  className={`w-full h-full object-cover transition-all duration-300 ${isFront ? "opacity-45" : "opacity-20 grayscale"}`} 
                />
              </div>

              <div className="relative z-10 flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-zinc-900/90 border border-white/10 backdrop-blur overflow-hidden flex items-center justify-center landscape:w-8 landscape:h-8">
                  <img 
                    src={`/${getLogoFileName(service.id)}`}
                    alt={`${title} logo`}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const fallback = document.createElement('span');
                        fallback.className = 'text-white font-bold text-sm';
                        fallback.textContent = title.charAt(0);
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                </div>
                {isFront && (
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="px-3 py-1 rounded-full bg-white text-black font-semibold text-[8px] tracking-widest uppercase flex items-center gap-1 shadow-lg landscape:px-2 landscape:py-0.5 landscape:text-[7px]"
                  >
                    {t.servicesPage.enterSpace} <ArrowRight size={10} className="landscape:w-[8px] landscape:h-[8px]" />
                  </motion.div>
                )}
              </div>

              <div className="relative z-10 space-y-1 landscape:space-y-0">
                <span className="text-[8px] tracking-[0.25em] uppercase font-mono block font-bold landscape:text-[7px]" style={{ color: service.accent }}>
                  {tagline}
                </span>
                <h3 className="text-3xl font-extrabold uppercase tracking-tighter text-white font-display landscape:text-2xl drop-shadow-lg">
                  {title}
                </h3>
                
                {isFront && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[11px] text-zinc-300 font-light leading-relaxed pt-1.5 line-clamp-3 landscape:text-[10px] landscape:line-clamp-2 drop-shadow-lg"
                  >
                    {description}
                  </motion.p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-6 mt-6 w-full max-w-[280px] landscape:mt-3 landscape:gap-4">
        <button
          onClick={prevCard}
          className="w-11 h-11 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-400 hover:text-white flex items-center justify-center shadow-lg cursor-pointer focus:outline-none transition-colors landscape:w-9 landscape:h-9"
          title="Previous Service"
        >
          <ChevronLeft size={20} className="landscape:w-[16px] landscape:h-[16px]" />
        </button>

        <div className="flex gap-1.5 items-center">
          {services.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === activeIndex ? "w-6" : "w-1.5"
              } landscape:h-1 landscape:w-4 landscape:${idx === activeIndex ? "w-4" : "w-1"}`}
              style={{ backgroundColor: idx === activeIndex ? services[idx].accent : "#27272a" }}
            />
          ))}
        </div>

        <button
          onClick={nextCard}
          className="w-11 h-11 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-400 hover:text-white flex items-center justify-center shadow-lg cursor-pointer focus:outline-none transition-colors landscape:w-9 landscape:h-9"
          title="Next Service"
        >
          <ChevronRight size={20} className="landscape:w-[16px] landscape:h-[16px]" />
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 3. MAIN COMPONENT
// ==========================================

export default function App() {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const activeService = SERVICES.find((s) => s.id === selectedId);

  const handleServiceSelect = (id: string) => {
    setSelectedId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToMenu = () => {
    setSelectedId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get translated text for active service
  const getActiveTitle = () => activeService ? getNestedValue(t, activeService.titleKey) : '';
  const getActiveTagline = () => activeService ? getNestedValue(t, activeService.taglineKey) : '';
  const getActiveDesc = () => activeService ? getNestedValue(t, activeService.descKey) : '';
  const getActiveLongDescriptions = () => activeService ? activeService.longKeys.map(key => getNestedValue(t, key)) : [];

  return (
    <div 
      className="min-h-[100vh] bg-[#050505] text-white selection:bg-white selection:text-black overflow-x-hidden font-sans relative"
    >
      {/* Immersive UI Ambient Glow effects - FULL WIDTH ORANGE */}
      <div className="absolute top-0 left-0 w-full h-full opacity-15 pointer-events-none bg-[radial-gradient(circle_at_center,#f97316_0%,transparent_70%)] z-0" />
      <div className="absolute top-0 right-0 w-full h-1/2 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_top_right,#f97316_0%,transparent_70%)] z-0" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_bottom_left,#f97316_0%,transparent_70%)] z-0" />

      <AnimatePresence mode="wait">
        {!selectedId ? (
          <motion.div 
            key="grid-portal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 md:p-10 lg:p-16 min-h-screen flex flex-col justify-between relative z-10"
          >
            <main className="max-w-7xl mx-auto w-full my-auto py-10 md:py-16 z-10">
              <div className="max-w-3xl mb-12 md:mb-20">
                <div className="pt-12 md:pt-16 lg:pt-20">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="h-[1px] w-8 bg-zinc-650"></span>
                  </div>
                  <h2 className="text-4xl sm:text-5xl md:text-7xl font-light tracking-tighter uppercase leading-none text-white">
                    {t.servicesPage.subtitle}
                  </h2>
                  <div className="h-[1px] w-20 bg-white/20 mt-6 mb-6"></div>
                  <p className="text-zinc-400 text-sm md:text-base font-light leading-relaxed max-w-2xl">
                    {t.servicesPage.subtitleText}
                  </p>
                </div>
              </div>

              <div className="w-full">
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {SERVICES.map((service, idx) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onClick={() => handleServiceSelect(service.id)}
                      index={idx}
                      t={t}
                    />
                  ))}
                </div>

                <div className="block md:hidden">
                  <MobileStackedPortal
                    services={SERVICES}
                    onSelect={(id) => handleServiceSelect(id)}
                    t={t}
                  />
                </div>
              </div>
            </main>

            <footer className="max-w-7xl mx-auto w-full border-t border-white/5 pt-8 pb-2 text-center flex flex-col md:flex-row justify-between items-center text-[10px] tracking-[0.5em] font-normal uppercase text-zinc-550 gap-4 mt-8">
              <span>MADAN CHURCH</span>
            </footer>

          </motion.div>
        ) : (
          <motion.div 
            key="detail-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-[#050505] relative z-10"
          >
            <div 
              className="absolute inset-0 w-full h-full opacity-15 pointer-events-none transition-all duration-700"
              style={{
                background: `radial-gradient(circle at center, #f97316 0%, transparent 70%)`
              }}
            />

            <div className="relative h-[100vh] w-full overflow-hidden">
              <div className="absolute inset-0">
                <img 
                  src={activeService?.bgImg}
                  alt={getActiveTitle()} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-30" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/30 via-[#050505]/50 to-[#050505]" />
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-[10px] md:text-xs tracking-[0.4em] font-extrabold uppercase mb-4 font-mono landscape:text-[8px] landscape:mb-2" 
                  style={{ color: activeService?.accent }}
                >
                  {getActiveTagline()}
                </motion.p>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="text-6xl sm:text-7xl md:text-7xl uppercase leading-none tracking-tighter text-white font-display font-black landscape:text-5xl landscape:leading-tight"
                >
                  {activeService?.id === "audiovisual" ? (
                    language === 'en' ? (
                      <>
                        <span className="block sm:hidden">Audio</span>
                        <span className="block sm:hidden">Visual</span>
                        <span className="hidden sm:block">{getActiveTitle()}</span>
                      </>
                    ) : (
                      getActiveTitle()
                    )
                  ) : (
                    getActiveTitle()
                  )}
                </motion.h1>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="mt-8 flex flex-col items-center landscape:mt-4"
                >
                  <div className="w-12 h-[2px] bg-white/20 mb-4 landscape:w-8 landscape:mb-2" />
                  <p className="text-zinc-300 text-sm md:text-base font-light max-w-xl leading-relaxed landscape:text-xs landscape:max-w-md">
                    {getActiveDesc()}
                  </p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 landscape:bottom-4"
                >
                  <span className="text-[8px] tracking-[0.3em] font-mono uppercase text-zinc-500 landscape:text-[6px]">{t.servicesPage.scrollToExplore}</span>
                  <motion.div 
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-5 h-5 border-2 border-zinc-500 rounded-full flex items-center justify-center landscape:w-4 landscape:h-4"
                  >
                    <div className="w-0.5 h-2 bg-zinc-500 rounded-full landscape:h-1.5" />
                  </motion.div>
                </motion.div>
              </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24 relative bg-[#050505] landscape:py-10">
              <div className="grid grid-cols-1 gap-12">
                <div className="space-y-8 landscape:space-y-4">
                  <div className="space-y-4 landscape:space-y-2">
                    <span className="text-[10px] tracking-[0.4em] font-mono font-black uppercase text-zinc-500 block landscape:text-[8px]">{t.servicesPage.ourCommitment}</span>
                    <h2 className="text-3xl md:text-5xl font-light leading-tight text-white font-display landscape:text-2xl">
                      {t.servicesPage.aboutService} <span className="font-bold" style={{ color: activeService?.accent }}>{getActiveTitle()}</span>
                    </h2>
                    <div className="w-16 h-[2px] bg-white/10 mt-4 landscape:mt-2" style={{ backgroundColor: activeService?.accent }} />
                  </div>

                  <div className="space-y-6 max-w-4xl landscape:space-y-3">
                    {getActiveLongDescriptions().map((paragraph, idx) => (
                      <p 
                        key={idx} 
                        className="text-base md:text-lg text-zinc-300 leading-relaxed font-light landscape:text-sm"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="pt-8 border-t border-white/5 max-w-4xl landscape:pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 landscape:gap-3">
                      <div className="bg-zinc-900/50 rounded-xl p-5 border border-white/5 landscape:p-3">
                        <span className="text-[8px] tracking-[0.3em] font-mono uppercase text-zinc-500 block mb-2 landscape:text-[7px]">{t.servicesPage.focusArea}</span>
                        <p className="text-white font-light text-sm landscape:text-xs">{getActiveTagline()}</p>
                      </div>
                      <div className="bg-zinc-900/50 rounded-xl p-5 border border-white/5 landscape:p-3">
                        <span className="text-[8px] tracking-[0.3em] font-mono uppercase text-zinc-500 block mb-2 landscape:text-[7px]">{t.servicesPage.impact}</span>
                        <p className="text-white font-light text-sm landscape:text-xs">{t.servicesPage.transformingLives}</p>
                      </div>
                      <div className="bg-zinc-900/50 rounded-xl p-5 border border-white/5 landscape:p-3">
                        <span className="text-[8px] tracking-[0.3em] font-mono uppercase text-zinc-500 block mb-2 landscape:text-[7px]">{t.servicesPage.joinUs}</span>
                        <p className="text-white font-light text-sm landscape:text-xs">{t.servicesPage.bePart}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="fixed bottom-8 left-0 right-0 z-[120] flex justify-center pointer-events-none landscape:bottom-4">
              <button 
                id="back-button"
                onClick={handleBackToMenu}
                className="pointer-events-auto flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-extrabold text-[11px] tracking-widest hover:scale-105 hover:bg-zinc-100 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] focus:outline-none landscape:px-5 landscape:py-2.5 landscape:text-[9px] landscape:gap-2"
              >
                <ArrowLeft size={16} className="landscape:w-[12px] landscape:h-[12px]" /> {t.servicesPage.backToPortal}
              </button>
            </div>

            <footer className="py-16 text-center border-t border-white/5 bg-black/20 landscape:py-8">
              <p className="text-[9px] tracking-[0.8em] font-mono uppercase text-zinc-650 landscape:text-[7px]">{t.servicesPage.footerText}</p>
            </footer>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}