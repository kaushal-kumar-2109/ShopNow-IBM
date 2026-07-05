import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useShop } from "../../context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/Loader";
import { getAllShopProducts } from "../../api/getApiHandler/getData";

const CATEGORIES = ["All", "men's clothing", "jewelery", "electronics", "women's clothing"];

export default function Shop() {
  const { addToCart, toggleWishlist, isInWishlist, isCartLoading, isWishlistLoading } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [localSearch, setLocalSearch] = useState("");

  // Get search query from URL (e.g., from header search modal redirect)
  const urlSearch = searchParams.get("search") || "";

  // Fetch products from server on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const res = await getAllShopProducts(1, 100); // fetch up to 100 products
      if (res.flag && res.data) {
        setProducts(res.data);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (urlSearch) {
      setLocalSearch(urlSearch);
    }
  }, [urlSearch]);

  // Reset currentPage to 1 when filters are adjusted
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedPriceRange, selectedSize, selectedColor, sortBy, localSearch]);

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
  const filteredProducts = products.filter((product) => {
    const title = product.title || "";
    const description = product.description || "";
    const category = product.category || "";

    // 1. Search Query Match
    const matchesSearch =
      title.toLowerCase().includes(localSearch.toLowerCase()) ||
      description.toLowerCase().includes(localSearch.toLowerCase());

    // 2. Category Match
    const matchesCategory =
      selectedCategory === "All" || category.toLowerCase() === selectedCategory.toLowerCase();

    // 3. Price Range Match
    const activePriceObj = priceRanges.find((r) => r.label === selectedPriceRange);
    const activePrice = product.discountPrice ?? product.price;
    const matchesPrice =
      !activePriceObj ||
      (activePrice >= activePriceObj.min && activePrice <= activePriceObj.max);

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
    const priceA = a.discountPrice ?? a.price;
    const priceB = b.discountPrice ?? b.price;
    const titleA = a.title || "";
    const titleB = b.title || "";

    if (sortBy === "priceLowHigh") return priceA - priceB;
    if (sortBy === "priceHighLow") return priceB - priceA;
    if (sortBy === "nameAsc") return titleA.localeCompare(titleB);
    return 0; // default order
  });

  // Calculate paginated slice
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
                      <span style={{ fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", fontSize: "14px" }}>Categories</span>
                    </div>
                    <div className="card-body">
                      <div className="shop__sidebar__categories">
                        <ul>
                          {CATEGORIES.map((cat) => (
                            <li key={cat}>
                              <a
                                href="#"
                                className={selectedCategory.toLowerCase() === cat.toLowerCase() ? "active" : ""}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setSelectedCategory(cat);
                                }}
                                style={{ textTransform: "capitalize" }}
                              >
                                {cat === "All" ? "All Categories" : cat}
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
                      <span style={{ fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", fontSize: "14px" }}>Filter Price</span>
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
                      <span style={{ fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", fontSize: "14px" }}>Filter Sizes</span>
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
                      <span style={{ fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", fontSize: "14px" }}>Filter Colors</span>
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
                        Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results
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
                {paginatedProducts.length === 0 ? (
                  <div className="col-lg-12" style={{ textAlign: "center", padding: "100px 0" }}>
                    <h3 style={{ marginBottom: "15px", fontWeight: "700" }}>No products found</h3>
                    <p>Try adjusting your search query or filter checkboxes.</p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {paginatedProducts.map((product) => {
                      const isFavorite = isInWishlist(product);
                      const displayPrice = product.discountPrice ?? product.price;
                      const hasDiscount = !!product.discountPrice;
                      const pImage = product.images?.[0]?.url || "";
                      const productId = product._id;

                      return (
                        <motion.div
                          key={productId}
                          className="col-lg-4 col-md-6 col-sm-6"
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="product__item">
                            <div className="product__item__pic">
                              <Link to={`/shop/${productId}`} style={{ display: "block", height: "100%" }}>
                                <motion.img
                                  src={pImage}
                                  alt={product.title}
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                  whileHover={{ scale: 1.05 }}
                                />
                              </Link>
                              {product.isFeatured && <span className="label">Featured</span>}
                              {hasDiscount && <span className="label sale">Sale</span>}

                              <ul className="product__hover">
                                 <li>
                                  <button
                                    onClick={() => toggleWishlist(product)}
                                    style={{ border: "none", background: "none", opacity: isWishlistLoading(productId) ? 0.6 : 1 }}
                                    aria-label="Wishlist toggle"
                                    disabled={isWishlistLoading(productId)}
                                  >
                                    <a className={isFavorite ? "active" : ""}>
                                      <img
                                        src="/img/icon/heart.png"
                                        alt="Wishlist"
                                        style={{ filter: isFavorite ? "hue-rotate(320deg) saturate(3)" : "none" }}
                                      />
                                      <span>{isWishlistLoading(productId) ? "Loading..." : (isFavorite ? "Liked" : "Add to Wishlist")}</span>
                                    </a>
                                  </button>
                                </li>
                                <li>
                                  <Link to={`/shop/${productId}`}>
                                    <img src="/img/icon/search.png" alt="Search" />
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
                                disabled={isCartLoading(productId)}
                                style={{ opacity: isCartLoading(productId) ? 0.6 : 1 }}
                              >
                                {isCartLoading(productId) ? "Adding..." : "+ Add To Cart"}
                              </button>
                              <div className="rating">
                                {[...Array(5)].map((_, rIdx) => (
                                  <i
                                    key={rIdx}
                                    className={`fa ${rIdx < Math.round(product.rating || 0) ? "fa-star" : "fa-star-o"}`}
                                  />
                                ))}
                              </div>
                              <h5>
                                ${displayPrice.toFixed(2)}{" "}
                                {hasDiscount && <span>${product.price.toFixed(2)}</span>}
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
                    })}
                  </AnimatePresence>
                )}
              </motion.div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="row">
                  <div className="col-lg-12">
                    <div className="product__pagination" style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "40px" }}>
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNum = index + 1;
                        return (
                          <a
                            key={pageNum}
                            href="#"
                            className={currentPage === pageNum ? "active" : ""}
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(pageNum);
                            }}
                            style={{
                              display: "inline-block",
                              width: "40px",
                              height: "40px",
                              lineHeight: "40px",
                              textAlign: "center",
                              border: "1px solid #e1e1e1",
                              borderRadius: "50%",
                              color: currentPage === pageNum ? "#fff" : "#111",
                              backgroundColor: currentPage === pageNum ? "#111" : "transparent",
                              fontWeight: "700",
                              fontSize: "14px",
                              transition: "all 0.3s"
                            }}
                          >
                            {pageNum}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}