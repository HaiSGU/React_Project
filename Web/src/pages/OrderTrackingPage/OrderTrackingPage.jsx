import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

import {
    generateShipperRoute,
    getCurrentShipperPosition,
    formatTimeRemaining,
} from '@shared/services/trackingService';
import { formatPrice } from '@shared/utils/formatters';
import './OrderTrackingPage.css';

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom shipper icon
const shipperIcon = L.divIcon({
    className: 'custom-shipper-icon',
    html: '<div class="shipper-marker">🏍️</div>',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
});

// Map auto-center component
function MapCenter({ position }) {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.flyTo([position.latitude, position.longitude], 15, {
                duration: 1,
            });
        }
    }, [position, map]);

    return null;
}

export default function OrderTrackingPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const orderId = searchParams.get('orderId');
    const [order, setOrder] = useState(null);
    const [shipperPosition, setShipperPosition] = useState(null);
    const [progress, setProgress] = useState(0);
    const [estimatedTime, setEstimatedTime] = useState(0);
    const [waypoints, setWaypoints] = useState([]);
    const [orderStatus, setOrderStatus] = useState('shipping');

    // Restaurant and delivery coordinates
    const restaurantLocation = {
        latitude: 10.7769,
        longitude: 106.7009,
    };

    const [deliveryLocation, setDeliveryLocation] = useState({
        latitude: 10.7869,
        longitude: 106.7109,
    });

    useEffect(() => {
        if (!orderId) return;

        const loadOrder = async () => {
            console.log('🔍 Loading order with ID:', orderId);

            // Try to find in localStorage first
            const shippingOrders = JSON.parse(localStorage.getItem('shippingOrders') || '[]');
            const deliveredOrders = JSON.parse(localStorage.getItem('deliveredOrders') || '[]');
            const allOrders = [...shippingOrders, ...deliveredOrders];

            console.log('📦 Orders in localStorage:', allOrders.length);

            let foundOrder = allOrders.find(o => o.id.toString() === orderId);

            // If not found, try to fetch from server
            if (!foundOrder) {
                console.log('🌐 Not in localStorage, fetching from server...');
                try {
                    const response = await fetch(`http://localhost:3000/orders/${orderId}`);
                    if (response.ok) {
                        foundOrder = await response.json();
                        console.log('✅ Found order from server:', foundOrder);
                    }
                } catch (error) {
                    console.error('❌ Server fetch error:', error);
                }
            }

            if (foundOrder) {
                console.log('✅ Using order:', foundOrder);
                setOrder(foundOrder);

                // Update delivery location
                let finalDeliveryLat = 10.7869;
                let finalDeliveryLng = 106.7109;

                if (foundOrder.delivery?.location) {
                    finalDeliveryLat = parseFloat(foundOrder.delivery.location.latitude);
                    finalDeliveryLng = parseFloat(foundOrder.delivery.location.longitude);
                }

                setDeliveryLocation({
                    latitude: finalDeliveryLat,
                    longitude: finalDeliveryLng,
                });

                // Generate route
                const route = generateShipperRoute(
                    restaurantLocation.latitude,
                    restaurantLocation.longitude,
                    finalDeliveryLat,
                    finalDeliveryLng,
                    30
                );
                setWaypoints(route);

                // Start tracking
                const startTime = Date.now();
                const interval = setInterval(() => {
                    const tracking = getCurrentShipperPosition(route, startTime);

                    if (tracking) {
                        setShipperPosition(tracking.position);
                        setProgress(tracking.progress);
                        setEstimatedTime(tracking.estimatedTime);
                        setOrderStatus(tracking.status);

                        if (tracking.status === 'completed') {
                            clearInterval(interval);
                            setTimeout(() => navigate('/cart'), 2000);
                        }
                    }
                }, 1000);

                return () => clearInterval(interval);
            } else {
                console.error('❌ Order not found:', orderId);
            }
        };

        loadOrder();
    }, [orderId, navigate]);

    if (!order) {
        return (
            <div className="tracking-error">
                <h2>Đang tải thông tin đơn hàng...</h2>
                <button onClick={() => navigate('/cart')}>Quay lại</button>
            </div>
        );
    }

    return (
        <div className="order-tracking-page">
            <header className="tracking-header">
                <button className="back-btn" onClick={() => navigate('/cart')}>
                    ← Quay lại
                </button>
                <h1>Theo dõi đơn hàng #{order.id}</h1>
            </header>

            <div className="tracking-content">
                <div className="map-container">
                    <MapContainer
                        center={[restaurantLocation.latitude, restaurantLocation.longitude]}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        />

                        <Marker position={[restaurantLocation.latitude, restaurantLocation.longitude]}>
                            <Popup>
                                <strong>Nhà hàng</strong><br />
                                {order.restaurantName || 'Restaurant'}
                            </Popup>
                        </Marker>

                        <Marker position={[deliveryLocation.latitude, deliveryLocation.longitude]}>
                            <Popup>
                                <strong>Địa chỉ giao hàng</strong><br />
                                {order.delivery?.address || 'Delivery address'}
                            </Popup>
                        </Marker>

                        {shipperPosition && (
                            <Marker
                                position={[shipperPosition.latitude, shipperPosition.longitude]}
                                icon={shipperIcon}
                            >
                                <Popup>
                                    <strong>Shipper</strong><br />
                                    Đang giao hàng
                                </Popup>
                            </Marker>
                        )}

                        {waypoints.length > 0 && (
                            <Polyline
                                positions={waypoints.map(w => [w.latitude, w.longitude])}
                                color="#3dd9eaff"
                                weight={3}
                                opacity={0.7}
                                dashArray="5, 10"
                            />
                        )}

                        {shipperPosition && <MapCenter position={shipperPosition} />}
                    </MapContainer>
                </div>

                <div className="info-sidebar">
                    <div className="progress-section">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <p className="progress-text">{Math.round(progress)}%</p>
                    </div>

                    <div className={`status-badge ${orderStatus}`}>
                        <span className="status-icon">
                            {orderStatus === 'completed' ? '✅' : '🚚'}
                        </span>
                        <span className="status-text">
                            {orderStatus === 'completed'
                                ? 'Đã giao thành công!'
                                : `Đang giao - còn ${formatTimeRemaining(estimatedTime)}`}
                        </span>
                    </div>

                    <div className="details-card">
                        <h3>Thông tin đơn hàng</h3>
                        <div className="detail-row">
                            <span className="label">Mã đơn:</span>
                            <span className="value">#{order.id}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">Nhà hàng:</span>
                            <span className="value">{order.restaurantName || 'N/A'}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">Tổng tiền:</span>
                            <span className="value">
                                {formatPrice(order.totalPrice || order.total || 0)}đ
                            </span>
                        </div>
                        <div className="detail-row">
                            <span className="label">Địa chỉ:</span>
                            <span className="value address">
                                {order.delivery?.address || 'N/A'}
                            </span>
                        </div>
                    </div>

                    <div className="contact-buttons">
                        <button className="contact-btn">📞 Gọi shipper</button>
                        <button className="contact-btn">💬 Nhắn tin</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
