import { useNavigate } from "react-router-dom";

export default function RestaurantItem({ id, img, name, rating }) {
  const navigate = useNavigate();

  const handleMenuClick = () => {
    navigate(`/restaurants/${id}`);
  };

  return (
    <div className="restaurant-item">
      <img src={img} alt={name} className="restaurant-logo" />
      <div className="restaurant-info">
        <h3>{name}</h3>
        <p>⭐ {rating}</p>
      </div>
      <button className="menu-btn" onClick={handleMenuClick}>
        Menu
      </button>
    </div>
  );
}
