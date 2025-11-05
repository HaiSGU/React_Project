/**
 * Order management service - User-specific
 */


// Get current username
 
const getCurrentUsername = async (storage) => {
  try {
    const userInfo = await storage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      return user.username;
    }
    return null;
  } catch (error) {
    console.error('Get username error:', error);
    return null;
  }
};

/**
 *  LƯU ĐƠN HÀNG MỚI - THEO USER
 */
export const saveOrder = async (storage, order) => {
  try {
    const username = await getCurrentUsername(storage);
    
    if (!username) {
      return {
        success: false,
        error: 'Vui lòng đăng nhập để đặt hàng',
      };
    }

    // ⚠️ KIỂM TRA TRẠNG THÁI NHÀ HÀNG
    const restaurants = JSON.parse(storage.getItem('restaurants') || '[]');
    const restaurant = restaurants.find(r => r.id === order.restaurantId);
    
    if (!restaurant) {
      return {
        success: false,
        error: 'Nhà hàng không tồn tại',
      };
    }
    
    if (restaurant.status === 'suspended') {
      return {
        success: false,
        error: '⛔ Nhà hàng tạm ngưng hoạt động. Vui lòng chọn nhà hàng khác!',
      };
    }
    
    if (restaurant.status === 'pending') {
      return {
        success: false,
        error: '⏳ Nhà hàng đang chờ duyệt. Vui lòng chọn nhà hàng khác!',
      };
    }

    const newOrder = {
      ...order,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      date: new Date().toISOString(), // ⭐ Thêm field date cho ownerOrderService
      username, // Thêm username vào order
      customerName: order.user?.fullName || username, // ⭐ Thêm customerName
      address: order.user?.address || 'Không có địa chỉ', // ⭐ Thêm address
      totalPrice: order.total, // ⭐ Thêm totalPrice cho backward compatibility
    };

    // 1️⃣ Lưu theo username (cho user)
    const shippingOrders = await getShippingOrders(storage);
    const updatedShipping = [...shippingOrders, newOrder];
    await storage.setItem(`shippingOrders_${username}`, JSON.stringify(updatedShipping));

    // 2️⃣ Lưu vào hệ thống orders (cho restaurant)
    const ordersData = JSON.parse(storage.getItem('orders') || '{"dangGiao":[],"daGiao":[]}');
    ordersData.dangGiao.push(newOrder);
    storage.setItem('orders', JSON.stringify(ordersData));

    console.log('✅ Order saved to both systems:', newOrder);

    return {
      success: true,
      order: newOrder,
      message: 'Đặt hàng thành công!',
    };
  } catch (error) {
    console.error('Save order error:', error);
    return {
      success: false,
      error: error.message || 'Lỗi khi lưu đơn hàng',
    };
  }
};

/**
 * Get shipping orders - THEO USER
 */
export const getShippingOrders = async (storage) => {
  try {
    const username = await getCurrentUsername(storage);
    
    if (!username) {
      return [];
    }

    const shipping = await storage.getItem(`shippingOrders_${username}`);
    return shipping ? JSON.parse(shipping) : [];
  } catch (error) {
    console.error('Get shipping orders error:', error);
    return [];
  }
};

/**
 * Get delivered orders - THEO USER
 */
export const getDeliveredOrders = async (storage) => {
  try {
    const username = await getCurrentUsername(storage);
    
    if (!username) {
      return [];
    }

    const delivered = await storage.getItem(`deliveredOrders_${username}`);
    return delivered ? JSON.parse(delivered) : [];
  } catch (error) {
    console.error('Get delivered orders error:', error);
    return [];
  }
};

/**
 * Move order from shipping to delivered - THEO USER
 */
