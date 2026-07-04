import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import "./setup.css";

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Registration Form States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // State Manager: 'register' | 'otp'
  const [step, setStep] = useState("register");

  // OTP Validation States
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // References for OTP input focus auto-shifting
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Step 1: Submit Registration -> Send Mock OTP
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Generate random 4-digit OTP
    const mockOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(mockOtp);
    setTimer(60);
    setCanResend(false);

    console.log("MOCK_OTP: " + mockOtp);

    // Simulate OTP email trigger
    alert(`[Shop Now Verification] A secure OTP has been sent to ${formData.email}.\n\nYour 4-Digit OTP is: ${mockOtp}`);
    
    // Switch state to OTP enter
    setStep("otp");
  };

  // Countdown timer effect for OTP expiration
  useEffect(() => {
    if (step !== "otp" || timer === 0) {
      if (timer === 0) setCanResend(true);
      return;
    }
    const countdown = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(countdown);
  }, [step, timer]);

  // Resend OTP
  const handleResendOtp = () => {
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    setOtpDigits(["", "", "", ""]);
    setTimer(60);
    setCanResend(false);
    console.log("MOCK_OTP: " + newOtp);
    alert(`[Shop Now Verification] New OTP sent!\n\nYour 4-Digit OTP is: ${newOtp}`);
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  };

  // OTP inputs keyboard shifting
  const handleOtpDigitChange = (index, value) => {
    // Only accept numbers
    if (value && isNaN(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1); // Only keep last digit
    setOtpDigits(newDigits);

    // Auto-focus next input
    if (value && index < 3 && inputRefs[index + 1].current) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Shifting focus back on Backspace
    if (e.key === "Backspace" && !otpDigits[index] && index > 0 && inputRefs[index - 1].current) {
      inputRefs[index - 1].current.focus();
    }
  };

  // Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join("");
    if (enteredOtp.length < 4) {
      alert("Please enter the full 4-digit verification code.");
      return;
    }

    if (enteredOtp === generatedOtp) {
      alert("Email verified successfully! Your account is active.");
      navigate("/login");
    } else {
      alert("Invalid verification code. Please check the code and try again.");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h3>Create Account</h3>
        <p style={{ marginBottom: "20px" }}>
          {step === "register"
            ? "Sign up to start tracking orders and customizing sizes"
            : `Please enter the verification code sent to ${formData.email}`}
        </p>

        {step === "register" ? (
          // STEP 1 FORM: Registration Input Fields
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <div className="auth-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="auth-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="e.g. john.doe@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="auth-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="auth-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="site-btn auth-btn">
              Register
            </button>
          </form>
        ) : (
          // STEP 2 FORM: OTP Verification Box
          <form onSubmit={handleVerifyOtp} className="auth-form">
            <div className="otp-grid">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={inputRefs[idx]}
                  type="text"
                  maxLength="1"
                  className="otp-input"
                  value={digit}
                  onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  autoFocus={idx === 0}
                  required
                />
              ))}
            </div>

            {timer > 0 ? (
              <div className="otp-timer">OTP expires in {timer}s</div>
            ) : (
              <div className="otp-timer" style={{ color: "#888" }}>OTP has expired.</div>
            )}

            <button type="submit" className="site-btn auth-btn">
              Verify OTP
            </button>

            <div className="otp-resend">
              Didn't receive the code?
              <button
                type="button"
                disabled={!canResend}
                onClick={handleResendOtp}
              >
                Resend Code
              </button>
            </div>
          </form>
        )}

        <div className="auth-footer" style={{ marginTop: "20px" }}>
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}