import React, { useState } from 'react';
import { DollarSign, Users, Calendar, Download, Send, CheckCircle } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  role: string;
  salary: number;
  month: string;
  status: 'pending' | 'processed' | 'paid';
}

export default function Payroll() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().split('T')[0].slice(0, 7));
  const [employees] = useState<Employee[]>([
    { id: '1', name: 'John Doe', role: 'Manager', salary: 5000, month: '2026-07', status: 'paid' },
    { id: '2', name: 'Sarah Wilson', role: 'Receptionist', salary: 3000, month: '2026-07', status: 'paid' },
    { id: '3', name: 'Mike Johnson', role: 'Housekeeping', salary: 2500, month: '2026-07', status: 'processed' },
    { id: '4', name: 'Emma Davis', role: 'Chef', salary: 4000, month: '2026-07', status: 'pending' },
    { id: '5', name: 'David Brown', role: 'Maintenance', salary: 2800, month: '2026-07', status: 'pending' },
  ]);

  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  const toggleEmployeeSelection = (id: string) => {
    setSelectedEmployees(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const totalSalaries = employees
    .filter(e => selectedEmployees.includes(e.id))
    .reduce((sum, e) => sum + e.salary, 0);

  const processPayroll = () => {
    alert(`Processed payroll for ${selectedEmployees.length} employees totaling $${totalSalaries}`);
    setSelectedEmployees([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'processed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payroll Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage employee salaries and payroll processing</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{employees.length}</p>
            </div>
            <Users className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 rounded-lg p-6 border border-green-200 dark:border-green-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Monthly Payroll</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">${employees.reduce((sum, e) => sum + e.salary, 0).toLocaleString()}</p>
            </div>
            <DollarSign className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Paid</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{employees.filter(e => e.status === 'paid').length}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-purple-600 dark:text-purple-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900 dark:to-red-900 rounded-lg p-6 border border-orange-200 dark:border-orange-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{employees.filter(e => e.status === 'pending').length}</p>
            </div>
            <Calendar className="w-10 h-10 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      {/* Payroll Period Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Payroll Period</h2>
        <div className="flex items-center space-x-4">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing payroll data for {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Employee Payroll</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedEmployees.length === employees.length}
                    onChange={(e) => setSelectedEmployees(e.target.checked ? employees.map(e => e.id) : [])}
                    className="w-4 h-4"
                  />
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Monthly Salary</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(employee.id)}
                      onChange={() => toggleEmployeeSelection(employee.id)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{employee.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{employee.role}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">${employee.salary.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                      {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-medium">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payroll Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedEmployees.length > 0 ? `Selected: ${selectedEmployees.length} employees` : 'Select employees to process payroll'}
            </h3>
            {selectedEmployees.length > 0 && (
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                Total: ${totalSalaries.toLocaleString()}
              </p>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              disabled={selectedEmployees.length === 0}
              className="flex items-center space-x-2 px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Export</span>
            </button>
            <button
              disabled={selectedEmployees.length === 0}
              onClick={processPayroll}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              <Send className="w-5 h-5" />
              <span>Process Payroll</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
