import { View, Text, FlatList, Image, StyleSheet, Pressable } from 'react-native'
import { useLocalSearchParams, Link } from 'expo-router'
import { RESTAURANTS } from '@/constants/RestaurantsList'
import { CATEGORIES } from '@/constants/CategoryList'

export default function CategoryScreen() {
  const { key } = useLocalSearchParams()
  const filteredRestaurants = RESTAURANTS.filter(r =>
    Array.isArray(r.category)
      ? r.category.includes(key)
      : r.category === key
  )

  const categoryLabel = CATEGORIES.find(c => c.key === key)?.label || key

  const renderRestaurant = ({ item }) => (
  <View style={styles.restaurantCard}>
    {/* Logo bên trái */}
    <Image source={item.image} style={styles.restaurantImage} />

    {/* Thông tin bên phải */}
    <View style={styles.infoContainer}>
      <Text style={styles.restaurantName}>{item.name}</Text>
      <Text style={styles.restaurantRating}>⭐ {item.rating}</Text>

      <Link href={`/menu/${item.id}`} asChild>
        <Pressable style={styles.menuButton}>
          <Text style={styles.menuButtonText}>Menu</Text>
        </Pressable>
      </Link>
    </View>
  </View>
)



  return (
    <View style={{ flex: 1, backgroundColor: '#f8f8f8', paddingTop: 40 }}>
      <Text style={styles.title}>Danh mục: {categoryLabel}</Text>
      <FlatList
        data={filteredRestaurants}
        renderItem={renderRestaurant}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    marginLeft: 16,
    color: '#00b14f'
  },
  restaurantCard: {
  flexDirection: 'row',
  backgroundColor: '#fff',
  borderRadius: 14,
  padding: 12,
  marginBottom: 16,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 2,
},
restaurantImage: {
  width: 70,
  height: 70,
  borderRadius: 10,
  marginRight: 12,
  resizeMode: 'contain',
},
infoContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center', // căn giữa theo chiều ngang
},
restaurantName: {
  fontWeight: 'bold',
  fontSize: 16,
  color: '#222',
  marginBottom: 4,
  textAlign: 'center',
},
restaurantRating: {
  color: '#444',
  fontSize: 14,
  marginBottom: 8,
},
menuButton: {
  height: 32,
  width: 80,
  borderRadius: 10,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#00b14f',
},
menuButtonText: {
  color: 'white',
  fontSize: 14,
  fontWeight: 'bold',
},
})
