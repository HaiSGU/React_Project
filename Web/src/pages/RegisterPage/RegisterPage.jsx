import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useRegister } from "@shared/hooks/useRegister";
import { register } from "@shared/services/authService";
import "./RegisterPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    username,
    setUsername,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    fullName,
    setFullName,
    phone,
    setPhone,
    address,
    setAddress,
    gender,
    setGender,
    error,
    validate,
    getFormData,
  } = useRegister();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const result = await register(localStorage, getFormData());

      if (result.success) {
        // Lưu vào registeredUsers cho tương thích với LoginPage hiện tại
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        registeredUsers.push(result.user);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        
        alert("✅ Đăng ký thành công! Vui lòng đăng nhập.");
        navigate("/login");
      } else {
        alert("❌ Lỗi: " + result.error);
      }
    } catch (err) {
      console.error("Register error:", err);
      alert("❌ Đã có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <form className="register-form" onSubmit={handleRegister}>
          <h1 className="register-title">Đăng ký tài khoản</h1>

          {error && <div className="error-message">{error}</div>}

          <div className="form-section">
            <h3 className="section-title">Thông tin đăng nhập</h3>
            
            <div className="form-group">
              <label htmlFor="username">Tên đăng nhập <span className="required">*</span></label>
              <input
                id="username"
                type="text"
                className="form-input"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                autoComplete="username"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Mật khẩu <span className="required">*</span></label>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Xác nhận mật khẩu <span className="required">*</span></label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="form-input"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Thông tin cá nhân</h3>
            
            <div className="form-group">
              <label htmlFor="fullName">Họ và tên <span className="required">*</span></label>
              <input
                id="fullName"
                type="text"
                className="form-input"
                placeholder="Nhập họ và tên"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Số điện thoại <span className="required">*</span></label>
                <input
                  id="phone"
                  type="tel"
                  className="form-input"
                  placeholder="Nhập số điện thoại"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Giới tính <span className="required">*</span></label>
                <div className="gender-options">
                  <button
                    type="button"
                    className={`gender-btn ${gender === 'male' ? 'active' : ''}`}
                    onClick={() => setGender('male')}
                    disabled={loading}
                  >
                    Nam
                  </button>
                  <button
                    type="button"
                    className={`gender-btn ${gender === 'female' ? 'active' : ''}`}
                    onClick={() => setGender('female')}
                    disabled={loading}
                  >
                    Nữ
                  </button>
                  <button
                    type="button"
                    className={`gender-btn ${gender === 'other' ? 'active' : ''}`}
                    onClick={() => setGender('other')}
                    disabled={loading}
                  >
                    Khác
                  </button>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Địa chỉ <span className="required">*</span></label>
              <textarea
                id="address"
                className="form-input"
                placeholder="Nhập địa chỉ chi tiết"
                rows="3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className={`btn-register ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>

          <div className="register-footer">
            <p className="footer-text">
              Đã có tài khoản?{" "}
              <button
                type="button"
                className="link-btn"
                onClick={() => navigate("/login")}
              >
                Đăng nhập ngay
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}