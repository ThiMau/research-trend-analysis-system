import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../../Services/authService";
import "./ForgetPassword.css";

function ForgetPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!email) {
            setMessage(
                "Please enter your email"
            );
            return;
        }

        try {
            setLoading(true);
            setMessage("");
            await authService.forgotPassword({ email: email.trim() });
            sessionStorage.setItem("resetEmail", email.trim());
            sessionStorage.setItem("otpFlow", "forgot-password");
            navigate("/verify-email");
        } catch (error) {

            setMessage(

                error.response?.data?.message
                ||
                "Failed to send email"

            );

        } finally {

            setLoading(false);
        }

    };



    return (
        <div className="reset-page">

            <div className="reset-card">

                <div className="reset-card-brand">

                    <span className="brand-name">
                        TrendTrack
                    </span>

                </div>

                <h1>
                    Reset Password
                </h1>

                <p className="reset-copy">
                    Enter your email address and we'll send you a mail to reset your password.
                </p>

                <form
                    className="reset-form"
                    onSubmit={handleSubmit}
                >

                    <label htmlFor="email">
                        EMAIL ADDRESS
                    </label>

                    <div className="input-group">

                        <input

                            id="email"
                            type="email"
                            placeholder="name@gmail.com"
                            value={email}
                            onChange={
                                (e) => setEmail(e.target.value)
                            }

                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {
                            loading
                                ? "SENDING..."
                                : "SEND"
                        }

                    </button>

                </form>

                {
                    message &&

                    <p className="message">
                        {message}
                    </p>
                }

                <div className="reset-link">

                    <a href="/">
                        ← Return to
                        <span className="signin-text">
                            Sign in
                        </span>
                    </a>

                </div>

            </div>

        </div>
    );


}


export default ForgetPassword;