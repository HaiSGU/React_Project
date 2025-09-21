import { View, Text, StyleSheet, FlatList, ImageBackground, Image, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Link, useRouter, useFocusEffect } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { RESTAURANTS } from '@/constants/RestaurantsList'
import { CATEGORIES } from '@/constants/CategoryList'
import { DISCOUNTS } from '@/constants/DiscountList'
import { useLocation, sortRestaurantsByDistance } from '@/components/LocationService'
import { useNotifications, sendNearbyRestaurantNotification } from '@/components/NotificationService'
import ShipperImg from "../assets/images/shipperimage.jpeg"

const App = () => {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [nearbyRestaurants, setNearbyRestaurants] = useState([])
  const [showNearby, setShowNearby] = useState(false)
  
  // GPS và Notifications
  const { location, errorMsg, isLoading, getCurrentLocation } = useLocation()
  const { sendNearbyRestaurantNotification } = useNotifications()

  // Lắng nghe khi focus vào trang để cập nhật trạng thái đăng nhập
  useFocusEffect(
    React.useCallback(() => {
      const loadLoginStatus = async () => {
        const isLoggedInValue = await AsyncStorage.getItem('isLoggedIn')
        const userInfoValue = await AsyncStorage.getItem('userInfo')
        
        setIsLoggedIn(isLoggedInValue === 'true')
        if (userInfoValue) {
          setUserInfo(JSON.parse(userInfoValue))
        }
      }
      loadLoginStatus()
    }, [])
  )

  // Xử lý GPS và sắp xếp nhà hàng theo khoảng cách
  useEffect(() => {
    if (location) {
      const sortedRestaurants = sortRestaurantsByDistance(RESTAURANTS, location)
      setNearbyRestaurants(sortedRestaurants)
      
      // Gửi thông báo nhà hàng gần nhất (chỉ 1 lần)
      if (sortedRestaurants.length > 0 && sortedRestaurants[0].distance) {
        const nearestRestaurant = sortedRestaurants[0]
        if (nearestRestaurant.distance < 2) { // Trong vòng 2km
          sendNearbyRestaurantNotification(
            nearestRestaurant.name, 
            nearestRestaurant.distance
          )
        }
      }
    }
  }, [location, sendNearbyRestaurantNotification])

  // Xử lý lỗi GPS
  useEffect(() => {
    if (errorMsg) {
      Alert.alert('Lỗi vị trí', errorMsg)
    }
  }, [errorMsg])

  const renderRestaurant = ({ item }) => (
    <View style={style.restaurantCard}>
      <Image source={item.image} style={style.restaurantImage} />
      <Text style={style.restaurantName}>{item.name}</Text>
      <Text style={style.restaurantRating}>⭐ {item.rating}</Text>
      {item.distance && (
        <Text style={style.restaurantDistance}>
          📍 {item.distance.toFixed(1)}km
        </Text>
      )}
      <Link href={`/menu/${item.id}`} asChild>
        <Pressable style={style.button}>
          <Text style={style.buttonText}>Menu</Text>
        </Pressable>
      </Link>
    </View>
  )

  const renderCategory = ({ item }) => (
    <Link href={`/category/${item.key}`} asChild>
      <Pressable style={style.categoryButton}>
        <Image source={item.icon} style={style.categoryIcon} />
        <Text style={style.categoryText}>{item.label}</Text>
      </Pressable>
    </Link>
  )

  const renderDiscount = ({ item }) => (
    <Link href={`/discount/${item.type}`} asChild>
      <Pressable style={style.discountButton}>
        <Text style={style.discountText}>{item.label}</Text>
      </Pressable>
    </Link>
  )

  // Xử lý đăng xuất
  const handleLogout = async () => {
    await AsyncStorage.removeItem('isLoggedIn')
    await AsyncStorage.removeItem('userInfo')
    setIsLoggedIn(false)
    setUserInfo(null)
    router.replace('/login')
  }

  // Chuyển hướng đến trang đăng nhập
  const handleLogin = () => {
    router.push('/login')
  }

  return (
    <View style={style.container}>
      {/* Thanh chào + đăng nhập/đăng xuất */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: '#00b14f' // xanh lá đặc trưng
          }}>
            {/* Greeting (hiện khi login) */}
            {isLoggedIn ? (
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
                👋 Xin chào {userInfo?.username || 'bạn'}, hôm nay ăn gì nè?
              </Text>
            ) : (
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
                Chào mừng bạn đến với FoodFast
              </Text>
            )}

            {/* Button login/logout */}
            {isLoggedIn ? (
              <Pressable onPress={handleLogout} style={[style.button, { width: 90, backgroundColor: '#e53935' }]}>
                <Text style={style.buttonText}>Đăng xuất</Text>
              </Pressable>
            ) : (
              <Pressable onPress={handleLogin} style={[style.button, { width: 90, backgroundColor: '#222' }]}>
                <Text style={style.buttonText}>Đăng nhập</Text>
              </Pressable>
            )}
          </View>

      {/* Bọc toàn bộ phần nội dung bên trong ScrollView */}
      <ImageBackground source={ShipperImg} style={style.image}>
        <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
          <Text style={style.title}>FoodFast</Text>

          {/* Danh mục */}
          <View style={style.categorySection}>
            <Text style={style.sectionTitle}>Danh mục</Text>
            <FlatList
              data={CATEGORIES.filter(c => c.key !== 'all')}
              renderItem={renderCategory}
              keyExtractor={item => item.key}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
            />
          </View>

          {/* Mã giảm giá */}
          <View style={{ marginBottom: 24 }}>
            <Text style={style.sectionTitle}>Chương trình giảm giá</Text>
            <FlatList
            data={DISCOUNTS}
            renderItem={renderDiscount}
            keyExtractor={item => item.type}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            />
            </View>

          

          {/* Nhà hàng nổi bật / Gần nhất */}
          <View style={{ marginBottom: 40 }}>
            <View style={style.sectionHeader}>
              <Text style={style.sectionTitle}>
                {showNearby ? '📍 Nhà hàng gần nhất' : '⭐ Nhà hàng nổi bật'}
              </Text>
              {location && (
                <Pressable 
                  style={style.toggleButton}
                  onPress={() => setShowNearby(!showNearby)}
                >
                  <Text style={style.toggleButtonText}>
                    {showNearby ? 'Nổi bật' : 'Gần nhất'}
                  </Text>
                </Pressable>
              )}
            </View>
            
            {isLoading ? (
              <View style={style.loadingContainer}>
                <ActivityIndicator size="large" color="#00b14f" />
                <Text style={style.loadingText}>Đang tìm vị trí...</Text>
              </View>
            ) : (
              <FlatList
                data={showNearby && nearbyRestaurants.length > 0 
                  ? nearbyRestaurants.slice(0, 10) // Top 10 gần nhất
                  : RESTAURANTS.filter(r => r.isFeatured)
                } 
                renderItem={renderRestaurant}
                keyExtractor={item => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
              />
            )}
          </View>

          <Link href="/contact" style={{ marginHorizontal: 'auto' }} asChild>
            <Pressable style={style.button}>
              <Text style={style.buttonText}>Contact Us</Text>
            </Pressable>
          </Link>
        </ScrollView>
      </ImageBackground>
    </View>
  )
}

export default App

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 42,
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginBottom: 40,
    marginTop: 30,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 16,
    paddingVertical: 12,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 90,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    marginBottom: 6,
  },
  categoryText: {
    color: '#00b14f',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  restaurantCard: {
    width: 140,
    marginRight: 16,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 14,
    alignItems: 'center',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  restaurantImage: {
    width: 90,
    height: 70,
    borderRadius: 10,
    marginBottom: 6,
  },
  restaurantName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
    textAlign: 'center',
  },
  restaurantRating: {
    color: '#00b14f',
    fontSize: 13,
    marginTop: 2,
    marginBottom: 8,
  },
  button: {
    height: 40,
    width: 90,
    borderRadius: 14,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: 6,
    marginTop: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 2,
  },
  discountButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 16,
    paddingVertical: 12,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 90,
  },
  discountText: {
    color: '#00b14f',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 16,
    marginBottom: 10,
  },
  toggleButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 16,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  restaurantDistance: {
    color: '#666',
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
})