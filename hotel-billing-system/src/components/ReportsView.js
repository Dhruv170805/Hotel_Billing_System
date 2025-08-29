// Reports View component - Simple reporting interface
import React from 'react';
import { useAppContext, ACTIONS } from '../context/AppContext';

const ReportsView = () => {
  const { state, dispatch } = useAppContext();

  const setCurrentView = (view) => {
    if (dispatch) {
      dispatch({ type: ACTIONS.SET_CURRENT_VIEW, payload: view });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">📊 Reports & Analytics</h2>
          <p className="text-gray-600 mt-1">Detailed business insights and performance reports</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentView('admin')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Coming Soon Message */}
      <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
        <div className="text-6xl mb-6">📈</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Advanced Reports Coming Soon!</h3>
        <p className="text-gray-600 mb-8">
          Detailed reporting features are under development. For now, you can access basic analytics from the Admin Dashboard.
        </p>
        
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setCurrentView('admin')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            📊 View Analytics Dashboard
          </button>
          <button
            onClick={() => alert('Export functionality coming soon!')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            📥 Export Data
          </button>
        </div>
      </div>

      {/* Placeholder Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="text-3xl mb-4">💰</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Sales Reports</h3>
          <p className="text-gray-600 text-sm mb-4">Revenue analysis, daily sales, payment methods</p>
          <button 
            onClick={() => alert('Sales reports coming soon!')}
            className="w-full px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Generate Report
          </button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="text-3xl mb-4">📦</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Inventory Reports</h3>
          <p className="text-gray-600 text-sm mb-4">Stock levels, usage patterns, reorder alerts</p>
          <button 
            onClick={() => alert('Inventory reports coming soon!')}
            className="w-full px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
          >
            Generate Report
          </button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="text-3xl mb-4">🏓</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Table Reports</h3>
          <p className="text-gray-600 text-sm mb-4">Occupancy rates, table turnover, peak hours</p>
          <button 
            onClick={() => alert('Table reports coming soon!')}
            className="w-full px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors"
          >
            Generate Report
          </button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="text-3xl mb-4">🍽️</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Menu Reports</h3>
          <p className="text-gray-600 text-sm mb-4">Popular items, category performance, pricing analysis</p>
          <button 
            onClick={() => alert('Menu reports coming soon!')}
            className="w-full px-4 py-2 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 transition-colors"
          >
            Generate Report
          </button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="text-3xl mb-4">⏱️</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Performance Reports</h3>
          <p className="text-gray-600 text-sm mb-4">Service times, efficiency metrics, staff performance</p>
          <button 
            onClick={() => alert('Performance reports coming soon!')}
            className="w-full px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
          >
            Generate Report
          </button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="text-3xl mb-4">📊</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Custom Reports</h3>
          <p className="text-gray-600 text-sm mb-4">Create custom reports with specific date ranges and filters</p>
          <button 
            onClick={() => alert('Custom reports coming soon!')}
            className="w-full px-4 py-2 bg-indigo-100 text-indigo-800 rounded-lg hover:bg-indigo-200 transition-colors"
          >
            Create Custom
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;