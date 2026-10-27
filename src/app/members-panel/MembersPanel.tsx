"use client";

import React, { useState, useEffect, useRef } from 'react';
import { getMyProfile, updateMyProfile } from '@/lib/memberActions';
import { sendMessage, getMessages } from '@/lib/messageActions';
import { getEvents, createEvent, updateEvent, deleteEvent } from '@/lib/eventActions';
import { uploadNewsImage } from '@/lib/adminActions';
import { EthDateTime } from "ethiopian-calendar-date-converter";
import { useRouter } from 'next/navigation';
import {  
  getLatestSummary, updateServiceSummary, 
  getFrontendCards, upsertFrontendCard, deleteFrontendCard, 
  deleteServiceSummary,
  getReservations, updateReservationStatus 
} from '@/lib/adminActions'; 
import { 
  getNewsItems, 
  createNewsItem, 
  updateNewsItem, 
  deleteNewsItem 
} from '@/lib/newsActions';
import { 
  getArchiveItems, 
  createArchiveItem, 
  deleteArchiveItem, 
  getRecordingCount 
} from '@/lib/archiveActions';

import { supabase } from '@/lib/supabaseClient';

import { 
  Plus, Clock, X, Trash2, Edit2, Save, Image as ImageIcon, 
  Layout, ShieldAlert, Check, Ban, Eye, Home, 
  BookOpen, LogOut, ChevronLeft, ChevronRight, Calendar as CalendarIcon,
  User, MapPin, Tag, Smartphone, Award, DollarSign, ArrowUpRight, TrendingUp,
  Music, Upload, Loader2
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../app/context/LanguageContext';
import { translations } from '../../app/lib/translations';

const SERVICE_COLORS: any = {
  'Prayer': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', hex: '#10b981' },
  'Youth': { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20', hex: '#ec4899' },
  'Worship & Stage': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', hex: '#ef4444' },
  'Kids': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', hex: '#f59e0b' },
  'Special Event': { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20', hex: '#6366f1' },
  'Evangelism': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', hex: '#3b82f6' },
  'Decon & Social service': { bg: 'bg-rose-950/20', text: 'text-rose-300', border: 'border-rose-900/30', hex: '#9f1239' },
};

// Background Image Mapping per Tab
const BACKGROUND_IMAGES = {
  calendar: '/ServicesPageYouth.jpg',
  church: '/center-mission1-phone.jpg',
  messages: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=2000',
  profileInfo: 'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?auto=format&fit=crop&q=80&w=2000'
};

const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WEEKDAYS_EN = ["S", "M", "T", "W", "T", "F", "S"];

// --- DAY EVENTS POPUP MODAL ---
// --- DAY EVENTS POPUP MODAL ---
const DayEventsPopupModal = ({ isOpen, date, events, isServiceLead, isBlocked, userData, isEthiopianCalendar, onClose, onAddEvent, onEditEvent }: any) => {
  const { language } = useLanguage();
  
  // Compute event roles from userData
  const eventRoles = userData?.assigned_service?.filter(
    (s: string) => !['Finance Manager','Frontend Manager','Guest House manager'].includes(s)
  ) || [];
  
  if (!isOpen) return null;
  
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    if (isEthiopianCalendar) {
      const eth = EthDateTime.fromEuropeanDate(d);
      const ethMonths = ["መስከረም", "ጥቅምት", "ኅዳር", "ታኅሣሥ", "ጥር", "የካቲት", "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ"];
      const ethWeekdays = ["እሑድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"];
      const monthName = ethMonths[eth.month - 1];
      const dayName = ethWeekdays[eth.getDay()];
      return `${dayName}, ${monthName} ${eth.date}, ${eth.year}`;
    }
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose} 
        className="absolute inset-0 bg-black/75 backdrop-blur-md" 
      />
      <motion.div 
        initial={{ scale: 0.95, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 15, opacity: 0 }}
        className="relative bg-zinc-950/95 border border-white/10 p-6 md:p-8 rounded-[2.5rem] w-full max-w-lg shadow-[0_24px_50px_rgba(0,0,0,0.8)] z-10 max-h-[85vh] flex flex-col"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
              {language === 'am' ? 'የፕሮግራም ዝርዝሮች' : 'Schedule Details'}
            </span>
            <h3 className="text-xl font-black text-white tracking-tight font-display mt-0.5">
              {formatDate(date)}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {events.length > 0 ? (
            events.map((ev: any) => {
              const colorObj = SERVICE_COLORS[ev.service_type] || { bg: 'bg-white/5', text: 'text-slate-300', border: 'border-white/10', hex: '#ffffff' };
              const isOwner = ev.created_by === userData?.id;

              return (
                <div 
                  key={ev.id} 
                  className="p-4 rounded-2xl border bg-zinc-900/30 backdrop-blur-md relative group overflow-hidden transition-all duration-300 hover:border-white/20"
                  style={{ borderLeft: `4px solid ${colorObj.hex}` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/5" style={{ color: colorObj.hex }}>
                      {ev.service_type}
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                      <Clock size={12} className="text-[#f97316]" />
                      <span>{ev.start_time} - {ev.end_time}</span>
                    </div>
                  </div>

                  <h4 className="font-bold text-white text-sm leading-snug">{ev.title}</h4>
                  {ev.description && (
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {ev.description}
                    </p>
                  )}

                  {ev.audience_type === 'Full' && (
                    <div className="mt-3 flex items-center gap-1.5 text-[9px] font-black uppercase text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded-lg">
                      <ShieldAlert size={12} />
                      <span>{language === 'am' ? 'ሙሉ ቀን (ሌላ ፕሮግራም አይፈቀድም)' : 'Exclusive Day (No Shared Scheduling)'}</span>
                    </div>
                  )}

                  {isOwner && isServiceLead && (
                    <div className="mt-3 flex justify-end">
                      <button 
                        type="button"
                        onClick={() => onEditEvent(ev)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-[#f97316] rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all shadow-md"
                      >
                        <Edit2 size={12} />
                        <span>{language === 'am' ? 'አርትዕ' : 'Edit Event'}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white/5 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-6">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mb-4 text-slate-500">
                <CalendarIcon size={20} />
              </div>
              <p className="text-xs font-black text-slate-300 uppercase tracking-widest">
                {language === 'am' ? 'ምንም ፕሮግራም የለም' : 'No Events'}
              </p>
              <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed text-center max-w-[220px]">
                {language === 'am' ? 'ለዚህ ቀን ምንም የታቀዱ ተግባራት የሉም።' : 'This date has no scheduled activities yet.'}
              </p>
            </div>
          )}
        </div>

        {isServiceLead && !isBlocked && (
          <button 
            type="button"
            onClick={onAddEvent}
            disabled={eventRoles.length === 0}
            className="w-full py-4 bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:brightness-110 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-orange-500/15 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
            <span>{language === 'am' ? 'አዲስ ፕሮግራም ይመዝገቡ' : 'Book New Event'}</span>
          </button>
        )}

        {isBlocked && (
          <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400">
            <ShieldAlert size={18} className="shrink-0 text-rose-400" />
            <div className="flex flex-col">
              <span className="font-black text-xs uppercase tracking-tight text-left">
                {language === 'am' ? 'ሙሉ ቀን ተይዟል' : 'Full Audience Booked'}
              </span>
              <p className="text-[10px] font-medium leading-tight text-rose-300/80 mt-0.5 text-left">
                {language === 'am' ? 'ለዚህ ቀን ሌላ ፕሮግራም መመዝገብ አይቻልም።' : 'No additional scheduling allowed for this date.'}
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// --- GUEST HOUSE DETAIL MODAL ---
const ReservationDetailModal = ({ isOpen, reservation, onClose, onUpdate, updateLoading }: any) => {
  const { language } = useLanguage();
  
  if (!isOpen || !reservation) return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose} 
        className="absolute inset-0 bg-black/70 backdrop-blur-md" 
      />
      <motion.div 
        initial={{ scale: 0.95, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 15, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative bg-zinc-950/80 backdrop-blur-3xl border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-[0_24px_50px_rgba(0,0,0,0.8)] z-10"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight font-display">
              {language === 'am' ? 'የቆይታ ጥያቄ ግምገማ' : 'Stay Request Review'}
            </h2>
            <button type="button" onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"><X size={20} /></button>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{language === 'am' ? 'የእንግዳ ስም' : 'Guest Name'}</p><p className="font-bold text-white text-base">{reservation.full_name}</p></div>
              <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p><p className="font-bold text-white text-sm">{reservation.email}</p></div>
              <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{language === 'am' ? 'ፓኬጅ' : 'Package'}</p><p className="font-black text-[#f97316] uppercase text-sm">{reservation.package_id}</p></div>
              <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{language === 'am' ? 'እንግዶች / መኪናዎች' : 'Guests / Cars'}</p><p className="font-bold text-white text-sm">{reservation.guests} {language === 'am' ? 'ሰዎች' : 'People'} / {reservation.cars} {language === 'am' ? 'መኪናዎች' : 'Cars'}</p></div>
            </div>
            <div className="space-y-4">
              <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{language === 'am' ? 'የመምጫ ቀን' : 'Arrival Date'}</p><p className="font-bold text-white text-sm">{reservation.arrival_date}</p></div>
              <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{language === 'am' ? 'የመውጫ ቀን' : 'Check-out Date'}</p><p className="font-bold text-white text-sm">{reservation.checkout_date}</p></div>
              <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{language === 'am' ? 'የክፍያ ዘዴ' : 'Payment Method'}</p><p className="font-bold text-white text-sm">{reservation.payment_method}</p></div>
              <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</p><p className="font-bold text-white text-sm">{reservation.phone}</p></div>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{language === 'am' ? 'የክፍያ ደረሰኝ ምስል' : 'Payment Receipt Image'}</p>
            {reservation.receipt_url ? (
              <a href={reservation.receipt_url} target="_blank" rel="noreferrer" className="block relative group rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                <img src={reservation.receipt_url} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" alt="Receipt" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="bg-white text-black px-4 py-2 rounded-lg font-bold text-xs shadow-lg">{language === 'am' ? 'ሙሉ ደረሰኝ ይመልከቱ' : 'View Full Receipt'}</span>
                </div>
              </a>
            ) : (
              <div className="p-10 bg-white/5 rounded-2xl text-center text-slate-400 italic text-sm border-2 border-dashed border-white/10">
                {language === 'am' ? 'ምንም ምስል አልተሰጠም (በጥሬ ገንዘብ)' : 'No image provided (Cash Payment)'}
              </div>
            )}
          </div>

          <div className="flex gap-4">
             <button 
                type="button"
                disabled={updateLoading}
                onClick={() => onUpdate(reservation.id, 'rejected')} 
                className="flex-1 py-4 bg-red-950/30 text-red-400 border border-red-500/20 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-600 hover:text-white disabled:opacity-50 transition-all"
             >
               {language === 'am' ? 'ውድቅ አድርግ' : 'Reject Reservation'}
             </button>
             <button 
                type="button"
                disabled={updateLoading}
                onClick={() => onUpdate(reservation.id, 'approved')} 
                className="flex-1 py-4 bg-[#f97316] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 disabled:opacity-50 shadow-xl shadow-orange-500/20 transition-all"
             >
               {language === 'am' ? 'ፈቅድ' : 'Approve Stay'}
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- SUB-ADMIN EVENT MODAL ---
const SubAdminEventModal = ({ isOpen, mode, formData, onClose, onInputChange, onSave, onDelete,availableServiceTypes }: any) => {
  const { language } = useLanguage();
  
  if (!isOpen) return null;

   const serviceOptions = availableServiceTypes && availableServiceTypes.length > 0
    ? availableServiceTypes
    : Object.keys(SERVICE_COLORS);
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose} 
        className="absolute inset-0 bg-black/70 backdrop-blur-md" 
      />
      <motion.div 
        initial={{ scale: 0.95, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 15, opacity: 0 }}
        className="relative bg-zinc-950/80 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] w-full max-w-md shadow-[0_24px_50px_rgba(0,0,0,0.8)] z-10"
      >
        <h2 className="text-2xl font-black mb-6 text-white tracking-tight font-display">
          {mode === 'create' ? (language === 'am' ? 'ፕሮግራም ይመዝገቡ' : 'Schedule Event') : (language === 'am' ? 'ፕሮግራም ያርትዑ' : 'Modify Event')}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{language === 'am' ? 'ርዕስ' : 'Title'}</label>
            <input className="w-full bg-white/5 border border-white/10 focus:border-[#f97316] rounded-xl px-4 py-3 outline-none text-white focus:ring-1 focus:ring-[#f97316] transition-all text-sm font-medium" value={formData.title} onChange={e => onInputChange('title', e.target.value)} />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{language === 'am' ? 'መግለጫ' : 'Description'}</label>
            <textarea className="w-full bg-white/5 border border-white/10 focus:border-[#f97316] rounded-xl px-4 py-3 outline-none text-white focus:ring-1 focus:ring-[#f97316] transition-all text-sm font-medium" rows={2} value={formData.description} onChange={e => onInputChange('description', e.target.value)} />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{language === 'am' ? 'የታዳሚ አይነት' : 'Audience Type'}</label>
            <select 
              className="w-full bg-zinc-900 border border-white/10 focus:border-[#f97316] rounded-xl px-4 py-3 outline-none text-white font-bold focus:ring-1 focus:ring-[#f97316] transition-all text-sm"
              value={formData.audience_type}
              onChange={e => onInputChange('audience_type', e.target.value)}
            >
              <option value="Partial">{language === 'am' ? 'ከፊል ታዳሚ (ቀን መጋራት)' : 'Partial Audience (Shared Day)'}</option>
              <option value="Full">{language === 'am' ? 'ሙሉ ታዳሚ (ልዩ ቀን)' : 'Full Audience (Exclusive Day)'}</option>
            </select>
          </div>
           <div className="space-y-4">
      {/* ... other fields ... */}

      {/* Replace the existing category select with this */}
      
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
          {language === 'am' ? 'ምድብ' : 'Category'}
        </label>
        <select
          className="w-full bg-zinc-900 border border-white/10 focus:border-[#f97316] rounded-xl px-4 py-3 outline-none text-white font-bold focus:ring-1 focus:ring-[#f97316] transition-all text-sm"
          value={formData.service_type}
          onChange={(e) => onInputChange('service_type', e.target.value)}
        >
          {serviceOptions.map((type: string) => (
            <option key={type} value={type} className="bg-zinc-900">
              {type}
            </option>
          ))}
        </select>
        {serviceOptions.length === 0 && (
          <p className="text-xs text-red-400 mt-1">
            {language === 'am' ? 'ምንም የአገልግሎት ሚና አልተመደበም' : 'No service role assigned'}
          </p>
        )}
      </div>

          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{language === 'am' ? 'ጀምር' : 'Starts'}</label><input type="time" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]" value={formData.start_time} onChange={e => onInputChange('start_time', e.target.value)} /></div>
            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{language === 'am' ? 'አብቅቅ' : 'Ends'}</label><input type="time" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]" value={formData.end_time} onChange={e => onInputChange('end_time', e.target.value)} /></div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-between items-center">
          {mode === 'edit' ? (
            <button type="button" onClick={() => onDelete(formData.id)} className="text-red-400 hover:bg-red-500/10 p-3 rounded-xl transition-colors">
              <Trash2 size={18} />
            </button>
          ) : <div />}
          <div className="flex space-x-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 font-bold text-slate-400 text-sm hover:text-white transition-colors">{language === 'am' ? 'ተው' : 'Cancel'}</button>
            <button type="button" onClick={onSave} className="px-6 py-2.5 bg-[#f97316] hover:bg-orange-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 transition-transform active:scale-95">{language === 'am' ? 'አስቀምጥ' : 'Save Event'}</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- APP PAGE MAIN COMPONENT ---
export default function App() {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [activeTab, setActiveTab] = useState<'calendar' | 'church' | 'messages' | 'profileInfo'>('calendar');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  

  const [userData, setUserData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [eventForm, setEventForm] = useState({ id: "", title: "", description: "", event_date: "", start_time: "09:00", end_time: "11:00", service_type: "", audience_type: "Partial"});
  const [updateLoading, setUpdateLoading] = useState(false);
  const router = useRouter();

  // Custom Calendar Navigation Date
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(new Date(2026, 5, 24));

  // Custom Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isOpen: boolean } | null>(null);

  useEffect(() => {
    if (toast?.isOpen) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showAlert = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type, isOpen: true });
  };

  useEffect(() => {
    if (toast?.isOpen) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Management States
  const [summaryData, setSummaryData] = useState({ id: null, summary_text: '', total_offering: 0, total_alms: 0 ,service_date: new Date().toISOString().split('T')[0]});
  const [frontendCards, setFrontendCards] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [isResModalOpen, setIsResModalOpen] = useState(false);
  const [cardForm, setCardForm] = useState({ id: null, title: '', description: '', day: '', time: '', event_date: '', image_url: '', color: 'bg-[#2589ce]', alignment: 'right', is_featured: false });

  // Permissions logic
const isFinanceManager = userData?.assigned_service?.includes('Finance Manager') ?? false;
const isFrontendManager = userData?.assigned_service?.includes('Frontend Manager') ?? false;
const isGuestHouseManager = userData?.assigned_service?.includes('Guest House manager') ?? false;

const eventRoles = userData?.assigned_service?.filter((s: string) => !['Finance Manager','Frontend Manager','Guest House manager'].includes(s)) || [];
const hasEventRole = eventRoles.length > 0;
const isServiceLead = userData?.role === 'sub-admin' && hasEventRole;

const [managementTab, setManagementTab] = useState<'finance' | 'frontend' | 'guesthouse'>('finance');
const systemRoles = ['Finance Manager', 'Frontend Manager', 'Guest House manager'];



  
  // States for News Management
  const [newsList, setNewsList] = useState<any[]>([]);
  const [managerTab, setManagerTab] = useState<'cards' | 'news' | 'audio'>('cards');

  const [newsForm, setNewsForm] = useState({ id: null as string | null, title: '', content: '', image_url: '' });

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventModalMode, setEventModalMode] = useState<'create' | 'edit'>('create');

  const ETH_MONTHS = [
    "መስከረም", "ጥቅምት", "ኅዳር", "ታኅሣሥ", "ጥር", "የካቲት", "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ"
  ];
  const WEEKDAYS_ET = [
    "እሑድ", "ሰኞ", "ማክ", "ረቡ", "ሐሙ", "ዓር", "ቅዳ"
  ];
  
  // State for Day Events Popup
  const [isDayEventsPopupOpen, setIsDayEventsPopupOpen] = useState(false);
  const [isEthiopianCalendar, setIsEthiopianCalendar] = useState(true);
  const [audioFiles, setAudioFiles] = useState<any[]>([]);
  const [audioCount, setAudioCount] = useState(0);
  const [audioForm, setAudioForm] = useState({
    id: null as string | null,
    title: '',
    speaker: '',
    description: '',
    audio_url: '',
    date_preached: ''
  });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUploading, setAudioUploading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);

  const loadUserMessages = async () => {
  try {
    // For members, we only show their own messages as confirmation
    // Actually, members can't see all messages, only admins can
    // So we don't need to load messages for members
  } catch (error) {
    console.error('Error loading messages:', error);
  }
};

const handleSendMessage = async () => {
  if (!messageSubject.trim() || !messageContent.trim()) {
    showAlert(language === 'am' ? 'እባክዎ ርዕስ እና መልዕክት ያስገቡ' : 'Please enter both subject and message', 'error');
    return;
  }

  setIsSendingMessage(true);
  try {
    const result = await sendMessage(userData.id, messageSubject, messageContent);
    
    if (result.success) {
      showAlert(language === 'am' ? 'መልዕክት በተሳካ ሁኔታ ተላከ' : 'Message sent successfully', 'success');
      setMessageSubject('');
      setMessageContent('');
    } else {
      showAlert(language === 'am' ? 'መልዕክት መላክ አልተሳካም' : 'Failed to send message', 'error');
    }
  } catch (error) {
    showAlert(language === 'am' ? 'ስህተት ተከስቷል' : 'An error occurred', 'error');
  } finally {
    setIsSendingMessage(false);
  }
};

  // Securely load dynamic profiles from Supabase Server session
  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserData(profile);
          setEditForm({ ...profile });
        } else {
          showAlert(language === 'am' ? 'መገለጫ ማግኘት አልተቻለም። እባክዎ ይግቡ።' : 'Failed to load profile. Please sign in.', "error");
          router.push('/login');
          return;
        }
      } else {
        router.push('/login');
        return;
      }
      
      try {
        const eventsData = await getEvents();
        setEvents(eventsData || []);
      } catch (e) {
        console.error("Error fetching events:", e);
      }

      try {
        const latestSum = await getLatestSummary();
        if (latestSum) setSummaryData(latestSum);
      } catch (e) {
        console.error("Error fetching summary:", e);
      }

      try {
        const cards = await getFrontendCards();
        setFrontendCards(cards || []);
      } catch (e) {
        console.error("Error fetching cards:", e);
      }
      try {
        const newsData = await getNewsItems();
        setNewsList(newsData || []);
      } catch (e) {
        console.error("Error fetching news updates:", e);
      }

      if (user) {
        const { data: currentProfile } = await supabase
          .from('users')
          .select('assigned_service')
          .eq('id', user.id)
          .single();
          
        if (currentProfile?.assigned_service === 'Guest House manager') {
            try {
              const resData = await getReservations();
              setReservations(resData || []);
            } catch (e) {
              console.error("Error fetching reservations:", e);
            }
        }
      }

    } catch (err) { 
      console.error("General load error:", err); 
    } finally { 
      setLoading(false); 
    }
  };
  
  function getEthiopianDate(date: Date) {
    const eth = EthDateTime.fromEuropeanDate(date);
    return {
      year: eth.year,
      month: ETH_MONTHS[eth.month - 1],
      day: eth.date,
    };
  }

  useEffect(() => { loadData(); }, []);

  // Client-side inactivity session checker
  useEffect(() => {
    if (!userData) return;

    const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes in ms
    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleLogout();
      }, INACTIVITY_LIMIT);
    };

    const clientActivityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

    clientActivityEvents.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      clientActivityEvents.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [userData]);

  // --- ACTIONS ---
  const handleUpdateReservation = async (id: string, status: 'approved' | 'rejected') => {
    try {
        setUpdateLoading(true);
        await updateReservationStatus(id, status);
        const res = await getReservations();
        setReservations(res || []);
        setIsResModalOpen(false);
        showAlert(language === 'am' ? `የቆይታ ጥያቄ በተሳካ ሁኔታ ${status === 'approved' ? 'ተፈቅዷል' : 'ውድቅ ተደርጓል'}` : `Reservation ${status} successfully.`, "success");
    } catch (e) {
        showAlert(language === 'am' ? 'ድርጊቱ አልተሳካም።' : 'Action failed.', "error");
    } finally {
        setUpdateLoading(false);
    }
  };

  const handleSaveSummary = async () => {
    try {
      setUpdateLoading(true);
      
      const payload: any = {
        summary_text: summaryData.summary_text,
        total_offering: summaryData.total_offering,
        total_alms: summaryData.total_alms,
        service_date: summaryData.service_date || new Date().toISOString(),
      };

      if (summaryData.id) {
        payload.id = summaryData.id;
      }

      const result = await updateServiceSummary(payload);
      
      if (result) {
        setSummaryData(result);
        showAlert(language === 'am' ? 'ማጠቃለያ በተሳካ ሁኔታ ታትሟል!' : 'Summary published successfully!', "success");
      }
    } catch (err: any) {
      console.error("Save error:", err);
      showAlert(language === 'am' ? 'ማጠቃለያ ማሳተም አልተሳካም።' : 'Publishing failed.', "error");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploading(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `program-cards/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('frontend-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('frontend-assets')
        .getPublicUrl(filePath);

      setCardForm({ ...cardForm, image_url: publicUrl });
      showAlert(language === 'am' ? 'ምስል በተሳካ ሁኔታ ተሰቅሏል!' : 'Image uploaded successfully!', "success");
    } catch (error: any) {
      showAlert((language === 'am' ? 'ምስል መስቀል አልተሳካም: ' : 'Error uploading image: ') + error.message, "error");
    } finally {
      setUploading(false);
    }
  };

 const handleFileChangeNews = async (e: React.ChangeEvent<HTMLInputElement>) => {
  try {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    // Upload using server action (bypasses RLS)
    const publicUrl = await uploadNewsImage(file, fileName, userData.id);
    setNewsForm(prev => ({ ...prev, image_url: publicUrl }));
    showAlert(language === 'am' ? 'የዜና ምስል በተሳካ ሁኔታ ተሰቅሏል!' : 'News image uploaded successfully!', "success");
  } catch (error: any) {
    showAlert((language === 'am' ? 'ምስል መስቀል አልተሳካም: ' : 'Error uploading image: ') + error.message, "error");
  } finally {
    setUploading(false);
  }
};

  const handleSaveNews = async () => {
    if (!newsForm.title || !newsForm.content) {
      showAlert(language === 'am' ? 'እባክዎ ርዕስ እና ይዘት ያቅርቡ።' : 'Please provide both a Title and Content.', "error");
      return;
    }
    setUpdateLoading(true);
    try {
      if (newsForm.id) {
        const res: any = await updateNewsItem(newsForm.id, {
          title: newsForm.title,
          content: newsForm.content,
          image_url: newsForm.image_url
        });
        
        if (res && !res.success) {
          showAlert((language === 'am' ? 'ዜና ማሻሻል አልተሳካም: ' : 'Failed to update news: ') + res.error, "error");
          return;
        }
        showAlert(language === 'am' ? 'ዜና ተሻሽሏል!' : 'News item updated!', "success");
      } else {
        const res: any = await createNewsItem({
          title: newsForm.title,
          content: newsForm.content,
          image_url: newsForm.image_url
        });
        
        if (res && !res.success) {
          showAlert((language === 'am' ? 'ዜና ማሳተም አልተሳካም: ' : 'Failed to publish news: ') + res.error, "error");
          return;
        }
        showAlert(language === 'am' ? 'ዜና በተሳካ ሁኔታ ታትሟል!' : 'News item published successfully!', "success");
      }
      
      setNewsForm({ id: null, title: '', content: '', image_url: '' });
      const newsData = await getNewsItems();
      setNewsList(newsData || []);
    } catch (e: any) {
      showAlert((language === 'am' ? 'ዜና ማስቀመጥ አልተሳካም: ' : 'Failed to save news: ') + e.message, "error");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (confirm(language === 'am' ? 'ይህን ዜና መሰረዝ እርግጠኛ ነዎት?' : 'Are you sure you want to delete this news item?')) {
      setUpdateLoading(true);
      const res: any = await deleteNewsItem(id);
      
      if (res && !res.success) {
        showAlert((language === 'am' ? 'ዜና መሰረዝ አልተሳካም: ' : 'Failed to delete news: ') + res.error, "error");
        setUpdateLoading(false);
        return;
      }
      
      const newsData = await getNewsItems();
      setNewsList(newsData || []);
      setUpdateLoading(false);
      showAlert(language === 'am' ? 'ዜና ተሰርዟል።' : 'News item deleted.', "success");
    }
  };

  const handleDeleteSummary = async () => {
    if (!summaryData.id) return;
    if (confirm(language === 'am' ? 'ይህን ማጠቃለያ መሰረዝ እርግጠኛ ነዎት?' : 'Are you sure you want to delete this summary?')) {
      setUpdateLoading(true);
      await deleteServiceSummary(summaryData.id);
      setSummaryData({ id: null, summary_text: '', total_offering: 0, total_alms: 0, service_date: new Date().toISOString().split('T')[0] });
      setUpdateLoading(false);
      showAlert(language === 'am' ? 'ማጠቃለያ ተሰርዟል።' : 'Summary deleted.', "success");
    }
  };

  const handleSaveCard = async () => {
    setUpdateLoading(true);
    await upsertFrontendCard(cardForm);
    const cards = await getFrontendCards();
    setFrontendCards(cards);
    setCardForm({ id: null, title: '', description: '', day: '', time: '', event_date: '', image_url: '', color: 'bg-[#2589ce]', alignment: 'right', is_featured: false });
    setUpdateLoading(false);
    showAlert(language === 'am' ? 'የፕሮግራም ካርድ በተሳካ ሁኔታ ተቀምጧል!' : 'Program card saved successfully!', "success");
  };

  const handleDeleteCard = async (id: string) => {
    if(confirm(language === 'am' ? 'ካርድ መሰረዝ?' : 'Delete card?')) {
      await deleteFrontendCard(id);
      setFrontendCards(prev => prev.filter(c => c.id !== id));
      showAlert(language === 'am' ? 'የፕሮግራም ካርድ ተሰርዟል።' : 'Program card deleted.', "success");
    }
  };

  const handleLogout = async () => { 
    try {
      await supabase.auth.signOut(); 
      showAlert(language === 'am' ? 'በተሳካ ሁኔታ ወጥተዋል።' : 'Successfully signed out.', "info");
      router.push('/login');
    } catch (error) {
      console.error("Logout error:", error);
      showAlert(language === 'am' ? 'መውጣት አልተሳካም። እባክዎ ይሞክሩ።' : 'Error signing out. Please try again.', "error");
    }
  };
  
  const handleUpdateProfile = async () => {
    setUpdateLoading(true);
    const result = await updateMyProfile(editForm);
    if (result.success) { 
      setUserData(result.profile); 
      setIsEditing(false); 
      showAlert(language === 'am' ? 'መገለጫ በተሳካ ሁኔታ ተሻሽሏል!' : 'Profile updated successfully!', "success");
    } else {
      showAlert(language === 'am' ? 'መገለጫ ማሻሻል አልተሳካም።' : 'Failed to update profile.', "error");
    }
    setUpdateLoading(false);
  };

 const handleSaveEvent = async () => {
  try {
    // The service_type is already set in the form via the dropdown
    const payload = { ...eventForm };
    const userRole = userData.role;

    if (eventModalMode === 'create') {
      const { id, ...dataToInsert } = payload;
      await createEvent(dataToInsert, userData.id);
    } else {
      await updateEvent(eventForm.id, payload, userData.id, userRole);
    }
    setIsEventModalOpen(false);
    loadData();
    showAlert(language === 'am' ? 'ፕሮግራም ተቀምጧል!' : 'Event saved!', "success");
  } catch (e: any) {
    showAlert((language === 'am' ? 'ማስቀመጥ አልተሳካም: ' : 'Save Error: ') + e.message, "error"); 
  }
};

  const isDateBlocked = (date: string) => {
    return events.some(e => e.event_date === date && e.audience_type === 'Full');
  };

  const getDaysInMonthGrid = () => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    
    const grid = [];
    
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthTotalDays - i;
      const d = new Date(year, month - 1, dayNum);
      const dateStr = d.toISOString().split('T')[0];
      grid.push({ dayNum, isCurrentMonth: false, dateStr, dateObj: d });
    }
    
    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(year, month, i);
      const dateStr = d.toISOString().split('T')[0];
      grid.push({ dayNum: i, isCurrentMonth: true, dateStr, dateObj: d });
    }
    
    const remaining = 42 - grid.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      const dateStr = d.toISOString().split('T')[0];
      grid.push({ dayNum: i, isCurrentMonth: false, dateStr, dateObj: d });
    }
    
    return grid;
  };

  const handleCustomDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setIsDayEventsPopupOpen(true);
  };

  const handleCustomEventEditTrigger = (ev: any) => {
    if (isServiceLead && ev.created_by === userData.id) {
      setEventModalMode('edit');
      setEventForm({ 
        id: ev.id,
        title: ev.title,
        description: ev.description,
        event_date: ev.event_date,
        start_time: ev.start_time,
        end_time: ev.end_time,
        service_type: ev.service_type,
        audience_type: ev.audience_type || "Partial"
      });
      setIsEventModalOpen(true);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    if (direction === 'prev') {
      setCurrentCalendarDate(new Date(year, month - 1, 1));
    } else {
      setCurrentCalendarDate(new Date(year, month + 1, 1));
    }
  };

  const loadAudioFiles = async () => {
    setAudioLoading(true);
    try {
      const files = await getArchiveItems();
      setAudioFiles(files);
      const count = await getRecordingCount();
      setAudioCount(count);
    } catch (error) {
      console.error('Error loading audio files:', error);
      showAlert(language === 'am' ? 'የድምጽ ፋይሎችን ማግኘት አልተቻለም' : 'Failed to load audio files', 'error');
    } finally {
      setAudioLoading(false);
    }
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('audio/')) {
        showAlert(language === 'am' ? 'እባክዎ የድምጽ ፋይል ይምረጡ።' : 'Please select an audio file.', 'error');
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        showAlert(language === 'am' ? 'የፋይል መጠን ከ50 ሜባ በታች መሆን አለበት።' : 'File size must be less than 50MB.', 'error');
        return;
      }
      setAudioFile(file);
    }
  };

  const handleAudioUpload = async () => {
    if (!audioFile) {
      showAlert(language === 'am' ? 'እባክዎ የድምጽ ፋይል ይምረጡ።' : 'Please select an audio file.', 'error');
      return;
    }
    if (!audioForm.title.trim()) {
      showAlert(language === 'am' ? 'እባክዎ ርዕስ ያስገቡ።' : 'Please enter a title.', 'error');
      return;
    }
    if (!audioForm.speaker.trim()) {
      showAlert(language === 'am' ? 'እባክዎ የተናጋሪ ስም ያስገቡ።' : 'Please enter the speaker name.', 'error');
      return;
    }
    if (!audioForm.date_preached) {
      showAlert(language === 'am' ? 'እባክዎ የተሰበከበትን ቀን ይምረጡ።' : 'Please select the date preached.', 'error');
      return;
    }

    setAudioUploading(true);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!session) {
        showAlert(language === 'am' ? 'ፋይሎችን ለመስቀል መግባት አለቦት።' : 'You must be logged in to upload files.', 'error');
        setAudioUploading(false);
        return;
      }

      const fileExt = audioFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `preachings/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('audio-files')
        .upload(filePath, audioFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: audioFile.type
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('audio-files')
        .getPublicUrl(filePath);

      const result = await createArchiveItem({
        title: audioForm.title.trim(),
        speaker: audioForm.speaker.trim(),
        description: audioForm.description.trim(),
        audio_url: publicUrl,
        date_preached: audioForm.date_preached,
      });

      if (result.success) {
        showAlert(language === 'am' ? 'ድምጽ በተሳካ ሁኔታ ተሰቅሏል!' : 'Audio uploaded successfully!', 'success');

        setAudioForm({
          id: null,
          title: '',
          speaker: '',
          description: '',
          audio_url: '',
          date_preached: ''
        });

        setAudioFile(null);

        const fileInput = document.getElementById('audio-file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';

        await loadAudioFiles();
      } else {
        showAlert((language === 'am' ? 'ማስቀመጥ አልተሳካም: ' : 'Failed to save: ') + result.error, 'error');
      }
    } catch (error: any) {
      console.error(error);
      showAlert((language === 'am' ? 'መስቀል አልተሳካም: ' : 'Upload failed: ') + (error.message || 'Unknown error'), 'error');
    } finally {
      setAudioUploading(false);
    }
  };

  const handleAudioDelete = async (id: string) => {
    if (!confirm(language === 'am' ? 'ይህን ቅጂ መሰረዝ እርግጠኛ ነዎት?' : 'Are you sure you want to delete this recording?')) return;

    try {
      const result = await deleteArchiveItem(id);
      if (result.success) {
        showAlert(language === 'am' ? 'ቅጂ በተሳካ ሁኔታ ተሰርዟል።' : 'Recording deleted successfully.', 'success');
        await loadAudioFiles();
      } else {
        showAlert((language === 'am' ? 'መሰረዝ አልተሳካም: ' : 'Failed to delete: ') + result.error, 'error');
      }
    } catch (error: any) {
      showAlert((language === 'am' ? 'መሰረዝ ላይ ስህተት: ' : 'Error deleting: ') + error.message, 'error');
    }
  };

  useEffect(() => {
    if (isFrontendManager && managerTab === 'audio') {
      loadAudioFiles();
    }
  }, [isFrontendManager, managerTab]);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-zinc-950 gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-white/5" />
          <div className="absolute inset-0 rounded-full border-4 border-t-[#f97316] animate-spin" />
        </div>
        <p className="text-sm font-bold text-slate-400 tracking-widest uppercase">
          {language === 'am' ? 'የአባላት ፓኔል...' : 'Loading Panel...'}
        </p>
      </div>
    );
  }

  const selectedDayEvents = events.filter(e => e.event_date === selectedDate);
  const isSelectedDateBlocked = isDateBlocked(selectedDate);

  return (
    <div className="min-h-screen font-sans text-white bg-zinc-950 relative overflow-x-hidden selection:bg-[#f97316] selection:text-white">
      
      {/* BACKGROUND IMAGE CONTAINER WITH SEAMLESS CROSSFADE */}
      <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none bg-zinc-950">
       {Object.entries(BACKGROUND_IMAGES).map(([tab, url]) => {
  const isActive = activeTab === tab || (activeTab === 'profileInfo' && tab === 'profileInfo') || (activeTab === 'messages' && tab === 'messages');
  return (
    <div
      key={tab}
      className="absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(9, 9, 11, 0.65), rgba(9, 9, 11, 0.95)), url(${url})`,
        opacity: isActive ? 1 : 0,
        transform: isActive ? 'scale(1)' : 'scale(1.05)',
        transitionProperty: 'opacity, transform',
      }}
    />
  );
})}
      </div>

      {/* RENDER DAY EVENTS POPUP MODAL */}
      <AnimatePresence>
        {isDayEventsPopupOpen && (
          <DayEventsPopupModal
            isOpen={isDayEventsPopupOpen}
            date={selectedDate}
            events={selectedDayEvents}
            isServiceLead={isServiceLead}
            isBlocked={isSelectedDateBlocked}
            userData={userData}
            isEthiopianCalendar={isEthiopianCalendar}
            onClose={() => setIsDayEventsPopupOpen(false)}
            onAddEvent={() => {
              setIsDayEventsPopupOpen(false);
              setEventModalMode('create');
              setEventForm({ 
                id: "", title: "", description: "", 
                event_date: selectedDate, start_time: "09:00", end_time: "11:00", 
                service_type: eventRoles[0] || "Special Event",
                audience_type: "Partial"
              });
              setIsEventModalOpen(true);
            }}
            onEditEvent={(ev: any) => {
              setIsDayEventsPopupOpen(false);
              handleCustomEventEditTrigger(ev);
            }}
          />
        )}
      </AnimatePresence>

      {/* RENDER OTHER MODALS */}
      <AnimatePresence>
        {isResModalOpen && (
          <ReservationDetailModal 
            isOpen={isResModalOpen} 
            reservation={selectedReservation} 
            onClose={() => setIsResModalOpen(false)} 
            onUpdate={handleUpdateReservation} 
            updateLoading={updateLoading}
          />
        )}
      </AnimatePresence>

      <SubAdminEventModal 
        isOpen={isEventModalOpen} 
        mode={eventModalMode} 
        formData={eventForm} 
        onClose={() => setIsEventModalOpen(false)} 
        onInputChange={(f:string, v:string) => setEventForm(p => ({...p, [f]:v}))} 
        onSave={handleSaveEvent} 
        onDelete={async (id: string) => { 
          if (!confirm(language === 'am' ? 'ይህን ፕሮግራም መሰረዝ እርግጠኛ ነዎት?' : 'Are you sure you want to delete this event?')) return;
          try {
            await deleteEvent(id, userData.id); 
            setIsEventModalOpen(false); 
            loadData(); 
            showAlert(language === 'am' ? 'ፕሮግራም በተሳካ ሁኔታ ተሰርዟል' : 'Event deleted successfully', "success");
          } catch (e: any) {
            showAlert(e.message, "error"); 
          }
        }
      } 
      availableServiceTypes={eventRoles}
      />

      {/* MAIN CONTAINER */}
      <main className="relative z-10 w-full max-w-7xl mx-auto pt-5 md:pt-5 lg:pt-5 pb-32 px-4 sm:px-6 lg:px-8">
        
        {/* TOAST PANEL */}
        {toast && toast.isOpen && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-zinc-950/90 backdrop-blur-3xl border border-white/15 px-6 py-4 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex items-center gap-3 text-white max-w-md">
              {toast.type === 'success' && <Check className="text-emerald-400 shrink-0" size={18} />}
              {toast.type === 'error' && <ShieldAlert className="text-rose-400 shrink-0" size={18} />}
              {toast.type === 'info' && <Clock className="text-[#f97316] shrink-0" size={18} />}
              <span className="text-sm font-semibold tracking-wide">{toast.message}</span>
              <button type="button" onClick={() => setToast(null)} className="ml-4 text-slate-400 hover:text-white transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            1. CALENDAR TAB - KEPT EXACTLY AS ORIGINAL
            ========================================================================= */}
        {activeTab === 'calendar' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* HERO WELCOME BANNER - ONLY "SHALOM" translated */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 border border-white/10 p-6 md:p-8 rounded-[2rem] backdrop-blur-xl">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white font-display mt-1">
                  <span className='text-orange-500'>SHALOM</span> <br /><span className='font-normal'>{userData?.full_name}</span> 
                </h2>
              </div>
              {/* Display multiple roles */}
                {userData?.assigned_service && Array.isArray(userData.assigned_service) && userData.assigned_service.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {userData.assigned_service.map((service: string) => (
                      <div key={service} className="flex items-center gap-2 px-4 py-2 bg-[#f97316]/10 border border-[#f97316]/30 rounded-xl">
                        <Award size={16} className="text-[#f97316]" />
                        <span className="text-xs font-black uppercase tracking-wider text-white">
                          {service}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
            </div>

            {/* CALENDAR GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
              
              {/* CALENDAR - KEPT EXACTLY AS ORIGINAL */}
              <div className="bg-zinc-950/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.6)] relative overflow-hidden group">
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
                
                {/* CALENDAR HEADER */}
                <div className="relative z-10 flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse" />
                    <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] font-mono">
                      our schedule
                    </span>
                  </div>
                  
                  {/* Ethiopian Calendar Toggle Button */}
                  <button 
                    type="button"
                    onClick={() => setIsEthiopianCalendar(!isEthiopianCalendar)}
                    className={`px-3 py-1.5 rounded-full border backdrop-blur-md transition-all duration-300 flex items-center gap-1.5 ${
                      isEthiopianCalendar 
                        ? 'bg-[#f97316]/20 border-[#f97316]/40 text-[#f97316]' 
                        : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="text-[8px] font-black tracking-widest uppercase">
                      {isEthiopianCalendar ? 'GR' : 'ET'}
                    </span>
                    <span className="text-[8px] font-black tracking-widest uppercase">
                      {isEthiopianCalendar ? 'Gregorian' : 'Ethiopian'}
                    </span>
                  </button>
                </div>

                {/* MONTH HEADER - KEPT ORIGINAL */}
                <div className="relative z-10 flex items-center justify-between mb-8 px-2">
                  <div className="flex flex-col">
                    <h3 className="text-3xl md:text-5xl font-black text-white">
                      {isEthiopianCalendar
                        ? getEthiopianDate(currentCalendarDate).month
                        : MONTHS_EN[currentCalendarDate.getMonth()]
                      }
                    </h3>
                    <p className="text-xs font-bold text-slate-400 tracking-wider mt-1.5 uppercase font-mono flex items-center gap-2">
                      <span className="text-[#f97316]">•</span>{isEthiopianCalendar
                        ? `${getEthiopianDate(currentCalendarDate).month} ${getEthiopianDate(currentCalendarDate).year}`
                        : `${MONTHS_EN[currentCalendarDate.getMonth()]} ${currentCalendarDate.getFullYear()}`
                      }
                    </p>
                  </div>
                  <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
                    <button 
                      type="button"
                      onClick={() => navigateMonth('prev')} 
                      className="p-2.5 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white transition-all active:scale-95"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      type="button"
                      onClick={() => navigateMonth('next')} 
                      className="p-2.5 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white transition-all active:scale-95"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                {/* WEEKDAY LABELS - KEPT ORIGINAL */}
                <div className="relative z-10 grid grid-cols-7 gap-1 md:gap-2 mb-4 text-center font-bold text-slate-400 text-xs tracking-widest border-b border-white/5 pb-3 font-display">
                  {(isEthiopianCalendar ? WEEKDAYS_ET : WEEKDAYS_EN).map((day, idx) => (
                    <span key={idx}>{day}</span>
                  ))}
                </div>

                {/* DYNAMIC DAYS GRID - KEPT ORIGINAL */}
                <div className="relative z-10 grid grid-cols-7 gap-y-2 gap-x-0.5 md:gap-3">
                  {getDaysInMonthGrid().map(({ dayNum, isCurrentMonth, dateStr, dateObj }, idx) => {
                    const dayEvents = events.filter(e => e.event_date === dateStr);
                    const isToday = new Date().toISOString().split('T')[0] === dateStr;
                    const isSelected = selectedDate === dateStr;
                    
                    return (
                      <button 
                        key={idx}
                        type="button"
                        onClick={() => handleCustomDateClick(dateStr)}
                        className={`relative min-h-[50px] md:min-h-[85px] rounded-xl md:rounded-2xl flex flex-col items-stretch justify-between p-1.5 sm:p-2 transition-all duration-300 outline-none group border
                          ${isCurrentMonth ? 'text-white' : 'text-slate-600 border-transparent opacity-25'}
                          ${isSelected 
                            ? 'bg-white/10 border-[#f97316]/50 shadow-[0_8px_30px_rgb(249,115,22,0.1)]' 
                            : 'bg-zinc-950/20 border-white/5 hover:border-white/15 hover:bg-white/5'
                          }
                        `}
                      >
                        {/* Day indicator header */}
                        <div className="flex justify-between items-center w-full">
                          {isToday ? (
                            <div className="relative flex items-center justify-center w-5 h-5 md:w-8 md:h-8 rounded-full bg-[#f97316] text-white font-black text-[10px] md:text-sm shadow-md shadow-orange-500/20">
                              <span className="absolute inset-0 rounded-full bg-[#f97316] animate-ping opacity-25" />
                              {isEthiopianCalendar ? getEthiopianDate(dateObj).day : dayNum}
                            </div>
                          ) : (
                            <div className={`w-5 h-5 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[10px] md:text-sm font-semibold transition-all
                              ${isSelected ? 'text-[#f97316] font-black' : 'text-slate-200'}
                            `}>
                              {isEthiopianCalendar ? getEthiopianDate(dateObj).day : dayNum}
                            </div>
                          )}

                          {/* Event count badge */}
                          {dayEvents.length > 0 && (
                            <span className="text-[7px] md:text-[9px] font-black text-orange-400 font-mono px-1 py-0.5 md:px-1.5 md:py-0.5 bg-orange-400/10 rounded-full">
                              {dayEvents.length}
                            </span>
                          )}
                        </div>

                        {/* Event representation */}
                        <div className="w-full mt-1 md:mt-2">
                          {/* MOBILE: Colored dots */}
                          {dayEvents.length > 0 && (
                            <div className="sm:hidden flex flex-wrap gap-1 mt-0.5 justify-start items-center">
                              {dayEvents.slice(0, 3).map((ev) => {
                                const colorHex = SERVICE_COLORS[ev.service_type]?.hex || '#f97316';
                                return (
                                  <span 
                                    key={ev.id} 
                                    className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full shrink-0 shadow-sm transition-all" 
                                    style={{ backgroundColor: colorHex }} 
                                    title={ev.title}
                                  />
                                );
                              })}
                              {dayEvents.length > 3 && (
                                <span className="text-[6px] md:text-[8px] text-slate-400 font-bold font-mono">
                                  +{dayEvents.length - 3}
                                </span>
                              )}
                            </div>
                          )}

                          {/* PC/DESKTOP: Event titles */}
                          {dayEvents.length > 0 && (
                            <div className="hidden sm:flex flex-col gap-0.5 items-stretch">
                              {dayEvents.slice(0, 2).map((ev) => {
                                const colorHex = SERVICE_COLORS[ev.service_type]?.hex || '#f97316';
                                return (
                                  <div
                                    key={ev.id}
                                    className="px-1 py-0.5 rounded-md text-[7px] md:text-[9px] font-black truncate leading-tight text-left transition-all hover:scale-[1.02]"
                                    style={{ 
                                      backgroundColor: `${colorHex}15`,
                                      borderLeft: `2px solid ${colorHex}`,
                                      color: colorHex
                                    }}
                                  >
                                    {ev.title}
                                  </div>
                                );
                              })}
                              {dayEvents.length > 2 && (
                                <span className="text-[7px] md:text-[8px] font-bold text-slate-400 px-1 self-start">
                                  +{dayEvents.length - 2} more
                                </span>
                              )}
                            </div>
                          )}

                          {dayEvents.length === 0 && (
                            <div className="h-0.5 md:h-1" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* LEGEND - KEPT ORIGINAL */}
                <div className="relative z-10 mt-8 pt-6 border-t border-white/5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 font-mono">
                    Service Categories:
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-3">
                    {Object.entries(SERVICE_COLORS).map(([name, val]: any) => (
                      <div key={name} className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-full backdrop-blur-md">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: val.hex }} />
                        <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* =========================================================================
            2. CHURCH SUMMARY TAB - TRANSLATED
            ========================================================================= */}
        {activeTab === 'church' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-[5%]">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-white font-display uppercase tracking-tight mt-1">
                  {language === 'am' ? 'የአገልግሎት ቃል' : 'Service Word'}
                </h2>
                <p className="text-xs text-slate-400 font-bold mt-2 flex items-center gap-2">
                  <Clock size={14} className="text-[#f97316]" />
                  {summaryData.service_date ? new Date(summaryData.service_date).toLocaleDateString('en-US', { dateStyle: 'full' }) : (language === 'am' ? 'ቀን አልተገለጸም' : 'Date not specified')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-zinc-950/45 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-6 bg-[#f97316] rounded-full" />
                  <h3 className="text-[#f97316] text-xs font-black uppercase tracking-[0.2em]">
                    {language === 'am' ? 'የቃል ማጠቃለያ' : 'word summary'}
                  </h3>
                </div>
                <p className="text-slate-100 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                  {summaryData.summary_text || (language === 'am' ? 'የአገልግሎቱ ማጠቃለያ ለዚህ ቀን እስካሁን አልታተመም። እባክዎ ቆይተው ይመልሱ።' : 'The service summary has not been published for this date yet. Please check back later.')}
                </p>
              </div>

              <div className="flex flex-col gap-6">
                <div className="bg-gradient-to-br from-[#f97316]/90 to-[#ea580c]/90 border border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-8 text-white shadow-xl shadow-orange-500/10 transition-all hover:scale-[1.02]">
                  <p className="text-white/80 text-[15px] font-black uppercase tracking-widest font-mono">
                    {language === 'am' ? 'ጠቅላላ መባ' : 'Total Offering'}
                  </p>
                  <div className="text-5xl font-black tracking-tight mt-4 font-display">
                    {summaryData.total_offering?.toLocaleString() || "0"}
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 text-xs text-white/70"></div>
                </div>

                <div className="bg-zinc-950/45 border border-white/10 backdrop-blur-3xl rounded-[2.5rem] p-8 shadow-2xl transition-all hover:scale-[1.02]">
                  <p className="text-slate-400 text-[15px] font-black uppercase tracking-widest font-mono">
                    {language === 'am' ? 'ጠቅላላ አስራት' : 'Total Alms'}
                  </p>
                  <div className="text-5xl font-black tracking-tight text-white mt-4 font-display">
                    {summaryData.total_alms?.toLocaleString() || "0"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            3. FINANCE / OFFERINGS STATUS TAB - TRANSLATED
            ========================================================================= */}
{/* =========================================================================
    3. MESSAGE PANEL - REPLACES LEDGER
    ========================================================================= */}
{activeTab === 'messages' && (
  <div className="w-full max-w-4xl mx-auto animate-fadeIn space-y-8">
    <div className="text-center">
      <span className="text-[11px] font-black text-[#f97316] uppercase tracking-widest font-mono">
        {language === 'am' ? 'ወደ አስተዳዳሪ መልዕክት' : 'Message to Admin'}
      </span>
      <h2 className="text-3xl font-black text-white font-display uppercase tracking-tight mt-1">
        {language === 'am' ? 'የመልዕክት ማእከል' : 'Message Center'}
      </h2>
      <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
        {language === 'am' 
          ? 'ለአስተዳዳሪ መልዕክት ይላኩ። መልዕክቶች ስም-አልባ ናቸው እና በአስተዳዳሪ በኩል ብቻ ይታያሉ።' 
          : 'Send a private message to the admin. Messages are anonymous and only visible to the admin panel.'}
      </p>
    </div>

    <div className="bg-zinc-950/45 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
      <div className="space-y-6">
        {/* Subject Input */}
        <div>
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2 font-mono">
            {language === 'am' ? 'ርዕስ' : 'Subject'}
          </label>
          <input
            type="text"
            value={messageSubject}
            onChange={(e) => setMessageSubject(e.target.value)}
            placeholder={language === 'am' ? 'የመልዕክት ርዕስ ያስገቡ...' : 'Enter message subject...'}
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none text-white focus:border-[#f97316] transition-colors text-sm"
            maxLength={100}
          />
          <p className="text-[10px] text-slate-500 mt-1 text-right font-mono">
            {messageSubject.length}/100
          </p>
        </div>

        {/* Message Content */}
        <div>
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2 font-mono">
            {language === 'am' ? 'መልዕክት' : 'Message'}
          </label>
          <textarea
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder={language === 'am' ? 'መልዕክትዎን እዚህ ይጻፉ...' : 'Write your message here...'}
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none text-white focus:border-[#f97316] transition-colors text-sm min-h-[180px] resize-y"
            maxLength={1000}
          />
          <p className="text-[10px] text-slate-500 mt-1 text-right font-mono">
            {messageContent.length}/1000
          </p>
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={isSendingMessage || !messageSubject.trim() || !messageContent.trim()}
          className="w-full py-4 bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:brightness-110 text-white rounded-xl font-bold shadow-lg shadow-orange-500/15 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSendingMessage ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{language === 'am' ? 'በመላክ ላይ...' : 'Sending...'}</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span>{language === 'am' ? 'መልዕክት ላክ' : 'Send Message'}</span>
            </>
          )}
        </button>

        {/* Info Box */}
        <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-start gap-3 text-xs text-slate-400">
            <svg className="w-5 h-5 text-[#f97316] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-bold text-white/80">
                {language === 'am' ? 'ስለ መልዕክት ማእከሉ' : 'About the Message Center'}
              </p>
              <p className="mt-1 leading-relaxed">
                {language === 'am'
                  ? '• መልዕክቶች ሙሉ በሙሉ ስም-አልባ ናቸው - የላኪው መረጃ አይታይም\n• ሁሉም መልዕክቶች በቀጥታ ወደ አስተዳዳሪ ይሄዳሉ'
                  : '• Messages are completely anonymous - sender information is hidden\n• All messages go directly to the admin panel'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

        {/* =========================================================================
            4. PROFILE & SPECIALTY MANAGEMENT TAB - TRANSLATED
            ========================================================================= */}
        {activeTab === 'profileInfo' && (
          <div className="space-y-12 animate-fadeIn">
            
            {(isFinanceManager || isFrontendManager || isGuestHouseManager) && (
  <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-xl border border-white/10">
    {isFinanceManager && (
      <button onClick={() => setManagementTab('finance')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${managementTab === 'finance' ? 'bg-[#f97316] text-white' : 'text-slate-400 hover:text-white'}`}>
        Finance
      </button>
    )}
    {isFrontendManager && (
      <button onClick={() => setManagementTab('frontend')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${managementTab === 'frontend' ? 'bg-[#f97316] text-white' : 'text-slate-400 hover:text-white'}`}>
        Frontend
      </button>
    )}
    {isGuestHouseManager && (
      <button onClick={() => setManagementTab('guesthouse')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${managementTab === 'guesthouse' ? 'bg-[#f97316] text-white' : 'text-slate-400 hover:text-white'}`}>
        Guest House
      </button>
    )}
  </div>
)}


            {/* --- FINANCE MANAGER VIEW --- */}
            {isFinanceManager && (
              <div className="bg-zinc-950/45 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3 text-[#f97316]">
                    <ShieldAlert size={24} /> 
                    <h2 className="text-2xl font-black uppercase tracking-tight font-display">
                      {language === 'am' ? 'የፋይናንስ እና ማጠቃለያ አስተዳዳሪ' : 'Finance & Summary Manager'}
                    </h2>
                  </div>
                  {summaryData.id && (
                    <button type="button" onClick={handleDeleteSummary} className="text-red-400 hover:bg-red-500/15 border border-red-500/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold uppercase font-mono">
                      <Trash2 size={14}/> {language === 'am' ? 'አሁን ያለውን ሰርዝ' : 'Delete Current'}
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2 font-mono">
                        {language === 'am' ? 'የአገልግሎት ቀን' : 'Service Date'}
                      </label>
                      <input type="date" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#f97316] text-sm" 
                        value={summaryData.service_date?.split('T')[0]} 
                        onChange={e => setSummaryData({...summaryData, service_date: e.target.value})} 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2 font-mono">
                      {language === 'am' ? 'የአገልግሎት ማጠቃለያ ጽሑፍ' : 'Service Summary Text'}
                    </label>
                    <textarea className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none min-h-[180px] text-white focus:border-[#f97316] transition-colors text-sm leading-relaxed" 
                      placeholder={language === 'am' ? 'ማጠቃለያውን እዚህ ይጻፉ...' : 'Write the summary here...'}
                      value={summaryData.summary_text} 
                      onChange={e => setSummaryData({...summaryData, summary_text: e.target.value})} 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2 font-mono">
                        {language === 'am' ? 'ጠቅላላ መባ' : 'Total Offering'}
                      </label>
                      <input type="number" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#f97316] text-sm" value={summaryData.total_offering} onChange={e => setSummaryData({...summaryData, total_offering: Number(e.target.value)})} />
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2 font-mono">
                        {language === 'am' ? 'ጠቅላላ አስራት' : 'Total Alms'}
                      </label>
                      <input type="number" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#f97316] text-sm" value={summaryData.total_alms} onChange={e => setSummaryData({...summaryData, total_alms: Number(e.target.value)})} />
                    </div>
                  </div>

                  <button type="button" onClick={handleSaveSummary} disabled={updateLoading} className="w-full py-4 bg-[#f97316] hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50">
                    <Save size={18}/> {updateLoading ? (language === 'am' ? 'በማሳተም ላይ...' : 'Publishing...') : summaryData.id ? (language === 'am' ? 'የታተመውን ማጠቃለያ ያዘምኑ' : 'Update Published Summary') : (language === 'am' ? 'ለአባላት አሳትም' : 'Publish to Members')}
                  </button>
                </div>
              </div>
            )}
              
            {isFrontendManager && (
              <div className="bg-zinc-950/45 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-white/5 pb-5 mb-8">
                  <div className="flex items-center gap-3 text-orange-500">
                    <Layout size={24} /> 
                    <h2 className="text-2xl text-orange-500 font-black uppercase tracking-tight font-display">
                      {language === 'am' ? 'የፊት ገጽ ይዘት አስተዳዳሪ' : 'Frontend Content Manager'}
                    </h2>
                  </div>
                  
                  <div className="flex gap-2 mt-4 md:mt-0 bg-white/5 p-1 rounded-xl border border-white/10">
                    <button 
                      type="button"
                      onClick={() => setManagerTab('cards')} 
                      className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${managerTab === 'cards' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      {language === 'am' ? 'የፕሮግራም ካርዶች' : 'Program Cards'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setManagerTab('news')} 
                      className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${managerTab === 'news' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      {language === 'am' ? 'የዜና ዝማኔዎች' : 'News Updates'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setManagerTab('audio')} 
                      className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${managerTab === 'audio' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      {language === 'am' ? 'የድምጽ ማህደር' : 'Audio Archive'}
                    </button>
                  </div>
                </div>

                {/* PROGRAM CARDS TAB */}
                {managerTab === 'cards' && (
                  <div className="space-y-8">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                      <h3 className="font-black text-sm uppercase mb-4 text-slate-400 font-mono">
                        {language === 'am' ? 'የፕሮግራም ካርድ ይፍጠሩ / ያዘምኑ' : 'Create / Update Program Card'}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input className="bg-white/5 border border-white/10 p-3 rounded-lg outline-none text-white text-sm focus:border-[#2589ce]" placeholder={language === 'am' ? 'ርዕስ (ለምሳሌ የወጣቶች ጸሎት)' : 'Title (e.g. YOUTH PRAYERS)'} value={cardForm.title} onChange={e => setCardForm({...cardForm, title: e.target.value})} />
                        <input className="bg-white/5 border border-white/10 p-3 rounded-lg outline-none text-white text-sm focus:border-[#2589ce]" placeholder={language === 'am' ? 'ቀን (ለምሳሌ ማክሰኞ)' : 'Day (e.g. TUESDAY)'} value={cardForm.day} onChange={e => setCardForm({...cardForm, day: e.target.value})} />
                        <input className="bg-white/5 border border-white/10 p-3 rounded-lg outline-none text-white text-sm focus:border-[#2589ce]" placeholder={language === 'am' ? 'ሰዓት (ለምሳሌ 7 ማታ)' : 'Time (e.g. 7PM)'} value={cardForm.time} onChange={e => setCardForm({...cardForm, time: e.target.value})} />
                        <input className="bg-white/5 border border-white/10 p-3 rounded-lg outline-none text-white text-sm focus:border-[#2589ce]" placeholder={language === 'am' ? 'ቀን (ለምሳሌ መጋቢት 25)' : 'Date (e.g. MAR 25)'} value={cardForm.event_date} onChange={e => setCardForm({...cardForm, event_date: e.target.value})} />
                        
                        <select className="bg-zinc-900 border border-white/10 p-3 rounded-lg text-white text-sm outline-none focus:border-[#2589ce]" value={cardForm.color} onChange={e => setCardForm({...cardForm, color: e.target.value})}>
                          <option value="bg-[#2589ce]">{language === 'am' ? 'ሰማያዊ ገጽታ' : 'Blue Theme'}</option>
                          <option value="bg-[#610b6d]">{language === 'am' ? 'ሐምራዊ ገጽታ' : 'Purple Theme'}</option>
                          <option value="bg-[#f55a05]">{language === 'am' ? 'ብርቱካናማ ገጽታ' : 'Orange Theme'}</option>
                          <option value="bg-[#10b981]">{language === 'am' ? 'አረንጓዴ ገጽታ' : 'Green Theme'}</option>
                        </select>

                        <div className="relative">
                          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="card-image-upload" />
                          <label htmlFor="card-image-upload" className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 p-3 rounded-lg cursor-pointer text-slate-400 hover:text-white transition-colors overflow-hidden truncate text-sm">
                            <ImageIcon size={16} /> {uploading ? (language === 'am' ? 'በመስቀል ላይ...' : 'Uploading...') : cardForm.image_url ? (language === 'am' ? 'ምስል ቀይር' : 'Change Image') : (language === 'am' ? 'ምስል ስቀል' : 'Upload Image')}
                          </label>
                        </div>

                        <select className="bg-zinc-900 border border-white/10 p-3 rounded-lg text-white text-sm outline-none" value={cardForm.alignment} onChange={e => setCardForm({...cardForm, alignment: e.target.value})}>
                          <option value="left">{language === 'am' ? 'ወደ ግራ አስተካክል' : 'Align Left'}</option>
                          <option value="right">{language === 'am' ? 'ወደ ቀኝ አስተካክል' : 'Align Right'}</option>
                        </select>

                        <div className="flex items-center gap-2 px-2">
                          <input type="checkbox" className="w-5 h-5 accent-[#2589ce] rounded cursor-pointer" checked={cardForm.is_featured} onChange={e => setCardForm({...cardForm, is_featured: e.target.checked})} />
                          <label className="text-xs font-bold text-slate-300">{language === 'am' ? 'ተለይቶ የሚታይ (በራስ ማሳያ)' : 'Featured (Header Slideshow)'}</label>
                        </div>
                        <input 
                          className="bg-white/5 border border-white/10 p-3 rounded-lg outline-none text-white text-sm md:col-span-2 focus:border-[#2589ce]" 
                          placeholder={language === 'am' ? 'አጭር መግለጫ' : 'Short Description'} 
                          value={cardForm.description} 
                          onChange={e => setCardForm({...cardForm, description: e.target.value})} 
                        />
                      </div>
                      <button type="button" onClick={handleSaveCard} disabled={uploading || updateLoading} className="mt-6 w-full py-4 bg-orange-500 cursor-pointer hover:bg-orange-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
                        <Save size={16} /> {cardForm.id ? (language === 'am' ? 'የፕሮግራም ካርድ ያዘምኑ' : 'Update Program Card') : (language === 'am' ? 'የፕሮግራም ካርድ ያክሉ' : 'Add Program Card')}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {frontendCards.map(card => (
                        <div key={card.id} className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/10 overflow-hidden"><img src={card.image_url} className="w-full h-full object-cover" /></div>
                            <div>
                              <h4 className="font-bold text-sm text-white">{card.title}</h4>
                              <p className="text-[10px] text-slate-400 uppercase mt-0.5">{card.day} • {card.time} • {card.is_featured ? (language === 'am' ? 'ተለይቶ' : 'Featured') : (language === 'am' ? 'መደበኛ' : 'Standard')}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => setCardForm(card)} className="p-2 text-sky-400 hover:bg-sky-500/10 rounded-lg"><Edit2 size={14}/></button>
                            <button type="button" onClick={() => handleDeleteCard(card.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={14}/></button>
                          </div>
                        </div>
                      ))}
                      {frontendCards.length === 0 && (
                        <p className="text-center py-10 italic text-slate-400 text-sm col-span-2">
                          {language === 'am' ? 'ምንም የፕሮግራም ካርዶች የሉም።' : 'No program cards available.'}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* NEWS UPDATES TAB */}
                {managerTab === 'news' && (
                  <div className="space-y-8">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-black text-sm uppercase text-slate-400 font-mono">
                          {language === 'am' ? 'የዜና ዝማኔ ይፍጠሩ / ያዘምኑ (ከፍተኛ 6 ይፈቀዳል)' : 'Create / Update News Update (Max 6 Allowed)'}
                        </h3>
                        <span className="text-xs bg-orange-500/15 text-orange-500 border border-orange-500/30 px-3 py-1 rounded-full font-bold font-mono">
                          {language === 'am' ? 'ቁጥር' : 'Count'}: {newsList.length}/6
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 font-mono">
                            {language === 'am' ? 'የዜና ርዕስ' : 'News Title'}
                          </label>
                          <input 
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-lg outline-none text-white text-sm focus:border-[#2589ce]" 
                            placeholder={language === 'am' ? 'የማስታወቂያ አርዕስት' : 'Announcement Headline'} 
                            value={newsForm.title} 
                            onChange={e => setNewsForm({...newsForm, title: e.target.value})} 
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 font-mono">
                            {language === 'am' ? 'ዝርዝር ይዘት' : 'Detail Content'}
                          </label>
                          <textarea 
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-lg outline-none text-white min-h-[150px] text-sm leading-relaxed focus:border-[#2589ce]" 
                            placeholder={language === 'am' ? 'ሙሉ የዜና ዝማኔ ይዘት እዚህ ይጻፉ...' : 'Write the full news update content here...'} 
                            value={newsForm.content} 
                            onChange={e => setNewsForm({...newsForm, content: e.target.value})} 
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 font-mono">
                            {language === 'am' ? 'የማስዋቢያ ምስል' : 'Featured Attachment Image'}
                          </label>
                          <div className="relative mt-1">
                            <input type="file" accept="image/*" onChange={handleFileChangeNews} className="hidden" id="news-image-upload" />
                            <label htmlFor="news-image-upload" className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 p-4 rounded-lg cursor-pointer text-slate-400 hover:text-orange-500 transition-colors overflow-hidden truncate text-sm">
                              <ImageIcon size={16} /> {uploading ? (language === 'am' ? 'ወደ ማከማቻ በመስቀል ላይ...' : 'Uploading to storage...') : newsForm.image_url ? (language === 'am' ? 'የተመረጠውን ምስል ቀይር' : 'Replace Selected Image') : (language === 'am' ? 'የዜና ምስል ስቀል' : 'Upload News Banner Image')}
                            </label>
                          </div>
                          {newsForm.image_url && (
                            <div className="mt-3 relative w-32 h-20 rounded-lg overflow-hidden border border-white/10 bg-white/5">
                              <img src={newsForm.image_url} alt="News Banner Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        {newsForm.id && (
                          <button 
                            type="button"
                            onClick={() => setNewsForm({ id: null, title: '', content: '', image_url: '' })} 
                            className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl text-sm transition-all"
                          >
                            {language === 'am' ? 'አርትዕ ሰርዝ' : 'Cancel Edit'}
                          </button>
                        )}
                        <button 
                          type="button"
                          onClick={handleSaveNews} 
                          disabled={uploading || updateLoading} 
                          className="flex-1 py-4 bg-orange-500 hover:bg-sky-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 text-sm"
                        >
                          <Save size={16} /> {newsForm.id ? (language === 'am' ? 'የተመረጠውን ፖስት ያዘምኑ' : 'Update Selected Post') : (language === 'am' ? 'ማስታወቂያ አሳትም' : 'Publish Announcement')}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {newsList.map(item => (
                        <div key={item.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center gap-4 overflow-hidden">
                            <div className="w-14 h-14 rounded-xl bg-white/10 overflow-hidden shrink-0">
                              {item.image_url ? (
                                <img src={item.image_url} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400"><BookOpen size={16}/></div>
                              )}
                            </div>
                            <div className="truncate">
                              <h4 className="font-bold text-sm text-white truncate">{item.title}</h4>
                              <p className="text-[10px] text-slate-400 uppercase mt-1 font-mono">
                                {new Date(item.created_at).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button type="button" onClick={() => setNewsForm({ id: item.id, title: item.title, content: item.content, image_url: item.image_url })} className="p-2 text-sky-400 hover:bg-sky-500/10 rounded-lg"><Edit2 size={14}/></button>
                            <button type="button" onClick={() => handleDeleteNews(item.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={14}/></button>
                          </div>
                        </div>
                      ))}
                      {newsList.length === 0 && (
                        <p className="text-center py-10 italic text-slate-400 text-sm">
                          {language === 'am' ? 'ምንም የዜና ማስታወቂያዎች አሁን የሉም።' : 'No news announcements are live right now.'}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* AUDIO ARCHIVE TAB */}
                {managerTab === 'audio' && (
                  <div className="space-y-8">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="font-bold text-lg text-white flex items-center gap-2">
                            <Music size={20} className="text-[#f97316]" />
                            {language === 'am' ? 'የድምጽ ቅጂ ስቀል' : 'Upload Audio Recording'}
                          </h3>
                          <p className="text-xs text-slate-400 mt-1">
                            {audioCount}/24 {language === 'am' ? 'ቅጂዎች ጥቅም ላይ ውለዋል' : 'recordings used'}
                          </p>
                        </div>
                        <div className={`px-3 py-1.5 rounded-full text-xs text-orange-500 font-black uppercase ${
                          audioCount >= 24 
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : audioCount >= 20
                            ? 'bg-amber-500/10 text-amber-400 border border-orange-500/20'
                            : 'bg-orange-500/10 text-green-400 border border-orange-500/20'
                        }`}>
                          {audioCount >= 24 ? (language === 'am' ? 'ሙሉ' : 'Full') : `${24 - audioCount} ${language === 'am' ? 'የቀረ' : 'remaining'}`}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1 font-mono">
                            {language === 'am' ? 'ርዕስ *' : 'Title *'}
                          </label>
                          <input
                            type="text"
                            value={audioForm.title}
                            onChange={(e) => setAudioForm({...audioForm, title: e.target.value})}
                            placeholder={language === 'am' ? 'የስብከት ርዕስ' : 'Sermon Title'}
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-lg outline-none text-white text-sm focus:border-[#f97316] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1 font-mono">
                            {language === 'am' ? 'ተናጋሪ *' : 'Speaker *'}
                          </label>
                          <input
                            type="text"
                            value={audioForm.speaker}
                            onChange={(e) => setAudioForm({...audioForm, speaker: e.target.value})}
                            placeholder={language === 'am' ? 'የተናጋሪ ስም' : 'Speaker Name'}
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-lg outline-none text-white text-sm focus:border-[#f97316] transition-colors"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1 font-mono">
                          {language === 'am' ? 'መግለጫ' : 'Description'}
                        </label>
                        <textarea
                          value={audioForm.description}
                          onChange={(e) => setAudioForm({...audioForm, description: e.target.value})}
                          placeholder={language === 'am' ? 'ስለ ስብከቱ አጭር መግለጫ...' : 'Brief description of the sermon...'}
                          rows={2}
                          className="w-full bg-white/5 border border-white/10 p-3 rounded-lg outline-none text-white text-sm focus:border-[#f97316] transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1 font-mono">
                            {language === 'am' ? 'የተሰበከበት ቀን *' : 'Date Preached *'}
                          </label>
                          <input
                            type="date"
                            value={audioForm.date_preached}
                            onChange={(e) => setAudioForm({...audioForm, date_preached: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-lg outline-none text-white text-sm focus:border-[#f97316] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1 font-mono">
                            {language === 'am' ? 'የድምጽ ፋይል *' : 'Audio File *'}
                          </label>
                          <input
                            id="audio-file-input"
                            type="file"
                            accept="audio/*"
                            onChange={handleAudioFileChange}
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-lg outline-none text-white text-sm focus:border-[#f97316] transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[#f97316]/20 file:text-[#f97316] hover:file:bg-[#f97316]/30 cursor-pointer"
                          />
                          {audioFile && (
                            <p className="text-xs text-slate-400 mt-1">
                              {language === 'am' ? 'የተመረጠው' : 'Selected'}: {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleAudioUpload}
                        disabled={audioUploading || !audioFile || !audioForm.title || !audioForm.speaker || !audioForm.date_preached}
                        className="mt-6 w-full py-3 bg-[#f97316] hover:bg-orange-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                      >
                        {audioUploading ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Upload size={18} />
                        )}
                        {audioUploading ? (language === 'am' ? 'በመስቀል ላይ...' : 'Uploading...') : (language === 'am' ? 'ቅጂ ስቀል' : 'Upload Recording')}
                      </button>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
                        <Music size={20} className="text-[#f97316]" />
                        {language === 'am' ? 'አሁን ያሉ ቅጂዎች' : 'Current Recordings'} ({audioFiles.length})
                      </h3>

                      {audioLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 size={30} className="animate-spin text-[#f97316]" />
                        </div>
                      ) : audioFiles.length === 0 ? (
                        <div className="text-center py-12 bg-white/5 border border-dashed border-white/10 rounded-2xl">
                          <Music size={40} className="text-slate-600 mx-auto mb-4" />
                          <p className="text-slate-400">
                            {language === 'am' ? 'እስካሁን ምንም ቅጂዎች አልተሰቀሉም።' : 'No recordings uploaded yet.'}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                          {audioFiles.map((item) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between hover:border-white/20 transition-colors"
                            >
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-white text-sm truncate">{item.title}</h4>
                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                                  <span>{item.speaker}</span>
                                  <span>•</span>
                                  <span>{new Date(item.date_preached).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}</span>
                                </div>
                                {item.description && (
                                  <p className="text-xs text-slate-500 mt-1 truncate">{item.description}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <a
                                  href={item.audio_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-2 text-slate-400 hover:text-[#f97316] transition-colors rounded-lg hover:bg-white/5"
                                >
                                  <Music size={16} />
                                </a>
                                <button
                                  type="button"
                                  onClick={() => handleAudioDelete(item.id)}
                                  className="p-2 text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-red-500/10"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>

                    <style jsx>{`
                      .custom-scrollbar::-webkit-scrollbar {
                        width: 4px;
                      }
                      .custom-scrollbar::-webkit-scrollbar-track {
                        background: rgba(255, 255, 255, 0.05);
                        border-radius: 4px;
                      }
                      .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #f97316;
                        border-radius: 4px;
                      }
                    `}</style>
                  </div>
                )}
              </div>
            )}

            {/* --- GUEST HOUSE MANAGER VIEW --- */}
            {isGuestHouseManager && (
              <div className="bg-zinc-950/45 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8 text-orange-400 border-b border-white/5 pb-4">
                  <Home size={28} />
                  <h2 className="text-2xl font-black uppercase tracking-tight font-display">
                    {language === 'am' ? 'የቆይታ ጥያቄዎች' : 'Stay Reservations'}
                  </h2>
                </div>

                <div className="space-y-4">
                  {reservations.length === 0 ? (
                    <div className="text-center py-20 text-slate-400 italic text-sm">
                      {language === 'am' ? 'ምንም የቆይታ ጥያቄዎች አልተገኙም።' : 'No reservation requests found.'}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {reservations.map(res => (
                        <div key={res.id} className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center justify-between transition-all hover:bg-white/10">
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-400">
                              <Clock size={20} />
                            </div>
                            <div>
                              <h4 className="font-bold text-base text-white">{res.full_name}</h4>
                              <p className="text-xs text-slate-400 uppercase font-mono mt-0.5">{res.package_id} • {res.arrival_date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              res.status === 'approved' ? 'bg-green-500/15 text-green-400 border border-green-500/30' : 
                              res.status === 'rejected' ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            }`}>
                              {res.status === 'approved' ? (language === 'am' ? 'ተፈቅዷል' : 'Approved') : 
                               res.status === 'rejected' ? (language === 'am' ? 'ውድቅ ተደርጓል' : 'Rejected') : 
                               (language === 'am' ? 'በመጠበቅ ላይ' : 'Pending')}
                            </span>
                            <button 
                              type="button"
                              onClick={() => { setSelectedReservation(res); setIsResModalOpen(true); }}
                              className="p-2.5 bg-white/5 rounded-xl text-slate-400 hover:text-orange-500 hover:bg-white/10 transition-colors"
                            >
                              <Eye size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SHARED PROFILE DATA CARD */}
            <div className="bg-zinc-950/45 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl max-w-4xl mx-auto">
              <div className="flex flex-col items-center mb-8 border-b border-white/5 pb-6">
                <div className="w-20 h-20 bg-gradient-to-tr from-[#f97316] to-amber-500 rounded-full flex items-center justify-center text-white text-3xl font-black mb-4 shadow-lg shadow-orange-500/20 font-display">
                  {userData.full_name?.charAt(0)}
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight font-display">{userData.full_name}</h3>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 font-mono">
                  {userData.assigned_service || userData.role}
                </span>

                <div className="flex gap-3 mt-6">
                  <button 
                    type="button"
                    onClick={() => isEditing ? handleUpdateProfile() : setIsEditing(true)}
                    disabled={updateLoading}
                    className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-md text-xs uppercase tracking-wider disabled:opacity-50"
                  >
                    {updateLoading ? (language === 'am' ? 'በማስቀመጥ ላይ...' : 'Saving...') : isEditing ? (language === 'am' ? 'ለውጦችን አስቀምጥ' : 'Save Changes') : (language === 'am' ? 'መገለጫ አርትዕ' : 'Edit Profile')}
                  </button>
                  {isEditing && (
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)} 
                      className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 transition-all"
                    >
                      {language === 'am' ? 'ተው' : 'Cancel'}
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EditableRow label={language === 'am' ? 'የተጠቃሚ ስም' : 'Username'} value={editForm.username} isEditing={isEditing} onChange={(v: string) => setEditForm({...editForm, username: v})} language={language} />
                <EditableRow label={language === 'am' ? 'ሙሉ ስም' : 'Full Name'} value={editForm.full_name} isEditing={isEditing} onChange={(v: string) => setEditForm({...editForm, full_name: v})} language={language} />
                <EditableRow label="Email" value={editForm.email} isEditing={isEditing} onChange={(v: string) => setEditForm({...editForm, email: v})} language={language} />
                <EditableRow label="Phone" value={editForm.phone} isEditing={isEditing} onChange={(v: string) => setEditForm({...editForm, phone: v})} language={language} />
                <EditableRow label={language === 'am' ? 'አድራሻ' : 'Address'} value={editForm.address} isEditing={isEditing} onChange={(v: string) => setEditForm({...editForm, address: v})} language={language} />
                <EditableRow label={language === 'am' ? 'ዕድሜ' : 'Age'} value={editForm.age} isEditing={isEditing} onChange={(v: string) => setEditForm({...editForm, age: v})} language={language} />
                <InfoRow label={language === 'am' ? 'ፆታ' : 'Gender'} value={userData.gender} language={language} />
                <InfoRow label={language === 'am' ? 'ሚና' : 'Role'} value={userData.role} language={language} />
              </div>
            </div>

          </div>
        )}

      </main>

      {/* FLOATING FROSTED GLASSMORPHIC NAVIGATOR MENU */}
<nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-auto max-w-[95%] sm:max-w-none px-2 sm:px-0">
  <div className="bg-zinc-950/40 backdrop-blur-3xl px-3 sm:px-5 py-2 sm:py-3 rounded-full shadow-[0_24px_50px_rgba(0,0,0,0.8)] flex items-center justify-center border border-white/10 w-full sm:w-auto">
    <div className="relative flex items-center gap-3 sm:gap-6 pr-3 sm:pr-6 border-r border-white/10">
      {/* Sliding dynamic marker - update the translate positions */}
      <div className={`absolute left-0 w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-tr from-[#f97316] to-amber-500 rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0 shadow-lg shadow-orange-500/25
          ${activeTab === 'calendar' ? 'translate-x-0' : ''}
          ${activeTab === 'church' ? 'translate-x-[52px] sm:translate-x-[72px]' : ''}
          ${activeTab === 'messages' ? 'translate-x-[104px] sm:translate-x-[144px]' : ''}
          ${activeTab === 'profileInfo' ? 'translate-x-[156px] sm:translate-x-[216px]' : ''}
        `} 
      />
      <NavBtn icon="calendar" active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} language={language} />
      <NavBtn icon="church" active={activeTab === 'church'} onClick={() => setActiveTab('church')} language={language} />
      {/* Changed from 'profile' to 'messages' */}
      <NavBtn icon="messages" active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} language={language} />
      <NavBtn icon="info" active={activeTab === 'profileInfo'} onClick={() => setActiveTab('profileInfo')} language={language} />
    </div>
    
    <button type="button" onClick={handleLogout} className="ml-3 sm:ml-4 p-2 text-slate-400 hover:text-red-400 transition-colors" title={language === 'am' ? 'ውጣ' : 'Logout'}>
      <LogOut size={22} className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
    </button>
  </div>
</nav>

    </div>
  );
}

// --- HELPER SUBCOMPONENTS ---
function InfoRow({ label, value, language }: { label: string, value: any, language: string }) {
  return (
    <div className="flex flex-col pb-3 border-b border-white/5 font-sans">
      <span className="text-slate-400 text-xs font-black uppercase tracking-wider font-mono">{label}</span>
      <span className="text-white mt-1.5 capitalize text-sm font-semibold">{value || (language === 'am' ? 'የለም' : 'N/A')}</span>
    </div>
  );
}

function EditableRow({ label, value, isEditing, onChange, language }: any) {
  return (
    <div className="flex flex-col pb-3 border-b border-white/5 font-sans">
      <span className="text-slate-400 text-xs font-black uppercase tracking-wider font-mono">{label}</span>
      {isEditing ? (
        <input 
          type="text" 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)} 
          className="mt-1.5 bg-white/5 border border-[#f97316] text-white px-3 py-2 rounded-xl outline-none text-sm font-semibold transition-all focus:ring-1 focus:ring-[#f97316]" 
        />
      ) : (
        <span className="text-white mt-1.5 text-sm font-semibold">{value || (language === 'am' ? 'የለም' : 'N/A')}</span>
      )}
    </div>
  );
}

function NavBtn({ icon, active, onClick, language }: any) {
  const icons: any = {
    calendar: <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5v-5z" />,
    church: <path d="M12 2L2 12h3v8h14v-8h3L12 2zm0 2.83L16.17 9H7.83L12 4.83zM12 11c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"/>,
    // Changed profile icon to message icon
    messages: <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>,
    info: <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94 0 .31.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-2 0-3.6-1.6-3.6-3.6s1.6-3.6 3.6-3.6 3.6 1.6 3.6 3.6-1.6 3.6-3.6 3.6z"/>
  };
  
  const labels: any = {
    calendar: language === 'am' ? 'የቀን መቁጠሪያ' : 'Calendar',
    church: language === 'am' ? 'ቤተ ክርስቲያን' : 'Church',
    // Changed from 'Profile' to 'Messages'
    messages: language === 'am' ? 'መልዕክቶች' : 'Messages',
    info: language === 'am' ? 'ዝርዝር' : 'Info'
  };
  
  return (
    <button 
      type="button"
      onClick={onClick} 
      className={`relative w-10 sm:w-12 h-10 sm:h-12 flex flex-col items-center justify-center z-10 transition-colors ${active ? 'text-white' : 'text-slate-400'}`}
      title={labels[icon]}
    >
      <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="currentColor" viewBox="0 0 24 24">{icons[icon]}</svg>
      <span className="text-[5px] sm:text-[6px] font-bold uppercase tracking-widest mt-0.5">{labels[icon]}</span>
    </button>
  );
}