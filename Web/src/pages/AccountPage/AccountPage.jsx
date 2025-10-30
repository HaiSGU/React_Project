import { useState } from "react";
import "./AccountPage.css";
import FooterNav from "../../components/FooterNav"; // ✅ nhớ import

export default function AccountPage({ user, onLogout, onUpdateUser }) {
  const [formData, setFormData] = useState({
    username: user?.username || "nguyenthanhdat",
    phone: user?.phone || "0365986732",
    address: user?.address || "btan",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert("Cập nhật thành công!");
    if (onUpdateUser) onUpdateUser(formData);
  };

  const handleChangePassword = () => {
    alert("Chức năng đổi mật khẩu đang phát triển 🔒");
  };

  return (
    <div className="account-page">
      <header className="account-header">Account</header>

      <h2 className="section-title">Thông tin cá nhân</h2>

      <div className="form">
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
        />

        <button className="btn-save" onClick={handleSave}>
          Lưu
        </button>
        <button className="btn-secondary" onClick={handleChangePassword}>
          Đổi mật khẩu
        </button>
        <button className="btn-secondary" onClick={onLogout}>
          Đăng xuất
        </button>
      </div>

      <FooterNav /> {/* ✅ nhớ thêm FooterNav ở cuối trang */}
    </div>
  );
}
