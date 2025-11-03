export default function AdminStatCard({ title, value }) {
  return (
    <div className="ad-card ad-stat">
      <div className="ad-stat-title">{title}</div>
      <div className="ad-stat-value">{value}</div>
    </div>
  );
}