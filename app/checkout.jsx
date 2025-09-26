// app/checkout.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  Modal,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DRIVERS } from "@/constants/DriversList";


// ====== Reverse geocode bằng OpenStreetMap ======
const getAddressFromCoords = async (lat, lng) => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    if (data && data.display_name) return data.display_name;
    return `Lat: ${lat}, Lng: ${lng}`;
  } catch (error) {
    console.error("Error fetching address:", error);
    return `Lat: ${lat}, Lng: ${lng}`;
  }
};

export default function CheckoutScreen() {
  const router = useRouter();
  const { cart, lat, lng, location } = useLocalSearchParams();

  // parse cart
  let parsedCart = [];
  try {
    parsedCart = cart ? JSON.parse(cart) : [];
  } catch (e) {
    parsedCart = [];
    console.log("Invalid cart param:", e);
  }

  // Parse location từ params
  let parsedLocation = null;
  try {
    if (location) {
      parsedLocation = typeof location === "string" ? JSON.parse(location) : location;
    } else if (lat && lng) {
      const pLat = parseFloat(lat);
      const pLng = parseFloat(lng);
      if (!isNaN(pLat) && !isNaN(pLng)) {
        parsedLocation = { latitude: pLat, longitude: pLng };
      }
    }
  } catch (e) {
    parsedLocation = null;
  }

  // State
  const [userInfo, setUserInfo] = useState(null);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [voucher, setVoucher] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState("fast");
  const [assignedDriver, setAssignedDriver] = useState(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showQRModal, setShowQRModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [qrImage, setQrImage] = useState(null);

  const [weather, setWeather] = useState(null);
  const [shipPrice, setShipPrice] = useState(20000);
  const [shipTime, setShipTime] = useState(30);

  const [useDefaultAddress, setUseDefaultAddress] = useState(true);
  const defaultAddress = userInfo?.address || "Quận 7, TP.HCM";

  const WEATHER_API_KEY = "eecff4fe13943fb4eaa7bd78e1bae552";

  // Lấy dữ liệu thời tiết
  useEffect(() => {
    let isMounted = true;
    let curLat = null,
      curLng = null;

    try {
      if (location) {
        const loc = typeof location === "string" ? JSON.parse(location) : location;
        curLat = loc?.latitude;
        curLng = loc?.longitude;
      }
    } catch {}
    if ((!curLat || !curLng) && lat && lng) {
      const pLat = parseFloat(lat);
      const pLng = parseFloat(lng);
      if (!isNaN(pLat) && !isNaN(pLng)) {
        curLat = pLat;
        curLng = pLng;
      }
    }

    if (!curLat || !curLng) return;

    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${curLat}&lon=${curLng}&appid=${WEATHER_API_KEY}&units=metric&lang=vi`
        );
        const data = await res.json();
        if (!isMounted) return;
        setWeather(data);

        const condition = data?.weather?.[0]?.main?.toLowerCase() || "";
        if (condition.includes("rain") || condition.includes("storm")) {
          setShipPrice((prev) => prev + 10000);
          setShipTime((prev) => prev + 15);
        }
      } catch (err) {
        console.log("Fetch weather error:", err);
      }
    };

    fetchWeather();
    return () => {
      isMounted = false;
    };
  }, [location, lat, lng]);

  // Load user info
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userInfoValue = await AsyncStorage.getItem("userInfo");
        if (userInfoValue) {
          const user = JSON.parse(userInfoValue);
          setUserInfo(user);
          setAddress(user.address || "");
          setPhone(user.phone || "");
          setFullName(user.fullName || user.username || "");
        }
      } catch (error) {
        console.log("Error loading user info:", error);
      }
    };
    loadUserInfo();

    // Nếu chưa có driver trong AsyncStorage thì chọn ngẫu nhiên
    AsyncStorage.getItem("assignedDriver").then(driver => {
      if (driver) setAssignedDriver(JSON.parse(driver));
      else {
        const randomDriver = DRIVERS[Math.floor(Math.random() * DRIVERS.length)];
        setAssignedDriver(randomDriver);
        AsyncStorage.setItem("assignedDriver", JSON.stringify(randomDriver));
      }
    });
  }, []);

  // Nếu chọn location mới từ map-select → reverse geocode
  useEffect(() => {
    if (!parsedLocation) return;
    const { latitude, longitude } = parsedLocation;
    if (!latitude || !longitude) return;

    let active = true;
    (async () => {
      try {
        const addr = await getAddressFromCoords(latitude, longitude);
        if (active && addr) setAddress(addr);
      } catch (e) {
        console.log("Reverse geocode error:", e);
      }
    })();
    return () => {
      active = false;
    };
  }, [location, lat, lng]);

  // Voucher list
  const vouchers = [
    { code: "SALE10", label: "Giảm 10%", type: "percent", value: 0.1 },
    { code: "SHIPFREE", label: "Miễn phí ship", type: "shipping" },
    { code: "OFF20K", label: "Giảm 20.000đ", type: "fixed", value: 20000 },
  ];

  // Tính giá
  const subtotal = parsedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let shippingFee = 0;
  let estimatedTime = 30; // Đổi tên biến này để không trùng với state shipTime

  if (deliveryMethod === "fast") {
    shippingFee = 25000; estimatedTime = 30;
  } else if (deliveryMethod === "standard") {
    shippingFee = 15000; estimatedTime = 45;
  } else if (deliveryMethod === "economy") {
    shippingFee = 10000; estimatedTime = 60;
  } else if (deliveryMethod === "express") {
    shippingFee = 40000; estimatedTime = 20;
  }
  let itemDiscount = 0,
    shippingDiscount = 0;
  if (voucher) {
    if (voucher.type === "percent") itemDiscount = subtotal * voucher.value;
    else if (voucher.type === "fixed") itemDiscount = Math.min(voucher.value, subtotal);
    else if (voucher.type === "shipping") shippingDiscount = shippingFee;
  }
  const totalPrice = subtotal - itemDiscount + shippingFee - shippingDiscount;

  // Render cart
  const renderCartItem = ({ item }) => (
    <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 8 }}>
      <Text>{item.title} x{item.quantity}</Text>
      <Text>{(item.price * item.quantity).toLocaleString()} đ</Text>
    </View>
  );

  // Header
  const ListHeader = () => (
    <>
      <Text style={{ fontSize: 20, fontWeight: "bold", padding: 10 }}>Thanh toán</Text>
      <View style={{ padding: 10, backgroundColor: "#f2f2f2", borderRadius: 8 }}>
        <Text style={{ fontWeight: "bold" }}>👤 Thông tin người nhận</Text>
        <TextInput
          placeholder="Họ và tên *"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          placeholder="Số điện thoại *"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
          <Pressable
            style={{
              backgroundColor: useDefaultAddress ? "#3dd9eaff" : "#ddd",
              padding: 8,
              borderRadius: 6,
              marginRight: 8,
            }}
            onPress={() => {
              setUseDefaultAddress(true);
              setAddress(defaultAddress);
            }}
          >
            <Text style={{ color: useDefaultAddress ? "#fff" : "#333" }}>Dùng địa chỉ mặc định</Text>
          </Pressable>
          <Pressable
            style={{
              backgroundColor: !useDefaultAddress ? "#3dd9eaff" : "#ddd",
              padding: 8,
              borderRadius: 6,
            }}
            onPress={() =>
              router.replace({
                pathname: "/map-select",
                params: { cart: JSON.stringify(parsedCart) },
              })
            }
          >
            <Text style={{ color: !useDefaultAddress ? "#fff" : "#333" }}>Chọn trên bản đồ</Text>
          </Pressable>
        </View>
        <TextInput
          placeholder="Địa chỉ giao hàng *"
          value={address}
          onChangeText={setAddress}
          multiline
          numberOfLines={3}
        />
        
      </View>
    </>
  );

  // Footer
  const ListFooter = () => (
    <>
      <View style={{ padding: 10 }}>
        <Text style={{ fontWeight: "bold" }}>🎟 Voucher</Text>
        <Pressable style={{ marginTop: 8, padding: 10, backgroundColor: "#ddd", borderRadius: 6 }} onPress={() => setShowVoucherModal(true)}>
          <Text>{voucher ? `${voucher.label}` : "Chọn voucher"}</Text>
        </Pressable>
      </View>
      <View style={{ padding: 10 }}>
        <Text style={{ fontWeight: "bold" }}>🚚 Hình thức giao hàng</Text>
        <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
          <Pressable onPress={() => setDeliveryMethod("fast")}>
            <Text style={{ color: deliveryMethod === "fast" ? "blue" : "black" }}>Nhanh (25k)</Text>
          </Pressable>
          <Pressable onPress={() => setDeliveryMethod("standard")}>
            <Text style={{ color: deliveryMethod === "standard" ? "blue" : "black" }}>Tiêu chuẩn (15k)</Text>
          </Pressable>
          <Pressable onPress={() => setDeliveryMethod("economy")}>
            <Text style={{ color: deliveryMethod === "economy" ? "blue" : "black" }}>Tiết kiệm (10k)</Text>
          </Pressable>
          <Pressable onPress={() => setDeliveryMethod("express")}>
            <Text style={{ color: deliveryMethod === "express" ? "blue" : "black" }}>Siêu tốc (40k)</Text>
          </Pressable>
        </View>
      </View>
      <View style={{ padding: 10 }}>
        <Text style={{ fontWeight: "bold" }}>💳 Phương thức thanh toán</Text>
        <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
          {["cash", "qr", "card"].map((m) => (
            <Pressable key={m} onPress={() => setPaymentMethod(m)}>
              <Text style={{ color: paymentMethod === m ? "blue" : "black" }}>
                {m === "cash" ? "💵 Tiền mặt" : m === "qr" ? "📱 QR Code" : "💳 Thẻ"}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      {assignedDriver && (
        <View style={{ padding: 10 }}>
          <Text style={{ fontWeight: "bold" }}>🧑‍✈️ Tài xế</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image source={assignedDriver.image} style={{ width: 50, height: 50, borderRadius: 25 }} />
            <View style={{ marginLeft: 12 }}>
              <Text>
                {assignedDriver.name} ({assignedDriver.vehicle})
              </Text>
              <Text>⭐ {assignedDriver.rating}</Text>
            </View>
          </View>
        </View>
      )}
    </>
  );

  useEffect(() => {
    AsyncStorage.getItem('isLoggedIn').then(val => {
      if (val !== 'true') {
        router.replace({
          pathname: '/login',
          params: { cart: JSON.stringify(parsedCart), location: JSON.stringify(parsedLocation) }
        })
      }
    })
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={parsedCart}
        keyExtractor={(item, idx) => (item.id ? `${item.id}` : `${idx}`)}
        renderItem={renderCartItem}
        ListHeaderComponent={<ListHeader />}
        ListFooterComponent={<ListFooter />}
        ListEmptyComponent={<Text style={{ padding: 16 }}>Giỏ hàng trống</Text>}
        contentContainerStyle={{ paddingBottom: 180 }}
      />

      <View style={{ padding: 20 }}>
        <Text>Địa chỉ: {address || "Chưa chọn"}</Text>
        <Text>Thời tiết: {weather?.weather?.[0]?.description || "Chưa có dữ liệu"}</Text>
        <Text>Giá ship: {shipPrice} VND</Text>
        <Text>Thời gian dự kiến: {estimatedTime} phút</Text>
      </View>

      <View style={{ padding: 20, borderTopWidth: 1, borderColor: "#ddd" }}>
        <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
          Tổng cộng: {totalPrice.toLocaleString()} đ
        </Text>
        <Pressable
          style={{ backgroundColor: "#3dd9eaff", padding: 12, borderRadius: 6 }}
          onPress={async () => {
            if (!fullName.trim()) return Alert.alert("Lỗi", "Vui lòng nhập họ tên");
            if (!phone.trim()) return Alert.alert("Lỗi", "Vui lòng nhập số điện thoại");
            if (!address.trim()) return Alert.alert("Lỗi", "Vui lòng nhập địa chỉ");
            if (parsedCart.length === 0) return Alert.alert("Lỗi", "Giỏ hàng trống");

            // Tạo đơn hàng mới
            const orderId = `FF${Date.now()}`;
            const newOrder = {
              id: orderId,
              restaurantName: parsedCart[0]?.restaurantName || "Nhà hàng",
              items: parsedCart,
              totalPrice,
              status: "Đang giao",
              address,
              createdAt: new Date().toISOString(),
            };

            // Lưu vào shippingOrders
            try {
              const shippingOrders = await AsyncStorage.getItem('shippingOrders');
              const orders = shippingOrders ? JSON.parse(shippingOrders) : [];
              orders.push(newOrder);
              await AsyncStorage.setItem('shippingOrders', JSON.stringify(orders));
            } catch (e) {
              console.log("Lưu đơn hàng lỗi:", e);
            }

            Alert.alert(
              "🎉 Đặt hàng thành công!",
              `Đơn hàng #${orderId} sẽ giao đến ${address}.\nTổng tiền: ${totalPrice.toLocaleString()} đ`,
              [{ text: "OK", onPress: () => router.replace("/") }]
            );
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>Đặt hàng</Text>
        </Pressable>
      </View>

      {/* Modal voucher */}
      <Modal visible={showVoucherModal} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center" }}>
          <View style={{ backgroundColor: "white", margin: 20, padding: 20, borderRadius: 8 }}>
            <Text style={{ fontWeight: "bold" }}>Chọn voucher</Text>
            {vouchers.map((v) => (
              <TouchableOpacity
                key={v.code}
                style={{ padding: 10 }}
                onPress={() => {
                  setVoucher(v);
                  setShowVoucherModal(false);
                }}
              >
                <Text>{v.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowVoucherModal(false)} style={{ padding: 10 }}>
              <Text>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal QR Code */}
      <Modal visible={showQRModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Quét mã QR để thanh toán</Text>
            {/* Demo QR code, bạn có thể dùng hình ảnh QR code mẫu */}
            <Image
              source={qrImage}
              style={{ width: 180, height: 180, alignSelf: "center", marginBottom: 16 }}
            />
            <Text style={{ textAlign: "center", marginBottom: 12 }}>
              Vui lòng dùng app ngân hàng hoặc ví điện tử để quét mã và thanh toán.
            </Text>
            <Pressable
              style={styles.payButton}
              onPress={() => {
                setShowQRModal(false);
                Alert.alert(
                  "🎉 Đặt hàng thành công!",
                  `Đơn hàng sẽ giao đến ${address}.\nTổng tiền: ${totalPrice.toLocaleString()} đ`,
                  [{ text: "OK", onPress: () => router.replace("/") }]
                );
              }}
            >
              <Text style={styles.payButtonText}>Xác nhận đã thanh toán</Text>
            </Pressable>
            <Pressable style={styles.closeModal} onPress={() => setShowQRModal(false)}>
              <Text style={{ color: "#3dd9eaff" }}>Đóng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal Thẻ */}
      <Modal visible={showCardModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Thanh toán bằng thẻ</Text>
            <TextInput
              style={styles.input}
              placeholder="Số thẻ"
              keyboardType="number-pad"
              maxLength={16}
            />
            <TextInput
              style={styles.input}
              placeholder="Tên chủ thẻ"
            />
            <TextInput
              style={styles.input}
              placeholder="Ngày hết hạn (MM/YY)"
              maxLength={5}
            />
            <TextInput
              style={styles.input}
              placeholder="CVV"
              keyboardType="number-pad"
              maxLength={3}
            />
            <Pressable
              style={styles.payButton}
              onPress={() => {
                setShowCardModal(false);
                Alert.alert(
                  "🎉 Đặt hàng thành công!",
                  `Đơn hàng sẽ giao đến ${address}.\nTổng tiền: ${totalPrice.toLocaleString()} đ`,
                  [{ text: "OK", onPress: () => router.replace("/") }]
                );
              }}
            >
              <Text style={styles.payButtonText}>Thanh toán</Text>
            </Pressable>
            <Pressable style={styles.closeModal} onPress={() => setShowCardModal(false)}>
              <Text style={{ color: "#3dd9eaff" }}>Đóng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}


// ========== STYLE (giữ gần giống của bạn) ==========
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 16, padding: 16 },
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
  textArea: { height: 80, textAlignVertical: "top" },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  itemName: { fontSize: 16 },
  itemPrice: { fontSize: 16, fontWeight: "600", color: "#e53935" },
  voucherButton: { padding: 12, backgroundColor: "#f0f0f0", borderRadius: 6, alignItems: "center" },
  methodButton: {
    borderWidth: 1,
    borderColor: "#aaa",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  methodText: { color: "#333" },
  methodActive: { backgroundColor: "#3dd9eaff", borderColor: "#3dd9eaff" },
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalText: { fontSize: 18, fontWeight: "bold" },
  payButton: {
    backgroundColor: "#3dd9eaff",
    paddingVertical: 12,
    paddingHorizontal: 20,
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
  confirmBtn: {
    backgroundColor: "green",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    margin: 20,
  },
});

const QR_IMAGES = [
  require("../assets/images/QRCode/QR1.jpg"),
  require("../assets/images/QRCode/QR2.jpg"),
];
