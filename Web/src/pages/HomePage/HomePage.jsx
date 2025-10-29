import { Link } from "react-router-dom";
import { useState } from "react";
import CategoryCard from "../../components/CategoryCard";
import DiscountCard from "../../components/DiscountCard";
import RestaurantCard from "../../components/RestaurantCard";
import SearchBar from "../../components/SearchBar";
import FooterNav from "../../components/FooterNav";
import { RESTAURANTS } from "../../utils/restaurantResolver";
import { CATEGORIES } from "../../utils/categoryResolver";
import { DISCOUNTS } from "@shared/constants/DiscountList";
import { useSearch } from "@shared/hooks/useSearch";
import "./HomePage.css";

export default function HomePage({ user }) {
  // Search functionality
  const { query, setQuery, filteredItems: searchResults, noResults } = useSearch(
    RESTAURANTS,
    ['name', 'address', 'category']
  );

  // Hiển thị kết quả search hoặc featured restaurants
  const displayRestaurants = query.trim() 
    ? searchResults 
    : RESTAURANTS.filter(r => r.isFeatured);
  return (
    <div className="home-page">
      <header className="home-header">Home</header>

      <div className="banner">
        {user ? (
          <span>👋 Xin chào {user.username}, hôm nay ăn gì nè?</span>
        ) : (
          <span>Chào mừng bạn đến với FoodFast</span>
        )}
        {!user && <button className="login-btn">Đăng nhập</button>}
      </div>

      {/* ============== Search Bar ============== */}
      <div className="search-container">
        <SearchBar
          value={query}
          onChange={setQuery}
          onClear={() => setQuery('')}
          placeholder="Tìm nhà hàng, món ăn..."
        />
        {query.trim() !== '' && (
          <div className="search-result-info">
            {noResults 
              ? '😔 Không tìm thấy kết quả phù hợp' 
              : `Tìm thấy ${searchResults.length} nhà hàng`}
          </div>
        )}
      </div>

      {/* Ẩn Categories và Discounts khi đang search */}
      {!query.trim() && (
        <>
          {/* ============== Categories ============== */}
          <section className="categories">
            <h3>Danh mục</h3>
            <div className="scroll-list">
              {CATEGORIES.filter(c => c.key !== 'all').map(cat => (
                <Link key={cat.key} to={`/category/${cat.key}`}>
                  <CategoryCard name={cat.label} img={cat.icon} />
                </Link>
              ))}
            </div>
          </section>

          {/* ============== Discounts ============== */}
          <section className="discounts">
            <h3>Chương trình giảm giá</h3>
            <div className="scroll-list">
              {DISCOUNTS.map(discount => (
                <Link key={discount.type} to={`/discount/${discount.type}`}>
                  <DiscountCard text={discount.label} />
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ============== Restaurants ============== */}
      <section className="restaurants">
        <h3>{query.trim() ? '🔍 Kết quả tìm kiếm' : '⭐ Nhà hàng nổi bật'}</h3>
        <div className="scroll-list">
          {displayRestaurants.length > 0 ? (
            displayRestaurants.map(restaurant => (
              <Link key={restaurant.id} to={`/menu/${restaurant.id}`}>
                <RestaurantCard
                  name={restaurant.name}
                  rating={restaurant.rating}
                  img={restaurant.image}
                />
              </Link>
            ))
          ) : (
            <div className="no-results">
              {noResults ? '😔 Không tìm thấy nhà hàng phù hợp' : 'Chưa có nhà hàng'}
            </div>
          )}
        </div>
      </section>

      <FooterNav />
    </div>
  );
}