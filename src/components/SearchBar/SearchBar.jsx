import { Search, Gift, Bell, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";
import {
  Search,
  Crown,
  Bell,
  User
} from "lucide-react";

export default function SearchBar({ showInput = true }) {
  const [darkMode, setDarkMode] = useState(false);
  const [query, setQuery] = useState("");

  const navigate = useNavigate();

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
  };

  const performSearch = () => {
    const trimmed = query.trim();
    navigate(trimmed ? `/search?keyword=${encodeURIComponent(trimmed)}` : "/search");
  };

  return (
    <div className="searchbar-container">

      {showInput && (
        <div className="search-input">
          <button type="button" className="search-icon" onClick={performSearch}>
            <Search size={18} />
          </button>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                performSearch();
              }
            }}
            placeholder="Search publications, authors, or research topics..."
          />
        </div>
      )}

      <div className="searchbar-actions">

        <div
          className="offer premium-offer"
          onClick={() => navigate("/premium")}
        >
          <Crown size={16} />
          <span>Premium</span>
        </div>

        <Bell size={18} className="icon-btn" />

        <div className="profile-icon">

          <User
            size={18}
            className="icon-btn"
            onClick={() => navigate("/profile")}
          />

        </div>

      </div>
    </div>
  );
}