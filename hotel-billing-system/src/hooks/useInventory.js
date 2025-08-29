// Inventory management custom hook (SAFE VERSION)
import { useMemo } from 'react';
import { useAppContext, ACTIONS } from '../context/AppContext';

export const useInventory = () => {
  const { state, dispatch } = useAppContext();
  const { inventory = {} } = state || {};

  // Update stock levels
  const updateStock = (items) => {
    if (!dispatch || !items || !Array.isArray(items)) return;

    const updatedInventory = { ...inventory };
    
    items.forEach(item => {
      if (updatedInventory[item.id]) {
        updatedInventory[item.id] = {
          ...updatedInventory[item.id],
          stock: Math.max(0, updatedInventory[item.id].stock - item.quantity)
        };
      }
    });

    dispatch({
      type: ACTIONS.UPDATE_INVENTORY,
      payload: updatedInventory
    });
  };

  // Update individual item stock
  const updateItemStock = (itemId, newStock) => {
    if (!dispatch || !itemId) return;

    const updatedInventory = {
      ...inventory,
      [itemId]: { ...inventory[itemId], stock: parseInt(newStock) || 0 }
    };

    dispatch({
      type: ACTIONS.UPDATE_INVENTORY,
      payload: updatedInventory
    });
  };

  // Get low stock items (safe version)
  const lowStockItems = useMemo(() => {
    if (!inventory || typeof inventory !== 'object') return [];

    return Object.entries(inventory)
      .filter(([itemId, stock]) => stock && stock.stock <= stock.minStock)
      .map(([itemId]) => ({
        id: parseInt(itemId),
        name: `Item ${itemId}`,
        stock: inventory[itemId]
      }))
      .filter(Boolean);
  }, [inventory]);

  // Check if item is available
  const isItemAvailable = (itemId) => {
    const stock = inventory[itemId];
    return stock && stock.stock > 0;
  };

  // Get stock status for an item
  const getStockStatus = (itemId) => {
    const stock = inventory[itemId];
    if (!stock) return 'Unknown';
    
    if (stock.stock === 0) return 'Out of Stock';
    if (stock.stock <= stock.minStock) return 'Low Stock';
    return 'Available';
  };

  // Get stock color class for display
  const getStockColorClass = (itemId) => {
    const stock = inventory[itemId];
    if (!stock) return 'text-gray-600';
    
    if (stock.stock === 0) return 'text-red-600';
    if (stock.stock <= stock.minStock) return 'text-orange-600';
    return 'text-green-600';
  };

  // Get inventory summary
  const getInventorySummary = () => {
    if (!inventory || typeof inventory !== 'object') {
      return {
        totalItems: 0,
        available: 0,
        lowStock: 0,
        outOfStock: 0
      };
    }

    const totalItems = Object.keys(inventory).length;
    const outOfStock = Object.values(inventory).filter(stock => stock && stock.stock === 0).length;
    const lowStock = lowStockItems.length;
    const available = totalItems - outOfStock - lowStock;

    return {
      totalItems,
      available,
      lowStock,
      outOfStock
    };
  };

  return {
    inventory,
    updateStock,
    updateItemStock,
    lowStockItems,
    isItemAvailable,
    getStockStatus,
    getStockColorClass,
    getInventorySummary
  };
};

export default useInventory;