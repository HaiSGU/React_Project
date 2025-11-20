# 🔄 HƯỚNG DẪN: Đồng bộ dữ liệu Admin - Web - Mobile

## 🎯 Vấn đề hiện tại

Bạn có **3 nguồn dữ liệu riêng biệt**:

1. **localStorage** (Web & Admin) - Lưu local trên browser
2. **AsyncStorage** (Mobile) - Lưu local trên điện thoại  
3. **json-server** (Backend API) - File `Web/db.json`

→ **Không đồng bộ** giữa các nền tảng!

---

## ✅ Giải pháp: Sử dụng json-server làm Single Source of Truth

### Bước 1: Cập nhật db.json với đầy đủ thông tin

File `Web/db.json` hiện tại **THIẾU** các trường quan trọng cho restaurants:
- `status` (active/pending/suspended)
- `category` (fastfood/coffee/pizza)
- `isFeatured` (true/false)

**Cần thêm vào db.json:**

```json
{
  "restaurants": [
    {
      "id": "1",
      "name": "KFC",
      "address": "123 Lê Lợi, Quận 1, TP.HCM",
      "rating": 4.5,
      "image": "/images/restaurants/KFC.jpg",
      "category": "fastfood",
      "status": "active",
      "isFeatured": true
    },
    // ... tương tự cho 7 nhà hàng còn lại
  ]
}
```

### Bước 2: Cập nhật Services để dùng API

#### Web & Admin
Thay vì đọc từ `localStorage`, đọc từ API:

```javascript
// Thay vì:
const restaurants = JSON.parse(localStorage.getItem('restaurants'));

// Dùng:
const response = await fetch('http://localhost:3000/restaurants');
const restaurants = await response.json();
```

#### Mobile
Đã có `cloudSyncService` nhưng cần đảm bảo dùng đúng:

```typescript
// Mobile/app/_layout.tsx đã cấu hình:
const API_BASE_URL = 'http://192.168.31.160:3000';
```

---

## 🔧 Cách thực hiện

### Option 1: Tự động đồng bộ (Khuyến nghị)

Tạo script để sync localStorage → db.json:

```javascript
// sync-to-db.js
const fs = require('fs');

// Đọc dữ liệu từ localStorage (copy từ browser console)
const restaurants = [
  {
    id: "1",
    name: "KFC",
    address: "123 Lê Lợi, Quận 1, TP.HCM",
    rating: 4.5,
    image: "/images/restaurants/KFC.jpg",
    category: "fastfood",
    status: "active",
    isFeatured: true
  },
  // ... 7 nhà hàng khác
];

// Đọc db.json hiện tại
const db = JSON.parse(fs.readFileSync('./Web/db.json', 'utf8'));

// Cập nhật restaurants
db.restaurants = restaurants;

// Ghi lại
fs.writeFileSync('./Web/db.json', JSON.stringify(db, null, 2));
console.log('✅ Đã đồng bộ restaurants vào db.json');
```

### Option 2: Thủ công

1. Mở Admin Dashboard
2. Mở Browser Console (F12)
3. Chạy:
```javascript
// Lấy dữ liệu từ localStorage
const restaurants = JSON.parse(localStorage.getItem('restaurants'));
console.log(JSON.stringify(restaurants, null, 2));
```
4. Copy kết quả
5. Paste vào `Web/db.json`

---

## 📝 Cấu trúc db.json đầy đủ

```json
{
  "users": [...],
  "restaurants": [
    {
      "id": "1",
      "name": "KFC",
      "address": "123 Lê Lợi, Quận 1, TP.HCM",
      "rating": 4.5,
      "image": "/images/restaurants/KFC.jpg",
      "category": "fastfood",
      "status": "active",
      "isFeatured": true
    },
    {
      "id": "2",
      "name": "Lotteria",
      "address": "45 Võ Văn Tần, Quận 3, TP.HCM",
      "rating": 4.4,
      "image": "/images/restaurants/Lotteria.jpg",
      "category": "fastfood",
      "status": "pending",
      "isFeatured": true
    },
    {
      "id": "3",
      "name": "McDonald's",
      "address": "12 Nguyễn Tri Phương, Quận 10, TP.HCM",
      "rating": 4.6,
      "image": "/images/restaurants/McDonald.jpg",
      "category": "fastfood",
      "status": "active",
      "isFeatured": true
    },
    {
      "id": "4",
      "name": "Highlands Coffee",
      "address": "22 Nguyễn Trãi, Quận 5, TP.HCM",
      "rating": 4.3,
      "image": "/images/restaurants/Highlands.jpg",
      "category": "coffee/tea",
      "status": "active",
      "isFeatured": true
    },
    {
      "id": "5",
      "name": "The Coffee House",
      "address": "60 Nguyễn Thị Minh Khai, Quận 3, TP.HCM",
      "rating": 4.4,
      "image": "/images/restaurants/CoffeeHouse.jpg",
      "category": "coffee",
      "status": "active",
      "isFeatured": true
    },
    {
      "id": "6",
      "name": "Starbucks",
      "address": "88 Điện Biên Phủ, Bình Thạnh, TP.HCM",
      "rating": 4.5,
      "image": "/images/restaurants/Starbucks.jpg",
      "category": "coffee",
      "status": "active",
      "isFeatured": false
    },
    {
      "id": "7",
      "name": "Pizza Hut",
      "address": "101 Phạm Văn Đồng, TP.Thủ Đức",
      "rating": 4.2,
      "image": "/images/restaurants/PizzaHut.jpg",
      "category": "pizza",
      "status": "active",
      "isFeatured": false
    },
    {
      "id": "8",
      "name": "Burger King",
      "address": "55 Quang Trung, Gò Vấp, TP.HCM",
      "rating": 4.3,
      "image": "/images/restaurants/BurgerKing.jpg",
      "category": "fastfood",
      "status": "pending",
      "isFeatured": false
    }
  ],
  "menus": [...],
  "orders": [...],
  "shippers": [
    {
      "id": 1,
      "name": "Nguyễn Thành Đạt",
      "rating": 4.9,
      "vehicle": "SH 150i",
      "phone": "0901000001",
      "status": "active",
      "totalAssigned": 5,
      "totalDeliveries": 5,
      "earnings": 125000
    },
    // ... thêm shippers
  ]
}
```

