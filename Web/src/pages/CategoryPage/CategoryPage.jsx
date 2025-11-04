import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RESTAURANTS } from "@shared/constants/RestaurantsListWeb";
import { CATEGORIES } from "../../utils/categoryResolver";
import RestaurantItem from "../../components/RestaurantItem";
import "./CategoryPage.css";

export default function CategoryPage() {
  const { id } = useParams();
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // Lọc nhà hàng theo category từ RESTAURANTS
    const filtered = RESTAURANTS.filter(restaurant => {
      // Xử lý trường hợp category là array hoặc string
      if (Array.isArray(restaurant.category)) {
        return restaurant.category.includes(id);
      }
      return restaurant.category === id;
    });
    
    console.log("Category ID:", id);
    console.log("Restaurants filtered:", filtered);
    setRestaurants(filtered);
  }, [id]);

  // Lấy tên danh mục từ CATEGORIES
  const getCategoryName = () => {
    const category = CATEGORIES.find(cat => cat.key === id);
    return category ? category.label : id;
  };

  return (
    <div className="category-page">
      <div className="category-header">
        <h2 className="category-title">{getCategoryName()}</h2>
        <p className="restaurant-count">
          {restaurants.length} nhà hàng
        </p>
      </div>

      {restaurants.length > 0 ? (
        <div className="restaurants-list">
          {restaurants.map((restaurant) => (
            <RestaurantItem 
              key={restaurant.id} 
              id={restaurant.id}
              img={restaurant.image}
              name={restaurant.name}
              rating={restaurant.rating}
            />
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