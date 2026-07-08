export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'receptionist' | 'housekeeping' | 'restaurant' | 'hr' | 'guest';
  avatar?: string;
  isActive: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  actor: string;
  timestamp: Date;
}

export interface Room {
  id: string;
  number: string;
  type: 'single' | 'double' | 'suite' | 'deluxe';
  status: 'available' | 'occupied' | 'dirty' | 'maintenance' | 'out-of-order';
  price: number;
  floor: number;
  amenities: string[];
  lastCleaned?: Date;
  assignedCleaner?: string;
}

export interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  totalAmount: number;
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
  bookingSource: 'walk-in' | 'online' | 'corporate' | 'group';
  specialRequests?: string;
}

export interface KOTItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage';
  status: 'pending' | 'preparing' | 'ready' | 'served';
}

export interface KitchenOrder {
  id: string;
  orderNumber: string;
  roomNumber?: string;
  tableNumber?: string;
  orderType: 'room-service' | 'dine-in' | 'takeaway';
  items: KOTItem[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
  orderTime: Date;
  estimatedTime?: number;
  waiterName?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'kitchen' | 'housekeeping' | 'bar' | 'maintenance';
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  lastUpdated: Date;
  supplier?: string;
  unitPrice: number;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: 'front-desk' | 'housekeeping' | 'restaurant' | 'kitchen' | 'maintenance' | 'management';
  position: string;
  salary: number;
  joinDate: Date;
  shift: 'morning' | 'afternoon' | 'night';
  isActive: boolean;
  attendance: AttendanceRecord[];
}

export interface AttendanceRecord {
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  status: 'present' | 'absent' | 'late' | 'leave';
  hours?: number;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  idType: 'passport' | 'national-id' | 'driving-license';
  idNumber: string;
  address: string;
  preferences: string[];
  loyaltyPoints: number;
  totalStays: number;
  lastVisit?: Date;
  notes?: string;
}

export interface Invoice {
  id: string;
  bookingId: string;
  guestName: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'mpesa' | 'bank-transfer';
  paymentStatus: 'pending' | 'paid' | 'partial' | 'refunded';
  issueDate: Date;
  dueDate: Date;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category: 'room' | 'food' | 'beverage' | 'service' | 'other';
}

export interface DashboardStats {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  occupancyRate: number;
  totalRevenue: number;
  todayBookings: number;
  checkInsToday: number;
  checkOutsToday: number;
  customerSatisfaction: number;
}

export interface Feedback {
  id: string;
  guestName: string;
  bookingId: string;
  rating: number;
  category: 'room' | 'service' | 'food' | 'cleanliness' | 'overall';
  comment: string;
  date: Date;
  response?: string;
  status: 'pending' | 'responded' | 'resolved';
}