import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";
import authService from "../../Services/authService";


function ResetPassword() {

    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const otp = sessionStorage.getItem("resetOtp");

    useEffect(() => {
      if (!otp) {
        navigate("/forget-password");
      }
    }, [otp, navigate]);



    const passwordRules = {

        length: password.length >= 8,

        special: /[!@#$%^&*]/.test(password),

        number: /\d/.test(password),

        uppercase: /[A-Z]/.test(password)

    };



    const handleSubmit = async (e)=>{

        e.preventDefault();

        if(
            !passwordRules.length ||
            !passwordRules.special ||
            !passwordRules.number ||
            !passwordRules.uppercase
        ){
            setMessage(
                "Password does not meet requirements"
            );
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        if(!otp){
            setMessage(
                "Invalid or missing OTP. Please request a new code."
            );
            return;
        }

        try{
            setLoading(true);

            await authService.resetPassword({
                otp,
                newPassword: password,
                confirmPassword: confirmPassword,
            });

            sessionStorage.removeItem("resetOtp");
            sessionStorage.removeItem("resetEmail");
            sessionStorage.removeItem("otpFlow");

            setMessage(
                "Password updated successfully"
            );

            setTimeout(()=>{
                navigate("/login");
            },1500);

        }catch(error){
            setMessage(
                error.response?.data?.message ||
                "Reset password failed"
            );
        }finally{
            setLoading(false);
        }
    };



    return (

        <div className="reset-page">


            <div className="reset-box">


                <h1>
                    Create New Password
                </h1>


                <p className="reset-description">

                    Your new password must be unique from those
                    <br/>
                    previously used with your account.

                </p>



                <form
                    onSubmit={handleSubmit}
                >


                    <label>
                        NEW PASSWORD
                    </label>



                    <div className="password-wrapper">


                        <input

                            type={
                                showPassword
                                ?
                                "text"
                                :
                                "password"
                            }

                            value={password}

                            onChange={
                                (e)=>
                                setPassword(
                                    e.target.value
                                )
                            }

                        />


                        <span

                            className="eye"

                            onClick={()=>
                                setShowPassword(
                                    !showPassword
                                )
                            }

                        >

                            👁

                        </span>


                    </div>




                    <label>
                        CONFIRM PASSWORD
                    </label>

                    <div className="password-wrapper">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                        />
                        <span
                            className="eye"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            👁
                        </span>
                    </div>

                    <div className="rules">


                        <p>
                            {passwordRules.length ? "✓" : ""}
                            Minimum 8 characters
                        </p>


                        <p>
                            {passwordRules.special ? "✓" : ""}
                            One special character (!@#$%^&*)
                        </p>


                        <p>
                            {passwordRules.number ? "✓" : ""}
                            At least one number
                        </p>


                        <p>
                            {passwordRules.uppercase ? "✓" : ""}
                            At least one uppercase letter
                        </p>


                    </div>




                    <button
                        disabled={loading}
                    >

                        {
                            loading
                            ?
                            "UPDATING..."
                            :
                            "UPDATE PASSWORD"
                        }


                    </button>



                </form>



                {
                    message &&

                    <p className="message">

                        {message}

                    </p>

                }




                <span

                    className="back-login"

                    onClick={()=>
                        navigate("/login")
                    }

                >

                    Back to Login

                </span>



            </div>


        </div>

    );

}


export default ResetPassword;