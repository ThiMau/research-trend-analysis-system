import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userService from "../../../Services/userService";
import "./TopicDetail.css";

const TopicDetail = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const [topic, setTopic] = useState(null);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Temporary
  // Sau này thay bằng API Follow Topic
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    fetchData();
  }, [topicId]);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await userService.getTopicById(topicId);

      const data = res.result || res;

      setTopic(data);
      setPapers(data.latestPapers || []);
      try {

    const followRes =
        await userService.getFollowTopics();

    const followed =
        followRes.data?.result ||
        followRes.result ||
        [];

    setIsFollowed(

        followed.some(
            (item) =>
                item.topicId === Number(topicId)
        )

    );

} catch {
 console.log(err)
}
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load topic."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {

        if (isFollowed) {

            await userService.unfollowTopic(topicId);

        } else {

            await userService.followTopic(topicId);

        }

        setIsFollowed(!isFollowed);

    } catch (err) {

        console.log(err);

    }
};

  if (loading) return <div>Loading...</div>;

  if (error) {
    return (
      <div className="error-page">
        <h2>Error</h2>
        <p>{error}</p>

        <button onClick={fetchData}>
          Retry
        </button>
      </div>
    );
  }

  if (!topic) return <div>Topic not found.</div>;

  return (
    <div className="topic-page">

      <div className="topic-header">

        <div className="header-buttons">

          <button
            className="back-button"
            onClick={() => navigate(-1)}
          >
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
              : "Follow Topic"}
          </button>

        </div>

        <h1>{topic.topicName}</h1>

        <div className="topic-meta">

          <span>
            Papers : {topic.paperCount}
          </span>

        </div>

        <div className="topic-description">

          {topic.description ||
            "No description available."}

        </div>

      </div>

      <div className="topic-stats">

        <div className="stat-card">
          <h3>{topic.paperCount}</h3>
          <p>Total Papers</p>
        </div>

      </div>

      <div className="papers-section">

        <h2>Latest Papers</h2>

        {papers.length === 0 ? (
          <p>No papers found.</p>
        ) : (
          papers.map((paper) => (
            <div
              key={paper.paperId}
              className="paper-card clickable"
              onClick={() =>
                navigate(`/papers/${paper.paperId}`)
              }
            >
              <h3>{paper.title}</h3>

              <p>
                {paper.paperAbstract
                  ? paper.paperAbstract.slice(0, 180)
                  : "No abstract available."}
                ...
              </p>

              <div className="paper-footer">

                <span>
                  {paper.publicationYear}
                </span>

                <span>
                  {paper.journalName}
                </span>

                <span>
                  Citations :
                  {" "}
                  {paper.citationCount}
                </span>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
};

export default TopicDetail;