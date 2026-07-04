import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import "./setup.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Inputs
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // States manager: 'request' | 'reset'
  const [step, setStep] = useState("request");

  // OTP Validation States
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // References for OTP auto-focus shifting
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Step 1: Submit Reset request -> Send Mock OTP
  const handleRequestSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    // Generate random 4-digit OTP
    const mockOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(mockOtp);
    setTimer(60);
    setCanResend(false);

    console.log("MOCK_OTP: " + mockOtp);

    // Simulate OTP alert
    alert(`[Shop Now Recovery] Verification code sent to: ${email}.\n\nYour 4-Digit OTP is: ${mockOtp}`);

    // Swap state
    setStep("reset");
  };

  // Timer countdown
  useEffect(() => {
    if (step !== "reset" || timer === 0) {
      if (timer === 0) setCanResend(true);
      return;
    }
    const countdown = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(countdown);
  }, [step, timer]);

  // Resend OTP Code
  const handleResendOtp = () => {
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    setOtpDigits(["", "", "", ""]);
    setTimer(60);
    setCanResend(false);
    console.log("MOCK_OTP: " + newOtp);
    alert(`[Shop Now Recovery] New Verification code sent!\n\nYour 4-Digit OTP is: ${newOtp}`);
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  };

  // OTP inputs auto-shift
  const handleOtpDigitChange = (index, value) => {
    if (value && isNaN(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    if (value && index < 3 && inputRefs[index + 1].current) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0 && inputRefs[index - 1].current) {
      inputRefs[index - 1].current.focus();
    }
  };

  // Verify Code and Save New Password
  const handleResetSubmit = (e) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join("");

    if (enteredOtp.length < 4) {
      alert("Please enter the full 4-digit verification code.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (enteredOtp !== generatedOtp) {
      alert("Invalid verification code. Please check the code and try again.");
      return;
    }

    alert("Password updated successfully! Please log in with your new credentials.");
    navigate("/login");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h3>Reset Password</h3>
        <p style={{ marginBottom: "20px" }}>
          {step === "request"
            ? "Enter your email address and we'll send you an OTP to recover your password"
            : `Enter the code and set your new password`}
        </p>

        {step === "request" ? (
          // STEP 1 FORM: Enter Email address
          <form onSubmit={handleRequestSubmit} className="auth-form">
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

            <button type="submit" className="site-btn auth-btn">
              Send OTP
            </button>
          </form>
        ) : (
          // STEP 2 FORM: OTP Code entry + New Password setting
          <form onSubmit={handleResetSubmit} className="auth-form">
            <div className="auth-group">
              <label style={{ display: "block", marginBottom: "8px" }}>Verification Code</label>
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
                <div className="otp-timer">Code expires in {timer}s</div>
              ) : (
                <div className="otp-timer" style={{ color: "#888" }}>Code has expired.</div>
              )}
            </div>

            <div className="auth-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="auth-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="site-btn auth-btn">
              Reset Password
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
          Back to <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}