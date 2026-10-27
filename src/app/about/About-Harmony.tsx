import React, { useState, useRef, useEffect } from "react";
import { 
  Play, 
  Square, 
  Sliders, 
  Activity,
  ToggleLeft,
  ToggleRight,
  Info
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";

interface VocalPart {
  id: "soprano" | "alto" | "tenor" | "bass";
  name: string;
  amharicName: string;
  notes: {
    "Song 1": number;
    "Song 2": number;
    "Song 3": number;
  };
  description: string;
  colorName: string; 
  hexColor: string;
  gain: number; 
  isActive: boolean;
}

export default function Soundscape() {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [activePreset, setActivePreset] = useState<"Song 1" | "Song 2" | "Song 3">("Song 1");
  const [masterPlaying, setMasterPlaying] = useState(false);
  const [audioSupported, setAudioSupported] = useState(true);
  const [systemMessage, setSystemMessage] = useState("Vocal registers standing by. Press 'Enable Choir' to hear the harmony.");
  const [audioInitialized, setAudioInitialized] = useState(false);

  const [parts, setParts] = useState<VocalPart[]>([
    {
      id: "soprano",
      name: "Soprano (S)",
      amharicName: "ሶፕራኖ",
      notes: { "Song 1": 523.25, "Song 2": 698.46, "Song 3": 783.99 },
      description: "The highest, crystal-clear melody line carrying the main thematic hymn air.",
      colorName: "from-church-orange to-red-500",
      hexColor: "#FF6B00",
      gain: 0.6,
      isActive: true,
    },
    {
      id: "alto",
      name: "Alto (A)",
      amharicName: "አልቶ",
      notes: { "Song 1": 329.63, "Song 2": 261.63, "Song 3": 293.66 },
      description: "The warm middle-range harmony adding depth and dynamic texture to the soprano line.",
      colorName: "from-church-amber to-amber-600",
      hexColor: "#FFA500",
      gain: 0.7,
      isActive: true,
    },
    {
      id: "tenor",
      name: "Tenor (T)",
      amharicName: "ቴነር",
      notes: { "Song 1": 196.00, "Song 2": 220.00, "Song 3": 246.94 },
      description: "The classical mid-low spiritual range driving the acoustic movement.",
      colorName: "from-church-gold to-yellow-600",
      hexColor: "#D4AF37",
      gain: 0.7,
      isActive: true,
    },
    {
      id: "bass",
      name: "Bass (B)",
      amharicName: "ቤዝ",
      notes: { "Song 1": 130.81, "Song 2": 174.61, "Song 3": 196.00 },
      description: "The deep, resonant foundation anchoring all parts in absolute stability.",
      colorName: "from-amber-700 to-amber-900",
      hexColor: "#8B4513",
      gain: 0.8,
      isActive: true,
    },
  ]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const partNodesRef = useRef<{
    [key: string]: { osc: OscillatorNode; gainNode: GainNode } | null;
  }>({ soprano: null, alto: null, tenor: null, bass: null });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const getAudioContext = async (): Promise<AudioContext | null> => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        } else {
          setAudioSupported(false);
          return null;
        }
      }
      return audioCtxRef.current;
    } catch (e) {
      setAudioSupported(false);
      return null;
    }
  };

  const initializeAudio = async () => {
    const ctx = await getAudioContext();
    if (ctx && ctx.state === "suspended") {
      await ctx.resume();
    }
    setAudioInitialized(true);
    return ctx;
  };

  const stopAllOscillators = () => {
    Object.keys(partNodesRef.current).forEach((key) => {
      const node = partNodesRef.current[key];
      if (node) {
        try {
          node.osc.stop();
          node.osc.disconnect();
          node.gainNode.disconnect();
        } catch (e) {}
        partNodesRef.current[key] = null;
      }
    });
    setMasterPlaying(false);
  };

  const startPartNode = (ctx: AudioContext, part: VocalPart) => {
    if (partNodesRef.current[part.id]) {
      try {
        partNodesRef.current[part.id]?.osc.stop();
        partNodesRef.current[part.id]?.osc.disconnect();
        partNodesRef.current[part.id]?.gainNode.disconnect();
      } catch (e) {}
      partNodesRef.current[part.id] = null;
    }

    if (!part.isActive || !masterPlaying) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const currentFreq = part.notes[activePreset];

    osc.frequency.value = currentFreq;
    osc.type = "sine";

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(part.gain * 0.15, ctx.currentTime + 1.0);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start();

    partNodesRef.current[part.id] = { osc, gainNode };
  };

  const toggleMasterPlay = async () => {
    let ctx = audioCtxRef.current;
    
    if (!ctx || ctx.state === "closed") {
      ctx = await initializeAudio();
    }
    
    if (!ctx) {
      setSystemMessage("Audio not supported in this browser.");
      return;
    }

    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    if (masterPlaying) {
      stopAllOscillators();
      setSystemMessage("Choir silenced.");
    } else {
      setMasterPlaying(true);
      setSystemMessage("Madan Harmonizer active. Tune individual voice registers below!");
    }
  };

  // Update oscillators when parameters change
  useEffect(() => {
    const ctx = audioCtxRef.current;
    if (!ctx || !masterPlaying) return;

    parts.forEach((part) => {
      const activeNode = partNodesRef.current[part.id];
      if (activeNode) {
        if (!part.isActive) {
          try {
            const node = partNodesRef.current[part.id];
            if (node) {
              node.gainNode.gain.setValueAtTime(node.gainNode.gain.value, ctx.currentTime);
              node.gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
              setTimeout(() => {
                try {
                  node.osc.stop();
                  node.osc.disconnect();
                  node.gainNode.disconnect();
                } catch(e) {}
              }, 400);
            }
          } catch(e) {}
          partNodesRef.current[part.id] = null;
        } else {
          const currentFreq = part.notes[activePreset];
          activeNode.osc.frequency.setValueAtTime(currentFreq, ctx.currentTime);
          activeNode.osc.type = "sine";
          activeNode.gainNode.gain.linearRampToValueAtTime(part.gain * 0.15, ctx.currentTime + 0.2);
        }
      } else if (part.isActive && masterPlaying) {
        startPartNode(ctx, part);
      }
    });

    const activeWords = parts.filter(p => p.isActive).map(p => p.id.toUpperCase());
    if (activeWords.length === 0) {
      setSystemMessage("All parts disabled. Complete absolute silence.");
    } else if (activeWords.length === 4) {
      setSystemMessage("Maximum 4-Part Full Protestant Sacred Harmony constructed!");
    } else {
      setSystemMessage(`Active registers: ${activeWords.join(" + ")}`);
    }
  }, [parts, activePreset, masterPlaying]);

  const togglePartStrength = (id: string) => {
    setParts(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  const changePartGain = (id: string, val: number) => {
    setParts(prev => prev.map(p => p.id === id ? { ...p, gain: val } : p));
  };

  // Canvas visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let tick = 0;
    const draw = () => {
      ctx.fillStyle = "#0B0B0C";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const height = canvas.height;
      const width = canvas.width;
      const partHeight = height / 4;

      ctx.strokeStyle = "rgba(40, 40, 45, 0.4)";
      ctx.lineWidth = 1;
      for (let s = 1; s <= 5; s++) {
        const staffY = 30 + s * 14;
        ctx.beginPath();
        ctx.moveTo(10, staffY);
        ctx.lineTo(width - 10, staffY);
        ctx.stroke();
      }

      parts.forEach((part, index) => {
        const topY = index * partHeight;
        const middleY = topY + partHeight / 2;

        ctx.strokeStyle = "rgba(28, 28, 31, 0.5)";
        ctx.beginPath();
        ctx.moveTo(0, topY);
        ctx.lineTo(width, topY);
        ctx.stroke();

        if (part.isActive && masterPlaying) {
          ctx.strokeStyle = part.hexColor;
          ctx.lineWidth = 2.0;
          ctx.beginPath();

          const cycleTerm = 0.005 + (0.01 * (index + 1) * 0.4);

          for (let x = 10; x < width - 10; x++) {
            const amplitude = 14 * part.gain;
            const y = middleY + Math.sin(x * cycleTerm + tick * 0.15) * amplitude * Math.sin(x * 0.004);
            if (x === 10) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          ctx.fillStyle = part.hexColor;
          ctx.font = "bold 9px 'Montserrat', sans-serif";
          ctx.fillText(part.id.toUpperCase(), 15, middleY - 6);

          const noteX = 35 + ((tick * (4 - index)) % (width - 70));
          const noteY = middleY + Math.sin(noteX * cycleTerm + tick * 0.15) * 14 * part.gain * Math.sin(noteX * 0.004);
          
          ctx.fillStyle = part.hexColor;
          ctx.beginPath();
          ctx.arc(noteX, noteY, 4, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.strokeStyle = part.hexColor;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(noteX, noteY);
          ctx.lineTo(noteX + 4, noteY - 10);
          ctx.lineTo(noteX + 10, noteY - 8);
          ctx.stroke();
        } else {
          ctx.strokeStyle = "rgba(100, 100, 105, 0.12)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(10, middleY);
          ctx.lineTo(width - 10, middleY);
          ctx.stroke();

          ctx.fillStyle = "rgba(100,100,105,0.4)";
          ctx.font = "9px 'Montserrat', sans-serif";
          ctx.fillText(`${part.id.toUpperCase()} [MUTED]`, 15, middleY - 3);
        }
      });

      tick += 0.4;
      animationFrameId.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [parts, masterPlaying]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight || 180;
      }
    };
    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (canvasRef.current?.parentElement) {
      observer.observe(canvasRef.current.parentElement);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => stopAllOscillators();
  }, []);

  return (
    <div className="bg-black p-6 md:p-10 rounded-3xl border border-gray-800 shadow-2xl relative font-['Montserrat']" id="choir-harmonizer-dashboard">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-orange-500 font-bold font-['Montserrat'] block mb-1">
              {t.soundscape.learnHow}
            </span>
            <h3 className="font-['Montserrat'] text-2xl md:text-3xl font-bold text-white tracking-wide uppercase">
              {t.soundscape.madanHarmonizer}
            </h3>
            <p className="text-gray-400 text-xs md:text-sm mt-1.5 leading-relaxed font-['Montserrat']">
              {t.soundscape.description}
            </p>
          </div>

          <div className="bg-gray-900/40 p-4 rounded-xl border border-gray-800/80 flex flex-col gap-3">
            <span className="text-[10px] tracking-wider uppercase font-['Montserrat'] text-gray-500 font-bold block">
              1. Choose Song
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(["Song 1", "Song 2", "Song 3"] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => setActivePreset(preset)}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium font-['Montserrat'] transition-all duration-300 ${
                    activePreset === preset
                      ? "bg-orange-500/10 border-orange-500 text-white"
                      : "bg-black/40 border-transparent hover:border-gray-800 text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-[10px] tracking-wider uppercase font-['Montserrat'] text-gray-500 font-bold block">
              2. Individual Register Controls (Soprano, Alto, Tenor, Bass)
            </span>

            {parts.map((part) => (
              <div 
                key={part.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 transition-all duration-300 ${
                  part.isActive 
                    ? "bg-gray-900/80 border-orange-500/30" 
                    : "bg-gray-900/20 border-gray-800/40"
                }`}
              >
                <div className="flex items-start gap-3 min-w-[200px]">
                  <span className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0`} style={{ backgroundColor: part.isActive ? part.hexColor : '#1C1C1F' }} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-['Montserrat'] font-bold text-sm text-white">
                        {part.name}
                      </span>
                      <span className="text-[10px] font-['Montserrat'] text-amber-500 italic">
                        {part.amharicName}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-500 block leading-tight mt-0.5 font-['Montserrat']">
                      {part.notes[activePreset].toFixed(1)} Hz • {part.description}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-grow justify-end">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-gray-500" />
                    <input 
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={part.gain}
                      onChange={(e) => changePartGain(part.id, parseFloat(e.target.value))}
                      disabled={!part.isActive}
                      className="w-20 md:w-28 accent-orange-500 h-1 rounded-lg bg-black cursor-pointer disabled:opacity-30"
                    />
                    <span className="text-[10px] font-['Montserrat'] text-gray-400 w-6">
                      {(part.gain * 100).toFixed(0)}%
                    </span>
                  </div>

                  <button
                    onClick={() => togglePartStrength(part.id)}
                    className="p-1 focus:outline-none"
                    aria-label={`Toggle ${part.name}`}
                  >
                    {part.isActive ? (
                      <ToggleRight className="w-7 h-7 text-orange-500 cursor-pointer" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-gray-600 cursor-pointer" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6 h-full lg:justify-between min-h-[450px]">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4 flex flex-col justify-between h-full min-h-[260px] relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800/50 mb-3 z-10">
              <span className="text-[10px] uppercase tracking-wider font-['Montserrat'] text-gray-500 font-bold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-orange-500 animate-pulse" /> Live Harmonizer Scope
              </span>
              <span className="text-[10px] font-['Montserrat'] text-gray-500">
                S-A-T-B registers
              </span>
            </div>

            <div className="w-full h-44 my-2 relative">
              <canvas ref={canvasRef} className="w-full h-full block rounded-lg" />
            </div>

            <div className="pt-3 border-t border-gray-800/50 flex flex-col gap-3">
              {masterPlaying ? (
                <button
                  onClick={toggleMasterPlay}
                  className="w-full py-3.5 rounded-xl bg-gray-800 hover:bg-gray-800/80 border border-orange-500/35 text-white font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all font-['Montserrat']"
                >
                  <Square className="w-4 h-4 fill-white" /> Silence Choir Voices
                </button>
              ) : (
                <button
                  onClick={toggleMasterPlay}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:opacity-95 text-black font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-[0_4px_30px_rgba(255,107,0,0.2)] font-['Montserrat']"
                >
                  <Play className="w-4 h-4 fill-black" /> Run Active Vocal Harmony
                </button>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-900/10 border border-gray-800 flex gap-3">
            <Info className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-[9px] uppercase tracking-wider font-['Montserrat'] text-gray-500 block mb-1">
                Active synthesis status
              </span>
              <p className="text-xs text-gray-300 italic font-['Montserrat']">
                {systemMessage}
              </p>
            </div>
          </div>

          <p className="text-[10px] text-gray-500 font-['Montserrat'] text-center">
            * Note: Lower individual gains to achieve a Harmonic, comfortable Sound blend.
          </p>
        </div>

      </div>
    </div>
  );
}