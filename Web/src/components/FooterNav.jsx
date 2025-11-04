import { Link, useLocation } from "react-router-dom";
import './FooterNav.css';

export default function FooterNav(){
  const location = useLocation();
  const path = location.pathname;
  
  const items = [
    { href:'/home', icon:'home', label:'Home' },
    { href:'/cart', icon:'shopping_cart', label:'Cart' },
    { href:'/account', icon:'person', label:'Account' },
    { href:'/contact', icon:'support_agent', label:'Contact' },
  ];

  return (
    <nav className="footer-nav">
      <div className="footer-bar">
        {items.map(item => (
          <Link 
            key={item.href}
            to={item.href} 
            className={`footer-item ${path===item.href?'active':''}`}
          >
            <span className="material-icons-outlined footer-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}