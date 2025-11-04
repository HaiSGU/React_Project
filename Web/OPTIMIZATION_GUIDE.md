# 🚀 Hướng Dẫn Tối Ưu Web với Shared Resources

## 📋 Tổng quan

Đã phân tích toàn bộ Web app và tìm thấy **nhiều phần có thể tối ưu** bằng cách sử dụng shared resources. Dưới đây là danh sách chi tiết.

---

## ✅ Đã tối ưu

### 1. **CheckoutPage** ✓
- ✅ Dùng `DELIVERY_METHODS` từ shared
- ✅ Dùng `PAYMENT_METHODS` từ shared
- ✅ Dùng `DISCOUNTS` từ shared
- ✅ Dùng `checkoutHelpers` utilities
- ✅ Dùng `validateCheckoutInfo`

### 2. **LoginPage** ✓
- ✅ Dùng `useLogin` hook
- ✅ Validation tự động

### 3. **RegisterPage** ✓
- ✅ Dùng `useRegister` hook
- ✅ Dùng `authService.register()`
- ✅ Validation tự động

### 4. **ChangePasswordPage** ✓
- ✅ Dùng `useChangePassword` hook
- ✅ Dùng `authService.changePassword()`
- ✅ Validation tự động

### 5. **HomePage** ✓
- ✅ Dùng `useRestaurantSearch` hook
- ✅ Dùng `RESTAURANTS`, `CATEGORIES`, `DISCOUNTS` từ shared
- ✅ Dùng `authService` (isLoggedIn, getCurrentUser, logout)

### 6. **SearchPage** ✓
- ✅ Dùng `useRestaurantSearch` hook
- ✅ Dùng `RESTAURANTS`, `MENU_ITEMS` từ shared

### 7. **MenuPage** ✓
- ✅ Dùng `useQuantities` hook
- ✅ Dùng `MENU_ITEMS_WEB`, `RESTAURANTS` từ shared

### 8. **MapSelectPage** ✓
- ✅ Dùng `weatherService` (searchAddress, getAddressFromCoords, getCurrentLocation)
- ✅ Dùng `locationService` wrapper

---

## 🔧 Cần tối ưu

### 1. **CartPage** ⚠️

**Hiện tại:**
```javascript
// Hard-coded localStorage logic
const loadOrders = () => {
  const saved = localStorage.getItem('orders');
  if (saved) {
    const parsed = JSON.parse(saved);
    setOrders(parsed);
  }
};

const handleCompleteOrder = (orderId) => {
  const order = orders.dangGiao.find(o => o.id === orderId);
  const updatedOrders = {
    dangGiao: orders.dangGiao.filter(o => o.id !== orderId),
    daGiao: [{ ...order, status: "Đã giao ✔️" }, ...orders.daGiao]
  };
  setOrders(updatedOrders);
  localStorage.setItem('orders', JSON.stringify(updatedOrders));
};
```

**Nên dùng:** `shared/services/orderService.js`

```javascript
import { 
  getShippingOrders, 
  getDeliveredOrders,
  confirmDelivery,
  deleteOrder 
} from '@shared/services/orderService';

// Load orders
useEffect(() => {
  const loadOrders = async () => {
    const shipping = await getShippingOrders(localStorage);
    const delivered = await getDeliveredOrders(localStorage);
    setOrders({ dangGiao: shipping, daGiao: delivered });
  };
  loadOrders();
}, []);

// Complete order
const handleCompleteOrder = async (orderId) => {
  const order = orders.dangGiao.find(o => o.id === orderId);
  const result = await confirmDelivery(order, localStorage);
  
  if (result.success) {
    setOrders({
      dangGiao: result.shipping,
      daGiao: result.delivered
    });
  }
};

// Delete order
const handleDeleteOrder = async (orderId) => {
  const result = await deleteOrder(localStorage, orderId);
  if (result.success) {
    // Reload orders
    loadOrders();
  }
};
```

**Lợi ích:**
- ✅ Order theo user (multi-user support)
- ✅ Consistent với Mobile
- ✅ Built-in error handling
- ✅ Cleaner code

