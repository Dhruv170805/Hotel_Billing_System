// Orders management custom hook
import { useAppContext, ACTIONS } from '..AppContext/context/AppContext';
import { printCustomerBill } from '..printUtils/utils/printUtils';
import { calculateBillingAmounts } from '..calculations/utils/calculations';
import { useInventory } from './useInventory';
import { useCart } from './useCart';

export const useOrders = () => {
  const { state, dispatch } = useAppContext();
  const { orders } = state;
  const { updateStock } = useInventory();
  const { clearCart } = useCart();

  // Process payment and create order
  const processPayment = (paymentMethod, tableId, cart) => {
    const orderId = Date.now();
    const billingAmounts = calculateBillingAmounts(cart);
    
    const newOrder = {
      id: orderId,
      tableId,
      items: cart,
      ...billingAmounts,
      paymentMethod,
      timestamp: new Date(),
      status: 'completed'
    };

    // Add order to list
    dispatch({
      type: ACTIONS.ADD_ORDER,
      payload: newOrder
    });

    // Update inventory
    updateStock(cart);

    // Update table status
    dispatch({
      type: ACTIONS.UPDATE_TABLE_STATUS,
      payload: {
        tableId,
        status: 'available',
        orderData: { currentOrder: null, totalAmount: 0 }
      }
    });

    // Update last sync time
    dispatch({
      type: ACTIONS.UPDATE_LAST_SYNC
    });

    // Print customer bill
    printCustomerBill(newOrder);

    // Clear cart
    clearCart();

    alert(`Payment of ₹${billingAmounts.total.toFixed(2)} processed successfully via ${paymentMethod}!`);

    return newOrder;
  };

  // Get recent orders
  const getRecentOrders = (limit = 10) => {
    return orders.slice(0, limit);
  };

  // Get orders by date range
  const getOrdersByDateRange = (startDate, endDate) => {
    return orders.filter(order => {
      const orderDate = order.timestamp.toISOString().split('T')[0];
      return orderDate >= startDate && orderDate <= endDate;
    });
  };

  // Get order statistics
  const getOrderStats = () => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalOrders,
      totalRevenue,
      avgOrderValue
    };
  };

  // Get popular items from all orders
  const getPopularItems = (limit = 5) => {
    const itemStats = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        itemStats[item.name] = (itemStats[item.name] || 0) + item.quantity;
      });
    });
    
    return Object.entries(itemStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit);
  };

  // Get orders by table
  const getOrdersByTable = (tableId) => {
    return orders.filter(order => order.tableId === tableId);
  };

  // Get orders by payment method
  const getOrdersByPaymentMethod = () => {
    const paymentStats = {};
    
    orders.forEach(order => {
      paymentStats[order.paymentMethod] = (paymentStats[order.paymentMethod] || 0) + 1;
    });
    
    return paymentStats;
  };

  // Get daily revenue
  const getDailyRevenue = () => {
    const dailyRevenue = {};
    
    orders.forEach(order => {
      const date = order.timestamp.toDateString();
      dailyRevenue[date] = (dailyRevenue[date] || 0) + order.total;
    });
    
    return Object.entries(dailyRevenue);
  };

  return {
    orders,
    processPayment,
    getRecentOrders,
    getOrdersByDateRange,
    getOrderStats,
    getPopularItems,
    getOrdersByTable,
    getOrdersByPaymentMethod,
    getDailyRevenue
  };
};

export default useOrders;
