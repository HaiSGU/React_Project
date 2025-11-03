import { splitRevenue } from '../config/revenue';

const readOrders = (storage = localStorage) => {
  try { return JSON.parse(storage.getItem('orderHistory')) || []; }
  catch { return []; }
};

const toNumber = (v) => Number(v) || 0;
const orderTotal = (o) => toNumber(o?.totalPrice ?? o?.pricing?.total ?? 0);
const sum = (arr) => arr.reduce((a, b) => a + b, 0);

export const getAdminOverview = (storage = localStorage) => {
  const orders = readOrders(storage);

  const totalRevenue = sum(orders.map(orderTotal));
  const revenue = splitRevenue(totalRevenue);

  const byStatus = orders.reduce((acc, o) => {
    const k = o.status || 'unknown';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

  const byRestaurant = orders.reduce((acc, o) => {
    const rid = String(o.restaurantId ?? 'unknown');
    acc[rid] = (acc[rid] || 0) + orderTotal(o);
    return acc;
  }, {});

  const dailySeries = [...Array(7)].map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0,10);
    const daySum = sum(orders
      .filter(o => (o.createdAt || o.date || '').startsWith(key))
      .map(orderTotal));
    return { date: key, total: daySum };
  });

  const leaderboard = Object.entries(byRestaurant)
    .map(([rid, v]) => ({ restaurantId: rid, total: Math.round(v) }))
    .sort((a,b) => b.total - a.total)
    .slice(0, 10);

  return {
    counts: {
      totalOrders: orders.length,
      pending: byStatus.pending || 0,
      confirmed: byStatus.confirmed || 0,
      delivering: byStatus.delivering || 0,
      completed: byStatus.completed || 0,
      cancelled: byStatus.cancelled || 0,
    },
    revenue,
    byRestaurant,
    dailySeries,
    leaderboard,
    raw: orders,
  };
};