import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
    generateShipperRoute,
    getCurrentShipperPosition,
    formatTimeRemaining,
} from '@shared/services/trackingService';
import { formatPrice } from '@shared/utils/formatters';
import colors from '@shared/theme/colors';

export default function OrderTrackingScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const mapRef = useRef(null);

    // Parse order data from params
    const order = params.order ? JSON.parse(params.order) : null;

    const [shipperPosition, setShipperPosition] = useState(null);
    const [progress, setProgress] = useState(0);
    const [estimatedTime, setEstimatedTime] = useState(0);
    const [waypoints, setWaypoints] = useState([]);
    const [orderStatus, setOrderStatus] = useState('shipping');

    // Restaurant and delivery coordinates
    const restaurantLocation = {
        latitude: 10.7769,
        longitude: 106.7009,
    };

    const deliveryLocation = {
        latitude: parseFloat(order?.delivery?.location?.latitude) || 10.7869,
        longitude: parseFloat(order?.delivery?.location?.longitude) || 106.7109,
    };

    useEffect(() => {
        if (!order) return;

        // Generate route
        const route = generateShipperRoute(
            restaurantLocation.latitude,
            restaurantLocation.longitude,
            deliveryLocation.latitude,
            deliveryLocation.longitude,
            30 // 30 waypoints
        );
        setWaypoints(route);

        // Start tracking simulation
        const startTime = Date.now();

        const interval = setInterval(() => {
            const tracking = getCurrentShipperPosition(route, startTime);

            if (tracking) {
                setShipperPosition(tracking.position);
                setProgress(tracking.progress);
                setEstimatedTime(tracking.estimatedTime);
                setOrderStatus(tracking.status);

                // Auto-complete after 1 minute
                if (tracking.status === 'completed') {
                    clearInterval(interval);
                    setTimeout(() => {
                        router.back();
                    }, 2000);
                }
            }
        }, 1000); // Update every second

        return () => clearInterval(interval);
    }, []); // Run once on mount

    // Center map on shipper position
    useEffect(() => {
        if (shipperPosition && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: shipperPosition.latitude,
                longitude: shipperPosition.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
            }, 1000);
        }
    }, [shipperPosition]);

    if (!order) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Không tìm thấy thông tin đơn hàng</Text>
                    <Pressable style={styles.backBtn} onPress={() => router.back()}>
                        <Text style={styles.backBtnText}>Quay lại</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <Stack.Screen
                options={{
                    title: 'Theo dõi đơn hàng',
                    headerShown: true,
                    headerBackTitle: 'Quay lại',
                }}
            />

            {/* Map */}
            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={{
                        latitude: restaurantLocation.latitude,
                        longitude: restaurantLocation.longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                    mapType="standard"
                    showsUserLocation={false}
                    showsMyLocationButton={false}
                    showsCompass={true}
                    showsScale={false}
                    zoomEnabled={true}
                    scrollEnabled={true}
                >
                    {/* Restaurant marker */}
                    <Marker
                        coordinate={restaurantLocation}
                        title="Nhà hàng"
                        description={order.restaurantName}
                    >
                        <View style={styles.restaurantMarker}>
                            <Text style={styles.markerIcon}>🏪</Text>
                        </View>
                    </Marker>

                    {/* Delivery location marker */}
                    <Marker
                        coordinate={deliveryLocation}
                        title="Địa chỉ giao hàng"
                        description={order.delivery?.address}
                    >
                        <View style={styles.deliveryMarker}>
                            <Text style={styles.markerIcon}>📍</Text>
                        </View>
                    </Marker>

                    {/* Shipper marker */}
                    {shipperPosition && (
                        <Marker
                            coordinate={shipperPosition}
                            title="Shipper"
                            description="Đang trên đường giao hàng"
                            anchor={{ x: 0.5, y: 0.5 }}
                        >
                            <View style={styles.shipperMarker}>
                                <Text style={styles.shipperIcon}>🏍️</Text>
                            </View>
                        </Marker>
                    )}

                    {/* Route polyline */}
                    {waypoints.length > 0 && (
                        <Polyline
                            coordinates={waypoints}
                            strokeColor={colors.primary}
                            strokeWidth={4}
                            lineDashPattern={[10, 5]}
                        />
                    )}
                </MapView>

                {/* Floating info card on map */}
                <View style={styles.floatingCard}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>🚚 Đang giao hàng</Text>
                        <Text style={styles.progressBadge}>{Math.round(progress)}%</Text>
                    </View>
                    <Text style={styles.timeRemaining}>
                        Còn {formatTimeRemaining(estimatedTime)}
                    </Text>
                    <View style={styles.miniProgressBar}>
                        <View style={[styles.miniProgressFill, { width: `${progress}%` }]} />
                    </View>
                </View>
            </View>

            {/* Order info */}
            <ScrollView style={styles.infoContainer} showsVerticalScrollIndicator={false}>
                {/* Status */}
                <View style={styles.statusContainer}>
                    <View style={styles.statusIconContainer}>
                        <Text style={styles.statusIconLarge}>
                            {orderStatus === 'completed' ? '✅' : '🚀'}
                        </Text>
                    </View>
                    <View style={styles.statusTextContainer}>
                        <Text style={styles.statusTitle}>
                            {orderStatus === 'completed'
                                ? 'Đã giao hàng thành công!'
                                : 'Đang giao đến bạn'}
                        </Text>
                        <Text style={styles.statusSubtitle}>
                            {orderStatus === 'completed'
                                ? 'Cảm ơn bạn đã sử dụng dịch vụ'
                                : 'Shipper sẽ đến trong ít phút nữa'}
                        </Text>
                    </View>
                </View>

                {/* Order details */}
                <View style={styles.detailsCard}>
                    <Text style={styles.cardSectionTitle}>Thông tin đơn hàng</Text>

                    <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                            <Text style={styles.emoji}>📦</Text>
                        </View>
                        <View style={styles.detailContent}>
                            <Text style={styles.detailLabel}>Mã đơn</Text>
                            <Text style={styles.detailValue}>#{order.id}</Text>
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                            <Text style={styles.emoji}>🏪</Text>
                        </View>
                        <View style={styles.detailContent}>
                            <Text style={styles.detailLabel}>Nhà hàng</Text>
                            <Text style={styles.detailValue}>{order.restaurantName}</Text>
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                            <Text style={styles.emoji}>💰</Text>
                        </View>
                        <View style={styles.detailContent}>
                            <Text style={styles.detailLabel}>Tổng tiền</Text>
                            <Text style={[styles.detailValue, styles.priceValue]}>
                                {formatPrice(order.totalPrice || order.pricing?.total)}đ
                            </Text>
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                            <Text style={styles.emoji}>📍</Text>
                        </View>
                        <View style={styles.detailContent}>
                            <Text style={styles.detailLabel}>Địa chỉ giao</Text>
                            <Text style={[styles.detailValue, styles.addressValue]} numberOfLines={2}>
                                {order.delivery?.address}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Contact buttons */}
                <View style={styles.buttonRow}>
                    <Pressable style={[styles.contactBtn, styles.callBtn]}>
                        <Text style={styles.contactIcon}>📞</Text>
                        <Text style={styles.contactBtnText}>Gọi shipper</Text>
                    </Pressable>
                    <Pressable style={[styles.contactBtn, styles.chatBtn]}>
                        <Text style={styles.contactIcon}>💬</Text>
                        <Text style={styles.contactBtnText}>Nhắn tin</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    mapContainer: {
        height: '45%',
        position: 'relative',
    },
    map: {
        flex: 1,
    },
    // Marker styles
    restaurantMarker: {
        backgroundColor: '#4CAF50',
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
    deliveryMarker: {
        backgroundColor: '#FF5722',
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
    shipperMarker: {
        backgroundColor: colors.primary,
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#fff',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 12,
    },
    markerIcon: {
        fontSize: 28,
    },
    shipperIcon: {
        fontSize: 32,
    },
    // Floating card
    floatingCard: {
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
    },
    progressBadge: {
        backgroundColor: colors.primary,
        color: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        fontSize: 14,
        fontWeight: 'bold',
    },
    timeRemaining: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    miniProgressBar: {
        height: 6,
        backgroundColor: '#e0e0e0',
        borderRadius: 3,
        overflow: 'hidden',
    },
    miniProgressFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 3,
    },
    // Info container
    infoContainer: {
        flex: 1,
        padding: 16,
    },
    // Status container
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    statusIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    statusIconLarge: {
        fontSize: 32,
    },
    statusTextContainer: {
        flex: 1,
    },
    statusTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 4,
    },
    statusSubtitle: {
        fontSize: 13,
        color: '#666',
    },
    // Details card
    detailsCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    cardSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    detailIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    emoji: {
        fontSize: 20,
    },
    detailContent: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#222',
    },
    priceValue: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    addressValue: {
        lineHeight: 20,
    },
    // Buttons
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    contactBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    callBtn: {
        backgroundColor: '#4CAF50',
    },
    chatBtn: {
        backgroundColor: colors.primary,
    },
    contactIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    contactBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
    // Error state
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    backBtn: {
        backgroundColor: colors.primary,
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
    },
    backBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
