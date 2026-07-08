import React from 'react';
import { Menu, Bell, Search, Sun, Moon, DollarSign } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSettings } from '../../contexts/SettingsContext';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();
  const { currencyCode, currencySymbol } = useSettings();

  return (
    <header className="border-b border-blue-100/80 bg-white/85 px-4 py-3 shadow-sm backdrop-blur-xl dark:bg-slate-900/85">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="rounded-xl p-2 text-blue-700 transition-colors hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-slate-800"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="relative hidden md:block">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-blue-400" />
            </div>
            <input
              type="text"
              className="block w-72 rounded-xl border border-blue-100 bg-slate-50 py-2 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              placeholder="Search modules..."
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="rounded-xl p-2 text-blue-700 transition-colors hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-slate-800"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="flex items-center rounded-xl border border-blue-100 bg-blue-50/80 px-3 py-2 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-slate-800 dark:text-blue-300">
            <DollarSign className="mr-2 h-4 w-4" />
            <span>{currencySymbol} ({currencyCode})</span>
          </div>

          <button className="relative rounded-xl p-2 text-blue-700 transition-colors hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-slate-800">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          <div className="hidden text-right md:block">
            <p className="text-sm font-medium text-slate-900 dark:text-white">Welcome back</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}