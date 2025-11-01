import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { loginRestaurantOwner, saveOwnerSession } from "@shared/services/restaurantAuthService";
import "./LoginPage.css";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
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

    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // ================================
    // KIỂM TRA TẠI KHOẢN NHÀ HÀNG
    // ================================
    const ownerLoginResult = loginRestaurantOwner(username, password);
    
    console.log('Owner login result:', ownerLoginResult) // ← DEBUG
    
    if (ownerLoginResult.success) {
      // ✅ LÀ CHỦ NHÀ HÀNG
      const saveResult = saveOwnerSession(ownerLoginResult.data, localStorage);
      console.log('Save session result:', saveResult) // ← DEBUG
      
      if (saveResult.success) {
        console.log('Navigating to dashboard...') // ← DEBUG
        navigate("/restaurant-dashboard", { replace: true });
        return;
      } else {
        setError("Lỗi lưu phiên đăng nhập!");
        return;
      }
    }

    // ================================
    // XỬ LÝ KHÁCH HÀNG
    // ================================

    if (isRegister) {
      if (password !== confirmPassword) {
        setError("Mật khẩu xác nhận không khớp!");
        return;
      }

      const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      
      if (existingUsers.some((u) => u.username === username)) {
        setError("Tên đăng nhập đã tồn tại!");
        return;
      }

      existingUsers.push({ username, password });
      localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));
      
      alert("✅ Đăng ký thành công! Hãy đăng nhập.");
      
      setIsRegister(false);
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      return;
    }

    // ĐĂNG NHẬP KHÁCH HÀNG
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
        <h2>{isRegister ? "Đăng ký tài khoản" : "Đăng nhập"}</h2>

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

        {isRegister && (
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
        )}

        <button type="submit">
          {isRegister ? "Đăng ký" : "Đăng nhập"}
        </button>

        <p className="toggle-auth">
          {isRegister ? (
            <>
              Đã có tài khoản?{" "}
              <span onClick={() => {
                setIsRegister(false);
                setError("");
              }}>
                Đăng nhập
              </span>
            </>
          ) : (
            <>
              Chưa có tài khoản?{" "}
              <span onClick={() => {
                setIsRegister(true);
                setError("");
              }}>
                Đăng ký ngay
              </span>
            </>
          )}
        </p>

        {!isRegister && (
          <div className="demo-hint">
            💡 <strong>Demo tài khoản nhà hàng:</strong><br/>
            <code>kfc_admin / kfc123</code>
          </div>
        )}
      </form>
    </div>
  );
}
