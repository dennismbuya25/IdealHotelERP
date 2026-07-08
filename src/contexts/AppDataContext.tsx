import React, { createContext, useContext, useMemo, useState, useEffect, ReactNode } from 'react';
import { AuditLog, Booking, Guest, InventoryItem, KitchenOrder, Room, Staff, User } from '../types';

export interface RotaAssignment {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  shift: Staff['shift'];
}

interface AppDataContextType {
  rooms: Room[];
  bookings: Booking[];
  guests: Guest[];
  staff: Staff[];
  kitchenOrders: KitchenOrder[];
  inventoryItems: InventoryItem[];
  rotaAssignments: RotaAssignment[];
  users: User[];
  auditLogs: AuditLog[];
  permissionProfiles: Record<string, string[]>;
  addRoom: (room: Omit<Room, 'id'>) => Room;
  updateRoom: (room: Room) => void;
  deleteRoom: (roomId: string) => void;
  addBooking: (booking: Omit<Booking, 'id'>) => Booking;
  updateBooking: (booking: Booking) => void;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  deleteBooking: (bookingId: string) => void;
  addGuest: (guest: Omit<Guest, 'id'>) => Guest;
  updateGuest: (guest: Guest) => void;
  addStaff: (staff: Omit<Staff, 'id'>) => Staff;
  updateStaff: (staff: Staff) => void;
  deleteStaff: (staffId: string) => void;
  addKitchenOrder: (order: Omit<KitchenOrder, 'id'>) => KitchenOrder;
  updateKitchenOrder: (order: KitchenOrder) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => InventoryItem;
  updateInventoryItem: (item: InventoryItem) => void;
  addRotaAssignment: (assignment: Omit<RotaAssignment, 'id'>) => RotaAssignment;
  addUser: (user: Omit<User, 'id'>) => User;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => AuditLog;
  updateUser: (user: User) => void;
  updatePermissionProfile: (role: User['role'], permissions: string[]) => void;
}

const STORAGE_KEY = 'ideal-hotel-app-data';

const initialUsers: User[] = [
  { id: 'u-admin', name: 'Admin User', email: 'admin@idealhotel.com', role: 'admin', isActive: true },
  { id: 'u-manager', name: 'Manager User', email: 'manager@idealhotel.com', role: 'manager', isActive: true },
  { id: 'u-receptionist', name: 'Receptionist User', email: 'reception@idealhotel.com', role: 'receptionist', isActive: true },
  { id: 'u-housekeeping', name: 'Housekeeping User', email: 'housekeeping@idealhotel.com', role: 'housekeeping', isActive: true },
  { id: 'u-hr', name: 'HR User', email: 'hr@idealhotel.com', role: 'hr', isActive: true },
  { id: 'u-guest', name: 'Guest User', email: 'guest@idealhotel.com', role: 'guest', isActive: true },
];

const initialPermissionProfiles: Record<string, string[]> = {
  admin: ['Full Access', 'User Management', 'System Settings', 'Financial Reports'],
  manager: ['Dashboard', 'Bookings', 'Staff Management', 'Reports'],
  receptionist: ['Dashboard', 'Bookings', 'Guest Management', 'Front Desk'],
  housekeeping: ['Room Management', 'Housekeeping Tasks'],
  restaurant: ['Restaurant & KOT', 'Orders', 'Kitchen View'],
  hr: ['HR', 'Payroll', 'Rota Management', 'Staff Profiles'],
  guest: ['View Bookings', 'Book Rooms', 'Request Meals'],
};

