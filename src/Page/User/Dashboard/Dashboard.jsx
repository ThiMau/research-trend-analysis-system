import './Dashboard.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../../Services/userService';
import premiumService from '../../../Services/premiumService';
import bookmarkService from '../../../Services/bookmarkService';
import Chart from '../../../components/Chart/Chart';

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
	const navigate = useNavigate();
	const [user, setUser] = useState(null);

	const [totalPapers, setTotalPapers] = useState(0);

	const [followTopics, setFollowTopics] = useState([]);

	const [savedPapers, setSavedPapers] = useState(0);

	const [followAuthors, setFollowAuthors] = useState([]);

	const [followJournals, setFollowJournals] = useState([]);

	const [publicationTrends, setPublicationTrends] = useState([]);

	const [subscription, setSubscription] = useState(null);

	const [suggested, setSuggested] = useState([]);

	const [loading, setLoading] = useState(true);

	const [error, setError] = useState("");

	useEffect(() => {

		const loadDashboard = async () => {

			try {

				setLoading(true);

				const [
					me,
					topics,
					authors,
					journals,
					trends,
					sub,
					suggestedRes
				] = await Promise.all([
					userService.getMe().catch(err => { console.error("getMe failed", err); return null; }),
					userService.getFollowTopics().catch(err => { console.error("getFollowTopics failed", err); return { result: [] }; }),
					userService.getFollowAuthors().catch(err => { console.error("getFollowAuthors failed", err); return { result: [] }; }),
					userService.getFollowJournals().catch(err => { console.error("getFollowJournals failed", err); return { result: [] }; }),
					userService.getPublicationTrend().catch(err => { console.error("getPublicationTrend failed", err); return { result: [] }; }),
					premiumService.getCurrentSubscription().catch(err => {
						if (err.response?.status !== 404) {
							console.error("getCurrentSubscription failed", err);
						}
						return null;
					}),
					userService.getPapers({ page: 0, size: 5 }).catch(err => { console.error("getPapers failed", err); return { result: { content: [] } }; })
				]);

				setUser(me?.result || me || null);
				setFollowTopics(topics?.result || []);

				setFollowAuthors(authors?.result || []);

				setFollowJournals(journals?.result || []);

				setSubscription(sub?.result || null);
				setPublicationTrends(trends?.result || []);
				
				const suggestedList = suggestedRes?.result?.content || suggestedRes?.result || [];
				setSuggested(suggestedList);
				setTotalPapers(suggestedRes?.result?.totalElements || suggestedList.length || 0);

				// Calculate Saved Publications count from folders
				try {
					const foldersRes = await bookmarkService.getFolders();
					const foldersList = foldersRes.data?.result || [];
					const papersPromises = foldersList.map(folder =>
						bookmarkService.getFolderPapers(folder.folderId)
							.then(res => res.data?.result || [])
							.catch(() => [])
					);
					const papersLists = await Promise.all(papersPromises);
					const totalSaved = papersLists.reduce((sum, list) => sum + list.length, 0);
					setSavedPapers(totalSaved);
				} catch (err) {
					console.error("Failed to calculate saved papers count", err);
				}
			}
			catch (err) {

				console.error(err);
				setError("Failed to load dashboard data.");

			}
			finally {

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
						<h1 className="welcome-title">Welcome {user?.fullName || user?.username || "User"}</h1>
						<p className="welcome-subtitle">Reviewing the latest trends in Neural Architecture Search and CRISPR editing.</p>
					</div>
				</header>

				<section className="stats-row">
					<StatCard
						label="Total Publications"
						value={totalPapers}
					/>

					<StatCard
						label="Saved Publications"
						value={savedPapers}
					/>

					<StatCard
						label="Followed Topics"
						value={followTopics.length}
					/>

					<StatCard
						label="Followed Authors"
						value={followAuthors.length}
					/>
				</section>

				<section className="content-grid">
					<aside className="left-col">
						<div className="panel">
							<div className="panel-title-row">
								<h3>Followed Topics</h3>
							</div>

							<div className="topics-tags">

								{followTopics.length === 0 && (
									<div className="empty-panel">
										No followed topics.
									</div>
								)}

								{followTopics.map((topic) => (
									<button
										key={topic.topicId}
										className="topic-tag"
										onClick={() => navigate(`/topics/${topic.topicId}`)}
										style={{ cursor: 'pointer' }}
									>
										{topic.topicName}
									</button>
								))}

							</div>

						</div>

						<div className="panel">

							<h3>Followed Authors</h3>

							<div className="history-items">

								{followAuthors.length === 0 && (
									<div className="empty-panel">
										No followed authors.
									</div>
								)}

								{followAuthors.map((author) => (

									<div
										key={author.authorId}
										className="history-item"
										onClick={() => navigate(`/authors/${author.authorId}`)}
										style={{ cursor: 'pointer' }}
									>

										<span>👤</span>

										<span className="history-name">
											{author.authorName}
										</span>

									</div>

								))}

							</div>

						</div>
						<div className="panel">

							<h3>Followed Journals</h3>

							<div className="history-items">

								{followJournals.length === 0 && (
									<div className="empty-panel">
										No followed journals.
									</div>
								)}

								{followJournals.map((journal) => (

									<div
										key={journal.journalId}
										className="history-item"
										onClick={() => navigate(`/journals/${journal.journalId}`)}
										style={{ cursor: 'pointer' }}
									>

										<span>📚</span>

										<span className="history-name">
											{journal.journalName}
										</span>

									</div>

								))}

							</div>

						</div>

						<div className="panel">

							<h3>Premium Subscription</h3>

							{subscription?.premium ? (

								<div className="premium-info">

									<div className="premium-badge" style={{ marginBottom: '12px', display: 'inline-block' }}>
										PREMIUM ACTIVE
									</div>

									<table className="premium-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px', fontSize: '13px' }}>
										<tbody>
											<tr style={{ borderBottom: '1px solid #eee' }}>
												<td style={{ padding: '6px 0', color: '#666' }}>Plan</td>
												<td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 'bold' }}>{subscription.packageName}</td>
											</tr>
											<tr style={{ borderBottom: '1px solid #eee' }}>
												<td style={{ padding: '6px 0', color: '#666' }}>Status</td>
												<td style={{ padding: '6px 0', textAlign: 'right', color: '#2e7d32', fontWeight: 'bold' }}>{subscription.status || 'ACTIVE'}</td>
											</tr>
											<tr style={{ borderBottom: '1px solid #eee' }}>
												<td style={{ padding: '6px 0', color: '#666' }}>Start Date</td>
												<td style={{ padding: '6px 0', textAlign: 'right' }}>
													{subscription.startDate ? new Date(subscription.startDate).toLocaleDateString() : '-'}
												</td>
											</tr>
											<tr>
												<td style={{ padding: '6px 0', color: '#666' }}>Expiry Date</td>
												<td style={{ padding: '6px 0', textAlign: 'right', fontWeight: '500' }}>
													{subscription.endDate ? new Date(subscription.endDate).toLocaleDateString() : '-'}
												</td>
											</tr>
										</tbody>
									</table>

								</div>

							) : (

								<div className="premium-info">

									<p>
										Upgrade your account to unlock Premium features.
									</p>

									<button
										className="premium-btn"
										onClick={() => navigate("/premium")}
									>
										Upgrade
									</button>

								</div>

							)}

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