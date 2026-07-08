import React, { useState } from 'react';
import { Home, Users, Wrench, AlertTriangle, CheckCircle, Clock, Plus, Pencil, Trash2, XCircle } from 'lucide-react';
import { Room } from '../../types';
import { useSettings } from '../../contexts/SettingsContext';
import { useAppData } from '../../contexts/AppDataContext';

const emptyRoomForm = {
  number: '',
  type: 'single' as Room['type'],
  status: 'available' as Room['status'],
  price: 0,
  floor: 1,
  amenities: '',
  assignedCleaner: '',
};

export default function Rooms() {
  const { formatCurrency } = useSettings();
  const { rooms: appRooms, addRoom, updateRoom, deleteRoom, addBooking } = useAppData();
  const rooms = appRooms;
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterFloor, setFilterFloor] = useState<string>('all');
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [roomForm, setRoomForm] = useState(emptyRoomForm);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [housekeepingModal, setHousekeepingModal] = useState<{ room: Room | null; mode: 'assign' | 'update' | null }>({ room: null, mode: null });
  const [bookingModal, setBookingModal] = useState<{ room: Room | null }>({ room: null });
  const [bookingForm, setBookingForm] = useState({ guestName: '', guestEmail: '', guestPhone: '', checkIn: '', checkOut: '', specialRequests: '' });
  const [cleanerName, setCleanerName] = useState('');
  const [statusValue, setStatusValue] = useState<Room['status']>('available');

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

  const openCreateModal = () => {
    setEditingRoom(null);
    setRoomForm(emptyRoomForm);
    setShowRoomModal(true);
  };

  const openEditModal = (room: Room) => {
    setEditingRoom(room);
    setRoomForm({
      number: room.number,
      type: room.type,
      status: room.status,
      price: room.price,
      floor: room.floor,
      amenities: room.amenities.join(', '),
      assignedCleaner: room.assignedCleaner || '',
    });
    setShowRoomModal(true);
  };

  const handleDeleteRoom = (roomId: string) => {
    deleteRoom(roomId);
    setFeedback('Room deleted successfully.');
  };

  const handleSaveRoom = (event: React.FormEvent) => {
    event.preventDefault();

    if (editingRoom) {
      updateRoom({
        ...editingRoom,
        number: roomForm.number,
        type: roomForm.type,
        status: roomForm.status,
        price: roomForm.price,
        floor: roomForm.floor,
        amenities: roomForm.amenities.split(',').map(item => item.trim()).filter(Boolean),
        assignedCleaner: roomForm.assignedCleaner || undefined,
      });
      setFeedback(`Room ${roomForm.number} updated successfully.`);
    } else {
      addRoom({
        number: roomForm.number,
        type: roomForm.type,
        status: roomForm.status,
        price: roomForm.price,
        floor: roomForm.floor,
        amenities: roomForm.amenities.split(',').map(item => item.trim()).filter(Boolean),
        assignedCleaner: roomForm.assignedCleaner || undefined,
      });
      setFeedback(`Room ${roomForm.number} created successfully.`);
    }

    setShowRoomModal(false);
    setEditingRoom(null);
    setRoomForm(emptyRoomForm);
  };

  const openHousekeepingModal = (room: Room, mode: 'assign' | 'update') => {
    setHousekeepingModal({ room, mode });
    setCleanerName(room.assignedCleaner || 'Housekeeping Team');
    setStatusValue(room.status === 'maintenance' ? 'available' : 'available');
  };

  const openBookingModal = (room: Room) => {
    setBookingModal({ room });
    setBookingForm({ guestName: '', guestEmail: '', guestPhone: '', checkIn: '', checkOut: '', specialRequests: '' });
  };

  const handleBookingSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!bookingModal.room) {
      return;
    }

    const checkIn = new Date(bookingForm.checkIn);
    const checkOut = new Date(bookingForm.checkOut);
    const nights = Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) || 1);
    const totalAmount = bookingModal.room.price * nights;

    addBooking({
      guestName: bookingForm.guestName,
      guestEmail: bookingForm.guestEmail,
      guestPhone: bookingForm.guestPhone,
      roomId: bookingModal.room.id,
      checkIn,
      checkOut,
      status: 'confirmed',
      totalAmount,
      paymentStatus: 'pending',
      bookingSource: 'walk-in',
      specialRequests: bookingForm.specialRequests || undefined,
    });
    updateRoom({ ...bookingModal.room, status: 'occupied' });
    setFeedback(`Booking created for ${bookingForm.guestName} in Room ${bookingModal.room.number}.`);
    setBookingModal({ room: null });
    setBookingForm({ guestName: '', guestEmail: '', guestPhone: '', checkIn: '', checkOut: '', specialRequests: '' });
  };

  const handleHousekeepingSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!housekeepingModal.room) {
      return;
    }

    if (housekeepingModal.mode === 'assign') {
      updateRoom({
        ...housekeepingModal.room,
        assignedCleaner: cleanerName || 'Housekeeping Team',
        status: 'dirty',
      });
      setFeedback(`Cleaner assigned to room ${housekeepingModal.room.number}.`);
    } else {
      updateRoom({
        ...housekeepingModal.room,
        status: statusValue,
        assignedCleaner: undefined,
        lastCleaned: new Date(),
      });
      setFeedback(`Room ${housekeepingModal.room.number} status updated to ${statusValue.replace('-', ' ')}.`);
    }

    setHousekeepingModal({ room: null, mode: null });
    setCleanerName('');
    setStatusValue('available');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Room & Housekeeping Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor room status and manage housekeeping operations</p>
      </div>

      {feedback && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
          {feedback}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Room</span>
        </button>
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
                  <p>Price: {formatCurrency(room.price)}/night</p>
                  {room.assignedCleaner && (
                    <p>Cleaner: {room.assignedCleaner}</p>
                  )}
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <p>Amenities: {room.amenities.join(', ')}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {room.status === 'dirty' && (
                  <button
                    type="button"
                    onClick={() => openHousekeepingModal(room, 'assign')}
                    className="flex-1 min-w-[120px] bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                  >
                    {room.assignedCleaner ? 'Cleaner Assigned' : 'Assign Cleaner'}
                  </button>
                )}
                {room.status === 'maintenance' && (
                  <button
                    type="button"
                    onClick={() => openHousekeepingModal(room, 'update')}
                    className="flex-1 min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                  >
                    Update Status
                  </button>
                )}
                {room.status === 'available' && (
                  <button
                    type="button"
                    onClick={() => openBookingModal(room)}
                    className="flex-1 min-w-[120px] bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                  >
                    Book Room
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => openEditModal(room)}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-1"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteRoom(room.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {bookingModal.room && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Book Room {bookingModal.room.number}</h3>
              <button type="button" onClick={() => setBookingModal({ room: null })} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={bookingForm.guestName} onChange={(e) => setBookingForm(prev => ({ ...prev, guestName: e.target.value }))} placeholder="Guest name" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg" required />
                <input value={bookingForm.guestPhone} onChange={(e) => setBookingForm(prev => ({ ...prev, guestPhone: e.target.value }))} placeholder="Guest phone" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg" required />
                <input type="email" value={bookingForm.guestEmail} onChange={(e) => setBookingForm(prev => ({ ...prev, guestEmail: e.target.value }))} placeholder="Guest email (optional)" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
                <input type="date" value={bookingForm.checkIn} onChange={(e) => setBookingForm(prev => ({ ...prev, checkIn: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg" required />
                <input type="date" value={bookingForm.checkOut} onChange={(e) => setBookingForm(prev => ({ ...prev, checkOut: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg" required />
                <textarea value={bookingForm.specialRequests} onChange={(e) => setBookingForm(prev => ({ ...prev, specialRequests: e.target.value }))} placeholder="Special requests" rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg md:col-span-2" />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setBookingModal({ room: null })} className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">Save Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRoomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingRoom ? 'Edit Room' : 'Add New Room'}
              </h3>
              <button type="button" onClick={() => setShowRoomModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveRoom} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room Number</label>
                  <input type="text" value={roomForm.number} onChange={(e) => setRoomForm(prev => ({ ...prev, number: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                  <select value={roomForm.type} onChange={(e) => setRoomForm(prev => ({ ...prev, type: e.target.value as Room['type'] }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="suite">Suite</option>
                    <option value="deluxe">Deluxe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select value={roomForm.status} onChange={(e) => setRoomForm(prev => ({ ...prev, status: e.target.value as Room['status'] }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="dirty">Dirty</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="out-of-order">Out of Order</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Floor</label>
                  <input type="number" value={roomForm.floor} onChange={(e) => setRoomForm(prev => ({ ...prev, floor: Number(e.target.value) }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price per Night</label>
                  <input type="number" value={roomForm.price} onChange={(e) => setRoomForm(prev => ({ ...prev, price: Number(e.target.value) }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assigned Cleaner</label>
                  <input type="text" value={roomForm.assignedCleaner} onChange={(e) => setRoomForm(prev => ({ ...prev, assignedCleaner: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amenities (comma separated)</label>
                <textarea value={roomForm.amenities} onChange={(e) => setRoomForm(prev => ({ ...prev, amenities: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowRoomModal(false)} className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">{editingRoom ? 'Save Changes' : 'Create Room'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {housekeepingModal.room && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {housekeepingModal.mode === 'assign' ? 'Assign Cleaner' : 'Update Room Status'}
              </h3>
              <button type="button" onClick={() => setHousekeepingModal({ room: null, mode: null })} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleHousekeepingSubmit} className="space-y-4">
              {housekeepingModal.mode === 'assign' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cleaner Name</label>
                  <input type="text" value={cleanerName} onChange={(e) => setCleanerName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Status</label>
                  <select value={statusValue} onChange={(e) => setStatusValue(e.target.value as Room['status'])} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="available">Available</option>
                    <option value="dirty">Dirty</option>
                    <option value="occupied">Occupied</option>
                  </select>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setHousekeepingModal({ room: null, mode: null })} className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                <button
                  type="button"
                  onClick={() => openHousekeepingModal(room, room.status === 'dirty' ? 'assign' : 'update')}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                >
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