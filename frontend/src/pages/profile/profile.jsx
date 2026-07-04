import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import "./profile.css";
import { getUserData } from "../../api/getApiHandler/getData";

const ADDRESS_KEY = "ShowNow_Addresses";
const ORDERS_KEY = "ShowNow_Orders";

export default function Profile({ isUserLoged, setIsUserLoged }) {

  const [getUser, setUser] = useState(false);

  const getUserRecord = async () => {
    const res = await getUserData();
    console.log("user response => ", res);
  }

  useEffect(() => {
    getUserRecord();
  }, []);

  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);
  const navigate = useNavigate();

  // ── Address State ────────────────────────────────────────────────────────────
  const userKey = "guest";

  const getAddresses = () => {
    try {
      const all = JSON.parse(localStorage.getItem(ADDRESS_KEY) || "{}");
      return all[userKey] || [];
    } catch { return []; }
  };

  const saveAddresses = (list) => {
    try {
      const all = JSON.parse(localStorage.getItem(ADDRESS_KEY) || "{}");
      all[userKey] = list;
      localStorage.setItem(ADDRESS_KEY, JSON.stringify(all));
    } catch { }
  };

  const [addresses, setAddresses] = useState(getAddresses);

  const getOrders = () => {
    try {
      const all = JSON.parse(localStorage.getItem(ORDERS_KEY) || "{}");
      return all[userKey] || [];
    } catch { return []; }
  };
  const [orders] = useState(getOrders);

  // ── Address Form ─────────────────────────────────────────────────────────────
  const emptyAddr = {
    reciver: "", phone: "", addressLine1: "", addressLine2: "",
    city: "", state: "", pincode: "", country: "India", addressType: "HOME", isDefault: false
  };
  const [addrForm, setAddrForm] = useState(emptyAddr);
  const [showAddrForm, setShowAddrForm] = useState(false);

  const handleAddrSubmit = (e) => {
    e.preventDefault();
    const required = ["reciver", "phone", "addressLine1", "city", "state", "pincode", "country"];
    for (const f of required) {
      if (!addrForm[f].trim()) {
        toast.error(`Please fill in "${f.replace(/([A-Z])/g, " $1")}"`);
        return;
      }
    }
    const newAddr = { ...addrForm, id: Date.now().toString() };
    const updated = [...addresses, newAddr];
    setAddresses(updated);
    saveAddresses(updated);
    setAddrForm(emptyAddr);
    setShowAddrForm(false);
    toast.success("Address saved successfully!");
  };

  const handleDeleteAddr = (id) => {
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    saveAddresses(updated);
    toast.success("Address removed.");
  };

  // ── Settings State ────────────────────────────────────────────────────────────
  const [displayName, setDisplayName] = useState("");



  const handleSettingsSave = (e) => {
    e.preventDefault();
    if (!displayName.trim()) { toast.error("Name cannot be empty."); return; }
    const toastId = toast.loading("Saving changes...");
    toast.success("Profile updated!", { id: toastId });
  };

  // ── Logout ────────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    logoutUser();
    setIsUserLoged(false);
    toast.success("Logged out successfully!");
    navigate("/");
  };

  // ── Order tracking ────────────────────────────────────────────────────────────
  const [expandedOrder, setExpandedOrder] = useState(null);
  const ORDER_STEPS = ["Placed", "Shipped", "Out for Delivery", "Delivered"];

  const renderTracker = (status) => {
    const idx = ORDER_STEPS.indexOf(status);
    return (
      <div className="tracker">
        {ORDER_STEPS.map((step, i) => (
          <div key={i} className={`tracker-step ${i <= idx ? "done" : ""} ${i === idx ? "current" : ""}`}>
            <div className="tracker-circle">{i + 1}</div>
            <span className="tracker-label">{step}</span>
            {i < ORDER_STEPS.length - 1 && <div className={`tracker-line ${i < idx ? "done" : ""}`} />}
          </div>
        ))}
      </div>
    );
  };

  // ── Tabs config ───────────────────────────────────────────────────────────────
  const tabs = [
    { id: "overview", icon: "fa-user", label: "Overview" },
    { id: "addresses", icon: "fa-map-marker", label: "Addresses" },
    { id: "orders", icon: "fa-shopping-bag", label: "Order History" },
    { id: "settings", icon: "fa-cog", label: "Settings" },
  ];

  return (
    <div className="profile-page container spad">
      <div className="row">
        {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
        <div className="col-lg-3 col-md-4">
          <div className="profile-sidebar">
            <div className="profile-avatar-card">
              <div className="profile-big-avatar">
                {"U"}
              </div>
              <h4>{"User"}</h4>
              <p>{"email"}</p>
            </div>

            <ul className="profile-nav">
              {tabs.map(t => (
                <li
                  key={t.id}
                  className={activeTab === t.id ? "active" : ""}
                  onClick={() => setActiveTab(t.id)}
                >
                  <i className={`fa ${t.icon}`}></i>
                  {t.label}
                </li>
              ))}
              <li className="logout-item" onClick={handleLogout}>
                <i className="fa fa-sign-out"></i>
                Logout
              </li>
            </ul>
          </div>
        </div>

        {/* ── Content ──────────────────────────────────────────────────────────── */}
        <div className="col-lg-9 col-md-8">
          <div className="profile-content">

            {/* ══ OVERVIEW ══════════════════════════════════════════════════════ */}
            {activeTab === "overview" && (
              <div className="tab-content">
                <h3 className="tab-heading">Account Overview</h3>
                <p className="tab-sub">Your personal information and quick stats</p>

                <div className="info-grid">
                  {[
                    { label: "Full Name", value: "name" },
                    { label: "Email Address", value: "email" },
                    { label: "Account Role", value: "USER" },
                    // { label: "Session Start", value: currentUser?.loginDate ? new Date(currentUser.loginDate).toLocaleString() : "—" },
                  ].map((item, i) => (
                    <div key={i} className="info-box">
                      <span className="info-label">{item.label}</span>
                      <span className="info-value">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="stats-row">
                  <div className="stat-box" onClick={() => setActiveTab("addresses")}>
                    <strong>{addresses.length}</strong>
                    <span>Saved Addresses</span>
                  </div>
                  <div className="stat-box" onClick={() => setActiveTab("orders")}>
                    <strong>{orders.length}</strong>
                    <span>Orders Placed</span>
                  </div>
                </div>
              </div>
            )}

            {/* ══ ADDRESSES ═════════════════════════════════════════════════════ */}
            {activeTab === "addresses" && (
              <div className="tab-content">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div>
                    <h3 className="tab-heading">Manage Addresses</h3>
                    <p className="tab-sub">Your saved delivery locations</p>
                  </div>
                  <button
                    className="site-btn"
                    style={{ padding: "10px 18px", fontSize: "13px" }}
                    onClick={() => setShowAddrForm(!showAddrForm)}
                  >
                    {showAddrForm ? "Cancel" : "+ Add Address"}
                  </button>
                </div>

                {/* Address Cards */}
                {addresses.length === 0 && !showAddrForm && (
                  <p className="empty-msg">No addresses saved. Click &quot;+ Add Address&quot; to get started.</p>
                )}
                <div className="address-grid">
                  {addresses.map(addr => (
                    <div key={addr.id} className={`address-card ${addr.isDefault ? "default-card" : ""}`}>
                      {addr.isDefault && <span className="default-badge">Default</span>}
                      <div className="addr-type-badge">{addr.addressType}</div>
                      <strong>{addr.reciver}</strong>
                      <p>{addr.addressLine1}</p>
                      {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                      <p>{addr.city}, {addr.state} — {addr.pincode}</p>
                      <p>{addr.country}</p>
                      <p style={{ fontWeight: "600", marginTop: "8px" }}>📞 {addr.phone}</p>
                      <button className="btn-remove" onClick={() => handleDeleteAddr(addr.id)}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Address Form */}
                {showAddrForm && (
                  <form onSubmit={handleAddrSubmit} className="addr-form">
                    <h4 style={{ marginBottom: "20px", fontWeight: "700" }}>New Address</h4>
                    <div className="row">
                      <div className="col-md-6 form-group">
                        <label>Receiver Name *</label>
                        <input value={addrForm.reciver} onChange={e => setAddrForm({ ...addrForm, reciver: e.target.value })} placeholder="e.g. John Doe" />
                      </div>
                      <div className="col-md-6 form-group">
                        <label>Phone *</label>
                        <input value={addrForm.phone} onChange={e => setAddrForm({ ...addrForm, phone: e.target.value })} placeholder="e.g. +91 9876543210" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Address Line 1 *</label>
                      <input value={addrForm.addressLine1} onChange={e => setAddrForm({ ...addrForm, addressLine1: e.target.value })} placeholder="Street, House No." />
                    </div>
                    <div className="form-group">
                      <label>Address Line 2</label>
                      <input value={addrForm.addressLine2} onChange={e => setAddrForm({ ...addrForm, addressLine2: e.target.value })} placeholder="Apartment, Landmark (optional)" />
                    </div>
                    <div className="row">
                      <div className="col-md-4 form-group">
                        <label>City *</label>
                        <input value={addrForm.city} onChange={e => setAddrForm({ ...addrForm, city: e.target.value })} placeholder="City" />
                      </div>
                      <div className="col-md-4 form-group">
                        <label>State *</label>
                        <input value={addrForm.state} onChange={e => setAddrForm({ ...addrForm, state: e.target.value })} placeholder="State" />
                      </div>
                      <div className="col-md-4 form-group">
                        <label>Pincode *</label>
                        <input value={addrForm.pincode} onChange={e => setAddrForm({ ...addrForm, pincode: e.target.value })} placeholder="110001" />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 form-group">
                        <label>Country *</label>
                        <input value={addrForm.country} onChange={e => setAddrForm({ ...addrForm, country: e.target.value })} />
                      </div>
                      <div className="col-md-6 form-group">
                        <label>Type</label>
                        <select value={addrForm.addressType} onChange={e => setAddrForm({ ...addrForm, addressType: e.target.value })}>
                          <option value="HOME">Home</option>
                          <option value="OFFICE">Office</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <input type="checkbox" id="defAddr" checked={addrForm.isDefault} onChange={e => setAddrForm({ ...addrForm, isDefault: e.target.checked })} style={{ width: "16px", height: "16px", cursor: "pointer" }} />
                      <label htmlFor="defAddr" style={{ cursor: "pointer", marginBottom: 0 }}>Set as default address</label>
                    </div>
                    <button type="submit" className="site-btn" style={{ marginTop: "10px" }}>Save Address</button>
                  </form>
                )}
              </div>
            )}

            {/* ══ ORDERS ════════════════════════════════════════════════════════ */}
            {activeTab === "orders" && (
              <div className="tab-content">
                <h3 className="tab-heading">Order History & Tracking</h3>
                <p className="tab-sub">All your past purchases</p>

                {orders.length === 0 ? (
                  <p className="empty-msg">No orders yet. Start shopping! 🛍️</p>
                ) : (
                  <div className="orders-list">
                    {orders.map(order => {
                      const open = expandedOrder === order.id;
                      return (
                        <div key={order.id} className="order-item">
                          <div className="order-header" onClick={() => setExpandedOrder(open ? null : order.id)}>
                            <div>
                              <div className="order-id">#{order.id}</div>
                              <div className="order-date">{order.date}</div>
                            </div>
                            <div className="order-meta">
                              <span className="order-total">${order.total?.toFixed(2)}</span>
                              <span className={`status-pill ${order.status?.toLowerCase().replace(/ /g, "-")}`}>
                                {order.status}
                              </span>
                              <i className={`fa ${open ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
                            </div>
                          </div>

                          {open && (
                            <div className="order-details">
                              <div className="tracking-section">
                                <h5>Shipment Tracking</h5>
                                {renderTracker(order.status)}
                              </div>
                              <hr style={{ margin: "20px 0", border: 0, borderTop: "1px solid #eee" }} />
                              <div className="row">
                                <div className="col-md-6">
                                  <h5>Shipping To</h5>
                                  <p><b>{order.billing?.firstName} {order.billing?.lastName}</b></p>
                                  <p>{order.billing?.address}</p>
                                  <p>{order.billing?.city}, {order.billing?.state} {order.billing?.postcode}</p>
                                  <p>📞 {order.billing?.phone}</p>
                                </div>
                                <div className="col-md-6">
                                  <h5>Payment</h5>
                                  <p>{order.paymentMethod?.toUpperCase()}</p>
                                </div>
                              </div>
                              {order.items && (
                                <>
                                  <hr style={{ margin: "20px 0", border: 0, borderTop: "1px solid #eee" }} />
                                  <h5>Items</h5>
                                  <table className="order-table">
                                    <thead>
                                      <tr>
                                        <th>Product</th>
                                        <th>Size</th>
                                        <th>Qty</th>
                                        <th>Total</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {order.items.map((item, i) => (
                                        <tr key={i}>
                                          <td>{item.product?.name}</td>
                                          <td>{item.size}</td>
                                          <td>{item.quantity}</td>
                                          <td>${(item.product?.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ══ SETTINGS ══════════════════════════════════════════════════════ */}
            {activeTab === "settings" && (
              <div className="tab-content">
                <h3 className="tab-heading">Settings</h3>
                <p className="tab-sub">Update your personal details</p>

                <form onSubmit={handleSettingsSave} className="settings-form">
                  <div className="form-group">
                    <label>Email Address (cannot be changed)</label>
                    <input type="email" value={""} disabled />
                  </div>
                  <div className="form-group">
                    <label>Display Name *</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <button type="submit" className="site-btn">Save Changes</button>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
