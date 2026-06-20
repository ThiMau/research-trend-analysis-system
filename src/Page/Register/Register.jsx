import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

import authService from "../../Services/authService";


function Register() {


  const navigate = useNavigate();


  const [formData, setFormData] = useState({

    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""

  });


  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);


  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);



  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });

  };




  const handleSubmit = async (e) => {

    e.preventDefault();



    if (formData.password !== formData.confirmPassword) {

      setMessage(
        "Password confirmation does not match"
      );

      return;

    }



    try {


      setLoading(true);



      const response = await authService.register({

        fullName: formData.fullName,

        email: formData.email,

        password: formData.password

      });



      console.log(response.data);



      setMessage(
        "Register successful! Check your email OTP"
      );



      sessionStorage.setItem(
        "email",
        formData.email
      );



      setTimeout(() => {


        navigate("/verify-email");


      }, 1000);



    }
    catch (error) {


      setMessage(

        error.response?.data?.message ||

        "Register failed"

      );


    }
    finally {


      setLoading(false);


    }



  };





  return (

    <div className="register-container">


      <form
        className="register-form"
        onSubmit={handleSubmit}
      >


        <h2>
          Register
        </h2>



        <input

          type="text"

          name="fullName"

          placeholder="Full Name"

          value={formData.fullName}

          onChange={handleChange}

          required

        />





        <input

          type="email"

          name="email"

          placeholder="Email"

          value={formData.email}

          onChange={handleChange}

          required

        />





        <div className="password-wrapper">


          <input

            type={
              showPassword ? "text" : "password"
            }

            name="password"

            placeholder="Password"

            value={formData.password}

            onChange={handleChange}

            required

          />


          <i

            className={
              showPassword
                ?
                "fa-regular fa-eye-slash eye-icon"
                :
                "fa-regular fa-eye eye-icon"
            }

            onClick={() => setShowPassword(!showPassword)}

          ></i>


        </div>






        <div className="password-wrapper">


          <input

            type={
              showConfirmPassword
                ?
                "text"
                :
                "password"
            }

            name="confirmPassword"

            placeholder="Confirm Password"

            value={formData.confirmPassword}

            onChange={handleChange}

            required

          />


          <i

            className={
              showConfirmPassword
                ?
                "fa-regular fa-eye-slash eye-icon"
                :
                "fa-regular fa-eye eye-icon"
            }


            onClick={() => setShowConfirmPassword(!showConfirmPassword)}

          ></i>



        </div>





        <button
          disabled={loading}
        >


          {
            loading
              ?
              "Creating..."
              :
              "Create Account"
          }



        </button>




        <div className="login-link">


          Already have account?


          {" "}


          <Link to="/">

            Return Log in

          </Link>


        </div>




        {
          message &&
          <p>
            {message}
          </p>
        }



      </form>


    </div>

  );


}


export default Register;