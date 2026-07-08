import React, { useState } from 'react';
import { Home, Users, Wrench, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { mockRooms } from '../../data/mockData';
import { Room } from '../../types';

export default function Rooms() {
  const [rooms] = useState<Room[]>(mockRooms);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterFloor, setFilterFloor] = useState<string>('all');

  const filteredRooms = rooms.filter(room => {
    const matchesStatus = filterStatus === 'all' || room.status === filterStatus;
    const matchesFloor = filterFloor === 'all' || room.floor.toString() === filterFloor;
    return matchesStatus && matchesFloor;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'occupied': return <Users className="w-5 h-5 text-blue-600" />;
      case 'dirty': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'maintenance': return <Wrench className="w-5 h-5 text-red-600" />;
      case 'out-of-order': return <AlertTriangle className="w-5 h-5 text-gray-600" />;
      default: return <Home className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800';
      case 'occupied': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800';
      case 'dirty': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800';
      case 'maintenance': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800';
      case 'out-of-order': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case 'single': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
      case 'double': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300';
      case 'suite': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300';
      case 'deluxe': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const statusCounts = rooms.reduce((acc, room) => {
    acc[room.status] = (acc[room.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Room & Housekeeping Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor room status and manage housekeeping operations</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available</p>
              <p className="text-xl font-bold text-green-600">{statusCounts.available || 0}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Occupied</p>
              <p className="text-xl font-bold text-blue-600">{statusCounts.occupied || 0}</p>
            </div>
            <Users className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Dirty</p>
              <p className="text-xl font-bold text-yellow-600">{statusCounts.dirty || 0}</p>
            </div>
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Maintenance</p>
              <p className="text-xl font-bold text-red-600">{statusCounts.maintenance || 0}</p>
            </div>
            <Wrench className="w-6 h-6 text-red-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Out of Order</p>
              <p className="text-xl font-bold text-gray-600">{statusCounts['out-of-order'] || 0}</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="dirty">Dirty</option>
              <option value="maintenance">Maintenance</option>
              <option value="out-of-order">Out of Order</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Floor:</label>
            <select
              value={filterFloor}
              onChange={(e) => setFilterFloor(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Floors</option>
              <option value="1">Floor 1</option>
              <option value="2">Floor 2</option>
              <option value="3">Floor 3</option>
            </select>
          </div>
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRooms.map((room) => (
          <div key={room.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(room.status)}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Room {room.number}
                  </h3>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoomTypeColor(room.type)}`}>
                  {room.type}
                </span>
              </div>

              <div className="space-y-3">
                <div className={`px-3 py-2 rounded-lg border ${getStatusColor(room.status)}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{room.status.replace('-', ' ')}</span>
                    {room.status === 'dirty' && room.lastCleaned && (
                      <span className="text-xs">
                        {new Date(room.lastCleaned).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>Floor: {room.floor}</p>
                  <p>Price: ${room.price}/night</p>
                  {room.assignedCleaner && (
                    <p>Cleaner: {room.assignedCleaner}</p>
                  )}
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <p>Amenities: {room.amenities.join(', ')}</p>
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                {room.status === 'dirty' && (
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                    Assign Cleaner
                  </button>
                )}
                {room.status === 'maintenance' && (
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                    Update Status
                  </button>
                )}
                {room.status === 'available' && (
                  <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                    Book Room
                  </button>
                )}
                <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg text-sm transition-colors">
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Housekeeping Schedule */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Housekeeping Schedule</h3>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            Update Schedule
          </button>
        </div>

        <div className="space-y-4">
          {rooms.filter(r => r.status === 'dirty' || r.assignedCleaner).map((room) => (
            <div key={room.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Room {room.number}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {room.assignedCleaner ? `Assigned to: ${room.assignedCleaner}` : 'Needs cleaning'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                  {room.status.replace('-', ' ')}
                </span>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}