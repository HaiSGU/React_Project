import { useState } from "react";
import "./CartPage.css";
import FooterNav from "../../components/FooterNav"; // ✅ nhớ import

export default function CartPage() {
  const [activeTab, setActiveTab] = useState("dangGiao");

  // fake dữ liệu đơn hàng
  const orders = {
    dangGiao: [
      { id: 1, item: "Hamburger x2", total: 100000, status: "Đang giao 🚚" },
      { id: 2, item: "Pepsi x1", total: 20000, status: "Đang giao 🚚" },
    ],
    daGiao: [
      { id: 3, item: "Chips x3", total: 90000, status: "Đã giao ✔️" },
    ]
  };

  const list = orders[activeTab];

  return (
    <div className="cart-page">
      <header className="cart-header">
        <h2>Cart</h2>
      </header>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "dangGiao" ? "tab active" : "tab"}
          onClick={() => setActiveTab("dangGiao")}
        >
          Đang giao
        </button>
        <button
          className={activeTab === "daGiao" ? "tab active" : "tab"}
          onClick={() => setActiveTab("daGiao")}
        >
          Đã giao
        </button>
      </div>

      {/* Danh sách đơn */}
      <div className="order-list">
        {list.length === 0 ? (
          <p>Không có đơn hàng</p>
        ) : (
          list.map((o) => (
            <div key={o.id} className="order-card">
              <p>{o.item}</p>
              <p>Tổng: {o.total.toLocaleString()} đ</p>
              <p>{o.status}</p>
            </div>
          ))
        )}
      </div>
      <FooterNav /> 
    </div>
  );
}