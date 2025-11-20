import { updateOrderOnServer, syncOrdersToStorage } from './cloudSyncService';

/**
* Lấy tất cả đơn hàng của nhà hàng
*/
export const getRestaurantOrders = (restaurantId, storage) => {
  try {
    const allOrders = [];

    // 1. Đọc từ key global 'orders'
    const ordersData = JSON.parse(storage.getItem('orders') || '{"dangGiao":[],"daGiao":[]}');
    allOrders.push(...ordersData.dangGiao, ...ordersData.daGiao);

    // 2. Đọc từ tất cả user-specific keys
    // Duyệt qua tất cả keys trong localStorage
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);

      // Tìm các key có pattern shippingOrders_* hoặc deliveredOrders_*
      if (key && (key.startsWith('shippingOrders_') || key.startsWith('deliveredOrders_'))) {
        try {
          const userOrders = JSON.parse(storage.getItem(key) || '[]');
          if (Array.isArray(userOrders)) {
            allOrders.push(...userOrders);
          }
        } catch (e) {
          console.warn('Failed to parse', key, e);
        }
      }
    }

    // 3. Loại bỏ trùng lặp dựa trên order.id
    const uniqueOrders = Array.from(
      new Map(allOrders.map(order => [String(order.id), order])).values()
    );

    console.log('🔍 Total unique orders:', uniqueOrders.length);
    console.log('🔍 Looking for restaurantId:', restaurantId);

    // 4. Lọc đơn hàng theo restaurantId
    const filtered = uniqueOrders.filter(order => {
      return String(order.restaurantId) === String(restaurantId);
    });

    console.log('✅ Filtered orders for restaurant', restaurantId, ':', filtered);
    return filtered;

  } catch (error) {
    console.error('Error getting restaurant orders:', error);
    return [];
  }
}

/**
 * Lấy đơn hàng hôm nay
 */
export const getTodayOrders = (restaurantId, storage) => {
  const orders = getRestaurantOrders(restaurantId, storage)
  const today = new Date().toDateString()

  return orders.filter(order => {
    const orderDate = new Date(order.date || order.createdAt).toDateString()
    return orderDate === today
  })
}

/**
 * Tính tổng doanh thu
 */
export const calculateRevenue = (orders) => {
  return orders.reduce((total, order) => {
    // Hỗ trợ cả 2 field: total (mới) và totalPrice (cũ)
    return total + (order.total || order.totalPrice || 0)
  }, 0)
}

/**
 * Cập nhật trạng thái đơn hàng
 */
export const updateOrderStatus = async (orderId, newStatus, storage = localStorage) => {
  try {
    const timestamp = new Date().toISOString();
    const payload = {
      status: newStatus,
      updatedAt: timestamp,
    };

    if (newStatus === 'delivered') {
      payload.deliveredAt = timestamp;
    }

    await updateOrderOnServer(orderId, payload);
    const syncResult = await syncOrdersToStorage(storage);

    if (!syncResult.success) {
      throw new Error(syncResult.error || 'Không thể đồng bộ dữ liệu đơn hàng!');
    }

    const allOrders = [
      ...(syncResult.orders.dangGiao || []),
      ...(syncResult.orders.daGiao || []),
    ];

    const updatedOrder = allOrders.find(order => String(order.id) === String(orderId));

    if (!updatedOrder) {
      return { success: false, error: 'Order not found' };
    }

    console.log('✅ Order status updated via cloud sync:', orderId, '→', newStatus);
    return { success: true, order: updatedOrder };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Cấu hình phí hoa hồng
 */
const COMMISSION_CONFIG = {
  restaurant: 0.80,  // Nhà hàng nhận 80%
  app: 0.20,         // App lấy 20% (Platform 10% + Shipper 10%)
  platform: 0.10,    // Platform phí 10%
  shipper: 0.10      // Shipper phí 10%
}

/**
 * Tính chi tiết doanh thu
 */
export const calculateRevenueBreakdown = (orders) => {
  const totalRevenue = calculateRevenue(orders)

  return {
    total: totalRevenue,
    restaurant: Math.round(totalRevenue * COMMISSION_CONFIG.restaurant),
    platform: Math.round(totalRevenue * COMMISSION_CONFIG.platform),
    shipper: Math.round(totalRevenue * COMMISSION_CONFIG.shipper),
    app: Math.round(totalRevenue * COMMISSION_CONFIG.app), // Tổng app = platform + shipper
    percentages: {
      restaurant: COMMISSION_CONFIG.restaurant * 100,
      platform: COMMISSION_CONFIG.platform * 100,
      shipper: COMMISSION_CONFIG.shipper * 100,
      app: COMMISSION_CONFIG.app * 100,
    }
  }
}

/**
 * Lấy số liệu thống kê
 */
export const getRestaurantStats = (restaurantId, storage) => {
  const allOrders = getRestaurantOrders(restaurantId, storage)
  const todayOrders = getTodayOrders(restaurantId, storage)

  const todayRevenueBreakdown = calculateRevenueBreakdown(todayOrders)
  const totalRevenueBreakdown = calculateRevenueBreakdown(allOrders)

  return {
    totalOrders: allOrders.length,
    todayOrders: todayOrders.length,

    todayRevenue: {
      total: todayRevenueBreakdown.total,
      app: todayRevenueBreakdown.app,
      restaurant: todayRevenueBreakdown.restaurant,
      percentages: todayRevenueBreakdown.percentages,
    },

    totalRevenue: {
      total: totalRevenueBreakdown.total,
      app: totalRevenueBreakdown.app,
      restaurant: totalRevenueBreakdown.restaurant,
      percentages: totalRevenueBreakdown.percentages,
    },

    pendingOrders: allOrders.filter(o => o.status === 'pending').length,
    processingOrders: allOrders.filter(o => o.status === 'processing').length,
    deliveredOrders: allOrders.filter(o => o.status === 'delivered').length,
  }
}

/**
 * Lấy dữ liệu biểu đồ 7 ngày gần đây
 */
export const getChartData = (restaurantId, storage) => {
  const allOrders = getRestaurantOrders(restaurantId, storage)
  const chartData = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })

    const dayOrders = allOrders.filter(order => {
      const orderDate = new Date(order.date || order.createdAt)
      return orderDate.toDateString() === date.toDateString()
    })

    const revenue = calculateRevenue(dayOrders) / 1000

    chartData.push({
      date: dateStr,
      orders: dayOrders.length,
      revenue: Math.round(revenue)
    })
  }

  return chartData
}

/**
 * Lấy đơn hàng theo bộ lọc ngày
 */
export const getOrdersByDateFilter = (restaurantId, dateFilter, storage) => {
  const allOrders = getRestaurantOrders(restaurantId, storage)
  const now = new Date()

  switch (dateFilter) {
    case 'today':
      return allOrders.filter(o => {
        const orderDate = new Date(o.date || o.createdAt)
        return orderDate.toDateString() === now.toDateString()
      })

    case 'week':
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return allOrders.filter(o => {
        const orderDate = new Date(o.date || o.createdAt)
        return orderDate >= weekAgo
      })

    case 'month':
      return allOrders.filter(o => {
        const orderDate = new Date(o.date || o.createdAt)
        return orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
      })

    default:
      return allOrders
  }
}