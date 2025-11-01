import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentOwner, logoutOwner } from '@shared/services/restaurantAuthService';
import { RESTAURANTS } from "../../utils/restaurantResolver";
import './RestaurantDashboard.css';

// Lấy thông tin nhà hàng từ localStorage
const getRestaurantInfo = () => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const parsed = JSON.parse(userInfo);
    if (parsed.role === 'restaurant') {
      // Tìm nhà hàng trong RESTAURANTS dựa vào username
      // Ví dụ: username = "rest-jollibee" → tìm restaurant có name chứa "jollibee"
      const restaurantName = parsed.username.replace('rest-', '');
      const restaurant = RESTAURANTS.find(
        r => r.name.toLowerCase().includes(restaurantName.toLowerCase())
      );
      return restaurant || null;
    }
  }
  return null;
};

const emptyItem = {
  id: '',
  name: '',
  price: '',
  description: '',
  imageUrl: '',
  isAvailable: true,
};

export default function RestaurantDashboard() {
  // ✅ KHỞI TẠO NGAY, KHÔNG DÙNG useEffect
  const [ownerInfo] = useState(() => getCurrentOwner(localStorage))
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logoutOwner(localStorage)
    navigate('/login')
  }

  if (!ownerInfo) {
    return <div>Đang tải...</div>
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>🍽️ Quản lý nhà hàng: {ownerInfo.restaurantName}</h1>
        <div className="header-actions">
          <span>Xin chào, {ownerInfo.username}</span>
          <button onClick={handleLogout} className="logout-btn">
            Đăng xuất
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Đơn hàng hôm nay</h3>
            <p className="stat-number">25</p>
          </div>
          <div className="stat-card">
            <h3>Doanh thu</h3>
            <p className="stat-number">5,000,000 đ</p>
          </div>
          <div className="stat-card">
            <h3>Món ăn</h3>
            <p className="stat-number">15</p>
          </div>
        </div>

        <div className="actions-section">
          <h2>Quản lý</h2>
          <div className="action-buttons">
            <button className="action-btn">📋 Quản lý menu</button>
            <button className="action-btn">📦 Đơn hàng</button>
            <button className="action-btn">📊 Thống kê</button>
            <button className="action-btn">⚙️ Cài đặt</button>
          </div>
        </div>
      </div>
    </div>
  )
}