"use client";

import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { signUpUser } from "@/lib/signup";
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../lib/translations';

// --- 1. TYPES & INTERFACES ---
export interface SignUpFormData {
  fullName: string;
  username: string;
  phone: string;
  city: string;
  subcity: string;
  woreda: string;
  gender: string;
  age: string;
  maritalStatus: string;
  previousChurch: string;
  email: string;
  password: string;
  confirmPassword?: string;
  baptismDate: string;   
  baptismPlace: string;
}

type FormKeys = keyof SignUpFormData;

// --- GLASSMORPHIC POPUP COMPONENT ---
const AlertPopup = ({ message, onClose, t }: { message: string; onClose: () => void; t: any }) => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
  >
    <motion.div 
      initial={{ scale: 0.9, opacity: 0, y: 20 }} 
      animate={{ scale: 1, opacity: 1, y: 0 }} 
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      className="bg-white/10 backdrop-blur-2xl p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center border border-white/20"
    >
      <div className="w-16 h-16 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-500/30">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-white font-bold text-lg mb-6 leading-tight">{message}</p>
      <button 
        onClick={onClose}
        className="w-full bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white font-bold py-3 rounded-full hover:brightness-110 transition-all shadow-lg shadow-orange-500/20"
      >
        {t.signup.dismiss || "Dismiss"}
      </button>
    </motion.div>
  </motion.div>
);

// --- SUCCESS POPUP COMPONENT ---
const SuccessPopup = ({ message, onClose, t }: { message: string; onClose: () => void; t: any }) => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
  >
    <motion.div 
      initial={{ scale: 0.9, opacity: 0, y: 20 }} 
      animate={{ scale: 1, opacity: 1, y: 0 }} 
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      className="bg-white/10 backdrop-blur-2xl p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center border border-white/20"
    >
      <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p className="text-white font-bold text-lg mb-6 leading-tight">{message}</p>
      <button 
        onClick={onClose}
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 rounded-full hover:brightness-110 transition-all shadow-lg shadow-emerald-500/20"
      >
        {t.signup.continueToLogin || "Continue to Login"}
      </button>
    </motion.div>
  </motion.div>
);

// --- 2. REUSABLE COMPONENTS ---
interface InputProps {
  placeholder: string;
  type?: string;
  icon?: React.ReactNode;
  delay?: number;
  value: string;
  name: FormKeys;
  onChange: (name: FormKeys, value: string) => void;
  required?: boolean;
}

const CustomInput: React.FC<InputProps> = ({ placeholder, type = "text", icon, delay = 0, value, name, onChange, required }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative w-full"
    >
      <div className={`relative transition-all duration-500 ${isFocused ? 'scale-[1.03]' : 'scale-100'}`}>
        <input
          type={type}
          value={value}
          placeholder={`${placeholder}${required ? ' *' : ''}`}
          onChange={(e) => onChange(name, e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-full px-4 py-2.5 sm:px-6 sm:py-3 text-white placeholder-white/60 font-medium text-xs sm:text-sm md:text-[15px] outline-none shadow-lg transition-all duration-300 hover:bg-white/15 focus:bg-white/20 focus:border-orange-400/50 focus:shadow-[0_0_20px_rgba(251,146,60,0.2)]"
        />
        {icon && <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/80 pointer-events-none">{icon}</div>}
      </div>
    </motion.div>
  );
};

const CustomSelect: React.FC<InputProps & { options: string[] }> = ({ placeholder, options, delay = 0, value, name, onChange, required }) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }} 
      className="relative w-full"
    >
      <div className={`relative transition-all duration-500 ${isFocused ? 'scale-[1.03]' : 'scale-100'}`}>
        <select
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          onFocus={() => setIsFocused(true)} 
          onBlur={() => setIsFocused(false)}
          className="w-full bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-full px-4 py-2.5 sm:px-6 sm:py-3 text-white font-medium text-xs sm:text-sm md:text-[15px] outline-none shadow-lg appearance-none cursor-pointer hover:bg-white/15 focus:border-orange-400/50"
        >
          <option value="" disabled hidden>{placeholder}{required ? ' *' : ''}</option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="text-black">{opt}</option>
          ))}
        </select>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/60">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

