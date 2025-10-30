import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MenuItem from "../../components/MenuItem";
import "./MenuPage.css";

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams(); // 🧩 Lấy restaurantId từ URL (/menu/:id)

  // ✅ Lấy dữ liệu món ăn theo nhà hàng
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/menus?restaurantId=${id}`)
      .then(res => res.json())
      .then(data => {
        // thêm field quantity mặc định
        const updated = data.map(item => ({ ...item, quantity: 0 }));
        setItems(updated);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi khi tải dữ liệu menu:", err);
        setLoading(false);
      });
  }, [id]);

  const updateQuantity = (id, change) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      )
    );
  };

  const selectedItems = items.filter(i => i.quantity > 0);
  const totalPrice = selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleCheckout = () => {
    navigate("/checkout", { state: { orderItems: selectedItems, totalPrice } });
  };

  const handleBack = () => navigate(-1);

  if (loading) return <div className="loading">Đang tải menu...</div>;

  return (
    <div className="menu-page">
      <header className="menu-header">
        <button className="back-btn" onClick={handleBack}>←</button>
        <span>Menu nhà hàng #{id}</span>
      </header>

      <div className="menu-list">
        {items.map(item => (
          <MenuItem
            key={item.id}
            {...item}
            updateQuantity={updateQuantity}
          />
        ))}
      </div>

      {totalPrice > 0 && (
        <div className="cart-bar">
          <span>Tổng cộng: {totalPrice.toLocaleString()} đ</span>
          <button className="checkout-btn" onClick={handleCheckout}>
            Thanh toán →
          </button>
        </div>
      )}
    </div>
  );
}
