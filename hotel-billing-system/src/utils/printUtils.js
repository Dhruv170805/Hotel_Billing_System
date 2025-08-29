import React, { useState, useRef } from 'react';

const PrintView = ({ 
  orderData, 
  tableInfo, 
  customerInfo,
  hotelInfo = {
    name: "Your Hotel Name",
    address: "Hotel Address Line 1, Line 2", 
    phone: "+91 XXXXX XXXXX",
    email: "info@yourhotel.com",
    gst: "GST123456789"
  },
  onClose 
}) => {
  const [printing, setPrinting] = useState(false);
  const printRef = useRef();

  const handlePrint = async () => {
    setPrinting(true);
    
    try {
      const printWindow = window.open('', '_blank');
      const printContent = printRef.current.innerHTML;
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Receipt - Table ${tableInfo?.number}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Courier New', monospace; font-size: 12px; color: #000; }
              .receipt { width: 300px; margin: 0 auto; padding: 10px; }
              .header { text-align: center; margin-bottom: 15px; }
              .divider { border-top: 1px dashed #000; margin: 10px 0; }
              .info-row { display: flex; justify-content: space-between; margin-bottom: 3px; }
              .items-table { width: 100%; margin-bottom: 15px; }
              .items-table th, .items-table td { text-align: left; padding: 2px 0; }
              .total-row { display: flex; justify-content: space-between; margin-bottom: 3px; }
              .grand-total { font-weight: bold; border-top: 1px solid #000; padding-top: 5px; }
              .footer { text-align: center; margin-top: 15px; font-size: 10px; }
              @media print { .no-print { display: none; } }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);
      
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
      
    } catch (error) {
      alert('Print failed. Please try again.');
    } finally {
      setPrinting(false);
    }
  };

  if (!orderData) {
    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <div style={styles.error}>
            <h3>No Order Data</h3>
            <p>Unable to generate receipt.</p>
            <button style={styles.button} onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = orderData.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div ref={printRef} style={styles.receipt}>
          <div className="header">
            <div style={{fontSize: '16px', fontWeight: 'bold'}}>{hotelInfo.name}</div>
            <div>{hotelInfo.address}</div>
            <div>Phone: {hotelInfo.phone}</div>
            <div>GST: {hotelInfo.gst}</div>
          </div>

          <div className="divider"></div>

          <div className="order-info">
            <div className="info-row">
              <span>Receipt No:</span>
              <span>#{orderData.id}</span>
            </div>
            <div className="info-row">
              <span>Table:</span>
              <span>{tableInfo?.number}</span>
            </div>
            <div className="info-row">
              <span>Date:</span>
              <span>{new Date().toLocaleString()}</span>
            </div>
            <div className="info-row">
              <span>Waiter:</span>
              <span>{orderData.waiter}</span>
            </div>
          </div>

          <div className="divider"></div>

          <table className="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th style={{textAlign: 'center'}}>Qty</th>
                <th style={{textAlign: 'right'}}>Rate</th>
                <th style={{textAlign: 'right'}}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {orderData.items?.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td style={{textAlign: 'center'}}>{item.quantity}</td>
                  <td style={{textAlign: 'right'}}>₹{item.price}</td>
                  <td style={{textAlign: 'right'}}>₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="divider"></div>

          <div className="totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>GST (18%):</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="total-row grand-total">
              <span>TOTAL:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="divider"></div>

          <div className="footer">
            <div>Thank you for dining with us!</div>
            <div>Visit again soon</div>
          </div>
        </div>

        <div style={styles.controls} className="no-print">
          <button 
            style={{...styles.button, backgroundColor: '#10b981', color: 'white'}}
            onClick={handlePrint}
            disabled={printing}
          >
            {printing ? 'Printing...' : '🖨️ Print'}
          </button>
          <button 
            style={{...styles.button, backgroundColor: '#6b7280', color: 'white'}}
            onClick={onClose}
          >
            Close
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
    padding: '20px',
    maxWidth: '400px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
  },
  receipt: {
    fontFamily: 'Courier New, monospace',
    fontSize: '12px',
    backgroundColor: 'white',
    padding: '20px',
    border: '1px solid #ddd',
    marginBottom: '20px'
  },
  controls: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center'
  },
  button: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  error: {
    textAlign: 'center',
    padding: '40px'
  }
};

export default PrintView;
