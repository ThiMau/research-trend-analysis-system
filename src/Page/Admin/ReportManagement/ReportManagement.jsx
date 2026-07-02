import React, { useEffect, useMemo, useState } from "react";
import adminService from "../../../Services/adminService";
import "./ReportManagement.css";

const normalizeReportList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.result)) return payload.result;
  if (Array.isArray(payload?.result?.content)) return payload.result.content;
  if (payload?.result && typeof payload.result === "object") return [payload.result];
  return [];
};

const normalizeStatus = (status) => {
  const normalized = typeof status === "string" ? status.toLowerCase() : "pending";
  return normalized === "resolved" || normalized === "done" || normalized === "approved" || normalized === "complete" || normalized === "processed"
    ? "resolved"
    : "pending";
};

const getStatusClass = (status) => normalizeStatus(status) === "resolved" ? "resolved" : "pending";
const getStatusLabel = (status) => (normalizeStatus(status) === "resolved" ? "Resolved" : "Pending");

export default function ReportManagement() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminService.getReports();
      const list = normalizeReportList(response);
      setReports(list);
    } catch (err) {
      console.error("Failed to load reports for admin", err);
      setError("Unable to load reports. Please check the backend connection.");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const stats = useMemo(() => {
    const total = reports.length;
    const pending = reports.filter((item) => getStatusClass(item.status) === "pending").length;
    const resolved = total - pending;

    return { total, pending, resolved };
  }, [reports]);

  return (
    <div className="report-management-container">
      <div className="report-management-header">
        <h1>Report Management</h1>
        <p>Review reports submitted by users and keep track of issues raised against papers.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Reports</h3>
          <p>{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p>{stats.pending}</p>
        </div>
        <div className="stat-card">
          <h3>Resolved</h3>
          <p>{stats.resolved}</p>
        </div>
      </div>

      <div className="table-card">
        {loading ? (
          <div className="loading-wrapper">Loading report list...</div>
        ) : error ? (
          <div className="error-wrapper">
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchReports}>Retry</button>
          </div>
        ) : reports.length === 0 ? (
          <div className="empty-wrapper">No reports found.</div>
        ) : (
          <div className="table-wrapper">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Paper ID</th>
                  <th>Reporter</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => (
                  <tr key={report.reportId || report.id || index}>
                    <td>{report.reportId || report.id || "-"}</td>
                    <td>{report.paperId || report.paper?.paperId || "-"}</td>
                    <td>{report.reporterName || report.user?.fullName || report.userName || "Unknown"}</td>
                    <td>{report.reason || report.description || report.reportType || "-"}</td>
                    <td>
                      <span className={`status ${getStatusClass(report.status)}`}>{getStatusLabel(report.status)}</span>
                    </td>
                    <td>{report.createdAt ? new Date(report.createdAt).toLocaleString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
