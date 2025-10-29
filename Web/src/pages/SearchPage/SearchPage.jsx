import React from 'react';
import { useRestaurantSearch } from '@shared/hooks/useSearch';
import { RESTAURANTS } from '../../utils/restaurantResolver';
import { MENU_ITEMS } from '@shared/constants/MenuItems';
import './SearchPage.css';

/**
 * Ví dụ Search Page cho Web
 * Tìm kiếm nhà hàng theo tên, địa chỉ, category HOẶC món ăn
 */
export default function SearchPage() {
  const { 
    query, 
    setQuery, 
    filteredRestaurants, 
    noResults,
    resultCount 
  } = useRestaurantSearch(RESTAURANTS, MENU_ITEMS);

  return (
    <div className="search-page">
      <div className="search-container">
        <h1>Tìm kiếm nhà hàng & món ăn</h1>
        
        {/* Search Input */}
        <div className="search-box">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm nhà hàng, món ăn..."
            className="search-input"
          />
          {query && (
            <button 
              onClick={() => setQuery('')} 
              className="clear-btn"
            >
              ✕
            </button>
          )}
        </div>

        {/* Search Results */}
        {query && (
          <div className="search-results">
            <p className="result-count">
              {noResults 
                ? 'Không tìm thấy kết quả' 
                : `Tìm thấy ${resultCount} nhà hàng`}
            </p>

            <div className="restaurant-grid">
              {filteredRestaurants.map(restaurant => (
                <div key={restaurant.id} className="restaurant-card">
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name}
                    className="restaurant-img" 
                  />
                  <div className="restaurant-info">
                    <h3>{restaurant.name}</h3>
                    <p className="address">{restaurant.address}</p>
                    <p className="rating">⭐ {restaurant.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
