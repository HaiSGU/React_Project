import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentLocation = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // Kiểm tra quyền truy cập vị trí
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Quyền truy cập vị trí bị từ chối!');
        Alert.alert(
          'Quyền truy cập vị trí',
          'Ứng dụng cần quyền truy cập vị trí để hiển thị nhà hàng gần nhất. Vui lòng cấp quyền trong cài đặt.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Lấy vị trí hiện tại
      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        maximumAge: 10000, // Cache 10 giây
      });

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy,
      });

    } catch (error) {
      setErrorMsg('Không thể lấy vị trí: ' + error.message);
      console.error('Location error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Tự động lấy vị trí khi component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return {
    location,
    errorMsg,
    isLoading,
    getCurrentLocation,
  };
};

// Hàm tính khoảng cách giữa 2 điểm GPS (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Khoảng cách tính bằng km
  return distance;
};

// Hàm sắp xếp nhà hàng theo khoảng cách
export const sortRestaurantsByDistance = (restaurants, userLocation) => {
  if (!userLocation) return restaurants;

  return restaurants.map(restaurant => {
    if (!restaurant.coordinates) return { ...restaurant, distance: null };
    
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      restaurant.coordinates.latitude,
      restaurant.coordinates.longitude
    );
    
    return { ...restaurant, distance };
  }).sort((a, b) => {
    if (a.distance === null) return 1;
    if (b.distance === null) return -1;
    return a.distance - b.distance;
  });
};

