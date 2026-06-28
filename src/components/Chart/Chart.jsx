import "./Chart.css";

export default function Chart({
    publicationTrend = [],
    topKeywords = [],
    topJournals = []
}) {
    const maxPublication = Math.max(
        ...publicationTrend.map(i => i.count),
        1
    );

    const maxKeyword = Math.max(
        ...topKeywords.map(i => i.paperCount),
        1
    );

    const maxJournal = Math.max(
        ...topJournals.map(i => i.paperCount),
        1
    );

    return (
        <div className="trend-chart-container">
            {/* ================= Publication Trend ================= */}
            <div className="chart-card">
                <h2>Publication Growth Over Time</h2>
                <div className="publication-chart">
                    {publicationTrend.map(item => (
                        <div key={item.year} className="publication-column">
                            <div
                                className="publication-bar"
                                style={{ height: `${(item.count / maxPublication) * 260}px` }}
                            />
                            <span>{item.year}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ================= Top Keywords ================= */}
            <div className="chart-card">
                <h2>Top Keywords</h2>
                {topKeywords.map(item => (
                    <div key={item.keywordName} className="horizontal-row">
                        <div className="label">{item.keywordName}</div>
                        <div className="progress">
                            <div
                                className="progress-fill"
                                style={{ width: `${(item.paperCount / maxKeyword) * 100}%` }}
                            />
                        </div>
                        <span>{item.paperCount}</span>
                    </div>
                ))}
            </div>

            {/* ================= Top Journals ================= */}
            <div className="chart-card">
                <h2>Top Publishing Journals</h2>
                {topJournals.map(item => (
                    <div key={item.journalName} className="horizontal-row">
                        <div className="label">{item.journalName}</div>
                        <div className="progress">
                            <div
                                className="progress-fill"
                                style={{ width: `${(item.paperCount / maxJournal) * 100}%` }}
                            />
                        </div>
                        <span>{item.paperCount}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}