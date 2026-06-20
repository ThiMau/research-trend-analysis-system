import "./TrendAnalytic.css";

const keywords = [
  { name: "Quantum Computing", count: "2.4k" },
  { name: "Neural Networks", count: "1.9k" },
  { name: "Bio-Ethics", count: "1.5k" },
  { name: "Climate Modeling", count: "1.2k" },
  { name: "Circular Economy", count: "1.1k" },
  { name: "Cryptography", count: "980" },
  { name: "Genomics", count: "850" },
  { name: "Renewable Energy", count: "720" },
  { name: "Sociology of Media", count: "640" },
  { name: "Data Privacy", count: "590" },
];

const monthlyData = [
  1300, 900, 1500, 1100, 1800, 1600,
  1400, 1200, 1700, 1900, 1400, 800,
];

export default function TrendAnalytic() {
  return (
    <div className="trend-page">
      <div className="trend-header">
        <h2>Trend Insights (Basic)</h2>
      </div>

      <div className="trend-content">

        {/* LEFT */}
        <div className="left-section">

          <div className="card">
            <h4>TOTAL PUBLICATIONS (2024)</h4>
            <h1>12,482</h1>
            <p className="green">↗ +4.2% from prev. year</p>
          </div>

          <div className="card">
            <h4>GROWTH RATE (L12M)</h4>
            <h1>8.5%</h1>
            <p>Steady academic interest</p>
          </div>

          <div className="card keyword-card">
            <h3>Top 10 Research Keywords</h3>

            {keywords.map((item, index) => (
              <div className="keyword-row" key={index}>
                <span>
                  {index + 1}. {item.name}
                </span>

                <span className="badge">
                  {item.count}
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT */}
        <div className="right-section">

          <div className="chart-card">
            <h3>Publication Volume (2024)</h3>
            <p>
              Monthly breakdown of peer-reviewed journal entries
            </p>

            <div className="chart">

              {monthlyData.map((value, index) => (
                <div className="bar-wrapper" key={index}>
                  <div
                    className="bar"
                    style={{ height: `${value / 10}px` }}
                  />
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
              <span>■ 2024 Monthly Count</span>
              <span>Source: GAD</span>
            </div>
          </div>

          <div className="upgrade-banner">
            <div>
              <h4>Unlock Global Comparisons</h4>
              <p>
                Upgrade to Premium to compare multi-year trends.
              </p>
            </div>

            <button>Learn More</button>
          </div>

        </div>
      </div>
    </div>
  );
}