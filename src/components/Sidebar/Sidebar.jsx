import "./Sidebar.css";
import {
  LayoutDashboard,
  Search,
  TrendingUp,
  Library,
  FileText,
  HelpCircle,
  Headset,
} from "lucide-react";

export default function Sidebar() {
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

      </div>
    </div>
  );
}