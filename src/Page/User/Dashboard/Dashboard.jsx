import './Dashboard.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../../Services/authService';

const stats = [
	{ label: 'Saved Publications', value: 128 },
	{ label: 'Recent Views', value: 42 },
	{ label: 'Followed Topics', value: 14 },
];

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

	useEffect(() => {
		const loadSuggested = async () => {
			setLoading(true);
			setError("");

			try {
				const res = await authService.getPapers({
					page: 0,
					size: 6,
					sortBy: 'createdAt',
					direction: 'desc',
				});

				const list = res?.result?.content || res?.content || res?.result || [];
				setSuggested(list.slice(0, 3));
			} catch (err) {
				console.error(err);
				setError('Unable to load suggested papers. Please refresh.');
			} finally {
				setLoading(false);
			}
		};

		loadSuggested();
	}, []);

	const topicsList = [
		{ name: 'Machine Learning' },
		{ name: 'Genetics' },
		{ name: 'Biotech' },
		{ name: 'Quantum Computing' },
		{ name: 'AI Ethics' },
	];

	const searchHistory = [
		'Machine Learning in Medicine',
		'Neural-Channel Biology',
		'Quantum Computing Trends',
	];

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
								{topicsList.map((topic, i) => (
									<button key={i} className="topic-tag">{topic.name}</button>
								))}
							</div>
						</div>

						<div className="panel">
							<h3>Search History</h3>
							<div className="history-items">
								{searchHistory.map((item, i) => (
									<div key={i} className="history-item">
										<span>⚙</span>
										{item}
									</div>
								))}
							</div>
						</div>

						<div className="panel chart-panel">
							<h3>Total Paper Per Year</h3>
							<div className="chart-placeholder">
								<div className="chart-bars">
									<div className="bar" style={{ height: '30%' }}></div>
									<div className="bar" style={{ height: '50%' }}></div>
									<div className="bar" style={{ height: '70%' }}></div>
									<div className="bar" style={{ height: '45%' }}></div>
									<div className="bar" style={{ height: '60%' }}></div>
								</div>
							</div>
							<div className="chart-labels">
								<span>2020</span>
								<span>2021</span>
								<span>2022</span>
								<span>2023</span>
								<span>2024</span>
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

