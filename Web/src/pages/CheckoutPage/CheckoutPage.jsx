import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CheckoutPage.css";

// Import từ shared
import { DELIVERY_METHODS } from '../../../../shared/constants/DeliveryMethods';
import { PAYMENT_METHODS } from '../../../../shared/constants/PaymentMethods';
import { DISCOUNTS } from '../../../../shared/constants/DiscountList';
import { 
  calculateSubtotal,
  calculateShippingFee,
  calculateDiscountAmount,
  calculateTotalPrice,
  adjustShippingForWeather
} from '../../../../shared/utils/checkoutHelpers';
import { validateCheckoutInfo } from '../../../../shared/utils/checkoutValidation';
import { saveOrder } from '../../../../shared/services/orderService';

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
  
  // Location from map
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Delivery & Payment
  const [deliveryMethod, setDeliveryMethod] = useState('fast');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [selectedDiscount, setSelectedDiscount] = useState(null);

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
    
    // Check if returning from map select
    if (location.state?.selectedLocation) {
      const mapLocation = location.state.selectedLocation;
      setSelectedLocation(mapLocation);
      setAddress(mapLocation.address);
    }
  }, [location.state]);

  // Select random QR when payment method is QR
  useEffect(() => {
    if (paymentMethod === 'qr') {
      const randomQR = QR_CODES[Math.floor(Math.random() * QR_CODES.length)];
      setSelectedQR(randomQR);
    } else {
      setSelectedQR(null);
    }
  }, [paymentMethod]);

  // Calculate prices using shared helpers
  const orderItems = orderFromMenu.length > 0 ? orderFromMenu : [];
  
  const subtotal = calculateSubtotal(orderItems);
  const baseShippingFee = calculateShippingFee(deliveryMethod);
  
  // Adjust shipping for weather
  const weatherAdjustment = adjustShippingForWeather(baseShippingFee, weather.condition);
  const shippingFee = weatherAdjustment.fee;
  const weatherNote = weatherAdjustment.reason 
    ? `🌧️ Phụ phí thời tiết: ${weatherAdjustment.reason}` 
    : '';
  
  // Discount calculation using shared helper
  const { itemDiscount, shippingDiscount } = calculateDiscountAmount(
    selectedDiscount, 
    subtotal, 
    shippingFee
  );
  
  const totalPrice = calculateTotalPrice(subtotal, shippingFee, itemDiscount, shippingDiscount);

  // Select discount
  const handleSelectDiscount = (discount) => {
    if (selectedDiscount?.type === discount.type) {
      // Deselect if clicking the same discount
      setSelectedDiscount(null);
    } else {
      setSelectedDiscount(discount);
    }
  };

  // Validate and place order
  const handlePlaceOrder = async () => {
    // Validate using shared validation
    const validationResult = validateCheckoutInfo(fullName, phone, address, orderItems);
    if (!validationResult.valid) {
      alert(`⚠️ ${validationResult.error}`);
      return;
    }

    // Validate payment method
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
        alert('⚠️ Vui lòng điền đầy đủ thông tin thẻ');
        return;
      }
    }

    // Get selected delivery method details
    const selectedDelivery = DELIVERY_METHODS.find(d => d.key === deliveryMethod);

    // Create order using orderService
    const orderData = {
      restaurantId: restaurantId || 1,
      items: orderItems,
      itemsSummary: orderItems.map(i => `${i.name || i.title} x${i.quantity}`).join(", "),
      subtotal: subtotal,
      shippingFee: shippingFee,
      itemDiscount: itemDiscount,
      shippingDiscount: shippingDiscount,
      total: totalPrice,
      user: { fullName, phone, address },
      deliveryMethod: selectedDelivery,
      paymentMethod: PAYMENT_METHODS.find(p => p.key === paymentMethod),
      discount: selectedDiscount,
    };

    const result = await saveOrder(localStorage, orderData);
    
    if (result.success) {
      console.log('✅ Đã lưu đơn hàng:', result.order);
      setShowSuccessModal(true);
    } else {
      alert(`❌ ${result.error}`);
    }
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
  
  // Open map select
  const handleOpenMap = () => {
    navigate('/map-select', {
      state: {
        currentLat: selectedLocation?.latitude,
        currentLng: selectedLocation?.longitude,
        currentAddress: address,
      },
    });
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
                  <div className="address-input-group">
                    <textarea
                      className="form-input address-textarea"
                      placeholder="Nhập địa chỉ chi tiết"
                      rows="3"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    <button 
                      type="button"
                      className="btn-map-select" 
                      onClick={handleOpenMap}
                      title="Chọn vị trí trên bản đồ"
                    >
                      🗺️
                    </button>
                  </div>
                  {selectedLocation && (
                    <div className="map-location-badge">
                      📍 Đã chọn vị trí từ bản đồ
                      <button 
                        className="btn-remove-location"
                        onClick={() => {
                          setSelectedLocation(null);
                          setAddress('');
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  )}
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
                      <span className="option-icon">{method.icon}</span>
                      <span className="option-name">{method.label}</span>
                      <span className="option-price">{method.fee.toLocaleString()} đ</span>
                    </div>
                    <div className="option-time">⏱️ {method.description}</div>
                  </div>
                  <div className="radio-checkmark"></div>
                </label>
              ))}
            </div>
            
            {weatherNote && (
              <div className="weather-notice">
                {weatherNote}
              </div>
            )}
          </section>

          {/* MÃ GIẢM GIÁ */}
          <section className="checkout-card">
            <h3 className="card-title">🎟️ Chọn mã giảm giá</h3>
            <div className="voucher-options">
              {DISCOUNTS.map((discount) => (
                <div
                  key={discount.type}
                  className={`voucher-card ${selectedDiscount?.type === discount.type ? 'selected' : ''}`}
                  onClick={() => handleSelectDiscount(discount)}
                  style={{ 
                    borderColor: selectedDiscount?.type === discount.type 
                      ? (discount.type === 'freeship' ? '#00bcd4' : discount.type === 'discount10' ? '#4caf50' : '#ff9800')
                      : '#ddd' 
                  }}
                >
                  <div 
                    className="voucher-header" 
                    style={{ 
                      backgroundColor: discount.type === 'freeship' 
                        ? '#00bcd4' 
                        : discount.type === 'discount10' 
                          ? '#4caf50' 
                          : discount.type === 'discount20'
                            ? '#ff9800'
                            : '#9c27b0'
                    }}
                  >
                    <span className="voucher-label">{discount.label}</span>
                  </div>
                  <div className="voucher-body">
                    <p className="voucher-description">
                      {discount.type === 'freeship' 
                        ? 'Miễn phí ship' 
                        : discount.type === 'discount10' 
                          ? 'Giảm 10% đơn hàng'
                          : discount.type === 'discount20'
                            ? 'Giảm 20% đơn hàng'
                            : 'Giảm 30% đơn hàng'}
                    </p>
                    {selectedDiscount?.type === discount.type && (
                      <div className="voucher-selected-badge">
                        <span className="checkmark">✓</span> Đã chọn
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
                <span>{shippingFee.toLocaleString()} đ</span>
              </div>
              
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
              Dự kiến giao hàng trong <strong>{DELIVERY_METHODS.find(d => d.key === deliveryMethod)?.description}</strong>
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
