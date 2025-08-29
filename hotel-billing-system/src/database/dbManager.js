// Database Manager - FIXED typo error
import { DATABASE_CONFIG, SCHEMAS, INITIAL_DATA } from './schema.js';

class HotelBillingDB {
  constructor() {
    this.db = null;
    this.isInitialized = false;
    this.initPromise = null;
  }

  // Initialize database connection
  async init() {
    if (this.initPromise) return this.initPromise;
    
    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE_CONFIG.name, DATABASE_CONFIG.version);
      
      request.onerror = () => {
        console.error('Database failed to open:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        console.log('✅ Database connected successfully');
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        console.log('🔄 Creating/upgrading database...');
        
        // Create object stores (tables)
        this.createObjectStores(db);
        
        // Populate with initial data
        this.populateInitialData(db);
      };
    });
    
    return this.initPromise;
  }

  // Create database tables/stores
  createObjectStores(db) {
    // Orders store
    if (!db.objectStoreNames.contains('orders')) {
      const ordersStore = db.createObjectStore('orders', { keyPath: 'id' });
      ordersStore.createIndex('date', 'date', { unique: false });
      ordersStore.createIndex('tableId', 'tableId', { unique: false });
      ordersStore.createIndex('timestamp', 'timestamp', { unique: false });
    }

    // Inventory store
    if (!db.objectStoreNames.contains('inventory')) {
      const inventoryStore = db.createObjectStore('inventory', { keyPath: 'id' });
      inventoryStore.createIndex('category', 'category', { unique: false });
      inventoryStore.createIndex('currentStock', 'currentStock', { unique: false });
    }

    // Tables store
    if (!db.objectStoreNames.contains('tables')) {
      const tablesStore = db.createObjectStore('tables', { keyPath: 'id' });
      tablesStore.createIndex('status', 'status', { unique: false });
    }

    // Daily Reports store
    if (!db.objectStoreNames.contains('dailyReports')) {
      db.createObjectStore('dailyReports', { keyPath: 'date' });
    }

    // Menu Items store
    if (!db.objectStoreNames.contains('menuItems')) {
      const menuStore = db.createObjectStore('menuItems', { keyPath: 'id' });
      menuStore.createIndex('category', 'category', { unique: false });
      menuStore.createIndex('isAvailable', 'isAvailable', { unique: false });
    }

    // Customers store
    if (!db.objectStoreNames.contains('customers')) {
      const customersStore = db.createObjectStore('customers', { keyPath: 'id' });
      customersStore.createIndex('phone', 'phone', { unique: true });
      customersStore.createIndex('email', 'email', { unique: false });
    }

    // Staff store
    if (!db.objectStoreNames.contains('staff')) {
      const staffStore = db.createObjectStore('staff', { keyPath: 'id' });
      staffStore.createIndex('role', 'role', { unique: false });
      staffStore.createIndex('isActive', 'isActive', { unique: false });
    }

    // Settings store
    if (!db.objectStoreNames.contains('settings')) {
      db.createObjectStore('settings', { keyPath: 'key' });
    }
  }

  // Populate database with initial data
  async populateInitialData(db) {
    const transaction = db.transaction(['menuItems', 'inventory', 'tables', 'settings'], 'readwrite');
    
    // Add menu items
    const menuStore = transaction.objectStore('menuItems');
    INITIAL_DATA.menuItems.forEach(item => {
      menuStore.add(item);
    });

    // Add inventory
    const inventoryStore = transaction.objectStore('inventory');
    INITIAL_DATA.inventory.forEach(item => {
      inventoryStore.add(item);
    });

    // Add tables
    const tablesStore = transaction.objectStore('tables');
    INITIAL_DATA.tables.forEach(table => {
      tablesStore.add(table);
    });

    // Add settings
    const settingsStore = transaction.objectStore('settings');
    INITIAL_DATA.settings.forEach(setting => {
      setting.updatedAt = new Date();
      settingsStore.add(setting);
    });

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log('✅ Initial data populated');
        resolve();
      };
      transaction.onerror = () => {
        console.error('❌ Failed to populate initial data:', transaction.error);
        reject(transaction.error);
      };
    });
  }

  // Generic CRUD operations
  async add(storeName, data) {
    await this.init();
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.add(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async get(storeName, key) {
    await this.init();
    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(storeName) {
    await this.init();
    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async update(storeName, data) {
    await this.init();
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName, key) {
    await this.init();
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Order Management
  async addOrder(orderData) {
    const order = {
      ...orderData,
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderId: `#${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date(),
      status: 'completed',
      printedKitchen: false,
      printedCustomer: false
    };
    
    await this.add('orders', order);
    
    // Update inventory
    await this.updateInventoryFromOrder(order.items);
    
    // Generate daily report
    await this.updateDailyReport(order.date);
    
    return order;
  }

  // FIXED: Correct typo - 'orders' instead of orders
  async getOrdersByDate(date) {
    await this.init();
    const transaction = this.db.transaction(['orders'], 'readonly');
    const store = transaction.objectStore('orders');
    const index = store.index('date');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(date);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getTodayOrders() {
    const today = new Date().toISOString().split('T')[0];
    return await this.getOrdersByDate(today);
  }

  // Inventory Management
  async updateInventoryFromOrder(items) {
    if (!items || !Array.isArray(items)) return;
    
    for (const item of items) {
      const inventoryItem = await this.get('inventory', item.id);
      if (inventoryItem) {
        inventoryItem.currentStock = Math.max(0, inventoryItem.currentStock - item.quantity);
        inventoryItem.lastUpdated = new Date();
        await this.update('inventory', inventoryItem);
      }
    }
  }

  async updateInventoryStock(itemId, newStock) {
    const item = await this.get('inventory', itemId);
    if (item) {
      item.currentStock = newStock;
      item.lastUpdated = new Date();
      await this.update('inventory', item);
    }
    return item;
  }

  async getLowStockItems() {
    const inventory = await this.getAll('inventory');
    return inventory.filter(item => item.currentStock <= item.minStock);
  }

  // Table Management
  async updateTableStatus(tableId, status, orderData = null) {
    const table = await this.get('tables', tableId);
    if (table) {
      table.status = status;
      table.currentOrderId = orderData?.currentOrderId || null;
      table.totalAmount = orderData?.totalAmount || 0;
      table.occupiedSince = status === 'occupied' ? new Date() : null;
      table.customerCount = orderData?.customerCount || 0;
      await this.update('tables', table);
    }
    return table;
  }

  // Daily Reports
  async updateDailyReport(date) {
    const orders = await this.getOrdersByDate(date);
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Payment method breakdown
    const paymentMethods = {};
    orders.forEach(order => {
      paymentMethods[order.paymentMethod] = (paymentMethods[order.paymentMethod] || 0) + 1;
    });

    // Popular items
    const itemStats = {};
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          itemStats[item.name] = (itemStats[item.name] || 0) + item.quantity;
        });
      }
    });
    const popularItems = Object.entries(itemStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([name, quantity]) => ({ name, quantity }));

    // Hourly data
    const hourlyData = Array.from({length: 24}, (_, hour) => ({
      hour,
      orders: 0,
      revenue: 0
    }));

    orders.forEach(order => {
      const hour = new Date(order.timestamp).getHours();
      hourlyData[hour].orders++;
      hourlyData[hour].revenue += order.total;
    });

    const report = {
      date,
      totalRevenue,
      totalOrders,
      avgOrderValue,
      paymentMethods,
      popularItems,
      hourlyData,
      tableOccupancy: await this.getTableOccupancyRate(),
      inventoryAlerts: await this.getLowStockItems(),
      generatedAt: new Date()
    };

    await this.update('dailyReports', report);
    return report;
  }

  async getTodayReport() {
    const today = new Date().toISOString().split('T')[0];
    let report = await this.get('dailyReports', today);
    
    if (!report) {
      report = await this.updateDailyReport(today);
    }
    
    return report;
  }

  async getTableOccupancyRate() {
    const tables = await this.getAll('tables');
    const occupiedTables = tables.filter(table => table.status === 'occupied').length;
    return tables.length > 0 ? (occupiedTables / tables.length) * 100 : 0;
  }

  // Data Export/Import
  async exportAllData() {
    const data = {};
    
    for (const storeName of Object.values(DATABASE_CONFIG.stores)) {
      data[storeName] = await this.getAll(storeName);
    }
    
    return {
      exportDate: new Date().toISOString(),
      version: DATABASE_CONFIG.version,
      data
    };
  }

  async exportDailyData(date) {
    const orders = await this.getOrdersByDate(date);
    const report = await this.get('dailyReports', date);
    
    return {
      date,
      orders,
      report,
      exportedAt: new Date().toISOString()
    };
  }

  // Database maintenance
  async clearOldData(daysToKeep = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    const cutoffString = cutoffDate.toISOString().split('T')[0];
    
    const orders = await this.getAll('orders');
    const oldOrders = orders.filter(order => order.date < cutoffString);
    
    for (const order of oldOrders) {
      await this.delete('orders', order.id);
    }
    
    console.log(`🗑️ Cleaned up ${oldOrders.length} old orders`);
    return oldOrders.length;
  }

  // Settings management
  async getSetting(key) {
    const setting = await this.get('settings', key);
    return setting ? setting.value : null;
  }

  async updateSetting(key, value, description = '') {
    const setting = {
      key,
      value,
      description,
      updatedAt: new Date()
    };
    await this.update('settings', setting);
    return setting;
  }
}

// Create singleton instance
const dbManager = new HotelBillingDB();

export default dbManager;