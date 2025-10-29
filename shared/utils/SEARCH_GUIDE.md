# Search Functionality - Hướng dẫn sử dụng

## 📁 Cấu trúc

```
shared/
  └── hooks/
      └── useSearch.js           # Hook tìm kiếm (shared)
  └── utils/
      └── searchHelpers.js       # Helper functions (shared)

Mobile/
  └── components/
      └── SearchBar.jsx          # Search Bar component
  └── app/(tabs)/
      └── index.jsx              # Ví dụ sử dụng

Web/
  └── src/pages/SearchPage/
      └── SearchPage.jsx         # Ví dụ trang search
      └── SearchPage.css
```

## 🎯 Tính năng

### 1. Tìm kiếm nhà hàng theo:
- ✅ Tên nhà hàng (có bỏ dấu tiếng Việt)
- ✅ Địa chỉ
- ✅ Category (fastfood, coffee, milktea, etc.)
- ✅ **Món ăn** (tìm nhà hàng có món ăn matching)

### 2. Normalize tiếng Việt
- Tự động bỏ dấu để search dễ dàng hơn
- VD: "Phở" → "pho", "Cơm" → "com"

## 🚀 Cách sử dụng

### Mobile (React Native)

```jsx
import { useRestaurantSearch } from '@shared/hooks/useSearch';
import { RESTAURANTS } from '@shared/constants/RestaurantsList';
import { MENU_ITEMS } from '@shared/constants/MenuItems';
import SearchBar from '@/components/SearchBar';

function HomeScreen() {
  const { 
    query, 
    setQuery, 
    filteredRestaurants, 
    noResults 
  } = useRestaurantSearch(RESTAURANTS, MENU_ITEMS);

  return (
    <View>
      <SearchBar
        value={query}
        onChangeText={setQuery}
        onClear={() => setQuery('')}
        placeholder="Tìm nhà hàng, món ăn..."
      />
      
      {filteredRestaurants.map(restaurant => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </View>
  );
}
```

### Web (React)

```jsx
import { useRestaurantSearch } from '../../../shared/hooks/useSearch';
import { RESTAURANTS } from '../utils/restaurantResolver';
import { MENU_ITEMS } from '../../../shared/constants/MenuItems';

function SearchPage() {
  const { 
    query, 
    setQuery, 
    filteredRestaurants, 
    resultCount 
  } = useRestaurantSearch(RESTAURANTS, MENU_ITEMS);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tìm nhà hàng, món ăn..."
      />
      
      <p>Tìm thấy {resultCount} nhà hàng</p>
      
      {filteredRestaurants.map(restaurant => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
}
```

## 📖 API Reference

### `useRestaurantSearch(restaurants, menuItems)`

Hook tìm kiếm nhà hàng (hỗ trợ tìm cả món ăn).

**Parameters:**
- `restaurants` (Array): Danh sách nhà hàng
- `menuItems` (Array): Danh sách món ăn (optional)

**Returns:**
```javascript
{
  query: string,              // Query hiện tại
  setQuery: Function,         // Set query
  filteredRestaurants: Array, // Danh sách nhà hàng đã filter
  hasResults: boolean,        // Có kết quả không
  noResults: boolean,         // Không có kết quả
  resultCount: number         // Số lượng kết quả
}
```

### `useSearch(items, searchFields)`

Hook tìm kiếm chung (dùng cho bất kỳ data nào).

**Parameters:**
- `items` (Array): Danh sách items
- `searchFields` (Array): Các field cần search, vd: `['name', 'address']`

**Returns:**
```javascript
{
  query: string,
  setQuery: Function,
  filteredItems: Array,
  hasResults: boolean,
  noResults: boolean,
  resultCount: number
}
```

## 🔧 Helper Functions

### `searchRestaurantsAdvanced(restaurants, menuItems, query)`

Tìm nhà hàng theo tên/địa chỉ/category HOẶC món ăn.

```javascript
import { searchRestaurantsAdvanced } from '@shared/utils/searchHelpers';

const results = searchRestaurantsAdvanced(RESTAURANTS, MENU_ITEMS, 'phở');
// Trả về nhà hàng có tên "Phở Hòa" HOẶC có món ăn "Phở bò"
```

### `normalizeText(text)`

Bỏ dấu tiếng Việt.

```javascript
import { normalizeText } from '@shared/utils/searchHelpers';

normalizeText('Phở Hòa');  // → "pho hoa"
normalizeText('Cơm tấm');  // → "com tam"
```

### `searchRestaurants(restaurants, query)`

Tìm nhà hàng theo tên/địa chỉ/category (không tìm món ăn).

### `searchMenuItems(menuItems, query)`

Tìm món ăn theo tên/mô tả/category.

## 💡 Ví dụ

### Tìm nhà hàng có món "phở":
```javascript
const { filteredRestaurants } = useRestaurantSearch(RESTAURANTS, MENU_ITEMS);
setQuery('phở');

// Kết quả: 
// - Nhà hàng "Phở Hòa" (match tên)
// - Nhà hàng khác có món "Phở bò" (match món ăn)
```

### Tìm nhà hàng category "coffee":
```javascript
setQuery('coffee');

// Kết quả:
// - Highlands Coffee
// - The Coffee House
// - Phúc Long (category: ['coffee', 'milktea'])
```

### Tìm bất kỳ nhà hàng nào có từ "quận 1":
```javascript
setQuery('quận 1');

// Kết quả: Tất cả nhà hàng có địa chỉ chứa "Quận 1"
```

## ✅ Lợi ích

1. **Shared code**: Web và Mobile dùng chung logic
2. **Vietnamese support**: Tự động bỏ dấu tiếng Việt
3. **Multi-field search**: Tìm theo nhiều field cùng lúc
4. **Menu item search**: Tìm nhà hàng qua món ăn
5. **Performance**: Sử dụng useMemo để optimize
