import { View, Text, FlatList, Image, StyleSheet, Pressable } from 'react-native'
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { MENU_ITEMS_RESOLVED } from '@shared/constants/MenuItemsList' // ← DÙNG RESOLVED (có require())
import { RESTAURANTS } from '@shared/constants/RestaurantsList'
import { useQuantities } from '@shared/hooks/useQuantities'
import colors from '@shared/theme/colors'

export default function MenuScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const restaurantId = parseInt(id)

  // ✅ Filter menu theo restaurantId
  const menuForRestaurant = MENU_ITEMS_RESOLVED.filter((item) => {
    if (Array.isArray(item.restaurantId)) {
      return item.restaurantId.includes(restaurantId)
    }
    return item.restaurantId === restaurantId
  })
  
  // Lấy tên restaurant để hiển thị header
  const restaurant = RESTAURANTS.find(r => r.id === restaurantId)
  const restaurantName = restaurant ? restaurant.name : 'Menu'

  // ✅ Dùng custom hook
  const { quantities, increase, decrease, totalPrice, cartItems } = useQuantities(menuForRestaurant)

  const separatorComp = <View style={styles.separator} />
  const footerComp = <Text style={styles.footerText}>End of Menu</Text>

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f8f8' }} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: restaurantName,
          headerShown: true,
          headerBackTitle: '',
        }} 
      />
      <View style={{ flex: 1 }}>
        <FlatList
          data={menuForRestaurant}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          ItemSeparatorComponent={separatorComp}
          ListFooterComponent={footerComp}
          ListFooterComponentStyle={styles.footerComp}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Menu đang cập nhật...</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.image && (
                <Image
                  source={item.image} // ← ĐÃ LÀ require(), không cần { uri: ... }
                  style={styles.menuImage}
                  resizeMode="cover"
                />
              )}
              <View style={styles.menuInfo}>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                <Text style={styles.menuItemText} numberOfLines={2}>
                  {item.description}
                </Text>
                <View style={styles.rowBetween}>
                  <Text style={styles.priceText}>
                    {item.price.toLocaleString()} đ
                  </Text>
                  <Text style={styles.ratingText}>
                    ⭐ {item.rating || 4.5} | Đã bán: {item.sold || 100}
                  </Text>
                </View>
                <View style={styles.actionRow}>
                  <Pressable 
                    onPress={() => decrease(item.id)} 
                    style={styles.qtyButton}
                  >
                    <Text style={styles.qtyText}>-</Text>
                  </Pressable>
                  <Text style={styles.qtyNumber}>
                    {quantities[item.id] || 0}
                  </Text>
                  <Pressable 
                    onPress={() => increase(item.id)} 
                    style={styles.qtyButton}
                  >
                    <Text style={styles.qtyText}>+</Text>
                  </Pressable>
                </View>
              </View>
              {item.discount && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>-{item.discount}%</Text>
                </View>
              )}
            </View>
          )}
        />

        {totalPrice > 0 && (
          <Pressable
            style={styles.checkoutBar}
            onPress={() =>
              router.push({
                pathname: "/checkout",
                params: { cart: JSON.stringify(cartItems) },
              })
            }
          >
            <Text style={styles.checkoutText}>
              Tổng cộng: {totalPrice.toLocaleString()} đ
            </Text>
            <Text style={styles.checkoutAction}>Thanh toán ➜</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 80,
    paddingHorizontal: 12,
    backgroundColor: '#f8f8f8',
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    width: '50%',
    maxWidth: 300,
    marginHorizontal: 'auto',
    marginBottom: 10,
  },
  footerComp: {
    marginHorizontal: 'auto'
  },
  footerText: {
    color: colors.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  menuImage: {
    width: 110,
    height: 110,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  menuInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  menuItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  menuItemText: {
    color: colors.text,
    fontSize: 13,
    marginBottom: 6,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  priceText: {
    color: colors.danger,
    fontWeight: 'bold',
    fontSize: 16,
  },
  ratingText: {
    color: '#888',
    fontSize: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  qtyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  qtyNumber: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'center',
    color: colors.text,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.danger,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  checkoutText: {
    color: colors.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutAction: {
    color: colors.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
})