// --- 3. MAIN PAGE COMPONENT ---
export default function SignUp() {
  const { language } = useLanguage();
  const t = translations[language];
  
  const router = useRouter();
  const [hoveredLogo, setHoveredLogo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ show: boolean; msg: string; type: 'error' | 'success' }>({ show: false, msg: "", type: 'error' });

  const [form, setForm] = useState<SignUpFormData>({
    fullName: "", username: "", phone: "", city: "", subcity: "", woreda: "", gender: "",
    age: "", maritalStatus: "", previousChurch: "",
    email: "", password: "", confirmPassword: "", baptismDate: "",
    baptismPlace: "",
  });

  const handleUpdate = (name: FormKeys, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const triggerAlert = (msg: string, type: 'error' | 'success' = 'error') => {
    setAlert({ show: true, msg, type });
  };

  const validateForm = () => {
    const requiredFields: FormKeys[] = [
      'fullName', 'username', 'phone', 'city', 'subcity', 'woreda', 'gender', 'age', 
      'maritalStatus', 'email', 'password', 'confirmPassword'
    ];
    
    const fieldLabels: Record<FormKeys, string> = {
      fullName: t.signup.fullName,
      username: t.signup.username,
      phone: t.signup.phone,
      city: t.signup.city,
      subcity: t.signup.subcity,
      woreda: t.signup.woreda,
      gender: t.signup.gender,
      age: t.signup.age,
      maritalStatus: t.signup.maritalStatus,
      previousChurch: t.signup.previousChurch,
      email: t.signup.email,
      password: t.signup.password,
      confirmPassword: t.signup.confirmPassword,
      baptismDate: t.signup.baptismDate,
      baptismPlace: t.signup.baptismPlace,
    };
    
    for (const key of requiredFields) {
      if (!form[key]?.trim()) {
        triggerAlert(t.signup.requiredField.replace('{{field}}', fieldLabels[key]));
        return false;
      }
    }

    if (form.password !== form.confirmPassword) {
      triggerAlert(t.signup.passwordMismatch);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const { confirmPassword, ...payload } = form;
      await signUpUser(payload);
      // Show success message
      triggerAlert(t.signup.successMessage, 'success');
    } catch (error) {
      triggerAlert(t.signup.submissionFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setAlert({ show: false, msg: "", type: 'error' });
    // Redirect to login page after successful submission
    router.push('/login');
  };

  const handleErrorClose = () => {
    setAlert({ show: false, msg: "", type: 'error' });
  };

  // Get translated options based on language
  const getCityOptions = () => {
    if (language === 'am') {
      return ["አዲስ አበባ"];
    }
    return ["Addis Ababa"];
  };

  const getSubcityOptions = () => {
    if (language === 'am') {
      return [
        "አዲስ ከተማ",
        "አቃቂ ቃሊቲ",
        "አራዳ",
        "ቦሌ",
        "ጉለሌ",
        "ቂርቆስ",
        "ኮልፌ ቀራኒዮ",
        "ልደታ",
        "ንፋስ ስልክ ላፍቶ",
        "የካ",
        "ለሚ ኩራ",
      ];
    }
    return [
      "Addis Ketema",
      "Akaki Kaliti",
      "Arada",
      "Bole",
      "Gullele",
      "Kirkos",
      "Kolfe Keranio",
      "Lideta",
      "Nifas Silk-Lafto",
      "Yeka",
      "Lemi Kura",
    ];
  };

  const getGenderOptions = () => {
    if (language === 'am') {
      return [t.signup.male, t.signup.female];
    }
    return ["Male", "Female"];
  };

  const getMaritalStatusOptions = () => {
    if (language === 'am') {
      return [t.signup.single, t.signup.married, t.signup.divorced, t.signup.widowed];
    }
    return ["Single", "Married", "Divorced", "Widowed"];
  };

  const getBaptismPlaceOptions = () => {
    if (language === 'am') {
      return [t.signup.madan, t.signup.other];
    }
    return ["Madan", "Other"];
  };

  return (
    <>
      <Head><title>{t.signup.title}</title></Head>

      <AnimatePresence>
        {alert.show && (
          alert.type === 'success' ? (
            <SuccessPopup message={alert.msg} onClose={handleSuccessClose} t={t} />
          ) : (
            <AlertPopup message={alert.msg} onClose={handleErrorClose} t={t} />
          )
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className="min-h-screen lg:h-screen w-full flex items-center justify-center p-4 md:p-8 relative bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/SignUpBg.jpg')" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-[1200px] my-24 bg-white/10 backdrop-blur-md h-auto mt-[30%] sm:mt-[12%] rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-2xl z-10 border border-white/20"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-4 mt-[3%] gap-4">
            <h1 className="text-white text-2xl md:text-4xl font-normal tracking-tight drop-shadow-xl text-center md:text-left">
              {t.signup.title}
            </h1>
          </div>

          {/* Form Grid */}
          <form className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-3">
            <div className="space-y-2">
              <CustomInput name="fullName" value={form.fullName} onChange={handleUpdate} placeholder={t.signup.fullName} required delay={0.1} />
              <CustomInput name="username" value={form.username} onChange={handleUpdate} placeholder={t.signup.username} required delay={0.15} />
              <CustomInput name="phone" value={form.phone} onChange={handleUpdate} placeholder={t.signup.phone} required delay={0.2} />
              {/* New Address Fields */}
              <div className="grid grid-cols-3 gap-2">
                <CustomSelect name="city" value={form.city} onChange={handleUpdate} placeholder={t.signup.city} required delay={0.25} options={getCityOptions()} />
                <CustomSelect name="subcity" value={form.subcity} onChange={handleUpdate} placeholder={t.signup.subcity} required delay={0.3} options={getSubcityOptions()} />
                <CustomInput name="woreda" value={form.woreda} onChange={handleUpdate} placeholder={t.signup.woreda} required delay={0.35} />
              </div>
              <div className="flex gap-4">
                <CustomSelect name="gender" value={form.gender} onChange={handleUpdate} placeholder={t.signup.gender} options={getGenderOptions()} required delay={0.4} />
                <CustomInput name="age" value={form.age} onChange={handleUpdate} placeholder={t.signup.age} type="number" delay={0.5} />
              </div>
              <CustomInput 
                name="baptismDate" 
                value={form.baptismDate} 
                onChange={handleUpdate} 
                placeholder={t.signup.baptismDate}
                type="text" 
                delay={1.1} 
              />
              <CustomSelect 
                name="baptismPlace" 
                value={form.baptismPlace} 
                onChange={handleUpdate} 
                placeholder={t.signup.baptismPlace}
                options={getBaptismPlaceOptions()} 
                delay={1.2} 
              />
            </div>

            <div className="space-y-3">
              <CustomSelect name="maritalStatus" value={form.maritalStatus} onChange={handleUpdate} placeholder={t.signup.maritalStatus} options={getMaritalStatusOptions()} required delay={0.6} />
              <CustomInput name="previousChurch" value={form.previousChurch} onChange={handleUpdate} placeholder={t.signup.previousChurch} delay={0.7} />
              <CustomInput name="email" value={form.email} onChange={handleUpdate} placeholder={t.signup.email} type="email" required delay={0.8} />
              <CustomInput name="password" value={form.password} onChange={handleUpdate} placeholder={t.signup.password} type="password" required delay={0.9} />
              <CustomInput name="confirmPassword" value={form.confirmPassword || ""} onChange={handleUpdate} placeholder={t.signup.confirmPassword} type="password" required delay={1.0} />
            </div>
          </form>

          <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
            <p className="text-white/80 text-xs md:text-sm text-left max-w-[350px] leading-relaxed">
              <span className="text-orange-400 font-bold">{t.signup.note}</span> {t.signup.noteText}
            </p>
            <div className="flex flex-col md:flex-row gap-4">
            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full md:w-auto bg-orange-500 text-white font-bold py-3 px-10 rounded-full shadow-2xl transition-all ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? t.signup.processing : t.signup.submit}
            </motion.button>

            <motion.a
              href="/login"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full md:w-auto bg-orange-500 text-white font-bold py-3 px-10 rounded-full text-center shadow-2xl transition-all"
            >
              {t.signup.backToLogin}
            </motion.a>
          </div>
          </div>
          
        </motion.div>
      </motion.div>
    </>
  );
}