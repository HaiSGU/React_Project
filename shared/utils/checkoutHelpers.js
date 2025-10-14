/**
 * ✅ Pure functions - Web & Mobile dùng chung
 */

/**
 * Tính phí ship theo phương thức giao hàng
 */
export const calculateShippingFee = (deliveryMethod) => {
  const fees = {
    fast: 25000,
    standard: 15000,
    economy: 10000,
    express: 40000,
  };
  return fees[deliveryMethod] || 0;
};

/**
 * Tính thời gian giao hàng dự kiến (phút)
 */
export const calculateEstimatedTime = (deliveryMethod) => {
  const times = {
    fast: 30,
    standard: 45,
    economy: 60,
    express: 20,
  };
  return times[deliveryMethod] || 30;
};

/**
 * Tính tổng tiền items
 */
export const calculateSubtotal = (items) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

/**
 * ✅ Tính giảm giá từ DISCOUNT (dựa vào DiscountList)
 */
export const calculateDiscountAmount = (discount, subtotal, shippingFee) => {
  if (!discount) return { itemDiscount: 0, shippingDiscount: 0 };

  let itemDiscount = 0;
  let shippingDiscount = 0;

  // Parse từ discount.type
  if (discount.type === 'freeship') {
    shippingDiscount = shippingFee; // Miễn phí ship hoàn toàn
  } else if (discount.type.startsWith('discount')) {
    // Lấy % từ type: 'discount10' → 10%, 'discount20' → 20%
    const percentMatch = discount.type.match(/discount(\d+)/);
    if (percentMatch) {
      const percent = parseInt(percentMatch[1]) / 100;
      itemDiscount = subtotal * percent;
    }
  }

  return { itemDiscount, shippingDiscount };
};

/**
 * Tính tổng tiền thanh toán
 */
export const calculateTotalPrice = (subtotal, shippingFee, itemDiscount = 0, shippingDiscount = 0) => {
  return subtotal - itemDiscount + shippingFee - shippingDiscount;
};

/**
 * Điều chỉnh phí ship theo thời tiết
 */
export const adjustShippingForWeather = (baseShippingFee, weatherCondition) => {
  const condition = weatherCondition?.toLowerCase() || '';
  if (condition.includes('rain') || condition.includes('storm')) {
    return {
      fee: baseShippingFee + 10000,
      extraTime: 15,
      reason: 'Thời tiết mưa/bão',
    };
  }
  return { fee: baseShippingFee, extraTime: 0, reason: null };
};

/**
 * ✅ Kiểm tra discount có áp dụng cho restaurant không
 */
export const canApplyDiscount = (discount, restaurantId) => {
  if (!discount || !discount.restaurants) return false;
  return discount.restaurants.includes(restaurantId);
};