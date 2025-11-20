/**
 * Restaurant Sync Service
 * Đồng bộ dữ liệu nhà hàng giữa API (json-server) và localStorage
 */

const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'http://192.168.31.160:3000';

/**
 * Fetch restaurants từ API
 */
export const fetchRestaurantsFromAPI = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/restaurants`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log('✅ Fetched restaurants from API:', data.length);
        return { success: true, data };
    } catch (error) {
        console.error('❌ Failed to fetch restaurants:', error);
        return { success: false, error: error.message, data: [] };
    }
};

/**
 * Update restaurant status qua API
 */
export const updateRestaurantStatusAPI = async (restaurantId, status) => {
    try {
        const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log(`✅ Updated restaurant #${restaurantId} status to ${status}`);
        return { success: true, data };
    } catch (error) {
        console.error(`❌ Failed to update restaurant #${restaurantId}:`, error);
        return { success: false, error: error.message };
    }
};

/**
 * Sync restaurants từ API vào localStorage
 * Dùng cho Web & Admin Dashboard
 */
export const syncRestaurantsToLocalStorage = async (storage = localStorage) => {
    const result = await fetchRestaurantsFromAPI();

    if (result.success && result.data.length > 0) {
        storage.setItem('restaurants', JSON.stringify(result.data));
        console.log('✅ Synced restaurants to localStorage');
        return { success: true, count: result.data.length };
    }

    return { success: false, error: result.error };
};

/**
 * Get restaurants với fallback
 * Ưu tiên API, fallback localStorage
 */
export const getRestaurants = async (storage = localStorage) => {
    // Try API first
    const apiResult = await fetchRestaurantsFromAPI();
    if (apiResult.success && apiResult.data.length > 0) {
        // Cache vào localStorage
        storage.setItem('restaurants', JSON.stringify(apiResult.data));
        return apiResult.data;
    }

    // Fallback localStorage
    console.warn('⚠️ API failed, using localStorage fallback');
    try {
        const cached = storage.getItem('restaurants');
        return cached ? JSON.parse(cached) : [];
    } catch (error) {
        console.error('❌ Failed to parse localStorage:', error);
        return [];
    }
};

/**
 * Update restaurant và sync
 */
export const updateRestaurantStatus = async (restaurantId, status, storage = localStorage) => {
    // Update qua API
    const apiResult = await updateRestaurantStatusAPI(restaurantId, status);

    if (apiResult.success) {
        // Sync lại toàn bộ từ API
        await syncRestaurantsToLocalStorage(storage);
        return { success: true, data: apiResult.data };
    }

    return { success: false, error: apiResult.error };
};

/**
 * Auto-sync mỗi X giây
 */
export const startAutoSync = (intervalMs = 30000, storage = localStorage) => {
    console.log(`🔄 Starting auto-sync every ${intervalMs / 1000}s`);

    // Sync ngay lập tức
    syncRestaurantsToLocalStorage(storage);

    // Sau đó sync định kỳ
    const intervalId = setInterval(() => {
        syncRestaurantsToLocalStorage(storage);
    }, intervalMs);

    // Return function để stop
    return () => {
        console.log('⏹️ Stopping auto-sync');
        clearInterval(intervalId);
    };
};

export default {
    fetchRestaurantsFromAPI,
    updateRestaurantStatusAPI,
    syncRestaurantsToLocalStorage,
    getRestaurants,
    updateRestaurantStatus,
    startAutoSync
};
