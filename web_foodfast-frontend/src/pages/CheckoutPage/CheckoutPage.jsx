import "./CheckoutPage.css";

export default function CheckoutPage() {
  // data giả lập
  const user = {
    fullname: "nguyenthanhdat",
    phone: "0365986732",
    address: "btan",
  };

  const orderItems = [
    { id: 1, name: "Hamburger", price: 50000, quantity: 3 },
  ];

  const shippingFee = 20000;
  const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal + shippingFee;

  const handleOrder = () => {
    alert("Đặt hàng thành công 🎉!");
    console.log({ user, orderItems, total });
  };

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <span className="back-btn">←</span>
        <span>checkout</span>
      </header>

      <h2 className="checkout-title">Thanh toán</h2>

      {/* Thông tin người nhận */}
      <section className="receiver-info">
        <h3>👤 Thông tin người nhận</h3>
        <p>{user.fullname}</p>
        <p>{user.phone}</p>
        <div className="address-buttons">
          <button className="btn-main">Dùng địa chỉ mặc định</button>
          <button className="btn-grey">Chọn trên bản đồ</button>
        </div>
        <p>{user.address}</p>
      </section>

      {/* Product list */}
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

      {/* Shipping info */}
      <section className="shipping-info">
        <p>Địa chỉ: {user.address}</p>
        <p>Thời tiết: Chưa có dữ liệu 🌤️</p>
        <p>Giá ship: {shippingFee.toLocaleString()} đ</p>
        <p>Thời gian dự kiến: 30 phút</p>
      </section>

      {/* Tổng cộng */}
      <div className="checkout-total">
        <span>Tổng cộng: <b>{total.toLocaleString()} đ</b></span>
      </div>

      <button className="order-btn" onClick={handleOrder}>Đặt hàng</button>
    </div>
  );
}