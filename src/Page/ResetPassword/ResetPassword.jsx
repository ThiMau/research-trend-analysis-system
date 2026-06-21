import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ResetPassword.css";
import authService from "../../Services/authService";


function ResetPassword() {

    const navigate = useNavigate();
    const location = useLocation();

    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);


    const token = new URLSearchParams(
        location.search
    ).get("token");



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



        if(!token){

            setMessage(
                "Invalid reset token"
            );

            return;

        }



        try{

            setLoading(true);


            await authService.resetPassword({

                token: token,

                newPassword: password

            });



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

                    Back to Authentication Portal

                </span>



            </div>


        </div>

    );

}


export default ResetPassword;