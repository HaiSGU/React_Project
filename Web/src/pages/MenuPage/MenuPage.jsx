import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { isLoggedIn } from "@shared/services/authService";
import { useQuantities } from "@shared/hooks/useQuantities";
import MenuItem from "../../components/MenuItem";
import eventBus, { EVENT_TYPES } from "@shared/services/eventBus";
import "./MenuPage.css";

export default function MenuPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const restaurantId = id;

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const resInfo = await fetch(`http://localhost:3000/restaurants/${restaurantId}`);
      if (resInfo.ok) {
        const info = await resInfo.json();
        setRestaurant(info);
      }

      const resMenu = await fetch(`http://localhost:3000/menus?restaurantId=${restaurantId}`);
      if (resMenu.ok) {
        const data = await resMenu.json();
        const processedData = data.map(item => ({
          ...item,
          image: item.image
        }));
        setMenuItems(processedData);
      }
    } catch (error) {
      console.error("Failed to fetch menu data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    const unsubscribe = eventBus.on(EVENT_TYPES.MENU_UPDATED, (data) => {
      if (data.restaurantId === restaurantId || data.restaurantId === Number(restaurantId)) {
        fetchData();
      }
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [restaurantId]);

  const { quantities, increase, decrease, totalPrice, cartItems } = useQuantities(menuItems);

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

  if (loading) {
    return <div className="menu-page"><div className="loading">Đang tải menu...</div></div>;
  }

  return (
    <div className="menu-page">
      <header className="menu-header">
        <h1>{restaurant ? restaurant.name : 'Menu'}</h1>
        {restaurant && <p className="restaurant-address">{restaurant.address}</p>}
      </header>

      <div className="menu-content">
        {menuItems.length > 0 ? (
          <div className="menu-list">
            {menuItems.map((item) => (
              <MenuItem
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                rating={item.rating || 4.5}
                sold={item.sold || 0}
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