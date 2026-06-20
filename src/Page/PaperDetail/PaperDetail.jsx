import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import authService from "../../Services/authService";
import "./PaperDetail.css";

const PaperDetail = () => {
  const { paperId } = useParams();

  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaper();
  }, []);

  const fetchPaper = async () => {
    try {
      const data = await authService.getPaperDetail(
        paperId
      );

      setPaper(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!paper) {
    return <div>No Data</div>;
  }

  return (
    <div className="paper-detail-page">
      <div className="paper-main">

        <div className="breadcrumb">
          ← Back to Search
        </div>

        <span className="journal-tag">
          {paper.journalName}
        </span>

        <h1>{paper.title}</h1>

        <div className="authors">
          {paper.authors?.map((a) => a.fullName).join(", ")}
        </div>

        <div className="paper-info">
          Published: {paper.publicationYear}
        </div>

        <div className="action-buttons">
          <button>Save to Folder</button>
          <button>Report Paper</button>
          <button className="primary">
            View Full Paper
          </button>
        </div>

        <h2>Abstract</h2>

        <p className="abstract">
          {paper.paperAbstract}
        </p>

        <div className="metadata">
          <h3>Publication Metadata</h3>

          <div className="keyword-list">
            {paper.keywords?.map((keyword, index) => (
              <span key={index}>
                {keyword}
              </span>
            ))}
          </div>

          <div className="topic-list">
            {paper.topics?.map((topic, index) => (
              <span key={index}>
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="paper-sidebar">
        <div className="sidebar-card">
          <h3>Journal Information</h3>

          <p>
            <strong>Name:</strong>{" "}
            {paper.journalName}
          </p>

          <p>
            <strong>DOI:</strong> {paper.doi}
          </p>

          <p>
            <strong>Citations:</strong>{" "}
            {paper.citationCount}
          </p>
        </div>

        <div className="sidebar-card">
          <h3>Authors</h3>

          {paper.authors?.map((author) => (
            <div
              key={author.authorId}
              className="author-item"
            >
              <h4>{author.fullName}</h4>

              <p>
                {author.affiliation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaperDetail;