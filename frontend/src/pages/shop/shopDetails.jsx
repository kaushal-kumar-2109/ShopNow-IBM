import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useShop } from "../../context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/Loader";
import { getProductById, getProductComments } from "../../api/getApiHandler/getData";
import { postComment } from "../../api/postApiHandler/pstData";
import { STORAGE_KEY } from "../../utils/checkUser";

export default function ShopDetails({ isUserLoged }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, isCartLoading, isWishlistLoading } = useShop();

  /* ─── product state ─── */
  const [product, setProduct]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);

  /* ─── gallery & options ─── */
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize,  setSelectedSize]  = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity,      setQuantity]      = useState(1);

  /* ─── logged-in user info from localStorage ─── */
  const [loggedUser, setLoggedUser] = useState(null);

  /* ─── comments state ─── */
  const [comments,        setComments]        = useState([]);
  const [commentsTotal,   setCommentsTotal]   = useState(0);
  const [commentsPage,    setCommentsPage]    = useState(1);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [hasMore,         setHasMore]         = useState(false);

  /* ─── new comment form ─── */
  const [commentText, setCommentText] = useState("");
  const [submitting,  setSubmitting]  = useState(false);
  const [submitMsg,   setSubmitMsg]   = useState({ text: "", ok: true });

  /* ═════════════════════════════════════════
     Read logged-in user from localStorage
  ═════════════════════════════════════════ */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLoggedUser(JSON.parse(raw));
    } catch (_) {}
  }, [isUserLoged]);

  /* ═════════════════════════════════════════
     Fetch product on mount / id change
  ═════════════════════════════════════════ */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setNotFound(false);
      setProduct(null);
      setComments([]);
      setCommentsPage(1);

      const res = await getProductById(id);
      if (res.flag && res.data) {
        const p = res.data;
        setProduct(p);
        setSelectedImage(p.images?.[0]?.url || "");
        setSelectedSize(p.sizes?.[0]  || "");
        setSelectedColor(p.colors?.[0] || "");
        loadComments(p._id, 1, []);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  /* ═════════════════════════════════════════
     Fetch comments (supports "load more")
  ═════════════════════════════════════════ */
  const loadComments = async (productId, page, existing) => {
    setCommentsLoading(true);
    const res = await getProductComments(productId, page, 5);
    if (res.flag && res.data) {
      const { comments: fetched, total, totalPages } = res.data;
      setComments([...existing, ...fetched]);
      setCommentsTotal(total);
      setHasMore(page < totalPages);
      setCommentsPage(page);
    }
    setCommentsLoading(false);
  };

  const handleLoadMore = () => {
    if (product && !commentsLoading) {
      loadComments(product._id, commentsPage + 1, comments);
    }
  };

  /* ═════════════════════════════════════════
     Submit new comment — only for logged-in users
  ═════════════════════════════════════════ */
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
      product_id:   product._id,
      product_name: product.title,
      comment:      commentText.trim(),
    });

    if (res.flag && res.data) {
      // Optimistically prepend — use the server-returned document
      setComments((prev) => [res.data.data, ...prev]);
      setCommentsTotal((t) => t + 1);
      setCommentText("");
      setSubmitMsg({ text: "✅ Your review has been posted!", ok: true });
    } else {
      const msg = res.message || "Failed to post. Please try again.";
      // If auth error, redirect to login
      if (res.data?.tag === "token" || res.message?.includes("log in")) {
        setSubmitMsg({ text: "❌ Session expired. Redirecting to login…", ok: false });
        setTimeout(() => navigate("/login"), 1800);
      } else {
        setSubmitMsg({ text: `❌ ${msg}`, ok: false });
      }
    }
    setSubmitting(false);
  };

  /* ─── guards ─── */
  if (loading) return <Loader />;

  if (notFound) {
    return (
      <div className="container spad" style={{ textAlign: "center" }}>
        <h3 style={{ fontWeight: "700", marginBottom: "20px" }}>Product Not Found</h3>
        <p>The product you are looking for does not exist.</p>
        <Link to="/shop" className="site-btn">Back to Shop</Link>
      </div>
    );
  }

  const isFavorite   = isInWishlist(product);
  const displayPrice = product.discountPrice ?? product.price;
  const hasDiscount  = !!product.discountPrice;
  const allImages    = product.images || [];

  return (
    <div>
      {/* ══ Breadcrumb ══ */}
      <section className="breadcrumb-option" style={{ padding: "30px 0", background: "#f8f8f8" }}>
        <div className="container">
          <div className="breadcrumb__text">
            <h4>{product.title}</h4>
            <div className="breadcrumb__links">
              <Link to="/">Home</Link>
              <Link to="/shop">Shop</Link>
              <span>{product.category}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ Product Detail ══ */}
      <section className="shop-details spad">
        <div className="container">
          <div className="row">

            {/* ── Thumbnails ── */}
            <div className="col-lg-2 col-md-2" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {allImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(img.url)}
                  style={{
                    cursor: "pointer",
                    border: selectedImage === img.url ? "2px solid #e53637" : "2px solid #eee",
                    borderRadius: "4px",
                    overflow: "hidden",
                    height: "72px",
                    transition: "border 0.2s",
                  }}
                >
                  <img
                    src={img.url}
                    alt={img.alt || product.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>

            {/* ── Main Image ── */}
            <div className="col-lg-5 col-md-5">
              <div style={{ width: "100%", height: "500px", borderRadius: "6px", overflow: "hidden", background: "#f5f5f5" }}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={selectedImage}
                    alt={product.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
              </div>
            </div>

            {/* ── Details panel ── */}
            <div className="col-lg-5 col-md-5">
              <div className="product__details__text">

                {/* Badges */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
                  {product.brand && (
                    <span style={{ fontSize: "12px", background: "#111", color: "#fff", padding: "3px 10px", borderRadius: "2px", letterSpacing: "1px" }}>
                      {product.brand}
                    </span>
                  )}
                  <span style={{ fontSize: "12px", background: "#f5f5f5", color: "#555", padding: "3px 10px", borderRadius: "2px" }}>
                    {product.category}
                  </span>
                  {product.stock === 0 && (
                    <span style={{ fontSize: "12px", background: "#e53637", color: "#fff", padding: "3px 10px", borderRadius: "2px" }}>
                      Out of Stock
                    </span>
                  )}
                </div>

                <h4 style={{ fontWeight: "700", marginBottom: "10px", lineHeight: "1.3" }}>{product.title}</h4>

                {/* Rating */}
                <div style={{ marginBottom: "12px" }}>
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`fa ${i < Math.round(product.rating) ? "fa-star" : "fa-star-o"}`}
                       style={{ color: "#f7941d", marginRight: "2px" }} />
                  ))}
                  <span style={{ fontSize: "13px", color: "#888", marginLeft: "8px" }}>
                    ({commentsTotal} Reviews)
                  </span>
                </div>

                {/* Price */}
                <h3 style={{ marginBottom: "16px", fontWeight: "700" }}>
                  ${displayPrice.toFixed(2)}
                  {hasDiscount && (
                    <span style={{ fontSize: "16px", color: "#b7b7b7", textDecoration: "line-through", fontWeight: "400", marginLeft: "12px" }}>
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                  {hasDiscount && (
                    <span style={{ fontSize: "13px", color: "#e53637", marginLeft: "10px", fontWeight: "700" }}>
                      {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                    </span>
                  )}
                </h3>

                {/* Short description */}
                {product.shortDescription && (
                  <p style={{ marginBottom: "20px", color: "#555", lineHeight: "1.7" }}>
                    {product.shortDescription}
                  </p>
                )}

                {/* Sizes */}
                {product.sizes?.length > 0 && (
                  <div style={{ marginBottom: "15px" }}>
                    <span style={{ fontWeight: "700", fontSize: "13px", display: "block", marginBottom: "8px" }}>Size:</span>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {product.sizes.map((sz) => (
                        <label key={sz} onClick={() => setSelectedSize(sz)}
                          style={{
                            padding: "5px 14px",
                            border: selectedSize === sz ? "2px solid #111" : "1px solid #ddd",
                            cursor: "pointer", fontSize: "13px",
                            fontWeight: selectedSize === sz ? "700" : "400",
                            background: selectedSize === sz ? "#111" : "#fff",
                            color: selectedSize === sz ? "#fff" : "#333",
                            borderRadius: "2px", transition: "all 0.2s",
                          }}>
                          {sz}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Colors */}
                {product.colors?.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <span style={{ fontWeight: "700", fontSize: "13px", display: "block", marginBottom: "8px" }}>Color:</span>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      {product.colors.map((hex) => (
                        <label key={hex} title={hex} onClick={() => setSelectedColor(hex)}
                          style={{
                            width: "26px", height: "26px", borderRadius: "50%",
                            backgroundColor: hex, cursor: "pointer",
                            border: selectedColor === hex ? "3px solid #111" : "2px solid #ddd",
                            outline: selectedColor === hex ? "2px solid #fff" : "none",
                            outlineOffset: "-4px", transition: "all 0.2s",
                          }} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity + Add to cart */}
                <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: "2px" }}>
                    <i className="fa fa-angle-left"
                       onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                       style={{ padding: "10px 14px", cursor: "pointer", fontSize: "16px" }} />
                    <span style={{ padding: "0 16px", fontWeight: "700", fontSize: "16px" }}>{quantity}</span>
                    <i className="fa fa-angle-right"
                       onClick={() => setQuantity((q) => Math.min(q + 1, product.stock || 99))}
                       style={{ padding: "10px 14px", cursor: "pointer", fontSize: "16px" }} />
                  </div>
                  <button
                    className="primary-btn"
                    onClick={() => addToCart({ ...product, selectedSize, selectedColor }, quantity)}
                    disabled={product.stock === 0 || isCartLoading(product._id)}
                    style={{ flexGrow: 1, opacity: isCartLoading(product._id) ? 0.6 : 1 }}
                  >
                    {product.stock === 0 ? "Out of Stock" : (isCartLoading(product._id) ? "Adding..." : "Add to Cart")}
                  </button>
                </div>

                {/* Wishlist */}
                <button 
                  onClick={() => toggleWishlist(product)} 
                  className="site-btn"
                  disabled={isWishlistLoading(product._id)}
                  style={{
                    width: "100%", marginBottom: "24px",
                    background: isFavorite ? "#e53637" : "#111",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                    opacity: isWishlistLoading(product._id) ? 0.6 : 1
                  }}
                >
                  <i className="fa fa-heart" />
                  {isWishlistLoading(product._id) ? "Updating Wishlist..." : (isFavorite ? "Remove from Wishlist" : "Add to Wishlist")}
                </button>

                {/* Meta */}
                <div style={{ borderTop: "1px solid #eee", paddingTop: "16px", fontSize: "13px", color: "#555" }}>
                  {product.stock !== undefined && (
                    <p style={{ marginBottom: "5px" }}>
                      <strong>Availability:</strong>{" "}
                      <span style={{ color: product.stock > 0 ? "#28a745" : "#e53637", fontWeight: "700" }}>
                        {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
                      </span>
                    </p>
                  )}
                  {product.sold > 0 && (
                    <p style={{ marginBottom: "5px" }}><strong>Sold:</strong> {product.sold} units</p>
                  )}
                  {product.tags?.length > 0 && (
                    <p style={{ marginBottom: "5px" }}>
                      <strong>Tags:</strong>{" "}
                      {product.tags.map((tag, i) => (
                        <span key={i} style={{ marginRight: "6px", background: "#f5f5f5", padding: "2px 8px", borderRadius: "2px" }}>{tag}</span>
                      ))}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Full description ── */}
          {product.description && (
            <div style={{ marginTop: "50px", borderTop: "1px solid #eee", paddingTop: "40px" }}>
              <h5 style={{ fontWeight: "700", marginBottom: "16px", fontSize: "20px" }}>Product Description</h5>
              <p style={{ lineHeight: "1.9", color: "#555", maxWidth: "820px" }}>{product.description}</p>
            </div>
          )}
        </div>
      </section>

      {/* ══ Comments Section ══ */}
      <section style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--bg-border)", padding: "60px 0" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">

              {/* Header */}
              <div style={{ marginBottom: "36px" }}>
                <span style={{ color: "#e53637", fontWeight: "700", textTransform: "uppercase", fontSize: "13px", letterSpacing: "2px", display: "block", marginBottom: "8px" }}>
                  Reviews &amp; Feedback
                </span>
                <h2 style={{ fontWeight: "700", color: "var(--text-secondary)", fontSize: "28px" }}>
                  Customer Reviews
                  <span style={{ fontSize: "15px", color: "var(--text-muted)", fontWeight: "400", marginLeft: "12px" }}>({commentsTotal})</span>
                </h2>
              </div>

              {/* Comments list */}
              <div style={{ marginBottom: "40px" }}>
                {comments.length === 0 && !commentsLoading && (
                  <p style={{ color: "var(--text-muted)", fontStyle: "italic", padding: "20px 0" }}>
                    No reviews yet. Be the first to leave one below!
                  </p>
                )}

                <AnimatePresence>
                  {comments.map((c, idx) => (
                    <motion.div
                      key={c._id || idx}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.3) }}
                      style={{ display: "flex", gap: "14px", padding: "18px 0", borderBottom: "1px solid var(--bg-border-light)" }}
                    >
                      {/* Avatar */}
                      <div style={{
                        width: "42px", height: "42px", borderRadius: "50%",
                        background: `hsl(${(c.user_name?.charCodeAt(0) || 65) * 7 % 360},55%,60%)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: "700", color: "#fff", fontSize: "16px", flexShrink: 0,
                      }}>
                        {(c.user_name || "G").charAt(0).toUpperCase()}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                          <h6 style={{ fontWeight: "700", margin: 0, fontSize: "14px" }}>{c.user_name || "Guest"}</h6>
                          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                            {c.created_at
                              ? new Date(c.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
                              : ""}
                          </span>
                        </div>
                        <p style={{ fontSize: "14px", color: "var(--text-primary)", margin: 0, lineHeight: "1.6" }}>{c.comment}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {commentsLoading && (
                  <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "16px 0" }}>Loading reviews…</p>
                )}

                {hasMore && !commentsLoading && (
                  <button
                    onClick={handleLoadMore}
                    style={{
                      marginTop: "20px", padding: "10px 28px",
                      border: "1px solid var(--bg-border)", background: "var(--bg-card)",
                      cursor: "pointer", fontWeight: "700",
                      fontSize: "13px", letterSpacing: "1px", textTransform: "uppercase",
                      color: "var(--text-secondary)",
                    }}
                    onMouseEnter={(e) => { e.target.style.background = "var(--accent-color)"; e.target.style.color = "#fff"; e.target.style.borderColor = "var(--accent-color)"; }}
                    onMouseLeave={(e) => { e.target.style.background = "var(--bg-card)"; e.target.style.color = "var(--text-secondary)"; e.target.style.borderColor = "var(--bg-border)"; }}
                  >
                    Load More ({commentsTotal - comments.length} remaining)
                  </button>
                )}
              </div>

              {/* ── Post Comment Form ── */}
              <div style={{
                border: "1px solid var(--bg-border)", borderRadius: "6px",
                padding: "30px", background: "var(--bg-card)",
                boxShadow: "var(--shadow-sm)",
              }}>
                <h5 style={{ fontWeight: "700", marginBottom: "6px", fontSize: "18px" }}>Leave a Review</h5>

                {/* Not logged in — show CTA */}
                {!isUserLoged ? (
                  <div style={{
                    marginTop: "16px", padding: "20px",
                    background: "var(--bg-secondary)", border: "1px solid var(--bg-border)",
                    borderRadius: "4px", textAlign: "center",
                  }}>
                    <p style={{ margin: "0 0 14px", color: "var(--text-primary)", fontSize: "14px" }}>
                      You must be logged in to leave a review.
                    </p>
                    <Link to="/login" className="site-btn" style={{ display: "inline-block" }}>
                      Login to Review
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* Logged-in user chip */}
                    {loggedUser && (
                      <p style={{ marginBottom: "14px", fontSize: "13px", color: "var(--text-muted)" }}>
                        Posting as <strong style={{ color: "var(--text-secondary)" }}>{loggedUser.name || loggedUser.email}</strong>
                      </p>
                    )}

                    <form onSubmit={handlePostComment}>
                      <div style={{ marginBottom: "18px" }}>
                        <textarea
                          placeholder="Write your review here…"
                          rows="5"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          required
                          style={{
                            width: "100%", border: "1px solid var(--bg-border)",
                            padding: "14px", fontSize: "14px", borderRadius: "3px",
                            outline: "none", resize: "vertical", lineHeight: "1.6",
                            background: "var(--bg-input)", color: "var(--text-primary)",
                          }}
                          onFocus={(e)  => (e.target.style.borderColor = "var(--accent-color)")}
                          onBlur={(e)   => (e.target.style.borderColor = "var(--bg-border)")}
                        />
                      </div>

                      {submitMsg.text && (
                        <p style={{
                          marginBottom: "14px", fontSize: "13px", fontWeight: "600",
                          color: submitMsg.ok ? "#28a745" : "#e53637",
                        }}>
                          {submitMsg.text}
                        </p>
                      )}

                      <button type="submit" className="site-btn"
                        disabled={submitting}
                        style={{ opacity: submitting ? 0.6 : 1, minWidth: "160px" }}>
                        {submitting ? "Posting…" : "Post Review"}
                      </button>
                    </form>
                  </>
                )}
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}