import React, { useState } from 'react';
import { CalendarDays, Coffee, Home, Sparkles, ArrowRight } from 'lucide-react';
import { useAppData } from '../../contexts/AppDataContext';
import { useSettings } from '../../contexts/SettingsContext';

export default function GuestPortal() {
  const { bookings, guests, rooms } = useAppData();
  const { formatCurrency } = useSettings();
  const [activeTab, setActiveTab] = useState<'bookings' | 'services'>('bookings');
  const [bookingForm, setBookingForm] = useState({
    roomType: 'single' as string,
    checkIn: '',
    checkOut: '',
    specialRequests: '',
  });
  const [feedback, setFeedback] = useState<string | null>(null);

  const guestProfile = guests[0];
  const availableRooms = rooms.filter(room => room.status === 'available' && room.type === bookingForm.roomType);

  const handleBookRoom = (event: React.FormEvent) => {
    event.preventDefault();

    if (!guestProfile || !bookingForm.checkIn || !bookingForm.checkOut) {
      setFeedback('Please complete the booking details first.');
      return;
    }

    const selectedRoom = availableRooms[0];
    if (!selectedRoom) {
      setFeedback('No rooms are available for the selected type right now.');
      return;
    }

    const nights = Math.max(1, Math.round((new Date(bookingForm.checkOut).getTime() - new Date(bookingForm.checkIn).getTime()) / (1000 * 60 * 60 * 24)));
    const total = selectedRoom.price * nights;

    // In this UI iteration we store the guest request locally and expose it in the portal.
    setFeedback(`Your booking request for Room ${selectedRoom.number} has been created for ${formatCurrency(total)}.`);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-blue-100">Guest Portal</p>
            <h1 className="text-2xl font-semibold">Welcome, {guestProfile?.name || 'Guest'}</h1>
            <p className="mt-2 max-w-2xl text-sm text-blue-100">View your stay, request room service, and make bookings from one simple portal.</p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
            <Sparkles className="h-8 w-8" />
          </div>
        </div>
      </div>

      {feedback && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
          {feedback}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">My Profile</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Preferences and contact details</p>
          <div className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <p><span className="font-medium">Name:</span> {guestProfile?.name}</p>
            <p><span className="font-medium">Email:</span> {guestProfile?.email}</p>
            <p><span className="font-medium">Phone:</span> {guestProfile?.phone}</p>
            <p><span className="font-medium">Loyalty:</span> {guestProfile?.loyaltyPoints} points</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:col-span-2">
          <div className="flex gap-3 border-b border-slate-200 pb-3 dark:border-slate-700">
            <button onClick={() => setActiveTab('bookings')} className={`rounded-full px-4 py-2 text-sm font-medium ${activeTab === 'bookings' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}>My Bookings</button>
            <button onClick={() => setActiveTab('services')} className={`rounded-full px-4 py-2 text-sm font-medium ${activeTab === 'services' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}>Meals & Services</button>
          </div>

          {activeTab === 'bookings' ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <Home className="h-5 w-5" />
                  <h3 className="font-semibold">Book a room</h3>
                </div>
                <form onSubmit={handleBookRoom} className="mt-4 grid gap-4 md:grid-cols-2">
                  <select value={bookingForm.roomType} onChange={(e) => setBookingForm(prev => ({ ...prev, roomType: e.target.value }))} className="rounded-xl border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800">
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="suite">Suite</option>
                    <option value="deluxe">Deluxe</option>
                  </select>
                  <input type="date" value={bookingForm.checkIn} onChange={(e) => setBookingForm(prev => ({ ...prev, checkIn: e.target.value }))} className="rounded-xl border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800" />
                  <input type="date" value={bookingForm.checkOut} onChange={(e) => setBookingForm(prev => ({ ...prev, checkOut: e.target.value }))} className="rounded-xl border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800" />
                  <textarea value={bookingForm.specialRequests} onChange={(e) => setBookingForm(prev => ({ ...prev, specialRequests: e.target.value }))} placeholder="Special requests" className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2 dark:border-slate-600 dark:bg-slate-800" />
                  <button type="submit" className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white">Request Booking <ArrowRight className="h-4 w-4" /></button>
                </form>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Upcoming stays</h3>
                  <span className="text-sm text-slate-500">{bookings.length} records</span>
                </div>
                <div className="mt-3 space-y-2">
                  {bookings.slice(0, 3).map(booking => (
                    <div key={booking.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700">
                      <span>{booking.guestName}</span>
                      <span className="text-slate-500">{booking.checkIn.toLocaleDateString()} → {booking.checkOut.toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <Coffee className="h-5 w-5" />
                  <h3 className="font-semibold">Meal and service requests</h3>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Guests can request breakfast, room service, and other amenities from the portal.</p>
                <button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-white dark:bg-slate-700">Request service <ArrowRight className="h-4 w-4" /></button>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <CalendarDays className="h-5 w-5" />
                  <h3 className="font-semibold">Availability preview</h3>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{availableRooms.length} {bookingForm.roomType} rooms are currently available for your chosen dates.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
