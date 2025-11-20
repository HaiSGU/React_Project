import { useEffect, useState } from 'react';
import {
    getAdminOverview,
    getRestaurants,
    updateRestaurantStatus,
    getUsers,
    updateUserStatus
} from '../../../../shared/services/adminMetricsService';
import { logoutAdmin, getAdminSession } from '../../../../shared/services/adminAuthService';
import { useRealtimeOrders, useEventListener } from '@shared/hooks/useRealtime';
import { updateShipperStatus, getShipperStats, initShippers } from '@shared/services/shipperService';
import initAdminData from '@shared/services/initAdminData';
import NotificationBell from '../../components/NotificationBell/NotificationBell';
import AdminStatCard from '../../components/Admin/AdminStatCard';
import '../../components/Admin/Admin.css';
import './AdminDashboard.css';
import eventBus, { EVENT_TYPES } from '@shared/services/eventBus';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [restaurants, setRestaurants] = useState([]);
    const [users, setUsers] = useState([]);
    const [shippers, setShippers] = useState([]);
    const [toast, setToast] = useState(null);
    const [animatingRow, setAnimatingRow] = useState(null);

    // Restaurant CRUD states
    const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState(false);
    const [restaurantMode, setRestaurantMode] = useState('add');
    const [editingRestaurantId, setEditingRestaurantId] = useState(null);
    const [restaurantForm, setRestaurantForm] = useState({
        name: '',
        address: '',
        category: 'fastfood',
        rating: 4.5,
        image: '/images/restaurants/default.jpg',
        status: 'active',
        isFeatured: false
    });

    // Menu CRUD states
    const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
    const [currentRestaurant, setCurrentRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [isMenuItemModalOpen, setIsMenuItemModalOpen] = useState(false);
    const [menuItemMode, setMenuItemMode] = useState('add');
    const [editingMenuItemId, setEditingMenuItemId] = useState(null);
    const [menuItemForm, setMenuItemForm] = useState({
        name: '',
        price: '',
        category: 'Đồ ăn',
        image: '/images/menu/default.jpg'
    });

    const session = getAdminSession(sessionStorage);
    const { lastUpdate } = useRealtimeOrders();

    const refresh = async () => {
        initAdminData(localStorage, false);
        initShippers(localStorage);
        const overview = getAdminOverview(localStorage);
        setStats(overview);

        try {
            const res = await fetch('http://localhost:3000/restaurants');
            if (res.ok) {
                const data = await res.json();
                setRestaurants(data);
                localStorage.setItem('restaurants', JSON.stringify(data));
            } else {
                setRestaurants(getRestaurants(localStorage));
            }
        } catch (e) {
            setRestaurants(getRestaurants(localStorage));
        }

        setUsers(getUsers(localStorage));
        const shipperStatsData = getShipperStats(localStorage);
        setShippers(shipperStatsData.shippers || []);
    };

    useEffect(() => {
        if (lastUpdate) refresh();
    }, [lastUpdate]);

    useEffect(() => {
        refresh();
    }, []);

    useEventListener(EVENT_TYPES.RESTAURANT_STATUS_CHANGED, refresh);

    const showToast = (msg, type = 'success') => {
        setToast({ message: msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Restaurant CRUD handlers
    const openRestaurantModal = (mode, restaurant = null) => {
        setRestaurantMode(mode);
        if (mode === 'edit' && restaurant) {
            setEditingRestaurantId(restaurant.id);
            setRestaurantForm(restaurant);
        } else {
            setEditingRestaurantId(null);
            setRestaurantForm({
                name: '',
                address: '',
                category: 'fastfood',
                rating: 4.5,
                image: '/images/restaurants/default.jpg',
                status: 'active',
                isFeatured: false
            });
        }
        setIsRestaurantModalOpen(true);
    };

    const handleSubmitRestaurant = async (e) => {
        e.preventDefault();
        try {
            const url = restaurantMode === 'add'
                ? 'http://localhost:3000/restaurants'
                : `http://localhost:3000/restaurants/${editingRestaurantId}`;
            const method = restaurantMode === 'add' ? 'POST' : 'PUT';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...restaurantForm, rating: parseFloat(restaurantForm.rating) })
            });

            if (res.ok) {
                showToast(`✅ ${restaurantMode === 'add' ? 'Thêm' : 'Cập nhật'} nhà hàng thành công!`);
                setIsRestaurantModalOpen(false);
                eventBus.emit(EVENT_TYPES.RESTAURANT_STATUS_CHANGED, { action: restaurantMode });
                refresh();
            } else {
                throw new Error('API error');
            }
        } catch (e) {
            showToast('❌ Lỗi khi lưu nhà hàng', 'error');
        }
    };

    const handleDeleteRestaurant = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa nhà hàng này? Tất cả menu của nhà hàng cũng sẽ bị xóa.')) return;
        try {
            // Bước 1: Fetch tất cả menu items của nhà hàng
            const menuRes = await fetch(`http://localhost:3000/menus?restaurantId=${id}`);
            if (menuRes.ok) {
                const menuItems = await menuRes.json();

                // Bước 2: Xóa từng menu item
                for (const item of menuItems) {
                    await fetch(`http://localhost:3000/menus/${item.id}`, { method: 'DELETE' });
                }

                showToast(`🗑️ Đã xóa ${menuItems.length} món ăn`);
            }

            // Bước 3: Xóa nhà hàng
            const res = await fetch(`http://localhost:3000/restaurants/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('✅ Xóa nhà hàng thành công');
                eventBus.emit(EVENT_TYPES.RESTAURANT_STATUS_CHANGED, { action: 'delete', restaurantId: id });
                refresh();
            } else {
                throw new Error('Delete failed');
            }
        } catch (e) {
            showToast('❌ Lỗi khi xóa nhà hàng', 'error');
        }
    };

    const handleRestaurantStatusChange = async (restaurantId, newStatus) => {
        setAnimatingRow(`restaurant-${restaurantId}`);
        try {
            const res = await fetch(`http://localhost:3000/restaurants/${restaurantId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (!res.ok) throw new Error('API error');
            showToast('✅ Đã cập nhật trạng thái nhà hàng!');
            eventBus.emit(EVENT_TYPES.RESTAURANT_STATUS_CHANGED, { restaurantId, status: newStatus });
            refresh();
        } catch (e) {
            showToast(`❌ Lỗi: ${e.message}`, 'error');
        }
        setTimeout(() => setAnimatingRow(null), 500);
    };

    // Menu CRUD handlers
    const handleOpenMenu = async (restaurant) => {
        setCurrentRestaurant(restaurant);
        try {
            const res = await fetch(`http://localhost:3000/menus?restaurantId=${restaurant.id}`);
            if (res.ok) {
                const data = await res.json();
                setMenuItems(data);
                setIsMenuModalOpen(true);
            } else {
                showToast('❌ Không thể tải menu', 'error');
            }
        } catch (e) {
            showToast('❌ Lỗi kết nối', 'error');
        }
    };

    const openMenuItemModal = (mode, item = null) => {
        setMenuItemMode(mode);
        if (mode === 'edit' && item) {
            setEditingMenuItemId(item.id);
            setMenuItemForm(item);
        } else {
            setEditingMenuItemId(null);
            setMenuItemForm({
                name: '',
                price: '',
                category: 'Đồ ăn',
                image: '/images/menu/default.jpg'
            });
        }
        setIsMenuItemModalOpen(true);
    };

    const handleSubmitMenuItem = async (e) => {
        e.preventDefault();
        try {
            const url = menuItemMode === 'add'
                ? 'http://localhost:3000/menus'
                : `http://localhost:3000/menus/${editingMenuItemId}`;
            const method = menuItemMode === 'add' ? 'POST' : 'PUT';

            const body = {
                ...menuItemForm,
                price: Number(menuItemForm.price),
                restaurantId: currentRestaurant.id
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                showToast(`✅ ${menuItemMode === 'add' ? 'Thêm' : 'Cập nhật'} món ăn thành công!`);
                setIsMenuItemModalOpen(false);

                // Broadcast event
                eventBus.emit(EVENT_TYPES.MENU_UPDATED, {
                    restaurantId: currentRestaurant.id,
                    action: menuItemMode
                });

                const r = await fetch(`http://localhost:3000/menus?restaurantId=${currentRestaurant.id}`);
                const data = await r.json();
                setMenuItems(data);
            } else {
                throw new Error('Save failed');
            }
        } catch (e) {
            showToast('❌ Lỗi khi lưu món ăn', 'error');
        }
    };

    const handleDeleteMenuItem = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa món ăn này?')) return;
        try {
            const res = await fetch(`http://localhost:3000/menus/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('✅ Xóa món ăn thành công');

                // Broadcast event
                eventBus.emit(EVENT_TYPES.MENU_UPDATED, {
                    restaurantId: currentRestaurant.id,
                    action: 'delete'
                });

                setMenuItems(menuItems.filter(i => i.id !== id));
            } else {
                throw new Error('Delete failed');
            }
        } catch (e) {
            showToast('❌ Lỗi khi xóa món ăn', 'error');
        }
    };

    const handleUserStatusChange = (username, banned) => {
        setAnimatingRow(`user-${username}`);
        const result = updateUserStatus(localStorage, username, banned);
        if (result.success) {
            showToast(`✅ ${banned ? 'Khóa' : 'Mở khóa'} tài khoản!`);
            refresh();
        } else {
            showToast(`❌ ${result.error}`, 'error');
        }
        setTimeout(() => setAnimatingRow(null), 500);
    };

    const handleShipperStatusChange = (shipperId, newStatus) => {
        setAnimatingRow(`shipper-${shipperId}`);
        const result = updateShipperStatus(localStorage, shipperId, newStatus);
        if (result.success) {
            showToast('✅ Cập nhật tài xế!');
            refresh();
        } else {
            showToast(`❌ ${result.error}`, 'error');
        }
        setTimeout(() => setAnimatingRow(null), 500);
    };

    if (!stats) return <div style={{ padding: 24 }}>Loading…</div>;

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <div>
                    <h2>👑 Admin Dashboard</h2>
                    {lastUpdate && (
                        <div style={{ fontSize: 12, color: '#666' }}>
                            Cập nhật: {lastUpdate.toLocaleTimeString()}
                        </div>
                    )}
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <NotificationBell role="admin" />
                    <button onClick={refresh} className="btn-refresh">Làm mới</button>
                    <span>{session?.email}</span>
                    <button onClick={() => { logoutAdmin(sessionStorage); location.href = '/admin/login'; }} className="btn-logout">
                        Đăng xuất
                    </button>
                </div>
            </header>

            <div className="admin-tabs">
                {['overview', 'restaurants', 'users', 'shippers'].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`tab-button ${activeTab === tab ? 'active' : ''}`}>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {activeTab === 'overview' && (
                <section className="admin-section">
                    <div className="stats-grid">
                        <AdminStatCard title="🏪 Nhà hàng" value={stats.restaurants.total} subtitle={`${stats.restaurants.active} hoạt động`} />
                        <AdminStatCard title="👥 Người dùng" value={stats.users.total} subtitle={`${stats.users.active} hoạt động`} />
                        <AdminStatCard title="📦 Đơn hàng" value={stats.orders.total} subtitle={`${stats.orders.shipping} đang giao`} />
                        <AdminStatCard title="💰 Phí nền tảng" value={`${(stats.platform.commission / 1000).toFixed(0)}K`} subtitle="10% mỗi đơn" />
                    </div>
                </section>
            )}

            {activeTab === 'restaurants' && (
                <section className="admin-section">
                    <button onClick={() => openRestaurantModal('add')} className="btn-add">+ Thêm nhà hàng</button>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên nhà hàng</th>
                                <th>Danh mục</th>
                                <th>Địa chỉ</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {restaurants.map((r) => (
                                <tr key={r.id} className={animatingRow === `restaurant-${r.id}` ? 'animating' : ''}>
                                    <td>#{r.id}</td>
                                    <td>{r.name} {r.isFeatured && '⭐'}</td>
                                    <td>{r.category}</td>
                                    <td>{r.address}</td>
                                    <td>
                                        <span className={`status-badge status-${r.status}`}>{r.status}</span>
                                    </td>
                                    <td>
                                        <button onClick={() => handleOpenMenu(r)} className="btn-action">🍽️ Menu</button>
                                        <button onClick={() => openRestaurantModal('edit', r)} className="btn-action">✏️ Sửa</button>
                                        <button onClick={() => handleRestaurantStatusChange(r.id, r.status === 'active' ? 'suspended' : 'active')} className="btn-action">
                                            {r.status === 'active' ? '⛔ Tạm ngưng' : '✅ Kích hoạt'}
                                        </button>
                                        <button onClick={() => handleDeleteRestaurant(r.id)} className="btn-action btn-danger">🗑️ Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            {activeTab === 'users' && (
                <section className="admin-section">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.username} className={animatingRow === `user-${u.username}` ? 'animating' : ''}>
                                    <td>{u.username}</td>
                                    <td>{u.email}</td>
                                    <td>
                                        <span className={`status-badge ${u.banned ? 'status-suspended' : 'status-active'}`}>
                                            {u.banned ? '⛔ Khóa' : '✓ Hoạt động'}
                                        </span>
                                    </td>
                                    <td>
                                        <button onClick={() => handleUserStatusChange(u.username, !u.banned)} className="btn-action">
                                            {u.banned ? '🔓 Mở khóa' : '🔒 Khóa'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            {activeTab === 'shippers' && (
                <section className="admin-section">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên tài xế</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shippers.map((s) => (
                                <tr key={s.id} className={animatingRow === `shipper-${s.id}` ? 'animating' : ''}>
                                    <td>#{s.id}</td>
                                    <td>{s.name}</td>
                                    <td>
                                        <span className={`status-badge status-${s.status}`}>{s.status}</span>
                                    </td>
                                    <td>
                                        <button onClick={() => handleShipperStatusChange(s.id, s.status === 'active' ? 'suspended' : 'active')} className="btn-action">
                                            {s.status === 'active' ? '⛔ Tạm ngưng' : '✅ Kích hoạt'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            {/* Restaurant Modal */}
            {isRestaurantModalOpen && (
                <div className="modal-overlay" onClick={() => setIsRestaurantModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>{restaurantMode === 'add' ? 'Thêm nhà hàng mới' : 'Sửa nhà hàng'}</h3>
                        <form onSubmit={handleSubmitRestaurant}>
                            <input placeholder="Tên nhà hàng" value={restaurantForm.name} onChange={(e) => setRestaurantForm({ ...restaurantForm, name: e.target.value })} required />
                            <input placeholder="Địa chỉ" value={restaurantForm.address} onChange={(e) => setRestaurantForm({ ...restaurantForm, address: e.target.value })} required />
                            <select value={restaurantForm.category} onChange={(e) => setRestaurantForm({ ...restaurantForm, category: e.target.value })}>
                                <option value="fastfood">Fast Food</option>
                                <option value="coffee">Coffee</option>
                                <option value="vietnamese">Vietnamese</option>
                            </select>
                            <input type="number" step="0.1" placeholder="Rating" value={restaurantForm.rating} onChange={(e) => setRestaurantForm({ ...restaurantForm, rating: e.target.value })} />

                            <div style={{ marginBottom: 10 }}>
                                <label style={{ display: 'block', marginBottom: 5, fontWeight: 500 }}>Hình ảnh:</label>
                                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                    <input
                                        placeholder="URL hình ảnh hoặc chọn file..."
                                        value={restaurantForm.image}
                                        onChange={(e) => setRestaurantForm({ ...restaurantForm, image: e.target.value })}
                                        style={{ flex: 1 }}
                                    />
                                    <label className="btn-secondary" style={{ cursor: 'pointer', padding: '8px 12px', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        📁 Chọn ảnh
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setRestaurantForm({ ...restaurantForm, image: reader.result });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                                {restaurantForm.image && (
                                    <img
                                        src={restaurantForm.image}
                                        alt="Preview"
                                        style={{ width: '100%', height: 150, objectFit: 'cover', marginTop: 10, borderRadius: 8, border: '1px solid #ddd' }}
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                )}
                            </div>

                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginTop: 8 }}>
                                <input
                                    type="checkbox"
                                    checked={restaurantForm.isFeatured || false}
                                    onChange={(e) => setRestaurantForm({ ...restaurantForm, isFeatured: e.target.checked })}
                                    style={{ width: 20, height: 20, cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: 14, fontWeight: 500 }}>⭐ Hiển thị trên trang chủ (Featured)</span>
                            </label>

                            <div className="modal-actions">
                                <button type="submit" className="btn-primary">Lưu</button>
                                <button type="button" onClick={() => setIsRestaurantModalOpen(false)} className="btn-secondary">Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Menu Modal */}
            {isMenuModalOpen && currentRestaurant && (
                <div className="modal-overlay" onClick={() => setIsMenuModalOpen(false)}>
                    <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
                        <h3>Menu: {currentRestaurant.name}</h3>
                        <button onClick={() => openMenuItemModal('add')} className="btn-add">+ Thêm món mới</button>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Tên món</th>
                                    <th>Giá</th>
                                    <th>Danh mục</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {menuItems.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.price.toLocaleString()} đ</td>
                                        <td>{item.category}</td>
                                        <td>
                                            <button onClick={() => openMenuItemModal('edit', item)} className="btn-action">✏️ Sửa</button>
                                            <button onClick={() => handleDeleteMenuItem(item.id)} className="btn-action btn-danger">🗑️ Xóa</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={() => setIsMenuModalOpen(false)} className="btn-secondary">Đóng</button>
                    </div>
                </div>
            )}

            {/* Menu Item Modal */}
            {isMenuItemModalOpen && (
                <div className="modal-overlay" onClick={() => setIsMenuItemModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>{menuItemMode === 'add' ? 'Thêm món mới' : 'Sửa món ăn'}</h3>
                        <form onSubmit={handleSubmitMenuItem}>
                            <input placeholder="Tên món" value={menuItemForm.name} onChange={(e) => setMenuItemForm({ ...menuItemForm, name: e.target.value })} required />
                            <input type="number" placeholder="Giá" value={menuItemForm.price} onChange={(e) => setMenuItemForm({ ...menuItemForm, price: e.target.value })} required />
                            <select value={menuItemForm.category} onChange={(e) => setMenuItemForm({ ...menuItemForm, category: e.target.value })}>
                                <option value="Đồ ăn">Đồ ăn</option>
                                <option value="Đồ uống">Đồ uống</option>
                                <option value="Tráng miệng">Tráng miệng</option>
                            </select>

                            <div style={{ marginBottom: 10 }}>
                                <label style={{ display: 'block', marginBottom: 5, fontWeight: 500 }}>Hình ảnh:</label>
                                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                    <input
                                        placeholder="URL hình ảnh hoặc chọn file..."
                                        value={menuItemForm.image}
                                        onChange={(e) => setMenuItemForm({ ...menuItemForm, image: e.target.value })}
                                        style={{ flex: 1 }}
                                    />
                                    <label className="btn-secondary" style={{ cursor: 'pointer', padding: '8px 12px', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        📁 Chọn ảnh
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setMenuItemForm({ ...menuItemForm, image: reader.result });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                                {menuItemForm.image && (
                                    <img
                                        src={menuItemForm.image}
                                        alt="Preview"
                                        style={{ width: '100%', height: 150, objectFit: 'cover', marginTop: 10, borderRadius: 8, border: '1px solid #ddd' }}
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                )}
                            </div>

                            <div className="modal-actions">
                                <button type="submit" className="btn-primary">Lưu</button>
                                <button type="button" onClick={() => setIsMenuItemModalOpen(false)} className="btn-secondary">Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
}
