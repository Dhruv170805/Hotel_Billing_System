// Menu items and categories for theRestaurant billing system
export const categories = ['All', 'Main Course', 'Starters', 'Beverages', 'Desserts'];

export const menuItems = [
  // Main Course
  {
    id: 1,
    name: 'Butter Masla',
    category: 'Main Course',
    price: 449,
    description: 'Creamy tomato-based Masla curry with aromatic spices',
    prepTime: 25,
    isVegetarian: false,
    isSpicy: true,
    ingredients: ['Masla', 'tomato', 'cream', 'butter', 'spices']
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
    ingredients: ['rice', 'Masla', 'saffron', 'spices']
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
    ingredients: ['black lentils', 'butter', 'cream', 'spices']
  },
  {
    id: 4,
    name: 'Paneer Butter Masala',
    category: 'Main Course',
    price: 349,
    description: 'Cottage cheese cubes in rich tomato and butter gravy',
    prepTime: 20,
    isVegetarian: true,
    isSpicy: false,
    ingredients: ['paneer', 'tomato', 'butter', 'cream', 'spices']
  },
  {
    id: 5,
    name: 'Fish Curry',
    category: 'Main Course',
    price: 399,
    description: 'Fresh fish cooked in coconut-based spicy curry',
    prepTime: 30,
    isVegetarian: false,
    isSpicy: true,
    ingredients: ['fish', 'coconut', 'curry leaves', 'spices']
  },

  // Starters
  {
    id: 6,
    name: 'Paneer Tikka',
    category: 'Starters',
    price: 279,
    description: 'Grilled cottage cheese marinated in yogurt and spices',
    prepTime: 15,
    isVegetarian: true,
    isSpicy: true,
    ingredients: ['paneer', 'yogurt', 'spices']
  },
  {
    id: 7,
    name: 'Masla Wings',
    category: 'Starters',
    price: 319,
    description: 'Spicy marinated Masla wings grilled to perfection',
    prepTime: 20,
    isVegetarian: false,
    isSpicy: true,
    ingredients: ['Masla wings', 'marinade', 'spices']
  },
  {
    id: 8,
    name: 'Vegetable Spring Rolls',
    category: 'Starters',
    price: 199,
    description: 'Crispy rolls filled with fresh vegetables and herbs',
    prepTime: 12,
    isVegetarian: true,
    isSpicy: false,
    ingredients: ['vegetables', 'wrapper', 'herbs']
  },
  {
    id: 9,
    name: 'Fish Fingers',
    category: 'Starters',
    price: 349,
    description: 'Crispy fried fish strips with tangy dipping sauce',
    prepTime: 15,
    isVegetarian: false,
    isSpicy: false,
    ingredients: ['fish', 'breadcrumbs', 'herbs']
  },
  {
    id: 10,
    name: 'Mutton Seekh Kebab',
    category: 'Starters',
    price: 389,
    description: 'Spiced minced mutton grilled on skewers',
    prepTime: 18,
    isVegetarian: false,
    isSpicy: true,
    ingredients: ['mutton', 'spices', 'herbs']
  },

  // Beverages
  {
    id: 11,
    name: 'Fresh Lime Water',
    category: 'Beverages',
    price: 79,
    description: 'Refreshing lime water with mint and black salt',
    prepTime: 5,
    isVegetarian: true,
    isSpicy: false,
    ingredients: ['lime', 'mint', 'black salt', 'water']
  },
  {
    id: 12,
    name: 'Mango Lassi',
    category: 'Beverages',
    price: 149,
    description: 'Creamy yogurt drink blended with sweet mangoes',
    prepTime: 7,
    isVegetarian: true,
    isSpicy: false,
    ingredients: ['yogurt', 'mango', 'sugar', 'cardamom']
  },
  {
    id: 13,
    name: 'Masala Chai',
    category: 'Beverages',
    price: 59,
    description: 'Traditional Indian tea with aromatic spices',
    prepTime: 10,
    isVegetarian: true,
    isSpicy: false,
    ingredients: ['tea', 'milk', 'spices', 'sugar']
  },
  {
    id: 14,
    name: 'Cold Coffee',
    category: 'Beverages',
    price: 129,
    description: 'Chilled coffee with ice cream and chocolate syrup',
    prepTime: 8,
    isVegetarian: true,
    isSpicy: false,
    ingredients: ['coffee', 'milk', 'ice cream', 'chocolate']
  },
  {
    id: 15,
    name: 'Fresh Orange Juice',
    category: 'Beverages',
    price: 119,
    description: 'Freshly squeezed orange juice without preservatives',
    prepTime: 5,
    isVegetarian: true,
    isSpicy: false,
    ingredients: ['oranges']
  },

  // Desserts
  {
    id: 16,
    name: 'Gulab Jamun',
    category: 'Desserts',
    price: 149,
    description: 'Soft milk dumplings in cardamom-flavored sugar syrup',
    prepTime: 5,
    isVegetarian: true,
    isSpicy: false,
    ingredients: ['milk powder', 'sugar syrup', 'cardamom']
  },
  {
    id: 17,
    name: 'Kulfi',
    category: 'Desserts',
    price: 99,
    description: 'Traditional Indian ice cream with cardamom and pistachios',
    prepTime: 3,
    isVegetarian: true,
    isSpicy: false,
    ingredients: ['milk', 'cardamom', 'pistachios', 'sugar']
  },
  {
    id: 18,
    name: 'Chocolate Brownie',
    category: 'Desserts',
    price: 179,
    description: 'Warm chocolate brownie served with vanilla ice cream',
    prepTime: 8,
    isVegetarian: true,
    isSpicy: false,
    ingredients: ['chocolate', 'flour', 'butter', 'vanilla ice cream']
  },
  {
    id: 19,
    name: 'Rasmalai',
    category: 'Desserts',
    price: 169,
    description: 'Cottage cheese dumplings in sweetened cardamom milk',
    prepTime: 5,
    isVegetarian: true,
    isSpicy: false,
    ingredients: ['paneer', 'milk', 'sugar', 'cardamom', 'pistachios']
  },
  {
    id: 20,
    name: 'Ice Cream Sundae',
    category: 'Desserts',
    price: 139,
    description: 'Assorted ice cream with chocolate sauce and nuts',
    prepTime: 5,
    isVegetarian: true,
    isSpicy: false,
    ingredients: ['ice cream', 'chocolate sauce', 'nuts', 'cherry']
  },

  // Additional items
  {
    id: 21,
    name: 'Garlic Naan',
    category: 'Main Course',
    price: 60,
    description: 'Soft Indian bread topped with garlic and herbs',
    prepTime: 10,
    isVegetarian: true,
    isSpicy: false,
    ingredients: ['flour', 'garlic', 'butter', 'herbs']
  }
];

export default menuItems;

