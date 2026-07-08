import { Room, Booking, KitchenOrder, InventoryItem, Staff, Guest, Feedback, DashboardStats } from '../types';

// Sample data for development - replace with API calls in production
export const mockRooms: Room[] = [
  {
    id: '1',
    number: '101',
    type: 'single',
    status: 'available',
    price: 120,
    floor: 1,
    amenities: ['WiFi', 'TV', 'AC'],
    lastCleaned: new Date(),
    assignedCleaner: 'Maria Garcia'
  },
  {
    id: '2',
    number: '102',
    type: 'double',
    status: 'occupied',
    price: 180,
    floor: 1,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar'],
  },
  {
    id: '3',
    number: '201',
    type: 'suite',
    status: 'dirty',
    price: 350,
    floor: 2,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony'],
    lastCleaned: new Date(Date.now() - 24 * 60 * 60 * 1000),
  }
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    guestName: 'Alice Smith',
    guestEmail: 'alice@example.com',
    guestPhone: '+1234567890',
    roomId: '2',
    checkIn: new Date(),
    checkOut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: 'checked-in',
    totalAmount: 540,
    paymentStatus: 'paid',
    bookingSource: 'online'
  }
];

export const mockKitchenOrders: KitchenOrder[] = [
  {
    id: '1',
    orderNumber: 'KOT-001',
    roomNumber: '102',
    orderType: 'room-service',
    items: [
      {
        id: '1',
        name: 'Grilled Chicken',
        quantity: 1,
        price: 25,
        category: 'main',
        status: 'preparing'
      }
    ],
    totalAmount: 25,
    status: 'preparing',
    orderTime: new Date(),
    estimatedTime: 20
  }
];

export const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Toilet Paper',
    category: 'housekeeping',
    currentStock: 15,
    minStock: 20,
    maxStock: 100,
    unit: 'rolls',
    lastUpdated: new Date(),
    supplier: 'Clean Supply Co.',
    unitPrice: 2.50
  }
];

export const mockStaff: Staff[] = [
  {
    id: '1',
    name: 'John Anderson',
    email: 'john@idealhotel.com',
    phone: '+1234567890',
    department: 'front-desk',
    position: 'Front Desk Manager',
    salary: 45000,
    joinDate: new Date('2023-01-15'),
    shift: 'morning',
    isActive: true,
    attendance: [
      {
        date: new Date(),
        checkIn: new Date(),
        status: 'present',
        hours: 8
      }
    ]
  }
];

export const mockGuests: Guest[] = [
  {
    id: '1',
    name: 'Alice Smith',
    email: 'alice@example.com',
    phone: '+1234567890',
    idType: 'passport',
    idNumber: 'P123456789',
    address: '123 Main St, City, Country',
    preferences: ['Non-smoking', 'High floor', 'Late checkout'],
    loyaltyPoints: 1250,
    totalStays: 8,
    lastVisit: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  }
];

export const mockFeedback: Feedback[] = [
  {
    id: '1',
    guestName: 'Alice Smith',
    bookingId: '1',
    rating: 5,
    category: 'overall',
    comment: 'Excellent service and clean rooms!',
    date: new Date(),
    status: 'pending'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalRooms: 50,
  occupiedRooms: 32,
  availableRooms: 15,
  occupancyRate: 64,
  totalRevenue: 45750,
  todayBookings: 8,
  checkInsToday: 5,
  checkOutsToday: 3,
  customerSatisfaction: 4.6,
};