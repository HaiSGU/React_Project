/**
 * Lấy tất cả đơn hàng của nhà hàng
 */
export const getRestaurantOrders = (restaurantId, storage) => {
  try {
    // Đọc từ cấu trúc mới: {dangGiao: [], daGiao: []}
    const ordersData = JSON.parse(storage.getItem('orders') || '{"dangGiao":[],"daGiao":[]}');
    const allOrders = [...ordersData.dangGiao, ...ordersData.daGiao];
    
    console.log('🔍 All orders:', allOrders);
    console.log('🔍 Looking for restaurantId:', restaurantId);
    
    // Lọc đơn hàng theo restaurantId (hỗ trợ cả string và number)
    const filtered = allOrders.filter(order => {
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
export const updateOrderStatus = (orderId, newStatus, storage) => {
  try {
    // Đọc từ cấu trúc mới: {dangGiao: [], daGiao: []}
    const ordersData = JSON.parse(storage.getItem('orders') || '{"dangGiao":[],"daGiao":[]}');
    
    let updated = false;
    let updatedOrder = null;
    
    // Tìm và cập nhật order
    if (newStatus === 'processing') {
      // Pending → Processing: vẫn ở dangGiao
      ordersData.dangGiao = ordersData.dangGiao.map(order => {
        if (String(order.id) === String(orderId)) {
          updatedOrder = { ...order, status: newStatus, updatedAt: new Date().toISOString() };
          updated = true;
          return updatedOrder;
        }
        return order;
      });
    } else if (newStatus === 'delivered') {
      // Processing → Delivered: chuyển từ dangGiao sang daGiao
      const orderIndex = ordersData.dangGiao.findIndex(o => String(o.id) === String(orderId));
      if (orderIndex !== -1) {
        updatedOrder = { 
          ...ordersData.dangGiao[orderIndex], 
          status: newStatus, 
          updatedAt: new Date().toISOString(),
          deliveredAt: new Date().toISOString()
        };
        ordersData.dangGiao.splice(orderIndex, 1);
        ordersData.daGiao.push(updatedOrder);
        updated = true;
      }
    }
    
    if (updated) {
      storage.setItem('orders', JSON.stringify(ordersData));
      console.log('✅ Order status updated:', orderId, '→', newStatus);
      return { success: true, order: updatedOrder };
    }
    
    return { success: false, error: 'Order not found' };
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
  
  switch(dateFilter) {
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