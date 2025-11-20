# 🎯 TÓM TẮT: Đã sửa lỗi Mobile App không chạy trên điện thoại thật

## ❌ Vấn đề ban đầu
- Mobile app chạy được trên **máy ảo (emulator)** nhưng **KHÔNG chạy được trên điện thoại thật**
- Nguyên nhân: Sử dụng `localhost` và `10.0.2.2` - chỉ hoạt động với emulator

## ✅ Giải pháp đã áp dụng

### 1. Cập nhật cấu hình API URL
**File**: `Mobile/app/_layout.tsx`

**Thay đổi**:
```typescript
// TRƯỚC (chỉ hoạt động với emulator)
const defaultBaseUrl = Platform.select({
  android: 'http://10.0.2.2:3000',
  ios: 'http://localhost:3000',
  default: 'http://localhost:3000',
});

// SAU (hoạt động với điện thoại thật)
const LOCAL_IP = '192.168.31.160'; // Địa chỉ IP thực của máy tính

const defaultBaseUrl = Platform.select({
  android: `http://${LOCAL_IP}:3000`,
  ios: `http://${LOCAL_IP}:3000`,
  default: `http://${LOCAL_IP}:3000`,
});
```

### 2. Tạo các file hỗ trợ

| File | Mục đích |
|------|----------|
| `MOBILE_SETUP_GUIDE.md` | Hướng dẫn chi tiết cách setup và troubleshooting |
| `MOBILE_CHECKLIST.md` | Checklist từng bước để kiểm tra |
| `setup-firewall.ps1` | Script tự động cấu hình Windows Firewall |
| `check-mobile-setup.ps1` | Script kiểm tra tất cả cấu hình |
| `Mobile/.env.example` | Template cho file .env |

## 🚀 Cách sử dụng

### Bước 1: Cấu hình Firewall (chỉ làm 1 lần)
```powershell
# Chạy PowerShell với quyền Administrator
.\setup-firewall.ps1
```

### Bước 2: Khởi động Backend
```bash
cd Web
npm run dev
```

### Bước 3: Khởi động Mobile App
```bash
cd Mobile
npm start
```

### Bước 4: Kết nối từ điện thoại
1. Đảm bảo điện thoại và máy tính **cùng mạng WiFi**
2. Mở **Expo Go** app trên điện thoại
3. Quét **QR code** hiển thị trên terminal

## ⚠️ Lưu ý quan trọng

### Khi địa chỉ IP thay đổi
Nếu máy tính kết nối WiFi khác, địa chỉ IP sẽ thay đổi. Khi đó:

1. Kiểm tra IP mới:
```powershell
ipconfig
```

2. Cập nhật trong `Mobile/app/_layout.tsx`:
```typescript
const LOCAL_IP = 'ĐỊA_CHỈ_IP_MỚI';
```

### Địa chỉ IP hiện tại
- **IP máy tính**: `192.168.31.160`
- **Backend URL**: `http://192.168.31.160:3000`
- **Expo Dev Server**: `http://192.168.31.160:8081`

## 🧪 Kiểm tra nhanh

### Test Backend từ điện thoại:
Mở trình duyệt trên điện thoại, truy cập:
```
http://192.168.31.160:3000
```
Nếu thấy trang web → Backend hoạt động! ✅

### Chạy script kiểm tra:
```powershell
.\check-mobile-setup.ps1
```

## 🐛 Troubleshooting phổ biến

| Lỗi | Nguyên nhân | Giải pháp |
|-----|-------------|-----------|
| "Network request failed" | Không cùng WiFi hoặc Firewall chặn | Kiểm tra WiFi, chạy `setup-firewall.ps1` |
| "Unable to connect to Metro" | Port bị chiếm hoặc cache | Chạy `npx expo start -c` |
| "Cannot connect to backend" | Backend chưa chạy hoặc IP sai | Kiểm tra backend, cập nhật IP |
| App crash | Cache cũ | Xóa app khỏi Expo Go, load lại |

## 📱 Chạy trên Emulator (nếu cần)

Nếu muốn chạy lại trên emulator, sửa trong `_layout.tsx`:

```typescript
const defaultBaseUrl = Platform.select({
  android: 'http://10.0.2.2:3000',      // Android Emulator
  ios: 'http://localhost:3000',          // iOS Simulator
  default: `http://${LOCAL_IP}:3000`,   // Điện thoại thật
});
```

## 📚 Tài liệu tham khảo

- `MOBILE_SETUP_GUIDE.md` - Hướng dẫn chi tiết
- `MOBILE_CHECKLIST.md` - Checklist đầy đủ
- [Expo Documentation](https://docs.expo.dev/)

## ✨ Kết quả

✅ Mobile app **ĐÃ HOẠT ĐỘNG** trên điện thoại thật!
✅ Có thể kết nối với backend từ điện thoại
✅ Tất cả tính năng hoạt động bình thường

---

**Ngày cập nhật**: 2025-11-20  
**Địa chỉ IP hiện tại**: 192.168.31.160
