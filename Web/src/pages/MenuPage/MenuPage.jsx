import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { MENU_ITEMS } from "@shared/constants/MenuItems"
import MenuItem from "../../components/MenuItem"
import "./MenuPage.css"

export default function MenuPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { id } = useParams()
  const restaurantId = parseInt(id)

  useEffect(() => {
    setLoading(true)

    // NGUỒN 1: Món có sẵn từ MENU_ITEMS
    const staticItems = MENU_ITEMS
      .filter(item => {
        if (Array.isArray(item.restaurantId)) {
          return item.restaurantId.includes(restaurantId)
        }
        return item.restaurantId === restaurantId
      })
      .map(item => ({
        id: `static_${item.id}`,
        name: item.title,
        description: item.description,
        price: item.price,
        img: `/images/menu/${item.image}`, // ← CODE THẲNG, KHÔNG DÙNG HELPER
        rating: item.rating || 4.5,
        sold: item.sold || 0,
        quantity: 0,
      }))

    // NGUỒN 2: Món Owner tự thêm từ localStorage
    const localMenuKey = `restaurant_menu_${restaurantId}`
    const localMenu = localStorage.getItem(localMenuKey)
    const customItems = localMenu ? JSON.parse(localMenu) : []

    const formattedCustomItems = customItems.map(item => ({
      id: `custom_${item.id}`,
      name: item.name,
      description: item.description || '',
      price: item.price,
      img: item.imageUrl || null,
      rating: 4.5,
      sold: 0,
      quantity: 0,
    }))

    // GỘP CẢ 2 NGUỒN
    setItems([...staticItems, ...formattedCustomItems])
    setLoading(false)
  }, [restaurantId])

  const updateQuantity = (id, change) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      )
    )
  }

  const selectedItems = items.filter(i => i.quantity > 0)
  const totalPrice = selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const handleCheckout = () => {
    navigate("/checkout", { state: { orderItems: selectedItems, totalPrice } })
  }

  const handleBack = () => navigate(-1)

  if (loading) return <div className="loading">Đang tải menu...</div>

  return (
    <div className="menu-page">
      <header className="menu-header">
        <button className="back-btn" onClick={handleBack}>←</button>
        <span>Menu nhà hàng #{id}</span>
      </header>

      <div className="menu-list">
        {items.length === 0 ? (
          <p className="empty">Menu đang cập nhật...</p>
        ) : (
          items.map(item => (
            <MenuItem
              key={item.id}
              {...item}
              updateQuantity={updateQuantity}
            />
          ))
        )}
      </div>

      {totalPrice > 0 && (
        <div className="cart-bar">
          <span>Tổng cộng: {totalPrice.toLocaleString()} đ</span>
          <button className="checkout-btn" onClick={handleCheckout}>
            Thanh toán ({selectedItems.length}) →
          </button>
        </div>
      )}
    </div>
  )
}
