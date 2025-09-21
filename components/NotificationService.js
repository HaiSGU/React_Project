import React, { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Cấu hình notification
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // Listener cho notification khi app đang mở
    const notificationSubscription = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // Listener cho notification khi user tap vào
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      notificationSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  return {
    expoPushToken,
    notification,
    sendLocalNotification,
    scheduleOrderNotification,
  };
};

// Đăng ký push notification
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#00b14f',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo push token:', token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

// Gửi local notification
export const sendLocalNotification = async (title, body, data = {}) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: 'default',
    },
    trigger: null, // Gửi ngay lập tức
  });
};

// Lên lịch thông báo đơn hàng
export const scheduleOrderNotification = async (orderId, estimatedTime) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🍕 Đơn hàng của bạn đã được xác nhận!',
      body: `Đơn hàng #${orderId} sẽ được giao trong ${estimatedTime} phút`,
      data: { orderId, type: 'order_confirmation' },
      sound: 'default',
    },
    trigger: null,
  });

  // Thông báo khi đơn hàng đang được chuẩn bị
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '👨‍🍳 Đơn hàng đang được chuẩn bị',
      body: `Đơn hàng #${orderId} đang được chuẩn bị tại nhà hàng`,
      data: { orderId, type: 'order_preparing' },
      sound: 'default',
    },
    trigger: { seconds: 300 }, // 5 phút sau
  });

  // Thông báo khi tài xế đang giao hàng
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🚚 Tài xế đang giao hàng',
      body: `Tài xế đã nhận đơn hàng #${orderId} và đang trên đường đến`,
      data: { orderId, type: 'order_delivering' },
      sound: 'default',
    },
    trigger: { seconds: 600 }, // 10 phút sau
  });

  // Thông báo khi giao hàng thành công
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '✅ Giao hàng thành công!',
      body: `Đơn hàng #${orderId} đã được giao thành công. Cảm ơn bạn!`,
      data: { orderId, type: 'order_delivered' },
      sound: 'default',
    },
    trigger: { seconds: 1200 }, // 20 phút sau
  });
};

// Thông báo khuyến mãi
export const sendPromotionNotification = async (title, message) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `🎉 ${title}`,
      body: message,
      data: { type: 'promotion' },
      sound: 'default',
    },
    trigger: null,
  });
};

// Thông báo nhà hàng gần nhất
export const sendNearbyRestaurantNotification = async (restaurantName, distance) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '📍 Nhà hàng gần bạn',
      body: `${restaurantName} chỉ cách bạn ${distance.toFixed(1)}km`,
      data: { type: 'nearby_restaurant', restaurantName },
      sound: 'default',
    },
    trigger: null,
  });
};

