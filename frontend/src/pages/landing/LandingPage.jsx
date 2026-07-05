import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useShop } from "../../context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/Loader";
import {
  getProductsByCategory,
  getLatestProducts,
  getBannerProducts,
} from "../../api/getApiHandler/getData";

const CATEGORIES = [
  { key: "men's clothing",   label: "Men's Clothing" },
  { key: "jewelery",         label: "Jewellery" },
  { key: "electronics",     label: "Electronics" },
  { key: "women's clothing", label: "Women's Clothing" },
];

export default function LandingPage() {
  const { addToCart, toggleWishlist, isInWishlist, isCartLoading, isWishlistLoading } = useShop();

  /* ─────────── page-level loading ─────────── */
  const [pageReady, setPageReady] = useState(false);

  /* ─────────── category filter + grid products ─────────── */
  const [activeFilter, setActiveFilter] = useState(CATEGORIES[0].key);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  /* ─────────── hero slider (driven by active category products) ─────────── */
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroTimerRef = useRef(null);

  /* ─────────── banner products (one per category, excluding active) ─────────── */
  const [bannerProducts, setBannerProducts] = useState([]);

  /* ─────────── deal-of-week product ─────────── */
  const [dealProduct, setDealProduct] = useState(null);

  /* ─────────── showcase grid (product images for visual gallery) ─────────── */
  const [showcaseProducts, setShowcaseProducts] = useState([]);

  /* ─────────── latest / new arrivals products ─────────── */
  const [latestProducts, setLatestProducts] = useState([]);

  /* ─────────── countdown timer ─────────── */
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 1, minutes: 50, seconds: 18 });

  /* ═══════════════════════════════════════════════
     Fetch active-category products (grid + hero)
  ══════════════════════════════════════════════════ */
  const fetchCategoryProducts = async (category) => {
    setProductsLoading(true);
    const res = await getProductsByCategory(category, 8);
    if (res.flag && Array.isArray(res.data)) {
      setProducts(res.data);
    } else {
      setProducts([]);
    }
    setProductsLoading(false);
    setCurrentSlide(0); // reset hero slide on category change
  };

  /* ═══════════════════════════════════════════════
     On mount: fetch everything in parallel
  ══════════════════════════════════════════════════ */
  useEffect(() => {
    const init = async () => {
      // fetch all four data sets simultaneously
      const [catRes, bannerRes, latestRes] = await Promise.all([
        getProductsByCategory(CATEGORIES[0].key, 8),
        getBannerProducts([CATEGORIES[1].key, CATEGORIES[2].key, CATEGORIES[3].key]),
        getLatestProducts(6),
      ]);

      if (catRes.flag && Array.isArray(catRes.data))     setProducts(catRes.data);
      if (Array.isArray(bannerRes))                       setBannerProducts(bannerRes);
      if (latestRes.flag && Array.isArray(latestRes.data)) {
        setLatestProducts(latestRes.data.slice(0, 3));
        setShowcaseProducts(latestRes.data);             // up to 6 for the gallery grid
        const discounted = latestRes.data.find((p) => p.discountPrice);
        if (discounted) setDealProduct(discounted);
        else if (latestRes.data.length > 0) setDealProduct(latestRes.data[0]);
      }

      setPageReady(true);
    };
    init();
  }, []);

  /* ═══════════════════════════════════════════════
     Hero auto-advance — restarts when products change
  ══════════════════════════════════════════════════ */
  useEffect(() => {
    if (heroTimerRef.current) clearInterval(heroTimerRef.current);
    if (products.length === 0) return;
    heroTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.min(products.length, 3));
    }, 5000);
    return () => clearInterval(heroTimerRef.current);
  }, [products]);

  /* ═══════════════════════════════════════════════
     Handle filter tab click
  ══════════════════════════════════════════════════ */
  const handleFilterChange = (categoryKey) => {
    setActiveFilter(categoryKey);
    fetchCategoryProducts(categoryKey);
  };

  const heroSlides = products.slice(0, 3);
  const heroLen = Math.max(heroSlides.length, 1);

  const handleNextSlide = () => setCurrentSlide((p) => (p + 1) % heroLen);
  const handlePrevSlide = () => setCurrentSlide((p) => (p - 1 + heroLen) % heroLen);

  /* ═══════════════════════════════════════════════
     Countdown timer
  ══════════════════════════════════════════════════ */
  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 3);
    target.setHours(target.getHours() + 1);
    target.setMinutes(target.getMinutes() + 50);
    target.setSeconds(target.getSeconds() + 18);

    const t = setInterval(() => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        clearInterval(t);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days:    Math.floor(diff / 86400000),
          hours:   Math.floor((diff % 86400000) / 3600000),
          minutes: Math.floor((diff % 3600000)  / 60000),
          seconds: Math.floor((diff % 60000)    / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(t);
  }, []);

  /* ─────────── guard ─────────── */
  if (!pageReady) return <Loader />;

  /* ═══════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════ */
  return (
    <div style={{ position: "relative" }}>

      {/* ══════════════════════════════════════
          1. HERO — live product slides from the
             currently selected category
      ══════════════════════════════════════ */}
      <section className="hero">
        <div className="hero__slider-container">
          <AnimatePresence mode="wait">
            {heroSlides.length === 0 ? (
              /* skeleton while products load for first time */
              <motion.div
                key="hero-skeleton"
                className="hero__slide"
                style={{ background: "#1a1a2e" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            ) : (
              heroSlides.map((product, idx) => {
                if (idx !== currentSlide) return null;
                const img = product.images?.[0]?.url || "";
                const activeCat = CATEGORIES.find((c) => c.key === activeFilter);
                return (
                  <motion.div
                    key={product._id}
                    className="hero__slide"
                    style={{
                      backgroundImage: img
                        ? `linear-gradient(to right, rgba(0,0,0,0.72) 40%, rgba(0,0,0,0.1) 100%), url(${img})`
                        : "linear-gradient(135deg,#1a1a2e,#16213e)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
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
                              {activeCat?.label || "Collection"}
                            </motion.h6>

                            <motion.h2
                              initial={{ y: 40, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.4 }}
                            >
                              {product.title}
                            </motion.h2>

                            <motion.p
                              initial={{ y: 50, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.6 }}
                            >
                              {product.shortDescription || product.description?.slice(0, 120) + "…"}
                            </motion.p>

                            <motion.div
                              initial={{ y: 60, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.7 }}
                              style={{ marginBottom: "10px", fontSize: "1.4rem", color: "#e8c94f", fontWeight: 700 }}
                            >
                              ${(product.discountPrice ?? product.price).toFixed(2)}
                              {product.discountPrice && (
                                <span style={{ fontSize: "1rem", color: "#aaa", textDecoration: "line-through", marginLeft: 10 }}>
                                  ${product.price.toFixed(2)}
                                </span>
                              )}
                            </motion.div>

                            <motion.div
                              initial={{ y: 70, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.8 }}
                              style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
                            >
                              <Link to={`/shop/${product._id}`} className="primary-btn">
                                Shop now <span className="arrow_right"></span>
                              </Link>
                              <button
                                className="primary-btn"
                                style={{ background: "transparent", border: "2px solid #fff", color: "#fff", opacity: isCartLoading(product._id) ? 0.6 : 1 }}
                                onClick={() => addToCart(product)}
                                disabled={isCartLoading(product._id)}
                              >
                                {isCartLoading(product._id) ? "Adding..." : "+ Add to Cart"}
                              </button>
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
              })
            )}
          </AnimatePresence>

          {/* dot indicators */}
          {heroSlides.length > 1 && (
            <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 10 }}>
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  style={{
                    width: i === currentSlide ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    background: i === currentSlide ? "#e8c94f" : "rgba(255,255,255,0.45)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    padding: 0,
                  }}
                />
              ))}
            </div>
          )}

          <div className="hero__nav-prev" onClick={handlePrevSlide}><span className="arrow_left"></span></div>
          <div className="hero__nav-next" onClick={handleNextSlide}><span className="arrow_right"></span></div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          2. BANNER — real product images from
             the other 3 categories
      ══════════════════════════════════════ */}
      {bannerProducts.length > 0 && (
        <section className="banner spad">
          <div className="container">
            <div className="row">
              {bannerProducts.slice(0, 3).map((product, idx) => (
                <div key={product._id} className="col-lg-4 col-md-6">
                  <motion.div
                    className="banner__item"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.2 }}
                  >
                    <div className="banner__item__pic">
                      <img
                        src={product.images?.[0]?.url || ""}
                        alt={product.title}
                      />
                    </div>
                    <div className="banner__item__text">
                      <h2>{product.category}</h2>
                      <Link to="/shop">Shop now</Link>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          3. PRODUCT GRID — filtered by category
      ══════════════════════════════════════ */}
      <section className="product spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <ul className="filter__controls">
                {CATEGORIES.map((cat) => (
                  <li
                    key={cat.key}
                    className={activeFilter === cat.key ? "active" : ""}
                    onClick={() => handleFilterChange(cat.key)}
                  >
                    {cat.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {productsLoading ? (
            <div style={{ textAlign: "center", padding: "40px 0", width: "100%" }}>
              <Loader />
            </div>
          ) : (
            <motion.div
              className="row"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <AnimatePresence>
                {products.length === 0 ? (
                  <p style={{ textAlign: "center", padding: "40px", width: "100%", color: "#aaa" }}>
                    No products found in this category.
                  </p>
                ) : (
                  products.map((product) => {
                    const isFavorite = isInWishlist(product);
                    const mainImage = product.images?.[0]?.url || "";
                    return (
                      <motion.div
                        key={product._id}
                        className="col-lg-3 col-md-6 col-sm-6"
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="product__item">
                          <div className="product__item__pic">
                            <Link to={`/shop/${product._id}`} style={{ display: "block", height: "100%" }}>
                              <motion.img
                                src={mainImage}
                                alt={product.title}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                whileHover={{ scale: 1.05 }}
                              />
                            </Link>
                            {product.isFeatured  && <span className="label">Featured</span>}
                            {product.discountPrice && <span className="label sale">Sale</span>}
                            <ul className="product__hover">
                              <li>
                                <button
                                  onClick={() => toggleWishlist(product)}
                                  style={{ border: "none", background: "none", opacity: isWishlistLoading(product._id) ? 0.6 : 1 }}
                                  aria-label="Add to Wishlist"
                                  disabled={isWishlistLoading(product._id)}
                                >
                                  <a className={isFavorite ? "active" : ""}>
                                    <img
                                      src="/img/icon/heart.png"
                                      alt="Like"
                                      style={{ filter: isFavorite ? "hue-rotate(320deg) saturate(3)" : "none" }}
                                    />
                                    <span>{isWishlistLoading(product._id) ? "Loading..." : (isFavorite ? "Liked" : "Add to Wishlist")}</span>
                                  </a>
                                </button>
                              </li>
                              <li>
                                <Link to={`/shop/${product._id}`}>
                                  <img src="/img/icon/search.png" alt="View Details" />
                                  <span>View details</span>
                                </Link>
                              </li>
                            </ul>
                          </div>
                          <div className="product__item__text">
                            <h6>{product.title}</h6>
                            <button 
                              className="add-cart" 
                              onClick={() => addToCart(product)}
                              disabled={isCartLoading(product._id)}
                              style={{ opacity: isCartLoading(product._id) ? 0.6 : 1 }}
                            >
                              {isCartLoading(product._id) ? "Adding..." : "+ Add To Cart"}
                            </button>
                            <div className="rating">
                              {[...Array(5)].map((_, rIdx) => (
                                <i key={rIdx} className={`fa ${rIdx < Math.round(product.rating) ? "fa-star" : "fa-star-o"}`} />
                              ))}
                            </div>
                            <h5>
                              ${(product.discountPrice ?? product.price).toFixed(2)}{" "}
                              {product.discountPrice && <span>${product.price.toFixed(2)}</span>}
                            </h5>
                            <div className="product__color__select">
                              {(product.colors || []).map((colorHex, cIdx) => (
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
                  })
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          4. DEAL OF THE WEEK — real discounted
             product from backend
      ══════════════════════════════════════ */}
      {dealProduct && (
        <section className="categories spad">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-3">
                <div className="categories__text">
                  <h2>
                    {dealProduct.category?.split(" ").slice(0, 2).join(" ")} <br />
                    <span>Hot Deal</span> <br />
                    Collection
                  </h2>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="categories__hot__deal">
                  <img
                    src={dealProduct.images?.[0]?.url || ""}
                    alt={dealProduct.title}
                  />
                  <div className="hot__deal__sticker">
                    <span>Sale Of</span>
                    <h5>${(dealProduct.discountPrice ?? dealProduct.price).toFixed(2)}</h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 offset-lg-1">
                <div className="categories__deal__countdown">
                  <span>Deal Of The Week</span>
                  <h2>{dealProduct.title}</h2>
                  <div className="categories__deal__countdown__timer">
                    {[
                      { label: "Days",    val: timeLeft.days },
                      { label: "Hours",   val: timeLeft.hours },
                      { label: "Minutes", val: timeLeft.minutes },
                      { label: "Seconds", val: timeLeft.seconds },
                    ].map(({ label, val }) => (
                      <div key={label} className="cd-item">
                        <span>{String(val).padStart(2, "0")}</span>
                        <p>{label}</p>
                      </div>
                    ))}
                  </div>
                  <Link to={`/shop/${dealProduct._id}`} className="primary-btn">
                    Shop now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          5. PRODUCT SHOWCASE GALLERY — product
             images in an instagram-style grid
      ══════════════════════════════════════ */}
      {showcaseProducts.length > 0 && (
        <section className="instagram spad">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <div className="instagram__pic">
                  {showcaseProducts.slice(0, 6).map((product) => (
                    <Link
                      to={`/shop/${product._id}`}
                      key={product._id}
                      className="instagram__pic__item"
                      style={{
                        backgroundImage: `url(${product.images?.[0]?.url || ""})`,
                        display: "block",
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="col-lg-4">
                <div className="instagram__text">
                  <h2>New In</h2>
                  <p>
                    Fresh drops from our latest collection — click any image to explore the full product.
                  </p>
                  <h3>#Shop_Now</h3>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          6. LATEST / NEW ARRIVALS — real products
             fetched from backend (no category)
      ══════════════════════════════════════ */}
      {latestProducts.length > 0 && (
        <section className="latest spad">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="section-title">
                  <span>Just Arrived</span>
                  <h2>New Arrivals</h2>
                </div>
              </div>
            </div>
            <div className="row">
              {latestProducts.map((product, idx) => {
                const img = product.images?.[0]?.url || "";
                return (
                  <div key={product._id} className="col-lg-4 col-md-6 col-sm-6">
                    <motion.div
                      className="blog__item"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                    >
                      <Link to={`/shop/${product._id}`}>
                        <div
                          className="blog__item__pic"
                          style={{ backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center" }}
                        />
                      </Link>
                      <div className="blog__item__text">
                        <span>
                          <i className="fa fa-tag" style={{ marginRight: 6 }} />
                          {product.category}
                        </span>
                        <h5>{product.title}</h5>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                          <strong style={{ color: "#ca1515" }}>
                            ${(product.discountPrice ?? product.price).toFixed(2)}
                          </strong>
                          <Link to={`/shop/${product._id}`}>View Product</Link>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
