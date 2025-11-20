import { useState, useEffect } from "react";
import {
  getShippingOrders,
  getDeliveredOrders,
  confirmDelivery
} from "@shared/services/orderService";
import { useRealtimeOrders, useEventListener } from "@shared/hooks/useRealtime";
import { EVENT_TYPES } from "@shared/services/eventBus";
import "./CartPage.css";

export default function CartPage() {
  const [activeTab, setActiveTab] = useState("dangGiao");
  const [orders, setOrders] = useState({ dangGiao: [], daGiao: [] });

  // 🔥 Real-time orders hook
  const { orders: realtimeOrders, lastUpdate } = useRealtimeOrders();

  // ✅ Đọc từ orderService khi component mount + Polling mỗi 5s
  useEffect(() => {
    loadOrders({ syncRemote: false });

    // 🔄 Polling: Tự động refresh mỗi 5 giây để đồng bộ với server
    // (Khi Mobile đặt hàng, polling sẽ sync vào localStorage, sau đó refresh UI)
    const intervalId = setInterval(() => {
      loadOrders({ syncRemote: false });
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  // 🔥 Listen to order status changes
  useEventListener(EVENT_TYPES.ORDER_CONFIRMED, () => {
    loadOrders({ syncRemote: false }); // Không sync để tránh ghi đè
    console.log('📦 Đơn hàng của bạn đã được xác nhận!');
  });

  useEventListener(EVENT_TYPES.ORDER_SHIPPING, () => {
    loadOrders({ syncRemote: false }); // Không sync để tránh ghi đè
    console.log('🚚 Đơn hàng đang được giao!');
  });

  const loadOrders = async (options = {}) => {
    const shipping = await getShippingOrders(localStorage, options);
    const delivered = await getDeliveredOrders(localStorage, options);
    setOrders({ dangGiao: shipping, daGiao: delivered });
  };

  // ✅ Chuyển đơn sang "Đã giao" using orderService
  const handleCompleteOrder = async (orderId) => {
    const order = orders.dangGiao.find(o => o.id === orderId);
    if (!order) return;

    const result = await confirmDelivery(order, localStorage);

    if (result.success) {
      setOrders({
        dangGiao: result.shipping,
        daGiao: result.delivered
      });
    } else {
      alert(result.error || 'Lỗi khi hoàn tất đơn hàng');
    }
  };

  const list = orders[activeTab];

  return (
    <div className="cart-page">
      <header className="cart-header">
        <h2>🛒 Đơn hàng của tôi</h2>
      </header>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "dangGiao" ? "tab active" : "tab"}
          onClick={() => setActiveTab("dangGiao")}
        >
          Đang giao ({orders.dangGiao.length})
        </button>
        <button
          className={activeTab === "daGiao" ? "tab active" : "tab"}
          onClick={() => setActiveTab("daGiao")}
        >
          Đã giao ({orders.daGiao.length})
        </button>
      </div>

      {/* Danh sách đơn */}
      <div className="order-list">
        {list.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "#64748b"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>📦</div>
            <p>Không có đơn hàng nào</p>
          </div>
        ) : (
          list.map((order) => (
            <div key={order.id} className="order-card" style={{
              background: "white",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
              {/* Header đơn hàng */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
                paddingBottom: "12px",
                borderBottom: "1px solid #f0f0f0"
              }}>
                <div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    Đơn hàng #{order.id}
                  </div>
                  {order.restaurantName && (
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#1a202c", marginTop: "4px" }}>
                      🏪 {order.restaurantName}
                    </div>
                  )}
                  <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </div>
                </div>
                <div style={{
                  padding: "4px 12px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "600",
                  background: activeTab === "dangGiao" ? "#fff3cd" : "#d4edda",
                  color: activeTab === "dangGiao" ? "#856404" : "#155724"
                }}>
                  {order.status}
                </div>
              </div>

              {/* Thông tin shipper */}
              {order.shipper && (
                <div style={{
                  background: "#f8f9fa",
                  borderRadius: "8px",
                  padding: "12px",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  <div style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #00bcd4, #0097a7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px"
                  }}>
                    {order.shipper.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "600", fontSize: "14px" }}>
                      {order.shipper.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>
                      📞 {order.shipper.phone}
                    </div>
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    ⏱️ {order.shipper.estimatedTime}
                  </div>
                </div>
              )}

              {/* Danh sách món */}
              <div style={{ marginBottom: "12px" }}>
                <div style={{
                  fontSize: "13px",
                  color: "#64748b",
                  marginBottom: "6px"
                }}>
                  Món đã đặt:
                </div>
                <div style={{
                  fontSize: "14px",
                  color: "#1a202c",
                  lineHeight: "1.5"
                }}>
                  {order.itemsSummary || "Không có thông tin"}
                </div>
              </div>

              {/* Tổng tiền */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "12px",
                borderTop: "1px solid #f0f0f0"
              }}>
                <div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    Tổng cộng:
                  </div>
                  <div style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#00bcd4"
                  }}>
                    {order.total.toLocaleString()} đ
                  </div>
                </div>

                {/* Nút hành động */}
                {activeTab === "dangGiao" && (
                  <button
                    onClick={() => handleCompleteOrder(order.id)}
                    style={{
                      background: "#10b981",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "600"
                    }}
                  >
                    ✓ Đã nhận
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}