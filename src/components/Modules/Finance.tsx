import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, PieChart, BarChart3, Calendar, Download, Plus, XCircle } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { useAppData } from '../../contexts/AppDataContext';
import { Expense } from '../../types';

export default function Finance() {
  const { formatCurrency } = useSettings();
  const { bookings, staff, kitchenOrders, inventoryItems, expenses, addExpense, addAuditLog } = useAppData();
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'expenses' | 'reports'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ description: '', category: 'operations' as Expense['category'], amount: '', paymentMethod: 'cash' as Expense['paymentMethod'], notes: '' });

  const roomRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const restaurantRevenue = kitchenOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalRevenue = roomRevenue + restaurantRevenue;
  const inventoryExpense = inventoryItems.reduce((sum, item) => sum + item.unitPrice * item.currentStock, 0);
  const recordedExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalExpenses = staff.reduce((sum, member) => sum + member.salary, 0) + inventoryExpense + recordedExpenses;
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue ? (netProfit / totalRevenue) * 100 : 0;
  const financialData = {
    totalRevenue,
    totalExpenses,
    netProfit,
    profitMargin,
    monthlyGrowth: totalRevenue ? 100 : 0,
    cashFlow: netProfit,
  };

  const revenueStreams = [
    { name: 'Room Revenue', amount: roomRevenue, percentage: totalRevenue ? (roomRevenue / totalRevenue) * 100 : 0, color: 'bg-blue-500' },
    { name: 'Restaurant', amount: restaurantRevenue, percentage: totalRevenue ? (restaurantRevenue / totalRevenue) * 100 : 0, color: 'bg-green-500' },
  ];

  const expenseCategories = [
    { name: 'Staff Salaries', amount: staff.reduce((sum, member) => sum + member.salary, 0), percentage: totalExpenses ? (staff.reduce((sum, member) => sum + member.salary, 0) / totalExpenses) * 100 : 0, color: 'bg-red-500' },
    { name: 'Inventory', amount: inventoryItems.reduce((sum, item) => sum + item.unitPrice * item.currentStock, 0), percentage: totalExpenses ? (inventoryItems.reduce((sum, item) => sum + item.unitPrice * item.currentStock, 0) / totalExpenses) * 100 : 0, color: 'bg-orange-500' },
  ];

  const monthlyData = [{ month: new Date().toLocaleDateString('en-US', { month: 'short' }), revenue: totalRevenue, expenses: totalExpenses, profit: netProfit }];

  const transactions = [
    ...bookings.map((booking) => ({ id: booking.id, type: 'income' as const, description: `${booking.guestName} booking`, amount: booking.totalAmount, date: booking.checkIn, category: 'Room Revenue' })),
    ...kitchenOrders.map((order) => ({ id: order.id, type: 'income' as const, description: `${order.orderNumber} restaurant order`, amount: order.totalAmount, date: order.orderTime, category: 'Restaurant' })),
    ...staff.map((member) => ({ id: member.id, type: 'expense' as const, description: `${member.name} salary`, amount: -member.salary, date: member.joinDate, category: 'Salaries' })),
    ...expenses.map((expense) => ({ id: expense.id, type: 'expense' as const, description: expense.description, amount: -expense.amount, date: expense.date, category: expense.category })),
  ];

  const handleAddExpense = (event: React.FormEvent) => {
    event.preventDefault();
    const amount = Number(expenseForm.amount);
    const createdExpense = addExpense({
      description: expenseForm.description,
      category: expenseForm.category,
      amount,
      paymentMethod: expenseForm.paymentMethod,
      date: new Date(),
      notes: expenseForm.notes,
    });
    addAuditLog({ action: 'expense_created', details: `Recorded expense ${createdExpense.id}.`, actor: 'Administrator' });
    setShowExpenseModal(false);
    setExpenseForm({ description: '', category: 'operations', amount: '', paymentMethod: 'cash', notes: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Finance & Accounting</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Track revenue, expenses, and financial performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(financialData.totalRevenue)}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">+{financialData.monthlyGrowth}% from last month</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(financialData.totalExpenses)}</p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">+5.2% from last month</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Profit</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(financialData.netProfit)}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">{financialData.profitMargin.toFixed(1)}% margin</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cash Flow</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(financialData.cashFlow)}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Available balance</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('revenue')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'revenue'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Revenue Analysis
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'expenses'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Expense Tracking
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Financial Reports
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Period Selector */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Financial Overview</h3>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
              </div>

              {/* Monthly Trend Chart */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Financial Trend</h4>
                <div className="space-y-4">
                  {monthlyData.map((data) => (
                    <div key={data.month} className="flex items-center space-x-4">
                      <div className="w-12 text-sm font-medium text-gray-600 dark:text-gray-400">{data.month}</div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600 dark:text-green-400">Revenue: ${data.revenue.toLocaleString()}</span>
                          <span className="text-red-600 dark:text-red-400">Expenses: ${data.expenses.toLocaleString()}</span>
                          <span className="text-blue-600 dark:text-blue-400 font-medium">Profit: ${data.profit.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                            style={{ width: `${data.revenue ? (data.profit / data.revenue) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">Recent Transactions</h4>
                  <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">View All</button>
                </div>
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          transaction.type === 'income' 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.type === 'income' ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.date.toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Revenue Analysis Tab */}
          {activeTab === 'revenue' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Revenue Analysis</h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Export Report</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Breakdown */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Revenue by Source</h4>
                  <div className="space-y-4">
                    {revenueStreams.map((stream) => (
                      <div key={stream.name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-300">{stream.name}</span>
                          <span className="text-gray-900 dark:text-white">${stream.amount.toLocaleString()} ({stream.percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${stream.color}`}
                            style={{ width: `${stream.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revenue Trends */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Revenue Trends</h4>
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">Revenue trend chart would be displayed here</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
                  <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Average Daily Revenue</h5>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(financialData.totalRevenue / 30)}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
                  <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Revenue per Room</h5>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(financialData.totalRevenue / 50)}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
                  <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Growth Rate</h5>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">+{financialData.monthlyGrowth}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Expense Tracking Tab */}
          {activeTab === 'expenses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Expense Tracking</h3>
                <button type="button" onClick={() => setShowExpenseModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Add Expense</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Expense Breakdown */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Expense by Category</h4>
                  <div className="space-y-4">
                    {expenseCategories.map((category) => (
                      <div key={category.name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-300">{category.name}</span>
                          <span className="text-gray-900 dark:text-white">${category.amount.toLocaleString()} ({category.percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${category.color}`}
                            style={{ width: `${category.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expense Trends */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Expense Trend</h4>
                  <div className="space-y-4">
                    {monthlyData.map((data) => (
                      <div key={data.month} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{data.month}</span>
                        <span className="text-sm text-gray-900 dark:text-white">${data.expenses.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Expense Control Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
                  <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Expense Ratio</h5>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{financialData.totalRevenue ? ((financialData.totalExpenses / financialData.totalRevenue) * 100).toFixed(1) : '0.0'}%</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
                  <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Cost per Room</h5>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(financialData.totalExpenses / 50)}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
                  <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Budget Variance</h5>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">+5.2%</p>
                </div>
              </div>
            </div>
          )}

          {/* Financial Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Financial Reports</h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Generate Report</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* P&L Statement */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Profit & Loss Statement</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">{formatCurrency(financialData.totalRevenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</span>
                      <span className="text-sm font-medium text-red-600 dark:text-red-400">{formatCurrency(financialData.totalExpenses)}</span>
                    </div>
                    <hr className="border-gray-200 dark:border-gray-600" />
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Net Profit</span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{formatCurrency(financialData.netProfit)}</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm transition-colors">
                    View Full Report
                  </button>
                </div>

                {/* Cash Flow Statement */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Cash Flow Statement</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Operating Cash Flow</span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">$65,200</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Investing Cash Flow</span>
                      <span className="text-sm font-medium text-red-600 dark:text-red-400">-$12,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Financing Cash Flow</span>
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">$36,000</span>
                    </div>
                    <hr className="border-gray-200 dark:border-gray-600" />
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Net Cash Flow</span>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">{formatCurrency(financialData.cashFlow)}</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm transition-colors">
                    View Full Report
                  </button>
                </div>

                {/* Balance Sheet */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Balance Sheet Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Assets</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">$850,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Liabilities</span>
                      <span className="text-sm font-medium text-red-600 dark:text-red-400">$320,000</span>
                    </div>
                    <hr className="border-gray-200 dark:border-gray-600" />
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Owner's Equity</span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">$530,000</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm transition-colors">
                    View Full Report
                  </button>
                </div>
              </div>

              {/* Report Templates */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Report Templates</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                    <h5 className="font-medium text-gray-900 dark:text-white">Daily Sales Report</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Revenue breakdown by day</p>
                  </button>
                  <button className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                    <h5 className="font-medium text-gray-900 dark:text-white">Monthly P&L</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Comprehensive profit & loss</p>
                  </button>
                  <button className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                    <h5 className="font-medium text-gray-900 dark:text-white">Expense Analysis</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Detailed expense breakdown</p>
                  </button>
                  <button className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                    <h5 className="font-medium text-gray-900 dark:text-white">Tax Report</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Tax compliance summary</p>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Expense</h3>
              <button type="button" onClick={() => setShowExpenseModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <input value={expenseForm.description} onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Description" className="w-full rounded-lg border border-gray-300 px-3 py-2" required />
              <select value={expenseForm.category} onChange={(e) => setExpenseForm(prev => ({ ...prev, category: e.target.value as Expense['category'] }))} className="w-full rounded-lg border border-gray-300 px-3 py-2">
                <option value="operations">Operations</option>
                <option value="maintenance">Maintenance</option>
                <option value="supplies">Supplies</option>
                <option value="staff">Staff</option>
                <option value="marketing">Marketing</option>
                <option value="other">Other</option>
              </select>
              <input type="number" value={expenseForm.amount} onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))} placeholder="Amount" className="w-full rounded-lg border border-gray-300 px-3 py-2" required />
              <select value={expenseForm.paymentMethod} onChange={(e) => setExpenseForm(prev => ({ ...prev, paymentMethod: e.target.value as Expense['paymentMethod'] }))} className="w-full rounded-lg border border-gray-300 px-3 py-2">
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="mpesa">Mpesa</option>
                <option value="bank-transfer">Bank Transfer</option>
              </select>
              <textarea value={expenseForm.notes} onChange={(e) => setExpenseForm(prev => ({ ...prev, notes: e.target.value }))} placeholder="Notes" className="w-full rounded-lg border border-gray-300 px-3 py-2" rows={3} />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowExpenseModal(false)} className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700">Cancel</button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-white">Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}