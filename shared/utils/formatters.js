/**
 *  Format price safely
 * @param {any} value - Price value (number, string, undefined)
 * @returns {string} - Formatted price
 */
export const formatPrice = (value) => {
  const num = Number(value);
  
  if (isNaN(num)) {
    console.warn('Invalid price value:', value);
    return '0';
  }
  
  return num.toLocaleString('vi-VN');
};

/**
 *  Format date safely
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
export const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleString('vi-VN');
  } catch (error) {
    console.warn('Invalid date:', dateString);
    return 'N/A';
  }
};

/**
 *  Format phone number
 * @param {string} phone - Phone number
 * @returns {string} - Formatted phone
 */
export const formatPhone = (phone) => {
  if (!phone) return 'N/A';
  const cleaned = phone.replace(/\D/g, '');
  
  // Format: 0123 456 789
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone;
};

/**
 *  Format order status
 * @param {string} status - Order status
 * @returns {string} - Vietnamese label
 */
export const formatOrderStatus = (status) => {
  const statusMap = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    preparing: 'Đang chuẩn bị',
    delivering: 'Đang giao',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
  };
  
  return statusMap[status] || status;
};

/**
 *  Format payment method
 * @param {string} method - Payment method
 * @returns {string} - Vietnamese label
 */
export const formatPaymentMethod = (method) => {
  const methodMap = {
    cash: '💵 Tiền mặt',
    qr: '📱 QR Code',
    card: '💳 Thẻ ngân hàng',
    momo: '🎀 MoMo',
    zalopay: '💙 ZaloPay',
  };
  
  return methodMap[method] || method;
};

/**
 *  Format delivery method
 * @param {string} method - Delivery method
 * @returns {string} - Vietnamese label
 */
export const formatDeliveryMethod = (method) => {
  const methodMap = {
    fast: '⚡ Nhanh (30 phút)',
    standard: '📦 Tiêu chuẩn (45 phút)',
    economy: '🚲 Tiết kiệm (60 phút)',
  };
  
  return methodMap[method] || method;
};