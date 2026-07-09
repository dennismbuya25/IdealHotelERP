import React, { useState } from 'react';
import { CreditCard, Receipt, DollarSign, FileText, Plus, Search, Download, XCircle } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { useAppData } from '../../contexts/AppDataContext';
import { Invoice } from '../../types';

export default function Billing() {
  const { formatCurrency } = useSettings();
  const { bookings, invoices: storedInvoices, addInvoice, addAuditLog } = useAppData();
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'reports'>('invoices');
  const [searchTerm, setSearchTerm] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({ guestName: '', bookingId: '', amount: '', paymentStatus: 'pending' as Invoice['paymentStatus'], paymentMethod: 'cash' as Invoice['paymentMethod'] });

  const invoices = storedInvoices.length > 0 ? storedInvoices : bookings.map((booking, index) => ({
    id: `INV-${String(index + 1).padStart(4, '0')}`,
    bookingId: booking.id,
    guestName: booking.guestName,
    items: [{ description: 'Room charge', quantity: 1, unitPrice: booking.totalAmount, total: booking.totalAmount, category: 'room' }],
    subtotal: booking.totalAmount,
    tax: 0,
    discount: 0,
    total: booking.totalAmount,
    paymentMethod: 'cash',
    paymentStatus: booking.paymentStatus,
    issueDate: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  }));

  const payments: Array<{ id: string; invoiceId: string; amount: number; method: string; date: Date; status: string; reference: string; }> = [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'pending':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'refunded':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit-card':
        return <CreditCard className="w-4 h-4" />;
      case 'mpesa':
        return <DollarSign className="w-4 h-4" />;
      case 'cash':
        return <Receipt className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidInvoices = invoices.filter(inv => inv.paymentStatus === 'paid').length;
  const pendingAmount = invoices
    .filter(inv => inv.paymentStatus === 'pending')
    .reduce((sum, inv) => sum + inv.total, 0);

  const handleCreateInvoice = (event: React.FormEvent) => {
    event.preventDefault();
    const amount = Number(invoiceForm.amount);
    const createdInvoice = addInvoice({
      bookingId: invoiceForm.bookingId,
      guestName: invoiceForm.guestName,
      items: [{ description: 'Additional service', quantity: 1, unitPrice: amount, total: amount, category: 'service' }],
      subtotal: amount,
      tax: 0,
      discount: 0,
      total: amount,
      paymentMethod: invoiceForm.paymentMethod,
      paymentStatus: invoiceForm.paymentStatus,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    addAuditLog({ action: 'invoice_created', details: `Created invoice ${createdInvoice.id} for ${invoiceForm.guestName}.`, actor: 'Administrator' });
    setShowInvoiceModal(false);
    setInvoiceForm({ guestName: '', bookingId: '', amount: '', paymentStatus: 'pending', paymentMethod: 'cash' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Billing & Invoicing</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage invoices, payments, and financial records</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalRevenue)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Paid Invoices</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{paidInvoices}</p>
            </div>
            <Receipt className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Amount</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(pendingAmount)}</p>
            </div>
            <FileText className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{invoices.length}</p>
            </div>
            <CreditCard className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('invoices')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'invoices'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Invoices
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'payments'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Payments
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Reports
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Search and Actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <button type="button" onClick={() => setShowInvoiceModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <Plus className="w-4 h-4" />
                <span>New Invoice</span>
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'invoices' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Invoice ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Guest
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {invoice.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {invoice.guestName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(invoice.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                            {invoice.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {invoice.dueDate.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                              View
                            </button>
                            <button className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300">
                              Pay
                            </button>
                            <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300">
                              Download
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

          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Payment ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {payment.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {payment.invoiceId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          ${payment.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getPaymentMethodIcon(payment.method)}
                            <span className="text-sm text-gray-900 dark:text-white capitalize">
                              {payment.method.replace('-', ' ')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {payment.date.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Revenue by Payment Method</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Credit Card</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">MPESA</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Cash</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(0)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Revenue Trend</h4>
                  <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">Chart visualization would be displayed here</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create Invoice</h3>
              <button type="button" onClick={() => setShowInvoiceModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <input value={invoiceForm.guestName} onChange={(e) => setInvoiceForm(prev => ({ ...prev, guestName: e.target.value }))} placeholder="Guest name" className="w-full rounded-lg border border-gray-300 px-3 py-2" required />
              <input value={invoiceForm.bookingId} onChange={(e) => setInvoiceForm(prev => ({ ...prev, bookingId: e.target.value }))} placeholder="Booking ID" className="w-full rounded-lg border border-gray-300 px-3 py-2" />
              <input type="number" value={invoiceForm.amount} onChange={(e) => setInvoiceForm(prev => ({ ...prev, amount: e.target.value }))} placeholder="Amount" className="w-full rounded-lg border border-gray-300 px-3 py-2" required />
              <select value={invoiceForm.paymentMethod} onChange={(e) => setInvoiceForm(prev => ({ ...prev, paymentMethod: e.target.value as Invoice['paymentMethod'] }))} className="w-full rounded-lg border border-gray-300 px-3 py-2">
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="mpesa">Mpesa</option>
                <option value="bank-transfer">Bank Transfer</option>
              </select>
              <select value={invoiceForm.paymentStatus} onChange={(e) => setInvoiceForm(prev => ({ ...prev, paymentStatus: e.target.value as Invoice['paymentStatus'] }))} className="w-full rounded-lg border border-gray-300 px-3 py-2">
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="refunded">Refunded</option>
              </select>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowInvoiceModal(false)} className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700">Cancel</button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-white">Save Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}