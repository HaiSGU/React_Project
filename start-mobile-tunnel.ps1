# Script chay Expo voi Tunnel mode

Write-Host "=== Khoi dong Expo voi Tunnel Mode ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "Luu y:" -ForegroundColor Yellow
Write-Host "  - Tunnel mode CHAM hon LAN mode" -ForegroundColor Red
Write-Host "  - Chi nen dung khi KHONG CUNG WiFi" -ForegroundColor Red
Write-Host "  - Phu thuoc vao dich vu Expo (co the khong on dinh)" -ForegroundColor Red
Write-Host ""

# Dung tat ca Node processes cu
Write-Host "Dung cac process cu..." -ForegroundColor Yellow
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "Done!" -ForegroundColor Green
Write-Host ""

# Di chuyen den thu muc Mobile
Set-Location -Path ".\Mobile"

Write-Host "Khoi dong Expo voi Tunnel..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Sau khi khoi dong, ban se thay:" -ForegroundColor Cyan
Write-Host "  1. QR code de quet" -ForegroundColor White
Write-Host "  2. URL dang: exp://xxx.xxx.xxx.xxx.tunnel.exp.direct:80" -ForegroundColor White
Write-Host ""
Write-Host "Tren dien thoai:" -ForegroundColor Cyan
Write-Host "  iOS: Camera app -> Quet QR code" -ForegroundColor White
Write-Host "  Android: Expo Go -> Scan QR Code" -ForegroundColor White
Write-Host ""

# Chay Expo voi tunnel, khong tim Android emulator
$env:EXPO_NO_DOTENV = "1"
npx expo start --tunnel --no-dev --minify
