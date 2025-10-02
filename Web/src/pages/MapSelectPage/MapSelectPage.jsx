import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// fix icon leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function LocationPicker({ setSelected }) {
  useMapEvents({
    click(e) {
      setSelected(e.latlng);
    },
  });
  return null;
}

export default function MapSelectPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState({ lat: 10.762622, lng: 106.660172 }); // trung tâm HCM

  const handleConfirm = () => {
    // Giả lập chuyển lat/lng thành địa chỉ
    const mockAddress = `Toạ độ (${selected.lat.toFixed(4)}, ${selected.lng.toFixed(4)})`;
    navigate("/checkout", { state: { newAddress: mockAddress } });
  };

  return (
    <div style={{ height: "100vh" }}>
      <header style={{ padding: "10px", fontWeight: "bold" }}>map-select</header>
      <MapContainer
        center={selected}
        zoom={13}
        style={{ height: "80%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={selected}></Marker>
        <LocationPicker setSelected={setSelected} />
      </MapContainer>

      <div style={{ padding: "10px", textAlign: "center" }}>
        <p>Chọn vị trí trên bản đồ, sau đó Xác nhận:</p>
        <button
          style={{
            background: "#00cfe8",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          onClick={handleConfirm}
        >
          Xác nhận vị trí
        </button>
      </div>
    </div>
  );
}