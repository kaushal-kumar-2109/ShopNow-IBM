import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../../context/ShopContext";
import { motion } from "framer-motion";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";
import { getUserData, getAddresses } from "../../api/getApiHandler/getData";
import { apiAddAddress, apiPlaceOrder } from "../../api/postApiHandler/pstData";

export default function CheckOut({ isUserLoged }) {
  const { cart, getCartTotal, clearCart } = useShop();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Saved Addresses State
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "India",
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

  const fillFormWithAddress = (addr, email, name) => {
    let first = name || "";
    let last = "";
    if (addr.reciver) {
      const parts = addr.reciver.trim().split(" ");
      first = parts[0] || "";
      last = parts.slice(1).join(" ") || "";
    }
    const street = (addr.addressLine1 + (addr.addressLine2 ? `, ${addr.addressLine2}` : "")).trim();
    setFormData({
      firstName: first,
      lastName: last,
      country: addr.country || "India",
      address: street,
      city: addr.city || "",
      state: addr.state || "",
      postcode: addr.pincode || "",
      phone: addr.phone || "",
      email: email || formData.email || "",
      orderNotes: formData.orderNotes || ""
    });
  };

  useEffect(() => {
    const fetchStoredData = async () => {
      setLoading(true);
      if (isUserLoged) {
        let userEmail = "";
        let userName = "";

        // Fetch User Info
        const userRes = await getUserData();
        if (userRes.flag && userRes.data) {
          userEmail = userRes.data.email || "";
          userName = userRes.data.name || "";
          setFormData((prev) => ({ ...prev, email: userEmail }));
        }

        // Fetch saved addresses
        const addrRes = await getAddresses();
        if (addrRes.flag && addrRes.data) {
          setSavedAddresses(addrRes.data);
          const defAddr = addrRes.data.find(a => a.default);
          if (defAddr) {
            setSelectedAddress(defAddr);
            fillFormWithAddress(defAddr, userEmail, userName);
          } else if (addrRes.data.length > 0) {
            setSelectedAddress(addrRes.data[0]);
            fillFormWithAddress(addrRes.data[0], userEmail, userName);
          }
        }
      }
      setLoading(false);
    };
    fetchStoredData();
  }, [isUserLoged]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSelect = (addrId) => {
    if (!addrId) {
      setSelectedAddress(null);
      setFormData({
        firstName: "",
        lastName: "",
        country: "India",
        address: "",
        city: "",
        state: "",
        postcode: "",
        phone: "",
        email: formData.email,
        orderNotes: formData.orderNotes
      });
      return;
    }
    const addr = savedAddresses.find(a => a._id === addrId);
    if (addr) {
      setSelectedAddress(addr);
      fillFormWithAddress(addr, formData.email, "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error("Your cart is empty. Please add products before placing an order.");
      return;
    }

    setIsOrdered(true);

    if (isUserLoged) {
      // Check if the entered address matches ANY of the user's saved addresses in the database
      const formFullName = `${formData.firstName} ${formData.lastName}`.trim().toLowerCase();
      const formStreet = formData.address.trim().toLowerCase();
      const formCity = formData.city.trim().toLowerCase();
      const formState = formData.state.trim().toLowerCase();
      const formCountry = formData.country.trim().toLowerCase();
      const formPostcode = formData.postcode.trim();
      const formPhone = formData.phone.trim();

      const existingMatch = savedAddresses.find((addr) => {
        const dbReciver = addr.reciver.trim().toLowerCase();
        const dbStreet = (addr.addressLine1 + (addr.addressLine2 ? `, ${addr.addressLine2}` : "")).trim().toLowerCase();
        const dbCity = addr.city.trim().toLowerCase();
        const dbState = addr.state.trim().toLowerCase();
        const dbCountry = addr.country.trim().toLowerCase();
        
        return (
          dbReciver === formFullName &&
          dbStreet === formStreet &&
          dbCity === formCity &&
          dbState === formState &&
          dbCountry === formCountry &&
          addr.pincode.trim() === formPostcode &&
          addr.phone.trim() === formPhone
        );
      });

      const isNew = !existingMatch;

      if (isNew) {
        // Automatically save as a new address for the user in the database
        try {
          await apiAddAddress({
            reciver: `${formData.firstName} ${formData.lastName}`.trim(),
            addressLine1: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            pincode: formData.postcode,
            phone: formData.phone,
            addressType: "OTHER",
            isDefault: false
          });
          toast.success("New address automatically saved to your profile.");
        } catch (err) {
          console.error("Failed to auto-save new address:", err);
        }
      }

      // Map cart items to backend schema format safely filtering out any null/undefined products
      const validItems = cart.filter((item) => item && item.product);
      const orderItems = validItems.map((item) => ({
        product_id: item.product._id,
        title: item.product.title || item.product.name || "Product",
        image: item.product.images?.[0]?.url || "",
        price: item.product.discountPrice ?? item.product.price ?? 0,
        quantity: item.quantity,
        size: item.size || "",
        color: item.color || ""
      }));

      // Submit order details to database
      try {
        const orderRes = await apiPlaceOrder({
          items: orderItems,
          billingAddress: {
            reciver: `${formData.firstName} ${formData.lastName}`.trim(),
            addressLine1: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            pincode: formData.postcode,
            phone: formData.phone
          },
          totalAmount: subtotal,
          paymentMethod
        });

        if (orderRes.flag) {
          toast.success("Order placed successfully!");
          clearCart();
          setTimeout(() => {
            navigate("/profile?tab=orders");
          }, 1500);
        } else {
          toast.error(orderRes.message || "Failed to place order. Please try again.");
          setIsOrdered(false);
        }
      } catch (err) {
        console.error("Order API execution error:", err);
        toast.error(`Order Placement Error: ${err.message || "Server Error"}`);
        setIsOrdered(false);
      }
    } else {
      toast.error("Please login to place an order.");
      setIsOrdered(false);
    }
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

                {/* Stored Address Selector Dropdown */}
                {isUserLoged && savedAddresses.length > 0 && (
                  <div className="checkout__input" style={{ marginBottom: "25px", border: "1px solid var(--bg-border)", padding: "20px", borderRadius: "4px", backgroundColor: "var(--bg-secondary)" }}>
                    <p style={{ fontWeight: "700", marginBottom: "10px", color: "var(--text-secondary)" }}>Deliver to saved address:</p>
                    <select
                      value={selectedAddress ? selectedAddress._id : ""}
                      onChange={(e) => handleAddressSelect(e.target.value)}
                      style={{
                        width: "100%",
                        height: "45px",
                        border: "1px solid var(--bg-border)",
                        backgroundColor: "var(--bg-input)",
                        color: "var(--text-primary)",
                        paddingLeft: "15px",
                        fontSize: "14px",
                        outline: "none",
                        cursor: "pointer",
                        borderRadius: "2px"
                      }}
                    >
                      <option value="">-- Add a custom/new address --</option>
                      {savedAddresses.map((addr) => (
                        <option key={addr._id} value={addr._id}>
                          {addr.reciver} - {addr.addressLine1}, {addr.city} ({addr.addressType}) {addr.default ? "[DEFAULT]" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

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
                      cart
                        .filter((item) => item && item.product)
                        .map((item, idx) => (
                          <li key={idx} style={{ fontSize: "14px", display: "flex", justifyContent: "space-between" }}>
                            <span>
                              {idx + 1}. {item.product.title || item.product.name} (x{item.quantity})
                            </span>
                            <span>${((item.product.discountPrice ?? item.product.price) * item.quantity).toFixed(2)}</span>
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