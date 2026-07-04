import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../../context/ShopContext";
import { motion } from "framer-motion";
import Loader from "../../components/Loader";

export default function CheckOut({ isUserLoged, setIsUserLoged }) {
  const { cart, getCartTotal, clearCart } = useShop();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "United States",
    address: "",
    city: "",
    state: "",
    postcode: "",
    phone: "",
    email: "",
    orderNotes: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("cod"); // cod, paypal, card
  const [isOrdered, setIsOrdered] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty. Please add products before placing an order.");
      return;
    }
    // Simple verification check
    setIsOrdered(true);
    setTimeout(() => {
      alert(`Order placed successfully! Thank you for shopping with us, ${formData.firstName}.`);
      clearCart();
      navigate("/");
    }, 2000);
  };

  const subtotal = getCartTotal();

  if (loading) {
    return <Loader />;
  }

  if (isOrdered) {
    return (
      <div className="container spad" style={{ textAlign: "center", padding: "120px 0" }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <i
            className="fa fa-check-circle"
            style={{ fontSize: "80px", color: "#e53637", marginBottom: "20px" }}
          />
          <h2 style={{ fontWeight: "700", marginBottom: "15px" }}>Processing Your Order...</h2>
          <p>We are setting up your delivery profile and routing details. Please hang tight!</p>
        </motion.div>
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
                <h4>Checkout</h4>
                <div className="breadcrumb__links">
                  <Link to="/">Home</Link>
                  <Link to="/shop">Shop</Link>
                  <span>Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="checkout spad">
        <div className="container">
          <form onSubmit={handleSubmit} className="checkout__form">
            <div className="row">
              {/* Billing Forms Column */}
              <div className="col-lg-8 col-md-6">
                <h5 className="checkout__title">Billing Details</h5>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="checkout__input">
                      <p>
                        First Name<span>*</span>
                      </p>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="checkout__input">
                      <p>
                        Last Name<span>*</span>
                      </p>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="checkout__input">
                  <p>
                    Country<span>*</span>
                  </p>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="checkout__input">
                  <p>
                    Address<span>*</span>
                  </p>
                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address, Apartment, suite, unit etc."
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    style={{ marginBottom: "15px" }}
                  />
                </div>

                <div className="checkout__input">
                  <p>
                    Town/City<span>*</span>
                  </p>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="checkout__input">
                  <p>
                    State<span>*</span>
                  </p>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-lg-6">
                    <div className="checkout__input">
                      <p>
                        Postcode / ZIP<span>*</span>
                      </p>
                      <input
                        type="text"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="checkout__input">
                      <p>
                        Phone<span>*</span>
                      </p>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="checkout__input">
                  <p>
                    Email<span>*</span>
                  </p>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="checkout__input">
                  <p>Order notes</p>
                  <input
                    type="text"
                    name="orderNotes"
                    placeholder="Notes about your order, e.g. special notes for delivery."
                    value={formData.orderNotes}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Order Summaries Column */}
              <div className="col-lg-4 col-md-6">
                <div className="checkout__order">
                  <h5>Your Order</h5>
                  <div className="checkout__order__products">
                    Product <span>Total</span>
                  </div>
                  <ul className="checkout__total__products">
                    {cart.length === 0 ? (
                      <li style={{ fontSize: "14px", color: "#888" }}>No products in cart</li>
                    ) : (
                      cart.map((item, idx) => (
                        <li key={idx} style={{ fontSize: "14px", display: "flex", justifyContent: "space-between" }}>
                          <span>
                            {idx + 1}. {item.product.name} (x{item.quantity})
                          </span>
                          <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))
                    )}
                  </ul>
                  <div className="checkout__total__all">
                    <ul>
                      <li style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        Subtotal <span>${subtotal.toFixed(2)}</span>
                      </li>
                      <li style={{ display: "flex", justifyContent: "space-between" }}>
                        Total <span>${subtotal.toFixed(2)}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Payment selection */}
                  <h5 style={{ borderBottom: "none", paddingBottom: 0, marginTop: "20px" }}>
                    Payment Options
                  </h5>
                  <div style={{ marginBottom: "25px" }}>
                    <div style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
                      <input
                        type="radio"
                        id="cod"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        style={{ marginRight: "10px", width: "auto" }}
                      />
                      <label htmlFor="cod" style={{ fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
                        Cash On Delivery
                      </label>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
                      <input
                        type="radio"
                        id="paypal"
                        name="payment"
                        value="paypal"
                        checked={paymentMethod === "paypal"}
                        onChange={() => setPaymentMethod("paypal")}
                        style={{ marginRight: "10px", width: "auto" }}
                      />
                      <label htmlFor="paypal" style={{ fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
                        PayPal
                      </label>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
                      <input
                        type="radio"
                        id="card"
                        name="payment"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        style={{ marginRight: "10px", width: "auto" }}
                      />
                      <label htmlFor="card" style={{ fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
                        Credit/Debit Card
                      </label>
                    </div>
                  </div>

                  <button type="submit" className="site-btn" style={{ width: "100%" }}>
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}