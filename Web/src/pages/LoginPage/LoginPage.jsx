import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLogin } from "@shared/hooks/useLogin";
import { loginRestaurantOwner, saveOwnerSession } from "@shared/services/restaurantAuthService";
import { login as loginUser } from "@shared/services/authService";
import "./LoginPage.css";

export default function LoginPage() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    error,
    setError,
    loading,
    setLoading,
    validate
  } = useLogin();
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.error === 'owner_required') {
      setError("Vui lòng đăng nhập với tài khoản nhà hàng hợp lệ!");
      window.history.replaceState({}, document.title);
      return;
    }

    if (location.state?.message) {
      setError(location.state.message);
    }
  }, [location, setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate using shared hook
    if (!validate()) {
      return;
    }

     setLoading(true);

    // ================================
    // KIỂM TRA TẠI KHOẢN NHÀ HÀNG
    // ================================
    const ownerLoginResult = loginRestaurantOwner(username, password, localStorage);
    
    if (ownerLoginResult.success) {
      const saveResult = saveOwnerSession(ownerLoginResult.data, localStorage);
      
      if (saveResult.success) {
        navigate("/restaurant-dashboard", { replace: true });
        setLoading(false);
        return;
      } else {
        setError("Lỗi lưu phiên đăng nhập!");
        setLoading(false);
        return;
      }
    }
    
    // Nếu có lỗi từ restaurant login (tạm ngưng/chờ duyệt)
    if (ownerLoginResult.error && ownerLoginResult.error.includes('⛔') || ownerLoginResult.error?.includes('⏳')) {
      setError(ownerLoginResult.error);
      setLoading(false);
      return;
    }

    // ================================
    // ĐĂNG NHẬP KHÁCH HÀNG
    // ================================
    try {
      const result = await loginUser(localStorage, username, password);

      if (!result.success) {
        setError(result.error || "Đăng nhập thất bại!");
        return;
      }

      let redirectPayload = null;
      try {
        const pendingCheckoutStr = localStorage.getItem("pendingCheckout");
        if (pendingCheckoutStr) {
          redirectPayload = JSON.parse(pendingCheckoutStr);
        }
      } catch (error) {
        console.error("Failed to parse pending checkout payload:", error);
      } finally {
        localStorage.removeItem("pendingCheckout");
      }

      if (redirectPayload?.orderItems?.length) {
        navigate("/checkout", { replace: true, state: redirectPayload });
        return;
      }

      const from = location.state?.from || "/home";
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Customer login error:", err);
      setError("Đã có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
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

        <button type="submit" disabled={loading}>
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>

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
