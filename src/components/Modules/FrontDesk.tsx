import React, { useState } from 'react';
import { UserCheck, UserX, Key, Clock, AlertCircle, Search, Plus } from 'lucide-react';
import { mockBookings, mockGuests, mockRooms } from '../../data/mockData';

export default function FrontDesk() {
  const [activeTab, setActiveTab] = useState<'checkin' | 'checkout' | 'guests'>('checkin');
  const [searchTerm, setSearchTerm] = useState('');

  const todayCheckIns = mockBookings.filter(b => 
    b.status === 'confirmed' && 
    b.checkIn.toDateString() === new Date().toDateString()
  );

  const todayCheckOuts = mockBookings.filter(b => 
    b.status === 'checked-in' && 
    b.checkOut.toDateString() === new Date().toDateString()
  );

  const getRoomDetails = (roomId: string) => {
    return mockRooms.find(r => r.id === roomId);
  };

  const filteredGuests = mockGuests.filter(guest =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Front Desk Operations</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage guest check-ins, check-outs, and profiles</p>
      </div>

      {/* Quick Stats */}
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Late Check-outs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">No-Shows</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
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
              onClick={() => setActiveTab('guests')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'guests'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Guest Profiles
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'checkin' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Today's Check-ins</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">{todayCheckIns.length} guests</span>
              </div>
              
              {todayCheckIns.length === 0 ? (
                <div className="text-center py-8">
                  <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No check-ins scheduled for today</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayCheckIns.map((booking) => {
                    const room = getRoomDetails(booking.roomId);
                    return (
                      <div key={booking.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">{booking.guestName}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{booking.guestEmail}</p>
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                Room {room?.number} • {room?.type}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                              <UserCheck className="w-4 h-4" />
                              <span>Check In</span>
                            </button>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors">
                              <Key className="w-4 h-4" />
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

          {activeTab === 'checkout' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Today's Check-outs</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">{todayCheckOuts.length} guests</span>
              </div>
              
              {todayCheckOuts.length === 0 ? (
                <div className="text-center py-8">
                  <UserX className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No check-outs scheduled for today</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayCheckOuts.map((booking) => {
                    const room = getRoomDetails(booking.roomId);
                    return (
                      <div key={booking.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">{booking.guestName}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{booking.guestEmail}</p>
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                Room {room?.number} • {room?.type}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
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

          {activeTab === 'guests' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Guest Profiles</h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>New Guest</span>
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search guests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div className="space-y-3">
                {filteredGuests.map((guest) => (
                  <div key={guest.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {guest.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{guest.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{guest.email} • {guest.phone}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {guest.loyaltyPoints} points • {guest.totalStays} stays
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                          VIP
                        </span>
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}