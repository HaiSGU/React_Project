/**
 * ============================================
 * REACT HOOKS - REAL-TIME DATA HOOKS
 * ============================================
 */

import { useState, useEffect, useCallback } from 'react';
import eventBus, { EVENT_TYPES } from '../services/eventBus';
import { 
  getNotificationsByRole, 
  getUnreadCount, 
  markAsRead,
  markAllAsRead 
} from '../services/notificationService';
import { 
  getSystemMetrics,
  getRestaurantRevenue 
} from '../services/dataSyncService';

/**
 * Hook: Lắng nghe notifications real-time
 */
export const useNotifications = (role) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = useCallback(() => {
    const data = getNotificationsByRole(localStorage, role);
    setNotifications(data);
    setUnreadCount(getUnreadCount(localStorage, role));
  }, [role]);

  useEffect(() => {
    loadNotifications();

    // Listen to new notifications
    const unsubscribe = eventBus.on(EVENT_TYPES.NOTIFICATION_NEW, (notification) => {
      if (notification.role === role || notification.role === 'all') {
        loadNotifications();
      }
    });

    return unsubscribe;
  }, [loadNotifications, role]);

  const markRead = useCallback((notificationId) => {
    markAsRead(localStorage, notificationId);
    loadNotifications();
  }, [loadNotifications]);

  const markAllRead = useCallback(() => {
    markAllAsRead(localStorage, role);
    loadNotifications();
  }, [loadNotifications, role]);

  return {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
    refresh: loadNotifications
  };
};

/**
 * Hook: Lắng nghe orders real-time
 */
export const useRealtimeOrders = () => {
  const [orders, setOrders] = useState({ dangGiao: [], daGiao: [] });
  const [lastUpdate, setLastUpdate] = useState(null);

  const loadOrders = useCallback(() => {
    try {
      const data = JSON.parse(localStorage.getItem('orders') || '{"dangGiao":[],"daGiao":[]}');
      setOrders(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  }, []);

  useEffect(() => {
    loadOrders();

    // Listen to order events
    const unsubscribeCreated = eventBus.on(EVENT_TYPES.ORDER_CREATED, loadOrders);
    const unsubscribeConfirmed = eventBus.on(EVENT_TYPES.ORDER_CONFIRMED, loadOrders);
    const unsubscribeShipping = eventBus.on(EVENT_TYPES.ORDER_SHIPPING, loadOrders);
    const unsubscribeDelivered = eventBus.on(EVENT_TYPES.ORDER_DELIVERED, loadOrders);

    return () => {
      unsubscribeCreated();
      unsubscribeConfirmed();
      unsubscribeShipping();
      unsubscribeDelivered();
    };
  }, [loadOrders]);

  return {
    orders,
    lastUpdate,
    refresh: loadOrders
  };
};

/**
 * Hook: System metrics cho Admin
 */
export const useSystemMetrics = () => {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    shippingOrders: 0,
    deliveredOrders: 0,
    revenueByRestaurant: {}
  });

  const loadMetrics = useCallback(() => {
    const result = getSystemMetrics(localStorage);
    if (result.success) {
      setMetrics(result.metrics);
    }
  }, []);

  useEffect(() => {
    loadMetrics();

    // Listen to revenue updates
    const unsubscribe = eventBus.on(EVENT_TYPES.RESTAURANT_REVENUE_UPDATED, loadMetrics);

    // Listen to order changes
    const unsubscribeOrder = eventBus.on(EVENT_TYPES.ORDER_CREATED, loadMetrics);
    const unsubscribeDelivered = eventBus.on(EVENT_TYPES.ORDER_DELIVERED, loadMetrics);

    return () => {
      unsubscribe();
      unsubscribeOrder();
      unsubscribeDelivered();
    };
  }, [loadMetrics]);

  return {
    metrics,
    refresh: loadMetrics
  };
};

/**
 * Hook: Restaurant revenue
 */
export const useRestaurantRevenue = (restaurantId) => {
  const [revenue, setRevenue] = useState({ total: 0, orders: [] });

  const loadRevenue = useCallback(() => {
    const result = getRestaurantRevenue(localStorage, restaurantId);
    if (result.success) {
      setRevenue(result.revenue);
    }
  }, [restaurantId]);

  useEffect(() => {
    loadRevenue();

    // Listen to revenue updates for this restaurant
    const unsubscribe = eventBus.on(EVENT_TYPES.RESTAURANT_REVENUE_UPDATED, (data) => {
      if (data.restaurantId === restaurantId) {
        loadRevenue();
      }
    });

    return unsubscribe;
  }, [loadRevenue, restaurantId]);

  return {
    revenue,
    refresh: loadRevenue
  };
};

/**
 * Hook: Listen to specific event
 */
export const useEventListener = (eventName, callback) => {
  useEffect(() => {
    const unsubscribe = eventBus.on(eventName, callback);
    return unsubscribe;
  }, [eventName, callback]);
};
