import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RestaurantItem({ id, img, name, rating }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const handleMenuClick = () => {
    navigate(`/menu/${id}`); // ← Sửa từ /restaurants/${id} thành /menu/${id}
  };

  const fallbackImage = "https://via.placeholder.com/80x80/e0e0e0/999999?text=No+Image";

  return (
    <div className="restaurant-item">
      <img 
        src={imgError ? fallbackImage : img}
        alt={name} 
        className="restaurant-logo"
        onError={() => setImgError(true)}
      />
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