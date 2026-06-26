import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../../../Services/authService";
import "./OTPVerification.css";

function OTPVerification() {
  const navigate = useNavigate();

  const email = sessionStorage.getItem("email") || sessionStorage.getItem("resetEmail");
  const otpFlow = sessionStorage.getItem("otpFlow") || "forgot-password";

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(300); // 5 minutes
  const [verified, setVerified] = useState(false);

  const inputRefs = useRef([]);

  const timerMinutes = Math.floor(timer / 60);
  const timerSeconds = timer % 60;

  const handlePaste = (e, index) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!paste) return;

    const chars = paste.slice(0, 6 - index).split("");
    const newOTP = [...otp];
    chars.forEach((ch, i) => {
      newOTP[index + i] = ch;
    });

    setOtp(newOTP);
    const focusIndex = Math.min(5, index + chars.length - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  // If email is not present, redirect back
  useEffect(() => {
    if (!email) {
      navigate(otpFlow === "registration" ? "/register" : "/forget-password");
    }
  }, [email, navigate, otpFlow]);

  // Countdown resend OTP
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e, index) => {
    const raw = (e.target.value || "").replace(/\D/g, "");
    if (!raw) {
      const newOTP = [...otp];
      newOTP[index] = "";
      setOtp(newOTP);
      return;
    }

    // If multiple digits entered (fast typing or mobile), spread them
    const chars = raw.split("");
    const newOTP = [...otp];

    for (let i = 0; i < chars.length && index + i < 6; i++) {
      newOTP[index + i] = chars[i];
    }

    setOtp(newOTP);

    // move focus to the next empty or last filled
    const lastFilled = Math.min(5, index + chars.length - 1);
    const nextIndex = Math.min(5, lastFilled + 1);
    // delay to ensure DOM updates
    setTimeout(() => {
      inputRefs.current[nextIndex]?.focus();
      inputRefs.current[nextIndex]?.select?.();
    }, 0);
  };

  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setMessage(
        "Please enter 6 digit OTP"
      );
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      if (otpFlow === "registration") {
        const response =
          await authService.verifyEmail({
            email,
            otp: otpCode,
          });

        const data = response?.data || response;

        if (data?.code && data.code !== 1000) {
          setMessage(data.message || "Invalid OTP");
          return;
        }

        setMessage("Email verified successfully!");
        setVerified(true);
        return;
      }

      sessionStorage.setItem("resetOtp", otpCode);
      navigate("/reset-password");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (timer > 0) return;

    try {
      setLoading(true);

      // Both registration and forgot-password use the same endpoint to resend OTP
      await authService.forgotPassword({
        email,
      });

      setTimer(300);

      setMessage(
        "OTP has been resent"
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Cannot resend OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-page">
      <div className="otp-brand">
        <div className="brand-icon">
          ▣
        </div>

        <h2>TrendTrack</h2>

        <span>
          ACADEMIC INSIGHTS PLATFORM
        </span>
      </div>

      <div className="otp-card">
        <h1>Verify Email</h1>

        {verified ? (
          <>
            <p className="otp-description" style={{ color: "#22c55e", marginBottom: "30px" }}>
              ✓ {otpFlow === "registration" 
                ? "Account created successfully! You will be redirected to login..."
                : "Email verified! You will be redirected to reset password..."}
            </p>
            {otpFlow === "registration" && (
              <Link
                className="back-login"
                to="/"
                onClick={() => {
                  sessionStorage.removeItem("email");
                  sessionStorage.removeItem("otpFlow");
                }}
                style={{ marginTop: "20px", display: "inline-block" }}
              >
                ← Back to Login
              </Link>
            )}
          </>
        ) : (
          <>
            <p className="otp-description">
              We've sent a 6-digit code
              to your email. Please
              enter it below to verify
              your account.
            </p>

            <div className="otp-input-container">
              {otp.map(
                (item, index) => (
                  <input
                    key={index}
                    ref={(el) =>
                      (inputRefs.current[
                        index
                      ] = el)
                    }
                    type="text"
                    maxLength="1"
                    value={item}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onFocus={() => inputRefs.current[index]?.select()}
                    onPaste={(e) => handlePaste(e, index)}
                  />
                )
              )}
            </div>

            <button
              className="verify-btn"
              onClick={handleVerify}
              disabled={loading}
            >
              {loading
                ? "VERIFYING..."
                : "VERIFY"}
            </button>

            <div className="divider"></div>

            <p className="resend-text">
              Didn't receive a code?
            </p>

            <button
              className="resend-btn"
              onClick={resendOTP}
              disabled={timer > 0}
            >
              {timer > 0
                ? `Resend code in ${timerMinutes}:${String(
                    timerSeconds
                  ).padStart(2, "0")}`
                : "Resend code"}
            </button>

            <Link
              className="back-login"
              to={otpFlow === "registration" ? "/register" : "/"}
              onClick={() => {
                if (otpFlow === "registration") return;
                // if navigating to login, clear any temporary resetEmail
                sessionStorage.removeItem("resetEmail");
              }}
            >
              ← Back {otpFlow === "registration" ? "to Register" : "to Login"}
            </Link>
          </>
        )}

        {message && (
          <p className={`message ${verified ? "success" : ""}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default OTPVerification;

