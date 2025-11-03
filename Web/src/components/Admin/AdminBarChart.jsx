export default function AdminBarChart({ series }) {
  const max = Math.max(1, ...series.map(s => s.total));
  return (
    <div className="ad-card">
      <h3>7 ngày gần nhất (VNĐ)</h3>
      <div className="ad-bars">
        {series.map(d => (
          <div key={d.date} className="ad-bar">
            <div
              className="ad-bar-fill"
              style={{ height: `${Math.max(6, (d.total / max) * 120)}px` }}
              title={`${d.date}: ${d.total.toLocaleString()} đ`}
            />
            <small>{d.date.slice(5)}</small>
          </div>
        ))}
      </div>
    </div>
  );
}