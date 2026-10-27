"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../lib/translations";

export default function FooterSection() {
  const [imageError, setImageError] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];
  
  // Form state
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setSubmitStatus("error");
      setErrorMessage("Please enter your email address");
      setTimeout(() => setSubmitStatus("idle"), 3000);
      return;
    }

    if (!message.trim()) {
      setSubmitStatus("error");
      setErrorMessage("Please enter your message");
      setTimeout(() => setSubmitStatus("idle"), 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Using an API endpoint that you'll need to create
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          message: message,
          subject: "Footer Contact Form Submission",
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setEmail("");
        setMessage("");
        setTimeout(() => setSubmitStatus("idle"), 3000);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setSubmitStatus("error");
      setErrorMessage("Failed to send message. Please try again later.");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative w-full h-screen h-[100dvh] text-white flex flex-col justify-between overflow-hidden sticky top-0 px-6 md:px-20 py-8 md:py-16 landscape:py-4">
      
      {/* BACKGROUND IMAGE - FULL SCREEN on ALL devices */}
      <div className="absolute inset-0 z-0">
        {!imageError ? (
          <Image
            src="/Footer.jpg"
            alt="Footer background"
            fill
            className="object-cover object-right"
            priority
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-black" />
        )}
      </div>
      
      {/* HERO TEXT - Using clamp for responsive sizing */}
      <div className="relative z-10 mt-2 md:mt-10 landscape:mt-0">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex flex-col"
        >
          <h1 className="text-[clamp(3.5rem,15vw,14rem)] font leading-[0.8] tracking-tighter text-white">
            Madan
          </h1>
          <p className="text-[clamp(0.6rem,1vw,0.875rem)] tracking-[0.4em] uppercase text-amber-500/60 mt-2 md:mt-4 ml-5">
            Thy Kingdom Come
          </p>
        </motion.div>
      </div>

      {/* FOOTER CONTENT GRID - landscape optimized */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-y-6 md:gap-y-10 gap-x-4 md:gap-12 mt-auto landscape:gap-y-2">
        
        {/* Address */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-0.5 md:space-y-1 text-[10px] md:text-base font-light tracking-tight text-zinc-400"
        >
          <p className="uppercase text-[9px] md:text-[10px] tracking-[0.3em] text-zinc-500 mb-1 md:mb-2">Sanctuary</p>
          <p className="text-zinc-200">Addis Ababa</p>
          <p className="hidden xs:block">Dejazmach-Beyene-Merid St.</p>
          <p>05 - 42, Ethiopia</p>
        </motion.div>

        {/* Socials */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] md:text-sm text-zinc-400"
        >
          <div className="space-y-0.5 md:space-y-1">
            <p className="uppercase text-[9px] md:text-[10px] tracking-[0.3em] text-zinc-500 mb-1 md:mb-2">Connect</p>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 md:flex-col md:gap-0">
                <p className="hover:text-amber-500 cursor-pointer transition-all">Instagram</p>
                <p className="hover:text-amber-500 cursor-pointer transition-all">YouTube</p>
                <p className="hover:text-amber-500 cursor-pointer transition-all">Tiktok</p>
                <p className="text-zinc-300 md:mt-1">Madan@gmail.com</p>
            </div>
          </div>
        </motion.div>

        {/* Contact Form - Replaces Newsletter */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="col-span-2 md:col-span-1 flex flex-col justify-end landscape:col-span-1 mb-[8%]"
        >
          <p className="uppercase text-[9px] md:text-[10px] tracking-[0.3em] text-zinc-500 mb-2 md:mb-3">Contact Us</p>
          
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full bg-transparent border-b border-white/30 py-1.5 md:py-2 text-xs md:text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/50 transition-colors"
                disabled={isSubmitting}
              />
            </div>

            {/* Message Input */}
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your message..."
                rows={2}
                className="w-full bg-transparent border-b border-white/30 py-1.5 md:py-2 text-xs md:text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/50 transition-colors resize-none"
                disabled={isSubmitting}
              />
            </div>

            {/* Submit Button with Status */}
            <div className="relative flex items-center justify-between gap-2">
              <motion.button
                type="submit"
                whileHover={{ x: 5 }}
                disabled={isSubmitting}
                className="flex items-center gap-2 text-amber-500/80 hover:text-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
              </motion.button>

              {/* Status Indicators */}
              {submitStatus === "success" && (
                <div className="flex items-center gap-1 text-emerald-500">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="text-[9px] md:text-[10px]">Sent!</span>
                </div>
              )}
              
              {submitStatus === "error" && (
                <div className="flex items-center gap-1 text-red-500">
                  <XCircle className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="text-[9px] md:text-[10px]">{errorMessage || "Error"}</span>
                </div>
              )}
            </div>
          </form>
        </motion.div>
      </div>

      {/* BOTTOM BAR */}
      <motion.div
        className="relative z-10 flex flex-row justify-between items-center pt-4 md:pt-8 text-[7px] md:text-[9px] uppercase tracking-[0.3em] md:tracking-[0.5em] text-zinc-600 landscape:pt-2"
      >
        <p>2026 Madan</p>
      </motion.div>
    </footer>
  );
}