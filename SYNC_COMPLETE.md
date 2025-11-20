# ✅ HOÀN TẤT: Hệ thống đồng bộ dữ liệu

## 🎉 Đã thực hiện

### 1. ✅ Cập nhật db.json
- Thêm đầy đủ thông tin cho 8 nhà hàng:
  - `category` (fastfood, coffee, pizza)
  - `status` (active, pending, suspended)
  - `isFeatured` (true/false)
  - Địa chỉ chi tiết

### 2. ✅ Tạo Services đồng bộ
- **`restaurantSyncService.js`**: Service chính để sync với API
- **`adminSyncService.js`**: Wrapper cho Admin Dashboard

### 3. ✅ json-server đang chạy
- Port: 3000
- URL: http://localhost:3000 hoặc http://192.168.31.160:3000
- Auto-reload khi db.json thay đổi

---

## 🚀 Cách sử dụng

### Cho Admin Dashboard

Thêm vào `AdminDashboard.jsx`:

```javascript
import { syncRestaurantsForAdmin, updateRestaurantStatusForAdmin } from '@shared/services/adminSyncService';

export default function AdminDashboard() {
  // ... existing code ...
  
  const refresh = async () => {
    // Sync từ API
    await syncRestaurantsForAdmin(localStorage);
    
    // Sau đó load dữ liệu như bình thường
    const overview = getAdminOverview(localStorage);
    setStats(overview);
    setRestaurants(getRestaurants(localStorage));
    // ...
  };
  
  const handleRestaurantStatusChange = async (restaurantId, newStatus) => {
    setAnimatingRow(`restaurant-${restaurantId}`);
    
    // Update qua API
    const result = await updateRestaurantStatusForAdmin(restaurantId, newStatus, localStorage);
    
    if (result.success) {
      showToast(`✅ Đã cập nhật nhà hàng!`);
      refresh(); // Refresh để lấy dữ liệu mới
    } else {
      showToast(`❌ Lỗi: ${result.error}`, 'error');
    }
    
    setTimeout(() => setAnimatingRow(null), 500);
  };
  
  // Auto-sync mỗi 30 giây
  useEffect(() => {
    const interval = setInterval(() => {
      syncRestaurantsForAdmin(localStorage);
    }, 30000);
    return () => clearInterval(interval);
  }, []);
}
```

### Cho Web App

Thêm vào `HomePage.jsx` hoặc component hiển thị restaurants:

```javascript
import { getRestaurants } from '@shared/services/restaurantSyncService';

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await getRestaurants(localStorage);
      setRestaurants(data);
    };
    fetchData();
  }, []);
  
  return (
    <div>
      {restaurants.map(restaurant => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
}
```

### Cho Mobile App

Mobile đã có `cloudSyncService` kết nối với API. Chỉ cần đảm bảo:

```typescript
// Mobile/app/_layout.tsx
const LOCAL_IP = '192.168.31.160'; // Đã cấu hình
const API_BASE_URL = `http://${LOCAL_IP}:3000`;

configureCloudSync({
  baseUrl: API_BASE_URL,
});
```

---

## 🧪 Test đồng bộ

### Test 1: Thay đổi từ Admin
1. Mở Admin Dashboard: `http://localhost:5174/admin`
2. Đăng nhập: `admin@foodfast.local` / `admin123`
3. Chuyển trạng thái một nhà hàng (ví dụ: Duyệt Lotteria)
4. Mở Web App: `http://localhost:5174`
5. Refresh → Thấy thay đổi
6. Mở Mobile App → Refresh → Thấy thay đổi

### Test 2: Kiểm tra API
```bash
# Lấy danh sách nhà hàng
curl http://localhost:3000/restaurants

# Cập nhật trạng thái
curl -X PATCH http://localhost:3000/restaurants/2 \
  -H "Content-Type: application/json" \
  -d '{"status":"active"}'

# Kiểm tra lại
curl http://localhost:3000/restaurants/2
```

