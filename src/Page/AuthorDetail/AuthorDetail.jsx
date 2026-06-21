import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import authService from "../../Services/authService";
import "./AuthorDetail.css";

function AuthorDetail() {
  const { authorId } = useParams();

  const [author, setAuthor] = useState(null);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAuthorData();
  }, [authorId]);

  const loadAuthorData = async () => {
    try {
      setLoading(true);

      // fetch author
      const authorRes =
        await authService.getAuthorDetail(
          authorId
        );

      const authorData =
        authorRes?.result || authorRes;

      setAuthor(authorData);

      // fetch papers
      const papersRes =
        await authService.getPapers({
          size: 100,
        });

      const allPapers =
        papersRes?.result?.content ||
        papersRes?.content || [];

      const authorPapers =
        allPapers.filter((paper) =>
          paper.authors?.some(
            (a) =>
              a.authorId ===
              Number(authorId)
          )
        );

      setPapers(authorPapers);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load author details. Please try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="author-loading">
        Loading author...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-page">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={loadAuthorData}>Retry</button>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="author-error">
        Author not found
      </div>
    );
  }

  return (
    <div className="author-detail">
      <div className="author-header">
        <div className="author-avatar">
          {author.fullName
            ?.charAt(0)
            ?.toUpperCase()}
        </div>

        <div>
          <h1>{author.fullName}</h1>

          <p>
            <strong>
              Affiliation:
            </strong>{" "}
            {author.affiliation ||
              "N/A"}
          </p>

          <p>
            <strong>ORCID:</strong>{" "}
            {author.orcid || "N/A"}
          </p>

          <p>
            <strong>
              Total Papers:
            </strong>{" "}
            {papers.length}
          </p>
        </div>
      </div>

      <div className="author-paper-section">
        <h2>
          Publications
        </h2>

        {papers.length === 0 ? (
          <p>
            No publications found.
          </p>
        ) : (
          papers.map((paper) => (
            <Link
              key={paper.paperId}
              to={`/papers/${paper.paperId}`}
              className="paper-card"
            >
              <h3>
                {paper.title}
              </h3>

              <p>
                {paper.publicationYear}
              </p>

              <p>
                Journal:
                {" "}
                {
                  paper.journalName
                }
              </p>

              <p>
                Citations:
                {" "}
                {
                  paper.citationCount
                }
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default AuthorDetail;