import './OrderFilters.css'

export default function OrderFilters({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusChange,
  dateFilter,
  onDateChange,
  orderCount 
}) {
  return (
    <div className="order-filters">
      <div className="filter-row">
        <input
          type="text"
          placeholder="🔍 Tìm theo mã đơn, tên khách hàng..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        
        <select 
          value={statusFilter} 
          onChange={(e) => onStatusChange(e.target.value)}
          className="status-filter"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">⏳ Chờ xác nhận</option>
          <option value="processing">🚚 Đang giao</option>
          <option value="delivered">✅ Đã giao</option>
        </select>
      </div>

      <div className="date-filter-tabs">
        <button 
          className={`filter-tab ${dateFilter === 'today' ? 'active' : ''}`}
          onClick={() => onDateChange('today')}
        >
          Hôm nay
        </button>
        <button 
          className={`filter-tab ${dateFilter === 'week' ? 'active' : ''}`}
          onClick={() => onDateChange('week')}
        >
          7 ngày
        </button>
        <button 
          className={`filter-tab ${dateFilter === 'month' ? 'active' : ''}`}
          onClick={() => onDateChange('month')}
        >
          Tháng này
        </button>
        <button 
          className={`filter-tab ${dateFilter === 'all' ? 'active' : ''}`}
          onClick={() => onDateChange('all')}
        >
          Tất cả
        </button>
      </div>

      <div className="filter-result">
        Tìm thấy <strong>{orderCount}</strong> đơn hàng
      </div>
    </div>
  )
}