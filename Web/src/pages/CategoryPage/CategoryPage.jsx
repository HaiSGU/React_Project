import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RESTAURANTS } from "@shared/constants/RestaurantsListWeb";
import { CATEGORIES } from "@shared/constants/CategoryListWeb";
import { filterRestaurantsByCategory, getCategoryLabel } from "@shared/utils/restaurantHelpers";
import "./CategoryPage.css";

export default function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // Lọc nhà hàng theo category using shared helper
    const filtered = filterRestaurantsByCategory(RESTAURANTS, id);
    setRestaurants(filtered);
  }, [id]);

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/menu/${restaurantId}`);
  };

  return (
    <div className="category-page">
      <div className="category-header">
        <h2 className="category-title">{getCategoryLabel(CATEGORIES, id)}</h2>
        <p className="restaurant-count">
          {restaurants.length} nhà hàng
        </p>
      </div>

      {restaurants.length > 0 ? (
        <div className="restaurants-list">
          {restaurants.map((restaurant) => (
            <div 
              key={restaurant.id} 
              className="restaurant-item"
              onClick={() => handleRestaurantClick(restaurant.id)}
            >
              <img 
                src={restaurant.image} 
                alt={restaurant.name}
                className="restaurant-logo"
              />
              <div className="restaurant-info">
                <h3>{restaurant.name}</h3>
                <div className="restaurant-meta">
                  <p className="restaurant-rating">⭐ {restaurant.rating}</p>
                  <p>🕐 {restaurant.deliveryTime || '20-30 phút'}</p>
                  <p>📍 {restaurant.distance || '2.5 km'}</p>
                </div>
                {restaurant.promo && (
                  <div className="restaurant-promo">
                    🏷️ {restaurant.promo}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <p>😔 Không có nhà hàng nào trong danh mục này.</p>
        </div>
      )}
    </div>
  );
}