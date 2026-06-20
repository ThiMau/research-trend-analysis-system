import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../Services/authService";
import "./OTPVerification.css";


function OTPVerification() {


    const navigate = useNavigate();


    const email = sessionStorage.getItem(
        "resetEmail"
    );


    const [otp, setOtp] = useState(
        [
            "",
            "",
            "",
            "",
            "",
            ""
        ]
    );


    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");

    const [timer, setTimer] = useState(57);


    const inputRefs = useRef([]);




    // countdown resend OTP
    useEffect(()=>{


        if(timer <= 0)
            return;



        const interval = setInterval(()=>{


            setTimer(
                prev => prev - 1
            );


        },1000);



        return ()=>clearInterval(interval);



    },[timer]);






    const handleChange = (value,index)=>{


        if(!/^[0-9]*$/.test(value))
            return;



        const newOTP = [...otp];


        newOTP[index] = value;


        setOtp(newOTP);



        if(
            value &&
            index < 5
        ){

            inputRefs.current[index+1].focus();

        }


    };






    const handleKeyDown = (e,index)=>{


        if(
            e.key === "Backspace" &&
            !otp[index] &&
            index > 0
        ){

            inputRefs.current[index-1].focus();

        }


    };







    const handleVerify = async()=>{


        const otpCode = otp.join("");



        if(otpCode.length !== 6){


            setMessage(
                "Please enter 6 digit OTP"
            );


            return;

        }




        try{


            setLoading(true);

            setMessage("");



            await authService.verifyOTP({

                email:email,

                otp:otpCode

            });




            navigate(
                "/reset-password"
            );



        }
        catch(error){


            setMessage(

                error.response?.data?.message
                ||
                "Invalid OTP"

            );


        }
        finally{


            setLoading(false);


        }


    };







    const resendOTP = async()=>{


        if(timer > 0)
            return;



        try{


            setLoading(true);



            await authService.forgotPassword(
                email
            );



            setTimer(57);



            setMessage(
                "OTP has been resent"
            );



        }
        catch(error){


            setMessage(
                "Cannot resend OTP"
            );


        }
        finally{


            setLoading(false);


        }


    };








    return (

        <div className="otp-page">


            <div className="otp-brand">


                <div className="brand-icon">
                    ▣
                </div>


                <h2>
                    TrendTrack
                </h2>


                <span>
                    ACADEMIC INSIGHTS PLATFORM
                </span>


            </div>





            <div className="otp-card">



                <h1>
                    Verify Email
                </h1>



                <p className="otp-description">

                    We've sent a 6-digit code to your email.
                    Please enter it below to verify your account.

                </p>





                <div className="otp-input-container">


                    {
                        otp.map(
                            (item,index)=>(

                                <input

                                    key={index}

                                    ref={
                                        el =>
                                        inputRefs.current[index]=el
                                    }

                                    type="text"

                                    maxLength="1"

                                    value={item}

                                    onChange={
                                        e =>
                                        handleChange(
                                            e.target.value,
                                            index
                                        )
                                    }


                                    onKeyDown={
                                        e =>
                                        handleKeyDown(
                                            e,
                                            index
                                        )
                                    }


                                />

                            )
                        )
                    }



                </div>






                <button

                    className="verify-btn"

                    onClick={handleVerify}

                    disabled={loading}

                >

                    {
                        loading
                        ?
                        "VERIFYING..."
                        :
                        "VERIFY"
                    }


                </button>







                <div className="divider"></div>






                <p className="resend-text">

                    Didn't receive a code?


                </p>





                <button

                    className="resend-btn"

                    onClick={resendOTP}

                    disabled={timer > 0}

                >


                    {
                        timer > 0
                        ?
                        `Resend code in 0:${timer}`
                        :
                        "Resend code"
                    }


                </button>






                <p className="back-login"

                    onClick={()=>
                        navigate("/")
                    }

                >

                    ← Back to Login


                </p>







                {
                    message &&

                    <p className="message">

                        {message}

                    </p>
                }






            </div>


        </div>


    );


}


export default OTPVerification;