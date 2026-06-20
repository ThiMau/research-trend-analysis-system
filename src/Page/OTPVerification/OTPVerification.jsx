import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../Services/authService";
import "./OTPVerification.css";


function OTPVerification() {


    const navigate = useNavigate();


    const email = sessionStorage.getItem(
        "resetEmail"
    );


    const [otp, setOtp] = useState("");

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");



    // Verify OTP
    const handleVerify = async () => {


        if (!otp) {

            setMessage(
                "Please enter OTP"
            );

            return;

        }



        try {


            setLoading(true);

            setMessage("");



            await authService.verifyOTP({

                email: email,

                otp: otp

            });



            // chuyển sang trang reset password
            navigate("/reset-password");



        } catch (error) {


            setMessage(

                error.response?.data?.message
                ||
                "Invalid OTP"

            );


        } finally {


            setLoading(false);


        }


    };




    // Gửi lại OTP
    const retryOTP = async () => {


        try {


            setLoading(true);

            setMessage("");



            await authService.forgotPassword(
                email
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


    };





    return (

        <div className="otp-page">


            <div className="otp-card">



                <h1>
                    Enter OTP
                </h1>



                <p>
                    Enter the code sent to
                    <br />

                    <b>
                        {email}
                    </b>

                </p>




                <input


                    type="text"


                    placeholder="Enter OTP"


                    value={otp}


                    onChange={
                        (e) =>
                            setOtp(e.target.value)
                    }


                />




                <button

                    onClick={handleVerify}

                    disabled={loading}

                >

                    {
                        loading
                            ?
                            "VERIFYING..."
                            :
                            "ENTER"
                    }


                </button>





                <button

                    onClick={retryOTP}

                    disabled={loading}

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

    );


}


export default OTPVerification;