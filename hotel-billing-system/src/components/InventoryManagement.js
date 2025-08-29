// Inventory Management component - Simple inventory view
import React from 'react';
import { useAppContext, ACTIONS } from '../context/AppContext';

const InventoryManagement = () => {
  const { state, dispatch } = useAppContext();
  const { inventory = {} } = state || {};

  const setCurrentView = (view) => {
    if (dispatch) {
      dispatch({ type: ACTIONS.SET_CURRENT_VIEW, payload: view });
    }
  };

  // Sample inventory data
  const inventoryItems = [
    { id: 1, name: 'Butter Masla', stock: 50, minStock: 10, unit: 'portions', status: 'Available' },
    { id: 2, name: 'Biryani', stock: 30, minStock: 8, unit: 'portions', status: 'Available' },
    { id: 3, name: 'Dal Makhani', stock: 40, minStock: 15, unit: 'portions', status: 'Available' },
    { id: 4, name: 'Paneer Tikka', stock: 35, minStock: 12, unit: 'portions', status: 'Available' },
    { id: 5, name: 'Masla Wings', stock: 8, minStock: 10, unit: 'pieces', status: 'Low Stock' },
    { id: 6, name: 'Mango Lassi', stock: 25, minStock: 15, unit: 'glasses', status: 'Available' }
  ];

  const availableItems = inventoryItems.filter(item => item.status === 'Available').length;
  const lowStockItems = inventoryItems.filter(item => item.status === 'Low Stock').length;
  const outOfStockItems = 0;
  const totalItems = inventoryItems.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">📦 Inventory Management</h2>
          <p className="text-gray-600 mt-1">Monitor and manage stock levels</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentView('staff')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            ← Back to Orders
          </button>
          <button
            onClick={() => alert('Export functionality coming soon!')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            📊 Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Items</p>
              <p className="text-3xl font-bold">{totalItems}</p>
              <p className="text-blue-100 text-xs mt-1">In inventory</p>
            </div>
            <div className="bg-blue-400 bg-opacity-30 p-3 rounded-full">
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Available</p>
              <p className="text-3xl font-bold">{availableItems}</p>
              <p className="text-green-100 text-xs mt-1">In good stock</p>
            </div>
            <div className="bg-green-400 bg-opacity-30 p-3 rounded-full">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Low Stock</p>
              <p className="text-3xl font-bold">{lowStockItems}</p>
              <p className="text-orange-100 text-xs mt-1">Need restocking</p>
            </div>
            <div className="bg-orange-400 bg-opacity-30 p-3 rounded-full">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Out of Stock</p>
              <p className="text-3xl font-bold">{outOfStockItems}</p>
              <p className="text-red-100 text-xs mt-1">Urgent refill</p>
            </div>
            <div className="bg-red-400 bg-opacity-30 p-3 rounded-full">
              <span className="text-2xl">❌</span>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="text-lg font-bold text-orange-800">Low Stock Alert</h3>
              <p className="text-orange-700">The following items need immediate restocking:</p>
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-orange-200">
            <div className="font-medium text-gray-800">Masla Wings</div>
            <div className="text-sm text-orange-600">
              Only 8 pieces left (min: 10)
            </div>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            📋 Inventory Items
            <span className="text-sm font-normal text-gray-600 ml-2">
              ({inventoryItems.length} items)
            </span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Item</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Current Stock</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Min Stock</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Unit</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.map((item, index) => (
                <tr key={item.id} className={`border-t hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`font-bold ${
                      item.stock <= item.minStock ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {item.stock}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-gray-600">{item.minStock}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-gray-600">{item.unit}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Available' ? 'bg-green-100 text-green-800' :
                      item.status === 'Low Stock' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => alert('Update stock functionality coming soon!')}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => alert('Reorder functionality coming soon!')}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Reorder
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">📈</span>
            Bulk Restock
          </h4>
          <p className="text-gray-600 text-sm mb-4">
            Increase stock for all low-stock items to minimum levels
          </p>
          <button
            onClick={() => alert('Bulk restock functionality coming soon!')}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Restock All Low Items
          </button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            View Analytics
          </h4>
          <p className="text-gray-600 text-sm mb-4">
            See detailed analytics and usage patterns
          </p>
          <button
            onClick={() => setCurrentView('admin')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Open Analytics
          </button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">💾</span>
            Export Data
          </h4>
          <p className="text-gray-600 text-sm mb-4">
            Export inventory report for external analysis
          </p>
          <button
            onClick={() => alert('Export functionality coming soon!')}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;