// Enhanced Export utilities with Excel and Chart generation
import * as XLSX from 'xlsx';

// Create Excel workbook with multiple sheets and charts
export const exportToExcel = (data, filename) => {
  try {
    // Create new workbook
    const wb = XLSX.utils.book_new();
    
    // Sheet 1: Orders Summary
    const ordersData = prepareOrdersData(data.orders || []);
    const ordersWs = XLSX.utils.json_to_sheet(ordersData);
    XLSX.utils.book_append_sheet(wb, ordersWs, "Orders");
    
    // Sheet 2: Daily Revenue
    const revenueData = prepareDailyRevenueData(data.orders || []);
    const revenueWs = XLSX.utils.json_to_sheet(revenueData);
    XLSX.utils.book_append_sheet(wb, revenueWs, "Daily Revenue");
    
    // Sheet 3: Popular Items
    const itemsData = preparePopularItemsData(data.orders || []);
    const itemsWs = XLSX.utils.json_to_sheet(itemsData);
    XLSX.utils.book_append_sheet(wb, itemsWs, "Popular Items");
    
    // Sheet 4: Payment Methods
    const paymentsData = preparePaymentMethodsData(data.orders || []);
    const paymentsWs = XLSX.utils.json_to_sheet(paymentsData);
    XLSX.utils.book_append_sheet(wb, paymentsWs, "Payment Methods");
    
    // Sheet 5: Hourly Sales
    const hourlyData = prepareHourlyData(data.orders || []);
    const hourlyWs = XLSX.utils.json_to_sheet(hourlyData);
    XLSX.utils.book_append_sheet(wb, hourlyWs, "Hourly Sales");
    
    // Sheet 6: Inventory Status
    if (data.inventory) {
      const inventoryData = prepareInventoryData(data.inventory);
      const inventoryWs = XLSX.utils.json_to_sheet(inventoryData);
      XLSX.utils.book_append_sheet(wb, inventoryWs, "Inventory");
    }
    
    // Generate and download Excel file
    XLSX.writeFile(wb, `${filename}.xlsx`);
    return true;
    
  } catch (error) {
    console.error('Excel export failed:', error);
    return false;
  }
};

// Prepare Orders data for Excel
const prepareOrdersData = (orders) => {
  return orders.map(order => ({
    'Order ID': order.orderId || `#${order.id.toString().slice(-6)}`,
    'Date': order.timestamp ? new Date(order.timestamp).toLocaleDateString() : 'N/A',
    'Time': order.timestamp ? new Date(order.timestamp).toLocaleTimeString() : 'N/A',
    'Table': order.tableId || 'N/A',
    'Items Count': order.items ? order.items.length : 0,
    'Subtotal': order.subtotal || 0,
    'GST (18%)': order.gst || 0,
    'Total Amount': order.total || 0,
    'Payment Method': order.paymentMethod || 'N/A',
    'Status': order.status || 'completed'
  }));
};

// Prepare Daily Revenue data
const prepareDailyRevenueData = (orders) => {
  const dailyRevenue = {};
  
  orders.forEach(order => {
    const date = order.timestamp ? new Date(order.timestamp).toLocaleDateString() : 'Unknown';
    if (!dailyRevenue[date]) {
      dailyRevenue[date] = {
        date: date,
        orders: 0,
        revenue: 0
      };
    }
    dailyRevenue[date].orders += 1;
    dailyRevenue[date].revenue += order.total || 0;
  });
  
  return Object.values(dailyRevenue).map(day => ({
    'Date': day.date,
    'Orders Count': day.orders,
    'Total Revenue': day.revenue,
    'Average Order Value': day.orders > 0 ? (day.revenue / day.orders).toFixed(2) : 0
  }));
};

// Prepare Popular Items data
const preparePopularItemsData = (orders) => {
  const itemStats = {};
  
  orders.forEach(order => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach(item => {
        if (!itemStats[item.name]) {
          itemStats[item.name] = {
            name: item.name,
            quantity: 0,
            revenue: 0,
            orders: 0
          };
        }
        itemStats[item.name].quantity += item.quantity || 0;
        itemStats[item.name].revenue += (item.price || 0) * (item.quantity || 0);
        itemStats[item.name].orders += 1;
      });
    }
  });
  
  return Object.values(itemStats)
    .sort((a, b) => b.quantity - a.quantity)
    .map((item, index) => ({
      'Rank': index + 1,
      'Item Name': item.name,
      'Total Quantity': item.quantity,
      'Total Revenue': item.revenue.toFixed(2),
      'Times Ordered': item.orders,
      'Avg Quantity per Order': (item.quantity / item.orders).toFixed(1)
    }));
};

