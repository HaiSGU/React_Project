/**
 * Tracking Service - Simulate shipper movement over 1 minute
 * Shared between Web and Mobile
 */

/**
 * Generate waypoints from restaurant to delivery location
 * Using simple linear interpolation with some variation
 */
export const generateShipperRoute = (restaurantLat, restaurantLng, deliveryLat, deliveryLng, steps = 20) => {
    const waypoints = [];

    for (let i = 0; i <= steps; i++) {
        const progress = i / steps;

        // Add some randomness to make path more realistic
        const randomOffset = (Math.random() - 0.5) * 0.001;

        const lat = restaurantLat + (deliveryLat - restaurantLat) * progress + randomOffset;
        const lng = restaurantLng + (deliveryLng - restaurantLng) * progress + randomOffset;

        waypoints.push({
            latitude: lat,
            longitude: lng,
            timestamp: Date.now() + (i * (60000 / steps)), // 1 minute = 60000ms
        });
    }

    return waypoints;
};

/**
 * Get current shipper position based on elapsed time
 * @param {Array} waypoints - Route waypoints
 * @param {number} startTime - Order shipping start time
 * @returns {Object} Current position and progress
 */
export const getCurrentShipperPosition = (waypoints, startTime) => {
    if (!waypoints || waypoints.length === 0) {
        return null;
    }

    const now = Date.now();
    const elapsed = now - startTime;
    const totalDuration = 60000; // 1 minute

    // If completed
    if (elapsed >= totalDuration) {
        return {
            position: waypoints[waypoints.length - 1],
            progress: 100,
            estimatedTime: 0,
            status: 'completed'
        };
    }

    // Calculate current position
    const progress = (elapsed / totalDuration) * 100;
    const currentIndex = Math.floor((waypoints.length - 1) * (elapsed / totalDuration));

    return {
        position: waypoints[currentIndex] || waypoints[0],
        progress: Math.min(progress, 100),
        estimatedTime: Math.max(0, Math.ceil((totalDuration - elapsed) / 1000)), // seconds
        status: 'shipping'
    };
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance; // km
};

/**
 * Format time remaining
 */
export const formatTimeRemaining = (seconds) => {
    if (seconds <= 0) return 'Đã đến nơi';

    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    if (minutes > 0) {
        return `${minutes} phút ${secs} giây`;
    }
    return `${secs} giây`;
};
