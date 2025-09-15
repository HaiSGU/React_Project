import { View, Text, FlatList, Image, StyleSheet, Pressable } from 'react-native'
import { useLocalSearchParams, Link } from 'expo-router'
import { RESTAURANTS } from '@/constants/RestaurantsList'
import { CATEGORIES } from '@/constants/CategoryList'

export default function CategoryScreen() {
  const { key } = useLocalSearchParams()
  const filteredRestaurants = RESTAURANTS.filter(r => r.category === key)

  // Lấy label danh mục từ key
  const categoryLabel = CATEGORIES.find(c => c.key === key)?.label || key

  const renderRestaurant = ({ item }) => (
    <View style={styles.restaurantCard}>
      <Image source={item.image} style={styles.restaurantImage} />
      <Text style={styles.restaurantName}>{item.name}</Text>
      <Text style={styles.restaurantRating}>⭐ {item.rating}</Text>
      <Link href={`/menu/${item.id}`} asChild>
        <Pressable style={styles.menuButton}>
          <Text style={styles.menuButtonText}>Menu</Text>
        </Pressable>
      </Link>
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
  menuButton: {
    height: 36,
    width: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00b14f',
    marginTop: 6,
  },
  menuButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
})