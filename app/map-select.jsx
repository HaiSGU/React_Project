import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, UrlTile } from "react-native-maps";
import { useRouter } from "expo-router";

export default function MapSelectScreen() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT} // 👈 dùng OSM thay vì Google
        initialRegion={{
          latitude: 10.7769, // HCM mặc định
          longitude: 106.7009,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onPress={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
      >
        {/* Layer OSM */}
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
        />

        {selectedLocation && <Marker coordinate={selectedLocation} />}
      </MapView>

      <View style={styles.footer}>
        {selectedLocation ? (
          <Text>
            Vị trí: {selectedLocation.latitude.toFixed(5)},{" "}
            {selectedLocation.longitude.toFixed(5)}
          </Text>
        ) : (
          <Text>Chọn vị trí trên bản đồ</Text>
        )}

        <Pressable
          style={styles.confirmBtn}
          onPress={() => {
            if (selectedLocation) {
              // 👉 Quay lại checkout, không tạo trang mới
              router.replace(
                `/checkout?lat=${selectedLocation.latitude}&lng=${selectedLocation.longitude}`
              );
            }
          }}
        >
          <Text style={{ color: "#fff" }}>Xác nhận vị trí</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  footer: {
    padding: 10,
    backgroundColor: "#fff",
  },
  confirmBtn: {
    marginTop: 10,
    backgroundColor: "#00b14f",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});
