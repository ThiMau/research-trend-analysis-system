import { useState } from "react";
import "./Search.css";
import {
  Search,
  Bookmark,
  ChevronDown,
  BookOpen,
} from "lucide-react";

export default function SearchPage() {
  const [saved, setSaved] = useState([false, false, true]);

  const papers = [
    {
      date: "Nov 12, 2023",
      title:
        "Neural Network Architectures for Efficient Resource Allocation in Large-Scale Edge Computing",
      authors:
        "Dr. Elena Rodriguez, Mark J. Sutherland, Prof. David Chen",
      journal: "Journal of Advanced AI",
    },
    {
      date: "Feb 08, 2024",
      title:
        "Climate Impact Assessment of Multi-Layer Permafrost Degradation in the Arctic Basin",
      authors: "Sarah L. White, Henrik Von Nordheim",
      journal: "Nature Geoscience",
    },
    {
      date: "May 21, 2022",
      title:
        "Statistical Modeling of Socio-Economic Disparities in Global Health Education",
      authors: "Dr. Amit Shah, Lisa K. Thompson",
      journal: "The Lancet Public Health",
    },
  ];

  const handleSave = (index) => {
    const clone = [...saved];
    clone[index] = !clone[index];
    setSaved(clone);
  };

  return (
    <div className="search-page">

      <div className="search-top">

        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search publications by title, DOI, or keywords..."
          />
        </div>

        <button className="search-btn">
          Search
        </button>

      </div>

      <div className="quick-tags">
        <span>Quick tags:</span>

        <button>AI Safety</button>
        <button>Climate Models</button>
        <button>mRNA</button>
      </div>

      <div className="result-header">

        <h4>SHOWING 428 RESULTS</h4>

        <div className="sort-box">
          Sort by: <strong>Relevance</strong>
          <ChevronDown size={14} />
        </div>

      </div>

      <div className="paper-list">

        {papers.map((paper, index) => (
          <div className="paper-card" key={index}>

            <div className="paper-content">

              <span className="paper-date">
                {paper.date}
              </span>

              <h2>{paper.title}</h2>

              <p className="paper-authors">
                {paper.authors}
              </p>

              <div className="paper-journal">
                <BookOpen size={14} />
                {paper.journal}
              </div>

            </div>

            <button
              className={`save-btn ${
                saved[index] ? "saved" : ""
              }`}
              onClick={() => handleSave(index)}
            >
              <Bookmark size={18} />
              <span>
                {saved[index] ? "SAVED" : "SAVE"}
              </span>
            </button>

          </div>
        ))}
      </div>

      <div className="load-more">
        <button>
          Load More Results
          <ChevronDown size={16} />
        </button>
      </div>

    </div>
  );
}