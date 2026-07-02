import "./Sidebar.css";
import {
  LayoutDashboard,
  Search,
  TrendingUp,
  Library,
  FileText,
  HelpCircle,
  Headset,
  LogOut,
  Users,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../../Services/authService";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const role = localStorage.getItem("role") || "USER";

  const handleLogout = () => {
    authService.logout();
    window.location.replace("/login");
  };

  const isActive = (path) => currentPath === path;

  return (
    <div className="sidebar">

      <div className="logo-section">
        <div className="logo-box">
          <TrendingUp size={18} />
        </div>

        <div>
          <h2>TrendTrack</h2>
          <span>{role}</span>
        </div>
      </div>

      <div className="menu">
        <div
          className={`menu-item ${isActive("/dashboard") ? "active" : ""}`}
          onClick={() => navigate("/dashboard")}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </div>

        <div
          className={`menu-item ${isActive("/search") ? "active" : ""}`}
          onClick={() => navigate("/search")}
        >
          <Search size={18} />
          <span>Search</span>
        </div>

        <div
          className={`menu-item ${isActive("/trend-analytic") ? "active" : ""}`}
          onClick={() => navigate("/trend-analytic")}
        >
          <TrendingUp size={18} />
          <span>Trend Analytics</span>
        </div>

        <div
          className={`menu-item ${isActive("/my-library") ? "active" : ""}`}
          onClick={() => navigate("/my-library")}
        >
          <Library size={18} />
          <span>My Library</span>
        </div>

        <div
          className={`menu-item ${isActive("/report") ? "active" : ""}`}
          onClick={() => navigate("/report")}
        >
          <FileText size={18} />
          <span>Report</span>
        </div>

        {role === "ADMIN" && (
          <>
            <div className="menu-divider" />
            <div
              className={`menu-item ${isActive("/admin/users") ? "active" : ""}`}
              onClick={() => navigate("/admin/users")}
            >
              <Users size={18} />
              <span>User Management</span>
            </div>
          </>
        )}
      </div>

      <div className="bottom-menu">

        <div className="menu-item">
          <HelpCircle size={18} />
          <span>Help Center</span>
        </div>

        <div className="menu-item">
          <Headset size={18} />
          <span>Contact Support</span>
        </div>

        <div className="menu-item logout-item" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
}