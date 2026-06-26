import "./TrendAnalytic.css";
import { useEffect, useState } from "react";
import axiosClient from "../../../Api/axiosClient";

export default function TrendAnalytic() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [totalPublications, setTotalPublications] = useState(0);
  const [keywords, setKeywords] = useState([]);
  const [monthlyData, setMonthlyData] = useState(Array(12).fill(0));

  useEffect(() => {
    fetchTrendData();
  }, []);

  const fetchTrendData = async () => {
    try {
      const response = await axiosClient.get("/api/member/papers", {
        params: { page: 0, size: 100 },
      });

      const result = response.data?.result;
      const paperList = result?.content || [];

      setPapers(paperList);
      setTotalPublications(result?.totalElements || paperList.length);

      // ===== KEYWORDS =====
      const keywordMap = {};

      paperList.forEach((paper) => {
        paper.keywords?.forEach((keyword) => {
          keywordMap[keyword] = (keywordMap[keyword] || 0) + 1;
        });
      });

      const topKeywords = Object.entries(keywordMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, count]) => ({ name, count }));

      setKeywords(topKeywords);

      // ===== MONTHLY CHART =====
      const monthly = Array(12).fill(0);

      paperList.forEach((paper) => {
        if (paper.createdAt) {
          const month = new Date(paper.createdAt).getMonth();
          monthly[month]++;
        }
      });

      setMonthlyData(monthly);

      setLoading(false);
    } catch (error) {
      console.error("Trend API Error:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="trend-page">
        <h2>Loading Trend Analytics...</h2>
      </div>
    );
  }

  return (
    <div className="trend-page">
      <div className="trend-header">
        <h2>Trend Insights</h2>
      </div>

      <div className="trend-content">
        <div className="left-section">
          <div className="card">
            <h4>TOTAL PUBLICATIONS</h4>
            <h1>{totalPublications}</h1>
            <p className="green">Total papers in system</p>
          </div>

          <div className="card">
            <h4>RESEARCH PAPERS</h4>
            <h1>{papers.length}</h1>
            <p>Current loaded records</p>
          </div>

          <div className="card keyword-card">
            <h3>Top 10 Keywords</h3>

            {keywords.length > 0 ? (
              keywords.map((item, index) => (
                <div className="keyword-row" key={index}>
                  <span>
                    {index + 1}. {item.name}
                  </span>

                  <span className="badge">{item.count}</span>
                </div>
              ))
            ) : (
              <p>No keyword data</p>
            )}
          </div>
        </div>

        <div className="right-section">
          <div className="chart-card">
            <h3>Publication Volume</h3>

            <p>Number of papers created each month</p>

            <div className="chart">
              {monthlyData.map((value, index) => (
                <div className="bar-wrapper" key={index}>
                  <div className="bar" style={{ height: `${value * 15 + 20}px` }} />

                  <span>
                    {
                      [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ][index]
                    }
                  </span>
                </div>
              ))}
            </div>

            <div className="chart-footer">
              <span>■ Monthly Publications</span>
              <span>Source: API</span>
            </div>
          </div>

          <div className="upgrade-banner">
            <div>
              <h4>Research Trend Analysis</h4>

              <p>Data loaded from backend API.</p>
            </div>

            <button onClick={fetchTrendData}>Refresh</button>
          </div>
        </div>
      </div>
    </div>
  );
}