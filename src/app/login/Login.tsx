"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/login';
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../lib/translations';

const AlertPopup = ({ message, onClose, t }: { message: string; onClose: () => void; t: any }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.2 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
  >
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-2xl max-w-sm w-full text-center p-8">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
        <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <p className="text-white font-bold text-lg mb-6 leading-relaxed">{message}</p>
      <button 
        onClick={onClose} 
        className="w-full bg-[#6b4e31] hover:bg-[#825f3c] text-white font-bold text-xs sm:text-sm tracking-widest py-3 rounded-full transition-all shadow-xl active:scale-95 uppercase"
      >
        {t.login.dismiss}
      </button>
    </div>
  </motion.div>
);

export default function Login() {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [currentDate, setCurrentDate] = useState({ dayName: "", dayNumber: "" });
  const [currentImg, setCurrentImg] = useState(0);

  const images = [
    "/LoginBg.jpg",
    "/MissionImg1A.jpg",
    "/MissionImg1B.jpg",
    "/missionImg3.jpg",
    "/missionImg4.jpg",
    "/missionImg5.jpg",
    "/missionImg6.jpg",
  ];

  const router = useRouter();

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const days = language === 'en' 
        ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        : ['እሁድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'አርብ', 'ቅዳሜ'];
      setCurrentDate({ dayName: days[now.getDay()], dayNumber: now.getDate().toString() });
    };

    updateDate();
    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, [language]);

  useEffect(() => {
    setIsLoaded(true);
    
    // Detect and alert if redirect occurred due to inactivity timeout
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('reason') === 'timeout') {
        setErrorMsg(t.login.sessionExpired);
      }
    }
  }, [t]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleLogin = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!username || !password) {
      setErrorMsg(t.login.enterCredentials);
      return;
    }
    setLoading(true);
    setErrorMsg("");

    try {
      const result = await loginUser(username, password);
      if (result.success) {
        router.push('/members-panel');
      } else {
        setErrorMsg(result.message || t.login.invalidCredentials);
        setLoading(false);
      }
    } catch (err) {
      setErrorMsg(t.login.systemError);
      setLoading(false);
    }
  };

  const handleSignup = () => router.push('/signup');

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center overflow-y-auto font-sans">
      <AnimatePresence>
        {errorMsg && <AlertPopup message={errorMsg} onClose={() => setErrorMsg("")} t={t} />}
      </AnimatePresence>

      <div 
        className={`w-full max-w-[1200px] flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 transition-all duration-[1200ms] ease-out px-4 py-8 lg:py-0 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        <div className="fixed inset-0 z-0 lg:relative lg:inset-auto lg:z-10 lg:w-full lg:max-w-[550px] lg:aspect-square lg:rounded-[3rem] overflow-hidden bg-neutral-900 lg:shadow-2xl">
          <AnimatePresence initial={false}>
            <motion.img 
              key={currentImg}
              src={images[currentImg]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              alt="Faith Slideshow" 
              className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.35] lg:brightness-75"
            />
          </AnimatePresence>

          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="absolute top-25 landscape:top-16 sm:top-25 md:top-25 lg:top-10 lg:left-10 lg:right-auto right-8 flex items-center gap-4 text-white">
               <div className="text-right lg:text-left">
                <p className="text-xs lg:text-lg font-light opacity-60 leading-none">
                  {currentDate.dayName || "Loading..."}
                </p>
                <h1 className="text-3xl lg:text-5xl font-bold tracking-tighter">
                  {currentDate.dayNumber ? `${currentDate.dayNumber}${getOrdinalSuffix(parseInt(currentDate.dayNumber), language)}` : "Loading..."}
                </h1>
               </div>
            </div>
            
            <div className="hidden lg:block absolute bottom-10 right-10">
              <img src="/MADAN-White.png" alt="Logo" className="w-7 h-auto opacity-80" />
            </div>
          </div>
        </div>

        <div className="relative z-20 w-full min-h-screen lg:min-h-0 lg:h-auto lg:w-auto flex flex-col items-center lg:items-start justify-center lg:justify-start text-center lg:text-left px-6 sm:px-8 lg:px-0 py-12 lg:py-0 landscape:py-6">
          <div className="flex flex-col items-center lg:items-start mb-6 lg:mb-10 select-none">
            <p className="text-gray-400 text-lg sm:text-2xl lg:text-2xl font-light leading-none mb-2">
              {t.login.welcomeBack}
            </p>
            <h2 className="text-white text-5xl sm:text-7xl lg:text-8xl font-light tracking-[0.02em] leading-none">
              {t.login.title}
            </h2>
          </div>
          
          <form onSubmit={handleLogin} className="w-full max-w-[300px] space-y-3 sm:space-y-4 lg:space-y-5">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/70 z-10">
                <svg className="w-7 h-7 lg:w-5 lg:h-5" fill="white" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t.login.username}
                required
                className="w-full bg-white/10 lg:bg-[#1a1a1a] backdrop-blur-lg lg:backdrop-blur-none border border-white/10 lg:border-transparent focus:border-neutral-500 rounded-full py-2 sm:py-2.5 lg:py-2.5 pl-14 sm:pl-14 pr-6 text-sm sm:text-base text-white placeholder-gray-400 outline-none transition-all"
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/70 z-10">
                <svg className="w-7 h-7 lg:w-5 lg:h-5" fill="white" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.login.password}
                required
                className="w-full bg-white/10 lg:bg-[#1a1a1a] backdrop-blur-lg lg:backdrop-blur-none border border-white/10 lg:border-transparent focus:border-neutral-500 rounded-full py-2 sm:py-2.5 lg:py-2.5 pl-14 sm:pl-14 pr-6 text-sm sm:text-base text-white placeholder-gray-400 outline-none transition-all"
              />
            </div>

            <div className="flex flex-col items-center gap-3 sm:gap-4 pt-2 sm:pt-4 lg:pt-6">
              <button
                type="submit"
                disabled={loading}
                className="lg:self-end bg-[#6b4e31] hover:bg-[#825f3c] text-white font-bold text-xs sm:text-sm tracking-widest py-2 sm:py-2.5 lg:py-2.5 px-10 sm:px-12 lg:px-9 rounded-full transition-all shadow-xl active:scale-95 disabled:opacity-50 uppercase cursor-pointer"
              >
                {loading ? t.login.authenticating : t.login.loginButton}
              </button>

              <p className="text-gray-400 text-sm sm:text-sm lg:text-lg font-normal">
                {t.login.noAccount}{" "}
                <button type="button" onClick={handleSignup} className="text-[#a17c56] hover:underline font-bold cursor-pointer">
                  {t.login.signUp}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function getOrdinalSuffix(day: number, language: string): string {
  if (language === 'am') return '';
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}