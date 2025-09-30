import { useState } from "react";
import MenuItem from "../../components/MenuItem";
import "./MenuPage.css";

export default function MenuPage() {
  const [items, setItems] = useState([
    { id: 1, name: "Hamburger", price: 50000, rating: 4.5, sold: 100,
      img: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png", quantity: 0 },
    { id: 2, name: "Chips", price: 30000, rating: 4.5, sold: 100,
      img: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png", quantity: 0 },
    { id: 3, name: "Coca Cola", price: 20000, rating: 4.5, sold: 100,
      img: "https://cdn-icons-png.flaticon.com/512/3664/3664543.png", quantity: 0 },
    { id: 4, name: "Pepsi", price: 20000, rating: 4.5, sold: 100,
      img: "https://cdn-icons-png.flaticon.com/512/3664/3664549.png", quantity: 0 },
  ]);

  const updateQuantity = (id, change) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      )
    );
  };

  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="menu-page">
      <header className="menu-header">
        <span className="back-btn">←</span>
        <span>Menu</span>
      </header>

      <div className="menu-list">
        {items.map(item => (
          <MenuItem key={item.id} {...item} updateQuantity={updateQuantity} />
        ))}
      </div>

      {totalPrice > 0 && (
        <div className="cart-bar">
          <span>Tổng cộng: {totalPrice.toLocaleString()} đ</span>
          <button className="checkout-btn">Thanh toán →</button>
        </div>
      )}
    </div>
  );
}