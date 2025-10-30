import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./LoginPage.css";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // Đăng ký tài khoản mới
    if (isRegister) {
      if (password !== confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
      }

      const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      if (existingUsers.some((u) => u.username === username)) {
        alert("Tên đăng nhập đã tồn tại!");
        return;
      }

      existingUsers.push({ username, password });
      localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));
      alert("Đăng ký thành công! Hãy đăng nhập.");
      setIsRegister(false);
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      return;
    }

    // Đăng nhập
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const foundUser = registeredUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (!foundUser) {
      alert("Sai tên đăng nhập hoặc mật khẩu!");
      return;
    }

    const userInfo = username.startsWith("rest-")
      ? { username, role: "restaurant" }
      : { username, role: "user" };

    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    localStorage.setItem("isLoggedIn", "true");

    const from = location.state?.from || "/home";
    navigate(from);
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>{isRegister ? "Đăng ký tài khoản" : "Đăng nhập"}</h2>

        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {isRegister && (
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}

        <button type="submit">{isRegister ? "Đăng ký" : "Đăng nhập"}</button>

        <p className="toggle-auth">
          {isRegister ? (
            <>
              Đã có tài khoản?{" "}
              <span onClick={() => setIsRegister(false)}>Đăng nhập</span>
            </>
          ) : (
            <>
              Chưa có tài khoản?{" "}
              <span onClick={() => setIsRegister(true)}>Đăng ký ngay</span>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
