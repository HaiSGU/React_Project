# Hướng dẫn chạy Mobile App trên điện thoại thật

## 🔍 Vấn đề đã được giải quyết

Ứng dụng mobile không kết nối được khi chạy trên điện thoại thật vì đang sử dụng `localhost` - địa chỉ này chỉ hoạt động trên máy ảo (emulator).

## ✅ Giải pháp đã áp dụng

Đã cập nhật file `Mobile/app/_layout.tsx` để sử dụng địa chỉ IP thực của máy tính: **192.168.31.160**

## 📋 Các bước để chạy ứng dụng

### Bước 1: Khởi động Backend (Web Server)

```bash
cd Web
npm run dev
```

Backend sẽ chạy tại: `http://192.168.31.160:3000`

### Bước 2: Khởi động Mobile App

```bash
cd Mobile
npm start
```

### Bước 3: Kết nối điện thoại

1. **Đảm bảo điện thoại và máy tính cùng mạng WiFi**
2. Quét QR code từ Expo Go app trên điện thoại
3. Hoặc nhập URL thủ công: `exp://192.168.31.160:8081`

## ⚠️ Lưu ý quan trọng

### 1. Firewall Windows
Đảm bảo Windows Firewall cho phép kết nối đến cổng 3000 và 8081:

```powershell
# Cho phép cổng 3000 (Backend)
netsh advfirewall firewall add rule name="Node Backend" dir=in action=allow protocol=TCP localport=3000

# Cho phép cổng 8081 (Expo)
netsh advfirewall firewall add rule name="Expo Dev Server" dir=in action=allow protocol=TCP localport=8081
```

### 2. Khi địa chỉ IP thay đổi

Nếu địa chỉ IP máy tính thay đổi (ví dụ: kết nối WiFi khác), bạn cần:

1. Kiểm tra IP mới:
```powershell
ipconfig
```

2. Cập nhật trong file `Mobile/app/_layout.tsx`:
```typescript
const LOCAL_IP = 'ĐỊA_CHỈ_IP_MỚI';
```

### 3. Chạy trên Emulator

Nếu muốn chạy lại trên emulator, thay đổi trong `_layout.tsx`:

```typescript
const defaultBaseUrl = Platform.select({
  android: 'http://10.0.2.2:3000',  // Cho Android Emulator
  ios: 'http://localhost:3000',      // Cho iOS Simulator
  default: `http://${LOCAL_IP}:3000`,
});
```

## 🧪 Kiểm tra kết nối

### Test Backend từ điện thoại:
Mở trình duyệt trên điện thoại và truy cập:
```
http://192.168.31.160:3000
```

Nếu thấy trang web hiển thị → Backend hoạt động tốt!

### Test API:
```
http://192.168.31.160:3000/api/users
```

## 🐛 Troubleshooting

### Lỗi: "Network request failed"
- ✅ Kiểm tra cả điện thoại và máy tính cùng WiFi
- ✅ Tắt VPN nếu đang bật
- ✅ Kiểm tra Firewall
- ✅ Restart backend server

### Lỗi: "Unable to resolve host"
- ✅ Kiểm tra địa chỉ IP trong `_layout.tsx`
- ✅ Ping từ điện thoại đến máy tính (dùng app Network Analyzer)

### App không load được
- ✅ Clear cache Expo: `expo start -c`
- ✅ Xóa app và cài lại từ Expo Go
- ✅ Restart Metro bundler

## 📱 Cấu hình hiện tại

- **Backend URL**: http://192.168.31.160:3000
- **Expo Dev Server**: http://192.168.31.160:8081
- **Platform**: Android & iOS
- **Network**: WiFi Local (192.168.31.x)

## 🚀 Quick Start Commands

```bash
# Terminal 1 - Backend
cd Web && npm run dev

# Terminal 2 - Mobile
cd Mobile && npm start
```

Sau đó quét QR code bằng Expo Go app trên điện thoại!
