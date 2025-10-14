const WEATHER_API_KEY = 'eecff4fe13943fb4eaa7bd78e1bae552';

/**
 * ✅ Lấy thông tin thời tiết - Web & Mobile dùng chung
 */
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

/**
 * ✅ Reverse geocoding - Web & Mobile dùng chung
 */
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