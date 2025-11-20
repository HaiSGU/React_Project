# Script kiem tra ket noi Mobile App
# Chay script nay de kiem tra cac cau hinh can thiet

Write-Host "=== Kiem tra cau hinh Mobile App ===" -ForegroundColor Cyan
Write-Host ""

# 1. Kiem tra dia chi IP
Write-Host "1. Dia chi IP cua may tinh:" -ForegroundColor Yellow
$wifiAdapter = Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi*" -ErrorAction SilentlyContinue | Where-Object {$_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*"}
$ethernetAdapter = Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Ethernet*" -ErrorAction SilentlyContinue | Where-Object {$_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*"}

if ($wifiAdapter) {
    Write-Host "   WiFi: $($wifiAdapter.IPAddress)" -ForegroundColor Green
    $currentIP = $wifiAdapter.IPAddress
} elseif ($ethernetAdapter) {
    Write-Host "   Ethernet: $($ethernetAdapter.IPAddress)" -ForegroundColor Green
    $currentIP = $ethernetAdapter.IPAddress
} else {
    Write-Host "   Khong tim thay ket noi mang local" -ForegroundColor Red
    $currentIP = $null
}
Write-Host ""

# 2. Kiem tra file _layout.tsx
Write-Host "2. Kiem tra cau hinh trong _layout.tsx:" -ForegroundColor Yellow
$layoutFile = ".\Mobile\app\_layout.tsx"
if (Test-Path $layoutFile) {
    $content = Get-Content $layoutFile -Raw
    if ($content -match 'const LOCAL_IP = ''(.+?)''') {
        $configuredIP = $matches[1]
        Write-Host "   IP da cau hinh: $configuredIP" -ForegroundColor White
        
        if ($currentIP -and $configuredIP -eq $currentIP) {
            Write-Host "   IP khop voi IP hien tai!" -ForegroundColor Green
        } elseif ($currentIP) {
            Write-Host "   IP khong khop! Can cap nhat thanh: $currentIP" -ForegroundColor Red
        }
    } else {
        Write-Host "   Khong tim thay cau hinh LOCAL_IP" -ForegroundColor Red
    }
} else {
    Write-Host "   Khong tim thay file _layout.tsx" -ForegroundColor Red
}
Write-Host ""

# 3. Kiem tra Firewall
Write-Host "3. Kiem tra Firewall rules:" -ForegroundColor Yellow
$port3000 = netsh advfirewall firewall show rule name="Node Backend Port 3000" 2>$null
$port8081 = netsh advfirewall firewall show rule name="Expo Dev Server Port 8081" 2>$null

if ($port3000) {
    Write-Host "   Port 3000 (Backend) da duoc mo" -ForegroundColor Green
} else {
    Write-Host "   Port 3000 chua duoc mo trong Firewall" -ForegroundColor Red
}

if ($port8081) {
    Write-Host "   Port 8081 (Expo) da duoc mo" -ForegroundColor Green
} else {
    Write-Host "   Port 8081 chua duoc mo trong Firewall" -ForegroundColor Red
}
Write-Host ""

# 4. Kiem tra Backend dang chay
Write-Host "4. Kiem tra Backend server:" -ForegroundColor Yellow
if ($currentIP) {
    try {
        $response = Invoke-WebRequest -Uri "http://${currentIP}:3000" -TimeoutSec 2 -ErrorAction Stop
        Write-Host "   Backend dang chay tai http://${currentIP}:3000" -ForegroundColor Green
    } catch {
        Write-Host "   Backend chua chay hoac khong the ket noi" -ForegroundColor Red
        Write-Host "   Hay chay: cd Web ; npm run dev" -ForegroundColor Yellow
    }
} else {
    Write-Host "   Khong co IP de kiem tra" -ForegroundColor Red
}
Write-Host ""

# 5. Kiem tra dependencies
Write-Host "5. Kiem tra dependencies:" -ForegroundColor Yellow
if (Test-Path ".\Mobile\node_modules") {
    Write-Host "   Mobile dependencies da cai dat" -ForegroundColor Green
} else {
    Write-Host "   Chua cai dependencies. Chay: cd Mobile ; npm install" -ForegroundColor Red
}

if (Test-Path ".\Web\node_modules") {
    Write-Host "   Web dependencies da cai dat" -ForegroundColor Green
} else {
    Write-Host "   Chua cai dependencies. Chay: cd Web ; npm install" -ForegroundColor Red
}
Write-Host ""

# Tong ket
Write-Host "=== Tong ket ===" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

if (-not $currentIP) {
    Write-Host "Khong co ket noi mang" -ForegroundColor Red
    $allGood = $false
}

if (-not $port3000 -or -not $port8081) {
    Write-Host "Can cau hinh Firewall. Chay: .\setup-firewall.ps1 (voi quyen Admin)" -ForegroundColor Yellow
    $allGood = $false
}

if ($allGood) {
    Write-Host "Tat ca da san sang!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Cac buoc tiep theo:" -ForegroundColor Cyan
    Write-Host "1. Khoi dong Backend: cd Web ; npm run dev" -ForegroundColor White
    Write-Host "2. Khoi dong Mobile: cd Mobile ; npm start" -ForegroundColor White
    Write-Host "3. Quet QR code bang Expo Go app tren dien thoai" -ForegroundColor White
} else {
    Write-Host "Can khac phuc cac van de tren truoc khi tiep tuc" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Xem them huong dan chi tiet tai:" -ForegroundColor Cyan
Write-Host "   - MOBILE_SETUP_GUIDE.md" -ForegroundColor White
Write-Host "   - MOBILE_CHECKLIST.md" -ForegroundColor White
Write-Host ""
Read-Host "Nhan Enter de dong"
