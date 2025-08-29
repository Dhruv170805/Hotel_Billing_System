// Calculation utilities for theRestaurant billing system

// Calculate GST (18% standard rate)
export const calculateGST = (subtotal) => {
  return subtotal * 0.18;
};

// Calculate billing amounts
export const calculateBillingAmounts = (cartItems) => {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const gst = calculateGST(subtotal);
  const total = subtotal + gst;
  
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    gst: parseFloat(gst.toFixed(2)),
    total: parseFloat(total.toFixed(2))
  };
};

// Calculate analytics data for reporting
export const calculateAnalytics = (orders, dateRange) => {
  // Filter orders by date range
  const filteredOrders = orders.filter(order => {
    const orderDate = order.timestamp.toISOString().split('T')[0];
    return orderDate >= dateRange.startDate && orderDate <= dateRange.endDate;
  });

  // Calculate total revenue for the period
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  
  // Calculate total orders for the period
  const totalOrders = filteredOrders.length;
  
  // Calculate average order value
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calculate popular items for the period
  const itemStats = {};
  filteredOrders.forEach(order => {
    order.items.forEach(item => {
      itemStats[item.name] = (itemStats[item.name] || 0) + item.quantity;
    });
  });
  
  const popularItems = Object.entries(itemStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Calculate category-wise revenue
  const categoryStats = {};
  filteredOrders.forEach(order => {
    order.items.forEach(item => {
      categoryStats[item.category] = (categoryStats[item.category] || 0) + (item.price * item.quantity);
    });
  });

  const categoryRevenue = Object.entries(categoryStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 4);

  return {
    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    totalOrders,
    avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
    popularItems,
    categoryStats: categoryRevenue
  };
};

// Calculate profit margins (assuming 60% food cost)
export const calculateProfitMargin = (revenue) => {
  const foodCost = revenue * 0.6; // 60% food cost
  const profit = revenue - foodCost;
  const marginPercentage = (profit / revenue) * 100;
  
  return {
    revenue,
    foodCost: parseFloat(foodCost.toFixed(2)),
    profit: parseFloat(profit.toFixed(2)),
    marginPercentage: parseFloat(marginPercentage.toFixed(2))
  };
};

// Calculate inventory value
export const calculateInventoryValue = (inventory, menuItems) => {
  let totalValue = 0;
  
  menuItems.forEach(item => {
    const stock = inventory[item.id];
    if (stock) {
      totalValue += stock.stock * item.price;
    }
  });
  
  return parseFloat(totalValue.toFixed(2));
};

// Calculate table occupancy rate
export const calculateOccupancyRate = (tables) => {
  const occupiedTables = tables.filter(table => table.status === 'occupied').length;
  const totalTables = tables.length;
  const occupancyRate = (occupiedTables / totalTables) * 100;
  
  return {
    occupiedTables,
    totalTables,
    occupancyRate: parseFloat(occupancyRate.toFixed(2))
  };
};

export default {
  calculateGST,
  calculateBillingAmounts,
  calculateAnalytics,
  calculateProfitMargin,
  calculateInventoryValue,
  calculateOccupancyRate
};
