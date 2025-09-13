import { View, Text, StyleSheet, FlatList, ImageBackground, Image, Pressable } from 'react-native'
import React from 'react'
import {Link} from 'expo-router'
import { RESTAURANTS } from '@/constants/RestaurantsList'
import ShipperImg from "@assets/images/shipperimage.jpeg"

const app = () => {
   // Hàm render từng nhà hàng
  const renderRestaurant = ({ item }) => (
    <View style={style.restaurantCard}>
      <Image source={item.image} style={style.restaurantImage} />
      <Text style={style.restaurantName}>{item.name}</Text>
      <Text style={style.restaurantRating}>⭐ {item.rating}</Text>
      {/* Nút Menu cho từng nhà hàng */}
      <Link href={`/menu/${item.id}`} asChild>
        <Pressable style={style.button}>
          <Text style={style.buttonText}>Menu</Text>
        </Pressable>
      </Link>
    </View>
  );

  return (
    <View style={style.container}>
      <ImageBackground
        source={ShipperImg}
        resizeMode="cover"
        style={style.image}
      >
        <Text style={style.title}>FoodFast</Text>

        {/* Danh sách nhà hàng cuộn ngang */}
        <View style={{ marginBottom: 40 }}>
          <Text style={style.sectionTitle}>Nhà hàng nổi bật</Text>
          <FlatList
            data={RESTAURANTS}
            renderItem={renderRestaurant}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          />
        </View>

        {/* Nếu muốn giữ nút Contact Us ở ngoài */}
        <Link href="/contact" style={{ marginHorizontal: 'auto' }} asChild>
          <Pressable style={style.button}>
            <Text style={style.buttonText}>Contact Us</Text>
          </Pressable>
        </Link>

      </ImageBackground>
    </View>
  )
}

export default app

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
  }
})