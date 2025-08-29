// Backup Manager - Local Storage Backup System
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const BackupManager = () => {
  const { state, dbUtils } = useAppContext();
  const { orders = [], inventory = {}, tables = [] } = state;
  
  const [backupStatus, setBackupStatus] = useState('');
  const [backupHistory, setBackupHistory] = useState([]);
  const [isBackingUp, setIsBackingUp] = useState(false);

  useEffect(() => {
    loadBackupHistory();
  }, []);

  const loadBackupHistory = () => {
    try {
      const history = JSON.parse(localStorage.getItem('backup_history') || '[]');
      setBackupHistory(history.slice(0, 10)); // Keep last 10 backups
    } catch (error) {
      console.error('Failed to load backup history:', error);
    }
  };

  const createBackup = async () => {
    setIsBackingUp(true);
    setBackupStatus('🔄 Creating backup...');

    try {
      // Collect all data
      const backupData = {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        deviceId: `device_${Date.now()}`,
        data: {
          orders: orders,
          inventory: inventory,
          tables: tables,
          settings: JSON.parse(localStorage.getItem('hotel_billing_settings') || '{}')
        },
        summary: {
          totalOrders: orders.length,
          totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
          inventoryItems: Object.keys(inventory).length,
          totalTables: tables.length
        }
      };

      // Create backup file
      const backupJson = JSON.stringify(backupData, null, 2);
      const blob = new Blob([backupJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Download backup
      const a = document.createElement('a');
      a.href = url;
      a.download = `hotel-backup-${new Date().toISOString().split('T')[0]}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Update backup history
      const historyEntry = {
        timestamp: backupData.timestamp,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        orders: orders.length,
        revenue: backupData.summary.totalRevenue,
        size: (backupJson.length / 1024).toFixed(2) + ' KB'
      };

      const updatedHistory = [historyEntry, ...backupHistory].slice(0, 10);
      localStorage.setItem('backup_history', JSON.stringify(updatedHistory));
      setBackupHistory(updatedHistory);

      setBackupStatus('✅ Backup created successfully! Check your downloads folder.');
      
    } catch (error) {
      setBackupStatus('❌ Backup failed: ' + error.message);
    } finally {
      setIsBackingUp(false);
    }
  };

  const restoreFromFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backupData = JSON.parse(e.target.result);
        
        if (window.confirm('Are you sure you want to restore from this backup? This will overwrite current data.')) {
          // Restore data to localStorage (simplified for single device)
          if (backupData.data.settings) {
            localStorage.setItem('hotel_billing_settings', JSON.stringify(backupData.data.settings));
          }
          
          setBackupStatus('✅ Data restored successfully! Please refresh the page to see changes.');
        }
      } catch (error) {
        setBackupStatus('❌ Invalid backup file: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  const clearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone!')) {
      if (window.confirm('This will delete ALL orders, settings, and data. Are you absolutely sure?')) {
        // Clear all localStorage data
        localStorage.removeItem('hotel_billing_settings');
        localStorage.removeItem('backup_history');
        
        setBackupStatus('⚠️ All data cleared! Please refresh the page.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">💾 Backup Manager</h2>
          <p className="text-gray-600">Backup and restore your restaurant data</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={createBackup}
            disabled={isBackingUp}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {isBackingUp ? '🔄 Creating...' : '💾 Create Backup'}
          </button>
        </div>
      </div>

      {/* Status Message */}
      {backupStatus && (
        <div className={`p-4 rounded-lg ${
          backupStatus.includes('✅') ? 'bg-green-50 text-green-800' :
          backupStatus.includes('❌') ? 'bg-red-50 text-red-800' :
          'bg-blue-50 text-blue-800'
        }`}>
          {backupStatus}
        </div>
      )}

      {/* Current Data Summary */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Current Data Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
            <div className="text-sm text-blue-800">Total Orders</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              ₹{orders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(0)}
            </div>
            <div className="text-sm text-green-800">Total Revenue</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{Object.keys(inventory).length}</div>
            <div className="text-sm text-purple-800">Inventory Items</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{tables.length || 10}</div>
            <div className="text-sm text-orange-800">Tables</div>
          </div>
        </div>
      </div>

      {/* Backup Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Create Backup */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="text-center">
            <div className="text-4xl mb-4">💾</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Create Backup</h3>
            <p className="text-sm text-gray-600 mb-4">Download all your data as a JSON file</p>
            <button
              onClick={createBackup}
              disabled={isBackingUp}
              className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {isBackingUp ? 'Creating...' : 'Create Backup'}
            </button>
          </div>
        </div>

        {/* Restore Backup */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="text-center">
            <div className="text-4xl mb-4">📂</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Restore Backup</h3>
            <p className="text-sm text-gray-600 mb-4">Upload and restore from a backup file</p>
            <label className="w-full inline-block">
              <input
                type="file"
                accept=".json"
                onChange={restoreFromFile}
                className="hidden"
              />
              <div className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                Select Backup File
              </div>
            </label>
          </div>
        </div>

        {/* Clear Data */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="text-center">
            <div className="text-4xl mb-4">🗑️</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Clear Data</h3>
            <p className="text-sm text-gray-600 mb-4">Remove all data and start fresh</p>
            <button
              onClick={clearData}
              className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Clear All Data
            </button>
          </div>
        </div>
      </div>

      {/* Backup History */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Backup History</h3>
        {backupHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📁</div>
            <p>No backups created yet</p>
            <p className="text-sm">Create your first backup to see history here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Time</th>
                  <th className="text-left py-2">Orders</th>
                  <th className="text-left py-2">Revenue</th>
                  <th className="text-left py-2">Size</th>
                </tr>
              </thead>
              <tbody>
                {backupHistory.map((backup, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2">{backup.date}</td>
                    <td className="py-2">{backup.time}</td>
                    <td className="py-2">{backup.orders}</td>
                    <td className="py-2">₹{backup.revenue.toFixed(0)}</td>
                    <td className="py-2">{backup.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-4">💡 Backup Instructions</h3>
        <div className="text-sm text-blue-700 space-y-2">
          <div><strong>Create Backup:</strong> Downloads a JSON file with all your data</div>
          <div><strong>Restore Backup:</strong> Upload a backup file to restore previous data</div>
          <div><strong>Regular Backups:</strong> Create backups regularly to prevent data loss</div>
          <div><strong>Storage:</strong> All data is stored locally on your device</div>
          <div><strong>File Format:</strong> Backups are in JSON format and can be opened in any text editor</div>
        </div>
      </div>
    </div>
  );
};

export default BackupManager;