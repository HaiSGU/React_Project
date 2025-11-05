/**
 * ============================================
 * SHIPPER SERVICE
 * ============================================
 * Quản lý tài xế giao hàng
 */

import { DRIVERS_DATA } from '../constants/DriversData';

/**
 * Khởi tạo dữ liệu shipper từ DRIVERS
 */
export const initShippers = (storage) => {
  try {
    const existing = storage.getItem('shippers');
    
    if (!existing) {
      const shippers = DRIVERS_DATA.map(driver => ({
        id: driver.id,
        name: driver.name,
        rating: driver.rating,
        vehicle: driver.vehicle,
        phone: `090${1000000 + driver.id}`, // Số điện thoại
        status: 'active', // 'active' | 'busy' | 'offline' | 'suspended'
        currentOrders: [],
        createdAt: new Date().toISOString(),
      }));
      
      storage.setItem('shippers', JSON.stringify(shippers));
      console.log('✅ Initialized shippers:', shippers.length);
      return shippers;
    }
    
    return JSON.parse(existing);
  } catch (error) {
    console.error('Error initializing shippers:', error);
    return [];
  }
};

/**
 * Lấy tất cả shipper
 */
export const getAllShippers = (storage) => {
  try {
    const shippers = storage.getItem('shippers');
    return shippers ? JSON.parse(shippers) : initShippers(storage);
  } catch (error) {
    console.error('Error getting shippers:', error);
    return [];
  }
};

/**
 * Lấy shipper theo ID
 */
export const getShipperById = (storage, shipperId) => {
  const shippers = getAllShippers(storage);
  return shippers.find(s => s.id === shipperId);
};

/**
 * Cập nhật trạng thái shipper
 */
