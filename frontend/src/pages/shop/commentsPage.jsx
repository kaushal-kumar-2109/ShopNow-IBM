import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useShop } from "../../context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/Loader";
import { getProductById, getProductComments } from "../../api/getApiHandler/getData";
import { postComment } from "../../api/postApiHandler/pstData";

export default function CommentsPage({ isUserLoged }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isCartLoading } = useShop();

  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitMsg, setSubmitMsg] = useState({ text: "", ok: true });

  const loadData = async () => {
    setLoading(true);
    const prodRes = await getProductById(id);
    if (prodRes.flag && prodRes.data) {
      setProduct(prodRes.data);
      const commRes = await getProductComments(prodRes.data._id, 1, 100); // load up to 100 comments
      if (commRes.flag && commRes.data) {
        setComments(commRes.data.comments || []);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!isUserLoged) {
      navigate("/login");
      return;
    }
    if (!commentText.trim()) return;

    setSubmitting(true);
    setSubmitMsg({ text: "", ok: true });

    const res = await postComment({
      product_id: product._id,
      product_name: product.title,
      comment: commentText.trim(),
    });

    if (res.flag && res.data) {
      setComments((prev) => [res.data.data, ...prev]);
      setCommentText("");
      setSubmitMsg({ text: "✅ Your review has been posted!", ok: true });
    } else {
      const msg = res.message || "Failed to post. Please try again.";
      if (res.message?.includes("log in") || res.message?.includes("expired")) {
        setSubmitMsg({ text: "❌ Session expired. Redirecting to login…", ok: false });
        setTimeout(() => navigate("/login"), 1800);
      } else {
        setSubmitMsg({ text: `❌ ${msg}`, ok: false });
      }
    }
    setSubmitting(false);
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
                  <Link to={`/shop/${product._id}`}>{product.title}</Link>
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
                    src={product.images?.[0]?.url || ""}
                    alt={product.title}
                    style={{ maxWidth: "180px", height: "auto", borderRadius: "4px" }}
                  />
                </div>
                <h5 style={{ fontWeight: "700", marginBottom: "8px", fontSize: "18px" }}>{product.title}</h5>
                <p style={{ color: "#e53637", fontWeight: "700", fontSize: "20px", marginBottom: "15px" }}>
                  ${(product.discountPrice ?? product.price).toFixed(2)}
                </p>
                <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.6", marginBottom: "20px" }}>
                  {product.shortDescription || product.description}
                </p>
                <Link to={`/shop/${product._id}`} className="site-btn" style={{ display: "block", textAlign: "center", width: "100%" }}>
                  Back to Product
                </Link>
              </div>
            </div>

            {/* Right Column: Review List & Submission Form */}
            <div className="col-lg-8 col-md-7">
              <div className="product__details__tab__content" style={{ paddingLeft: "15px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid #e1e1e1", paddingBottom: "15px", marginBottom: "25px" }}>
                  <h4 style={{ fontWeight: "700", margin: 0 }}>Customer Reviews ({comments.length})</h4>
                </div>

                {/* List of comments */}
                <div style={{ marginBottom: "50px" }}>
                  {comments.length === 0 ? (
                    <p style={{ color: "#777", fontStyle: "italic" }}>No comments yet for this product. Be the first to review!</p>
                  ) : (
                    <AnimatePresence>
                      {comments.map((commentItem, idx) => (
                        <motion.div
                          key={commentItem._id || idx}
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
                              backgroundColor: `hsl(${(commentItem.user_name?.charCodeAt(0) || 65) * 7 % 360},55%,60%)`,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              fontWeight: "700",
                              color: "#fff",
                              flexShrink: 0
                            }}
                          >
                            {commentItem.user_name ? commentItem.user_name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
                              <h6 style={{ fontWeight: "700", margin: 0, fontSize: "15px" }}>{commentItem.user_name || "Guest"}</h6>
                              <span style={{ fontSize: "12px", color: "#888" }}>
                                {commentItem.created_at
                                  ? new Date(commentItem.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
                                  : ""}
                              </span>
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
                  {!isUserLoged ? (
                    <div style={{ textAlign: "center", padding: "10px" }}>
                      <p style={{ color: "#666", marginBottom: "15px" }}>You must be logged in to post a comment.</p>
                      <Link to="/login" className="site-btn">Login to Review</Link>
                    </div>
                  ) : (
                    <form onSubmit={handlePostComment}>
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
                      {submitMsg.text && (
                        <p style={{ marginBottom: "15px", color: submitMsg.ok ? "#28a745" : "#e53637", fontWeight: "600", fontSize: "14px" }}>
                          {submitMsg.text}
                        </p>
                      )}
                      <button type="submit" className="site-btn" disabled={submitting}>
                        {submitting ? "Submitting..." : "Submit Comment"}
                      </button>
                    </form>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
