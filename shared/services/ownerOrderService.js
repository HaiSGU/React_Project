/**
 * Lấy tất cả đơn hàng của nhà hàng
 */
export const getRestaurantOrders = (restaurantId, storage) => {
  try {
    const allOrders = JSON.parse(storage.getItem('orderHistory') || '[]')
    
    console.log('🔍 All orders:', allOrders)
    console.log('🔍 Looking for restaurantId:', restaurantId)
    
    // Lọc đơn hàng theo restaurantId (hỗ trợ cả string và number)
    const filtered = allOrders.filter(order => {
      // So sánh restaurantId
      const matchRestaurant = String(order.restaurantId) === String(restaurantId)
      
      // Hoặc kiểm tra trong items
      const matchItems = order.items?.some(item => 
        String(item.restaurantId) === String(restaurantId)
      )
      
      return matchRestaurant || matchItems
    })
    
    console.log('✅ Filtered orders:', filtered)
    return filtered
    
  } catch (error) {
    console.error('Error getting restaurant orders:', error)
    return []
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
    return total + (order.totalPrice || 0)
  }, 0)
}

/**
 * Cập nhật trạng thái đơn hàng
 */
export const updateOrderStatus = (orderId, newStatus, storage) => {
  try {
    const allOrders = JSON.parse(storage.getItem('orderHistory') || '[]')
    
    const updatedOrders = allOrders.map(order => {
      if (String(order.id) === String(orderId)) {
        return { 
          ...order, 
          status: newStatus, 
          updatedAt: new Date().toISOString() 
        }
      }
      return order
    })
    
    storage.setItem('orderHistory', JSON.stringify(updatedOrders))
    return { success: true }
  } catch (error) {
    console.error('Error updating order status:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Lấy số liệu thống kê
 */
export const getRestaurantStats = (restaurantId, storage) => {
  const allOrders = getRestaurantOrders(restaurantId, storage)
  const todayOrders = getTodayOrders(restaurantId, storage)
  
  return {
    totalOrders: allOrders.length,
    todayOrders: todayOrders.length,
    todayRevenue: calculateRevenue(todayOrders),
    totalRevenue: calculateRevenue(allOrders),
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