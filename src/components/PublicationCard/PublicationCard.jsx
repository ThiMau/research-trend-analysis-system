import React from "react";
import { useNavigate } from "react-router-dom";
import "./PublicationCard.css";

const PublicationCard = ({ paper }) => {
  const navigate = useNavigate();

  return (
    <div
      className="publication-card"
      onClick={() =>
        navigate(`/papers/${paper.paperId}`)
      }
    >
      <h3>{paper.title}</h3>

      <p>
        {paper.paperAbstract?.slice(0, 150)}
        ...
      </p>

      <div className="publication-footer">
        <span>{paper.publicationYear}</span>

        <span>
          Citations: {paper.citationCount}
        </span>
      </div>
    </div>
  );
};

export default PublicationCard;