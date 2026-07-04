import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { PRODUCTS } from "../../mock/mockData";
import { useShop } from "../../context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/Loader";

export default function CommentsPage() {
  const { id } = useParams();
  const productId = parseInt(id);
  const { comments, addComment } = useShop();

  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [commentText, setCommentText] = useState("");

  // Product info
  const product = PRODUCTS.find((p) => p.id === productId);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!userName.trim() || !commentText.trim()) {
      alert("Please fill in both your name and comment.");
      return;
    }
    addComment(productId, userName, commentText);
    setCommentText("");
    alert("Thank you! Your comment has been posted.");
  };

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <div className="container spad text-center" style={{ padding: "80px 0" }}>
        <h3>Product Not Found</h3>
        <p>The product you are trying to view comments for does not exist.</p>
        <Link to="/shop" className="site-btn">Back to Shop</Link>
      </div>
    );
  }

  // Filter comments for this product
  const productComments = comments.filter((c) => c.productId === productId);

  return (
    <div>
      {/* Breadcrumb Header */}
      <section className="breadcrumb-option" style={{ padding: "30px 0" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__text">
                <h4>All Comments & Reviews</h4>
                <div className="breadcrumb__links">
                  <Link to="/">Home</Link>
                  <Link to="/shop">Shop</Link>
                  <Link to={`/shop/${product.id}`}>{product.name}</Link>
                  <span>Comments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <section className="shop-details spad" style={{ paddingTop: "40px" }}>
        <div className="container">
          <div className="row">
            {/* Left Column: Product Summary Card */}
            <div className="col-lg-4 col-md-5">
              <div 
                style={{ 
                  border: "1px solid #e1e1e1", 
                  padding: "25px", 
                  borderRadius: "4px",
                  position: "sticky",
                  top: "30px",
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
                }}
              >
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <img 
                    src={product.mainImage} 
                    alt={product.name} 
                    style={{ maxWidth: "180px", height: "auto", borderRadius: "4px" }}
                  />
                </div>
                <h5 style={{ fontWeight: "700", marginBottom: "8px", fontSize: "18px" }}>{product.name}</h5>
                <p style={{ color: "#e53637", fontWeight: "700", fontSize: "20px", marginBottom: "15px" }}>
                  ${product.price.toFixed(2)}
                </p>
                <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.6", marginBottom: "20px" }}>
                  {product.description}
                </p>
                <Link to={`/shop/${product.id}`} className="site-btn" style={{ display: "block", textAlign: "center", width: "100%" }}>
                  Back to Product
                </Link>
              </div>
            </div>

            {/* Right Column: Review List & Submission Form */}
            <div className="col-lg-8 col-md-7">
              <div className="product__details__tab__content" style={{ paddingLeft: "15px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid #e1e1e1", paddingBottom: "15px", marginBottom: "25px" }}>
                  <h4 style={{ fontWeight: "700", margin: 0 }}>Customer Reviews ({productComments.length})</h4>
                </div>

                {/* List of comments */}
                <div style={{ marginBottom: "50px" }}>
                  {productComments.length === 0 ? (
                    <p style={{ color: "#777", fontStyle: "italic" }}>No comments yet for this product. Be the first to review!</p>
                  ) : (
                    <AnimatePresence>
                      {productComments.map((commentItem) => (
                        <motion.div
                          key={commentItem.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          style={{
                            display: "flex",
                            gap: "15px",
                            paddingBottom: "20px",
                            borderBottom: "1px solid #f2f2f2",
                            marginBottom: "20px"
                          }}
                        >
                          {/* User Avatar Initials */}
                          <div
                            style={{
                              width: "48px",
                              height: "48px",
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
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
                              <h6 style={{ fontWeight: "700", margin: 0, fontSize: "15px" }}>{commentItem.userName}</h6>
                              <span style={{ fontSize: "12px", color: "#888" }}>{commentItem.date}</span>
                            </div>
                            <p style={{ fontSize: "14px", color: "#444", margin: 0, lineHeight: "1.5" }}>
                              {commentItem.comment}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>

                {/* Form to post a review */}
                <div 
                  style={{ 
                    border: "1px solid #e1e1e1", 
                    padding: "30px", 
                    borderRadius: "4px",
                    backgroundColor: "#fcfcfc"
                  }}
                >
                  <h4 style={{ fontWeight: "700", marginBottom: "20px" }}>Leave A Comment</h4>
                  <form onSubmit={handlePostComment}>
                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "block", fontWeight: "600", fontSize: "14px", marginBottom: "8px" }}>
                        Your Name
                      </label>
                      <input 
                        type="text" 
                        placeholder="Enter your name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        style={{
                          width: "100%",
                          height: "45px",
                          border: "1px solid #e1e1e1",
                          paddingLeft: "15px",
                          fontSize: "14px",
                          borderRadius: "2px",
                          outline: "none"
                        }}
                        required
                      />
                    </div>
                    <div style={{ marginBottom: "25px" }}>
                      <label style={{ display: "block", fontWeight: "600", fontSize: "14px", marginBottom: "8px" }}>
                        Your Review/Comment
                      </label>
                      <textarea 
                        placeholder="Share your thoughts about this product..."
                        rows="5"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        style={{
                          width: "100%",
                          border: "1px solid #e1e1e1",
                          padding: "15px",
                          fontSize: "14px",
                          borderRadius: "2px",
                          outline: "none",
                          resize: "vertical"
                        }}
                        required
                      />
                    </div>
                    <button type="submit" className="site-btn">
                      Submit Comment
                    </button>
                  </form>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
