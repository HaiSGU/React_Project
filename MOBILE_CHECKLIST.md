# ✅ Checklist: Chạy Mobile App trên Điện thoại Thật

## Trước khi bắt đầu

- [ ] Điện thoại và máy tính **cùng mạng WiFi**
- [ ] Đã cài đặt **Expo Go** app trên điện thoại
  - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

## Bước 1: Kiểm tra địa chỉ IP

- [ ] Mở PowerShell/Terminal
- [ ] Chạy lệnh: `ipconfig` (Windows) hoặc `ifconfig` (Mac/Linux)
- [ ] Ghi lại địa chỉ IPv4 (ví dụ: 192.168.31.160)

## Bước 2: Cập nhật cấu hình

- [ ] Mở file `Mobile/app/_layout.tsx`
- [ ] Tìm dòng: `const LOCAL_IP = '192.168.31.160';`
- [ ] Thay đổi IP thành địa chỉ IP của máy tính bạn
- [ ] Lưu file

## Bước 3: Cấu hình Firewall (chỉ Windows)

- [ ] Mở PowerShell **với quyền Administrator**
- [ ] Di chuyển đến thư mục project
- [ ] Chạy: `.\setup-firewall.ps1`
- [ ] Đợi script hoàn thành

**Hoặc cấu hình thủ công:**
```powershell
netsh advfirewall firewall add rule name="Node Backend Port 3000" dir=in action=allow protocol=TCP localport=3000
netsh advfirewall firewall add rule name="Expo Dev Server Port 8081" dir=in action=allow protocol=TCP localport=8081
```

## Bước 4: Khởi động Backend

- [ ] Mở Terminal/PowerShell mới
- [ ] Di chuyển đến thư mục Web: `cd Web`
- [ ] Chạy: `npm run dev`
- [ ] Đợi backend khởi động (thường ở port 3000)
- [ ] Kiểm tra: Mở trình duyệt trên điện thoại, truy cập `http://[ĐỊA_CHỈ_IP]:3000`

## Bước 5: Khởi động Mobile App

- [ ] Mở Terminal/PowerShell mới
- [ ] Di chuyển đến thư mục Mobile: `cd Mobile`
- [ ] Chạy: `npm start` hoặc `npx expo start`
- [ ] Đợi Metro bundler khởi động

## Bước 6: Kết nối từ điện thoại

**Cách 1: Quét QR Code (Khuyến nghị)**
- [ ] Mở app **Expo Go** trên điện thoại
- [ ] Nhấn "Scan QR Code"
- [ ] Quét QR code hiển thị trên terminal

**Cách 2: Nhập URL thủ công**
- [ ] Mở app **Expo Go** trên điện thoại
- [ ] Nhập URL: `exp://[ĐỊA_CHỈ_IP]:8081`
- [ ] Nhấn "Connect"

## Bước 7: Kiểm tra

- [ ] App đã load thành công trên điện thoại
- [ ] Có thể xem danh sách món ăn
- [ ] Có thể thêm món vào giỏ hàng
- [ ] Có thể đăng nhập/đăng ký

## 🐛 Nếu gặp lỗi

### "Network request failed"
- [ ] Kiểm tra lại cùng WiFi
- [ ] Tắt VPN nếu đang bật
- [ ] Kiểm tra Firewall
- [ ] Restart backend server

### "Unable to connect to Metro"
- [ ] Chạy lại với: `npx expo start -c` (clear cache)
- [ ] Kiểm tra port 8081 không bị chiếm dụng
- [ ] Restart Expo dev server

### "Cannot connect to backend"
- [ ] Kiểm tra backend đang chạy: `http://[IP]:3000`
- [ ] Kiểm tra IP trong `_layout.tsx` đúng chưa
- [ ] Test từ trình duyệt điện thoại trước

### App bị crash
- [ ] Xem logs trong terminal
- [ ] Xóa app khỏi Expo Go và load lại
- [ ] Clear cache: `npx expo start -c`

## 📝 Ghi chú

- Địa chỉ IP hiện tại: **192.168.31.160**
- Backend port: **3000**
- Expo dev server port: **8081**
- Ngày cập nhật: **2025-11-20**

## 🎉 Hoàn thành!

Nếu tất cả các bước đều ✅, app của bạn đã chạy thành công trên điện thoại thật!
