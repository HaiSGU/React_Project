export const buildOrderObject = (checkoutData) => {
  const {
    cart,
    fullName,
    phone,
    address,
    deliveryMethod,
    paymentMethod,
    discount,
    driver,
    totalPrice,
  } = checkoutData;

  // Tính toán
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const deliveryFees = {
    fast: 25000,
    standard: 15000,
    economy: 10000,
  };
  
  const shippingFee = deliveryFees[deliveryMethod] || 15000;
  
  // Tính giảm giá món
  let itemDiscount = 0;
  if (discount?.type === 'percentage' && discount.percentage) {
    itemDiscount = Math.round(subtotal * discount.percentage);
  } else if (discount?.type === 'fixed' && discount.amount) {
    itemDiscount = discount.amount;
  }
  
  // Tính giảm giá ship
  let shippingDiscount = 0;
  if (discount?.freeShipping) {
    shippingDiscount = shippingFee;
  }

  // ĐẢM BẢO totalPrice LÀ NUMBER
  const finalTotal = Number(totalPrice) || (subtotal + shippingFee - itemDiscount - shippingDiscount);

  return {
    // Customer info
    customer: {
      fullName,
      phone,
      address,
    },
    
    // Items
    items: cart.map(item => ({
      id: item.id,
      title: item.title,
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      image: item.image,
      restaurantId: item.restaurantId,
      restaurantName: item.restaurantName,
    })),
    
    // Delivery
    delivery: {
      method: deliveryMethod,
      fee: Number(shippingFee),
      driver: driver ? {
        name: driver.name,
        phone: driver.phone,
        vehicle: driver.vehicle,
        rating: driver.rating,
      } : null,
    },
    
    // Payment
    payment: {
      method: paymentMethod,
      status: paymentMethod === 'cash' ? 'pending' : 'paid',
    },
    
    // Discount
    discount: discount ? {
      type: discount.type,
      label: discount.label,
      itemDiscount: Number(itemDiscount),
      shippingDiscount: Number(shippingDiscount),
      totalDiscount: Number(itemDiscount + shippingDiscount),
    } : null,
    
    // Pricing -  ĐẢM BẢO TẤT CẢ LÀ NUMBER
    pricing: {
      subtotal: Number(subtotal),
      shippingFee: Number(shippingFee),
      itemDiscount: Number(itemDiscount),
      shippingDiscount: Number(shippingDiscount),
      total: Number(finalTotal),
    },
    
    //  THÊM totalPrice Ở ROOT LEVEL
    totalPrice: Number(finalTotal),
    
    // Metadata
    restaurantId: cart[0]?.restaurantId,
    restaurantName: cart[0]?.restaurantName,
  };
};

/**
 *  Format order cho hiển thị
 */
export const formatOrderForDisplay = (order) => {
  const statusLabels = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    delivering: 'Đang giao',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
  };
  
  const paymentLabels = {
    cash: 'Tiền mặt',
    qr: 'QR Code',
    card: 'Thẻ',
  };
  
  const deliveryLabels = {
    fast: 'Nhanh (30 phút)',
    standard: 'Tiêu chuẩn (45 phút)',
    economy: 'Tiết kiệm (60 phút)',
  };

  return {
    ...order,
    statusLabel: statusLabels[order.status] || order.status,
    paymentLabel: paymentLabels[order.payment?.method] || order.payment?.method,
    deliveryLabel: deliveryLabels[order.delivery?.method] || order.delivery?.method,
    formattedDate: new Date(order.createdAt).toLocaleString('vi-VN'),
    //  ĐẢM BẢO totalPrice LÀ NUMBER
    totalPrice: Number(order.totalPrice || order.pricing?.total || 0),
  };
};