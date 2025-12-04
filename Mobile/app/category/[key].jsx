import { View, Text, FlatList, Image, StyleSheet, Pressable, ScrollView } from 'react-native'
import { useLocalSearchParams, Link, Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { RESTAURANTS } from '@shared/constants/RestaurantsList'
import { CATEGORIES } from '@shared/constants/CategoryList'
import { filterRestaurantsByCategory, getCategoryLabel } from '@shared/utils/restaurantHelpers'
import colors from '@shared/theme/colors'

export default function CategoryScreen() {
  const { key } = useLocalSearchParams()

  //  Dùng helper function từ shared
  const filteredRestaurants = filterRestaurantsByCategory(RESTAURANTS, key)
  const categoryLabel = getCategoryLabel(CATEGORIES, key)

  const renderRestaurant = ({ item }) => {
    // Nếu không có trường status, mặc định là 'active'
    const isActive = !item.status || item.status === 'active';
    // Nếu không active, hiển thị label trạng thái
    let statusLabel = null;
    if (!isActive) {
      if (item.status === 'suspended') statusLabel = 'Tạm ngưng';
      else if (item.status === 'pending') statusLabel = 'Chờ duyệt';
      else statusLabel = 'Đóng cửa';
    }

    return (
      <View style={[styles.restaurantCard, !isActive && { opacity: 0.7 }]}>
        <View>
          <Image source={item.image} style={styles.restaurantImage} />
          {!isActive && (
            <View style={styles.statusOverlay}>
              <Text style={styles.statusText}>{statusLabel}</Text>
            </View>
          )}
        </View>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <Text style={styles.restaurantRating}>⭐ {item.rating}</Text>
        <Link href={isActive ? `/menu/${item.id}` : '#'} asChild>
          <Pressable
            style={[styles.menuButton, !isActive && { backgroundColor: '#ccc' }]}
            disabled={!isActive}
          >
            <Text style={styles.menuButtonText}>{isActive ? 'Menu' : 'Đóng'}</Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f8f8' }} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: categoryLabel || 'Danh mục',
          headerShown: true,
          headerBackTitle: '',
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>
          📍 {filteredRestaurants.length} nhà hàng trong danh mục
        </Text>
        {filteredRestaurants.length > 0 ? (
          <FlatList
            data={filteredRestaurants}
            renderItem={renderRestaurant}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>😔 Không có nhà hàng nào trong danh mục này</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContent: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 16,
    color: colors.primary,
  },
  horizontalList: {
    paddingHorizontal: 16,
  },
  restaurantCard: {
    width: 140,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    alignItems: 'center',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantImage: {
    width: 90,
    height: 70,
    borderRadius: 10,
    marginBottom: 6,
    resizeMode: 'cover',
  },
  restaurantName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 2,
  },
  restaurantRating: {
    color: colors.primary,
    fontSize: 13,
    marginTop: 2,
    marginBottom: 8,
  },
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
  statusOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
})
