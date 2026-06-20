import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register() {

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Password confirmation does not match");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "api/auth/register",
        {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }
      );

      setMessage("Create new account successful!");

      console.log(response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        error.message ||
        "Failed to create account"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">

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

        {/* PASSWORD */}
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
            className={`eye-icon ${showPassword ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"
              }`}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
        </div>

        {/* CONFIRM PASSWORD */}
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
            className={`eye-icon ${showConfirmPassword ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"
              }`}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          ></i>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

        <div className="login-link">
          Already have account?{" "}
          <Link to="/">
            Return Log in
          </Link>
        </div>

        {message && <p>{message}</p>}

      </form>
    </div>
  );
}

export default Register;