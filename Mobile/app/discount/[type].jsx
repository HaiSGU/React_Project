import { View, Text, FlatList, Image, StyleSheet, Pressable } from 'react-native'
import { useLocalSearchParams, Link, Stack } from 'expo-router'

import { DISCOUNTS } from '@shared/constants/DiscountList'
import { RESTAURANTS } from '@shared/constants/RestaurantsList'
import { getDiscountByType, filterRestaurantsByDiscount } from '@shared/utils/restaurantHelpers'
import colors from '@shared/theme/colors'

export default function DiscountDetail() {
  const { type } = useLocalSearchParams()
  
  //  Dùng helper function từ shared
  const discount = getDiscountByType(DISCOUNTS, type)

  if (!discount) {
    return (
      <>
        <Stack.Screen 
          options={{
            title: 'Mã giảm giá',
            headerShown: true,
          }} 
        />
        <View style={styles.container}>
          <Text style={styles.errorText}>Không tìm thấy mã giảm giá</Text>
        </View>
      </>
    )
  }

  //  Dùng helper function từ shared
  const appliedRestaurants = filterRestaurantsByDiscount(RESTAURANTS, discount.restaurants)

  return (
    <>
      <Stack.Screen 
        options={{
          title: discount.label,
          headerShown: true,
        }} 
      />
      <View style={styles.container}>
        <FlatList
          data={appliedRestaurants}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.rating}>⭐ {item.rating}</Text>

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
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: colors.primary,
  },
  errorText: {
    fontSize: 16,
    color: colors.danger,
    textAlign: 'center',
    marginTop: 20,
  },
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
  infoContainer: {
    flex: 1,
    alignItems: 'center',
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
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  menuText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})