**Available functions:**
```javascript
saveOrder(storage, order)
getShippingOrders(storage)
getDeliveredOrders(storage)
confirmDelivery(order, storage)
getAllOrders(storage)
getOrderById(storage, orderId)
updateOrderStatus(storage, orderId, status)
cancelOrder(storage, orderId)
deleteOrder(storage, orderId)
clearUserOrders(storage)
```

---

### 2. **CategoryPage** ⚠️

**Hiện tại:**
```javascript
import { CATEGORIES } from "../../utils/categoryResolver";

// Hard-coded filtering
const filtered = RESTAURANTS.filter(restaurant => {
  if (Array.isArray(restaurant.category)) {
    return restaurant.category.includes(id);
  }
  return restaurant.category === id;
});
```

**Nên dùng:** Có thể tạo helper trong `shared/utils/restaurantHelpers.js`

```javascript
// shared/utils/restaurantHelpers.js
export const filterRestaurantsByCategory = (restaurants, categoryId) => {
  return restaurants.filter(restaurant => {
    if (Array.isArray(restaurant.category)) {
      return restaurant.category.includes(categoryId);
    }
    return restaurant.category === categoryId;
  });
};

export const getRestaurantById = (restaurants, id) => {
  return restaurants.find(r => r.id === id);
};

export const getFeaturedRestaurants = (restaurants) => {
  return restaurants.filter(r => r.isFeatured);
};
```

**Sau:**
```javascript
import { filterRestaurantsByCategory } from '@shared/utils/restaurantHelpers';
import { CATEGORIES } from '@shared/constants/CategoryListWeb';

const filtered = filterRestaurantsByCategory(RESTAURANTS, id);
```

---

### 3. **DiscountPage** ⚠️

**Cần kiểm tra:** File này có thể dùng:
- `DISCOUNTS` từ `shared/constants/DiscountList.js`
- Helper function `canApplyDiscount` từ `shared/utils/checkoutHelpers.js`

---

### 4. **AccountPage** ⚠️

**Có thể dùng:**
- `authService.getCurrentUser()`
- `authService.logout()`
- `authService.updateUser()` (nếu có chức năng cập nhật thông tin)

---

### 5. **AdminLogin & AdminDashboard** ⚠️

**Có thể dùng:**
- `shared/services/adminAuthService.js`
- `shared/services/adminMetricsService.js`

---

### 6. **RestaurantDashboard** ⚠️

**Có thể dùng:**
- `shared/services/ownerMenuService.js`
- `shared/services/ownerOrderService.js`
- `shared/services/restaurantAuthService.js`
- `shared/services/voucherService.js`

---

## 📦 Utilities chưa dùng

### `shared/utils/formatters.js`
Có thể có các helper format số, tiền, ngày tháng:
```javascript
formatCurrency(amount)
formatDate(date)
formatTime(time)
formatPhoneNumber(phone)
```

### `shared/utils/orderBuilder.js`
Helper để build order object chuẩn hóa:
```javascript
buildOrder(items, user, delivery, payment, discount)
```

---

## 🎯 Kế hoạch tối ưu

### Phase 1: Critical (Ưu tiên cao)
- [ ] **CartPage** - Dùng `orderService`
- [ ] Tạo `restaurantHelpers` trong shared
- [ ] **CategoryPage** - Dùng helpers

### Phase 2: Important
- [ ] **DiscountPage** - Dùng DISCOUNTS từ shared
- [ ] **AccountPage** - Dùng authService đầy đủ
- [ ] Kiểm tra và dùng `formatters.js`

### Phase 3: Enhancement
- [ ] **AdminDashboard** - Tích hợp adminServices
- [ ] **RestaurantDashboard** - Tích hợp ownerServices
- [ ] Tạo thêm shared components nếu cần

---

## 📊 Thống kê

### Code reuse hiện tại:
- **8/16 pages** đã tối ưu ≈ **50%**
- **~40%** code đã được shared

