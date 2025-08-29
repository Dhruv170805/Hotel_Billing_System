// Initial data for tables and inventory
export const initialTables = [
  { id: 1, status: 'available', currentOrder: null, totalAmount: 0 },
  { id: 2, status: 'available', currentOrder: null, totalAmount: 0 },
  { id: 3, status: 'available', currentOrder: null, totalAmount: 0 },
  { id: 4, status: 'available', currentOrder: null, totalAmount: 0 },
  { id: 5, status: 'available', currentOrder: null, totalAmount: 0 },
  { id: 6, status: 'available', currentOrder: null, totalAmount: 0 },
  { id: 7, status: 'available', currentOrder: null, totalAmount: 0 },
  { id: 8, status: 'available', currentOrder: null, totalAmount: 0 },
  { id: 9, status: 'available', currentOrder: null, totalAmount: 0 },
  { id: 10, status: 'available', currentOrder: null, totalAmount: 0 }
];

export const initialInventory = {
  1: { stock: 50, minStock: 10, maxStock: 100, unit: 'portions' }, // Butter Masla
  2: { stock: 30, minStock: 8, maxStock: 60, unit: 'portions' },   // Biryani
  3: { stock: 40, minStock: 15, maxStock: 80, unit: 'portions' },  // Dal Makhani
  4: { stock: 25, minStock: 10, maxStock: 50, unit: 'portions' },  // Paneer Butter Masala
  5: { stock: 20, minStock: 5, maxStock: 40, unit: 'portions' },   // Fish Curry
  6: { stock: 35, minStock: 12, maxStock: 70, unit: 'portions' },  // Paneer Tikka
  7: { stock: 8, minStock: 10, maxStock: 50, unit: 'pieces' },     // Masla Wings (low stock)
  8: { stock: 45, minStock: 20, maxStock: 90, unit: 'pieces' },    // Veg Spring Rolls
  9: { stock: 30, minStock: 10, maxStock: 60, unit: 'pieces' },    // Fish Fingers
  10: { stock: 15, minStock: 8, maxStock: 40, unit: 'portions' },  // Mutton Seekh Kebab
  11: { stock: 100, minStock: 30, maxStock: 200, unit: 'glasses' }, // Fresh Lime Water
  12: { stock: 25, minStock: 15, maxStock: 60, unit: 'glasses' },   // Mango Lassi
  13: { stock: 80, minStock: 40, maxStock: 150, unit: 'cups' },     // Masala Chai
  14: { stock: 20, minStock: 12, maxStock: 50, unit: 'glasses' },   // Cold Coffee
  15: { stock: 35, minStock: 20, maxStock: 70, unit: 'glasses' },   // Fresh Orange Juice
  16: { stock: 40, minStock: 20, maxStock: 80, unit: 'pieces' },    // Gulab Jamun
  17: { stock: 25, minStock: 15, maxStock: 50, unit: 'pieces' },    // Kulfi
  18: { stock: 12, minStock: 8, maxStock: 30, unit: 'pieces' },     // Chocolate Brownie
  19: { stock: 18, minStock: 10, maxStock: 40, unit: 'pieces' },    // Rasmalai
  20: { stock: 22, minStock: 12, maxStock: 45, unit: 'portions' },  // Ice Cream Sundae
  21: { stock: 60, minStock: 25, maxStock: 120, unit: 'pieces' }    // Garlic Naan
};

export default { initialTables, initialInventory };
