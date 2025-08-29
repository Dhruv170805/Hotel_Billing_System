import React, { useState, useEffect } from 'react';

const TableView = ({ 
  tables = [], 
  onSelectTable, 
  onUpdateTableStatus,
  onCreateOrder,
  selectedTable,
  loading = false 
}) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter and search tables
  const filteredTables = tables.filter(table => {
    const matchesFilter = filter === 'all' || table.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = !searchTerm || 
      table.number.toString().includes(searchTerm) ||
      (table.waiter && table.waiter.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  // Handle table selection
  const handleSelectTable = (table) => {
    if (onSelectTable && table.status !== 'cleaning') {
      onSelectTable(table);
    }
  };

  // Handle status change
  const handleStatusChange = (tableId, newStatus) => {
    if (onUpdateTableStatus) {
      onUpdateTableStatus(tableId, newStatus);
    }
  };

  // Handle create new order
  const handleCreateOrder = (table) => {
    if (onCreateOrder && table.status === 'available') {
      onCreateOrder(table);
    }
  };

  // Get status styling
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'available':
        return { backgroundColor: '#d4edda', color: '#155724', borderColor: '#c3e6cb' };
      case 'occupied':
        return { backgroundColor: '#f8d7da', color: '#721c24', borderColor: '#f5c6cb' };
      case 'reserved':
        return { backgroundColor: '#fff3cd', color: '#856404', borderColor: '#ffeaa7' };
      case 'cleaning':
        return { backgroundColor: '#d1ecf1', color: '#0c5460', borderColor: '#bee5eb' };
      default:
        return { backgroundColor: '#e9ecef', color: '#495057', borderColor: '#dee2e6' };
    }
  };

  // Format time display
  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      return new Date(timeString).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return timeString;
    }
  };

  // Calculate occupancy rate
  const occupancyRate = tables.length > 0 
    ? Math.round((tables.filter(t => t.status === 'occupied').length / tables.length) * 100)
    : 0;

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading tables...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <h2 style={styles.title}>Table Management</h2>
          <div style={styles.occupancyBadge}>
            Occupancy: {occupancyRate}%
          </div>
        </div>
        
        {/* Search and Filter Controls */}
        <div style={styles.controls}>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search by table number or waiter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          
          <div style={styles.filterContainer}>
            {['all', 'available', 'occupied', 'reserved', 'cleaning'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                style={{
                  ...styles.filterButton,
                  ...(filter === status ? styles.activeFilter : {})
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== 'all' && (
                  <span style={styles.filterCount}>
                    {tables.filter(t => t.status === status).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      {filteredTables.length > 0 ? (
        <div style={styles.tablesGrid}>
          {filteredTables.map(table => (
            <div 
              key={table.id} 
              style={{
                ...styles.tableCard,
                ...(selectedTable?.id === table.id ? styles.selectedCard : {}),
                ...(table.status === 'cleaning' ? styles.disabledCard : {})
              }}
            >
              {/* Table Header */}
              <div style={styles.tableHeader}>
                <div style={styles.tableInfo}>
                  <h3 style={styles.tableNumber}>Table {table.number}</h3>
                  <div style={styles.tableCapacity}>
                    👥 {table.capacity} seats
                  </div>
                </div>
                <span 
                  style={{
                    ...styles.statusBadge,
                    ...getStatusStyle(table.status)
                  }}
                >
                  {table.status.toUpperCase()}
                </span>
              </div>

              {/* Table Details */}
              <div style={styles.tableDetails}>
                {table.status === 'occupied' && (
                  <>
                    {table.currentOrder && (
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Order ID:</span>
                        <span style={styles.detailValue}>#{table.currentOrder}</span>
                      </div>
                    )}
                    {table.orderStartTime && (
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Started:</span>
                        <span style={styles.detailValue}>{formatTime(table.orderStartTime)}</span>
                      </div>
                    )}
                    {table.totalAmount && (
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Bill Amount:</span>
                        <span style={styles.detailValue}>₹{table.totalAmount}</span>
                      </div>
                    )}
                  </>
                )}
                
                {table.status === 'reserved' && table.reservationTime && (
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Reserved for:</span>
                    <span style={styles.detailValue}>{formatTime(table.reservationTime)}</span>
                  </div>
                )}

                {table.waiter && (
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Assigned Waiter:</span>
                    <span style={styles.detailValue}>{table.waiter}</span>
                  </div>
                )}

                {table.guestCount && table.status === 'occupied' && (
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Current Guests:</span>
                    <span style={styles.detailValue}>{table.guestCount}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={styles.actionSection}>
                <div style={styles.actionButtons}>
                  {table.status === 'available' && (
                    <button 
                      style={{...styles.button, ...styles.primaryButton}}
                      onClick={() => handleCreateOrder(table)}
                    >
                      Start Order
                    </button>
                  )}
                  
                  {table.status === 'occupied' && (
                    <button 
                      style={{...styles.button, ...styles.secondaryButton}}
                      onClick={() => handleSelectTable(table)}
                    >
                      View Order
                    </button>
                  )}
                  
                  {table.status === 'reserved' && (
                    <button 
                      style={{...styles.button, ...styles.warningButton}}
                      onClick={() => handleSelectTable(table)}
                    >
                      Check In
                    </button>
                  )}
                  
                  {table.status !== 'cleaning' && (
                    <button 
                      style={{...styles.button, ...styles.outlineButton}}
                      onClick={() => handleSelectTable(table)}
                    >
                      Manage
                    </button>
                  )}
                </div>

                {/* Quick Status Change */}
                <select
                  style={styles.statusSelect}
                  value={table.status}
                  onChange={(e) => handleStatusChange(table.id, e.target.value)}
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="reserved">Reserved</option>
                  <option value="cleaning">Cleaning</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🍽️</div>
          <h3>No Tables Found</h3>
          <p>
            {searchTerm 
              ? `No tables match "${searchTerm}"` 
              : filter === 'all' 
                ? 'No tables available in the system'
                : `No ${filter} tables found`
            }
          </p>
          {searchTerm && (
            <button 
              style={{...styles.button, ...styles.primaryButton}}
              onClick={() => setSearchTerm('')}
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Footer Summary */}
      {tables.length > 0 && (
        <div style={styles.summary}>
          <div style={styles.summaryGrid}>
            <div style={styles.summaryCard}>
              <div style={styles.summaryNumber}>{tables.length}</div>
              <div style={styles.summaryLabel}>Total Tables</div>
            </div>
            <div style={styles.summaryCard}>
              <div style={styles.summaryNumber}>
                {tables.filter(t => t.status === 'available').length}
              </div>
              <div style={styles.summaryLabel}>Available</div>
            </div>
            <div style={styles.summaryCard}>
              <div style={styles.summaryNumber}>
                {tables.filter(t => t.status === 'occupied').length}
              </div>
              <div style={styles.summaryLabel}>Occupied</div>
            </div>
            <div style={styles.summaryCard}>
              <div style={styles.summaryNumber}>
                {tables.filter(t => t.status === 'reserved').length}
              </div>
              <div style={styles.summaryLabel}>Reserved</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Production-ready styles
const styles = {
  container: {
    padding: '24px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    color: '#64748b'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px'
  },
  header: {
    marginBottom: '32px'
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0
  },
  occupancyBadge: {
    padding: '8px 16px',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    borderRadius: '24px',
    fontSize: '14px',
    fontWeight: '600'
  },
  controls: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  searchContainer: {
    flex: '1',
    minWidth: '250px'
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: 'white',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
  },
  filterContainer: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  filterButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    backgroundColor: 'white',
    color: '#374151',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  },
  activeFilter: {
    backgroundColor: '#3b82f6',
    color: 'white',
    borderColor: '#3b82f6'
  },
  filterCount: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    padding: '2px 6px',
    fontSize: '12px',
    minWidth: '18px',
    textAlign: 'center'
  },
  tablesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },
  tableCard: {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  selectedCard: {
    borderColor: '#3b82f6',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)',
    transform: 'translateY(-2px)'
  },
  disabledCard: {
    opacity: '0.6',
    cursor: 'not-allowed'
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px'
  },
  tableInfo: {
    flex: 1
  },
  tableNumber: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 4px 0'
  },
  tableCapacity: {
    fontSize: '14px',
    color: '#6b7280'
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    border: '1px solid'
  },
  tableDetails: {
    marginBottom: '20px'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0',
    borderBottom: '1px solid #f3f4f6'
  },
  detailLabel: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500'
  },
  detailValue: {
    fontSize: '14px',
    color: '#111827',
    fontWeight: '600'
  },
  actionSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  actionButtons: {
    display: 'flex',
    gap: '8px'
  },
  button: {
    padding: '10px 16px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    flex: 1,
    textAlign: 'center'
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    color: 'white'
  },
  secondaryButton: {
    backgroundColor: '#10b981',
    color: 'white'
  },
  warningButton: {
    backgroundColor: '#f59e0b',
    color: 'white'
  },
  outlineButton: {
    backgroundColor: 'transparent',
    color: '#374151',
    border: '1px solid #d1d5db'
  },
  statusSelect: {
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    backgroundColor: 'white',
    fontSize: '14px',
    cursor: 'pointer',
    color: '#374151'
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
    color: '#6b7280'
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px'
  },
  summary: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '24px'
  },
  summaryCard: {
    textAlign: 'center'
  },
  summaryNumber: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#3b82f6',
    marginBottom: '4px'
  },
  summaryLabel: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500'
  }
};

export default TableView;
