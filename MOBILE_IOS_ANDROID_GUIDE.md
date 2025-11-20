# 📱 HƯỚNG DẪN: Chạy Mobile App trên iOS và Android

## ✅ Câu trả lời nhanh

**KHÔNG CẦN dùng `--tunnel`!** Chỉ cần:
1. Cùng WiFi
2. Chạy `npx expo start`
3. Quét QR code

## 🎯 Cách chạy đúng

### Bước 1: Khởi động Backend
```powershell
# Terminal 1
cd Web
npm run dev
```
Backend sẽ chạy tại: `http://192.168.31.160:3000`

### Bước 2: Khởi động Mobile App

**Cách 1: Dùng script tự động (Khuyến nghị)**
```powershell
# Terminal 2 - Từ thư mục gốc
.\start-mobile.ps1
```

**Cách 2: Thủ công**
```powershell
# Terminal 2
cd Mobile
npx expo start -c
```

### Bước 3: Kết nối từ điện thoại

#### 📱 Trên iOS (iPhone/iPad):
1. **Mở Camera app** (ứng dụng Camera mặc định)
2. **Quét QR code** hiển thị trên terminal
3. **Nhấn vào notification** "Open in Expo Go"
4. App sẽ tự động mở trong Expo Go

#### 🤖 Trên Android:
1. **Mở Expo Go app** (tải từ Play Store nếu chưa có)
2. **Nhấn "Scan QR Code"**
3. **Quét QR code** hiển thị trên terminal
4. App sẽ tự động load

## ⚠️ YÊU CẦU QUAN TRỌNG

### ✅ Checklist trước khi chạy:
- [ ] Điện thoại và máy tính **CÙNG MẠNG WiFi**
- [ ] Đã cài **Expo Go** app trên điện thoại
  - iOS: https://apps.apple.com/app/expo-go/id982107779
  - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
- [ ] Backend đang chạy (Web/npm run dev)
- [ ] Đã cấu hình IP đúng trong `Mobile/app/_layout.tsx`

### 🔍 Kiểm tra IP hiện tại:
```powershell
ipconfig
```
Tìm dòng "IPv4 Address" → Đó là IP của bạn (ví dụ: 192.168.31.160)

## 🚫 Khi NÀO cần `--tunnel`?

Chỉ dùng `--tunnel` trong các trường hợp đặc biệt:
- ❌ Điện thoại và máy tính **KHÔNG cùng WiFi**
- ❌ Mạng công ty có firewall chặn kết nối local
- ❌ Muốn test từ xa (ví dụ: bạn ở nhà, điện thoại ở công ty)

**Nhược điểm của tunnel:**
- 🐌 Chậm hơn nhiều
- 🔌 Phụ thuộc vào dịch vụ Expo (có thể bị lỗi)
- 💰 Giới hạn bandwidth

## 🎬 Quy trình hoàn chỉnh

### Lần đầu tiên:
```powershell
# 1. Cấu hình Firewall (chỉ làm 1 lần)
.\setup-firewall.ps1

# 2. Kiểm tra IP
ipconfig

# 3. Cập nhật IP trong Mobile/app/_layout.tsx
# const LOCAL_IP = 'ĐỊA_CHỈ_IP_CỦA_BẠN';
```

### Mỗi lần chạy:
```powershell
# Terminal 1: Backend
cd Web
npm run dev

# Terminal 2: Mobile
.\start-mobile.ps1
# Hoặc: cd Mobile && npx expo start -c
```

### Trên điện thoại:
- **iOS**: Camera → Quét QR → Mở Expo Go
- **Android**: Expo Go → Scan QR Code

## 🐛 Troubleshooting

### "Port 8081 is being used"
```powershell
# Dừng tất cả Node processes
Stop-Process -Name "node" -Force
# Sau đó chạy lại
npx expo start -c
```

### "Unable to resolve asset"
✅ **ĐÃ SỬA**: Đã cập nhật đường dẫn logo trong `app.json`

### "Network request failed"
- ✅ Kiểm tra cùng WiFi
- ✅ Kiểm tra backend đang chạy: `http://192.168.31.160:3000`
- ✅ Kiểm tra IP trong `_layout.tsx`
- ✅ Kiểm tra Firewall: `.\setup-firewall.ps1`

### "Unable to connect to Metro"
```powershell
# Clear cache và restart
cd Mobile
npx expo start -c
```

### QR code không quét được
- ✅ Đảm bảo QR code hiển thị rõ ràng
- ✅ Thử zoom in/out terminal
- ✅ Hoặc nhập URL thủ công trong Expo Go:
  ```
  exp://192.168.31.160:8081
  ```

## 📊 So sánh các phương thức

| Phương thức | Tốc độ | Ổn định | Yêu cầu | Khuyến nghị |
|-------------|--------|---------|---------|-------------|
| **LAN (mặc định)** | ⚡⚡⚡ Rất nhanh | ✅ Cao | Cùng WiFi | ⭐⭐⭐⭐⭐ |
| **Tunnel** | 🐌 Chậm | ⚠️ Trung bình | Internet | ⭐⭐ |
| **USB (Dev Client)** | ⚡⚡ Nhanh | ✅ Cao | Cáp USB | ⭐⭐⭐⭐ |

## 🎯 Kết luận

**Để chạy trên iOS:**
1. ✅ Dùng `npx expo start` (KHÔNG cần --tunnel)
2. ✅ Quét QR bằng Camera app
3. ✅ Mở trong Expo Go

**Đơn giản vậy thôi!** 🎉

---

**Lưu ý**: Nếu vẫn gặp vấn đề, chạy script kiểm tra:
```powershell
.\check-mobile-setup.ps1
```
