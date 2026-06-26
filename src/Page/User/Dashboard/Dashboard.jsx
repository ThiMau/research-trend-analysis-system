import './Dashboard.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../../Services/authService';


function StatCard({ label, value }) {
	return (
		<div className="stat-card">
			<div className="stat-value-large">{value}</div>
			<div className="stat-label">{label}</div>
		</div>
	);
}

function PaperCard({ paper }) {
	const navigate = useNavigate();
	const paperId = paper?.paperId || paper?.id;

	return (
		<article
			className="paper-card"
			onClick={() => paperId && navigate(`/papers/${encodeURIComponent(paperId)}`)}
			style={{ cursor: paperId ? 'pointer' : 'default' }}
		>
			<div className="paper-header">
				<div className="paper-badge">{paper?.journalName || paper?.source || 'Source'}</div>
				<div className="paper-date">{paper?.publicationYear || paper?.publishedDate || 'N/A'}</div>
			</div>
			<h4 className="paper-title">{paper?.title || paper?.name || 'Untitled'}</h4>
			<p className="paper-excerpt">{paper?.paperAbstract || paper?.abstract || paper?.excerpt || 'No summary available.'}</p>
			<div className="paper-actions">
				<button className="icon-btn">☆</button>
				<button className="icon-btn">⤴</button>
			</div>
		</article>
	);
}

export default function Dashboard() {
	const [suggested, setSuggested] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const [totalPublications, setTotalPublications] = useState(0);
	const [savedPublications, setSavedPublications] = useState(0);

	const [followedTopics, setFollowedTopics] = useState([]);
	const [keywords, setKeywords] = useState([]);
	const [authors, setAuthors] = useState([]);
	const [paperPerYear, setPaperPerYear] = useState([]);

	const stats = [
	{ 
		label: 'Total Publications',
		value: totalPublications, 
	},
	{ 
		label: 'Saved Publications', 
		value: savedPublications, 
	},
	{ 
		label: 'Followed Topics', 
		value: followedTopics.length, 
	},
	{ 
		label: 'Followed Authors', 
		value: authors.length, 
	},
	];

	useEffect(() => {
    const loadDashboard = async () => {
        setLoading(true);
        setError("");

        try {
            // 1. Suggested Papers
            const paperRes = await authService.getPapers({
                page: 0,
                size: 6,
                sortBy: "createdAt",
                direction: "desc",
            });

            const papers =
                paperRes?.result?.content ||
                paperRes?.content ||
                paperRes?.result ||
                [];

            setSuggested(papers.slice(0, 3));

            // 2. Dashboard Statistics
            const statRes = await authService.getDashboardStatistics();
            setTotalPublications(statRes.totalPublications);
            setSavedPublications(statRes.savedPublications);
            setFollowedTopics(statRes.followedTopics || []);

            // 3. Top Keywords
            const keywordRes = await authService.getTopKeywords();
            setKeywords(keywordRes || []);

            // 4. Follow Authors
            const authorRes = await authService.getFollowAuthors();
            setAuthors(authorRes || []);

            // 5. Paper Per Year
            const yearRes = await authService.getPaperPerYear();
            setPaperPerYear(yearRes || []);

        } catch (err) {
            console.error(err);
            setError("Unable to load dashboard.");
        } finally {
            setLoading(false);
        }
    };

    loadDashboard();
}, []);

	return (
		<div className="dashboard-root">
			<main className="dashboard-main">
				<header className="dashboard-header-top">
					<div className="welcome-section">
						<h1 className="welcome-title">Welcome back, Ben.</h1>
						<p className="welcome-subtitle">Reviewing the latest trends in Neural Architecture Search and CRISPR editing.</p>
					</div>
				</header>

				<section className="stats-row">
					{stats.map((s) => (
						<StatCard key={s.label} label={s.label} value={s.value} />
					))}
				</section>

				<section className="content-grid">
					<aside className="left-col">
						<div className="panel">
							<div className="panel-title-row">
								<h3>Followed Topics</h3>
							</div>
							<div className="topics-tags">
								{followedTopics.length === 0 ? (
    							<div>No followed topics.</div>
								) : (
    							followedTopics.map((topic) => (
        						<button
            						key={topic.topicId}
            						className="topic-tag"
        						>
            						{topic.topicName}
        						</button>
    							))
							)}
							</div>
						</div>

						<div className="panel">
    						<h3>Follow Authors</h3>
    						<div className="history-items">
        						{authors.length === 0 ? (
            					<div className="history-item">
                				No followed authors.
            					</div>
        						) : (
            					authors.map((author) => (
                				<div
                    			key={author.authorId}
                    			className="history-item"
                				>
                    			👤 {author.fullName}
                				</div>
            					))
        					)}
    					</div>
					</div>
					
						<div className="panel">
    						<h3>Top 10 Keywords</h3>
    						<div className="history-items">
        						{keywords.map((keyword, index) => (
            					<div 
								key={keyword.keyword || index}
								className="history-item"
								>
                					{keyword.keyword || keyword}
            					</div>
        					))}
    						</div>
						</div>

						<div className="panel chart-panel">
							<h3>Total Paper Per Year</h3>
							<div className="chart-placeholder">
								<div className="chart-bars">
    							{paperPerYear.map(item => (
        						<div
            						key={item.year}
            						className="bar"
            						style={{
                						height: `${(item.total || item.totalPaper || item.count) * 5}px`
            						}}
        						/>
    							))}
							</div>
							</div>
							<div className="chart-labels">
    							{paperPerYear.map(item => (
								<span key={item.year}>
            						{item.year}
        						</span>
							    ))}
							</div>
						</div>
					</aside>

					<section className="right-col">
						<div className="panel suggested">
							<div className="panel-header">
								<h3>Suggested Papers</h3>
								<div className="sort">Sort by Relevance</div>
							</div>

                            <div className="papers-list">
                                {loading && <div>Loading suggested papers...</div>}
                                {error && <div className="error-message">{error}</div>}
                                {!loading && !error && suggested.length === 0 && (
                                    <div>No suggested papers available.</div>
                                )}
                                {!loading && suggested.map((paper) => (
                                    <PaperCard key={paper.paperId || paper.id} paper={paper} />
                                ))}
                            </div>
                        </div>

                        <div className="view-more">View More Suggestions</div>
                    </section>
				</section>
			</main>
		</div>
	);
}