### Test 3: Auto-sync
1. Mở Admin Dashboard
2. Mở Browser Console (F12)
3. Chạy:
```javascript
// Xem dữ liệu hiện tại
console.log(JSON.parse(localStorage.getItem('restaurants')));

// Sau 30 giây, check lại (auto-sync sẽ chạy)
setTimeout(() => {
  console.log('After auto-sync:', JSON.parse(localStorage.getItem('restaurants')));
}, 31000);
```

---

## 📊 Luồng dữ liệu

```
┌─────────────┐
│ json-server │ ← Single Source of Truth
│  (db.json)  │
└──────┬──────┘
       │
       ├─────────────┐
       │             │
       ▼             ▼
┌──────────┐   ┌──────────┐
│   Admin  │   │   Web    │
│Dashboard │   │   App    │
└──────────┘   └──────────┘
       │             │
       └──────┬──────┘
              │
       Sync via API
              │
              ▼
      ┌──────────────┐
      │  Mobile App  │
      └──────────────┘
```

---

## 🔄 Quy trình đồng bộ

### Khi Admin thay đổi trạng thái:
1. Admin click "Duyệt" hoặc "Tạm ngưng"
2. `updateRestaurantStatusForAdmin()` gọi API
3. API cập nhật `db.json`
4. `syncRestaurantsToLocalStorage()` fetch lại từ API
5. localStorage được cập nhật
6. UI refresh hiển thị dữ liệu mới

### Khi Web/Mobile load:
1. Component mount
2. `getRestaurants()` fetch từ API
3. Cache vào localStorage (Web) hoặc AsyncStorage (Mobile)
4. Hiển thị dữ liệu

### Auto-sync (mỗi 30 giây):
1. Timer trigger
2. `syncRestaurantsToLocalStorage()` fetch từ API
3. localStorage cập nhật
4. UI tự động refresh (nếu có listener)

---

## ⚙️ Cấu hình

### API URL
```javascript
// Development (localhost)
const API_BASE_URL = 'http://localhost:3000';

// Production hoặc test trên mobile
const API_BASE_URL = 'http://192.168.31.160:3000';
```

### Auto-sync interval
```javascript
// Mặc định: 30 giây
const SYNC_INTERVAL = 30000;

// Thay đổi nếu cần
const SYNC_INTERVAL = 60000; // 1 phút
```

---

## 🐛 Troubleshooting

### Lỗi: "Failed to fetch"
- ✅ Kiểm tra json-server đang chạy: `http://localhost:3000/restaurants`
- ✅ Kiểm tra Firewall (port 3000)
- ✅ Kiểm tra CORS (json-server mặc định cho phép)

### Dữ liệu không cập nhật
- ✅ Clear localStorage: `localStorage.clear()`
- ✅ Refresh browser: `Ctrl+F5`
- ✅ Kiểm tra db.json có đúng dữ liệu không

### Mobile không kết nối
- ✅ Kiểm tra IP trong `_layout.tsx`
- ✅ Kiểm tra cùng WiFi
- ✅ Test API từ browser điện thoại: `http://192.168.31.160:3000/restaurants`

---

## 📝 Checklist

### ✅ Đã hoàn thành
- [x] Cập nhật db.json với đầy đủ thông tin
- [x] Tạo restaurantSyncService.js
- [x] Tạo adminSyncService.js
- [x] json-server đang chạy

### 🔄 Cần làm tiếp
- [ ] Cập nhật AdminDashboard.jsx để dùng adminSyncService
- [ ] Cập nhật Web components để dùng restaurantSyncService
- [ ] Test đồng bộ giữa Admin - Web - Mobile
- [ ] Thêm loading states
- [ ] Thêm error handling

---

## 🎯 Kết quả mong đợi

Sau khi hoàn thành:
1. ✅ Admin thay đổi trạng thái → Lưu vào db.json
2. ✅ Web refresh → Thấy thay đổi
3. ✅ Mobile refresh → Thấy thay đổi
4. ✅ Auto-sync mỗi 30 giây
5. ✅ Dữ liệu nhất quán giữa 3 nền tảng

---

**Bạn muốn tôi giúp gì tiếp theo?**
1. Cập nhật AdminDashboard.jsx?
2. Test đồng bộ?
3. Thêm tính năng khác?
