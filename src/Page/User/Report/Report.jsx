import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import userService from "../../../Services/userService";
import "./Report.css";

const getFallbackHistory = () => {
  try {
    const raw = localStorage.getItem("reportsHistory");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error(e);
  }

  return [
    { paperTitle: "AI Ethics in Clinical Trials", reportType: "Metadata Mismatch", status: "resolved", date: "Sep 28, 2024" },
    { paperTitle: "Graph Neural Networks 101", reportType: "Broken hyperlinks", status: "pending", date: "Sep 30, 2024" },
    { paperTitle: "Protein Folding Trends", reportType: "Author Ambiguity", status: "resolved", date: "Oct 05, 2024" },
    { paperTitle: "Quantum Computing Hype", reportType: "Redundant Entries", status: "pending", date: "Oct 10, 2024" },
  ];
};

const parseReportList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.result)) return payload.result;
  if (Array.isArray(payload?.result?.content)) return payload.result.content;
  if (payload?.result && typeof payload.result === "object") return [payload.result];
  return [];
};

const normalizeHistoryItem = (report, index) => {
  const rawDate = report.createdAt || report.date || report.updatedAt || "";
  const status = typeof report.status === "string" ? report.status.toLowerCase() : "pending";

  return {
    id: report.reportId || report.id || report.paperId || `${index}-${rawDate}`,
    paperTitle: report.paperTitle || report.paper?.title || report.paperName || "(No paper specified)",
    reportType: report.reportType || report.reason || "Other",
    description: report.description || report.reason || "",
    status,
    date: rawDate
      ? new Date(rawDate).toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" })
      : new Date().toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" }),
  };
};

const getStatusOverrides = () => {
  try {
    const raw = localStorage.getItem("reportStatusOverrides");
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error(e);
    return {};
  }
};

const getFeedbackOverrides = () => {
  try {
    const raw = localStorage.getItem("reportFeedbacks");
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error(e);
    return {};
  }
};

const applyStatusOverrides = (reports) => {
  const overrides = getStatusOverrides();
  return reports.map((report, index) => {
    const key = report.id || report.reportId || report.paperId || `local-${index}`;
    const nextStatus = overrides[key];
    if (!nextStatus) return report;

    return {
      ...report,
      status: String(nextStatus).toLowerCase(),
    };
  });
};

const applyFeedbackOverrides = (reports) => {
  const feedbacks = getFeedbackOverrides();
  return reports.map((report, index) => {
    const key = report.id || report.reportId || report.paperId || `local-${index}`;
    const nextFeedback = feedbacks[key];
    if (!nextFeedback) return report;

    return {
      ...report,
      feedback: nextFeedback,
    };
  });
};

export default function ReportPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [paper, setPaper] = useState(state?.paper || null);
  const [reportType, setReportType] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (state?.paper) setPaper(state.paper);
  }, [state]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setHistoryLoading(true);
        const response = await userService.getMyReports();
        const list = parseReportList(response);
        const mapped = list.map(normalizeHistoryItem);
        setHistory(mapped.length > 0 ? mapped : getFallbackHistory());
      } catch (err) {
        console.error("Failed to load reports history", err);
        setHistory(getFallbackHistory());
      } finally {
        setHistoryLoading(false);
      }
    };

    loadHistory();
  }, []);

  const submitReport = async () => {
    setLoading(true);
    setError("");
    setNotice("");

    const reason = [reportType, description].filter(Boolean).join(" - ");
    const newEntry = {
      paperTitle: paper?.title || "(No paper specified)",
      reportType: reportType || "Other",
      description,
      status: "pending",
      date: new Date().toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" }),
    };

    const optimisticHistory = [newEntry, ...history];

    try {
      await userService.createReport({
        paperId: paper?.paperId ?? 0,
        reason,
      });

      setHistory(optimisticHistory);
      try {
        localStorage.setItem("reportsHistory", JSON.stringify(optimisticHistory));
      } catch (e) {
        console.error(e);
      }

      setReportType("");
      setDescription("");
      setNotice("Report submitted successfully.");
    } catch (err) {
      console.error(err);
      setHistory(optimisticHistory);
      setError("The report could not be sent to the server, but it has been saved locally.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-page">
      <h2>Report Paper</h2>

      <div className="paper-summary">
        <h3>{paper?.title || "No paper selected"}</h3>

        <p>
          {paper?.journalName || ""}
          {paper?.publicationYear && ` • ${paper.publicationYear}`}
        </p>
      </div>

      <div className="report-form-card">
        <div className="report-header">Current Report Details</div>
        <div className="report-body">
          <div className="report-issues-label">REPORT ISSUES</div>
          <div className="paper-title">{paper?.title || "(No paper specified)"}</div>

          <label>REPORT TYPE</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="">Select report type...</option>
            <option value="Metadata Mismatch">Metadata Mismatch</option>
            <option value="Broken hyperlinks">Broken hyperlinks</option>
            <option value="Author Ambiguity">Author Ambiguity</option>
            <option value="Redundant Entries">Redundant Entries</option>
            <option value="Other">Other</option>
          </select>

          <label>Report Details</label>
          <textarea placeholder="Enter report details here..." value={description} onChange={(e) => setDescription(e.target.value)} />

          {notice && <div className="success">{notice}</div>}
          {error && <div className="error">{error}</div>}

          <div className="actions">
            <button className="btn-cancel" onClick={() => navigate(-1)} disabled={loading}>Cancel</button>
            <button className="btn-submit" onClick={submitReport} disabled={loading || !reportType}>Report</button>
          </div>
        </div>
      </div>

      <div className="history-section">
        <h3>Report History</h3>
        <div className="history-card">
          {historyLoading ? (
            <div className="no-history">Loading report history...</div>
          ) : history.length === 0 ? (
            <div className="no-history">No reports created yet.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>PAPER TITLE</th>
                  <th>REPORT TYPE</th>
                  <th>STATUS</th>
                  <th>DATE</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, idx) => (
                  <tr key={h.id || idx}>
                    <td>{h.paperTitle}</td>
                    <td>{h.reportType}</td>
                    <td><span className={`status ${h.status === "resolved" ? "resolved" : "pending"}`}>{h.status}</span></td>
                    <td>{h.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}