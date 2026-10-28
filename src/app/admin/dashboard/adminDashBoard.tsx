"use client";

/* eslint-disable @typescript-eslint/no-explicit-any -- Existing Supabase action payloads are dynamically shaped; keep their current runtime behavior while resolving the project lint gate. */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, Search, Plus, X, Eye, ShieldCheck, 
  Clock, Calendar as CalendarIcon, ChevronRight, 
  UserCheck, UserMinus, ShieldAlert, Trash2,
  Inbox, Check, Ban, Edit2, Save, UserPlus, Key, Star, Package, Upload, ChevronLeft,
  LogOut
} from 'lucide-react';

import { supabase } from "@/lib/supabaseClient";
import { getMessages, deleteMessage } from '@/lib/messageActions';
import { EthDateTime } from "ethiopian-calendar-date-converter";

// Actions
import { 
  getPendingRequests, 
  updateRequestStatus, 
  getAllUsers, 
  createAdminUser, 
  updateUser, 
  deleteUser,
  getSubAdmins,
  promoteToSubAdmin,
  demoteToUser, 
  getInventory,
  deleteInventoryItem,
  upsertInventoryItem,
  getLeaderFrontendCards,
  upsertLeaderFrontendCard,
  deleteLeaderFrontendCard,
  uploadLeaderImage
} from "@/lib/adminActions";

import { 
  getEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} from "@/lib/eventActions";

type TabType = 'dashboard' | 'users' | 'events' | 'requests' | 'sub-admins' | 'inventory' | 'leaders';

