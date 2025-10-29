import { View, Text, FlatList, Image, StyleSheet, Pressable } from 'react-native'
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { MENU_ITEMS } from '@shared/constants/MenuItems'
import { RESTAURANTS } from '@shared/constants/RestaurantsList'
import { useQuantities } from '@shared/hooks/useQuantities'
import { filterMenuByRestaurant } from '@shared/utils/restaurantHelpers'
import colors from '@shared/theme/colors'

export default function MenuScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const restaurantId = parseInt(id)

  // ✅ Dùng helper function từ shared
  const menuForRestaurant = filterMenuByRestaurant(MENU_ITEMS, restaurantId)
  
  // Lấy tên restaurant để hiển thị header
  const restaurant = RESTAURANTS.find(r => r.id === restaurantId)
  const restaurantName = restaurant ? restaurant.name : 'Menu'

  // ✅ Dùng custom hook từ shared (Web cũng dùng được!)
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
          ListEmptyComponent={<Text>No items</Text>}
          renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={item.image}
              style={styles.menuImage}
              resizeMode="cover"
            />
            <View style={styles.menuInfo}>
              <Text style={styles.menuItemTitle}>{item.title}</Text>
              <Text style={styles.menuItemText}>{item.description}</Text>
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
  },
  menuItemText: {
    color: colors.text,
    fontSize: 13,
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
    fontSize: 13,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  qtyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  qtyNumber: {
    fontSize: 16,
    minWidth: 24,
    textAlign: 'center',
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
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
