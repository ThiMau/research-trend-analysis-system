import React, { useState, useEffect, useMemo } from "react";
import "./UserManagement.css";
import adminService from "../../../Services/adminService";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Ban,
  Unlock,
  AlertOctagon,
} from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Notification state
  const [notification, setNotification] = useState(null);

  // Modal confirmation state
  const [modal, setModal] = useState({
    isOpen: false,
    type: "", // "DEACTIVATE" | "BAN"
    userId: null,
    userName: "",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getUsers();
      if (data && data.result) {
        setUsers(data.result);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Unable to load user accounts. Please check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Show auto-dismiss notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Action handlers
  const handleActivate = async (userId) => {
    try {
      const response = await adminService.activateUser(userId);
      showNotification(response?.message || "User activated successfully!", "success");
      fetchUsers();
    } catch (err) {
      console.error(err);
      showNotification("Failed to activate user.", "error");
    }
  };

  const handleDeactivate = async () => {
    const { userId } = modal;
    try {
      const response = await adminService.deactivateUser(userId);
      showNotification(response?.message || "User deactivated successfully!", "warning");
      setModal({ isOpen: false, type: "", userId: null, userName: "" });
      fetchUsers();
    } catch (err) {
      console.error(err);
      showNotification("Failed to deactivate user.", "error");
    }
  };

  const handleBan = async () => {
    const { userId } = modal;
    try {
      const response = await adminService.banUser(userId);
      showNotification(response?.message || "User banned successfully!", "error");
      setModal({ isOpen: false, type: "", userId: null, userName: "" });
      fetchUsers();
    } catch (err) {
      console.error(err);
      showNotification("Failed to ban user.", "error");
    }
  };

  // Open confirmation modal
  const openConfirmModal = (type, userId, userName) => {
    setModal({
      isOpen: true,
      type,
      userId,
      userName,
    });
  };

  // Stats Calculations
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === "ACTIVE").length;
    const deactivated = users.filter((u) => u.status === "DEACTIVATED" || u.status === "INACTIVE").length;
    const banned = users.filter((u) => u.status === "BANNED").length;
    return { total, active, deactivated, banned };
  }, [users]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const nameMatch = user.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
      const emailMatch = user.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const queryMatch = nameMatch || emailMatch;

      const roleMatch = roleFilter === "ALL" || user.role === roleFilter;

      let statusMatch = true;
      if (statusFilter !== "ALL") {
        if (statusFilter === "DEACTIVATED") {
          statusMatch = user.status === "DEACTIVATED" || user.status === "INACTIVE";
        } else {
          statusMatch = user.status === statusFilter;
        }
      }

      return queryMatch && roleMatch && statusMatch;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  return (
    <div className="user-management-container">
      {/* Header */}
      <div className="user-management-header">
        <h1>User Account Management</h1>
        <p>Monitor system users, handle activation status, and restrict access where necessary.</p>
      </div>

      {/* Notifications Banner */}
      {notification && (
        <div style={{
          padding: "12px 18px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "500",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          boxShadow: "var(--shadow)",
          backgroundColor: notification.type === "success" ? "rgba(34, 197, 94, 0.15)" : notification.type === "warning" ? "rgba(249, 115, 22, 0.15)" : "rgba(239, 68, 68, 0.15)",
          color: notification.type === "success" ? "#22c55e" : notification.type === "warning" ? "#f97316" : "#ef4444",
          border: `1px solid ${notification.type === "success" ? "rgba(34, 197, 94, 0.3)" : notification.type === "warning" ? "rgba(249, 115, 22, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
          animation: "fadeIn 0.2s ease-in-out",
        }}>
          {notification.type === "success" && <CheckCircle size={18} />}
          {notification.type === "warning" && <AlertTriangle size={18} />}
          {notification.type === "error" && <AlertOctagon size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper total">
            <Users size={22} />
          </div>
          <div className="stat-info">
            <h3>Total Accounts</h3>
            <p>{stats.total}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper active">
            <UserCheck size={22} />
          </div>
          <div className="stat-info">
            <h3>Active</h3>
            <p>{stats.active}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper deactivated">
            <UserX size={22} />
          </div>
          <div className="stat-info">
            <h3>Deactivated</h3>
            <p>{stats.deactivated}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper banned">
            <ShieldAlert size={22} />
          </div>
          <div className="stat-info">
            <h3>Banned</h3>
            <p>{stats.banned}</p>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="control-panel">
        <div className="search-wrapper">
          <Search size={18} />
          <input
            type="text"
            className="search-input-field"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-wrapper">
          <select
            className="filter-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="MEMBER">Member</option>
          </select>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="DEACTIVATED">Deactivated</option>
            <option value="BANNED">Banned</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-card">
        {loading ? (
          <div className="loading-wrapper">
            <div className="spinner"></div>
            <p>Fetching user database records...</p>
          </div>
        ) : error ? (
          <div className="error-wrapper">
            <AlertOctagon size={48} color="#ef4444" />
            <p>{error}</p>
            <button className="modal-btn confirm-deactivate" onClick={fetchUsers}>
              Retry Load
            </button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-wrapper">
            <XCircle size={48} />
            <p>No user records matched your criteria.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Full Name</th>
                  <th>Email Address</th>
                  <th>System Role</th>
                  <th>Status</th>
                  <th>Administrative Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.userId}>
                    <td><strong>#{user.userId}</strong></td>
                    <td>{user.fullName || "N/A"}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge role-${user.role?.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge status-${user.status?.toLowerCase() === 'inactive' ? 'deactivated' : user.status?.toLowerCase()}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {user.role === "ADMIN" ? (
                          <span style={{ fontSize: "12px", color: "var(--text)", fontStyle: "italic" }}>No actions allowed</span>
                        ) : (
                          <>
                            {(user.status === "DEACTIVATED" || user.status === "INACTIVE" || user.status === "BANNED") && (
                              <button
                                className="action-btn activate"
                                onClick={() => handleActivate(user.userId)}
                                title="Activate account"
                              >
                                <Unlock size={14} /> Activate
                              </button>
                            )}
                            {user.status === "ACTIVE" && (
                              <button
                                className="action-btn deactivate"
                                onClick={() => openConfirmModal("DEACTIVATE", user.userId, user.fullName)}
                                title="Deactivate account"
                              >
                                <UserX size={14} /> Deactivate
                              </button>
                            )}
                            {user.status !== "BANNED" && (
                              <button
                                className="action-btn ban"
                                onClick={() => openConfirmModal("BAN", user.userId, user.fullName)}
                                title="Ban account"
                              >
                                <Ban size={14} /> Ban
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {modal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <AlertTriangle size={24} color={modal.type === "BAN" ? "#ef4444" : "#f97316"} />
              <h3>Confirm Administrative Action</h3>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to <strong>{modal.type.toLowerCase()}</strong> the account of{" "}
                <strong>{modal.userName || `User #${modal.userId}`}</strong>?
                {modal.type === "BAN"
                  ? " This will restrict the user from logging in or using the platform indefinitely."
                  : " This will temporarily disable the user account activities."}
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="modal-btn cancel"
                onClick={() => setModal({ isOpen: false, type: "", userId: null, userName: "" })}
              >
                Cancel
              </button>
              <button
                className={`modal-btn confirm-${modal.type.toLowerCase()}`}
                onClick={modal.type === "BAN" ? handleBan : handleDeactivate}
              >
                Yes, {modal.type === "BAN" ? "Ban User" : "Deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
