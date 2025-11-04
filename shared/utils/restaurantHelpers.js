
// Lọc nhà hàng theo category

export const filterRestaurantsByCategory = (restaurants, categoryKey) => {
  return restaurants.filter(r =>
    Array.isArray(r.category)
      ? r.category.includes(categoryKey)
      : r.category === categoryKey
  );
};


// Lọc nhà hàng theo discount

export const filterRestaurantsByDiscount = (restaurants, discountRestaurantIds) => {
  return restaurants.filter(r => discountRestaurantIds.includes(r.id));
};


 // Lọc menu items theo restaurant ID

export const filterMenuByRestaurant = (menuItems, restaurantId) => {
  return menuItems.filter(item => {
    if (Array.isArray(item.restaurantId)) {
      return item.restaurantId.includes(restaurantId);
    }
    return item.restaurantId === restaurantId;
  });
};


// Tìm category label

export const getCategoryLabel = (categories, categoryKey) => {
  return categories.find(c => c.key === categoryKey)?.label || categoryKey;
};


// Tìm discount
export const getDiscountByType = (discounts, type) => {
  return discounts.find(d => d.type === type);
};

/**
 * Get restaurant by ID
 */
export const getRestaurantById = (restaurants, id) => {
  const restaurantId = typeof id === 'string' ? parseInt(id) : id;
  return restaurants.find(r => r.id === restaurantId);
};

/**
 * Get featured restaurants
 */
export const getFeaturedRestaurants = (restaurants) => {
  return restaurants.filter(r => r.isFeatured);
};

/**
 * Search restaurants by name or address
 */
export const searchRestaurants = (restaurants, query) => {
  if (!query || !query.trim()) return restaurants;
  
  const lowerQuery = query.toLowerCase().trim();
  return restaurants.filter(r => 
    r.name?.toLowerCase().includes(lowerQuery) ||
    r.address?.toLowerCase().includes(lowerQuery)
  );
};
