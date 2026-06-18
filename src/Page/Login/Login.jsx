import "./Login.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:8080/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json().catch(() => ({}));

            if (response.ok && data && data.result && data.result.token) {
                localStorage.setItem("token", data.result.token);
                // navigate to Dashboard
                navigate("/dashboard");
            } else {
                // show error message requested by user
                setError("Email or password is wrong try again!");
            }
        } catch (e) {
            setError("Email or password is wrong try again!");
        } finally {
            setLoading(false);
        }
    }

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
                            className={`eye-icon ${showPassword
                                ? "fa-regular fa-eye-slash"
                                : "fa-regular fa-eye"
                                }`}
                            onClick={() => setShowPassword(!showPassword)}
                        ></i>
                    </div>
                </div>

                <div className="forgot">
                    <Link to="/reset-password">
                        <b>Forgot Password ?</b>
                    </Link>
                </div>

                {error && <div className="error-message">{error}</div>}

                <button
                    className="signin-btn"
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? 'Signing in...' : 'SIGN IN'}
                </button>

                <div className="signup">
                    Don't have an account? <a href="#"><b>Sign Up</b></a>
                </div>

            </div>

        </div>
    );
}

export default Login;