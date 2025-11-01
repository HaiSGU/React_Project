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

//  Import context
import { useLocation } from '@shared/context/LocationContext'
import { useCheckout } from '@shared/hooks/useCheckout'
import { DISCOUNTS } from '@shared/constants/DiscountList'
import { DRIVERS } from '@shared/constants/DriversList'
import { getCurrentUser } from '@shared/services/authService'
import { fetchWeather, getAddressFromCoords } from '@shared/services/weatherService'
import { adjustShippingForWeather, canApplyDiscount } from '@shared/utils/checkoutHelpers'
import { buildOrderObject } from '@shared/utils/orderBuilder'
import { saveOrder } from '@shared/services/orderService'
import colors from '@shared/theme/colors'

// Import QR codes
const QR_CODES = [
  require('@shared/assets/images/QRCode/QR1.jpg'),
  require('@shared/assets/images/QRCode/QR2.jpg'),
]

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

  // Lấy location từ context
  const { selectedLocation, setSelectedLocation } = useLocation()

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

  const [showDeliveryModal, setShowDeliveryModal] = useState(false)
  const [showVoucherModal, setShowVoucherModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [weather, setWeather] = useState(null)
  const [userLocation, setUserLocation] = useState(null)

  // Card payment states
  const [cardNumber, setCardNumber] = useState('')
  const [cardHolder, setCardHolder] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')

  // QR Code state
  const [selectedQR, setSelectedQR] = useState(null)

  const [selectedDriver] = useState(() => {
    const randomIndex = Math.floor(Math.random() * DRIVERS.length)
    return DRIVERS[randomIndex]
  })

  // Chọn QR ngẫu nhiên khi chọn payment method QR
  useEffect(() => {
    if (paymentMethod === 'qr') {
      const randomIndex = Math.floor(Math.random() * QR_CODES.length)
      setSelectedQR(QR_CODES[randomIndex])
    }
  }, [paymentMethod])

  // LOAD THÔNG TIN USER
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

  // LẤY VỊ TRÍ HIỆN TẠI (KHI CHƯA CÓ LOCATION TỪ MAP)
  useEffect(() => {
    const getLocation = async () => {
      // Nếu đã có location từ map, không lấy GPS nữa
      if (selectedLocation) {
        setAddress(selectedLocation.address)
        setUserLocation({
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        })
        
        // Fetch weather cho vị trí đã chọn
        const weatherResult = await fetchWeather(
          selectedLocation.latitude, 
          selectedLocation.longitude
        )
        if (weatherResult.success) {
          setWeather(weatherResult.data)
        }
        return
      }

      // Lấy vị trí GPS nếu chưa có
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Lỗi', 'Cần cấp quyền truy cập vị trí!')
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      const { latitude, longitude } = location.coords

      setUserLocation({ latitude, longitude })

      const result = await getAddressFromCoords(latitude, longitude)
      if (result.success) {
        setAddress(result.address)
      }

      const weatherResult = await fetchWeather(latitude, longitude)
      if (weatherResult.success) {
        setWeather(weatherResult.data)
      }
    }
    getLocation()
  }, [selectedLocation])

  const adjustedShipping = adjustShippingForWeather(shippingFee, weather?.condition)
  const finalShippingFee = adjustedShipping.fee
  const finalTotalPrice = totalPrice - shippingFee + finalShippingFee

  const restaurantId = cart[0]?.restaurantId
  const availableDiscounts = DISCOUNTS.filter(d => canApplyDiscount(d, restaurantId))

  // MỞ TRANG MAP-SELECT
  const handleOpenMap = () => {
    router.push({
      pathname: '/map-select',
      params: {
        returnTo: 'checkout',
        currentAddress: address,
        currentLat: userLocation?.latitude,
        currentLng: userLocation?.longitude,
      }
    })
  }

  const handlePlaceOrder = async () => {
    if (!validate()) {
      Alert.alert('Lỗi', error)
      return
    }

    // Validate card info if payment method is card
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
        Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin thẻ!')
        return
      }
      if (cardNumber.length !== 16) {
        Alert.alert('Lỗi', 'Số thẻ phải có 16 chữ số!')
        return
      }
      if (cvv.length !== 3) {
        Alert.alert('Lỗi', 'CVV phải có 3 chữ số!')
        return
      }
    }

    // ⭐ THÊM DÒNG NÀY - LẤY restaurantId TỪ CART
    const restaurantId = cart[0]?.restaurantId

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
      restaurantId: restaurantId,  // ⭐ THÊM DÒNG NÀY
    })

    const result = await saveOrder(AsyncStorage, order)
    
    if (result.success) {
      setSelectedLocation(null)
      
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
            
            {/* ĐỊA CHỈ VỚI NÚT BẢN ĐỒ */}
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
                onPress={handleOpenMap}
              >
                <Text style={styles.mapBtnText}>🗺️</Text>
              </Pressable>
            </View>

            {/*Hiển thị thông báo nếu đã chọn từ map */}
            {selectedLocation && (
              <View style={styles.locationHint}>
                <Text style={styles.locationHintText}>
                  📍 Đã chọn vị trí từ bản đồ
                </Text>
                <Pressable onPress={() => setSelectedLocation(null)}>
                  <Text style={styles.resetLocationText}>Đặt lại</Text>
                </Pressable>
              </View>
            )}

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

            <Pressable
              style={styles.selectBtn}
              onPress={() => setShowPaymentModal(true)}
            >
              <Text>
                Thanh toán: {PAYMENT_METHODS.find(m => m.key === paymentMethod)?.label}
              </Text>
            </Pressable>

            {/* HIỂN THỊ FORM THẺ KHI CHỌN CARD */}
            {paymentMethod === 'card' && (
              <View style={styles.cardFormContainer}>
                <Text style={styles.cardFormTitle}>Thông tin thẻ</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Số thẻ (16 chữ số)"
                  value={cardNumber}
                  onChangeText={(text) => setCardNumber(text.replace(/\D/g, '').slice(0, 16))}
                  keyboardType="numeric"
                  maxLength={16}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Tên chủ thẻ"
                  value={cardHolder}
                  onChangeText={setCardHolder}
                  autoCapitalize="characters"
                />
                <View style={styles.cardRow}>
                  <TextInput
                    style={[styles.input, { flex: 1, marginRight: 8, marginHorizontal: 0 }]}
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChangeText={(text) => {
                      let formatted = text.replace(/\D/g, '')
                      if (formatted.length >= 2) {
                        formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4)
                      }
                      setExpiryDate(formatted)
                    }}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                  <TextInput
                    style={[styles.input, { flex: 1, marginHorizontal: 0 }]}
                    placeholder="CVV"
                    value={cvv}
                    onChangeText={(text) => setCvv(text.replace(/\D/g, '').slice(0, 3))}
                    keyboardType="numeric"
                    maxLength={3}
                    secureTextEntry
                  />
                </View>
              </View>
            )}

            {/* HIỂN THỊ QR CODE KHI CHỌN QR */}
            {paymentMethod === 'qr' && selectedQR && (
              <View style={styles.qrContainer}>
                <Text style={styles.qrTitle}>Quét mã QR để thanh toán</Text>
                <Image source={selectedQR} style={styles.qrImage} />
                <Text style={styles.qrSubtitle}>
                  Tổng tiền: {finalTotalPrice.toLocaleString()}đ
                </Text>
              </View>
            )}

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

      {/* Modal chọn voucher */}
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
  locationHint: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    padding: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  locationHintText: {
    fontSize: 14,
    color: colors.primary,
  },
  resetLocationText: {
    fontSize: 14,
    color: colors.danger,
    fontWeight: 'bold',
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
  // Card form styles
  cardFormContainer: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardFormTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: colors.text,
  },
  cardRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
  },
  // QR code styles
  qrContainer: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  qrTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.text,
  },
  qrImage: {
    width: 250,
    height: 250,
    borderRadius: 12,
    marginBottom: 12,
  },
  qrSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
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
})
