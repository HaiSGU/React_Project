# Tối Ưu Checkout Page với Shared Resources

## 📦 Đã tái sử dụng từ `shared/`

### 1. **Constants**

#### ✅ `shared/constants/DeliveryMethods.js`
**Trước:**
```javascript
// Hard-coded trong CheckoutPage.jsx
const DELIVERY_METHODS = [
  { key: 'fast', label: 'Nhanh', fee: 25000, time: '30 phút' },
  { key: 'standard', label: 'Tiêu chuẩn', fee: 15000, time: '45 phút' },
  { key: 'economy', label: 'Tiết kiệm', fee: 10000, time: '60 phút' },
];
```

**Sau:**
```javascript
import { DELIVERY_METHODS } from '../../../../shared/constants/DeliveryMethods';
```

**Lợi ích:**
- ✅ Có thêm phương thức `express` (Siêu tốc - 20 phút)
- ✅ Có icon cho mỗi phương thức (🚀🏃🚴🚶)
- ✅ Có description chi tiết
- ✅ Có helper function `getDeliveryMethodByKey()`

---

#### ✅ `shared/constants/PaymentMethods.js`
**Trước:**
```javascript
const PAYMENT_METHODS = [
  { key: 'cash', label: 'Tiền mặt', icon: '💵' },
  { key: 'qr', label: 'QR Code', icon: '📱' },
  { key: 'card', label: 'Thẻ', icon: '💳' },
];
```

**Sau:**
```javascript
import { PAYMENT_METHODS } from '../../../../shared/constants/PaymentMethods';
```

**Lợi ích:**
- ✅ Có thêm phương thức `ewallet` (Ví điện tử)
- ✅ Có description cho mỗi phương thức
- ✅ Có helper function `getPaymentMethodByKey()`

---

#### ✅ `shared/constants/DiscountList.js`
**Trước:**
```javascript
// Hard-coded vouchers
const VOUCHERS = [
  { key: 'FREESHIP', label: 'FREESHIP', ... },
  { key: 'GIAM10', label: 'GIẢM 10%', ... },
  { key: 'GIAM20', label: 'GIẢM 20%', ... },
];
```

**Sau:**
```javascript
import { DISCOUNTS } from '../../../../shared/constants/DiscountList';
```

**Lợi ích:**
- ✅ Có thêm `GIẢM 30%`
- ✅ Có thông tin `restaurants` - danh sách nhà hàng áp dụng
- ✅ Chuẩn hóa format cho cả Web & Mobile

---

### 2. **Utils - Helper Functions**

#### ✅ `shared/utils/checkoutHelpers.js`

**Trước - Logic rải rác:**
```javascript
// Tính subtotal
const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);

// Tính shipping fee
const selectedDelivery = DELIVERY_METHODS.find(d => d.key === deliveryMethod);
const baseShippingFee = selectedDelivery ? selectedDelivery.fee : 15000;

// Tính discount thủ công
let itemDiscount = 0;
let shippingDiscount = 0;
if (selectedVoucher) {
  if (selectedVoucher.type === 'percentage') {
    itemDiscount = Math.round(subtotal * selectedVoucher.value / 100);
  } else if (selectedVoucher.type === 'fixed') {
    itemDiscount = selectedVoucher.value;
  } else if (selectedVoucher.type === 'shipping') {
    shippingDiscount = Math.round(shippingFee * selectedVoucher.value / 100);
  }
}

// Weather adjustment
let weatherAdjustment = 0;
let weatherNote = '';
if (weather.condition === 'rain') {
  weatherAdjustment = 5000;
  weatherNote = '🌧️ Phụ phí thời tiết xấu';
} else if (weather.condition === 'storm') {
  weatherAdjustment = 10000;
  weatherNote = '⛈️ Phụ phí bão';
}
```

**Sau - Clean & Reusable:**
```javascript
import { 
  calculateSubtotal,
  calculateShippingFee,
  calculateDiscountAmount,
  calculateTotalPrice,
  adjustShippingForWeather
} from '../../../../shared/utils/checkoutHelpers';

const subtotal = calculateSubtotal(orderItems);
const baseShippingFee = calculateShippingFee(deliveryMethod);

const weatherAdjustment = adjustShippingForWeather(baseShippingFee, weather.condition);
const shippingFee = weatherAdjustment.fee;

const { itemDiscount, shippingDiscount } = calculateDiscountAmount(
  selectedDiscount, 
  subtotal, 
  shippingFee
);

const totalPrice = calculateTotalPrice(subtotal, shippingFee, itemDiscount, shippingDiscount);
```

**Lợi ích:**
- ✅ Code ngắn gọn, dễ đọc
- ✅ Logic tính toán nhất quán
- ✅ Dễ test
- ✅ Dùng chung cho Mobile

**Available functions:**
```javascript
calculateSubtotal(items)
calculateShippingFee(deliveryMethod)
calculateEstimatedTime(deliveryMethod)
calculateDiscountAmount(discount, subtotal, shippingFee)
calculateTotalPrice(subtotal, shippingFee, itemDiscount, shippingDiscount)
adjustShippingForWeather(baseShippingFee, weatherCondition)
canApplyDiscount(discount, restaurantId)
```

