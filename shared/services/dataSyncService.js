/**
 * ============================================
 * DATA SYNC SERVICE
 * ============================================
 * Đồng bộ dữ liệu real-time giữa các trang
 */

import eventBus, { EVENT_TYPES } from './eventBus';

/**
 * Sync order updates across pages
 */
export const syncOrderUpdate = (storage, orderId, updates) => {
  try {
    // Get current orders
    const ordersData = JSON.parse(storage.getItem('orders') || '{"dangGiao":[],"daGiao":[]}');
    
    // Find and update order
    let updated = false;
    
    ['dangGiao', 'daGiao'].forEach(status => {
      const order = ordersData[status].find(o => o.id === orderId);
      if (order) {
        Object.assign(order, updates);
        updated = true;
      }
    });
    
    if (updated) {
      storage.setItem('orders', JSON.stringify(ordersData));
      
      // Emit event for real-time update
      eventBus.emit(EVENT_TYPES.ORDER_CONFIRMED, { orderId, updates });
      
      return { success: true };
    }
    
    return { success: false, error: 'Order not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Sync restaurant menu updates
 */
export const syncMenuUpdate = (storage, restaurantId, menuItems) => {
  try {
    // Update restaurant menu in localStorage
    const restaurantKey = `restaurant_${restaurantId}_menu`;
    storage.setItem(restaurantKey, JSON.stringify(menuItems));
    
    // Emit event
    eventBus.emit(EVENT_TYPES.RESTAURANT_MENU_UPDATED, {
      restaurantId,
      menuItems,
      timestamp: Date.now()
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Sync restaurant revenue
 */
export const syncRevenueUpdate = (storage, restaurantId, revenue) => {
  try {
    const revenueKey = `restaurant_${restaurantId}_revenue`;
    const currentRevenue = JSON.parse(storage.getItem(revenueKey) || '{"total": 0, "orders": []}');
    
    currentRevenue.total = revenue.total;
    currentRevenue.lastUpdated = new Date().toISOString();
    
    storage.setItem(revenueKey, JSON.stringify(currentRevenue));
    
    // Emit event
    eventBus.emit(EVENT_TYPES.RESTAURANT_REVENUE_UPDATED, {
      restaurantId,
      revenue,
      timestamp: Date.now()
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get restaurant revenue
 */
export const getRestaurantRevenue = (storage, restaurantId) => {
  try {
    const revenueKey = `restaurant_${restaurantId}_revenue`;
    const revenue = JSON.parse(storage.getItem(revenueKey) || '{"total": 0, "orders": []}');
    return { success: true, revenue };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Calculate and sync total system revenue (for admin)
 */
export const syncSystemRevenue = (storage) => {
  try {
    // Get all orders
    const ordersData = JSON.parse(storage.getItem('orders') || '{"dangGiao":[],"daGiao":[]}');
    const allOrders = [...ordersData.dangGiao, ...ordersData.daGiao];
    
    // Calculate total (hỗ trợ cả 2 field: total và totalPrice)
    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.total || order.totalPrice || 0), 0);
    
    // Calculate by restaurant
    const revenueByRestaurant = {};
    allOrders.forEach(order => {
      const restId = order.restaurantId || 1;
      if (!revenueByRestaurant[restId]) {
        revenueByRestaurant[restId] = {
          total: 0,
          orderCount: 0,
          orders: []
        };
      }
      revenueByRestaurant[restId].total += (order.total || order.totalPrice || 0);
      revenueByRestaurant[restId].orderCount += 1;
      revenueByRestaurant[restId].orders.push(order.id);
    });
    
    // Save system metrics
    const metrics = {
      totalRevenue,
      revenueByRestaurant,
      totalOrders: allOrders.length,
      shippingOrders: ordersData.dangGiao.length,
      deliveredOrders: ordersData.daGiao.length,
      lastUpdated: new Date().toISOString()
    };
    
    storage.setItem('systemMetrics', JSON.stringify(metrics));
    
    return { success: true, metrics };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get system metrics (for admin)
 */
export const getSystemMetrics = (storage) => {
  try {
    const metrics = JSON.parse(storage.getItem('systemMetrics') || '{}');
    
    // If no metrics, calculate it
    if (!metrics.lastUpdated) {
      return syncSystemRevenue(storage);
    }
    
    return { success: true, metrics };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Listen to localStorage changes and trigger callbacks
 */
export const subscribeToDataChanges = (callback) => {
  const handler = (e) => {
    if (e.key && (
      e.key === 'orders' || 
      e.key.startsWith('restaurant_') ||
      e.key === 'systemMetrics'
    )) {
      callback({
        key: e.key,
        oldValue: e.oldValue,
        newValue: e.newValue
      });
    }
  };
  
  window.addEventListener('storage', handler);
  
  // Return unsubscribe function
  return () => window.removeEventListener('storage', handler);
};

export default {
  syncOrderUpdate,
  syncMenuUpdate,
  syncRevenueUpdate,
  getRestaurantRevenue,
  syncSystemRevenue,
  getSystemMetrics,
  subscribeToDataChanges,
};
