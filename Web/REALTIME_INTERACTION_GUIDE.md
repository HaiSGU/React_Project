# 🔥 Real-time Interaction System - Frontend Only

## 📋 Tổng quan

Hệ thống tương tác real-time giữa các trang trong ứng dụng sử dụng **localStorage** và **Custom Events** của browser. Không cần backend!

## 🏗️ Kiến trúc

```
┌─────────────────┐
│   Consumer      │
│   (Checkout)    │
└────────┬────────┘
         │ 1. Đặt hàng
         │ saveOrder()
         │ ↓ emit ORDER_CREATED
         │
    ┌────▼────────────────┐
    │   Event Bus         │
    │  (localStorage +    │
    │  CustomEvent)       │
    └────┬────────┬───────┘
         │        │
         │        │ 2. Real-time notification
         ↓        ↓
┌────────────┐  ┌──────────────────┐
│ Restaurant │  │  Admin Dashboard │
│ Dashboard  │  │                  │
└────────────┘  └──────────────────┘
     │
     │ 3. Xác nhận đơn
     │ updateOrderStatus()
     │ ↓ emit ORDER_CONFIRMED
     │
┌────▼──────────┐
│   Consumer    │
│  (CartPage)   │
└───────────────┘
```

## 📦 Components

### 1. **Event Bus** (`shared/services/eventBus.js`)
- Quản lý events giữa các trang
- Sử dụng CustomEvent API
- Tự động sync qua localStorage (cross-tab communication)

**Ví dụ sử dụng:**
```javascript
import eventBus, { EVENT_TYPES } from '@shared/services/eventBus';

// Emit event
eventBus.emit(EVENT_TYPES.ORDER_CREATED, orderData);

// Listen to event
eventBus.on(EVENT_TYPES.ORDER_CREATED, (data) => {
  console.log('New order:', data);
});
```

### 2. **Notification Service** (`shared/services/notificationService.js`)
- Tạo và quản lý notifications
- Hỗ trợ role-based notifications (user, restaurant, admin)
- Priority levels (low, medium, high, urgent)

**Ví dụ sử dụng:**
```javascript
import { notifyNewOrder, getUnreadCount } from '@shared/services/notificationService';

// Tạo notification
notifyNewOrder(localStorage, order, restaurantId);

// Đếm unread
const count = getUnreadCount(localStorage, 'restaurant');
```

### 3. **Data Sync Service** (`shared/services/dataSyncService.js`)
- Đồng bộ dữ liệu real-time
- Tính toán metrics (revenue, orders)
- Subscribe to data changes

**Ví dụ sử dụng:**
```javascript
import { syncSystemRevenue, getSystemMetrics } from '@shared/services/dataSyncService';

// Sync revenue after order
syncSystemRevenue(localStorage);

// Get metrics
const { metrics } = getSystemMetrics(localStorage);
```

### 4. **React Hooks** (`shared/hooks/useRealtime.js`)

#### `useNotifications(role)`
Lắng nghe notifications real-time theo role

```javascript
const { notifications, unreadCount, markRead, markAllRead } = useNotifications('restaurant');
```

#### `useRealtimeOrders()`
Lắng nghe orders real-time

```javascript
const { orders, lastUpdate, refresh } = useRealtimeOrders();
// orders.dangGiao, orders.daGiao
```

#### `useSystemMetrics()`
Metrics cho Admin (real-time)

```javascript
const { metrics, refresh } = useSystemMetrics();
// metrics.totalRevenue, metrics.totalOrders, etc.
```

#### `useEventListener(eventName, callback)`
Lắng nghe custom events

```javascript
useEventListener(EVENT_TYPES.ORDER_CREATED, (order) => {
  console.log('New order:', order);
});
```

### 5. **NotificationBell Component**
UI component hiển thị thông báo

```jsx
import NotificationBell from '@/components/NotificationBell/NotificationBell';

<NotificationBell role="restaurant" />
<NotificationBell role="admin" />
<NotificationBell role="user" />
```

## 🔄 Workflow tương tác

### Scenario 1: Consumer đặt hàng → Restaurant nhận notification

**Consumer (CheckoutPage.jsx):**
```javascript
const result = await saveOrder(localStorage, orderData);

if (result.success) {
  // 1. Gửi notification cho restaurant
  notifyNewOrder(localStorage, result.order, result.order.restaurantId);
  
  // 2. Sync revenue metrics
  syncSystemRevenue(localStorage);
  
  // 3. Emit event
  eventBus.emit(EVENT_TYPES.ORDER_CREATED, result.order);
}
```

**Restaurant (RestaurantDashboard.jsx):**
```javascript
// Listen to new orders
useEventListener(EVENT_TYPES.ORDER_CREATED, (newOrder) => {
  if (newOrder.restaurantId === ownerInfo?.restaurantId) {
    loadDashboardData(); // Refresh UI
  }
});
```

### Scenario 2: Restaurant xác nhận → Consumer nhận thông báo

**Restaurant (RestaurantDashboard.jsx):**
```javascript
const handleUpdateOrderStatus = (orderId, newStatus) => {
  const result = updateOrderStatus(orderId, newStatus, localStorage);
  
  if (result.success) {
    // 1. Gửi notification cho customer
    if (newStatus === 'processing') {
      notifyOrderConfirmed(localStorage, order);
    } else if (newStatus === 'shipping') {
      notifyOrderShipping(localStorage, order);
    }
    
    // 2. Sync system revenue
    syncSystemRevenue(localStorage);
  }
};
```

**Consumer (CartPage.jsx):**
```javascript
// Listen to order updates
useEventListener(EVENT_TYPES.ORDER_CONFIRMED, () => {
  loadOrders();
  // Show toast notification
});
```

