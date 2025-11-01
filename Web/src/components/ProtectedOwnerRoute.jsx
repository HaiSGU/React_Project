import { Navigate, useLocation } from 'react-router-dom'
import { getCurrentOwner } from '@shared/services/restaurantAuthService'

export default function ProtectedOwnerRoute({ children }) {
  const location = useLocation()
  
  // ✅ CHECK NGAY, KHÔNG DÙNG useEffect
  const owner = getCurrentOwner(localStorage)
  
  console.log('=== PROTECTED ROUTE CHECK ===')
  console.log('Owner:', owner)
  console.log('Location:', location.pathname)
  
  // Không có quyền → Redirect
  if (!owner || owner.role !== 'owner') {
    console.log('❌ NOT AUTHORIZED - Redirecting to login')
    return <Navigate to="/login" state={{ from: location, error: 'owner_required' }} replace />
  }
  
  // ✅ Có quyền
  console.log('✅ AUTHORIZED - Rendering dashboard')
  return children
}