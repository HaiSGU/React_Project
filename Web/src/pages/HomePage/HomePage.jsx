import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getRestaurantsWithStatus } from "@shared/constants/RestaurantsListWeb";
import { CATEGORIES } from "@shared/constants/CategoryListWeb";
import { DISCOUNTS } from "@shared/constants/DiscountList";
import { MENU_ITEMS_WEB } from "@shared/constants/MenuItemsListWeb";
import { isLoggedIn, getCurrentUser, logout } from "@shared/services/authService";
import { useRestaurantSearch } from "@shared/hooks/useSearch";
import { useEventListener } from "@shared/hooks/useRealtime";
import eventBus, { EVENT_TYPES } from "@shared/services/eventBus";
import FooterNav from "../../components/FooterNav";
import shipperBg from "@shared/assets/images/shipperimage.jpeg";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [restaurantsData, setRestaurantsData] = useState(() => getRestaurantsWithStatus());

  // Search functionality - tìm nhà hàng theo tên, địa chỉ, category VÀ món ăn
  const { 
    query, 
    setQuery, 
    filteredRestaurants, 
    noResults 
  } = useRestaurantSearch(restaurantsData, MENU_ITEMS_WEB); // Dùng MENU_ITEMS_WEB với ảnh đã resolve

  // Hiển thị kết quả search hoặc featured restaurants
  const displayRestaurants = query.trim() 
    ? filteredRestaurants 
    : restaurantsData.filter(r => r.isFeatured);

  // Check login status
  useEffect(() => {
    const loadLoginStatus = async () => {
      const loggedInStatus = await isLoggedIn(localStorage);
      setLoggedIn(loggedInStatus);
      
      if (loggedInStatus) {
        const user = await getCurrentUser(localStorage);
        setUserInfo(user);
      }
    };
    loadLoginStatus();
    // Đồng bộ restaurant status lần đầu
    setRestaurantsData(getRestaurantsWithStatus());

    const unsubscribe = eventBus.on(EVENT_TYPES.RESTAURANT_STATUS_CHANGED, () => {
      setRestaurantsData(getRestaurantsWithStatus());
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  // Cập nhật khi storage thay đổi (từ tab khác)
  useEventListener(EVENT_TYPES.RESTAURANT_STATUS_CHANGED, () => {
    setRestaurantsData(getRestaurantsWithStatus());
  });

  const handleLogout = async () => {
    await logout(localStorage);
    setLoggedIn(false);
    setUserInfo(null);
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleCategoryClick = (categoryKey) => {
    navigate(`/category/${categoryKey}`);
  };

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/menu/${restaurantId}`);
  };

  const handleDiscountClick = (discountType) => {
    navigate(`/discount/${discountType}`);
  };

  return (
    <div className="homepage" style={{ backgroundImage: `url(${shipperBg})` }}>
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <span className="hero-icon">🔥</span>
              <span>
                {loggedIn 
                  ? `Xin chào ${userInfo?.username || 'bạn'}, hôm nay ăn gì nè?` 
                  : 'Chào mừng bạn đến với FoodFast'}
              </span>
            </div>
            <button 
              className="btn-logout" 
              onClick={loggedIn ? handleLogout : handleLogin}
            >
              {loggedIn ? 'Đăng xuất' : 'Đăng nhập'}
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="container">
          <div className="search-wrap">
            <span className="material-icons-outlined search-icon">search</span>
            <input 
              className="search-input" 
              placeholder="Tìm nhà hàng, món ăn..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button 
                className="search-clear"
                onClick={() => setQuery('')}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search Results Header */}
      {query.trim() !== '' && (
        <div className="search-result-section">
          <div className="container">
            <div className="search-result-header">
              <p className="search-result-text">
                {noResults 
                  ? 'Không tìm thấy kết quả' 
                  : `Tìm thấy ${filteredRestaurants.length} nhà hàng`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Categories - Luôn hiển thị, chỉ ẩn khi search */}
      {!query.trim() && (
        <section className="categories-section">
          <div className="container">
            <h2 className="section-title">Danh mục</h2>
            <div className="categories-grid">
              {CATEGORIES.filter(c => c.key !== 'all').map(cat => (
                <div 
                  key={cat.id} 
                  className="category-item"
                  onClick={() => handleCategoryClick(cat.key)}
                >
                  <div className="category-image-wrap">
                    <img src={cat.image} alt={cat.name} className="category-image" />
                  </div>
                  <span className="category-name">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promotions - Luôn hiển thị, chỉ ẩn khi search */}
      {!query.trim() && (
        <section className="promos-section">
          <div className="container">
            <h2 className="section-title">Chương trình giảm giá</h2>
            <div className="promos-grid">
              {DISCOUNTS.map(p => (
                <div 
                  key={p.type} 
                  className="promo-badge"
                  onClick={() => handleDiscountClick(p.type)}
                >
                  {p.label}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Restaurants */}
      <section className="restaurants-section">
        <div className="container">
          <h2 className="section-title">
            <span className="star-icon">{query.trim() ? '🔍' : '⭐'}</span>
            {query.trim() ? 'Kết quả tìm kiếm' : 'Nhà hàng nổi bật'}
          </h2>
          {displayRestaurants.length > 0 ? (
            <div className="restaurants-scroll">
              {displayRestaurants.map((r) => {
                const isActive = r.status === 'active';
                let statusLabel = null;

                if (!isActive) {
                  if (r.status === 'suspended') {
                    statusLabel = 'Tạm ngưng';
                  } else if (r.status === 'pending') {
                    statusLabel = 'Chờ duyệt';
                  } else {
                    statusLabel = 'Không khả dụng';
                  }
                }

                return (
                  <div 
                    key={r.id} 
                    className={`restaurant-card ${!isActive ? 'is-disabled' : ''}`}
                    onClick={() => isActive && handleRestaurantClick(r.id)}
                    role="button"
                    tabIndex={isActive ? 0 : -1}
                    aria-disabled={!isActive}
                    onKeyDown={(e) => {
                      if (isActive && (e.key === 'Enter' || e.key === ' ')) {
                        handleRestaurantClick(r.id);
                      }
                    }}
                  >
                    {!isActive && (
                      <div className="restaurant-status-overlay">
                        {statusLabel}
                      </div>
                    )}
                    <div className="restaurant-image-wrap">
                      <img src={r.image} alt={r.name} className="restaurant-image" />
                    </div>
                    <div className="restaurant-info">
                      <h3 className="restaurant-name">{r.name}</h3>
                      <div className="restaurant-meta">
                        <span className="meta-item">
                          <span className="meta-icon">⭐</span>
                          {r.rating}
                        </span>
                        <span className="meta-item">
                          <span className="meta-icon">🕐</span>
                          {r.deliveryTime}
                        </span>
                        <span className="meta-item">
                          <span className="meta-icon">📍</span>
                          {r.distance}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-container">
              <p className="empty-text">
                {noResults ? '😔 Không tìm thấy nhà hàng phù hợp' : 'Chưa có nhà hàng'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer Navigation - CHỈ Ở TRANG CHỦ */}
      <FooterNav />
    </div>
  );
}
