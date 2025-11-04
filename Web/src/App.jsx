import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import LoginPage from './pages/LoginPage/LoginPage'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import MenuPage from './pages/MenuPage/MenuPage'
import CheckoutPage from './pages/CheckoutPage/CheckoutPage'
import RestaurantDashboard from './pages/RestaurantDashboard/RestaurantDashboard'
import CategoryPage from './pages/CategoryPage/CategoryPage'
import CartPage from './pages/CartPage/CartPage'
import ProtectedOwnerRoute from './components/ProtectedOwnerRoute'
import AccountPage from './pages/AccountPage/AccountPage'
import ContactPage from './pages/ContactPage/ContactPage'
import DiscountPage from './pages/DiscountPage/DiscountPage'
import ChangePasswordPage from './pages/ChangePasswordPage/ChangePasswordPage'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
import AdminLogin from './pages/AdminDashboard/AdminLogin'
import AdminDashboard from './pages/AdminDashboard/AdminDashboard'
import './styles/theme.css'


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/menu/:id" element={<MenuPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/discount/:type" element={<DiscountPage />} />
        {/* Protected Route cho Owner */}
        <Route
          path="/restaurant-dashboard"
          element={
            <ProtectedOwnerRoute>
              <RestaurantDashboard />
            </ProtectedOwnerRoute>
          }
        />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App