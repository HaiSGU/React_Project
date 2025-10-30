import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CategoryCard from "../../components/CategoryCard";
import DiscountCard from "../../components/DiscountCard";
import RestaurantCard from "../../components/RestaurantCard";
import SearchBar from "../../components/SearchBar";
import FooterNav from "../../components/FooterNav";
import { RESTAURANTS } from "../../utils/restaurantResolver";
import { CATEGORIES } from "../../utils/categoryResolver";
import { DISCOUNTS } from "@shared/constants/DiscountList";
import { useSearch } from "@shared/hooks/useSearch";
import shipperimage from "@shared/assets/images/shipperimage.jpeg";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Lấy thông tin user nếu có
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("isLoggedIn");
    setUser(null);
  };

  const { query, setQuery, filteredItems: searchResults, noResults } = useSearch(
    RESTAURANTS,
    ["name", "address", "category"]
  );

  const displayRestaurants = query.trim()
    ? searchResults
    : RESTAURANTS.filter((r) => r.isFeatured);

  return (
    <div className="home-page">
      <header className="home-header">Home</header>

      <div className="banner">
        {user ? (
          <div className="user-info">
            <span>👋 Xin chào {user.username}, hôm nay ăn gì nè?</span>
            <button className="logout-btn" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        ) : (
          <div className="guest-info">
            <span>Chào mừng bạn đến với FoodFast</span>
            <button
              className="login-btn"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </button>
          </div>
        )}
      </div>

      {/* ============== Search Bar ============== */}
      <div className="search-container">
        <SearchBar
          value={query}
          onChange={setQuery}
          onClear={() => setQuery("")}
          placeholder="Tìm nhà hàng, món ăn..."
        />
        {query.trim() !== "" && (
          <div className="search-result-info">
            {noResults
              ? "😔 Không tìm thấy kết quả phù hợp"
              : `Tìm thấy ${searchResults.length} nhà hàng`}
          </div>
        )}
      </div>

      {!query.trim() && (
        <>
          <section className="categories">
            <h3>Danh mục</h3>
            <div className="scroll-list">
              {CATEGORIES.filter((c) => c.key !== "all").map((cat) => (
                <Link key={cat.key} to={`/category/${cat.key}`}>
                  <CategoryCard name={cat.label} img={cat.icon} />
                </Link>
              ))}
            </div>
          </section>

          <section className="discounts">
            <h3>Chương trình giảm giá</h3>
            <div className="scroll-list">
              {DISCOUNTS.map((discount) => (
                <Link key={discount.type} to={`/discount/${discount.type}`}>
                  <DiscountCard text={discount.label} />
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      <section className="restaurants">
        <h3>{query.trim() ? "🔍 Kết quả tìm kiếm" : "⭐ Nhà hàng nổi bật"}</h3>
        <div className="scroll-list">
          {displayRestaurants.length > 0 ? (
            displayRestaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/menu/${restaurant.id}`}
                onClick={(e) => {
                  // nếu chưa đăng nhập thì bắt đăng nhập trước khi xem menu
                  if (!user) {
                    e.preventDefault();
                    navigate("/login", { state: { from: `/menu/${restaurant.id}` } });
                  }
                }}
              >
                <RestaurantCard
                  name={restaurant.name}
                  rating={restaurant.rating}
                  img={restaurant.image}
                />
              </Link>
            ))
          ) : (
            <div className="no-results">
              {noResults
                ? "😔 Không tìm thấy nhà hàng phù hợp"
                : "Chưa có nhà hàng"}
            </div>
          )}
        </div>
      </section>

      <FooterNav />
    </div>
  );
}
