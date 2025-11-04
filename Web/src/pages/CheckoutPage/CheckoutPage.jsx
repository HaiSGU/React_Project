import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CheckoutPage.css";

// Import data từ shared
const DELIVERY_METHODS = [
  { key: 'fast', label: 'Nhanh', fee: 25000, time: '30 phút' },
  { key: 'standard', label: 'Tiêu chuẩn', fee: 15000, time: '45 phút' },
  { key: 'economy', label: 'Tiết kiệm', fee: 10000, time: '60 phút' },
];

const PAYMENT_METHODS = [
  { key: 'cash', label: 'Tiền mặt', icon: '💵' },
  { key: 'qr', label: 'QR Code', icon: '📱' },
  { key: 'card', label: 'Thẻ', icon: '💳' },
];

// Mock QR codes
const QR_CODES = [
  'https://via.placeholder.com/250?text=QR+Code+1',
  'https://via.placeholder.com/250?text=QR+Code+2',
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const orderFromMenu = location.state?.orderItems || [];
  const totalFromMenu = location.state?.totalPrice || 0;
  const restaurantId = location.state?.restaurantId;

  // User info
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isEditingInfo, setIsEditingInfo] = useState(false);

  // Delivery & Payment
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discount, setDiscount] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);

  // Card payment states
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  // QR Code state
  const [selectedQR, setSelectedQR] = useState(null);

  // Modals
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Weather (mock)
  const [weather, setWeather] = useState({ condition: 'clear', temp: 28 });

  // Load user info from localStorage
  useEffect(() => {
    const userInfoStr = localStorage.getItem('userInfo');
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        // Load thông tin từ registeredUsers dựa vào username
        if (userInfo.username) {
          const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
          const user = registeredUsers.find(u => u.username === userInfo.username);
          
          if (user) {
            setFullName(user.fullName || '');
            setPhone(user.phone || '');
            setAddress(user.address || '');
          }
        }
      } catch (e) {
        console.error('Error parsing userInfo:', e);
      }
    }
  }, []);

  // Select random QR when payment method is QR
  useEffect(() => {
    if (paymentMethod === 'qr') {
      const randomQR = QR_CODES[Math.floor(Math.random() * QR_CODES.length)];
      setSelectedQR(randomQR);
    } else {
      setSelectedQR(null);
    }
  }, [paymentMethod]);

  // Calculate prices
  const orderItems = orderFromMenu.length > 0 ? orderFromMenu : [];
  
  const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
  
  const selectedDelivery = DELIVERY_METHODS.find(d => d.key === deliveryMethod);
  const baseShippingFee = selectedDelivery ? selectedDelivery.fee : 15000;
  
  // Adjust shipping for weather
  let weatherAdjustment = 0;
  let weatherNote = '';
  if (weather.condition === 'rain') {
    weatherAdjustment = 5000;
    weatherNote = '🌧️ Phụ phí thời tiết xấu';
  } else if (weather.condition === 'storm') {
    weatherAdjustment = 10000;
    weatherNote = '⛈️ Phụ phí bão';
  }
  
  const shippingFee = baseShippingFee + weatherAdjustment;
  
  // Discount calculation
  let itemDiscount = 0;
  let shippingDiscount = 0;
  
  if (appliedDiscount) {
    if (appliedDiscount.type === 'percentage') {
      itemDiscount = Math.round(subtotal * appliedDiscount.value / 100);
    } else if (appliedDiscount.type === 'fixed') {
      itemDiscount = appliedDiscount.value;
    } else if (appliedDiscount.type === 'shipping') {
      shippingDiscount = Math.round(shippingFee * appliedDiscount.value / 100);
    }
  }
  
  const totalPrice = subtotal - itemDiscount + shippingFee - shippingDiscount;

  // Apply voucher
  const handleApplyVoucher = () => {
    const code = discount.trim().toUpperCase();
    
    // Mock voucher validation
    const mockVouchers = {
      'FREESHIP': { type: 'shipping', value: 100, label: 'Miễn phí ship' },
      'GIAM10': { type: 'percentage', value: 10, label: 'Giảm 10%' },
      'GIAM20K': { type: 'fixed', value: 20000, label: 'Giảm 20.000đ' },
    };
    
    if (mockVouchers[code]) {
      setAppliedDiscount(mockVouchers[code]);
      alert(`✅ Áp dụng mã "${code}" thành công!`);
    } else {
      alert('❌ Mã giảm giá không hợp lệ');
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedDiscount(null);
    setDiscount('');
  };

  // Validate and place order
  const handlePlaceOrder = () => {
    // Validate
    if (!fullName.trim()) {
      alert('⚠️ Vui lòng nhập họ tên');
      return;
    }
    if (!phone.trim()) {
      alert('⚠️ Vui lòng nhập số điện thoại');
      return;
    }
    if (!address.trim()) {
      alert('⚠️ Vui lòng nhập địa chỉ giao hàng');
      return;
    }

    // Validate payment method
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
        alert('⚠️ Vui lòng điền đầy đủ thông tin thẻ');
        return;
      }
    }

    // Create order
    const newOrder = {
      id: Date.now(),
      restaurantId: restaurantId || 1,
      items: orderItems,
      itemsSummary: orderItems.map(i => `${i.name} x${i.quantity}`).join(", "),
      subtotal: subtotal,
      shippingFee: shippingFee,
      itemDiscount: itemDiscount,
      shippingDiscount: shippingDiscount,
      total: totalPrice,
      user: { fullName, phone, address },
      deliveryMethod: selectedDelivery,
      paymentMethod: PAYMENT_METHODS.find(p => p.key === paymentMethod),
      voucher: appliedDiscount,
      status: 'Đang giao 🚚',
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const existingOrders = JSON.parse(
      localStorage.getItem('orders') || '{"dangGiao":[],"daGiao":[]}'
    );
    
    existingOrders.dangGiao.unshift(newOrder);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    console.log('✅ Đã lưu đơn hàng:', newOrder);
    
    setShowSuccessModal(true);
  };

  const handleBackToHome = () => {
    setShowSuccessModal(false);
    setTimeout(() => {
      navigate('/');
    }, 300);
  };

  const handleViewOrders = () => {
    setShowSuccessModal(false);
    setTimeout(() => {
      navigate('/cart');
    }, 300);
  };

  return (
    <div className="checkout-page">
      {/* HEADER */}
      <header className="checkout-header">
        <h1 className="checkout-title">Thanh toán</h1>
      </header>

      <div className="checkout-layout">
        {/* LEFT COLUMN - FORM */}
        <div className="checkout-left">
          
          {/* THÔNG TIN GIAO HÀNG */}
          <section className="checkout-card">
            <div className="card-header">
              <h3 className="card-title">📍 Thông tin giao hàng</h3>
              {!isEditingInfo && (
                <button className="btn-edit" onClick={() => setIsEditingInfo(true)}>
                  Thay đổi
                </button>
              )}
            </div>
            
            {!isEditingInfo ? (
              <div className="info-display">
                <div className="info-row">
                  <span className="info-label">Người nhận:</span>
                  <span className="info-value">{fullName || 'Chưa có thông tin'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Số điện thoại:</span>
                  <span className="info-value">{phone || 'Chưa có thông tin'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Địa chỉ:</span>
                  <span className="info-value">{address || 'Chưa có thông tin'}</span>
                </div>
              </div>
            ) : (
              <div className="info-edit">
                <div className="form-group">
                  <label>Họ tên</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nhập họ tên"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="Nhập số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Địa chỉ giao hàng</label>
                  <textarea
                    className="form-input"
                    placeholder="Nhập địa chỉ chi tiết"
                    rows="3"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <button 
                  className="btn-save-info" 
                  onClick={() => setIsEditingInfo(false)}
                >
                  Lưu thông tin
                </button>
              </div>
            )}
          </section>

          {/* PHƯƠNG THỨC GIAO HÀNG */}
          <section className="checkout-card">
            <h3 className="card-title">🚚 Phương thức giao hàng</h3>
            <div className="delivery-options">
              {DELIVERY_METHODS.map((method) => (
                <label 
                  key={method.key} 
                  className={`delivery-option ${deliveryMethod === method.key ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={method.key}
                    checked={deliveryMethod === method.key}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                  />
                  <div className="option-content">
                    <div className="option-main">
                      <span className="option-name">{method.label}</span>
                      <span className="option-price">{method.fee.toLocaleString()} đ</span>
                    </div>
                    <div className="option-time">⏱️ {method.time}</div>
                  </div>
                  <div className="radio-checkmark"></div>
                </label>
              ))}
            </div>
            
            {weatherNote && (
              <div className="weather-notice">
                {weatherNote}: +{weatherAdjustment.toLocaleString()} đ
              </div>
            )}
          </section>

          {/* MÃ GIẢM GIÁ */}
          <section className="checkout-card">
            <h3 className="card-title">🎟️ Mã giảm giá</h3>
            {!appliedDiscount ? (
              <div className="voucher-input-group">
                <input
                  type="text"
                  className="voucher-input"
                  placeholder="Nhập mã giảm giá"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value.toUpperCase())}
                />
                <button className="btn-apply-voucher" onClick={handleApplyVoucher}>
                  Áp dụng
                </button>
              </div>
            ) : (
              <div className="voucher-applied">
                <div className="voucher-badge">
                  <span className="voucher-icon">🎉</span>
                  <div className="voucher-text">
                    <div className="voucher-code">{discount}</div>
                    <div className="voucher-desc">{appliedDiscount.label}</div>
                  </div>
                </div>
                <button className="btn-remove-voucher" onClick={handleRemoveVoucher}>
                  ✕
                </button>
              </div>
            )}
          </section>

          {/* PHƯƠNG THỨC THANH TOÁN */}
          <section className="checkout-card">
            <h3 className="card-title">💳 Phương thức thanh toán</h3>
            <div className="payment-options">
              {PAYMENT_METHODS.map((method) => (
                <label 
                  key={method.key} 
                  className={`payment-option ${paymentMethod === method.key ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.key}
                    checked={paymentMethod === method.key}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="option-content">
                    <span className="payment-icon">{method.icon}</span>
                    <span className="payment-name">{method.label}</span>
                  </div>
                  <div className="radio-checkmark"></div>
                </label>
              ))}
            </div>

            {/* CARD FORM */}
            {paymentMethod === 'card' && (
              <div className="payment-details card-form">
                <div className="form-group">
                  <label>Số thẻ</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Tên chủ thẻ</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="NGUYEN VAN A"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Ngày hết hạn</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="MM/YY"
                      maxLength="5"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="123"
                      maxLength="3"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* QR CODE */}
            {paymentMethod === 'qr' && selectedQR && (
              <div className="payment-details qr-display">
                <p className="qr-instruction">Quét mã QR để thanh toán</p>
                <div className="qr-wrapper">
                  <img src={selectedQR} alt="QR Code" className="qr-image" />
                  <p className="qr-amount">{totalPrice.toLocaleString()} đ</p>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* RIGHT SIDEBAR - ORDER SUMMARY */}
        <aside className="checkout-right">
          <div className="order-summary sticky-summary">
            <h3 className="summary-title">📦 Đơn hàng của bạn</h3>
            
            {/* ORDER ITEMS */}
            <div className="order-items-list">
              {orderItems.map((item) => (
                <div key={item.id} className="summary-item">
                  <div className="item-info">
                    <div className="item-name">{item.name || item.title}</div>
                    <div className="item-quantity">x{item.quantity}</div>
                  </div>
                  <div className="item-price">
                    {(item.price * item.quantity).toLocaleString()} đ
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            {/* PRICE BREAKDOWN */}
            <div className="price-breakdown">
              <div className="breakdown-row">
                <span>Tạm tính</span>
                <span>{subtotal.toLocaleString()} đ</span>
              </div>
              
              {itemDiscount > 0 && (
                <div className="breakdown-row discount">
                  <span>Giảm giá món ăn</span>
                  <span>-{itemDiscount.toLocaleString()} đ</span>
                </div>
              )}
              
              <div className="breakdown-row">
                <span>Phí giao hàng</span>
                <span>{baseShippingFee.toLocaleString()} đ</span>
              </div>
              
              {weatherAdjustment > 0 && (
                <div className="breakdown-row weather">
                  <span>🌧️ Phụ phí thời tiết</span>
                  <span>+{weatherAdjustment.toLocaleString()} đ</span>
                </div>
              )}
              
              {shippingDiscount > 0 && (
                <div className="breakdown-row discount">
                  <span>🎫 Giảm phí ship</span>
                  <span>-{shippingDiscount.toLocaleString()} đ</span>
                </div>
              )}
            </div>

            <div className="summary-divider"></div>

            {/* TOTAL */}
            <div className="summary-total">
              <span className="total-label">Tổng cộng</span>
              <span className="total-amount">{totalPrice.toLocaleString()} đ</span>
            </div>

            {/* CTA BUTTON */}
            <button className="btn-checkout-cta" onClick={handlePlaceOrder}>
              <span>Đặt hàng ngay</span>
              <span className="cta-arrow">→</span>
            </button>

            {/* TRUST BADGES */}
            <div className="trust-badges">
              <div className="trust-item">
                <span className="trust-icon">🔒</span>
                <span className="trust-text">Thanh toán an toàn</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">✓</span>
                <span className="trust-text">Đảm bảo chất lượng</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* MODAL SUCCESS */}
      {showSuccessModal && (
        <div className="modal-overlay success-modal">
          <div className="modal-content success-content">
            <div className="success-icon">✓</div>
            <h2 className="success-title">Đặt hàng thành công! 🎉</h2>
            <p className="success-message">
              Đơn hàng của bạn đã được xác nhận.<br/>
              Dự kiến giao hàng trong <strong>{selectedDelivery?.time}</strong>
            </p>
            
            <div className="success-summary">
              <div className="success-detail">
                <span>Phương thức thanh toán:</span>
                <span>
                  {PAYMENT_METHODS.find(p => p.key === paymentMethod)?.icon}{' '}
                  {PAYMENT_METHODS.find(p => p.key === paymentMethod)?.label}
                </span>
              </div>
              <div className="success-total">
                Tổng thanh toán: <strong>{totalPrice.toLocaleString()} đ</strong>
              </div>
            </div>

            <div className="success-actions">
              <button className="btn-secondary-action" onClick={handleViewOrders}>
                Xem đơn hàng
              </button>
              <button className="btn-primary-action" onClick={handleBackToHome}>
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
