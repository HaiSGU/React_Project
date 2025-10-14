/**
 * Tăng số lượng item
 */
export const increaseQuantity = (quantities, itemId) => {
  return { ...quantities, [itemId]: (quantities[itemId] || 0) + 1 };
};

/**
 * Giảm số lượng item (tối thiểu 0)
 */
export const decreaseQuantity = (quantities, itemId) => {
  const newQty = Math.max((quantities[itemId] || 0) - 1, 0);
  return { ...quantities, [itemId]: newQty };
};

/**
 * Tính tổng tiền từ giỏ hàng
 */
export const calculateTotal = (items, quantities) => {
  return items.reduce((sum, item) => {
    const qty = quantities[item.id] || 0;
    return sum + qty * item.price;
  }, 0);
};

/**
 * Chuyển quantities thành cart items array
 */
export const getCartItems = (items, quantities) => {
  return items
    .filter(item => (quantities[item.id] || 0) > 0)
    .map(item => ({
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: quantities[item.id] || 0,
      restaurantName: item.restaurantName,
    }));
};