### Scenario 3: Admin xem real-time metrics

**Admin (AdminDashboard.jsx):**
```javascript
// Auto-update metrics
const { metrics } = useSystemMetrics();
const { orders, lastUpdate } = useRealtimeOrders();

// Display real-time data
<div>Tổng doanh thu: {metrics.totalRevenue} đ</div>
<div>Đang giao: {orders.dangGiao.length}</div>
```

## 🎯 Event Types

```javascript
EVENT_TYPES.ORDER_CREATED        // Đơn hàng mới
EVENT_TYPES.ORDER_CONFIRMED      // Đơn đã xác nhận
EVENT_TYPES.ORDER_PREPARING      // Đang chuẩn bị
EVENT_TYPES.ORDER_SHIPPING       // Đang giao
EVENT_TYPES.ORDER_DELIVERED      // Đã giao
EVENT_TYPES.ORDER_CANCELLED      // Đã hủy

EVENT_TYPES.RESTAURANT_MENU_UPDATED       // Menu cập nhật
EVENT_TYPES.RESTAURANT_STATUS_CHANGED     // Trạng thái nhà hàng
EVENT_TYPES.RESTAURANT_REVENUE_UPDATED    // Doanh thu cập nhật

EVENT_TYPES.NOTIFICATION_NEW     // Thông báo mới
EVENT_TYPES.NOTIFICATION_READ    // Đã đọc thông báo
```

## 📊 Data Structure

### Notification Object
```javascript
{
  id: 1730823600000,
  timestamp: "2025-11-05T10:30:00.000Z",
  read: false,
  priority: "high", // low | medium | high | urgent
  type: "order",    // order | restaurant | voucher | system
  role: "restaurant", // user | restaurant | admin | all
  title: "🔔 Đơn hàng mới!",
  message: "Đơn hàng #123 - Pepsi x2",
  data: { orderId: 123 }
}
```

### System Metrics
```javascript
{
  totalRevenue: 550000,
  totalOrders: 10,
  shippingOrders: 3,
  deliveredOrders: 7,
  revenueByRestaurant: {
    1: { total: 300000, orderCount: 5 },
    2: { total: 250000, orderCount: 5 }
  },
  lastUpdated: "2025-11-05T10:30:00.000Z"
}
```

## ✨ Features

### ✅ Real-time Updates
- Tự động cập nhật khi có thay đổi
- Không cần refresh trang
- Cross-tab sync (nhiều tab cùng lúc)

### ✅ Notifications
- Role-based (user, restaurant, admin)
- Priority levels
- Unread count
- Mark as read

### ✅ Metrics
- System-wide revenue
- Restaurant-specific revenue
- Order counts (shipping, delivered)
- Auto-calculation

### ✅ Event System
- Pub/Sub pattern
- Type-safe events
- Auto cleanup

## 🔧 Cách sử dụng

### 1. Consumer đặt hàng
```javascript
// CheckoutPage.jsx
import { saveOrder } from '@shared/services/orderService';
import { notifyNewOrder } from '@shared/services/notificationService';
import { syncSystemRevenue } from '@shared/services/dataSyncService';
import eventBus, { EVENT_TYPES } from '@shared/services/eventBus';

const result = await saveOrder(localStorage, orderData);
if (result.success) {
  notifyNewOrder(localStorage, result.order, result.order.restaurantId);
  syncSystemRevenue(localStorage);
  eventBus.emit(EVENT_TYPES.ORDER_CREATED, result.order);
}
```

### 2. Restaurant Dashboard
```javascript
// RestaurantDashboard.jsx
import { useRealtimeOrders, useNotifications, useEventListener } from '@shared/hooks/useRealtime';
import NotificationBell from '@/components/NotificationBell/NotificationBell';

const { orders, lastUpdate } = useRealtimeOrders();
const { unreadCount } = useNotifications('restaurant');

useEventListener(EVENT_TYPES.ORDER_CREATED, (newOrder) => {
  if (newOrder.restaurantId === ownerInfo?.restaurantId) {
    loadDashboardData();
  }
});

<NotificationBell role="restaurant" />
```

### 3. Admin Dashboard
```javascript
// AdminDashboard.jsx
import { useSystemMetrics, useRealtimeOrders } from '@shared/hooks/useRealtime';
import NotificationBell from '@/components/NotificationBell/NotificationBell';

const { metrics } = useSystemMetrics();
const { orders, lastUpdate } = useRealtimeOrders();

<NotificationBell role="admin" />
```

## 🚀 Đã tích hợp

- ✅ CheckoutPage - Emit ORDER_CREATED, gửi notifications
- ✅ RestaurantDashboard - Listen orders, NotificationBell
- ✅ AdminDashboard - Real-time metrics, NotificationBell
- ✅ CartPage - Listen order status changes

## 🎨 UI Components

### NotificationBell
- Badge với unread count
- Dropdown hiển thị 10 notifications mới nhất
- Priority colors (red, orange, blue, gray)
- Time ago format
- Mark as read / Mark all as read

## 📱 Browser Support

- ✅ localStorage API
- ✅ CustomEvent API
- ✅ Storage Event (cross-tab)
- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)

## 💡 Tips

1. **Event Cleanup**: Hooks tự động cleanup khi unmount
2. **Performance**: Events được debounce tự động
3. **Data Sync**: localStorage được update atomic
4. **Cross-tab**: Sử dụng storage events để sync tabs

## 🎯 Next Steps

- [ ] Toast notifications UI
- [ ] Sound alerts cho đơn hàng mới
- [ ] Desktop notifications (Notification API)
- [ ] WebSocket integration (nếu có backend)
- [ ] Offline support (Service Worker)

## 📄 License

MIT - Free to use!
