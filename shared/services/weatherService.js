const WEATHER_API_KEY = 'eecff4fe13943fb4eaa7bd78e1bae552';

// Fetch weather data from OpenWeatherMap API
export const fetchWeather = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric&lang=vi`
    );
    
    if (!response.ok) {
      throw new Error('Weather API failed');
    }
    
    const data = await response.json();
    return {
      success: true,
      data: {
        temp: data.main?.temp,
        condition: data.weather?.[0]?.main,
        description: data.weather?.[0]?.description,
        icon: data.weather?.[0]?.icon,
      },
    };
  } catch (error) {
    console.error('Fetch weather error:', error);
    return { success: false, error: error.message };
  }
};

export const getAddressFromCoords = async (lat, lng) => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data && data.display_name) {
      return { success: true, address: data.display_name };
    }
    
    return { success: false, address: `Lat: ${lat}, Lng: ${lng}` };
  } catch (error) {
    console.error('Reverse geocode error:', error);
    return { success: false, address: `Lat: ${lat}, Lng: ${lng}` };
  }
};


 // Tìm kiếm địa chỉ bằng OSM Nominatim 

export const searchAddress = async (searchText) => {
  if (!searchText || !searchText.trim()) {
    return { success: false, error: 'Vui lòng nhập địa chỉ cần tìm' };
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}&limit=5`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        success: true,
        results: data.map(item => ({
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          displayName: item.display_name,
          type: item.type,
          importance: item.importance,
        })),
      };
    }
    
    return { success: false, error: 'Không tìm thấy địa chỉ' };
  } catch (error) {
    console.error('Search address error:', error);
    return { success: false, error: 'Lỗi tìm kiếm địa chỉ' };
  }
};

/**
 * Lấy vị trí hiện tại - Abstract cho cả Web & Mobile
 * @param {object} locationService - expo-location (Mobile) hoặc navigator.geolocation wrapper (Web)
 */
export const getCurrentLocation = async (locationService) => {
  try {
    // Request permission
    const { status } = await locationService.requestPermission();
    if (status !== 'granted') {
      return { success: false, error: 'Không có quyền truy cập vị trí' };
    }

    // Get current position
    const location = await locationService.getCurrentPosition();
    return {
      success: true,
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      },
    };
  } catch (error) {
    console.error('Get location error:', error);
    return { success: false, error: error.message };
  }
};