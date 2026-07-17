import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import "./profile.css";
import { getUserData, getAddresses, getOrdersList, getDevices } from "../../api/getApiHandler/getData";
import { apiUpdateProfile, apiAddAddress, apiUpdateAddress, apiDeleteAddress, apiCancelOrder, apiUpdateOrder, apiDeleteDevice, LogoutUser } from "../../api/postApiHandler/pstData";
import { clearSession } from "../../utils/checkUser";
import { useTheme } from "../../context/ThemeContext";
import { getDeviceInfo } from "../../utils/getDeviceData";

export default function Profile({ isUserLoged, setIsUserLoged }) {
  const { theme, updateTheme } = useTheme();
  const [getUser, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [displayName, setDisplayName] = useState("");
  const [devices, setDevices] = useState([]);
  const [currentDeviceInfo, setCurrentDeviceInfo] = useState(null);

  const isDeviceMatch = (device) => {
    if (!currentDeviceInfo) return false;
    let mismatchCount = 0;

    const currentRes = Array.isArray(currentDeviceInfo.screenResolution)
      ? currentDeviceInfo.screenResolution.join('x')
      : currentDeviceInfo.screenResolution;

    if (String(device.architecture) !== String(currentDeviceInfo.architecture)) mismatchCount++;
    if (Number(device.hardwareConcurrency) !== Number(currentDeviceInfo.hardwareConcurrency)) mismatchCount++;
    if (String(device.deviceMemory) !== String(currentDeviceInfo.deviceMemory)) mismatchCount++;
    if (String(device.screenResolution) !== String(currentRes)) mismatchCount++;
    if (String(device.timezone) !== String(currentDeviceInfo.timezone)) mismatchCount++;
    if (String(device.platform) !== String(currentDeviceInfo.platform)) mismatchCount++;

    return mismatchCount <= 2;
  };

  const fetchDevices = async () => {
    try {
      const res = await getDevices();
      if (res.flag && res.data) {
        setDevices(res.data);
      }
    } catch (err) {
      console.error("Error fetching devices:", err);
    }
  };

  const getSessionToken = () => {
    try {
      const dataStr = localStorage.getItem("ShopNowUserData");
      if (dataStr) {
        const parsed = JSON.parse(dataStr);
        return parsed.token;
      }
    } catch (err) {
      console.error("Error reading token from localStorage:", err);
    }
    return null;
  };

  const handleRemoveDevice = async (deviceId, isCurrent) => {
    const confirmMsg = isCurrent
      ? "Are you sure you want to log out of this device?"
      : "Are you sure you want to log out this device? It will be disconnected from your account.";
    if (!window.confirm(confirmMsg)) return;

    const toastId = toast.loading(isCurrent ? "Logging out..." : "Removing device...");
    try {
      const res = await apiDeleteDevice({ deviceId });
      if (res.flag) {
        toast.success(isCurrent ? "Logged out successfully!" : "Device removed successfully!", { id: toastId });
        if (isCurrent) {
          handleLogout();
        } else {
          fetchDevices();
        }
      } else {
        toast.error(res.message || "Failed to remove device", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error removing device", { id: toastId });
    }
  };

  const getDeviceIcon = (platform) => {
    const p = (platform || "").toLowerCase();
    if (p.includes("win")) return "fa-windows";
    if (p.includes("mac") || p.includes("iphone") || p.includes("ipad") || p.includes("ipod")) return "fa-apple";
    if (p.includes("android")) return "fa-android";
    if (p.includes("linux")) return "fa-linux";
    return "fa-desktop";
  };

  const [editingOrder, setEditingOrder] = useState(null);

  const fetchAddresses = async () => {
    try {
      const res = await getAddresses();
      if (res.flag && res.data) {
        setAddresses(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await getOrdersList();
      if (res.flag && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getUserRecord = async () => {
    try {
      const res = await getUserData();
      if (res.flag && res.data) {
        setUser(res.data);
        setDisplayName(res.data.name || "");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isUserLoged) {
      navigate("/");
      return;
    }
    const initData = async () => {
      await getUserRecord();
      await fetchAddresses();
      await fetchOrders();
      await fetchDevices();
    };
    initData();
  }, [isUserLoged]);

  useEffect(() => {
    const fetchCurrentInfo = async () => {
      try {
        const info = await getDeviceInfo();
        if (info.status && info.data) {
          setCurrentDeviceInfo(info.data);
        }
      } catch (err) {
        console.error("Error getting fingerprint device info:", err);
      }
    };
    fetchCurrentInfo();
  }, []);

  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Address Form State
  const emptyAddr = {
    reciver: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    addressType: "HOME",
    isDefault: false,
  };
  const [addrForm, setAddrForm] = useState(emptyAddr);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const handleAddrSubmit = async (e) => {
    e.preventDefault();
    const required = ["reciver", "phone", "addressLine1", "city", "state", "pincode", "country"];
    for (const f of required) {
      if (!addrForm[f].toString().trim()) {
        toast.error(`Please fill in "${f.replace(/([A-Z])/g, " $1")}"`);
        return;
      }
    }

    const payload = {
      reciver: addrForm.reciver,
      phone: addrForm.phone,
      addressLine1: addrForm.addressLine1,
      addressLine2: addrForm.addressLine2,
      city: addrForm.city,
      state: addrForm.state,
      country: addrForm.country,
      pincode: addrForm.pincode,
      addressType: addrForm.addressType,
      isDefault: addrForm.isDefault,
    };

    const isEditing = !!editingAddressId;
    const toastId = toast.loading(isEditing ? "Updating address..." : "Saving address to account...");

    try {
      let res;
      if (isEditing) {
        res = await apiUpdateAddress(editingAddressId, payload);
      } else {
        res = await apiAddAddress(payload);
      }

      if (res.flag) {
        toast.success(isEditing ? "Address updated successfully!" : "Address added successfully!", { id: toastId });
        setAddrForm(emptyAddr);
        setShowAddrForm(false);
        setEditingAddressId(null);
        fetchAddresses();
      } else {
        toast.error(res.message || "Failed to save address", { id: toastId });
      }
    } catch {
      toast.error("Error saving address", { id: toastId });
    }
  };

  const handleSetDefault = async (addr) => {
    const toastId = toast.loading("Setting default address...");
    try {
      const res = await apiUpdateAddress(addr._id, {
        reciver: addr.reciver,
        phone: addr.phone,
        addressLine1: addr.addressLine1,
        addressLine2: addr.addressLine2,
        city: addr.city,
        state: addr.state,
        country: addr.country,
        pincode: addr.pincode,
        addressType: addr.addressType,
        isDefault: true,
      });

      if (res.flag) {
        toast.success("Default address updated!", { id: toastId });
        fetchAddresses();
      } else {
        toast.error(res.message || "Failed to set default address", { id: toastId });
      }
    } catch {
      toast.error("Error setting default address", { id: toastId });
    }
  };

  const handleStartEdit = (addr) => {
    setEditingAddressId(addr._id);
    setAddrForm({
      reciver: addr.reciver,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || "",
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      country: addr.country,
      addressType: addr.addressType || "HOME",
      isDefault: addr.default || false,
    });
    setShowAddrForm(true);
  };

  const handleDeleteAddr = async (id) => {
    const toastId = toast.loading("Removing address...");
    try {
      const res = await apiDeleteAddress(id);
      if (res.flag) {
        toast.success("Address removed.", { id: toastId });
        fetchAddresses();
      } else {
        toast.error(res.message || "Failed to remove address", { id: toastId });
      }
    } catch {
      toast.error("Error removing address", { id: toastId });
    }
  };

  const handleSettingsSave = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    const toastId = toast.loading("Saving changes...");
    try {
      const res = await apiUpdateProfile({ name: displayName });
      if (res.flag && res.data) {
        toast.success("Profile updated!", { id: toastId });
        setUser(res.data);
      } else {
        toast.error(res.message || "Failed to update profile", { id: toastId });
      }
    } catch {
      toast.error("Error saving settings", { id: toastId });
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    const toastId = toast.loading("Cancelling order...");
    try {
      const res = await apiCancelOrder(orderId);
      if (res.flag) {
        toast.success("Order cancelled successfully!", { id: toastId });
        fetchOrders();
      } else {
        toast.error(res.message || "Failed to cancel order", { id: toastId });
      }
    } catch {
      toast.error("Error cancelling order", { id: toastId });
    }
  };

  const handleStartUpdateOrder = (order) => {
    const clonedItems = order.items.map((item) => ({ ...item }));
    setEditingOrder({ ...order, items: clonedItems });
  };

  const handleEditItemField = (idx, field, value) => {
    setEditingOrder((prev) => {
      if (!prev) return null;
      const updatedItems = [...prev.items];
      updatedItems[idx] = { ...updatedItems[idx], [field]: value };
      return { ...prev, items: updatedItems };
    });
  };

  const handleSaveUpdatedOrder = async () => {
    if (!editingOrder) return;
    const toastId = toast.loading("Saving updated items...");
    try {
      const res = await apiUpdateOrder(editingOrder._id, { items: editingOrder.items });
      if (res.flag) {
        toast.success("Order updated successfully!", { id: toastId });
        setEditingOrder(null);
        fetchOrders();
      } else {
        toast.error(res.message || "Failed to update order", { id: toastId });
      }
    } catch {
      toast.error("Error updating order", { id: toastId });
    }
  };

  const handleLogout = async () => {
    const logoutRes = await LogoutUser({});
    if(logoutRes.flag == false){
      toast.error(logoutRes.data.message);
      return;
    }
    clearSession();
    setIsUserLoged(false);
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const [expandedOrder, setExpandedOrder] = useState(null);
  const ORDER_STEPS = ["Placed", "Shipped", "Out for Delivery", "Delivered"];

  const renderTracker = (status) => {
    const idx = ORDER_STEPS.indexOf(status);
    if (status === "Cancelled") {
      return (
        <div style={{ color: "#e53637", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
          <i className="fa fa-times-circle" style={{ fontSize: "20px" }}></i>
          Order Cancelled
        </div>
      );
    }
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

  const tabs = [
    { id: "overview", icon: "fa-user", label: "Overview" },
    { id: "addresses", icon: "fa-map-marker", label: "Addresses" },
    { id: "orders", icon: "fa-shopping-bag", label: "Order History" },
    { id: "settings", icon: "fa-cog", label: "Settings" },
    { id: "devices", icon: "fa-desktop", label: "Active Sessions" },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="profile-page container spad">
      <div className="row">
        {/* Sidebar */}
        <div className="col-lg-3 col-md-4">
          <div className="profile-sidebar">
            <div className="profile-avatar-card">
              <div className="profile-big-avatar">
                {getUser.name ? getUser.name[0].toUpperCase() : "SN"}
              </div>
              <h4>{getUser.name}</h4>
              <p>{getUser.email}</p>
            </div>

            <ul className="profile-nav">
              {tabs.map((t) => (
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

        {/* Content */}
        <div className="col-lg-9 col-md-8">
          <div className="profile-content">
            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div className="tab-content">
                <h3 className="tab-heading">Account Overview</h3>
                <p className="tab-sub">Your personal information and quick stats</p>

                <div className="info-grid">
                  {[
                    { label: "Full Name", value: getUser.name },
                    { label: "Email Address", value: getUser.email },
                    { label: "Account Role", value: getUser.role || "Customer" },
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

            {/* ADDRESSES */}
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
                    onClick={() => {
                      setShowAddrForm(!showAddrForm);
                      if (showAddrForm) {
                        setEditingAddressId(null);
                        setAddrForm(emptyAddr);
                      }
                    }}
                  >
                    {showAddrForm ? "Cancel" : "+ Add Address"}
                  </button>
                </div>

                {/* Address Cards */}
                {addresses.length === 0 && !showAddrForm && (
                  <p className="empty-msg">No addresses saved. Click "+ Add Address" to get started.</p>
                )}
                <div className="address-grid">
                  {addresses.map((addr) => (
                    <div key={addr._id} className={`address-card ${addr.default ? "default-card" : ""}`}>
                      {addr.default && <span className="default-badge">Default</span>}
                      <div className="addr-type-badge">{addr.addressType}</div>
                      <strong>{addr.reciver}</strong>
                      <p>{addr.addressLine1}</p>
                      {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                      <p>{addr.city}, {addr.state} — {addr.pincode}</p>
                      <p>{addr.country}</p>
                      <p style={{ fontWeight: "600", marginTop: "8px" }}>📞 {addr.phone}</p>
                      <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                        <button className="site-btn" style={{ padding: "6px 12px", fontSize: "11px", backgroundColor: "#333" }} onClick={() => handleStartEdit(addr)}>
                          Edit
                        </button>
                        {!addr.default && (
                          <button className="site-btn" style={{ padding: "6px 12px", fontSize: "11px", backgroundColor: "#666" }} onClick={() => handleSetDefault(addr)}>
                            Set Default
                          </button>
                        )}
                        <button className="btn-remove" style={{ marginLeft: "auto", alignSelf: "center" }} onClick={() => handleDeleteAddr(addr._id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add/Edit Address Form */}
                {showAddrForm && (
                  <form onSubmit={handleAddrSubmit} className="addr-form">
                    <h4 style={{ marginBottom: "20px", fontWeight: "700" }}>{editingAddressId ? "Edit Address" : "New Address"}</h4>
                    <div className="row">
                      <div className="col-md-6 form-group">
                        <label>Receiver Name *</label>
                        <input value={addrForm.reciver} onChange={e => setAddrForm({ ...addrForm, reciver: e.target.value })} placeholder="e.g. John Doe" required />
                      </div>
                      <div className="col-md-6 form-group">
                        <label>Phone *</label>
                        <input value={addrForm.phone} onChange={e => setAddrForm({ ...addrForm, phone: e.target.value })} placeholder="e.g. +91 9876543210" required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Address Line 1 *</label>
                      <input value={addrForm.addressLine1} onChange={e => setAddrForm({ ...addrForm, addressLine1: e.target.value })} placeholder="Street, House No." required />
                    </div>
                    <div className="form-group">
                      <label>Address Line 2</label>
                      <input value={addrForm.addressLine2} onChange={e => setAddrForm({ ...addrForm, addressLine2: e.target.value })} placeholder="Apartment, Landmark (optional)" />
                    </div>
                    <div className="row">
                      <div className="col-md-4 form-group">
                        <label>City *</label>
                        <input value={addrForm.city} onChange={e => setAddrForm({ ...addrForm, city: e.target.value })} placeholder="City" required />
                      </div>
                      <div className="col-md-4 form-group">
                        <label>State *</label>
                        <input value={addrForm.state} onChange={e => setAddrForm({ ...addrForm, state: e.target.value })} placeholder="State" required />
                      </div>
                      <div className="col-md-4 form-group">
                        <label>Pincode *</label>
                        <input value={addrForm.pincode} onChange={e => setAddrForm({ ...addrForm, pincode: e.target.value })} placeholder="110001" required />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 form-group">
                        <label>Country *</label>
                        <input value={addrForm.country} onChange={e => setAddrForm({ ...addrForm, country: e.target.value })} required />
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
                    <button type="submit" className="site-btn" style={{ marginTop: "10px" }}>{editingAddressId ? "Save Changes" : "Save Address"}</button>
                  </form>
                )}
              </div>
            )}

            {/* ORDERS */}
            {activeTab === "orders" && (
              <div className="tab-content">
                <h3 className="tab-heading">Order History & Tracking</h3>
                <p className="tab-sub">All your purchases</p>

                {orders.length === 0 ? (
                  <p className="empty-msg">No orders yet. Start shopping! 🛍️</p>
                ) : (
                  <div className="orders-list">
                    {orders.map((order) => {
                      const open = expandedOrder === order._id;
                      return (
                        <div key={order._id} className="order-item">
                          <div className="order-header" onClick={() => setExpandedOrder(open ? null : order._id)}>
                            <div>
                              <div className="order-id">#{order._id}</div>
                              <div className="order-date">
                                {new Date(order.created_at || order.createdAt).toLocaleDateString("en-US", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </div>
                            </div>
                            <div className="order-meta">
                              <span className="order-total">${order.totalAmount?.toFixed(2)}</span>
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
                                  <p><b>{order.billingAddress?.reciver}</b></p>
                                  <p>{order.billingAddress?.addressLine1}</p>
                                  <p>{order.billingAddress?.city}, {order.billingAddress?.state} - {order.billingAddress?.pincode}</p>
                                  <p>{order.billingAddress?.country}</p>
                                  <p>📞 {order.billingAddress?.phone}</p>
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
                                        <th>Details</th>
                                        <th>Qty</th>
                                        <th style={{ textAlign: "right" }}>Total</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {order.items.map((item, i) => (
                                        <tr key={i}>
                                          <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <img
                                              src={item.image}
                                              alt={item.title}
                                              width="50"
                                              style={{ borderRadius: "4px", objectFit: "cover" }}
                                            />
                                            <span style={{ fontWeight: "600" }}>{item.title}</span>
                                          </td>
                                          <td>
                                            {[
                                              item.size && `Size: ${item.size}`,
                                              item.color && `Color: ${item.color}`,
                                            ]
                                              .filter(Boolean)
                                              .join(" / ") || "—"}
                                          </td>
                                          <td>{item.quantity}</td>
                                          <td style={{ textAlign: "right", fontWeight: "700" }}>
                                            ${(item.price * item.quantity).toFixed(2)}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </>
                              )}

                              {/* Cancel and Update order controls */}
                              {order.status !== "Cancelled" && (
                                <div style={{ display: "flex", gap: "10px", marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "15px" }}>
                                  {order.status === "Placed" && (
                                    <button
                                      className="site-btn"
                                      style={{ padding: "8px 16px", fontSize: "12px", backgroundColor: "#111" }}
                                      onClick={() => handleStartUpdateOrder(order)}
                                    >
                                      Update Items
                                    </button>
                                  )}
                                  {(order.status === "Placed" || order.status === "Shipped") && (
                                    <button
                                      className="site-btn"
                                      style={{ padding: "8px 16px", fontSize: "12px", backgroundColor: "#e53637" }}
                                      onClick={() => handleCancelOrder(order._id)}
                                    >
                                      Cancel Order
                                    </button>
                                  )}
                                </div>
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

            {/* SETTINGS */}
            {activeTab === "settings" && (
              <div className="tab-content">
                <h3 className="tab-heading">Settings</h3>
                <p className="tab-sub">Update your personal details</p>

                <form onSubmit={handleSettingsSave} className="settings-form">
                  <div className="form-group">
                    <label>Email Address (cannot be changed)</label>
                    <input type="email" value={getUser.email} disabled />
                  </div>
                  <div className="form-group">
                    <label>Display Name *</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Theme Preferences</label>
                    <div className="theme-toggle-group">
                      <button
                        type="button"
                        className={`theme-btn ${theme === "light" ? "active" : ""}`}
                        onClick={() => updateTheme("light")}
                      >
                        ☀️ Light
                      </button>
                      <button
                        type="button"
                        className={`theme-btn ${theme === "system" ? "active" : ""}`}
                        onClick={() => updateTheme("system")}
                      >
                        💻 System
                      </button>
                      <button
                        type="button"
                        className={`theme-btn ${theme === "dark" ? "active" : ""}`}
                        onClick={() => updateTheme("dark")}
                      >
                        🌙 Dark
                      </button>
                    </div>
                  </div>
                  <button type="submit" className="site-btn" style={{ marginTop: "10px" }}>Save Changes</button>
                </form>
              </div>
            )}

            {/* ACTIVE SESSIONS / DEVICES */}
            {activeTab === "devices" && (
              <div className="tab-content">
                <h3 className="tab-heading">Active Sessions</h3>
                <p className="tab-sub">Manage the devices logged into your ShopNow account</p>

                {devices.length === 0 ? (
                  <p className="empty-msg">No active sessions found. 💻</p>
                ) : (
                  <div className="devices-list">
                    {(() => {
                      const currentToken = getSessionToken();
                      return devices.map((device) => {
                        const isCurrent = (currentToken && device.deviceUserToken === currentToken) || isDeviceMatch(device);
                        return (
                          <div key={device._id} className={`device-card ${isCurrent ? "current-device" : ""}`}>
                            <div className="device-icon">
                              <i className={`fa ${getDeviceIcon(device.platform)}`}></i>
                            </div>
                            <div className="device-info">
                              <div className="device-header">
                                <span className="device-name">
                                  {device.platform || "Unknown Device"} ({device.architecture || "unknown"})
                                </span>
                                {isCurrent && <span className="current-badge">This Device</span>}
                              </div>
                              <div className="device-details">
                                <p><span>Timezone:</span> {device.timezone || "N/A"}</p>
                                <p><span>Screen Resolution:</span> {device.screenResolution || "N/A"}</p>
                                <p><span>Hardware:</span> {device.hardwareConcurrency ? `${device.hardwareConcurrency} Cores` : "N/A"} / {device.deviceMemory ? `${device.deviceMemory} GB RAM` : "N/A"}</p>
                                <p className="device-date">
                                  Logged in on: {new Date(device.createAt).toLocaleString("en-US", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="device-actions">
                              <button
                                className={`site-btn ${isCurrent ? "btn-logout" : "btn-remove"}`}
                                onClick={() => handleRemoveDevice(device._id, isCurrent)}
                              >
                                {isCurrent ? "Log Out" : "Remove Device"}
                              </button>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Inline Update Order Editor Modal */}
      {editingOrder && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "15px"
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "6px",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 5px 25px rgba(0,0,0,0.15)"
            }}
          >
            <h4 style={{ fontWeight: "700", marginBottom: "10px" }}>Update Order Items</h4>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "25px" }}>Order: #{editingOrder._id}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "30px" }}>
              {editingOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    gap: "15px",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "15px",
                    alignItems: "center"
                  }}
                >
                  <img
                    src={item.image.startsWith("http") ? item.image : `http://localhost:5173${item.image.startsWith("/") ? "" : "/"}${item.image}`}
                    alt={item.title}
                    width="60"
                    style={{ borderRadius: "4px", objectFit: "cover" }}
                  />
                  <div style={{ flex: 1 }}>
                    <h6 style={{ fontWeight: "700", margin: "0 0 8px 0" }}>{item.title}</h6>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      {/* Size selection */}
                      <div>
                        <label style={{ fontSize: "12px", display: "block", marginBottom: "4px" }}>Size</label>
                        <select
                          value={item.size}
                          onChange={(e) => handleEditItemField(idx, "size", e.target.value)}
                          style={{ height: "30px", border: "1px solid #e1e1e1", fontSize: "13px", padding: "0 5px" }}
                        >
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                          <option value="OS">OS</option>
                        </select>
                      </div>

                      {/* Color selection */}
                      <div>
                        <label style={{ fontSize: "12px", display: "block", marginBottom: "4px" }}>Color</label>
                        <select
                          value={item.color}
                          onChange={(e) => handleEditItemField(idx, "color", e.target.value)}
                          style={{ height: "30px", border: "1px solid #e1e1e1", fontSize: "13px", padding: "0 5px" }}
                        >
                          <option value="#111111">Black</option>
                          <option value="#ffffff">White</option>
                          <option value="#a8a8a8">Grey</option>
                          <option value="#2d4c7a">Blue</option>
                          <option value="#4a3319">Brown</option>
                        </select>
                      </div>

                      {/* Quantity selection */}
                      <div>
                        <label style={{ fontSize: "12px", display: "block", marginBottom: "4px" }}>Qty</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleEditItemField(idx, "quantity", parseInt(e.target.value) || 1)}
                          style={{ width: "60px", height: "30px", border: "1px solid #e1e1e1", textAlign: "center", fontSize: "13px" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                className="site-btn"
                style={{ backgroundColor: "#666", padding: "10px 20px" }}
                onClick={() => setEditingOrder(null)}
              >
                Cancel
              </button>
              <button
                className="site-btn"
                style={{ padding: "10px 20px" }}
                onClick={handleSaveUpdatedOrder}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
