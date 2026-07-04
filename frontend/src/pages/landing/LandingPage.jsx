import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HERO_SLIDES, PROMO_BANNERS, PRODUCTS, BLOG_POSTS } from "../../mock/mockData";
import { useShop } from "../../context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/Loader";

export default function LandingPage() {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Hero Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };
  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  // Product Filter State
  const [activeFilter, setActiveFilter] = useState("bestSeller"); // default "Best Sellers"
  const filteredProducts = PRODUCTS.filter((product) => {
    if (activeFilter === "bestSeller") return product.bestSeller;
    if (activeFilter === "newArrival") return product.newArrival;
    if (activeFilter === "hotSale") return product.hotSale;
    return true;
  }).slice(0, 8); // Display top 8 matching items

  // Deal of the Week Countdown Timer State (7 days countdown starting from session creation)
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 1, minutes: 50, seconds: 18 });

  useEffect(() => {
    // Set a target date 3 days 1 hour 50 mins 18 seconds from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    targetDate.setHours(targetDate.getHours() + 1);
    targetDate.setMinutes(targetDate.getMinutes() + 50);
    targetDate.setSeconds(targetDate.getSeconds() + 18);

    const timer = setInterval(() => {
      const difference = targetDate.getTime() - new Date().getTime();
      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={{ position: "relative" }}>
      {/* 1. Hero Slider Section */}
      <section className="hero">
        <div className="hero__slider-container">
          <AnimatePresence mode="wait">
            {HERO_SLIDES.map((slide, idx) => {
              if (idx !== currentSlide) return null;
              return (
                <motion.div
                  key={slide.id}
                  className="hero__slide"
                  style={{ backgroundImage: `url(${slide.image})` }}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="container">
                    <div className="row">
                      <div className="col-xl-5 col-lg-7 col-md-8">
                        <div className="hero__text">
                          <motion.h6
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            {slide.subtitle}
                          </motion.h6>
                          <motion.h2
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            {slide.title}
                          </motion.h2>
                          <motion.p
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                          >
                            {slide.description}
                          </motion.p>
                          <motion.div
                            initial={{ y: 60, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                          >
                            <Link to="/shop" className="primary-btn">
                              Shop now <span className="arrow_right"></span>
                            </Link>
                          </motion.div>
                          <div className="hero__social">
                            <a href="#"><i className="fa fa-facebook"></i></a>
                            <a href="#"><i className="fa fa-twitter"></i></a>
                            <a href="#"><i className="fa fa-pinterest"></i></a>
                            <a href="#"><i className="fa fa-instagram"></i></a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Slider controls */}
          <div className="hero__nav-prev" onClick={handlePrevSlide}>
            <span className="arrow_left"></span>
          </div>
          <div className="hero__nav-next" onClick={handleNextSlide}>
            <span className="arrow_right"></span>
          </div>
        </div>
      </section>

      {/* 2. Banner Section */}
      <section className="banner spad">
        <div className="container">
          <div className="row">
            {PROMO_BANNERS.map((banner, idx) => (
              <div key={banner.id} className={banner.cols}>
                <motion.div
                  className={`banner__item ${
                    idx === 1
                      ? "banner__item--middle"
                      : idx === 2
                      ? "banner__item--last"
                      : ""
                  }`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                >
                  <div className="banner__item__pic">
                    <img src={banner.image} alt={banner.title} />
                  </div>
                  <div className="banner__item__text">
                    <h2>{banner.title}</h2>
                    <Link to="/shop">Shop now</Link>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Product grid Showcase */}
      <section className="product spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <ul className="filter__controls">
                <li
                  className={activeFilter === "bestSeller" ? "active" : ""}
                  onClick={() => setActiveFilter("bestSeller")}
                >
                  Best Sellers
                </li>
                <li
                  className={activeFilter === "newArrival" ? "active" : ""}
                  onClick={() => setActiveFilter("newArrival")}
                >
                  New Arrivals
                </li>
                <li
                  className={activeFilter === "hotSale" ? "active" : ""}
                  onClick={() => setActiveFilter("hotSale")}
                >
                  Hot Sales
                </li>
              </ul>
            </div>
          </div>

          <motion.div
            className="row"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence>
              {filteredProducts.map((product) => {
                const isFavorite = wishlist.includes(product.id);
                return (
                  <motion.div
                    key={product.id}
                    className="col-lg-3 col-md-6 col-sm-6"
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="product__item">
                      {/* Product Image Panel */}
                      <div className="product__item__pic">
                        <Link to={`/shop/${product.id}`} style={{ display: "block", height: "100%" }}>
                          <motion.img
                            src={product.mainImage}
                            alt={product.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            whileHover={{ scale: 1.05 }}
                          />
                        </Link>

                        {/* Product Labels */}
                        {product.newArrival && <span className="label">New</span>}
                        {product.hotSale && <span className="label sale">Sale</span>}

                        {/* Hover Quick Actions */}
                        <ul className="product__hover">
                          <li>
                            <button
                              onClick={() => toggleWishlist(product)}
                              style={{ border: "none", background: "none" }}
                              aria-label="Add to Wishlist"
                            >
                              <a className={isFavorite ? "active" : ""}>
                                <img
                                  src={isFavorite ? "/img/icon/heart.png" : "/img/icon/heart.png"}
                                  alt="Like"
                                  style={{ filter: isFavorite ? "hue-rotate(320deg) saturate(3)" : "none" }}
                                />
                                <span>{isFavorite ? "Liked" : "Add to Wishlist"}</span>
                              </a>
                            </button>
                          </li>
                          <li>
                            <Link to={`/shop/${product.id}`}>
                              <img src="/img/icon/search.png" alt="View Details" />
                              <span>View details</span>
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {/* Product Text Details */}
                      <div className="product__item__text">
                        <h6>{product.name}</h6>
                        <button
                          className="add-cart"
                          onClick={() => addToCart(product)}
                        >
                          + Add To Cart
                        </button>
                        <div className="rating">
                          {[...Array(5)].map((_, rIdx) => (
                            <i
                              key={rIdx}
                              className={`fa ${
                                rIdx < product.rating ? "fa-star" : "fa-star-o"
                              }`}
                            />
                          ))}
                        </div>
                        <h5>
                          ${product.price.toFixed(2)}{" "}
                          {product.oldPrice && <span>${product.oldPrice.toFixed(2)}</span>}
                        </h5>
                        <div className="product__color__select">
                          {product.colors.map((colorHex, cIdx) => (
                            <label
                              key={cIdx}
                              style={{ backgroundColor: colorHex }}
                              className={cIdx === 0 ? "active" : ""}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* 4. Hot Deal of the Week (Countdown) Section */}
      <section className="categories spad">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-3">
              <div className="categories__text">
                <h2>
                  Clothings Hot <br /> <span>Shoe Collection</span> <br /> Accessories
                </h2>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="categories__hot__deal">
                <img src="/img/product-sale.png" alt="Deal of the week" />
                <div className="hot__deal__sticker">
                  <span>Sale Of</span>
                  <h5>$29.99</h5>
                </div>
              </div>
            </div>
            <div className="col-lg-4 offset-lg-1">
              <div className="categories__deal__countdown">
                <span>Deal Of The Week</span>
                <h2>Multi-pocket Chest Bag Black</h2>
                <div className="categories__deal__countdown__timer">
                  <div className="cd-item">
                    <span>{timeLeft.days}</span>
                    <p>Days</p>
                  </div>
                  <div className="cd-item">
                    <span>{timeLeft.hours}</span>
                    <p>Hours</p>
                  </div>
                  <div className="cd-item">
                    <span>{timeLeft.minutes}</span>
                    <p>Minutes</p>
                  </div>
                  <div className="cd-item">
                    <span>{timeLeft.seconds}</span>
                    <p>Seconds</p>
                  </div>
                </div>
                <Link to="/shop" className="primary-btn">
                  Shop now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Instagram Grid Section */}
      <section className="instagram spad">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="instagram__pic">
                {[...Array(6)].map((_, idx) => (
                  <div
                    key={idx}
                    className="instagram__pic__item"
                    style={{ backgroundImage: `url(/img/instagram/instagram-${idx + 1}.jpg)` }}
                  />
                ))}
              </div>
            </div>
            <div className="col-lg-4">
              <div className="instagram__text">
                <h2>Instagram</h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua.
                </p>
                <h3>#Shop_Now</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Latest Blog / News Section */}
      <section className="latest spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <span>Latest News</span>
                <h2>Shop Now New Trends</h2>
              </div>
            </div>
          </div>
          <div className="row">
            {BLOG_POSTS.map((post, idx) => (
              <div key={post.id} className="col-lg-4 col-md-6 col-sm-6">
                <motion.div
                  className="blog__item"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <div
                    className="blog__item__pic"
                    style={{ backgroundImage: `url(${post.image})` }}
                  />
                  <div className="blog__item__text">
                    <span>
                      <img src="/img/icon/calendar.png" alt="calendar" /> {post.date}
                    </span>
                    <h5>{post.title}</h5>
                    <a href="#">Read More</a>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
