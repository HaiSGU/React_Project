import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn, getCurrentUser, updateUserInfo, logout } from "@shared/services/authService";
import "./AccountPage.css";

export default function AccountPage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ username: '', phone: '', address: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      // Dùng shared service với localStorage
      const loggedIn = await isLoggedIn(localStorage);
      if (!loggedIn) {
        navigate('/login');
        return;
      }

      const user = await getCurrentUser(localStorage);
      if (user) setUserInfo(user);
      setLoading(false);
    };
    checkLogin();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Dùng shared service
      await updateUserInfo({
        username: userInfo.username,
        phone: userInfo.phone,
        address: userInfo.address,
      }, localStorage);
      alert('Đã lưu thông tin!');
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleLogout = async () => {
    // Dùng shared service
    await logout(localStorage);
    navigate('/login');
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  if (loading) {
    return (
      <div className="account-page">
        <div className="loading-container">
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      <header className="account-header">
        <h1>Thông tin cá nhân</h1>
      </header>

      <div className="account-content">
        <div className="form-container">
          <div className="form-group">
            <label htmlFor="username">Tên</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Nhập tên của bạn"
              value={userInfo.username}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Nhập số điện thoại"
              value={userInfo.phone}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Địa chỉ mặc định</label>
            <input
              id="address"
              name="address"
              type="text"
              placeholder="Nhập địa chỉ"
              value={userInfo.address}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <button className="btn-save" onClick={handleSave}>
            💾 Lưu thông tin
          </button>
        </div>

        <div className="menu-actions">
          <button className="menu-btn" onClick={handleChangePassword}>
            🔒 Đổi mật khẩu
          </button>
          <button className="menu-btn logout-btn" onClick={handleLogout}>
            🚪 Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
