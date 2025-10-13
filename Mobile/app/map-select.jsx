import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, Alert } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, UrlTile } from "react-native-maps";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Location from "expo-location";
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function MapSelectScreen() {
  const router = useRouter();
  const { cart } = useLocalSearchParams();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [region, setRegion] = useState({
    latitude: 10.7769,
    longitude: 106.7009,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  // Tìm kiếm địa chỉ bằng OSM Nominatim
  const handleSearch = async () => {
    if (!searchText) return;
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.length > 0) {
        const loc = {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        };
        setRegion({ ...region, ...loc });
        setSelectedLocation(loc);
      } else {
        Alert.alert("Không tìm thấy địa chỉ");
      }
    } catch (e) {
      Alert.alert("Lỗi tìm kiếm địa chỉ");
    }
  };

  // Định vị vị trí hiện tại
  const handleLocateMe = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Không có quyền truy cập vị trí");
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    const loc = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    setRegion({ ...region, ...loc });
    setSelectedLocation(loc);
  };

  return (
    <View style={styles.container}>
      {/* Tìm kiếm địa chỉ và nút định vị */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Nhập địa chỉ cần tìm"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Pressable style={styles.searchBtn} onPress={handleSearch}>
          <Text style={{ color: "#fff" }}>Tìm</Text>
        </Pressable>
        <Pressable style={styles.locateBtn} onPress={handleLocateMe}>
          <Text style={{ color: "#fff" }}>Vị trí của tôi</Text>
        </Pressable>
      </View>

      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        region={region}
        onPress={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
      >
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
        />
        {selectedLocation && <Marker coordinate={selectedLocation} />}
      </MapView>

      <View style={styles.footer}>
        {selectedLocation ? (
          <Text>
            Vị trí: {selectedLocation.latitude.toFixed(5)}, {selectedLocation.longitude.toFixed(5)}
          </Text>
        ) : (
          <Text>Chọn vị trí trên bản đồ</Text>
        )}

        <Pressable
          style={styles.confirmBtn}
          onPress={() => {
            if (selectedLocation) {
              router.replace({
                pathname: "/checkout",
                params: {
                  cart, // truyền lại cart từ params
                  lat: selectedLocation.latitude,
                  lng: selectedLocation.longitude,
                },
              });
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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    zIndex: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    backgroundColor: "#f9f9f9",
  },
  searchBtn: {
    backgroundColor: "#3dd9eaff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  locateBtn: {
    backgroundColor: "#007aff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  map: { flex: 1 },
  footer: {
    padding: 10,
    backgroundColor: "#fff",
  },
  confirmBtn: {
    marginTop: 10,
    backgroundColor: "#3dd9eaff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});
