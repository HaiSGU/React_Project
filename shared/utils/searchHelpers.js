/**
 * Helper functions cho search functionality
 */

/**
 * Normalize Vietnamese text for better search (remove accents)
 */
export const normalizeText = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd');
};

/**
 * Tìm kiếm nhà hàng theo từ khóa (tên, địa chỉ, category)
 * @param {Array} restaurants - Danh sách nhà hàng
 * @param {string} query - Từ khóa tìm kiếm
 * @returns {Array} Danh sách nhà hàng phù hợp
 */
export const searchRestaurants = (restaurants, query) => {
  const searchTerm = normalizeText(query.trim());
  
  if (!searchTerm) return restaurants;

  return restaurants.filter(restaurant => {
    const nameMatch = normalizeText(restaurant.name).includes(searchTerm);
    const addressMatch = normalizeText(restaurant.address || '').includes(searchTerm);
    
    // Search trong category (có thể là string hoặc array)
    const categoryMatch = Array.isArray(restaurant.category)
      ? restaurant.category.some(cat => normalizeText(cat).includes(searchTerm))
      : normalizeText(restaurant.category || '').includes(searchTerm);

    return nameMatch || addressMatch || categoryMatch;
  });
};

/**
 * Tìm nhà hàng theo món ăn
 * @param {Array} restaurants - Danh sách nhà hàng
 * @param {Array} menuItems - Danh sách món ăn (từ MenuItems.js)
 * @param {string} query - Từ khóa tìm kiếm món ăn
 * @returns {Array} Danh sách nhà hàng có món ăn phù hợp
 */
export const searchRestaurantsByMenuItem = (restaurants, menuItems, query) => {
  const searchTerm = normalizeText(query.trim());
  
  if (!searchTerm) return [];

  // Tìm các món ăn match với query
  const matchingMenuItems = menuItems.filter(item => {
    const nameMatch = normalizeText(item.name).includes(searchTerm);
    const descMatch = normalizeText(item.description || '').includes(searchTerm);
    const categoryMatch = normalizeText(item.category || '').includes(searchTerm);
    
    return nameMatch || descMatch || categoryMatch;
  });

  // Lấy danh sách restaurantId từ các món ăn match
  const restaurantIds = new Set(matchingMenuItems.map(item => item.restaurantId));

  // Trả về các nhà hàng có món ăn match
  return restaurants.filter(restaurant => restaurantIds.has(restaurant.id));
};

/**
 * Tìm kiếm tổng hợp: tìm nhà hàng theo tên/địa chỉ/category HOẶC theo món ăn
 * @param {Array} restaurants - Danh sách nhà hàng
 * @param {Array} menuItems - Danh sách món ăn
 * @param {string} query - Từ khóa tìm kiếm
 * @returns {Array} Danh sách nhà hàng phù hợp (không trùng lặp)
 */
export const searchRestaurantsAdvanced = (restaurants, menuItems, query) => {
  const searchTerm = normalizeText(query.trim());
  
  if (!searchTerm) return restaurants;

  // Tìm theo thông tin nhà hàng
  const restaurantMatches = searchRestaurants(restaurants, query);

  // Tìm theo món ăn
  const menuMatches = searchRestaurantsByMenuItem(restaurants, menuItems, query);

  // Gộp kết quả, loại bỏ trùng lặp
  const allMatches = new Map();
  
  restaurantMatches.forEach(r => allMatches.set(r.id, r));
  menuMatches.forEach(r => allMatches.set(r.id, r));

  return Array.from(allMatches.values());
};

/**
 * Tìm kiếm món ăn theo từ khóa
 * @param {Array} menuItems - Danh sách món ăn
 * @param {string} query - Từ khóa tìm kiếm
 * @returns {Array} Danh sách món ăn phù hợp
 */
export const searchMenuItems = (menuItems, query) => {
  const searchTerm = normalizeText(query.trim());
  
  if (!searchTerm) return menuItems;

  return menuItems.filter(item => {
    const nameMatch = normalizeText(item.name).includes(searchTerm);
    const descMatch = normalizeText(item.description || '').includes(searchTerm);
    const categoryMatch = normalizeText(item.category || '').includes(searchTerm);

    return nameMatch || descMatch || categoryMatch;
  });
};

/**
 * Highlight text matching search query
 * @param {string} text - Text gốc
 * @param {string} query - Từ khóa search
 * @returns {string} Text với highlight
 */
export const highlightText = (text, query) => {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

/**
 * Tính điểm relevance score cho kết quả search
 * @param {Object} item - Item cần tính điểm
 * @param {string} query - Từ khóa search
 * @param {Array<string>} fields - Các field cần check
 * @returns {number} Điểm từ 0-100
 */
export const calculateRelevanceScore = (item, query, fields) => {
  const searchTerm = query.trim().toLowerCase();
  if (!searchTerm) return 0;

  let score = 0;
  
  fields.forEach((field, index) => {
    const value = item[field]?.toString().toLowerCase();
    if (!value) return;

    // Exact match = 50 points
    if (value === searchTerm) {
      score += 50;
    }
    // Starts with = 30 points
    else if (value.startsWith(searchTerm)) {
      score += 30;
    }
    // Contains = 10 points
    else if (value.includes(searchTerm)) {
      score += 10;
    }

    // Field priority (field đầu tiên quan trọng hơn)
    score += (fields.length - index) * 2;
  });

  return Math.min(score, 100);
};

/**
 * Sắp xếp kết quả search theo relevance
 * @param {Array} items - Danh sách items
 * @param {string} query - Từ khóa search
 * @param {Array<string>} fields - Các field để tính điểm
 * @returns {Array} Danh sách đã sắp xếp
 */
export const sortByRelevance = (items, query, fields = ['name']) => {
  return items
    .map(item => ({
      ...item,
      _relevanceScore: calculateRelevanceScore(item, query, fields),
    }))
    .sort((a, b) => b._relevanceScore - a._relevanceScore)
    .map(({ _relevanceScore, ...item }) => item); // Remove score field
};
