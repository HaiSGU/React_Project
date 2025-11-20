# 🌐 HƯỚNG DẪN: Chạy Expo Tunnel Mode

## ⚠️ Vấn đề với Tunnel Mode

Tunnel mode của Expo đang gặp lỗi trên hệ thống của bạn:
```
Error: could not connect to TCP port 5554
```

Nguyên nhân:
- Expo tunnel service không ổn định
- Conflict với Android SDK/emulator settings
- Firewall hoặc antivirus chặn

## 🎯 Giải pháp thay thế (KHUYẾN NGHỊ)

### Phương án 1: Dùng LAN mode (TỐT NHẤT)

**Ưu điểm:**
- ⚡ Nhanh nhất
- ✅ Ổn định nhất
- 🔒 An toàn nhất

**Cách làm:**
```powershell
cd Mobile
npx expo start
```

**Yêu cầu:**
- Điện thoại và máy tính CÙNG WiFi
- IP đã cấu hình đúng trong `_layout.tsx`

**Kết nối:**
- iOS: Camera app → Quét QR
- Android: Expo Go → Scan QR

---

### Phương án 2: Dùng Ngrok (Nếu THỰC SỰ cần tunnel)

Nếu bạn THỰC SỰ không thể cùng WiFi, dùng ngrok:

**Bước 1: Cài đặt ngrok**
```powershell
# Tải từ: https://ngrok.com/download
# Hoặc dùng chocolatey:
choco install ngrok
```

**Bước 2: Khởi động Backend với ngrok**
```powershell
# Terminal 1: Khởi động backend
cd Web
npm run dev

# Terminal 2: Tạo tunnel cho backend
ngrok http 3000
```

Bạn sẽ nhận được URL như: `https://abc123.ngrok.io`

**Bước 3: Cập nhật Mobile config**
Sửa `Mobile/app/_layout.tsx`:
```typescript
const LOCAL_IP = 'abc123.ngrok.io'; // Thay bằng URL ngrok của bạn
const defaultBaseUrl = Platform.select({
  android: `https://${LOCAL_IP}`,  // Chú ý: https
  ios: `https://${LOCAL_IP}`,
  default: `https://${LOCAL_IP}`,
});
```

**Bước 4: Khởi động Mobile bình thường**
```powershell
cd Mobile
npx expo start
```

---

### Phương án 3: Dùng Expo Dev Client (Chuyên nghiệp)

Build một development client riêng:

```powershell
# Cài đặt expo-dev-client
cd Mobile
npx expo install expo-dev-client

# Build cho Android
npx expo run:android

# Build cho iOS (cần Mac)
npx expo run:ios
```

Sau đó có thể dùng USB debugging hoặc bất kỳ mạng nào.

---

## 🤔 Tại sao bạn cần tunnel?

Hãy cho tôi biết lý do bạn muốn dùng tunnel:

### ❓ Bạn có đang gặp tình huống nào sau đây?

**A. Không cùng WiFi**
- Điện thoại dùng 4G/5G
- Máy tính dùng WiFi công ty
→ **Giải pháp**: Dùng ngrok (Phương án 2)

**B. WiFi công ty chặn kết nối local**
- Firewall chặn port 8081
- Không thể kết nối giữa các thiết bị
→ **Giải pháp**: Dùng ngrok hoặc mobile hotspot

**C. Muốn test từ xa**
- Bạn ở nhà, điện thoại ở nơi khác
- Muốn share với người khác test
→ **Giải pháp**: Dùng ngrok + Expo Go

**D. Lý do khác**
→ Hãy cho tôi biết để tôi tư vấn giải pháp phù hợp

---

## 🚀 Khuyến nghị của tôi

### Cho Development (Phát triển):
✅ **Dùng LAN mode** (npx expo start)
- Nhanh, ổn định
- Dễ debug
- Không phụ thuộc dịch vụ bên ngoài

### Cho Testing với người khác:
✅ **Dùng ngrok**
- Ổn định hơn Expo tunnel
- Có thể dùng cho cả backend
- Free tier đủ dùng

### Cho Production Testing:
✅ **Build APK/IPA**
```powershell
# Build APK cho Android
cd Mobile
eas build --platform android --profile preview

# Hoặc local build
npx expo run:android --variant release
```

---

## 📊 So sánh các phương pháp

| Phương pháp | Tốc độ | Ổn định | Độ phức tạp | Khi nào dùng |
|-------------|--------|---------|-------------|--------------|
| **LAN (npx expo start)** | ⚡⚡⚡ | ✅✅✅ | ⭐ Dễ | Development hàng ngày |
| **Ngrok** | ⚡⚡ | ✅✅ | ⭐⭐ Trung bình | Không cùng WiFi |
| **Expo Tunnel** | ⚡ | ⚠️ | ⭐ Dễ | ❌ KHÔNG khuyến nghị |
| **Dev Client** | ⚡⚡⚡ | ✅✅✅ | ⭐⭐⭐ Khó | Production-like testing |
| **Build APK/IPA** | ⚡⚡⚡ | ✅✅✅ | ⭐⭐⭐⭐ Rất khó | Production testing |

---

## 💡 Kết luận

**Tôi KHÔNG khuyến nghị dùng Expo tunnel** vì:
- ❌ Không ổn định (như bạn đang thấy)
- ❌ Chậm
- ❌ Phụ thuộc dịch vụ Expo
- ❌ Thường xuyên lỗi

**Thay vào đó:**
1. ✅ **Nếu cùng WiFi**: Dùng LAN mode (npx expo start)
2. ✅ **Nếu không cùng WiFi**: Dùng ngrok
3. ✅ **Nếu cần production testing**: Build APK/IPA

---

## 🎯 Hành động tiếp theo

Hãy cho tôi biết:
1. Tại sao bạn cần tunnel?
2. Điện thoại và máy tính có cùng WiFi không?
3. Bạn đang test trên iOS hay Android?

Tôi sẽ đưa ra giải pháp cụ thể phù hợp với tình huống của bạn!
