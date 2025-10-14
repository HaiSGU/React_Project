/**
 * ✅ Tạo object đơn hàng - Web & Mobile dùng chung
 */
export const buildOrderObject = (checkoutData) => {
  const {
    cart,
    fullName,
    phone,
    address,
    deliveryMethod,
    paymentMethod,
    discount,      // ✅ ĐỔI TỪ voucher
    driver,
    totalPrice,
  } = checkoutData;

  return {
    id: Date.now(),
    restaurantName: cart[0]?.restaurantName || 'Nhà hàng',
    items: cart.map(item => ({
      id: item.id,
      title: item.title,
      quantity: item.quantity,
      price: item.price,
    })),
    customer: {
      fullName,
      phone,
      address,
    },
    delivery: {
      method: deliveryMethod,
      driver: driver?.name,
      vehicleType: driver?.vehicle,
    },
    payment: {
      method: paymentMethod,
      totalPrice,
      discount: discount?.label, // ✅ ĐỔI: Lưu label thay vì code
    },
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
};