// Prepare Payment Methods data
const preparePaymentMethodsData = (orders) => {
  const paymentStats = {};
  
  orders.forEach(order => {
    const method = order.paymentMethod || 'Unknown';
    if (!paymentStats[method]) {
      paymentStats[method] = {
        method: method,
        count: 0,
        revenue: 0
      };
    }
    paymentStats[method].count += 1;
    paymentStats[method].revenue += order.total || 0;
  });
  
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  
  return Object.values(paymentStats).map(stat => ({
    'Payment Method': stat.method,
    'Orders Count': stat.count,
    'Percentage of Orders': totalOrders > 0 ? ((stat.count / totalOrders) * 100).toFixed(1) + '%' : '0%',
    'Total Revenue': stat.revenue.toFixed(2),
    'Percentage of Revenue': totalRevenue > 0 ? ((stat.revenue / totalRevenue) * 100).toFixed(1) + '%' : '0%',
    'Average Order Value': stat.count > 0 ? (stat.revenue / stat.count).toFixed(2) : 0
  }));
};

// Prepare Hourly Sales data
const prepareHourlyData = (orders) => {
  const hourlyStats = {};
  
  // Initialize all hours
  for (let i = 0; i < 24; i++) {
    hourlyStats[i] = {
      hour: i,
      orders: 0,
      revenue: 0
    };
  }
  
  orders.forEach(order => {
    if (order.timestamp) {
      const hour = new Date(order.timestamp).getHours();
      hourlyStats[hour].orders += 1;
      hourlyStats[hour].revenue += order.total || 0;
    }
  });
  
  return Object.values(hourlyStats).map(stat => ({
    'Hour': `${stat.hour.toString().padStart(2, '0')}:00`,
    'Orders Count': stat.orders,
    'Revenue': stat.revenue.toFixed(2),
    'Average Order Value': stat.orders > 0 ? (stat.revenue / stat.orders).toFixed(2) : 0
  }));
};

// Prepare Inventory data
const prepareInventoryData = (inventory) => {
  return Object.entries(inventory).map(([itemId, stock]) => ({
    'Item ID': itemId,
    'Current Stock': stock.stock || 0,
    'Minimum Stock': stock.minStock || 0,
    'Maximum Stock': stock.maxStock || 0,
    'Unit': stock.unit || 'units',
    'Stock Status': (stock.stock || 0) === 0 ? 'Out of Stock' :
                   (stock.stock || 0) <= (stock.minStock || 0) ? 'Low Stock' : 'Available',
    'Reorder Needed': (stock.stock || 0) <= (stock.minStock || 0) ? 'Yes' : 'No'
  }));
};

// Export CSV function (simpler format)
export const exportToCSV = (data, filename) => {
  try {
    const ordersData = prepareOrdersData(data.orders || []);
    const csvContent = convertToCSV(ordersData);
    downloadCSV(csvContent, `${filename}.csv`);
    return true;
  } catch (error) {
    console.error('CSV export failed:', error);
    return false;
  }
};

// Convert JSON to CSV
const convertToCSV = (data) => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      // Escape commas and quotes in CSV
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );
  
  return [csvHeaders, ...csvRows].join('\n');
};

// Download CSV file
const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Generate comprehensive report with charts data
export const generateComprehensiveReport = (orders, inventory, tables) => {
  const today = new Date().toISOString().split('T')[0];
  
  return {
    exportDate: new Date().toISOString(),
    reportDate: today,
    summary: {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
      avgOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + (order.total || 0), 0) / orders.length : 0,
      totalTables: tables.length,
      occupiedTables: tables.filter(t => t.status === 'occupied').length
    },
    orders: orders,
    inventory: inventory,
    tables: tables
  };
};

export default {
  exportToExcel,
  exportToCSV,
  generateComprehensiveReport
};