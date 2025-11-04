import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  searchAddress, 
  getAddressFromCoords,
  getCurrentLocation 
} from '../../../../shared/services/weatherService';
import { locationService } from '../../utils/locationService';
import './MapSelectPage.css';

// Fix icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition, setAddress }) {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      setPosition({ latitude: lat, longitude: lng });
      
      // Sử dụng weatherService
      const result = await getAddressFromCoords(lat, lng);
      if (result.success) {
        setAddress(result.address);
      }
    },
  });

  return position ? (
    <Marker position={[position.latitude, position.longitude]} />
  ) : null;
}

export default function MapSelectPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLat, currentLng, currentAddress } = location.state || {};

  const [position, setPosition] = useState(
    currentLat && currentLng
      ? { latitude: parseFloat(currentLat), longitude: parseFloat(currentLng) }
      : null
  );
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [address, setAddress] = useState(currentAddress || '');
  const [isSearching, setIsSearching] = useState(false);
  const [center, setCenter] = useState([
    currentLat ? parseFloat(currentLat) : 10.7769,
    currentLng ? parseFloat(currentLng) : 106.7009,
  ]);

  // Lấy vị trí hiện tại khi load (nếu chưa có)
  useEffect(() => {
    const loadCurrentLocation = async () => {
      if (!position) {
        const result = await getCurrentLocation(locationService);
        
        if (result.success) {
          const { latitude, longitude } = result.location;
          setPosition({ latitude, longitude });
          setCenter([latitude, longitude]);
          
          // Lấy địa chỉ
          const addressResult = await getAddressFromCoords(latitude, longitude);
          if (addressResult.success) {
            setAddress(addressResult.address);
          }
        } else {
          console.error('Get location error:', result.error);
        }
      }
    };

    loadCurrentLocation();
  }, []);

  // Tìm kiếm địa chỉ
  const handleSearch = async () => {
    if (!searchText.trim()) {
      alert('Vui lòng nhập địa chỉ cần tìm');
      return;
    }

    setIsSearching(true);
    const result = await searchAddress(searchText);
    setIsSearching(false);

    if (result.success) {
      setSearchResults(result.results);
    } else {
      alert(result.error);
    }
  };

  const handleSelectResult = (item) => {
    setPosition({ latitude: item.latitude, longitude: item.longitude });
    setCenter([item.latitude, item.longitude]);
    setAddress(item.displayName);
    setSearchResults([]);
    setSearchText('');
  };

  const handleConfirm = () => {
    if (!position) {
      alert('Vui lòng chọn vị trí trên bản đồ');
      return;
    }

    // Quay về checkout với location đã chọn
    navigate('/checkout', {
      state: {
        selectedLocation: {
          latitude: position.latitude,
          longitude: position.longitude,
          address: address,
        },
      },
    });
  };

  return (
    <div className="map-select-container">
      {/* Search bar */}
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Tìm kiếm địa chỉ..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button 
          className="search-btn" 
          onClick={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? '...' : '🔍'}
        </button>
      </div>

      {/* Search results */}
      {searchResults.length > 0 && (
        <div className="results-list">
          {searchResults.map((item, index) => (
            <div
              key={index}
              className="result-item"
              onClick={() => handleSelectResult(item)}
            >
              <p className="result-text">📍 {item.displayName}</p>
            </div>
          ))}
        </div>
      )}

      {/* Map */}
      <MapContainer center={center} zoom={15} className="map" key={center.join(',')}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <LocationMarker
          position={position}
          setPosition={setPosition}
          setAddress={setAddress}
        />
      </MapContainer>

      {/* Selected address */}
      {address && (
        <div className="address-box">
          <p className="address-label">Địa chỉ đã chọn:</p>
          <p className="address-text">{address}</p>
        </div>
      )}

      {/* Confirm button */}
      <button className="confirm-btn" onClick={handleConfirm}>
        Xác nhận vị trí
      </button>
    </div>
  );
}