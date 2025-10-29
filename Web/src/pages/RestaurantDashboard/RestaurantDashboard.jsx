import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RESTAURANTS } from "../../utils/restaurantResolver";
import './RestaurantDashboard.css';

// Lấy thông tin nhà hàng từ localStorage
const getRestaurantInfo = () => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const parsed = JSON.parse(userInfo);
    if (parsed.role === 'restaurant') {
      // Tìm nhà hàng trong RESTAURANTS dựa vào username
      // Ví dụ: username = "rest-jollibee" → tìm restaurant có name chứa "jollibee"
      const restaurantName = parsed.username.replace('rest-', '');
      const restaurant = RESTAURANTS.find(
        r => r.name.toLowerCase().includes(restaurantName.toLowerCase())
      );
      return restaurant || null;
    }
  }
  return null;
};

const emptyItem = {
  id: '',
  name: '',
  price: '',
  description: '',
  imageUrl: '',
  isAvailable: true,
};

export default function RestaurantDashboard() {
  const navigate = useNavigate();
  const restaurant = getRestaurantInfo();
  
  // Nếu không tìm thấy nhà hàng, redirect về login
  useEffect(() => {
    if (!restaurant) {
      alert('Vui lòng đăng nhập với tài khoản nhà hàng hợp lệ');
      navigate('/login');
    }
  }, [restaurant, navigate]);

  // Tạo key riêng theo ID nhà hàng
  const MENU_KEY = `restaurant_menu_${restaurant?.id}`;
  const ORDERS_KEY = `restaurant_orders_${restaurant?.id}`;

  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyItem);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('menu');

  useEffect(() => {
    if (!restaurant) return;
    const menuRaw = localStorage.getItem(MENU_KEY);
    const ordersRaw = localStorage.getItem(ORDERS_KEY);
    setMenu(menuRaw ? JSON.parse(menuRaw) : []);
    setOrders(ordersRaw ? JSON.parse(ordersRaw) : []);
  }, [restaurant, MENU_KEY, ORDERS_KEY]);

  const saveMenu = (next) => {
    setMenu(next);
    localStorage.setItem(MENU_KEY, JSON.stringify(next));
  };

  const filteredMenu = useMemo(() => {
    const s = query.trim().toLowerCase();
    if (!s) return menu;
    return menu.filter(
      (item) =>
        item.name.toLowerCase().includes(s) ||
        item.description.toLowerCase().includes(s)
    );
  }, [query, menu]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Vui lòng nhập tên món.');
      return;
    }
    if (!form.price || Number.isNaN(Number(form.price))) {
      alert('Giá không hợp lệ.');
      return;
    }
    const payload = {
      ...form,
      price: Number(form.price),
      id: editingId ?? (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
    };
    const next = editingId
      ? menu.map((item) => (item.id === editingId ? payload : item))
      : [payload, ...menu];
    saveMenu(next);
    setForm(emptyItem);
    setEditingId(null);
  };

  const onEdit = (item) => {
    setEditingId(item.id);
    setForm({
      id: item.id,
      name: item.name,
      price: String(item.price),
      description: item.description,
      imageUrl: item.imageUrl,
      isAvailable: item.isAvailable,
    });
  };

  const onDelete = (id) => {
    if (!confirm('Xóa món ăn này?')) return;
    const next = menu.filter((item) => item.id !== id);
    saveMenu(next);
    if (editingId === id) {
      setForm(emptyItem);
      setEditingId(null);
    }
  };

  const toggleStatus = (id) => {
    const next = menu.map((item) =>
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    );
    saveMenu(next);
  };

  const fakeCompleteOrder = (id) => {
    const next = orders.map((order) =>
      order.id === id ? { ...order, status: 'completed' } : order
    );
    setOrders(next);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
  };

  if (!restaurant) return null;

  return (
    <div className="rest-dashboard">
      <header className="rest-dashboard__header">
        <div>
          <h1>{restaurant.name} Dashboard</h1>
          <p className="subtitle">{restaurant.address} • ⭐ {restaurant.rating}</p>
        </div>
        <nav>
          <button
            className={tab === 'menu' ? 'active' : ''}
            onClick={() => setTab('menu')}
          >
            Menu
          </button>
          <button
            className={tab === 'orders' ? 'active' : ''}
            onClick={() => setTab('orders')}
          >
            Đơn hàng ({orders.length})
          </button>
        </nav>
      </header>

      {tab === 'menu' && (
        <>
          <section className="rest-dashboard__form">
            <h2>{editingId ? 'Cập nhật món ăn' : 'Thêm món mới'}</h2>
            <form onSubmit={onSubmit}>
              <div className="row">
                <label>Tên món *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  required
                />
              </div>
              <div className="row">
                <label>Giá (VND) *</label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={form.price}
                  onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
                  required
                />
              </div>
              <div className="row">
                <label>Mô tả</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                />
              </div>
              <div className="row">
                <label>Ảnh (URL)</label>
                <input
                  value={form.imageUrl}
                  onChange={(e) => setForm((s) => ({ ...s, imageUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
              <div className="row checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={form.isAvailable}
                    onChange={(e) => setForm((s) => ({ ...s, isAvailable: e.target.checked }))}
                  />
                  Đang phục vụ
                </label>
              </div>
              <div className="actions">
                <button type="submit">{editingId ? 'Lưu thay đổi' : 'Thêm món'}</button>
                {editingId && (
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => {
                      setForm(emptyItem);
                      setEditingId(null);
                    }}
                  >
                    Hủy
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="rest-dashboard__list">
            <header>
              <h2>Danh sách món ({filteredMenu.length})</h2>
              <input
                placeholder="Tìm theo tên/mô tả..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </header>
            <div className="menu-grid">
              {filteredMenu.map((item) => (
                <article key={item.id} className={!item.isAvailable ? 'inactive' : ''}>
                  <div className="thumb">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} />
                    ) : (
                      <span className="placeholder">No image</span>
                    )}
                  </div>
                  <div className="info">
                    <h3>{item.name}</h3>
                    <p className="price">{item.price.toLocaleString()} đ</p>
                    {item.description && <p className="desc">{item.description}</p>}
                    <p className={`status ${item.isAvailable ? 'open' : 'close'}`}>
                      {item.isAvailable ? 'Đang phục vụ' : 'Tạm ngưng'}
                    </p>
                  </div>
                  <div className="card-actions">
                    <button onClick={() => onEdit(item)}>Sửa</button>
                    <button className="warning" onClick={() => toggleStatus(item.id)}>
                      {item.isAvailable ? 'Tạm ngưng' : 'Mở bán'}
                    </button>
                    <button className="danger" onClick={() => onDelete(item.id)}>
                      Xóa
                    </button>
                  </div>
                </article>
              ))}
              {filteredMenu.length === 0 && (
                <p className="empty">Chưa có món nào phù hợp.</p>
              )}
            </div>
          </section>
        </>
      )}

      {tab === 'orders' && (
        <section className="rest-dashboard__orders">
          <h2>Đơn hàng gần nhất</h2>
          <table>
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    {order.customerName}
                    <br />
                    <small>{order.customerPhone}</small>
                  </td>
                  <td>{order.total?.toLocaleString()} đ</td>
                  <td>{order.status}</td>
                  <td>
                    {order.status !== 'completed' ? (
                      <button onClick={() => fakeCompleteOrder(order.id)}>Hoàn tất</button>
                    ) : (
                      <span className="badge">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center' }}>
                    Chưa có đơn hàng.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}