export const confirmDelivery = async (order, storage) => {
  try {
    const username = await getCurrentUsername(storage);
    
    if (!username) {
      return {
        success: false,
        error: 'Vui lòng đăng nhập',
      };
    }

    // Get current orders
    const shippingOrders = await getShippingOrders(storage);
    const deliveredOrders = await getDeliveredOrders(storage);

    // Remove from shipping
    const newShipping = shippingOrders.filter(o => o.id !== order.id);
    await storage.setItem(`shippingOrders_${username}`, JSON.stringify(newShipping));

    // Add to delivered
    const deliveredOrder = {
      ...order,
      status: 'completed',
      deliveredAt: new Date().toISOString(),
    };
    const newDelivered = [...deliveredOrders, deliveredOrder];
    await storage.setItem(`deliveredOrders_${username}`, JSON.stringify(newDelivered));

    // 🔄 Đồng bộ vào hệ thống orders chung (cho restaurant / admin / shipper)
    const ordersData = JSON.parse(storage.getItem('orders') || '{"dangGiao":[],"daGiao":[]}');
    const globalIndex = ordersData.dangGiao.findIndex(o => String(o.id) === String(order.id));

    if (globalIndex !== -1) {
      const existingOrder = ordersData.dangGiao[globalIndex];
      const completedOrder = {
        ...existingOrder,
        ...deliveredOrder, // Giữ thông tin driver, total, ... từ bản mới nhất
        status: 'completed',
        updatedAt: new Date().toISOString(),
        deliveredAt: new Date().toISOString(),
      };

      ordersData.dangGiao.splice(globalIndex, 1);
      ordersData.daGiao.push(completedOrder);
      storage.setItem('orders', JSON.stringify(ordersData));
    } else {
      // Nếu đã ở daGiao thì cập nhật trạng thái cho chắc
      ordersData.daGiao = ordersData.daGiao.map(o => {
        if (String(o.id) === String(order.id)) {
          return {
            ...o,
            ...deliveredOrder,
            status: 'completed',
            updatedAt: new Date().toISOString(),
            deliveredAt: new Date().toISOString(),
          };
        }
        return o;
      });
      storage.setItem('orders', JSON.stringify(ordersData));
    }

    return { 
      success: true,
      shipping: newShipping, 
      delivered: newDelivered 
    };
  } catch (error) {
    console.error('Confirm delivery error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get all orders - THEO USER
 */
export const getAllOrders = async (storage) => {
  try {
    const shipping = await getShippingOrders(storage);
    const delivered = await getDeliveredOrders(storage);
    return [...shipping, ...delivered].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  } catch (error) {
    console.error('Get all orders error:', error);
    return [];
  }
};

/**
 * Get order by ID - THEO USER
 */
export const getOrderById = async (storage, orderId) => {
  try {
    const allOrders = await getAllOrders(storage);
    return allOrders.find(o => o.id === orderId) || null;
  } catch (error) {
    console.error('Get order by ID error:', error);
    return null;
  }
};

/**
 * Update order status - THEO USER
 */
export const updateOrderStatus = async (storage, orderId, status) => {
  try {
    const username = await getCurrentUsername(storage);
    
    if (!username) {
      return { success: false, error: 'Vui lòng đăng nhập' };
    }

    const shippingOrders = await getShippingOrders(storage);
    const deliveredOrders = await getDeliveredOrders(storage);
    
    // Find in shipping
    const shippingIndex = shippingOrders.findIndex(o => o.id === orderId);
    if (shippingIndex !== -1) {
      shippingOrders[shippingIndex].status = status;
      shippingOrders[shippingIndex].updatedAt = new Date().toISOString();
      await storage.setItem(`shippingOrders_${username}`, JSON.stringify(shippingOrders));
      return { success: true, order: shippingOrders[shippingIndex] };
    }
    
    // Find in delivered
    const deliveredIndex = deliveredOrders.findIndex(o => o.id === orderId);
    if (deliveredIndex !== -1) {
      deliveredOrders[deliveredIndex].status = status;
      deliveredOrders[deliveredIndex].updatedAt = new Date().toISOString();
      await storage.setItem(`deliveredOrders_${username}`, JSON.stringify(deliveredOrders));
      return { success: true, order: deliveredOrders[deliveredIndex] };
    }
    
    return { success: false, error: 'Order not found' };
  } catch (error) {
    console.error('Update order status error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Cancel order - THEO USER
 */
export const cancelOrder = async (storage, orderId) => {
  return updateOrderStatus(storage, orderId, 'cancelled');
};

/**
 * Delete order - THEO USER
 */
export const deleteOrder = async (storage, orderId) => {
  try {
    const username = await getCurrentUsername(storage);
    
    if (!username) {
      return { success: false, error: 'Vui lòng đăng nhập' };
    }

    const shippingOrders = await getShippingOrders(storage);
    const deliveredOrders = await getDeliveredOrders(storage);
    
    const newShipping = shippingOrders.filter(o => o.id !== orderId);
    const newDelivered = deliveredOrders.filter(o => o.id !== orderId);
    
    await storage.setItem(`shippingOrders_${username}`, JSON.stringify(newShipping));
    await storage.setItem(`deliveredOrders_${username}`, JSON.stringify(newDelivered));

    return {
      success: true,
      message: 'Đã xóa đơn hàng',
    };
  } catch (error) {
    console.error('Delete order error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Clear all orders for current user
 */
export const clearUserOrders = async (storage) => {
  try {
    const username = await getCurrentUsername(storage);
    
    if (!username) {
      return { success: false, error: 'Vui lòng đăng nhập' };
    }

    await storage.removeItem(`shippingOrders_${username}`);
    await storage.removeItem(`deliveredOrders_${username}`);

    return {
      success: true,
      message: 'Đã xóa tất cả đơn hàng',
    };
  } catch (error) {
    console.error('Clear orders error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};