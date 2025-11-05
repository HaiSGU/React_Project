import { useNavigate } from "react-router-dom";
import "./ContactPage.css";

export default function ContactPage() {
  const navigate = useNavigate();

  return (
    <div className="contact-page">
      <header className="contact-header">
        <button className="back-btn" onClick={() => navigate('/home')} aria-label="Quay về trang chủ">
          ←
        </button>
        <h1>Contact Us</h1>
      </header>

      <div className="contact-content">
        <div className="intro-section">
          <p className="intro-text">
            Have a question, feedback, or need support? We're always here to help!
          </p>
        </div>

        <div className="contact-sections">
          <div className="contact-card">
            <div className="card-header">
              <span className="icon">📍</span>
              <h3>Contact Information</h3>
            </div>
            <div className="card-body">
              <div className="contact-item">
                <span className="item-icon">📍</span>
                <div>
                  <strong>Địa chỉ:</strong>
                  <p>123 Nguyen Van Cu, District 5, Ho Chi Minh City</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="item-icon">📞</span>
                <div>
                  <strong>Hotline:</strong>
                  <p>1900 1234 (8:00 AM – 10:00 PM, daily)</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="item-icon">✉️</span>
                <div>
                  <strong>Email:</strong>
                  <p>support@foodfastapp.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-card">
            <div className="card-header">
              <span className="icon">💬</span>
              <h3>Customer Support</h3>
            </div>
            <div className="card-body">
              <div className="contact-item">
                <span className="item-icon">🔍</span>
                <div>
                  <strong>Track your order:</strong>
                  <p>Go to Cart tab to see your orders</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="item-icon">💭</span>
                <div>
                  <strong>Share feedback:</strong>
                  <p>Email us or call our hotline</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="item-icon">🆘</span>
                <div>
                  <strong>Urgent help:</strong>
                  <p>Call our hotline for immediate support</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-card">
            <div className="card-header">
              <span className="icon">🌐</span>
              <h3>Follow Us</h3>
            </div>
            <div className="card-body">
              <p className="social-intro">
                Stay connected with FoodFastApp for deals & updates:
              </p>
              <div className="social-links">
                <a 
                  href="https://fb.com/foodfastapp" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-btn facebook"
                >
                  <span className="social-icon">f</span>
                  Facebook
                </a>
                <a 
                  href="https://instagram.com/foodfastapp" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-btn instagram"
                >
                  <span className="social-icon">📷</span>
                  Instagram
                </a>
                <a 
                  href="https://twitter.com/foodfastapp" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-btn twitter"
                >
                  <span className="social-icon">🐦</span>
                  Twitter
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