const SERVICE_COLORS: any = {
  'Prayer': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', hex: '#10b981' },
  'Youth': { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20', hex: '#ec4899' },
  'Worship & Stage': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', hex: '#ef4444' },
  'Kids': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', hex: '#f59e0b' },
  'Special Event': { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20', hex: '#6366f1' },
  'Evangelism': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', hex: '#3b82f6' },
  'Decon & Social service': { bg: 'bg-rose-950/20', text: 'text-rose-300', border: 'border-rose-900/30', hex: '#9f1239' },
  'Church Leaders': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', hex: '#d97706' },
};

const INVENTORY_CATEGORIES = [
  'Musical instruments', 
  'Electronic appliances', 
  'Kitchen appliances', 
  'Church hall Equipment', 
  'Guest house Equipment', 
  'Construction Equipment', 
  'Office equipment'
];

const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WEEKDAYS_EN = ["S", "M", "T", "W", "T", "F", "S"];

const ETH_MONTHS = [
  "መስከረም", "ጥቅምት", "ኅዳር", "ታኅሣሥ", "ጥር", "የካቲት", "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ"
];

const WEEKDAYS_ET = ["እሑድ", "ሰኞ", "ማክ", "ረቡ", "ሐሙ", "ዓር", "ቅዳ"];

// --- SHARED MODAL OVERLAY ---
const ModalOverlay = ({ children, onClose, maxWidth = "max-w-2xl" }: { children: React.ReactNode, onClose: () => void, maxWidth?: string }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
    <div className={`relative w-full ${maxWidth} bg-zinc-950/95 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 text-white max-h-[90vh] flex flex-col`}>
      {children}
    </div>
  </div>
);

// --- CREATE USER MODAL ---
const CreateUserModal = ({ isOpen, onClose, onSave }: any) => {
  const [formData, setFormData] = useState({
    full_name: "", username: "", email: "", password: "", phone: "", 
    gender: "Male", marital_status: "Single", age: "", city: "", subcity: "", woreda: "",
    previous_church: "", baptism_date: "", baptism_place: "Madan"
  });

  if (!isOpen) return null;

  const fieldStyle = "w-full bg-white/5 border border-white/10 focus:border-[#f97316] rounded-xl px-4 py-2.5 outline-none transition-all text-sm font-medium text-white focus:ring-1 focus:ring-[#f97316]";
  const labelStyle = "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block";

  return (
    <ModalOverlay onClose={onClose}>
      <div className="p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight font-display">Manual Member Registration</h2>
            <p className="text-sm text-slate-400">Create a permanent account and login credentials</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"><X /></button>
        </div>
        
        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Full Name *</label>
              <input required className={fieldStyle} value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
            </div>
            <div>
              <label className={labelStyle}>Username *</label>
              <input required className={fieldStyle} value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Email Address *</label>
              <input required type="email" className={fieldStyle} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label className={labelStyle}>Login Password *</label>
              <div className="relative">
                <input required type="text" className={fieldStyle} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                <Key className="absolute right-3 top-3 text-slate-500" size={16} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Phone Number *</label>
              <input required className={fieldStyle} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div>
              <label className={labelStyle}>Age</label>
              <input type="number" className={fieldStyle} value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Gender</label>
              <select className={fieldStyle} value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                <option value="Male" className="bg-zinc-900">Male</option>
                <option value="Female" className="bg-zinc-900">Female</option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>Marital Status</label>
              <select className={fieldStyle} value={formData.marital_status} onChange={e => setFormData({...formData, marital_status: e.target.value})}>
                <option value="Single" className="bg-zinc-900">Single</option>
                <option value="Married" className="bg-zinc-900">Married</option>
                <option value="Divorced" className="bg-zinc-900">Divorced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelStyle}>City</label>
              <input required className={fieldStyle} value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
            </div>
            <div>
              <label className={labelStyle}>Subcity</label>
              <input required className={fieldStyle} value={formData.subcity} onChange={e => setFormData({...formData, subcity: e.target.value})} />
            </div>
            <div>
              <label className={labelStyle}>Woreda</label>
              <input required className={fieldStyle} value={formData.woreda} onChange={e => setFormData({...formData, woreda: e.target.value})} />
            </div>
          </div>
          <div>
            <label className={labelStyle}>Previous Church (Optional)</label>
            <input className={fieldStyle} value={formData.previous_church} onChange={e => setFormData({...formData, previous_church: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Baptism Date</label>
              <input type="date" className={fieldStyle} value={formData.baptism_date} onChange={e => setFormData({...formData, baptism_date: e.target.value})} />
            </div>
            <div>
              <label className={labelStyle}>Baptism Place</label>
              <select className={fieldStyle} value={formData.baptism_place} onChange={e => setFormData({...formData, baptism_place: e.target.value})}>
                <option value="Madan" className="bg-zinc-900">Madan</option>
                <option value="Other" className="bg-zinc-900">Other</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white/5 text-slate-400 hover:text-white rounded-2xl font-bold transition-all text-xs uppercase tracking-wider">
              Cancel
            </button>
            <button type="submit" className="flex-2 w-full py-4 bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white rounded-2xl font-bold hover:brightness-110 transition-all shadow-lg shadow-orange-500/15 text-xs uppercase tracking-wider">
              Create Member & Auth Login
            </button>
          </div>
        </form>
      </div>
    </ModalOverlay>
  );
};

// --- INVENTORY MODAL ---
const InventoryModal = ({ isOpen, onClose, item, onSave, onDelete }: any) => {
  const [formData, setFormData] = React.useState({ name: '', description: '', category: INVENTORY_CATEGORIES[0], quantity: 1 });

  React.useEffect(() => {
    if (item) setFormData(item);
    else setFormData({ name: '', description: '', category: INVENTORY_CATEGORIES[0], quantity: 1 });
  }, [item, isOpen]);

  if (!isOpen) return null;

  const fieldStyle = "w-full bg-white/5 border border-white/10 focus:border-[#f97316] rounded-xl px-4 py-3 outline-none text-white focus:ring-1 focus:ring-[#f97316] transition-all text-sm font-medium";

  return (
    <ModalOverlay onClose={onClose} maxWidth="max-w-md">
      <div className="p-8">
        <h2 className="text-2xl font-black mb-6 tracking-tight text-white font-display uppercase">{item?.id ? 'Item Details' : 'Add to Inventory'}</h2>
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Item Name</label>
                <input required className={fieldStyle} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantity</label>
                <input required type="number" className={fieldStyle} value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
            <select className={fieldStyle} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              {INVENTORY_CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-zinc-900">{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
            <textarea className={fieldStyle} rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="flex gap-3 pt-4 border-t border-white/5">
            {item?.id && (
              <button type="button" onClick={() => onDelete(item.id)} className="p-4 bg-red-950/20 text-red-400 border border-red-500/20 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all"><Trash2 size={20}/></button>
            )}
            <button type="submit" className="flex-1 py-4 bg-[#f97316] hover:bg-orange-600 text-white rounded-2xl font-bold shadow-lg shadow-orange-500/15 transition-all text-xs uppercase tracking-wider">
               {item?.id ? 'Save Changes' : 'Register Item'}
            </button>
          </div>
        </form>
      </div>
    </ModalOverlay>
  );
};

// --- REQUEST DETAIL MODAL ---
const RequestDetailModal = ({ isOpen, request, onClose, onUpdate }: any) => {
  if (!isOpen || !request) return null;
  
  const InfoBlock = ({ label, value }: { label: string, value: string }) => (
    <div className="space-y-1">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">{label}</p>
      <p className="text-sm font-bold text-white">{value || 'Not provided'}</p>
    </div>
  );

  return (
    <ModalOverlay onClose={onClose}>
      <div className="p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight font-display uppercase">Membership Request</h2>
            <p className="text-[#f97316] text-xs font-black uppercase tracking-wider mt-0.5">New account verification</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"><X size={24}/></button>
        </div>

        <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-10">
          <InfoBlock label="Full Name" value={request.full_name} />
          <InfoBlock label="Email Address" value={request.email} />
          <InfoBlock label="Phone" value={request.phone} />
          <InfoBlock label="Gender" value={request.gender} />
          <InfoBlock label="Marital Status" value={request.marital_status} />
          <InfoBlock label="Age" value={request.age} />
          <InfoBlock label="Baptism Date" value={request.baptism_date} />
          <InfoBlock label="Baptism Place" value={request.baptism_place} />
          <div className="col-span-2">
            <InfoBlock label="Previous Church" value={request.previous_church} />
          </div>
          <div className="col-span-2 grid grid-cols-3 gap-4">
            <InfoBlock label="City" value={request.city} />
            <InfoBlock label="Sub-City" value={request.subcity} />
            <InfoBlock label="Woreda" value={request.woreda} />
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            type="button"
            onClick={() => onUpdate(request.id, 'rejected')}
            className="flex-1 py-4 bg-red-950/30 text-red-400 border border-red-500/20 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all group text-xs uppercase tracking-wider"
          >
            <Ban size={18} className="group-hover:scale-110 transition-transform" /> Reject Request
          </button>
          <button 
            type="button"
            onClick={() => onUpdate(request.id, 'approved')}
            className="flex-1 py-4 bg-[#f97316] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 shadow-lg shadow-orange-500/15 transition-all group text-xs uppercase tracking-wider"
          >
            <Check size={18} className="group-hover:scale-110 transition-transform" /> Approve Member
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};

// --- USER DETAIL MODAL - FIXED for fluid editing ---
const UserDetailModal = ({ isOpen, user, onClose, onEdit, onDelete }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<any>(null);

  // Reset editedUser when user changes
  useEffect(() => {
    if (user) {
      setEditedUser({ ...user });
      setIsEditing(false);
    }
  }, [user]);

  if (!isOpen || !user || !editedUser) return null;

  const InfoBlock = ({ label, value, editKey, isEditingEnabled }: any) => (
    <div className="space-y-1">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">{label}</p>
      {isEditingEnabled && isEditing ? (
        <input 
          type="text" 
          className="w-full text-sm font-bold text-white bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] outline-none transition-all"
          value={editedUser[editKey] || ''} 
          onChange={(e) => setEditedUser({...editedUser, [editKey]: e.target.value})}
        />
      ) : (
        <p className="text-sm font-bold text-white">{value || 'Not provided'}</p>
      )}
    </div>
  );

  const handleSave = () => {
    onEdit(user.id, editedUser);
    setIsEditing(false);
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight font-display uppercase">Member Details</h2>
            <p className="text-[#f97316] text-xs font-black uppercase tracking-wider mt-0.5">
              {user.assigned_service === 'Church Leaders' ? 'Church Leader' : user.role === 'admin' ? 'Administrator' : user.role === 'sub-admin' ? 'Management' : 'Member'}
            </p>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <button type="button" onClick={() => setIsEditing(true)} className="p-2 hover:bg-white/10 rounded-full text-slate-300 transition-colors">
                <Edit2 size={20} />
              </button>
            ) : (
              <>
                <button type="button" onClick={handleSave} className="p-2 hover:bg-emerald-500/20 rounded-full text-emerald-400 transition-colors">
                  <Save size={20} />
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className="p-2 hover:bg-red-500/20 rounded-full text-red-400 transition-colors">
                  <X size={20} />
                </button>
              </>
            )}
            <button type="button" onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-10">
          <InfoBlock label="Full Name" value={editedUser.full_name} editKey="full_name" isEditingEnabled={true} />
          <InfoBlock label="Email Address" value={editedUser.email} editKey="email" isEditingEnabled={true} />
          <InfoBlock label="Phone" value={editedUser.phone} editKey="phone" isEditingEnabled={true} />
          <InfoBlock label="Gender" value={editedUser.gender} editKey="gender" isEditingEnabled={true} />
          <InfoBlock label="Marital Status" value={editedUser.marital_status} editKey="marital_status" isEditingEnabled={true} />
          <InfoBlock label="Age" value={editedUser.age} editKey="age" isEditingEnabled={true} />
          <div className="col-span-2">
            <InfoBlock label="Previous Church" value={editedUser.previous_church} editKey="previous_church" isEditingEnabled={true} />
          </div>
          <InfoBlock label="Baptism Date" value={editedUser.baptism_date} editKey="baptism_date" isEditingEnabled={true} />
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Baptism Place</p>
            {isEditing ? (
              <select className="w-full text-sm font-bold text-white bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none" value={editedUser.baptism_place || 'Madan'} onChange={(e) => setEditedUser({...editedUser, baptism_place: e.target.value})}>
                <option value="Madan" className="bg-zinc-900">Madan</option>
                <option value="Other" className="bg-zinc-900">Other</option>
              </select>
            ) : <p className="text-sm font-bold text-white">{editedUser.baptism_place || 'Not provided'}</p>}
          </div>
          <div className="col-span-2">
            <InfoBlock label="Address" value={editedUser.address} editKey="address" isEditingEnabled={true} />
          </div>
          {user.role === 'sub-admin' && (
          <div className="col-span-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Assigned Roles</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {user.assigned_service?.map((service: string) => (
                <span key={service} className="px-2 py-0.5 bg-[#f97316]/20 text-[#f97316] text-xs font-black rounded-full">
                  {service}
                </span>
              ))}
            </div>
          </div>
        )}
        </div>

        <div className="flex gap-4">
          <button 
            type="button"
            onClick={() => { if(confirm(`Delete ${user.full_name}?`)) onDelete(user.id); }}
            className="flex-1 py-4 bg-red-950/20 border border-red-500/20 text-red-400 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all group text-xs uppercase tracking-wider"
          >
            <Trash2 size={18} /> Delete Member
          </button>
          {!isEditing ? (
            <button 
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex-1 py-4 bg-[#f97316] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 shadow-lg shadow-orange-500/15 transition-all group text-xs uppercase tracking-wider"
            >
              <Edit2 size={18} /> Edit Member
            </button>
          ) : (
            <button 
              type="button"
              onClick={handleSave}
              className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all group text-xs uppercase tracking-wider"
            >
              <Save size={18} /> Save Changes
            </button>
          )}
        </div>
      </div>
    </ModalOverlay>
  );
};

// --- DAY VIEW MODAL ---
const DayViewModal = ({ isOpen, date, events, onClose, onEditEvent, onAddEvent }: any) => {
  if (!isOpen) return null;

  const hasFullAudienceEvent = events.some((ev: any) => ev.audience_type === 'Full');

  return (
    <ModalOverlay onClose={onClose} maxWidth="max-w-lg">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">Events for</h3>
            <p className="text-[#f97316] font-semibold text-sm">
              {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { dateStyle: 'full' })}
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"><X size={20}/></button>
        </div>
        <div className="space-y-3 max-h-[400px] overflow-y-auto mb-6 pr-2">
          {events.length > 0 ? (
            events.map((ev: any) => {
              const theme = SERVICE_COLORS[ev.service_type] || SERVICE_COLORS['Special Event'];
              return (
                <div 
                  key={ev.id} 
                  onClick={() => onEditEvent(ev)} 
                  className={`flex items-center justify-between p-4 rounded-2xl border ${theme.bg} ${theme.border} cursor-pointer hover:scale-[1.02] transition-transform`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: theme.hex }} />
                    <div>
                      <h4 className="font-bold text-white text-sm" style={{ color: theme.hex }}>{ev.title}</h4>
                      <div className="flex items-center text-xs text-slate-400 space-x-2 mt-1 font-mono">
                        <Clock size={12} className="text-[#f97316]" /> 
                        <span>{ev.start_time} - {ev.end_time}</span>
                        {ev.audience_type === 'Full' && (
                          <span className="ml-2 px-2 py-0.5 text-[8px] font-black uppercase rounded bg-red-500/20 text-red-400 border border-red-500/30">
                            Full Audience
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-400" size={18} />
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-slate-500 italic">No events scheduled for this day.</div>
          )}
        </div>

        <button 
          type="button"
          onClick={() => onAddEvent(date)} 
          disabled={hasFullAudienceEvent} 
          className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all text-xs uppercase tracking-wider
            ${hasFullAudienceEvent 
              ? 'bg-zinc-800 text-slate-500 cursor-not-allowed border border-white/5' 
              : 'bg-[#f97316] text-white hover:bg-orange-600 shadow-lg shadow-orange-500/10 active:scale-[0.98]'} 
          `}
        >
          <Plus size={18} /> 
          <span>{hasFullAudienceEvent ? 'Day Fully Booked' : 'Add New Event'}</span>
        </button>
      </div>
    </ModalOverlay>
  );
};

// --- EVENT FORM MODAL ---
const EventFormModal = ({ isOpen, onClose, formData, onInputChange, onSave, onDelete, mode }: any) => {
  if (!isOpen) return null;
  const fieldStyle = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] transition-all text-sm font-medium";
  return (
    <ModalOverlay onClose={onClose} maxWidth="max-w-md">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-extrabold text-white tracking-tight font-display uppercase">{mode === 'create' ? 'Schedule Event' : 'Modify Event'}</h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white"><X size={20}/></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="space-y-5">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 font-mono">Title</label>
            <input className={fieldStyle} placeholder="e.g. Sunday Morning Service" value={formData.title} onChange={(e) => onInputChange('title', e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 font-mono">Date</label>
              <input type="date" className={fieldStyle} value={formData.event_date} onChange={(e) => onInputChange('event_date', e.target.value)} required />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 font-mono">Category</label>
              <select className={fieldStyle} value={formData.service_type} onChange={(e) => onInputChange('service_type', e.target.value)}>
                {Object.keys(SERVICE_COLORS).map(type => <option key={type} value={type} className="bg-zinc-900">{type}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 font-mono">Starts</label>
              <input type="time" className={fieldStyle} value={formData.start_time} onChange={(e) => onInputChange('start_time', e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 font-mono">Ends</label>
              <input type="time" className={fieldStyle} value={formData.end_time} onChange={(e) => onInputChange('end_time', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 font-mono">Description</label>
            <textarea className={fieldStyle} rows={2} placeholder="Brief summary..." value={formData.description} onChange={(e) => onInputChange('description', e.target.value)} />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 font-mono">Event Reach</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
                <button 
                  type="button"
                  onClick={() => onInputChange('audience_type', 'Partial')}
                  className={`py-3 rounded-xl font-bold text-xs uppercase border transition-all ${formData.audience_type === 'Partial' ? 'bg-[#f97316] text-white border-[#f97316] shadow-lg shadow-orange-500/15' : 'bg-white/5 text-slate-400 border-white/10'}`}
                >
                  Partial Audience
                </button>
                <button 
                  type="button"
                  onClick={() => onInputChange('audience_type', 'Full')}
                  className={`py-3 rounded-xl font-bold text-xs uppercase border transition-all ${formData.audience_type === 'Full' ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-500/15' : 'bg-white/5 text-slate-400 border-white/10'}`}
                >
                  Full Audience (Block Day)
                </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 italic font-mono">
              * Full Audience events prevent any other scheduling on this date.
            </p>
          </div>
          <div className="flex justify-between items-center pt-4">
            {mode === 'edit' ? (
              <button type="button" onClick={() => onDelete(formData.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-md text-xs uppercase tracking-wider">
                Delete Event
              </button>
            ) : <div />}
            <button type="submit" className="px-10 m-1 py-3 bg-[#f97316] text-white rounded-xl font-bold shadow-lg shadow-orange-500/15 hover:bg-orange-600 transition-all text-xs uppercase tracking-wider">
              {mode === 'create' ? 'Save Event' : 'Update Changes'}
            </button>
          </div>
        </form>
      </div>
    </ModalOverlay>
  );
};

// --- MAIN DASHBOARD ---
const AdminDashboard: React.FC = () => {
  const router = useRouter();

  // --- Auth & User State ---
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // --- UI/Navigation States ---
  const [activeTab, setActiveTab] = useState<TabType>('events');
  const [searchQuery, setSearchQuery] = useState('');

  // --- Operational Data States ---
  const [users, setUsers] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [subAdmins, setSubAdmins] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [leaders, setLeaders] = useState<any[]>([]);

  // --- Message States ---
  const [messages, setMessages] = useState<any[]>([]);
  const [isMessagesPanelOpen, setIsMessagesPanelOpen] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isOpen: boolean } | null>(null);
  
  useEffect(() => {
  if (toast?.isOpen) {
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }
}, [toast]);

  // Modal Visibility States
  const [isRequestDetailModalOpen, setIsRequestDetailModalOpen] = useState(false);
  const [isUserDetailModalOpen, setIsUserDetailModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isDayViewOpen, setIsDayViewOpen] = useState(false);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isLeaderModalOpen, setIsLeaderModalOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  // Form Management States
  const [eventModalMode, setEventModalMode] = useState<'create' | 'edit'>('create');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<any>(null);
  const [selectedLeader, setSelectedLeader] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [serviceToAssign, setServiceToAssign] = useState('Youth');
  const [eventForm, setEventForm] = useState({ id: "", title: "", description: "", event_date: "", start_time: "", end_time: "", service_type: "Special Event", audience_type: "Partial"});
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [leaderFormData, setLeaderFormData] = useState({
    name: '',
    title: '',
    image_url: '',
    order: 0,
    is_active: true
  });

  const ALL_ROLES = [
  ...Object.keys(SERVICE_COLORS),
  'Church Leaders',
  'Frontend Manager',
  'Finance Manager',
  'Guest House manager'
];

  // Custom Calendar state
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(new Date());
  const [isEthiopianCalendar, setIsEthiopianCalendar] = useState(false);
  const [calendarKey, setCalendarKey] = useState(0);

  // Language state (default to English)
  const [language, setLanguage] = useState<'en' | 'am'>('en');

  // --- Message Functions ---
  const fetchMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const result = await getMessages();
      if (result.success) {
        setMessages(result.data || []);
        setMessageCount(result.data?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    
    try {
      const result = await deleteMessage(id);
      if (result.success) {
        setMessages(prev => prev.filter(m => m.id !== id));
        setMessageCount(prev => prev - 1);
        showAlert('Message deleted', 'success');
      } else {
        showAlert('Failed to delete message', 'error');
      }
    } catch (error) {
      showAlert('Error deleting message', 'error');
    }
  };

  // Unified Mount logic to pull Supabase User details securely
  useEffect(() => {
    const loadSessionAndData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUserId(user.id);
          
          // Fetch user details from profile
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profile) {
            setCurrentUser(profile);
          }
        } else {
          router.push('/admin/login');
        }
      } catch (err) {
        console.error("Session lookup error:", err);
        router.push('/admin/login');
      }
    };
    
    loadSessionAndData();
    fetchData();
    fetchLeaders();
  }, [router]);

  // Fetch metrics and records
  const fetchData = async () => {
    try {
      const [uData, rData, eData, sData, iData] = await Promise.all([
          getAllUsers(), 
          getPendingRequests(), 
          getEvents(), 
          getSubAdmins(),
          getInventory()
      ]);
      setUsers(uData || []); 
      setRequests(rData || []); 
      setEvents(eData || []); 
      setSubAdmins(sData || []);
      setInventory(iData || []); 
    } catch (e) { 
      console.error("Data fetch exception:", e); 
    }
  };

  const fetchLeaders = async () => {
    try {
      const data = await getLeaderFrontendCards();
      setLeaders(data || []);
    } catch (error) {
      console.error('Error fetching leaders:', error);
    }
  };

  // Logout function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const showAlert = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type, isOpen: true });
  };

  const handleManualCreateUser = async (formData: any) => {
    try { 
      await createAdminUser(formData); 
      setIsCreateUserModalOpen(false); 
      fetchData(); 
      showAlert("Member registered successfully!", "success"); 
    } catch (err: any) { 
      showAlert("Error: " + err.message, "error"); 
    }
  };

  const handleEditUser = async (userId: string, updatedData: any) => {
    try { 
      await updateUser(userId, updatedData); 
      await fetchData(); 
      setIsUserDetailModalOpen(false); 
      setSelectedUser(null); 
      showAlert("Member updated!", "success"); 
    } catch (err) { 
      showAlert("Update failed.", "error"); 
    }
  };
  
  const handleSaveInventory = async (formData: any) => {
    try {
      await upsertInventoryItem(formData);
      setIsInventoryModalOpen(false);
      fetchData();
      showAlert("Inventory updated successfully!", "success");
    } catch (e) {
      showAlert("Inventory save failed.", "error");
    }
  };

  const handleDeleteInventory = async (id: string) => {
    if(confirm("Delete this item from inventory?")) {
      try {
        await deleteInventoryItem(id);
        setIsInventoryModalOpen(false);
        fetchData();
        showAlert("Inventory item deleted.", "success");
      } catch (e) {
        showAlert("Deletion failed.", "error");
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try { 
      await deleteUser(userId); 
      await fetchData(); 
      showAlert("Member deleted.", "success"); 
    } catch (err) { 
      showAlert("Deletion failed.", "error"); 
    }
  };

  const handleStatusUpdate = async (id: string, status: "approved" | "rejected") => {
    try {
      const request = requests.find((r) => r.id === id);
      await updateRequestStatus(id, status);

      if (request) {
        const userData = {
          full_name: request.full_name,
          email: request.email,
          username: request.username,
          password: "the password you created during registration",
        };

        await fetch("/api/admin/member-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: status,
            user: userData,
          }),
        });
      }

      setIsRequestDetailModalOpen(false);
      setSelectedRequest(null);
      fetchData();
      showAlert(`Request ${status} successfully and email sent.`, "success");
    } catch (e) {
      showAlert("Update failed: " + (e as Error).message, "error");
    }
  };

  const handleSaveEvent = async () => {
    try {
      const userRole = currentUser?.role || 'user';
      console.log('Saving event with role:', userRole);

      if (eventModalMode === 'create') {
        const { id, ...payload } = eventForm;
        await createEvent(payload, currentUserId!);
      } else {
        await updateEvent(eventForm.id, eventForm, currentUserId!, userRole);
      }

      setIsEventModalOpen(false);
      fetchData();
      showAlert("Success!", "success");
    } catch (err: any) {
      console.error('Event save error:', err);
      showAlert(err.message, "error"); 
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await deleteEvent(id, currentUserId!);
      setIsEventModalOpen(false);
      fetchData();
      showAlert("Event deleted successfully", "success");
    } catch (err: any) {
      console.error('Delete error:', err);
      showAlert(err.message, "error"); 
    }
  };

  const handleSaveLeader = async () => {
    if (!leaderFormData.name || !leaderFormData.title) {
      showAlert('Please fill in name and title', 'error');
      return;
    }
    
    try {
      let imageUrl = leaderFormData.image_url;
      
      if (selectedImageFile) {
        if (imageUrl && imageUrl.startsWith('data:image')) {
          const fileExt = selectedImageFile.name.split('.').pop();
          const fileName = `leader-${Date.now()}.${fileExt}`;
          const uploadedUrl = await uploadLeaderImage(selectedImageFile, fileName);
          imageUrl = uploadedUrl;
        }
      }
      
      await upsertLeaderFrontendCard(selectedLeader ? { 
        ...leaderFormData, 
        id: selectedLeader.id,
        image_url: imageUrl 
      } : { 
        ...leaderFormData, 
        image_url: imageUrl 
      });
      
      setIsLeaderModalOpen(false);
      setSelectedLeader(null);
      setLeaderFormData({ name: '', title: '', image_url: '', order: 0, is_active: true });
      setSelectedImageFile(null);
      fetchLeaders();
      showAlert('Leader saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving leader:', error);
      showAlert('Failed to save leader', 'error');
    }
  };  

  const handleDeleteLeader = async (id: string) => {
    if (confirm('Are you sure you want to delete this leader?')) {
      try {
        await deleteLeaderFrontendCard(id);
        fetchLeaders();
        showAlert('Leader deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting leader:', error);
        showAlert('Failed to delete leader', 'error');
      }
    }
  };

  const handleEditLeader = (leader: any) => {
    setSelectedLeader(leader);
    setLeaderFormData({
      name: leader.name,
      title: leader.title,
      image_url: leader.image_url || '',
      order: leader.order,
      is_active: leader.is_active
    });
    setIsLeaderModalOpen(true);
  };

  const openAddEventFromDay = (date: string) => { 
    setEventModalMode('create'); 
    setEventForm({ id: "", title: "", description: "", event_date: date, start_time: "09:00", end_time: "11:00", service_type: "Special Event" ,audience_type: "Partial"}); 
    setIsDayViewOpen(false); 
    setIsEventModalOpen(true); 
  };

  const openEditEventFromDay = (ev: any) => { 
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
    setIsDayViewOpen(false); 
    setIsEventModalOpen(true); 
  };

  const handlePromote = async () => {
  try {
    await promoteToSubAdmin(selectedUser.id, selectedRoles);
    setIsPromoteModalOpen(false);
    setSelectedUser(null);
    setSelectedRoles([]);
    fetchData();
    showAlert("Roles assigned successfully!", "success");
  } catch (e) {
    showAlert("Promotion failed", "error");
  }
};

  const handleDemote = async (id: string) => { 
    if (confirm("Remove role privileges?")) { 
      await demoteToUser(id); 
      fetchData(); 
      showAlert("Role privileges demoted.", "success");
    } 
  };

  // Custom Calendar Logics
  const formatDateStr = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
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
      const dateStr = formatDateStr(d.getFullYear(), d.getMonth(), d.getDate());
      grid.push({ dayNum, isCurrentMonth: false, dateStr, dateObj: d });
    }
    
    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(year, month, i);
      const dateStr = formatDateStr(d.getFullYear(), d.getMonth(), d.getDate());
      grid.push({ dayNum: i, isCurrentMonth: true, dateStr, dateObj: d });
    }
    
    const remaining = 42 - grid.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      const dateStr = formatDateStr(d.getFullYear(), d.getMonth(), d.getDate());
      grid.push({ dayNum: i, isCurrentMonth: false, dateStr, dateObj: d });
    }
    
    return grid;
  };

  const getEthiopianDate = (date: Date) => {
    try {
      const eth = EthDateTime.fromEuropeanDate(date);
      return {
        year: eth.year,
        month: ETH_MONTHS[eth.month - 1],
        day: eth.date,
      };
    } catch (e) {
      return { year: 2018, month: ETH_MONTHS[0], day: 1 };
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
    setCalendarKey(prev => prev + 1);
  };

  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setIsDayViewOpen(true);
  };

