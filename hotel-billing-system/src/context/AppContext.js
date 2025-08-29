// Enhanced AppContext with database persistence
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import dbManager from '../database/dbManager';

// Action types (enhanced)
export const ACTIONS = {
  SET_CURRENT_VIEW: 'SET_CURRENT_VIEW',
  SET_SELECTED_TABLE: 'SET_SELECTED_TABLE',
  ADD_TO_CART: 'ADD_TO_CART',
  UPDATE_CART_QUANTITY: 'UPDATE_CART_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  ADD_ORDER: 'ADD_ORDER',
  UPDATE_TABLE_STATUS: 'UPDATE_TABLE_STATUS',
  UPDATE_INVENTORY: 'UPDATE_INVENTORY',
  SET_REPORT_DATE_RANGE: 'SET_REPORT_DATE_RANGE',
  TOGGLE_REPORTS: 'TOGGLE_REPORTS',
  SET_SELECTED_CATEGORY: 'SET_SELECTED_CATEGORY',
  UPDATE_LAST_SYNC: 'UPDATE_LAST_SYNC',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  UPDATE_OPERATIONS: 'UPDATE_OPERATIONS',
  
  // Database actions
  LOAD_DATA_FROM_DB: 'LOAD_DATA_FROM_DB',
  SET_DB_STATUS: 'SET_DB_STATUS',
  SET_ORDERS: 'SET_ORDERS',
  SET_MENU_ITEMS: 'SET_MENU_ITEMS',
  SET_TABLES: 'SET_TABLES',
  SET_INVENTORY: 'SET_INVENTORY',
  SET_DAILY_REPORT: 'SET_DAILY_REPORT',
  UPDATE_MENU_ITEM: 'UPDATE_MENU_ITEM'
};

// Initial state (enhanced with database fields)
const initialState = {
  currentView: 'staff',
  selectedTable: null,
  cart: [],
  orders: [],
  tables: [],
  inventory: {},
  menuItems: [],
  dailyReport: null,
  reportDateRange: {
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  },
  showReports: false,
  selectedCategory: 'All',
  dbStatus: 'connecting', // connecting, connected, error
  lastSync: new Date(),
  isDataLoaded: false,
  settings: {    restaurant: {
      name: 'Shreeji Restaurant',
      phone: '+91 98765 43210',
      email: 'info@shreejirestaurant.com'
    },
    operations: {
      maxTables: 20,
      enablePickupOrders: true,
      enableInventory: true,
      enableKitchenPrint: true
    },
    tax: {
      gstRate: 0.18,
      enableServiceCharge: false
    }
  },
  menuItems: []
};

