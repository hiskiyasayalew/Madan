'use client';
import { useState, useEffect } from 'react';
import api from '@/app/lib/api';
import dayjs from 'dayjs';

export default function BookingPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [form, setForm] = useState({
    room: '',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    startDate: '',
    endDate: '',
    paymentScreenshot: null as File | null,
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    api.get('/api/guest-house-rooms').then((res) => setRooms(res.data.data));
  }, []);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, files } = e.target;
    if (files) setForm({ ...form, [name]: files[0] });
    else setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.room) return alert('Select a room');

    const payload = new FormData();
    payload.append('data', JSON.stringify({
      room: form.room,
      guestName: form.guestName,
      guestEmail: form.guestEmail,
      guestPhone: form.guestPhone,
      startDate: form.startDate,
      endDate: form.endDate,
      nights: dayjs(form.endDate).diff(dayjs(form.startDate), 'day'),
      status: 'awaiting_payment',
    }));
    if (form.paymentScreenshot) payload.append('files.payment_screenshot', form.paymentScreenshot);

    try {
      await api.post('/api/bookings', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus('Booking submitted! Please wait for verification.');
    } catch (err) {
      console.error(err);
      setStatus('Error submitting booking.');
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <h1 className="text-3xl font-bold">Book a Room</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <select name="room" onChange={handleChange} className="w-full border p-2 rounded">
          <option value="">Select a room</option>
          {rooms.map((r: any) => (
            <option key={r.id} value={r.id}>{r.attributes.name}</option>
          ))}
        </select>
        <input type="text" name="guestName" placeholder="Full Name" required onChange={handleChange} className="w-full border p-2 rounded"/>
        <input type="email" name="guestEmail" placeholder="Email" required onChange={handleChange} className="w-full border p-2 rounded"/>
        <input type="text" name="guestPhone" placeholder="Phone" required onChange={handleChange} className="w-full border p-2 rounded"/>
        <input type="date" name="startDate" required onChange={handleChange} className="w-full border p-2 rounded"/>
        <input type="date" name="endDate" required onChange={handleChange} className="w-full border p-2 rounded"/>
        <input type="file" name="paymentScreenshot" accept="image/*" onChange={handleChange} className="w-full border p-2 rounded"/>
        <button type="submit" className="bg-blue-700 text-white p-2 rounded w-full">Submit Booking</button>
      </form>
      {status && <p className="mt-2 text-green-700">{status}</p>}
    </div>
  );
}
