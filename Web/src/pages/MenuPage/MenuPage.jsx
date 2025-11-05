import { useNavigate, useParams } from "react-router-dom";
import { MENU_ITEMS_WEB } from "@shared/constants/MenuItemsListWeb";
import { RESTAURANTS } from "@shared/constants/RestaurantsListWeb";
import { isLoggedIn } from "@shared/services/authService";
import { useQuantities } from "@shared/hooks/useQuantities";
import MenuItem from "../../components/MenuItem";
import "./MenuPage.css";

export default function MenuPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const restaurantId = parseInt(id);

  // Lấy thông tin nhà hàng
  const restaurant = RESTAURANTS.find(r => r.id === restaurantId);
  const restaurantName = restaurant ? restaurant.name : 'Menu';

  // Filter menu theo restaurantId
  const menuForRestaurant = MENU_ITEMS_WEB.filter((item) => {
    if (Array.isArray(item.restaurantId)) {
      return item.restaurantId.includes(restaurantId);
    }
    return item.restaurantId === restaurantId;
  });

  // Dùng custom hook từ shared
  const { quantities, increase, decrease, totalPrice, cartItems } = useQuantities(menuForRestaurant);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    const checkoutPayload = {
      orderItems: cartItems,
      totalPrice,
      restaurantId,
    };

    const loggedIn = await isLoggedIn(localStorage);

    if (!loggedIn) {
      try {
        localStorage.setItem("pendingCheckout", JSON.stringify(checkoutPayload));
      } catch (error) {
        console.error("Failed to cache pending checkout:", error);
      }

      navigate("/login", {
        state: {
          from: "/checkout",
          message: "Vui lòng đăng nhập để tiếp tục đặt món.",
        },
      });
      return;
    }

    navigate("/checkout", {
      state: checkoutPayload,
    });
  };

  return (
    <div className="menu-page">
      {/* HEADER */}
      <header className="menu-header">
        <h1>{restaurantName}</h1>
      </header>

      {/* MENU LIST */}
      <div className="menu-content">
        {menuForRestaurant.length > 0 ? (
          <div className="menu-list">
            {menuForRestaurant.map((item) => (
              <MenuItem
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                rating={item.rating}
                sold={item.sold}
                image={item.image}
                description={item.description}
                quantity={quantities[item.id] || 0}
                updateQuantity={(id, change) => {
                  if (change > 0) increase(id);
                  else decrease(id);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="empty-menu">
            <p>Menu đang cập nhật...</p>
          </div>
        )}
      </div>

      {/* CART BAR */}
      {totalPrice > 0 && (
        <div className="cart-bar">
          <div className="cart-info">
            <span>{cartItems.length} món</span>
            <span>{totalPrice.toLocaleString("vi-VN")} đ</span>
          </div>
          <button className="checkout-btn" onClick={handleCheckout}>
            Thanh toán
          </button>
        </div>
      )}
    </div>
  );
}