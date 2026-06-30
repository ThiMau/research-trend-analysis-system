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
  const [sortDirection, setSortDirection] = useState("desc");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
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
        direction: sortDirection,
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
      setPage(result?.number || 0);
      setTotalPages(result?.totalPages || 0);
    } catch (err) {
      console.error(err);
      setError("Failed to load search results. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [keyword, filters, sortDirection]);



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
    handleSearch(0, 10);
  }, [filters, handleSearch]);

  useEffect(() => {
    if (!showSortDropdown) return;
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".sort-container")) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [showSortDropdown]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      handleSearch(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(0, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages - 1, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(0, end - maxVisible + 1);
    }

    if (start > 0) {
      pages.push(
        <button
          key={0}
          onClick={() => handlePageChange(0)}
          className={page === 0 ? "active" : ""}
        >
          1
        </button>
      );
      if (start > 1) {
        pages.push(<span key="ellipsis-start" className="pagination-ellipsis">...</span>);
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={page === i ? "active" : ""}
        >
          {i + 1}
        </button>
      );
    }

    if (end < totalPages - 1) {
      if (end < totalPages - 2) {
        pages.push(<span key="ellipsis-end" className="pagination-ellipsis">...</span>);
      }
      pages.push(
        <button
          key={totalPages - 1}
          onClick={() => handlePageChange(totalPages - 1)}
          className={page === totalPages - 1 ? "active" : ""}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

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

        <div className="sort-container" style={{ position: "relative" }}>
          <div className="sort-box" onClick={() => setShowSortDropdown(!showSortDropdown)} style={{ cursor: "pointer" }}>
            Sort by: <strong>{sortDirection === "asc" ? "Oldest ↑" : "Newest ↓"}</strong>
            <ChevronDown size={14} />
          </div>
          {showSortDropdown && (
            <div className="sort-dropdown-menu">
              <div 
                className={`sort-dropdown-item ${sortDirection === "desc" ? "active" : ""}`}
                onClick={() => {
                  setSortDirection("desc");
                  setShowSortDropdown(false);
                }}
              >
                Newest ↓
              </div>
              <div 
                className={`sort-dropdown-item ${sortDirection === "asc" ? "active" : ""}`}
                onClick={() => {
                  setSortDirection("asc");
                  setShowSortDropdown(false);
                }}
              >
                Oldest ↑
              </div>
            </div>
          )}
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

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 0} onClick={() => handlePageChange(page - 1)}>
            Previous
          </button>
          {renderPageNumbers()}
          <button disabled={page === totalPages - 1} onClick={() => handlePageChange(page + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}