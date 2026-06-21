import "./Login.css";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authService from "../../Services/authService";

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const redirectMessage =
      location.state?.message ||
      new URLSearchParams(location.search).get("message") || "";

    const pageMessage = error || redirectMessage;

    const handleLogin = async () => {
        setError("");
        setLoading(true);

        try {
            const data = await authService.login({
                email: email.trim(),
                password: password.trim()
            });

            if (data.code === 1000 && data.result?.token) {
                navigate("/dashboard");
            } else {
                setError(
                    data.message || "Email or password is wrong!"
                );
            }

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Email or password is wrong!"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="header">
                <h1>TrendTrack</h1>
                <p>Academic Insights & Publication Analytics</p>
            </div>

            <div className="login-card">
                <h2>Log In</h2>

                <div className="input-group">
                    <label>Email</label>

                    <div className="input-box">
                        <i className="fa-regular fa-envelope input-icon"></i>

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label>Password</label>

                    <div className="input-box">
                        <i className="fa-solid fa-lock input-icon"></i>

                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <i
                            className={`eye-icon ${
                                showPassword
                                    ? "fa-regular fa-eye-slash"
                                    : "fa-regular fa-eye"
                            }`}
                            onClick={() => setShowPassword(!showPassword)}
                        ></i>
                    </div>
                </div>

                <div className="forgot">
                    <Link to="/forget-password">
                        <b>Forgot Password ?</b>
                    </Link>
                </div>

                {pageMessage && (
                    <div className="error-message">
                        {pageMessage}
                    </div>
                )}

                <button
                    className="signin-btn"
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? "Signing in..." : "SIGN IN"}
                </button>

                <div className="signup">
                    Don't have an account?{" "}
                    <Link to="/register">
                        <b>Sign Up</b>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;