const availableUsers = users.filter(u => u.role !== 'admin');
const churchLeaders = subAdmins.filter(a => a.assigned_service?.includes('Church Leaders'));
const systemManagers = subAdmins.filter(a => a.assigned_service?.some((s: string) => s !== 'Church Leaders'));

  const isAdmin = currentUser?.role === 'admin';
  const canManageEvents = true; // Admin always has full permissions
  const hasPendingRequests = requests.length > 0;

  return (
    <div className="flex h-screen bg-zinc-950 font-sans text-white relative overflow-hidden">
      
      {/* TOAST SYSTEM */}
      {toast && toast.isOpen && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-zinc-900/90 backdrop-blur-3xl border border-white/15 px-6 py-4 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex items-center gap-3 text-white max-w-md">
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

      {/* RENDER MODALS */}
      {isDayViewOpen && (
        <DayViewModal 
          isOpen={isDayViewOpen} 
          date={selectedDate} 
          events={events.filter(e => e.event_date === selectedDate)} 
          onClose={() => setIsDayViewOpen(false)} 
          onEditEvent={openEditEventFromDay} 
          onAddEvent={openAddEventFromDay} 
        />
      )}
      
      <EventFormModal 
        isOpen={isEventModalOpen} 
        mode={eventModalMode} 
        formData={eventForm} 
        onClose={() => setIsEventModalOpen(false)} 
        onInputChange={(f:string, v:string) => setEventForm(p => ({...p, [f]:v}))} 
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent} 
      />

      <RequestDetailModal isOpen={isRequestDetailModalOpen} request={selectedRequest} onClose={() => setIsRequestDetailModalOpen(false)} onUpdate={handleStatusUpdate} />
      <UserDetailModal isOpen={isUserDetailModalOpen} user={selectedUser} onClose={() => { setIsUserDetailModalOpen(false); setSelectedUser(null); }} onEdit={handleEditUser} onDelete={handleDeleteUser} />
      <CreateUserModal isOpen={isCreateUserModalOpen} onClose={() => setIsCreateUserModalOpen(false)} onSave={handleManualCreateUser} />
      <InventoryModal isOpen={isInventoryModalOpen} onClose={() => setIsInventoryModalOpen(false)} item={selectedInventoryItem} onSave={handleSaveInventory} onDelete={handleDeleteInventory} />

     {isPromoteModalOpen && (
  <ModalOverlay onClose={() => { setIsPromoteModalOpen(false); setSelectedRoles([]); }} maxWidth="max-w-md">
    <div className="p-8 text-white">
      <div className="flex items-center space-x-3 mb-6 text-[#f97316]">
        <ShieldAlert size={32} />
        <h2 className="text-2xl font-black font-display uppercase tracking-tight">Assign Multiple Roles</h2>
      </div>
      <div className="space-y-4">
        {/* Member Selection */}
        <div>
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono">Select Member</label>
          <select
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none mt-1 font-bold text-white"
            value={selectedUser?.id || ''}
            onChange={(e) => {
              const user = users.find(u => u.id === e.target.value);
              setSelectedUser(user);
              // Pre‑fill roles if the user already has some
              if (user?.assigned_service) {
                setSelectedRoles(user.assigned_service);
              } else {
                setSelectedRoles([]);
              }
            }}
          >
            <option value="" className="bg-zinc-900">Choose a member...</option>
            {availableUsers.map(user => (
              <option key={user.id} value={user.id} className="bg-zinc-900">{user.full_name}</option>
            ))}
          </select>
        </div>

        {/* Role Checkboxes */}
        <div>
          <label className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono">Assign Roles</label>
          <div className="mt-2 grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 bg-white/5 rounded-xl border border-white/10">
            {ALL_ROLES.map(role => (
  <label key={role} className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white cursor-pointer">
    <input
      type="checkbox"
      checked={selectedRoles.includes(role)}
      onChange={(e) => {
        if (e.target.checked) {
          setSelectedRoles(prev => [...prev, role]);
        } else {
          setSelectedRoles(prev => prev.filter(r => r !== role));
        }
      }}
      className="w-4 h-4 text-[#f97316] rounded border-white/10 bg-white/5 focus:ring-[#f97316]"
    />
    {role}
  </label>
))}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Select all roles this member should have</p>
        </div>
      </div>

      <div className="flex space-x-3 mt-8">
        <button
          type="button"
          onClick={() => { setIsPromoteModalOpen(false); setSelectedRoles([]); }}
          className="flex-1 py-3 font-bold text-slate-400 hover:text-white transition-colors text-xs uppercase tracking-wider"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            if (!selectedUser) {
              showAlert('Please select a member.', 'error');
              return;
            }
            if (selectedRoles.length === 0) {
              showAlert('Please select at least one role.', 'error');
              return;
            }
            handlePromote();
          }}
          disabled={!selectedUser || selectedRoles.length === 0}
          className="flex-1 py-3 bg-[#f97316] text-white rounded-xl font-bold disabled:opacity-50 shadow-lg shadow-orange-500/15 text-xs uppercase tracking-wider"
        >
          Confirm
        </button>
      </div>
    </div>
  </ModalOverlay>
)}

      {/* DESKTOP SIDEBAR PANEL */}
      <aside className="w-72 bg-zinc-950/80 text-white flex-col m-4 rounded-[2rem] shadow-2xl overflow-hidden border border-white/10 backdrop-blur-3xl hidden lg:flex shrink-0">
        <div className="p-8">
          <div className="flex items-center space-x-3 text-[#f97316] mb-10">
            <ShieldCheck size={32} />
            <span className="text-2xl font-black text-white tracking-wider font-display uppercase">Madan</span>
          </div>
          <nav className="space-y-2">
            {[
              { id: 'events', icon: <CalendarIcon />, label: 'Events' },
              { id: 'users', icon: <Users />, label: 'Members' },
              { id: 'sub-admins', icon: <UserCheck />, label: 'Roles' },
              { id: 'leaders', icon: <Star />, label: 'Leaders' },
              { id: 'requests', icon: <Inbox />, label: 'Requests', hasBadge: hasPendingRequests },
              { id: 'inventory', icon: <Package />, label: 'Inventory' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as TabType)}
                className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all relative ${
                  activeTab === item.id ? 'bg-[#f97316] shadow-lg shadow-orange-500/20 text-white font-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon} 
                <span className="font-bold">{item.label}</span>
                {item.hasBadge && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </nav>
          <div className="mt-8 pt-8 border-t border-white/10 space-y-2">
            <button 
              type="button"
              onClick={() => {
                setIsMessagesPanelOpen(true);
                fetchMessages();
              }}
              className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all text-slate-400 hover:bg-white/5 hover:text-white relative"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="font-bold">Messages</span>
              {messageCount > 0 && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#f97316] text-white text-[10px] font-black px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {messageCount}
                </span>
              )}
            </button>
            <button 
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut size={20} />
              <span className="font-bold">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV BAR */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 lg:hidden block w-[94%] max-w-lg">
        <div className="bg-zinc-900/90 backdrop-blur-3xl px-3 py-2 rounded-3xl shadow-[0_24px_50px_rgba(0,0,0,0.9)] flex items-center justify-between border border-white/10">
          <div className="flex items-center gap-1 w-full justify-between">
            {[
              { id: 'events', icon: <CalendarIcon size={18} />, label: 'Events' },
              { id: 'users', icon: <Users size={18} />, label: 'Members' },
              { id: 'sub-admins', icon: <UserCheck size={18} />, label: 'Roles' },
              { id: 'leaders', icon: <Star size={18} />, label: 'Leaders' },
              { id: 'requests', icon: <Inbox size={18} />, label: 'Reqs', hasBadge: hasPendingRequests },
              { id: 'inventory', icon: <Package size={18} />, label: 'Inven' },
            ].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all flex-1 relative ${
                    isActive ? 'text-[#f97316] bg-white/5 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="text-[8px] font-bold uppercase mt-1 tracking-wider truncate max-w-[50px]">{item.label}</span>
                  {item.hasBadge && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* MAIN CONTAINER CONTENT */}
      <main className="flex-1 flex flex-col overflow-y-auto p-4 lg:p-8 pb-32 lg:pb-8">
        <header className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-96">
              {activeTab !== 'events' && (
                <>
                  <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                  <input className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl outline-none text-white focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] transition-all text-sm font-medium" placeholder="Search..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} />
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={handleLogout}
                className="lg:hidden p-2.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMessagesPanelOpen(true);
                  fetchMessages();
                }}
                className="relative h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-[#f97316] hover:bg-white/10 transition-colors font-mono"
                title="Messages"
              >
                M
                {messageCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full min-w-[16px] text-center animate-pulse">
                    {messageCount}
                  </span>
                )}
              </button>
            </div>
          </div>
          <div className="mt-6 flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-black text-white capitalize font-display tracking-tight">{activeTab === 'sub-admins' ? 'Roles & Leadership' : activeTab.replace('-', ' ')}</h1>
            <div className="flex gap-3">
              {activeTab === 'users' && <button type="button" onClick={() => setIsCreateUserModalOpen(true)} className="bg-[#f97316] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-orange-500/15 hover:bg-orange-600 transition-all text-xs uppercase tracking-wider"><UserPlus size={18} /> Register Member</button>}
              {activeTab === 'sub-admins' && <button type="button" onClick={() => { setSelectedUser(null); setIsPromoteModalOpen(true); }} className="bg-[#f97316] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-orange-500/15 hover:bg-orange-600 transition-all text-xs uppercase tracking-wider"><Star size={18} /> Assign New Role</button>}
              {activeTab === 'inventory' && <button type="button" onClick={() => { setSelectedInventoryItem(null); setIsInventoryModalOpen(true); }} className="bg-[#f97316] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-orange-500/15 hover:bg-orange-600 transition-all text-xs uppercase tracking-wider"><Plus size={18} /> Add Item</button>}
              {activeTab === 'leaders' && (
              <button 
                type="button"
                onClick={() => {
                  setSelectedLeader(null);
                  setLeaderFormData({ name: '', title: '', image_url: '', order: leaders.length + 1, is_active: true });
                  setIsLeaderModalOpen(true);
                }} 
                className="bg-[#f97316] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-orange-500/15 hover:bg-orange-600 transition-all text-xs uppercase tracking-wider"
              >
                <Plus size={18} /> Add Leader
              </button>
            )}
            </div>
          </div>
        </header>
            
        <section className="flex-1">
          {activeTab === 'events' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-6" key={calendarKey}>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 max-w-5xl">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-white font-display uppercase tracking-tight">Schedule Calendar</h2>
                </div>
                {canManageEvents && (
                  <button 
                    type="button"
                    onClick={() => {
                      const today = new Date();
                      const dateStr = formatDateStr(today.getFullYear(), today.getMonth(), today.getDate());
                      openAddEventFromDay(dateStr);
                    }} 
                    className="bg-[#f97316] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-orange-500/15 hover:bg-orange-600 transition-all text-xs uppercase tracking-wider"
                  >
                    <Plus size={20} /> Create Event
                  </button>
                )}
              </div>

              {/* CALENDAR */}
              <div className="max-w-5xl bg-zinc-950/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.6)] relative overflow-hidden">
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative z-10 flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse" />
                    <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] font-mono">
                      our schedule
                    </span>
                  </div>
                  
                  <button 
                    type="button"
                    onClick={() => {
                      setIsEthiopianCalendar(!isEthiopianCalendar);
                      setCalendarKey(prev => prev + 1);
                    }}
                    className={`px-3 py-1.5 rounded-full border backdrop-blur-md transition-all duration-300 flex items-center gap-1.5 ${
                      isEthiopianCalendar 
                        ? 'bg-[#f97316]/20 border-[#f97316]/40 text-[#f97316]' 
                        : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="text-[8px] font-black tracking-widest uppercase">
                      {isEthiopianCalendar ? 'ET' : 'GR'}
                    </span>
                    <span className="text-[8px] font-black tracking-widest uppercase font-mono">
                      {isEthiopianCalendar ? 'Ethiopian' : 'Gregorian'}
                    </span>
                  </button>
                </div>

                <div className="relative z-10 flex items-center justify-between mb-8 px-2">
                  <div className="flex flex-col">
                    <h3 className="text-3xl md:text-5xl font-black text-white font-display">
                      {isEthiopianCalendar
                        ? getEthiopianDate(currentCalendarDate).month
                        : MONTHS_EN[currentCalendarDate.getMonth()]
                      }
                    </h3>
                    <p className="text-xs font-bold text-slate-400 tracking-wider mt-1.5 uppercase font-mono flex items-center gap-2">
                      <span className="text-[#f97316]">•</span>
                      {isEthiopianCalendar
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

                <div className="relative z-10 grid grid-cols-7 gap-1 md:gap-2 mb-4 text-center font-bold text-slate-400 text-xs tracking-widest border-b border-white/5 pb-3 font-mono">
                  {(isEthiopianCalendar ? WEEKDAYS_ET : WEEKDAYS_EN).map((day, idx) => (
                    <span key={idx}>{day}</span>
                  ))}
                </div>

                <div className="relative z-10 grid grid-cols-7 gap-y-2 gap-x-0.5 md:gap-3">
                  {getDaysInMonthGrid().map(({ dayNum, isCurrentMonth, dateStr, dateObj }, idx) => {
                    const dayEvents = events.filter(e => e.event_date === dateStr);
                    const isToday = formatDateStr(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) === dateStr;
                    const isSelected = selectedDate === dateStr;
                    const displayDay = isEthiopianCalendar ? getEthiopianDate(dateObj).day : dayNum;
                    
                    return (
                      <button 
                        key={idx}
                        type="button"
                        onClick={() => handleDayClick(dateStr)}
                        className={`relative min-h-[50px] md:min-h-[85px] rounded-xl md:rounded-2xl flex flex-col items-stretch justify-between p-1.5 sm:p-2 transition-all duration-300 outline-none group border
                          ${isCurrentMonth ? 'text-white' : 'text-slate-600 border-transparent opacity-25'}
                          ${isSelected 
                            ? 'bg-white/10 border-[#f97316]/50 shadow-[0_8px_30px_rgb(249,115,22,0.1)]' 
                            : 'bg-zinc-950/20 border-white/5 hover:border-white/15 hover:bg-white/5'
                          }
                          cursor-pointer
                        `}
                      >
                        <div className="flex justify-between items-center w-full">
                          {isToday ? (
                            <div className="relative flex items-center justify-center w-5 h-5 md:w-8 md:h-8 rounded-full bg-[#f97316] text-white font-black text-[10px] md:text-sm shadow-md shadow-orange-500/25">
                              <span className="absolute inset-0 rounded-full bg-[#f97316] animate-ping opacity-25" />
                              {displayDay}
                            </div>
                          ) : (
                            <div className={`w-5 h-5 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[10px] md:text-sm font-semibold transition-all
                              ${isSelected ? 'text-[#f97316] font-black' : 'text-slate-200'}
                            `}>
                              {displayDay}
                            </div>
                          )}

                          {dayEvents.length > 0 && (
                            <span className="text-[7px] md:text-[9px] font-black text-orange-400 font-mono px-1 py-0.5 md:px-1.5 md:py-0.5 bg-orange-400/10 rounded-full">
                              {dayEvents.length}
                            </span>
                          )}
                        </div>

                        <div className="w-full mt-1 md:mt-2">
                          {dayEvents.length > 0 && (
                            <div className="sm:hidden flex flex-wrap gap-1 mt-0.5 justify-start items-center">
                              {dayEvents.slice(0, 3).map((ev) => {
                                const colorHex = SERVICE_COLORS[ev.service_type]?.hex || '#f97316';
                                return (
                                  <span 
                                    key={ev.id} 
                                    className="w-1.5 h-1.5 rounded-full shrink-0 shadow-sm transition-all" 
                                    style={{ backgroundColor: colorHex }} 
                                    title={ev.title}
                                  />
                                );
                              })}
                            </div>
                          )}

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
                        </div>
                      </button>
                    );
                  })}
                </div>

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
          )}

          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
                {users.filter(u => u.full_name?.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
                  <div key={item.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between transition-all hover:bg-white/10">
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.full_name}</h4>
                      <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase font-mono ${item.assigned_service === 'Church Leaders' ? 'bg-amber-500/10 text-amber-400' : item.role === 'sub-admin' ? 'bg-orange-500/10 text-[#f97316]' : 'bg-white/5 text-slate-400'}`}>
                        {item.assigned_service === 'Church Leaders' ? 'Church Leader' : item.role === 'sub-admin' ? 'Management' : item.role === 'admin' ? 'Admin' : 'Member'}
                      </span>
                    </div>
                    <button type="button" onClick={() => { setSelectedUser(item); setIsUserDetailModalOpen(true); }} className="p-2.5 bg-white/5 rounded-xl text-slate-400 hover:text-[#f97316] transition-colors"><Eye size={18} /></button>
                  </div>
                ))}
              </div>

              <div className="hidden lg:block bg-zinc-950/45 backdrop-blur-3xl rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr className="text-left text-xs font-black uppercase tracking-widest text-slate-400 font-mono">
                      <th className="px-8 py-5">Full Identity</th>
                      <th className="px-8 py-5">Role</th>
                      <th className="px-8 py-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.filter(u => u.full_name?.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-8 py-5 font-bold text-white">{item.full_name}</td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase font-mono ${item.assigned_service === 'Church Leaders' ? 'bg-amber-500/10 text-amber-400' : item.role === 'sub-admin' ? 'bg-orange-500/10 text-[#f97316]' : 'bg-white/5 text-slate-400'}`}>
                            {item.assigned_service === 'Church Leaders' ? 'Church Leader' : item.role === 'sub-admin' ? 'Management' : item.role === 'admin' ? 'Admin' : 'Member'}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right space-x-2">
                          <button type="button" onClick={() => { setSelectedUser(item); setIsUserDetailModalOpen(true); }} className="p-2 text-slate-400 hover:text-[#f97316] transition-colors"><Eye size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'sub-admins' && (
            <div className="space-y-12">
              <div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2 font-mono"><Star size={20} className="text-[#f97316]" /> Church Leadership (Titles Only)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {churchLeaders.map(admin => (
                      <div key={admin.id} className="bg-white/5 backdrop-blur-3xl p-6 rounded-[2rem] border border-white/10 shadow-2xl relative group text-white">
                          <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-black uppercase font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20`}>CHURCH LEADER</div>
                          <h3 className="text-xl font-black text-white font-display mt-4">{admin.full_name}</h3><p className="text-sm text-slate-400 mt-1">{admin.email}</p>
                          <div className="flex gap-2 mt-6">
                            <button type="button" onClick={() => { setSelectedUser(admin); setIsUserDetailModalOpen(true); }} className="flex-1 py-3 bg-white/5 text-slate-300 border border-white/10 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-[#f97316] hover:text-white hover:border-[#f97316] transition-all text-xs uppercase tracking-wider"><Eye size={18} /> <span>View</span></button>
                            <button type="button" onClick={() => handleDemote(admin.id)} className="flex-1 py-3 bg-red-950/20 text-red-400 border border-red-500/20 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all text-xs uppercase tracking-wider"><UserMinus size={18} /> <span>Revoke</span></button>
                          </div>
                      </div>
                  ))}
                  {churchLeaders.length === 0 && <div className="col-span-3 py-10 bg-white/5 rounded-3xl border border-dashed border-white/10 text-center text-slate-500 font-mono text-sm">No Church Leaders assigned yet.</div>}
                </div>
              </div>

            <div>
  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2 font-mono">
    <ShieldAlert size={20} className="text-[#f97316]" /> Management & Service Leads
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {systemManagers.map(admin => {
      const roles = admin.assigned_service || [];
      return (
        <div key={admin.id} className="bg-white/5 backdrop-blur-3xl p-6 rounded-[2rem] border border-white/10 shadow-2xl relative group text-white">
          <div className="absolute top-6 right-6 flex flex-wrap gap-1">
            {roles.map((service: string) => {
              const theme = SERVICE_COLORS[service] || { bg: 'bg-white/5', text: 'text-slate-400' };
              return (
                <span key={service} className={`text-[10px] font-black uppercase font-mono px-2 py-0.5 rounded-full ${theme.bg} ${theme.text}`}>
                  {service}
                </span>
              );
            })}
          </div>
          <h3 className="text-xl font-black text-white font-display mt-4">{admin.full_name}</h3>
          <p className="text-sm text-slate-400 mt-1">{admin.email}</p>
          <div className="flex gap-2 mt-6">
            <button type="button" onClick={() => { setSelectedUser(admin); setIsUserDetailModalOpen(true); }} className="flex-1 py-3 bg-white/5 text-slate-300 border border-white/10 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-[#f97316] hover:text-white hover:border-[#f97316] transition-all text-xs uppercase tracking-wider">
              <Eye size={18} /> <span>View</span>
            </button>
            <button type="button" onClick={() => handleDemote(admin.id)} className="flex-1 py-3 bg-red-950/20 text-red-400 border border-red-500/20 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all text-xs uppercase tracking-wider">
              <UserMinus size={18} /> <span>Revoke</span>
            </button>
          </div>
        </div>
      );
    })}
    {systemManagers.length === 0 && <div className="col-span-3 py-10 bg-white/5 rounded-3xl border border-dashed border-white/10 text-center text-slate-500 font-mono text-sm">No Service Leads assigned yet.</div>}
  </div>
