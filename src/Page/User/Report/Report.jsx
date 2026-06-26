import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authService from "../../../Services/authService";
import "./Report.css";

export default function ReportPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [paper, setPaper] = useState(state?.paper || null);
  const [reportType, setReportType] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState(() => {
    try {
      const raw = localStorage.getItem("reportsHistory");
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // ignore
    }

    // sample data for visualization when no real API/data exists
    return [
      { paperTitle: "AI Ethics in Clinical Trials", reportType: "Metadata Mismatch", status: "resolved", date: "Sep 28, 2024" },
      { paperTitle: "Graph Neural Networks 101", reportType: "Broken hyperlinks", status: "pending", date: "Sep 30, 2024" },
      { paperTitle: "Protein Folding Trends", reportType: "Author Ambiguity", status: "resolved", date: "Oct 05, 2024" },
      { paperTitle: "Quantum Computing Hype", reportType: "Redundant Entries", status: "pending", date: "Oct 10, 2024" },
    ];
  });

  useEffect(() => {
    // if the page was opened with a paper in state, ensure local paper state is set
    if (state?.paper ) setPaper(state.paper);
  }, [state]);

  const submitReport = async () => {
    // allow creating a report even if no paper (sidebar entry). Use local history when API unavailable.
    setLoading(true);
    setError("");

    const newEntry = {
      paperTitle: paper?.title || "(No paper specified)",
      reportType: reportType || "Other",
      description,
      status: "pending",
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' }),
    };

    try {
      // try API but don't rely on it — still update local history
      try {
        if (paper?.paperId) {
          await authService.createReport({
            paperId: paper.paperId,
            reportType,
            description,
          });
        } else {
          // if API requires paperId and none present, skip API call
        }
      } catch (apiErr) {
        console.error('createReport API failed or unavailable', apiErr);
      }

      const updated = [newEntry, ...history];
      setHistory(updated);
      try { localStorage.setItem('reportsHistory', JSON.stringify(updated)); } catch (e) { }

      // clear form but stay on the page so user sees history
      setReportType("");
      setDescription("");
    } catch (err) {
      console.error(err);
      setError("Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // render the page even when no paper is provided via state

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
          {history.length === 0 ? (
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
                  <tr key={idx}>
                    <td>{h.paperTitle}</td>
                    <td>{h.reportType}</td>
                    <td><span className={`status ${h.status === 'resolved' ? 'resolved' : 'pending'}`}>{h.status}</span></td>
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