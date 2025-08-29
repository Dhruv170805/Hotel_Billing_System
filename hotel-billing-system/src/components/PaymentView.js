import React, { useState } from 'react';

const PaymentView = ({ 
  orderData, 
  totalAmount,
  onPaymentComplete,
  onClose 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const calculateChange = () => {
    const received = parseFloat(cashReceived) || 0;
    return Math.max(0, received - totalAmount);
  };

  const handlePayment = async () => {
    setProcessing(true);

    try {
      // Validate payment details
      if (paymentMethod === 'cash') {
        const received = parseFloat(cashReceived);
        if (!received || received < totalAmount) {
          alert('Please enter valid cash amount (minimum: ₹' + totalAmount + ')');
          setProcessing(false);
          return;
        }
      } else if (paymentMethod === 'card') {
        if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
          alert('Please fill all card details');
          setProcessing(false);
          return;
        }
      } else if (paymentMethod === 'upi') {
        if (!upiId) {
          alert('Please enter UPI ID');
          setProcessing(false);
          return;
        }
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create payment record
      const paymentData = {
        orderId: orderData.id,
        amount: totalAmount,
        method: paymentMethod,
        timestamp: new Date().toISOString(),
        status: 'completed',
        ...(paymentMethod === 'cash' && {
          cashReceived: parseFloat(cashReceived),
          change: calculateChange()
        }),
        ...(paymentMethod === 'card' && {
          cardLast4: cardDetails.number.slice(-4),
          cardType: getCardType(cardDetails.number)
        }),
        ...(paymentMethod === 'upi' && {
          upiId: upiId
        })
      };

      // Mark payment as complete
      setPaymentComplete(true);
      
      // Call parent callback
      if (onPaymentComplete) {
        onPaymentComplete(paymentData);
      }

    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const getCardType = (number) => {
    const firstDigit = number.charAt(0);
    if (firstDigit === '4') return 'Visa';
    if (firstDigit === '5') return 'Mastercard';
    if (firstDigit === '3') return 'American Express';
    return 'Unknown';
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16) {
      setCardDetails({
        ...cardDetails,
        number: value
      });
    }
  };

  if (paymentComplete) {
    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <div style={styles.successContainer}>
            <div style={styles.successIcon}>✅</div>
            <h2 style={styles.successTitle}>Payment Successful!</h2>
            <div style={styles.successDetails}>
              <p><strong>Amount Paid:</strong> ₹{totalAmount.toFixed(2)}</p>
              <p><strong>Method:</strong> {paymentMethod.toUpperCase()}</p>
              {paymentMethod === 'cash' && calculateChange() > 0 && (
                <p><strong>Change:</strong> ₹{calculateChange().toFixed(2)}</p>
              )}
              <p><strong>Time:</strong> {new Date().toLocaleString()}</p>
            </div>
            <button 
              style={{...styles.button, ...styles.primaryButton}}
              onClick={onClose}
            >
              Complete Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Process Payment</h2>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        {/* Order Summary */}
        <div style={styles.orderSummary}>
          <h3>Order Summary</h3>
          <div style={styles.summaryRow}>
            <span>Order ID:</span>
            <span>#{orderData.id}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Items:</span>
            <span>{orderData.items?.length || 0}</span>
          </div>
          <div style={{...styles.summaryRow, ...styles.totalRow}}>
            <span><strong>Total Amount:</strong></span>
            <span><strong>₹{totalAmount.toFixed(2)}</strong></span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div style={styles.paymentMethods}>
          <h3>Select Payment Method</h3>
          <div style={styles.methodButtons}>
            {['cash', 'card', 'upi'].map(method => (
              <button
                key={method}
                style={{
                  ...styles.methodButton,
                  ...(paymentMethod === method ? styles.activeMethod : {})
                }}
                onClick={() => setPaymentMethod(method)}
              >
                {method === 'cash' && '💵 Cash'}
                {method === 'card' && '💳 Card'}
                {method === 'upi' && '📱 UPI'}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Details */}
        <div style={styles.paymentDetails}>
          {/* Cash Payment */}
          {paymentMethod === 'cash' && (
            <div style={styles.cashPayment}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Cash Received (₹)</label>
                <input
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  placeholder="Enter amount received"
                  style={styles.input}
                  min={totalAmount}
                  step="0.01"
                />
              </div>
              {cashReceived && parseFloat(cashReceived) >= totalAmount && (
                <div style={styles.changeAmount}>
                  <strong>Change to Return: ₹{calculateChange().toFixed(2)}</strong>
                </div>
              )}
            </div>
          )}

          {/* Card Payment */}
          {paymentMethod === 'card' && (
            <div style={styles.cardPayment}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Card Number</label>
                <input
                  type="text"
                  value={formatCardNumber(cardDetails.number)}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  style={styles.input}
                />
              </div>
              <div style={styles.cardRow}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Expiry (MM/YY)</label>
                  <input
                    type="text"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    placeholder="12/25"
                    style={styles.input}
                    maxLength={5}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>CVV</label>
                  <input
                    type="text"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                    placeholder="123"
                    style={styles.input}
                    maxLength={4}
                  />
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Cardholder Name</label>
                <input
                  type="text"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                  placeholder="John Doe"
                  style={styles.input}
                />
              </div>
            </div>
          )}

          {/* UPI Payment */}
          {paymentMethod === 'upi' && (
            <div style={styles.upiPayment}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@paytm"
                  style={styles.input}
                />
              </div>
              <div style={styles.upiInfo}>
                <p>💡 Customer will receive payment request on their UPI app</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={styles.actions}>
          <button 
            style={{...styles.button, ...styles.cancelButton}}
            onClick={onClose}
            disabled={processing}
          >
            Cancel
          </button>
          <button 
            style={{...styles.button, ...styles.processButton}}
            onClick={handlePayment}
            disabled={processing}
          >
            {processing ? 'Processing...' : `Process Payment ₹${totalAmount.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '0',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #e5e7eb'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    margin: 0
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '4px'
  },
  orderSummary: {
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px'
  },
  totalRow: {
    fontSize: '18px',
    paddingTop: '8px',
    borderTop: '1px solid #d1d5db'
  },
  paymentMethods: {
    padding: '20px'
  },
  methodButtons: {
    display: 'flex',
    gap: '12px',
    marginTop: '12px'
  },
  methodButton: {
    flex: 1,
    padding: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease'
  },
  activeMethod: {
    borderColor: '#3b82f6',
    backgroundColor: '#dbeafe',
    color: '#1e40af'
  },
  paymentDetails: {
    padding: '0 20px 20px'
  },
  inputGroup: {
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    boxSizing: 'border-box'
  },
  cardRow: {
    display: 'flex',
    gap: '12px'
  },
  changeAmount: {
    padding: '12px',
    backgroundColor: '#dcfce7',
    color: '#166534',
    borderRadius: '8px',
    textAlign: 'center'
  },
  upiInfo: {
    padding: '12px',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    borderRadius: '8px',
    fontSize: '14px'
  },
  actions: {
    display: 'flex',
    gap: '12px',
    padding: '20px',
    borderTop: '1px solid #e5e7eb'
  },
  button: {
    flex: 1,
    padding: '14px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    color: '#374151'
  },
  processButton: {
    backgroundColor: '#10b981',
    color: 'white'
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    color: 'white'
  },
  successContainer: {
    padding: '40px',
    textAlign: 'center'
  },
  successIcon: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  successTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#10b981',
    marginBottom: '20px'
  },
  successDetails: {
    backgroundColor: '#f0fdf4',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '24px',
    textAlign: 'left'
  }
};

export default PaymentView;
