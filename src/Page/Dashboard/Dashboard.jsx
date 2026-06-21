import React from 'react';
import './Dashboard.css';

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

function PaperCard({ title, source, meta, excerpt }) {
	return (
		<article className="paper-card">
			<div className="paper-header">
				<div className="paper-badge">{source}</div>
				<div className="paper-date">{meta}</div>
			</div>
			<h4 className="paper-title">{title}</h4>
			<p className="paper-excerpt">{excerpt}</p>
			<div className="paper-actions">
				<button className="icon-btn">☆</button>
				<button className="icon-btn">⤴</button>
			</div>
		</article>
	);
}

export default function Dashboard() {
	const suggested = [
		{
			title: 'Advancements in Single–Cell CRISPR Screens for Genetic Discovery',
			source: 'Nature Biotechnology',
			meta: 'Oct 2024',
			excerpt:
				'This study explores the integration of single-cell sequencing with large-scale CRISPR interference to map regulatory landscapes of human fibroblasts...',
		},
		{
			title: 'Large Language Models as Predictive Engines for Molecular Dynamics',
			source: 'ArXiv',
			meta: 'Nov 2024',
			excerpt:
				'We present a novel architecture that leverages the attention mechanisms of transformers to predict protein folding paths with high temporal resolution...',
		},
		{
			title: 'The Impact of Algorithmic Bias on Genomic Metadata Classification',
			source: 'Cell Systems',
			meta: 'Sept 2024',
			excerpt:
				'Meta-analysis of cross-institutional datasets reveals systematic biases in automated labeling protocols for rare genetic variants...',
		},
	];

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
					<div className="search-wrap">
						<input className="search-input" placeholder="Search publications..." />
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
								{suggested.map((p, i) => (
									<PaperCard key={i} title={p.title} source={p.source} meta={p.meta} excerpt={p.excerpt} />
								))}
							</div>

							<div className="view-more">View More Suggestions</div>
						</div>
					</section>
				</section>
			</main>
		</div>
	);
}

