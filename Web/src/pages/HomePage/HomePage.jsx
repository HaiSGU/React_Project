import { Link } from "react-router-dom";
import CategoryCard from "../../components/CategoryCard";
import DiscountCard from "../../components/DiscountCard";
import RestaurantCard from "../../components/RestaurantCard";
import FooterNav from "../../components/FooterNav";
import "./HomePage.css";

export default function HomePage({ user }) {
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

      {/* ============== Categories ============== */}
      <section className="categories">
        <h3>Danh mục</h3>
        <div className="scroll-list">
          {/* bọc = Link */}
          <Link to="/category/1">
            <CategoryCard
              name="Đồ ăn nhanh"
              img="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
            />
          </Link>
          <Link to="/category/2">
            <CategoryCard
              name="Cà phê - Trà - Sinh tố"
              img="https://cdn-icons-png.flaticon.com/512/415/415682.png"
            />
          </Link>
        </div>
      </section>

      {/* ============== Discounts ============== */}
      <section className="discounts">
        <h3>Chương trình giảm giá</h3>
        <div className="scroll-list">
          <Link to="/discount/freeship"><DiscountCard text="FREESHIP" /></Link>
          <Link to="/discount/10"><DiscountCard text="GIẢM 10%" /></Link>
          <Link to="/discount/20"><DiscountCard text="GIẢM 20%" /></Link>
        </div>
      </section>

      {/* ============== Restaurants ============== */}
      <section className="restaurants">
        <h3>⭐ Nhà hàng nổi bật</h3>
        <div className="scroll-list">
          <Link to="/menu/1">
            <RestaurantCard
              name="Jollibee"
              rating="4.7"
              img="https://upload.wikimedia.org/wikipedia/en/0/02/Jollibee_logo.svg"
            />
          </Link>
          <Link to="/menu/2">
            <RestaurantCard
              name="KFC"
              rating="4.5"
              img="https://1000logos.net/wp-content/uploads/2017/03/KFC_logo.png"
            />
          </Link>
        </div>
      </section>

      <FooterNav />
    </div>
  );
}