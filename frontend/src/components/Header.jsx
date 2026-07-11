import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { clearSession } from "../utils/checkUser";

export default function Header({ isUserLoged, setIsUserLoged }) {
  const {
    getCartCount,
    getCartTotal,
    wishlist,
    setSearchOpen,
    setCartDrawerOpen,
    mobileMenuOpen,
    setMobileMenuOpen
  } = useShop();

  const navigate = useNavigate();
  const location = useLocation();
  const [pagesDropdownOpen, setPagesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const rawUser = localStorage.getItem("ShopNowUserData");
  const currentUser = rawUser ? JSON.parse(rawUser) : null;

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

  const handleLogout = () => {
    clearSession();
    setIsUserLoged(false);
    setUserDropdownOpen(false);
    toast.success("Logged out successfully. See you soon!");
    navigate("/");
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
                    {/* ===== USER AUTH SECTION ===== */}
                    {isUserLoged ? (
                      <div
                        className="header__top__hover"
                        style={{ position: "relative" }}
                        onMouseEnter={() => setUserDropdownOpen(true)}
                        onMouseLeave={() => setUserDropdownOpen(false)}
                      >
                        <span style={{
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "7px",
                          color: "#ffffff",
                          fontWeight: "600",
                          fontSize: "14px"
                        }}>
                          {/* Avatar Circle */}
                          <span style={{
                            width: "26px",
                            height: "26px",
                            borderRadius: "50%",
                            background: "#252424ff",
                            color: "#fff",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: "700",
                            padding: "1px",
                            flexShrink: 0
                          }}><img src="/img/userIcon.png" alt="user Icon" style={{ width: "80%", height: "80%" }} /></span>

                          <i className="arrow_carrot-down" style={{ position: "static", marginLeft: "2px", fontSize: "12px" }}></i>
                        </span>

                        {/* Dropdown */}
                        {userDropdownOpen && (
                          <ul style={{
                            position: "absolute",
                            top: "100%",
                            right: 0,
                            width: "170px",
                            background: "#fff",
                            border: "1px solid #e1e1e1",
                            borderRadius: "6px",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                            listStyle: "none",
                            padding: "6px 0",
                            margin: 0,
                            zIndex: 9999
                          }}>
                            <li style={{ padding: "4px 0" }}>
                              <Link
                                to="/profile"
                                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 16px", color: "#333", fontSize: "13px", fontWeight: "600" }}
                              >
                                <i className="fa fa-user-o" style={{ color: "#e53637", width: "14px" }}></i>
                                My Profile
                              </Link>
                            </li>
                            <li style={{ padding: "4px 0" }}>
                              <Link
                                to="/profile?tab=orders"
                                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 16px", color: "#333", fontSize: "13px", fontWeight: "600" }}
                              >
                                <i className="fa fa-shopping-bag" style={{ color: "#e53637", width: "14px" }}></i>
                                My Orders
                              </Link>
                            </li>
                            <li style={{ borderTop: "1px solid #f0f0f0", margin: "4px 0", padding: "4px 0" }}>
                              <button
                                onClick={handleLogout}
                                style={{
                                  display: "flex", alignItems: "center", gap: "8px",
                                  padding: "9px 16px", color: "#e53637", fontSize: "13px",
                                  fontWeight: "700", background: "none", border: "none",
                                  cursor: "pointer", width: "100%", textAlign: "left"
                                }}
                              >
                                <i className="fa fa-sign-out" style={{ width: "14px" }}></i>
                                Logout
                              </button>
                            </li>
                          </ul>
                        )}
                      </div>
                    ) : (
                      <Link to="/login">Sign in</Link>
                    )}
                    {/* <a href="#">FAQs</a> */}
                  </div>
                  <div className="header__top__hover" style={{ marginLeft: "25px" }}>
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
                  {/* 
                  <img
                    src="/img/logo1.png"
                    alt="Shop Now Logo"
                    style={{ width: "100%", maxWidth: "180px", height: "auto", display: "block", objectFit: "contain" }}
                  />
                */}
                  <h3 style={{ fontFamily: "'Poppins', sans-serif", color: "var(--text-secondary)", fontWeight: "700" }}>ShopNow</h3>
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
                <button onClick={() => setSearchOpen(true)} className="search-switch" style={{ marginRight: "15px" }} aria-label="Search button">
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
                  <h1 style={{ fontFamily: "'Poppins', sans-serif", color: "var(--text-secondary)", fontWeight: "700", marginBottom: "30px" }}>ShopNow</h1>
                </Link>
              </div>

              {/* Mobile User Info / Sign in */}
              {isUserLoged ? (
                <div style={{
                  padding: "15px 20px",
                  background: "var(--bg-secondary)",
                  borderRadius: "8px",
                  margin: "0 0 20px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "50%",
                    background: "#e53637", color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "18px", fontWeight: "700", flexShrink: 0
                  }}>{currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U"}</div>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "15px", color: "var(--text-secondary)" }}>{currentUser?.name}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{currentUser?.email}</div>
                  </div>
                </div>
              ) : null}

              <div className="offcanvas__option">
                <div className="offcanvas__links">
                  {!isUserLoged && (
                    <Link to="/login" onClick={handleLinkClick}>Sign in</Link>
                  )}
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

                  {/* Mobile auth links */}
                  {isUserLoged && (
                    <>
                      <li style={{ borderTop: "1px solid #eee", marginTop: "10px", paddingTop: "10px" }}>
                        <Link to="/profile" onClick={handleLinkClick}>
                          <i className="fa fa-user-o" style={{ marginRight: "8px", color: "#e53637" }}></i>
                          My Profile
                        </Link>
                      </li>
                      <li>
                        <Link to="/profile?tab=orders" onClick={handleLinkClick}>
                          <i className="fa fa-shopping-bag" style={{ marginRight: "8px", color: "#e53637" }}></i>
                          My Orders
                        </Link>
                      </li>
                      <li>
                        <a
                          href="#"
                          onClick={(e) => { e.preventDefault(); handleLogout(); }}
                          style={{ color: "#e53637", fontWeight: "700" }}
                        >
                          <i className="fa fa-sign-out" style={{ marginRight: "8px" }}></i>
                          Logout
                        </a>
                      </li>
                    </>
                  )}
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
