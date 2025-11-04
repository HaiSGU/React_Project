# Chức năng Chọn Vị Trí Trên Bản Đồ - Web

## 🎯 Tính năng đã triển khai

Đã triển khai thành công chức năng chọn vị trí trên bản đồ cho Web, tương tự như Mobile app, với các tính năng:

### ✅ Chức năng chính

1. **Hiển thị bản đồ** với OpenStreetMap (hoàn toàn miễn phí)
2. **Tự động lấy vị trí hiện tại** khi load trang
3. **Tìm kiếm địa chỉ** bằng Nominatim API (miễn phí)
4. **Click trên bản đồ** để chọn vị trí
5. **Hiển thị địa chỉ** từ tọa độ (reverse geocoding)
6. **Xác nhận và quay về checkout** với location đã chọn

### 📦 API miễn phí được sử dụng

- **OpenStreetMap Tiles**: Hiển thị bản đồ
- **Nominatim API**: 
  - Search địa chỉ
  - Reverse geocoding (tọa độ → địa chỉ)

### 📁 File đã tạo/cập nhật

1. **`Web/src/utils/locationService.js`** (MỚI)
   - Wrapper cho Geolocation API của trình duyệt
   - Tương thích với interface của `weatherService.js`

2. **`Web/src/pages/MapSelectPage/MapSelectPage.jsx`** (CẬP NHẬT)
   - Component chính cho trang chọn vị trí
   - Tích hợp với `weatherService` từ shared

3. **`Web/src/pages/MapSelectPage/MapSelectPage.css`** (MỚI)
   - Styling cho map select page

4. **`Web/src/pages/CheckoutPage/CheckoutPage.jsx`** (CẬP NHẬT)
   - Thêm nút chọn vị trí trên bản đồ
   - Nhận và hiển thị location từ map

5. **`Web/src/pages/CheckoutPage/CheckoutPage.css`** (CẬP NHẬT)
   - CSS cho nút map và location badge

6. **`Web/src/App.jsx`** (CẬP NHẬT)
   - Thêm route `/map-select`

### 🔧 Dependencies đã cài

```bash
npm install leaflet react-leaflet
```

## 🚀 Cách sử dụng

### 1. Từ trang Checkout

1. Click nút "Thay đổi" trong phần "Thông tin giao hàng"
2. Click icon bản đồ 🗺️ bên cạnh ô địa chỉ
3. Trang MapSelect sẽ mở ra

### 2. Trên trang MapSelect

1. **Tự động lấy vị trí hiện tại** (nếu cho phép)
2. **Tìm kiếm địa chỉ**:
   - Nhập địa chỉ vào ô search
   - Click 🔍 hoặc Enter
   - Chọn kết quả từ danh sách
3. **Click trên bản đồ** để chọn vị trí mới
4. Click "Xác nhận vị trí" để quay về checkout

### 3. Quay về Checkout

- Địa chỉ sẽ tự động điền vào ô địa chỉ
- Hiển thị badge "📍 Đã chọn vị trí từ bản đồ"
- Có thể xóa và chọn lại

## 🔄 Tái sử dụng cho Mobile

Service `shared/services/weatherService.js` đã được thiết kế để dùng chung cho cả Web và Mobile:

### Web
```javascript
import { getCurrentLocation } from '@shared/services/weatherService';
import { locationService } from '../../utils/locationService';

const result = await getCurrentLocation(locationService);
```

### Mobile (React Native)
```javascript
import * as Location from 'expo-location';
import { getCurrentLocation } from '@shared/services/weatherService';

const mobileLocationService = {
  requestPermission: () => Location.requestForegroundPermissionsAsync(),
  getCurrentPosition: () => Location.getCurrentPositionAsync({}),
};

const result = await getCurrentLocation(mobileLocationService);
```

## ⚠️ Lưu ý

### Giới hạn API
- **Nominatim** có giới hạn 1 request/giây
- Nếu cần nhiều hơn, có thể:
  - Tự host Nominatim server
  - Dùng MapBox (có free tier)
  - Dùng Google Maps API (trả phí)

### Browser Permission
- Web sẽ hỏi permission để truy cập vị trí
- Người dùng có thể từ chối → app vẫn hoạt động bình thường với vị trí mặc định

### HTTPS Requirement
- Geolocation API chỉ hoạt động trên HTTPS hoặc localhost
- Khi deploy production, đảm bảo site dùng HTTPS

## 🎨 Customization

### Thay đổi vị trí mặc định
```javascript
// MapSelectPage.jsx, dòng 58-60
const [center, setCenter] = useState([
  currentLat ? parseFloat(currentLat) : 10.7769, // Latitude mặc định
  currentLng ? parseFloat(currentLng) : 106.7009, // Longitude mặc định
]);
```

### Thay đổi icon marker
```javascript
// MapSelectPage.jsx, dòng 15-19
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'URL_TO_YOUR_ICON_2x.png',
  iconUrl: 'URL_TO_YOUR_ICON.png',
  shadowUrl: 'URL_TO_SHADOW.png',
});
```

### Thay đổi tile provider
```jsx
{/* MapSelectPage.jsx, dòng 167-170 */}
<TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  // Có thể thay bằng:
  // - CartoDB: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
  // - Stamen: "https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png"
/>
```

## 🐛 Troubleshooting

### Map không hiển thị
1. Kiểm tra CSS của Leaflet đã import chưa: `import 'leaflet/dist/leaflet.css'`
2. Kiểm tra container có height chưa
3. Xem Console có lỗi CORS không

### Icon marker không hiển thị
- Đã fix bằng cách override icon URLs (dòng 14-20 trong MapSelectPage.jsx)

### Search không hoạt động
- Kiểm tra kết nối internet
- Kiểm tra Console có lỗi API không
- Nominatim có thể bị rate limit nếu search quá nhanh

## 📚 Tài liệu tham khảo

- [Leaflet Documentation](https://leafletjs.com/)
- [React-Leaflet](https://react-leaflet.js.org/)
- [Nominatim API](https://nominatim.org/release-docs/develop/api/Overview/)
- [OpenStreetMap](https://www.openstreetmap.org/)
