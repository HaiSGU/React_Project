import CategoryCard from "../../components/CategoryCard";
import DiscountCard from "../../components/DiscountCard";
import RestaurantCard from "../../components/RestaurantCard";
import FooterNav from "../../components/FooterNav";
import "./HomePage.css";

export default function HomePage({ user }) {
  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">Home</header>

      {/* Banner chào */}
      <div className="banner">
        {user ? (
          <span>👋 Xin chào {user.username}, hôm nay ăn gì nè?</span>
        ) : (
          <span>Chào mừng bạn đến với FoodFast</span>
        )}
        {!user && <button className="login-btn">Đăng nhập</button>}
      </div>

      {/* Categories */}
      <section className="categories">
        <h3>Danh mục</h3>
        <div className="scroll-list">
          <CategoryCard
            name="Đồ ăn nhanh"
            img="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
          />
          <CategoryCard
            name="Cà phê - Trà - Sinh tố"
            img="https://cdn-icons-png.flaticon.com/512/415/415682.png"
          />
        </div>
      </section>

      {/* Discounts */}
      <section className="discounts">
        <h3>Chương trình giảm giá</h3>
        <div className="scroll-list">
          <DiscountCard text="FREESHIP" />
          <DiscountCard text="GIẢM 10%" />
          <DiscountCard text="GIẢM 20%" />
        </div>
      </section>

      {/* Restaurants */}
      <section className="restaurants">
        <h3>⭐ Nhà hàng nổi bật</h3>
        <div className="scroll-list">
          <RestaurantCard
            name="Jollibee"
            rating="4.7"
            img="https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Jollibee_logo.svg/1200px-Jollibee_logo.svg.png"
          />
          <RestaurantCard
            name="KFC"
            rating="4.5"
            img="https://1000logos.net/wp-content/uploads/2017/03/KFC_logo.png"
          />
        </div>
      </section>

      <FooterNav />
    </div>
  );
}