// Database schema and structure forRestaurant billing system
export const DATABASE_CONFIG = {
  name: 'HotelBillingDB',
  version: 1,
  stores: {
    orders: 'orders',
    inventory: 'inventory', 
    tables: 'tables',
    dailyReports: 'dailyReports',
    menuItems: 'menuItems',
    customers: 'customers',
    staff: 'staff',
    settings: 'settings'
  }
};

// Database Schema Definitions
export const SCHEMAS = {
  // Orders table - stores all transactions
  orders: {
    id: 'string', // primary key - timestamp + random
    orderId: 'string', // display order number
    tableId: 'number',
    items: 'array', // [{id, name, price, quantity, category}]
    subtotal: 'number',
    gst: 'number', 
    total: 'number',
    paymentMethod: 'string', // cash, card, upi, wallet, banking
    status: 'string', // pending, completed, cancelled
    timestamp: 'date',
    date: 'string', // YYYY-MM-DD for daily queries
    customerName: 'string',
    customerPhone: 'string',
    staffId: 'string',
    notes: 'string',
    printedKitchen: 'boolean',
    printedCustomer: 'boolean'
  },

  // Inventory table - real-time stock management  
  inventory: {
    id: 'number', // primary key - menu item id
    itemName: 'string',
    category: 'string',
    currentStock: 'number',
    minStock: 'number', 
    maxStock: 'number',
    unit: 'string', // portions, pieces, glasses, etc
    costPrice: 'number',
    sellingPrice: 'number',
    supplier: 'string',
    lastUpdated: 'date',
    lastRestocked: 'date',
    expiryDate: 'date'
  },

  // Tables table - table management
  tables: {
    id: 'number', // primary key - table number
    status: 'string', // available, occupied, reserved, maintenance
    currentOrderId: 'string',
    totalAmount: 'number',
    occupiedSince: 'date',
    customerCount: 'number',
    lastCleaned: 'date',
    notes: 'string'
  },

  // Daily Reports table - daily summaries
  dailyReports: {
    date: 'string', // primary key - YYYY-MM-DD
    totalRevenue: 'number',
    totalOrders: 'number', 
    avgOrderValue: 'number',
    paymentMethods: 'object', // {cash: 150, card: 200, upi: 300}
    popularItems: 'array', // [{name, quantity}]
    hourlyData: 'array', // [{hour: 14, orders: 5, revenue: 2500}]
    tableOccupancy: 'number', // percentage
    inventoryAlerts: 'array', // low stock items
    staffOnDuty: 'array',
    generatedAt: 'date'
  },

  // Menu Items table - complete menu management
  menuItems: {
    id: 'number', // primary key
    name: 'string',
    category: 'string',
    price: 'number',
    description: 'string',
    ingredients: 'array',
    prepTime: 'number',
    isVegetarian: 'boolean',
    isSpicy: 'boolean', 
    isAvailable: 'boolean',
    image: 'string', // base64 or URL
    calories: 'number',
    allergens: 'array'
  },

  // Customers table - customer management
  customers: {
    id: 'string', // primary key
    name: 'string',
    phone: 'string',
    email: 'string',
    totalOrders: 'number',
    totalSpent: 'number',
    lastVisit: 'date',
    favoriteItems: 'array',
    preferences: 'object', // {spicy: true, vegetarian: false}
    loyaltyPoints: 'number'
  },

  // Staff table - staff management
  staff: {
    id: 'string', // primary key
    name: 'string',
    role: 'string', // admin, waiter, kitchen, cashier
    phone: 'string',
    email: 'string',
    joinDate: 'date',
    isActive: 'boolean',
    permissions: 'array', // ['orders', 'inventory', 'reports']
    lastLogin: 'date'
  },

  // Settings table - app configuration
  settings: {
    key: 'string', // primary key
    value: 'any',
    description: 'string',
    updatedAt: 'date'
  }
};

