import { View, Text, FlatList, Image, StyleSheet, Pressable, ScrollView } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState, useMemo } from 'react'

import { MENU_ITEMS } from '@shared/constants/MenuItems'
import { RESTAURANTS } from '@shared/constants/RestaurantsList'
import colors from '@shared/theme/colors'

export default function MenuScreen() {
    const [quantities, setQuantities] = useState({});
    const router = useRouter();

    // Lấy id nhà hàng từ URL
    const { id } = useLocalSearchParams();
    const restaurantId = parseInt(id);

    // Lọc menu theo nhà hàng
    const menuForRestaurant = MENU_ITEMS.filter(item => {
        if (Array.isArray(item.restaurantId)) {
            return item.restaurantId.includes(restaurantId);
        }
        return item.restaurantId === restaurantId;
    });

    const increaseQty = (id) => {
        setQuantities(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    const decreaseQty = (id) => {
        setQuantities(prev => {
            const newQty = Math.max((prev[id] || 0) - 1, 0);
            return { ...prev, [id]: newQty };
        });
    };

    // Tính tổng tiền
    const totalPrice = useMemo(() => {
        return menuForRestaurant.reduce((sum, item) => {
            const qty = quantities[item.id] || 0;
            return sum + qty * item.price;
        }, 0);
    }, [quantities, menuForRestaurant]);

    const separatorComp = <View style={styles.separator} />
    const footerComp = <Text style={{ color: colors.text }}>End of Menu</Text>

    // Gom dữ liệu giỏ hàng
    const cartItems = useMemo(() => {
        return menuForRestaurant
            .filter(item => (quantities[item.id] || 0) > 0)
            .map(item => ({
                id: item.id,
                title: item.title,
                price: item.price,
                quantity: quantities[item.id] || 0,
            }));
    }, [quantities, menuForRestaurant]);


    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
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
                                    <Text style={styles.priceText}>{item.price.toLocaleString()} đ</Text>
                                    <Text style={styles.ratingText}>⭐ {item.rating || 4.5} | Đã bán: {item.sold || 100}</Text>
                                </View>
                                <View style={styles.actionRow}>
                                    <Pressable onPress={() => decreaseQty(item.id)} style={styles.qtyButton}>
                                        <Text style={styles.qtyText}>-</Text>
                                    </Pressable>
                                    <Text style={styles.qtyNumber}>{quantities[item.id] || 0}</Text>
                                    <Pressable onPress={() => increaseQty(item.id)} style={styles.qtyButton}>
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
                    )}>
                </FlatList>
            </ScrollView>

            {/* Thanh tổng tiền */}
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
    menuItemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    menuItemText: {
        color: colors.text,
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
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
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
    priceText: {
        color: colors.danger,
        fontWeight: 'bold',
        fontSize: 16,
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
    ratingText: {
        color: '#888',
        fontSize: 13,
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
    }
})
