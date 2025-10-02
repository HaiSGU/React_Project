import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// 👇 Sửa lại đúng tên hàm export trong api.js
import { getRestaurantsByCategory } from "../../api/api";
import RestaurantItem from "../../components/RestaurantItem";

export default function CategoryPage() {
  const { id } = useParams();
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // 👇 gọi đúng tên hàm
    getRestaurantsByCategory(id).then(setRestaurants);
  }, [id]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Danh mục {id}</h2>
      {restaurants.map((r) => (
        <RestaurantItem key={r.id} {...r} />
      ))}
    </div>
  );
}