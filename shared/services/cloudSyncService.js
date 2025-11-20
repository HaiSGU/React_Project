import eventBus, { EVENT_TYPES } from './eventBus';

let cloudConfig = {
  baseUrl: 'http://localhost:3000',
  orderPollIntervalMs: 5000,
};

let orderPollerId = null;

const isPromise = (value) =>
  value && typeof value === 'object' && typeof value.then === 'function';

const toPromise = (result) => (isPromise(result) ? result : Promise.resolve(result));

const getStorageItem = async (storage, key) => {
  if (!storage || typeof storage.getItem !== 'function') return null;
  const value = storage.getItem(key);
  return isPromise(value) ? await value : value ?? null;
};

const setStorageItem = async (storage, key, value) => {
  if (!storage || typeof storage.setItem !== 'function') return;
  const result = storage.setItem(key, value);
  if (isPromise(result)) {
    await result;
  }
};

const buildUrl = (path, params = {}) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  const base = cloudConfig.baseUrl?.replace(/\/$/, '') || 'http://localhost:3000';
  return `${base}${normalizedPath}${query ? `?${query}` : ''}`;
};

const fetchJson = async (path, options = {}) => {
  const response = await fetch(buildUrl(path, options.params), {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    method: options.method || 'GET',
    body: options.body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

const normalizeUser = (user) => {
  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    password: user.password,
    fullName: user.fullName || user.fullname || user.username,
    phone: user.phone || '',
    email: user.email || '',
    address: user.address || '',
    gender: user.gender || 'other',
    createdAt: user.createdAt || new Date().toISOString(),
    banned: Boolean(user.banned),
  };
};

export const normalizeOrder = (order) => {
  if (!order) return null;
  const status = order.status || 'pending';
  const createdAt = order.createdAt || order.date || new Date().toISOString();
  const updatedAt = order.updatedAt || createdAt;

  return {
    ...order,
    id: order.id != null ? String(order.id) : String(order.localId || Date.now()),
    status,
    items: Array.isArray(order.items)
      ? order.items.map(item => ({
          ...item,
          name: item.name || item.title || item.productName || 'Món ăn',
          quantity: Number(item.quantity) || 1,
          price: Number(item.price) || 0,
        }))
      : [],
    total: order.total ?? order.totalPrice ?? 0,
    totalPrice: order.totalPrice ?? order.total ?? 0,
    username: order.username || order.user?.username || '',
    userId: order.userId ?? order.user?.id ?? null,
    customerName: order.customerName || order.user?.fullName || order.username || 'Khách hàng',
    address: order.address || order.user?.address || 'Không có địa chỉ',
    createdAt,
    date: order.date || createdAt,
    updatedAt,
    deliveredAt: order.deliveredAt || (status === 'completed' || status === 'delivered' ? updatedAt : order.deliveredAt),
    deliveryMethod: order.deliveryMethod || 'fast',
    paymentMethod: order.paymentMethod || 'cash',
  };
};

const bucketOrders = (orders = []) => {
  const buckets = {
    dangGiao: [],
    daGiao: [],
  };

  orders.forEach((order) => {
    const normalized = normalizeOrder(order);
    if (!normalized) return;
    if (normalized.status === 'completed' || normalized.status === 'delivered') {
      buckets.daGiao.push(normalized);
    } else {
      buckets.dangGiao.push(normalized);
    }
  });

  return buckets;
};

const flattenOrders = (ordersObj = {}) => [
  ...(ordersObj.dangGiao || []),
  ...(ordersObj.daGiao || []),
];

const diffOrders = (previousOrders, nextOrders) => {
  const prevMap = new Map(flattenOrders(previousOrders).map((order) => [String(order.id), order]));
  const nextMap = new Map(flattenOrders(nextOrders).map((order) => [String(order.id), order]));

  const newOrders = [];
  const statusChanges = [];

  nextMap.forEach((order, id) => {
    const prev = prevMap.get(id);
    if (!prev) {
      newOrders.push(order);
      return;
    }

    if (prev.status !== order.status) {
      statusChanges.push({
        order,
        previousStatus: prev.status,
        newStatus: order.status,
      });
    }
  });

  return { newOrders, statusChanges };
};

export const configureCloudSync = (options = {}) => {
  cloudConfig = {
    ...cloudConfig,
    ...options,
  };
};

export const getCloudSyncConfig = () => ({ ...cloudConfig });

export const fetchUsersFromServer = () => fetchJson('/users');

export const createUserOnServer = (userData) =>
  fetchJson('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

export const updateUserOnServer = (userId, updates) =>
  fetchJson(`/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });

export const fetchOrdersFromServer = (params = {}) =>
  fetchJson('/orders', { params });

export const createOrderOnServer = (orderData) =>
  fetchJson('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });

export const updateOrderOnServer = (orderId, updates) =>
  fetchJson(`/orders/${orderId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });

export const syncUsersToStorage = async (storage) => {
  try {
    const remoteUsers = await fetchUsersFromServer();
    const normalized = Array.isArray(remoteUsers)
      ? remoteUsers.map(normalizeUser).filter(Boolean)
      : [];
    const serialized = JSON.stringify(normalized);
    await toPromise(setStorageItem(storage, 'user', serialized));
    await toPromise(setStorageItem(storage, 'registeredUsers', serialized));
    return { success: true, users: normalized };
  } catch (error) {
    console.error('Sync users failed:', error);
    return { success: false, error: error.message };
  }
};

export const syncOrdersToStorage = async (storage, options = {}) => {
  try {
    const remoteOrders = await fetchOrdersFromServer(options.filters);
    const normalized = bucketOrders(Array.isArray(remoteOrders) ? remoteOrders : []);
    const previousRaw = await getStorageItem(storage, 'orders');
    const previousOrders = previousRaw ? JSON.parse(previousRaw) : { dangGiao: [], daGiao: [] };

    await toPromise(setStorageItem(storage, 'orders', JSON.stringify(normalized)));

    const changes = diffOrders(previousOrders, normalized);

    if (changes.newOrders.length === 0 && changes.statusChanges.length === 0) {
      eventBus.emit(EVENT_TYPES.ORDER_CONFIRMED, { source: 'cloud-sync' });
    } else {
      changes.newOrders.forEach((order) => eventBus.emit(EVENT_TYPES.ORDER_CREATED, order));
      changes.statusChanges.forEach(({ order, newStatus }) => {
        if (newStatus === 'shipping') {
          eventBus.emit(EVENT_TYPES.ORDER_SHIPPING, order);
        } else if (newStatus === 'completed' || newStatus === 'delivered') {
          eventBus.emit(EVENT_TYPES.ORDER_DELIVERED, order);
        } else {
          eventBus.emit(EVENT_TYPES.ORDER_CONFIRMED, order);
        }
      });
    }

    return { success: true, orders: normalized };
  } catch (error) {
    console.error('Sync orders failed:', error);
    return { success: false, error: error.message };
  }
};

export const syncOrdersForUser = async (storage, username) => {
  if (!username) {
    return { success: false, error: 'Missing username' };
  }

  try {
    const remoteOrders = await fetchOrdersFromServer({ username });
    const normalized = Array.isArray(remoteOrders)
      ? remoteOrders.map(normalizeOrder).filter(Boolean)
      : [];

    const shipping = normalized.filter(
      (order) => order.status !== 'completed' && order.status !== 'delivered'
    );
    const delivered = normalized.filter(
      (order) => order.status === 'completed' || order.status === 'delivered'
    );

    await toPromise(
      setStorageItem(storage, `shippingOrders_${username}`, JSON.stringify(shipping))
    );
    await toPromise(
      setStorageItem(storage, `deliveredOrders_${username}`, JSON.stringify(delivered))
    );

    return { success: true, shipping, delivered };
  } catch (error) {
    console.error('Sync user orders failed:', error);
    return { success: false, error: error.message };
  }
};

export const startOrderPolling = (storage, options = {}) => {
  if (!storage) return;
  const intervalMs = options.intervalMs || cloudConfig.orderPollIntervalMs || 5000;

  if (orderPollerId) {
    clearInterval(orderPollerId);
    orderPollerId = null;
  }

  const runSync = () => {
    syncOrdersToStorage(storage).catch((error) =>
      console.error('Order polling sync failed:', error)
    );
  };

  runSync();
  orderPollerId = setInterval(runSync, intervalMs);

  return () => stopOrderPolling();
};

export const stopOrderPolling = () => {
  if (orderPollerId) {
    clearInterval(orderPollerId);
    orderPollerId = null;
  }
};

export default {
  configureCloudSync,
  getCloudSyncConfig,
  fetchUsersFromServer,
  createUserOnServer,
  updateUserOnServer,
  fetchOrdersFromServer,
  createOrderOnServer,
  updateOrderOnServer,
  syncUsersToStorage,
  syncOrdersToStorage,
  syncOrdersForUser,
  startOrderPolling,
  stopOrderPolling,
  normalizeOrder,
};

