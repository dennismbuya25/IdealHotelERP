import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { AppDataProvider } from './contexts/AppDataContext';
import LoginForm from './components/Auth/LoginForm';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Dashboard from './components/Modules/Dashboard';
import Bookings from './components/Modules/Bookings';
import FrontDesk from './components/Modules/FrontDesk';
import Rooms from './components/Modules/Rooms';
import Billing from './components/Modules/Billing';
import Restaurant from './components/Modules/Restaurant';
import Inventory from './components/Modules/Inventory';
import HR from './components/Modules/HR';
import Finance from './components/Modules/Finance';
import CRM from './components/Modules/CRM';
import Reports from './components/Modules/Reports';
import Settings from './components/Modules/Settings';
import GuestManagement from './components/Modules/GuestManagement';
import Payroll from './components/Modules/Payroll';
import GuestPortal from './components/Modules/GuestPortal';

const moduleRoutes: Record<string, string> = {
  dashboard: '/dashboard',
  bookings: '/bookings',
  'front-desk': '/front-desk',
  rooms: '/rooms',
  billing: '/billing',
  restaurant: '/restaurant',
  inventory: '/inventory',
  hr: '/hr',
  payroll: '/payroll',
  finance: '/finance',
  crm: '/crm',
  reports: '/reports',
  settings: '/settings',
  guestportal: '/guest-portal',
};

function AppContent() {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const activeModule = user?.role === 'guest'
    ? 'guestportal'
    : Object.entries(moduleRoutes).find(([, route]) => route === location.pathname)?.[0] || 'dashboard';

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/dashboard', { replace: true });
    }
  }, [location.pathname, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const handleModuleChange = (module: string) => {
    const route = moduleRoutes[module] || '/dashboard';
    navigate(route);
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard': return <Dashboard />;
      case 'bookings': return <Bookings />;
      case 'front-desk': return <GuestManagement />;
      case 'rooms': return <Rooms />;
      case 'billing': return <Billing />;
      case 'restaurant': return <Restaurant />;
      case 'inventory': return <Inventory />;
      case 'hr': return <HR />;
      case 'payroll': return <Payroll />;
      case 'finance': return <Finance />;
      case 'crm': return <CRM />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      case 'guestportal': return <GuestPortal />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-900 flex">
      <Sidebar
        activeModule={activeModule}
        onModuleChange={handleModuleChange}
        isCollapsed={sidebarCollapsed}
      />

      <div className="flex-1 flex flex-col">
        <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <main className="flex-1 p-6 lg:p-8 overflow-auto bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.15),_transparent_35%),linear-gradient(135deg,_#f8fbff_0%,_#eef6ff_48%,_#f3f6fb_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.25),_transparent_35%),linear-gradient(135deg,_#020617_0%,_#111827_50%,_#0f172a_100%)]">
          {renderModule()}
        </main>

        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SettingsProvider>
          <AppDataProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/*" element={<AppContent />} />
              </Routes>
            </BrowserRouter>
          </AppDataProvider>
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;