export const updateShipperStatus = (storage, shipperId, status) => {
  try {
    const shippers = getAllShippers(storage);
    const shipper = shippers.find(s => s.id === shipperId);
    
    if (!shipper) {
      return { success: false, error: 'Shipper not found' };
    }
    
    shipper.status = status; // 'active' | 'busy' | 'offline' | 'suspended'
    shipper.updatedAt = new Date().toISOString();
    
    storage.setItem('shippers', JSON.stringify(shippers));
    
    return { success: true, shipper };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Gán đơn hàng cho shipper
 */
export const assignOrderToShipper = (storage, shipperId, orderId) => {
  try {
    const shippers = getAllShippers(storage);
    const shipper = shippers.find(s => s.id === shipperId);
    
    if (!shipper) {
      return { success: false, error: 'Shipper not found' };
    }
    
    if (shipper.status === 'suspended') {
      return { success: false, error: 'Shipper bị tạm ngưng' };
    }
    
    shipper.currentOrders = shipper.currentOrders || [];
    shipper.currentOrders.push(orderId);
    shipper.status = 'busy';
    shipper.totalDeliveries += 1;
    
    storage.setItem('shippers', JSON.stringify(shippers));
    
    return { success: true, shipper };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Hoàn thành đơn hàng
 */
export const completeDelivery = (storage, shipperId, orderId, earnings) => {
  try {
    const shippers = getAllShippers(storage);
    const shipper = shippers.find(s => s.id === shipperId);
    
    if (!shipper) {
      return { success: false, error: 'Shipper not found' };
    }
    
    shipper.currentOrders = shipper.currentOrders.filter(id => id !== orderId);
    shipper.earnings += earnings || 15000; // Mặc định 15k/đơn
    
    if (shipper.currentOrders.length === 0) {
      shipper.status = 'active';
    }
    
    storage.setItem('shippers', JSON.stringify(shippers));
    
    return { success: true, shipper };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Lấy thống kê shipper với dữ liệu THỰC từ orders
 */
export const getShipperStats = (storage) => {
  const shippers = getAllShippers(storage);
  
  // Đọc tất cả orders từ localStorage
  const ordersData = JSON.parse(storage.getItem('orders') || '{"dangGiao":[],"daGiao":[]}');
  const allOrders = [...ordersData.dangGiao, ...ordersData.daGiao];
  
  console.log('📊 getShipperStats - Total orders:', allOrders.length);
  console.log('📊 Sample order driver:', allOrders[0]?.driver);
  console.log('📊 Sample order delivery.driver:', allOrders[0]?.delivery?.driver);
  console.log('📊 Sample order status:', allOrders[0]?.status);
  console.log('📊 All order statuses:', allOrders.map(o => o.status).join(', '));
  
  // Helper: chuẩn hóa status (bỏ dấu, lowercase) để so sánh linh hoạt
  const normalizeStatus = (status) => {
    if (!status) return '';
    return status
      .toString()
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  const isDeliveredStatus = (status) => {
    const normalized = normalizeStatus(status);
    return (
      normalized.includes('delivered') ||
      normalized.includes('completed') ||
      normalized.includes('done') ||
      normalized.includes('da giao') // "Đã giao" (có hoặc không dấu)
    );
  };

  // Tính toán thống kê cho mỗi shipper
  const shipperStats = shippers.map(shipper => {
    // Lọc các đơn hàng của shipper này
    // ⚠️ Driver có thể ở order.driver hoặc order.delivery.driver
    const shipperOrders = allOrders.filter(order => {
      const driver = order.driver || order.delivery?.driver;
      if (!driver) return false;
      
      const hasDriver = driver.id === shipper.id || 
                       driver.id === shipper.id.toString() ||
                       driver.name === shipper.name; // Fallback so sánh tên
      return hasDriver;
    });
    
    console.log(`🚴 Shipper #${shipper.id} (${shipper.name}): ${shipperOrders.length} orders, statuses:`, shipperOrders.map(o => o.status).join(', '));
    
    // ⭐ TỔNG ĐƠN ĐƯỢC GÁN (bao gồm tất cả status)
    const totalAssigned = shipperOrders.length;
    
    // ⭐ TỔNG ĐƠN ĐÃ GIAO (chỉ delivered/completed)
    const deliveredOrders = shipperOrders.filter(order => isDeliveredStatus(order.status));
    const totalDeliveries = deliveredOrders.length;
    
    // ⭐ TỔNG THU NHẬP (10% của đơn đã giao)
    const totalEarnings = deliveredOrders.reduce((sum, order) => {
      const orderTotal = order.total || order.totalPrice || 0;
      const shipperCommission = Math.round(orderTotal * 0.10); // 10% cho shipper
      
      console.log(`💰 Order #${order.id}: total=${order.total}, totalPrice=${order.totalPrice}, orderTotal=${orderTotal}, commission=${shipperCommission}`);
      
      return sum + shipperCommission;
    }, 0);
    
    console.log(`💵 Shipper #${shipper.id} total earnings:`, totalEarnings);
    
    // Tính tỷ lệ thành công
    const successRate = totalAssigned > 0 ? Math.round((totalDeliveries / totalAssigned) * 100) : 100;
    
    return {
      ...shipper,
      totalDeliveries,
      earnings: totalEarnings,
      successRate,
      totalAssigned, // Tổng đơn được giao (bao gồm cả đang giao)
    };
  });
  
  // Tổng hợp stats chung
  const totalDeliveries = shipperStats.reduce((sum, s) => sum + s.totalDeliveries, 0);
  const totalEarnings = shipperStats.reduce((sum, s) => sum + s.earnings, 0);
  
  return {
    total: shippers.length,
    active: shippers.filter(s => s.status === 'active').length,
    busy: shippers.filter(s => s.status === 'busy').length,
    offline: shippers.filter(s => s.status === 'offline').length,
    suspended: shippers.filter(s => s.status === 'suspended').length,
    totalDeliveries,
    totalEarnings,
    shippers: shipperStats, // ⭐ Trả về danh sách shipper với stats thực
  };
};

export default {
  initShippers,
  getAllShippers,
  getShipperById,
  updateShipperStatus,
  assignOrderToShipper,
  completeDelivery,
  getShipperStats,
};
