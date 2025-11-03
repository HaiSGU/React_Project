import { Link } from "react-router-dom";
import './FooterNav.css';

export default function FooterNav(){
  const path = typeof location !== 'undefined' ? location.pathname : '/';
  const items = [
    { href:'/', icon:'home', label:'Home' },
    { href:'/cart', icon:'shopping_cart', label:'Cart' },
    { href:'/account', icon:'person', label:'Account' },
    { href:'/contact', icon:'support_agent', label:'Contact' },
  ];

  return (
    <nav className="footer-nav">
      <div className="footer-bar">
        {items.map(item => (
          <a 
            key={item.href}
            href={item.href} 
            className={`footer-item ${path===item.href?'active':''}`}
          >
            <span className="material-icons-outlined footer-icon">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}