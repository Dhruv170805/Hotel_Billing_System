// Application Configuration - Production Ready for Single Device
export const APP_CONFIG = {
  // Application Info
  name: 'Hotel Billing Pro',
  version: '1.0.0',
  buildDate: new Date().toISOString(),
  
  // Device Configuration
  deviceMode: 'SINGLE_DEVICE', // Will support 'MULTI_DEVICE' in future
  deviceId: `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  
  // Database Configuration
  database: {
    name: 'Hotel Shreeji',
    version: 2,
    maxRecords: 10000,
    autoBackup: true,
    backupInterval: 24 * 60 * 60 * 1000, // 24 hours
    retentionDays: 365, // Keep data for 1 year
  },
  
  // Business Configuration
  restaurant: {
    name: 'My Restaurant',
    address: '123 Main Street, City, State',
    phone: '+1 234-567-8900',
    email: 'info@myrestaurant.com',
    gstNumber: 'GST123456789',
    currency: '₹',
    timezone: 'Asia/Kolkata'
  },
  
  // Operational Settings
  operations: {
    maxTables: 50,
    maxMenuItems: 500,
    enableInventory: true,
    enableMultiPayment: true,
    enableKitchenPrint: true,
    enableCustomerBill: true,
    autoSaveInterval: 30000, // 30 seconds
  },
  
  // Tax Configuration
  tax: {
    gstRate: 0.18, // 18%
    serviceCharge: 0.10, // 10%
    enableServiceCharge: false,
  },
  
  // Print Configuration
  printing: {
    kitchenPrinter: {
      enabled: true,
      paperSize: 'A4',
      copies: 1
    },
    customerBill: {
      enabled: true,
      paperSize: 'A4',
      copies: 1,
      showQR: true
    }
  },
  
  // Future Multi-Device Support
  networking: {
    enabled: false, // Will be true for multi-device
    serverUrl: null, // Will point to central server
    syncInterval: 60000, // 1 minute
    offlineMode: true
  },
  
  // Security Settings
  security: {
    enableLogin: false, // For single device, can be enabled later
    sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours
    dataEncryption: false // Can be enabled for multi-device
  },
  
  // Feature Flags
  features: {
    analytics: true,
    reports: true,
    inventory: true,
    tableManagement: true,
    staffManagement: false, // Future feature
    customerLoyalty: false, // Future feature
    onlineOrdering: false, // Future feature
  }
};

// Application Settings Manager
export class AppSettingsManager {
  constructor() {
    this.storageKey = 'hotel_billing_settings';
    this.defaultSettings = APP_CONFIG;
  }

  // Load settings from localStorage
  loadSettings() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...this.defaultSettings, ...parsed };
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
    return this.defaultSettings;
  }

  // Save settings to localStorage
  saveSettings(settings) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Failed to save settings:', error);
      return false;
    }
  }

  // Update restaurant info
  updateRestaurant(restaurantInfo) {
    const settings = this.loadSettings();
    settings.restaurant = { ...settings.restaurant, ...restaurantInfo };
    this.saveSettings(settings);
    return settings;
  }

  // Update operational settings
  updateOperations(operationSettings) {
    const settings = this.loadSettings();
    settings.operations = { ...settings.operations, ...operationSettings };
    this.saveSettings(settings);
    return settings;
  }

  // Get device info
  getDeviceInfo() {
    return {
      deviceId: this.defaultSettings.deviceId,
      mode: this.defaultSettings.deviceMode,
      version: this.defaultSettings.version,
      lastUpdated: new Date().toISOString()
    };
  }

  // Reset to defaults
  resetSettings() {
    localStorage.removeItem(this.storageKey);
    return this.defaultSettings;
  }
}

// Create singleton instance
export const appSettings = new AppSettingsManager();

// Utility functions
export const getAppVersion = () => APP_CONFIG.version;
export const getDeviceId = () => APP_CONFIG.deviceId;
export const isMultiDevice = () => APP_CONFIG.deviceMode === 'MULTI_DEVICE';
export const isSingleDevice = () => APP_CONFIG.deviceMode === 'SINGLE_DEVICE';

export default APP_CONFIG;