---

## 🔄 Cập nhật Services

### 1. adminMetricsService.js

```javascript
// Thêm hàm fetch từ API
export const getRestaurantsFromAPI = async (baseUrl = 'http://localhost:3000') => {
  try {
    const response = await fetch(`${baseUrl}/restaurants`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch restaurants:', error);
    return [];
  }
};

export const updateRestaurantStatusAPI = async (restaurantId, status, baseUrl = 'http://localhost:3000') => {
  try {
    const response = await fetch(`${baseUrl}/restaurants/${restaurantId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return { success: true, data: await response.json() };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

### 2. AdminDashboard.jsx

```javascript
// Thay vì:
const restaurants = getRestaurants(localStorage);

// Dùng:
const [restaurants, setRestaurants] = useState([]);

useEffect(() => {
  const fetchRestaurants = async () => {
    const data = await getRestaurantsFromAPI();
    setRestaurants(data);
  };
  fetchRestaurants();
}, []);
```

---

## 🎯 Kết quả sau khi đồng bộ

### ✅ Admin Dashboard
- Đọc/ghi từ json-server
- Cập nhật trạng thái nhà hàng → Lưu vào db.json
- Realtime sync với Web và Mobile

### ✅ Web App
- Hiển thị danh sách nhà hàng từ API
- Cập nhật khi Admin thay đổi
- Không cần refresh

### ✅ Mobile App
- Fetch dữ liệu từ API (đã cấu hình)
- Hiển thị cùng dữ liệu với Web
- Đồng bộ realtime

---

## 🚀 Quick Start

### Bước 1: Cập nhật db.json
```bash
# Tạo file sync-restaurants.js với nội dung trên
node sync-restaurants.js
```

### Bước 2: Restart json-server
```bash
npx json-server --watch Web/db.json --port 3000
```

### Bước 3: Test API
```bash
# Lấy danh sách nhà hàng
curl http://localhost:3000/restaurants

# Cập nhật trạng thái
curl -X PATCH http://localhost:3000/restaurants/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"active"}'
```

### Bước 4: Cập nhật Admin Dashboard
- Thay đổi services để dùng API
- Test trên browser

### Bước 5: Test trên Mobile
- Mở app trên điện thoại
- Kiểm tra danh sách nhà hàng
- Thay đổi trạng thái trên Admin → Refresh app → Thấy thay đổi

---

## 📊 So sánh

| Tính năng | Trước (localStorage) | Sau (json-server) |
|-----------|---------------------|-------------------|
| Đồng bộ | ❌ Không | ✅ Có |
| Realtime | ❌ Không | ✅ Có (với polling) |
| Multi-device | ❌ Không | ✅ Có |
| Persistence | ⚠️ Local only | ✅ Centralized |
| API | ❌ Không | ✅ RESTful API |

---

## ⚠️ Lưu ý

1. **Development**: json-server đủ dùng
2. **Production**: Cần migrate sang database thực (MongoDB, PostgreSQL, Firebase)
3. **Realtime**: Hiện tại dùng polling, có thể nâng cấp lên WebSocket
4. **Authentication**: Cần thêm JWT token cho API security

---

## 🎯 Bạn muốn tôi làm gì?

1. ✅ **Tạo script sync** để tự động cập nhật db.json?
2. ✅ **Cập nhật services** để dùng API thay vì localStorage?
3. ✅ **Test đồng bộ** giữa Admin, Web và Mobile?

Hãy cho tôi biết bạn muốn bắt đầu từ đâu! 🚀
