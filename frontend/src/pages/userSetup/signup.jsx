
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getDeviceInfo } from "../../utils/getDeviceData";

import Loader from "../../components/Loader";
import { sendOtp, createUser } from "../../api/postApiHandler/pstData";

import "./setup.css";

export default function Signup({ setIsUserLoged }) {
  const navigate = useNavigate();

  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState("register");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPageLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (step !== "otp") return;

    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [step, timer]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      return toast.error("Name is required");
    }

    if (!formData.email.trim()) {
      return toast.error("Email is required");
    }

    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);
      const res = await sendOtp({
        email: formData.email,
        tag: "signup",
      });

      if (res.flag === false) {
        toast.error(res.message || (res.data && res.data.message) || "Failed to send OTP.");
        return;
      }

      toast.success(res.message || (res.data && res.data.message) || "OTP sent successfully.");

      setStep("otp");
      setOtp("");
      setTimer(60);
      setCanResend(false);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (otp.length !== 4) {
      return toast.error("Enter a valid 4-digit OTP");
    }
    if (!formData.name) {
      return toast.error("Name is required");
    }
    if (!formData.email.trim()) {
      return toast.error("Email is required");
    }
    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);
      const deviceRes = await getDeviceInfo();
      const res = await createUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        otp,
        deviceRes: deviceRes.data
      });
      if (res.flag === false) {
        toast.error(res.message || (res.data && res.data.message) || "Registration failed.");
        return;
      }

      toast.success(res.message || (res.data && res.data.message) || "Registration successful!");
      localStorage.setItem("ShopNowUserData", JSON.stringify({ name: formData.name, email: formData.email, token: res.data.token, loginDate: Date.now(), expiresDate: Date.now() + (7 * 24 * 60 * 60 * 1000) }));
      localStorage.setItem("ShopNowUserToken", res.data.token);
      setIsUserLoged(true);
      navigate("/");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);

      const res = await sendOtp({
        email: formData.email,
        tag: "signup",
      });

      if (!res.flag) {
        toast.error(res.message || (res.data && res.data.message) || "Unable to resend OTP");
        return;
      }

      toast.success("OTP resent successfully");

      setOtp("");
      setTimer(60);
      setCanResend(false);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <Loader />;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h3>Create Account</h3>

        <p style={{ marginBottom: "20px" }}>
          {step === "register"
            ? "Create your account to continue shopping."
            : `Enter the OTP sent to ${formData.email}`}
        </p>

        {step === "register" ? (
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="auth-group">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-group">
              <label>Confirm Password</label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="********"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button
              className="site-btn auth-btn"
              disabled={loading}
              type="submit"
            >
              {loading ? "Sending OTP..." : "Register"}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleVerify}>
            <div className="auth-group">
              <label>Enter OTP</label>

              <input
                type="text"
                placeholder="Enter 4 digit OTP"
                value={otp}
                maxLength={4}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, ""))
                }
                required
              />
            </div>

            {timer > 0 ? (
              <p style={{ marginBottom: "15px" }}>
                OTP expires in {timer}s
              </p>
            ) : (
              <p style={{ marginBottom: "15px", color: "red" }}>
                OTP Expired
              </p>
            )}

            <button
              className="site-btn auth-btn"
              disabled={loading}
              type="submit"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="otp-resend" style={{ marginTop: "20px" }}>
              Didn't receive the code?{" "}

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend || loading}
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}

        <div className="auth-footer" style={{ marginTop: "20px" }}>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
