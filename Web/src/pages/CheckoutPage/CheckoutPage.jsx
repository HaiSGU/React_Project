import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CheckoutPage.css";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Lấy dữ liệu từ MenuPage (nếu có)
  const orderFromMenu = location.state?.orderItems || [];
  const totalFromMenu = location.state?.totalPrice || 0;
  const restaurantId = location.state?.restaurantId;

  // Fallback data nếu không có từ MenuPage
  const [orderItems] = useState(orderFromMenu.length > 0 ? orderFromMenu : [
    { id: 1, name: "Phở bò", price: 50000, quantity: 2 },
    { id: 2, name: "Bún chả", price: 45000, quantity: 1 },
  ]);
  
  const [selectedShipper, setSelectedShipper] = useState(null);
  const [showShipperModal, setShowShipperModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Danh sách shipper có sẵn
  const shippers = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      phone: "0912345678",
      rating: 4.8,
      trips: 230,
      vehicle: "Xe máy",
      distance: "0.8 km",
      estimatedTime: "15 phút",
      fee: 15000,
      avatar: "👨",
      status: "Đang rảnh"
    },
    {
      id: 2,
      name: "Trần Thị B",
      phone: "0987654321",
      rating: 4.9,
      trips: 450,
      vehicle: "Xe máy",
      distance: "1.2 km",
      estimatedTime: "20 phút",
      fee: 18000,
      avatar: "👩",
      status: "Đang rảnh"
    },
    {
      id: 3,
      name: "Lê Văn C",
      phone: "0909123456",
      rating: 4.7,
      trips: 180,
      vehicle: "Xe máy",
      distance: "1.5 km",
      estimatedTime: "25 phút",
      fee: 20000,
      avatar: "🧑",
      status: "Đang giao hàng"
    }
  ];

  const user = {
    fullname: "Nguyễn Thanh Đạt",
    phone: "0365986732",
    address: "Bình Tân, TP.HCM",
  };

  const shippingFee = selectedShipper ? selectedShipper.fee : 20000;
  const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal + shippingFee;

  const handleSelectShipper = (shipper) => {
    if (shipper.status !== "Đang rảnh") return;
    setSelectedShipper(shipper);
    setShowShipperModal(false);
  };

  const handleOrder = () => {
    if (!selectedShipper) {
      alert("⚠️ Vui lòng chọn shipper trước khi đặt hàng!");
      return;
    }

    // ✅ Tạo đơn hàng mới
    const newOrder = {
      id: Date.now(),
      restaurantId: restaurantId || 1,
      items: orderItems,
      itemsSummary: orderItems.map(i => `${i.name} x${i.quantity}`).join(", "),
      subtotal: subtotal,
      shippingFee: shippingFee,
      total: total,
      shipper: selectedShipper,
      user: user,
      status: "Đang giao 🚚",
      createdAt: new Date().toISOString()
    };

    // ✅ Lưu vào localStorage
    const existingOrders = JSON.parse(
      localStorage.getItem('orders') || '{"dangGiao":[],"daGiao":[]}'
    );
    
    existingOrders.dangGiao.unshift(newOrder); // Thêm vào đầu mảng
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    console.log('✅ Đã lưu đơn hàng:', newOrder);
    
    setShowSuccessModal(true);
  };

  const handleBackToHome = () => {
    setShowSuccessModal(false);
    setTimeout(() => {
      navigate('/home');
    }, 300);
  };

  const handleViewOrders = () => {
    setShowSuccessModal(false);
    setTimeout(() => {
      navigate('/cart');
    }, 300);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #f0f9ff 0%, #e0f2fe 100%)",
      padding: "20px",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      {/* HEADER */}
      <header style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "24px",
        padding: "12px",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <button 
          onClick={() => navigate(-1)}
          style={{
            background: "#00bcd4",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "8px 12px",
            cursor: "pointer",
            fontSize: "18px"
          }}
        >←</button>
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>Thanh toán</h2>
      </header>

      {/* THÔNG TIN NGƯỜI NHẬN */}
      <section style={{
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          👤 Thông tin người nhận
        </h3>
        <p style={{ margin: "4px 0", color: "#1a202c" }}><strong>{user.fullname}</strong></p>
        <p style={{ margin: "4px 0", color: "#64748b" }}>{user.phone}</p>
        <p style={{ margin: "4px 0", color: "#64748b" }}>📍 {user.address}</p>
      </section>

      {/* CHỌN SHIPPER */}
      <section style={{
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          🚚 Chọn Shipper
        </h3>
        
        {selectedShipper ? (
          <div style={{
            background: "linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)",
            borderRadius: "12px",
            padding: "16px",
            color: "white",
            position: "relative"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <div style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px"
              }}>
                {selectedShipper.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "700", fontSize: "16px" }}>{selectedShipper.name}</div>
                <div style={{ fontSize: "13px", opacity: 0.9 }}>⭐ {selectedShipper.rating} • {selectedShipper.trips} chuyến</div>
              </div>
              <button 
                onClick={() => setShowShipperModal(true)}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px"
                }}
              >
                Đổi
              </button>
            </div>
            <div style={{ display: "flex", gap: "16px", fontSize: "13px", opacity: 0.95 }}>
              <span>🏍️ {selectedShipper.vehicle}</span>
              <span>📍 {selectedShipper.distance}</span>
              <span>⏱️ {selectedShipper.estimatedTime}</span>
            </div>
            <div style={{ 
              marginTop: "8px", 
              paddingTop: "8px", 
              borderTop: "1px solid rgba(255,255,255,0.3)",
              fontSize: "14px",
              fontWeight: "600"
            }}>
              Phí ship: {selectedShipper.fee.toLocaleString()} đ
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setShowShipperModal(true)}
            style={{
              width: "100%",
              background: "#00bcd4",
              color: "white",
              border: "none",
              padding: "14px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            <span style={{ fontSize: "20px" }}>🚚</span>
            Chọn Shipper giao hàng
          </button>
        )}
      </section>

      {/* DANH SÁCH MÓN */}
      <section style={{
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <h3 style={{ margin: "0 0 12px 0", fontSize: "16px" }}>🧾 Đơn hàng</h3>
        {orderItems.map((item) => (
          <div key={item.id} style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "8px 0",
            borderBottom: "1px solid #f0f0f0"
          }}>
            <span style={{ color: "#1a202c" }}>{item.name} × {item.quantity}</span>
            <span style={{ fontWeight: "600", color: "#00bcd4" }}>
              {(item.price * item.quantity).toLocaleString()} đ
            </span>
          </div>
        ))}
      </section>

      {/* TỔNG CỘNG */}
      <div style={{
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ color: "#64748b" }}>Tạm tính:</span>
          <span>{subtotal.toLocaleString()} đ</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ color: "#64748b" }}>Phí ship:</span>
          <span>{shippingFee.toLocaleString()} đ</span>
        </div>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: "12px",
          borderTop: "2px solid #e0e0e0",
          fontSize: "18px",
          fontWeight: "700"
        }}>
          <span>Tổng cộng:</span>
          <span style={{ color: "#00bcd4" }}>{total.toLocaleString()} đ</span>
        </div>
      </div>

      {/* NÚT ĐẶT HÀNG */}
      <button 
        onClick={handleOrder}
        style={{
          width: "100%",
          background: selectedShipper ? "linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)" : "#ccc",
          color: "white",
          border: "none",
          padding: "16px",
          borderRadius: "12px",
          cursor: selectedShipper ? "pointer" : "not-allowed",
          fontSize: "16px",
          fontWeight: "700",
          boxShadow: selectedShipper ? "0 4px 12px rgba(0,188,212,0.3)" : "none",
          transition: "all 0.3s ease"
        }}
      >
        {selectedShipper ? "✅ Đặt hàng ngay" : "⚠️ Chọn shipper để tiếp tục"}
      </button>

      {/* MODAL CHỌN SHIPPER */}
      {showShipperModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          zIndex: 1000,
          animation: "fadeIn 0.3s ease"
        }} onClick={() => setShowShipperModal(false)}>
          <div style={{
            background: "white",
            borderRadius: "20px 20px 0 0",
            width: "100%",
            maxWidth: "600px",
            maxHeight: "80vh",
            overflowY: "auto",
            padding: "24px",
            animation: "slideUp 0.3s ease"
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px"
            }}>
              <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>
                Chọn Shipper
              </h3>
              <button 
                onClick={() => setShowShipperModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#64748b"
                }}
              >
                ×
              </button>
            </div>

            {shippers.map((shipper) => (
              <div 
                key={shipper.id}
                onClick={() => handleSelectShipper(shipper)}
                style={{
                  background: shipper.status === "Đang rảnh" ? "#f8f9fa" : "#fff5f5",
                  border: selectedShipper?.id === shipper.id ? "2px solid #00bcd4" : "1px solid #e0e0e0",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "12px",
                  cursor: shipper.status === "Đang rảnh" ? "pointer" : "not-allowed",
                  opacity: shipper.status === "Đang rảnh" ? 1 : 0.6,
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                  <div style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #00bcd4, #0097a7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px"
                  }}>
                    {shipper.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "700", fontSize: "16px", marginBottom: "4px" }}>
                      {shipper.name}
                    </div>
                    <div style={{ fontSize: "13px", color: "#64748b" }}>
                      ⭐ {shipper.rating} • {shipper.trips} chuyến
                    </div>
                  </div>
                  <div style={{
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "600",
                    background: shipper.status === "Đang rảnh" ? "#d4edda" : "#f8d7da",
                    color: shipper.status === "Đang rảnh" ? "#155724" : "#721c24"
                  }}>
                    {shipper.status}
                  </div>
                </div>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "8px",
                  fontSize: "13px",
                  color: "#64748b"
                }}>
                  <div>🏍️ {shipper.vehicle}</div>
                  <div>📍 {shipper.distance}</div>
                  <div>⏱️ {shipper.estimatedTime}</div>
                </div>
                <div style={{
                  marginTop: "10px",
                  paddingTop: "10px",
                  borderTop: "1px solid #e0e0e0",
                  fontWeight: "600",
                  color: "#00bcd4",
                  fontSize: "15px"
                }}>
                  Phí ship: {shipper.fee.toLocaleString()} đ
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL THÀNH CÔNG */}
      {showSuccessModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000,
          animation: "fadeIn 0.3s ease"
        }}>
          <div style={{
            background: "white",
            borderRadius: "20px",
            width: "90%",
            maxWidth: "400px",
            padding: "32px",
            textAlign: "center",
            animation: "scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              margin: "0 auto 20px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
              animation: "bounce 0.6s ease"
            }}>
              ✓
            </div>

            <h2 style={{
              margin: "0 0 12px 0",
              fontSize: "24px",
              fontWeight: "700",
              color: "#1a202c"
            }}>
              Đặt hàng thành công! 🎉
            </h2>

            <p style={{
              margin: "0 0 20px 0",
              color: "#64748b",
              fontSize: "15px",
              lineHeight: "1.6"
            }}>
              Đơn hàng của bạn đã được xác nhận.<br/>
              Shipper <strong>{selectedShipper.name}</strong> sẽ giao hàng trong <strong>{selectedShipper.estimatedTime}</strong>
            </p>

            <div style={{
              background: "#f8f9fa",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "20px",
              textAlign: "left"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "12px"
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #00bcd4, #0097a7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px"
                }}>
                  {selectedShipper.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "15px" }}>
                    {selectedShipper.name}
                  </div>
                  <div style={{ fontSize: "13px", color: "#64748b" }}>
                    📞 {selectedShipper.phone}
                  </div>
                </div>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "13px",
                color: "#64748b"
              }}>
                <span>⭐ {selectedShipper.rating}</span>
                <span>🏍️ {selectedShipper.vehicle}</span>
                <span>⏱️ {selectedShipper.estimatedTime}</span>
              </div>
            </div>

            <div style={{
              background: "linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)",
              color: "white",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "20px",
              fontSize: "18px",
              fontWeight: "700"
            }}>
              Tổng thanh toán: {total.toLocaleString()} đ
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button 
                onClick={handleViewOrders}
                style={{
                  flex: 1,
                  background: "white",
                  color: "#00bcd4",
                  border: "2px solid #00bcd4",
                  padding: "14px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontWeight: "600"
                }}
              >
                Xem đơn hàng
              </button>
              <button 
                onClick={handleBackToHome}
                style={{
                  flex: 1,
                  background: "linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)",
                  color: "white",
                  border: "none",
                  padding: "14px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontWeight: "600",
                  boxShadow: "0 4px 12px rgba(0,188,212,0.3)"
                }}
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.8);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}