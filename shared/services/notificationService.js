/**
 * ============================================
 * NOTIFICATION SERVICE
 * ============================================
 * Quản lý thông báo cho User, Restaurant Owner, Admin
 */

import eventBus, { EVENT_TYPES } from './eventBus';

// Notification types
export const NOTIFICATION_TYPES = {
  ORDER: 'order',
  RESTAURANT: 'restaurant',
  VOUCHER: 'voucher',
  SYSTEM: 'system',
};

// Notification priorities
export const NOTIFICATION_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

/**
 * Tạo notification mới
 */
export const createNotification = (storage, notification) => {
  try {
    const notifications = getAllNotifications(storage);
    
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      priority: NOTIFICATION_PRIORITY.MEDIUM,
      ...notification,
    };

    notifications.unshift(newNotification);
    
    // Giới hạn 100 notifications
    if (notifications.length > 100) {
      notifications.splice(100);
    }

    storage.setItem('notifications', JSON.stringify(notifications));
    
    // Emit event
    eventBus.emit(EVENT_TYPES.NOTIFICATION_NEW, newNotification);
    
    return { success: true, notification: newNotification };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Lấy tất cả notifications
 */
export const getAllNotifications = (storage) => {
  try {
    const data = storage.getItem('notifications');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

/**
 * Lấy notifications theo user/role
 */
export const getNotificationsByRole = (storage, role) => {
  const notifications = getAllNotifications(storage);
  return notifications.filter(n => n.role === role || n.role === 'all');
};

/**
 * Lấy unread notifications count
 */
export const getUnreadCount = (storage, role = null) => {
  const notifications = role 
    ? getNotificationsByRole(storage, role)
    : getAllNotifications(storage);
  
  return notifications.filter(n => !n.read).length;
};

/**
 * Đánh dấu đã đọc
 */
export const markAsRead = (storage, notificationId) => {
  try {
    const notifications = getAllNotifications(storage);
    const notification = notifications.find(n => n.id === notificationId);
    
    if (notification) {
      notification.read = true;
      storage.setItem('notifications', JSON.stringify(notifications));
      eventBus.emit(EVENT_TYPES.NOTIFICATION_READ, notification);
      return { success: true };
    }
    
    return { success: false, error: 'Notification not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Đánh dấu tất cả đã đọc
 */
export const markAllAsRead = (storage, role = null) => {
  try {
    const notifications = getAllNotifications(storage);
    
    notifications.forEach(n => {
      if (!role || n.role === role || n.role === 'all') {
        n.read = true;
      }
    });
    
    storage.setItem('notifications', JSON.stringify(notifications));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Xóa notification
 */
export const deleteNotification = (storage, notificationId) => {
  try {
    let notifications = getAllNotifications(storage);
    notifications = notifications.filter(n => n.id !== notificationId);
    storage.setItem('notifications', JSON.stringify(notifications));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Helper: Tạo notification cho đơn hàng mới
 */
export const notifyNewOrder = (storage, order, restaurantId) => {
  return createNotification(storage, {
    type: NOTIFICATION_TYPES.ORDER,
    role: 'restaurant',
    restaurantId,
    priority: NOTIFICATION_PRIORITY.HIGH,
    title: '🔔 Đơn hàng mới!',
    message: `Đơn hàng #${order.id} - ${order.itemsSummary}`,
    data: { orderId: order.id },
  });
};

/**
 * Helper: Tạo notification cho xác nhận đơn
 */
export const notifyOrderConfirmed = (storage, order) => {
  return createNotification(storage, {
    type: NOTIFICATION_TYPES.ORDER,
    role: 'user',
    userId: order.userId,
    priority: NOTIFICATION_PRIORITY.MEDIUM,
    title: '✅ Đơn hàng đã xác nhận',
    message: `Đơn hàng #${order.id} đang được chuẩn bị`,
    data: { orderId: order.id },
  });
};

/**
 * Helper: Tạo notification cho đơn đang giao
 */
export const notifyOrderShipping = (storage, order) => {
  return createNotification(storage, {
    type: NOTIFICATION_TYPES.ORDER,
    role: 'user',
    userId: order.userId,
    priority: NOTIFICATION_PRIORITY.HIGH,
    title: '🚚 Đơn hàng đang giao',
    message: `Shipper ${order.shipper?.name} đang giao hàng cho bạn`,
    data: { orderId: order.id },
  });
};

/**
 * Helper: Tạo notification cho voucher mới
 */
export const notifyNewVoucher = (storage, voucher) => {
  return createNotification(storage, {
    type: NOTIFICATION_TYPES.VOUCHER,
    role: 'all',
    priority: NOTIFICATION_PRIORITY.MEDIUM,
    title: '🎉 Voucher mới!',
    message: `${voucher.code}: ${voucher.description}`,
    data: { voucherId: voucher.id },
  });
};

export default {
  createNotification,
  getAllNotifications,
  getNotificationsByRole,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  notifyNewOrder,
  notifyOrderConfirmed,
  notifyOrderShipping,
  notifyNewVoucher,
};
