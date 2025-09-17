import React from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function CheckoutScreen() {
  const router = useRouter();
  const { cart } = useLocalSearchParams();

  // Parse cart từ params (chuỗi JSON -> object)
  const parsedCart = cart ? JSON.parse(cart) : [];

  const totalPrice = parsedCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thanh toán</Text>

      <FlatList
        data={parsedCart}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
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

      <View style={styles.footer}>
        <Text style={styles.totalText}>
          Tổng cộng: {totalPrice.toLocaleString()} đ
        </Text>
        <Pressable
          style={styles.payButton}
          onPress={() => alert("Thanh toán thành công!")}
        >
          <Text style={styles.payButtonText}>Đặt hàng</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  itemName: {
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e53935",
  },
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
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  payButton: {
    backgroundColor: "#00b14f",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
