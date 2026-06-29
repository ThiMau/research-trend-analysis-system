import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Filter from "../../../components/Filter/Filter";
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

  const [keyword, setKeyword] = useState(initialKeyword);
  const [papers, setPapers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    field: "",
    year: "",
    topic: "",
    keyword: "",
    journal: "",
  });

  const handleSearch = useCallback(async (page = 0, size = 10, searchTermParam) => {
    const searchTerm = searchTermParam !== undefined ? searchTermParam : keyword;
    setLoading(true);
    setError("");
    const result = res.data.result;

    setPapers(result.content);
    setPage(result.number);
    setTotalPages(result.totalPages);
    try {
      // Loại bỏ các param rỗng để tránh backend lỗi 500
      const rawParams = {
        fieldId: filters.fieldId,
        topicId: filters.topicId,
        journal: filters.journal,
        fromYear: filters.fromYear,
        toYear: filters.toYear,
        isOpenAccess: filters.isOpenAccess,
        keyword: searchTerm,
        page,
        size,
        sortBy: "createdAt",
        direction: "desc",
      };

      const params = Object.fromEntries(
        Object.entries(rawParams).filter(
          ([, v]) => v !== "" && v !== null && v !== undefined
        )
      );

      const res = await axiosClient.get("/api/member/papers", { params });

      const result = res.data?.result;
      const list = result?.content || [];
      setPapers(list);
    } catch (err) {
      console.error(err);
      setError("Failed to load search results. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [keyword, filters]);



  // Search khi mở trang lần đầu
  useEffect(() => {
    handleSearch(0, 10, initialKeyword);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Search lại khi filter thay đổi (bỏ qua lần render đầu)
  const isFirstRender = React.useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    handleSearch();
  }, [filters]);

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

      <Filter
        onChange={(value) => {
          setFilters(value);
        }}
      />

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

      <div className="pagination">

        <button disabled={page === 0}>
          Previous
        </button>

        1 2 3 4 5 ...

        <button disabled={page === totalPages - 1}>
          Next
        </button>

      </div>
    </div>
  );
}