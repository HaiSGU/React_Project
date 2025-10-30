// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Kiểm tra localStorage khi app khởi động
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse user:', e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = ({ username, password }) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u) => u.username === username && u.password === password);
    if (!foundUser) {
      throw new Error('Sai tên đăng nhập hoặc mật khẩu!');
    }
    const userData = { username }; // Lưu username vào user
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const register = ({ username, password }) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some((u) => u.username === username)) {
      throw new Error('Tài khoản đã tồn tại!');
    }
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (newData) => {
    const updatedUser = { ...user, ...newData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}