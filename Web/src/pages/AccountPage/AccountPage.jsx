import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn, getCurrentUser, updateUserInfo, logout } from "@shared/services/authService";
import "./AccountPage.css";

export default function AccountPage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ 
    username: '', 
    fullName: '',
    phone: '', 
    address: '' 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const loggedIn = await isLoggedIn(localStorage);
      if (!loggedIn) {
        navigate('/login');
        return;
      }

      let user = await getCurrentUser(localStorage);
      console.log('🔍 Loaded user data from userInfo:', user);
      
      // Nếu userInfo không có hoặc thiếu dữ liệu, thử load từ user array
      if (!user || !user.fullName) {
        console.log('⚠️ userInfo empty, trying to load from user array...');
        const usersStr = localStorage.getItem('user');
        if (usersStr) {
          const users = JSON.parse(usersStr);
          const currentUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
          const foundUser = Array.isArray(users) 
            ? users.find(u => u.username === currentUserInfo.username)
            : null;
          
          if (foundUser) {
            console.log('✅ Found user in array:', foundUser);
            user = foundUser;
            // Update userInfo in localStorage
            localStorage.setItem('userInfo', JSON.stringify(foundUser));
          }
        }
      }
      
      if (user) {
        setUserInfo({
          username: user.username || '',
          fullName: user.fullName || '',
          phone: user.phone || '',
          address: user.address || ''
        });
      }
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
      const updatedInfo = {
        username: userInfo.username,
        fullName: userInfo.fullName,
        phone: userInfo.phone,
        address: userInfo.address,
      };
      
      console.log('💾 Saving user info:', updatedInfo); // Debug log
      
      await updateUserInfo(updatedInfo, localStorage);
      
      // Re-fetch user data to confirm update
      const user = await getCurrentUser(localStorage);
      if (user) {
        setUserInfo({
          username: user.username || '',
          fullName: user.fullName || '',
          phone: user.phone || '',
          address: user.address || ''
        });
      }
      
      alert('✅ Đã lưu thông tin thành công!');
    } catch (error) {
      console.error('Save error:', error);
      alert('❌ Lỗi: ' + error.message);
    }
  };

  const handleLogout = async () => {
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
      <div className="account-container">
        <div className="account-sidebar">
          <div className="sidebar-header">
            <div className="user-avatar">
              <span className="avatar-icon">👤</span>
            </div>
            <h3 className="user-name">{userInfo.fullName || userInfo.username || 'Người dùng'}</h3>
            <p className="user-role">Khách hàng</p>
          </div>
          
          <nav className="sidebar-menu">
            <button className="menu-item active">
              <span className="menu-icon">👤</span>
              <span>Thông tin cá nhân</span>
            </button>
            <button className="menu-item" onClick={handleChangePassword}>
              <span className="menu-icon">🔒</span>
              <span>Đổi mật khẩu</span>
            </button>
            <button className="menu-item logout" onClick={handleLogout}>
              <span className="menu-icon">🚪</span>
              <span>Đăng xuất</span>
            </button>
          </nav>
        </div>

        <div className="account-main">
          <div className="page-header">
            <h1>Thông tin cá nhân</h1>
            <p className="page-subtitle">Quản lý thông tin để bảo mật tài khoản</p>
          </div>

          <div className="info-card">
            <h2 className="card-title">Thông tin tài khoản</h2>
            
            <div className="form-row">
              <div className="form-col">
                <label htmlFor="fullName">Họ và tên</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Nhập họ và tên"
                  value={userInfo.fullName || ''}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-col">
                <label htmlFor="phone">Số điện thoại</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  value={userInfo.phone || ''}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-col-full">
                <label htmlFor="address">Địa chỉ</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Nhập địa chỉ"
                  value={userInfo.address || ''}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-save" onClick={handleSave}>
                <span className="btn-icon">💾</span>
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
