import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { PRODUCTS } from "../../mock/mockData";
import { useShop } from "../../context/ShopContext";
import { motion } from "framer-motion";
import Loader from "../../components/Loader";

export default function ShopDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Find product by id
  const product = PRODUCTS.find((p) => p.id === parseInt(id));

  // States for interactive inputs
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.mainImage);
      setSelectedSize(product.sizes[0] || "OS");
      setSelectedColor(product.colors[0] || "");
    }
  }, [product]);

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <div className="container spad" style={{ textAlign: "center" }}>
        <h3 style={{ fontWeight: "700", marginBottom: "20px" }}>Product Not Found</h3>
        <p>The product you are trying to view does not exist in our catalog.</p>
        <Link to="/shop" className="site-btn">
          Back to Shop
        </Link>
      </div>
    );
  }

  const isFavorite = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  return (
    <div>
      {/* Breadcrumb Header */}
      <section className="breadcrumb-option" style={{ padding: "30px 0" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__text">
                <h4>Product Details</h4>
                <div className="breadcrumb__links">
                  <Link to="/">Home</Link>
                  <Link to="/shop">Shop</Link>
                  <span>{product.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Section */}
      <section className="shop-details spad">
        <div className="container">
          <div className="row">
            {/* Gallery Images Column */}
            <div className="col-lg-3 col-md-3">
              <div className="product__details__pic__left">
                <div
                  className={`nav-item ${selectedImage === product.mainImage ? "active" : ""}`}
                  onClick={() => setSelectedImage(product.mainImage)}
                >
                  <img src={product.mainImage} alt={product.name} />
                </div>
                {product.hoverImage && (
                  <div
                    className={`nav-item ${selectedImage === product.hoverImage ? "active" : ""}`}
                    onClick={() => setSelectedImage(product.hoverImage)}
                  >
                    <img src={product.hoverImage} alt={product.name} />
                  </div>
                )}
              </div>
            </div>

            {/* Main Image Display */}
            <div className="col-lg-5 col-md-5">
              <div className="product__details__pic__slider">
                <motion.img
                  key={selectedImage}
                  src={selectedImage}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Text & Settings Panel */}
            <div className="col-lg-4 col-md-4">
              <div className="product__details__text">
                <h4>{product.name}</h4>
                <div className="rating">
                  {[...Array(5)].map((_, rIdx) => (
                    <i
                      key={rIdx}
                      className={`fa ${rIdx < product.rating ? "fa-star" : "fa-star-o"}`}
                      style={{ color: "#f7941d", marginRight: "2px" }}
                    />
                  ))}
                  <span style={{ fontSize: "13px", color: "#888", marginLeft: "10px" }}>
                    (5 Reviews)
                  </span>
                </div>
                <h3>
                  ${product.price.toFixed(2)}{" "}
                  {product.oldPrice && <span>${product.oldPrice.toFixed(2)}</span>}
                </h3>
                <p>{product.description}</p>

                {/* Configurations */}
                <div className="product__details__option">
                  {/* Size Config */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="product__details__option__size">
                      <span>Size:</span>
                      {product.sizes.map((sz) => (
                        <label
                          key={sz}
                          className={selectedSize === sz ? "active" : ""}
                          onClick={() => setSelectedSize(sz)}
                        >
                          {sz}
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Color Config */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="product__details__option__color">
                      <span>Color:</span>
                      {product.colors.map((colorHex) => (
                        <label
                          key={colorHex}
                          className={selectedColor === colorHex ? "active" : ""}
                          style={{ backgroundColor: colorHex }}
                          onClick={() => setSelectedColor(colorHex)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Add to Cart Actions */}
                <div className="product__details__cart__option">
                  <div className="quantity">
                    <i
                      className="fa fa-angle-left"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    />
                    <span>{quantity}</span>
                    <i
                      className="fa fa-angle-right"
                      onClick={() => setQuantity((q) => q + 1)}
                    />
                  </div>
                  <button className="primary-btn" onClick={handleAddToCart}>
                    Add to cart
                  </button>
                </div>

                {/* Wishlist Button */}
                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="site-btn"
                    style={{
                      background: isFavorite ? "#e53637" : "#111",
                      flexGrow: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px"
                    }}
                  >
                    <i className="fa fa-heart" />
                    {isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
                  </button>
                </div>

                {/* Meta details */}
                <div style={{ marginTop: "30px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
                  <p style={{ fontSize: "14px", marginBottom: "5px" }}>
                    <strong>Category:</strong> {product.category}
                  </p>
                  <p style={{ fontSize: "14px", marginBottom: "5px" }}>
                    <strong>Tags:</strong> Classic, Modern, Fashion, Streetwear
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}