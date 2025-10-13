import { View, Text, FlatList, Image, StyleSheet, Pressable } from 'react-native'
import { useLocalSearchParams, Link } from 'expo-router'

import { DISCOUNTS } from '@shared/constants/DiscountList'
import { RESTAURANTS } from '@shared/constants/RestaurantsList'
import colors from '@shared/theme/colors'

export default function DiscountDetail() {
  const { type } = useLocalSearchParams()
  const discount = DISCOUNTS.find(d => d.type === type)

  if (!discount) {
    return <Text>Không tìm thấy mã giảm giá</Text>
  }

  // Lọc nhà hàng áp dụng discount này
  const appliedRestaurants = RESTAURANTS.filter(r => discount.restaurants.includes(r.id))

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>
        {discount.label} áp dụng cho:
      </Text>

      <FlatList
        data={appliedRestaurants}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.rating}>⭐ {item.rating}</Text>

              {/* Nút Menu dẫn sang menu/[id].jsx */}
              <Link href={`/menu/${item.id}`} asChild>
                <Pressable style={styles.menuBtn}>
                  <Text style={styles.menuText}>Menu</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rating: {
    color: '#666',
    marginBottom: 8,
  },
  menuBtn: {
    backgroundColor: '#3dd9eaff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  menuText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})
