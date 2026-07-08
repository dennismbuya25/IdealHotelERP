import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Calendar, Filter, FileText, DollarSign, Users, Home } from 'lucide-react';

export default function Reports() {
  const [activeTab, setActiveTab] = useState<'overview' | 'financial' | 'operational' | 'custom'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('');

  const mockReportData = {
    revenue: {
      total: 125750,
      growth: 12.5,
      breakdown: [
        { category: 'Room Revenue', amount: 85000, percentage: 67.6 },
        { category: 'Restaurant', amount: 25000, percentage: 19.9 },
        { category: 'Bar', amount: 8750, percentage: 7.0 },
        { category: 'Other Services', amount: 7000, percentage: 5.5 },
      ]
    },
    occupancy: {
      rate: 78.5,
      totalRooms: 50,
      occupiedRooms: 39,
      availableRooms: 11,
      monthlyTrend: [
        { month: 'Jan', rate: 72 },
        { month: 'Feb', rate: 75 },
        { month: 'Mar', rate: 78 },
        { month: 'Apr', rate: 78.5 },
      ]
    },
    guests: {
      total: 156,
      newGuests: 45,
      returningGuests: 111,
      satisfaction: 4.6,
      demographics: [
        { type: 'Business', count: 89, percentage: 57 },
        { type: 'Leisure', count: 67, percentage: 43 },
      ]
    }
  };

  const predefinedReports = [
    { id: 'daily-sales', name: 'Daily Sales Report', category: 'financial', description: 'Daily revenue breakdown by department' },
    { id: 'occupancy-analysis', name: 'Occupancy Analysis', category: 'operational', description: 'Room occupancy trends and forecasting' },
    { id: 'guest-satisfaction', name: 'Guest Satisfaction Report', category: 'operational', description: 'Customer feedback and ratings analysis' },
    { id: 'financial-summary', name: 'Financial Summary', category: 'financial', description: 'Comprehensive financial performance overview' },
    { id: 'staff-performance', name: 'Staff Performance Report', category: 'operational', description: 'Employee productivity and attendance metrics' },
    { id: 'inventory-status', name: 'Inventory Status Report', category: 'operational', description: 'Stock levels and procurement needs' },
    { id: 'revenue-forecast', name: 'Revenue Forecast', category: 'financial', description: 'Projected revenue based on bookings and trends' },
    { id: 'competitor-analysis', name: 'Market Analysis', category: 'strategic', description: 'Competitive positioning and market trends' },
  ];

  const handleGenerateReport = (reportId: string) => {
    // Simulate report generation
    console.log(`Generating report: ${reportId}`);
    alert(`Report "${reportId}" generated successfully!`);
  };

  const handleExportReport = (format: string) => {
    // Simulate export functionality
    console.log(`Exporting report in ${format} format`);
    alert(`Report exported as ${format.toUpperCase()} successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Generate insights and export comprehensive business reports</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${mockReportData.revenue.total.toLocaleString()}</p>
              <p className="text-sm text-green-600 dark:text-green-400">+{mockReportData.revenue.growth}% growth</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Occupancy Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockReportData.occupancy.rate}%</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">{mockReportData.occupancy.occupiedRooms}/{mockReportData.occupancy.totalRooms} rooms</p>
            </div>
            <Home className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Guests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockReportData.guests.total}</p>
              <p className="text-sm text-purple-600 dark:text-purple-400">{mockReportData.guests.newGuests} new guests</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Satisfaction</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockReportData.guests.satisfaction}/5</p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">Guest rating</p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-600" />
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
              Overview Dashboard
            </button>
            <button
              onClick={() => setActiveTab('financial')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'financial'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Financial Reports
            </button>
            <button
              onClick={() => setActiveTab('operational')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'operational'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Operational Reports
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'custom'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Custom Reports
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Dashboard */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Period Selector */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Analytics Overview</h3>
                <div className="flex items-center space-x-4">
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
                  <button
                    onClick={() => handleExportReport('pdf')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Breakdown */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Revenue Breakdown</h4>
                    <PieChart className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="space-y-4">
                    {mockReportData.revenue.breakdown.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-300">{item.category}</span>
                          <span className="text-gray-900 dark:text-white">${item.amount.toLocaleString()} ({item.percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Occupancy Trend */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Occupancy Trend</h4>
                    <BarChart3 className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="space-y-4">
                    {mockReportData.occupancy.monthlyTrend.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-12 text-sm font-medium text-gray-600 dark:text-gray-400">{item.month}</div>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700 dark:text-gray-300">Occupancy Rate</span>
                            <span className="font-medium text-gray-900 dark:text-white">{item.rate}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${item.rate}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Guest Demographics */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Guest Demographics</h4>
                  <div className="space-y-4">
                    {mockReportData.guests.demographics.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-purple-500'}`} />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.type}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{item.count} guests</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{item.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Performance Indicators */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Key Performance Indicators</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Average Daily Rate (ADR)</span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">$185</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Revenue Per Available Room (RevPAR)</span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">$145</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Guest Satisfaction Score</span>
                      <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{mockReportData.guests.satisfaction}/5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Repeat Guest Rate</span>
                      <span className="text-lg font-bold text-purple-600 dark:text-purple-400">71%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Financial Reports */}
          {activeTab === 'financial' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Financial Reports</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleExportReport('excel')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Excel</span>
                  </button>
                  <button
                    onClick={() => handleExportReport('pdf')}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {predefinedReports
                  .filter(report => report.category === 'financial')
                  .map((report) => (
                    <div key={report.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-3">
                        <FileText className="w-6 h-6 text-blue-600" />
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full">
                          Financial
                        </span>
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{report.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{report.description}</p>
                      <button
                        onClick={() => handleGenerateReport(report.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm transition-colors"
                      >
                        Generate Report
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Operational Reports */}
          {activeTab === 'operational' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Operational Reports</h3>
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>All Departments</option>
                    <option>Front Desk</option>
                    <option>Housekeeping</option>
                    <option>Restaurant</option>
                    <option>Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {predefinedReports
                  .filter(report => report.category === 'operational')
                  .map((report) => (
                    <div key={report.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-3">
                        <BarChart3 className="w-6 h-6 text-green-600" />
                        <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-2 py-1 rounded-full">
                          Operational
                        </span>
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{report.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{report.description}</p>
                      <button
                        onClick={() => handleGenerateReport(report.id)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm transition-colors"
                      >
                        Generate Report
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Custom Reports */}
          {activeTab === 'custom' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Custom Report Builder</h3>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <FileText className="w-4 h-4" />
                  <span>Create New Report</span>
                </button>
              </div>

              {/* Report Builder Form */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Build Custom Report</h4>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Report Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter report name"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Report Type
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                        <option>Financial Analysis</option>
                        <option>Operational Metrics</option>
                        <option>Guest Analytics</option>
                        <option>Staff Performance</option>
                        <option>Inventory Report</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date Range
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last 3 months</option>
                        <option>Last 6 months</option>
                        <option>Last year</option>
                        <option>Custom range</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Export Format
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                        <option>PDF</option>
                        <option>Excel (XLSX)</option>
                        <option>CSV</option>
                        <option>JSON</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Data Fields
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        'Revenue', 'Occupancy', 'Guest Count', 'Average Rate',
                        'Staff Hours', 'Inventory Levels', 'Satisfaction Score', 'Booking Source'
                      ].map((field) => (
                        <label key={field} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{field}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Filters
                    </label>
                    <textarea
                      placeholder="Add any specific filters or conditions..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Preview Report
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Generate & Save
                    </button>
                  </div>
                </form>
              </div>

              {/* Saved Custom Reports */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Saved Custom Reports</h4>
                <div className="space-y-3">
                  {[
                    { name: 'Monthly Revenue Analysis', created: '2024-01-15', lastRun: '2024-01-20' },
                    { name: 'Guest Satisfaction Trends', created: '2024-01-10', lastRun: '2024-01-18' },
                    { name: 'Staff Productivity Report', created: '2024-01-05', lastRun: '2024-01-15' },
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white">{report.name}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Created: {report.created} • Last run: {report.lastRun}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                          Run
                        </button>
                        <button className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 text-sm font-medium">
                          Edit
                        </button>
                        <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}