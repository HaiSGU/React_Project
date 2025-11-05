/**
 * ============================================
 * INIT ADMIN DATA
 * ============================================
 * Khởi tạo dữ liệu mẫu cho Admin Dashboard
 */

import { RESTAURANTS_DATA } from '../constants/RestaurantsData';

export const initAdminData = (storage = localStorage, forceReinit = false) => {
  // Kiểm tra đã init chưa (hoặc force reinit)
  if (storage.getItem('adminDataInitialized') && !forceReinit) {
    return;
  }

  // Chuyển đổi RESTAURANTS_DATA thành format cho admin
  const restaurants = RESTAURANTS_DATA.map((rest, index) => ({
    id: rest.id,
    name: rest.name,
    category: Array.isArray(rest.category) ? rest.category.join(', ') : rest.category,
    address: rest.address,
    rating: rest.rating,
    // Phân status: ID 18-19 là pending, ID 6 là suspended, còn lại active
    status: rest.id === 18 || rest.id === 19 ? 'pending' : rest.id === 6 ? 'suspended' : 'active',
    isFeatured: rest.isFeatured,
    owner: rest.owner,
    imageName: rest.imageName,
    coordinates: rest.coordinates,
    createdAt: new Date(2025, 0, index + 1).toISOString(),
    updatedAt: new Date().toISOString()
  }));

  // Save to localStorage
  storage.setItem('restaurants', JSON.stringify(restaurants));
  storage.setItem('adminDataInitialized', 'true');

  console.log('✅ Admin data initialized with', restaurants.length, 'restaurants!');
  console.log('📋 Restaurants:', restaurants.map(r => `#${r.id} ${r.name} (${r.status})`).join(', '));
};

// Auto-init when imported
if (typeof window !== 'undefined') {
  // Force reinit để cập nhật dữ liệu mới
  initAdminData(localStorage, true);
}

export default initAdminData;
