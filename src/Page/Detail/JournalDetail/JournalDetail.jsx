import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userService from "../../../Services/userService";
import "./JournalDetail.css";

const JournalDetail = () => {
  const { journalId } = useParams();
  const navigate = useNavigate();
  const [isFollowed, setIsFollowed] = useState(false);

  const [journal, setJournal] = useState(null);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [journalId]);

  const fetchData = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await userService.getJournalWithPapers(journalId);
      const journalData = res?.journal || res?.result || res;
      const papersData = res?.papers || res?.result?.content || res?.papers || [];

      setJournal(journalData);
      setPapers(papersData);
      try {

        const followRes =
          await userService.getFollowJournals();

        const followed =
          followRes.data?.result ||
          followRes.result ||
          [];

        setIsFollowed(

          followed.some(
            (item) =>
              item.journalId ===
              Number(journalId)
          )

        );

      } catch (err) {
        console.error(err);
      }

    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Unable to load journal details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowed) {
        await userService.unfollowJournal(Number(journalId));
      } else {
        await userService.followJournal(Number(journalId));
      }
      setIsFollowed(!isFollowed);
    } catch (err) {
      console.log(err);
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
        <button onClick={fetchData}>Retry</button>
      </div>
    );
  }

  if (!journal) {
    return <div>Journal not found.</div>;
  }

  return (
    <div className="journal-page">
      <div className="header-buttons">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <button
          className={
            isFollowed
              ? "follow-btn followed"
              : "follow-btn"
          }
          onClick={handleFollow}
        >
          {isFollowed
            ? "Unfollow"
            : "Follow Journal"}
        </button>
      </div>
      <h1>{journal.name || journal.title}</h1>

      <div className="journal-meta">
        <span>ISSN: {journal.issn || "N/A"}</span>
        <span>Publisher: {journal.publisher || "N/A"}</span>
        <span>Status: {journal.status || "N/A"}</span>
      </div>


      <div className="journal-stats">
        <div className="stat-card">
          <h3>{papers.length}</h3>
          <p>Papers</p>
        </div>
      </div>

      <div className="papers-section">
        <h2>Published Papers</h2>

        {papers.length === 0 ? (
          <p>No papers found for this journal.</p>
        ) : (
          papers.map((paper) => {
            const paperId = paper.paperId || paper.id;

            return (
              <div
                key={paperId}
                className="paper-card clickable"
                onClick={() => navigate(`/papers/${paperId}`)}
              >
                <h3>{paper.title}</h3>
                <p>{paper.paperAbstract?.slice(0, 180) || "No abstract available."}...</p>
                <div className="paper-footer">
                  <span>{paper.publicationYear || "N/A"}</span>
                  <span>Citations: {paper.citationCount ?? "N/A"}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default JournalDetail;
