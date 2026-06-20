import "./ChangePassword.css";


export default function ChangePassword(){


    return (

        <div className="change-password-page">


            <div className="change-password-card">


                <h2>
                    Change Password
                </h2>



                <div className="form-group">


                    <label>
                        Current Password
                    </label>


                    <input
                        type="password"
                        placeholder="Enter current password"
                    />


                </div>




                <div className="form-group">


                    <label>
                        New Password
                    </label>


                    <input
                        type="password"
                        placeholder="Enter new password"
                    />


                </div>





                <div className="form-group">


                    <label>
                        Confirm Password
                    </label>


                    <input
                        type="password"
                        placeholder="Confirm new password"
                    />


                </div>





                <button className="change-btn">

                    Change Password

                </button>



            </div>



        </div>


    );


}