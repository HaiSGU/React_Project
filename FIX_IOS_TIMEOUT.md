# 🔥 SỬA LỖI: "The request timed out" trên iOS

## ✅ ĐÃ SỬA XONG!

Tôi đã cấu hình Windows Firewall để cho phép iPhone kết nối.

## 🎯 Các bước tiếp theo

### Bước 1: Dừng Expo hiện tại
Trong terminal đang chạy `npx expo start`, nhấn **Ctrl+C** để dừng.

### Bước 2: Khởi động lại Expo
```powershell
cd Mobile
npx expo start -c
```

### Bước 3: Quét QR code lại trên iPhone
1. Mở **Camera app** trên iPhone
2. Quét QR code mới
3. Nhấn notification để mở Expo Go

### Bước 4: Đợi app load
Lần đầu tiên sẽ mất khoảng 10-30 giây để download bundle.

## ✅ Đã cấu hình

- ✅ Port 8081 (Expo Dev Server) - ĐÃ MỞ
- ✅ Port 3000 (Backend API) - ĐÃ MỞ
- ✅ IP đúng: 192.168.31.160

## 🐛 Nếu vẫn lỗi

### Kiểm tra 1: Backend có chạy không?
Mở Safari trên iPhone, truy cập:
```
http://192.168.31.160:3000
```
Nếu thấy trang web → Backend OK ✅

### Kiểm tra 2: Cùng WiFi?
- iPhone: Settings → WiFi → Xem tên WiFi
- Máy tính: Phải cùng WiFi đó

### Kiểm tra 3: Restart Expo
```powershell
# Dừng tất cả Node processes
Stop-Process -Name "node" -Force

# Khởi động lại
cd Mobile
npx expo start -c
```

### Kiểm tra 4: Restart iPhone
Đôi khi iPhone cache DNS, hãy:
1. Tắt WiFi trên iPhone
2. Bật lại WiFi
3. Quét QR code lại

## 📱 Lưu ý quan trọng

### KHÔNG dùng --tunnel
Bạn đã thử `npx expo start --tunnel` nhưng nó bị lỗi. 
**KHÔNG CẦN tunnel** vì:
- ✅ Bạn và iPhone đã cùng WiFi
- ✅ IP đã đúng
- ✅ Firewall đã được cấu hình

Chỉ cần dùng: `npx expo start` (không có --tunnel)

## 🎬 Quy trình hoàn chỉnh

```powershell
# Terminal 1: Backend (nếu chưa chạy)
cd Web
npm run dev

# Terminal 2: Mobile
cd Mobile
npx expo start -c
```

**Trên iPhone:**
1. Camera app
2. Quét QR code
3. Nhấn "Open in Expo Go"
4. Đợi app load (10-30 giây lần đầu)

## ✨ Kết quả mong đợi

Sau khi quét QR code, bạn sẽ thấy:
1. Expo Go app mở ra
2. Màn hình loading với logo FoodFast
3. App hiển thị trang chủ với danh sách nhà hàng

## 🎉 Hoàn thành!

Nếu làm theo các bước trên, app sẽ chạy thành công trên iPhone!

---

**Ghi chú**: Firewall đã được cấu hình vĩnh viễn, lần sau không cần làm lại.
