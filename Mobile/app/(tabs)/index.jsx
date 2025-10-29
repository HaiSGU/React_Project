import 'react-native-reanimated';
import { View, Text, StyleSheet, FlatList, ImageBackground, Image, Pressable, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Link, useRouter, useFocusEffect, useLocalSearchParams, Stack } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { RESTAURANTS } from '@shared/constants/RestaurantsList'
import { CATEGORIES } from '@shared/constants/CategoryList'
import { DISCOUNTS } from '@shared/constants/DiscountList'
import { MENU_ITEMS } from '@shared/constants/MenuItems'
import { isLoggedIn, getCurrentUser, logout } from '@shared/services/authService'
import { useRestaurantSearch } from '@shared/hooks/useSearch'
import SearchBar from '../../components/SearchBar'
import ShipperImg from "@shared/assets/images/shipperimage.jpeg"
import colors from '@shared/theme/colors'

const App = () => {
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const params = useLocalSearchParams()

  // Search functionality - tìm nhà hàng theo tên, địa chỉ, category VÀ món ăn
  const { 
    query, 
    setQuery, 
    filteredRestaurants, 
    noResults 
  } = useRestaurantSearch(RESTAURANTS, MENU_ITEMS)

  // Hiển thị kết quả search hoặc featured restaurants
  const displayRestaurants = query.trim() ? filteredRestaurants : RESTAURANTS.filter(r => r.isFeatured)

  useFocusEffect(
    React.useCallback(() => {
      const loadLoginStatus = async () => {
        //  Dùng shared service
        const loggedInStatus = await isLoggedIn(AsyncStorage)
        setLoggedIn(loggedInStatus)
        
        if (loggedInStatus) {
          const user = await getCurrentUser(AsyncStorage)
          setUserInfo(user)
        }
      }
      loadLoginStatus()
    }, [])
  )

  const handleLogout = async () => {
    //  Dùng shared service
    await logout(AsyncStorage)
    setLoggedIn(false)
    setUserInfo(null)
    router.replace('/')
  }

  const handleLogin = () => {
    router.push('/login')
  }

  const renderRestaurant = ({ item }) => (
    <View style={style.restaurantCard}>
      <Image source={item.image} style={style.restaurantImage} />
      <Text style={style.restaurantName}>{item.name}</Text>
      <Text style={style.restaurantRating}>⭐ {item.rating}</Text>
      <Link href={`/menu/${item.id}`} asChild>
        <Pressable style={style.menuButton}>
          <Text style={style.menuButtonText}>Menu</Text>
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
    <>
      <Stack.Screen 
        options={{
          title: 'Home',
          headerShown: false, // Giữ header ẩn vì đã có custom headerBar
        }} 
      />
      <View style={style.container}>
        {/* Thanh chào + đăng nhập/đăng xuất */}
        <View style={style.headerBar}>
          <Text style={style.headerText}>
            {loggedIn ? `👋 Xin chào ${userInfo?.username || 'bạn'}, hôm nay ăn gì nè?` : 'Chào mừng bạn đến với FoodFast'}
          </Text>
          <Pressable onPress={loggedIn ? handleLogout : handleLogin} style={[style.button, loggedIn ? style.logoutBtn : style.loginBtn]}>
            <Text style={style.buttonText}>{loggedIn ? 'Đăng xuất' : 'Đăng nhập'}</Text>
          </Pressable>
        </View>

        {/* Nội dung chính */}
        <ImageBackground source={ShipperImg} style={style.image}>
        <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
          <Text style={style.title}>FoodFast</Text>

          {/* Search Bar */}
          <SearchBar
            value={query}
            onChangeText={setQuery}
            onClear={() => setQuery('')}
            placeholder="Tìm nhà hàng, món ăn..."
          />

          {/* Hiển thị số kết quả search */}
          {query.trim() !== '' && (
            <View style={style.searchResultHeader}>
              <Text style={style.searchResultText}>
                {noResults 
                  ? 'Không tìm thấy kết quả' 
                  : `Tìm thấy ${filteredRestaurants.length} nhà hàng`}
              </Text>
            </View>
          )}

          {/* Danh mục - Ẩn khi đang search */}
          {!query.trim() && (
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
          )}

          {/* Mã giảm giá - Ẩn khi đang search */}
          {!query.trim() && (
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
          )}

          {/* Nhà hàng (kết quả search hoặc featured) */}
          <View style={{ marginBottom: 40 }}>
            <Text style={style.sectionTitle}>
              {query.trim() ? '🔍 Kết quả tìm kiếm' : '⭐ Nhà hàng nổi bật'}
            </Text>
            {displayRestaurants.length > 0 ? (
              <FlatList
                data={displayRestaurants}
                renderItem={renderRestaurant}
                keyExtractor={item => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
              />
            ) : (
              <View style={style.emptyContainer}>
                <Text style={style.emptyText}>
                  {noResults ? '😔 Không tìm thấy nhà hàng phù hợp' : 'Chưa có nhà hàng'}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
      </View>
    </>
  )
}

export default App

const style = StyleSheet.create({
  container: { flex: 1 },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.primary,
  },
  headerText: { fontSize: 16, fontWeight: '600', color: colors.textWhite, flex: 1 },
  image: { width: '100%', height: '100%', flex: 1 },
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
  categorySection: { marginBottom: 24 },
  categoryButton: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    marginRight: 16,
    paddingVertical: 12,
    paddingHorizontal: 18,
    elevation: 2,
    minWidth: 90,
  },
  categoryIcon: { width: 32, height: 32, marginBottom: 6 },
  categoryText: { color: colors.primary, fontWeight: 'bold', fontSize: 15 },
  restaurantCard: {
    width: 140,
    marginRight: 16,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 14,
    alignItems: 'center',
    padding: 8,
    elevation: 2,
  },
  restaurantImage: { width: 90, height: 70, borderRadius: 10, marginBottom: 6 },
  restaurantName: { fontWeight: 'bold', fontSize: 15, color: colors.text },
  restaurantRating: { color: colors.primary, fontSize: 13, marginTop: 2, marginBottom: 8 },
  button: {
    height: 40,
    width: 90,
    borderRadius: 14,
    justifyContent: 'center',
    padding: 6,
  },
  loginBtn: { backgroundColor: '#222' },
  logoutBtn: { backgroundColor: colors.danger },
  buttonText: { color: 'white', fontSize: 15, textAlign: 'center', fontWeight: 'bold' },
  discountButton: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginRight: 16,
    paddingVertical: 12,
    paddingHorizontal: 18,
    elevation: 2,
    minWidth: 90,
  },
  discountText: { color: colors.primary, fontWeight: 'bold', fontSize: 15 },
  menuButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  menuButtonText: {
    color: colors.textWhite,
    fontSize: 15,
    fontWeight: 'bold',
  },
  searchResultHeader: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  searchResultText: {
    color: colors.textWhite,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    color: colors.textWhite,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
})
