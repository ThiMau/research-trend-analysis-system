import "../components/Login.css";
import { useState } from "react";
function Login() {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="login-page">

            <div className="header">
                <h1>TrendTrack</h1>
                <p>Academic Insights & Publication Analytics</p>
            </div>

            <div className="login-card">

                <h2>Log In</h2>

                <div className="input-group">
                    <label>Name</label>
                    <div className="input-box">
                        <i className="fa-regular fa-user input-icon"></i>
                        <input
                            type="text"
                            placeholder="Name"
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
                    <a href="#"><b>Forgot Password ?</b></a>
                </div>

                <button className="signin-btn">
                    SIGN IN
                </button>

                <div className="signup">
                    Don't have an account? <a href="#"><b>Sign Up</b></a>
                </div>

            </div>

        </div>
    );
}

export default Login;