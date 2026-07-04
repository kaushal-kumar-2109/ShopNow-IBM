import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { PRODUCTS } from "../../mock/mockData";
import { useShop } from "../../context/ShopContext";
import { motion } from "framer-motion";
import Loader from "../../components/Loader";

export default function ShopDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist, comments, addComment } = useShop();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [commentText, setCommentText] = useState("");

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

  const productComments = comments ? comments.filter((c) => c.productId === product.id) : [];

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!userName.trim() || !commentText.trim()) {
      alert("Please fill in both your name and comment.");
      return;
    }
    addComment(product.id, userName, commentText);
    setCommentText("");
    alert("Thank you! Your comment has been posted.");
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

      {/* Comments Section */}
      <section className="comments-section spad" style={{ borderTop: "1px solid #eee", paddingTop: "50px", paddingBottom: "50px" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <div className="section-title" style={{ textAlign: "left", marginBottom: "30px" }}>
                <span style={{ color: "#e53637", fontWeight: "700", textTransform: "uppercase", fontSize: "14px", display: "block", marginBottom: "10px" }}>Reviews & Feedback</span>
                <h2 style={{ fontWeight: "700", color: "#111" }}>Product Comments</h2>
              </div>

              {/* Comments list (shows 4 comments) */}
              <div style={{ marginBottom: "40px" }}>
                {productComments.length === 0 ? (
                  <p style={{ color: "#777", fontStyle: "italic" }}>No comments yet for this product. Be the first to review!</p>
                ) : (
                  <div>
                    {productComments.slice(0, 4).map((commentItem) => (
                      <div
                        key={commentItem.id}
                        style={{
                          display: "flex",
                          gap: "15px",
                          paddingBottom: "15px",
                          borderBottom: "1px solid #f2f2f2",
                          marginBottom: "15px"
                        }}
                      >
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "#f5f5f5",
                            border: "1px solid #e1e1e1",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontWeight: "700",
                            color: "#111",
                            flexShrink: 0
                          }}
                        >
                          {commentItem.userName ? commentItem.userName.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "3px" }}>
                            <h6 style={{ fontWeight: "700", margin: 0, fontSize: "14px" }}>{commentItem.userName}</h6>
                            <span style={{ fontSize: "11px", color: "#888" }}>{commentItem.date}</span>
                          </div>
                          <p style={{ fontSize: "13px", color: "#444", margin: 0, lineHeight: "1.4" }}>
                            {commentItem.comment}
                          </p>
                        </div>
                      </div>
                    ))}

                    {productComments.length > 4 && (
                      <div style={{ marginTop: "20px" }}>
                        <Link to={`/shop/${product.id}/comments`} className="site-btn" style={{ background: "#f5f5f5", color: "#111", border: "1px solid #e1e1e1" }}>
                          View All Comments ({productComments.length})
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Add Comment Form */}
              <div 
                style={{ 
                  border: "1px solid #e1e1e1", 
                  padding: "25px", 
                  borderRadius: "4px",
                  backgroundColor: "#fcfcfc"
                }}
              >
                <h5 style={{ fontWeight: "700", marginBottom: "15px" }}>Leave A Comment</h5>
                <form onSubmit={handlePostComment}>
                  <div style={{ marginBottom: "15px" }}>
                    <input 
                      type="text" 
                      placeholder="Your Name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      style={{
                        width: "100%",
                        height: "40px",
                        border: "1px solid #e1e1e1",
                        paddingLeft: "15px",
                        fontSize: "13px",
                        borderRadius: "2px",
                        outline: "none"
                      }}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <textarea 
                      placeholder="Your Comment"
                      rows="4"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      style={{
                        width: "100%",
                        border: "1px solid #e1e1e1",
                        padding: "15px",
                        fontSize: "13px",
                        borderRadius: "2px",
                        outline: "none",
                        resize: "vertical"
                      }}
                      required
                    />
                  </div>
                  <button type="submit" className="site-btn" style={{ padding: "10px 25px", fontSize: "13px" }}>
                    Post Comment
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}