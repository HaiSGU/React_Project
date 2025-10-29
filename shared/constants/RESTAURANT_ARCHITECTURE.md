# Restaurant Data Architecture

## Cấu trúc dữ liệu nhà hàng (Restaurant Data Structure)

### 📁 Files Organization

```
shared/
  └── constants/
      ├── RestaurantsData.js       # ✅ SINGLE SOURCE OF TRUTH - Platform-agnostic data
      └── RestaurantsList.js       # 📱 Mobile resolver (require() cho React Native)

Web/
  └── src/
      └── utils/
          └── restaurantResolver.js  # 🌐 Web resolver (ES6 import cho Vite)
```

## 🎯 Giải pháp cho vấn đề Web (Vite) vs Mobile (Expo)

### Vấn đề
- **Mobile (Expo/Metro)**: Chỉ hỗ trợ `require()` để load assets
- **Web (Vite)**: Chỉ hỗ trợ ES6 `import` để load assets
- ❌ Không thể dùng chung 1 file với `require()` hoặc `import`

### Giải pháp: Resolver Pattern
1. **RestaurantsData.js** - Dữ liệu thuần túy (pure data)
   - Chứa tất cả thông tin nhà hàng
   - Không có dependencies
   - Dùng `imageName` thay vì `image: require(...)`
   
2. **RestaurantsList.js** - Mobile resolver
   - Import data từ `RestaurantsData.js`
   - Map `imageName` → `require()` cho Metro bundler
   - Export `RESTAURANTS` với `image` đã resolve
   
3. **restaurantResolver.js** - Web resolver
   - Import data từ `RestaurantsData.js`
   - Map `imageName` → ES6 import cho Vite
   - Export `RESTAURANTS` với `image` đã resolve

## 📝 Cách thêm nhà hàng mới

### Bước 1: Thêm ảnh vào folder
```
shared/assets/images/restaurant/
  └── NewRestaurant.png  (hoặc .jpg)
```

### Bước 2: Cập nhật RestaurantsData.js
```javascript
// shared/constants/RestaurantsData.js
export const RESTAURANTS_DATA = [
  // ... các nhà hàng cũ
  {
    id: 21,
    name: "New Restaurant",
    category: 'fastfood',
    imageName: 'NewRestaurant.png',  // ⚠️ Tên file ảnh
    address: "123 Street, District",
    rating: 4.5,
    menu: [],
    isFeatured: true,
    coordinates: {
      latitude: 10.7769,
      longitude: 106.7009
    }
  }
];
```

### Bước 3: Cập nhật IMAGE_REQUIRE_MAP (Mobile)
```javascript
// shared/constants/RestaurantsList.js
const IMAGE_REQUIRE_MAP = {
  // ... các ảnh cũ
  'NewRestaurant.png': require('../assets/images/restaurant/NewRestaurant.png'),
};
```

### Bước 4: Cập nhật IMAGE_IMPORT_MAP (Web)
```javascript
// Web/src/utils/restaurantResolver.js

// 4a. Import ảnh
import NewRestaurantImg from '../../../shared/assets/images/restaurant/NewRestaurant.png';

// 4b. Thêm vào map
const IMAGE_IMPORT_MAP = {
  // ... các ảnh cũ
  'NewRestaurant.png': NewRestaurantImg,
};
```

## ✅ Lợi ích

1. **Single Source of Truth**: Chỉ cần sửa data ở 1 nơi (RestaurantsData.js)
2. **Platform Compatible**: Mobile dùng require(), Web dùng import
3. **Easy Maintenance**: Rõ ràng file nào làm gì
4. **No Duplication**: Không duplicate dữ liệu nhà hàng

## 🔍 Import Usage

### Mobile (React Native/Expo)
```javascript
import { RESTAURANTS } from '@shared/constants/RestaurantsList';
```

### Web (React/Vite)
```javascript
import { RESTAURANTS } from '../../utils/restaurantResolver';
```

## 📊 Data Flow

```
RestaurantsData.js (imageName: 'Jollibee.png')
        ↓
    ┌───┴───┐
    ↓       ↓
Mobile    Web
    ↓       ↓
require() import
    ↓       ↓
image     image
```

## 🚀 Current Status

✅ RestaurantsData.js - Created (20 restaurants)
✅ RestaurantsList.js - Updated to Mobile resolver
✅ restaurantResolver.js - Created for Web
✅ RestaurantDashboard.jsx - Updated to use Web resolver
✅ Mobile imports - Verified (4 files working)

## 📱 Mobile Import Locations (Verified)
- Mobile/app/(tabs)/index.jsx
- Mobile/app/category/[key].jsx
- Mobile/app/discount/[type].jsx

## 🌐 Web Import Locations (Verified)
- Web/src/pages/RestaurantDashboard/RestaurantDashboard.jsx
