import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { gsap } from "gsap";

interface WelcomeProps {
  playWelcomeAudio: () => void;
  stopWelcomeAudio: () => void;
  restartWelcomeAudio: () => void;
  onWelcomeComplete?: () => void;
  onEnterWelcome?: () => void;
  onLeaveWelcome?: () => void;
}

interface DustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
}

interface SteamParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
}

export default function Welcome({
  playWelcomeAudio,
  stopWelcomeAudio,
  restartWelcomeAudio,
  onWelcomeComplete,
  onEnterWelcome,
  onLeaveWelcome,
}: WelcomeProps) {
  const DEBUG_MODE = false;
  const DEBUG_PHASE = 1;

  const [isPlaying, setIsPlaying] = useState(false);
  const [showSecondLine, setShowSecondLine] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12>(
    DEBUG_MODE ? (DEBUG_PHASE as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12) : 1
  );
  const [phase9Word, setPhase9Word] = useState<"Worthy" | "Perfect">("Worthy");
  const [p1FadingOut, setP1FadingOut] = useState(false);
  const [showP2Line1, setShowP2Line1] = useState(false);
  const [showP2Line2, setShowP2Line2] = useState(false);
  const [p3Step, setP3Step] = useState<0 | 1 | 2>(0);
  const [phase4Seq, setPhase4Seq] = useState<'seq1' | 'seq1_out' | 'seq2' | 'seq2_out'>('seq2');
  const [p5Step, setP5Step] = useState<0 | 1 | 2>(0);
  const [showP5Text1, setShowP5Text1] = useState(false);
  const [showP5Text2, setShowP5Text2] = useState(false);
  const [showP5Text2Part1, setShowP5Text2Part1] = useState(false);
  const [showP5Thousand, setShowP5Thousand] = useState(false);
  const [showP5Years, setShowP5Years] = useState(false);
  const [yearsDustActive, setYearsDustActive] = useState(false);
  const [thousandDustActive, setThousandDustActive] = useState(false);
  const [showP5RomanI, setShowP5RomanI] = useState(false);
  const [p5BgFadeOut, setP5BgFadeOut] = useState(false);

  const [showP6Text1, setShowP6Text1] = useState(false);
  const [showP6Text2, setShowP6Text2] = useState(false);
  const [p6AlwaysOnly, setP6AlwaysOnly] = useState(false);
  const [p6AlwaysCenter, setP6AlwaysCenter] = useState(false);
  const [showP6Hand, setShowP6Hand] = useState(false);
  const [p6HandPosition, setP6HandPosition] = useState(-50);
  const [p6ShavedLettersCount, setP6ShavedLettersCount] = useState(0);
  const [p6ShavingActive, setP6ShavingActive] = useState(false);

  const [showP7Text1, setShowP7Text1] = useState(false);
  const [showP7Text2, setShowP7Text2] = useState(false);
  const [showP7Text3, setShowP7Text3] = useState(false);
  const [p7StoneRolling, setP7StoneRolling] = useState(false);
  const [p7Earthquake, setP7Earthquake] = useState(false);
  const [p7ShowStone, setP7ShowStone] = useState(false);
  const p7DustCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [p10Seq, setP10Seq] = useState<1 | 2 | 3>(1);
  const [p10Shake, setP10Shake] = useState(false);

  const [p11TextIndex, setP11TextIndex] = useState(0);
  const [p11ShakeIntensity, setP11ShakeIntensity] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const p5CanvasRef = useRef<HTMLCanvasElement | null>(null);
  const yearsDustCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const thousandDustCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const p6WoodShavingsCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const p6HandPositionRef = useRef(-50);
  const [animationKey, setAnimationKey] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const hasPlayedOnce = useRef(false);

  // persist sequence start across scroll
  const [sequenceStarted, setSequenceStarted] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const welcomeCompleteCalled = useRef(false);

  const SECOND_LINE_DELAY_MS = 4500;
  const FADE_OUT_P1_MS = 8500;
  const START_P2_MS = 10500;

  type EntityType = "warrior" | "horse" | "chariot" | "train" | "car" | "plane" | "bike";

  interface ProcessionEntity {
    id: string;
    type: EntityType;
    progress: number;
    scale: number;
    delay: number;
    duration: number;
    variety: number;
    yFactor?: number;
  }

  const entitiesRef = useRef<ProcessionEntity[]>([
    { id: "w1", type: "warrior", progress: -0.2, scale: 1.25, delay: 0.5, duration: 7.5, variety: 1 },
    { id: "w2", type: "warrior", progress: -0.2, scale: 1.4, delay: 1.0, duration: 6.8, variety: 2 },
    { id: "w3", type: "warrior", progress: -0.2, scale: 1.15, delay: 1.5, duration: 8.2, variety: 3 },
    { id: "h1", type: "horse", progress: -0.2, scale: 1.5, delay: 2.0, duration: 6.5, variety: 1 },
    { id: "h2", type: "horse", progress: -0.2, scale: 1.25, delay: 2.6, duration: 6.0, variety: 2 },
    { id: "ch1", type: "chariot", progress: -0.2, scale: 1.55, delay: 3.2, duration: 6.2, variety: 1 },
    { id: "bike1", type: "bike", progress: -0.2, scale: 1.3, delay: 3.8, duration: 6.8, variety: 1 },
    { id: "train", type: "train", progress: -0.2, scale: 1.95, delay: 4.8, duration: 9.5, variety: 1 },
    { id: "car", type: "car", progress: -0.2, scale: 1.5, delay: 7.0, duration: 7.2, variety: 1 },
    { id: "plane1", type: "plane", progress: -0.3, scale: 1.25, delay: 1.5, duration: 8.5, variety: 1, yFactor: 0.14 },
    { id: "plane2", type: "plane", progress: -0.3, scale: 1.05, delay: 5.5, duration: 7.5, variety: 2, yFactor: 0.22 },
  ]);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const handleStart = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    playWelcomeAudio();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    stopWelcomeAudio();
    audioRef.current?.pause();
    timelineRef.current?.pause();
  };

 const handleReset = () => {
    setP1FadingOut(false);
    setShowSecondLine(false);
    setShowP2Line1(false);
    setShowP2Line2(false);
    setCurrentPhase(DEBUG_MODE ? (DEBUG_PHASE as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12) : 1);
    setPhase9Word("Worthy");
    setP10Seq(1);
    setP10Shake(false);
    setP11TextIndex(0);
    setP11ShakeIntensity(0);
    setP3Step(0);
    setP5Step(0);
    setShowP5Text1(false);
    setShowP5Text2(false);
    setShowP5Text2Part1(false);
    setShowP5Thousand(false);
    setShowP5Years(false);
    setYearsDustActive(false);
    setThousandDustActive(false);
    setShowP5RomanI(false);
    setP5BgFadeOut(false);

    setShowP6Text1(false);
    setShowP6Text2(false);
    setP6AlwaysOnly(false);
    setP6AlwaysCenter(false);
    setShowP6Hand(false);
    setP6HandPosition(-50);
    p6HandPositionRef.current = -50;
    setP6ShavedLettersCount(0);
    setP6ShavingActive(false);

    setShowP7Text1(false);
    setShowP7Text2(false);
    setShowP7Text3(false);
    setP7StoneRolling(false);
    setP7Earthquake(false);
    setP7ShowStone(false);

    entitiesRef.current.forEach((ent) => { ent.progress = -0.3; });
    if (timelineRef.current) timelineRef.current.kill();
    setAnimationKey((prev) => prev + 1);

    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setSequenceStarted(false);
    welcomeCompleteCalled.current = false;

    restartWelcomeAudio();
    if (isPlaying) {
      setSequenceStarted(true);
      startSequence(); // Fix 2: Start the sequence directly to bypass state batching
    }
  };

  const startSequence = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    setShowSecondLine(false);
    setP1FadingOut(false);
    setShowP2Line1(false);
    setShowP2Line2(false);
    setCurrentPhase(1);
    setP3Step(0);
    setP5Step(0);
    setShowP5Text1(false);
    setShowP5Text2(false);

    entitiesRef.current.forEach((ent) => {
      ent.progress = ent.type === "plane" ? -0.3 : -0.2;
    });

    const line2Timer = setTimeout(() => setShowSecondLine(true), SECOND_LINE_DELAY_MS);
    const fadeOutTimer = setTimeout(() => setP1FadingOut(true), FADE_OUT_P1_MS);
    const p2Timer = setTimeout(() => { setCurrentPhase(2); setP1FadingOut(false); setShowP2Line1(true); }, START_P2_MS);
    const p2Line2Timer = setTimeout(() => setShowP2Line2(true), START_P2_MS + 2200);
    const p3Timer = setTimeout(() => { setCurrentPhase(3); setP3Step(0); }, 23000);
    const p3Step1Timer = setTimeout(() => setP3Step(1), 27000);
    const p3Step2Timer = setTimeout(() => setP3Step(2), 31000);
    const endWelcomeTimer = setTimeout(() => setCurrentPhase(4), 35000);
    const p5Timer = setTimeout(() => { setCurrentPhase(5); setP5Step(0); setShowP5Text1(true); setP5BgFadeOut(false); }, 51000);
    const p5Text2Timer = setTimeout(() => {
      setShowP5Text2(true);
      setShowP5Text2Part1(true);
      setShowP5Thousand(true);
      setShowP5Years(true);
      setYearsDustActive(false);
      setThousandDustActive(false);
      setShowP5RomanI(false);
    }, 51000 + 2500);
    const p5Text1FadeOutTimer = setTimeout(() => setShowP5Text1(false), 51000 + 5000);
    const p5DustFadeOutTimer = setTimeout(() => {
      setP5BgFadeOut(true);
      setShowP5Text2Part1(false);
      setShowP5Thousand(false);
      setThousandDustActive(true);
      setShowP5Years(false);
      setYearsDustActive(true);
    }, 51000 + 8000);
    const p5RomanIEnterTimer = setTimeout(() => setShowP5RomanI(true), 51000 + 8800);
    const p5RomanIExitTimer = setTimeout(() => setShowP5RomanI(false), 51000 + 11200);
    const p5EndTimer = setTimeout(() => {
      setCurrentPhase(6);
      setShowP6Text1(false);
      setShowP6Text2(false);
      setP6AlwaysOnly(false);
      setP6AlwaysCenter(false);
      setShowP6Hand(false);
      setP6HandPosition(-50);
      p6HandPositionRef.current = -50;
      setP6ShavedLettersCount(0);
      setP6ShavingActive(false);
    }, 51000 + 15500 + 2000);
    const p6Text1Timer = setTimeout(() => setShowP6Text1(true), 69000);
    const p6Text2Timer = setTimeout(() => setShowP6Text2(true), 71500);
    const p6WordsFadeOutTimer = setTimeout(() => setP6AlwaysOnly(true), 75000);
    const p6HandEnterTimer = setTimeout(() => setShowP6Hand(true), 76500);
    const p6ShaveStartTimer = setTimeout(() => setP6ShavingActive(true), 78000);
    const p7StartTimer = setTimeout(() => setCurrentPhase(7), 85200);

    timeoutsRef.current = [
      line2Timer, fadeOutTimer, p2Timer, p2Line2Timer, p3Timer, p3Step1Timer, p3Step2Timer,
      endWelcomeTimer, p5Timer, p5Text2Timer, p5Text1FadeOutTimer, p5DustFadeOutTimer,
      p5RomanIEnterTimer, p5RomanIExitTimer, p5EndTimer, p6Text1Timer, p6Text2Timer,
      p6WordsFadeOutTimer, p6HandEnterTimer, p6ShaveStartTimer, p7StartTimer,
    ];
  };

  // ============================================================
  // MERGED VIEWPORT OBSERVER – calls callbacks, does NOT reset currentTime
  // ============================================================
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!isPlaying) {
            setIsPlaying(true);
            playWelcomeAudio();
            // DO NOT reset currentTime – continue from where it was
            if (audioRef.current) {
              audioRef.current.play().catch(() => {});
            }
          }
          if (!sequenceStarted) {
            setSequenceStarted(true);
          }
          if (onEnterWelcome) onEnterWelcome();
        } else {
          if (isPlaying) {
            setIsPlaying(false);
            stopWelcomeAudio();
            if (audioRef.current) {
              audioRef.current.pause();
            }
            if (timelineRef.current) {
              timelineRef.current.pause();
            }
          }
          if (onLeaveWelcome) onLeaveWelcome();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isPlaying, playWelcomeAudio, stopWelcomeAudio, sequenceStarted, onEnterWelcome, onLeaveWelcome]);

  // ============================================================
  // Rest of the component – all phase logic, canvas, JSX unchanged
  // ============================================================

  useEffect(() => {
    const played = sessionStorage.getItem("welcomePlayed");
    if (played === "true") hasPlayedOnce.current = true;
  }, []);

  useEffect(() => {
    if (sequenceStarted) {
      startSequence();
    }
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [sequenceStarted]);

  // Phase 4 loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentPhase === 4) {
      if (phase4Seq === 'seq1') timer = setTimeout(() => setPhase4Seq('seq1_out'), 7000);
      else if (phase4Seq === 'seq1_out') timer = setTimeout(() => setPhase4Seq('seq2'), 3000);
      else if (phase4Seq === 'seq2') timer = setTimeout(() => setPhase4Seq('seq2_out'), 7000);
      else if (phase4Seq === 'seq2_out') timer = setTimeout(() => setPhase4Seq('seq1'), 3000);
    }
    return () => { if (timer) clearTimeout(timer); };
  }, [currentPhase, phase4Seq]);

  // Phase 6 shaving
  useEffect(() => {
    let animFrame: number;
    let startTime: number | null = null;
    const duration = 7200;
    if (currentPhase === 6 && p6ShavingActive) {
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const pos = -20 + progress * 140;
        setP6HandPosition(pos);
        p6HandPositionRef.current = pos;
        const thresholds = [16.67, 33.33, 50.0, 66.67, 83.33, 100.0];
        let count = 0;
        for (let i = 0; i < thresholds.length; i++) {
          if (pos > thresholds[i]) count = i + 1;
        }
        if (progress >= 1 || pos >= 100) count = 6;
        setP6ShavedLettersCount(count);
        if (progress < 1) animFrame = requestAnimationFrame(step);
      };
      animFrame = requestAnimationFrame(step);
    }
    return () => { if (animFrame) cancelAnimationFrame(animFrame); };
  }, [currentPhase, p6ShavingActive]);

  // Phase 7-11 timers
  useEffect(() => {
    let t1: NodeJS.Timeout, t2: NodeJS.Timeout, t3: NodeJS.Timeout, tReset: NodeJS.Timeout;
    if (currentPhase === 7) {
      setShowP7Text1(false); setShowP7Text2(false); setShowP7Text3(false);
      setP7StoneRolling(false); setP7Earthquake(false); setP7ShowStone(false);
      t1 = setTimeout(() => setShowP7Text1(true), 1000);
      t2 = setTimeout(() => setShowP7Text2(true), 2600);
      t3 = setTimeout(() => setShowP7Text3(true), 4400);
      tReset = setTimeout(() => setCurrentPhase(8), 10500);
    }
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(tReset); };
  }, [currentPhase]);

  useEffect(() => {
    let tReset: NodeJS.Timeout;
    if (currentPhase === 8) tReset = setTimeout(() => setCurrentPhase(9), 7500);
    return () => clearTimeout(tReset);
  }, [currentPhase]);

  useEffect(() => {
    let tReset: NodeJS.Timeout, tWord: NodeJS.Timeout;
    if (currentPhase === 9) {
      setPhase9Word("Worthy");
      tWord = setTimeout(() => setPhase9Word("Perfect"), 5500);
      tReset = setTimeout(() => setCurrentPhase(10), 12800);
    }
    return () => { clearTimeout(tReset); clearTimeout(tWord); };
  }, [currentPhase]);

  useEffect(() => {
    let tSeq2: NodeJS.Timeout, tSeq3: NodeJS.Timeout, tReset: NodeJS.Timeout;
    if (currentPhase === 10) {
      setP10Seq(1); setP10Shake(true);
      tSeq2 = setTimeout(() => { setP10Seq(2); setP10Shake(false); }, 4500);
      tSeq3 = setTimeout(() => setP10Seq(3), 9000);
      tReset = setTimeout(() => setCurrentPhase(11), 16000);
    }
    return () => { clearTimeout(tSeq2); clearTimeout(tSeq3); clearTimeout(tReset); };
  }, [currentPhase]);

  useEffect(() => {
    if (currentPhase !== 11) return;
    setP11TextIndex(0);
    setP11ShakeIntensity(0);
    let active = true;
    let timerId: NodeJS.Timeout;
    const startTime = Date.now();
    const tick = () => {
      if (!active) return;
      const elapsed = Date.now() - startTime;
      if (elapsed < 3500) {
        setP11TextIndex(0);
        timerId = setTimeout(tick, 50);
      } else if (elapsed < 11200) {
        const progress = (elapsed - 3500) / (11200 - 3500);
        const nextDelay = Math.max(80, 350 * Math.pow(1 - progress, 1.5));
        const randomIdx = 1 + Math.floor(Math.random() * 18);
        setP11TextIndex(randomIdx);
        timerId = setTimeout(tick, nextDelay);
      } else if (elapsed < 14000) {
        setP11TextIndex(19);
        timerId = setTimeout(tick, 50);
      } else {
        setP11TextIndex(19);
        timerId = setTimeout(tick, 50);
      }
    };
    tick();
    const endTimer = setTimeout(() => setCurrentPhase(12), 17000);
    return () => { active = false; clearTimeout(timerId); clearTimeout(endTimer); };
  }, [currentPhase]);

  // Phase 6 wood shavings
  useEffect(() => {
    if (currentPhase !== 6 || !p6WoodShavingsCanvasRef.current) return;
    const canvas = p6WoodShavingsCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animFrame: number;
    const rect = canvas.getBoundingClientRect();
    let width = (canvas.width = rect.width || 600);
    let height = (canvas.height = rect.height || 200);
    const handleResize = () => {
      const r = canvas.getBoundingClientRect();
      width = canvas.width = r.width || 600;
      height = canvas.height = r.height || 200;
    };
    window.addEventListener("resize", handleResize);
    interface WoodShaving {
      x: number; y: number; vx: number; vy: number; size: number;
      angle: number; vr: number; alpha: number; decay: number;
      color: string; lineWidth: number; curlType: "spiral" | "arc" | "flake" | "dust";
    }
    const particles: WoodShaving[] = [];
    const renderLoop = () => {
      ctx.clearRect(0, 0, width, height);
      if (p6ShavingActive) {
        const hPos = p6HandPositionRef.current;
        if (hPos > -15 && hPos < 115) {
          const letterX = 120 + (hPos / 100) * (width - 240);
          const letterY = height * 0.55;
          const colors = ["rgba(217, 119, 6, ", "rgba(180, 83, 9, ", "rgba(245, 158, 11, ", "rgba(146, 64, 14, ", "rgba(120, 53, 15, "];
          if (Math.random() > 0.55) {
            particles.push({
              x: letterX, y: letterY + (Math.random() - 0.5) * 12,
              vx: -(Math.random() * 3.0 + 1.25), vy: -(Math.random() * 4.0 + 2.0),
              size: Math.random() * 9 + 5, angle: Math.random() * Math.PI * 2,
              vr: (Math.random() - 0.5) * 0.3, alpha: 1.0,
              decay: Math.random() * 0.012 + 0.008,
              color: colors[Math.floor(Math.random() * colors.length)],
              lineWidth: Math.random() * 1.8 + 0.8, curlType: Math.random() > 0.4 ? "spiral" : "arc",
            });
          }
          const dustColors = ["rgba(251, 191, 36, ", "rgba(245, 158, 11, ", "rgba(217, 119, 6, ", "rgba(252, 211, 77, ", "rgba(253, 230, 138, "];
          for (let i = 0; i < 6; i++) {
            particles.push({
              x: letterX + (Math.random() - 0.5) * 10, y: letterY + (Math.random() - 0.5) * 15,
              vx: -(Math.random() * 4.8 + 1.0), vy: -(Math.random() * 5.5 + 2.2),
              size: Math.random() * 3.5 + 1.2, angle: Math.random() * Math.PI * 2,
              vr: (Math.random() - 0.5) * 0.5, alpha: Math.random() * 0.95 + 0.05,
              decay: Math.random() * 0.02 + 0.015,
              color: dustColors[Math.floor(Math.random() * dustColors.length)],
              lineWidth: 1, curlType: "dust",
            });
          }
        }
      }
      particles.forEach((p, idx) => {
        p.vy += 0.16; p.vx *= 0.97; p.x += p.vx; p.y += p.vy; p.angle += p.vr; p.alpha -= p.decay;
        if (p.alpha <= 0) { particles.splice(idx, 1); return; }
        ctx.save();
        ctx.strokeStyle = `${p.color}${p.alpha})`;
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.lineWidth = p.lineWidth;
        if (p.curlType === "spiral") {
          ctx.beginPath();
          const cx = p.x, cy = p.y;
          let r = p.size;
          for (let theta = 0; theta < Math.PI * 2.2; theta += 0.12) {
            r = p.size * (1 - theta / (Math.PI * 4));
            const x = cx + Math.cos(p.angle + theta) * r;
            const y = cy + Math.sin(p.angle + theta) * r;
            if (theta === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        } else if (p.curlType === "arc") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, p.angle, p.angle + Math.PI * 1.3);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
      animFrame = requestAnimationFrame(renderLoop);
    };
    animFrame = requestAnimationFrame(renderLoop);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, [currentPhase, p6ShavingActive]);

  // GSAP for Phase 2 entities
  useEffect(() => {
    if (currentPhase === 2) {
      if (timelineRef.current) timelineRef.current.kill();
      const totalTimeline = gsap.timeline();
      entitiesRef.current.forEach((entity) => {
        totalTimeline.to(entity, { progress: 1.8, duration: entity.duration, ease: "sine.inOut", delay: entity.delay }, 0);
      });
      timelineRef.current = totalTimeline;
    }
    return () => { if (timelineRef.current) timelineRef.current.kill(); };
  }, [currentPhase, animationKey]);

  // Main Canvas – Phase 1 & Phase 2 (with full entity drawing)
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const starlightParticles: Array<{
      x: number; y: number; size: number; color: string;
      speedY: number; speedX: number; alpha: number; alphaSpeed: number;
    }> = [];
    const initStarlight = () => {
      starlightParticles.length = 0;
      for (let i = 0; i < 40; i++) {
        starlightParticles.push({
          x: Math.random() * width, y: Math.random() * height,
          size: Math.random() * 2 + 1,
          color: Math.random() > 0.6 ? "247, 149, 32" : "56, 189, 248",
          speedY: -(Math.random() * 0.4 + 0.1),
          speedX: (Math.random() - 0.5) * 0.2,
          alpha: Math.random() * 0.5 + 0.1,
          alphaSpeed: Math.random() * 0.005 + 0.002,
        });
      }
    };
    initStarlight();

    const dustParticles: DustParticle[] = [];
    const steamParticles: SteamParticle[] = [];
    let time = 0;
    let starlightOpacity = 1;

    const draw = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);
      const groundY = height * 0.84;

      if (currentPhase >= 2) {
        if (starlightOpacity > 0) starlightOpacity -= 0.02;
      } else {
        starlightOpacity = 1;
      }

      if (starlightOpacity > 0) {
        starlightParticles.forEach((p) => {
          p.y += p.speedY;
          p.x += p.speedX;
          if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
          if (p.x < -10 || p.x > width + 10) p.x = Math.random() * width;
          p.alpha += p.alphaSpeed;
          if (p.alpha > 0.75 || p.alpha < 0.1) p.alphaSpeed = -p.alphaSpeed;
          ctx.beginPath();
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
          grad.addColorStop(0, `rgba(${p.color}, ${p.alpha * starlightOpacity})`);
          grad.addColorStop(1, `rgba(${p.color}, 0)`);
          ctx.fillStyle = grad;
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      if (currentPhase === 2 && isPlaying) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        ctx.lineTo(width, groundY);
        ctx.stroke();

        entitiesRef.current.forEach((entity) => {
          if (entity.progress < -0.4 || entity.progress > 1.8) return;
          const entX = entity.progress * width;
          const scale = entity.scale;
          const shapePhase = time * 18 * (1.2 / scale);
          let entY = groundY;
          if (entity.type === "plane" && entity.yFactor !== undefined) {
            entY = height * entity.yFactor + Math.sin(time * 3 + entity.id.charCodeAt(0)) * 12;
          }

          if (entity.progress >= 0 && entity.progress <= 1.3 && entity.type !== "plane") {
            const dustRates: Record<EntityType, number> = {
              warrior: 0.6, horse: 0.9, chariot: 0.8,
              train: 1.0, car: 0.9, bike: 0.5, plane: 0,
            };
            if (Math.random() < (dustRates[entity.type] || 0)) {
              const dustCount = entity.type === "train" ? 4 : (entity.type === "horse" || entity.type === "chariot") ? 2 : 1;
              for (let d = 0; d < dustCount; d++) {
                dustParticles.push({
                  x: entX - (entity.type === "train" ? 30 * scale : 5 * scale) + (Math.random() - 0.5) * 8,
                  y: groundY - Math.random() * 4,
                  vx: -(Math.random() * 3 + 1.5),
                  vy: -(Math.random() * 3 + 0.8),
                  size: Math.random() * 6 + 4,
                  alpha: Math.random() * 0.65 + 0.35,
                  decay: Math.random() * 0.008 + 0.006,
                });
              }
            }
          }

          if (entity.type === "train" && entity.progress >= -0.1 && entity.progress <= 1.3) {
            if (Math.random() < 0.35) {
              steamParticles.push({
                x: entX + 16 * scale,
                y: groundY - 32 * scale,
                vx: -(Math.random() * 1.5 + 1.0),
                vy: -(Math.random() * 1.5 + 2.0),
                size: Math.random() * 6 + 6,
                alpha: Math.random() * 0.55 + 0.25,
                decay: Math.random() * 0.009 + 0.007,
              });
            }
          }

          ctx.save();
          ctx.fillStyle = "rgba(240, 240, 243, 0.88)";
          ctx.strokeStyle = "rgba(240, 240, 243, 0.88)";
          ctx.lineWidth = 2 * scale;

          if (entity.type === "warrior") {
            const cycle = shapePhase;
            const hipY = entY - 30 * scale + Math.sin(cycle * 2) * 2 * scale;
            const shoulderX = entX - 2 * scale;
            const shoulderY = hipY - 24 * scale;
            const headX = shoulderX + 4 * scale;
            const headY = shoulderY - 8 * scale;
            ctx.beginPath();
            ctx.arc(headX, headY, 5 * scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.lineWidth = 4 * scale;
            ctx.lineCap = "round";
            ctx.moveTo(entX, hipY);
            ctx.lineTo(shoulderX, shoulderY);
            ctx.stroke();
            const angleL1 = Math.sin(cycle) * 0.7;
            const angleL2 = Math.sin(cycle + Math.PI) * 0.7;
            const kneeX1 = entX + Math.sin(angleL1) * 12 * scale;
            const kneeY1 = hipY + Math.cos(angleL1) * 12 * scale;
            const ankleX1 = kneeX1 + Math.sin(angleL1 - 0.5) * 10 * scale;
            const ankleY1 = kneeY1 + Math.cos(angleL1 - 0.5) * 10 * scale;
            ctx.beginPath();
            ctx.lineWidth = 3 * scale;
            ctx.moveTo(entX, hipY);
            ctx.lineTo(kneeX1, kneeY1);
            ctx.lineTo(ankleX1, ankleY1);
            ctx.stroke();
            const kneeX2 = entX + Math.sin(angleL2) * 12 * scale;
            const kneeY2 = hipY + Math.cos(angleL2) * 12 * scale;
            const ankleX2 = kneeX2 + Math.sin(angleL2 - 0.5) * 10 * scale;
            const ankleY2 = kneeY2 + Math.cos(angleL2 - 0.5) * 10 * scale;
            ctx.beginPath();
            ctx.moveTo(entX, hipY);
            ctx.lineTo(kneeX2, kneeY2);
            ctx.lineTo(ankleX2, ankleY2);
            ctx.stroke();
            const armAngle1 = Math.sin(cycle + Math.PI) * 0.5;
            const handX1 = shoulderX + Math.sin(armAngle1) * 10 * scale;
            const handY1 = shoulderY + 12 * scale + Math.cos(armAngle1) * 4 * scale;
            ctx.beginPath();
            ctx.lineWidth = 2 * scale;
            ctx.moveTo(shoulderX, shoulderY);
            ctx.lineTo(handX1, handY1);
            ctx.stroke();
            ctx.save();
            ctx.strokeStyle = "rgba(249, 115, 22, 0.5)";
            ctx.lineWidth = 1.5 * scale;
            ctx.beginPath();
            ctx.moveTo(handX1 - 14 * scale, handY1 + 14 * scale);
            ctx.lineTo(handX1 + 22 * scale, handY1 - 22 * scale);
            ctx.stroke();
            ctx.restore();
          } else if (entity.type === "horse") {
            const cycle = shapePhase;
            const bodyY = entY - 24 * scale + Math.sin(cycle * 2) * 2 * scale;
            ctx.beginPath();
            ctx.ellipse(entX, bodyY, 16 * scale, 9 * scale, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(entX + 10 * scale, bodyY - 4 * scale);
            ctx.lineTo(entX + 18 * scale, bodyY - 18 * scale);
            ctx.lineTo(entX + 13 * scale, bodyY - 20 * scale);
            ctx.lineTo(entX + 6 * scale, bodyY);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(entX + 18 * scale, bodyY - 18 * scale);
            ctx.lineTo(entX + 25 * scale, bodyY - 15 * scale);
            ctx.lineTo(entX + 22 * scale, bodyY - 11 * scale);
            ctx.closePath();
            ctx.fill();
            const swingFront = Math.sin(cycle) * 0.8;
            const swingBack = Math.sin(cycle + Math.PI * 0.7) * 0.8;
            ctx.lineWidth = 3.5 * scale;
            ctx.beginPath();
            ctx.moveTo(entX + 12 * scale, bodyY + 3 * scale);
            ctx.lineTo(entX + 12 * scale + Math.sin(swingFront) * 14 * scale, bodyY + 18 * scale);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(entX - 12 * scale, bodyY + 3 * scale);
            ctx.lineTo(entX - 12 * scale + Math.sin(swingBack) * 15 * scale, bodyY + 18 * scale);
            ctx.stroke();
            ctx.beginPath();
            ctx.lineWidth = 2 * scale;
            ctx.moveTo(entX - 15 * scale, bodyY - 4 * scale);
            ctx.quadraticCurveTo(entX - 25 * scale, bodyY + Math.sin(cycle) * 4 * scale, entX - 22 * scale, bodyY + 10 * scale);
            ctx.stroke();
            const riderX = entX - 2 * scale;
            const riderY = bodyY - 8 * scale;
            ctx.beginPath();
            ctx.arc(riderX + 4 * scale, riderY - 10 * scale, 3.5 * scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.lineWidth = 3.5 * scale;
            ctx.lineCap = "round";
            ctx.moveTo(riderX, riderY);
            ctx.lineTo(riderX + 3 * scale, riderY - 8 * scale);
            ctx.stroke();
            ctx.beginPath();
            ctx.lineWidth = 2.5 * scale;
            ctx.moveTo(riderX + 1 * scale, riderY - 4 * scale);
            ctx.lineTo(riderX + 3 * scale, riderY + 5 * scale);
            ctx.stroke();
            ctx.beginPath();
            ctx.lineWidth = 1.2 * scale;
            ctx.moveTo(riderX + 2 * scale, riderY - 6 * scale);
            ctx.lineTo(entX + 12 * scale, bodyY - 14 * scale);
            ctx.stroke();
          } else if (entity.type === "chariot") {
            const cycle = shapePhase;
            const chariotX = entX - 35 * scale;
            const horseY = entY - 24 * scale + Math.sin(cycle * 2) * 2 * scale;
            ctx.beginPath();
            ctx.ellipse(entX, horseY, 15 * scale, 8 * scale, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(entX + 9 * scale, horseY);
            ctx.lineTo(entX + 17 * scale, horseY - 17 * scale);
            ctx.lineTo(entX + 22 * scale, horseY - 14 * scale);
            ctx.lineTo(entX + 6 * scale, horseY + 5 * scale);
            ctx.closePath();
            ctx.fill();
            ctx.lineWidth = 3 * scale;
            const swingHFront = Math.sin(cycle) * 0.8;
            const swingHBack = Math.cos(cycle) * 0.8;
            ctx.beginPath();
            ctx.moveTo(entX + 10 * scale, horseY + 3 * scale);
            ctx.lineTo(entX + 10 * scale + swingHFront * 14 * scale, entY);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(entX - 10 * scale, horseY + 3 * scale);
            ctx.lineTo(entX - 10 * scale + swingHBack * 14 * scale, entY);
            ctx.stroke();
            ctx.beginPath();
            ctx.lineWidth = 1 * scale;
            ctx.strokeStyle = "rgba(240, 240, 243, 0.4)";
            ctx.moveTo(chariotX + 2 * scale, entY - 26 * scale);
            ctx.lineTo(entX + 17 * scale, horseY - 14 * scale);
            ctx.stroke();
            ctx.strokeStyle = "rgba(240, 240, 243, 0.7)";
            ctx.lineWidth = 2.5 * scale;
            ctx.beginPath();
            ctx.moveTo(chariotX, entY - 6 * scale);
            ctx.lineTo(entX - 2 * scale, entY - 15 * scale);
            ctx.stroke();
            const wheelRadius = 8 * scale;
            const wheelY = entY - wheelRadius;
            const wheelSpin = (entX / wheelRadius);
            ctx.beginPath();
            ctx.arc(chariotX, wheelY, wheelRadius, 0, Math.PI * 2);
            ctx.stroke();
            for (let s = 0; s < 6; s++) {
              const spAngle = wheelSpin + (s * Math.PI) / 3;
              ctx.beginPath();
              ctx.moveTo(chariotX, wheelY);
              ctx.lineTo(chariotX + Math.cos(spAngle) * wheelRadius, wheelY + Math.sin(spAngle) * wheelRadius);
              ctx.stroke();
            }
            ctx.beginPath();
            ctx.moveTo(chariotX - 10 * scale, entY - 4 * scale);
            ctx.lineTo(chariotX + 5 * scale, entY - 4 * scale);
            ctx.lineTo(chariotX + 7 * scale, entY - 20 * scale);
            ctx.quadraticCurveTo(chariotX - 5 * scale, entY - 22 * scale, chariotX - 12 * scale, entY - 14 * scale);
            ctx.closePath();
            ctx.fill();
            const driverX = chariotX + 1 * scale;
            const driverY = entY - 32 * scale;
            ctx.beginPath();
            ctx.lineWidth = 4 * scale;
            ctx.moveTo(driverX, driverY);
            ctx.lineTo(chariotX, entY - 6 * scale);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(driverX + 1 * scale, driverY - 6 * scale, 4 * scale, 0, Math.PI * 2);
            ctx.fill();
          } else if (entity.type === "train") {
            const cabW = 18 * scale, cabH = 26 * scale;
            const boilerW = 44 * scale, boilerH = 16 * scale;
            ctx.fillRect(entX - 15 * scale, entY - 23 * scale, boilerW, boilerH);
            ctx.fillRect(entX - 32 * scale, entY - 33 * scale, cabW, cabH);
            ctx.fillRect(entX - 35 * scale, entY - 35 * scale, cabW + 5 * scale, 3 * scale);
            ctx.fillRect(entX + 20 * scale, entY - 31 * scale, 5 * scale, 9 * scale);
            ctx.beginPath();
            ctx.moveTo(entX + 29 * scale, entY - 2 * scale);
            ctx.lineTo(entX + 38 * scale, entY - 2 * scale);
            ctx.lineTo(entX + 29 * scale, entY - 14 * scale);
            ctx.closePath();
            ctx.fill();
            const wheelRadius = 10 * scale;
            const spin = (entX / wheelRadius);
            const wPositions = [entX - 22 * scale, entX - 4 * scale];
            ctx.lineWidth = 2.5 * scale;
            wPositions.forEach((wx) => {
              const wy = entY - wheelRadius;
              ctx.beginPath();
              ctx.arc(wx, wy, wheelRadius, 0, Math.PI * 2);
              ctx.stroke();
              for (let i = 0; i < 8; i++) {
                const spAngle = spin + (i * Math.PI) / 4;
                ctx.beginPath();
                ctx.moveTo(wx, wy);
                ctx.lineTo(wx + Math.cos(spAngle) * wheelRadius, wy + Math.sin(spAngle) * wheelRadius);
                ctx.stroke();
              }
            });
            ctx.strokeStyle = "rgba(240, 240, 243, 0.95)";
            ctx.lineWidth = 2 * scale;
            const px1 = wPositions[0] + Math.cos(spin) * 5 * scale;
            const py1 = (entY - wheelRadius) + Math.sin(spin) * 5 * scale;
            const px2 = wPositions[1] + Math.cos(spin) * 5 * scale;
            const py2 = (entY - wheelRadius) + Math.sin(spin) * 5 * scale;
            ctx.beginPath();
            ctx.moveTo(px1, py1);
            ctx.lineTo(px2, py2);
            ctx.stroke();
            const crossheadX = entX + 16 * scale + Math.cos(spin) * 4 * scale;
            const crossheadY = entY - wheelRadius;
            ctx.beginPath();
            ctx.moveTo(px2, py2);
            ctx.lineTo(crossheadX, crossheadY);
            ctx.stroke();
            const fwRadius = 5 * scale;
            ctx.beginPath();
            ctx.arc(entX + 18 * scale, entY - fwRadius, fwRadius, 0, Math.PI * 2);
            ctx.stroke();
            const coachW = 24 * scale, coachH = 18 * scale;
            const coachY = entY - coachH - 1.5 * scale;
            ctx.fillRect(entX - 45 * scale, entY - 6 * scale, 13 * scale, 2 * scale);
            ctx.fillRect(entX - 69 * scale, coachY, coachW, coachH);
            ctx.fillRect(entX - 70 * scale, coachY, coachW + 2 * scale, 2 * scale);
            ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
            ctx.fillRect(entX - 65 * scale, coachY + 4 * scale, 4 * scale, 5 * scale);
            ctx.fillRect(entX - 59 * scale, coachY + 4 * scale, 4 * scale, 5 * scale);
            ctx.fillRect(entX - 53 * scale, coachY + 4 * scale, 4 * scale, 5 * scale);
            ctx.fillStyle = "rgba(240, 240, 243, 0.88)";
            const coachWr = 4.5 * scale;
            const cw1Positions = [entX - 63 * scale, entX - 51 * scale];
            cw1Positions.forEach((wx) => {
              ctx.beginPath();
              ctx.arc(wx, entY - coachWr, coachWr, 0, Math.PI * 2);
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(wx - coachWr, entY - coachWr);
              ctx.lineTo(wx + coachWr, entY - coachWr);
              ctx.stroke();
            });
            ctx.fillRect(entX - 81 * scale, entY - 6 * scale, 12 * scale, 2 * scale);
            ctx.fillRect(entX - 105 * scale, coachY, coachW, coachH);
            ctx.fillRect(entX - 106 * scale, coachY, coachW + 2 * scale, 2 * scale);
            ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
            ctx.fillRect(entX - 101 * scale, coachY + 4 * scale, 4 * scale, 5 * scale);
            ctx.fillRect(entX - 95 * scale, coachY + 4 * scale, 4 * scale, 5 * scale);
            ctx.fillRect(entX - 89 * scale, coachY + 4 * scale, 4 * scale, 5 * scale);
            ctx.fillStyle = "rgba(240, 240, 243, 0.88)";
            const cw2Positions = [entX - 99 * scale, entX - 87 * scale];
            cw2Positions.forEach((wx) => {
              ctx.beginPath();
              ctx.arc(wx, entY - coachWr, coachWr, 0, Math.PI * 2);
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(wx - coachWr, entY - coachWr);
              ctx.lineTo(wx + coachWr, entY - coachWr);
              ctx.stroke();
            });
          } else if (entity.type === "bike") {
            const cycle = shapePhase * 1.25;
            const bikeX = entX;
            const wr = 6.5 * scale;
            const wheelY = entY - wr;
            const backWheelX = bikeX - 14 * scale;
            const frontWheelX = bikeX + 14 * scale;
            ctx.lineWidth = 1 * scale;
            ctx.beginPath();
            ctx.arc(backWheelX, wheelY, wr, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(frontWheelX, wheelY, wr, 0, Math.PI * 2);
            ctx.stroke();
            const bottomBracketX = bikeX - 2 * scale;
            const bottomBracketY = wheelY + 1 * scale;
            const seatPostTopX = bikeX - 5 * scale;
            const seatPostTopY = wheelY - 11 * scale;
            const headTubeTopX = bikeX + 8 * scale;
            const headTubeTopY = wheelY - 13 * scale;
            ctx.lineWidth = 1.5 * scale;
            ctx.beginPath();
            ctx.moveTo(backWheelX, wheelY);
            ctx.lineTo(bottomBracketX, bottomBracketY);
            ctx.moveTo(backWheelX, wheelY);
            ctx.lineTo(seatPostTopX, seatPostTopY);
            ctx.moveTo(seatPostTopX, seatPostTopY);
            ctx.lineTo(bottomBracketX, bottomBracketY);
            ctx.moveTo(bottomBracketX, bottomBracketY);
            ctx.lineTo(headTubeTopX, headTubeTopY);
            ctx.moveTo(seatPostTopX, seatPostTopY);
            ctx.lineTo(headTubeTopX - 1 * scale, headTubeTopY + 1 * scale);
            ctx.moveTo(headTubeTopX, headTubeTopY);
            ctx.lineTo(frontWheelX, wheelY);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(headTubeTopX, headTubeTopY);
            ctx.lineTo(headTubeTopX + 1 * scale, headTubeTopY - 3 * scale);
            ctx.lineTo(headTubeTopX + 3.5 * scale, headTubeTopY - 2 * scale);
            ctx.stroke();
            ctx.fillRect(seatPostTopX - 3.5 * scale, seatPostTopY - 1 * scale, 6 * scale, 1.5 * scale);
            const hipX = seatPostTopX + 1 * scale;
            const hipY = seatPostTopY - 3 * scale;
            const shoulderX = bikeX + 3 * scale;
            const shoulderY = wheelY - 21 * scale;
            const headX = shoulderX + 2.5 * scale;
            const headY = shoulderY - 5 * scale;
            ctx.beginPath();
            ctx.arc(headX, headY, 3.2 * scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.lineWidth = 3.5 * scale;
            ctx.lineCap = "round";
            ctx.moveTo(hipX, hipY);
            ctx.lineTo(shoulderX, shoulderY);
            ctx.stroke();
            ctx.beginPath();
            ctx.lineWidth = 1.8 * scale;
            ctx.moveTo(shoulderX, shoulderY);
            ctx.lineTo(headTubeTopX + 2.5 * scale, headTubeTopY - 2 * scale);
            ctx.stroke();
            const pedalAngle = cycle;
            const crankLen = 3.2 * scale;
            const pedalX1 = bottomBracketX + Math.sin(pedalAngle) * crankLen;
            const pedalY1 = bottomBracketY + Math.cos(pedalAngle) * crankLen;
            const pedalX2 = bottomBracketX + Math.sin(pedalAngle + Math.PI) * crankLen;
            const pedalY2 = bottomBracketY + Math.cos(pedalAngle + Math.PI) * crankLen;
            ctx.lineWidth = 1 * scale;
            ctx.beginPath();
            ctx.moveTo(bottomBracketX, bottomBracketY);
            ctx.lineTo(pedalX1, pedalY1);
            ctx.moveTo(bottomBracketX, bottomBracketY);
            ctx.lineTo(pedalX2, pedalY2);
            ctx.stroke();
            ctx.lineWidth = 2.2 * scale;
            const kneeX1 = hipX + 1 * scale + Math.sin(pedalAngle + 0.35) * 5.2 * scale;
            const kneeY1 = hipY + 5.5 * scale + Math.cos(pedalAngle + 0.35) * 2.2 * scale;
            ctx.beginPath();
            ctx.moveTo(hipX, hipY);
            ctx.lineTo(kneeX1, kneeY1);
            ctx.lineTo(pedalX1, pedalY1);
            ctx.stroke();
            const kneeX2 = hipX + 1 * scale + Math.sin(pedalAngle + Math.PI + 0.35) * 5.2 * scale;
            const kneeY2 = hipY + 5.5 * scale + Math.cos(pedalAngle + Math.PI + 0.35) * 2.2 * scale;
            ctx.beginPath();
            ctx.moveTo(hipX, hipY);
            ctx.lineTo(kneeX2, kneeY2);
            ctx.lineTo(pedalX2, pedalY2);
            ctx.stroke();
          } else if (entity.type === "car") {
            const vibrateY = Math.sin(time * 30) * 1.0 * scale;
            const carY = entY + vibrateY;
            const carWidth = 40 * scale;
            const carHeight = 12 * scale;
            ctx.fillRect(entX - 20 * scale, carY - 20 * scale, carWidth, carHeight);
            ctx.fillRect(entX + 18 * scale, carY - 14 * scale, 5 * scale, 6 * scale);
            ctx.beginPath();
            ctx.lineWidth = 1.5 * scale;
            ctx.arc(entX - 11 * scale, carY - 9 * scale, 12 * scale, Math.PI, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(entX + 11 * scale, carY - 9 * scale, 12 * scale, Math.PI, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(entX + 12 * scale, carY - 20 * scale);
            ctx.lineTo(entX + 7 * scale, carY - 29 * scale);
            ctx.stroke();
            const wr = 8 * scale;
            const spin = (entX / wr);
            const wPositions = [entX - 12 * scale, entX + 12 * scale];
            wPositions.forEach((wx) => {
              const wy = entY - wr;
              ctx.beginPath();
              ctx.arc(wx, wy, wr, 0, Math.PI * 2);
              ctx.stroke();
              for (let i = 0; i < 6; i++) {
                const spAngle = spin + (i * Math.PI) / 3;
                ctx.beginPath();
                ctx.moveTo(wx, wy);
                ctx.lineTo(wx + Math.cos(spAngle) * wr, wy + Math.sin(spAngle) * wr);
                ctx.stroke();
              }
            });
          } else if (entity.type === "plane") {
            const tilt = Math.cos(time * 4) * 0.05;
            ctx.translate(entX, entY);
            ctx.rotate(tilt);
            ctx.beginPath();
            ctx.ellipse(0, 0, 18 * scale, 4.5 * scale, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(-16 * scale, -2 * scale);
            ctx.lineTo(-21 * scale, -9 * scale);
            ctx.lineTo(-18 * scale, 1 * scale);
            ctx.closePath();
            ctx.fill();
            ctx.lineWidth = 2.5 * scale;
            ctx.beginPath();
            ctx.moveTo(-2 * scale, -12 * scale);
            ctx.lineTo(16 * scale, -10 * scale);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-2 * scale, 9 * scale);
            ctx.lineTo(13 * scale, 11 * scale);
            ctx.stroke();
            ctx.lineWidth = 1 * scale;
            ctx.beginPath();
            ctx.moveTo(3 * scale, -11 * scale);
            ctx.lineTo(3 * scale, 10 * scale);
            ctx.moveTo(12 * scale, -10 * scale);
            ctx.lineTo(12 * scale, 11 * scale);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(18 * scale, 0, 2.5 * scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "rgba(240, 240, 243, 0.4)";
            ctx.lineWidth = 1.2 * scale;
            const propSpin = time * 80;
            ctx.beginPath();
            ctx.moveTo(18 * scale - Math.sin(propSpin) * 12 * scale, -Math.cos(propSpin) * 12 * scale);
            ctx.lineTo(18 * scale + Math.sin(propSpin) * 12 * scale, Math.cos(propSpin) * 12 * scale);
            ctx.stroke();
          }

          ctx.restore();
        });

        dustParticles.forEach((p, index) => {
          p.x += p.vx;
          p.y += p.vy;
          p.size += 0.16;
          p.alpha -= p.decay;
          if (p.alpha <= 0) { dustParticles.splice(index, 1); return; }
          ctx.beginPath();
          const dustGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          dustGrad.addColorStop(0, `rgba(139, 115, 85, ${p.alpha * 0.7})`);
          dustGrad.addColorStop(1, `rgba(139, 115, 85, 0)`);
          ctx.fillStyle = dustGrad;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });

        steamParticles.forEach((p, index) => {
          p.x += p.vx;
          p.y += p.vy;
          p.size += 0.22;
          p.alpha -= p.decay;
          if (p.alpha <= 0) { steamParticles.splice(index, 1); return; }
          ctx.beginPath();
          const steamGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          steamGrad.addColorStop(0, `rgba(220, 220, 225, ${p.alpha * 0.6})`);
          steamGrad.addColorStop(1, `rgba(220, 220, 225, 0)`);
          ctx.fillStyle = steamGrad;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentPhase, isPlaying, animationKey]);

  // Phase 5 Colosseum torches & embers
  useEffect(() => {
    if (currentPhase === 5 && p5Step === 0 && p5CanvasRef.current) {
      const canvas = p5CanvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);
      const handleResize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      };
      window.addEventListener("resize", handleResize);
      interface Ember { x: number; y: number; vx: number; vy: number; size: number; alpha: number; phase: number; decay: number; color: string; }
      const embers: Ember[] = [];
      const initEmbers = () => {
        for (let i = 0; i < 75; i++) {
          embers.push({
            x: Math.random() * width, y: height + Math.random() * 100,
            vx: (Math.random() - 0.5) * 1.6, vy: -(Math.random() * 2.0 + 0.8),
            size: Math.random() * 2.8 + 1.0, alpha: Math.random() * 0.75 + 0.25,
            phase: Math.random() * Math.PI * 2, decay: Math.random() * 0.0035 + 0.0015,
            color: Math.random() > 0.45 ? "251, 146, 60" : "239, 68, 68",
          });
        }
      };
      initEmbers();
      interface WallTorch { xPct: number; yPct: number; phase: number; size: number; }
      const wallTorches: WallTorch[] = [
        { xPct: 0.35, yPct: 0.77, phase: 0.0, size: 4.8 },
        { xPct: 0.42, yPct: 0.77, phase: 1.2, size: 4.5 },
        { xPct: 0.58, yPct: 0.77, phase: 2.5, size: 4.5 },
        { xPct: 0.65, yPct: 0.77, phase: 3.8, size: 4.8 },
        { xPct: 0.36, yPct: 0.55, phase: 0.5, size: 3.8 },
        { xPct: 0.45, yPct: 0.55, phase: 1.8, size: 3.5 },
        { xPct: 0.55, yPct: 0.55, phase: 3.1, size: 3.5 },
        { xPct: 0.64, yPct: 0.55, phase: 4.4, size: 3.8 },
      ];
      let frameId: number;
      let time = 0;
      const drawExteriorDynamics = () => {
        time += 0.016;
        ctx.clearRect(0, 0, width, height);
        const svgMaxWidth = 500;
        const svgW = Math.min(width * 0.62, svgMaxWidth);
        const svgH = svgW;
        const svgX = (width - svgW) / 2;
        const svgY = (height - svgH) / 2 + 10;
        wallTorches.forEach((torch) => {
          const tX = svgX + torch.xPct * svgW;
          const tY = svgY + torch.yPct * svgH;
          const flameFlicker = 1.0 + Math.sin(time * 16 + torch.phase) * 0.2;
          const auraSize = torch.size * 3.5 * flameFlicker;
          const flameAlpha = 0.55 + Math.cos(time * 11 + torch.phase * 2.2) * 0.15;
          const grad = ctx.createRadialGradient(tX, tY, 0, tX, tY, auraSize);
          grad.addColorStop(0, `rgba(251, 146, 60, ${flameAlpha})`);
          grad.addColorStop(0.35, `rgba(239, 68, 68, ${flameAlpha * 0.45})`);
          grad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.beginPath();
          ctx.arc(tX, tY, auraSize, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(tX, tY, torch.size * 0.55 * flameFlicker, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
          ctx.fill();
        });
        embers.forEach((e) => {
          e.y += e.vy;
          e.x += e.vx + Math.sin(time * 1.8 + e.phase) * 0.6;
          e.alpha -= e.decay;
          if (e.y < -15 || e.alpha <= 0) {
            e.y = height + Math.random() * 45;
            e.x = Math.random() * width;
            e.alpha = Math.random() * 0.75 + 0.25;
            e.vx = (Math.random() - 0.5) * 1.6;
            e.vy = -(Math.random() * 2.0 + 0.8);
          }
          const currentAlpha = Math.max(0.01, e.alpha + Math.sin(time * 12 + e.phase) * 0.12);
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${e.color}, ${currentAlpha})`;
          ctx.fill();
        });
        frameId = requestAnimationFrame(drawExteriorDynamics);
      };
      drawExteriorDynamics();
      return () => {
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(frameId);
      };
    }
  }, [currentPhase, p5Step]);

  // Thousand & Years dust particles
  useEffect(() => {
    if (currentPhase !== 5 || !thousandDustCanvasRef.current) return;
    const canvas = thousandDustCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const containerW = parentRect.width || 120;
    const containerH = parentRect.height || 45;
    const bleed = 80;
    const width = (canvas.width = containerW + bleed * 2);
    const height = (canvas.height = containerH + bleed * 2);
    interface DustPart {
      x: number; y: number; vx: number; vy: number; size: number;
      alpha: number; decay: number; delay: number; color: string;
      wobbleSpeed: number; wobbleAmount: number; phase: number; isBurst: boolean;
    }
    const particles: DustPart[] = [];
    let animationFrameId: number;
    let time = 0;
    if (!thousandDustActive && showP5Thousand) {
      for (let i = 0; i < 20; i++) {
        particles.push({
          x: bleed + Math.random() * containerW, y: bleed + Math.random() * containerH,
          vx: (Math.random() - 0.5) * 0.25, vy: -(Math.random() * 0.4 + 0.15),
          size: Math.random() * 1.5 + 0.5, alpha: Math.random() * 0.45 + 0.15,
          decay: Math.random() * 0.003 + 0.001, delay: 0,
          color: Math.random() > 0.45 ? "251, 146, 60" : "253, 224, 71",
          wobbleSpeed: Math.random() * 1.5 + 0.5, wobbleAmount: Math.random() * 0.2 + 0.1,
          phase: Math.random() * Math.PI * 2, isBurst: false,
        });
      }
    }
    if (thousandDustActive) {
      const PARTICLE_COUNT = 240;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const initialPercentX = Math.random();
        const x = bleed + initialPercentX * containerW;
        const y = bleed + Math.random() * containerH;
        const delay = initialPercentX * 550;
        const vx = (Math.random() * 1.2 + 0.4);
        const vy = -(Math.random() * 1.8 + 0.7);
        const size = Math.random() * 2.4 + 0.6;
        const alpha = Math.random() * 0.9 + 0.1;
        const decay = Math.random() * 0.007 + 0.0035;
        const wobbleSpeed = Math.random() * 3.5 + 1.5;
        const wobbleAmount = Math.random() * 0.45 + 0.15;
        const phase = Math.random() * Math.PI * 2;
        const colors = ["251, 115, 22", "251, 146, 60", "253, 186, 116", "253, 224, 71", "254, 215, 170"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push({ x, y, vx, vy, size, alpha, decay, delay, color, wobbleSpeed, wobbleAmount, phase, isBurst: true });
      }
    }
    const draw = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);
      let anyActive = false;
      particles.forEach((p) => {
        if (p.isBurst && time * 1000 < p.delay) { anyActive = true; return; }
        p.y += p.vy;
        p.x += p.vx + Math.sin(time * p.wobbleSpeed + p.phase) * p.wobbleAmount;
        if (p.isBurst) p.size += 0.003;
        if (p.isBurst) {
          p.alpha -= p.decay;
        } else {
          if (p.y < 0 || p.alpha <= 0) {
            p.y = bleed + containerH;
            p.x = bleed + Math.random() * containerW;
            p.alpha = Math.random() * 0.45 + 0.15;
          }
        }
        if (p.alpha > 0) {
          anyActive = true;
          ctx.beginPath();
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3.5);
          grad.addColorStop(0, `rgba(${p.color}, ${p.alpha})`);
          grad.addColorStop(0.4, `rgba(${p.color}, ${p.alpha * 0.35})`);
          grad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = grad;
          ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.95})`;
          ctx.fill();
        }
      });
      if (!p5BgFadeOut && !thousandDustActive && showP5Thousand) anyActive = true;
      if (anyActive) animationFrameId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, [currentPhase, showP5Thousand, thousandDustActive]);

  useEffect(() => {
    if (currentPhase !== 5 || !yearsDustCanvasRef.current) return;
    const canvas = yearsDustCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const containerW = parentRect.width || 120;
    const containerH = parentRect.height || 45;
    const bleed = 80;
    const width = (canvas.width = containerW + bleed * 2);
    const height = (canvas.height = containerH + bleed * 2);
    interface DustPart {
      x: number; y: number; vx: number; vy: number; size: number;
      alpha: number; decay: number; delay: number; color: string;
      wobbleSpeed: number; wobbleAmount: number; phase: number; isBurst: boolean;
    }
    const particles: DustPart[] = [];
    let animationFrameId: number;
    let time = 0;
    if (!yearsDustActive && showP5Years) {
      for (let i = 0; i < 20; i++) {
        particles.push({
          x: bleed + Math.random() * containerW, y: bleed + Math.random() * containerH,
          vx: (Math.random() - 0.5) * 0.25, vy: -(Math.random() * 0.4 + 0.15),
          size: Math.random() * 1.5 + 0.5, alpha: Math.random() * 0.45 + 0.15,
          decay: Math.random() * 0.003 + 0.001, delay: 0,
          color: Math.random() > 0.45 ? "251, 146, 60" : "253, 224, 71",
          wobbleSpeed: Math.random() * 1.5 + 0.5, wobbleAmount: Math.random() * 0.2 + 0.1,
          phase: Math.random() * Math.PI * 2, isBurst: false,
        });
      }
    }
    if (yearsDustActive) {
      const PARTICLE_COUNT = 240;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const initialPercentX = Math.random();
        const x = bleed + initialPercentX * containerW;
        const y = bleed + Math.random() * containerH;
        const delay = initialPercentX * 550;
        const vx = (Math.random() * 1.2 + 0.4);
        const vy = -(Math.random() * 1.8 + 0.7);
        const size = Math.random() * 2.4 + 0.6;
        const alpha = Math.random() * 0.9 + 0.1;
        const decay = Math.random() * 0.007 + 0.0035;
        const wobbleSpeed = Math.random() * 3.5 + 1.5;
        const wobbleAmount = Math.random() * 0.45 + 0.15;
        const phase = Math.random() * Math.PI * 2;
        const colors = ["251, 115, 22", "251, 146, 60", "253, 186, 116", "253, 224, 71", "254, 215, 170"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push({ x, y, vx, vy, size, alpha, decay, delay, color, wobbleSpeed, wobbleAmount, phase, isBurst: true });
      }
    }
    const draw = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);
      let anyActive = false;
      particles.forEach((p) => {
        if (p.isBurst && time * 1000 < p.delay) { anyActive = true; return; }
        p.y += p.vy;
        p.x += p.vx + Math.sin(time * p.wobbleSpeed + p.phase) * p.wobbleAmount;
        if (p.isBurst) p.size += 0.003;
        if (p.isBurst) {
          p.alpha -= p.decay;
        } else {
          if (p.y < 0 || p.alpha <= 0) {
            p.y = bleed + containerH;
            p.x = bleed + Math.random() * containerW;
            p.alpha = Math.random() * 0.45 + 0.15;
          }
        }
        if (p.alpha > 0) {
          anyActive = true;
          ctx.beginPath();
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3.5);
          grad.addColorStop(0, `rgba(${p.color}, ${p.alpha})`);
          grad.addColorStop(0.4, `rgba(${p.color}, ${p.alpha * 0.35})`);
          grad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = grad;
          ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.95})`;
          ctx.fill();
        }
      });
      if (!p5BgFadeOut && !yearsDustActive && showP5Years) anyActive = true;
      if (anyActive) animationFrameId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, [currentPhase, showP5Years, yearsDustActive]);

  // Notify parent when Phase 12 reached
  useEffect(() => {
    if (currentPhase === 12 && !welcomeCompleteCalled.current) {
      welcomeCompleteCalled.current = true;
      if (onWelcomeComplete) onWelcomeComplete();
    }
  }, [currentPhase, onWelcomeComplete]);

  // ----- JSX (unchanged) -----
  return (
    <div
      ref={sectionRef}
      id="welcome-container"
      className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center text-white font-sans select-none"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/40 to-transparent pointer-events-none z-0" />
      <div id="bg-cinematic-mask" className="absolute inset-0 bg-black pointer-events-none" />

      <AnimatePresence>
        {isPlaying && currentPhase === 1 && (
          <motion.div
            id="glow-lens"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0.15, 0.28, 0.15], scale: [1, 1.15, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[600px] h-[600px] bg-gradient-radial from-[#f97316]/10 to-transparent rounded-full filter blur-[120px] pointer-events-none z-0"
          />
        )}
      </AnimatePresence>

      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {currentPhase === 2 && isPlaying && (
        <div id="ambient-ground-glows" className="absolute inset-0 z-5 pointer-events-none">
          <div className="absolute bottom-20 left-[10%] w-32 h-16 bg-zinc-700/10 blur-[40px] rounded-full" />
          <div className="absolute bottom-20 left-[40%] w-48 h-20 bg-zinc-600/10 blur-[50px] rounded-full" />
          <div className="absolute bottom-20 left-[70%] w-40 h-16 bg-zinc-700/10 blur-[40px] rounded-full" />
        </div>
      )}

      <AnimatePresence>
        {isPlaying && currentPhase === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-0 overflow-hidden"
          >
            <AnimatePresence mode="popLayout">
              <motion.div
                key={p3Step}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full animate-fade"
              >
                <div
                  className={`absolute inset-0 transition-colors duration-[1800ms] ease-in-out ${
                    p3Step === 0
                      ? "bg-gradient-to-tr from-[#020e1a] to-[#01050a]"
                      : p3Step === 1
                      ? "bg-gradient-to-tr from-[#1f1102] to-[#0a0501]"
                      : "bg-gradient-to-tr from-[#1a0202] to-[#0a0101]"
                  }`}
                />
                <img
                  src={p3Step === 0 ? "/WelcomeImg1.jpg" : p3Step === 1 ? "/WelcomeImg2.jpg" : "/WelcomeImg3.jpg"}
                  alt={`Phase 3 - Step ${p3Step}`}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-40"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,rgba(0,0,0,0.85)_55%,rgba(0,0,0,0.98)_90%)] pointer-events-none z-1" />
          </motion.div>
        )}
      </AnimatePresence>

      <div id="narrative-canvas" className="relative z-10 w-full h-full px-4 sm:px-8 select-none text-center">
        {/* Phase 1 text */}
        <AnimatePresence>
          {isPlaying && currentPhase === 1 && !p1FadingOut && (
            <motion.div
              key={animationKey}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
              className="relative w-full h-full flex flex-col items-center justify-center"
            >
              <div className="absolute top-1/2 transform -translate-y-1/2 -translate-y-8 sm:-translate-y-10 md:-translate-y-12 w-full">
                <div className="flex items-center justify-center">
                  <motion.h2
                    id="welcome-line-1"
                    initial={{ opacity: 0, filter: "blur(12px)", scale: 0.98 }}
                    animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                    transition={{ duration: 2.2, ease: "easeOut", delay: 0.3 }}
                    className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-2xl text-[#f3f4f6] font-light tracking-[2px] sm:tracking-[3px] leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] uppercase text-center font-display"
                  >
                    THIS IS NOT A STORY
                  </motion.h2>
                </div>
              </div>
              <div className="absolute top-1/2 transform -translate-y-1/2 translate-y-0 sm:translate-y-1 md:translate-y-2 w-full">
                <div className="flex items-center justify-center">
                  {showSecondLine && (
                    <motion.h3
                      id="welcome-line-2"
                      initial={{ opacity: 0, filter: "blur(15px)", scale: 0.96 }}
                      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                      transition={{ duration: 2.5, ease: "easeOut" }}
                      className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white font-black tracking-[2px] sm:tracking-[3px] md:tracking-[4px] uppercase leading-tight max-w-4xl px-4 text-center font-display"
                    >
                      IT&apos;S THE{" "}
                      <span className="text-[#f97316] font-black tracking-[3px] sm:tracking-[5px] md:tracking-[7px] drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]">
                        ONLY STORY
                      </span>{" "}
                      THAT MATTERS
                    </motion.h3>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 2 text */}
        <AnimatePresence>
          {isPlaying && currentPhase === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8 }}
              className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center px-4 sm:px-12"
            >
              <div className="mb-4 sm:mb-2 min-h-[1.5rem] flex items-center justify-center">
                <motion.p
                  initial={{ opacity: 0, filter: "blur(14px)" }}
                  animate={{ opacity: showP2Line1 ? 0.5 : 0, filter: showP2Line1 ? "blur(0px)" : "blur(14px)" }}
                  transition={{ duration: 2.0, ease: "easeOut" }}
                  className="text-[12px] sm:text-sm md:text-lg font-light tracking-[0.2em] sm:tracking-[0.2em] uppercase text-white"
                >
                  As we live our life today
                </motion.p>
              </div>
              <div className="w-full min-h-[9rem] sm:min-h-[12rem] md:min-h-[15rem] flex flex-col items-center justify-center">
                <motion.h1
                  initial={{ opacity: 0, filter: "blur(16px)" }}
                  animate={{ opacity: showP2Line2 ? 1 : 0, filter: showP2Line2 ? "blur(0px)" : "blur(16px)" }}
                  transition={{ duration: 2.2, ease: "easeOut" }}
                  className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold uppercase leading-[1.15] font-display flex flex-col items-center select-none"
                >
                  <div className="tracking-[0.09em] sm:tracking-[0.09em] flex items-center justify-center gap-2 sm:gap-4 flex-wrap whitespace-nowrap">
                    <span className="text-[#f2f2f7]">Many Have</span>{" "}
                    <span className="text-[#f97316]">walked</span>
                  </div>
                  <div className="text-[#f97316] tracking-[0.09em] sm:tracking-[0.09em] py-1">a path</div>
                  <div className="text-[#f2f2f7] tracking-[0.09em] sm:tracking-[0.09em]">before us</div>
                </motion.h1>
              </div>
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 1, duration: 1.5 }}
                className="mt-6 sm:mt-8 w-24 h-[1px] bg-gradient-to-r from-transparent via-[#f97316] to-transparent"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 3 text */}
        <AnimatePresence>
          {isPlaying && currentPhase === 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center px-4 sm:px-12 z-10"
            >
              <div className="flex flex-col items-center justify-center w-full max-w-5xl relative">
                <div className="absolute -top-14 sm:-top-20 left-0 right-0 h-10 flex items-center justify-center pointer-events-none">
                  <AnimatePresence>
                    {p3Step === 2 && (
                      <motion.span
                        initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-xl sm:text-2xl md:text-3xl text-white/50 tracking-[0.34em] uppercase font-light font-display"
                      >
                        And
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <motion.div
                  layout
                  transition={{ layout: { type: "spring", stiffness: 70, damping: 22 } }}
                  className="flex items-baseline justify-center select-none font-display font-black text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-normal text-center w-full gap-x-2.5 sm:gap-x-4 md:gap-x-6 lg:gap-x-9"
                >
                  <motion.span
                    layout
                    transition={{ layout: { type: "spring", stiffness: 70, damping: 22 } }}
                    className="text-[#f2f2f7] inline-block font-bold tracking-tight text-right select-none"
                  >
                    Some
                  </motion.span>
                  <motion.div
                    layout
                    transition={{ layout: { type: "spring", stiffness: 70, damping: 22 } }}
                    className="relative inline-block text-left min-w-[5.5em] xs:min-w-[6.0em] sm:min-w-[7.5em] md:min-w-[8.5em]"
                  >
                    <AnimatePresence mode="popLayout">
                      {p3Step === 0 && (
                        <motion.span
                          key="p3-brilliant"
                          layout
                          initial={{ opacity: 0, x: 20, filter: "blur(12px)" }}
                          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, x: -15, filter: "blur(8px)" }}
                          transition={{ duration: 1.8, ease: "easeInOut" }}
                          className="inline-block text-[#f2f2f7] whitespace-nowrap lowercase font-light"
                        >
                          {""}were a{" "}
                          <span className="text-amber-400 drop-shadow-[0_0_25px_rgba(251,191,36,0.55)] font-black uppercase tracking-[0.04em]">
                            Blessing
                          </span>
                        </motion.span>
                      )}
                      {p3Step === 1 && (
                        <motion.span
                          key="p3-blessing"
                          layout
                          initial={{ opacity: 0, x: 20, filter: "blur(12px)" }}
                          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, x: -15, filter: "blur(8px)" }}
                          transition={{ duration: 1.8, ease: "easeInOut" }}
                          className="inline-block text-[#f2f2f7] whitespace-nowrap lowercase font-light"
                        >
                          {" "}were{" "}
                          <span className="text-[#f97316] drop-shadow-[0_0_25px_rgba(249,115,22,0.48)] font-black uppercase tracking-[0.04em]">
                            Brilliant
                          </span>
                        </motion.span>
                      )}
                      {p3Step === 2 && (
                        <motion.span
                          key="p3-evil"
                          layout
                          initial={{ opacity: 0, x: 20, filter: "blur(12px)" }}
                          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, x: -15, filter: "blur(8px)" }}
                          transition={{ duration: 1.8, ease: "easeInOut" }}
                          className="inline-block text-[#f2f2f7] whitespace-nowrap lowercase font-light"
                        >
                          were
                          <span className="text-[#ef4444] drop-shadow-[0_0_30px_rgba(239,68,68,0.7)] font-black uppercase tracking-[0.04em] ml-[5%]">
                            Monsters
                          </span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
                <div id="phase3-symbol-divider" className="relative mt-[10%] sm:mt-20 w-32 flex justify-center items-center h-24 pointer-events-none">
                  <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1.5 }}
                    className={`w-32 h-[1px] transition-all duration-1000 ${
                      p3Step === 0 ? "bg-amber-400/40" : p3Step === 1 ? "bg-[#f97316]/40" : "bg-[#ef4444]/40"
                    }`}
                  />
                  <AnimatePresence mode="popLayout">
                    {p3Step === 0 && (
                      <motion.div
                        key="peace-sign-symbol"
                        initial={{ x: -100, rotate: -540, opacity: 0 }}
                        animate={{ x: 0, rotate: 0, opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.5, y: 15 }}
                        transition={{ x: { type: "spring", stiffness: 100, damping: 20, delay: 0.3 }, rotate: { type: "spring", stiffness: 100, damping: 20, delay: 0.3 }, opacity: { duration: 0.4, delay: 0.3 } }}
                        className="absolute bottom-12 w-16 h-16 flex items-center justify-center"
                      >
                        <svg viewBox="0 0 24 24" className="w-16 h-16 text-amber-400 filter drop-shadow-[0_0_18px_rgba(251,191,36,0.8)] fill-none stroke-current stroke-[2]" id="svg-peace">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="2" x2="12" y2="22" />
                          <line x1="12" y1="12" x2="4.9" y2="19.1" />
                          <line x1="12" y1="12" x2="19.1" y2="19.1" />
                        </svg>
                      </motion.div>
                    )}
                    {p3Step === 1 && (
                      <motion.div
                        key="newton-apple-symbol"
                        initial={{ y: -160, opacity: 0, scaleY: 1.2 }}
                        animate={{ y: 0, opacity: 1, scaleY: [1.2, 0.8, 1.1, 0.95, 1] }}
                        exit={{ opacity: 0, y: 20, scaleY: 0.8 }}
                        transition={{ y: { type: "spring", stiffness: 160, damping: 11, delay: 0.3 }, opacity: { duration: 0.3, delay: 0.3 }, scaleY: { duration: 0.6, delay: 0.3 } }}
                        className="absolute bottom-12 w-16 h-16 flex items-center justify-center"
                      >
                        <svg viewBox="0 0 24 24" className="w-16 h-16 text-[#f97316] filter drop-shadow-[0_0_20px_rgba(249,115,22,0.95)] fill-current" id="svg-apple">
                          <path d="M17 5q-.8-1-2-1c-1 0-1.5.5-2.2.5-.7 0-1.3-.5-2.3-.5-1.2 0-2.4 1-3.2 2.5a6.5 6.5 0 0 0-.4 5c.4 2.1 2.3 4.5 4.3 4.5.8 0 1.3-.4 2-.4.6 0 1.1.4 2 .4 2 0 3.7-2.3 4.2-4.3a5.5 5.5 0 0 0-.4-4.8q-.8-1.4-1.9-1.9M12 4c.5-1.5 2-2 2-2s-.3 1.8-1.5 2.5c-.8.5-1.5.3-2 .1.1-.3.8-.5 1.5-.6" />
                        </svg>
                      </motion.div>
                    )}
                    {p3Step === 2 && (
                      <motion.div
                        key="hangman-noose-symbol"
                        initial={{ opacity: 0, rotate: 60 }}
                        animate={{ opacity: 1, rotate: [-15, 15, -15] }}
                        exit={{ opacity: 0, scale: 0.5, y: -20 }}
                        style={{ originX: 0.5, originY: 0 }}
                        transition={{ rotate: { repeat: Infinity, duration: 3.6, ease: "easeInOut" }, opacity: { duration: 0.5, delay: 0.3 } }}
                        className="absolute top-12 w-14 h-24 flex items-center justify-center"
                      >
                        <svg viewBox="0 0 40 72" className="w-14 h-24 text-[#ef4444] filter drop-shadow-[0_0_18px_rgba(239,68,68,0.9)] fill-none stroke-current" id="svg-noose">
                          <path d="M20 0 L20 18" strokeWidth="2.5" strokeLinecap="round" />
                          <rect x="13" y="18" width="14" height="15" rx="1.5" fill="none" strokeWidth="2" />
                          <line x1="14" y1="21" x2="26" y2="21" strokeWidth="1.8" />
                          <line x1="14" y1="24" x2="26" y2="24" strokeWidth="1.8" />
                          <line x1="14" y1="27" x2="26" y2="27" strokeWidth="1.8" />
                          <line x1="14" y1="30" x2="26" y2="30" strokeWidth="1.8" />
                          <path d="M19 33 C12 40, 8 50, 12 59 C16 66, 24 66, 28 59 C32 50, 28 40, 21 33" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PHASE 4 COMPLETE RESOLUTION STATE */}
        <AnimatePresence>
          {currentPhase === 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2.2 }}
              className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center z-20  overflow-hidden select-none"
            >
              {/* 1. ANCIENT WORLD BATTLE ATLAS BACKDROP (MAP IMAGE WITH DYNAMIC PHASE 3 GRADIENT FALLBACK) */}
              <div className="absolute inset-0 z-0 pointer-events-none select-none">
                {/* Same gradient fallback as Phase 3 step 0 */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#020e1a] to-[#01050a]" />
                
                {/* Image layer supporting Roman Map images */}
                <img
                  src="/WelcomeImg4.jpg"
                  alt="Ancient Roman Map Backdrop"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-[0.38]"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src.endsWith("/WelcomeImg4.jpg")) {
                      target.src = "/WelcomeImg4.jpg";
                    } else {
                      target.style.display = 'none';
                    }
                  }}
                />

                {/* Strong radial gradient mask overlay showing only the center of the screen */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_5%,rgba(0,0,0,0.85)_48%,rgba(0,0,0,0.98)_82%)] pointer-events-none" />
              </div>

              {/* 2. LIVING INFERNO COMPASS SPARKS AND BURNING EMBERS COAL FLAMES BACKGROUND */}
              <div className="absolute inset-x-0 bottom-0 top-0 z-5 pointer-events-none overflow-hidden opacity-50 select-none">
                {Array.from({ length: 30 }).map((_, i) => {
                  const size = Math.random() * 4 + 2;
                  const delay = Math.random() * 6;
                  const duration = Math.random() * 8 + 6;
                  const horizOffset = Math.random() * 100;
                  return (
                    <motion.div
                      key={`ember-active-${i}`}
                      style={{
                        position: "absolute",
                        bottom: "-20px",
                        left: `${horizOffset}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                        borderRadius: "50%",
                        background: Math.random() > 0.35 ? "#ef4444" : "#f97316",
                        filter: "blur(1.2px) drop-shadow(0 0 10px rgba(239, 68, 68, 0.95))",
                      }}
                      animate={{
                        y: [0, -window.innerHeight - 80],
                        x: [0, (Math.random() - 0.5) * 180],
                        opacity: [0, 0.95, 0.4, 0],
                      }}
                      transition={{
                        duration,
                        delay,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  );
                })}
              </div>

              {/* 5. Left Bottom Corner portraits */}
              <div className="absolute left-4 bottom-0 sm:left-6 sm:bottom-6 w-[180px] xs:w-[240px] sm:w-[300px] md:w-[360px] lg:w-[450px] pointer-events-none z-30 select-none">
                <AnimatePresence mode="wait">
                  {(phase4Seq === 'seq1' || phase4Seq === 'seq1_out') ? (
                    <motion.svg
                      key="alexander-great"
                      viewBox="0 0 240 280"
                      className="w-full h-full filter drop-shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-transform duration-700 hover:scale-[1.02]"
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <defs>
                        <linearGradient id="alexGlowRealistic" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                          <stop offset="20%" stopColor="#fef08a" stopOpacity="0.9" />
                          <stop offset="55%" stopColor="#f97316" stopOpacity="0.75" />
                          <stop offset="100%" stopColor="#e11d48" stopOpacity="0.3" />
                        </linearGradient>
                      </defs>
                      <g fill="none" stroke="url(#alexGlowRealistic)" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
                        {/* Leonine curls */}
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq1' ? 1 : 0, opacity: 0.95 }}
                          transition={{ duration: phase4Seq === 'seq1' ? 3.8 : 1.4, delay: phase4Seq === 'seq1' ? 0.8 : 0, ease: "easeInOut" }}
                          d="
                            M 85,92 C 72,82 66,98 83,96
                            M 88,78 C 76,64 72,84 89,84
                            M 102,68 C 90,52 86,72 103,72
                            M 124,62 C 112,46 108,66 125,66
                            M 148,64 C 138,48 132,68 149,68
                            M 168,74 C 160,58 152,78 169,78
                            M 184,88 C 178,72 168,92 185,92
                            M 95,110 C 80,104 84,124 98,118
                            M 195,110 C 210,104 204,124 191,118
                            M 75,124 C 60,118 64,138 78,132
                            M 68,144 C 52,138 56,158 71,152
                            M 62,168 C 46,162 50,182 65,176
                            M 72,188 C 58,182 62,202 75,196
                            M 82,204 C 68,198 72,218 85,212
                          "
                          strokeWidth="1.3"
                        />
                        {/* Inner hair curls */}
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq1' ? 1 : 0 }}
                          transition={{ duration: phase4Seq === 'seq1' ? 3.0 : 1.4, delay: phase4Seq === 'seq1' ? 1.0 : 0, ease: "easeInOut" }}
                          d="
                            M 95,95 Q 85,85 95,78
                            M 112,82 Q 102,72 112,65
                            M 132,80 Q 122,70 132,62
                            M 152,85 Q 142,75 152,68
                            M 168,92 Q 158,82 168,75
                            M 102,100 T 115,102 T 132,98 T 150,100 T 165,102
                          "
                          strokeWidth="0.8"
                        />
                        {/* Crown laurel */}
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq1' ? 1 : 0, fillOpacity: phase4Seq === 'seq1' ? 0.15 : 0 }}
                          transition={{ duration: phase4Seq === 'seq1' ? 2.8 : 1.4, delay: phase4Seq === 'seq1' ? 1.5 : 0 }}
                          d="
                            M 112,50 Q 105,42 115,44 Q 120,49 112,50 Z
                            M 128,45 Q 120,37 130,39 Q 135,44 128,45 Z
                            M 144,46 Q 138,38 148,40 Q 153,45 144,46 Z
                            M 158,52 Q 152,44 162,46 Q 167,51 158,52 Z
                          "
                          fill="rgba(254, 240, 138, 0.15)"
                          strokeWidth="1.2"
                        />
                        {/* Facial details */}
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq1' ? 1 : 0 }}
                          transition={{ duration: phase4Seq === 'seq1' ? 3.2 : 1.4, delay: phase4Seq === 'seq1' ? 1.2 : 0 }}
                          d="M 104,124 Q 112,121 120,125 M 106,128 Q 112,129 118,128"
                          strokeWidth="1.5"
                        />
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq1' ? 1 : 0 }}
                          transition={{ duration: phase4Seq === 'seq1' ? 3.2 : 1.4, delay: phase4Seq === 'seq1' ? 1.3 : 0 }}
                          d="M 156,124 Q 148,121 140,125 M 154,128 Q 148,129 142,128"
                          strokeWidth="1.5"
                        />
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq1' ? 1 : 0, opacity: 1 }}
                          transition={{ duration: phase4Seq === 'seq1' ? 3.8 : 1.4, delay: phase4Seq === 'seq1' ? 1.1 : 0 }}
                          d="M 130,122 L 130,154 L 122,159 L 138,159"
                          strokeWidth="1.4"
                        />
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq1' ? 1 : 0 }}
                          transition={{ duration: phase4Seq === 'seq1' ? 3.5 : 1.4, delay: phase4Seq === 'seq1' ? 1.4 : 0 }}
                          d="
                            M 116,176 C 122,172 138,172 144,176
                            M 120,180 C 124,183 136,183 140,180
                            M 112,192 C 124,191 136,191 148,192
                            M 130,192 Q 130,202 130,206 Q 120,208 130,215
                          "
                        />
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq1' ? 1 : 0, opacity: 1 }}
                          transition={{ duration: phase4Seq === 'seq1' ? 4.0 : 1.4, delay: phase4Seq === 'seq1' ? 0.6 : 0 }}
                          d="M 94,126 Q 90,175 110,210 Q 130,225 150,210 Q 170,175 166,126"
                          strokeWidth="1.6"
                        />
                        {/* Shoulder armor */}
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq1' ? 1 : 0, opacity: 0.95, fillOpacity: phase4Seq === 'seq1' ? 0.12 : 0 }}
                          transition={{ duration: phase4Seq === 'seq1' ? 4.2 : 1.4, delay: phase4Seq === 'seq1' ? 1.8 : 0 }}
                          d="
                            M 60,250 C 45,260 55,290 75,285 C 95,280 85,250 60,250 Z
                            M 60,250 A 15,15 0 1,0 90,250 A 15,15 0 1,0 60,250
                            M 65,250 A 10,10 0 1,0 85,250 A 10,10 0 1,0 65,250
                            M 71,250 A 4,4 0 1,0 79,250 A 4,4 0 1,0 71,250
                          "
                          fill="rgba(249, 115, 22, 0.12)"
                          strokeWidth="1.5"
                        />
                        {/* Scale detail */}
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq1' ? 1 : 0, opacity: 0.8 }}
                          transition={{ duration: phase4Seq === 'seq1' ? 4.5 : 1.4, delay: phase4Seq === 'seq1' ? 2.1 : 0 }}
                          d="
                            M 90,240 Q 130,246 170,240
                            M 96,252 Q 130,258 164,252
                            M 102,264 Q 130,270 158,264
                            M 108,276 Q 130,282 152,276
                            M 90,240 L 98,290
                            M 110,243 L 114,290
                            M 130,245 L 130,290
                            M 150,243 L 146,290
                            M 170,240 L 162,290
                          "
                          strokeWidth="1.2"
                        />
                      </g>
                    </motion.svg>
                  ) : (
                    <motion.svg
                      key="warrior-horse"
                      viewBox="0 0 240 280"
                      className="w-full h-full filter drop-shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-transform duration-700 hover:scale-[1.02]"
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <defs>
                        <linearGradient id="cyrusGlowRealistic" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                          <stop offset="25%" stopColor="#fef08a" stopOpacity="0.9" />
                          <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#d97706" stopOpacity="0.35" />
                        </linearGradient>
                      </defs>
                      <g fill="none" stroke="url(#cyrusGlowRealistic)" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
                        {/* 1. Long heavy spear crossing diagonally */}
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0, opacity: 0.9 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 4.0 : 1.4, delay: phase4Seq === 'seq2' ? 0.6 : 0, ease: "easeInOut" }}
                          d="M 60,210 L 180,42"
                          strokeWidth="1.6"
                        />
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0, opacity: 0.95 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.0 : 1.4, delay: phase4Seq === 'seq2' ? 0.9 : 0 }}
                          d="M 180,42 L 176,34 L 186,30 L 184,40 M 186,30 L 180,42"
                          strokeWidth="1.4"
                        />

                        {/* 2. Billowing Cape layout blowing back to the left */}
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0, opacity: 0.85 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.8 : 1.4, delay: phase4Seq === 'seq2' ? 0.8 : 0, ease: "easeInOut" }}
                          d="M 100,105 C 70,100 50,90 30,105 C 20,110 25,128 45,135 C 70,142 90,140 102,148"
                          strokeWidth="1.3"
                        />
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.2 : 1.4, delay: phase4Seq === 'seq2' ? 1.0 : 0 }}
                          d="M 35,112 C 60,115 80,125 96,134 M 45,125 C 65,128 85,135 100,142"
                          strokeWidth="1.0"
                        />

                        {/* 3. Spartan Corinthian helmet & high crescent plume/crest */}
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0, opacity: 1 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.6 : 1.4, delay: phase4Seq === 'seq2' ? 1.0 : 0 }}
                          d="M 112,105 A 7.5,7.5 0 1,1 127,105 A 7.5,7.5 0 1,1 112,105"
                          strokeWidth="1.4"
                        />
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.2 : 1.4, delay: phase4Seq === 'seq2' ? 1.2 : 0 }}
                          d="M 121,98 L 121,108 M 117,103 L 125,103"
                          strokeWidth="1.3"
                        />
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.5 : 1.4, delay: phase4Seq === 'seq2' ? 1.1 : 0 }}
                          d="M 114,93 Q 110,75 120,68 Q 130,75 128,93 M 112,85 C 116,75 124,75 128,85 M 115,80 C 118,72 122,72 125,80"
                          strokeWidth="1.1"
                        />

                        {/* 4. Plated muscle chest armor and pauldrons */}
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.6 : 1.4, delay: phase4Seq === 'seq2' ? 1.2 : 0 }}
                          d="M 103,112 Q 115,110 125,115 M 104,118 Q 115,116 123,121 M 106,128 Q 115,126 122,130 M 100,110 Q 98,125 106,135"
                          strokeWidth="1.2"
                        />
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.0 : 1.4, delay: phase4Seq === 'seq2' ? 1.4 : 0 }}
                          d="M 98,110 A 5,5 0 0,1 108,110 Z"
                          strokeWidth="1.1"
                        />

                        {/* 5. Warrior arms holding spear & reins */}
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.4 : 1.4, delay: phase4Seq === 'seq2' ? 1.3 : 0 }}
                          d="M 104,115 Q 120,125 140,120 M 104,115 L 122,125 L 138,118"
                          strokeWidth="1.2"
                        />

                        {/* 6. Mounted leg, shin greave, and stirrup */}
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.5 : 1.4, delay: phase4Seq === 'seq2' ? 1.4 : 0 }}
                          d="M 108,135 Q 118,145 122,158 M 122,158 A 3,3 0 1,1 128,158 M 124,161 L 118,185 M 118,185 Q 112,190 118,192 L 124,188 Z"
                          strokeWidth="1.3"
                        />

                        {/* 7. Powerful rearing horse main body & saddle profile */}
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0, opacity: 0.95 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.8 : 1.4, delay: phase4Seq === 'seq2' ? 1.1 : 0, ease: "easeInOut" }}
                          d="M 85,160 C 70,165 78,195 95,200 C 110,205 120,195 128,185 C 140,175 145,155 135,145 C 120,140 100,148 85,160 Z"
                          strokeWidth="1.4"
                        />

                        {/* 8. Elegant arched horse neck, face muzzle and ears */}
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0, opacity: 1 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.8 : 1.4, delay: phase4Seq === 'seq2' ? 1.2 : 0 }}
                          d="M 130,140 C 135,118 152,108 165,112 L 178,102 Q 185,100 182,95 L 175,98 L 168,110 M 168,96 L 172,88 L 174,96 Z"
                          strokeWidth="1.4"
                        />
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.0 : 1.4, delay: phase4Seq === 'seq2' ? 1.6 : 0 }}
                          d="M 138,118 L 168,110"
                          strokeWidth="1.1"
                        />

                        {/* 9. Front prancing legs reared in the air */}
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.6 : 1.4, delay: phase4Seq === 'seq2' ? 1.4 : 0 }}
                          d="M 138,150 C 158,142 178,145 188,138 Q 194,134 190,128 L 180,132"
                          strokeWidth="1.3"
                        />
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.4 : 1.4, delay: phase4Seq === 'seq2' ? 1.5 : 0 }}
                          d="M 134,158 C 150,152 165,165 174,162 Q 180,160 178,154"
                          strokeWidth="1.2"
                        />

                        {/* 10. Rear legs planted/pushing off the ground */}
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 4.0 : 1.4, delay: phase4Seq === 'seq2' ? 1.5 : 0 }}
                          d="M 85,175 C 80,195 92,215 102,238 L 110,252 M 110,252 L 116,252 L 114,258 L 108,258 Z"
                          strokeWidth="1.4"
                        />
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 4.2 : 1.4, delay: phase4Seq === 'seq2' ? 1.6 : 0 }}
                          d="M 95,182 C 90,202 100,222 112,242 L 120,254 M 120,254 L 126,254 L 124,260 L 118,260 Z"
                          strokeWidth="1.3"
                        />

                        {/* 11. Streaming mane and wild horse tail hairs */}
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.8 : 1.4, delay: phase4Seq === 'seq2' ? 1.3 : 0 }}
                          d="M 142,124 Q 135,112 128,118 M 150,118 Q 142,106 135,112 M 158,114 Q 150,102 142,108"
                          strokeWidth="1.0"
                        />
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0, opacity: 0.85 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 4.2 : 1.4, delay: phase4Seq === 'seq2' ? 1.4 : 0 }}
                          d="M 72,166 C 55,172 45,190 40,210 C 38,218 48,218 52,210 C 60,195 68,182 72,175 Z M 50,185 C 42,200 44,215 42,225 M 60,180 C 52,195 54,210 50,220"
                          strokeWidth="1.1"
                        />
                      </g>
                    </motion.svg>
                  )}
                </AnimatePresence>
              </div>

              {/* 6. Right Bottom Corner portraits */}
              <div className="absolute right-4 bottom-0 sm:right-6 sm:bottom-6 w-[180px] xs:w-[240px] sm:w-[300px] md:w-[360px] lg:w-[450px] pointer-events-none z-30 select-none">
                <AnimatePresence mode="wait">
                  {(phase4Seq === 'seq1' || phase4Seq === 'seq1_out') ? (
                    <motion.svg
                      key="genghis-khan"
                      viewBox="0 0 240 280"
                      className="w-full h-full filter drop-shadow-[0_0_20px_rgba(239,68,68,0.25)] transition-transform duration-700 hover:scale-[1.02]"
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <defs>
                        <linearGradient id="gengGlowRealistic" x1="100%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                          <stop offset="20%" stopColor="#fed7aa" stopOpacity="0.9" />
                          <stop offset="55%" stopColor="#f97316" stopOpacity="0.75" />
                          <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.3" />
                        </linearGradient>
                      </defs>
                      <g fill="none" stroke="url(#gengGlowRealistic)" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq1' ? 1 : 0, opacity: 1 }}
                          transition={{ duration: phase4Seq === 'seq1' ? 3.5 : 1.4, delay: phase4Seq === 'seq1' ? 0.9 : 0, ease: "easeInOut" }}
                          d="
                            M 120,38 L 120,20
                            M 120,38 C 100,44 88,62 82,82
                            M 120,38 C 140,44 152,62 158,82
                            M 76,82 L 164,82
                          "
                          strokeWidth="1.5"
                        />
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq1' ? 1 : 0, opacity: 0.95, fillOpacity: phase4Seq === 'seq1' ? 0.12 : 0 }}
                          transition={{ duration: phase4Seq === 'seq1' ? 3.8 : 1.4, delay: phase4Seq === 'seq1' ? 1.3 : 0, ease: "easeInOut" }}
                          d="
                            M 76,82 
                            C 70,82 66,94 72,98 
                            C 68,102 70,114 78,110 
                            C 74,116 80,124 90,122 
                            C 86,128 98,132 108,126
                            C 104,132 116,134 126,128
                            C 126,132 138,134 148,126
                            C 152,132 164,128 170,120
                            C 174,124 182,116 178,108
                            C 182,106 182,94 176,90
                            C 180,86 175,78 164,82
                          "
                          fill="rgba(254, 215, 170, 0.12)"
                          strokeWidth="1.2"
                        />
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq1' ? 1 : 0 }}
                          transition={{ duration: phase4Seq === 'seq1' ? 3.0 : 1.4, delay: phase4Seq === 'seq1' ? 1.4 : 0 }}
                          d="
                            M 72,90 Q 64,100 75,98
                            M 82,106 Q 74,116 85,114
                            M 96,114 Q 90,124 100,118
                            M 120,116 Q 115,126 125,120
                            M 142,114 Q 138,124 146,118
                            M 160,106 Q 155,116 164,112
                            M 170,92 Q 165,102 172,96
                          "
                          strokeWidth="0.8"
                        />
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq1' ? 1 : 0 }}
                          transition={{ duration: phase4Seq === 'seq1' ? 3.2 : 1.4, delay: phase4Seq === 'seq1' ? 1.4 : 0 }}
                          d="
                            M 95,130 Q 106,125 111,130 Q 104,133 95,130 Z
                            M 145,130 Q 134,125 129,130 Q 136,133 145,130 Z
                            M 93,124 Q 106,119 113,123
                            M 147,124 Q 134,119 127,123
                            M 120,125 L 120,150 L 114,152 L 126,152
                            M 108,142 T 120,140 T 132,142
                          "
                          strokeWidth="1.3"
                        />
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq1' ? 1 : 0, opacity: 1 }}
                          transition={{ duration: phase4Seq === 'seq1' ? 4.0 : 1.4, delay: phase4Seq === 'seq1' ? 1.6 : 0 }}
                          d="
                            M 105,158 C 95,158 85,175 80,195
                            M 135,158 C 145,158 155,175 160,195
                            M 112,158 Q 120,165 128,158
                            M 105,175 Q 120,225 112,245
                            M 135,175 Q 120,225 128,245
                            M 118,175 L 120,255
                          "
                          strokeWidth="1.5"
                        />
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq1' ? 1 : 0, opacity: 1 }}
                          transition={{ duration: phase4Seq === 'seq1' ? 3.8 : 1.4, delay: phase4Seq === 'seq1' ? 1.0 : 0 }}
                          d="M 85,124 Q 80,185 100,215 Q 120,228 140,215 Q 160,185 155,124"
                          strokeWidth="1.6"
                        />
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq1' ? 1 : 0, opacity: 0.95, fillOpacity: phase4Seq === 'seq1' ? 0.15 : 0 }}
                          transition={{ duration: phase4Seq === 'seq1' ? 4.4 : 1.4, delay: phase4Seq === 'seq1' ? 2.0 : 0 }}
                          d="
                            M 120,222 A 8,8 0 1,0 120,238 A 8,8 0 1,0 120,222
                            M 120,226 A 4,4 0 1,0 120,234 A 4,4 0 1,0 120,226
                          "
                          fill="rgba(254, 215, 170, 0.15)"
                          strokeWidth="1.4"
                        />
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq1' ? 1 : 0, opacity: 0.8 }}
                          transition={{ duration: phase4Seq === 'seq1' ? 4.5 : 1.4, delay: phase4Seq === 'seq1' ? 2.2 : 0 }}
                          d="
                            M 60,240 C 72,215 105,215 112,228
                            M 180,240 C 168,215 135,215 128,228
                            M 95,224 C 90,245 80,275 60,285
                            M 145,224 C 150,245 160,275 180,285
                            M 112,236 C 110,255 105,275 90,285
                            M 128,236 C 130,255 135,275 150,285
                          "
                          strokeWidth="1.2"
                        />
                      </g>
                    </motion.svg>
                  ) : (
                    <motion.svg
                      key="icbm-missile"
                      viewBox="0 0 240 280"
                      className="w-full h-full filter drop-shadow-[0_0_25px_rgba(239,68,68,0.4)] transition-transform duration-700 hover:scale-[1.02]"
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <defs>
                        <linearGradient id="icbmGlowRealistic" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.45" />
                          <stop offset="35%" stopColor="#f97316" stopOpacity="0.85" />
                          <stop offset="70%" stopColor="#60a5fa" stopOpacity="0.95" />
                          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
                        </linearGradient>
                      </defs>
                      <g fill="none" stroke="url(#icbmGlowRealistic)" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
                        {/* 1. Heavy Launcher Pad concrete foundation and heat shielding trench */}
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0, opacity: 0.9 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.0 : 1.4, delay: phase4Seq === 'seq2' ? 0.5 : 0, ease: "easeInOut" }}
                          d="M 30,250 L 210,250 M 40,250 L 40,275 L 200,275 L 200,250"
                          strokeWidth="1.6"
                        />
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0, opacity: 0.85 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.2 : 1.4, delay: phase4Seq === 'seq2' ? 0.7 : 0 }}
                          d="M 90,250 C 70,260 55,270 40,275 M 150,250 C 170,260 185,270 200,275 M 120,250 L 120,275 M 100,250 C 100,268 110,272 120,272 C 130,272 140,268 140,250"
                          strokeWidth="1.2"
                        />

                        {/* 2. Vertical Girders and Diagonal cross-bracing of the main Service Tower */}
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0, opacity: 0.9 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.8 : 1.4, delay: phase4Seq === 'seq2' ? 0.8 : 0, ease: "easeInOut" }}
                          d="M 64,40 L 64,250 M 84,40 L 84,250 M 64,40 L 84,40"
                          strokeWidth="1.5"
                        />
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.5 : 1.4, delay: phase4Seq === 'seq2' ? 1.0 : 0 }}
                          d="M 64,50 L 84,80 M 84,50 L 64,80 M 64,90 L 84,120 M 84,90 L 64,120 M 64,130 L 84,160 M 84,130 L 64,160 M 64,170 L 84,200 M 84,170 L 64,200 M 64,210 L 84,240 M 84,210 L 64,240"
                          strokeWidth="1.0"
                        />
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.0 : 1.4, delay: phase4Seq === 'seq2' ? 1.2 : 0 }}
                          d="M 64,80 L 84,80 M 64,120 L 84,120 M 64,160 L 84,160 M 64,200 L 84,200 M 64,240 L 84,240 M 54,80 L 64,80 M 54,160 L 64,160 M 54,240 L 64,240"
                          strokeWidth="1.1"
                        />

                        {/* 3. Top Crane assembly & structural heavy rigging cables */}
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.4 : 1.4, delay: phase4Seq === 'seq2' ? 1.1 : 0 }}
                          d="M 84,40 L 135,40 L 125,48 L 84,48 Z"
                          strokeWidth="1.3"
                        />
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.0 : 1.4, delay: phase4Seq === 'seq2' ? 1.3 : 0 }}
                          d="M 120,40 L 120,28 M 105,40 L 120,28 M 135,40 L 120,28"
                          strokeWidth="0.9"
                        />

                        {/* 4. Complete Intercontinental Ballistic Missile (ICBM) Main Body structure */}
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0, opacity: 1 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 4.0 : 1.4, delay: phase4Seq === 'seq2' ? 0.9 : 0, ease: "easeInOut" }}
                          d="M 111,55 L 111,240 L 129,240 L 129,55 Z"
                          strokeWidth="1.6"
                        />

                        {/* 5. Aerodynamic metallic guidance fins & structural base mounts */}
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.6 : 1.4, delay: phase4Seq === 'seq2' ? 1.3 : 0 }}
                          d="M 111,215 L 94,240 L 111,240 M 129,215 L 146,240 L 129,240 M 100,230 L 111,234 M 140,230 L 129,234"
                          strokeWidth="1.4"
                        />

                        {/* 6. Sharp payload nosecone / MIRV nuclear re-entry warhead shield deck */}
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0, opacity: 1 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.5 : 1.4, delay: phase4Seq === 'seq2' ? 1.2 : 0, ease: "easeInOut" }}
                          d="M 111,55 C 111,40 120,25 120,25 C 120,25 129,40 129,55 Z M 111,55 L 129,55 M 120,25 L 120,45"
                          strokeWidth="1.4"
                        />

                        {/* 7. Liquid fuel cryogenic stage borders, piping conduits and panels */}
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.8 : 1.4, delay: phase4Seq === 'seq2' ? 1.4 : 0 }}
                          d="M 111,100 L 129,100 M 111,155 L 129,155 M 111,195 L 129,195"
                          strokeWidth="1.3"
                        />
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.4 : 1.4, delay: phase4Seq === 'seq2' ? 1.5 : 0 }}
                          d="M 114,55 L 114,240 M 126,55 L 126,240 M 120,55 L 120,240"
                          strokeWidth="1.0"
                        />
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.2 : 1.4, delay: phase4Seq === 'seq2' ? 1.6 : 0 }}
                          d="M 111,76 L 129,76 M 111,123 L 129,123 M 111,173 L 129,173 M 111,218 L 129,218"
                          strokeWidth="0.8"
                        />

                        {/* 8. Launch pad clamp-collars holding and stabilizing raw missile shell */}
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0, opacity: 0.95 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.8 : 1.4, delay: phase4Seq === 'seq2' ? 1.5 : 0 }}
                          d="M 108,110 Q 120,116 132,110 M 104,110 L 108,110 M 132,110 L 136,110 M 108,185 Q 120,191 132,185 M 104,185 L 108,185 M 132,185 L 136,185"
                          strokeWidth="1.3"
                        />

                        {/* 9. Heavy primary rocket booster engine exhaust nozzles at Stage 1 base */}
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.5 : 1.4, delay: phase4Seq === 'seq2' ? 1.6 : 0 }}
                          d="M 113,240 L 111,248 L 116,248 M 118,240 L 117,250 L 123,250 M 124,240 L 122,248 L 127,248"
                          strokeWidth="1.2"
                        />

                        {/* 10. Cryogenic supply lines, flexible fuel loops, and active umbilicals */}
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.6 : 1.4, delay: phase4Seq === 'seq2' ? 1.7 : 0 }}
                          d="M 84,80 C 100,80 102,87 111,87 M 84,150 C 100,150 102,154 111,154 M 84,205 C 100,205 102,209 111,209"
                          strokeWidth="1.1"
                        />

                        {/* 11. Maintenance scaffolding levels & ladder details showing grand human scale */}
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: phase4Seq === 'seq2' ? 1 : 0 }}
                          transition={{ duration: phase4Seq === 'seq2' ? 3.8 : 1.4, delay: phase4Seq === 'seq2' ? 1.8 : 0 }}
                          d="M 40,80 L 64,80 M 40,160 L 64,160 M 35,60 L 35,240 M 31,80 L 39,80 M 31,100 L 39,100 M 31,120 L 39,120 M 31,140 L 39,140 M 31,160 L 39,160 M 31,180 L 39,180 M 31,200 L 39,200 M 31,220 L 39,220"
                          strokeWidth="0.9"
                        />
                      </g>
                    </motion.svg>
                  )}
                </AnimatePresence>
              </div>

              {/* 7. CENTERED SCREEN TYPOGRAPHY (AMBITION WITHOUT VERTICAL OVERLAP) */}
              <div className="relative z-20 w-full px-8 flex flex-col items-center justify-center select-none text-center">
                <AnimatePresence mode="wait">
                  {(phase4Seq === 'seq1' || phase4Seq === 'seq1_out') ? (
                    <motion.div
                      key="text-seq2"
                      initial={{ opacity: 0, filter: "blur(12px)" }}
                      animate={{ opacity: phase4Seq === 'seq1' ? 1 : 0, filter: phase4Seq === 'seq1' ? "blur(0px)" : "blur(12px)" }}
                      exit={{ opacity: 0, filter: "blur(12px)" }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                      className="flex flex-col items-center justify-center text-center w-full"
                    >
                      

                      {/* Highly structured, huge bold screen-centered narrative lines (Rise of Rome format) */}
                      <div className="w-full flex flex-col items-center justify-center">
                        <h1 className="text-2xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold uppercase leading-[.6] font-display flex flex-col items-center space-y-4 sm:space-y-6 select-none text-center">
                          <span className="tracking-[0.1em] sm:tracking-[0.16em] text-[#f2f2f7] drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] whitespace-nowrap">
                            Whom the <span className="text-[#f97316] drop-shadow-[0_0_30px_rgba(249,115,22,0.45)]">world</span>
                          </span>
                          <span className="text-[#f97316] tracking-[0.15em] sm:tracking-[0.22em] drop-shadow-[0_0_35px_rgba(249,115,22,0.5)]">
                          thought Would
                          </span>
                          <span className="text-[#fdfdfd] tracking-[0.15em] sm:tracking-[0.22em] drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
                            never Fail
                          </span>
                        </h1>
                      </div>
                    </motion.div>
                  ) : (
                   <motion.div
  key="text-seq1"
  initial={{ opacity: 0, filter: "blur(12px)" }}
  animate={{ opacity: phase4Seq === 'seq2' ? 1 : 0, filter: phase4Seq === 'seq2' ? "blur(0px)" : "blur(12px)" }}
  exit={{ opacity: 0, filter: "blur(12px)" }}
  transition={{ duration: 1.5, ease: "easeInOut" }}
  className="flex flex-col items-center justify-center text-center w-full"
>
  {/* Spacing alignment container for first small sentence - INCREASED FONT SIZE */}
  <div className="mb-4 sm:mb-6 flex items-center justify-center">
    <p className="text-base sm:text-lg md:text-xl font-light tracking-[0.5em] sm:tracking-[0.7em] uppercase text-white/70 font-sans text-center">
      There were
    </p>
  </div>

  {/* Highly structured, huge bold screen-centered narrative lines - REDUCED LEADING */}
  <div className="w-full flex flex-col items-center justify-center">
    <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-6xl font-extrabold uppercase leading-[0.6] font-display flex flex-col items-center space-y-2 sm:space-y-3 select-none text-center">
      <span className="tracking-[0.1em] sm:tracking-[0.16em] text-[#f2f2f7] drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] whitespace-nowrap">
        People <span className="text-[#ef4444] drop-shadow-[0_0_30px_rgba(239, 68, 68, 0.45)]">Who</span>
      </span>
      <span className="text-[#ef4444] tracking-[0.15em] sm:tracking-[0.22em] drop-shadow-[0_0_35px_rgba(239, 68, 68, 0.5)]">
        seemed
      </span>
      <span className="text-[#fdfdfd] tracking-[0.15em] sm:tracking-[0.22em] drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
        Immortal
      </span>
    </h1>
  </div>
</motion.div>
                  )}
                </AnimatePresence>

                {/* Decorative horizontal strategy map rule line */}
                

                {/* Subtext describing the "life inferno resembling rise of Rome" in strategic context */}
                

                {/* Sleek, cinematic Continue / Replay button centered bottom */}
                
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PHASE 5: EMPIRES THAT WOULD LAST A THOUSAND YEARS */}
<AnimatePresence>
  {currentPhase === 5 && (
    <motion.div
      key="phase-5-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center z-20 overflow-hidden select-none"
    >
      {/* Background Image with gradient that fades out together */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        {/* Dark gradient fallback */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#020e1a] to-[#01050a]" />
        
        {/* Image layer - fades out smoothly while maintaining gradient */}
        <motion.img
          src="/WelcomeImg5.jpg"
          alt="Ancient Empire"
          referrerPolicy="no-referrer"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: p5BgFadeOut ? 0 : 0.4 }}
          transition={{ duration: 7, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover mix-blend-screen"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />

        {/* Radial gradient mask - fades out at the same rate, never fully revealing image */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: p5BgFadeOut ? 0 : 1 }}
          transition={{ duration: 7, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_5%,rgba(0,0,0,0.85)_48%,rgba(0,0,0,0.98)_82%)] pointer-events-none"
        />
      </div>

      {/* CENTERED TYPOGRAPHY */}
      <div className="relative z-20 w-full px-8 flex flex-col items-center justify-center select-none text-center">
  {/* First small sentence */}
  <div className="mb-4 sm:mb-6 flex items-center justify-center">
  <motion.p
    initial={{ opacity: 0, filter: "blur(14px)", y: 15 }}
    animate={{
      opacity: showP5Text1 ? 0.55 : 0,
      filter: showP5Text1 ? "blur(0px)" : "blur(14px)",
      y: showP5Text1 ? 0 : -15
    }}
    transition={{ duration: 2.5, ease: "easeOut" }}
    className="text-base sm:text-base md:text-xl lg:text-2xl font-light tracking-[0.2em] sm:tracking-[0.4em] uppercase text-white font-sans text-center"
  >
    Empires that would last
  </motion.p>
</div>

        {/* Main title */}
        <div className="w-full flex flex-col items-center justify-center">
  <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-6xl font-extrabold uppercase leading-[1.1] font-display flex flex-col items-center space-y-4 sm:space-y-6 select-none text-center">
    
    {/* "A Thousand" line split into A and Thousand with separate dust fade-out canvas */}
    <span className="tracking-[0.1em] sm:tracking-[0.16em] text-[#f97316] drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] flex items-center justify-center gap-2 sm:gap-4 select-none whitespace-nowrap">
      <motion.span
        initial={{ opacity: 0, filter: "blur(16px)" }}
        animate={{
          opacity: showP5Text2Part1 ? 1 : 0,
          filter: showP5Text2Part1 ? "blur(0px)" : "blur(16px)"
        }}
        transition={{ duration: 2.5, ease: "easeOut" }}
      >
        A
      </motion.span>

      <span className="relative inline-block">
        <motion.span
          initial={{ opacity: 0, filter: "blur(16px)" }}
          animate={{
            opacity: showP5Thousand ? 1 : 0,
            filter: showP5Thousand ? "blur(0px)" : "blur(16px)"
          }}
          transition={{ duration: 3.0, ease: "easeOut" }}
          className="inline-block text-[#f97316] drop-shadow-[0_0_35px_rgba(249,115,22,0.5)] relative z-10"
        >
          Thousand
        </motion.span>
        
        {/* Thousand Dust Canvas - realistic floating particles */}
        <canvas
          ref={thousandDustCanvasRef}
          className="absolute pointer-events-none"
          style={{
            inset: "-60px",
            width: "calc(100% + 120px)",
            height: "calc(100% + 120px)",
          }}
        />
      </span>
    </span>

    {/* "Years" with realistic floating dust particles */}
    <span className="relative inline-block px-4">
      <motion.span
        initial={{ opacity: 0, filter: "blur(16px)" }}
        animate={{
          opacity: showP5Years ? 1 : 0,
          filter: showP5Years ? "blur(0px)" : "blur(16px)"
        }}
        transition={{ duration: 3.0, ease: "easeOut" }}
        className="inline-block text-[#f97316] tracking-[0.15em] sm:tracking-[0.22em] drop-shadow-[0_0_35px_rgba(249,115,22,0.5)] relative z-10"
      >
        Years
      </motion.span>
      
      {/* Years Dust Canvas - realistic floating particles */}
      <canvas
        ref={yearsDustCanvasRef}
        className="absolute pointer-events-none"
        style={{
          inset: "-60px",
          width: "calc(100% + 120px)",
          height: "calc(100% + 120px)",
        }}
      />
    </span>
  </h1>
</div>

        {/* Roman numeral I glimpse centered with glow, appearing and fading out quickly */}
        <AnimatePresence>
          {showP5RomanI && (
            <motion.div
              initial={{ opacity: 0, scale: 0.82, filter: "blur(25px) brightness(0.6)" }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                filter: "blur(0px) brightness(1.2)"
              }}
              exit={{ 
                opacity: 0, 
                scale: 1.12, 
                filter: "blur(20px) brightness(0.4)"
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
            >
              <div className="font-serif text-[16vw] sm:text-[12vw] font-bold text-[#fafafa] tracking-widest text-center drop-shadow-[0_0_55px_rgba(255,255,255,0.7)] select-none">
                I
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )}
</AnimatePresence>

        {/* PHASE 6: BUT AT END - DEATH ALWAYS WINS & WOOD SHAVING */}
<AnimatePresence>
  {currentPhase === 6 && (
    <motion.div
      key="phase-6-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center bg-black z-20 overflow-hidden select-none"
    >
      {/* Center Screen Word Always when centered, or row when inline */}
      <div className="relative w-full max-w-4xl px-8 flex flex-col items-center justify-center select-none text-center">
        
        {/* Line 1: 'But at End' */}
        <div className="flex items-center justify-center mb-1 sm:mb-2 select-none text-center">
          <AnimatePresence>
            {showP6Text1 && !p6AlwaysOnly && (
              <motion.p
                initial={{ opacity: 0, filter: "blur(14px)", y: 15 }}
                animate={{ opacity: 0.65, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(14px)", y: -15 }}
                transition={{ duration: 1.8, ease: "easeOut" }}
                className="text-xs sm:text-sm md:text-base font-light tracking-[0.5em] sm:tracking-[0.7em] uppercase text-white font-sans text-center"
              >
                But at End
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Line 2 Container */}
        <div className="relative w-full flex flex-col items-center justify-center h-28 sm:h-32 md:h-36">
          {/* Symmetrical Centered Layout with 3 columns - normal word spacing */}
          <div className="flex items-center justify-center w-full max-w-4xl text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold uppercase font-display select-none whitespace-nowrap gap-2 sm:gap-3">
            
            {/* Left: 'Death' */}
            <motion.span
              initial={{ opacity: 0, filter: "blur(16px)" }}
              animate={{ 
                opacity: (!showP6Text2 || p6AlwaysOnly) ? 0 : 1,
                filter: (!showP6Text2 || p6AlwaysOnly) ? "blur(16px)" : "blur(0px)"
              }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              className="text-[#f2f2f7] drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] select-none"
            >
              Death
            </motion.span>

            {/* Center: 'Always' */}
            <div className="relative inline-block select-none py-1 text-center">
              <div className="relative inline-block">
                <AnimatePresence>
                  {showP6Text2 && (
                    <motion.div 
                      layoutId="p6-always-text-wrapper"
                      initial={{ opacity: 0, filter: "blur(16px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, filter: "blur(16px)" }}
                      transition={{ duration: 1.8, ease: "easeOut" }}
                      className="font-extrabold uppercase font-display select-none text-center flex items-center justify-center gap-[2px] sm:gap-[3px]"
                    >
                      {["A", "l", "w", "a", "y", "s"].map((letter, idx) => {
                        const isShaved = p6ShavedLettersCount > idx;
                        return (
                          <motion.span
                            key={idx}
                            layoutId={`letter-${idx}`}
                            animate={{
                              opacity: isShaved ? 0 : 1,
                              scale: isShaved ? 0.6 : 1,
                              y: isShaved ? 45 : 0,
                              filter: isShaved ? "blur(10px)" : "blur(0px)",
                            }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className="inline-block relative text-[#f97316] drop-shadow-[0_0_40px_rgba(249,115,22,0.6)] select-none"
                          >
                            {letter}
                          </motion.span>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Shavings canvas */}
                <canvas
                  ref={p6WoodShavingsCanvasRef}
                  className="absolute pointer-events-none"
                  style={{
                    inset: "-80px -120px",
                    width: "calc(100% + 240px)",
                    height: "calc(100% + 160px)"
                  }}
                />

                {/* Wood Shaving Block Plane / Hand Tool SVG */}
                <AnimatePresence>
                  {showP6Hand && (
                    <motion.div
                      initial={{ opacity: 0, x: "-80px", y: "-30px" }}
                      animate={{ 
                        opacity: 1,
                        x: `calc(${p6HandPosition}% - var(--blade-offset))`,
                        y: "-10px",
                        rotate: p6ShavingActive && p6HandPosition > -15 && p6HandPosition < 115 ? [0, -1, 1.2, -0.5, 0] : 0,
                      }}
                      exit={{ opacity: 0, y: "30px" }}
                      transition={
                        p6ShavingActive 
                          ? { duration: 0.05, ease: "linear" } 
                          : { duration: 1.2, ease: "easeOut" }
                      }
                      className="absolute z-30 pointer-events-none -bottom-[45px] xs:-bottom-[55px] sm:-bottom-[75px] md:-bottom-[85px] lg:-bottom-[95px] w-[240px] sm:w-[320px] [--blade-offset:105px] sm:[--blade-offset:140px]"
                      style={{
                        left: "0%",
                      }}
                    >
                      {/* Wood-shaving tool SVG */}
                      <svg viewBox="0 0 160 120" className="w-full h-auto filter drop-shadow-[0_16px_40px_rgba(0,0,0,0.9)]">
                        <defs>
                          <radialGradient id="woundGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#991b1b" stopOpacity="0.85" />
                            <stop offset="60%" stopColor="#ef4444" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                          </radialGradient>
                          <linearGradient id="fleshGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f5e1d3" />
                            <stop offset="50%" stopColor="#ecd5c1" />
                            <stop offset="100%" stopColor="#dcbfa7" />
                          </linearGradient>
                        </defs>

                        <path d="M 15,85 L 125,85 L 120,62 L 20,62 Z" fill="#1b2530" stroke="#334155" strokeWidth="1.5" />
                        <rect x="25" y="85" width="90" height="8" fill="#a16207" />
                        <path d="M 102,62 C 102,48 116,48 116,62 Z" fill="#b45309" stroke="#78350f" strokeWidth="1" />
                        <path d="M 38,62 C 34,42 22,46 26,34 C 30,24 45,34 44,62 Z" fill="#b45309" stroke="#78350f" strokeWidth="1" />
                        <path d="M 64,62 L 56,40 L 72,40 L 78,62 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
                        <path d="M 66,62 L 72,48 L 80,54 L 76,62 Z" fill="#eab308" />

                        <g stroke="#3f1e12" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M 160,18 C 145,20 126,22 110,32 C 100,37 92,44 86,55 C 81,62 83,70 89,74 L 160,45 Z" fill="url(#fleshGrad)" />
                          <path d="M 86,55 C 76,58 60,54 52,62 C 48,66 52,70 60,68 C 72,65 80,62 86,55" fill="url(#fleshGrad)" />
                          <path d="M 98,38 C 88,38 70,30 52,28 C 45,28 35,32 30,38 C 26,42 28,48 35,46 C 45,43 62,44 78,48 Z" fill="url(#fleshGrad)" />
                          <path d="M 95,42 C 85,44 68,40 50,38 C 42,37 32,40 28,46 C 24,50 26,55 33,53 C 43,50 60,51 75,55 Z" fill="url(#fleshGrad)" />
                          <path d="M 90,46 C 80,48 65,48 48,46 C 40,45 32,48 29,54 C 26,58 28,63 35,61 C 45,58 58,58 72,60 Z" fill="url(#fleshGrad)" />
                          <path d="M 85,50 C 75,52 62,52 48,51 C 42,50 35,54 32,60 C 30,64 32,68 38,66 C 46,63 56,62 67,64 Z" fill="url(#fleshGrad)" />
                          <path d="M 125,28 C 115,35 110,40 105,48" stroke="#a78b71" strokeWidth="0.8" fill="none" />
                          <path d="M 130,23 C 122,30 118,34 112,41" stroke="#a78b71" strokeWidth="0.8" fill="none" />

                          <g>
                            <ellipse cx="108" cy="33" rx="9" ry="7" fill="url(#woundGlow)" opacity="0.9" />
                            <ellipse cx="108" cy="33" rx="4.5" ry="3.5" fill="#450a0a" stroke="#1c0505" strokeWidth="1" />
                            <circle cx="108" cy="33" r="2" fill="#d90429" />
                            <circle cx="108" cy="33" r="6" stroke="#fbbf24" strokeWidth="0.7" fill="none" strokeDasharray="1 3" opacity="0.75" />
                            <path d="M 108,35 Q 106,45 107,51 Q 109,55 104,60 Q 99,63 91,64" fill="none" stroke="#991b1b" strokeWidth="1.4" strokeLinecap="round" />
                            <path d="M 108,35 Q 112,42 113,48" fill="none" stroke="#7f1d1d" strokeWidth="0.9" opacity="0.7" strokeLinecap="round" />
                          </g>
                        </g>
                        <circle cx="70" cy="90" r="1.5" fill="#f97316" className="animate-ping" />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right: 'Wins' */}
            <motion.span
              initial={{ opacity: 0, filter: "blur(16px)" }}
              animate={{ 
                opacity: (!showP6Text2 || p6AlwaysOnly) ? 0 : 1,
                filter: (!showP6Text2 || p6AlwaysOnly) ? "blur(16px)" : "blur(0px)"
              }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              className="text-[#f2f2f7] drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] select-none"
            >
              Wins
            </motion.span>

          </div>
        </div>

      </div>
    </motion.div>
  )}
</AnimatePresence>

        {/* PHASE 7: BUT THERE IS SOMEONE - CINEMATIC RESOLUTION */}
      <AnimatePresence>
  {currentPhase === 7 && (
    <motion.div
      key="phase-7-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center bg-black z-20 overflow-hidden select-none"
    >
      {/* Text content wrapped in clean container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative w-full max-w-4xl px-4 sm:px-8 flex flex-col items-center justify-center gap-1 sm:gap-2 md:gap-3 text-center select-none z-15"
      >
        
        {/* Line 1: 'But there is someone' */}
        <div className="h-auto min-h-[1.5rem] sm:h-5 flex items-center justify-center select-none overflow-visible">
          <AnimatePresence>
            {showP7Text1 && (
              <motion.p
                initial={{ opacity: 0, filter: "blur(12px)", y: 15 }}
                animate={{ opacity: 0.75, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(12px)", y: -15 }}
                transition={{ duration: 1.6, ease: "easeOut" }}
                className="text-[10px] xs:text-xs sm:text-sm md:text-base font-light tracking-[0.3em] sm:tracking-[0.5em] md:tracking-[0.7em] uppercase text-gray-300 font-sans text-center whitespace-nowrap sm:whitespace-normal"
              >
                But there is someone
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Line 2: 'Even Death could not stop' */}
        <div className="h-auto min-h-[2rem] xs:h-7 sm:h-8 md:h-10 flex items-center justify-center select-none overflow-visible">
          <AnimatePresence>
            {showP7Text2 && (
              <motion.h2
                initial={{ opacity: 0, filter: "blur(20px)", y: 20 }}
                animate={{ opacity: 0.95, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(20px)", y: -20 }}
                transition={{ duration: 1.8, ease: "easeOut" }}
                className="text-sm xs:text-base sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold uppercase font-display tracking-wider text-white drop-shadow-[0_2px_15px_rgba(255,255,255,0.4)] text-center px-2"
              >
                Even Death could not stop
              </motion.h2>
            )}
          </AnimatePresence>
        </div>

        {/* Line 3: 'A Grave Cannot Hold' */}
        <div className="h-auto min-h-[2.5rem] xs:h-10 sm:h-12 md:h-14 flex items-center justify-center select-none overflow-visible">
          <AnimatePresence>
            {showP7Text3 && (
              <motion.h1
                initial={{ opacity: 0, filter: "blur(24px)", scale: 0.95 }}
                animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                exit={{ opacity: 0, filter: "blur(24px)", scale: 1.05 }}
                transition={{ duration: 2.2, ease: "easeOut" }}
                className="text-base xs:text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black uppercase font-display tracking-wider sm:tracking-widest text-[#f97316] drop-shadow-[0_0_50px_rgba(249,115,22,0.85)] text-center whitespace-nowrap sm:whitespace-nowrap px-2"
              >
                A Grave Cannot Hold
              </motion.h1>
            )}
          </AnimatePresence>
        </div>

      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

        {/* PHASE 8: A CARPENTER FROM NAZARETH */}
        <AnimatePresence>
          {currentPhase === 8 && (
            <motion.div
              key="phase-8-root"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center z-20 overflow-hidden select-none"
            >
              {/* Background Image with warm timber/craftsman gradient */}
              <div className="absolute inset-0 z-0 pointer-events-none select-none">
                {/* Dark warm craftsman gradient fallback */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#1f1102] to-[#0a0501]" />
                
                {/* Image layer - they will replace this image */}
                <motion.img
                  src="/WelcomeImg8.jpg"
                  alt="Nazareth Carpenter"
                  referrerPolicy="no-referrer"
                  initial={{ opacity: 0.35 }}
                  animate={{ opacity: 0.35 }}
                  className="absolute inset-0 w-full h-full object-cover mix-blend-screen"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />

                {/* Radial gradient mask */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_5%,rgba(0,0,0,0.85)_48%,rgba(0,0,0,0.98)_82%)] pointer-events-none" />
              </div>

              {/* Text content animating synchronously */}
              <motion.div
                initial={{ opacity: 0, filter: "blur(20px)", y: 20 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(20px)", y: -20 }}
                transition={{ duration: 2.2, ease: "easeOut" }}
                className="relative w-full max-w-5xl px-8 flex flex-col items-center justify-center gap-1.5 sm:gap-2 text-center select-none z-15"
              >
                {/* Line 1: 'A carpenter' */}
                <div className="flex items-center justify-center select-none overflow-visible">
  <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-light tracking-[0.2em] sm:tracking-[0.4em] uppercase text-white font-sans text-center leading-none">
    A carpenter
  </p>
</div>

                {/* Line 2: 'From Nazareth' */}
                <div className="flex items-center justify-center select-none overflow-visible">
                  <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold uppercase font-display tracking-widest text-[#f97316] drop-shadow-[0_0_50px_rgba(249,115,22,0.85)] text-center leading-none py-1">
                    From Nazareth
                  </h1>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PHASE 9: A MAN WHO IS WORTHY (KINETIC SCALE) */}
<AnimatePresence>
  {currentPhase === 9 && (
    <motion.div
      key="phase-9-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center z-20 overflow-y-auto overflow-x-hidden select-none"
    >
      {/* Background Image/Ambient Theme with warm timber/ember charcoal gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#140b02] to-[#050201]" />
        <motion.img
          src="/WelcomeImg9.jpg"
          alt="Worthy Person"
          referrerPolicy="no-referrer"
          initial={{ opacity: 0.32 }}
          animate={{ opacity: 0.32 }}
          className="absolute inset-0 w-full h-full object-cover mix-blend-screen"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_5%,rgba(0,0,0,0.85)_48%,rgba(0,0,0,0.98)_82%)] pointer-events-none" />
      </div>

      {/* Flex-col content aligning Typography and beautiful SVG Scale - with responsive padding and max-height */}
      <div className="relative w-full max-w-5xl px-4 sm:px-6 md:px-8 py-4 sm:py-8 md:py-12 lg:py-16 flex flex-col items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 text-center select-none z-15 min-h-0 my-auto">
        
        {/* Symmetrical Typography - with responsive sizing */}
        <div className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 md:gap-1.5 text-center select-none leading-none w-full">
          
          {/* "A man" text - responsive */}
          <div className="flex items-center justify-center select-none overflow-visible">
            <p className="text-[8px] xs:text-[9px] sm:text-xs md:text-sm lg:text-base font-light tracking-[0.3em] sm:tracking-[0.4em] md:tracking-[0.6em] uppercase text-gray-400 font-sans text-center leading-none">
              A man
            </p>
          </div>
          
          {/* Main title - responsive with smaller sizes on small heights */}
          <div className="flex items-center justify-center select-none w-full px-2">
            <AnimatePresence mode="wait">
              <motion.h1
                key={phase9Word}
                initial={{ opacity: 0, filter: "blur(18px)", y: 12 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(18px)", y: -12 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-extrabold uppercase font-display tracking-wider sm:tracking-widest text-[#f97316] drop-shadow-[0_0_30px_rgba(249,115,22,0.85)] text-center leading-tight py-0.5"
              >
                Who is {phase9Word}
              </motion.h1>
            </AnimatePresence>
          </div>
        </div>

        {/* SVG Majestic Kinetic Balance Beam Scale - responsive sizing */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: -10 }}
          transition={{ delay: 0.4, duration: 1.5, ease: "easeOut" }}
          className="w-36 h-36 xs:w-44 xs:h-44 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-80 lg:h-80 relative flex items-center justify-center z-10 flex-shrink-0"
        >
          <svg className="w-full h-full drop-shadow-[0_0_20px_rgba(249,115,22,0.15)]" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="globe-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="cross-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="beam-metal" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a1a1aa" />
                <stop offset="50%" stopColor="#27272a" />
                <stop offset="100%" stopColor="#71717a" />
              </linearGradient>
              <linearGradient id="pedestal-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#27272a" />
                <stop offset="100%" stopColor="#09090b" />
              </linearGradient>
            </defs>

            {/* Pedestal Stand (Static background anchor) - adjusted for 500x500 */}
            <rect x="200" y="390" width="100" height="15" rx="3" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
            <path d="M235 390 L265 390 L255 255 L245 255 Z" fill="url(#pedestal-grad)" stroke="#27272a" strokeWidth="2.5" />
            <line x1="250" y1="255" x2="250" y2="390" stroke="rgba(249, 115, 22, 0.25)" strokeWidth="1.5" />
            <circle cx="250" cy="250" r="7" fill="#f97316" stroke="#fdba74" strokeWidth="1.5" className="filter drop-shadow-[0_0_8px_#f97316]" />

            {/* DYNAMIC ROTATING BEAM - Leans LEFT when cross falls */}
            <motion.g
              initial={{ rotate: 0 }}
              animate={{ rotate: -14 }}
              transition={{
                delay: 2.38,
                duration: 1.0,
                ease: "easeInOut",
              }}
              style={{ originX: "250px", originY: "250px" }}
            >
              {/* Heavy metal balance crossbar - no end dots */}
              <line x1="90" y1="250" x2="410" y2="250" stroke="url(#beam-metal)" strokeWidth="6" strokeLinecap="round" />
              <line x1="90" y1="250" x2="410" y2="250" stroke="#f97316" strokeWidth="1" strokeOpacity="0.4" />

              {/* LEFT SIDE - CROSS - Falls onto beam from above (no arrow) */}
              <g transform="translate(90, 250)">
                {/* Impact shockwave when cross lands */}
                <motion.circle
                  cx="0"
                  cy="-3"
                  initial={{ r: 0, opacity: 0 }}
                  animate={{
                    r: [0, 48, 65],
                    opacity: [0.95, 0.45, 0],
                  }}
                  transition={{
                    delay: 2.38,
                    duration: 1.2,
                    ease: "easeOut",
                  }}
                  stroke="#f97316"
                  strokeWidth="2"
                  fill="none"
                  className="filter drop-shadow-[0_0_6px_#f97316]"
                />

                {/* Sparks shooting out at impact */}
                <motion.line
                  x1="0" y1="-3" x2="-20" y2="-20"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [1, 0], scale: [0.4, 1.2] }}
                  transition={{ delay: 2.38, duration: 0.8, ease: "easeOut" }}
                  stroke="#f97316" strokeWidth="2" strokeLinecap="round"
                />
                <motion.line
                  x1="0" y1="-3" x2="20" y2="-20"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [1, 0], scale: [0.4, 1.2] }}
                  transition={{ delay: 2.38, duration: 0.8, ease: "easeOut" }}
                  stroke="#f97316" strokeWidth="2" strokeLinecap="round"
                />
                <motion.line
                  x1="0" y1="-3" x2="0" y2="-32"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [1, 0], scale: [0.4, 1.2] }}
                  transition={{ delay: 2.38, duration: 0.8, ease: "easeOut" }}
                  stroke="#f97316" strokeWidth="2" strokeLinecap="round"
                />

                {/* INDEPENDENT CROSS - Falling gracefully from top onto the beam */}
                <motion.g
                  initial={{ y: -280, opacity: 0 }}
                  animate={{
                    y: -3,
                    opacity: 1,
                  }}
                  transition={{
                    delay: 1.0,
                    duration: 1.38,
                    ease: "easeOut",
                  }}
                >
                  {/* Soft orange halo background - independent, no hanger cup */}
                  <path d="M-6,-50 L6,-50 L6,-38 L16,-38 L16,-30 L6,-30 L6,0 L-6,0 L-6,-30 L-16,-30 L-16,-38 L-6,-38 Z" fill="url(#cross-glow)" pointerEvents="none" />
                  {/* Pure cross - no attachments, no hanger mechanism */}
                  <path d="M-5,-49 L5,-49 L5,-37 L15,-37 L15,-31 L5,-31 L5,0 L-5,0 L-5,-31 L-15,-31 L-15,-37 L-5,-37 Z" fill="#f97316" stroke="#fed7aa" strokeWidth="1.2" className="filter drop-shadow-[0_0_12px_rgba(249,115,22,0.95)]" />
                </motion.g>
              </g>

              {/* RIGHT SIDE - GLOBE - Fixed to the beam from the beginning */}
              <g transform="translate(410, 250)">
                <g transform="translate(0, -23)">
                  {/* Aura glowing background circle */}
                  <circle cx="0" cy="0" r="28" fill="url(#globe-glow)" pointerEvents="none" />
                  {/* Main globe boundary */}
                  <circle cx="0" cy="0" r="20" stroke="#0284c7" strokeWidth="2.2" fill="rgba(14, 165, 233, 0.08)" className="filter drop-shadow-[0_0_10px_rgba(56,189,248,0.7)]" />
                  
                  {/* Grid lines - latitude and longitude */}
                  <ellipse cx="0" cy="0" rx="20" ry="7" stroke="rgba(56, 189, 248, 0.42)" strokeWidth="1.2" fill="none" />
                  <ellipse cx="0" cy="0" rx="7" ry="20" stroke="rgba(56, 189, 248, 0.42)" strokeWidth="1.2" fill="none" />
                  <line x1="-20" y1="0" x2="20" y2="0" stroke="rgba(56, 189, 248, 0.42)" strokeWidth="1.2" />
                  <line x1="0" y1="-20" x2="0" y2="20" stroke="rgba(56, 189, 248, 0.42)" strokeWidth="1.2" />

                  {/* Continent shapes */}
                  <path d="M-10,-3 Q-2,-5 5,-3 Q11,-1 14,5 Q11,11 5,9 Q-5,13 -10,-3 Z" fill="rgba(56, 189, 248, 0.28)" />
                  <path d="M-3,-3 Q3,-5 5,0 Q0,3 -3,-3 Z" fill="rgba(56, 189, 248, 0.28)" />
                  <path d="M-5,11 Q-2,15 8,12 Q6,9 -5,11 Z" fill="rgba(56, 189, 248, 0.22)" />
                </g>
              </g>
            </motion.g>
          </svg>
        </motion.div>
      </div>
    </motion.div>
  )}
</AnimatePresence>

{/* PHASE 10: DYNAMIC CHRONOLOGY (1:56 TO 2:12) */}
<AnimatePresence>
  {currentPhase === 10 && (
    <motion.div
      key="phase-10-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="absolute inset-0 w-full h-full bg-black z-20 overflow-hidden select-none"
    >
      <AnimatePresence mode="wait">
        {/* SEQUENCE 1: SUN BURST & SUPERNOVA - BOOM EFFECT */}
        {p10Seq === 1 && (
          <motion.div
            key="p10-seq1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Intense Supernova solar burst background - Fullscreen explosion */}
            <div className="absolute inset-0 z-0 pointer-events-none select-none">
              {/* Explosive radial gradient - fullscreen */}
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-0 bg-[radial-gradient(circle,rgba(249,115,22,0.5)_0%,rgba(234,88,12,0.3)_20%,rgba(0,0,0,1)_80%)]"
              />
              
              {/* Multiple corona layers for realistic sun appearance */}
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-[radial-gradient(circle,#f97316_0%,#ea580c_40%,transparent_70%)] filter blur-3xl opacity-40"
              />
              
              <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,#fbbf24_0%,#f97316_50%,transparent_80%)] filter blur-2xl opacity-50"
              />

              {/* Bright solar core - pulsing like a heartbeat */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-80 sm:h-80 rounded-full bg-white filter blur-2xl opacity-80 mix-blend-screen"
              />
            </div>

            {/* Solar flares and prominences */}
            <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                <defs>
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                <motion.path
                  d="M500,500 Q550,350 600,200 Q580,350 500,500"
                  fill="url(#flare-grad)"
                  animate={{ opacity: [0, 0.8, 0], scale: [0.8, 1.2, 0.8] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  filter="url(#glow)"
                />
                <motion.path
                  d="M500,500 Q400,320 350,150 Q420,300 500,500"
                  fill="url(#flare-grad)"
                  animate={{ opacity: [0, 0.7, 0], scale: [0.8, 1.3, 0.8] }}
                  transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut", delay: 0.5 }}
                  filter="url(#glow)"
                />
                <motion.path
                  d="M500,500 Q650,400 750,250 Q620,380 500,500"
                  fill="url(#flare-grad)"
                  animate={{ opacity: [0, 0.6, 0], scale: [0.9, 1.4, 0.9] }}
                  transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 1 }}
                  filter="url(#glow)"
                />
                
                <linearGradient id="flare-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.9"/>
                  <stop offset="100%" stopColor="#ea580c" stopOpacity="0"/>
                </linearGradient>
              </svg>
            </div>

            {/* Radiating sun rays - full screen, slower */}
            <div className="absolute inset-0 z-0 pointer-events-none select-none">
              {Array.from({ length: 48 }).map((_, i) => {
                const angle = (i * 360) / 48;
                return (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-[200%] h-[2px] origin-center"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                      background: "linear-gradient(90deg, transparent, #f97316, #fbbf24, #f97316, transparent)",
                      opacity: 0.3,
                    }}
                    animate={{ opacity: [0.15, 0.45, 0.15], scaleX: [0.8, 1.2, 0.8] }}
                    transition={{ repeat: Infinity, duration: 4, delay: i * 0.04, ease: "easeInOut" }}
                  />
                );
              })}
            </div>

            {/* Text - BLACK for visibility, NO SHAKE */}
            <div className="relative w-full max-w-5xl px-8 flex flex-col items-center justify-center gap-2 sm:gap-4 text-center z-10">
              <div className="flex items-center justify-center overflow-visible">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="text-[15px] xs:text-base sm:text-lg md:text-xl font-light tracking-[0.1em] sm:tracking-[0.2em] uppercase text-black font-sans leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                >
                  He gave the sun
                </motion.p>
              </div>
              <div className="flex items-center justify-center overflow-visible">
                <motion.h1
                  initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold uppercase font-display tracking-widest text-black drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] leading-none py-2"
                >
                  Its Beauty
                </motion.h1>
              </div>
            </div>

            {/* Pulsing shockwave rings expanding fullscreen - slower */}
            <motion.div
              initial={{ scale: 0.2, opacity: 0.9 }}
              animate={{ scale: 6, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeOut", repeatDelay: 1 }}
              className="absolute w-96 h-96 rounded-full border-2 border-orange-400/60 filter blur-md mix-blend-screen pointer-events-none"
            />
            <motion.div
              initial={{ scale: 0.2, opacity: 0.7 }}
              animate={{ scale: 6, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeOut", delay: 1.5, repeatDelay: 1 }}
              className="absolute w-96 h-96 rounded-full border border-orange-300/40 filter blur-lg mix-blend-screen pointer-events-none"
            />
          </motion.div>
        )}

        {/* SEQUENCE 2: STARS CREATION - Extended duration */}
        {p10Seq === 2 && (
          <motion.div
            key="p10-seq2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Enhanced Cosmos field with many more stars & constellation overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none select-none">
              <div className="absolute inset-0 bg-[#030307]" />
              
              {/* Ambient nebulae - deeper colors */}
              <div className="absolute top-[15%] left-[10%] w-[450px] h-[450px] rounded-full bg-cyan-900/30 filter blur-[120px]" />
              <div className="absolute bottom-[20%] right-[5%] w-[500px] h-[500px] rounded-full bg-violet-900/30 filter blur-[140px]" />
              <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-indigo-900/20 filter blur-[100px]" />

              {/* Many more twinkling stars - increased count to 200 */}
              <div className="absolute inset-0 opacity-90">
                {Array.from({ length: 200 }).map((_, i) => {
                  const left = `${Math.random() * 100}%`;
                  const top = `${Math.random() * 100}%`;
                  const delay = Math.random() * 8;
                  const size = Math.random() > 0.7 ? "w-1.5 h-1.5" : "w-1 h-1";
                  const brightness = Math.random() > 0.8 ? 0.95 : 0.5;
                  return (
                    <motion.div
                      key={i}
                      style={{ left, top }}
                      animate={{ 
                        opacity: [brightness * 0.2, brightness, brightness * 0.2], 
                        scale: [0.7, 1.3, 0.7] 
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2 + Math.random() * 3, 
                        delay, 
                        ease: "easeInOut" 
                      }}
                      className={`absolute rounded-full bg-white filter drop-shadow-[0_0_4px_rgba(56,189,248,0.6)] ${size}`}
                    />
                  );
                })}
              </div>

              {/* Multiple constellation mappings - more detailed */}
              <div className="absolute inset-0 flex items-center justify-center opacity-40 sm:opacity-50">
                <motion.svg
                  animate={{ rotate: [0, 3, 0, -3, 0], scale: [0.98, 1.02, 0.98] }}
                  transition={{
                    rotate: { repeat: Infinity, duration: 80, ease: "linear" },
                    scale: { repeat: Infinity, duration: 20, ease: "easeInOut" }
                  }}
                  className="w-[700px] h-[700px] sm:w-[900px] sm:h-[900px] text-sky-400"
                  viewBox="0 0 500 500"
                  fill="none"
                >
                  {/* Constellation 1 - Orion-like */}
                  <motion.path
                    d="M 80,150 L 150,100 L 250,180 L 320,110 L 420,200 M 250,180 L 280,280 L 200,330 L 150,280 L 80,150 M 280,280 L 360,380"
                    stroke="rgba(14, 165, 233, 0.35)"
                    strokeWidth="1.5"
                    strokeDasharray="3 5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 8, ease: "easeInOut", repeat: Infinity, repeatDelay: 5 }}
                  />
                  
                  {/* Constellation 2 - Cassiopeia-like */}
                  <motion.path
                    d="M 350,80 L 380,130 L 350,180 L 380,230 L 350,280"
                    stroke="rgba(56, 189, 248, 0.3)"
                    strokeWidth="1.2"
                    strokeDasharray="2 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 7, ease: "easeInOut", repeat: Infinity, repeatDelay: 4 }}
                  />
                  
                  {/* Constellation 3 - Ursa Major-like */}
                  <motion.path
                    d="M 50,350 L 100,320 L 180,340 L 220,300 L 280,310 L 320,280 L 370,290"
                    stroke="rgba(14, 165, 233, 0.3)"
                    strokeWidth="1.2"
                    strokeDasharray="2 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 9, ease: "easeInOut", repeat: Infinity, repeatDelay: 6 }}
                  />

                  {/* Constellation 4 - New added */}
                  <motion.path
                    d="M 120,380 L 160,360 L 210,390 L 260,370"
                    stroke="rgba(56, 189, 248, 0.25)"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 6, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }}
                  />

                  {/* Constellation stars - brighter nodes */}
                  <circle cx="80" cy="150" r="4.5" fill="#e0f2fe" filter="drop-shadow(0 0 5px #38bdf8)" />
                  <circle cx="150" cy="100" r="5.5" fill="#fff" filter="drop-shadow(0 0 8px #0ea5e9)" />
                  <circle cx="250" cy="180" r="6.5" fill="#38bdf8" filter="drop-shadow(0 0 12px #ffffff)" />
                  <circle cx="320" cy="110" r="4" fill="#e0f2fe" />
                  <circle cx="420" cy="200" r="5" fill="#fff" filter="drop-shadow(0 0 6px #0ea5e9)" />
                  <circle cx="280" cy="280" r="5.5" fill="#38bdf8" />
                  <circle cx="200" cy="330" r="4.5" fill="#fff" />
                  <circle cx="150" cy="280" r="4" fill="#e0f2fe" />
                  <circle cx="360" cy="380" r="6" fill="#0ea5e9" filter="drop-shadow(0 0 8px #38bdf8)" />
                  <circle cx="120" cy="380" r="3.5" fill="#fff" />
                  <circle cx="160" cy="360" r="4" fill="#38bdf8" />
                  <circle cx="210" cy="390" r="3.5" fill="#e0f2fe" />
                  <circle cx="260" cy="370" r="4" fill="#fff" />
                </motion.svg>
              </div>
            </div>

            {/* Typography Content */}
            <motion.div
              initial={{ opacity: 0, filter: "blur(15px)", y: 15 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ duration: 1.8, ease: "easeOut", delay: 0.3 }}
              className="relative w-full max-w-5xl px-8 flex flex-col items-center justify-center gap-2 sm:gap-4 text-center z-10"
            >
              <div className="flex items-center justify-center overflow-visible">
                <p className="text-[10px] xs:text-xs sm:text-sm md:text-base font-light tracking-[0.4em] sm:tracking-[0.6em] uppercase text-gray-300 font-sans leading-none drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]">
                  He calls the stars
                </p>
              </div>
              <div className="flex items-center justify-center overflow-visible">
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold uppercase font-display tracking-widest text-[#38bdf8] drop-shadow-[0_0_45px_rgba(56,189,248,0.8)] leading-none py-2">
                  By their name
                </h1>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* SEQUENCE 3: THE LION OF JUDAH & 7 SCROLLS - Extended duration, no numbers */}
        {p10Seq === 3 && (
          <motion.div
            key="p10-seq3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden bg-black"
          >
            {/* Elegant vignette layout background */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-950/90 to-black z-0 pointer-events-none select-none" />
            
            {/* Subtle golden ambient glow behind text */}
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-[400px] h-[200px] bg-yellow-500/5 rounded-full filter blur-3xl pointer-events-none" />

            {/* Typography Content */}
            <div className="relative w-full max-w-5xl px-8 flex flex-col items-center justify-center gap-2 sm:gap-4 text-center z-10 mt-[-80px]">
              <motion.div
                initial={{ opacity: 0, filter: "blur(20px)", y: 15 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
                className="flex flex-col items-center justify-center gap-1.5 sm:gap-3 text-center select-none leading-none"
              >
                <div className="flex items-center justify-center overflow-visible">
                  <p className="text-[10px] xs:text-xs sm:text-xl md:text-base font-light tracking-[0.4em] sm:tracking-[0.6em] uppercase text-amber-500/70 font-sans leading-none">
                    The Lion of
                  </p>
                </div>
                <div className="flex items-center justify-center overflow-visible flex-wrap">
                  <motion.h1 
                    animate={{ 
                      textShadow: [
                        "0 0 20px rgba(234,179,8,0.4)",
                        "0 0 50px rgba(234,179,8,0.8)",
                        "0 0 20px rgba(234,179,8,0.4)"
                      ]
                    }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold uppercase font-display tracking-[0.16em] sm:tracking-[0.25em] text-[#eab308] drop-shadow-[0_0_60px_rgba(234,179,8,0.7)] leading-none py-3"
                  >
                    Judah
                  </motion.h1>
                </div>
              </motion.div>
            </div>

            {/* 7 Scrolls - Staggered, smooth entrance, NO numbers */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-1.5 sm:gap-3 md:gap-4 z-10">
              {Array.from({ length: 7 }).map((_, i) => {
                const scrollIndex = i + 1;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 80, scale: 0.6, rotateX: -40 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                    transition={{
                      delay: 0.8 + scrollIndex * 0.2,
                      duration: 1.5,
                      ease: [0.16, 1, 0.3, 1],
                      type: "spring",
                      stiffness: 150,
                      damping: 25
                    }}
                    whileHover={{ y: -10, scale: 1.05, transition: { duration: 0.3 } }}
                    className="flex flex-col items-center gap-0"
                  >
                    <div className="relative w-9 sm:w-12 md:w-14 h-16 sm:h-20 flex items-center justify-center group cursor-pointer">
                      <motion.div 
                        className="absolute inset-0 bg-yellow-500/15 rounded-md filter blur-[12px] opacity-0"
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <svg className="w-full h-full filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.7)]" viewBox="0 0 50 80" fill="none">
                        <circle cx="10" cy="8" r="3.5" fill="#ca8a04" stroke="#854d0e" strokeWidth="1" />
                        <circle cx="40" cy="8" r="3.5" fill="#ca8a04" stroke="#854d0e" strokeWidth="1" />
                        <rect x="5" y="10" width="40" height="4.5" rx="1.5" fill="url(#p10-wood)" />
                        <rect x="10" y="14.5" width="30" height="52" rx="2" fill="url(#p10-parchment)" stroke="#ca8a04" strokeWidth="0.8" />
                        
                        <line x1="15" y1="25" x2="35" y2="25" stroke="#ca8a04" strokeWidth="0.4" opacity="0.3" />
                        <line x1="15" y1="32" x2="35" y2="32" stroke="#ca8a04" strokeWidth="0.4" opacity="0.3" />
                        <line x1="15" y1="39" x2="35" y2="39" stroke="#ca8a04" strokeWidth="0.4" opacity="0.3" />
                        <line x1="15" y1="46" x2="35" y2="46" stroke="#ca8a04" strokeWidth="0.4" opacity="0.3" />
                        <line x1="15" y1="53" x2="35" y2="53" stroke="#ca8a04" strokeWidth="0.4" opacity="0.3" />
                        
                        <motion.line 
                          x1="10" y1="41" x2="40" y2="41" stroke="#b91c1c" strokeWidth="2.2" 
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.2 }}
                        />
                        <circle cx="25" cy="41" r="5" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1.2" />
                        <motion.path 
                          d="M25,41 L27,46 L23,46 Z" fill="#b91c1c"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                        />

                        <circle cx="10" cy="72" r="3.5" fill="#ca8a04" stroke="#854d0e" strokeWidth="1" />
                        <circle cx="40" cy="72" r="3.5" fill="#ca8a04" stroke="#854d0e" strokeWidth="1" />
                        <rect x="5" y="66" width="40" height="4.5" rx="1.5" fill="url(#p10-wood)" />

                        <defs>
                          <linearGradient id="p10-wood" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#854d0e" />
                            <stop offset="50%" stopColor="#ca8a04" />
                            <stop offset="100%" stopColor="#854d0e" />
                          </linearGradient>
                          <linearGradient id="p10-parchment" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.85" />
                            <stop offset="50%" stopColor="#fef9c3" stopOpacity="0.95" />
                            <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.7" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    {/* NO numbers below scrolls - removed */}
                  </motion.div>
                );
              })}
            </div>

            {/* Animated golden particles floating around the scrolls */}
            <div className="absolute bottom-12 inset-x-0 pointer-events-none">
              {Array.from({ length: 40 }).map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  initial={{ x: Math.random() * window.innerWidth, y: window.innerHeight - 100, opacity: 0 }}
                  animate={{ 
                    y: [window.innerHeight - 100, window.innerHeight - 250, window.innerHeight - 450],
                    opacity: [0, 0.5, 0],
                    x: (Math.random() - 0.5) * 250
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 3 + Math.random() * 3,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                  className="absolute w-1 h-1 rounded-full bg-yellow-400 filter blur-[1px]"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )}
</AnimatePresence>

{/* PHASE 11: CORE CHRONIC RESOLUTION (2:12 TO 2:26) */}
<AnimatePresence mode="wait">
  {currentPhase === 11 && (
    <motion.div
      key="phase-11-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="absolute inset-0 w-full h-full bg-black z-20 overflow-hidden select-none flex flex-col items-center justify-center text-center px-4"
    >
      {/* Background cinematic cosmos field with rotating light and cosmic gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(249,115,22,0.12)_0%,rgba(0,0,0,1)_85%)] opacity-95" />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="relative w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] opacity-25 mix-blend-screen filter blur-[80px] bg-[conic-gradient(from_0deg,#f97316,#030712,#f97316,#030712)]"
        />
      </div>

      {/* Text container - with fixed positioning */}
      <div className="relative w-full max-w-7xl px-4 flex items-center justify-center z-10">
        <div className="w-full flex flex-row items-center justify-center font-display font-black uppercase text-center select-none overflow-visible">
          
          {/* Stationary HE component - FIXED WIDTH CONTAINER */}
          <div className="flex justify-end flex-shrink-0 min-w-[4rem] sm:min-w-[5rem] md:min-w-[6rem]">
            <span className="text-gray-300 text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-widest leading-none drop-shadow-[0_2px_10px_rgba(255,255,255,0.06)] whitespace-nowrap">
              He
            </span>
          </div>

          {/* Dynamic attributes component - TAKES REMAINING SPACE - NO MOVEMENT */}
          <div className="flex justify-start flex-1 min-w-0 text-left">
            <motion.span
              key={p11TextIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{
                fontSize: p11TextIndex === 19 
                  ? "clamp(1.875rem, 5.5vw, 6rem)"
                  : p11TextIndex === 0 
                  ? "clamp(1.25rem, 3.2vw, 3.5rem)"
                  : "clamp(1.25rem, 4vw, 4.5rem)"
              }}
              className={`font-display font-extrabold uppercase select-none leading-none tracking-normal whitespace-nowrap ${
                p11TextIndex === 19
                  ? "text-[#f97316] drop-shadow-[0_0_60px_rgba(249,115,22,1)] font-black animate-pulse"
                  : "text-orange-500/90 drop-shadow-[0_0_30px_rgba(249,115,22,0.45)]"
              }`}
            >
              {[
                " is who cleansed us",
                " is the Son of God",
                " is the Alpha and Omega",
                " is the Word made Flesh",
                " is the King of Kings",
                " is the Prince of Peace",
                " is the Great I Am",
                " is the Lord of Lords",
                " is the Light of the World",
                " is the Way and the Truth",
                " is the Good Shepherd",
                " is the Resurrection",
                " is our Redeemer",
                " is our Savior",
                " is our Hope",
                " is our Strength",
                " is our Shield",
                " is our Peace",
                " is our Life",
                " is Jesus Christ"
              ][p11TextIndex]}
            </motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>

{/* PHASE 12: FINAL RESOLUTION / WELCOME SCREEN (2:29+) */}
<AnimatePresence>
  {currentPhase === 12 && (
    <motion.div
      key="phase-12-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2.0 }}
      className="absolute inset-0 w-full h-full bg-black z-20 overflow-hidden select-none flex flex-col items-center justify-center text-center px-4"
    >
      {/* Background cinematic cosmos field with deep gold/orange breathing glow */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(249,115,22,0.08)_0%,rgba(0,0,0,1)_85%)] opacity-95" />
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          className="relative w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] mix-blend-screen filter blur-[90px] bg-[conic-gradient(from_0deg,#ea580c,#030712,#ea580c,#030712)]"
        />
      </div>

      <div className="relative w-full max-w-5xl px-8 flex flex-col items-center justify-center gap-4 sm:gap-6 text-center z-10">
        {/* Line 1: Welcome to */}
        <div className="flex items-center justify-center overflow-visible">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 0.85, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
            className="text-base xs:text-lg sm:text-xl md:text-2xl font-light tracking-[0.3em] sm:tracking-[0.4em] uppercase text-zinc-300 font-sans leading-none drop-shadow-[0_2px_8px_rgba(255,255,255,0.05)]"
          >
            Welcome to
          </motion.p>
        </div>

        {/* Line 2: Madan Church */}
        <div className="flex items-center justify-center overflow-visible">
          <motion.h1
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.8, ease: "easeOut", delay: 0.9 }}
            className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold uppercase font-display tracking-widest text-[#f97316] drop-shadow-[0_0_50px_rgba(249,115,22,0.65)] leading-none py-2"
          >
            Madan Church
          </motion.h1>
        </div>

        {/* Circular beautiful golden-accented interactive REPLAY button in the center-bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 3.5, ease: "easeOut" }}
          className="mt-12 sm:mt-16 z-20"
        >
          <motion.button
            onClick={handleReset}
            whileHover={{ scale: 1.05, borderColor: "rgba(249, 115, 22, 0.6)", boxShadow: "0 0 25px rgba(249, 115, 22, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-8 py-3.5 rounded-full border border-white/10 bg-black/60 backdrop-blur-md text-sm text-zinc-300 hover:text-white font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer animate-fade"
          >
            <RefreshCw size={14} className="animate-spin-slow text-[#f97316]" />
            <span>Replay Journey</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Floating starry particles */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-5">
        {Array.from({ length: 30 }).map((_, i) => {
          const left = `${(i * 17 + 9) % 100}%`;
          const delay = (i % 5) * 0.8;
          return (
            <motion.div
              key={i}
              initial={{ y: "105vh", opacity: 0 }}
              animate={{ 
                y: "-10vh", 
                opacity: [0, 0.35, 0.35, 0],
                x: ["0px", `${Math.sin(i) * 35}px`, "0px"]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 9 + (i % 4) * 3, 
                delay, 
                ease: "linear" 
              }}
              className="absolute w-1 h-1 rounded-full bg-orange-400 opacity-20 filter blur-[0.5px]"
              style={{ left }}
            />
          );
        })}
      </div>
    </motion.div>
  )}
</AnimatePresence>

      {/* Cinematic Glowing Flare divider bar pulsing at the bottom */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0.8 }}
            animate={{
              opacity: currentPhase === 1 
                ? [0.12, 0.22, 0.12] 
                : (currentPhase === 7 || currentPhase === 8 || currentPhase === 9 || currentPhase === 10 || currentPhase === 11 || currentPhase === 12) 
                ? [0.18, 0.35, 0.18] 
                : [0.06, 0.14, 0.06],
              scaleX: currentPhase === 1 
                ? [0.95, 1.05, 0.95] 
                : (currentPhase === 7 || currentPhase === 8 || currentPhase === 9 || currentPhase === 10 || currentPhase === 11 || currentPhase === 12) 
                ? [0.98, 1.08, 0.98] 
                : [0.95, 1.05, 0.95],
            }}
            transition={{
              opacity: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
              scaleX: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
            }}
            style={{ width: (currentPhase === 1 || currentPhase === 8 || currentPhase === 9 || currentPhase === 10 || currentPhase === 11 || currentPhase === 12) ? "120px" : "360px" }}
            className="absolute bottom-28 h-[1.5px] bg-gradient-to-r from-transparent via-[#f97316] to-transparent z-10 filter drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]"
          />
        )}
      </AnimatePresence>
    </div>
  </div>
  );
}
