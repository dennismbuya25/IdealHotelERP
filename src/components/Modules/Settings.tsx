import React, { useState } from 'react';
import { Settings as SettingsIcon, Users, Shield, Globe, Bell, Database, Palette, Key, Clock, Mail, XCircle, Plus } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { useAppData } from '../../contexts/AppDataContext';
import { Integration, User } from '../../types';

export default function Settings() {
  const { settings, updateSettings, saveSettings, resetSettings } = useSettings();
  const { users, auditLogs, integrations, addUser, addAuditLog, updateUser, permissionProfiles, updatePermissionProfile, addIntegration } = useAppData();
  const [activeTab, setActiveTab] = useState<'general' | 'users' | 'audit' | 'security' | 'notifications' | 'integrations'>('general');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'receptionist' as User['role'], isActive: true, username: '', password: '' });
  const [integrationForm, setIntegrationForm] = useState({ name: '', type: 'booking', status: 'connected' as Integration['status'], description: '' });
  const [editingPermissionsRole, setEditingPermissionsRole] = useState<User['role'] | null>(null);
  const [permissionDraft, setPermissionDraft] = useState<string[]>([]);

  const handleSettingChange = (key: string, value: any) => {
    updateSettings({ [key]: value } as any);
  };

  const handleSaveChanges = () => {
    saveSettings();
    addAuditLog({ action: 'settings_saved', details: `Settings updated for ${settings.hotelName}.`, actor: 'Administrator' });
    setSaveMessage(`Settings saved for ${settings.hotelName}.`);
  };

  const handleResetDefaults = () => {
    resetSettings();
    addAuditLog({ action: 'settings_reset', details: 'System settings reset to defaults.', actor: 'Administrator' });
    setSaveMessage('Settings reset to defaults.');
  };

  const openAddUserModal = () => {
    setEditingUser(null);
    setUserForm({ name: '', email: '', role: 'receptionist', isActive: true, username: '', password: '' });
    setShowUserModal(true);
  };

  const openEditUserModal = (user: User) => {
    setEditingUser(user);
    setUserForm({ name: user.name, email: user.email, role: user.role, isActive: user.isActive, username: user.username || user.email, password: '' });
    setShowUserModal(true);
  };

  const handleUserSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (editingUser) {
      updateUser({ ...editingUser, ...userForm });
      addAuditLog({ action: 'user_updated', details: `Updated user ${userForm.name}.`, actor: 'Administrator' });
      setSaveMessage(`Updated ${userForm.name}.`);
    } else {
      addUser({ ...userForm, username: userForm.username || userForm.email, password: userForm.password || 'Welcome123!' });
      addAuditLog({ action: 'user_created', details: `Created user ${userForm.name}.`, actor: 'Administrator' });
      setSaveMessage(`Added ${userForm.name}.`);
    }

    setShowUserModal(false);
    setEditingUser(null);
    setUserForm({ name: '', email: '', role: 'receptionist', isActive: true, username: '', password: '' });
  };

  const handleToggleUserStatus = (user: User) => {
    updateUser({ ...user, isActive: !user.isActive });
    addAuditLog({ action: 'user_status_changed', details: `${user.name} marked ${user.isActive ? 'inactive' : 'active'}.`, actor: 'Administrator' });
    setSaveMessage(`${user.name} is now ${user.isActive ? 'inactive' : 'active'}.`);
  };

  const permissionOptions = [
    'Dashboard',
    'Bookings',
    'Guest Management',
    'Front Desk',
    'Room Management',
    'Housekeeping Tasks',
    'HR',
    'Payroll',
    'Rota Management',
    'Staff Profiles',
    'User Management',
    'System Settings',
    'Financial Reports',
    'Reports',
    'Restaurant & KOT',
    'Orders',
    'Kitchen View',
    'View Bookings',
    'Book Rooms',
    'Request Meals',
  ];

  const roleCards = [
    { key: 'admin' as const, label: 'Admin' },
    { key: 'manager' as const, label: 'Manager' },
    { key: 'receptionist' as const, label: 'Receptionist' },
    { key: 'housekeeping' as const, label: 'Housekeeping' },
    { key: 'restaurant' as const, label: 'Restaurant' },
    { key: 'hr' as const, label: 'HR' },
    { key: 'guest' as const, label: 'Guest' },
  ];

  const handleIntegrationSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    addIntegration({ ...integrationForm });
    addAuditLog({ action: 'integration_added', details: `Connected integration ${integrationForm.name}.`, actor: 'Administrator' });
    setSaveMessage(`Added integration ${integrationForm.name}.`);
    setShowIntegrationModal(false);
    setIntegrationForm({ name: '', type: 'booking', status: 'connected', description: '' });
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
      manager: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
      receptionist: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
      housekeeping: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
      restaurant: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
      hr: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const openPermissionEditor = (role: User['role']) => {
    setEditingPermissionsRole(role);
    setPermissionDraft(permissionProfiles[role] || []);
  };

  const handlePermissionToggle = (permission: string) => {
    setPermissionDraft(prev => prev.includes(permission) ? prev.filter(item => item !== permission) : [...prev, permission]);
  };

  const handlePermissionSave = () => {
    if (!editingPermissionsRole) {
      return;
    }

    updatePermissionProfile(editingPermissionsRole, permissionDraft);
    addAuditLog({ action: 'permissions_updated', details: `Updated permissions for ${editingPermissionsRole}.`, actor: 'Administrator' });
    setSaveMessage(`Permissions updated for ${editingPermissionsRole}.`);
    setEditingPermissionsRole(null);
    setPermissionDraft([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'inactive':
      case 'disconnected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings & Role Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Configure system settings, manage users, and control access permissions</p>
      </div>

      {saveMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
          {saveMessage}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'general'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              General Settings
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'audit'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Audit Logs
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'security'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Security & Permissions
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'notifications'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('integrations')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'integrations'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Integrations
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">General Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hotel Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">Hotel Information</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hotel Name
                    </label>
                    <input
                      type="text"
                      value={settings.hotelName}
                      onChange={(e) => handleSettingChange('hotelName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Currency
                    </label>
                    <select
                      value={settings.currency}
                      onChange={(e) => handleSettingChange('currency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="KES">KES - Kenyan Shilling</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      value={settings.taxRate}
                      onChange={(e) => handleSettingChange('taxRate', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Regional Settings */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">Regional Settings</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Timezone
                    </label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => handleSettingChange('timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="UTC-5">UTC-5 (Eastern Time)</option>
                      <option value="UTC-8">UTC-8 (Pacific Time)</option>
                      <option value="UTC+0">UTC+0 (GMT)</option>
                      <option value="UTC+3">UTC+3 (East Africa Time)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Language
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date Format
                    </label>
                    <select
                      value={settings.dateFormat}
                      onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>

                {/* Operational Settings */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">Operational Settings</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Check-in Time
                    </label>
                    <input
                      type="time"
                      value={settings.checkInTime}
                      onChange={(e) => handleSettingChange('checkInTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Check-out Time
                    </label>
                    <input
                      type="time"
                      value={settings.checkOutTime}
                      onChange={(e) => handleSettingChange('checkOutTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* System Preferences */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">System Preferences</h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.autoBackup}
                        onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Enable automatic backups</span>
                    </label>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Backup Frequency
                      </label>
                      <select
                        value={settings.backupFrequency}
                        onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Reset to Defaults
                </button>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* User Management */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">User Management</h3>
                <button type="button" onClick={openAddUserModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <Users className="w-4 h-4" />
                  <span>Add User</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.isActive ? 'active' : 'inactive')}`}>
                            {user.isActive ? 'active' : 'inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date().toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => openEditUserModal(user)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleUserStatus(user)}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                            >
                              {user.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {showUserModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{editingUser ? 'Edit User' : 'Add User'}</h3>
                  <button type="button" onClick={() => setShowUserModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
                <form onSubmit={handleUserSubmit} className="space-y-4">
                  <input value={userForm.name} onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Full name" className="w-full rounded-lg border border-gray-300 px-3 py-2" required />
                  <input type="email" value={userForm.email} onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))} placeholder="Email" className="w-full rounded-lg border border-gray-300 px-3 py-2" required />
                  <input value={userForm.username} onChange={(e) => setUserForm(prev => ({ ...prev, username: e.target.value }))} placeholder="Username" className="w-full rounded-lg border border-gray-300 px-3 py-2" required />
                  {!editingUser && <input type="password" value={userForm.password} onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))} placeholder="Temporary password" className="w-full rounded-lg border border-gray-300 px-3 py-2" required />}
                  <select value={userForm.role} onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value as User['role'] }))} className="w-full rounded-lg border border-gray-300 px-3 py-2">
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="housekeeping">Housekeeping</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="hr">HR</option>
                    <option value="guest">Guest</option>
                  </select>
                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input type="checkbox" checked={userForm.isActive} onChange={(e) => setUserForm(prev => ({ ...prev, isActive: e.target.checked }))} />
                    Active account
                  </label>
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setShowUserModal(false)} className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700">Cancel</button>
                    <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-white">Save User</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Audit Logs</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">{auditLogs.length} entries</span>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/70">
                {auditLogs.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No audit logs have been recorded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900/60">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{log.action}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{log.details}</p>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            <p>{log.actor}</p>
                            <p>{new Date(log.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Security & Permissions */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Security & Permissions</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Role Permissions */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Role Permissions</h4>
                  <div className="space-y-4">
                    {roleCards.map((roleData) => {
                      const activePermissions = permissionProfiles[roleData.key] || [];
                      return (
                        <div key={roleData.key} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                          <div className="flex items-center justify-between gap-2">
                            <h5 className="font-medium text-gray-900 dark:text-white">{roleData.label}</h5>
                            <button
                              type="button"
                              onClick={() => openPermissionEditor(roleData.key)}
                              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              Edit Permissions
                            </button>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {activePermissions.length > 0 ? activePermissions.map((permission) => (
                              <span key={permission} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded text-xs">
                                {permission}
                              </span>
                            )) : (
                              <span className="text-xs text-gray-500 dark:text-gray-400">No custom permissions assigned</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Security Settings */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Security Settings</h4>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Require two-factor authentication</span>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Force password reset every 90 days</span>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Lock account after 5 failed attempts</span>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Log all user activities</span>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Session timeout (minutes)
                      </label>
                      <input
                        type="number"
                        defaultValue={30}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {editingPermissionsRole && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">Edit permissions for {editingPermissionsRole}</h4>
                    <button type="button" onClick={() => setEditingPermissionsRole(null)} className="text-sm text-gray-600 dark:text-gray-300">Cancel</button>
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {permissionOptions.map((permission) => (
                      <label key={permission} className="flex items-center gap-2 rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        <input
                          type="checkbox"
                          checked={permissionDraft.includes(permission)}
                          onChange={() => handlePermissionToggle(permission)}
                        />
                        {permission}
                      </label>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button type="button" onClick={handlePermissionSave} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">Save Permissions</button>
                  </div>
                </div>
              )}

              {/* Audit Log */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Recent Security Events</h4>
                <div className="space-y-3">
                  {[
                    { event: 'User login', user: 'admin@idealhotel.com', time: '2024-01-20 14:30', status: 'success' },
                    { event: 'Password change', user: 'manager@idealhotel.com', time: '2024-01-20 12:15', status: 'success' },
                    { event: 'Failed login attempt', user: 'unknown@email.com', time: '2024-01-20 10:45', status: 'failed' },
                    { event: 'User created', user: 'admin@idealhotel.com', time: '2024-01-19 16:20', status: 'success' },
                  ].map((log, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{log.event}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{log.user}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notification Settings</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                  </div>
                  <label className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-3 dark:border-gray-600 dark:bg-gray-800">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Enable email alerts</span>
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">No email notification rules have been configured yet.</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Bell className="w-5 h-5 text-green-600" />
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">SMS Notifications</h4>
                  </div>
                  <label className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-3 dark:border-gray-600 dark:bg-gray-800">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Enable SMS alerts</span>
                    <input
                      type="checkbox"
                      checked={settings.smsNotifications}
                      onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">No SMS notification rules have been configured yet.</p>
                </div>
              </div>

              {/* Notification Schedule */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Notification Schedule</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Daily Report Time
                    </label>
                    <input
                      type="time"
                      defaultValue="08:00"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Weekly Report Day
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                      <option>Monday</option>
                      <option>Tuesday</option>
                      <option>Wednesday</option>
                      <option>Thursday</option>
                      <option>Friday</option>
                      <option>Saturday</option>
                      <option>Sunday</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quiet Hours
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="time"
                        defaultValue="22:00"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <input
                        type="time"
                        defaultValue="06:00"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Integrations */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Third-party Integrations</h3>
                <button type="button" onClick={() => setShowIntegrationModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <Key className="w-4 h-4" />
                  <span>Add Integration</span>
                </button>
              </div>

              {integrations.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white/70 p-8 text-center dark:border-gray-600 dark:bg-gray-800/60">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">No integrations connected yet.</p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Add a booking channel, payment provider, or accounting tool when you are ready.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {integrations.map((integration) => (
                    <div key={integration.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-white">{integration.name}</h4>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(integration.status)}`}>{integration.status}</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{integration.description}</p>
                      <p className="mt-2 text-xs uppercase tracking-wide text-gray-400">{integration.type}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* API Settings */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">API Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      API Base URL
                    </label>
                    <input
                      type="url"
                      defaultValue="https://api.idealhotel.com/v1"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rate Limit (requests/minute)
                    </label>
                    <input
                      type="number"
                      defaultValue={1000}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    API Key
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="password"
                      defaultValue="your-api-key-placeholder"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                      Regenerate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showIntegrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Integration</h3>
              <button type="button" onClick={() => setShowIntegrationModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleIntegrationSubmit} className="space-y-4">
              <input value={integrationForm.name} onChange={(e) => setIntegrationForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Integration name" className="w-full rounded-lg border border-gray-300 px-3 py-2" required />
              <input value={integrationForm.type} onChange={(e) => setIntegrationForm(prev => ({ ...prev, type: e.target.value }))} placeholder="Type" className="w-full rounded-lg border border-gray-300 px-3 py-2" required />
              <select value={integrationForm.status} onChange={(e) => setIntegrationForm(prev => ({ ...prev, status: e.target.value as Integration['status'] }))} className="w-full rounded-lg border border-gray-300 px-3 py-2">
                <option value="connected">Connected</option>
                <option value="pending">Pending</option>
                <option value="disconnected">Disconnected</option>
              </select>
              <textarea value={integrationForm.description} onChange={(e) => setIntegrationForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Description" className="w-full rounded-lg border border-gray-300 px-3 py-2" rows={3} />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowIntegrationModal(false)} className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700">Cancel</button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-white">Save Integration</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}