import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useShop } from "../../context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/Loader";

export default function ShoppingCart({ isUserLoged, setIsUserLoged }) {
  const { cart, updateCartQuantity, removeFromCart, getCartTotal } = useShop();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === "SAVE20") {
      setDiscountPercent(20);
      alert("Promo code applied! 20% discount applied to your order.");
    } else if (promoCode.toUpperCase() === "SAVE10") {
      setDiscountPercent(10);
      alert("Promo code applied! 10% discount applied to your order.");
    } else {
      alert("Invalid promo code. Try SAVE20 or SAVE10!");
    }
  };

  const subtotal = getCartTotal();
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = subtotal - discountAmount;

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
                <h4>Shopping Cart</h4>
                <div className="breadcrumb__links">
                  <Link to="/">Home</Link>
                  <Link to="/shop">Shop</Link>
                  <span>Shopping Cart</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cart Page content */}
      <section className="shopping-cart spad">
        <div className="container">
          {cart.length === 0 ? (
            <div className="row">
              <div className="col-lg-12" style={{ textAlign: "center", padding: "80px 0" }}>
                <i className="icon_bag_alt" style={{ fontSize: "60px", color: "#888", display: "block", marginBottom: "20px" }}></i>
                <h3 style={{ fontWeight: "700", marginBottom: "15px" }}>Your Cart is Empty</h3>
                <p style={{ marginBottom: "30px" }}>Browse our latest catalog to add products into your shopping bag.</p>
                <Link to="/shop" className="site-btn">
                  Continue Shopping
                </Link>
              </div>
            </div>
          ) : (
            <div className="row">
              {/* Left Items Table Column */}
              <div className="col-lg-8">
                <div className="shopping__cart__table" style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", minWidth: "600px" }}>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {cart.map((item, idx) => (
                          <motion.tr
                            key={idx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <td className="product__cart__item">
                              <div className="product__cart__item__pic">
                                <img
                                  src={item.product.mainImage}
                                  alt={item.product.name}
                                  style={{ width: "90px", height: "90px", objectFit: "cover" }}
                                />
                              </div>
                              <div className="product__cart__item__text">
                                <h6>{item.product.name}</h6>
                                <p style={{ fontSize: "12px", color: "#888", marginBottom: 0 }}>
                                  Size: {item.size} {item.color && `| Color:`}{" "}
                                  {item.color && (
                                    <span
                                      style={{
                                        display: "inline-block",
                                        width: "10px",
                                        height: "10px",
                                        backgroundColor: item.color,
                                        borderRadius: "50%",
                                        marginLeft: "3px",
                                        verticalAlign: "middle",
                                        border: "1px solid #ccc"
                                      }}
                                    />
                                  )}
                                </p>
                                <h5>${item.product.price.toFixed(2)}</h5>
                              </div>
                            </td>
                            <td>
                              <div className="quantity">
                                <i
                                  className="fa fa-angle-left"
                                  onClick={() =>
                                    updateCartQuantity(
                                      item.product.id,
                                      item.size,
                                      item.color,
                                      item.quantity - 1
                                    )
                                  }
                                />
                                <span>{item.quantity}</span>
                                <i
                                  className="fa fa-angle-right"
                                  onClick={() =>
                                    updateCartQuantity(
                                      item.product.id,
                                      item.size,
                                      item.color,
                                      item.quantity + 1
                                    )
                                  }
                                />
                              </div>
                            </td>
                            <td className="cart__price">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </td>
                            <td
                              className="cart__close"
                              onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                            >
                              <i className="icon_close"></i>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                {/* Additional Buttons */}
                <div className="row" style={{ marginTop: "30px" }}>
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <Link to="/shop" className="site-btn" style={{ background: "transparent", border: "1px solid #111", color: "#111" }}>
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Order Summary Column */}
              <div className="col-lg-4">
                {/* Discount Promo Card */}
                <div className="cart__discount" style={{ marginTop: 0 }}>
                  <h6>Discount Codes</h6>
                  <form onSubmit={handleApplyPromo}>
                    <input
                      type="text"
                      placeholder="Coupon Code (SAVE10 / SAVE20)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button type="submit">Apply</button>
                  </form>
                </div>

                {/* Cart Subtotals Card */}
                <div className="cart__total">
                  <h6>Cart Total</h6>
                  <ul>
                    <li>
                      Subtotal <span>${subtotal.toFixed(2)}</span>
                    </li>
                    {discountPercent > 0 && (
                      <li>
                        Discount ({discountPercent}%) <span>-${discountAmount.toFixed(2)}</span>
                      </li>
                    )}
                    <li>
                      Total <span>${total.toFixed(2)}</span>
                    </li>
                  </ul>
                  <Link to="/checkout" className="primary-btn" style={{ display: "block", textAlign: "center" }}>
                    Proceed to checkout
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}