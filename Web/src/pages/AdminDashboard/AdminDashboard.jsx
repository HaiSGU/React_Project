import { useEffect, useState } from 'react';
import { 
  getAdminOverview, 
  getRestaurants, 
  updateRestaurantStatus,
  getUsers,
  updateUserStatus 
} from '../../../../shared/services/adminMetricsService';
import { logoutAdmin, getAdminSession } from '../../../../shared/services/adminAuthService';
import { useSystemMetrics, useRealtimeOrders, useEventListener } from '@shared/hooks/useRealtime';
import { getAllShippers, updateShipperStatus, getShipperStats, initShippers } from '@shared/services/shipperService';
import initAdminData from '@shared/services/initAdminData';
import NotificationBell from '../../components/NotificationBell/NotificationBell';
import AdminStatCard from '../../components/Admin/AdminStatCard';
import AdminRevenueCard from '../../components/Admin/AdminRevenueCard';
import AdminBarChart from '../../components/Admin/AdminBarChart';
import '../../components/Admin/Admin.css';
import eventBus, { EVENT_TYPES } from '@shared/services/eventBus';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview | restaurants | users | shippers
  const [restaurants, setRestaurants] = useState([]);
  const [users, setUsers] = useState([]);
  const [shippers, setShippers] = useState([]);
  const [shipperStats, setShipperStats] = useState(null);
  const [toast, setToast] = useState(null); // 🔥 Toast notification
  const [animatingRow, setAnimatingRow] = useState(null); // 🔥 Animation
  const session = getAdminSession(sessionStorage);
  
  // 🔥 Real-time hooks
  const { metrics } = useSystemMetrics();
  const { orders, lastUpdate } = useRealtimeOrders();

  // 🔥 Auto-refresh khi có order mới
  useEffect(() => {
    if (lastUpdate) {
      console.log('🔔 New order detected, refreshing shipper stats...');
      refresh();
    }
  }, [lastUpdate]);

  // 🔥 Auto-refresh khi chuyển tab Shippers
  useEffect(() => {
    if (activeTab === 'shippers') {
      console.log('🔄 Shippers tab opened, refreshing stats...');
      refresh();
    }
  }, [activeTab]);

  // 🔥 Auto-refresh mỗi 30 giây
  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const refresh = () => {
  // Chỉ init khi thiếu dữ liệu để tránh ghi đè trạng thái do các dashboard khác cập nhật
  initAdminData(localStorage, false);
    initShippers(localStorage);
    
    const overview = getAdminOverview(localStorage);
    setStats(overview);
    setRestaurants(getRestaurants(localStorage));
    setUsers(getUsers(localStorage));
    
    // ⭐ Lấy shipper stats với dữ liệu THỰC
    const shipperStatsData = getShipperStats(localStorage);
    setShipperStats(shipperStatsData);
    setShippers(shipperStatsData.shippers || []); // Dùng shippers từ stats (có dữ liệu thực)
  };
  
  useEffect(() => { refresh(); }, []);

  // Lắng nghe sự kiện thay đổi trạng thái nhà hàng (từ Restaurant Dashboard)
  useEventListener(EVENT_TYPES.RESTAURANT_STATUS_CHANGED, () => {
    console.log('🔁 Restaurant status changed event received → refreshing admin data');
    refresh();
  });

  // 🔥 Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRestaurantStatusChange = (restaurantId, newStatus) => {
    console.log('🔧 Changing restaurant status:', { restaurantId, newStatus });
    setAnimatingRow(`restaurant-${restaurantId}`);
    
    const result = updateRestaurantStatus(localStorage, restaurantId, newStatus);
    console.log('📊 Update result:', result);
    
    if (result.success) {
      const statusText = newStatus === 'active' ? 'kích hoạt' : newStatus === 'suspended' ? 'tạm ngưng' : 'cập nhật';
      showToast(`✅ Đã ${statusText} nhà hàng!`);
      eventBus.emit(EVENT_TYPES.RESTAURANT_STATUS_CHANGED, { restaurantId, status: newStatus });
      refresh();
    } else {
      showToast(`❌ Lỗi: ${result.error}`, 'error');
    }
    
    setTimeout(() => setAnimatingRow(null), 500);
  };

  const handleUserStatusChange = (username, banned) => {
    setAnimatingRow(`user-${username}`);
    
    const result = updateUserStatus(localStorage, username, banned);
    if (result.success) {
      showToast(`✅ Đã ${banned ? 'khóa' : 'mở khóa'} tài khoản!`);
      refresh();
    } else {
      showToast(`❌ Lỗi: ${result.error}`, 'error');
    }
    
    setTimeout(() => setAnimatingRow(null), 500);
  };

  const handleShipperStatusChange = (shipperId, newStatus) => {
    setAnimatingRow(`shipper-${shipperId}`);
    
    const result = updateShipperStatus(localStorage, shipperId, newStatus);
    if (result.success) {
      const statusText = {
        'active': 'kích hoạt',
        'offline': 'đưa vào nghỉ',
        'suspended': 'tạm ngưng'
      };
      showToast(`✅ Đã ${statusText[newStatus] || 'cập nhật'} tài xế!`);
      refresh();
    } else {
      showToast(`❌ Lỗi: ${result.error}`, 'error');
    }
    
    setTimeout(() => setAnimatingRow(null), 500);
  };

  if (!stats) return <div style={{ padding:24 }}>Loading…</div>;

  return (
    <div style={{ padding:24 }}>
      <header style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <h2>👑 Admin Dashboard - Quản lý hệ thống</h2>
          {lastUpdate && (
            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
              📡 Cập nhật lúc: {lastUpdate.toLocaleTimeString('vi-VN')}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <NotificationBell role="admin" />
          <button onClick={refresh} style={{ marginRight:8 }}>Làm mới</button>
          <span style={{ marginRight:12 }}>Xin chào, {session?.email}</span>
          <button onClick={() => { logoutAdmin(sessionStorage); location.href = '/admin/login'; }}>
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: 12, 
        marginTop: 16,
        borderBottom: '2px solid #e5e7eb'
      }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: activeTab === 'overview' ? '#4a90e2' : 'transparent',
            color: activeTab === 'overview' ? 'white' : '#666',
            fontWeight: 600,
            cursor: 'pointer',
            borderRadius: '8px 8px 0 0',
            marginBottom: '-2px'
          }}
        >
          📊 Tổng quan
        </button>
        <button
          onClick={() => setActiveTab('restaurants')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: activeTab === 'restaurants' ? '#4a90e2' : 'transparent',
            color: activeTab === 'restaurants' ? 'white' : '#666',
            fontWeight: 600,
            cursor: 'pointer',
            borderRadius: '8px 8px 0 0',
            marginBottom: '-2px'
          }}
        >
          🏪 Nhà hàng ({stats.restaurants.total})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: activeTab === 'users' ? '#4a90e2' : 'transparent',
            color: activeTab === 'users' ? 'white' : '#666',
            fontWeight: 600,
            cursor: 'pointer',
            borderRadius: '8px 8px 0 0',
            marginBottom: '-2px'
          }}
        >
          👥 Người dùng ({stats.users.total})
        </button>
        <button
          onClick={() => setActiveTab('shippers')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: activeTab === 'shippers' ? '#4a90e2' : 'transparent',
            color: activeTab === 'shippers' ? 'white' : '#666',
            fontWeight: 600,
            cursor: 'pointer',
            borderRadius: '8px 8px 0 0',
            marginBottom: '-2px'
          }}
        >
          🏍️ Tài xế ({shipperStats?.total || 0})
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* System Stats */}
          <section className="ad-grid ad-grid-4" style={{ marginTop:16 }}>
            <AdminStatCard title="🏪 Nhà hàng" value={stats.restaurants.total} subtitle={`${stats.restaurants.active} hoạt động`} />
            <AdminStatCard title="👥 Người dùng" value={stats.users.total} subtitle={`${stats.users.active} hoạt động`} />
            <AdminStatCard title="📦 Đơn hàng" value={stats.orders.total} subtitle={`${stats.orders.shipping} đang giao`} />
            <AdminStatCard title="💰 Phí Platform" value={`${(stats.platform.commission / 1000).toFixed(0)}K`} subtitle="10% mỗi đơn" />
          </section>

          {/* Chart */}
          <section className="ad-grid ad-grid-2" style={{ marginTop:16 }}>
            <div className="ad-card">
              <h3>📈 Đơn hàng 7 ngày qua</h3>
              <div style={{ marginTop: 16 }}>
                {stats.dailySeries.map(day => (
                  <div key={day.date} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <span>{day.label}</span>
                    <span style={{ fontWeight: 600 }}>{day.count} đơn</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="ad-card">
              <h3>🏆 Top nhà hàng</h3>
              <table style={{ width:'100%', borderCollapse:'collapse', marginTop: 16 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ textAlign:'left', padding:8 }}>ID</th>
                    <th style={{ textAlign:'right', padding:8 }}>Đơn hàng</th>
                    <th style={{ textAlign:'right', padding:8 }}>Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topRestaurants.map(r => (
                    <tr key={r.restaurantId} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding:8 }}>#{r.restaurantId}</td>
                      <td style={{ padding:8, textAlign:'right' }}>{r.orderCount}</td>
                      <td style={{ padding:8, textAlign:'right', color: '#4a90e2', fontWeight: 600 }}>
                        {r.totalRevenue.toLocaleString()} đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* Restaurants Tab */}
      {activeTab === 'restaurants' && (
        <section className="ad-card" style={{ marginTop:16 }}>
          <h3>🏪 Quản lý nhà hàng</h3>
          <div style={{ marginTop: 16 }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: 12,
              marginBottom: 16 
            }}>
              <div style={{ padding: 16, background: '#f0f9ff', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#666' }}>Hoạt động</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#10b981' }}>
                  {stats.restaurants.active}
                </div>
              </div>
              <div style={{ padding: 16, background: '#fffbeb', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#666' }}>Chờ duyệt</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#f59e0b' }}>
                  {stats.restaurants.pending}
                </div>
              </div>
              <div style={{ padding: 16, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#666' }}>Tạm ngưng</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#ef4444' }}>
                  {stats.restaurants.suspended}
                </div>
              </div>
            </div>

            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ textAlign:'left', padding:12 }}>ID</th>
                  <th style={{ textAlign:'left', padding:12 }}>Tên nhà hàng</th>
                  <th style={{ textAlign:'left', padding:12 }}>Danh mục</th>
                  <th style={{ textAlign:'left', padding:12 }}>Địa chỉ</th>
                  <th style={{ textAlign:'center', padding:12 }}>⭐ Rating</th>
                  <th style={{ textAlign:'center', padding:12 }}>Trạng thái</th>
                  <th style={{ textAlign:'center', padding:12 }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map(restaurant => (
                  <tr 
                    key={restaurant.id} 
                    style={{ borderBottom: '1px solid #f0f0f0' }}
                    data-animating={animatingRow === `restaurant-${restaurant.id}`}
                  >
                    <td style={{ padding:12, fontWeight: 600 }}>#{restaurant.id}</td>
                    <td style={{ padding:12, fontWeight: 600 }}>
                      {restaurant.name}
                      {restaurant.isFeatured && (
                        <span style={{ 
                          marginLeft: 8, 
                          fontSize: 11, 
                          padding: '2px 6px', 
                          background: '#fef3c7', 
                          color: '#92400e',
                          borderRadius: 4,
                          fontWeight: 600
                        }}>
                          ⭐ Nổi bật
                        </span>
                      )}
                    </td>
                    <td style={{ padding:12, fontSize: 13, color: '#666' }}>
                      {restaurant.category}
                    </td>
                    <td style={{ padding:12, fontSize: 13, color: '#666' }}>
                      {restaurant.address}
                    </td>
                    <td style={{ padding:12, textAlign:'center', fontWeight: 600 }}>
                      {restaurant.rating} ⭐
                    </td>
                    <td style={{ padding:12, textAlign:'center' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        background: restaurant.status === 'active' ? '#d1fae5' : 
                                   restaurant.status === 'pending' ? '#fef3c7' : '#fee2e2',
                        color: restaurant.status === 'active' ? '#065f46' : 
                               restaurant.status === 'pending' ? '#92400e' : '#991b1b'
                      }}>
                        {restaurant.status === 'active' ? '✓ Hoạt động' :
                         restaurant.status === 'pending' ? '⏳ Chờ duyệt' : '⛔ Tạm ngưng'}
                      </span>
                    </td>
                    <td style={{ padding:12, textAlign:'center' }}>
                      {restaurant.status === 'pending' && (
                        <button 
                          onClick={() => handleRestaurantStatusChange(restaurant.id, 'active')}
                          style={{
                            padding: '6px 12px',
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: 6,
                            cursor: 'pointer',
                            marginRight: 8
                          }}
                        >
                          ✓ Duyệt
                        </button>
                      )}
                      {restaurant.status === 'active' && (
                        <button 
                          onClick={() => handleRestaurantStatusChange(restaurant.id, 'suspended')}
                          style={{
                            padding: '6px 12px',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: 6,
                            cursor: 'pointer'
                          }}
                        >
                          ⛔ Tạm ngưng
                        </button>
                      )}
                      {restaurant.status === 'suspended' && (
                        <button 
                          onClick={() => handleRestaurantStatusChange(restaurant.id, 'active')}
                          style={{
                            padding: '6px 12px',
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: 6,
                            cursor: 'pointer'
                          }}
                        >
                          ✓ Kích hoạt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <section className="ad-card" style={{ marginTop:16 }}>
          <h3>👥 Quản lý người dùng</h3>
          <div style={{ marginTop: 16 }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: 12,
              marginBottom: 16 
            }}>
              <div style={{ padding: 16, background: '#f0f9ff', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#666' }}>Hoạt động</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#10b981' }}>
                  {stats.users.active}
                </div>
              </div>
              <div style={{ padding: 16, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#666' }}>Đã khóa</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#ef4444' }}>
                  {stats.users.banned}
                </div>
              </div>
            </div>

            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ textAlign:'left', padding:12 }}>Username</th>
                  <th style={{ textAlign:'left', padding:12 }}>Họ tên</th>
                  <th style={{ textAlign:'left', padding:12 }}>Số điện thoại</th>
                  <th style={{ textAlign:'center', padding:12 }}>Trạng thái</th>
                  <th style={{ textAlign:'center', padding:12 }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 20).map(user => (
                  <tr 
                    key={user.username} 
                    style={{ borderBottom: '1px solid #f0f0f0' }}
                    data-animating={animatingRow === `user-${user.username}`}
                  >
                    <td style={{ padding:12, fontWeight: 600 }}>{user.username}</td>
                    <td style={{ padding:12 }}>{user.fullName || 'N/A'}</td>
                    <td style={{ padding:12 }}>{user.phone || 'N/A'}</td>
                    <td style={{ padding:12, textAlign:'center' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        background: user.banned ? '#fee2e2' : '#d1fae5',
                        color: user.banned ? '#991b1b' : '#065f46'
                      }}>
                        {user.banned ? '🔒 Đã khóa' : '✓ Hoạt động'}
                      </span>
                    </td>
                    <td style={{ padding:12, textAlign:'center' }}>
                      {user.banned ? (
                        <button 
                          onClick={() => handleUserStatusChange(user.username, false)}
                          style={{
                            padding: '6px 12px',
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: 6,
                            cursor: 'pointer'
                          }}
                        >
                          🔓 Mở khóa
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleUserStatusChange(user.username, true)}
                          style={{
                            padding: '6px 12px',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: 6,
                            cursor: 'pointer'
                          }}
                        >
                          🔒 Khóa
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Shippers Tab */}
      {activeTab === 'shippers' && (
        <section className="ad-card" style={{ marginTop:16 }}>
          <div>
            <h3>🏍️ Quản lý Tài xế</h3>
            
            {/* Stats */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: 12,
              marginBottom: 16,
              marginTop: 16 
            }}>
              <div style={{ padding: 16, background: '#f0f9ff', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#666' }}>Đang hoạt động</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#10b981' }}>
                  {shipperStats?.active || 0}
                </div>
              </div>
              <div style={{ padding: 16, background: '#fff7ed', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#666' }}>Đang giao hàng</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#f59e0b' }}>
                  {shipperStats?.busy || 0}
                </div>
              </div>
              <div style={{ padding: 16, background: '#f9fafb', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#666' }}>Nghỉ</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#6b7280' }}>
                  {shipperStats?.offline || 0}
                </div>
              </div>
              <div style={{ padding: 16, background: '#fef2f2', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: '#666' }}>Tạm ngưng</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#ef4444' }}>
                  {shipperStats?.suspended || 0}
                </div>
              </div>
            </div>

            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ textAlign:'left', padding:12 }}>ID</th>
                  <th style={{ textAlign:'left', padding:12 }}>Tên tài xế</th>
                  <th style={{ textAlign:'left', padding:12 }}>Phương tiện</th>
                  <th style={{ textAlign:'center', padding:12 }}>⭐ Rating</th>
                  <th style={{ textAlign:'center', padding:12 }}>Số điện thoại</th>
                  <th style={{ textAlign:'center', padding:12 }}>Tổng giao</th>
                  <th style={{ textAlign:'center', padding:12 }}>Thu nhập</th>
                  <th style={{ textAlign:'center', padding:12 }}>Trạng thái</th>
                  <th style={{ textAlign:'center', padding:12 }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {shippers.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ padding: 32, textAlign: 'center', color: '#999' }}>
                      Chưa có dữ liệu shipper. Hệ thống sẽ tự động khởi tạo khi có đơn hàng đầu tiên.
                    </td>
                  </tr>
                ) : (
                  shippers.map(shipper => (
                  <tr 
                    key={shipper.id} 
                    style={{ borderBottom: '1px solid #f0f0f0' }}
                    data-animating={animatingRow === `shipper-${shipper.id}`}
                  >
                    <td style={{ padding:12, fontWeight: 600 }}>#{shipper.id}</td>
                    <td style={{ padding:12, fontWeight: 600 }}>{shipper.name}</td>
                    <td style={{ padding:12, fontSize: 13, color: '#666' }}>
                      🏍️ {shipper.vehicle}
                    </td>
                    <td style={{ padding:12, textAlign:'center', fontWeight: 600 }}>
                      {shipper.rating} ⭐
                    </td>
                    <td style={{ padding:12, textAlign:'center', fontSize: 13 }}>
                      {shipper.phone}
                    </td>
                    <td style={{ padding:12, textAlign:'center', fontWeight: 600 }}>
                      {shipper.totalAssigned || 0} đơn
                      {shipper.totalAssigned > 0 && shipper.totalDeliveries !== shipper.totalAssigned && (
                        <div style={{ fontSize: 11, color: '#666', fontWeight: 400 }}>
                          ({shipper.totalDeliveries || 0} đã giao)
                        </div>
                      )}
                    </td>
                    <td style={{ padding:12, textAlign:'center', fontWeight: 600, color: '#10b981' }}>
                      {((shipper.earnings || 0) / 1000).toFixed(1)}K
                    </td>
                    <td style={{ padding:12, textAlign:'center' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        background: shipper.status === 'active' ? '#d1fae5' : 
                                   shipper.status === 'busy' ? '#fef3c7' : 
                                   shipper.status === 'offline' ? '#f3f4f6' : '#fee2e2',
                        color: shipper.status === 'active' ? '#065f46' : 
                               shipper.status === 'busy' ? '#92400e' : 
                               shipper.status === 'offline' ? '#374151' : '#991b1b'
                      }}>
                        {shipper.status === 'active' ? '✓ Sẵn sàng' :
                         shipper.status === 'busy' ? '🚚 Đang giao' : 
                         shipper.status === 'offline' ? '💤 Nghỉ' : '⛔ Tạm ngưng'}
                      </span>
                    </td>
                    <td style={{ padding:12, textAlign:'center' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
                        {shipper.status !== 'active' && shipper.status !== 'busy' && (
                          <button 
                            onClick={() => handleShipperStatusChange(shipper.id, 'active')}
                            style={{
                              padding: '6px 12px',
                              background: '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: 6,
                              cursor: 'pointer',
                              fontSize: 12
                            }}
                          >
                            ✓ Kích hoạt
                          </button>
                        )}
                        {shipper.status !== 'suspended' && (
                          <button 
                            onClick={() => handleShipperStatusChange(shipper.id, 'suspended')}
                            style={{
                              padding: '6px 12px',
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: 6,
                              cursor: 'pointer',
                              fontSize: 12
                            }}
                          >
                            ⛔ Tạm ngưng
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 🔥 Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: 80,
          right: 24,
          padding: '16px 24px',
          background: toast.type === 'error' ? '#fee2e2' : '#d1fae5',
          color: toast.type === 'error' ? '#991b1b' : '#065f46',
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 9999,
          fontWeight: 600,
          animation: 'slideIn 0.3s ease-out',
        }}>
          {toast.message}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        tr[data-animating="true"] {
          animation: highlight 0.5s ease-out;
        }
        
        @keyframes highlight {
          0% { background-color: #fef3c7; }
          100% { background-color: transparent; }
        }
        
        button:hover {
          opacity: 0.9;
          transform: scale(1.05);
        }
        
        button:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}