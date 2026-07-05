import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const {
    cart,
    cartDrawerOpen,
    setCartDrawerOpen,
    removeFromCart,
    updateCartQuantity,
    getCartTotal
  } = useShop();

  const handleClose = () => {
    setCartDrawerOpen(false);
  };

  return (
    <AnimatePresence>
      {cartDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="cart-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Drawer Panel */}
          <motion.div
            className="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="cart-drawer__header">
              <h3>Shopping Cart ({cart.length})</h3>
              <div className="cart-drawer__close" onClick={handleClose}>
                <i className="icon_close"></i>
              </div>
            </div>

            <div className="cart-drawer__items">
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "50px 0", color: "#888" }}>
                  <i className="icon_bag_alt" style={{ fontSize: "40px", display: "block", marginBottom: "15px" }}></i>
                  Your cart is empty.
                </div>
              ) : (
                cart.map((item, idx) => {
                  const product = item.product;
                  const pId = product._id || product.id;
                  const pName = product.title || product.name || "Product";
                  const pImage = product.images?.[0]?.url || product.mainImage || "";
                  const pPrice = product.discountPrice ?? product.price ?? 0;

                  return (
                    <div key={idx} className="cart-drawer__item">
                      <Link to={`/shop/${pId}`} onClick={handleClose}>
                        <img src={pImage} alt={pName} style={{ width: "70px", height: "70px", objectFit: "cover" }} />
                      </Link>
                      <div className="cart-drawer__item-details">
                        <h5>
                          <Link to={`/shop/${pId}`} onClick={handleClose} style={{ color: "inherit" }}>
                            {pName}
                          </Link>
                        </h5>
                        <p style={{ color: "#888", fontSize: "12px", margin: "2px 0" }}>
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
                        <p style={{ fontWeight: "700" }}>${pPrice.toFixed(2)}</p>
                        <div className="cart-drawer__item-qty">
                          <button
                            onClick={() =>
                              updateCartQuantity(pId, item.size, item.color, item.quantity - 1)
                            }
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateCartQuantity(pId, item.size, item.color, item.quantity + 1)
                            }
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div
                        className="cart-drawer__item-remove"
                        onClick={() => removeFromCart(pId, item.size, item.color)}
                      >
                        <i className="icon_trash_alt"></i>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="cart-drawer__footer">
              <div className="cart-drawer__subtotal">
                <span>Subtotal:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="cart-drawer__buttons">
                <Link to="/shopping-cart" className="cart-drawer__btn-cart" onClick={handleClose}>
                  View Cart
                </Link>
                <Link to="/checkout" className="cart-drawer__btn-checkout" onClick={handleClose}>
                  Checkout
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
