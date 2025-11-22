import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'

import { getShippingOrders, getDeliveredOrders, confirmDelivery } from '@shared/services/orderService'
import { formatPrice, formatOrderStatus, formatPaymentMethod } from '@shared/utils/formatters'

export default function CartScreen() {
  const [activeTab, setActiveTab] = useState('shipping')
  const [shippingOrders, setShippingOrders] = useState([])
  const [deliveredOrders, setDeliveredOrders] = useState([])

  useEffect(() => {
    const loadOrders = async () => {
      // Dùng shared service
      const shipping = await getShippingOrders(AsyncStorage)
      const delivered = await getDeliveredOrders(AsyncStorage)
      setShippingOrders(shipping)
      setDeliveredOrders(delivered)
    }
    loadOrders()
  }, [])

  const handleConfirmDelivered = async (order) => {
    // Dùng shared service
    const result = await confirmDelivery(order, AsyncStorage)
    setShippingOrders(result.shipping)
    setDeliveredOrders(result.delivered)
  }

  const renderOrder = ({ item }) => {
    const totalValue = item.totalPrice || item.pricing?.total || 0

    return (
      <View style={styles.orderCard}>
        <Text style={styles.orderTitle}>Mã đơn: #{item.id}</Text>
        <Text style={styles.orderText}>
          Nhà hàng: {item.restaurantName || 'Chưa có tên'}
        </Text>

        {/*  DÙNG formatPrice */}
        <Text style={styles.orderText}>
          Tổng tiền: {formatPrice(totalValue)}đ
        </Text>

        {/*  DÙNG formatOrderStatus */}
        <Text style={styles.orderText}>
          Trạng thái: {formatOrderStatus(item.status)}
        </Text>

        {/*  DÙNG formatPaymentMethod */}
        <Text style={styles.orderText}>
          Thanh toán: {formatPaymentMethod(item.payment?.method)}
        </Text>

        {activeTab === 'shipping' && (
          <View style={styles.buttonRow}>
            {/* Button theo dõi đơn hàng */}
            <Link
              href={{
                pathname: '/order-tracking',
                params: { order: JSON.stringify(item) }
              }}
              asChild
            >
              <Pressable style={styles.trackBtn}>
                <Text style={styles.trackBtnText}>🗺️ Theo dõi</Text>
              </Pressable>
            </Link>

            {/* Button đã nhận hàng */}
            <Pressable
              style={styles.confirmBtn}
              onPress={() => handleConfirmDelivered(item)}
            >
              <Text style={styles.confirmText}>✅ Đã nhận</Text>
            </Pressable>
          </View>
        )}
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top']}>
      <View style={styles.tabRow}>
        <Pressable
          style={[styles.tabBtn, activeTab === 'shipping' && styles.tabActive]}
          onPress={() => setActiveTab('shipping')}
        >
          <Text style={activeTab === 'shipping' ? styles.tabTextActive : styles.tabText}>Đang giao</Text>
        </Pressable>
        <Pressable
          style={[styles.tabBtn, activeTab === 'delivered' && styles.tabActive]}
          onPress={() => setActiveTab('delivered')}
        >
          <Text style={activeTab === 'delivered' ? styles.tabTextActive : styles.tabText}>Đã giao</Text>
        </Pressable>
      </View>
      <FlatList
        data={activeTab === 'shipping' ? shippingOrders : deliveredOrders}
        renderItem={renderOrder}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40 }}>Không có đơn hàng</Text>}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  tabBtn: {
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginHorizontal: 8,
  },
  tabActive: {
    backgroundColor: '#3dd9eaff',
  },
  tabText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  orderCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  orderTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
  },
  orderText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  trackBtn: {
    flex: 1,
    backgroundColor: '#10b981',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  trackBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: '#3dd9eaff',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
})