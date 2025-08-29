// src/utils/defaultMenu.js

// Default menu items to initialize on first run
export const DEFAULT_MENU_ITEMS = [
  { id: 1, name: 'Butter Masla', category: 'Main Course', price: 449, prepTime: 25, isAvailable: true },
  { id: 2, name: 'Biryani',         category: 'Main Course', price: 379, prepTime: 35, isAvailable: true },
  { id: 3, name: 'Dal Makhani',     category: 'Main Course', price: 299, prepTime: 20, isAvailable: true },
  { id: 4, name: 'Paneer Tikka',    category: 'Starters',    price: 279, prepTime: 15, isAvailable: true },
  { id: 5, name: 'Mango Lassi',     category: 'Beverages',   price: 149, prepTime:  7, isAvailable: true },
  { id: 6, name: 'Gulab Jamun',     category: 'Desserts',    price: 149, prepTime:  5, isAvailable: true }
];

// Initialize or load menu items from localStorage
export function initializeMenuItems() {
  try {
    const saved = localStorage.getItem('hotel_menu_items');
    if (!saved) {
      localStorage.setItem('hotel_menu_items', JSON.stringify(DEFAULT_MENU_ITEMS));
      return DEFAULT_MENU_ITEMS;
    }
    return JSON.parse(saved);
  } catch (error) {
    console.error('Failed to initialize menu items:', error);
    return DEFAULT_MENU_ITEMS;
  }
}
