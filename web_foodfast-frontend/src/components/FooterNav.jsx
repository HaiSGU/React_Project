import { Link } from "react-router-dom";

export default function FooterNav() {
  return (
    <footer className="footer">
      <Link to="/home">🏠 Home</Link>
      <Link to="/cart">🛒 Cart</Link>
      <Link to="/account">👤 Account</Link>
      <Link to="/contact">📞 Contact Us</Link>
    </footer>
  );
}