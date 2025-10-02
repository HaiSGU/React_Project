export default function RestaurantCard({ img, name, rating }) {
  return (
    <div className="card restaurant-card">
      <img src={img} alt={name} />
      <div>{name}</div>
      <small>⭐ {rating}</small>
    </div>
  );
}