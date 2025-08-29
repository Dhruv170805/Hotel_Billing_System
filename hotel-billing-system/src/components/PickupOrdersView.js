import React, { useState, useEffect } from 'react';
import { useAppContext, ACTIONS } from '../context/AppContext';
import { initializeMenuItems } from '../utils/defaultMenu';

const PickupOrdersView = () => {
  const { state, dispatch } = useAppContext();
  const { selectedCategory = 'All' } = state || {};

  // Local cart state
  const [cart, setCart] = useState([]);

  // Menu state
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [searchTerm, setSearchTerm] = useState('');

  // Customer details
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pickupTime, setPickupTime] = useState('');

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountReceived, setAmountReceived] = useState('');

  // Load menu items once
  useEffect(() => {
    const items = initializeMenuItems();
    setMenuItems(items);
    setCategories(['All', ...new Set(items.map(i => i.category))]);

    const now = new Date();
    now.setMinutes(now.getMinutes() + 15);
    setPickupTime(now.toTimeString().slice(0, 5));
  }, []);

  // Filter menu
  const availableItems = menuItems.filter(i => i.isAvailable);
  const filteredItems = availableItems.filter(i => {
    const matchCategory = selectedCategory === 'All' || i.category === selectedCategory;
    const matchSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Cart helpers
  const getCartTotals = () => {
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const gst = subtotal * 0.18;
    return { subtotal, gst, total: subtotal + gst };
  };
  const getCartItemCount = () => cart.reduce((sum, i) => sum + i.quantity, 0);

  // Cart operations
  const addToCart = item => {
    if (!item.isAvailable) return alert('Item unavailable');
    setCart(prev => {
      const exists = prev.find(ci => ci.id === item.id);
      if (exists) {
        return prev.map(ci => ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };
  const updateQuantity = (id, delta) => {
    setCart(prev => prev
      .map(ci => (ci.id === id ? { ...ci, quantity: ci.quantity + delta } : ci))
      .filter(ci => ci.quantity > 0)
    );
  };
  const clearCart = () => setCart([]);

  // Print kitchen order
  const printKitchenOrder = () => {
    if (!customerName || cart.length === 0) {
      return alert('Enter customer name and add items');
    }
    const itemsText = cart.map(i => `${i.name} x${i.quantity} (${i.prepTime}m)`).join('\n');
    const content = `
SHREEJI RESTAURANT
KITCHEN ORDER

Customer: ${customerName}
Phone: ${phoneNumber}
Pickup Time: ${pickupTime}

Items to prepare:
${itemsText}

`;
    const w = window.open('', '_blank', 'width=400,height=600');
    w.document.write(`<pre>${content}</pre>`);
    w.document.close();
    w.print();
  };

  // Process pickup payment
  const processPickupPayment = () => {
    const totals = getCartTotals();
    if (!customerName || !phoneNumber || cart.length === 0) {
      return alert('Fill details and add items');
    }
    if (paymentMethod === 'cash' && (!amountReceived || +amountReceived < totals.total)) {
      return alert('Enter correct cash amount');
    }
    const order = {
      id: Date.now(),
      orderId: `P${Date.now().toString().slice(-6)}`,
      customerName,
      phoneNumber,
      pickupTime,
      items: cart,
      paymentMethod,
      amountReceived: paymentMethod === 'cash' ? +amountReceived : totals.total,
      change: paymentMethod === 'cash' ? +amountReceived - totals.total : 0,
      timestamp: new Date(),
      status: 'paid',
      ...totals
    };
    const existing = JSON.parse(localStorage.getItem('pickup_orders') || '[]');
    existing.push(order);
    localStorage.setItem('pickup_orders', JSON.stringify(existing));

    // Print receipt
    const itemsText = order.items.map(i => `${i.name} x${i.quantity} - Rs.${(i.price * i.quantity).toFixed(2)}`).join('\n');
    const receipt = `
Shreeji Restaurant
Jay Swaminarayan
PICKUP RECEIPT

Order ID: ${order.orderId}
Customer: ${order.customerName}
Phone: ${order.phoneNumber}
Pickup Time: ${order.pickupTime}

Items:
${itemsText}

Subtotal: Rs.${order.subtotal.toFixed(2)}
GST: Rs.${order.gst.toFixed(2)}
Total: Rs.${order.total.toFixed(2)}

Paid via ${order.paymentMethod.toUpperCase()}
Amount Received: Rs.${order.amountReceived.toFixed(2)}
Change: Rs.${order.change.toFixed(2)}

Thank you!
`;
    const pw = window.open('', '_blank', 'width=400,height=600');
    pw.document.write(`<pre>${receipt}</pre>`);
    pw.document.close();
    pw.print();

    clearCart();
    setCustomerName('');
    setPhoneNumber('');
    setAmountReceived('');
    const now = new Date(); now.setMinutes(now.getMinutes()+15);
    setPickupTime(now.toTimeString().slice(0,5));
  };

  // Render
  const totals = getCartTotals();
  const count = getCartItemCount();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Menu & Cart */}
      <div className="lg:col-span-3 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">📦 Pickup Mode</h2>
          <div className="flex gap-2">
            <button onClick={printKitchenOrder} className="btn">🖨️ Kitchen</button>
            <button onClick={processPickupPayment} className="btn">💳 Pay</button>
          </div>
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="input"
        />
        <div className="flex gap-2 overflow-auto">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => dispatch({ type: ACTIONS.SET_SELECTED_CATEGORY, payload: c })}
              className={`px-3 py-1 rounded ${selectedCategory === c ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => {
            const qty = cart.find(ci => ci.id === item.id)?.quantity || 0;
            return (
              <div key={item.id} className="card">
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <div className="flex justify-between items-center">
                  <span>Rs.{item.price}</span>
                  <div className="flex items-center gap-2">
                    {qty > 0 && (
                      <button onClick={() => updateQuantity(item.id, -1)} className="btn-sm">-</button>
                    )}
                    <span>{qty}</span>
                    <button onClick={() => addToCart(item)} className="btn-sm">+</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <div className="card p-4">
          <h3>👤 Customer</h3>
          <input
            type="text"
            placeholder="Name"
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            className="input"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            className="input"
          />
          <input
            type="time"
            value={pickupTime}
            onChange={e => setPickupTime(e.target.value)}
            className="input"
          />
        </div>

        <div className="card p-4">
          <h3>🛒 Cart ({count})</h3>
          {cart.length === 0 && <p>No items</p>}
          {cart.map(i => (
            <div key={i.id} className="flex justify-between">
              <span>{i.name} x{i.quantity}</span>
              <span>Rs.{(i.price * i.quantity).toFixed(2)}</span>
            </div>
          ))}
          {cart.length > 0 && (
            <>
              <div className="border-t pt-2">Total: Rs.{totals.total.toFixed(2)}</div>
              <button onClick={clearCart} className="btn mt-2">Clear</button>
            </>
          )}
        </div>

        <div className="card p-4">
          <h3>💳 Payment</h3>
          <select
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value)}
            className="input"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="wallet">Wallet</option>
          </select>
          {paymentMethod === 'cash' && (
            <input
              type="number"
              placeholder={`Min Rs.${totals.total.toFixed(2)}`}
              value={amountReceived}
              onChange={e => setAmountReceived(e.target.value)}
              className="input"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PickupOrdersView;
