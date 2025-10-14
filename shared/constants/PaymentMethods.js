/**
 * ✅ Phương thức thanh toán - Web & Mobile dùng chung
 */
export const PAYMENT_METHODS = [
  { 
    key: 'cash', 
    label: 'Tiền mặt', 
    icon: '💵',
    description: 'Thanh toán khi nhận hàng',
  },
  { 
    key: 'qr', 
    label: 'QR Code', 
    icon: '📱',
    description: 'Quét mã QR để thanh toán',
  },
  { 
    key: 'card', 
    label: 'Thẻ ngân hàng', 
    icon: '💳',
    description: 'Thanh toán bằng thẻ ATM/Credit',
  },
  { 
    key: 'ewallet', 
    label: 'Ví điện tử', 
    icon: '👛',
    description: 'MoMo, ZaloPay, VNPay',
  },
];

export const getPaymentMethodByKey = (key) => {
  return PAYMENT_METHODS.find(m => m.key === key);
};