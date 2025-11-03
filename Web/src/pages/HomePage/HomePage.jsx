import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CategoryCard from "../../components/CategoryCard";
import DiscountCard from "../../components/DiscountCard";
import RestaurantCard from "../../components/RestaurantCard";
import SearchBar from "../../components/SearchBar";
import FooterNav from "../../components/FooterNav";
import { RESTAURANTS } from "@shared/constants/RestaurantsListWeb";
import { CATEGORIES } from "@shared/constants/CategoryListWeb";
import { DISCOUNTS } from "@shared/constants/DiscountList";
import "./HomePage.css";

export default function HomePage() {
  const promos = [
    { id: 1, code: 'FREESHIP' },
    { id: 2, code: 'GIẢM 10%' },
    { id: 3, code: 'GIẢM 20%' },
    { id: 4, code: 'GIẢM 30%' },
  ];

  return (
    <div className="homepage">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <span className="hero-icon">🔥</span>
              <span>Xin chào rest-pizza, hôm nay ăn gì nè?</span>
            </div>
            <button className="btn-logout">Đăng xuất</button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="search-section">
        <div className="container">
          <div className="search-wrap">
            <span className="material-icons-outlined search-icon">search</span>
            <input 
              className="search-input" 
              placeholder="Tìm nhà hàng, món ăn..."
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Danh mục</h2>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <div key={cat.id} className="category-item">
                <div className="category-image-wrap">
                  <img src={cat.image} alt={cat.name} className="category-image" />
                </div>
                <span className="category-name">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions */}
      <section className="promos-section">
        <div className="container">
          <h2 className="section-title">Chương trình giảm giá</h2>
          <div className="promos-grid">
            {promos.map(p => (
              <div key={p.id} className="promo-badge">
                {p.code}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurants */}
      <section className="restaurants-section">
        <div className="container">
          <h2 className="section-title">
            <span className="star-icon">⭐</span>
            Nhà hàng nổi bật
          </h2>
          <div className="restaurants-grid">
            {RESTAURANTS.filter(r => r.isFeatured).map(r => (
              <div key={r.id} className="restaurant-card">
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
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
