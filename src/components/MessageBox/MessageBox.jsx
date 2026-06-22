import { useState } from "react";
import "./MessageBox.css";
import { Bell, X } from "lucide-react";

const MessageBox = () => {
  const [open, setOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "New Paper Activity",
      message:
        'New citation for "Transformers in Medicine"',
      time: "Just now",
      unread: true,
    },
    {
      id: 2,
      title: "Research Update",
      message:
        "A new AI paper matches your followed topics.",
      time: "5 mins ago",
      unread: true,
    },
  ];

  const unreadCount = notifications.filter(
    (item) => item.unread
  ).length;

  return (
    <div className="message-box">
      {/* Bell Icon */}
      <button
        className="notification-btn"
        onClick={() => setOpen(!open)}
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span className="notification-dot"></span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="notification-panel">
          <div className="notification-header">
            <h4>Notifications</h4>

            <button
              className="close-btn"
              onClick={() => setOpen(false)}
            >
              <X size={16} />
            </button>
          </div>

          <div className="notification-list">
            {notifications.map((item) => (
              <div
                key={item.id}
                className="notification-item"
              >
                <div className="notification-icon">
                  <Bell size={16} />
                </div>

                <div className="notification-content">
                  <h5>{item.title}</h5>
                  <p>{item.message}</p>
                  <span>{item.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="notification-footer">
            <button>View All</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBox;