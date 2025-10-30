import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  // Nếu chưa đăng nhập, chuyển đến trang login
  // Lưu lại vị trí hiện tại để sau khi login sẽ quay lại đây
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Nếu đã đăng nhập, cho phép truy cập
  return children;
}