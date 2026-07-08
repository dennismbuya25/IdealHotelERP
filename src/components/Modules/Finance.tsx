import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, PieChart, BarChart3, Calendar, Download, Plus } from 'lucide-react';

export default function Finance() {
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'expenses' | 'reports'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const mockFinancialData = {
    totalRevenue: 125750,
    totalExpenses: 78420,
    netProfit: 47330,
    profitMargin: 37.6,
    monthlyGrowth: 12.5,
    cashFlow: 89200,
  };

  const mockRevenueStreams = [
    { name: 'Room Revenue', amount: 85000, percentage: 67.6, color: 'bg-blue-500' },
    { name: 'Restaurant', amount: 25000, percentage: 19.9, color: 'bg-green-500' },
    { name: 'Bar & Beverages', amount: 8750, percentage: 7.0, color: 'bg-purple-500' },
    { name: 'Other Services', amount: 7000, percentage: 5.5, color: 'bg-yellow-500' },
  ];

  const mockExpenseCategories = [
    { name: 'Staff Salaries', amount: 35000, percentage: 44.6, color: 'bg-red-500' },
    { name: 'Utilities', amount: 12000, percentage: 15.3, color: 'bg-orange-500' },
    { name: 'Maintenance', amount: 8500, percentage: 10.8, color: 'bg-indigo-500' },
    { name: 'Supplies', amount: 15000, percentage: 19.1, color: 'bg-pink-500' },
    { name: 'Marketing', amount: 4920, percentage: 6.3, color: 'bg-teal-500' },
    { name: 'Other', amount: 3000, percentage: 3.8, color: 'bg-gray-500' },
  ];

  const mockMonthlyData = [
    { month: 'Jan', revenue: 110000, expenses: 75000, profit: 35000 },
    { month: 'Feb', revenue: 115000, expenses: 76000, profit: 39000 },
    { month: 'Mar', revenue: 120000, expenses: 77000, profit: 43000 },
    { month: 'Apr', revenue: 125750, expenses: 78420, profit: 47330 },
  ];

  const mockTransactions = [
    { id: 'TXN-001', type: 'income', description: 'Room Revenue - April', amount: 85000, date: new Date(), category: 'Room Revenue' },
    { id: 'TXN-002', type: 'expense', description: 'Staff Salaries - April', amount: -35000, date: new Date(), category: 'Salaries' },
    { id: 'TXN-003', type: 'income', description: 'Restaurant Revenue', amount: 25000, date: new Date(), category: 'Restaurant' },
    { id: 'TXN-004', type: 'expense', description: 'Utility Bills', amount: -12000, date: new Date(), category: 'Utilities' },
  ];

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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${mockFinancialData.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">+{mockFinancialData.monthlyGrowth}% from last month</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${mockFinancialData.totalExpenses.toLocaleString()}</p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">+5.2% from last month</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Profit</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${mockFinancialData.netProfit.toLocaleString()}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">{mockFinancialData.profitMargin}% margin</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cash Flow</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${mockFinancialData.cashFlow.toLocaleString()}</p>
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
                  {mockMonthlyData.map((data, index) => (
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
                            style={{ width: `${(data.profit / data.revenue) * 100}%` }}
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
                  {mockTransactions.map((transaction) => (
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
                          {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
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
                    {mockRevenueStreams.map((stream) => (
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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${(mockFinancialData.totalRevenue / 30).toFixed(0)}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
                  <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Revenue per Room</h5>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${(mockFinancialData.totalRevenue / 50).toFixed(0)}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
                  <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Growth Rate</h5>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">+{mockFinancialData.monthlyGrowth}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Expense Tracking Tab */}
          {activeTab === 'expenses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Expense Tracking</h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Add Expense</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Expense Breakdown */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Expense by Category</h4>
                  <div className="space-y-4">
                    {mockExpenseCategories.map((category) => (
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
                    {mockMonthlyData.map((data) => (
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
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{((mockFinancialData.totalExpenses / mockFinancialData.totalRevenue) * 100).toFixed(1)}%</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
                  <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Cost per Room</h5>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${(mockFinancialData.totalExpenses / 50).toFixed(0)}</p>
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
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">${mockFinancialData.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</span>
                      <span className="text-sm font-medium text-red-600 dark:text-red-400">${mockFinancialData.totalExpenses.toLocaleString()}</span>
                    </div>
                    <hr className="border-gray-200 dark:border-gray-600" />
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Net Profit</span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">${mockFinancialData.netProfit.toLocaleString()}</span>
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
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">${mockFinancialData.cashFlow.toLocaleString()}</span>
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
    </div>
  );
}