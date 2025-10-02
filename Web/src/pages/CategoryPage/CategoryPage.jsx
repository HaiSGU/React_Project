import RestaurantItem from "../../components/RestaurantItem";
import "./CategoryPage.css";

export default function CategoryPage() {
  // Fake dữ liệu
  const data = [
    {
      id: 1,
      name: "Jollibee",
      rating: 4.7,
      img: "https://upload.wikimedia.org/wikipedia/en/0/02/Jollibee_logo.svg",
    },
    {
      id: 2,
      name: "KFC",
      rating: 4.5,
      img: "https://1000logos.net/wp-content/uploads/2017/03/KFC_logo.png",
    },
    {
      id: 3,
      name: "Texas Chicken",
      rating: 4.5,
      img: "https://1000logos.net/wp-content/uploads/2021/07/Texas-Chicken-Logo.png",
    },
    {
      id: 4,
      name: "Lotteria",
      rating: 4.3,
      img: "https://upload.wikimedia.org/wikipedia/commons/4/40/Lotteria_logo.png",
    },
  ];

  return (
    <div className="category-page">
      <header className="cat-header">
        <span className="back-btn">←</span>
        <span className="route">category/[key]</span>
      </header>

      <h2 className="category-title">Danh mục: <span className="highlight">Đồ ăn nhanh</span></h2>

      <div className="restaurant-list">
        {data.map((r) => (
          <RestaurantItem key={r.id} {...r} />
        ))}
      </div>
    </div>
  );
}