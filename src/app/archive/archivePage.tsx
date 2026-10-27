// app/archive/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getArchiveItems, PreachingItem } from '@/lib/archiveActions';
import { 
  Play, Pause, Volume2, VolumeX, Download, Calendar, 
  User, Music, ArrowLeft, Radio, Heart, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../lib/translations';

export default function ArchivePage() {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [preachings, setPreachings] = useState<PreachingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);

  useEffect(() => {
    async function loadPreachings() {
      try {
        const items = await getArchiveItems();
        setPreachings(items);
      } catch (err) {
        console.error("Failed to load preachings", err);
      } finally {
        setLoading(false);
      }
    }
    loadPreachings();
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#f97316] selection:text-white pb-24">
      
      {/* 1. HERO SECTION */}
      <header className="relative w-full overflow-hidden flex flex-col">
        
        {/* Top Half of Hero */}
        <div className="bg-[#f97316] text-[#120d0b] pt-12 pb-24 px-6 md:px-12 lg:px-20 relative">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            
            <div className="flex flex-col">
              <Link href="/" className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase text-stone-500 hover:text-stone-800 transition-colors mb-12">
                <ArrowLeft size={14} className="hidden" /> 
              </Link>
              
              <h1 className="text-[12vw] md:text-[7vw] font-light leading-none tracking-tight font-sans select-none flex items-center ">
                Truth <span className='font-bold ml-[3%] italic'> Echoes</span> <span className="w-[1.8vw] h-[1.8vw] md:w-[1vw] md:h-[1vw] rounded-full bg-[#f97316] inline-block ml-1 self-end mb-[2vw] md:mb-[1vw]" />
              </h1>
            </div>

            <p className="max-w-xs text-sm md:text-base font-medium text-black leading-relaxed md:text-right mt-4 mb-3 md:mt-16">
              {t.archive.subtitle}
            </p>
          </div>
        </div>

        {/* Bottom Half of Hero */}
        <div className="bg-[#000000] pt-32 pb-16 px-6 md:px-12 lg:px-20 relative border-t border-white/5">
          
          {/* VINTAGE SPEAKER VISUAL */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-24 md:-top-32 w-56 h-72 md:w-64 md:h-80 bg-[#ebd9c1] rounded-3xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] border-[6px] border-[#a17e58] flex flex-col items-center justify-between z-20">
            <div className="w-16 h-16 rounded-full bg-[#1b1411] border-4 border-[#cfbfa9] flex items-center justify-center shadow-inner">
              <div className="w-6 h-6 rounded-full bg-zinc-900" />
            </div>
            
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-[#f97316] border-8 border-[#2e231f] flex items-center justify-center shadow-lg relative overflow-hidden">
              <div className="absolute inset-2 rounded-full border border-black/20" />
              <div className="w-12 h-12 rounded-full bg-[#2e231f] flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-black/60 shadow-md" />
              </div>
            </div>

            <div className="w-full flex justify-between items-center px-2">
              <div className="w-4 h-4 rounded-full bg-[#2e231f] border border-stone-400" />
              <span className="text-[7px] font-black uppercase tracking-widest text-stone-700">Madan Preaching</span>
              <div className="w-6 h-2 bg-[#000000] rounded" />
            </div>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 items-center pt-8 md:pt-0">
            
            <div className="flex flex-col items-start space-y-3">
              <blockquote className="text-stone-300 italic text-sm md:text-base leading-relaxed max-w-sm mt-[15%]">
                {t.archive.quote}
              </blockquote>
            </div>

            <div className="flex flex-col md:items-end space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-white/5 border border-white/10 text-[#f97316]"><Radio size={16} /></div>
                <div className="p-2 rounded-full bg-white/5 border border-white/10 text-[#f97316]"><Heart size={16} /></div>
                <div className="p-2 rounded-full bg-white/5 border border-white/10 text-[#f97316]"><Award size={16} /></div>
              </div>
              <p className="text-stone-400 text-xs md:text-sm font-medium leading-relaxed max-w-xs md:text-right">
                {t.archive.archivedSermons}
              </p>
            </div>

          </div>
        </div>
      </header>

      {/* 2. AUDIO PLAYERS SECTION */}
      <main className="max-w-5xl mx-auto px-6 mt-16 space-y-12 bg-[#000000]">
        <div className="text-center md:text-left">
          <span className="text-[11px] font-black text-[#f97316] uppercase tracking-[0.2em] font-mono">
            {t.archive.archiveLabel}
          </span>
          <h2 className="text-2xl md:text-3xl font-black mt-2 font-sans uppercase tracking-tight">
            {t.archive.recentSermons}
          </h2>
          <div className="w-12 h-1 bg-[#f97316] rounded-full mt-3 mx-auto md:mx-0" />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-white/5 border-t-[#f97316] animate-spin" />
            <p className="text-stone-400 text-xs font-bold uppercase tracking-wider">
              {t.archive.loading}
            </p>
          </div>
        ) : preachings.length === 0 ? (
          <div className="text-center py-24 bg-white/5 border border-dashed border-white/10 rounded-3xl p-6">
            <Music size={40} className="mx-auto text-stone-600 mb-4" />
            <h3 className="font-bold text-lg text-stone-300">{t.archive.noSermons}</h3>
            <p className="text-stone-500 text-xs mt-2">{t.archive.checkBack}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {preachings.slice(0, 4).map((track) => (
              <AudioPlayerCard 
                key={track.id} 
                track={track} 
                activeTrackId={activeTrackId} 
                setActiveTrackId={setActiveTrackId}
                t={t}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// Custom Audio Player component
function AudioPlayerCard({ 
  track, 
  activeTrackId, 
  setActiveTrackId,
  t
}: { 
  track: PreachingItem; 
  activeTrackId: string | null; 
  setActiveTrackId: (id: string | null) => void;
  t: any;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (activeTrackId !== track.id && isPlaying) {
      pauseTrack();
    }
  }, [activeTrackId]);

  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      playTrack();
    }
  };

  const playTrack = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      setActiveTrackId(track.id || null);
    }
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="bg-[#1b1411]/80 border border-white/10 rounded-[2rem] p-6 flex flex-col justify-between hover:border-[#f97316]/30 transition-all duration-300 relative group overflow-hidden">
      
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#f97316]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#f97316]/10 transition-colors" />

      <audio 
        ref={audioRef}
        src={track.audio_url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Top Details */}
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-black text-[#f97316] uppercase tracking-wider font-mono">
            {t.archive.audioLecture}
          </span>
          <h3 className="text-lg font-bold text-white group-hover:text-[#f97316] transition-colors line-clamp-1">{track.title}</h3>
          
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-400 font-medium">
            <span className="flex items-center gap-1">
              <User size={12} className="text-stone-500" /> {track.speaker}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} className="text-stone-500" /> {new Date(track.date_preached).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
        
        <button 
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-[#f97316] text-white flex items-center justify-center hover:bg-orange-600 shadow-lg shadow-orange-500/10 active:scale-95 transition-transform shrink-0"
        >
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
        </button>
      </div>

      {track.description && (
        <p className="text-stone-400 text-xs leading-relaxed mt-4 line-clamp-2">
          {track.description}
        </p>
      )}

      {/* Player Interface / Controls */}
      <div className="mt-6 space-y-2">
        <input 
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleScrub}
          className="w-full h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-[#f97316] transition-all"
        />

        <div className="flex justify-between items-center text-xs text-stone-500 font-mono">
          <span>{formatTime(currentTime)}</span>
          <div className="flex items-center gap-3">
            <button onClick={toggleMute} className="text-stone-400 hover:text-white transition-colors">
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <a 
              href={track.audio_url} 
              download
              target="_blank"
              rel="noreferrer"
              className="text-stone-400 hover:text-[#f97316] transition-colors"
              title={t.archive.download}
            >
              <Download size={14} />
            </a>
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

    </div>
  );
}