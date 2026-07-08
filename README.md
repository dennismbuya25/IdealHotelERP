# Ideal Hotel ERP System

A comprehensive Hotel Management ERP System built with React, TypeScript, Node.js, PostgreSQL, and Electron.

## Features

- **Dashboard Module**: Real-time KPIs, occupancy overview, and activity logs
- **Reservation & Booking Management**: Complete booking lifecycle management
- **Guest Management**: Check-in/check-out, guest profiles, and preferences
- **Room & Housekeeping Management**: Room status tracking and housekeeping operations
- **Billing & Invoicing**: Multi-payment methods and invoice generation
- **Restaurant/KOT Management**: Kitchen order tickets and menu management
- **Inventory & Procurement**: Stock management and supplier relations
- **Human Resources & Payroll**: Staff management and payroll processing
- **Finance & Accounting**: Financial reporting and transaction tracking
- **Guest Feedback & CRM**: Customer relationship management and loyalty programs
- **Reports & Analytics**: Comprehensive reporting with export capabilities
- **Settings & Role Management**: User permissions and system configuration

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Desktop App**: Electron
- **Authentication**: JWT with bcrypt password hashing

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ideal-hotel-erp
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup

1. Create a PostgreSQL database named `ideal_hotel_erp`
2. Update the database configuration in `.env` file:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/ideal_hotel_erp
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ideal_hotel_erp
DB_USER=postgres
DB_PASSWORD=your_password
```

3. Run the database schema:
```bash
psql -U postgres -d ideal_hotel_erp -f server/database/schema.sql
```

### 4. Environment Configuration

Copy the `.env` file and update the values:
```env
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/ideal_hotel_erp
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ideal_hotel_erp
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3001
NODE_ENV=development
```

## Running the Application

### Development Mode
```bash
# Start the development server
npm run dev

# In another terminal, start the backend server
npm run server
```

### Production Mode
```bash
# Build and start the application
npm start
```

### Electron Desktop App
```bash
# Development mode with Electron
npm run electron-dev

# Build Electron app
npm run build-electron

# Create distributable
npm run dist
```

## Default Login Credentials

- **Username**: `admin`
- **Password**: `myGod`

The admin user can create additional users and assign appropriate roles and permissions.

## User Roles

- **Admin**: Full system access
- **Manager**: Management operations and reporting
- **Receptionist**: Front desk operations and guest management
- **Housekeeping**: Room status and cleaning operations
- **Restaurant**: Kitchen and food service operations
- **HR**: Human resources and payroll management

## Database Schema

The system includes comprehensive database tables for:
- Users and authentication
- Rooms and bookings
- Guests and preferences
- Menu items and kitchen orders
- Inventory and suppliers
- Staff and attendance
- Invoices and financial transactions
- Feedback and CRM
- System settings and activity logs

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users` - Get all users (admin only)
- `POST /api/users` - Create new user (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/activity` - Get recent activity

### Rooms
- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create new room
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

## Building for Distribution

### Windows (.exe)
```bash
npm run dist
```

### macOS (.dmg)
```bash
npm run dist
```

### Linux (.AppImage)
```bash
npm run dist
```

## Security Features

- JWT-based authentication
- Bcrypt password hashing
- Role-based access control
- Activity logging
- SQL injection prevention
- CORS protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

© 2024 Powered by Bibe Tech Solutions. All rights reserved.

## Support

For support and questions, please contact Bibe Tech Solutions.