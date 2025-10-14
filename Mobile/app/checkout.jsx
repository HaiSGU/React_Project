// app/checkout.jsx
import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  Image,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Location from 'expo-location'

//Import từ shared
import { useCheckout } from '@shared/hooks/useCheckout'
import { DISCOUNTS } from '@shared/constants/DiscountList'
import { DRIVERS } from '@shared/constants/DriversList'
import { getCurrentUser } from '@shared/services/authService' // ✅ THÊM
import { fetchWeather, getAddressFromCoords } from '@shared/services/weatherService'
import { adjustShippingForWeather, canApplyDiscount } from '@shared/utils/checkoutHelpers'
import { buildOrderObject } from '@shared/utils/orderBuilder'
import { saveOrder } from '@shared/services/orderService'
import colors from '@shared/theme/colors'

const DELIVERY_METHODS = [
  { key: 'fast', label: 'Nhanh', fee: 25000, time: '30 phút' },
  { key: 'standard', label: 'Tiêu chuẩn', fee: 15000, time: '45 phút' },
  { key: 'economy', label: 'Tiết kiệm', fee: 10000, time: '60 phút' },
]

const PAYMENT_METHODS = [
  { key: 'cash', label: 'Tiền mặt', icon: '💵' },
  { key: 'qr', label: 'QR Code', icon: '📱' },
  { key: 'card', label: 'Thẻ', icon: '💳' },
]

