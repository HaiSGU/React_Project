import { useState, useMemo } from 'react';
import { searchRestaurantsAdvanced, normalizeText } from '../utils/searchHelpers';

/**
 * Hook tìm kiếm nhà hàng (hỗ trợ tìm theo tên, địa chỉ, category và món ăn)
 * @param {Array} restaurants - Danh sách nhà hàng
 * @param {Array} menuItems - Danh sách món ăn (optional)
 * @returns {Object} { query, setQuery, filteredRestaurants, hasResults }
 */
export const useRestaurantSearch = (restaurants = [], menuItems = []) => {
  const [query, setQuery] = useState('');

  const filteredRestaurants = useMemo(() => {
    if (!query.trim()) {
      return restaurants;
    }

    // Nếu có menuItems, dùng advanced search (tìm cả món ăn)
    if (menuItems && menuItems.length > 0) {
      return searchRestaurantsAdvanced(restaurants, menuItems, query);
    }

    // Nếu không, chỉ tìm theo thông tin nhà hàng
    const searchTerm = normalizeText(query.trim());
    return restaurants.filter(restaurant => {
      const nameMatch = normalizeText(restaurant.name).includes(searchTerm);
      const addressMatch = normalizeText(restaurant.address || '').includes(searchTerm);
      
      const categoryMatch = Array.isArray(restaurant.category)
        ? restaurant.category.some(cat => normalizeText(cat).includes(searchTerm))
        : normalizeText(restaurant.category || '').includes(searchTerm);

      return nameMatch || addressMatch || categoryMatch;
    });
  }, [restaurants, menuItems, query]);

  const hasResults = filteredRestaurants.length > 0;
  const noResults = query.trim() !== '' && filteredRestaurants.length === 0;

  return {
    query,
    setQuery,
    filteredRestaurants,
    hasResults,
    noResults,
    resultCount: filteredRestaurants.length,
  };
};

/**
 * Hook tìm kiếm chung cho cả Web và Mobile
 * @param {Array} items - Danh sách items cần search
 * @param {Array<string>} searchFields - Các field cần search (vd: ['name', 'address'])
 * @returns {Object} { query, setQuery, filteredItems, hasResults }
 */
export const useSearch = (items = [], searchFields = ['name']) => {
  const [query, setQuery] = useState('');

  const filteredItems = useMemo(() => {
    const searchTerm = normalizeText(query.trim());
    
    if (!searchTerm) {
      return items;
    }

    return items.filter(item => {
      return searchFields.some(field => {
        const value = item[field];
        
        // Xử lý nested field (vd: 'coordinates.latitude')
        if (field.includes('.')) {
          const keys = field.split('.');
          let nestedValue = item;
          for (const key of keys) {
            nestedValue = nestedValue?.[key];
          }
          return normalizeText(nestedValue?.toString() || '').includes(searchTerm);
        }
        
        // Xử lý array field (vd: category có thể là array hoặc string)
        if (Array.isArray(value)) {
          return value.some(v => normalizeText(v.toString()).includes(searchTerm));
        }
        
        // Xử lý string/number field
        return normalizeText(value?.toString() || '').includes(searchTerm);
      });
    });
  }, [items, query, searchFields]);

  const hasResults = filteredItems.length > 0;
  const noResults = query.trim() !== '' && filteredItems.length === 0;

  return {
    query,
    setQuery,
    filteredItems,
    hasResults,
    noResults,
    resultCount: filteredItems.length,
  };
};
