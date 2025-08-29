import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const AdminDashboard = () => {
  const { state } = useAppContext();
  
  // State for dashboard data
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    todayRevenue: 0
  });

  // State for pickup statistics
  const [pickupStats, setPickupStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    todayRevenue: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    loadDashboardStats();
    loadPickupStats();
  }, []);

  const loadDashboardStats = () => {
    try {
      // Load dine-in orders
      const dinePayments = JSON.parse(localStorage.getItem('dine_payments') || '[]');
      const today = new Date().toDateString();
      
      const todayOrders = dinePayments.filter(payment => 
        new Date(payment.timestamp).toDateString() === today
      );

      const stats = {
        totalOrders: dinePayments.length,
        totalRevenue: dinePayments.reduce((sum, payment) => sum + payment.total, 0),
        todayOrders: todayOrders.length,
        todayRevenue: todayOrders.reduce((sum, payment) => sum + payment.total, 0)
      };

      setDashboardStats(stats);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    }
  };

  const loadPickupStats = () => {
    try {
      const pickupOrders = JSON.parse(localStorage.getItem('pickup_orders') || '[]');
      const today = new Date().toDateString();
      
      const todayOrders = pickupOrders.filter(order => 
        new Date(order.timestamp).toDateString() === today
      );

      const stats = {
        totalOrders: pickupOrders.length,
        totalRevenue: pickupOrders.reduce((sum, order) => sum + order.total, 0),
        todayOrders: todayOrders.length,
        todayRevenue: todayOrders.reduce((sum, order) => sum + order.total, 0),
        pendingOrders: pickupOrders.filter(order => order.status === 'confirmed').length
      };

      setPickupStats(stats);
    } catch (error) {
      console.error('Failed to load pickup stats:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">📊 Shreeji Restaurant Dashboard</h2>
        <p className="text-gray-600">Overview of your restaurant operations</p>
      </div>

      {/* Dine-In Statistics */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">🍽️ Dine-In Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="text-3xl">📋</div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{dashboardStats.totalOrders}</div>
                <div className="text-sm text-blue-800">Total Dine-In Orders</div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="text-3xl">💰</div>
              <div>
                <div className="text-2xl font-bold text-green-600">Rs.{dashboardStats.totalRevenue.toFixed(0)}</div>
                <div className="text-sm text-green-800">Dine-In Revenue</div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="text-3xl">📅</div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{dashboardStats.todayOrders}</div>
                <div className="text-sm text-yellow-800">Today's Dine-In</div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="text-3xl">💵</div>
              <div>
                <div className="text-2xl font-bold text-purple-600">Rs.{dashboardStats.todayRevenue.toFixed(0)}</div>
                <div className="text-sm text-purple-800">Today's Revenue</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pickup Statistics */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">📦 Pickup Orders Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="text-3xl">📦</div>
              <div>
                <div className="text-2xl font-bold text-red-600">{pickupStats.totalOrders}</div>
                <div className="text-sm text-red-800">Total Pickup Orders</div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="text-3xl">💰</div>
              <div>
                <div className="text-2xl font-bold text-green-600">Rs.{pickupStats.totalRevenue.toFixed(0)}</div>
                <div className="text-sm text-green-800">Pickup Revenue</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="text-3xl">📅</div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{pickupStats.todayOrders}</div>
                <div className="text-sm text-blue-800">Today's Pickups</div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="text-3xl">⏰</div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{pickupStats.pendingOrders}</div>
                <div className="text-sm text-orange-800">Pending Pickups</div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="text-3xl">💵</div>
              <div>
                <div className="text-2xl font-bold text-indigo-600">Rs.{pickupStats.todayRevenue.toFixed(0)}</div>
                <div className="text-sm text-indigo-800">Today's Pickup Revenue</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Combined Overview */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Combined Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-800">
              {dashboardStats.totalOrders + pickupStats.totalOrders}
            </div>
            <div className="text-sm text-gray-600">Total Orders (All Types)</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              Rs.{(dashboardStats.totalRevenue + pickupStats.totalRevenue).toFixed(0)}
            </div>
            <div className="text-sm text-green-700">Total Revenue (All Types)</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {dashboardStats.todayOrders + pickupStats.todayOrders}
            </div>
            <div className="text-sm text-blue-700">Today's Total Orders</div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Dine-In Orders */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🍽️ Recent Dine-In Orders</h3>
          <div className="space-y-3">
            {JSON.parse(localStorage.getItem('dine_payments') || '[]')
              .slice(-5)
              .reverse()
              .map(order => (
                <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold">{order.orderId}</div>
                    <div className="text-sm text-gray-600">Table {order.tableId} • {order.paymentMethod}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">Rs.{order.total.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">{new Date(order.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            {JSON.parse(localStorage.getItem('dine_payments') || '[]').length === 0 && (
              <div className="text-center py-4 text-gray-500">No dine-in orders yet</div>
            )}
          </div>
        </div>

        {/* Recent Pickup Orders */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📦 Recent Pickup Orders</h3>
          <div className="space-y-3">
            {JSON.parse(localStorage.getItem('pickup_orders') || '[]')
              .slice(-5)
              .reverse()
              .map(order => (
                <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold">{order.orderId}</div>
                    <div className="text-sm text-gray-600">{order.customerName} • {order.pickupTime}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">Rs.{order.total.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">{new Date(order.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            {JSON.parse(localStorage.getItem('pickup_orders') || '[]').length === 0 && (
              <div className="text-center py-4 text-gray-500">No pickup orders yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={() => {
            loadDashboardStats();
            loadPickupStats();
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          🔄 Refresh Dashboard
        </button>
      </div>
    </div>
  );
};
export default AdminDashboard;