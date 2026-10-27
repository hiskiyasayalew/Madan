"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import Header from "../components/ui/Header";
import { Volume2, VolumeX } from "lucide-react";

import Hero from "./Hero";
import Welcome from "./Welcome";
import Community from "./Community";
import Mission from "./Mission";
import Vision from "./Vision";
import FaithStatement from "./FaithStatement";
import Testimonials from "./Testimonials";
import Belt2 from "./Belt2";
import UpcomingEvents from "./UpcomingEvents";
import ServiceIntroduction from "./ServiceIntroduction";
import SmoothScrollProvider from "../components/ui/SmoothScrollProvider";
import Footer from "../components/ui/Footer";
import FindUs from "./FindUs";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const heroAudioRef = useRef<HTMLAudioElement | null>(null);
  const welcomeAudioRef = useRef<HTMLAudioElement | null>(null);
  const heroFadeInterval = useRef<NodeJS.Timeout | null>(null);
  const welcomeFadeInterval = useRef<NodeJS.Timeout | null>(null);

  const hasUnlockedAudio = useRef(false);
  const isInsideWelcome = useRef(false);
  const welcomeFinished = useRef(false);
  const heroTimeMarker = useRef(0);
  const isWelcomeVisibleRef = useRef(false);

  const fadeTrack = (audio: HTMLAudioElement | null, targetVol: number, duration: number, isHero: boolean) => {
    if (!audio) return;
    if (isHero && heroFadeInterval.current) clearInterval(heroFadeInterval.current);
    if (!isHero && welcomeFadeInterval.current) clearInterval(welcomeFadeInterval.current);

    const startVol = audio.volume;
    const steps = 20;
    const intervalTime = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const newVol = startVol + (targetVol - startVol) * progress;
      audio.volume = Math.min(Math.max(newVol, 0), 1);
      if (currentStep >= steps) {
        clearInterval(interval);
        if (targetVol === 0 && isHero) audio.pause();
      }
    }, intervalTime);

    if (isHero) heroFadeInterval.current = interval;
    else welcomeFadeInterval.current = interval;
  };

  const toggleMute = () => {
    const hero = heroAudioRef.current;
    const welcome = welcomeAudioRef.current;
    if (!hero || !welcome) return;

    if (isMuted) {
      setIsMuted(false);
      hero.muted = false;
      welcome.muted = false;

      if (!hasUnlockedAudio.current) {
        if (isWelcomeVisibleRef.current && !welcomeFinished.current) {
          welcome.play().catch(() => {});
          hero.play().then(() => hero.pause()).catch(() => {});
        } else {
          hero.play().catch(() => {});
          welcome.play().then(() => welcome.pause()).catch(() => {});
        }
        hasUnlockedAudio.current = true;
      }

      if (isWelcomeVisibleRef.current && !welcomeFinished.current) {
        welcome.play().catch(() => {});
        fadeTrack(welcome, 1, 800, false);
        fadeTrack(hero, 0, 600, true);
        setTimeout(() => hero.pause(), 650);
      } else {
        hero.play().catch(() => {});
        fadeTrack(hero, 1, 800, true);
        fadeTrack(welcome, 0, 600, false);
        setTimeout(() => { if (!isWelcomeVisibleRef.current) welcome.pause(); }, 700);
      }
    } else {
      setIsMuted(true);
      fadeTrack(hero, 0, 400, true);
      fadeTrack(welcome, 0, 400, false);
      setTimeout(() => {
        if (heroAudioRef.current) heroAudioRef.current.muted = true;
        if (welcomeAudioRef.current) welcomeAudioRef.current.muted = true;
      }, 450);
    }
  };

  const playWelcomeAudio = useCallback(() => {
    if (welcomeFinished.current) return;
    isInsideWelcome.current = true;
    const hero = heroAudioRef.current;
    const welcome = welcomeAudioRef.current;
    if (!hero || !welcome) return;

    heroTimeMarker.current = hero.currentTime;
    fadeTrack(hero, 0, 600, true);
    setTimeout(() => {
      if (isInsideWelcome.current && !welcomeFinished.current) {
        hero.pause();
        welcome.play().catch(() => {});
        if (!isMuted) {
          welcome.muted = false;
          fadeTrack(welcome, 1, 800, false);
        }
      }
    }, 650);
  }, [isMuted]);

  // Fix 1: Return early and ignore resetting playhead if welcome has finished
  const stopWelcomeAudio = useCallback(() => {
    if (welcomeFinished.current) return;
    isInsideWelcome.current = false;
    const hero = heroAudioRef.current;
    const welcome = welcomeAudioRef.current;
    if (!hero || !welcome) return;
    fadeTrack(welcome, 0, 600, false);
    hero.currentTime = heroTimeMarker.current;
    hero.play().catch(() => {});
    if (!isMuted) {
      hero.muted = false;
      fadeTrack(hero, 1, 800, true);
    }
  }, [isMuted]);

  const restartWelcomeAudio = useCallback(() => {
    welcomeFinished.current = false;
    isInsideWelcome.current = true;
    const welcome = welcomeAudioRef.current;
    if (welcome) {
      welcome.pause();
      welcome.currentTime = 0;
      welcome.play().catch(() => {});
      if (!isMuted) {
        welcome.muted = false;
        fadeTrack(welcome, 1, 300, false);
      }
    }
    const hero = heroAudioRef.current;
    if (hero) {
      hero.pause();
      fadeTrack(hero, 0, 300, true);
    }
  }, [isMuted]);

  // Fix 1: Call transition stop first, and set welcomeFinished to true afterwards
  const handleWelcomeComplete = useCallback(() => {
    stopWelcomeAudio();
    welcomeFinished.current = true;
  }, [stopWelcomeAudio]);

  const handleEnterWelcome = useCallback(() => {
    isWelcomeVisibleRef.current = true;
  }, []);

  const handleLeaveWelcome = useCallback(() => {
    isWelcomeVisibleRef.current = false;
  }, []);

  useEffect(() => {
    const waitForAssets = async () => {
      try {
        await document.fonts.ready;
        setTimeout(() => {
          setIsHeaderVisible(true);
          setIsLoading(false);
        }, 500);
      } catch (e) {
        setIsLoading(false);
      }
    };
    waitForAssets();
  }, []);

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&family=Poppins:wght@300;500;700&display=swap" rel="stylesheet" />
      </Head>
      <SmoothScrollProvider>
        <AnimatePresence>
          {!isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative bg-white"
            >
              <audio ref={heroAudioRef} src="/Hero.mp3" loop preload="auto" muted />
              <audio ref={welcomeAudioRef} src="/Welcome.mp3" preload="auto" muted />

              <motion.div
                className="fixed top-10 left-0 w-full z-50"
                animate={{ opacity: isHeaderVisible ? 1 : 0 }}
              >
                <div className="flex justify-center"><Header /></div>
              </motion.div>

              <Hero />
              <Welcome
                playWelcomeAudio={playWelcomeAudio}
                stopWelcomeAudio={stopWelcomeAudio}
                restartWelcomeAudio={restartWelcomeAudio}
                onWelcomeComplete={handleWelcomeComplete}
                onEnterWelcome={handleEnterWelcome}
                onLeaveWelcome={handleLeaveWelcome}
              />
              <Community preloaderCompleted={true} />
              <Mission preloaderCompleted={true} />
              <Vision preloaderCompleted={true} />
              <FaithStatement preloaderCompleted={true} />
              <Testimonials />
              <Belt2 />
              <UpcomingEvents />
              <ServiceIntroduction />
              <FindUs />
              <Footer />

              <motion.button
                onClick={toggleMute}
                className="fixed bottom-5 right-6 sm:right-10 z-[70] p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-orange-500/20 transition-all"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-orange-500" />
                ) : (
                  <Volume2 className="w-5 h-5 text-orange-500" />
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </SmoothScrollProvider>
    </>
  );
}