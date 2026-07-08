import React, { useState } from 'react';
import { DollarSign, Users, Calendar, Download, Send, CheckCircle, Sparkles } from 'lucide-react';

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
      case 'paid': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';
      case 'processed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
      case 'pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Payroll automation
            </div>
            <h1 className="text-3xl font-bold">Payroll Management</h1>
            <p className="mt-2 max-w-2xl text-sm text-blue-100">
              Review salaries, select employees, and process payroll in a few clicks.
            </p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.2em] text-blue-100">Selected payout</p>
            <p className="mt-1 text-2xl font-semibold">${totalSalaries.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm dark:border-blue-800 dark:from-blue-900/40 dark:to-indigo-900/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Employees</p>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{employees.length}</p>
            </div>
            <Users className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-6 shadow-sm dark:border-emerald-800 dark:from-emerald-900/40 dark:to-green-900/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Monthly Payroll</p>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">${employees.reduce((sum, e) => sum + e.salary, 0).toLocaleString()}</p>
            </div>
            <DollarSign className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>

        <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-50 p-6 shadow-sm dark:border-violet-800 dark:from-violet-900/40 dark:to-fuchsia-900/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Paid</p>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{employees.filter(e => e.status === 'paid').length}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-violet-600 dark:text-violet-400" />
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-sm dark:border-amber-800 dark:from-amber-900/40 dark:to-orange-900/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Pending</p>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{employees.filter(e => e.status === 'pending').length}</p>
            </div>
            <Calendar className="h-10 w-10 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">Payroll Period</h2>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Showing payroll data for {new Date(`${selectedMonth}-01`).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-6 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Employee Payroll</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-slate-700 dark:from-blue-900/40 dark:to-indigo-900/40">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedEmployees.length === employees.length}
                    onChange={(e) => setSelectedEmployees(e.target.checked ? employees.map(e => e.id) : [])}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Monthly Salary</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {employees.map((employee) => (
                <tr key={employee.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/70">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(employee.id)}
                      onChange={() => toggleEmployeeSelection(employee.id)}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{employee.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{employee.role}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">${employee.salary.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(employee.status)}`}>
                      {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button className="font-medium text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {selectedEmployees.length > 0 ? `Selected: ${selectedEmployees.length} employees` : 'Select employees to process payroll'}
            </h3>
            {selectedEmployees.length > 0 && (
              <p className="mt-1 text-xl font-bold text-blue-600 dark:text-blue-400">
                Total: ${totalSalaries.toLocaleString()}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              disabled={selectedEmployees.length === 0}
              className="flex items-center gap-2 rounded-xl bg-slate-100 px-5 py-2.5 text-slate-900 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              <Download className="h-5 w-5" />
              <span>Export</span>
            </button>
            <button
              disabled={selectedEmployees.length === 0}
              onClick={processPayroll}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
              <span>Process Payroll</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
