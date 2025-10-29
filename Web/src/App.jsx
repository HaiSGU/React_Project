import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import CategoryPage from "./pages/CategoryPage/CategoryPage.jsx";
import MenuPage from "./pages/MenuPage/MenuPage.jsx";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage.jsx";
import CartPage from "./pages/CartPage/CartPage.jsx";
import AccountPage from "./pages/AccountPage/AccountPage.jsx";
import ContactPage from "./pages/ContactPage/ContactPage.jsx"; // 👈 sửa .jsx
import MapSelectPage from "./pages/MapSelectPage/MapSelectPage.jsx";
import RestaurantDashboard from "./pages/RestaurantDashboard/RestaurantDashboard";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const handleLogin = (userInfo) => {
    setUser(userInfo);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/home" /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/home" element={<HomePage user={user} />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/menu/:id" element={<MenuPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/account"
          element={<AccountPage user={user} onLogout={() => setUser(null)} />}
        />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/map-select" element={<MapSelectPage />} />
        <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;