import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authService from "../../Services/authService";
import "./Report.css";

export default function ReportPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [paper, setPaper] = useState(state?.paper || null);
  const [reportType, setReportType] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!paper) {
      // If no paper provided, redirect back
      // after a short delay to give user feedback
      const t = setTimeout(() => navigate(-1), 800);
      return () => clearTimeout(t);
    }
  }, [paper]);

  const submitReport = async () => {
    if (!paper?.paperId) {
      setError("Invalid paper selected.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authService.createReport({
        paperId: paper.paperId,
        reportType,
        description,
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!paper) {
    return (
      <div className="report-page">
        <h2>No paper selected</h2>
        <p>Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="report-page">
      <h2>Report Paper</h2>

      <div className="paper-summary">
        <h3>{paper.title}</h3>
        <p>{paper.journalName} • {paper.publicationYear}</p>
      </div>

      <div className="report-form">
        <label>Report Type</label>
        <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
          <option value="">Select type</option>
          <option value="plagiarism">Plagiarism</option>
          <option value="inappropriate">Inappropriate content</option>
          <option value="other">Other</option>
        </select>

        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

        {error && <div className="error">{error}</div>}

        <div className="actions">
          <button onClick={() => navigate(-1)} disabled={loading}>Cancel</button>
          <button onClick={submitReport} disabled={loading || !reportType}>Submit Report</button>
        </div>
      </div>
    </div>
  );
}