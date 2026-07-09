import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

export interface AppSettings {
  hotelName: string;
  currency: string;
  timezone: string;
  language: string;
  dateFormat: string;
  checkInTime: string;
  checkOutTime: string;
  taxRate: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
  darkMode: boolean;
  autoBackup: boolean;
  backupFrequency: string;
}

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (changes: Partial<AppSettings> | ((prev: AppSettings) => AppSettings)) => void;
  saveSettings: (changes?: Partial<AppSettings>) => void;
  resetSettings: () => void;
  formatCurrency: (amount: number) => string;
  currencyCode: string;
  currencySymbol: string;
}

const defaultSettings: AppSettings = {
  hotelName: 'Ideal Hotel',
  currency: 'KES',
  timezone: 'UTC+3',
  language: 'English',
  dateFormat: 'DD/MM/YYYY',
  checkInTime: '15:00',
  checkOutTime: '11:00',
  taxRate: 10,
  emailNotifications: true,
  smsNotifications: false,
  darkMode: false,
  autoBackup: true,
  backupFrequency: 'daily',
};

const SETTINGS_STORAGE_KEY = 'ideal-hotel-settings';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

function normalizeCurrencyCode(currency: string) {
  const normalized = currency.toUpperCase();
  if (normalized === 'KSH' || normalized === 'KES') {
    return 'KES';
  }
  return normalized;
}

function getCurrencyConfig(currencyCode: string) {
  switch (normalizeCurrencyCode(currencyCode)) {
    case 'EUR':
      return { code: 'EUR', symbol: '€' };
    case 'GBP':
      return { code: 'GBP', symbol: '£' };
    case 'KES':
      return { code: 'KES', symbol: 'KSh' };
    default:
      return { code: 'USD', symbol: '$' };
  }
}

function getTimeZoneIdentifier(timezone: string) {
  switch ((timezone || '').toUpperCase()) {
    case 'UTC+3':
    case 'UTC+3 (EAST AFRICA TIME)':
    case 'EAT':
    case 'EAST AFRICA TIME':
      return 'Africa/Nairobi';
    case 'UTC+0':
    case 'GMT':
      return 'Etc/UTC';
    case 'UTC-5':
      return 'America/New_York';
    case 'UTC-8':
      return 'America/Los_Angeles';
    default:
      return 'Africa/Nairobi';
  }
}

function formatCurrencyValue(amount: number, currencyCode: string) {
  const config = getCurrencyConfig(currencyCode);
  const amountLabel = amount.toLocaleString('en-US', { maximumFractionDigits: 0 });

  switch (config.code) {
    case 'KES':
      return `KSh ${amountLabel}`;
    case 'EUR':
      return `€${amountLabel}`;
    case 'GBP':
      return `£${amountLabel}`;
    default:
      return `$${amountLabel}`;
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    if (typeof window === 'undefined') {
      return defaultSettings;
    }

    const storedSettings = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!storedSettings) {
      return defaultSettings;
    }

    try {
      const parsed = JSON.parse(storedSettings);
      return { ...defaultSettings, ...parsed };
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    }
  }, [settings]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const timeZone = getTimeZoneIdentifier(settings.timezone);
    const originalToLocaleString = Date.prototype.toLocaleString;
    const originalToLocaleDateString = Date.prototype.toLocaleDateString;

    Date.prototype.toLocaleString = function(locales?: string | string[], options?: Intl.DateTimeFormatOptions) {
      return originalToLocaleString.call(this, locales ?? 'en-KE', { timeZone, ...options });
    };

    Date.prototype.toLocaleDateString = function(locales?: string | string[], options?: Intl.DateTimeFormatOptions) {
      return originalToLocaleDateString.call(this, locales ?? 'en-KE', { timeZone, ...options });
    };

    return () => {
      Date.prototype.toLocaleString = originalToLocaleString;
      Date.prototype.toLocaleDateString = originalToLocaleDateString;
    };
  }, [settings.timezone]);

  const updateSettings = (changes: Partial<AppSettings> | ((prev: AppSettings) => AppSettings)) => {
    setSettings(prev => {
      if (typeof changes === 'function') {
        return changes(prev);
      }

      return { ...prev, ...changes };
    });
  };

  const saveSettings = (changes?: Partial<AppSettings>) => {
    if (changes) {
      updateSettings(changes);
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const currencyCode = useMemo(() => normalizeCurrencyCode(settings.currency), [settings.currency]);
  const currencySymbol = useMemo(() => getCurrencyConfig(currencyCode).symbol, [currencyCode]);
  const formatCurrency = (amount: number) => formatCurrencyValue(amount, currencyCode);

  const value = useMemo(() => ({
    settings,
    updateSettings,
    saveSettings,
    resetSettings,
    formatCurrency,
    currencyCode,
    currencySymbol,
  }), [settings, updateSettings, saveSettings, resetSettings, formatCurrency, currencyCode, currencySymbol]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
