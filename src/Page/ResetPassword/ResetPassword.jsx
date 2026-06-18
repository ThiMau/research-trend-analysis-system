import "./ResetPassword.css";

function ForgetPassword() {
    return (
        <div className="reset-page">
            <div className="reset-card">
                <div className="reset-card-brand">
                    <span className="brand-name">TrendTrack</span>
                </div>

                <h1>Reset Password</h1>
                <p className="reset-copy">
                    Enter your email address and we'll send you a mail to reset your password.
                </p>

                <form className="reset-form">
                    <label htmlFor="email">EMAIL ADDRESS</label>
                    <div className="input-group">
                        <input
                            type="email"
                            id="email"
                            placeholder="name@gmail.com"
                        />
                    </div>

                    <button type="submit">SEND</button>
                </form>

                <div className="reset-link">
                    <a href="/">← Return to <span className="signin-text">Sign in</span></a>
                </div>
            </div>

        </div>
    );
}

export default ForgetPassword;