### Mục tiêu:
- **14/16 pages** tối ưu ≈ **87.5%**
- **~70%** code được shared

### Lợi ích dự kiến:
- ✅ Giảm **~500+ dòng code** duplicate
- ✅ Consistent logic giữa Web & Mobile
- ✅ Dễ maintain & test
- ✅ Bug fix 1 lần, apply cho cả 2 platform

---

## 🔨 Cách thực hiện

### 1. Tối ưu CartPage

**File:** `Web/src/pages/CartPage/CartPage.jsx`

**Thay thế:**
```javascript
// OLD
const loadOrders = () => {
  const saved = localStorage.getItem('orders');
  // ...
};

// NEW
import { getShippingOrders, getDeliveredOrders, confirmDelivery } from '@shared/services/orderService';

const loadOrders = async () => {
  const shipping = await getShippingOrders(localStorage);
  const delivered = await getDeliveredOrders(localStorage);
  setOrders({ dangGiao: shipping, daGiao: delivered });
};
```

### 2. Tạo restaurantHelpers

**File:** `shared/utils/restaurantHelpers.js` (TẠO MỚI)

```javascript
export const filterRestaurantsByCategory = (restaurants, categoryId) => {
  return restaurants.filter(restaurant => {
    if (Array.isArray(restaurant.category)) {
      return restaurant.category.includes(categoryId);
    }
    return restaurant.category === categoryId;
  });
};

export const getRestaurantById = (restaurants, id) => {
  return restaurants.find(r => r.id === id);
};

export const getFeaturedRestaurants = (restaurants) => {
  return restaurants.filter(r => r.isFeatured);
};

export const searchRestaurants = (restaurants, query) => {
  const lowerQuery = query.toLowerCase().trim();
  return restaurants.filter(r => 
    r.name.toLowerCase().includes(lowerQuery) ||
    r.address?.toLowerCase().includes(lowerQuery)
  );
};
```

### 3. Áp dụng vào CategoryPage

```javascript
import { filterRestaurantsByCategory, getRestaurantById } from '@shared/utils/restaurantHelpers';

const filtered = filterRestaurantsByCategory(RESTAURANTS, id);
```

---

## 📚 Documentation

### Constants đã có sẵn:
- ✅ `DELIVERY_METHODS`
- ✅ `PAYMENT_METHODS`
- ✅ `DISCOUNTS`
- ✅ `RESTAURANTS`
- ✅ `CATEGORIES`
- ✅ `MENU_ITEMS`
- ✅ `DRIVERS`

### Hooks đã có sẵn:
- ✅ `useLogin`
- ✅ `useRegister`
- ✅ `useChangePassword`
- ✅ `useCheckout`
- ✅ `useQuantities`
- ✅ `useSearch`
- ✅ `useMapSelect`

### Services đã có sẵn:
- ✅ `authService`
- ✅ `restaurantAuthService`
- ✅ `adminAuthService`
- ✅ `orderService`
- ✅ `voucherService`
- ✅ `weatherService`
- ✅ `ownerMenuService`
- ✅ `ownerOrderService`
- ✅ `adminMetricsService`

### Utils đã có sẵn:
- ✅ `checkoutHelpers`
- ✅ `checkoutValidation`
- ✅ `cartHelpers`
- ✅ `loginValidation`
- ✅ `registerValidation`
- ✅ `passwordValidation`
- ✅ `searchHelpers`
- ✅ `formatters`
- ✅ `orderBuilder`
- ⚠️ `restaurantHelpers` (CẦN TẠO)

---

## 🎉 Kết luận

Có rất nhiều code có thể tối ưu! Việc sử dụng shared resources sẽ:

1. **Giảm code duplicate** đáng kể
2. **Tăng tính nhất quán** giữa Web & Mobile
3. **Dễ maintain** - fix 1 lần, áp dụng cho cả 2 platform
4. **Dễ test** - test shared functions thay vì test từng page
5. **Chuẩn hóa** logic business

**Ưu tiên:** Bắt đầu với CartPage và CategoryPage trước vì chúng có impact lớn nhất.
