export default function MenuItem({ id, name, price, rating, sold, img, quantity, updateQuantity }) {
  return (
    <div className="menu-item">
      <img src={img} alt={name} className="menu-img" />
      
      <div className="menu-info">
        <h3>{name}</h3>
        <p className="price">{price.toLocaleString()} đ</p>
        <p className="rating">⭐ {rating} | Đã bán: {sold}</p>
        <div className="qty-control">
          <button onClick={() => updateQuantity(id, -1)}>-</button>
          <span>{quantity}</span>
          <button onClick={() => updateQuantity(id, 1)}>+</button>
        </div>
      </div>
    </div>
  );
}