import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./OTPVerification.css";


function OTPVerification() {


    const navigate = useNavigate();


    const email = sessionStorage.getItem(
        "resetEmail"
    );


    const [otp, setOtp] = useState("");

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");



    const handleVerify = async () => {


        try {


            setLoading(true);


            const res = await axios.post(
                "/api/auth/verify-otp",
                {
                    email: email,
                    otp: otp
                }
            );


            console.log(res.data);



            // sau này chuyển sang reset password
            navigate("/reset-password");



        } catch (error) {


            setMessage(
                error.response?.data?.message ||
                "Invalid OTP"
            );


        } finally {

            setLoading(false);

        }


    }



    const retryOTP = async () => {


        try {


            setLoading(true);


            await axios.post(
                "/api/auth/forgot-password",
                {
                    email: email
                }
            );


            setMessage(
                "OTP has been resent"
            );


        } catch (error) {

            setMessage(
                "Cannot resend OTP"
            );

        } finally {

            setLoading(false);

        }


    }



    return (

        <div className="otp-page">


            <div className="otp-card">


                <h1>
                    Enter OTP
                </h1>



                <p>
                    Enter the code sent to
                    <br />
                    <b>{email}</b>
                </p>



                <input

                    type="text"

                    placeholder="Enter OTP"

                    value={otp}

                    onChange={
                        e => setOtp(e.target.value)
                    }

                />



                <button
                    onClick={handleVerify}
                    disabled={loading}
                >

                    ENTER

                </button>




                <button
                    onClick={retryOTP}
                >

                    RETRY

                </button>




                <p className="change-email">

                    Want to change email ?

                    <span
                        onClick={() =>
                            navigate("/forgot-password")
                        }
                    >

                        Click here

                    </span>

                </p>



                {
                    message &&
                    <p>
                        {message}
                    </p>
                }



            </div>


        </div>

    )


}


export default OTPVerification;