import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MenuItem from "../../components/MenuItem";
import "./MenuPage.css";
import FooterNav from "../../components/FooterNav";
import { useSearch } from "@shared/hooks/useSearch";
import shipperimage from "@shared/assets/images/shipperimage.jpeg";


export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { query, setQuery } = useSearch(); // ✅ hook tìm kiếm

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`http://localhost:3000/menus?restaurantId=${id}`);
        if (!res.ok) throw new Error("Không thể tải menu");

        const data = await res.json();
        const updated = data.map(item => ({
          ...item,
          quantity: 0,
          price: Number(item.price),
        }));
        setItems(updated);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMenu();
  }, [id]);

  const updateQuantity = (menuId, change) => {
    setItems(prev =>
      prev.map(item =>
        item.id === menuId
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      )
    );
  };

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    return items.filter(i =>
      i.name.toLowerCase().includes(query.toLowerCase().trim())
    );
  }, [items, query]);

  const { selectedItems, totalPrice, totalItems } = useMemo(() => {
    const selected = items.filter(i => i.quantity > 0);
    const total = selected.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const count = selected.reduce((sum, i) => sum + i.quantity, 0);
    return { selectedItems: selected, totalPrice: total, totalItems: count };
  }, [items]);

  const handleCheckout = () => {
    if (totalItems === 0) return;
    navigate("/checkout", {
      state: { orderItems: selectedItems, totalPrice, restaurantId: Number(id) },
    });
  };

  const handleBack = () => navigate(-1);

  if (loading) return <div className="menu-page loading">Đang tải...</div>;
  if (error) return <div className="menu-page error">Lỗi: {error}</div>;

  return (
    <div className="menu-page">
      {/* ✅ HEADER */}
      <header className="menu-header">
        <button className="back-btn" onClick={handleBack}>
          ←
        </button>
        <h1>Menu nhà hàng #{id}</h1>

        {/* 🔍 Ô tìm kiếm */}
        <input
          type="text"
          className="search-box"
          placeholder="Tìm món ăn..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </header>

      {/* ✅ LAYOUT 2 CỘT */}
      <div className="menu-layout">
        {/* 🧱 SIDEBAR */}
        <aside className="menu-sidebar">
          <h3>Bộ lọc</h3>
          <ul>
            <li><button>Tất cả món</button></li>
            <li><button>Món chính</button></li>
            <li><button>Đồ uống</button></li>
            <li><button>Tráng miệng</button></li>
          </ul>
        </aside>

        {/* 🍔 CONTENT */}
        <main className="menu-content">
          <h3 className="search-result-title">
            {query.trim() ? "🔍 Kết quả tìm kiếm" : "⭐ Tất cả món ăn"}
          </h3>

          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <MenuItem key={item.id} {...item} updateQuantity={updateQuantity} />
            ))
          ) : (
            <p>Không tìm thấy món phù hợp.</p>
          )}
        </main>
      </div>

      {/* 💰 CART BAR */}
      {totalPrice > 0 && (
        <div className="cart-bar">
          <div className="cart-info">
            <span>{totalItems} món</span>
            <span>{totalPrice.toLocaleString("vi-VN")} đ</span>
          </div>
          <button className="checkout-btn" onClick={handleCheckout}>
            Thanh toán
          </button>
        </div>
      )}

      {/* 🦶 FOOTER */}
      <footer>
        <FooterNav />
      </footer>
    </div>
  );
}