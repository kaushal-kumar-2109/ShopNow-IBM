import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const {
    getCartCount,
    getCartTotal,
    wishlist,
    setSearchOpen,
    setCartDrawerOpen,
    mobileMenuOpen,
    setMobileMenuOpen
  } = useShop();

  const location = useLocation();
  const [pagesDropdownOpen, setPagesDropdownOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    {
      name: "Pages",
      path: "#",
      dropdown: [
        { name: "About Us", path: "/about" },
        { name: "Shopping Cart", path: "/shopping-cart" },
        { name: "Check Out", path: "/checkout" }
      ]
    },
    { name: "Contact", path: "/contact" }
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="header">
        {/* Header Top Bar */}
        <div className="header__top">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-7">
                <div className="header__top__left">
                  <p>Free shipping, 30-day return or refund guarantee.</p>
                </div>
              </div>
              <div className="col-lg-6 col-md-5">
                <div className="header__top__right">
                  <div className="header__top__links">
                    <Link to="/login">Sign in</Link>
                    <a href="#">FAQs</a>
                  </div>
                  <div className="header__top__hover">
                    <span>Usd <i className="arrow_carrot-down"></i></span>
                    <ul>
                      <li>USD</li>
                      <li>EUR</li>
                      <li>INR</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="container">
          <div className="row align-items-center">
            {/* Logo */}
            <div className="col-lg-3 col-md-3">
              <div className="header__logo">
                <Link to="/">
                  <img src="/img/logo.png" alt="Shop Now Logo" />
                </Link>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="col-lg-6 col-md-6">
              <nav className="header__menu">
                <ul>
                  {navLinks.map((link, idx) => {
                    const isActive =
                      link.path === "/"
                        ? location.pathname === "/"
                        : location.pathname.startsWith(link.path) && link.path !== "#";

                    if (link.dropdown) {
                      return (
                        <li key={idx} className={isActive ? "active" : ""}>
                          <span style={{ cursor: "pointer", fontSize: "18px", fontWeight: "600", display: "block" }}>
                            {link.name} <i className="arrow_carrot-down" style={{ fontSize: "14px" }}></i>
                          </span>
                          <ul className="dropdown">
                            {link.dropdown.map((sub, sIdx) => (
                              <li key={sIdx}>
                                <Link to={sub.path}>{sub.name}</Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      );
                    }

                    return (
                      <li key={idx} className={isActive ? "active" : ""}>
                        <Link to={link.path}>{link.name}</Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            {/* Icons / Actions */}
            <div className="col-lg-3 col-md-3">
              <div className="header__nav__option">
                <button onClick={() => setSearchOpen(true)} className="search-switch" aria-label="Search button">
                  <img src="/img/icon/search.png" alt="Search" />
                </button>
                <Link to="/wishlist" aria-label="Wishlist Link">
                  <img src="/img/icon/heart.png" alt="Wishlist" />
                  {wishlist.length > 0 && <span>{wishlist.length}</span>}
                </Link>
                <button onClick={() => setCartDrawerOpen(true)} aria-label="Open Cart Drawer">
                  <img src="/img/icon/cart.png" alt="Cart" />
                  <span>{getCartCount()}</span>
                </button>
                <div className="price">${getCartTotal().toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Mobile Burger Icon */}
          <div className="canvas__open" onClick={() => setMobileMenuOpen(true)}>
            <i className="fa fa-bars"></i>
          </div>
        </div>
      </header>

      {/* Mobile Offcanvas Drawer with Framer Motion */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="offcanvas-menu-overlay active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="offcanvas-menu-wrapper active"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="offcanvas__close" onClick={() => setMobileMenuOpen(false)}>
                <i className="icon_close"></i>
              </div>

              <div className="offcanvas__logo">
                <Link to="/" onClick={handleLinkClick}>
                  <img src="/img/logo.png" alt="Logo" style={{ marginBottom: "30px" }} />
                </Link>
              </div>

              <div className="offcanvas__option">
                <div className="offcanvas__links">
                  <Link to="/login" onClick={handleLinkClick}>Sign in</Link>
                  <a href="#">FAQs</a>
                </div>
                <div className="offcanvas__top__hover">
                  <span>Usd <i className="arrow_carrot-down"></i></span>
                  <ul>
                    <li>USD</li>
                    <li>EUR</li>
                    <li>INR</li>
                  </ul>
                </div>
              </div>

              <div className="offcanvas__nav__option">
                <button
                  onClick={() => {
                    setSearchOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  style={{ marginRight: "20px" }}
                  aria-label="Search"
                >
                  <img src="/img/icon/search.png" alt="Search" />
                </button>
                <Link to="/wishlist" onClick={handleLinkClick}>
                  <img src="/img/icon/heart.png" alt="Wishlist" />
                  <span>{wishlist.length}</span>
                </Link>
                <button
                  onClick={() => {
                    setCartDrawerOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  style={{ marginLeft: "20px" }}
                  aria-label="Cart"
                >
                  <img src="/img/icon/cart.png" alt="Cart" />
                  <span>{getCartCount()}</span>
                </button>
                <div className="price">${getCartTotal().toFixed(2)}</div>
              </div>

              <nav className="offcanvas__menu">
                <ul>
                  {navLinks.map((link, idx) => {
                    if (link.dropdown) {
                      return (
                        <li key={idx} className={pagesDropdownOpen ? "active-drop" : ""}>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setPagesDropdownOpen(!pagesDropdownOpen);
                            }}
                          >
                            {link.name} <i className="arrow_carrot-down"></i>
                          </a>
                          <ul className="dropdown" style={{ display: pagesDropdownOpen ? "block" : "none" }}>
                            {link.dropdown.map((sub, sIdx) => (
                              <li key={sIdx}>
                                <Link to={sub.path} onClick={handleLinkClick}>
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      );
                    }
                    return (
                      <li key={idx}>
                        <Link to={link.path} onClick={handleLinkClick}>
                          {link.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="offcanvas__text">
                <p>Free shipping, 30-day return or refund guarantee.</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
