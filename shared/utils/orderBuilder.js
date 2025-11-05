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
    restaurantId,  // ⭐ THÊM THAM SỐ
  } = checkoutData;

  // ⭐ LẤY restaurantId TỪ CART NẾU KHÔNG CÓ
  const finalRestaurantId = restaurantId || cart[0]?.restaurantId;

  console.log('🏗️ Building order with restaurantId:', finalRestaurantId);  // ⭐ DEBUG

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

  const finalTotal = Number(totalPrice) || (subtotal + shippingFee - itemDiscount - shippingDiscount);

  const order = {
    // ⭐ THÊM ID VÀ TIMESTAMPS
    id: Date.now(),
    createdAt: new Date().toISOString(),
    date: new Date().toISOString(),
    status: 'pending',
    
    // ⭐ THÊM restaurantId Ở ĐẦU
    restaurantId: finalRestaurantId,
    restaurantName: cart[0]?.restaurantName,
    
    // Customer info
    customer: {
      fullName,
      phone,
      address,
    },
    
    // ⭐ THÊM FLAT FIELDS CHO COMPATIBILITY
    customerName: fullName,
    phone: phone,
    address: address,
    
    // Items
    items: cart.map(item => ({
      id: item.id,
      title: item.title,
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      image: item.image,
      restaurantId: item.restaurantId || finalRestaurantId,
      restaurantName: item.restaurantName,
    })),
    
    // Delivery
    delivery: {
      method: deliveryMethod,
      fee: Number(shippingFee),
      driver: driver ? {
        id: driver.id, // ⭐ THÊM ID
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
    
    // ⭐ THÊM FLAT FIELDS
    paymentMethod: paymentMethod,
    deliveryMethod: deliveryMethod,
    
    // Discount
    discount: discount ? {
      type: discount.type,
      label: discount.label,
      itemDiscount: Number(itemDiscount),
      shippingDiscount: Number(shippingDiscount),
      totalDiscount: Number(itemDiscount + shippingDiscount),
    } : null,
    
    // Pricing
    pricing: {
      subtotal: Number(subtotal),
      shippingFee: Number(shippingFee),
      itemDiscount: Number(itemDiscount),
      shippingDiscount: Number(shippingDiscount),
      total: Number(finalTotal),
    },
    
    // ⭐ THÊM FLAT PRICE FIELDS
    totalPrice: Number(finalTotal),
    originalPrice: Number(subtotal),
    shippingFee: Number(shippingFee),
  };

  console.log('✅ Built order:', order);  // ⭐ DEBUG
  console.log('🏪 Order restaurantId:', order.restaurantId);  // ⭐ DEBUG

  return order;
};

/**
 * Format order cho hiển thị
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
    paymentLabel: paymentLabels[order.payment?.method || order.paymentMethod] || 'Chưa rõ',
    deliveryLabel: deliveryLabels[order.delivery?.method || order.deliveryMethod] || 'Chưa rõ',
    formattedDate: new Date(order.createdAt || order.date).toLocaleString('vi-VN'),
    totalPrice: Number(order.totalPrice || order.pricing?.total || 0),
  };
};