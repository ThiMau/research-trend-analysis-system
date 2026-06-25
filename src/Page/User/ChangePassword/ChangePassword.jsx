import { useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../../Services/userService";
import "./ChangePassword.css";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New password and confirmation do not match.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await userService.changePassword(
        {
          oldPassword: currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      const success =
        response?.code === 1000 ||
        response?.success === true ||
        response?.status === "success";

      if (success) {
        setMessage("Password changed successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1200);
      } else {
        setMessage(response?.message || "Password change failed.");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Password change failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-page">
      <div className="change-password-card">
        <h2>Change Password</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {message && <p className="error-message">{message}</p>}

          <button className="change-btn" type="submit" disabled={loading}>
            {loading ? "Processing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
