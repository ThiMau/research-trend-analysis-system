import { useNavigate } from "react-router-dom";
import "./PublicationCard.css";

const PublicationCard = ({ paper, returnTo }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!paper?.paperId) return;
    navigate(`/papers/${paper.paperId}`, { state: { returnTo } });
  };

  return (
    <article className="paper-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className="paper-header">
        <div className="paper-badge">{paper.journalName || paper.source || 'Source'}</div>
        <div className="paper-date">{paper.publicationYear}</div>
      </div>

      <h4 className="paper-title">{paper.title}</h4>

      <p className="paper-excerpt">
        {paper.paperAbstract?.slice(0, 150)}...
      </p>

      <div className="paper-actions">
        <button className="icon-btn">☆</button>
        <div style={{ marginLeft: 'auto', color: '#6b7280' }}>Citations: {paper.citationCount ?? 0}</div>
      </div>
    </article>
  );
};

export default PublicationCard;