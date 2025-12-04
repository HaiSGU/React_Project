/**
 * API Configuration EXAMPLE
 * ====================
 * Copy file này thành api.config.js và sửa IP của bạn
 * 
 * HƯỚNG DẪN:
 * 1. Copy file này: api.config.example.js → api.config.js
 * 2. Chạy lệnh: ipconfig
 * 3. Tìm "Wireless LAN adapter Wi-Fi" -> "IPv4 Address"
 * 4. Copy IP và paste vào LOCAL_IP bên dưới
 * 5. Reload app (bấm 'r' trong Expo terminal)
 * 
 * HOẶC chạy script tự động:
 *   .\update-ip.ps1
 */

// ⚠️ CHỈ SỬA DÒNG NÀY KHI ĐỔI MẠNG ⚠️
// Thay YOUR_LOCAL_IP bằng IP thực của máy bạn
export const LOCAL_IP = 'YOUR_LOCAL_IP';  // Ví dụ: '192.168.1.202' hoặc '10.145.61.87'

// Port của json-server backend (không cần đổi)
export const API_PORT = '3000';

// Auto-generated API URL
export const API_BASE_URL = `http://${LOCAL_IP}:${API_PORT}`;

// Export default cho dễ import
export default {
    LOCAL_IP,
    API_PORT,
    API_BASE_URL,
};
