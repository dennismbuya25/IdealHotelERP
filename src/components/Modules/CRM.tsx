import React, { useState } from 'react';
import { Users, Star, MessageSquare, Gift, Mail, Phone, Plus, Search, Filter, Heart, Award } from 'lucide-react';
import { mockGuests, mockFeedback } from '../../data/mockData';
import { Guest, Feedback } from '../../types';

export default function CRM() {
  const [guests] = useState<Guest[]>(mockGuests);
  const [feedback] = useState<Feedback[]>(mockFeedback);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'guests' | 'feedback' | 'loyalty' | 'communications'>('guests');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalGuests = guests.length;
  const vipGuests = guests.filter(g => g.loyaltyPoints > 1000).length;
  const avgSatisfaction = feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length;
  const totalLoyaltyPoints = guests.reduce((sum, g) => sum + g.loyaltyPoints, 0);

  const getLoyaltyTier = (points: number) => {
    if (points >= 2000) return { tier: 'Platinum', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' };
    if (points >= 1000) return { tier: 'Gold', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' };
    if (points >= 500) return { tier: 'Silver', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' };
    return { tier: 'Bronze', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300' };
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600 dark:text-green-400';
    if (rating >= 3.5) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const mockLoyaltyPrograms = [
    { id: '1', name: 'Welcome Bonus', points: 100, description: 'New guest registration bonus' },
    { id: '2', name: 'Birthday Special', points: 200, description: 'Birthday month bonus points' },
    { id: '3', name: 'Extended Stay', points: 50, description: 'Per night for stays over 3 nights' },
    { id: '4', name: 'Restaurant Dining', points: 25, description: 'Per $100 spent in restaurant' },
  ];

  const mockCommunications = [
    { id: '1', type: 'email', subject: 'Welcome to Ideal Hotel', recipient: 'Alice Smith', date: new Date(), status: 'sent' },
    { id: '2', type: 'sms', subject: 'Booking Confirmation', recipient: 'Bob Wilson', date: new Date(), status: 'delivered' },
    { id: '3', type: 'email', subject: 'Birthday Special Offer', recipient: 'Alice Smith', date: new Date(), status: 'opened' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Guest Feedback & CRM</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage guest relationships, feedback, and loyalty programs</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Guests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalGuests}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">VIP Guests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{vipGuests}</p>
            </div>
            <Award className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Satisfaction</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgSatisfaction.toFixed(1)}/5</p>
            </div>
            <Star className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Loyalty Points</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalLoyaltyPoints.toLocaleString()}</p>
            </div>
            <Gift className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('guests')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'guests'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Guest Management
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'feedback'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Feedback & Reviews
            </button>
            <button
              onClick={() => setActiveTab('loyalty')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'loyalty'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Loyalty Program
            </button>
            <button
              onClick={() => setActiveTab('communications')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'communications'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Communications
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Guest Management Tab */}
          {activeTab === 'guests' && (
            <div className="space-y-6">
              {/* Search and Actions */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search guests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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

              {/* Guest Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGuests.map((guest) => {
                  const loyaltyTier = getLoyaltyTier(guest.loyaltyPoints);
                  return (
                    <div key={guest.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-lg">
                            {guest.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{guest.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{guest.email}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${loyaltyTier.color}`}>
                          {loyaltyTier.tier}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                          <span className="text-gray-900 dark:text-white">{guest.phone}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Loyalty Points:</span>
                          <span className="font-medium text-blue-600 dark:text-blue-400">{guest.loyaltyPoints}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Total Stays:</span>
                          <span className="text-gray-900 dark:text-white">{guest.totalStays}</span>
                        </div>
                        {guest.lastVisit && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Last Visit:</span>
                            <span className="text-gray-900 dark:text-white">{guest.lastVisit.toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 mb-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Preferences:</p>
                        <div className="flex flex-wrap gap-1">
                          {guest.preferences.slice(0, 3).map((pref, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full text-xs">
                              {pref}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>Email</span>
                        </button>
                        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center space-x-1">
                          <Phone className="w-3 h-3" />
                          <span>Call</span>
                        </button>
                        <button className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg text-sm transition-colors">
                          View
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Feedback Tab */}
          {activeTab === 'feedback' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Guest Feedback & Reviews</h3>
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>All Ratings</option>
                    <option>5 Stars</option>
                    <option>4 Stars</option>
                    <option>3 Stars</option>
                    <option>2 Stars</option>
                    <option>1 Star</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {feedback.map((review) => (
                  <div key={review.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {review.guestName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{review.guestName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{review.date.toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className={`text-sm font-medium ${getRatingColor(review.rating)}`}>
                          {review.rating}/5
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 capitalize mb-2">
                        {review.category}
                      </span>
                      <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                    </div>

                    {review.response && (
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Management Response:</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{review.response}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        review.status === 'responded' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                          : review.status === 'resolved'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                      }`}>
                        {review.status}
                      </span>
                      {review.status === 'pending' && (
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                          Respond
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loyalty Program Tab */}
          {activeTab === 'loyalty' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Loyalty Program Management</h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Add Program</span>
                </button>
              </div>

              {/* Loyalty Tiers */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6 text-center">
                  <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <h4 className="font-medium text-orange-800 dark:text-orange-300">Bronze</h4>
                  <p className="text-sm text-orange-600 dark:text-orange-400">0 - 499 points</p>
                  <p className="text-xs text-orange-500 dark:text-orange-400 mt-1">5% discount</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
                  <Award className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-800 dark:text-gray-300">Silver</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">500 - 999 points</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">10% discount</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 text-center">
                  <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-300">Gold</h4>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">1000 - 1999 points</p>
                  <p className="text-xs text-yellow-500 dark:text-yellow-400 mt-1">15% discount</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 text-center">
                  <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-medium text-purple-800 dark:text-purple-300">Platinum</h4>
                  <p className="text-sm text-purple-600 dark:text-purple-400">2000+ points</p>
                  <p className="text-xs text-purple-500 dark:text-purple-400 mt-1">20% discount</p>
                </div>
              </div>

              {/* Loyalty Programs */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Point Earning Programs</h4>
                <div className="space-y-4">
                  {mockLoyaltyPrograms.map((program) => (
                    <div key={program.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Gift className="w-6 h-6 text-blue-600" />
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white">{program.name}</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{program.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-blue-600 dark:text-blue-400">{program.points} points</p>
                        <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300">
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Loyalty Members */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Top Loyalty Members</h4>
                <div className="space-y-3">
                  {guests
                    .sort((a, b) => b.loyaltyPoints - a.loyaltyPoints)
                    .slice(0, 5)
                    .map((guest, index) => {
                      const loyaltyTier = getLoyaltyTier(guest.loyaltyPoints);
                      return (
                        <div key={guest.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white font-medium text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{guest.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{guest.totalStays} stays</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-blue-600 dark:text-blue-400">{guest.loyaltyPoints} points</p>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${loyaltyTier.color}`}>
                              {loyaltyTier.tier}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* Communications Tab */}
          {activeTab === 'communications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Guest Communications</h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>New Campaign</span>
                </button>
              </div>

              {/* Communication Templates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <Mail className="w-8 h-8 text-blue-600 mb-3" />
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Welcome Email</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">Automated welcome message for new guests</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Edit Template
                  </button>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                  <MessageSquare className="w-8 h-8 text-green-600 mb-3" />
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Birthday Wishes</h4>
                  <p className="text-sm text-green-600 dark:text-green-400 mb-4">Special birthday offers and greetings</p>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Edit Template
                  </button>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
                  <Heart className="w-8 h-8 text-purple-600 mb-3" />
                  <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">Loyalty Rewards</h4>
                  <p className="text-sm text-purple-600 dark:text-purple-400 mb-4">Loyalty program updates and rewards</p>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Edit Template
                  </button>
                </div>
              </div>

              {/* Recent Communications */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Communications</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 dark:bg-gray-600">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Recipient
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      {mockCommunications.map((comm) => (
                        <tr key={comm.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {comm.type === 'email' ? (
                                <Mail className="w-4 h-4 text-blue-600 mr-2" />
                              ) : (
                                <MessageSquare className="w-4 h-4 text-green-600 mr-2" />
                              )}
                              <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{comm.type}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {comm.subject}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {comm.recipient}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {comm.date.toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              comm.status === 'sent' 
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                                : comm.status === 'delivered'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                : 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
                            }`}>
                              {comm.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>ID Type</option>
                  <option>Passport</option>
                  <option>National ID</option>
                  <option>Driving License</option>
                </select>
                <input
                  type="text"
                  placeholder="ID Number"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <textarea
                placeholder="Address"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <textarea
                placeholder="Preferences (comma separated)"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}