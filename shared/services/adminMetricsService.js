/**
 * ============================================
 * ADMIN METRICS SERVICE
 * ============================================
 * Admin quản lý TỔNG THỂ hệ thống, không quản lý doanh thu chi tiết
 */

const readOrders = (storage = localStorage) => {
  try { return JSON.parse(storage.getItem('orders') || '{"dangGiao":[],"daGiao":[]}'); }
  catch { return { dangGiao: [], daGiao: [] }; }
};

const readRestaurants = (storage = localStorage) => {
  try { return JSON.parse(storage.getItem('restaurants') || '[]'); }
  catch { return []; }
};

const parseUsers = (value) => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to parse users from storage:', error);
    return [];
  }
};

const readUsers = (storage = localStorage) => {
  try {
    const registeredUsers = parseUsers(storage.getItem('registeredUsers'));
    const primaryUsers = parseUsers(storage.getItem('user'));
    const source = registeredUsers.length >= primaryUsers.length ? registeredUsers : primaryUsers;
    return source.map(user => ({
      ...user,
      banned: Boolean(user?.banned),
    }));
  } catch (error) {
    console.error('adminMetricsService.readUsers error:', error);
    return [];
  }
};

const persistUsers = (storage, users) => {
  const normalized = users.map(user => ({
    ...user,
    banned: Boolean(user?.banned),
  }));
  const serialized = JSON.stringify(normalized);
  storage.setItem('registeredUsers', serialized);
  storage.setItem('user', serialized);
};

const toNumber = (v) => Number(v) || 0;

/**
 * Lấy tổng quan hệ thống cho Admin
 */
export const getAdminOverview = (storage = localStorage) => {
  const ordersData = readOrders(storage);
  const allOrders = [...ordersData.dangGiao, ...ordersData.daGiao];
  const restaurants = readRestaurants(storage);
  const users = readUsers(storage);

  // Thống kê đơn hàng
  const ordersByStatus = {
    shipping: ordersData.dangGiao.length,
    delivered: ordersData.daGiao.length,
    total: allOrders.length,
  };

  // Thống kê nhà hàng
  const restaurantStats = {
    total: restaurants.length,
    active: restaurants.filter(r => r.status === 'active').length,
    pending: restaurants.filter(r => r.status === 'pending').length,
    suspended: restaurants.filter(r => r.status === 'suspended').length,
  };

  // Thống kê người dùng
  const userStats = {
    total: users.length,
    active: users.filter(u => !u.banned).length,
    banned: users.filter(u => u.banned).length,
  };

  // Phí platform (10% từ mỗi đơn)
  const platformCommission = allOrders.reduce((sum, order) => {
    return sum + (order.total || 0) * 0.1;
  }, 0);

  // Biểu đồ đơn hàng 7 ngày
  const dailySeries = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().slice(0, 10);

    const dayOrders = allOrders.filter(o => {
      const orderDate = new Date(o.createdAt).toISOString().slice(0, 10);
      return orderDate === dateStr;
    });

    return {
      date: dateStr,
      count: dayOrders.length,
      label: d.toLocaleDateString('vi-VN', { weekday: 'short' })
    };
  });

  // Top restaurants theo số đơn hàng
  const ordersByRestaurant = {};
  allOrders.forEach(order => {
    const rid = order.restaurantId || 1;
    if (!ordersByRestaurant[rid]) {
      ordersByRestaurant[rid] = { count: 0, total: 0 };
    }
    ordersByRestaurant[rid].count += 1;
    ordersByRestaurant[rid].total += order.total || 0;
  });

  const topRestaurants = Object.entries(ordersByRestaurant)
    .map(([rid, data]) => ({
      restaurantId: parseInt(rid),
      orderCount: data.count,
      totalRevenue: data.total
    }))
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, 10);

  return {
    orders: ordersByStatus,
    restaurants: restaurantStats,
    users: userStats,
    platform: {
      commission: Math.round(platformCommission),
      period: 'all-time'
    },
    dailySeries,
    topRestaurants,
  };
};

/**
 * Lấy danh sách nhà hàng
 */
export const getRestaurants = (storage = localStorage) => {
  return readRestaurants(storage);
};

/**
 * Cập nhật trạng thái nhà hàng (duyệt/khóa)
 */
export const updateRestaurantStatus = (storage, restaurantId, status) => {
  try {
    const restaurants = readRestaurants(storage);
    const restaurant = restaurants.find(r => String(r.id) === String(restaurantId));

    if (!restaurant) {
      return { success: false, error: 'Restaurant not found' };
    }

    restaurant.status = status; // 'active' | 'pending' | 'suspended'
    restaurant.updatedAt = new Date().toISOString();

    storage.setItem('restaurants', JSON.stringify(restaurants));

    return { success: true, restaurant };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Lấy danh sách users
 */
export const getUsers = (storage = localStorage) => {
  return readUsers(storage);
};

/**
 * Cập nhật trạng thái user (khóa/mở)
 */
export const updateUserStatus = (storage, username, banned) => {
  try {
    const users = readUsers(storage);
    const user = users.find(u => u.username === username);

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    user.banned = banned;
    user.updatedAt = new Date().toISOString();
    persistUsers(storage, users);

    try {
      const currentUserInfo = storage.getItem('userInfo');
      if (currentUserInfo) {
        const currentUser = JSON.parse(currentUserInfo);
        if (currentUser?.username === user.username) {
          storage.setItem('userInfo', JSON.stringify(user));
          if (banned) {
            storage.removeItem('isLoggedIn');
          }
        }
      }
    } catch (syncError) {
      console.error('Failed to sync current user after status change:', syncError);
    }

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Lấy danh sách báo cáo/khiếu nại
 */
export const getReports = (storage = localStorage) => {
  try {
    return JSON.parse(storage.getItem('reports') || '[]');
  } catch {
    return [];
  }
};

/**
 * Tạo report mới
 */
export const createReport = (storage, report) => {
  try {
    const reports = getReports(storage);
    const newReport = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      status: 'pending',
      ...report
    };

    reports.unshift(newReport);
    storage.setItem('reports', JSON.stringify(reports));

    return { success: true, report: newReport };
  } catch (error) {
    return { success: false, error: error.message };
  }
};