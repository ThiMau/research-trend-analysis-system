import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import authService from "../../Services/authService";
import "./PaperDetail.css";

const PaperDetail = () => {
  const { paperId } = useParams();

  const [paper, setPaper] = useState(null);
  const [journalDetail, setJournalDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || '/search';

  useEffect(() => {
    fetchPaper();
  }, [paperId]);

  useEffect(() => {
    if (paper?.journalId) {
      fetchJournal(paper.journalId);
    }
  }, [paper?.journalId]);

  const fetchPaper = async () => {
    try {
      const res = await authService.getPaperDetail(paperId);
      const data = res?.result || res;
      setPaper(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load paper details. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJournal = async (journalId) => {
    try {
      const res = await authService.getJournalById(journalId);
      const data = res?.result || res;
      setJournalDetail(data);
    } catch (err) {
      console.warn("Failed to fetch journal detail", err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="error-page">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchPaper}>Retry</button>
      </div>
    );
  }

  if (!paper) {
    return <div>No Data</div>;
  }

  return (
    <div className="paper-detail-page">
      <div className="paper-main">
        <div className="breadcrumb" onClick={() => navigate(returnTo)} style={{ cursor: 'pointer' }}>← Back to Search</div>

        <span className="journal-tag">{paper.journalName}</span>

        <h1>{paper.title}</h1>

        <div className="authors">{paper.authors?.map((a) => a.fullName).join(", ")}</div>

        <div className="paper-info">Published: {paper.publicationYear}</div>

        <div className="action-buttons">
          <button>Save to Folder</button>
          <button
            onClick={() =>
              navigate("/report", {
                state: { paper },
              })
            }
          >
            Report Paper
          </button>
          <button className="primary">View Full Paper</button>
        </div>

        <h2>Abstract</h2>

        <p className="abstract">{paper.paperAbstract}</p>

        <div className="metadata">
          <h3>Publication Metadata</h3>

          <div className="keyword-list">
            {paper.keywords?.map((keyword, index) => (
              <span key={index}>{keyword}</span>
            ))}
          </div>

          <div className="topic-list">
            {paper.topics?.map((topic, index) => (
              <span key={index}>{topic}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="paper-sidebar">
        {/* AUTHORS SUMMARY (top) */}
        <div className="sidebar-card">
          <h3>Authors</h3>

          {paper.authors?.map((author) => (
            <div key={author.authorId} className="author-item">
              <h4>
                <Link to={`/authors/${author.authorId}`}>{author.fullName}</Link>
              </h4>

              <p>{author.affiliation}</p>
            </div>
          ))}
        </div>

        {/* JOURNAL SUMMARY (below authors) */}
        <div className="sidebar-card">
          <h3>Journal Information</h3>

          <p>
            <strong>Name:</strong> {journalDetail?.name || paper.journalName}
          </p>

          <p>
            <strong>ISSN:</strong> {journalDetail?.issn || "N/A"}
          </p>

          <p>
            <strong>Publisher:</strong> {journalDetail?.publisher || "N/A"}
          </p>

          <p>
            <strong>Citations:</strong> {paper.citationCount ?? "N/A"}
          </p>

          <Link to={`/journals/${paper.journalId}`}>View Journal</Link>
        </div>
      </div>
    </div>
  );
};

export default PaperDetail;