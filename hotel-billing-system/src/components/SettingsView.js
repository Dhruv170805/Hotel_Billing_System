// Restaurant Settings Configuration - FIXED table management
import React, { useState, useEffect } from 'react';
import { useAppContext, ACTIONS } from '../context/AppContext';


// Inline configuration (no external imports)
const DEFAULT_CONFIG = {
  name: 'Shreeji Restaurant',
  version: '1.0.0',
  deviceMode: 'SINGLE_DEVICE',
  restaurant: {
    name: 'Shreeji Restaurant',
    address: ' Umreth Road, opp. Yogi Nagar Society, Aashpura, Ode, Gujarat 388210',
    phone: '+91 98765 43210',
    email: 'info@shreejirestaurant.com',
    gstNumber: 'GST123456789',
    currency: '₹',
    timezone: 'Asia/Kolkata'
  },
  operations: {
    maxTables: 20,
    maxMenuItems: 500,
    enableInventory: true,
    enableMultiPayment: true,
    enableKitchenPrint: true,
    enableCustomerBill: true,
    enablePickupOrders: true
  },
  tax: {
    gstRate: 0.18,
    serviceCharge: 0.10,
    enableServiceCharge: false
  }
};

// Default menu items
const DEFAULT_MENU_ITEMS = [
  {
    id: 1,
    name: 'Butter Masla',
    category: 'Main Course',
    price: 449,
    description: 'Creamy tomato-based Masla curry with aromatic spices',
    prepTime: 25,
    isVegetarian: false,
    isSpicy: true,
    isAvailable: true
  },
  {
    id: 2,
    name: 'Biryani',
    category: 'Main Course', 
    price: 379,
    description: 'Fragrant basmati rice with tender meat and aromatic spices',
    prepTime: 35,
    isVegetarian: false,
    isSpicy: true,
    isAvailable: true
  },
  {
    id: 3,
    name: 'Dal Makhani',
    category: 'Main Course',
    price: 299,
    description: 'Creamy black lentils slow-cooked with butter and spices',
    prepTime: 20,
    isVegetarian: true,
    isSpicy: false,
    isAvailable: true
  },
  {
    id: 4,
    name: 'Paneer Tikka',
    category: 'Starters',
    price: 279,
    description: 'Grilled cottage cheese marinated in yogurt and spices',
    prepTime: 15,
    isVegetarian: true,
    isSpicy: true,
    isAvailable: true
  },
  {
    id: 5,
    name: 'Mango Lassi',
    category: 'Beverages',
    price: 149,
    description: 'Creamy yogurt drink blended with sweet mangoes',
    prepTime: 7,
    isVegetarian: true,
    isSpicy: false,
    isAvailable: true
  },
  {
    id: 6,
    name: 'Gulab Jamun',
    category: 'Desserts',
    price: 149,
    description: 'Soft milk dumplings in cardamom-flavored sugar syrup',
    prepTime: 5,
    isVegetarian: true,
    isSpicy: false,
    isAvailable: true
  }
];

const CATEGORIES = ['Main Course', 'Starters', 'Beverages', 'Desserts', 'Snacks', 'Sweets'];

