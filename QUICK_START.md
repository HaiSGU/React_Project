# ⚡ QUICK START: Chạy Mobile App

## 🎯 TL;DR (Quá dài không đọc)

```powershell
# Terminal 1
cd Web
npm run dev

# Terminal 2
cd Mobile
npx expo start
```

Sau đó:
- **iOS**: Mở Camera → Quét QR
- **Android**: Mở Expo Go → Scan QR

**KHÔNG CẦN `--tunnel`!**

## 📱 Chi tiết

### iOS (iPhone/iPad)
1. Camera app → Quét QR code
2. Nhấn notification → Mở Expo Go
3. Done! ✅

### Android
1. Expo Go app → "Scan QR Code"
2. Quét QR code
3. Done! ✅

## ⚠️ Yêu cầu
- ✅ Cùng WiFi
- ✅ Đã cài Expo Go
- ✅ Backend đang chạy

## 🐛 Lỗi thường gặp

**"Port 8081 is being used"**
```powershell
Stop-Process -Name "node" -Force
npx expo start -c
```

**"Network request failed"**
- Kiểm tra cùng WiFi
- Chạy: `.\setup-firewall.ps1`

## 📚 Đọc thêm
- `MOBILE_IOS_ANDROID_GUIDE.md` - Hướng dẫn đầy đủ
- `MOBILE_FIX_SUMMARY.md` - Tổng quan vấn đề
