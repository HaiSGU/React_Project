import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import LoginPage from './pages/LoginPage/LoginPage'
import MenuPage from './pages/MenuPage/MenuPage'
import CheckoutPage from './pages/CheckoutPage/CheckoutPage'
import RestaurantDashboard from './pages/RestaurantDashboard/RestaurantDashboard'
import ProtectedOwnerRoute from './components/ProtectedOwnerRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/menu/:id" element={<MenuPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      
      {/* Protected Route cho Owner */}
      <Route
        path="/restaurant-dashboard"
        element={
          <ProtectedOwnerRoute>
            <RestaurantDashboard />
          </ProtectedOwnerRoute>
        }
      />
    </Routes>
  )
}

export default App