export default function CheckoutScreen() {
  const router = useRouter()
  const { cart: cartStr } = useLocalSearchParams()
  const cart = cartStr ? JSON.parse(cartStr) : []

  // Sử dụng custom hook từ shared
  const {
    fullName,
    setFullName,
    phone,
    setPhone,
    address,
    setAddress,
    deliveryMethod,
    setDeliveryMethod,
    discount,
    setDiscount,
    paymentMethod,
    setPaymentMethod,
    error,
    subtotal,
    shippingFee,
    itemDiscount,
    shippingDiscount,
    totalPrice,
    validate,
  } = useCheckout(cart)

  // State cho UI
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)
  const [showVoucherModal, setShowVoucherModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showMapModal, setShowMapModal] = useState(false)
  const [weather, setWeather] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [mapRegion, setMapRegion] = useState(null) // ✅ THÊM

  //  Random tài xế
  const [selectedDriver] = useState(() => {
    const randomIndex = Math.floor(Math.random() * DRIVERS.length)
    return DRIVERS[randomIndex]
  })

  //  LOAD THÔNG TIN USER KHI MOUNT
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const user = await getCurrentUser(AsyncStorage)
        if (user) {
          setFullName(user.fullName || user.username || '')
          setPhone(user.phone || '')
        }
      } catch (error) {
        console.log('Error loading user:', error)
      }
    }

    loadUserInfo()
  }, [])

  // Lấy địa chỉ từ GPS
  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Lỗi', 'Cần cấp quyền truy cập vị trí!')
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      const { latitude, longitude } = location.coords

      setUserLocation({ latitude, longitude })
      
      //  Set initial map region
      setMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      })

      // Sử dụng shared service
      const result = await getAddressFromCoords(latitude, longitude)
      if (result.success) {
        setAddress(result.address)
      }

      // Lấy thời tiết
      const weatherResult = await fetchWeather(latitude, longitude)
      if (weatherResult.success) {
        setWeather(weatherResult.data)
      }
    }

    getLocation()
  }, [])

  // Điều chỉnh phí ship theo thời tiết
  const adjustedShipping = adjustShippingForWeather(shippingFee, weather?.condition)
  const finalShippingFee = adjustedShipping.fee
  const finalTotalPrice = totalPrice - shippingFee + finalShippingFee

  // Lọc discounts khả dụng cho nhà hàng hiện tại
  const restaurantId = cart[0]?.restaurantId
  const availableDiscounts = DISCOUNTS.filter(d => canApplyDiscount(d, restaurantId))

  // Xử lý chọn địa điểm trên bản đồ
  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate
    setMapRegion({ ...mapRegion, latitude, longitude })
    
    // Lấy địa chỉ từ tọa độ mới
    getAddressFromCoords(latitude, longitude).then(result => {
      if (result.success) {
        setAddress(result.address)
      }
    })
  }

  // Xử lý đặt hàng
  const handlePlaceOrder = async () => {
    if (!validate()) {
      Alert.alert('Lỗi', error)
      return
    }

    //  Build order object
    const order = buildOrderObject({
      cart,
      fullName,
      phone,
      address,
      deliveryMethod,
      paymentMethod,
      discount,
      driver: selectedDriver,
      totalPrice: finalTotalPrice,
    })

    //  Lưu order
    const result = await saveOrder(AsyncStorage, order)
    
    if (result.success) {
      Alert.alert('Thành công', 'Đặt hàng thành công!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ])
    } else {
      Alert.alert('Lỗi', result.error)
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Thông tin đặt hàng</Text>

            {/*  Thông tin khách hàng - MẶC ĐỊNH */}
            <TextInput
              style={styles.input}
              placeholder="Họ và tên"
              value={fullName}
              onChangeText={setFullName}
            />
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            
            {/*  Địa chỉ với nút bản đồ */}
            <View style={styles.addressRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 8, marginHorizontal: 0 }]}
                placeholder="Địa chỉ giao hàng"
                value={address}
                onChangeText={setAddress}
                multiline
              />
              <Pressable
                style={styles.mapBtn}
                onPress={() => setShowMapModal(true)}
              >
                <Text style={styles.mapBtnText}>🗺️</Text>
              </Pressable>
            </View>

            {/* Chọn phương thức giao hàng */}
            <Pressable
              style={styles.selectBtn}
              onPress={() => setShowDeliveryModal(true)}
            >
              <Text>
                Giao hàng: {DELIVERY_METHODS.find(m => m.key === deliveryMethod)?.label}
              </Text>
              <Text style={styles.fee}>
                {finalShippingFee.toLocaleString()}đ
              </Text>
            </Pressable>

            {/*  Chọn voucher */}
            <Pressable
              style={styles.selectBtn}
              onPress={() => setShowVoucherModal(true)}
            >
              <Text>
                Mã giảm giá: {discount?.label || 'Chọn mã'}
              </Text>
              {discount && (
                <Text style={styles.discountLabel}>✓</Text>
              )}
            </Pressable>

            {/* Chọn thanh toán */}
            <Pressable
              style={styles.selectBtn}
              onPress={() => setShowPaymentModal(true)}
            >
              <Text>
                Thanh toán: {PAYMENT_METHODS.find(m => m.key === paymentMethod)?.label}
              </Text>
            </Pressable>

            {/* Hiển thị tài xế đã random */}
            <View style={styles.driverBox}>
              <Image 
                source={selectedDriver.image} 
                style={styles.driverAvatar}
              />
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{selectedDriver.name}</Text>
                <Text style={styles.driverDetail}>
                  {selectedDriver.vehicle} • ⭐ {selectedDriver.rating}
                </Text>
              </View>
            </View>

            {/* Thời tiết */}
            {weather && (
              <View style={styles.weatherBox}>
                <Text>🌤️ {weather.description} • 🌡️ {weather.temp}°C</Text>
                {adjustedShipping.reason && (
                  <Text style={styles.weatherWarning}>
                    ⚠️ {adjustedShipping.reason} (+{adjustedShipping.extraTime} phút)
                  </Text>
                )}
              </View>
            )}

            <Text style={styles.sectionTitle}>Món đã chọn:</Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text>{item.title} x{item.quantity}</Text>
            <Text>{(item.price * item.quantity).toLocaleString()}đ</Text>
          </View>
        )}
        ListFooterComponent={
          <>
            {/* Tổng tiền */}
            <View style={styles.summary}>
              <View style={styles.row}>
                <Text>Tạm tính:</Text>
                <Text>{subtotal.toLocaleString()}đ</Text>
              </View>
              
              {itemDiscount > 0 && (
                <View style={styles.row}>
                  <Text>Giảm giá món ({discount?.label}):</Text>
                  <Text style={styles.discountText}>
                    -{itemDiscount.toLocaleString()}đ
                  </Text>
                </View>
              )}

              <View style={styles.row}>
                <Text>Phí ship:</Text>
                <Text>{finalShippingFee.toLocaleString()}đ</Text>
              </View>

              {shippingDiscount > 0 && (
                <View style={styles.row}>
                  <Text>Miễn phí ship ({discount?.label}):</Text>
                  <Text style={styles.discountText}>
                    -{shippingDiscount.toLocaleString()}đ
                  </Text>
                </View>
              )}

              <View style={[styles.row, styles.total]}>
                <Text style={styles.totalText}>Tổng cộng:</Text>
                <Text style={styles.totalText}>
                  {finalTotalPrice.toLocaleString()}đ
                </Text>
              </View>
            </View>

            <Pressable style={styles.orderBtn} onPress={handlePlaceOrder}>
              <Text style={styles.orderBtnText}>Đặt hàng</Text>
            </Pressable>
          </>
        }
      />

      {/* Modal chọn delivery method */}
      <Modal visible={showDeliveryModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn phương thức giao hàng</Text>
            {DELIVERY_METHODS.map(method => (
              <Pressable
                key={method.key}
                style={[
                  styles.modalItem,
                  deliveryMethod === method.key && styles.modalItemSelected
                ]}
                onPress={() => {
                  setDeliveryMethod(method.key)
                  setShowDeliveryModal(false)
                }}
              >
                <View>
                  <Text style={styles.modalItemText}>{method.label}</Text>
                  <Text style={styles.modalItemSubtext}>
                    Dự kiến: {method.time}
                  </Text>
                </View>
                <Text style={styles.modalItemPrice}>
                  {method.fee.toLocaleString()}đ
                </Text>
              </Pressable>
            ))}
            <Pressable
              style={styles.modalClose}
              onPress={() => setShowDeliveryModal(false)}
            >
              <Text>Đóng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ✅ Modal chọn voucher */}
      <Modal visible={showVoucherModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn mã giảm giá</Text>
            
            {availableDiscounts.length === 0 ? (
              <Text style={styles.emptyText}>
                Không có mã giảm giá khả dụng cho nhà hàng này
              </Text>
            ) : (
              availableDiscounts.map(d => (
                <Pressable
                  key={d.type}
                  style={[
                    styles.modalItem,
                    discount?.type === d.type && styles.modalItemSelected
                  ]}
                  onPress={() => {
                    setDiscount(d)
                    setShowVoucherModal(false)
                  }}
                >
                  <Text style={styles.modalItemText}>{d.label}</Text>
                  {discount?.type === d.type && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </Pressable>
              ))
            )}

            {/* ✅ Nút xóa voucher */}
            {discount && (
              <Pressable
                style={[styles.modalItem, { backgroundColor: '#ffebee' }]}
                onPress={() => {
                  setDiscount(null)
                  setShowVoucherModal(false)
                }}
              >
                <Text style={{ color: colors.danger }}>Bỏ chọn mã</Text>
              </Pressable>
            )}

            <Pressable
              style={styles.modalClose}
              onPress={() => setShowVoucherModal(false)}
            >
              <Text>Đóng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal chọn payment */}
      <Modal visible={showPaymentModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn phương thức thanh toán</Text>
            {PAYMENT_METHODS.map(method => (
              <Pressable
                key={method.key}
                style={[
                  styles.modalItem,
                  paymentMethod === method.key && styles.modalItemSelected
                ]}
                onPress={() => {
                  setPaymentMethod(method.key)
                  setShowPaymentModal(false)
                }}
              >
                <Text style={styles.modalItemText}>
                  {method.icon} {method.label}
                </Text>
                {paymentMethod === method.key && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </Pressable>
            ))}
            <Pressable
              style={styles.modalClose}
              onPress={() => setShowPaymentModal(false)}
            >
              <Text>Đóng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ✅ Modal bản đồ - BỎ TEXT THÔNG BÁO */}
      <Modal visible={showMapModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { height: '80%' }]}>
            <Text style={styles.modalTitle}>Chọn vị trí giao hàng</Text>
            
            {userLocation ? (
              <View style={styles.mapPlaceholder}>
                <Text style={styles.mapIcon}>🗺️</Text>
                <Text style={styles.coordText}>
                  Vị trí hiện tại:{'\n'}
                  {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}
                </Text>
                <Text style={styles.addressPreview}>
                  📍 {address}
                </Text>
              </View>
            ) : (
              <Text style={styles.emptyText}>Đang tải vị trí...</Text>
            )}

            <Pressable
              style={[styles.modalClose, { backgroundColor: colors.primary }]}
              onPress={() => setShowMapModal(false)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Xác nhận địa chỉ</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    margin: 16, 
    color: colors.primary 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    padding: 12, 
    marginHorizontal: 16, 
    marginBottom: 12 
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  mapBtn: {
    width: 48,
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapBtnText: {
    fontSize: 24,
  },
  selectBtn: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 12, 
    marginHorizontal: 16, 
    marginBottom: 12, 
    backgroundColor: '#f5f5f5', 
    borderRadius: 8 
  },
  fee: { 
    fontWeight: 'bold', 
    color: colors.primary 
  },
  discountLabel: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  driverBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  driverDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  weatherBox: { 
    backgroundColor: '#e3f2fd', 
    padding: 12, 
    marginHorizontal: 16, 
    marginBottom: 12, 
    borderRadius: 8 
  },
  weatherWarning: { 
    color: colors.danger, 
    marginTop: 4 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    margin: 16 
  },
  itemRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingVertical: 8 
  },
  summary: { 
    backgroundColor: '#f9f9f9', 
    padding: 16, 
    margin: 16, 
    borderRadius: 8 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 8 
  },
  discountText: { 
    color: colors.danger,
    fontWeight: 'bold',
  },
  total: { 
    borderTopWidth: 1, 
    borderColor: '#ddd', 
    paddingTop: 8, 
    marginTop: 8 
  },
  totalText: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  orderBtn: { 
    backgroundColor: colors.primary, 
    padding: 16, 
    margin: 16, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  orderBtnText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'flex-end', 
    backgroundColor: 'rgba(0,0,0,0.5)' 
  },
  modalContent: { 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 16, 
    borderTopRightRadius: 16, 
    padding: 16,
    maxHeight: '70%',
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 16,
    color: colors.text,
  },
  modalItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 12, 
    backgroundColor: '#f5f5f5', 
    borderRadius: 8, 
    marginBottom: 8 
  },
  modalItemSelected: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  modalItemText: {
    fontSize: 16,
    color: colors.text,
  },
  modalItemSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  modalItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  checkmark: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalClose: { 
    padding: 12, 
    alignItems: 'center', 
    marginTop: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    padding: 20,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 12,
    padding: 20,
  },
  mapIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  coordText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  addressPreview: {
    marginTop: 16,
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
})
