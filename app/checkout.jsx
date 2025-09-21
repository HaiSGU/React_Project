import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DRIVERS } from "../constants/DriversList";
import { QRScanner } from "../components/QRScanner";
import { useNotifications, scheduleOrderNotification } from "../components/NotificationService";

export default function CheckoutScreen() {
  const router = useRouter();
  const { cart } = useLocalSearchParams();

  const parsedCart = cart ? JSON.parse(cart) : [];

  // State
  const [userInfo, setUserInfo] = useState(null);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [voucher, setVoucher] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState("fast");
  const [assignedDriver, setAssignedDriver] = useState(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Notifications
  const { scheduleOrderNotification } = useNotifications();

  // Load thông tin người dùng và random driver
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const isLoggedInValue = await AsyncStorage.getItem('isLoggedIn');
        const userInfoValue = await AsyncStorage.getItem('userInfo');
        
        setIsLoggedIn(isLoggedInValue === 'true');
        if (userInfoValue) {
          const user = JSON.parse(userInfoValue);
          setUserInfo(user);
          setAddress(user.address || '');
          setPhone(user.phone || '');
          setFullName(user.fullName || user.username || '');
        }
      } catch (error) {
        console.log('Error loading user info:', error);
      }
    };
    
    loadUserInfo();
    
    // Random driver
    const random = DRIVERS[Math.floor(Math.random() * DRIVERS.length)];
    setAssignedDriver(random);
  }, []);

  // Voucher giả lập
   const vouchers = [
    { code: "SALE10", label: "Giảm 10%", type: "percent", value: 0.1 },     
    { code: "SHIPFREE", label: "Miễn phí ship", type: "shipping" },         
    { code: "OFF20K", label: "Giảm 20.000đ", type: "fixed", value: 20000 },
  ];

  // Tính toán tiền
  const subtotal = parsedCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
    const shippingFee = deliveryMethod === "fast" ? 25000 : 15000;

  let itemDiscount = 0;
  let shippingDiscount = 0;

  if (voucher) {
    if (voucher.type === "percent") {
      itemDiscount = subtotal * voucher.value; // % trên subtotal
    } else if (voucher.type === "fixed") {
      itemDiscount = voucher.value; // giảm cố định trên subtotal
      // tránh giảm vượt quá subtotal
      if (itemDiscount > subtotal) itemDiscount = subtotal;
    } else if (voucher.type === "shipping") {
      // miễn phí shipping => shippingDiscount = toàn bộ shippingFee
      shippingDiscount = shippingFee;
    }
  }


  const totalPrice = subtotal - itemDiscount + shippingFee - shippingDiscount;


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <Text style={styles.header}>Thanh toán</Text>

        {/* Thông tin người nhận */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Thông tin người nhận</Text>
          <TextInput
            style={styles.input}
            placeholder="Họ và tên *"
            value={fullName}
            onChangeText={setFullName}
          />
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại *"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Địa chỉ giao hàng *"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Danh sách món */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛒 Giỏ hàng</Text>
          <FlatList
            data={parsedCart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <Text style={styles.itemName}>
                  {item.title} x{item.quantity}
                </Text>
                <Text style={styles.itemPrice}>
                  {(item.price * item.quantity).toLocaleString()} đ
                </Text>
              </View>
            )}
            ListEmptyComponent={<Text>Giỏ hàng trống</Text>}
          />
        </View>

        {/* Voucher */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎟 Voucher</Text>
          <Pressable
            style={styles.voucherButton}
            onPress={() => setShowVoucherModal(true)}
          >
            <Text>
              {voucher ? `${voucher.label}` : "Chọn voucher"}
            </Text>
          </Pressable>
        </View>

        {/* Phương thức giao hàng */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚚 Hình thức giao hàng</Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Pressable
              style={[
                styles.methodButton,
                deliveryMethod === "fast" && styles.methodActive,
              ]}
              onPress={() => setDeliveryMethod("fast")}
            >
              <Text
                style={
                  deliveryMethod === "fast"
                    ? styles.methodActiveText
                    : styles.methodText
                }
              >
                Nhanh (25k)
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.methodButton,
                deliveryMethod === "standard" && styles.methodActive,
              ]}
              onPress={() => setDeliveryMethod("standard")}
            >
              <Text
                style={
                  deliveryMethod === "standard"
                    ? styles.methodActiveText
                    : styles.methodText
                }
              >
                Tiêu chuẩn (15k)
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Phương thức thanh toán */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💳 Phương thức thanh toán</Text>
          <View style={{ flexDirection: "row", gap: 12, flexWrap: 'wrap' }}>
            <Pressable
              style={[
                styles.methodButton,
                paymentMethod === "cash" && styles.methodActive,
              ]}
              onPress={() => setPaymentMethod("cash")}
            >
              <Text
                style={
                  paymentMethod === "cash"
                    ? styles.methodActiveText
                    : styles.methodText
                }
              >
                💵 Tiền mặt
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.methodButton,
                paymentMethod === "qr" && styles.methodActive,
              ]}
              onPress={() => setPaymentMethod("qr")}
            >
              <Text
                style={
                  paymentMethod === "qr"
                    ? styles.methodActiveText
                    : styles.methodText
                }
              >
                📱 QR Code
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.methodButton,
                paymentMethod === "card" && styles.methodActive,
              ]}
              onPress={() => setPaymentMethod("card")}
            >
              <Text
                style={
                  paymentMethod === "card"
                    ? styles.methodActiveText
                    : styles.methodText
                }
              >
                💳 Thẻ
              </Text>
            </Pressable>
          </View>
          
          {paymentMethod === "qr" && (
            <Pressable
              style={styles.qrButton}
              onPress={() => setShowQRScanner(true)}
            >
              <Text style={styles.qrButtonText}>📱 Quét QR thanh toán</Text>
            </Pressable>
          )}
        </View>

        {/* Tài xế */}
        {assignedDriver && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🧑‍✈️ Tài xế</Text>
            <View style={styles.driverBox}>
              <Image source={assignedDriver.image} style={styles.driverImage} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.driverText}>
                  {assignedDriver.name} ({assignedDriver.vehicle})
                </Text>
                <Text style={styles.driverRating}>
                  ⭐ {assignedDriver.rating}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.totalText}>
          Tổng cộng: {totalPrice.toLocaleString()} đ
        </Text>
        <Pressable
          style={styles.payButton}
          onPress={() => {
            // Kiểm tra thông tin bắt buộc
            if (!fullName.trim()) {
              Alert.alert('Lỗi đặt hàng', 'Vui lòng nhập họ tên người nhận!');
              return;
            }
            if (!phone.trim()) {
              Alert.alert('Lỗi đặt hàng', 'Vui lòng nhập số điện thoại!');
              return;
            }
            if (!address.trim()) {
              Alert.alert('Lỗi đặt hàng', 'Vui lòng nhập địa chỉ giao hàng!');
              return;
            }
            if (parsedCart.length === 0) {
              Alert.alert('Lỗi đặt hàng', 'Giỏ hàng trống!');
              return;
            }
            
            // Tạo order ID
            const orderId = `FF${Date.now()}`;
            
            // Lên lịch thông báo đơn hàng
            scheduleOrderNotification(orderId, deliveryMethod === "fast" ? 30 : 45);
            
            // Hiển thị thông báo đặt hàng thành công
            Alert.alert(
              "🎉 Đặt hàng thành công!",
              `Đơn hàng #${orderId} của ${fullName} sẽ được giao bởi tài xế ${assignedDriver.name} đến địa chỉ ${address}.\n\nTổng tiền: ${totalPrice.toLocaleString()} đ\nPhương thức: ${paymentMethod === 'qr' ? 'QR Code' : paymentMethod === 'cash' ? 'Tiền mặt' : 'Thẻ'}`,
              [
                {
                  text: "OK",
                  onPress: () => router.replace('/')
                }
              ]
            );
          }}
        >
          <Text style={styles.payButtonText}>Đặt hàng</Text>
        </Pressable>
      </View>

      {/* Modal voucher */}
      <Modal
        visible={showVoucherModal}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Chọn voucher</Text>
            {vouchers.map((v) => (
              <TouchableOpacity
                key={v.code}
                style={styles.voucherItem}
                onPress={() => {
                  setVoucher(v);
                  setShowVoucherModal(false);
                }}
              >
                <Text>{v.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setShowVoucherModal(false)}
              style={styles.closeModal}
            >
              <Text>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* QR Scanner */}
      <QRScanner
        visible={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScanSuccess={(qrData) => {
          Alert.alert(
            'QR Code đã được quét!',
            'Bạn có thể tiếp tục đặt hàng.',
            [{ text: 'OK' }]
          );
        }}
      />
    </View>
  );
}

// ================= STYLE =================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    padding: 16,
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 6,
    backgroundColor: "#f9f9f9",
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  itemName: { fontSize: 16 },
  itemPrice: { fontSize: 16, fontWeight: "600", color: "#e53935" },
  voucherButton: {
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
  },
  methodButton: {
    borderWidth: 1,
    borderColor: "#aaa",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  methodText: { color: "#333" },
  methodActive: { backgroundColor: "#00b14f", borderColor: "#00b14f" },
  methodActiveText: { color: "#fff" },

  driverBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
  },
  driverImage: { width: 50, height: 50, borderRadius: 25 },
  driverText: { fontSize: 16, fontWeight: "600" },
  driverRating: { color: "#777" },

  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  totalText: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  payButton: {
    backgroundColor: "#00b14f",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  payButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "80%",
  },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  voucherItem: {
    padding: 12,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  closeModal: { marginTop: 12, alignItems: "center" },
  qrButton: {
    backgroundColor: '#00b14f',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  qrButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
