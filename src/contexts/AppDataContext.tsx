import React, { createContext, useContext, useMemo, useState, useEffect, ReactNode } from 'react';
import { AuditLog, Booking, Expense, Guest, Integration, InventoryItem, Invoice, KitchenOrder, Room, Staff, User } from '../types';

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
  invoices: Invoice[];
  expenses: Expense[];
  integrations: Integration[];
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
  addInvoice: (invoice: Omit<Invoice, 'id'>) => Invoice;
  addExpense: (expense: Omit<Expense, 'id'>) => Expense;
  addIntegration: (integration: Omit<Integration, 'id'>) => Integration;
}

const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : '/api';

function hydrateData(data: any) {
  return {
    ...data,
    bookings: (data.bookings || []).map((booking: Booking) => ({
      ...booking,
      checkIn: booking.checkIn ? new Date(booking.checkIn as unknown as string) : new Date(),
      checkOut: booking.checkOut ? new Date(booking.checkOut as unknown as string) : new Date(),
    })),
    guests: (data.guests || []).map((guest: Guest) => ({
      ...guest,
      lastVisit: guest.lastVisit ? new Date(guest.lastVisit as unknown as string) : undefined,
    })),
    staff: (data.staff || []).map((member: Staff) => ({
      ...member,
      joinDate: member.joinDate ? new Date(member.joinDate as unknown as string) : new Date(),
      attendance: (member.attendance || []).map((record: any) => ({
        ...record,
        date: record.date ? new Date(record.date as unknown as string) : new Date(),
        checkIn: record.checkIn ? new Date(record.checkIn as unknown as string) : undefined,
        checkOut: record.checkOut ? new Date(record.checkOut as unknown as string) : undefined,
      })),
    })),
    kitchenOrders: (data.kitchenOrders || []).map((order: KitchenOrder) => ({
      ...order,
      orderTime: order.orderTime ? new Date(order.orderTime as unknown as string) : new Date(),
    })),
    inventoryItems: (data.inventoryItems || []).map((item: InventoryItem) => ({
      ...item,
      lastUpdated: item.lastUpdated ? new Date(item.lastUpdated as unknown as string) : new Date(),
    })),
    rooms: (data.rooms || []).map((room: Room) => ({
      ...room,
      lastCleaned: room.lastCleaned ? new Date(room.lastCleaned as unknown as string) : undefined,
    })),
    invoices: (data.invoices || []).map((invoice: Invoice) => ({
      ...invoice,
      issueDate: invoice.issueDate ? new Date(invoice.issueDate as unknown as string) : new Date(),
      dueDate: invoice.dueDate ? new Date(invoice.dueDate as unknown as string) : new Date(),
    })),
    expenses: (data.expenses || []).map((expense: Expense) => ({
      ...expense,
      date: expense.date ? new Date(expense.date as unknown as string) : new Date(),
    })),
    integrations: data.integrations || [],
    rotaAssignments: data.rotaAssignments || [],
    users: data.users || [],
    auditLogs: data.auditLogs || [],
    permissionProfiles: data.permissionProfiles || {},
  };
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [appData, setAppData] = useState(() => hydrateData({
    rooms: [],
    bookings: [],
    guests: [],
    staff: [],
    kitchenOrders: [],
    inventoryItems: [],
    rotaAssignments: [],
    users: [],
    invoices: [],
    expenses: [],
    integrations: [],
    permissionProfiles: {},
  }));

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/app-data`);
        if (!response.ok) {
          throw new Error('Failed to load data from the local database');
        }
        const data = await response.json();
        setAppData(hydrateData({
          rooms: data.rooms || [],
          bookings: data.bookings || [],
          guests: data.guests || [],
          staff: data.staff || [],
          kitchenOrders: data.kitchenOrders || [],
          inventoryItems: data.inventoryItems || [],
          rotaAssignments: data.rotaAssignments || [],
          users: data.users || [],
          auditLogs: data.auditLogs || [],
          invoices: data.invoices || [],
          expenses: data.expenses || [],
          integrations: data.integrations || [],
          permissionProfiles: data.permissionProfiles || {},
        }));
      } catch (error) {
        console.error('Failed to load app data:', error);
      }
    };

    loadData();
  }, []);

  const syncMutation = async (entity: string, action: string, payload: any) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/app-data`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ entity, action, payload }),
    });

    if (!response.ok) {
      throw new Error(`Failed to sync ${entity}`);
    }

    return response.json();
  };

  const addRoom = (room: Omit<Room, 'id'>) => {
    const createdRoom: Room = {
      id: `room-${Date.now()}`,
      ...room,
    };
    setAppData(prev => ({ ...prev, rooms: [createdRoom, ...prev.rooms] }));
    void syncMutation('room', 'create', createdRoom).catch(console.error);
    return createdRoom;
  };

  const updateRoom = (room: Room) => {
    setAppData(prev => ({ ...prev, rooms: prev.rooms.map(existing => existing.id === room.id ? room : existing) }));
    void syncMutation('room', 'update', room).catch(console.error);
  };

  const deleteRoom = (roomId: string) => {
    setAppData(prev => ({ ...prev, rooms: prev.rooms.filter(room => room.id !== roomId) }));
    void syncMutation('room', 'delete', { id: roomId }).catch(console.error);
  };

  const addBooking = (booking: Omit<Booking, 'id'>) => {
    const createdBooking: Booking = {
      id: `BK-${Date.now()}`,
      ...booking,
    };
    setAppData(prev => ({ ...prev, bookings: [createdBooking, ...prev.bookings] }));
    void syncMutation('booking', 'create', createdBooking).catch(console.error);
    return createdBooking;
  };

  const updateBooking = (booking: Booking) => {
    setAppData(prev => ({ ...prev, bookings: prev.bookings.map(existing => existing.id === booking.id ? booking : existing) }));
    void syncMutation('booking', 'update', booking).catch(console.error);
  };

  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
    setAppData(prev => ({ ...prev, bookings: prev.bookings.map(booking => booking.id === bookingId ? { ...booking, status } : booking) }));
    void syncMutation('booking', 'update', { id: bookingId, status }).catch(console.error);
  };

  const deleteBooking = (bookingId: string) => {
    setAppData(prev => ({ ...prev, bookings: prev.bookings.filter(booking => booking.id !== bookingId) }));
    void syncMutation('booking', 'delete', { id: bookingId }).catch(console.error);
  };

  const addGuest = (guest: Omit<Guest, 'id'>) => {
    const createdGuest: Guest = {
      id: `G-${Date.now()}`,
      ...guest,
    };
    setAppData(prev => ({ ...prev, guests: [createdGuest, ...prev.guests] }));
    void syncMutation('guest', 'create', createdGuest).catch(console.error);
    return createdGuest;
  };

  const updateGuest = (guest: Guest) => {
    setAppData(prev => ({ ...prev, guests: prev.guests.map(existing => existing.id === guest.id ? guest : existing) }));
    void syncMutation('guest', 'update', guest).catch(console.error);
  };

  const addStaff = (staffValue: Omit<Staff, 'id'>) => {
    const createdStaff: Staff = {
      id: `staff-${Date.now()}`,
      ...staffValue,
    };
    setAppData(prev => ({ ...prev, staff: [createdStaff, ...prev.staff] }));
    void syncMutation('staff', 'create', createdStaff).catch(console.error);
    return createdStaff;
  };

  const updateStaff = (staffValue: Staff) => {
    setAppData(prev => ({ ...prev, staff: prev.staff.map(existing => existing.id === staffValue.id ? staffValue : existing) }));
    void syncMutation('staff', 'update', staffValue).catch(console.error);
  };

  const deleteStaff = (staffId: string) => {
    setAppData(prev => ({ ...prev, staff: prev.staff.filter(member => member.id !== staffId) }));
    void syncMutation('staff', 'delete', { id: staffId }).catch(console.error);
  };

  const addKitchenOrder = (order: Omit<KitchenOrder, 'id'>) => {
    const createdOrder: KitchenOrder = {
      id: `kot-${Date.now()}`,
      ...order,
    };
    setAppData(prev => ({ ...prev, kitchenOrders: [createdOrder, ...prev.kitchenOrders] }));
    void syncMutation('kitchenOrder', 'create', createdOrder).catch(console.error);
    return createdOrder;
  };

  const updateKitchenOrder = (order: KitchenOrder) => {
    setAppData(prev => ({ ...prev, kitchenOrders: prev.kitchenOrders.map(existing => existing.id === order.id ? order : existing) }));
    void syncMutation('kitchenOrder', 'update', order).catch(console.error);
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const createdItem: InventoryItem = {
      id: `item-${Date.now()}`,
      ...item,
    };
    setAppData(prev => ({ ...prev, inventoryItems: [createdItem, ...prev.inventoryItems] }));
    void syncMutation('inventoryItem', 'create', createdItem).catch(console.error);
    return createdItem;
  };

  const updateInventoryItem = (item: InventoryItem) => {
    setAppData(prev => ({ ...prev, inventoryItems: prev.inventoryItems.map(existing => existing.id === item.id ? item : existing) }));
    void syncMutation('inventoryItem', 'update', item).catch(console.error);
  };

  const addUser = (user: Omit<User, 'id'>) => {
    const createdUser: User = {
      id: `u-${Date.now()}`,
      username: user.email,
      password: 'Welcome123!',
      ...user,
    };
    setAppData(prev => ({ ...prev, users: [createdUser, ...prev.users] }));
    void syncMutation('user', 'create', createdUser).catch(console.error);
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
    void syncMutation('auditLog', 'create', createdLog).catch(console.error);
    return createdLog;
  };

  const updateUser = (user: User) => {
    setAppData(prev => ({ ...prev, users: prev.users.map(existing => existing.id === user.id ? user : existing) }));
    void syncMutation('user', 'update', user).catch(console.error);
  };

  const updatePermissionProfile = (role: User['role'], permissions: string[]) => {
    setAppData(prev => ({ ...prev, permissionProfiles: { ...prev.permissionProfiles, [role]: permissions } }));
    void syncMutation('permissionProfile', 'update', { role, permissions }).catch(console.error);
  };

  const addInvoice = (invoice: Omit<Invoice, 'id'>) => {
    const createdInvoice: Invoice = {
      id: `INV-${Date.now()}`,
      ...invoice,
    };
    setAppData(prev => ({ ...prev, invoices: [createdInvoice, ...prev.invoices] }));
    void syncMutation('invoice', 'create', createdInvoice).catch(console.error);
    return createdInvoice;
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const createdExpense: Expense = {
      id: `EXP-${Date.now()}`,
      ...expense,
    };
    setAppData(prev => ({ ...prev, expenses: [createdExpense, ...prev.expenses] }));
    void syncMutation('expense', 'create', createdExpense).catch(console.error);
    return createdExpense;
  };

  const addIntegration = (integration: Omit<Integration, 'id'>) => {
    const createdIntegration: Integration = {
      id: `INT-${Date.now()}`,
      ...integration,
    };
    setAppData(prev => ({ ...prev, integrations: [createdIntegration, ...prev.integrations] }));
    void syncMutation('integration', 'create', createdIntegration).catch(console.error);
    return createdIntegration;
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
    invoices: appData.invoices,
    expenses: appData.expenses,
    integrations: appData.integrations,
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
    addInvoice,
    addExpense,
    addIntegration,
  }), [appData]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}