function hydrateData(data: any) {
  return {
    ...data,
    bookings: (data.bookings || []).map((booking: Booking) => ({
      ...booking,
      checkIn: new Date(booking.checkIn as unknown as string),
      checkOut: new Date(booking.checkOut as unknown as string),
    })),
    guests: (data.guests || []).map((guest: Guest) => ({
      ...guest,
      lastVisit: guest.lastVisit ? new Date(guest.lastVisit as unknown as string) : undefined,
    })),
    staff: (data.staff || []).map((member: Staff) => ({
      ...member,
      joinDate: new Date(member.joinDate as unknown as string),
      attendance: (member.attendance || []).map((record: any) => ({
        ...record,
        date: new Date(record.date as unknown as string),
        checkIn: record.checkIn ? new Date(record.checkIn as unknown as string) : undefined,
        checkOut: record.checkOut ? new Date(record.checkOut as unknown as string) : undefined,
      })),
    })),
    kitchenOrders: (data.kitchenOrders || []).map((order: KitchenOrder) => ({
      ...order,
      orderTime: new Date(order.orderTime as unknown as string),
    })),
    inventoryItems: (data.inventoryItems || []).map((item: InventoryItem) => ({
      ...item,
      lastUpdated: new Date(item.lastUpdated as unknown as string),
    })),
    rooms: (data.rooms || []).map((room: Room) => ({
      ...room,
      lastCleaned: room.lastCleaned ? new Date(room.lastCleaned as unknown as string) : undefined,
    })),
    rotaAssignments: data.rotaAssignments || [],
    users: data.users || initialUsers,
    auditLogs: data.auditLogs || [],
    permissionProfiles: data.permissionProfiles || initialPermissionProfiles,
  };
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [appData, setAppData] = useState(() => {
    if (typeof window === 'undefined') {
      return hydrateData({
        rooms: [],
        bookings: [],
        guests: [],
        staff: [],
        kitchenOrders: [],
        inventoryItems: [],
        rotaAssignments: [],
        users: initialUsers,
        permissionProfiles: initialPermissionProfiles,
      });
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return hydrateData({
        rooms: [],
        bookings: [],
        guests: [],
        staff: [],
        kitchenOrders: [],
        inventoryItems: [],
        rotaAssignments: [],
        users: initialUsers,
        permissionProfiles: initialPermissionProfiles,
      });
    }

    try {
      return hydrateData(JSON.parse(stored));
    } catch {
      return hydrateData({
        rooms: [],
        bookings: [],
        guests: [],
        staff: [],
        kitchenOrders: [],
        inventoryItems: [],
        rotaAssignments: [],
        users: initialUsers,
        permissionProfiles: initialPermissionProfiles,
      });
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    }
  }, [appData]);

  const addRoom = (room: Omit<Room, 'id'>) => {
    const createdRoom: Room = {
      id: `room-${Date.now()}`,
      ...room,
    };
    setAppData(prev => ({ ...prev, rooms: [createdRoom, ...prev.rooms] }));
    return createdRoom;
  };

  const updateRoom = (room: Room) => {
    setAppData(prev => ({ ...prev, rooms: prev.rooms.map(existing => existing.id === room.id ? room : existing) }));
  };

  const deleteRoom = (roomId: string) => {
    setAppData(prev => ({ ...prev, rooms: prev.rooms.filter(room => room.id !== roomId) }));
  };

  const addBooking = (booking: Omit<Booking, 'id'>) => {
    const createdBooking: Booking = {
      id: `BK-${Date.now()}`,
      ...booking,
    };
    setAppData(prev => ({ ...prev, bookings: [createdBooking, ...prev.bookings] }));
    return createdBooking;
  };

  const updateBooking = (booking: Booking) => {
    setAppData(prev => ({ ...prev, bookings: prev.bookings.map(existing => existing.id === booking.id ? booking : existing) }));
  };

  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
    setAppData(prev => ({ ...prev, bookings: prev.bookings.map(booking => booking.id === bookingId ? { ...booking, status } : booking) }));
  };

  const deleteBooking = (bookingId: string) => {
    setAppData(prev => ({ ...prev, bookings: prev.bookings.filter(booking => booking.id !== bookingId) }));
  };

  const addGuest = (guest: Omit<Guest, 'id'>) => {
    const createdGuest: Guest = {
      id: `G-${Date.now()}`,
      ...guest,
    };
    setAppData(prev => ({ ...prev, guests: [createdGuest, ...prev.guests] }));
    return createdGuest;
  };

  const updateGuest = (guest: Guest) => {
    setAppData(prev => ({ ...prev, guests: prev.guests.map(existing => existing.id === guest.id ? guest : existing) }));
  };

  const addStaff = (staffValue: Omit<Staff, 'id'>) => {
    const createdStaff: Staff = {
      id: `staff-${Date.now()}`,
      ...staffValue,
    };
    setAppData(prev => ({ ...prev, staff: [createdStaff, ...prev.staff] }));
    return createdStaff;
  };

  const updateStaff = (staffValue: Staff) => {
    setAppData(prev => ({ ...prev, staff: prev.staff.map(existing => existing.id === staffValue.id ? staffValue : existing) }));
  };

  const deleteStaff = (staffId: string) => {
    setAppData(prev => ({ ...prev, staff: prev.staff.filter(member => member.id !== staffId) }));
  };

  const addKitchenOrder = (order: Omit<KitchenOrder, 'id'>) => {
    const createdOrder: KitchenOrder = {
      id: `kot-${Date.now()}`,
      ...order,
    };
    setAppData(prev => ({ ...prev, kitchenOrders: [createdOrder, ...prev.kitchenOrders] }));
    return createdOrder;
  };

  const updateKitchenOrder = (order: KitchenOrder) => {
    setAppData(prev => ({ ...prev, kitchenOrders: prev.kitchenOrders.map(existing => existing.id === order.id ? order : existing) }));
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const createdItem: InventoryItem = {
      id: `item-${Date.now()}`,
      ...item,
    };
    setAppData(prev => ({ ...prev, inventoryItems: [createdItem, ...prev.inventoryItems] }));
    return createdItem;
  };

  const updateInventoryItem = (item: InventoryItem) => {
    setAppData(prev => ({ ...prev, inventoryItems: prev.inventoryItems.map(existing => existing.id === item.id ? item : existing) }));
  };

  const addUser = (user: Omit<User, 'id'>) => {
    const createdUser: User = {
      id: `u-${Date.now()}`,
      ...user,
    };
    setAppData(prev => ({ ...prev, users: [createdUser, ...prev.users] }));
    return createdUser;
  };

  const addRotaAssignment = (assignment: Omit<RotaAssignment, 'id'>) => {
    const createdAssignment: RotaAssignment = {
      id: `${assignment.employeeId}-${assignment.date}`,
      ...assignment,
    };
    setAppData(prev => ({
      ...prev,
      rotaAssignments: prev.rotaAssignments.filter(existing => !(existing.date === assignment.date && existing.employeeId === assignment.employeeId)).concat(createdAssignment),
    }));
    return createdAssignment;
  };

  const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const createdLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date(),
      ...log,
    };
    setAppData(prev => ({ ...prev, auditLogs: [createdLog, ...prev.auditLogs] }));
    return createdLog;
  };

  const updateUser = (user: User) => {
    setAppData(prev => ({ ...prev, users: prev.users.map(existing => existing.id === user.id ? user : existing) }));
  };

  const updatePermissionProfile = (role: User['role'], permissions: string[]) => {
    setAppData(prev => ({ ...prev, permissionProfiles: { ...prev.permissionProfiles, [role]: permissions } }));
  };

  const value = useMemo(() => ({
    rooms: appData.rooms,
    bookings: appData.bookings,
    guests: appData.guests,
    staff: appData.staff,
    kitchenOrders: appData.kitchenOrders,
    inventoryItems: appData.inventoryItems,
    rotaAssignments: appData.rotaAssignments,
    users: appData.users,
    auditLogs: appData.auditLogs,
    permissionProfiles: appData.permissionProfiles,
    addRoom,
    updateRoom,
    deleteRoom,
    addBooking,
    updateBooking,
    updateBookingStatus,
    deleteBooking,
    addGuest,
    updateGuest,
    addStaff,
    updateStaff,
    deleteStaff,
    addKitchenOrder,
    updateKitchenOrder,
    addInventoryItem,
    updateInventoryItem,
    addRotaAssignment,
    addUser,
    addAuditLog,
    updateUser,
    updatePermissionProfile,
  }), [appData, addRoom, updateRoom, deleteRoom, addBooking, updateBooking, updateBookingStatus, deleteBooking, addGuest, updateGuest, addStaff, updateStaff, deleteStaff, addRotaAssignment, addUser, addAuditLog, updateUser, updatePermissionProfile]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}
