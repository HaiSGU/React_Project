import { Navigate } from 'react-router-dom';
import { isAdminAuthenticated } from '../../../shared/services/adminAuthService';

export default function ProtectedAdminRoute({ children }) {
  const ok = isAdminAuthenticated(sessionStorage);
  return ok ? children : <Navigate to="/admin/login" replace />;
}