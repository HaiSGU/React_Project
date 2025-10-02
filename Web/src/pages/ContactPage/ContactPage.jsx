import "./ContactPage.css";

export default function ContactPage() {
  return (
    <div className="contact-page">
      <header className="contact-header">
        <h2>Contact Us</h2>
      </header>

      <div className="contact-body">
        <p>
          Have a question, feedback, or need support? We’re always here to help!
        </p>

        <div className="contact-section">
          <h3>📞 Contact Information</h3>
          <p>Email: support@foodfast.com</p>
          <p>Hotline: 1900-123-456</p>
        </div>

        <div className="contact-section">
          <h3>💬 Customer Support</h3>
          <p>Zalo: +84 123 456 789</p>
          <p>Facebook: fb.me/foodfast</p>
        </div>
      </div>
    </div>
  );
}