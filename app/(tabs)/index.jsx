import 'react-native-reanimated';
import { View, Text, StyleSheet, FlatList, ImageBackground, Image, Pressable, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Link, useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { RESTAURANTS } from '@/constants/RestaurantsList'
import { CATEGORIES } from '@/constants/CategoryList'
import { DISCOUNTS } from '@/constants/DiscountList'
import ShipperImg from "@/assets/images/shipperimage.jpeg"

const App = () => {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const params = useLocalSearchParams()

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

  useEffect(() => {
    AsyncStorage.getItem('isLoggedIn').then(val => {
      setIsLoggedIn(val === 'true')
    })
  }, [])

  // Xử lý đăng xuất
  const handleLogout = async () => {
    await AsyncStorage.removeItem('isLoggedIn')
    await AsyncStorage.removeItem('userInfo')
    setIsLoggedIn(false)
    setUserInfo(null)
    router.replace('/')
  }

  // Chuyển hướng đến trang đăng nhập
  const handleLogin = () => {
    router.push('/login')
  }

  // Nếu vừa đăng nhập từ login, chỉ ở lại trang chủ
  useEffect(() => {
    if (params?.redirect === 'home') {
      // Không làm gì, ở lại trang chủ
    }
  }, [params])

  const renderRestaurant = ({ item }) => (
    <View style={style.restaurantCard}>
      <Image source={item.image} style={style.restaurantImage} />
      <Text style={style.restaurantName}>{item.name}</Text>
      <Text style={style.restaurantRating}>⭐ {item.rating}</Text>
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

  return (
    <View style={style.container}>
      {/* Thanh chào + đăng nhập/đăng xuất */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#3dd9eaff'
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

      {/* Nội dung chính */}
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

          {/* Nhà hàng nổi bật */}
          <View style={{ marginBottom: 40 }}>
            <View style={style.sectionHeader}>
              <Text style={style.sectionTitle}>⭐ Nhà hàng nổi bật</Text>
            </View>
            <FlatList
              data={RESTAURANTS.filter(r => r.isFeatured)}
              renderItem={renderRestaurant}
              keyExtractor={item => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
          </View>

          

          
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
    color: '#3dd9eaff',
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
    color: '#3dd9eaff',
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
    color: '#3dd9eaff',
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
})
