/**
 * Order management service
 */

/**
 * Get shipping orders
 * @param {object} storage
 * @returns {Promise<Array>}
 */
export const getShippingOrders = async (storage) => {
  const shipping = await storage.getItem('shippingOrders');
  return shipping ? JSON.parse(shipping) : [];
};

/**
 * Get delivered orders
 * @param {object} storage
 * @returns {Promise<Array>}
 */
export const getDeliveredOrders = async (storage) => {
  const delivered = await storage.getItem('deliveredOrders');
  return delivered ? JSON.parse(delivered) : [];
};

/**
 * Move order from shipping to delivered
 * @param {object} order
 * @param {object} storage
 * @returns {Promise<void>}
 */
export const confirmDelivery = async (order, storage) => {
  // Get current orders
  const shippingOrders = await getShippingOrders(storage);
  const deliveredOrders = await getDeliveredOrders(storage);

  // Remove from shipping
  const newShipping = shippingOrders.filter(o => o.id !== order.id);
  await storage.setItem('shippingOrders', JSON.stringify(newShipping));

  // Add to delivered with timestamp
  const deliveredOrder = {
    ...order,
    status: "Đã giao",
    deliveredAt: new Date().toISOString(),
  };
  const newDelivered = [...deliveredOrders, deliveredOrder];
  await storage.setItem('deliveredOrders', JSON.stringify(newDelivered));

  return { shipping: newShipping, delivered: newDelivered };
};

/**
 * Add new order to shipping
 * @param {object} order
 * @param {object} storage
 * @returns {Promise<void>}
 */
export const addShippingOrder = async (order, storage) => {
  const shippingOrders = await getShippingOrders(storage);
  const newOrder = {
    ...order,
    id: Date.now().toString(),
    status: "Đang giao",
    createdAt: new Date().toISOString(),
  };
  const updated = [...shippingOrders, newOrder];
  await storage.setItem('shippingOrders', JSON.stringify(updated));
  return newOrder;
};