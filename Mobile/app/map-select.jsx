import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native'
import MapView, { Marker, UrlTile } from 'react-native-maps'
import { useRouter, useLocalSearchParams } from 'expo-router'
import * as Location from 'expo-location'
import { searchAddress, getAddressFromCoords } from '@shared/services/weatherService'
import { useLocation } from '@shared/context/LocationContext'
import colors from '@shared/theme/colors'

export default function MapSelectScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  
  //Lấy setSelectedLocation từ context
  const { setSelectedLocation: setGlobalLocation } = useLocation()
  
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [region, setRegion] = useState({
    latitude: parseFloat(params.currentLat) || 10.7769,
    longitude: parseFloat(params.currentLng) || 106.7009,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  })
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState(params.currentAddress || '')

  // Get current location
  useEffect(() => {
    const getLocation = async () => {
      // Nếu đã có lat/lng từ params, dùng luôn
      if (params.currentLat && params.currentLng) {
        setSelectedLocation({
          latitude: parseFloat(params.currentLat),
          longitude: parseFloat(params.currentLng),
        })
        return
      }

      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Lỗi', 'Cần cấp quyền truy cập vị trí!')
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      const { latitude, longitude } = location.coords

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      })

      setSelectedLocation({ latitude, longitude })

      if (!params.currentAddress) {
        const result = await getAddressFromCoords(latitude, longitude)
        if (result.success) {
          setSelectedAddress(result.address)
        }
      }
    }

    getLocation()
  }, [])

  const handleSearch = async () => {
    if (!searchText.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ cần tìm')
      return
    }

    setIsSearching(true)
    const result = await searchAddress(searchText)
    setIsSearching(false)

    if (result.success) {
      setSearchResults(result.results)
    } else {
      Alert.alert('Lỗi', result.error)
    }
  }

  const handleSelectResult = async (item) => {
    setRegion({
      latitude: item.latitude,
      longitude: item.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    })

    setSelectedLocation({
      latitude: item.latitude,
      longitude: item.longitude,
    })

    setSelectedAddress(item.displayName)
    setSearchResults([])
    setSearchText('')
  }

  const handleMapPress = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate

    setSelectedLocation({ latitude, longitude })

    const result = await getAddressFromCoords(latitude, longitude)
    if (result.success) {
      setSelectedAddress(result.address)
    }
  }

  // Confirm location - LƯU VÀO CONTEXT
  const handleConfirm = () => {
    if (!selectedLocation) {
      Alert.alert('Lỗi', 'Vui lòng chọn vị trí trên bản đồ')
      return
    }

    // Lưu vào global context
    setGlobalLocation({
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      address: selectedAddress,
    })

    // Quay về checkout
    router.back()
  }

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm địa chỉ..."
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        <Pressable 
          style={styles.searchBtn} 
          onPress={handleSearch}
          disabled={isSearching}
        >
          <Text style={styles.searchBtnText}>
            {isSearching ? '...' : '🔍'}
          </Text>
        </Pressable>
      </View>

      {/* Search results */}
      {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={(item, index) => index.toString()}
          style={styles.resultsList}
          renderItem={({ item }) => (
            <Pressable
              style={styles.resultItem}
              onPress={() => handleSelectResult(item)}
            >
              <Text style={styles.resultText} numberOfLines={2}>
                📍 {item.displayName}
              </Text>
            </Pressable>
          )}
        />
      )}

      {/* Map */}
      <MapView
        style={styles.map}
        region={region}
        onPress={handleMapPress}
        showsUserLocation
        showsMyLocationButton
      >
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
        />

        {selectedLocation && (
          <Marker coordinate={selectedLocation} />
        )}
      </MapView>

      {/* Selected address */}
      {selectedAddress && (
        <View style={styles.addressBox}>
          <Text style={styles.addressLabel}>Địa chỉ đã chọn:</Text>
          <Text style={styles.addressText} numberOfLines={3}>
            {selectedAddress}
          </Text>
        </View>
      )}

      {/* Confirm button */}
      <Pressable style={styles.confirmBtn} onPress={handleConfirm}>
        <Text style={styles.confirmText}>Xác nhận vị trí</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
  },
  searchBtn: {
    width: 48,
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBtnText: {
    fontSize: 20,
  },
  resultsList: {
    maxHeight: 200,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultText: {
    fontSize: 14,
    color: colors.text,
  },
  map: {
    flex: 1,
  },
  addressBox: {
    position: 'absolute',
    top: 80,
    left: 12,
    right: 12,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addressLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  confirmBtn: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
