import React, { useState } from 'react';
import { Users, UserCheck, UserX, Key, Clock, Search, Plus, Phone, Mail, MapPin, Calendar, Star, Gift } from 'lucide-react';
import { Guest, Booking } from '../../types';
import { useAppData } from '../../contexts/AppDataContext';

const emptyGuestForm = {
  name: '',
  email: '',
  phone: '',
  idType: 'passport' as Guest['idType'],
  idNumber: '',
  address: '',
  preferences: '',
  notes: '',
};

export default function GuestManagement() {
  const { bookings: appBookings, guests: appGuests, rooms: appRooms, addGuest, updateBooking } = useAppData();
  const [activeTab, setActiveTab] = useState<'checkin' | 'checkout' | 'profiles' | 'preferences'>('checkin');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const bookings = appBookings;
  const guests = appGuests;
  const [feedback, setFeedback] = useState<string | null>(null);
  const [newGuest, setNewGuest] = useState(emptyGuestForm);

  const todayCheckIns = bookings.filter(b =>
    b.status === 'confirmed' &&
    b.checkIn.toDateString() === new Date().toDateString()
  );

  const todayCheckOuts = bookings.filter(b =>
    b.status === 'checked-in' &&
    b.checkOut.toDateString() === new Date().toDateString()
  );

  const currentGuests = bookings.filter(b => b.status === 'checked-in');

  const getRoomDetails = (roomId: string) => {
    return appRooms.find(r => r.id === roomId);
  };

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.phone.includes(searchTerm)
  );

  const getLoyaltyTier = (points: number) => {
    if (points >= 2000) return { tier: 'Platinum', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' };
    if (points >= 1000) return { tier: 'Gold', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' };
    if (points >= 500) return { tier: 'Silver', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' };
    return { tier: 'Bronze', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300' };
  };

  const handleCheckIn = (bookingId: string) => {
    const booking = bookings.find(item => item.id === bookingId);
    if (booking) {
      updateBooking({ ...booking, status: 'checked-in' });
    }
    setFeedback('Guest checked in successfully.');
  };

  const handleCheckOut = (bookingId: string) => {
    const booking = bookings.find(item => item.id === bookingId);
    if (booking) {
      updateBooking({ ...booking, status: 'checked-out' });
    }
    setFeedback('Guest checked out successfully.');
  };

  const handleAssignKey = (roomNumber: string) => {
    setFeedback(`Digital key assigned for room ${roomNumber}.`);
  };

  const handleExtendStay = (bookingId: string) => {
    const booking = bookings.find(item => item.id === bookingId);
    if (booking) {
      updateBooking({ ...booking, checkOut: new Date(booking.checkOut.getTime() + 24 * 60 * 60 * 1000) });
    }
    setFeedback('Stay extended by one day.');
  };

  const handleAddGuest = (event: React.FormEvent) => {
    event.preventDefault();

    const guestToAdd: Guest = {
      id: `G-${Date.now()}`,
      name: newGuest.name,
      email: newGuest.email,
      phone: newGuest.phone,
      idType: newGuest.idType,
      idNumber: newGuest.idNumber,
      address: newGuest.address,
      preferences: newGuest.preferences.split(',').map(item => item.trim()).filter(Boolean),
      loyaltyPoints: 0,
      totalStays: 0,
      notes: newGuest.notes,
    };

    addGuest(guestToAdd);
    setSelectedGuest(guestToAdd);
    setShowAddModal(false);
    setNewGuest(emptyGuestForm);
    setFeedback(`Guest profile added for ${guestToAdd.name}.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Guest Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage guest check-ins, check-outs, profiles, and preferences</p>
      </div>

      {feedback && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
          {feedback}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Check-ins</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{todayCheckIns.length}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Check-outs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{todayCheckOuts.length}</p>
            </div>
            <UserX className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Guests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentGuests.length}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">VIP Guests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{guests.filter(g => g.loyaltyPoints > 1000).length}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('checkin')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'checkin'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Check-ins
            </button>
            <button
              onClick={() => setActiveTab('checkout')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'checkout'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Check-outs
            </button>
            <button
              onClick={() => setActiveTab('profiles')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'profiles'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Guest Profiles
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'preferences'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Preferences & History
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Check-ins Tab */}
          {activeTab === 'checkin' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Today's Check-ins</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">{todayCheckIns.length} guests expected</span>
              </div>
              
              {todayCheckIns.length === 0 ? (
                <div className="text-center py-12">
                  <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Check-ins Today</h4>
                  <p className="text-gray-500 dark:text-gray-400">All expected guests have already checked in.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayCheckIns.map((booking) => {
                    const room = getRoomDetails(booking.roomId);
                    return (
                      <div key={booking.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-medium text-lg">
                                  {booking.guestName.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div className="flex-1">
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white">{booking.guestName}</h4>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                  <div className="flex items-center space-x-1">
                                    <Mail className="w-4 h-4" />
                                    <span>{booking.guestEmail}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Phone className="w-4 h-4" />
                                    <span>{booking.guestPhone}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Room {room?.number}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{room?.type}</p>
                                <p className="text-sm text-green-600 dark:text-green-400">${room?.price}/night</p>
                              </div>
                            </div>
                            {booking.specialRequests && (
                              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <p className="text-sm text-blue-800 dark:text-blue-300">
                                  <strong>Special Requests:</strong> {booking.specialRequests}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-3 ml-6">
                            <button
                              onClick={() => handleAssignKey(room?.number || '')}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                            >
                              <Key className="w-4 h-4" />
                              <span>Assign Key</span>
                            </button>
                            <button
                              onClick={() => handleCheckIn(booking.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                            >
                              <UserCheck className="w-4 h-4" />
                              <span>Check In</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Check-outs Tab */}
          {activeTab === 'checkout' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Today's Check-outs</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">{todayCheckOuts.length} guests departing</span>
              </div>
              
              {todayCheckOuts.length === 0 ? (
                <div className="text-center py-12">
                  <UserX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Check-outs Today</h4>
                  <p className="text-gray-500 dark:text-gray-400">All guests have extended their stay or checked out early.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayCheckOuts.map((booking) => {
                    const room = getRoomDetails(booking.roomId);
                    return (
                      <div key={booking.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-medium text-lg">
                                  {booking.guestName.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div className="flex-1">
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white">{booking.guestName}</h4>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>Checked in: {booking.checkIn.toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-4 h-4" />
                                    <span>Check-out: 11:00 AM</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Room {room?.number}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{room?.type}</p>
                                <p className="text-sm text-blue-600 dark:text-blue-400">Total: ${booking.totalAmount}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 ml-6">
                            <button
                              onClick={() => handleExtendStay(booking.id)}
                              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                            >
                              <Clock className="w-4 h-4" />
                              <span>Extend Stay</span>
                            </button>
                            <button
                              onClick={() => handleCheckOut(booking.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                            >
                              <UserX className="w-4 h-4" />
                              <span>Check Out</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Guest Profiles Tab */}
          {activeTab === 'profiles' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Guest Profiles</h3>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search guests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Guest</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGuests.map((guest) => {
                  const loyaltyTier = getLoyaltyTier(guest.loyaltyPoints);
                  return (
                    <div key={guest.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-lg">
                            {guest.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white">{guest.name}</h4>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${loyaltyTier.color}`}>
                            {loyaltyTier.tier}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <Mail className="w-4 h-4" />
                          <span>{guest.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <Phone className="w-4 h-4" />
                          <span>{guest.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{guest.address}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                        <div>
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{guest.loyaltyPoints}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Loyalty Points</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-green-600 dark:text-green-400">{guest.totalStays}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Total Stays</p>
                        </div>
                      </div>

                      {guest.lastVisit && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Last visit: {guest.lastVisit.toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedGuest(guest)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                        >
                          View Profile
                        </button>
                        <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Preferences & History Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Guest Preferences & History</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Guest Preferences */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Common Preferences</h4>
                  <div className="space-y-3">
                    {[
                      { preference: 'Non-smoking rooms', count: 85, percentage: 68 },
                      { preference: 'High floor', count: 72, percentage: 58 },
                      { preference: 'Late check-out', count: 64, percentage: 51 },
                      { preference: 'Ocean view', count: 45, percentage: 36 },
                      { preference: 'Extra pillows', count: 38, percentage: 30 },
                      { preference: 'Quiet room', count: 29, percentage: 23 },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{item.preference}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{item.count}</span>
                          <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booking History Trends */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Booking Trends</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Average stay duration</span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">3.2 nights</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Repeat guest rate</span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">71%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Average booking value</span>
                      <span className="text-lg font-bold text-purple-600 dark:text-purple-400">$485</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Peak booking season</span>
                      <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">Summer</span>
                    </div>
                  </div>
                </div>

                {/* VIP Guest Services */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">VIP Guest Services</h4>
                  <div className="space-y-3">
                    {[
                      'Complimentary room upgrade',
                      'Welcome amenities',
                      'Priority check-in/out',
                      'Concierge services',
                      'Late check-out (until 2 PM)',
                      'Complimentary breakfast',
                    ].map((service, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Gift className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Guest Feedback Summary */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Feedback Summary</h4>
                  <div className="space-y-3">
                    {[
                      { category: 'Service Quality', rating: 4.8, color: 'text-green-600 dark:text-green-400' },
                      { category: 'Room Cleanliness', rating: 4.7, color: 'text-blue-600 dark:text-blue-400' },
                      { category: 'Food & Beverage', rating: 4.5, color: 'text-purple-600 dark:text-purple-400' },
                      { category: 'Value for Money', rating: 4.3, color: 'text-yellow-600 dark:text-yellow-400' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{item.category}</span>
                        <div className="flex items-center space-x-2">
                          <span className={`text-lg font-bold ${item.color}`}>{item.rating}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(item.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Guest Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add New Guest</h3>
            <form onSubmit={handleAddGuest} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" value={newGuest.name} onChange={(e) => setNewGuest(prev => ({ ...prev, name: e.target.value }))} placeholder="Full name" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
                <input type="email" value={newGuest.email} onChange={(e) => setNewGuest(prev => ({ ...prev, email: e.target.value }))} placeholder="Email" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
                <input type="tel" value={newGuest.phone} onChange={(e) => setNewGuest(prev => ({ ...prev, phone: e.target.value }))} placeholder="Phone" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
                <select value={newGuest.idType} onChange={(e) => setNewGuest(prev => ({ ...prev, idType: e.target.value as Guest['idType'] }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="passport">Passport</option>
                  <option value="national-id">National ID</option>
                  <option value="driving-license">Driving License</option>
                </select>
                <input type="text" value={newGuest.idNumber} onChange={(e) => setNewGuest(prev => ({ ...prev, idNumber: e.target.value }))} placeholder="ID Number" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
                <input type="text" value={newGuest.address} onChange={(e) => setNewGuest(prev => ({ ...prev, address: e.target.value }))} placeholder="Address" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
              </div>
              <textarea value={newGuest.preferences} onChange={(e) => setNewGuest(prev => ({ ...prev, preferences: e.target.value }))} placeholder="Preferences (comma separated)" rows={2} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              <textarea value={newGuest.notes} onChange={(e) => setNewGuest(prev => ({ ...prev, notes: e.target.value }))} placeholder="Special notes" rows={2} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">Add Guest</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Guest Profile Modal */}
      {selectedGuest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Guest Profile</h3>
              <button
                onClick={() => setSelectedGuest(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Guest Info */}
              <div className="lg:col-span-1">
                <div className="text-center mb-6">
                
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">
                      {selectedGuest.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">{selectedGuest.name}</h4>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getLoyaltyTier(selectedGuest.loyaltyPoints).color}`}>
                    {getLoyaltyTier(selectedGuest.loyaltyPoints).tier} Member
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Contact Information</label>
                    <div className="mt-1 space-y-2">
                      <p className="text-sm text-gray-900 dark:text-white">{selectedGuest.email}</p>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedGuest.phone}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{selectedGuest.address}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Identification</label>
                    <div className="mt-1">
                      <p className="text-sm text-gray-900 dark:text-white">{selectedGuest.idType}: {selectedGuest.idNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Guest Stats & Preferences */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedGuest.loyaltyPoints}</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Loyalty Points</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{selectedGuest.totalStays}</p>
                    <p className="text-sm text-green-600 dark:text-green-400">Total Stays</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">4.8</p>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Avg Rating</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h5 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Preferences</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedGuest.preferences.map((pref, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {selectedGuest.notes && (
                    <div>
                      <h5 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Notes</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        {selectedGuest.notes}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <h5 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Recent Activity</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-sm text-gray-900 dark:text-white">Last visit</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedGuest.lastVisit?.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-sm text-gray-900 dark:text-white">Member since</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">January 2023</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}