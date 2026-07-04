import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for subscribing to our newsletter!");
    e.target.reset();
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          {/* Logo & Description */}
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div className="footer__about">
              <div className="footer__logo">
                <Link to="/">
                  <img src="/img/footer-logo.png" alt="Shop Now Footer Logo" />
                </Link>
              </div>
              <p>The customer is at the heart of our unique business model, which includes design.</p>
              <a href="#">
                <img src="/img/payment.png" alt="Payment Gateways" />
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="col-lg-2 offset-lg-1 col-md-3 col-sm-6">
            <div className="footer__widget">
              <h6>Shopping</h6>
              <ul>
                <li><Link to="/shop">Clothing Store</Link></li>
                <li><Link to="/shop">Trending Shoes</Link></li>
                <li><Link to="/shop">Accessories</Link></li>
                <li><Link to="/shop">Sale & Discounts</Link></li>
              </ul>
            </div>
          </div>

          {/* Links Column 2 */}
          <div className="col-lg-2 col-md-3 col-sm-6">
            <div className="footer__widget">
              <h6>Information</h6>
              <ul>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><a href="#">Payment Methods</a></li>
                <li><a href="#">Delivery Services</a></li>
                <li><a href="#">Return & Exchanges</a></li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="col-lg-3 offset-lg-1 col-md-6 col-sm-6">
            <div className="footer__widget">
              <h6>Newsletter</h6>
              <div className="footer__newslatter">
                <p>Be the first to know about new arrivals, look books, sales & promos!</p>
                <form onSubmit={handleNewsletterSubmit}>
                  <input type="email" placeholder="Your email" required />
                  <button type="submit" aria-label="Subscribe">
                    <span className="icon_mail_alt"></span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="row">
          <div className="col-lg-12 text-center">
            <div className="footer__copyright__text">
              <p>
                Copyright © {currentYear} All rights reserved | This template is migrated with{" "}
                <i className="fa fa-heart-o" aria-hidden="true" style={{ color: "#e53637" }}></i> by Antigravity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
