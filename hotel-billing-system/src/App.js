// Production Application Shell - Shreeji Restaurant with Pickup Orders
import React, { useEffect, useState } from 'react';
import './index.css';
import Navigation from './components/Navigation';
import StaffInterface from './components/StaffInterface';
import PickupOrdersView from './components/PickupOrdersView';
import AdminDashboard from './components/AdminDashboard';
import TableView from './components/TableView';
import InventoryManagement from './components/InventoryManagement';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import BackupManager from './components/BackupManager';
import { AppProvider, useAppContext } from './context/AppContext';

// Shreeji Restaurant Configuration
const APP_CONFIG = {
  name: 'Shreeji Restaurant',
  version: '1.0.0',
  deviceId: `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  deviceMode: 'SINGLE_DEVICE'
};

// Application Status Monitor
const AppStatusMonitor = ({ children }) => {
  const [appStatus, setAppStatus] = useState({
    isOnline: navigator.onLine,
    dbConnected: false,
    lastBackup: null,
    deviceId: APP_CONFIG.deviceId
  });

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setAppStatus(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setAppStatus(prev => ({ ...prev, isOnline: false }));
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Status Bar */}
      <div className="bg-gradient-to-r from-green-400 to-lime-400 px-4 py-1">
        <div className="flex justify-between items-center text-xs text-white">
          <div className="flex items-center gap-3">
            <span className="font-medium">{APP_CONFIG.name} v{APP_CONFIG.version}</span>
            <span className={`flex items-center gap-1 ${appStatus.isOnline ? 'text-green-100' : 'text-red-200'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${appStatus.isOnline ? 'bg-green-200' : 'bg-red-300'}`}></div>
              {appStatus.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <div className="text-green-100 hidden sm:block">
            {new Date().toLocaleDateString()} | Device: {appStatus.deviceId.slice(-8)}
          </div>
        </div>
      </div>
      
      {children}
    </div>
  );
};

// Main Application Content
const AppContent = () => {
  const { state } = useAppContext();
  const { currentView } = state;

  const renderCurrentView = () => {
    switch (currentView) {
      case 'staff':
        return <StaffInterface />;
      case 'pickup':
        return <PickupOrdersView />;
      case 'admin':
        return <AdminDashboard />;
      case 'tables':
        return <TableView />;
      case 'inventory':
        return <InventoryManagement />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      case 'backup':
        return <BackupManager />;
      default:
        return <StaffInterface />;
    }
  };

  return (
    <div>
      <Navigation />
      <div className="container mx-auto px-4 py-6">
        {renderCurrentView()}
      </div>
    </div>
  );
};

// Shreeji Restaurant Application Component
function App() {
  const [isAppInitialized, setIsAppInitialized] = useState(false);
  const [initError, setInitError] = useState(null);

  useEffect(() => {
    initializeApplication();
  }, []);

  const initializeApplication = async () => {
    try {
      console.log(`🚀 Initializing ${APP_CONFIG.name} v${APP_CONFIG.version}`);
      
      // Check browser compatibility
      if (!window.indexedDB) {
        throw new Error('IndexedDB not supported');
      }
      
      // Check local storage
      if (!window.localStorage) {
        throw new Error('LocalStorage not supported');
      }
      
      // Initialize successful
      setIsAppInitialized(true);
      console.log('✅ Shreeji Restaurant application initialized successfully');
      
    } catch (error) {
      console.error('❌ Application initialization failed:', error);
      setInitError(error.message);
    }
  };

  // Loading Screen with Shreeji Restaurant Logo
  if (!isAppInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-lime-400 to-green-500 flex items-center justify-center">
        <div className="text-center text-white">
          {/* Compact Logo */}
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-white rounded-2xl shadow-xl flex items-center justify-center mb-3 relative">
              <span className="text-4xl font-bold text-orange-500">श्री</span>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-white">जी</span>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-4 py-2">
              <span className="text-lg font-bold text-red-600">Restaurant</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{APP_CONFIG.name}</h1>
          <p className="text-lg mb-6 text-green-100">Professional Restaurant Management</p>
          
          {initError ? (
            <div className="bg-red-500 bg-opacity-80 backdrop-blur-sm rounded-xl p-4">
              <p className="text-lg mb-2">❌ Error</p>
              <p className="text-sm mb-4">{initError}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
              >
                Reload
              </button>
            </div>
          ) : (
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4">
              <p className="text-lg mb-3">🔄 Loading System...</p>
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Error Boundary
  if (initError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
        <div className="text-center p-6 bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl">
          <div className="w-16 h-16 mx-auto bg-white rounded-xl shadow-lg flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-red-500">श्री</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">System Error</h1>
          <p className="text-red-100 mb-4">{initError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-700 text-white rounded-xl hover:bg-red-800"
          >
            Restart System
          </button>
        </div>
      </div>
    );
  }

  // Main Application
  return (
    <AppProvider>
      <AppStatusMonitor>
        <AppContent />
      </AppStatusMonitor>
    </AppProvider>
  );
}

export default App;