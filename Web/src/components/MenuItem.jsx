import "./MenuItem.css"; // Tách CSS để dễ quản lý

export default function MenuItem({
  id,
  name,
  price,
  rating = 0,
  sold = 0,
  image, // đổi từ `img` → `image` (chuẩn hơn)
  description = "",
  quantity,
  updateQuantity
}) {
  const handleDecrease = () => {
    if (quantity > 0) updateQuantity(id, -1);
  };

  const handleIncrease = () => {
    updateQuantity(id, 1);
  };

  return (
    <div className="menu-item">
      {/* Hình ảnh */}
      <div className="menu-img-wrapper">
        <img src={image} alt={name} className="menu-img" loading="lazy" />
      </div>

      {/* Thông tin */}
      <div className="menu-info">
        <h3 className="menu-name" title={name}>
          {name}
        </h3>

        {description && <p className="menu-desc">{description}</p>}

        <div className="menu-meta">
          <p className="price">{Number(price).toLocaleString("vi-VN")} đ</p>
          <p className="rating-sold">
            Rating: {rating} <span className="sold">| Đã bán: {sold}</span>
          </p>
        </div>

        {/* Nút điều khiển số lượng */}
        <div className="qty-control">
          <button
            className="qty-btn"
            onClick={handleDecrease}
            disabled={quantity === 0}
            aria-label="Giảm số lượng"
          >
            –
          </button>
          <span className="qty-value" aria-live="polite">
            {quantity}
          </span>
          <button
            className="qty-btn"
            onClick={handleIncrease}
            aria-label="Tăng số lượng"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}