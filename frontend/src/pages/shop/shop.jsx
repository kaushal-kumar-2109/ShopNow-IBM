import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { PRODUCTS, CATEGORIES } from "../../mock/mockData";
import { useShop } from "../../context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/Loader";

export default function Shop() {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [localSearch, setLocalSearch] = useState("");

  // Get search query from URL (e.g., from header search modal redirect)
  const urlSearch = searchParams.get("search") || "";

  useEffect(() => {
    if (urlSearch) {
      setLocalSearch(urlSearch);
    }
  }, [urlSearch]);

  const priceRanges = [
    { label: "All", min: 0, max: 10000 },
    { label: "$0.00 - $50.00", min: 0, max: 50 },
    { label: "$50.00 - $100.00", min: 50, max: 100 },
    { label: "$100.00 - $150.00", min: 100, max: 150 },
    { label: "$150.00+", min: 150, max: 10000 }
  ];

  const allSizes = ["All", "S", "M", "L", "XL", "OS", "8", "9", "10", "11", "12"];
  const allColors = [
    { name: "All", hex: "" },
    { name: "Black", hex: "#111111" },
    { name: "White", hex: "#ffffff" },
    { name: "Grey", hex: "#a8a8a8" },
    { name: "Blue", hex: "#2d4c7a" },
    { name: "Brown", hex: "#4a3319" }
  ];

  // Reset Filters
  const handleClearFilters = () => {
    setSelectedCategory("All");
    setSelectedPriceRange("All");
    setSelectedSize("All");
    setSelectedColor("All");
    setSortBy("default");
    setLocalSearch("");
    setSearchParams({});
  };

  // Filter & Sort Logic
  const filteredProducts = PRODUCTS.filter((product) => {
    // 1. Search Query Match
    const matchesSearch =
      product.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      product.description.toLowerCase().includes(localSearch.toLowerCase());

    // 2. Category Match
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    // 3. Price Range Match
    const activePriceObj = priceRanges.find((r) => r.label === selectedPriceRange);
    const matchesPrice =
      !activePriceObj ||
      (product.price >= activePriceObj.min && product.price <= activePriceObj.max);

    // 4. Size Match
    const matchesSize =
      selectedSize === "All" || (product.sizes && product.sizes.includes(selectedSize));

    // 5. Color Match
    const activeColorObj = allColors.find((c) => c.name === selectedColor);
    const matchesColor =
      selectedColor === "All" ||
      (product.colors && product.colors.includes(activeColorObj.hex));

    return matchesSearch && matchesCategory && matchesPrice && matchesSize && matchesColor;
  }).sort((a, b) => {
    if (sortBy === "priceLowHigh") return a.price - b.price;
    if (sortBy === "priceHighLow") return b.price - a.price;
    if (sortBy === "nameAsc") return a.name.localeCompare(b.name);
    return 0; // default order
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      {/* Breadcrumb Header */}
      <section className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__text">
                <h4>Shop</h4>
                <div className="breadcrumb__links">
                  <Link to="/">Home</Link>
                  <span>Shop</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Sidebar + Grid Section */}
      <section className="shop spad">
        <div className="container">
          <div className="row">
            {/* Sidebar Filters */}
            <div className="col-lg-3 col-md-3">
              <div className="shop__sidebar">
                {/* Search Bar */}
                <div className="shop__sidebar__search">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={localSearch}
                      onChange={(e) => {
                        setLocalSearch(e.target.value);
                        setSearchParams({ search: e.target.value });
                      }}
                    />
                    <button type="submit" aria-label="Search Submit Button">
                      <span className="icon_search"></span>
                    </button>
                  </form>
                </div>

                <div className="shop__sidebar__accordion">
                  {/* Category Filter */}
                  <div className="card">
                    <div className="card-heading">
                      <a href="#">Categories</a>
                    </div>
                    <div className="card-body">
                      <div className="shop__sidebar__categories">
                        <ul>
                          {CATEGORIES.map((cat) => (
                            <li key={cat}>
                              <a
                                href="#"
                                className={selectedCategory === cat ? "active" : ""}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setSelectedCategory(cat);
                                }}
                              >
                                {cat}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Price Filter */}
                  <div className="card">
                    <div className="card-heading">
                      <a href="#">Filter Price</a>
                    </div>
                    <div className="card-body">
                      <div className="shop__sidebar__price">
                        <ul>
                          {priceRanges.map((range) => (
                            <li key={range.label}>
                              <a
                                href="#"
                                className={selectedPriceRange === range.label ? "active" : ""}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setSelectedPriceRange(range.label);
                                }}
                              >
                                {range.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Size Filter */}
                  <div className="card">
                    <div className="card-heading">
                      <a href="#">Filter Sizes</a>
                    </div>
                    <div className="card-body">
                      <div className="shop__sidebar__size">
                        {allSizes.map((size) => (
                          <label
                            key={size}
                            className={selectedSize === size ? "active" : ""}
                            onClick={() => setSelectedSize(size)}
                          >
                            {size}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Color Filter */}
                  <div className="card">
                    <div className="card-heading">
                      <a href="#">Filter Colors</a>
                    </div>
                    <div className="card-body">
                      <div className="shop__sidebar__color">
                        {allColors.map((color) => {
                          if (color.name === "All") {
                            return (
                              <label
                                key={color.name}
                                className={selectedColor === "All" ? "active" : ""}
                                style={{
                                  backgroundColor: "#fff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "10px",
                                  fontWeight: "700"
                                }}
                                onClick={() => setSelectedColor("All")}
                              >
                                All
                              </label>
                            );
                          }
                          return (
                            <label
                              key={color.name}
                              className={selectedColor === color.name ? "active" : ""}
                              style={{ backgroundColor: color.hex }}
                              onClick={() => setSelectedColor(color.name)}
                              title={color.name}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Clear Button */}
                  <button
                    onClick={handleClearFilters}
                    className="site-btn"
                    style={{ width: "100%", marginTop: "10px", padding: "10px 0", fontSize: "12px" }}
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Product Display Panel */}
            <div className="col-lg-9 col-md-9">
              {/* Controls bar */}
              <div className="shop__product__option">
                <div className="row align-items-center justify-content-between">
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="shop__product__option__left">
                      <p>
                        Showing {filteredProducts.length} of {PRODUCTS.length} results
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 text-right">
                    <div className="shop__product__option__right">
                      <p style={{ display: "inline-block", marginRight: "10px" }}>Sort by:</p>
                      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="default">Default Sorting</option>
                        <option value="priceLowHigh">Price: Low to High</option>
                        <option value="priceHighLow">Price: High to Low</option>
                        <option value="nameAsc">Name: A to Z</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              <motion.div className="row" layout>
                {filteredProducts.length === 0 ? (
                  <div className="col-lg-12" style={{ textAlign: "center", padding: "100px 0" }}>
                    <h3 style={{ marginBottom: "15px", fontWeight: "700" }}>No products found</h3>
                    <p>Try adjusting your search query or filter checkboxes.</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {filteredProducts.map((product) => {
                      const isFavorite = wishlist.includes(product.id);
                      return (
                        <motion.div
                          key={product.id}
                          className="col-lg-4 col-md-6 col-sm-6"
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="product__item">
                            <div className="product__item__pic">
                              <Link to={`/shop/${product.id}`} style={{ display: "block", height: "100%" }}>
                                <motion.img
                                  src={product.mainImage}
                                  alt={product.name}
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                  whileHover={{ scale: 1.05 }}
                                />
                              </Link>
                              {product.newArrival && <span className="label">New</span>}
                              {product.hotSale && <span className="label sale">Sale</span>}

                              <ul className="product__hover">
                                <li>
                                  <button
                                    onClick={() => toggleWishlist(product)}
                                    style={{ border: "none", background: "none" }}
                                    aria-label="Wishlist toggle"
                                  >
                                    <a className={isFavorite ? "active" : ""}>
                                      <img
                                        src="/img/icon/heart.png"
                                        alt="Wishlist"
                                        style={{ filter: isFavorite ? "hue-rotate(320deg) saturate(3)" : "none" }}
                                      />
                                      <span>{isFavorite ? "Liked" : "Add to Wishlist"}</span>
                                    </a>
                                  </button>
                                </li>
                                <li>
                                  <Link to={`/shop/${product.id}`}>
                                    <img src="/img/icon/search.png" alt="Search" />
                                    <span>View details</span>
                                  </Link>
                                </li>
                              </ul>
                            </div>
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
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}