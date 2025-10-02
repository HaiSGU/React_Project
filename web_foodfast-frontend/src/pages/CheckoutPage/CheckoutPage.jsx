import "./CheckoutPage.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // User mẫu
  const user = {
    fullname: "nguyenthanhdat",
    phone: "0365986732",
    address: "btan",
  };

  // lấy địa chỉ mới từ MapSelectPage (nếu có)
  const newAddress = location.state?.newAddress;

  // Order mẫu
  const orderItems = [{ id: 1, name: "Hamburger", price: 50000, quantity: 3 }];

  const shippingFee = 20000;
  const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal + shippingFee;

  const handleOrder = () => {
    alert("Đặt hàng thành công 🎉!");
    console.log({ user, address: newAddress || user.address, orderItems, total });
  };

  const handleChooseMap = () => {
    navigate("/map-select"); // chuyển sang màn chọn map
  };

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <span className="back-btn">←</span>
        <span>checkout</span>
      </header>

      <h2 className="checkout-title">Thanh toán</h2>

      {/* Info */}
      <section className="receiver-info">
        <h3>👤 Thông tin người nhận</h3>
        <p>{user.fullname}</p>
        <p>{user.phone}</p>
        <div className="address-buttons">
          <button className="btn-main">Dùng địa chỉ mặc định</button>
          <button className="btn-grey" onClick={handleChooseMap}>
            Chọn trên bản đồ
          </button>
        </div>
        <p>Địa chỉ: {newAddress || user.address}</p>
      </section>

      {/* Items */}
      <section className="order-items">
        {orderItems.map((item) => (
          <div key={item.id} className="order-line">
            <span>{item.name} x{item.quantity}</span>
            <span>{(item.price * item.quantity).toLocaleString()} đ</span>
          </div>
        ))}
      </section>

      {/* Voucher */}
      <section className="voucher">
        <h3>🎟️ Voucher</h3>
        <input placeholder="Nhập mã giảm giá..." />
      </section>

      {/* Shipping */}
      <section className="shipping-info">
        <p>Thời tiết: Chưa có dữ liệu 🌤️</p>
        <p>Ship: {shippingFee.toLocaleString()} đ</p>
        <p>Thời gian dự kiến: 30 phút</p>
      </section>

      {/* Total */}
      <div className="checkout-total">
        <span>Tổng cộng: <b>{total.toLocaleString()} đ</b></span>
      </div>

      <button className="order-btn" onClick={handleOrder}>Đặt hàng</button>
    </div>
  );
}