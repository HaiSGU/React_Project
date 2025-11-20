import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Appearance, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from "../constants/Colors";
import { configureCloudSync, syncUsersToStorage } from '@shared/services/cloudSyncService';

// Import LocationProvider
import { LocationProvider } from '@shared/context/LocationContext';

// Địa chỉ IP thực của máy tính trong mạng local
// Thay đổi IP này nếu địa chỉ IP máy tính thay đổi
const LOCAL_IP = '192.168.31.160';

const defaultBaseUrl = Platform.select({
  // Sử dụng IP thực cho cả Android và iOS khi chạy trên thiết bị thật
  // Nếu chạy trên emulator, có thể dùng: http://10.0.2.2:3000 (Android) hoặc http://localhost:3000 (iOS)
  android: `http://${LOCAL_IP}:3000`,
  ios: `http://${LOCAL_IP}:3000`,
  default: `http://${LOCAL_IP}:3000`,
});

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  process.env.EXPO_PUBLIC_API_URL ||
  defaultBaseUrl;

configureCloudSync({
  baseUrl: API_BASE_URL,
});

export default function RootLayout() {
  const colorScheme = Appearance.getColorScheme()

  const theme = colorScheme == 'dark' ? Colors.dark : Colors.light;
  const [loaded] = useFonts({
    SpaceMono: require('@shared/assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    syncUsersToStorage(AsyncStorage).catch((error) =>
      console.error('Initial user sync failed:', error)
    );
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <LocationProvider>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{
          headerStyle: { backgroundColor: theme.headerBackground },
          headerTintColor: theme.text,
          headerShadowVisible: false
        }}>
          <Stack.Screen name="index" options={{ headerShown: false, title: 'Home' }} />
          <Stack.Screen name="menu" options={{ headerShown: false, title: 'Menu', headerTitle: 'FoodFast Menu' }} />
          <Stack.Screen name="contact" options={{ headerShown: false, title: 'Contact', headerTitle: 'Contact Us' }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Home' }} />

          {/* Thêm các màn hình mới */}
          <Stack.Screen name="login" options={{ title: 'Đăng nhập' }} />
          <Stack.Screen name="register" options={{ title: 'Đăng ký' }} />
          <Stack.Screen name="checkout" options={{ title: 'Thanh toán' }} />
          <Stack.Screen name="map-select" options={{ title: 'Chọn vị trí giao hàng' }} />
          <Stack.Screen name="order-detail" options={{ title: 'Chi tiết đơn hàng' }} />

          <Stack.Screen name="+not-found" />
        </Stack>
      </SafeAreaProvider>
    </LocationProvider>
  );
}
