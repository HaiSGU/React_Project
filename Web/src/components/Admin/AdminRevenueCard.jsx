export default function AdminRevenueCard({ revenue }) {
  const { total, restaurant, app, percentages } = revenue;
  return (
    <div className="ad-card">
      <h3>Doanh thu (tổng)</h3>
      <div className="ad-revenue-total">{total.toLocaleString()} đ</div>
      <div className="ad-revenue-split">
        <div className="row">
          <span>🏪 Nhà hàng ({percentages.restaurant}%):</span>
          <b>{restaurant.toLocaleString()} đ</b>
        </div>
        <div className="row">
          <span>📱 App ({percentages.app}%):</span>
          <b>{app.toLocaleString()} đ</b>
        </div>
      </div>
    </div>
  );
}