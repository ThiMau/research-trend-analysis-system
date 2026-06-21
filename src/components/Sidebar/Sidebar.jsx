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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import authService from "../../Services/authService";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    // Navigate to login and replace history entry so Back won't return to protected pages
    window.location.replace("/login");
  };

  return (
    <div className="sidebar">

      <div className="logo-section">
        <div className="logo-box">
          <TrendingUp size={18} />
        </div>

        <div>
          <h2>TrendTrack</h2>
          <span>USER</span>
        </div>
      </div>

      <div className="menu">

        <div className="menu-item">
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </div>

        <div className="menu-item">
          <Search size={18} />
          <span>Search</span>
        </div>

        <div className="menu-item active">
          <TrendingUp size={18} />
          <span>Trend Analytics</span>
        </div>

        <div className="menu-item">
          <Library size={18} />
          <span>My Library</span>
        </div>

        <div className="menu-item">
          <FileText size={18} />
          <span>Report</span>
        </div>

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