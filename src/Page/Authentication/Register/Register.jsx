import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import authService from "../../../Services/authService";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Password confirmation does not match");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setMessageType("");

      const response = await authService.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });

      const data = response?.data || response;
      console.log("Register response:", data);

      if (data?.code && data.code !== 1000) {
        setMessage(data.message || "Register failed");
        setMessageType("error");
        return;
      }

      setMessage("Register successful! Check your email OTP");
      setMessageType("success");
      sessionStorage.setItem("email", formData.email);
      sessionStorage.setItem("otpFlow", "registration");

      setTimeout(() => {
        navigate("/verify-email");
      }, 1000);
    } catch (error) {
      console.error("Register error:", error);
      console.error("Error response:", error?.response);
      console.error("Error message:", error?.message);
      console.error("Error code:", error?.code);
      
      setMessage(
        error.response?.data?.message ||
        error.message ||
        "Register failed"
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-grid">
        <div className="register-left">
          <div>
            <div className="register-brand">
              <h1>TrendTrack</h1>
              <p>Advancing academic discovery through precision analytics.</p>
            </div>
            <div className="register-copy">
              <p>
                Join a global network of Premium users and users leveraging
                real-time publication trends and citation metrics.
              </p>
            </div>
          </div>
          <div className="register-image">
            <img src="src/Picture/RegisterImage.jpg"
              alt="Register"></img>
          </div>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Register</h2>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <i
              className={
                showPassword
                  ? "fa-regular fa-eye-slash eye-icon"
                  : "fa-regular fa-eye eye-icon"
              }
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>
          <p className="password-note">
            Minimum of 8 characters, including 1 special character and 1 uppercase letter.
          </p>

          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <i
              className={
                showConfirmPassword
                  ? "fa-regular fa-eye-slash eye-icon"
                  : "fa-regular fa-eye eye-icon"
              }
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            ></i>
          </div>

          <button disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>

          <div className="login-link">
            Already have account? <Link to="/">Return Log in</Link>
          </div>

          {message && (
            <p className={`register-message ${messageType}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Register;
