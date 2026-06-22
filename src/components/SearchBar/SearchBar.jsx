import { Search, Gift, Bell, Settings, Moon, Sun, Key } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

export default function SearchBar({ showInput = true }) {
  const [darkMode, setDarkMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
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

        <div className="offer">
          <Gift size={16} />
          <span>Free Offer</span>
        </div>

        <Bell size={18} className="icon-btn" />

        <div className="setting-wrapper">
          <Settings
            size={18}
            className="icon-btn"
            onClick={() => setShowMenu(!showMenu)}
          />

          {showMenu && (
            <div className="setting-menu">

              <button onClick={toggleTheme}>
                {darkMode ? (
                  <>
                    <Sun size={16} />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon size={16} />
                    Dark Mode
                  </>
                )}
              </button>

              <button onClick={() => navigate("/change-password")}>
                <Key size={16} />
                Change Password
              </button>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}