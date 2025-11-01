import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { applyVoucher } from "@shared/services/voucherService";
import "./CheckoutPage.css";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [cart, setCart] = useState([]);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [useDefaultAddress, setUseDefaultAddress] = useState(true);
  const [customAddress, setCustomAddress] = useState("");

  // User info từ localStorage
  const [userInfo, setUserInfo] = useState({
    fullname: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    loadCart();
    loadUserInfo();

    // Lấy địa chỉ từ map nếu có
    const newAddress = location.state?.newAddress;
    if (newAddress) {
      setCustomAddress(newAddress);
      setUseDefaultAddress(false);
    }

    // Auto-apply voucher từ Home
    const selectedVoucher = localStorage.getItem("selectedVoucher");
    if (selectedVoucher) {
      const voucher = JSON.parse(selectedVoucher);
      setVoucherCode(voucher.code);
      setTimeout(
        () => handleApplyVoucher(voucher.code, voucher.restaurantId),
        500
      );
      localStorage.removeItem("selectedVoucher");
    }
  }, [location]);

  const loadCart = () => {
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    console.log("📦 Cart loaded:", cartData);
    setCart(cartData);
  };

  const loadUserInfo = () => {
    // Lấy từ localStorage hoặc dùng mặc định
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

    setUserInfo({
      fullname: currentUser.fullname || currentUser.username || "Khách hàng",
      phone: currentUser.phone || "0123456789",
      address: currentUser.address || "Chưa có địa chỉ",
    });
  };

  const calculateSubtotal = () => {
    return cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const shippingFee = 20000;

  const calculateTotal = () => {
    return calculateSubtotal() + shippingFee - discount;
  };

  const handleApplyVoucher = (code = voucherCode, restaurantId = null) => {
    if (!code.trim()) {
      alert("Vui lòng nhập mã voucher!");
      return;
    }

    if (!restaurantId && cart.length > 0) {
      restaurantId = cart[0].restaurantId;
    }

    if (!restaurantId) {
      alert("Không xác định được nhà hàng!");
      return;
    }

    const result = applyVoucher(restaurantId, code, calculateSubtotal(), localStorage);

    if (result.success) {
      setAppliedVoucher(result.voucher);
      setDiscount(result.discount);
      alert(`✅ Áp dụng voucher thành công! Giảm ${result.discount.toLocaleString()}đ`);
    } else {
      alert("❌ " + result.error);
      setAppliedVoucher(null);
      setDiscount(0);
    }
  };

  const handleRemoveVoucher = () => {
    setVoucherCode("");
    setAppliedVoucher(null);
    setDiscount(0);
  };

  const handleChooseMap = () => {
    navigate("/map-select", {
      state: {
        returnTo: "/checkout",
        currentCart: cart,
      },
    });
  };

  const handleOrder = () => {
    if (cart.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }

    if (!userInfo.fullname || !userInfo.phone) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const finalAddress = useDefaultAddress
      ? userInfo.address
      : customAddress || userInfo.address;

    if (!finalAddress || finalAddress === "Chưa có địa chỉ") {
      alert("Vui lòng chọn địa chỉ giao hàng!");
      return;
    }

    // Lấy restaurantId từ cart
    const restaurantId = cart[0]?.restaurantId;

    if (!restaurantId) {
      alert("❌ Lỗi: Không xác định được nhà hàng!");
      console.error("Cart items:", cart);
      return;
    }

    const order = {
      id: Date.now(),
      customerName: userInfo.fullname,
      phone: userInfo.phone,
      address: finalAddress,
      items: cart,
      subtotal: calculateSubtotal(),
      shippingFee: shippingFee,
      discount: discount,
      totalPrice: calculateTotal(),
      voucher: appliedVoucher,
      status: "pending",
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      restaurantId: restaurantId, // ⭐ QUAN TRỌNG
    };

    console.log("📝 Saving order:", order);

    // Lưu đơn hàng
    const orders = JSON.parse(localStorage.getItem("orderHistory") || "[]");
    orders.push(order);
    localStorage.setItem("orderHistory", JSON.stringify(orders));

    console.log("✅ Order saved. Total orders:", orders.length);

    // Xóa giỏ hàng
    localStorage.removeItem("cart");

    alert("🎉 Đặt hàng thành công!");
    navigate("/");
  };

  return (
    <div className="checkout-page">
      {/* HEADER */}
      <header className="checkout-header">
        <span className="back-btn" onClick={() => navigate(-1)}>
          ←
        </span>
        <span>Thanh toán</span>
      </header>

      <h2 className="checkout-title">🛒 Xác nhận đơn hàng</h2>

      {/* THÔNG TIN NGƯỜI NHẬN */}
      <section className="receiver-info">
        <h3>👤 Thông tin người nhận</h3>
        <div className="user-info-display">
          <p>
            <strong>Họ tên:</strong> {userInfo.fullname}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {userInfo.phone}
          </p>
        </div>

        <div className="address-section">
          <h4>📍 Địa chỉ giao hàng</h4>
          <div className="address-buttons">
            <button
              className={useDefaultAddress ? "btn-main active" : "btn-grey"}
              onClick={() => setUseDefaultAddress(true)}
            >
              Địa chỉ mặc định
            </button>
            <button
              className={!useDefaultAddress ? "btn-main active" : "btn-grey"}
              onClick={handleChooseMap}
            >
              📍 Chọn trên bản đồ
            </button>
          </div>

          {useDefaultAddress ? (
            <div className="address-display">
              <p>{userInfo.address}</p>
            </div>
          ) : (
            <div className="address-display custom">
              <p>{customAddress || "Chưa chọn địa chỉ"}</p>
              {!customAddress && (
                <button className="btn-select-map" onClick={handleChooseMap}>
                  Chọn địa chỉ trên bản đồ
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* MÓN ĂN */}
      <section className="order-items">
        <h3>🍔 Món ăn ({cart.length})</h3>
        {cart.length === 0 ? (
          <p className="empty-cart">Giỏ hàng trống</p>
        ) : (
          <>
            {cart.map((item, index) => (
              <div key={index} className="order-line">
                <div className="item-info">
                  <span className="item-name">{item.name || item.title}</span>
                  <span className="item-qty">x{item.quantity}</span>
                </div>
                <span className="item-price">
                  {(item.price * item.quantity).toLocaleString()} đ
                </span>
              </div>
            ))}
          </>
        )}
      </section>

      {/* VOUCHER */}
      <section className="voucher">
        <h3>🎟️ Mã giảm giá</h3>
        {!appliedVoucher ? (
          <div className="voucher-input-group">
            <input
              type="text"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
              placeholder="Nhập mã giảm giá..."
            />
            <button
              className="btn-apply-voucher"
              onClick={() => handleApplyVoucher()}
            >
              Áp dụng
            </button>
          </div>
        ) : (
          <div className="voucher-applied">
            <div className="voucher-info">
              <span className="voucher-code-badge">✅ {appliedVoucher.code}</span>
              <span className="voucher-discount-amount">
                - {discount.toLocaleString()}đ
              </span>
            </div>
            <button
              className="btn-remove-voucher"
              onClick={handleRemoveVoucher}
            >
              ✕
            </button>
          </div>
        )}
      </section>

      {/* THÔNG TIN VẬN CHUYỂN */}
      <section className="shipping-info">
        <h3>🚚 Thông tin vận chuyển</h3>
        <div className="shipping-details">
          <div className="shipping-line">
            <span>Phí vận chuyển:</span>
            <span>{shippingFee.toLocaleString()} đ</span>
          </div>
          <div className="shipping-line">
            <span>Thời gian dự kiến:</span>
            <span>30 - 45 phút</span>
          </div>
          <div className="shipping-line weather">
            <span>Thời tiết:</span>
            <span>🌤️ Nắng nhẹ</span>
          </div>
        </div>
      </section>

      {/* TỔNG TIỀN */}
      <section className="checkout-summary">
        <div className="summary-line">
          <span>Tạm tính:</span>
          <span>{calculateSubtotal().toLocaleString()} đ</span>
        </div>
        <div className="summary-line">
          <span>Phí vận chuyển:</span>
          <span>{shippingFee.toLocaleString()} đ</span>
        </div>
        {discount > 0 && (
          <div className="summary-line discount">
            <span>Giảm giá:</span>
            <span>- {discount.toLocaleString()} đ</span>
          </div>
        )}
        <div className="checkout-total">
          <span>Tổng cộng:</span>
          <b>{calculateTotal().toLocaleString()} đ</b>
        </div>
      </section>

      {/* BUTTON ĐẶT HÀNG */}
      <button
        className="order-btn"
        onClick={handleOrder}
        disabled={cart.length === 0}
      >
        {cart.length === 0
          ? "Giỏ hàng trống"
          : `Đặt hàng (${calculateTotal().toLocaleString()} đ)`}
      </button>
    </div>
  );
}