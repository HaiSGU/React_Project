# Script cau hinh Firewall cho Mobile Development
# Chay script nay voi quyen Administrator

Write-Host "=== Cau hinh Windows Firewall cho Mobile App Development ===" -ForegroundColor Cyan
Write-Host ""

# Kiem tra quyen Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "Script nay can quyen Administrator!" -ForegroundColor Red
    Write-Host "Vui long:" -ForegroundColor Yellow
    Write-Host "1. Nhan chuot phai vao PowerShell" -ForegroundColor Yellow
    Write-Host "2. Chon 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host "3. Chay lai script nay" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Nhan Enter de thoat"
    exit
}

Write-Host "Dang chay voi quyen Administrator" -ForegroundColor Green
Write-Host ""

# Xoa cac rule cu neu co
Write-Host "Xoa cac rule cu (neu co)..." -ForegroundColor Yellow
netsh advfirewall firewall delete rule name="Node Backend Port 3000" 2>$null
netsh advfirewall firewall delete rule name="Expo Dev Server Port 8081" 2>$null
netsh advfirewall firewall delete rule name="Expo Metro Bundler" 2>$null

# Them rule cho Backend (port 3000)
Write-Host "Them rule cho Backend (port 3000)..." -ForegroundColor Yellow
netsh advfirewall firewall add rule name="Node Backend Port 3000" dir=in action=allow protocol=TCP localport=3000 enable=yes profile=private,public

# Them rule cho Expo Dev Server (port 8081)
Write-Host "Them rule cho Expo Dev Server (port 8081)..." -ForegroundColor Yellow
netsh advfirewall firewall add rule name="Expo Dev Server Port 8081" dir=in action=allow protocol=TCP localport=8081 enable=yes profile=private,public

# Them rule cho Metro Bundler (port 19000-19001)
Write-Host "Them rule cho Metro Bundler (port 19000-19001)..." -ForegroundColor Yellow
netsh advfirewall firewall add rule name="Expo Metro Bundler" dir=in action=allow protocol=TCP localport=19000-19001 enable=yes profile=private,public

Write-Host ""
Write-Host "Cau hinh Firewall hoan tat!" -ForegroundColor Green
Write-Host ""
Write-Host "Cac cong da duoc mo:" -ForegroundColor Cyan
Write-Host "  - Port 3000  : Backend API Server" -ForegroundColor White
Write-Host "  - Port 8081  : Expo Dev Server" -ForegroundColor White
Write-Host "  - Port 19000-19001: Metro Bundler" -ForegroundColor White
Write-Host ""

# Hien thi dia chi IP hien tai
Write-Host "Dia chi IP hien tai cua may tinh:" -ForegroundColor Cyan
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi*" -ErrorAction SilentlyContinue | Where-Object {$_.IPAddress -like "192.168.*"}).IPAddress
if ($ipAddress) {
    Write-Host "  $ipAddress" -ForegroundColor Green
    Write-Host ""
    Write-Host "Su dung dia chi nay trong file Mobile/app/_layout.tsx" -ForegroundColor Yellow
} else {
    Write-Host "  Khong tim thay dia chi IP WiFi" -ForegroundColor Red
    Write-Host "  Vui long chay lenh: ipconfig" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Bay gio ban co the chay app tren dien thoai that!" -ForegroundColor Green
Write-Host ""
Read-Host "Nhan Enter de dong"
