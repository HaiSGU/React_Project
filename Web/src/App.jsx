import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import LoginPage from './pages/LoginPage/LoginPage'
import MenuPage from './pages/MenuPage/MenuPage'
import CheckoutPage from './pages/CheckoutPage/CheckoutPage'
import RestaurantDashboard from './pages/RestaurantDashboard/RestaurantDashboard'
import CategoryPage from './pages/CategoryPage/CategoryPage'
import CartPage from './pages/CartPage/CartPage' // ← THÊM IMPORT
import ProtectedOwnerRoute from './components/ProtectedOwnerRoute'
import AccountPage from './pages/AccountPage/AccountPage' // ← Import
import ContactPage from './pages/ContactPage/ContactPage' // ← Import
import DiscountCard from './components/DiscountCard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/menu/:id" element={<MenuPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/category/:id" element={<CategoryPage />} />
      <Route path="/cart" element={<CartPage />} /> {/* ← THÊM ROUTE */}
      <Route path="/account" element={<AccountPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/discount/:type" element={<DiscountCard />} />
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