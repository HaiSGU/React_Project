import { useParams, useNavigate } from "react-router-dom";
import { DISCOUNTS } from "@shared/constants/DiscountList";
import { RESTAURANTS } from "@shared/constants/RestaurantsListWeb";
import { getDiscountByType, filterRestaurantsByDiscount } from "@shared/utils/restaurantHelpers";
import "./DiscountPage.css";

export default function DiscountPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  
  // Tìm discount theo type
  const discount = getDiscountByType(DISCOUNTS, type);

  if (!discount) {
    return (
      <div className="discount-page">
        <div className="container">
          <button className="back-button" onClick={() => navigate('/')}>
            ← Quay lại
          </button>
          <div className="error-container">
            <p className="error-text">Không tìm thấy mã giảm giá</p>
          </div>
        </div>
      </div>
    );
  }

  // Lọc nhà hàng áp dụng khuyến mãi
  const appliedRestaurants = filterRestaurantsByDiscount(RESTAURANTS, discount.restaurants);

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/menu/${restaurantId}`);
  };

  return (
    <div className="discount-page">
      <div className="container">
        <div className="page-header">
          <button className="back-button" onClick={() => navigate('/')}>
            ← Quay lại
          </button>
          <h1 className="page-title">{discount.label}</h1>
        </div>

        {appliedRestaurants.length > 0 ? (
          <div className="restaurants-list">
            {appliedRestaurants.map(restaurant => (
              <div 
                key={restaurant.id} 
                className="restaurant-item"
                onClick={() => handleRestaurantClick(restaurant.id)}
              >
                <div className="restaurant-image-container">
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name} 
                    className="restaurant-img"
                  />
                </div>
                <div className="restaurant-details">
                  <h3 className="restaurant-title">{restaurant.name}</h3>
                  <p className="restaurant-rating">⭐ {restaurant.rating}</p>
                  <div className="restaurant-meta">
                    <span className="meta-item">🕐 {restaurant.deliveryTime}</span>
                    <span className="meta-item">📍 {restaurant.distance}</span>
                  </div>
                </div>
                <button className="menu-button">
                  Xem menu →
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="empty-text">😔 Chưa có nhà hàng áp dụng khuyến mãi này</p>
          </div>
        )}
      </div>
    </div>
  );
}
