import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function CartScreen() {
  const [activeTab, setActiveTab] = useState('shipping')
  const [shippingOrders, setShippingOrders] = useState([])
  const [deliveredOrders, setDeliveredOrders] = useState([])

  useEffect(() => {
    const loadOrders = async () => {
      const shipping = await AsyncStorage.getItem('shippingOrders')
      const delivered = await AsyncStorage.getItem('deliveredOrders')
      setShippingOrders(shipping ? JSON.parse(shipping) : [])
      setDeliveredOrders(delivered ? JSON.parse(delivered) : [])
    }
    loadOrders()
  }, [])

  // Xác nhận đã nhận hàng
  const handleConfirmDelivered = async (order) => {
    // Xóa khỏi shippingOrders
    const newShipping = shippingOrders.filter(o => o.id !== order.id)
    setShippingOrders(newShipping)
    await AsyncStorage.setItem('shippingOrders', JSON.stringify(newShipping))

    // Thêm vào deliveredOrders
    const newOrder = { ...order, status: "Đã giao", deliveredAt: new Date().toISOString() }
    const newDelivered = [...deliveredOrders, newOrder]
    setDeliveredOrders(newDelivered)
    await AsyncStorage.setItem('deliveredOrders', JSON.stringify(newDelivered))
  }

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderTitle}>Mã đơn: {item.id}</Text>
      <Text>Nhà hàng: {item.restaurantName}</Text>
      <Text>Tổng tiền: {item.totalPrice.toLocaleString()} đ</Text>
      <Text>Trạng thái: {item.status}</Text>
      {activeTab === 'shipping' && (
        <Pressable
          style={styles.confirmBtn}
          onPress={() => handleConfirmDelivered(item)}
        >
          <Text style={styles.confirmText}>Đã nhận hàng</Text>
        </Pressable>
      )}
    </View>
  )

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 40 }}>
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
    </View>
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
    backgroundColor: '#00b14f',
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
  confirmBtn: {
    marginTop: 12,
    backgroundColor: '#00b14f',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
})