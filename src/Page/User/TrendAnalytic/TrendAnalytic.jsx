import "./TrendAnalytic.css";
import { useEffect, useState } from "react";
import userService from "../../../Services/userService";
import Filter from "../../../components/Filter/Filter";
import Chart from "../../../components/Chart/Chart";

export default function TrendAnalytic() {
  const [filters, setFilters] = useState({});
  const [publicationTrend, setPublicationTrend] = useState([]);
  const [topKeywords, setTopKeywords] = useState([]);
  const [topJournals, setTopJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCharts(filters);
  }, [filters]);

  const loadCharts = async (filterData) => {
    try {
      setLoading(true);
      setError("");

      const params = {
        keyword: filterData.keyword || undefined,
        journal: filterData.journal || undefined,
        fromYear: filterData.fromYear || undefined,
        toYear: filterData.toYear || undefined,
        fieldId: filterData.fieldId || undefined,
        topicId: filterData.topicId || undefined,
        isOpenAccess: filterData.isOpenAccess === "" ? undefined : filterData.isOpenAccess
      };

      const [trendRes, keywordRes, journalRes,] = await Promise.all([
        userService.getPublicationTrend(params),
        userService.getTopKeywords(),
        userService.getTopJournals(filterData.fieldId),
      ]);

      setPublicationTrend(trendRes.data.result || []);
      setTopKeywords(keywordRes.data.result || []);
      setTopJournals(journalRes.data.result || []);
    } catch (err) {
      console.log(err);
      setError("Unable to load chart data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trend-page">
      <div className="trend-header">
        <h2>Trend Analytics</h2>
        <p>Analyze publication trends using research filters.</p>
      </div>

      <Filter onChange={setFilters} />

      {loading && <div className="trend-loading">Loading charts...</div>}
      {error && <div className="trend-error">{error}</div>}

      {!loading && !error && (
        <Chart
          publicationTrend={publicationTrend}
          topKeywords={topKeywords}
          topJournals={topJournals}
        />
      )}
    </div>
  );
}