import React, { useState } from 'react';
import { ChefHat, Clock, DollarSign, ShoppingBag, Plus, Search, XCircle } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { useAppData } from '../../contexts/AppDataContext';
import { KitchenOrder, KOTItem } from '../../types';

export default function Restaurant() {
  const { formatCurrency } = useSettings();
  const { kitchenOrders, addKitchenOrder, updateKitchenOrder } = useAppData();
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'kitchen'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderForm, setOrderForm] = useState({
    roomNumber: '',
    tableNumber: '',
    orderType: 'dine-in' as KitchenOrder['orderType'],
    waiterName: '',
    itemName: '',
    itemQuantity: 1,
    itemPrice: 10,
    estimatedTime: 20,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'preparing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'ready': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'served': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getOrderTypeIcon = (type: string) => {
    switch (type) {
      case 'room-service': return '🏨';
      case 'dine-in': return '🍽️';
      case 'takeaway': return '📦';
      default: return '🍴';
    }
  };

  const filteredOrders = kitchenOrders.filter(order => {
    const query = searchTerm.toLowerCase();
    return order.orderNumber.toLowerCase().includes(query) || order.items.some(item => item.name.toLowerCase().includes(query));
  });

  const totalOrders = kitchenOrders.length;
  const pendingOrders = kitchenOrders.filter(o => o.status === 'pending').length;
  const totalRevenue = kitchenOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const avgPreparationTime = kitchenOrders.length ? Math.round(kitchenOrders.reduce((sum, order) => sum + (order.estimatedTime || 20), 0) / kitchenOrders.length) : 20;

  const handleCreateOrder = (event: React.FormEvent) => {
    event.preventDefault();

    const item: KOTItem = {
      id: `item-${Date.now()}`,
      name: orderForm.itemName,
      quantity: orderForm.itemQuantity,
      price: orderForm.itemPrice,
      category: 'main',
      status: 'pending',
    };

    const newOrder: Omit<KitchenOrder, 'id'> = {
      orderNumber: `KOT-${String(kitchenOrders.length + 1).padStart(3, '0')}`,
      roomNumber: orderForm.roomNumber || undefined,
      tableNumber: orderForm.tableNumber || undefined,
      orderType: orderForm.orderType,
      items: [item],
      totalAmount: item.quantity * item.price,
      status: 'pending',
      orderTime: new Date(),
      estimatedTime: orderForm.estimatedTime,
      waiterName: orderForm.waiterName || undefined,
    };

    addKitchenOrder(newOrder);
    setShowOrderModal(false);
    setOrderForm({
      roomNumber: '',
      tableNumber: '',
      orderType: 'dine-in',
      waiterName: '',
      itemName: '',
      itemQuantity: 1,
      itemPrice: 10,
      estimatedTime: 20,
    });
  };

  const handleOrderStatusChange = (order: KitchenOrder, nextStatus: KitchenOrder['status']) => {
    updateKitchenOrder({ ...order, status: nextStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Restaurant & Kitchen Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage orders, menu items, and kitchen operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalOrders}</p>
            </div>
            <ShoppingBag className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingOrders}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalRevenue)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Prep Time</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgPreparationTime}m</p>
            </div>
            <ChefHat className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'orders'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Orders & KOT
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'menu'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Menu Management
            </button>
            <button
              onClick={() => setActiveTab('kitchen')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'kitchen'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Kitchen Dashboard
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
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowOrderModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors mt-4 md:mt-0"
            >
              <Plus className="w-4 h-4" />
              <span>New Order</span>
            </button>
          </div>

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getOrderTypeIcon(order.orderType)}</span>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.roomNumber ? `Room ${order.roomNumber}` : `Table ${order.tableNumber}`} • 
                          {order.orderType.replace('-', ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Items:</h4>
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              {item.quantity}x {item.name}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Order Details:</h4>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <p>Order Time: {order.orderTime.toLocaleTimeString()}</p>
                        {order.estimatedTime && (
                          <p>Estimated Time: {order.estimatedTime} minutes</p>
                        )}
                        {order.waiterName && (
                          <p>Waiter: {order.waiterName}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {order.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => handleOrderStatusChange(order, 'preparing')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Start Preparing
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        type="button"
                        onClick={() => handleOrderStatusChange(order, 'ready')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Mark Ready
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button
                        type="button"
                        onClick={() => handleOrderStatusChange(order, 'served')}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Mark Served
                      </button>
                    )}
                    <button className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Menu Tab */}
          {activeTab === 'menu' && (
            <div className="space-y-4">
              <div className="rounded-lg border border-dashed border-gray-300 p-6 text-sm text-gray-600 dark:border-gray-600 dark:text-gray-300">
                Add menu items here to keep your restaurant catalog user-driven and ready for live orders.
              </div>
            </div>
          )}

          {/* Kitchen Dashboard Tab */}
          {activeTab === 'kitchen' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-300 mb-4">Pending Orders</h3>
                  <div className="space-y-2">
                    {mockKitchenOrders.filter(o => o.status === 'pending').map((order) => (
                      <div key={order.id} className="bg-white dark:bg-gray-800 rounded p-3">
                        <p className="font-medium text-gray-900 dark:text-white">{order.orderNumber}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.items.length} items • {order.estimatedTime}m
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-4">In Preparation</h3>
                  <div className="space-y-2">
                    {mockKitchenOrders.filter(o => o.status === 'preparing').map((order) => (
                      <div key={order.id} className="bg-white dark:bg-gray-800 rounded p-3">
                        <p className="font-medium text-gray-900 dark:text-white">{order.orderNumber}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.items.length} items • Started {new Date(order.orderTime).toLocaleTimeString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-4">Ready to Serve</h3>
                  <div className="space-y-2">
                    {mockKitchenOrders.filter(o => o.status === 'ready').map((order) => (
                      <div key={order.id} className="bg-white dark:bg-gray-800 rounded p-3">
                        <p className="font-medium text-gray-900 dark:text-white">{order.orderNumber}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.roomNumber ? `Room ${order.roomNumber}` : `Table ${order.tableNumber}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Kitchen Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">85%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">On-time Delivery</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">22m</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Prep Time</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">4.5/5</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Food Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">156</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Orders Today</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}