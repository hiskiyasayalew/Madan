"use client";

import React, { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

// 1. Create a sub-component for the individual cards to follow Hook rules
const ProgramCard = ({ item, index }: { item: any; index: number }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: item.alignment === "right" ? 100 : -100 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: item.alignment === "right" ? 100 : -100 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.15,
        ease: [0.25, 0.1, 0.25, 1] 
      }}
      className="flex-1 min-h-0 relative flex items-center"
    >
      {/* THE BACKGROUND CARD */}
      <div className={`absolute inset-0 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl ${item.color}`}>
        <img 
          src={item.image_url} 
          className="w-full h-full object-cover mix-blend-overlay opacity-50 grayscale"
          alt={item.day}
        />
        <div className={`absolute inset-0 ${item.color} opacity-40 mix-blend-multiply`} />
      </div>

      {/* WHITE TIME BADGE */}
      <div className={`absolute h-[70%] sm:h-[80%] w-7 sm:w-10 md:w-12 bg-white rounded-full flex items-center justify-center shadow-2xl z-20
        ${item.alignment === "left" ? "left-0 translate-x-1/2" : "right-0 -translate-x-1/2"}
      `}>
        <span className="text-black font-black text-[10px] sm:text-sm md:text-xl lg:text-2xl uppercase tracking-tighter [writing-mode:vertical-rl] rotate-180">
          {item.time}
        </span>
      </div>

      {/* DATE TAG */}
      <div className={`absolute bottom-3 md:bottom-6 z-20 ${
        item.alignment === "left" ? "right-3 md:right-6" : "left-3 md:left-6"
      }`}>
        <div className="bg-black/50 backdrop-blur-sm px-2 py-1 md:px-4 md:py-2 rounded-lg border border-white/20">
          <span className="text-white font-bold text-[9px] sm:text-xs md:text-sm lg:text-base tracking-wider">
            {item.event_date}
          </span>
        </div>
      </div>

      {/* TEXT CONTENT */}
      <div className={`relative z-10 w-full h-full flex items-center mx-[7%] px-8 sm:px-16 md:px-24 ${item.alignment === "left" ? "flex-row" : "flex-row-reverse"}`}>
        <div className={`flex flex-col max-w-[70%] sm:max-w-none ${item.alignment === "left" ? "text-left" : "text-right"}`}>
          <h3 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-black italic leading-none tracking-tighter">
            {item.day}
          </h3>
          <p className="text-[8px] sm:text-[10px] md:text-sm lg:text-lg font-bold uppercase tracking-widest mt-1 opacity-90 leading-tight">
            {item.title}
          </p>

           {item.description && (
    <p className="text-[7px] sm:text-[9px] md:text-xs lg:text-sm font-medium mt-2 opacity-80 max-w-md">
      {item.description}
    </p>)}
        </div>
      </div>
    </motion.div>
  );
};

const WeeklyProgram = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('frontend_cards')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(3); 
      
      if (fetchError) throw fetchError;
      setPrograms(data || []);
      setError(null);
    } catch (err: any) {
      console.error("WeeklyProgram: Error loading programs:", err);
      setError(err.message || "Failed to load programs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();

    // Setup Realtime Subscription to update on modifications instantly
    const channel = supabase
      .channel('weekly_program_cards_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'frontend_cards'
        },
        () => {
          loadPrograms();
        }
      )
      .subscribe();

    // Refetch when the user refocuses the browser tab
    const handleFocus = () => {
      loadPrograms();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return (
    <section className="h-screen w-full bg-[#0a0a0a] text-white overflow-hidden p-4 md:p-8 flex flex-col relative">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[70%] h-[50%] bg-orange-600/60 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-900/20 blur-[100px] rounded-full" />
      </div>

      {/* CARDS CONTAINER */}
      <div className="relative z-10 flex-1 flex flex-col gap-3 md:gap-6 max-w-6xl mx-auto w-full sm:w-[90%] md:w-[85%] lg:w-[75%] min-h-0 pb-4 mt-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-white/5 border-t-orange-500 animate-spin" />
            <span className="text-xs font-mono uppercase tracking-widest">Loading programs...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-red-400 gap-2 p-6 text-center border border-dashed border-red-500/20 rounded-3xl bg-red-950/5">
            <span className="text-sm font-bold">Failed to load weekly schedule</span>
            <span className="text-xs text-gray-500 max-w-md">{error}</span>
            <button 
              onClick={loadPrograms} 
              className="mt-3 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all"
            >
              Retry Connection
            </button>
          </div>
        ) : programs.length > 0 ? (
          programs.map((item, index) => (
            <ProgramCard key={item.id} item={item} index={index} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6 text-center border border-dashed border-white/10 rounded-3xl bg-white/5">
            <span className="text-sm font-bold">No Programs Scheduled</span>
            <span className="text-xs text-gray-600 mt-1 max-w-xs">Our upcoming schedule is clear. Check back soon!</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default WeeklyProgram;