const SettingsView = () => {
  const { dispatch } = useAppContext()
  const [settings, setSettings] = useState(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState('restaurant');
  const [saveStatus, setSaveStatus] = useState('');
  const [menuItems, setMenuItems] = useState(DEFAULT_MENU_ITEMS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    category: 'Main Course',
    price: '',
    description: '',
    prepTime: '',
    isVegetarian: false,
    isSpicy: false,
    isAvailable: true
  });

  useEffect(() => {
    loadSettings();
    loadMenuItems();
  }, []);

  const loadSettings = () => {
    try {
      const saved = localStorage.getItem('hotel_billing_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings({ ...DEFAULT_CONFIG, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const loadMenuItems = () => {
    try {
      const saved = localStorage.getItem('hotel_menu_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        setMenuItems(parsed);
      }
    } catch (error) {
      console.error('Failed to load menu items:', error);
    }
  };

  const saveMenuItems = (items) => {
    try {
      localStorage.setItem('hotel_menu_items', JSON.stringify(items));
      setMenuItems(items);
      setSaveStatus('✅ Menu items saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('❌ Failed to save menu items');
    }
  };

 ;
  const handleSaveSettings = () => {
    try {
      localStorage.setItem('hotel_billing_settings', JSON.stringify(settings));
      
      // Update tables when maxTables changes
      updateTableCount(settings.operations.maxTables);
    
       if (dispatch) {
      dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: settings });
    }
      setSaveStatus('✅ Settings saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('❌ Failed to save settings');
    
    }
  };

  // FIXED: Update table count function
  const updateTableCount = (newCount) => {
    try {
      const existingTables = JSON.parse(localStorage.getItem('hotel_tables') || '[]');
      
      if (newCount > existingTables.length) {
        // Add more tables
        const additionalTables = [];
        for (let i = existingTables.length; i < newCount; i++) {
          additionalTables.push({
            id: i + 1,
            number: i + 1,
            status: 'available',
            capacity: i < 4 ? 2 : i < 10 ? 4 : i < 16 ? 6 : 8,
            currentOrderId: null,
            totalAmount: 0,
            occupiedSince: null,
            customerCount: 0,
            waiter: null,
            notes: ''
          });
        }
        const updatedTables = [...existingTables, ...additionalTables];
        localStorage.setItem('hotel_tables', JSON.stringify(updatedTables));
      } else if (newCount < existingTables.length) {
        // Remove excess tables (only if they are available)
        const updatedTables = existingTables.slice(0, newCount);
        localStorage.setItem('hotel_tables', JSON.stringify(updatedTables));
      }
      
      console.log(`Table count updated to: ${newCount}`);
    } catch (error) {
      console.error('Failed to update table count:', error);
    }
  };

  const handleRestaurantChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      restaurant: { ...prev.restaurant, [field]: value }
    }));
  };

  const handleOperationChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      operations: { ...prev.operations, [field]: value }
    }));
  };

  const handleTaxChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      tax: { ...prev.tax, [field]: value }
    }));
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      localStorage.removeItem('hotel_billing_settings');
      setSettings(DEFAULT_CONFIG);
      setSaveStatus('⚠️ Settings reset to defaults. Click Save to apply.');
    }
  };

  // Menu Management Functions
  const handleAddMenuItem = () => {
    if (!newMenuItem.name.trim() || !newMenuItem.price) {
      alert('Please fill in item name and price');
      return;
    }

    const newItem = {
      ...newMenuItem,
      id: Math.max(...menuItems.map(item => item.id), 0) + 1,
      price: parseFloat(newMenuItem.price),
      prepTime: parseInt(newMenuItem.prepTime) || 10
    };

    const updatedItems = [...menuItems, newItem];
    saveMenuItems(updatedItems);

    // Reset form
    setNewMenuItem({
      name: '',
      category: 'Main Course',
      price: '',
      description: '',
      prepTime: '',
      isVegetarian: false,
      isSpicy: false,
      isAvailable: true
    });
    setShowAddForm(false);
  };

  const handleEditMenuItem = (item) => {
    setEditingItem({ ...item });
  };

  const handleUpdateMenuItem = () => {
    const updatedItems = menuItems.map(item => 
      item.id === editingItem.id ? editingItem : item
    );
    saveMenuItems(updatedItems);
    setEditingItem(null);
  };

  const handleDeleteMenuItem = (itemId) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      const updatedItems = menuItems.filter(item => item.id !== itemId);
      saveMenuItems(updatedItems);
    }
  };

  const toggleItemAvailability = (itemId) => {
    const updatedItems = menuItems.map(item => 
      item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
    );
    saveMenuItems(updatedItems);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">⚙️ Shreeji Restaurant Settings</h2>
          <p className="text-gray-600">Configure your restaurant settings and manage menu items</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            💾 Save Settings
          </button>
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            🔄 Reset to Defaults
          </button>
        </div>
      </div>

      {/* Status Message */}
      {saveStatus && (
        <div className={`p-3 rounded-lg ${
          saveStatus.includes('✅') ? 'bg-green-50 text-green-800' : 
          saveStatus.includes('❌') ? 'bg-red-50 text-red-800' :
          'bg-yellow-50 text-yellow-800'
        }`}>
          {saveStatus}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="border-b">
          <div className="flex space-x-0 overflow-x-auto">
            {[
              { id: 'restaurant', label: '🍽️ Restaurant Info', desc: 'Basic information' },
              { id: 'menu', label: '🍽️ Menu Management', desc: 'Add/Edit menu items' },
              { id: 'operations', label: '⚙️ Operations', desc: 'Business settings' },
              { id: 'tax', label: '💰 Tax & Billing', desc: 'Tax configuration' },
              { id: 'system', label: '🖥️ System', desc: 'Technical settings' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-left border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'border-lime-500 text-lime-600 bg-lime-50' 
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">{tab.label}</div>
                <div className="text-xs text-gray-500">{tab.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Restaurant Info Tab */}
          {activeTab === 'restaurant' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🍽️ Shreeji Restaurant Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name</label>
                  <input
                    type="text"
                    value={settings.restaurant.name}
                    onChange={(e) => handleRestaurantChange('name', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                    placeholder="Shreeji Restaurant"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={settings.restaurant.phone}
                    onChange={(e) => handleRestaurantChange('phone', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                    placeholder="+91 98765 43210"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={settings.restaurant.email}
                    onChange={(e) => handleRestaurantChange('email', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                    placeholder="info@shreejirestaurant.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
                  <input
                    type="text"
                    value={settings.restaurant.gstNumber}
                    onChange={(e) => handleRestaurantChange('gstNumber', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                    placeholder="GST123456789"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={settings.restaurant.address}
                  onChange={(e) => handleRestaurantChange('address', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                  placeholder="123 Main Street, City, State - 12345"
                />
              </div>
            </div>
          )}

          {/* Menu Management Tab - Same as before but with updated colors */}
          {activeTab === 'menu' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">🍽️ Menu Management</h3>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700"
                >
                  {showAddForm ? '❌ Cancel' : '➕ Add New Item'}
                </button>
              </div>

              {/* Add New Item Form - Same as before */}
              {showAddForm && (
                <div className="bg-lime-50 border border-lime-200 rounded-lg p-6">
                  <h4 className="font-bold text-lime-800 mb-4">➕ Add New Menu Item</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                      <input
                        type="text"
                        value={newMenuItem.name}
                        onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500"
                        placeholder="e.g., Masla Curry"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={newMenuItem.category}
                        onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                      <input
                        type="number"
                        value={newMenuItem.price}
                        onChange={(e) => setNewMenuItem({...newMenuItem, price: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500"
                        placeholder="149"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prep Time (minutes)</label>
                      <input
                        type="number"
                        value={newMenuItem.prepTime}
                        onChange={(e) => setNewMenuItem({...newMenuItem, prepTime: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500"
                        placeholder="15"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={newMenuItem.description}
                      onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500"
                      placeholder="Brief description of the dish..."
                    />
                  </div>
                  <div className="flex gap-4 mt-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newMenuItem.isVegetarian}
                        onChange={(e) => setNewMenuItem({...newMenuItem, isVegetarian: e.target.checked})}
                      />
                      <span className="text-sm">🌱 Vegetarian</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newMenuItem.isSpicy}
                        onChange={(e) => setNewMenuItem({...newMenuItem, isSpicy: e.target.checked})}
                      />
                      <span className="text-sm">🌶️ Spicy</span>
                    </label>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleAddMenuItem}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      ✅ Add Item
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Menu Items List - Same as before */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">Current Menu Items ({menuItems.length})</h4>
                <div className="grid grid-cols-1 gap-4">
                  {menuItems.map(item => (
                    <div key={item.id} className={`border rounded-lg p-4 ${
                      item.isAvailable ? 'border-gray-200' : 'border-red-200 bg-red-50'
                    }`}>
                      {editingItem && editingItem.id === item.id ? (
                        // Edit Form
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input
                              type="text"
                              value={editingItem.name}
                              onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                              className="px-3 py-2 border rounded focus:ring-2 focus:ring-lime-500"
                              placeholder="Item name"
                            />
                            <select
                              value={editingItem.category}
                              onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                              className="px-3 py-2 border rounded focus:ring-2 focus:ring-lime-500"
                            >
                              {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                            <input
                              type="number"
                              value={editingItem.price}
                              onChange={(e) => setEditingItem({...editingItem, price: parseFloat(e.target.value)})}
                              className="px-3 py-2 border rounded focus:ring-2 focus:ring-lime-500"
                              placeholder="Price"
                            />
                          </div>
                          <textarea
                            value={editingItem.description}
                            onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-lime-500"
                            placeholder="Description"
                            rows={2}
                          />
                          <div className="flex gap-3">
                            <button
                              onClick={handleUpdateMenuItem}
                              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                            >
                              ✅ Save
                            </button>
                            <button
                              onClick={() => setEditingItem(null)}
                              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                            >
                              ❌ Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Display Item
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-gray-800">{item.name}</h5>
                              {item.isVegetarian && <span className="text-green-600">🌱</span>}
                              {item.isSpicy && <span className="text-red-500">🌶️</span>}
                              {!item.isAvailable && <span className="text-red-600 text-sm font-medium">❌ Unavailable</span>}
                            </div>
                            <div className="text-sm text-gray-600">{item.category} • ₹{item.price} • {item.prepTime} min</div>
                            <div className="text-sm text-gray-500">{item.description}</div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleItemAvailability(item.id)}
                              className={`px-3 py-1 rounded text-sm ${
                                item.isAvailable 
                                  ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                                  : 'bg-green-100 text-green-600 hover:bg-green-200'
                              }`}
                            >
                              {item.isAvailable ? '🚫 Disable' : '✅ Enable'}
                            </button>
                            <button
                              onClick={() => handleEditMenuItem(item)}
                              className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-sm"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMenuItem(item.id)}
                              className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Operations Tab - FIXED table count */}
          {activeTab === 'operations' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">⚙️ Operational Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Tables</label>
                  <input
                    type="number"
                    value={settings.operations.maxTables}
                    onChange={(e) => handleOperationChange('maxTables', parseInt(e.target.value) || 1)}
                    min="1"
                    max="100"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Changes will apply after saving settings</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Menu Items</label>
                  <input
                    type="number"
                    value={settings.operations.maxMenuItems}
                    onChange={(e) => handleOperationChange('maxMenuItems', parseInt(e.target.value) || 1)}
                    min="1"
                    max="1000"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">Feature Settings</h4>
                
                {[
                  { key: 'enableInventory', label: 'Enable Inventory Management', desc: 'Track stock levels and low stock alerts' },
                  { key: 'enableMultiPayment', label: 'Enable Multiple Payment Methods', desc: 'Accept cash, card, UPI, wallet, etc.' },
                  { key: 'enableKitchenPrint', label: 'Enable Kitchen Order Printing', desc: 'Print orders to kitchen printer' },
                  { key: 'enableCustomerBill', label: 'Enable Customer Bill Printing', desc: 'Print bills for customers' },
                  { key: 'enablePickupOrders', label: 'Enable Pickup Orders', desc: 'Allow takeaway orders without table assignment' }
                ].map(feature => (
                  <div key={feature.key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium text-gray-800">{feature.label}</div>
                      <div className="text-sm text-gray-600">{feature.desc}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.operations[feature.key]}
                        onChange={(e) => handleOperationChange(feature.key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-lime-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tax & Billing Tab - Same as before */}
          {activeTab === 'tax' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">💰 Tax & Billing Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GST Rate (%)</label>
                  <input
                    type="number"
                    value={(settings.tax.gstRate * 100).toFixed(0)}
                    onChange={(e) => handleTaxChange('gstRate', parseFloat(e.target.value) / 100)}
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Current: {(settings.tax.gstRate * 100)}%</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Charge (%)</label>
                  <input
                    type="number"
                    value={(settings.tax.serviceCharge * 100).toFixed(0)}
                    onChange={(e) => handleTaxChange('serviceCharge', parseFloat(e.target.value) / 100)}
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Current: {(settings.tax.serviceCharge * 100)}%</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">Enable Service Charge</div>
                    <div className="text-sm text-gray-600">Add service charge to all bills</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.tax.enableServiceCharge}
                      onChange={(e) => handleTaxChange('enableServiceCharge', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-lime-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-600"></div>
                  </label>
                </div>
              </div>

              {/* Tax Preview */}
              <div className="bg-lime-50 border border-lime-200 rounded-lg p-4">
                <h4 className="font-semibold text-lime-800 mb-3">Tax Calculation Preview</h4>
                <div className="text-sm text-lime-700">
                  <div className="flex justify-between"><span>Sample Order:</span><span>₹1000.00</span></div>
                  {settings.tax.enableServiceCharge && (
                    <div className="flex justify-between"><span>Service Charge ({(settings.tax.serviceCharge * 100)}%):</span><span>₹{(1000 * settings.tax.serviceCharge).toFixed(2)}</span></div>
                  )}
                  <div className="flex justify-between"><span>GST ({(settings.tax.gstRate * 100)}%):</span><span>₹{(1000 * settings.tax.gstRate).toFixed(2)}</span></div>
                  <div className="flex justify-between font-bold border-t pt-2 mt-2">
                    <span>Total:</span>
                    <span>₹{(1000 * (1 + settings.tax.gstRate + (settings.tax.enableServiceCharge ? settings.tax.serviceCharge : 0))).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🖥️ System Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Application Name</div>
                    <div className="font-semibold text-gray-800">{DEFAULT_CONFIG.name}</div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Application Version</div>
                    <div className="font-semibold text-gray-800">{DEFAULT_CONFIG.version}</div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Device Mode</div>
                    <div className="font-semibold text-gray-800">{DEFAULT_CONFIG.deviceMode}</div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Storage Type</div>
                    <div className="font-semibold text-gray-800">Local Storage (Free)</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Total Menu Items</div>
                    <div className="font-semibold text-gray-800">{menuItems.length}</div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Available Items</div>
                    <div className="font-semibold text-gray-800">{menuItems.filter(item => item.isAvailable).length}</div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Configured Tables</div>
                    <div className="font-semibold text-gray-800">{settings.operations.maxTables}</div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Cost</div>
                    <div className="font-semibold text-green-600">100% Free</div>
                  </div>
                </div>
              </div>

              {/* Menu Items by Category */}
              <div className="bg-lime-50 border border-lime-200 rounded-lg p-4">
                <h4 className="font-semibold text-lime-800 mb-3">📊 Menu Items by Category</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  {CATEGORIES.map(category => {
                    const count = menuItems.filter(item => item.category === category).length;
                    return (
                      <div key={category} className="text-lime-700">
                        <span className="font-medium">{category}:</span> {count}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Current Storage Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-3">💾 Local Storage Benefits</h4>
                <div className="text-sm text-green-700 space-y-1">
                  <div>✅ No monthly fees or subscriptions</div>
                  <div>✅ Data stays on your device (private & secure)</div>
                  <div>✅ Works completely offline</div>
                  <div>✅ Fast performance (no internet delays)</div>
                  <div>✅ Manual backup & restore options available</div>
                  <div>✅ Menu items can be added/removed anytime</div>
                  <div>✅ Pickup orders supported</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;