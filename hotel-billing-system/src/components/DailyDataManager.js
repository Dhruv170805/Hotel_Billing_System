// Enhanced Daily Data Manager with Excel export and charts
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { exportToExcel, exportToCSV, generateComprehensiveReport } from '../utils/exportUtils';

const DailyDataManager = () => {
  const { state, dbUtils } = useAppContext();
  const { dbStatus, dailyReport, orders = [], inventory = {}, tables = [] } = state;
  
  const [isExporting, setIsExporting] = useState(false);
  const [stats, setStats] = useState(null);
  const [exportStatus, setExportStatus] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      let dbStats;
      if (dbUtils && dbUtils.getStats) {
        dbStats = await dbUtils.getStats();
      } else {
        // Fallback calculation if dbUtils not available
        dbStats = {
          todayOrders: orders.length,
          todayRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
          lowStockItems: Object.values(inventory).filter(item => 
            item && item.stock <= item.minStock
          ).length,
          occupiedTables: tables.filter(t => t.status === 'occupied').length,
          totalTables: tables.length || 10
        };
      }
      setStats(dbStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
      // Fallback stats
      setStats({
        todayOrders: orders.length,
        todayRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
        lowStockItems: 0,
        occupiedTables: 0,
        totalTables: 10
      });
    }
  };

  // Create sample data if no real data exists
  const createSampleData = () => {
    const sampleOrders = [
      {
        id: Date.now() + 1,
        orderId: '#001234',
        tableId: 1,
        items: [
          { name: 'Butter Masla', price: 449, quantity: 1 },
          { name: 'Garlic Naan', price: 60, quantity: 2 }
        ],
        subtotal: 569,
        gst: 102.42,
        total: 671.42,
        paymentMethod: 'UPI',
        timestamp: new Date(),
        status: 'completed'
      },
      {
        id: Date.now() + 2,
        orderId: '#001235',
        tableId: 2,
        items: [
          { name: 'Biryani', price: 379, quantity: 2 },
          { name: 'Mango Lassi', price: 149, quantity: 2 }
        ],
        subtotal: 1056,
        gst: 190.08,
        total: 1246.08,
        paymentMethod: 'Cash',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        status: 'completed'
      },
      {
        id: Date.now() + 3,
        orderId: '#001236',
        tableId: 3,
        items: [
          { name: 'Dal Makhani', price: 299, quantity: 1 },
          { name: 'Paneer Tikka', price: 279, quantity: 1 },
          { name: 'Gulab Jamun', price: 149, quantity: 2 }
        ],
        subtotal: 876,
        gst: 157.68,
        total: 1033.68,
        paymentMethod: 'Card',
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        status: 'completed'
      }
    ];

    return sampleOrders;
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    setExportStatus('🔄 Generating Excel file with charts...');
    
    try {
      const dataToExport = orders.length > 0 ? orders : createSampleData();
      const reportData = generateComprehensiveReport(dataToExport, inventory, tables);
      
      const today = new Date().toISOString().split('T')[0];
      const filename = `hotel-billing-report-${today}`;
      
      const success = exportToExcel(reportData, filename);
      
      if (success) {
        setExportStatus('✅ Excel file exported successfully! Check your downloads folder.');
      } else {
        setExportStatus('❌ Excel export failed. Please try again.');
      }
      
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus('❌ Export failed: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    setExportStatus('🔄 Generating CSV file...');
    
    try {
      const dataToExport = orders.length > 0 ? orders : createSampleData();
      const reportData = generateComprehensiveReport(dataToExport, inventory, tables);
      
      const today = new Date().toISOString().split('T')[0];
      const filename = `hotel-billing-orders-${today}`;
      
      const success = exportToCSV(reportData, filename);
      
      if (success) {
        setExportStatus('✅ CSV file exported successfully! Check your downloads folder.');
      } else {
        setExportStatus('❌ CSV export failed. Please try again.');
      }
      
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus('❌ Export failed: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleTestExport = () => {
    setIsExporting(true);
    setExportStatus('🧪 Creating test Excel file with sample data...');
    
    try {
      const sampleData = createSampleData();
      const reportData = generateComprehensiveReport(sampleData, inventory, tables);
      
      const filename = `hotel-billing-test-${Date.now()}`;
      const success = exportToExcel(reportData, filename);
      
      if (success) {
        setExportStatus('✅ Test Excel file created! This contains sample data to show format.');
      } else {
        setExportStatus('❌ Test export failed.');
      }
      
    } catch (error) {
      setExportStatus('❌ Test export failed: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefreshData = async () => {
    try {
      if (dbUtils && dbUtils.refreshData) {
        await dbUtils.refreshData();
      }
      await loadStats();
      setExportStatus('✅ Data refreshed successfully!');
    } catch (error) {
      setExportStatus('❌ Refresh failed: ' + error.message);
    }
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">📊 Data Export Manager</h3>
          <p className="text-gray-600">Export business data in Excel format with charts and analytics</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          dbStatus === 'connected' ? 'bg-green-100 text-green-800' :
          dbStatus === 'connecting' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {dbStatus === 'connected' ? '🟢 Connected' :
           dbStatus === 'connecting' ? '🟡 Connecting' : '🔴 Offline'}
        </div>
      </div>

      {/* Export Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{stats.todayOrders}</div>
            <div className="text-sm text-blue-800">Orders to Export</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">₹{stats.todayRevenue.toFixed(0)}</div>
            <div className="text-sm text-green-800">Revenue Data</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-600">{stats.lowStockItems}</div>
            <div className="text-sm text-orange-800">Inventory Items</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">{stats.occupiedTables}/{stats.totalTables}</div>
            <div className="text-sm text-purple-800">Table Data</div>
          </div>
        </div>
      )}

      {/* Export Format Information */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h4 className="font-bold text-blue-800 mb-3">📋 Excel Export Contents</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <div className="font-semibold mb-2">📊 Data Sheets:</div>
            <ul className="space-y-1">
              <li>• Orders Summary (all transactions)</li>
              <li>• Daily Revenue (date-wise breakdown)</li>
              <li>• Popular Items (sales ranking)</li>
              <li>• Payment Methods (usage statistics)</li>
              <li>• Hourly Sales (time-based analysis)</li>
              <li>• Inventory Status (stock levels)</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">📈 Ready for Charts:</div>
            <ul className="space-y-1">
              <li>• Revenue trends over time</li>
              <li>• Popular items bar chart</li>
              <li>• Payment method pie chart</li>
              <li>• Hourly sales line chart</li>
              <li>• Inventory status analysis</li>
              <li>• Pre-formatted for Excel charts</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={handleExportExcel}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <span className="text-lg">📊</span>
          <div className="text-left">
            <div className="font-semibold">Export Excel</div>
            <div className="text-xs">Multi-sheet with chart data</div>
          </div>
        </button>

        <button
          onClick={handleExportCSV}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <span className="text-lg">📄</span>
          <div className="text-left">
            <div className="font-semibold">Export CSV</div>
            <div className="text-xs">Simple spreadsheet format</div>
          </div>
        </button>

        <button
          onClick={handleTestExport}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <span className="text-lg">🧪</span>
          <div className="text-left">
            <div className="font-semibold">Test Export</div>
            <div className="text-xs">Sample data for testing</div>
          </div>
        </button>
      </div>

      {/* Additional Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={handleRefreshData}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 p-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <span className="text-lg">🔄</span>
          Refresh Data Before Export
        </button>

        <button
          onClick={() => {
            setExportStatus('');
            loadStats();
          }}
          className="flex items-center justify-center gap-2 p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <span className="text-lg">🧹</span>
          Clear Status Messages
        </button>
      </div>

      {/* Status Messages */}
      {exportStatus && (
        <div className={`p-4 rounded-lg text-sm border ${
          exportStatus.includes('✅') ? 'bg-green-50 text-green-800 border-green-200' :
          exportStatus.includes('❌') ? 'bg-red-50 text-red-800 border-red-200' :
          'bg-blue-50 text-blue-800 border-blue-200'
        }`}>
          <div className="font-semibold mb-1">Export Status:</div>
          {exportStatus}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h5 className="font-semibold text-gray-800 mb-2">📖 How to Create Charts in Excel</h5>
        <div className="text-sm text-gray-600 space-y-2">
          <div><strong>Step 1:</strong> Open the exported Excel file</div>
          <div><strong>Step 2:</strong> Go to "Popular Items" or "Daily Revenue" sheet</div>
          <div><strong>Step 3:</strong> Select the data you want to chart</div>
          <div><strong>Step 4:</strong> Insert → Charts → Choose chart type (Bar, Line, Pie)</div>
          <div><strong>Step 5:</strong> Excel will automatically create beautiful charts!</div>
          <div className="mt-2 p-2 bg-blue-50 rounded text-blue-700">
            💡 <strong>Tip:</strong> The "Test Export" creates sample data perfect for practicing chart creation!
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyDataManager;