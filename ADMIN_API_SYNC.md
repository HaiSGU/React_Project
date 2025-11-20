# 🔄 ĐỒNG BỘ ADMIN VỚI API

## ✅ Giải pháp đơn giản

Thay vì sửa code phức tạp, hãy làm theo cách này:

### Bước 1: Sync dữ liệu từ API vào localStorage

Mở Browser Console (F12) trên Admin Dashboard và chạy:

```javascript
// Fetch restaurants từ API
fetch('http://localhost:3000/restaurants')
  .then(res => res.json())
  .then(data => {
    // Lưu vào localStorage
    localStorage.setItem('restaurants', JSON.stringify(data));
    console.log('✅ Synced', data.length, 'restaurants from API');
    // Reload trang
    location.reload();
  });
```

### Bước 2: Khi thay đổi trạng thái

Sau khi click "Tạm ngưng" hoặc "Kích hoạt" trên Admin, chạy script này:

```javascript
// Lấy dữ liệu từ localStorage
const restaurants = JSON.parse(localStorage.getItem('restaurants'));

// Sync từng nhà hàng lên API
restaurants.forEach(async (restaurant) => {
  await fetch(`http://localhost:3000/restaurants/${restaurant.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(restaurant)
  });
});

console.log('✅ Synced all restaurants to API');
```

### Bước 3: Refresh Mobile/Web

Sau khi sync, refresh Mobile app và Web app để thấy thay đổi.

---

## 🎯 Quy trình hoàn chỉnh

### Lần đầu tiên:
1. Mở Admin Dashboard
2. F12 → Console
3. Chạy script Bước 1 (fetch từ API)
4. Trang sẽ reload với dữ liệu từ API

### Khi thay đổi trạng thái:
1. Click "Tạm ngưng" hoặc "Kích hoạt"
2. F12 → Console
3. Chạy script Bước 2 (sync lên API)
4. Refresh Mobile/Web app

---

## 📱 Test đồng bộ

### Test 1: Tạm ngưng KFC
1. Admin: Tạm ngưng KFC
2. Console: Chạy script sync
3. Mobile: Refresh → KFC biến mất khỏi danh sách

### Test 2: Kích hoạt Lotteria
1. Admin: Kích hoạt Lotteria
2. Console: Chạy script sync
3. Web: Refresh → Lotteria xuất hiện

---

## 🔧 Script tự động (Tùy chọn)

Tạo bookmark với code này để sync nhanh:

```javascript
javascript:(function(){
  const restaurants = JSON.parse(localStorage.getItem('restaurants'));
  Promise.all(restaurants.map(r => 
    fetch(`http://localhost:3000/restaurants/${r.id}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(r)
    })
  )).then(() => {
    alert('✅ Đã đồng bộ!');
  });
})();
```

Lưu bookmark này, mỗi khi thay đổi trạng thái, click bookmark là sync!

---

## ⚡ Giải pháp tốt hơn (Sau này)

Để tự động đồng bộ, cần sửa code AdminDashboard như đã thử ở trên, nhưng hiện tại file bị conflict.

**Tạm thời dùng script Console là nhanh nhất!**
