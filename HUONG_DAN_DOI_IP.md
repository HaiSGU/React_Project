# 🔧 Hướng Dẫn Cập Nhật IP Khi Đổi Mạng WiFi

## ⚡ Cách Nhanh (Tự Động)

Chạy script PowerShell để tự động lấy IP và cập nhật:

```powershell
# Chạy từ thư mục gốc của project
.\update-ip.ps1
```

Script sẽ:
- ✅ Tự động tìm và lấy IP của Wi-Fi adapter
- ✅ Cập nhật IP vào file config tập trung
- ✅ Hiển thị IP mới
- 📱 Yêu cầu bạn reload app Expo

## 📝 Cách Thủ Công (Nếu Script Lỗi)

### Bước 1: Lấy IP hiện tại

```powershell
ipconfig
```

Tìm dòng **"Wireless LAN adapter Wi-Fi"** và copy **IPv4 Address**

Ví dụ:
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.202
```

### Bước 2: Cập nhật file config

Mở file `Mobile/config/api.config.js` và sửa dòng này:

```javascript
// ⚠️ CHỈ SỬA DÒNG NÀY KHI ĐỔI MẠNG ⚠️
export const LOCAL_IP = '192.168.1.202';  // <- Thay IP vào đây
```

### Bước 3: Reload app

- **Cách 1:** Bấm `r` trong terminal Expo
- **Cách 2:** Lắc điện thoại > chọn **Reload**

## 📁 Các File Đã Được Cập Nhật

Tất cả các file sau đều đã được cấu hình để dùng config tập trung:

- ✅ `Mobile/app/_layout.tsx`
- ✅ `Mobile/app/(tabs)/index.jsx`
- ✅ `Mobile/app/menu/[id].jsx`

**➡️ Bạn KHÔNG CẦN sửa các file này nữa!**

## 🎯 Ưu Điểm

- ⚡ **Nhanh:** Chỉ cần chạy 1 lệnh hoặc sửa 1 dòng
- 🎯 **Chính xác:** Tránh quên sửa file nào
- 🛡️ **An toàn:** Tự động lấy IP đúng

## ❓ Troubleshooting

### Lỗi: Script không chạy được

Bật execution policy:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Lỗi: Không tìm thấy Wi-Fi adapter

Script sẽ tự động tìm Ethernet adapter. Nếu vẫn lỗi, dùng cách thủ công.

### App vẫn báo lỗi Network sau khi đổi IP

1. Kiểm tra json-server có đang chạy không:
   ```powershell
   curl http://[IP_MỚI]:3000/restaurants
   ```

2. Reload app bằng cách bấm `r` trong terminal Expo

3. Kiểm tra firewall có block port 3000 không
