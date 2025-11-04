import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLogin } from "@shared/hooks/useLogin";
import { loginRestaurantOwner, saveOwnerSession } from "@shared/services/restaurantAuthService";
import "./LoginPage.css";

export default function LoginPage() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    error,
    setError,
    validate
  } = useLogin();
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.error === 'owner_required') {
      setError("Vui lòng đăng nhập với tài khoản nhà hàng hợp lệ!");
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate using shared hook
    if (!validate()) {
      return;
    }

    // ================================
    // KIỂM TRA TẠI KHOẢN NHÀ HÀNG
    // ================================
    const ownerLoginResult = loginRestaurantOwner(username, password);
    
    if (ownerLoginResult.success) {
      const saveResult = saveOwnerSession(ownerLoginResult.data, localStorage);
      
      if (saveResult.success) {
        navigate("/restaurant-dashboard", { replace: true });
        return;
      } else {
        setError("Lỗi lưu phiên đăng nhập!");
        return;
      }
    }

    // ================================
    // ĐĂNG NHẬP KHÁCH HÀNG
    // ================================
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const foundUser = registeredUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (!foundUser) {
      setError("Sai tên đăng nhập hoặc mật khẩu!");
      return;
    }

    const userInfo = { username, role: "user" };
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    localStorage.setItem("isLoggedIn", "true");

    const from = location.state?.from || "/home";
    navigate(from, { replace: true });
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Đăng nhập</h2>

        {error && <div className="error-message">{error}</div>}

        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <button type="submit">Đăng nhập</button>

        <p className="toggle-auth">
          Chưa có tài khoản?{" "}
          <span onClick={() => navigate('/register')}>
            Đăng ký ngay
          </span>
        </p>

        <div className="demo-hint">
          💡 <strong>Demo tài khoản nhà hàng:</strong><br/>
          <code>kfc_admin / kfc123</code>
        </div>
      </form>
    </div>
  );
}
