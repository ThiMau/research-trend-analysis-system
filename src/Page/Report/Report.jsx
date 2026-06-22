import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Report.css";

const Report = () => {
  const location = useLocation();

  const [paper, setPaper] = useState(null);

  const [reportType, setReportType] =
    useState("");

  const [description, setDescription] =
    useState("");

  useEffect(() => {
    if (location.state?.paper) {
      setPaper(location.state.paper);
    }
  }, [location]);

  const handleSubmit = async () => {
    try {
      console.log({
        paperId: paper?.paperId,
        reportType,
        description,
      });

      alert("Report submitted!");
    } catch (error) {
      console.error(error);
    }
  };

  const reportHistory = [
    {
      title: "AI Ethics in Clinical Trials",
      type: "Metadata Mismatch",
      status: "Resolved",
      date: "Sep 28, 2024",
    },
    {
      title: "Graph Neural Networks 101",
      type: "Broken Hyperlinks",
      status: "Pending",
      date: "Sep 30, 2024",
    },
    {
      title: "Protein Folding Trends",
      type: "Author Ambiguity",
      status: "Resolved",
      date: "Oct 05, 2024",
    },
  ];

  return (
    <div className="report-page">
      <h1>Report Management</h1>

      <p>
        Review and manage data integrity
        reports for academic publications.
      </p>

      {paper && (
        <div className="report-form-card">
          <div className="report-header">
            REPORT ISSUES
          </div>

          <div className="report-body">
            <label>Paper Title</label>

            <h3>{paper.title}</h3>

            <label>Report Type</label>

            <select
              value={reportType}
              onChange={(e) =>
                setReportType(
                  e.target.value
                )
              }
            >
              <option value="">
                Select report type...
              </option>

              <option>
                Metadata Mismatch
              </option>

              <option>
                Broken Hyperlinks
              </option>

              <option>
                Author Ambiguity
              </option>

              <option>
                Duplicate Paper
              </option>

              <option>
                Other
              </option>
            </select>

            <textarea
              placeholder="Enter report details here..."
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
            />

            <button
              className="report-btn"
              onClick={handleSubmit}
            >
              Report
            </button>
          </div>
        </div>
      )}

      <div className="history-section">
        <div className="history-header">
          <h2>Report History</h2>
        </div>

        <table>
          <thead>
            <tr>
              <th>Paper Title</th>
              <th>Report Type</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {reportHistory.map(
              (item, index) => (
                <tr key={index}>
                  <td>{item.title}</td>

                  <td>{item.type}</td>

                  <td>
                    <span
                      className={`status ${item.status.toLowerCase()}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td>{item.date}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Report;