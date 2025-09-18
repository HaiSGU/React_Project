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
import { DRIVERS } from "../constants/DriversList";

export default function CheckoutScreen() {
  const router = useRouter();
  const { cart } = useLocalSearchParams();

  const parsedCart = cart ? JSON.parse(cart) : [];

  // State
  const [address, setAddress] = useState("123 Đường ABC, Quận 1");
  const [voucher, setVoucher] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState("fast");
  const [assignedDriver, setAssignedDriver] = useState(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  // Random driver khi mở trang
  useEffect(() => {
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

        {/* Địa chỉ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Địa chỉ giao hàng</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
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
          onPress={() =>
            Alert.alert(
              "Đặt hàng thành công",
              `Đơn hàng sẽ được giao bởi tài xế ${assignedDriver.name}`
            )
          }
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
});
