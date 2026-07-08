import React from 'react';
import {
  BarChart3,
  Calendar,
  Users,
  Home,
  DollarSign,
  ChefHat,
  Package,
  UserCheck,
  CreditCard,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
  isCollapsed: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  roles: User['role'][];
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, roles: ['admin', 'manager', 'receptionist'] },
  { id: 'bookings', label: 'Bookings', icon: Calendar, roles: ['admin', 'manager', 'receptionist'] },
  { id: 'front-desk', label: 'Guest Management', icon: Users, roles: ['admin', 'manager', 'receptionist'] },
  { id: 'rooms', label: 'Rooms & Housekeeping', icon: Home, roles: ['admin', 'manager', 'housekeeping'] },
  { id: 'billing', label: 'Billing & Invoicing', icon: CreditCard, roles: ['admin', 'manager', 'receptionist'] },
  { id: 'restaurant', label: 'Restaurant & KOT', icon: ChefHat, roles: ['admin', 'manager', 'restaurant'] },
  { id: 'inventory', label: 'Inventory', icon: Package, roles: ['admin', 'manager'] },
  { id: 'hr', label: 'Human Resources', icon: UserCheck, roles: ['admin', 'hr'] },
  { id: 'payroll', label: 'Payroll', icon: DollarSign, roles: ['admin', 'manager', 'hr'] },
  { id: 'finance', label: 'Finance', icon: DollarSign, roles: ['admin', 'manager'] },
  { id: 'crm', label: 'Guest CRM', icon: MessageSquare, roles: ['admin', 'manager', 'receptionist'] },
  { id: 'reports', label: 'Reports & Analytics', icon: FileText, roles: ['admin', 'manager'] },
  { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin'] },
];

export default function Sidebar({ activeModule, onModuleChange, isCollapsed }: SidebarProps) {
  const { user, logout } = useAuth();

  const filteredMenuItems = menuItems.filter(item =>
    user && item.roles.includes(user.role)
  );

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} relative flex flex-col border-r border-blue-200/70 bg-gradient-to-b from-slate-950 via-blue-900 to-indigo-900 text-white shadow-2xl transition-all duration-300`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(191,219,254,0.16),_transparent_40%)] pointer-events-none" />
      <div className="relative flex flex-col h-full">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20">
              <Home className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-semibold text-white">Ideal Hotel</h1>
                <p className="text-xs text-blue-100/80">ERP Control Center</p>
              </div>
            )}
          </div>
        </div>

        {!isCollapsed && user && (
          <div className="p-4 border-b border-white/10">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'}
                  alt={user.name}
                  className="w-10 h-10 rounded-full ring-2 ring-blue-200/50"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  <p className="text-xs text-blue-100/80 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onModuleChange(item.id)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white/15 text-white shadow-lg ring-1 ring-white/20'
                    : 'text-blue-50/90 hover:bg-white/10 hover:text-white'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5" />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="rounded-xl border border-white/10 bg-slate-900/30 p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-100">
              <Sparkles className="h-4 w-4" />
              Smart Operations
            </div>
            <p className="text-xs text-blue-100/70">Keep rooms, billing, and payroll flowing smoothly from one place.</p>
          </div>
          <button
            onClick={logout}
            className={`mt-3 w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-xl text-sm font-medium text-red-200 hover:bg-red-500/20 transition-colors`}
            title={isCollapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
}