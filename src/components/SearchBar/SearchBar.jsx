import { Search, Gift, Bell, Settings, Moon, Sun, Key } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

export default function SearchBar() {
  const [darkMode, setDarkMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
  };

  return (
    <div className="searchbar-container">

      <div className="search-input">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search publications, authors, or research topics..."
        />
      </div>

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

              <button onClick={() => navigate("/reset-password")}>
                <Key size={16} />
                Reset Password
              </button>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}