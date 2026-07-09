import React, { useState } from 'react';
import { Package, AlertTriangle, Plus, Search, Filter, TrendingUp, ShoppingCart, Truck } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { useAppData } from '../../contexts/AppDataContext';
import { InventoryItem } from '../../types';

export default function Inventory() {
  const { formatCurrency } = useSettings();
  const { inventoryItems, addInventoryItem, updateInventoryItem } = useAppData();
  const items = inventoryItems;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'inventory' | 'suppliers' | 'orders'>('inventory');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [newItemForm, setNewItemForm] = useState({ name: '', category: 'kitchen' as InventoryItem['category'], currentStock: 0, minStock: 5, maxStock: 50, unit: 'units', unitPrice: 0, supplier: '' });
  const [orderForm, setOrderForm] = useState({ supplier: '', quantity: 1, notes: '' });

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = items.filter(item => item.currentStock <= item.minStock);
  const totalValue = items.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minStock) return 'low';
    if (item.currentStock >= item.maxStock * 0.8) return 'high';
    return 'normal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'high': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
    }
  };

  const handleUpdateStock = (itemId: string, newStock: number) => {
    const item = items.find(entry => entry.id === itemId);
    if (item) {
      updateInventoryItem({ ...item, currentStock: newStock, lastUpdated: new Date() });
    }
    setFeedback('Stock updated successfully.');
  };

  const handleCreateOrder = (event: React.FormEvent) => {
    event.preventDefault();
    setFeedback(`Purchase order created for ${orderForm.supplier || 'the selected supplier'}.`);
    setShowOrderModal(false);
    setOrderForm({ supplier: '', quantity: 1, notes: '' });
  };

  const handleAddItem = (event: React.FormEvent) => {
    event.preventDefault();
    addInventoryItem({
      name: newItemForm.name,
      category: newItemForm.category,
      currentStock: newItemForm.currentStock,
      minStock: newItemForm.minStock,
      maxStock: newItemForm.maxStock,
      unit: newItemForm.unit,
      lastUpdated: new Date(),
      supplier: newItemForm.supplier || undefined,
      unitPrice: newItemForm.unitPrice,
    });
    setFeedback('New inventory item added to the catalog.');
    setShowAddModal(false);
    setNewItemForm({ name: '', category: 'kitchen', currentStock: 0, minStock: 5, maxStock: 50, unit: 'units', unitPrice: 0, supplier: '' });
  };

  const supplierCount = items.filter((item) => item.supplier).length;
  const pendingOrders = items.filter((item) => item.currentStock <= item.minStock).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory & Procurement</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage stock levels, suppliers, and purchase orders</p>
      </div>

      {feedback && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
          {feedback}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Items</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{items.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Stock Alerts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{lowStockItems.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalValue)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingOrders}</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                activeTab === 'inventory'
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm dark:bg-blue-900/30 dark:text-blue-300'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-blue-900/20'
              }`}
            >
              Inventory
            </button>
            <button
              onClick={() => setActiveTab('suppliers')}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                activeTab === 'suppliers'
                  ? 'border-green-500 bg-green-50 text-green-700 shadow-sm dark:bg-green-900/30 dark:text-green-300'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-green-400 hover:bg-green-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-green-900/20'
              }`}
            >
              Suppliers
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                activeTab === 'orders'
                  ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm dark:bg-purple-900/30 dark:text-purple-300'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-purple-400 hover:bg-purple-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-purple-900/20'
              }`}
            >
              Purchase Orders
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="all">All Categories</option>
                      <option value="kitchen">Kitchen</option>
                      <option value="housekeeping">Housekeeping</option>
                      <option value="bar">Bar</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </button>
              </div>

              {/* Low Stock Alert */}
              {lowStockItems.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Low Stock Alert</h3>
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {lowStockItems.length} items are running low on stock and need to be restocked.
                  </p>
                </div>
              )}

              {/* Inventory Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Current Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Min/Max
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredItems.map((item) => {
                      const status = getStockStatus(item);
                      return (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{item.supplier}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 capitalize">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {item.currentStock} {item.unit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {item.minStock} / {item.maxStock}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(item.unitPrice)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                              {status === 'low' ? 'Low Stock' : status === 'high' ? 'Well Stocked' : 'Normal'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleUpdateStock(item.id, item.currentStock + 10)}
                                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                              >
                                Add Stock
                              </button>
                              <button
                                onClick={() => setShowOrderModal(true)}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                              >
                                Reorder
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Suppliers Tab */}
          {activeTab === 'suppliers' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Supplier Management</h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Add Supplier</span>
                </button>
              </div>

              <div className="rounded-lg border border-dashed border-gray-300 p-6 text-sm text-gray-600 dark:border-gray-600 dark:text-gray-300">
                Supplier records will appear here once the local database has supplier data available.
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Tracked suppliers from the database: {supplierCount}</div>
              </div>
            </div>
          )}

          {/* Purchase Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Purchase Orders</h3>
                <button
                  onClick={() => setShowOrderModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Order</span>
                </button>
              </div>

              <div className="rounded-lg border border-dashed border-gray-300 p-6 text-sm text-gray-600 dark:border-gray-600 dark:text-gray-300">
                Purchase orders will be synced here from the local database as soon as they are created.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add New Item</h3>
            <form onSubmit={handleAddItem} className="space-y-4">
              <input value={newItemForm.name} onChange={(e) => setNewItemForm(prev => ({ ...prev, name: e.target.value }))} type="text" placeholder="Item name" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
              <select value={newItemForm.category} onChange={(e) => setNewItemForm(prev => ({ ...prev, category: e.target.value as InventoryItem['category'] }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="kitchen">Kitchen</option>
                <option value="housekeeping">Housekeeping</option>
                <option value="bar">Bar</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" value={newItemForm.currentStock} onChange={(e) => setNewItemForm(prev => ({ ...prev, currentStock: Number(e.target.value) }))} placeholder="Current stock" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
                <input type="text" value={newItemForm.unit} onChange={(e) => setNewItemForm(prev => ({ ...prev, unit: e.target.value }))} placeholder="Unit" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" value={newItemForm.minStock} onChange={(e) => setNewItemForm(prev => ({ ...prev, minStock: Number(e.target.value) }))} placeholder="Min stock" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
                <input type="number" value={newItemForm.maxStock} onChange={(e) => setNewItemForm(prev => ({ ...prev, maxStock: Number(e.target.value) }))} placeholder="Max stock" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
              </div>
              <input type="number" value={newItemForm.unitPrice} onChange={(e) => setNewItemForm(prev => ({ ...prev, unitPrice: Number(e.target.value) }))} placeholder="Unit price" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
              <input type="text" value={newItemForm.supplier} onChange={(e) => setNewItemForm(prev => ({ ...prev, supplier: e.target.value }))} placeholder="Supplier" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              <div className="flex space-x-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">Add Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Create Purchase Order</h3>
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <select value={orderForm.supplier} onChange={(e) => setOrderForm(prev => ({ ...prev, supplier: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Select supplier</option>
                {items.filter((item) => item.supplier).map((item) => (
                  <option key={item.id}>{item.supplier}</option>
                ))}
              </select>
              <input type="number" value={orderForm.quantity} onChange={(e) => setOrderForm(prev => ({ ...prev, quantity: Number(e.target.value) }))} placeholder="Quantity" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
              <textarea value={orderForm.notes} onChange={(e) => setOrderForm(prev => ({ ...prev, notes: e.target.value }))} placeholder="Notes" rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              <div className="flex space-x-3">
                <button type="button" onClick={() => setShowOrderModal(false)} className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">Create Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}