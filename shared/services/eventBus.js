/**
 * ============================================
 * EVENT BUS - FRONTEND EVENT SYSTEM
 * ============================================
 * Quản lý events giữa các trang/components
 * Sử dụng CustomEvent API của browser
 */

const hasWindow =
  typeof window !== 'undefined' && typeof window.addEventListener === 'function';
const hasLocalStorage =
  typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function';

class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  // Đăng ký lắng nghe event
  on(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName).push(callback);

    // Return unsubscribe function
    return () => this.off(eventName, callback);
  }

  // Hủy lắng nghe event
  off(eventName, callback) {
    if (!this.listeners.has(eventName)) return;
    
    const callbacks = this.listeners.get(eventName);
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  // Phát event
  emit(eventName, data) {
    if (hasWindow && typeof CustomEvent === 'function') {
      try {
        const event = new CustomEvent('app-event', {
          detail: { eventName, data, timestamp: Date.now() }
        });
        window.dispatchEvent(event);
      } catch (error) {
        console.warn('CustomEvent dispatch failed:', error);
      }
    }

    // Trigger local listeners
    if (this.listeners.has(eventName)) {
      this.listeners.get(eventName).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${eventName}:`, error);
        }
      });
    }

    if (hasLocalStorage) {
      try {
        localStorage.setItem('lastEvent', JSON.stringify({
          eventName,
          data,
          timestamp: Date.now()
        }));
      } catch (e) {
        console.warn('Failed to store event in localStorage:', e);
      }
    }
  }

  // Xóa tất cả listeners
  clear() {
    this.listeners.clear();
  }
}

// Singleton instance
const eventBus = new EventBus();

// Listen to storage events (cross-tab communication) - browser only
if (hasWindow) {
  window.addEventListener('storage', (e) => {
    if (e.key === 'lastEvent' && e.newValue) {
      try {
        const { eventName, data } = JSON.parse(e.newValue);
        // Trigger local listeners in other tabs
        if (eventBus.listeners.has(eventName)) {
          eventBus.listeners.get(eventName).forEach(callback => {
            callback(data);
          });
        }
      } catch (error) {
        console.error('Error processing storage event:', error);
      }
    }
  });
}

// ============================================
// EVENT TYPES
// ============================================
export const EVENT_TYPES = {
  // Order events
  ORDER_CREATED: 'order:created',
  ORDER_CONFIRMED: 'order:confirmed',
  ORDER_PREPARING: 'order:preparing',
  ORDER_SHIPPING: 'order:shipping',
  ORDER_DELIVERED: 'order:delivered',
  ORDER_CANCELLED: 'order:cancelled',
  
  // Restaurant events
  RESTAURANT_MENU_UPDATED: 'restaurant:menu:updated',
  RESTAURANT_STATUS_CHANGED: 'restaurant:status:changed',
  RESTAURANT_REVENUE_UPDATED: 'restaurant:revenue:updated',
  
  // Admin events
  ADMIN_VOUCHER_CREATED: 'admin:voucher:created',
  ADMIN_VOUCHER_UPDATED: 'admin:voucher:updated',
  ADMIN_RESTAURANT_APPROVED: 'admin:restaurant:approved',
  
  // User events
  USER_LOGGED_IN: 'user:logged:in',
  USER_LOGGED_OUT: 'user:logged:out',
  
  // Notification events
  NOTIFICATION_NEW: 'notification:new',
  NOTIFICATION_READ: 'notification:read',
};

export default eventBus;
