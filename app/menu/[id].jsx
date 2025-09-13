import { Appearance, StyleSheet, View, Text, Image, ScrollView, Platform, SafeAreaView, Pressable, FlatList } from "react-native";
import { Colors } from "@/constants/Colors";
import { MENU_ITEMS } from '@/constants/MenuItems'
import MENU_IMAGES from '@/constants/MenuImages'
import { Button } from "@react-navigation/elements";
import { Link, useLocalSearchParams } from 'expo-router'
import React, { useState } from "react";


export default function MenuScreen() {
    const colorScheme = Appearance.getColorScheme()
    const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
    const style = createStyles(theme, colorScheme)
    const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView;
    const [quantities, setQuantities] = useState({});

    // Lấy id nhà hàng từ URL
    const { id } = useLocalSearchParams();
    const restaurantId = parseInt(id);

    // Lọc menu theo nhà hàng
    const menuForRestaurant = MENU_ITEMS.filter(item => item.restaurantId === restaurantId);

    const increaseQty = (id) => {
        setQuantities(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    const decreaseQty = (id) => {
        setQuantities(prev => {
            const newQty = Math.max((prev[id] || 0) - 1, 0);
            return { ...prev, [id]: newQty };
        });
    };

    const separatorComp = <View style={style.separator} />
    const footerComp = <Text style={{ color: theme.text }}>End of Menu</Text>

    return (
        <Container>
            <FlatList
                data={menuForRestaurant}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={style.contentContainer}
                ItemSeparatorComponent={separatorComp}
                ListFooterComponent={footerComp}
                ListFooterComponentStyle={style.footerComp}
                ListEmptyComponent={<Text>No items</Text>}
                renderItem={({ item }) => (
                    <View style={style.card}>
                        <Image
                            source={MENU_IMAGES[item.id - 1]}
                            style={style.menuImage}
                            resizeMode="cover"
                        />
                        <View style={style.menuInfo}>
                            <Text style={style.menuItemTitle}>{item.title}</Text>
                            <Text style={style.menuItemText}>{item.description}</Text>
                            <View style={style.rowBetween}>
                                <Text style={style.priceText}>{item.price.toLocaleString()} đ</Text>
                                <Text style={style.ratingText}>⭐ {item.rating || 4.5} | Đã bán: {item.sold || 100}</Text>
                            </View>
                            <View style={style.actionRow}>
                                <Pressable onPress={() => decreaseQty(item.id)} style={style.qtyButton}>
                                    <Text style={style.qtyText}>-</Text>
                                </Pressable>
                                <Text style={style.qtyNumber}>{quantities[item.id] || 0}</Text>
                                <Pressable onPress={() => increaseQty(item.id)} style={style.qtyButton}>
                                    <Text style={style.qtyText}>+</Text>
                                </Pressable>
                                <Pressable style={style.addToCartBtn}>
                                    <Text style={style.addToCartText}>Thêm vào giỏ</Text>
                                </Pressable>
                            </View>
                        </View>
                        {item.discount && (
                            <View style={style.discountBadge}>
                                <Text style={style.discountText}>-{item.discount}%</Text>
                            </View>
                        )}
                    </View>
                )}>
            </FlatList>
        </Container>
    )
}

function createStyles(theme, colorScheme) {
    return StyleSheet.create({
        contentContainer: {
            paddingTop: 10,
            paddingBottom: 20,
            paddingHorizontal: 12,
            backgroundColor: theme.background,
        },
        separator: {
            height: 1,
            backgroundColor: colorScheme === 'dark' ? 'papayawhip' : "#000",
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
        row: {
            flexDirection: 'row',
            width: '100%',
            maxWidth: 600,
            height: 100,
            marginBottom: 10,
            borderStyle: 'solid',
            borderColor: colorScheme === 'dark' ? 'papayawhip' : '#000',
            borderWidth: 1,
            borderRadius: 20,
            overflow: 'hidden',
            marginHorizontal: 'auto',
        },
        menuTextRow: {
            width: '65%',
            paddingTop: 10,
            paddingLeft: 10,
            paddingRight: 5,
            flexGrow: 1,
        },
        menuItemTitle: {
            fontSize: 18,
            textDecorationLine: 'underline',

        },
        menuItemText: {
            color: theme.text,
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
            color: '#e53935',
            fontWeight: 'bold',
            fontSize: 16,
        },
        addToCartBtn: {
            backgroundColor: '#00b14f',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
            marginLeft: 10,
        },
        addToCartText: {
            color: '#fff',
            fontWeight: 'bold',
        },
        discountBadge: {
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: '#e53935',
            borderRadius: 6,
            paddingHorizontal: 6,
            paddingVertical: 2,
        },
        discountText: {
            color: '#fff',
            fontSize: 12,
            fontWeight: 'bold',
        },
        ratingText: {
            color: '#888',
            fontSize: 13,
        },
    })
}