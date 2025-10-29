import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Appearance } from 'react-native';
import { Colors } from "../constants/Colors";

// Import LocationProvider
import { LocationProvider } from '@shared/context/LocationContext';

export default function RootLayout() {
  const colorScheme = Appearance.getColorScheme()

  const theme = colorScheme == 'dark' ? Colors.dark : Colors.light;
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

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
