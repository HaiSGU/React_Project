#!/usr/bin/env pwsh
# Auto-detect IP and update config file
# Run this script when you change WiFi network

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Auto Update IP Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Get IP from Wi-Fi adapter
$wifiAdapter = Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
    $_.InterfaceAlias -like "*Wi-Fi*" -or $_.InterfaceAlias -like "*Wireless*"
} | Select-Object -First 1

if ($null -eq $wifiAdapter) {
    Write-Host "[X] Wi-Fi adapter not found!" -ForegroundColor Red
    Write-Host "Looking for Ethernet adapter..." -ForegroundColor Yellow
    
    $ethernetAdapter = Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
        $_.InterfaceAlias -like "*Ethernet*"
    } | Select-Object -First 1
    
    if ($null -eq $ethernetAdapter) {
        Write-Host "[X] No network adapter found!" -ForegroundColor Red
        exit 1
    }
    
    $ipAddress = $ethernetAdapter.IPAddress
    Write-Host "[OK] Found Ethernet with IP: $ipAddress" -ForegroundColor Green
} else {
    $ipAddress = $wifiAdapter.IPAddress
    Write-Host "[OK] Found Wi-Fi with IP: $ipAddress" -ForegroundColor Green
}

# Config file path
$configPath = Join-Path $PSScriptRoot "Mobile\config\api.config.js"

if (-not (Test-Path $configPath)) {
    Write-Host "[X] Config file not found: $configPath" -ForegroundColor Red
    exit 1
}

# Read config file
$configContent = Get-Content $configPath -Raw

# Replace IP in file
$pattern = "export const LOCAL_IP = '[^']*';"
$replacement = "export const LOCAL_IP = '$ipAddress';"
$newContent = $configContent -replace $pattern, $replacement

# Write file
Set-Content -Path $configPath -Value $newContent -NoNewline

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  IP Update Success!" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[OK] IP updated successfully!" -ForegroundColor Green
Write-Host "   File: Mobile\config\api.config.js" -ForegroundColor Gray
Write-Host "   New IP: $ipAddress" -ForegroundColor Yellow
Write-Host ""
Write-Host "[!] Please reload Expo app:" -ForegroundColor Cyan
Write-Host "   Option 1: Press 'r' in Expo terminal" -ForegroundColor Gray
Write-Host "   Option 2: Shake phone > Reload" -ForegroundColor Gray
Write-Host ""
