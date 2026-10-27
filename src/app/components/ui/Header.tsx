"use client";

import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { createPortal } from "react-dom";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";


interface HeaderProps {
  mainNavWidth?: string;
  menuNavWidth?: string;
  borderRadius?: string;
}

export default function Header({
  mainNavWidth = "80%",
  menuNavWidth = "50px",
  borderRadius = "12px",
}: HeaderProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const savedScrollPosition = useRef(0);
  
  const [frontendCards, setFrontendCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [cardsError, setCardsError] = useState<string | null>(null);

  const featuredCards = frontendCards.slice(0, 3);
  const activeCard = featuredCards[currentIndex];
  const [mounted, setMounted] = useState(false);
  const { language, setLanguage } = useLanguage();
  const t = useTranslation();

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      // Store current scroll position before locking
      savedScrollPosition.current = window.scrollY;
      
      // Lock the body
      document.body.style.position = 'fixed';
      document.body.style.top = `-${savedScrollPosition.current}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } 
  }, [menuOpen]);

  // Function to unlock scroll ONLY after the exit animation completes
  const handleExitComplete = () => {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    window.scrollTo(0, savedScrollPosition.current);
  };

  useEffect(() => {
    setMounted(true);
    return () => {
      // Cleanup on unmount
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    console.log("menuOpen:", menuOpen);
  }, [menuOpen]);

  useEffect(() => {
    console.log("mounted:", mounted);
  }, [mounted]);

  // Unified fetching function
  const fetchFeatured = async () => {
    try {
      setCardsLoading(true);
      const { data, error } = await supabase
        .from('frontend_cards')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      setFrontendCards(data || []);
      setCardsError(null);
    } catch (err: any) {
      console.error("Header: Error fetching featured cards:", err);
      setCardsError(err.message || "Failed to load events");
    } finally {
      setCardsLoading(false);
    }
  };

  // Fetch on mount and subscribe to Realtime updates
  useEffect(() => {
    fetchFeatured();

    const channel = supabase
      .channel('header_frontend_cards_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'frontend_cards'
        },
        () => {
          fetchFeatured();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Refetch when the menu opens to pull fresh data
  useEffect(() => {
    if (menuOpen) {
      fetchFeatured();
    }
  }, [menuOpen]);

  // Safely auto-slide featured cards, resetting index on card length changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [featuredCards.length]);

  useEffect(() => {
    if (featuredCards.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredCards.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredCards.length]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 850);
    };
    checkScreenSize();
    const handleResize = () => checkScreenSize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const SocialIcon = ({ href, type }: { href: string; type: string }) => {
    const icons: Record<string, React.ReactNode> = {
      instagram: <Instagram size={20} className="text-[#FF7A00] hover:text-[#FF9F4A] transition-colors" />,
      facebook: <Facebook size={20} className="text-[#FF7A00] hover:text-[#FF9F4A] transition-colors" />,
      tiktok: <Twitter size={20} className="text-[#FF7A00] hover:text-[#FF9F4A] transition-colors" />,
      youtube: <Youtube size={20} className="text-[#FF7A00] hover:text-[#FF9F4A] transition-colors" />,
    };
    return (
      <Link href={href} className="transition-all transform hover:scale-110">
        {icons[type]}
      </Link>
    );
  };

  const menuItems = [
    { label: t.services, number: "01", link: "/services" },
    { label: t.about, number: "02", link: "/about" },
    { label: t.donate, number: "03", link: "/donate" },
  ];

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;400;500;600;700;800;900&family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: showHeader ? 1 : 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="fixed top-0 left-0 w-full z-[9999] flex items-center justify-center gap-2 px-4 md:px-0 mt-10"
      >
        {isMobile ? (
          <div className="flex items-center justify-between w-[85%] md:w-[80%] h-13 bg-[#000000]/20 backdrop-blur-md px-4 py-2 rounded-[25px]">
            <div className="w-6 h-6 flex-shrink-0">
              <Link href="/">
              <Image src="/MADAN-White.png" alt="Logo" width={24} height={24} className="object-contain w-full h-full" />
              </Link>
            </div>
            <button className="text-white flex items-center justify-center" onClick={() => setMenuOpen(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12H21M3 6H21M3 18H21" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <Link href="/" className="flex items-center justify-center hover:scale-105 transition-all" style={{ width: "40px", height: "40px" }}>
              <div className="w-7 h-9">
                <Image src="/MADAN-White.png" alt="Logo" width={28} height={28} className="object-contain w-full h-full" />
              </div>
            </Link>
            <div className="flex items-center gap-8 bg-[#000000]/20 backdrop-blur-lg px-6 py-3 rounded-[25px]" style={{ width: mainNavWidth, minWidth: "450px", maxWidth: "500px", height: "40px" }}>
              <nav className="flex space-x-4 lg:space-x-6 font-Montserrat text-[#FAF6E2] text-xs font-normal tracking-wider w-full justify-center gap-8 lg:gap-20">
                <Link href="/services" className="hover:text-orange-500 whitespace-nowrap text-[11px] lg:text-xs">{t.services}</Link>
                <Link href="/about" className="hover:text-orange-500 whitespace-nowrap text-[11px] lg:text-xs">{t.about}</Link>
                <Link href="/donate" className="hover:text-orange-500 whitespace-nowrap text-[11px] lg:text-xs">{t.donate}</Link>
              </nav>
            </div>
            <div className="bg-[#000000]/20 backdrop-blur-md p-3 flex items-center justify-center rounded-[25px]" style={{ width: menuNavWidth, height: "40px", minWidth: "180px" }}>
              <Link href="/news" className="flex font-Montserrat text-[#FAF6E2] text-xs font-normal tracking-wider w-full justify-center hover:text-orange-500 transition-colors whitespace-nowrap">{t.guestHouse}</Link>
              <button className="text-white flex items-center justify-center ml-2 cursor-pointer" onClick={() => setMenuOpen(true)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M3 12H21M3 6H21M3 18H21" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </>
        )}
      </motion.div>
{
  mounted &&
  createPortal(
    <AnimatePresence onExitComplete={handleExitComplete}>
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(30px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[2147483647] h-screen w-screen overflow-hidden bg-black/80 flex flex-col font-Montserrat text-white"
        >
            {/* AURORA EFFECT BACKGROUND */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <motion.div 
                animate={{ 
                  x: [0, 40, 0], 
                  y: [0, 60, 0],
                  scale: [1, 1.1, 1] 
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-[#FF7A00]/10 rounded-full blur-[120px]" 
              />
              <motion.div 
                animate={{ 
                  x: [0, -30, 0], 
                  y: [0, -40, 0],
                  scale: [1, 1.2, 1] 
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-5%] left-[5%] w-[600px] h-[600px] bg-white/5 rounded-full blur-[140px]" 
              />
              <div className="absolute inset-0 bg-[linear-gradient(transparent_1px,_transparent_1px),_linear-gradient(90deg,rgba(255,255,255,0.02)_1px,_transparent_1px)] bg-[size:50px_50px]" />
            </div>

            {/* TOP HEADER */}
            <div className="flex justify-between items-center px-6 md:px-16 py-8 landscape:py-2 md:py-6 flex-shrink-0 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 mt-[25%] relative">
                    <Link href="/">
                  <Image src="/MADAN-White.png" alt="Logo" fill className="object-contain" />
                  </Link>
                </div>
              </div>
              <button onClick={() => setMenuOpen(false)} className="group flex items-center gap-3 outline-none relative cursor-pointer">
                <div className="absolute -inset-4 rounded-full bg-white/5 opacity-0  transition-opacity duration-300" />
                <span className="font-light text-xs md:text-sm tracking-[0.2em] uppercase text-gray-300 group-hover:text-[#FF7A00] transition-colors">{t.close}</span>
                <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-300 transition-all duration-300 group-hover:rotate-90 group-hover:text-[#FF7A00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* FLEXIBLE CONTENT AREA */}
            <div className="flex-1 flex flex-col landscape:flex-row lg:flex-row w-full gap-4 md:gap-8 lg:gap-16 px-6 md:px-16 pb-4 min-h-0 overflow-hidden relative z-10">
              
              <div className="w-full lg:w-[50%] landscape:w-[50%] flex flex-col justify-center flex-shrink-0 lg:flex-shrink">
                <div className="space-y-2 md:space-y-4 lg:space-y-6">
                  {menuItems.map((item, index) => (
                    <motion.div 
                      key={item.label} 
                      className="group relative overflow-hidden"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (index * 0.1) }}
                    >
                      <Link href={item.link} onClick={() => setMenuOpen(false)} className="block">
                        <div className="flex items-baseline gap-3 md:gap-4 group/link">
                          <span className="text-[12vw] landscape:text-[8vh] sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tighter bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent group-hover:from-[#FF7A00] group-hover:to-[#FF9F4A] transition-all duration-500">
                            {item.label}
                          </span>
                          <span className="text-[#FF7A00] text-sm md:text-base lg:text-lg font-mono opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300">
                            {item.number}
                          </span>
                        </div>
                        <div className="w-0 group-hover:w-full h-px bg-gradient-to-r from-[#FF7A00] to-transparent transition-all duration-500 mt-1" />
                      </Link>
                    </motion.div>
                  ))}
                  <motion.div 
                    className="group relative overflow-hidden pt-2 md:pt-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Link href="/news" onClick={() => setMenuOpen(false)} className="block">
                      <div className="flex items-baseline gap-3 md:gap-4 group/link">
                        <span className="text-[10vw] landscape:text-[6vh] sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tighter text-[#FF7A00] hover:text-[#FF9F4A] transition-colors">
                          {t.guestHouse}
                        </span>
                      </div>
                      <div className="w-0 group-hover:w-full h-px bg-gradient-to-r from-[#FF7A00] to-transparent transition-all duration-500 mt-1" />
                    </Link>
                  </motion.div>
                </div>
              </div>

              {/* WIDGETS SECTION */}
              <div className="w-full lg:w-[40%] landscape:w-[45%] flex flex-col gap-5 landscape:gap-3 lg:items-end flex-1 min-h-0 justify-center">
                <div className="w-full lg:max-w-lg lg:h-48 md:min-h-[200px] flex-1 lg:flex-none relative rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10 group cursor-pointer hover:border-[#FF7A00]/50 transition-all duration-500">
                  <AnimatePresence mode="wait">
                    {cardsLoading ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 text-gray-400 text-xs gap-2">
                        <div className="w-4 h-4 rounded-full border border-white/10 border-t-[#FF7A00] animate-spin" />
                        <span>Loading Featured...</span>
                      </div>
                    ) : activeCard ? (
                      <motion.div
                        key={activeCard.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0"
                      >
                        <img 
                          src={activeCard.image_url || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000"} 
                          alt={activeCard.title} 
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-1 h-6 bg-[#FF7A00] rounded-full" />
                              <span className="text-[10px] tracking-[0.2em] uppercase text-[#FF7A00] font-mono">
                                {activeCard.event_date || 'Featured'}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              {featuredCards.map((_, idx) => (
                                <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-[#FF7A00] w-3' : 'bg-white/30'}`} />
                              ))}
                            </div>
                          </div>
                          <h3 className="text-white text-lg md:text-xl font-medium tracking-wide">{activeCard.title}</h3>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 text-gray-500 text-xs p-4 text-center">
                        {cardsError ? (
                          <>
                            <span className="text-red-400 font-bold mb-1">Could not connect</span>
                            <span className="text-[10px] opacity-60">{cardsError}</span>
                          </>
                        ) : "No Featured Events"}
                      </div>
                    )}
                  </AnimatePresence>
                </div>

               <div className="w-full lg:max-w-lg flex flex-row gap-3 md:gap-4 h-16 md:h-20 lg:h-24 flex-shrink-0">
              <Link href="/login" className="flex-1" onClick={() => setMenuOpen(false)}>
                <motion.button className="group relative w-full h-full rounded-xl overflow-hidden transition-all duration-300 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] to-[#FF7A00] group-hover:from-[#FF7A00] group-hover:to-[#FF9F4A] transition-all duration-500" />
                  <span className="relative z-10 text-[12.5px] landscape:text-[15px] md:text-xs lg:text-sm font-bold cursor-pointer tracking-[0.08em] text-white uppercase group-hover:text-black leading-[1.1] md:leading-[1.2] lg:leading-[1.2]">
                    {t.membersPanel}
                  </span>
                </motion.button>
              </Link>
              <motion.button
                onClick={() =>
                  setLanguage(
                    language === "en"
                      ? "am"
                      : "en"
                  )
                }
                className="flex-1 group relative w-full h-full rounded-xl overflow-hidden transition-all duration-300 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#FF7A00]/50 hover:bg-white/10 cursor-pointer"
              >
                <span className="relative z-10 text-lg landscape:text-base md:text-xl lg:text-2xl font-bold text-white">
                  {language === "en"
                    ? "አማርኛ"
                    : "English"}
                </span>
              </motion.button>
            </div>
              </div>
            </div>
 
            {/* FOOTER */}
            <motion.div 
              className="w-full px-6 md:px-16 py-4 landscape:py-2 border-t border-white/10 flex-shrink-0 bg-transparent relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex flex-row justify-between items-center">
                <a href="/Guest">
                <p className="text-[10px] text-orange-500 hover:text-gray-100 md:text-xs mb-[1%] tracking-[0.2em] font-mono ">GUEST-HOUSE</p>
                 </a>
                 <a href="/archive">
                <p className="text-[10px] text-orange-500 hover:text-gray-100 md:text-xs mb-[1%] tracking-[0.2em] font-mono">ARCHIVE</p>
               </a>
                <div className="flex items-center gap-5 md:gap-6 mb-[1%]">
                  <SocialIcon href="#" type="instagram" />
                  <SocialIcon href="#" type="facebook" />
                  <SocialIcon href="#" type="tiktok" />
                  <SocialIcon href="#" type="youtube" />
                </div>
              </div>
            </motion.div>
          </motion.div>
         
        )}
      </AnimatePresence>,
          document.body
  )
}
    </>
  );
}