/**
 * Admin Sync Service
 * Wrapper để đồng bộ Admin Dashboard với json-server API
 */

import {
    fetchRestaurantsFromAPI,
    updateRestaurantStatusAPI,
    syncRestaurantsToLocalStorage
} from './restaurantSyncService.js';

/**
 * Fetch và sync restaurants từ API
 */
export const syncRestaurantsForAdmin = async (storage = localStorage) => {
    const result = await syncRestaurantsToLocalStorage(storage);
    if (result.success) {
        console.log(`✅ Synced ${result.count} restaurants for Admin`);
    } else {
        console.error('❌ Failed to sync restaurants:', result.error);
    }
    return result;
};

/**
 * Update restaurant status và sync
 */
export const updateRestaurantStatusForAdmin = async (restaurantId, status, storage = localStorage) => {
    // Update qua API
    const apiResult = await updateRestaurantStatusAPI(restaurantId, status);

    if (apiResult.success) {
        // Sync lại từ API để đảm bảo consistency
        await syncRestaurantsToLocalStorage(storage);
        return { success: true, restaurant: apiResult.data };
    }

    return { success: false, error: apiResult.error };
};

/**
 * Get restaurants cho Admin (từ localStorage sau khi sync)
 */
export const getRestaurantsForAdmin = (storage = localStorage) => {
    try {
        const cached = storage.getItem('restaurants');
        return cached ? JSON.parse(cached) : [];
    } catch (error) {
        console.error('Failed to get restaurants:', error);
        return [];
    }
};

export default {
    syncRestaurantsForAdmin,
    updateRestaurantStatusForAdmin,
    getRestaurantsForAdmin
};
