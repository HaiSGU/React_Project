import { useEffect, useState } from 'react';
import { getAdminOverview } from '../../../../shared/services/adminMetricsService';
import { logoutAdmin, getAdminSession } from '../../../../shared/services/adminAuthService';
import AdminStatCard from '../../components/Admin/AdminStatCard';
import AdminRevenueCard from '../../components/Admin/AdminRevenueCard';
import AdminBarChart from '../../components/Admin/AdminBarChart';
import '../../components/Admin/Admin.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const session = getAdminSession(sessionStorage);

  const refresh = () => setStats(getAdminOverview(localStorage));
  useEffect(() => { refresh(); }, []);

  if (!stats) return <div style={{ padding:24 }}>Loading…</div>;

  return (
    <div style={{ padding:24 }}>
      <header style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h2>Admin Dashboard</h2>
        <div>
          <button onClick={refresh} style={{ marginRight:8 }}>Làm mới</button>
          <span style={{ marginRight:12 }}>Xin chào, {session?.email}</span>
          <button onClick={() => { logoutAdmin(sessionStorage); location.href = '/admin/login'; }}>
            Đăng xuất
          </button>
        </div>
      </header>

      <section className="ad-grid ad-grid-4" style={{ marginTop:16 }}>
        <AdminStatCard title="Tổng đơn" value={stats.counts.totalOrders} />
        <AdminStatCard title="Hoàn thành" value={stats.counts.completed} />
        <AdminStatCard title="Đang giao" value={stats.counts.delivering} />
        <AdminStatCard title="Đã hủy" value={stats.counts.cancelled} />
      </section>

      <section className="ad-grid ad-grid-2" style={{ marginTop:16 }}>
        <AdminRevenueCard revenue={stats.revenue} />
        <AdminBarChart series={stats.dailySeries} />
      </section>

      <section className="ad-card" style={{ marginTop:16 }}>
        <h3>Top nhà hàng theo doanh thu</h3>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign:'left', padding:8 }}>Restaurant ID</th>
              <th style={{ textAlign:'right', padding:8 }}>Revenue (đ)</th>
            </tr>
          </thead>
          <tbody>
            {stats.leaderboard.map(x => (
              <tr key={x.restaurantId}>
                <td style={{ padding:8 }}>{x.restaurantId}</td>
                <td style={{ padding:8, textAlign:'right' }}>{x.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}