---

#### ✅ `shared/utils/checkoutValidation.js`

**Trước - Validation thủ công:**
```javascript
if (!fullName.trim()) {
  alert('⚠️ Vui lòng nhập họ tên');
  return;
}
if (!phone.trim()) {
  alert('⚠️ Vui lòng nhập số điện thoại');
  return;
}
if (!address.trim()) {
  alert('⚠️ Vui lòng nhập địa chỉ giao hàng');
  return;
}
```

**Sau - Validation chuẩn:**
```javascript
import { validateCheckoutInfo } from '../../../../shared/utils/checkoutValidation';

const validationResult = validateCheckoutInfo(fullName, phone, address, orderItems);
if (!validationResult.valid) {
  alert(`⚠️ ${validationResult.error}`);
  return;
}
```

**Lợi ích:**
- ✅ Validation đầy đủ (tên >= 2 ký tự, SĐT VN regex, địa chỉ >= 10 ký tự)
- ✅ Message lỗi chuẩn hóa
- ✅ Có validate cart rỗng
- ✅ Dùng chung cho Mobile

**Available functions:**
```javascript
validateFullName(fullName)
validatePhone(phone)
validateAddress(address)
validateCart(cart)
validateCheckoutInfo(fullName, phone, address, cart)
```

---

### 3. **Hooks (Optional - có thể dùng sau)**

#### `shared/hooks/useCheckout.js`

Đây là custom hook đã có sẵn nhưng chưa áp dụng vào Web (có thể refactor thêm):

```javascript
import { useCheckout } from '../../../../shared/hooks/useCheckout';

const {
  fullName, setFullName,
  phone, setPhone,
  address, setAddress,
  deliveryMethod, setDeliveryMethod,
  paymentMethod, setPaymentMethod,
  discount, setDiscount,
  subtotal,
  shippingFee,
  itemDiscount,
  shippingDiscount,
  totalPrice,
  validate,
  reset,
  error,
} = useCheckout(orderItems);
```

**Lợi ích nếu dùng:**
- ✅ Tất cả state & logic trong 1 hook
- ✅ Auto-calculate prices
- ✅ Built-in validation
- ✅ Reset function

---

### 4. **Services (Có thể mở rộng)**

#### `shared/services/voucherService.js`

Hiện tại Web đang dùng hard-coded vouchers. Có thể nâng cấp để:

```javascript
import { 
  getRestaurantVouchers, 
  applyVoucher 
} from '../../../../shared/services/voucherService';

// Lấy vouchers theo restaurant
const vouchers = getRestaurantVouchers(restaurantId, localStorage);

// Áp dụng voucher
const result = applyVoucher(restaurantId, voucherCode, orderTotal, localStorage);
if (result.success) {
  setDiscount(result.discount);
}
```

---

## 📊 Kết quả tối ưu

### Code giảm:
- **Trước:** ~150 dòng logic tính toán & validation
- **Sau:** ~30 dòng (import + gọi functions)
- **Giảm:** ~80% code boilerplate

### Tính năng tăng:
- ✅ Thêm phương thức giao hàng "Siêu tốc"
- ✅ Thêm phương thức thanh toán "Ví điện tử"
- ✅ Thêm discount "GIẢM 30%"
- ✅ Icon cho delivery methods
- ✅ Validation SĐT VN chuẩn (regex)
- ✅ Weather adjustment tốt hơn

### Code quality:
- ✅ DRY (Don't Repeat Yourself)
- ✅ Single Source of Truth
- ✅ Testable functions
- ✅ Consistent với Mobile app

---

## 🎯 Tiếp theo có thể làm

1. **Dùng `useCheckout` hook** để đơn giản hóa state management
2. **Tích hợp `voucherService`** để lưu vouchers vào localStorage
3. **Dùng `orderService`** để tạo order
4. **Thêm weather integration** thực sự với `weatherService`
5. **Sync data** giữa Web & Mobile qua shared storage

---

## 🔧 Migration checklist

- [x] Import DELIVERY_METHODS từ shared
- [x] Import PAYMENT_METHODS từ shared
- [x] Import DISCOUNTS từ shared
- [x] Dùng calculateSubtotal
- [x] Dùng calculateShippingFee
- [x] Dùng calculateDiscountAmount
- [x] Dùng calculateTotalPrice
- [x] Dùng adjustShippingForWeather
- [x] Dùng validateCheckoutInfo
- [x] Update CSS cho icon delivery methods
- [ ] Optional: Dùng useCheckout hook
- [ ] Optional: Tích hợp voucherService
- [ ] Optional: Tích hợp orderService

---

## 📚 Files đã sửa

1. **Web/src/pages/CheckoutPage/CheckoutPage.jsx**
   - Import constants từ shared
   - Import utils từ shared
   - Thay thế logic tính toán
   - Thay thế validation

2. **Web/src/pages/CheckoutPage/CheckoutPage.css**
   - Thêm style cho `.option-icon`
   - Update layout `.option-main`
