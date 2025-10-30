import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./LoginPage.css"; // Dùng lại style đăng nhập

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const { register } = useAuth(); // Lấy register từ AuthContext
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    // Kiểm tra trường trống
    if (!username || !password || !confirm) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Kiểm tra mật khẩu khớp
    if (password !== confirm) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      // Gọi hàm register từ AuthContext
      register({ username, password });
      alert("Đăng ký thành công! Mời bạn đăng nhập.");
      setUsername("");
      setPassword("");
      setConfirm("");
      navigate("/login");
    } catch (error) {
      alert(error.message || "Tài khoản đã tồn tại hoặc lỗi đăng ký!");
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleRegister}>
        <h2>Đăng ký tài khoản</h2>
        <input
          type="text"
          placeholder="Tên đăng nhập hoặc email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Xác nhận mật khẩu"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <button type="submit">Đăng ký</button>
        <p className="register-link">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
}