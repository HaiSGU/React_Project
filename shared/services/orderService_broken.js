import { RESTAURANTS_DATA } from '../constants/RestaurantsData';
import {
  createOrderOnServer,
  updateOrderOnServer,
  syncOrdersForUser,
  normalizeOrder,
} from './cloudSyncService';

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

const parseJSON = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn('JSON parse error:', error);
    return fallback;
  }
};

const getCurrentUserProfile = async (storage) => {
  try {
    const userInfo = await storage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('Get user profile error:', error);
    return null;
  }
};

const shouldSyncRemote = (options = {}) => options.syncRemote !== false;

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

    const userProfile = await getCurrentUserProfile(storage);

    // ⚠️ KIỂM TRA TRẠNG THÁI NHÀ HÀNG TỪ API
    let restaurants = [];
    try {
      const res = await fetch('http://localhost:3000/restaurants');
      if (res.ok) {
        restaurants = await res.json();
        // Cập nhật cache localStorage luôn để các chỗ khác dùng
        storage.setItem('restaurants', JSON.stringify(restaurants));
      } else {
        throw new Error('API error');
      }
    } catch (error) {
      console.warn('Fetch restaurants failed, using localStorage:', error);
      const restaurantsData = await storage.getItem('restaurants');
      if (restaurantsData) {
        try {
          restaurants = JSON.parse(restaurantsData);
        } catch (e) { }
      }

      if (!Array.isArray(restaurants) || restaurants.length === 0) {
        restaurants = RESTAURANTS_DATA.map(rest => ({
          id: rest.id,
          name: rest.name,
          status: 'active',
        }));
      }
    }

    // So sánh ID dạng string để tránh lỗi type mismatch
    const restaurant = restaurants.find(r => String(r.id) === String(order.restaurantId));

    if (!restaurant) {
      return {
        success: false,
        error: `Nhà hàng không tồn tại (ID: ${order.restaurantId})`,
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
        export const getShippingOrders = async (storage, options = {}) => {
          try {
            const username = await getCurrentUsername(storage);

            if (!username) {
              return [];
            }

            if (shouldSyncRemote(options)) {
              await syncOrdersForUser(storage, username);
            }

            const shipping = await storage.getItem(`shippingOrders_${username}`);
            return parseJSON(shipping, []);
          } catch (error) {
            console.error('Get shipping orders error:', error);
            return [];
          }
        };

        /**
         * Get delivered orders - THEO USER
         */
        export const getDeliveredOrders = async (storage, options = {}) => {
          try {
            const username = await getCurrentUsername(storage);

            if (!username) {
              return [];
            }

            if (shouldSyncRemote(options)) {
              await syncOrdersForUser(storage, username);
            }

            const delivered = await storage.getItem(`deliveredOrders_${username}`);
            return parseJSON(delivered, []);
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

            if (!order?.id) {
              return {
                success: false,
                error: 'Không tìm thấy mã đơn hàng',
              };
            }

            const timestamp = new Date().toISOString();

            try {
              await updateOrderOnServer(order.id, {
                status: 'completed',
                deliveredAt: timestamp,
                updatedAt: timestamp,
              });
            } catch (syncError) {
              console.warn('Remote confirm delivery failed (ignoring):', syncError);
              // Ignore server error and proceed with local update
            }

            // Get current orders
            const shippingOrders = await getShippingOrders(storage, { syncRemote: false });
            const deliveredOrders = await getDeliveredOrders(storage, { syncRemote: false });

            // Remove from shipping
            const newShipping = shippingOrders.filter(o => o.id !== order.id);
            await storage.setItem(`shippingOrders_${username}`, JSON.stringify(newShipping));

            // Add to delivered
            const deliveredOrder = {
              ...order,
              status: 'completed',
              deliveredAt: timestamp,
              updatedAt: timestamp,
            };
            const newDelivered = [...deliveredOrders, deliveredOrder];
            await storage.setItem(`deliveredOrders_${username}`, JSON.stringify(newDelivered));

            // 🔄 Đồng bộ vào hệ thống orders chung (cho restaurant / admin / shipper)
            const ordersRaw = await storage.getItem('orders');
            const ordersData = parseJSON(ordersRaw, { dangGiao: [], daGiao: [] });
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
              await storage.setItem('orders', JSON.stringify(ordersData));
            } else {
              // Nếu đã ở daGiao thì cập nhật trạng thái cho chắc
              ordersData.daGiao = ordersData.daGiao.map(o => {
                if (String(o.id) === String(order.id)) {
                  return {
                    ...o,
                    ...deliveredOrder,
                    status: 'completed',
                    updatedAt: timestamp,
                    deliveredAt: timestamp,
                  };
                }
                return o;
              });
              await storage.setItem('orders', JSON.stringify(ordersData));
            }

            await syncOrdersForUser(storage, username);

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

            if (!orderId) {
              return { success: false, error: 'Thiếu mã đơn hàng' };
            }

            const timestamp = new Date().toISOString();

            try {
              await updateOrderOnServer(orderId, { status, updatedAt: timestamp });
            } catch (syncError) {
              console.error('Remote update order status failed:', syncError);
              return { success: false, error: 'Không thể cập nhật đơn hàng trên máy chủ!' };
            }

            const shippingOrders = await getShippingOrders(storage, { syncRemote: false });
            const deliveredOrders = await getDeliveredOrders(storage, { syncRemote: false });
            const ordersRaw = await storage.getItem('orders');
            const ordersData = parseJSON(ordersRaw, { dangGiao: [], daGiao: [] });

            // Find in shipping
            const shippingIndex = shippingOrders.findIndex(o => o.id === orderId);
            if (shippingIndex !== -1) {
              shippingOrders[shippingIndex].status = status;
              shippingOrders[shippingIndex].updatedAt = timestamp;
              await storage.setItem(`shippingOrders_${username}`, JSON.stringify(shippingOrders));
              ordersData.dangGiao = ordersData.dangGiao.map(order =>
                String(order.id) === String(orderId)
                  ? { ...order, status, updatedAt: timestamp }
                  : order
              );
              await storage.setItem('orders', JSON.stringify(ordersData));
              await syncOrdersForUser(storage, username);
              return { success: true, order: shippingOrders[shippingIndex] };
            }

            // Find in delivered
            const deliveredIndex = deliveredOrders.findIndex(o => o.id === orderId);
            if (deliveredIndex !== -1) {
              deliveredOrders[deliveredIndex].status = status;
              deliveredOrders[deliveredIndex].updatedAt = timestamp;
              await storage.setItem(`deliveredOrders_${username}`, JSON.stringify(deliveredOrders));
              ordersData.daGiao = ordersData.daGiao.map(order =>
                String(order.id) === String(orderId)
                  ? { ...order, status, updatedAt: timestamp }
                  : order
              );
              await storage.setItem('orders', JSON.stringify(ordersData));
              await syncOrdersForUser(storage, username);
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