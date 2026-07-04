import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { setUser } from "../../api/postApiHandler/pstData";
import "./setup.css";

export default function Login({ setIsUserLoged }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Signing you in...");

    try {
      const res = await setUser({ email, password });
      if (res.flag == false) {
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);
      localStorage.setItem("ShopNowUserData", JSON.stringify({ email: email, token: res.data.token, loginDate: Date.now(), expiresDate: Date.now() + (7 * 24 * 60 * 60 * 1000) }));
      setIsUserLoged(true);
      navigate("/");
    } catch {
      toast.error("Network error. Please try again.", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h3>Sign In</h3>
        <p style={{ marginBottom: "20px" }}>Enter your credentials to access your user account</p>

        <form onSubmit={handleLoginSubmit} className="auth-form">
          <div className="auth-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="e.g. john.doe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-links">
            <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer", fontWeight: "400" }}>
              <input type="checkbox" style={{ cursor: "pointer" }} />
              Remember me
            </label>
            <Link to="/recover-password">Forgot Password?</Link>
          </div>

          <button type="submit" className="site-btn auth-btn" disabled={submitting}>
            {submitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          Don&apos;t have an account? <Link to="/signup">Create one</Link>
        </div>
      </div>
    </div>
  );
}