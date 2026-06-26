import { useEffect, useState } from "react";
import ChangePassword from "../ChangePassword/ChangePassword";
import userService from "../../../Services/userService";
import "./Profile.css";


export default function Profile() {

  const [user, setUser] = useState({
    fullName: "",
    email: ""
  });


  useEffect(() => {

    const fetchUser = async () => {

      try {

        const data = await userService.getMe();

        setUser({
          fullName: data.fullName || "",
          email: data.email || ""
        });

      } catch (error) {

        console.error("Get user information failed:", error);

      }

    };


    fetchUser();

  }, []);


  return (
    <div className="profile-page">

      <div className="profile-card">

        <h2>
          Personal information
        </h2>

        <p>
          Update your personal details and how others see you.
        </p>


        <div className="profile-grid">

          <div className="profile-input-group">

            <label>
              Full name
            </label>

            <input
              value={user.fullName}
              readOnly
            />

          </div>


          <div className="profile-input-group">

            <label>
              Email address
            </label>

            <input
              value={user.email}
              readOnly
            />

          </div>

        </div>
      </div>
      <ChangePassword />
    </div>
  );
}