// Enhanced reducer with database actions
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_CURRENT_VIEW:
      return { ...state, currentView: action.payload };

    case ACTIONS.SET_SELECTED_TABLE:
      return { ...state, selectedTable: action.payload };

    case ACTIONS.SET_SELECTED_CATEGORY:
      return { ...state, selectedCategory: action.payload };
    case ACTIONS.UPDATE_SETTINGS:
      return { ...state, settings: { ...state.settings, ...action.payload } };
    
    case ACTIONS.ADD_TO_CART:
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, { ...action.payload, quantity: 1 }]
        };
      }

    case ACTIONS.UPDATE_CART_QUANTITY:
      const { itemId, change } = action.payload;
      return {
        ...state,
        cart: state.cart.map(item => {
          if (item.id === itemId) {
            const newQuantity = item.quantity + change;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        }).filter(Boolean)
      };

    case ACTIONS.CLEAR_CART:
      return { ...state, cart: [] };

    case ACTIONS.ADD_ORDER:
      // Order will be added to database, update local state
      return {
        ...state,
        orders: [action.payload, ...state.orders]
      };

    case ACTIONS.UPDATE_TABLE_STATUS:
      const { tableId, status, orderData } = action.payload;
      return {
        ...state,
        tables: state.tables.map(table =>
          table.id === tableId
            ? { ...table, status, currentOrderId: orderData?.currentOrderId || null, totalAmount: orderData?.totalAmount || 0 }
            : table
        )
      };

    case ACTIONS.UPDATE_INVENTORY:
      return {
        ...state,
        inventory: { ...state.inventory, ...action.payload }
      };

    case ACTIONS.SET_REPORT_DATE_RANGE:
      return {
        ...state,
        reportDateRange: { ...state.reportDateRange, ...action.payload }
      };

    case ACTIONS.TOGGLE_REPORTS:
      return { ...state, showReports: !state.showReports };

    case ACTIONS.SET_SELECTED_CATEGORY:
      return { ...state, selectedCategory: action.payload };

    case ACTIONS.UPDATE_LAST_SYNC:
      return { ...state, lastSync: new Date() };

    // Database-specific actions
    case ACTIONS.SET_DB_STATUS:
      return { ...state, dbStatus: action.payload };

    case ACTIONS.LOAD_DATA_FROM_DB:
      return {
        ...state,
        ...action.payload,
        isDataLoaded: true,
        dbStatus: 'connected',
        lastSync: new Date()
      };

    case ACTIONS.SET_ORDERS:
      return { ...state, orders: action.payload };

    case ACTIONS.SET_MENU_ITEMS:
      return { ...state, menuItems: action.payload };

    case ACTIONS.SET_TABLES:
      return { ...state, tables: action.payload };

    case ACTIONS.SET_INVENTORY:
      // Convert array to object for compatibility
      const inventoryObj = {};
      action.payload.forEach(item => {
        inventoryObj[item.id] = {
          stock: item.currentStock,
          minStock: item.minStock,
          maxStock: item.maxStock,
          unit: item.unit
        };
      });
      return { ...state, inventory: inventoryObj };

    case ACTIONS.SET_DAILY_REPORT:
      return { ...state, dailyReport: action.payload };

    case ACTIONS.UPDATE_MENU_ITEM:
      return {
        ...state,
        menuItems: state.menuItems.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      };

    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Enhanced context provider with database integration
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize database and load data on app start
  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      dispatch({ type: ACTIONS.SET_DB_STATUS, payload: 'connecting' });
      
      // Initialize database
      await dbManager.init();
      
      // Load all data from database
      await loadDataFromDatabase();
      
      dispatch({ type: ACTIONS.SET_DB_STATUS, payload: 'connected' });
      console.log('✅ Database initialized and data loaded');
      
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      dispatch({ type: ACTIONS.SET_DB_STATUS, payload: 'error' });
    }
  };

  const loadDataFromDatabase = async () => {
    try {
      // Load all data in parallel
      const [orders, menuItems, tables, inventory, todayReport] = await Promise.all([
        dbManager.getTodayOrders(),
        dbManager.getAll('menuItems'),
        dbManager.getAll('tables'),
        dbManager.getAll('inventory'),
        dbManager.getTodayReport()
      ]);

      // Dispatch all data to state
      dispatch({ type: ACTIONS.SET_ORDERS, payload: orders });
      dispatch({ type: ACTIONS.SET_MENU_ITEMS, payload: menuItems });
      dispatch({ type: ACTIONS.SET_TABLES, payload: tables });
      dispatch({ type: ACTIONS.SET_INVENTORY, payload: inventory });
      dispatch({ type: ACTIONS.SET_DAILY_REPORT, payload: todayReport });

      console.log('📊 Data loaded:', {
        orders: orders.length,
        menuItems: menuItems.length,
        tables: tables.length,
        inventory: inventory.length
      });
      
    } catch (error) {
      console.error('❌ Failed to load data from database:', error);
    }
  };

  // Load app settings from localStorage on mount
  const loadAppSettings = () => {
    try {
      const savedSettings = localStorage.getItem('hotel_billing_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: parsed });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  // Enhanced dispatch with database persistence
  const enhancedDispatch = async (action) => {
    // Handle database operations before state updates
    try {
      switch (action.type) {
        case ACTIONS.ADD_ORDER:
          // Save order to database
          const savedOrder = await dbManager.addOrder(action.payload);
          action.payload = savedOrder;
          
          // Reload updated data
          const [orders, inventory] = await Promise.all([
            dbManager.getTodayOrders(),
            dbManager.getAll('inventory')
          ]);
          dispatch({ type: ACTIONS.SET_ORDERS, payload: orders });
          dispatch({ type: ACTIONS.SET_INVENTORY, payload: inventory });
          break;

        case ACTIONS.UPDATE_TABLE_STATUS:
          // Save table status to database
          await dbManager.updateTableStatus(
            action.payload.tableId, 
            action.payload.status, 
            action.payload.orderData
          );
          break;

        case ACTIONS.UPDATE_INVENTORY:
          // Update inventory in database
          for (const [itemId, newStock] of Object.entries(action.payload)) {
            if (typeof newStock === 'number') {
              await dbManager.updateInventoryStock(parseInt(itemId), newStock);
            }
          }
          break;

        default:
          // For non-database actions, just dispatch normally
          break;
      }
      
      // Always dispatch to local state
      dispatch(action);
      
    } catch (error) {
      console.error('❌ Database operation failed:', error);
      // Still dispatch to local state even if database fails
      dispatch(action);
    }
  };

  // Database utility functions
  const dbUtils = {
    // Export data
    exportTodayData: async () => {
      const today = new Date().toISOString().split('T')[0];
      return await dbManager.exportDailyData(today);
    },

    exportAllData: async () => {
      return await dbManager.exportAllData();
    },

    // Get reports
    getTodayReport: async () => {
      const report = await dbManager.getTodayReport();
      dispatch({ type: ACTIONS.SET_DAILY_REPORT, payload: report });
      return report;
    },

    // Refresh data from database
    refreshData: async () => {
      await loadDataFromDatabase();
      dispatch({ type: ACTIONS.UPDATE_LAST_SYNC });
    },

    // Get database statistics
    getStats: async () => {
      const [orders, inventory, tables] = await Promise.all([
        dbManager.getTodayOrders(),
        dbManager.getLowStockItems(),
        dbManager.getAll('tables')
      ]);

      return {
        todayOrders: orders.length,
        todayRevenue: orders.reduce((sum, order) => sum + order.total, 0),
        lowStockItems: inventory.length,
        occupiedTables: tables.filter(t => t.status === 'occupied').length,
        totalTables: tables.length
      };
    },

    // Settings management
    getSetting: async (key) => {
      return await dbManager.getSetting(key);
    },

    updateSetting: async (key, value, description = '') => {
      return await dbManager.updateSetting(key, value, description);
    },

    // Maintenance
    clearOldData: async (daysToKeep = 90) => {
      return await dbManager.clearOldData(daysToKeep);
    }
  };

  const value = {
    state,
    dispatch: enhancedDispatch,
    dbManager,
    dbUtils,
    isOnline: state.dbStatus === 'connected'
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );


const loadMenuItems = () => {
    try {
      const savedItems = localStorage.getItem('hotel_menu_items');
      if (savedItems) {
        const parsed = JSON.parse(savedItems);
        dispatch({ type: ACTIONS.SET_MENU_ITEMS, payload: parsed });
      }
    } catch (error) {
      console.error('Failed to load menu items:', error);
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
  };

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext;