import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useShop } from "../../context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/Loader";

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useShop();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      {/* Breadcrumb Header */}
      <section className="breadcrumb-option" style={{ padding: "30px 0" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__text">
                <h4>Wishlist</h4>
                <div className="breadcrumb__links">
                  <Link to="/">Home</Link>
                  <Link to="/shop">Shop</Link>
                  <span>Wishlist</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wishlist content */}
      <section className="shopping-cart spad">
        <div className="container">
          {wishlist.length === 0 ? (
            <div className="row">
              <div className="col-lg-12" style={{ textAlign: "center", padding: "80px 0" }}>
                <i className="icon_heart_alt" style={{ fontSize: "60px", color: "#888", display: "block", marginBottom: "20px" }}></i>
                <h3 style={{ fontWeight: "700", marginBottom: "15px" }}>Your Wishlist is Empty</h3>
                <p style={{ marginBottom: "30px" }}>Save your favorite items here to view or buy them later.</p>
                <Link to="/shop" className="site-btn">
                  Explore Shop
                </Link>
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col-lg-12">
                <div className="shopping__cart__table" style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", minWidth: "600px" }}>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Action</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {wishlist.map((product, idx) => {
                          const pId = product._id || product.id;
                          const pName = product.title || product.name || "Product";
                          const pImage = product.images?.[0]?.url || product.mainImage || "";
                          const pPrice = product.discountPrice ?? product.price ?? 0;

                          return (
                            <motion.tr
                              key={`${pId}-${idx}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3 }}
                            >
                              <td className="product__cart__item">
                                <div className="product__cart__item__pic">
                                  <Link to={`/shop/${pId}`}>
                                    <img
                                      src={pImage}
                                      alt={pName}
                                      style={{ width: "90px", height: "90px", objectFit: "cover" }}
                                    />
                                  </Link>
                                </div>
                                <div className="product__cart__item__text">
                                  <h6>
                                    <Link to={`/shop/${pId}`} style={{ color: "inherit" }}>
                                      {pName}
                                    </Link>
                                  </h6>
                                  <span style={{ fontSize: "12px", color: "#888" }}>Category: {product.category}</span>
                                </div>
                              </td>
                              <td className="cart__price">
                                ${pPrice.toFixed(2)}
                              </td>
                              <td>
                                <button
                                  className="site-btn"
                                  onClick={() => addToCart(product, 1)}
                                  style={{ padding: "8px 20px", fontSize: "12px" }}
                                >
                                  Add to Cart
                                </button>
                              </td>
                              <td
                                className="cart__close"
                                onClick={() => toggleWishlist(product)}
                                style={{ cursor: "pointer" }}
                                title="Remove from Wishlist"
                              >
                                <i className="icon_close"></i>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
