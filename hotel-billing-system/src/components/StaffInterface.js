import React, { useState, useEffect } from 'react';
import TableView from './TableView';
import PaymentView from './PaymentView';

// Kitchen Print Component
const KitchenPrintView = ({ orderData, tableInfo, onClose }) => {
  const handleKitchenPrint = () => {
    const printContent = `
      <div style="font-family: monospace; width: 400px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
          <h1 style="font-size: 24px; margin: 0;">KITCHEN ORDER</h1>
          <p style="font-size: 18px; font-weight: bold; margin: 5px 0;">TABLE ${tableInfo?.number}</p>
        </div>
        
        <div style="margin: 20px 0; display: flex; justify-content: space-between;">
          <div><strong>Order ID:</strong> #${orderData?.id}</div>
          <div><strong>Time:</strong> ${new Date().toLocaleTimeString()}</div>
        </div>
        
        <div style="margin: 20px 0;">
          <div><strong>Waiter:</strong> ${orderData?.waiter}</div>
          <div><strong>Started:</strong> ${new Date().toLocaleString()}</div>
        </div>
        
        <hr style="border: 2px solid #000; margin: 20px 0;">
        
        <div style="margin: 20px 0;">
          <h2 style="text-align: center; margin-bottom: 15px;">ITEMS TO PREPARE</h2>
          ${orderData?.items?.map((item, index) => `
            <div style="margin: 15px 0; padding: 10px; border: 1px solid #000; background: ${index % 2 === 0 ? '#f5f5f5' : 'white'};">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 18px; font-weight: bold;">${item.name}</div>
                <div style="font-size: 24px; font-weight: bold; background: #000; color: white; padding: 5px 10px; border-radius: 5px;">QTY: ${item.quantity}</div>
              </div>
              <div style="margin-top: 10px; font-style: italic; color: #666;">
                Category: ${item.category || 'Main Course'} | Price: ₹${item.price}
              </div>
            </div>
          `).join('') || ''}
        </div>
        
        <hr style="border: 2px solid #000; margin: 20px 0;">
        
        <div style="text-align: center; margin: 20px 0;">
          <p style="font-size: 16px;"><strong>Total Items:</strong> ${orderData?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}</p>
          <p style="font-size: 14px; margin-top: 10px;">Please prepare items in order and notify when ready</p>
        </div>
        
        <div style="margin-top: 30px; text-align: center; border-top: 2px dashed #000; padding-top: 15px;">
          <p style="font-size: 12px;">Kitchen Copy - ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Kitchen Order - Table ${tableInfo?.number}</title>
          <style>
            @media print {
              body { margin: 0; }
              @page { size: A4; margin: 0.5in; }
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000}}>
      <div style={{backgroundColor: 'white', padding: '30px', borderRadius: '12px', maxWidth: '500px', width: '90%'}}>
        <h2 style={{marginBottom: '20px', color: '#d97706'}}>🍳 Kitchen Print Preview</h2>
        <div style={{backgroundColor: '#fef3c7', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '2px solid #d97706'}}>
          <h3 style={{margin: '0 0 10px 0', color: '#92400e'}}>Kitchen Order - Table {tableInfo?.number}</h3>
          <p><strong>Order:</strong> #{orderData?.id}</p>
          <p><strong>Items to Prepare:</strong> {orderData?.items?.length || 0}</p>
          <p><strong>Total Quantity:</strong> {orderData?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}</p>
          <div style={{marginTop: '10px'}}>
            {orderData?.items?.map(item => (
              <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #d97706'}}>
                <span>{item.name}</span>
                <span style={{fontWeight: 'bold'}}>Qty: {item.quantity}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{display: 'flex', gap: '12px'}}>
          <button onClick={handleKitchenPrint} style={{flex: 1, padding: '12px', backgroundColor: '#d97706', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px'}}>
            🍳 Print Kitchen Order
          </button>
          <button onClick={onClose} style={{flex: 1, padding: '12px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px'}}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Customer Receipt Print Component
const CustomerPrintView = ({ orderData, tableInfo, onClose }) => {
  const handleCustomerPrint = () => {
    const printContent = `
      <div style="font-family: monospace; width: 300px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2>Your Hotel Name</h2>
          <p>Hotel Address Line 1</p>
          <p>City, State - 123456</p>
          <p>Phone: +91 12345 67890</p>
          <p>Email: info@yourhotel.com</p>
          <p>GST: 123456789</p>
        </div>
        
        <hr style="border: 1px dashed #000; margin: 15px 0;">
        
        <div style="margin: 15px 0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span><strong>Receipt No:</strong></span>
            <span>#${orderData?.id}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span><strong>Table No:</strong></span>
            <span>${tableInfo?.number}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span><strong>Date & Time:</strong></span>
            <span>${new Date().toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span><strong>Waiter:</strong></span>
            <span>${orderData?.waiter}</span>
          </div>
        </div>
        
        <hr style="border: 1px dashed #000; margin: 15px 0;">
        
        <table style="width: 100%; margin: 15px 0; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid #000;">
              <th style="text-align: left; padding: 5px 0;">Item</th>
              <th style="text-align: center; padding: 5px 0;">Qty</th>
              <th style="text-align: right; padding: 5px 0;">Rate</th>
              <th style="text-align: right; padding: 5px 0;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${orderData?.items?.map(item => `
              <tr style="border-bottom: 1px dotted #ccc;">
                <td style="padding: 3px 0;">${item.name}</td>
                <td style="text-align: center; padding: 3px 0;">${item.quantity}</td>
                <td style="text-align: right; padding: 3px 0;">₹${item.price.toFixed(2)}</td>
                <td style="text-align: right; padding: 3px 0;">₹${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
        
        <hr style="border: 1px dashed #000; margin: 15px 0;">
        
        <div style="margin: 15px 0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>Subtotal:</span>
            <span>₹${orderData?.subtotal?.toFixed(2) || '0.00'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>CGST (9%):</span>
            <span>₹${(orderData?.tax / 2)?.toFixed(2) || '0.00'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>SGST (9%):</span>
            <span>₹${(orderData?.tax / 2)?.toFixed(2) || '0.00'}</span>
          </div>
          ${orderData?.discount > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span>Discount:</span>
              <span>-₹${orderData.discount.toFixed(2)}</span>
            </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 16px; border-top: 1px solid #000; padding-top: 8px; margin-top: 8px;">
            <span>GRAND TOTAL:</span>
            <span>₹${orderData?.totalAmount?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
        
        <hr style="border: 1px dashed #000; margin: 15px 0;">
        
        <div style="text-align: center; margin: 15px 0;">
          <p style="margin: 5px 0;">Thank you for dining with us!</p>
          <p style="margin: 5px 0;">Please visit us again</p>
          <p style="margin: 10px 0 0 0; font-size: 10px;">
            Customer Copy - Generated on ${new Date().toLocaleString()}
          </p>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Customer Receipt - Table ${tableInfo?.number}</title>
          <style>
            @media print {
              body { margin: 0; }
              @page { size: 80mm auto; margin: 5mm; }
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000}}>
      <div style={{backgroundColor: 'white', padding: '30px', borderRadius: '12px', maxWidth: '400px', width: '90%'}}>
        <h2 style={{marginBottom: '20px', color: '#059669'}}>🧾 Customer Receipt Preview</h2>
        <div style={{backgroundColor: '#ecfdf5', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '2px solid #059669'}}>
          <h3 style={{margin: '0 0 10px 0', color: '#047857'}}>Customer Receipt - Table {tableInfo?.number}</h3>
          <p><strong>Receipt:</strong> #{orderData?.id}</p>
          <p><strong>Items:</strong> {orderData?.items?.length || 0}</p>
          <p><strong>Total Amount:</strong> ₹{orderData?.totalAmount?.toFixed(2) || '0.00'}</p>
          <p><strong>Generated:</strong> {new Date().toLocaleString()}</p>
        </div>
        <div style={{display: 'flex', gap: '12px'}}>
          <button onClick={handleCustomerPrint} style={{flex: 1, padding: '12px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px'}}>
            🧾 Print Customer Receipt
          </button>
          <button onClick={onClose} style={{flex: 1, padding: '12px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px'}}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const StaffInterface = () => {
  // State Management
  const [currentView, setCurrentView] = useState('tables');
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [showKitchenPrint, setShowKitchenPrint] = useState(false);
  const [showCustomerPrint, setShowCustomerPrint] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [staff] = useState({
    id: 1,
    name: 'John Doe',
    role: 'Waiter'
  });

  // Initialize data
  useEffect(() => {
    initializeData();
  }, []);

  // Update order totals whenever orderItems change
  useEffect(() => {
    if (orderItems.length > 0 && currentOrder) {
      updateOrderTotals();
    }
  }, [orderItems]);

  const initializeData = () => {
    const initialTables = [
      { id: 1, number: 1, status: 'available', capacity: 4, waiter: null, currentOrder: null },
      { id: 2, number: 2, status: 'occupied', capacity: 2, waiter: 'John Doe', currentOrder: 'ORD001', totalAmount: 850, orderStartTime: '2025-08-29T19:30:00' },
      { id: 3, number: 3, status: 'reserved', capacity: 6, waiter: null, currentOrder: null, reservationTime: '2025-08-29T20:00:00' },
      { id: 4, number: 4, status: 'cleaning', capacity: 4, waiter: null, currentOrder: null },
      { id: 5, number: 5, status: 'available', capacity: 8, waiter: null, currentOrder: null },
      { id: 6, number: 6, status: 'available', capacity: 2, waiter: null, currentOrder: null },
    ];
    setTables(initialTables);

    const initialMenu = [
      { id: 1, name: 'Butter Chicken', category: 'Main Course', price: 320, available: true },
      { id: 2, name: 'Dal Makhani', category: 'Main Course', price: 280, available: true },
      { id: 3, name: 'Paneer Tikka', category: 'Starter', price: 250, available: true },
      { id: 4, name: 'Naan', category: 'Bread', price: 60, available: true },
      { id: 5, name: 'Basmati Rice', category: 'Rice', price: 120, available: true },
      { id: 6, name: 'Gulab Jamun', category: 'Dessert', price: 100, available: true },
      { id: 7, name: 'Lassi', category: 'Beverage', price: 80, available: true },
      { id: 8, name: 'Masala Chai', category: 'Beverage', price: 40, available: true },
    ];
    setMenuItems(initialMenu);
  };

  // Table Management
  const handleSelectTable = (table) => {
    if (!table) {
      console.error('No table provided to handleSelectTable');
      return;
    }

    setSelectedTable(table);
    
    if (table.status === 'occupied' && table.currentOrder) {
      loadExistingOrder(table.currentOrder, table);
      setCurrentView('order');
    } else if (table.status === 'available') {
      startNewOrder(table);
    } else if (table.status === 'reserved') {
      const confirmCheckIn = window.confirm(`Check in reservation for Table ${table.number}?`);
      if (confirmCheckIn) {
        startNewOrder(table);
      }
    }
  };

  const handleUpdateTableStatus = (tableId, newStatus) => {
    setTables(prev => prev.map(table => 
      table.id === tableId 
        ? { ...table, status: newStatus }
        : table
    ));
  };

  const startNewOrder = (table) => {
    if (!table) {
      console.error('No table provided to startNewOrder');
      return;
    }

    const newOrder = {
      id: `ORD${Date.now()}`,
      tableId: table.id,
      tableNumber: table.number,
      waiter: staff.name,
      startTime: new Date().toISOString(),
      items: [],
      status: 'active',
      subtotal: 0,
      tax: 0,
      discount: 0,
      totalAmount: 0
    };

    setCurrentOrder(newOrder);
    setOrderItems([]);
    setCurrentView('order');

    setTables(prev => prev.map(t => 
      t.id === table.id 
        ? { ...t, status: 'occupied', waiter: staff.name, currentOrder: newOrder.id, orderStartTime: new Date().toISOString() }
        : t
    ));
  };

  const loadExistingOrder = (orderId, table) => {
    if (!table) {
      console.error('No table provided to loadExistingOrder');
      return;
    }

    const existingOrder = {
      id: orderId,
      tableId: table.id,
      tableNumber: table.number,
      waiter: table.waiter,
      startTime: table.orderStartTime,
      items: [
        { id: 1, name: 'Butter Chicken', price: 320, quantity: 1, total: 320, category: 'Main Course' },
        { id: 2, name: 'Naan', price: 60, quantity: 2, total: 120, category: 'Bread' },
        { id: 3, name: 'Lassi', price: 80, quantity: 1, total: 80, category: 'Beverage' }
      ],
      status: 'active',
      subtotal: 520,
      tax: 93.6,
      discount: 0,
      totalAmount: 613.6
    };

    setCurrentOrder(existingOrder);
    setOrderItems(existingOrder.items);
  };

  // Order Management
  const addItemToOrder = (menuItem) => {
    const existingItem = orderItems.find(item => item.id === menuItem.id);
    
    if (existingItem) {
      setOrderItems(prev => prev.map(item => 
        item.id === menuItem.id 
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      const newItem = {
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1,
        total: menuItem.price,
        category: menuItem.category
      };
      setOrderItems(prev => [...prev, newItem]);
    }
  };

  const updateItemQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItemFromOrder(itemId);
      return;
    }

    setOrderItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
        : item
    ));
  };

  const removeItemFromOrder = (itemId) => {
    setOrderItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateOrderTotals = () => {
    const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.18;
    const totalAmount = subtotal + tax;

    setCurrentOrder(prev => ({
      ...prev,
      items: orderItems,
      subtotal,
      tax,
      totalAmount
    }));

    if (selectedTable) {
      setTables(prev => prev.map(table => 
        table.id === selectedTable.id 
          ? { ...table, totalAmount }
          : table
      ));
    }
  };

  // Print Functions
  const handleKitchenPrint = () => {
    if (!currentOrder || !orderItems.length) {
      alert('No order to print for kitchen! Please add items to the order first.');
      return;
    }
    setShowKitchenPrint(true);
  };

  const handleCustomerPrint = () => {
    if (!currentOrder || !orderItems.length) {
      alert('No order to print for customer! Please add items to the order first.');
      return;
    }
    setShowCustomerPrint(true);
  };

  const handleProcessPayment = () => {
    if (!currentOrder || !orderItems.length) {
      alert('No order to process payment! Please add items to the order first.');
      return;
    }
    if (!currentOrder.totalAmount || currentOrder.totalAmount <= 0) {
      alert('Invalid order total! Please check the order.');
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentComplete = (paymentData) => {
    console.log('Payment completed:', paymentData);
    
    if (selectedTable) {
      setTables(prev => prev.map(table => 
        table.id === selectedTable.id 
          ? { 
              ...table, 
              status: 'available', 
              waiter: null, 
              currentOrder: null, 
              totalAmount: null,
              orderStartTime: null 
            }
          : table
      ));
    }

    setCurrentOrder(null);
    setOrderItems([]);
    setSelectedTable(null);
    setShowPayment(false);
    setCurrentView('tables');
    
    alert('Payment successful! Table cleared.');
  };

  const getMenuCategories = () => {
    return [...new Set(menuItems.map(item => item.category))];
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>Hotel Billing System</h1>
          <div style={styles.staffInfo}>Welcome, {staff.name} ({staff.role})</div>
        </div>
        
        <div style={styles.headerRight}>
          <div style={styles.navigationTabs}>
            <button 
              style={{...styles.navTab, ...(currentView === 'tables' ? styles.activeTab : {})}}
              onClick={() => setCurrentView('tables')}
            >
              🍽️ Tables
            </button>
            {selectedTable && (
              <button 
                style={{...styles.navTab, ...(currentView === 'order' ? styles.activeTab : {})}}
                onClick={() => setCurrentView('order')}
              >
                📝 Order (Table {selectedTable.number})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Tables View */}
        {currentView === 'tables' && (
          <TableView
            tables={tables}
            selectedTable={selectedTable}
            onSelectTable={handleSelectTable}
            onUpdateTableStatus={handleUpdateTableStatus}
            onCreateOrder={startNewOrder}
          />
        )}

        {/* Order View */}
        {currentView === 'order' && selectedTable && (
          <div style={styles.orderView}>
            <div style={styles.orderHeader}>
              <div>
                <h2>Order Management - Table {selectedTable.number}</h2>
                <p style={styles.orderInfo}>
                  Order ID: {currentOrder?.id} | Waiter: {currentOrder?.waiter}
                </p>
              </div>
              
              {/* Updated Action Buttons with Kitchen & Customer Print */}
              <div style={styles.orderActions}>
                <button 
                  style={{...styles.actionBtn, ...styles.kitchenBtn}}
                  onClick={handleKitchenPrint}
                  disabled={!orderItems.length}
                  title="Print order for kitchen preparation"
                >
                  🍳 Kitchen Print
                </button>
                <button 
                  style={{...styles.actionBtn, ...styles.printBtn}}
                  onClick={handleCustomerPrint}
                  disabled={!orderItems.length}
                  title="Print customer receipt"
                >
                  🧾 Customer Receipt
                </button>
                <button 
                  style={{...styles.actionBtn, ...styles.payBtn}}
                  onClick={handleProcessPayment}
                  disabled={!orderItems.length}
                >
                  💳 Pay ₹{currentOrder?.totalAmount?.toFixed(2) || '0.00'}
                </button>
                <button 
                  style={{...styles.actionBtn, ...styles.backBtn}}
                  onClick={() => setCurrentView('tables')}
                >
                  ← Back to Tables
                </button>
              </div>
            </div>

            <div style={styles.orderContent}>
              {/* Current Order Items */}
              <div style={styles.orderSection}>
                <h3>Current Order</h3>
                {orderItems.length > 0 ? (
                  <div style={styles.orderItems}>
                    {orderItems.map((item, index) => (
                      <div key={index} style={styles.orderItem}>
                        <div style={styles.itemDetails}>
                          <strong>{item.name}</strong>
                          <span>₹{item.price} each</span>
                        </div>
                        <div style={styles.itemControls}>
                          <button 
                            style={styles.quantityBtn}
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span style={styles.quantity}>{item.quantity}</span>
                          <button 
                            style={styles.quantityBtn}
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                          <span style={styles.itemTotal}>₹{item.total?.toFixed(2)}</span>
                          <button 
                            style={styles.removeBtn}
                            onClick={() => removeItemFromOrder(item.id)}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <div style={styles.orderSummary}>
                      <div style={styles.summaryRow}>
                        <span>Subtotal:</span>
                        <span>₹{currentOrder?.subtotal?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div style={styles.summaryRow}>
                        <span>GST (18%):</span>
                        <span>₹{currentOrder?.tax?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div style={{...styles.summaryRow, ...styles.totalRow}}>
                        <span><strong>Total:</strong></span>
                        <span><strong>₹{currentOrder?.totalAmount?.toFixed(2) || '0.00'}</strong></span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={styles.emptyOrder}>
                    <p>No items in order. Add items from the menu below.</p>
                  </div>
                )}
              </div>

              {/* Menu Items */}
              <div style={styles.menuSection}>
                <h3>Add Items to Order</h3>
                
                <div style={styles.categoryFilter}>
                  {getMenuCategories().map(category => (
                    <button key={category} style={styles.categoryBtn}>
                      {category}
                    </button>
                  ))}
                </div>

                <div style={styles.menuGrid}>
                  {menuItems
                    .filter(item => item.available)
                    .map(item => (
                      <div key={item.id} style={styles.menuItem}>
                        <div style={styles.menuItemInfo}>
                          <h4>{item.name}</h4>
                          <p style={styles.menuCategory}>{item.category}</p>
                          <p style={styles.menuPrice}>₹{item.price}</p>
                        </div>
                        <button 
                          style={styles.addItemBtn}
                          onClick={() => addItemToOrder(item)}
                        >
                          + Add
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showKitchenPrint && currentOrder && (
        <KitchenPrintView
          orderData={currentOrder}
          tableInfo={selectedTable}
          onClose={() => setShowKitchenPrint(false)}
        />
      )}

      {showCustomerPrint && currentOrder && (
        <CustomerPrintView
          orderData={currentOrder}
          tableInfo={selectedTable}
          onClose={() => setShowCustomerPrint(false)}
        />
      )}

      {showPayment && currentOrder && (
        <PaymentView
          orderData={currentOrder}
          totalAmount={currentOrder?.totalAmount || 0}
          onPaymentComplete={handlePaymentComplete}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
};

// Updated Styles
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    backgroundColor: 'white',
    padding: '20px 24px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 4px 0'
  },
  staffInfo: {
    color: '#6b7280',
    fontSize: '14px'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center'
  },
  navigationTabs: {
    display: 'flex',
    gap: '8px'
  },
  navTab: {
    padding: '12px 20px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    backgroundColor: 'white',
    color: '#374151',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  },
  activeTab: {
    backgroundColor: '#3b82f6',
    color: 'white',
    borderColor: '#3b82f6'
  },
  mainContent: {
    flex: 1,
    padding: '24px'
  },
  orderView: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  orderHeader: {
    padding: '24px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '16px'
  },
  orderInfo: {
    color: '#6b7280',
    margin: '4px 0 0 0',
    fontSize: '14px'
  },
  orderActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  actionBtn: {
    padding: '12px 20px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '130px'
  },
  kitchenBtn: {
    backgroundColor: '#d97706',
    color: 'white'
  },
  printBtn: {
    backgroundColor: '#10b981',
    color: 'white'
  },
  payBtn: {
    backgroundColor: '#3b82f6',
    color: 'white'
  },
  backBtn: {
    backgroundColor: '#6b7280',
    color: 'white'
  },
  orderContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    padding: '24px'
  },
  orderSection: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '20px'
  },
  orderItems: {
    marginTop: '16px'
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '6px',
    marginBottom: '8px',
    border: '1px solid #e5e7eb'
  },
  itemDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  itemControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  quantityBtn: {
    width: '32px',
    height: '32px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    backgroundColor: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  quantity: {
    minWidth: '24px',
    textAlign: 'center',
    fontWeight: '600'
  },
  itemTotal: {
    fontWeight: '600',
    minWidth: '60px',
    textAlign: 'right'
  },
  removeBtn: {
    width: '32px',
    height: '32px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    cursor: 'pointer',
    fontSize: '16px'
  },
  orderSummary: {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '6px',
    border: '1px solid #e5e7eb'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px'
  },
  totalRow: {
    fontSize: '18px',
    paddingTop: '8px',
    borderTop: '1px solid #e5e7eb'
  },
  emptyOrder: {
    textAlign: 'center',
    padding: '40px',
    color: '#6b7280'
  },
  menuSection: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '20px'
  },
  categoryFilter: {
    display: 'flex',
    gap: '8px',
    marginTop: '16px',
    marginBottom: '16px',
    flexWrap: 'wrap'
  },
  categoryBtn: {
    padding: '8px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '20px',
    backgroundColor: 'white',
    fontSize: '12px',
    cursor: 'pointer'
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '12px'
  },
  menuItem: {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  menuItemInfo: {
    marginBottom: '12px'
  },
  menuCategory: {
    fontSize: '12px',
    color: '#6b7280',
    margin: '4px 0'
  },
  menuPrice: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#059669',
    margin: '4px 0'
  },
  addItemBtn: {
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  }
};

export default StaffInterface;
