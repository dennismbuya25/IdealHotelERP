import React from 'react';
import { Users, Home, DollarSign, Star, TrendingUp, Calendar } from 'lucide-react';
import StatsCard from '../Dashboard/StatsCard';
import OccupancyChart from '../Dashboard/OccupancyChart';
import ActivityLog from '../Dashboard/ActivityLog';
import { mockDashboardStats, mockRooms } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const stats = mockDashboardStats;

  const getRoleSpecificStats = () => {
    if (user?.role === 'receptionist') {
      return [
        { title: 'Today Check-ins', value: stats.checkInsToday, icon: Users, color: 'green' as const, change: '+12% from yesterday', changeType: 'positive' as const },
        { title: 'Today Check-outs', value: stats.checkOutsToday, icon: Users, color: 'blue' as const, change: '+5% from yesterday', changeType: 'positive' as const },
        { title: 'Available Rooms', value: stats.availableRooms, icon: Home, color: 'purple' as const },
        { title: 'New Bookings', value: stats.todayBookings, icon: Calendar, color: 'indigo' as const, change: '+8% from yesterday', changeType: 'positive' as const },
      ];
    }

    return [
      { title: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'green' as const, change: '+12% from last month', changeType: 'positive' as const },
      { title: 'Occupancy Rate', value: `${stats.occupancyRate}%`, icon: TrendingUp, color: 'blue' as const, change: '+3% from last week', changeType: 'positive' as const },
      { title: 'Available Rooms', value: stats.availableRooms, icon: Home, color: 'purple' as const },
      { title: 'Guest Satisfaction', value: stats.customerSatisfaction, icon: Star, color: 'yellow' as const, change: '+0.2 from last month', changeType: 'positive' as const },
    ];
  };

  const roleStats = getRoleSpecificStats();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white p-6">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-blue-100">
          Here's what's happening at your hotel today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roleStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OccupancyChart rooms={mockRooms} />
        <ActivityLog />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/70 transition-colors">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">New Booking</span>
          </button>
          <button className="p-4 bg-green-50 dark:bg-green-900/50 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/70 transition-colors">
            <Home className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <span className="text-sm font-medium text-green-600 dark:text-green-400">Check-in Guest</span>
          </button>
          <button className="p-4 bg-purple-50 dark:bg-purple-900/50 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/70 transition-colors">
            <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Process Payment</span>
          </button>
          <button className="p-4 bg-yellow-50 dark:bg-yellow-900/50 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/70 transition-colors">
            <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
            <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
}