</div>
            </div>
          )}
          
          {activeTab === 'requests' && (
             <div className="bg-zinc-950/45 backdrop-blur-3xl rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
               <table className="w-full">
                 <thead className="bg-white/5 border-b border-white/10">
                   <tr className="text-left text-xs font-black uppercase tracking-widest text-slate-400 font-mono">
                     <th className="px-8 py-5">Requested By</th>
                     <th className="px-8 py-5">Email</th>
                     <th className="px-8 py-5 text-right">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                     {requests.filter(r => r.full_name?.toLowerCase().includes(searchQuery.toLowerCase())).map(r => (
                        <tr key={r.id} className="hover:bg-white/5 cursor-pointer transition-colors group" onClick={() => { setSelectedRequest(r); setIsRequestDetailModalOpen(true); }}>
                          <td className="px-8 py-5 font-bold text-white">{r.full_name}</td>
                          <td className="px-8 py-5 text-slate-400">{r.email}</td>
                          <td className="px-8 py-5 text-right">
                            <div className="bg-white/5 border border-white/10 text-[#f97316] px-4 py-2 rounded-xl inline-flex items-center gap-2 font-bold text-xs uppercase tracking-wider group-hover:bg-[#f97316] group-hover:text-white group-hover:border-[#f97316] transition-all">Review <ChevronRight size={14} /></div>
                          </td>
                        </tr>
                     ))}
                     {requests.length === 0 && <tr><td colSpan={3} className="text-center py-20 text-slate-500 italic">No pending requests found.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'leaders' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
              {leaders.filter(l => l.name?.toLowerCase().includes(searchQuery.toLowerCase())).map((leader) => (
                <div key={leader.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col justify-between space-y-4 transition-all hover:bg-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-white/10 border border-white/5 shrink-0">
                      {leader.image_url ? (
                        <img src={leader.image_url} alt={leader.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">No img</div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base leading-tight">{leader.name}</h4>
                      <p className="text-slate-400 text-xs mt-1">{leader.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex gap-2">
                      <span className="px-2.5 py-1 bg-white/5 rounded-lg text-[10px] font-bold font-mono text-slate-300">Ord: {leader.order}</span>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${leader.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {leader.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => handleEditLeader(leader)} className="p-2 text-[#f97316] hover:bg-white/5 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button type="button" onClick={() => handleDeleteLeader(leader.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {leaders.length === 0 && (
                <div className="py-12 bg-white/5 rounded-2xl border border-dashed border-white/10 text-center text-slate-500 text-sm font-mono col-span-full">No leaders found.</div>
              )}
            </div>

            <div className="hidden lg:block bg-zinc-950/45 backdrop-blur-3xl rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10 font-mono">
                    <tr className="text-left text-xs font-black uppercase tracking-widest text-slate-400">
                      <th className="px-6 py-4">Image</th>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Order</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {leaders.filter(l => l.name?.toLowerCase().includes(searchQuery.toLowerCase())).map((leader) => (
                      <tr key={leader.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 border border-white/5">
                            {leader.image_url ? (
                              <img src={leader.image_url} alt={leader.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">No img</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-white">{leader.name}</td>
                        <td className="px-6 py-4 text-slate-300">{leader.title}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-white/5 rounded-lg text-xs font-bold font-mono">{leader.order}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${leader.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                            {leader.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button type="button" onClick={() => handleEditLeader(leader)} className="p-2 text-[#f97316] hover:bg-white/5 rounded-lg transition-colors">
                            <Edit2 size={18} />
                          </button>
                          <button type="button" onClick={() => handleDeleteLeader(leader.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {leaders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-20 text-slate-500 italic">
                          No church leaders found. Click &quot;Add Leader&quot; to create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
          
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
                {inventory.filter(i => 
                  i.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  i.category?.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col justify-between space-y-3 cursor-pointer hover:border-white/20 transition-all"
                    onClick={() => { setSelectedInventoryItem(item); setIsInventoryModalOpen(true); }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-base leading-tight">{item.name}</h4>
                        <span className="inline-block mt-2 px-2.5 py-0.5 bg-white/5 border border-white/5 rounded-lg text-[9px] font-black uppercase text-slate-400 font-mono">
                          {item.category}
                        </span>
                      </div>
                      <span className="text-lg font-black text-[#f97316] font-mono">x{item.quantity || 1}</span>
                    </div>
                    {item.description && (
                      <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                    )}
                    <div className="flex justify-end pt-2 border-t border-white/5 text-[10px] font-bold text-[#f97316] uppercase tracking-wider">
                      Edit Item →
                    </div>
                  </div>
                ))}
                {inventory.length === 0 && (
                  <div className="py-12 bg-white/5 rounded-2xl border border-dashed border-white/10 text-center text-slate-500 text-sm font-mono col-span-full">No inventory items found.</div>
                )}
              </div>

              <div className="hidden lg:block bg-zinc-950/45 backdrop-blur-3xl rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10 font-mono">
                    <tr className="text-left text-xs font-black uppercase tracking-widest text-slate-400">
                      <th className="px-8 py-5">Item Name</th>
                      <th className="px-8 py-5">Category</th>
                      <th className="px-8 py-5">Qty</th>
                      <th className="px-8 py-5">Description</th>
                      <th className="px-8 py-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {inventory.filter(i => 
                      i.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      i.category?.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map((item) => (
                      <tr 
                          key={item.id} 
                          className="hover:bg-white/5 cursor-pointer transition-all group"
                          onClick={() => { setSelectedInventoryItem(item); setIsInventoryModalOpen(true); }}
                      >
                        <td className="px-8 py-5 font-bold text-white group-hover:text-[#f97316]">{item.name}</td>
                        <td className="px-8 py-5">
                          <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[10px] font-black uppercase text-slate-400 font-mono">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-8 py-5 font-black text-[#f97316] font-mono">{item.quantity || 1}</td>
                        <td className="px-8 py-5 text-slate-400 text-sm truncate max-w-xs">{item.description}</td>
                        <td className="px-8 py-5 text-right">
                          <div className="p-2 text-slate-500 group-hover:text-[#f97316] transition-colors inline-block">
                            <Edit2 size={18} />
                          </div>
                        </td>
                      </tr>
                    ))}
                    {inventory.length === 0 && (
                      <tr><td colSpan={5} className="text-center py-20 text-slate-500 italic">No items found in inventory.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* LEADER MODAL */}
        {isLeaderModalOpen && (
          <ModalOverlay onClose={() => setIsLeaderModalOpen(false)} maxWidth="max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-white font-display uppercase tracking-tight">{selectedLeader ? 'Edit Leader' : 'Add New Leader'}</h3>
                  <button type="button" onClick={() => setIsLeaderModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1 font-mono">Full Name *</label>
                    <input
                      type="text"
                      value={leaderFormData.name}
                      onChange={(e) => setLeaderFormData({ ...leaderFormData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] outline-none transition-all"
                      placeholder="e.g., Pastor Mesfin Mamo"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1 font-mono">Title *</label>
                    <input
                      type="text"
                      value={leaderFormData.title}
                      onChange={(e) => setLeaderFormData({ ...leaderFormData, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] outline-none transition-all"
                      placeholder="e.g., Senior Pastor"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1 font-mono">Leader Image</label>
                    <div className="flex items-center gap-4">
                      {leaderFormData.image_url && (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white/10 border border-white/5">
                          <img 
                            src={leaderFormData.image_url} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setLeaderFormData({ ...leaderFormData, image_url: '' })}
                            className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-700 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}
                      <label className="flex-1 cursor-pointer">
                        <div className="w-full bg-white/5 border-2 border-dashed border-white/10 rounded-xl px-4 py-3 text-center hover:border-[#f97316] transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setLeaderFormData({ ...leaderFormData, image_url: reader.result as string });
                                };
                                reader.readAsDataURL(file);
                                setSelectedImageFile(file);
                              }
                            }}
                            className="hidden"
                          />
                          <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                          <p className="text-xs text-slate-400">Click to upload image</p>
                        </div>
                      </label>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">Upload a photo of the leader (recommended size: 400x400px)</p>
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1 font-mono">Display Order</label>
                    <input
                      type="number"
                      value={leaderFormData.order}
                      onChange={(e) => setLeaderFormData({ ...leaderFormData, order: parseInt(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] outline-none transition-all"
                    />
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">Lower numbers appear first (1 = Senior Leader)</p>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={leaderFormData.is_active}
                        onChange={(e) => setLeaderFormData({ ...leaderFormData, is_active: e.target.checked })}
                        className="w-4 h-4 text-[#f97316] rounded border-white/10 bg-white/5 focus:ring-[#f97316]"
                      />
                      <span className="text-sm font-medium text-slate-300">Active (visible on website)</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button type="button" onClick={() => setIsLeaderModalOpen(false)} className="flex-1 py-3 bg-white/5 text-slate-400 hover:text-white border border-white/10 rounded-xl font-bold transition-all text-xs uppercase tracking-wider">
                    Cancel
                  </button>
                  <button type="button" onClick={handleSaveLeader} className="flex-1 py-3 bg-[#f97316] text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/15 text-xs uppercase tracking-wider">
                    {selectedLeader ? 'Update Leader' : 'Add Leader'}
                  </button>
                </div>
              </div>
          </ModalOverlay>

         
        )}

       {/* MESSAGES PANEL MODAL */}
      {isMessagesPanelOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            onClick={() => setIsMessagesPanelOpen(false)} 
          />
          <div className="relative bg-zinc-950/95 border border-white/10 rounded-[2.5rem] w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight font-display">
                  Message Center
                </h2>
                <p className="text-xs text-slate-400">
                  {messageCount} messages
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setIsMessagesPanelOpen(false)} 
                className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isLoadingMessages ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#f97316] border-t-transparent" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <svg className="w-12 h-12 text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-slate-400 text-sm font-medium">
                    No messages yet
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    New messages will appear here
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all cursor-pointer"
                    onClick={() => {
                      // Toggle detail view for this message
                      const contentEl = document.getElementById(`msg-content-${msg.id}`);
                      if (contentEl) {
                        contentEl.classList.toggle('hidden');
                      }
                    }}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className="text-xs font-black text-[#f97316] uppercase tracking-wider font-mono">
                            Message
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(msg.created_at).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono bg-white/5 px-2 py-0.5 rounded-full">
                            Click to expand
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-sm truncate">
                          {msg.subject}
                        </h4>
                        {/* Preview of content - always visible */}
                        <p className="text-sm text-slate-400 mt-1.5 line-clamp-2">
                          {msg.content}
                        </p>
                        {/* Full content - hidden by default, shown on click */}
                        <div 
                          id={`msg-content-${msg.id}`}
                          className="hidden mt-3 pt-3 border-t border-white/10"
                        >
                          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap break-words bg-white/5 p-4 rounded-lg">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMessage(msg.id);
                        }}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0 hover:text-red-300"
                        title="Delete message"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 shrink-0 flex justify-between items-center">
              <p className="text-[10px] text-slate-500 font-mono">
                Latest 30 messages kept
              </p>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Delete all messages?')) {
                      // Add delete all functionality if desired
                    }
                  }}
                  className="text-xs text-red-400 hover:text-red-300 font-bold transition-colors"
                >
                  Delete All
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
};

export default AdminDashboard;