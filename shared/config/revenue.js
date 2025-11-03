export const COMMISSION_CONFIG = {
  app: 0.10,
  restaurant: 0.90,
};

export const splitRevenue = (amount) => {
  const total = Number(amount) || 0;
  return {
    total,
    app: Math.round(total * COMMISSION_CONFIG.app),
    restaurant: Math.round(total * COMMISSION_CONFIG.restaurant),
    percentages: {
      app: COMMISSION_CONFIG.app * 100,
      restaurant: COMMISSION_CONFIG.restaurant * 100,
    },
  };
};