// Sample Initial Data
export const INITIAL_DATA = {
  menuItems: [
    {
      id: 1,
      name: 'Butter Masla',
      category: 'Main Course',
      price: 449,
      description: 'Creamy tomato-based Masla curry with aromatic spices',
      ingredients: ['Masla', 'tomato', 'cream', 'butter', 'spices'],
      prepTime: 25,
      isVegetarian: false,
      isSpicy: true,
      isAvailable: true,
      calories: 650,
      allergens: ['dairy', 'nuts']
    },
    {
      id: 2,
      name: 'Biryani',
      category: 'Main Course',
      price: 379,
      description: 'Fragrant basmati rice with tender meat and aromatic spices',
      ingredients: ['rice', 'Masla', 'saffron', 'spices'],
      prepTime: 35,
      isVegetarian: false,
      isSpicy: true,
      isAvailable: true,
      calories: 750,
      allergens: ['nuts']
    },
    {
      id: 3,
      name: 'Dal Makhani',
      category: 'Main Course', 
      price: 299,
      description: 'Creamy black lentils slow-cooked with butter and spices',
      ingredients: ['black lentils', 'butter', 'cream', 'spices'],
      prepTime: 20,
      isVegetarian: true,
      isSpicy: false,
      isAvailable: true,
      calories: 480,
      allergens: ['dairy']
    },
    {
      id: 4,
      name: 'Paneer Tikka',
      category: 'Starters',
      price: 279,
      description: 'Grilled cottage cheese marinated in yogurt and spices',
      ingredients: ['paneer', 'yogurt', 'spices'],
      prepTime: 15,
      isVegetarian: true,
      isSpicy: true,
      isAvailable: true,
      calories: 380,
      allergens: ['dairy']
    },
    {
      id: 5,
      name: 'Mango Lassi',
      category: 'Beverages',
      price: 149,
      description: 'Creamy yogurt drink blended with sweet mangoes',
      ingredients: ['yogurt', 'mango', 'sugar', 'cardamom'],
      prepTime: 7,
      isVegetarian: true,
      isSpicy: false,
      isAvailable: true,
      calories: 280,
      allergens: ['dairy']
    },
    {
      id: 6,
      name: 'Gulab Jamun',
      category: 'Desserts',
      price: 149,
      description: 'Soft milk dumplings in cardamom-flavored sugar syrup',
      ingredients: ['milk powder', 'sugar syrup', 'cardamom'],
      prepTime: 5,
      isVegetarian: true,
      isSpicy: false,
      isAvailable: true,
      calories: 350,
      allergens: ['dairy', 'nuts']
    }
  ],

  inventory: [
    { id: 1, itemName: 'Butter Masla', category: 'Main Course', currentStock: 50, minStock: 10, maxStock: 100, unit: 'portions', costPrice: 200, sellingPrice: 449, supplier: 'Fresh Foods Ltd', lastUpdated: new Date(), lastRestocked: new Date(), expiryDate: null },
    { id: 2, itemName: 'Biryani', category: 'Main Course', currentStock: 30, minStock: 8, maxStock: 60, unit: 'portions', costPrice: 150, sellingPrice: 379, supplier: 'Spice Palace', lastUpdated: new Date(), lastRestocked: new Date(), expiryDate: null },
    { id: 3, itemName: 'Dal Makhani', category: 'Main Course', currentStock: 40, minStock: 15, maxStock: 80, unit: 'portions', costPrice: 100, sellingPrice: 299, supplier: 'Local Vendors', lastUpdated: new Date(), lastRestocked: new Date(), expiryDate: null },
    { id: 4, itemName: 'Paneer Tikka', category: 'Starters', currentStock: 35, minStock: 12, maxStock: 70, unit: 'portions', costPrice: 120, sellingPrice: 279, supplier: 'Dairy Fresh', lastUpdated: new Date(), lastRestocked: new Date(), expiryDate: null },
    { id: 5, itemName: 'Mango Lassi', category: 'Beverages', currentStock: 25, minStock: 15, maxStock: 60, unit: 'glasses', costPrice: 50, sellingPrice: 149, supplier: 'Fruit Express', lastUpdated: new Date(), lastRestocked: new Date(), expiryDate: new Date('2024-12-31') },
    { id: 6, itemName: 'Gulab Jamun', category: 'Desserts', currentStock: 40, minStock: 20, maxStock: 80, unit: 'pieces', costPrice: 60, sellingPrice: 149, supplier: 'Sweet House', lastUpdated: new Date(), lastRestocked: new Date(), expiryDate: new Date('2024-11-30') }
  ],

  tables: Array.from({length: 10}, (_, i) => ({
    id: i + 1,
    status: i < 3 ? 'occupied' : 'available', // First 3 tables occupied for demo
    currentOrderId: i < 3 ? `order_${Date.now() + i}` : null,
    totalAmount: i < 3 ? Math.random() * 500 + 200 : 0,
    occupiedSince: i < 3 ? new Date(Date.now() - Math.random() * 3600000) : null,
    customerCount: i < 3 ? Math.floor(Math.random() * 4) + 1 : 0,
    lastCleaned: new Date(),
    notes: ''
  })),

  settings: [
    { key: 'restaurantName', value: 'Hotel Restaurant', description: 'Restaurant name for bills' },
    { key: 'gstRate', value: 0.18, description: 'GST rate (18%)' },
    { key: 'gstNumber', value: '07AABCU9603R1ZM', description: 'GST registration number' },
    { key: 'address', value: '123 Main Street, City, State - 123456', description: 'Restaurant address' },
    { key: 'phone', value: '+91 98765 43210', description: 'Contact phone number' },
    { key: 'email', value: 'info@hotelrestaurant.com', description: 'Contact email' },
    { key: 'currency', value: '₹', description: 'Currency symbol' },
    { key: 'timezone', value: 'Asia/Kolkata', description: 'Restaurant timezone' }
  ]
};

export default { DATABASE_CONFIG, SCHEMAS, INITIAL_DATA };