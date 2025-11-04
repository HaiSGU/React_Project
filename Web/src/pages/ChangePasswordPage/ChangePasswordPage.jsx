import { useNavigate } from "react-router-dom";
import { changePassword, getCurrentUser } from "@shared/services/authService";
import { useChangePassword } from "@shared/hooks/useChangePassword";
import "./ChangePasswordPage.css";

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  
  const {
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    loading,
    setLoading,
    validate,
    reset,
  } = useChangePassword();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const user = await getCurrentUser(localStorage);
      
      if (!user) {
        alert('Bạn chưa đăng nhập!');
        setLoading(false);
        navigate('/login');
        return;
      }
      
      if (!validate(user.password)) {
        setLoading(false);
        return;
      }
      
      const result = await changePassword(localStorage, oldPassword, newPassword);
      
      if (result.success) {
        alert('Đổi mật khẩu thành công!');
        reset();
        navigate('/account');
      } else {
        alert('Lỗi: ' + result.error);
      }
    } catch (err) {
      console.error('Change password error:', err);
      alert('Đã có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-page">
      <header className="change-password-header">
        <button className="back-btn" onClick={() => navigate('/account')} aria-label="Quay lại">
          ←
        </button>
        <h1>Đổi mật khẩu</h1>
      </header>

      <div className="change-password-content">
        <form className="password-form" onSubmit={handleChangePassword}>
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="oldPassword">Mật khẩu cũ</label>
            <input
              id="oldPassword"
              type="password"
              placeholder="Nhập mật khẩu cũ"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              disabled={loading}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">Mật khẩu mới</label>
            <input
              id="newPassword"
              type="password"
              placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              required
              minLength={6}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
              className="form-input"
            />
          </div>

          <button 
            type="submit" 
            className="btn-submit" 
            disabled={loading}
          >
            {loading ? '⏳ Đang xử lý...' : '🔒 Đổi mật khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
}
