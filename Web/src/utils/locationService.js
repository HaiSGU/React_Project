/**
 * Location service wrapper cho Web
 * Tương thích với interface của weatherService
 */

export const locationService = {
  requestPermission: async () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ status: 'unavailable' });
        return;
      }

      // Web không có API để request permission trực tiếp
      // Permission sẽ được hỏi khi gọi getCurrentPosition
      resolve({ status: 'granted' });
    });
  },

  getCurrentPosition: async () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation không được hỗ trợ'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            },
          });
        },
        (error) => {
          let errorMessage = 'Không thể lấy vị trí';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Người dùng từ chối quyền truy cập vị trí';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Thông tin vị trí không khả dụng';
              break;
            case error.TIMEOUT:
              errorMessage = 'Yêu cầu lấy vị trí quá thời gian';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    });
  },
};
