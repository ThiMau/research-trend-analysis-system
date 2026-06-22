import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import "./Search.css";
import {
  Search,
  ChevronDown,
} from "lucide-react";
import axiosClient from "../../Api/axiosClient";
import PublicationCard from "../../components/PublicationCard/PublicationCard";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialKeyword = searchParams.get("keyword") || "";

  const [keyword, setKeyword] = useState(initialKeyword);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSearch = useCallback(async (page = 0, size = 10, searchTermParam) => {
    const searchTerm = searchTermParam !== undefined ? searchTermParam : keyword;
    setLoading(true);
    setError("");

    try {
      const res = await axiosClient.get("/api/member/papers", {
        params: {
          keyword: searchTerm,
          page,
          size,
          sortBy: "createdAt",
          direction: "desc",
        },
      });

      const result = res.data?.result;
      const list = result?.content || [];
      setPapers(list);
    } catch (err) {
      console.error(err);
      setError("Failed to load search results. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    if (initialKeyword) {
      (async () => {
        await handleSearch(0, 10, initialKeyword);
      })();
    }
  }, [initialKeyword, handleSearch]);

  return (
    <div className="search-page">
      <div className="search-top">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search publications by title, DOI, or keywords..."
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </div>

        <button className="search-btn" onClick={() => handleSearch()}>
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
        <h4>
          SHOWING {papers.length} RESULT{papers.length !== 1 ? "S" : ""}
        </h4>

        <div className="sort-box">
          Sort by: <strong>Relevance</strong>
          <ChevronDown size={14} />
        </div>
      </div>

      <div className="paper-list">
        {loading && <div>Loading results...</div>}
        {error && <div className="error" style={{ color: "red" }}>{error}</div>}

        {!loading && papers.length === 0 && <div>No results. Try a different keyword.</div>}

        {!loading &&
          papers.map((paper, index) => {
            const returnTo = `/search?keyword=${encodeURIComponent(keyword || '')}`;
            return <PublicationCard key={paper.paperId || index} paper={paper} returnTo={returnTo} />;
          })}
      </div>

      <div className="load-more">
        <button onClick={() => handleSearch()}>
          Load / Refresh Results
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );
}