export default function RestaurantItem({ img, name, rating }) {
  return (
    <div className="restaurant-item">
      <img src={img} alt={name} className="restaurant-logo" />
      <div className="restaurant-info">
        <h3>{name}</h3>
        <p>⭐ {rating}</p>
      </div>
      <button className="menu-btn">Menu</button>
    </div>
  );
}