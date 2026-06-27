import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import "./Search.css";
import {
  Search,
  ChevronDown,
} from "lucide-react";
import axiosClient from "../../../Api/axiosClient";
import PublicationCard from "../../../components/PublicationCard/PublicationCard";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialKeyword = searchParams.get("keyword") || "";

  const [years, setYears] = useState([]);
  const [topics, setTopics] =useState([]);
  const [keywords, setKeywords] = useState([]);
  const [journals, setJournals] = useState([]);

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedKeyword, setSelectedKeyword] = useState("");
  const [selectedJournal, setSelectedJournal] = useState("");

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
          year: selectedYear,
          topic: selectedTopic,
          keywordFilter: selectedKeyword,
          journal: selectedJournal,

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

const loadFilters = async () => {
  try {
    const [
      yearsRes,
      topicsRes,
      keywordsRes,
      journalsRes,
    ] = await Promise.all([
      axiosClient.get("/api/member/papers/filters/years"),
      axiosClient.get("/api/member/papers/filters/topics"),
      axiosClient.get("/api/member/papers/filters/keywords"),
      axiosClient.get("/api/member/papers/filters/journals"),
    ]);

    setYears(yearsRes.data.result || []);
    setTopics(topicsRes.data.result || []);
    setKeywords(keywordsRes.data.result || []);
    setJournals(journalsRes.data.result || []);
  } catch (err) {
    console.error(err);
  }
};

const [filtersLoaded, setFiltersLoaded] = useState(false);
// Load filter
useEffect(() => {
  loadFilters();
}, []);

// Search khi mở trang bằng keyword
  useEffect(() => {
    if (initialKeyword) {
      (async () => {
        await handleSearch(0, 10, initialKeyword);
      })();
    }
  }, [initialKeyword, handleSearch]);
  // Search khi đổi filter
useEffect(() => {
  handleSearch();
}, [
  selectedYear,
  selectedTopic,
  selectedKeyword,
  selectedJournal,
]);

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

      <div className="filter-bar">

    <select
        value={selectedYear}
        onChange={(e)=>setSelectedYear(e.target.value)}
    >
        <option value="">All Years</option>

        {years.map(item=>(
            <option
                key={item.value}
                value={item.value}
            >
                {item.label} ({item.count})
            </option>
        ))}
    </select>

    <select
        value={selectedTopic}
        onChange={(e)=>setSelectedTopic(e.target.value)}
    >
        <option value="">All Topics</option>

        {topics.map(item=>(
            <option
                key={item.value}
                value={item.value}
            >
                {item.label} ({item.count})
            </option>
        ))}
    </select>

    <select
        value={selectedKeyword}
        onChange={(e)=>setSelectedKeyword(e.target.value)}
    >
        <option value="">All Keywords</option>

        {keywords.map(item=>(
            <option
                key={item.value}
                value={item.value}
            >
                {item.label} ({item.count})
            </option>
        ))}
    </select>

    <select
        value={selectedJournal}
        onChange={(e)=>setSelectedJournal(e.target.value)}
    >
        <option value="">All Journals</option>

        {journals.map(item=>(
            <option
                key={item.value}
                value={item.value}
            >
                {item.label} ({item.count})
            </option>
        ))}
    </select>

    <button
        className="search-btn"
        onClick={()=>handleSearch()}
    >
        Apply Filters
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