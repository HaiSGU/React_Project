import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentOwner, logoutOwner } from '@shared/services/restaurantAuthService'
import { 
  getRestaurantStats, 
  updateOrderStatus,
  getChartData,
  getOrdersByDateFilter
} from '@shared/services/ownerOrderService'
import { 
  getRestaurantMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability
} from '@shared/services/ownerMenuService'
import { 
  getRestaurantVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher
} from '@shared/services/voucherService'
import OrderChart from '../../components/Dashboard/OrderChart'
import NotificationSystem from '../../components/Dashboard/NotificationSystem'
import OrderFilters from '../../components/Dashboard/OrderFilters'
import MenuItemModal from '../../components/Dashboard/MenuItemModal'
import VoucherModal from '../../components/Dashboard/VoucherModal'
import './RestaurantDashboard.css'

export default function RestaurantDashboard() {
  const [ownerInfo] = useState(() => getCurrentOwner(localStorage))
  const [stats, setStats] = useState(null)
  const [menuInfo, setMenuInfo] = useState(null)
  const [orders, setOrders] = useState([])
  const [chartData, setChartData] = useState([])
  const [vouchers, setVouchers] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('today')
  
  // Modals
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false)
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false)
  const [editingMenuItem, setEditingMenuItem] = useState(null)
  const [editingVoucher, setEditingVoucher] = useState(null)
  
  const navigate = useNavigate()

  useEffect(() => {
    if (!ownerInfo) return
    loadDashboardData()
  }, [ownerInfo, dateFilter])

  const loadDashboardData = () => {
    if (!ownerInfo) return

    // Load thống kê
    const statsData = getRestaurantStats(ownerInfo.restaurantId, localStorage)
    setStats(statsData)

    // Load menu info
    const menu = getRestaurantMenu(ownerInfo.restaurantId, localStorage)
    setMenuInfo(menu)

    // Load đơn hàng theo filter
    const filteredOrders = getOrdersByDateFilter(ownerInfo.restaurantId, dateFilter, localStorage)
    setOrders(filteredOrders)

    // Load chart data
    const chart = getChartData(ownerInfo.restaurantId, localStorage)
    setChartData(chart)

    // Load vouchers
    const voucherList = getRestaurantVouchers(ownerInfo.restaurantId, localStorage)
    setVouchers(voucherList)
  }

  const handleLogout = async () => {
    await logoutOwner(localStorage)
    navigate('/login')
  }

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const result = updateOrderStatus(orderId, newStatus, localStorage)
    if (result.success) {
      loadDashboardData()
      alert(`✅ Đã cập nhật trạng thái đơn hàng thành công!`)
    } else {
      alert('❌ Lỗi cập nhật trạng thái!')
    }
  }

  const exportToCSV = () => {
    const headers = ['Mã đơn', 'Khách hàng', 'Địa chỉ', 'Tổng tiền', 'Trạng thái', 'Ngày']
    
    const rows = filteredOrders.map(order => [
      order.id || 'N/A',
      order.customerName || 'Khách hàng',
      order.address || 'Không có địa chỉ',
      order.totalPrice || 0,
      order.status || 'pending',
      new Date(order.date || order.createdAt).toLocaleString('vi-VN')
    ])
    
    let csvContent = '\uFEFF' + headers.join(',') + '\n'
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\n'
    })
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `orders_${ownerInfo.restaurantName}_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  // MENU HANDLERS
  const handleAddMenuItem = () => {
    setEditingMenuItem(null)
    setIsMenuModalOpen(true)
  }

  const handleEditMenuItem = (item) => {
    setEditingMenuItem(item)
    setIsMenuModalOpen(true)
  }

  const handleSaveMenuItem = (itemData) => {
    if (editingMenuItem) {
      // Sửa món
      const result = updateMenuItem(ownerInfo.restaurantId, editingMenuItem.id, itemData, localStorage)
      if (result.success) {
        alert('✅ Cập nhật món thành công!')
        setIsMenuModalOpen(false)
        loadDashboardData()
      } else {
        alert('❌ Lỗi: ' + result.error)
      }
    } else {
      // Thêm món mới
      const result = addMenuItem(ownerInfo.restaurantId, itemData, localStorage)
      if (result.success) {
        alert('✅ Thêm món thành công!')
        setIsMenuModalOpen(false)
        loadDashboardData()
      } else {
        alert('❌ Lỗi: ' + result.error)
      }
    }
  }

  const handleDeleteMenuItem = (itemId, itemName) => {
    if (window.confirm(`Bạn có chắc muốn xóa món "${itemName}"?`)) {
      const result = deleteMenuItem(ownerInfo.restaurantId, itemId, localStorage)
      if (result.success) {
        alert('✅ Đã xóa món!')
        loadDashboardData()
      } else {
        alert('❌ Lỗi: ' + result.error)
      }
    }
  }

  const handleToggleAvailability = (itemId) => {
    const result = toggleMenuItemAvailability(ownerInfo.restaurantId, itemId, localStorage)
    if (result.success) {
      loadDashboardData()
    }
  }

  // VOUCHER HANDLERS
  const handleAddVoucher = () => {
    setEditingVoucher(null)
    setIsVoucherModalOpen(true)
  }

  const handleEditVoucher = (voucher) => {
    setEditingVoucher(voucher)
    setIsVoucherModalOpen(true)
  }

  const handleSaveVoucher = (voucherData) => {
    if (editingVoucher) {
      const result = updateVoucher(ownerInfo.restaurantId, editingVoucher.id, voucherData, localStorage)
      if (result.success) {
        alert('✅ Cập nhật voucher thành công!')
        setIsVoucherModalOpen(false)
        loadDashboardData()
      } else {
        alert('❌ Lỗi: ' + result.error)
      }
    } else {
      const result = createVoucher(ownerInfo.restaurantId, voucherData, localStorage)
      if (result.success) {
        alert('✅ Tạo voucher thành công!')
        setIsVoucherModalOpen(false)
        loadDashboardData()
      } else {
        alert('❌ Lỗi: ' + result.error)
      }
    }
  }

  const handleDeleteVoucher = (voucherId, code) => {
    if (window.confirm(`Bạn có chắc muốn xóa voucher "${code}"?`)) {
      const result = deleteVoucher(ownerInfo.restaurantId, voucherId, localStorage)
      if (result.success) {
        alert('✅ Đã xóa voucher!')
        loadDashboardData()
      } else {
        alert('❌ Lỗi: ' + result.error)
      }
    }
  }

  const handleToggleVoucher = (voucherId, currentStatus) => {
    const result = updateVoucher(ownerInfo.restaurantId, voucherId, { isActive: !currentStatus }, localStorage)
    if (result.success) {
      loadDashboardData()
    }
  }

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchSearch = !searchTerm || 
                       order.id?.toString().includes(searchTerm) ||
                       order.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchStatus = statusFilter === 'all' || order.status === statusFilter
    
    return matchSearch && matchStatus
  })

  const newOrdersCount = orders.filter(o => o.status === 'pending').length

  if (!ownerInfo || !stats) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>🍽️ {ownerInfo.restaurantName}</h1>
        </div>
        <div className="header-actions">
          <button className="refresh-btn" onClick={loadDashboardData} title="Làm mới">
            🔄
          </button>
          <span className="owner-name">👤 {ownerInfo.username}</span>
          <button onClick={handleLogout} className="logout-btn">
            Đăng xuất
          </button>
        </div>
      </header>

      {/* TABS */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Tổng quan
        </button>
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📦 Đơn hàng
          {newOrdersCount > 0 && (
            <span className="badge">{newOrdersCount}</span>
          )}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          📋 Menu ({menuInfo.totalItems})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'vouchers' ? 'active' : ''}`}
          onClick={() => setActiveTab('vouchers')}
        >
          🎟️ Voucher ({vouchers.length})
        </button>
      </div>

      <div className="dashboard-content">
        {/* TAB 1: TỔNG QUAN */}
        {activeTab === 'overview' && (
          <>
            <div className="overview-grid">
              <div className="overview-left">
                <h2>Thống kê hôm nay</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <h3>Đơn hàng hôm nay</h3>
                    <p className="stat-number">{stats.todayOrders}</p>
                    <span className="stat-label">Tổng: {stats.totalOrders} đơn</span>
                  </div>

                  <div className="stat-card revenue-card">
                    <div className="stat-icon">💰</div>
                    <h3>Doanh thu hôm nay</h3>
                    <p className="stat-number">{stats.todayRevenue.total.toLocaleString()} đ</p>
                    
                    {/* ⭐ THÊM PHẦN BREAKDOWN */}
                    <div className="revenue-breakdown">
                      <div className="breakdown-item">
                        <span className="breakdown-label">
                          <span className="icon">🏪</span> Nhà hàng ({stats.todayRevenue.percentages.restaurant}%)
                        </span>
                        <span className="breakdown-value">{stats.todayRevenue.restaurant.toLocaleString()} đ</span>
                      </div>
                      
                      <div className="breakdown-item">
                        <span className="breakdown-label">
                          <span className="icon">🚚</span> Shipper ({stats.todayRevenue.percentages.shipper}%)
                        </span>
                        <span className="breakdown-value">{stats.todayRevenue.shipper.toLocaleString()} đ</span>
                      </div>
                      
                      <div className="breakdown-item">
                        <span className="breakdown-label">
                          <span className="icon">📱</span> App ({stats.todayRevenue.percentages.app}%)
                        </span>
                        <span className="breakdown-value">{stats.todayRevenue.app.toLocaleString()} đ</span>
                      </div>
                    </div>
                    
                    <span className="stat-label">
                      Tổng tất cả: {stats.totalRevenue.total.toLocaleString()} đ
                    </span>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">🍔</div>
                    <h3>Món ăn</h3>
                    <p className="stat-number">{menuInfo.totalItems}</p>
                    <span className="stat-label">
                      Cố định: {menuInfo.staticMenu.length} | Tùy chỉnh: {menuInfo.customMenu.length}
                    </span>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">⏳</div>
                    <h3>Đơn chờ xử lý</h3>
                    <p className="stat-number">{stats.pendingOrders}</p>
                    <span className="stat-label">
                      Đang giao: {stats.processingOrders} | Hoàn thành: {stats.deliveredOrders}
                    </span>
                  </div>
                </div>

                <OrderChart data={chartData} type="line" />
              </div>

              <div className="overview-right">
                <NotificationSystem restaurantId={ownerInfo.restaurantId} />
              </div>
            </div>
          </>
        )}

        {/* TAB 2: ĐƠN HÀNG */}
        {activeTab === 'orders' && (
          <>
            <div className="orders-header">
              <h2>Quản lý đơn hàng</h2>
              <button onClick={exportToCSV} className="export-btn">
                📊 Xuất Excel
              </button>
            </div>

            <OrderFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              dateFilter={dateFilter}
              onDateChange={setDateFilter}
              orderCount={filteredOrders.length}
            />

            {filteredOrders.length === 0 ? (
              <div className="empty-state">
                <p className="empty-icon">📦</p>
                <h3>Không tìm thấy đơn hàng</h3>
                <p>Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
              </div>
            ) : (
              <div className="orders-list">
                {filteredOrders.map((order, index) => (
                  <div key={order.id || index} className="order-card">
                    <div className="order-header">
                      <span className="order-id">Đơn #{order.id || index + 1}</span>
                      <span className={`order-status status-${order.status || 'pending'}`}>
                        {order.status === 'delivered' ? '✅ Đã giao' : 
                         order.status === 'processing' ? '🚚 Đang giao' : 
                         '⏳ Chờ xác nhận'}
                      </span>
                    </div>

                    <div className="order-info">
                      <p>📅 {new Date(order.date || order.createdAt).toLocaleString('vi-VN')}</p>
                      <p>📍 {order.address || 'Không có địa chỉ'}</p>
                      <p>👤 {order.customerName || 'Khách hàng'}</p>
                    </div>

                    <div className="order-items">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="order-item">
                          <span>{item.name}</span>
                          <span>x{item.quantity}</span>
                          <span>{(item.price * item.quantity).toLocaleString()} đ</span>
                        </div>
                      ))}
                    </div>

                    <div className="order-footer">
                      <span className="order-total">
                        Tổng: <strong>{order.totalPrice?.toLocaleString()} đ</strong>
                      </span>
                      <div className="order-actions">
                        {order.status === 'pending' && (
                          <button 
                            className="action-btn confirm"
                            onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                          >
                            ✓ Xác nhận
                          </button>
                        )}
                        {order.status === 'processing' && (
                          <button 
                            className="action-btn deliver"
                            onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                          >
                            ✓ Đã giao
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* TAB 3: MENU */}
        {activeTab === 'menu' && (
          <>
            <div className="menu-header">
              <h2>Quản lý Menu ({menuInfo.totalItems} món)</h2>
              <button className="add-btn" onClick={handleAddMenuItem}>
                ➕ Thêm món mới
              </button>
            </div>

            <div className="menu-sections">
              {menuInfo.customMenu.length > 0 && (
                <>
                  <h3>Món tùy chỉnh ({menuInfo.customMenu.length})</h3>
                  <div className="menu-grid">
                    {menuInfo.customMenu.map(item => (
                      <div key={item.id} className="menu-item-card custom">
                        <div className="menu-item-header">
                          <h4>{item.name}</h4>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={item.isAvailable !== false}
                              onChange={() => handleToggleAvailability(item.id)}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>
                        <p className="price">{item.price.toLocaleString()} đ</p>
                        <p className="description">{item.description}</p>
                        <div className="item-actions">
                          <button 
                            className="edit-btn"
                            onClick={() => handleEditMenuItem(item)}
                          >
                            ✏️ Sửa
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteMenuItem(item.id, item.name)}
                          >
                            🗑️ Xóa
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <h3>Món có sẵn ({menuInfo.staticMenu.length})</h3>
              <div className="menu-grid">
                {menuInfo.staticMenu.map(item => (
                  <div key={item.id} className="menu-item-card">
                    <h4>{item.title}</h4>
                    <p className="price">{item.price.toLocaleString()} đ</p>
                    <p className="description">{item.description}</p>
                    <span className="static-badge">Món hệ thống</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* TAB 4: VOUCHERS */}
        {activeTab === 'vouchers' && (
          <>
            <div className="vouchers-header">
              <h2>Quản lý Voucher ({vouchers.length})</h2>
              <button className="add-btn" onClick={handleAddVoucher}>
                🎟️ Tạo voucher mới
              </button>
            </div>

            {vouchers.length === 0 ? (
              <div className="empty-state">
                <p className="empty-icon">🎟️</p>
                <h3>Chưa có voucher nào</h3>
                <p>Tạo voucher để thu hút khách hàng</p>
                <button className="add-btn-empty" onClick={handleAddVoucher}>
                  ➕ Tạo voucher đầu tiên
                </button>
              </div>
            ) : (
              <div className="vouchers-grid">
                {vouchers.map(voucher => (
                  <div key={voucher.id} className={`voucher-card ${voucher.isActive ? 'active' : 'inactive'}`}>
                    <div className="voucher-header">
                      <div className="voucher-code">{voucher.code}</div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={voucher.isActive}
                          onChange={() => handleToggleVoucher(voucher.id, voucher.isActive)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="voucher-body">
                      <div className="voucher-discount">
                        Giảm {voucher.discountValue}
                        {voucher.discountType === 'percentage' ? '%' : 'đ'}
                        {voucher.maxDiscount && voucher.discountType === 'percentage' && 
                          ` (tối đa ${voucher.maxDiscount.toLocaleString()}đ)`
                        }
                      </div>
                      
                      {voucher.minOrderValue > 0 && (
                        <div className="voucher-min">
                          Đơn tối thiểu: {voucher.minOrderValue.toLocaleString()}đ
                        </div>
                      )}
                      
                      <div className="voucher-expiry">
                        HSD: {new Date(voucher.expiryDate).toLocaleDateString('vi-VN')}
                        {new Date(voucher.expiryDate) < new Date() && (
                          <span className="expired-tag">Hết hạn</span>
                        )}
                      </div>
                      
                      {voucher.description && (
                        <p className="voucher-desc">{voucher.description}</p>
                      )}
                    </div>

                    <div className="voucher-actions">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditVoucher(voucher)}
                      >
                        ✏️ Sửa
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteVoucher(voucher.id, voucher.code)}
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* MODALS */}
      <MenuItemModal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        onSave={handleSaveMenuItem}
        editItem={editingMenuItem}
      />

      <VoucherModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        onSave={handleSaveVoucher}
        editVoucher={editingVoucher}
      />
    </div>
  )
}