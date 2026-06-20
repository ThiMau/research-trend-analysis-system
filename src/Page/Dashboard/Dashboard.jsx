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
			<div className="stat-value">{value}</div>
			<div className="stat-label">{label}</div>
		</div>
	);
}

function PaperCard({ title, source, meta, excerpt }) {
	return (
		<article className="paper-card">
			<div className="paper-meta">{source} • {meta}</div>
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

	return (
		<div className="dashboard-root">
			<aside className="dashboard-sidebar">
				<div className="brand">TrendTrack</div>
				<nav className="nav">
					<button className="nav-item active">Dashboard</button>
					<button className="nav-item">Search</button>
					<button className="nav-item">Trend Analytics</button>
					<button className="nav-item">My Library</button>
					<button className="nav-item">Report</button>
				</nav>
				<div className="sidebar-footer">
					<button className="footer-btn">Help Center</button>
					<button className="footer-btn">Contact Support</button>
				</div>
			</aside>

			<main className="dashboard-main">
				<header className="dashboard-header">
					<div className="search-wrap">
						<input className="search-input" placeholder="Search publications..." />
					</div>
					<div className="welcome">Welcome back, Ben.</div>
				</header>

				<section className="stats-row">
					{stats.map((s) => (
						<StatCard key={s.label} label={s.label} value={s.value} />
					))}
				</section>

				<section className="content-grid">
					<aside className="left-col">
						<div className="panel">
							<h3>Followed Topics</h3>
							<ul className="topics-list">
								<li>Machine Learning <span className="count">42 papers</span></li>
								<li>Genetics <span className="count">28 papers</span></li>
								<li>BioTech <span className="count">15 papers</span></li>
							</ul>
						</div>

						<div className="panel">
							<h3>Search History</h3>
							<ul className="history-list">
								<li>CRISPR single-cell</li>
								<li>Transformer architectures</li>
								<li>Genomic metadata</li>
							</ul>
						</div>

						<div className="panel chart-panel">
							<h3>Total Paper Per Year</h3>
							<div className="chart-placeholder">(chart)</div>
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

