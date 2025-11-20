# Script khoi dong Mobile App dung cach

Write-Host "=== Khoi dong Mobile App ===" -ForegroundColor Cyan
Write-Host ""

# Buoc 1: Dung tat ca Node processes cu
Write-Host "1. Dung tat ca Node processes cu..." -ForegroundColor Yellow
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "   Da dung tat ca Node processes" -ForegroundColor Green
Write-Host ""

# Buoc 2: Kiem tra dia chi IP
Write-Host "2. Kiem tra dia chi IP..." -ForegroundColor Yellow
$wifiAdapter = Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi*" -ErrorAction SilentlyContinue | Where-Object {$_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*"}
if ($wifiAdapter) {
    $currentIP = $wifiAdapter.IPAddress
    Write-Host "   IP hien tai: $currentIP" -ForegroundColor Green
} else {
    Write-Host "   Khong tim thay WiFi connection" -ForegroundColor Red
    $currentIP = "UNKNOWN"
}
Write-Host ""

# Buoc 3: Hien thi huong dan
Write-Host "3. Huong dan ket noi:" -ForegroundColor Yellow
Write-Host "   - Dam bao dien thoai va may tinh CUNG WIFI" -ForegroundColor White
Write-Host "   - IP may tinh: $currentIP" -ForegroundColor White
Write-Host "   - Kiem tra IP trong Mobile/app/_layout.tsx phai la: $currentIP" -ForegroundColor White
Write-Host ""

# Buoc 4: Khoi dong Expo
Write-Host "4. Khoi dong Expo Dev Server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "=== SAU KHI EXPO KHOI DONG ===" -ForegroundColor Cyan
Write-Host "Voi iOS:" -ForegroundColor Green
Write-Host "  1. Mo Camera app tren iPhone" -ForegroundColor White
Write-Host "  2. Quet QR code" -ForegroundColor White
Write-Host "  3. Nhan vao notification de mo Expo Go" -ForegroundColor White
Write-Host ""
Write-Host "Voi Android:" -ForegroundColor Green
Write-Host "  1. Mo Expo Go app" -ForegroundColor White
Write-Host "  2. Nhan 'Scan QR Code'" -ForegroundColor White
Write-Host "  3. Quet QR code" -ForegroundColor White
Write-Host ""
Write-Host "KHONG CAN dung --tunnel!" -ForegroundColor Red
Write-Host ""
Write-Host "Dang khoi dong..." -ForegroundColor Yellow
Write-Host ""

# Di chuyen den thu muc Mobile va khoi dong
Set-Location -Path ".\Mobile"
npx expo start -c
