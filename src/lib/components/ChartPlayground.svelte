<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Chart from 'chart.js/auto';

	// ─── Types ────────────────────────────────────────────────────────────────
	type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea';

	interface CardConfig {
		id: number;
		title: string;
		subtitle: string;
		type: ChartType;
		realtime: boolean;
		intervalRef?: any;
		chart?: Chart;
		color: string;
		accent: string;
		icon: string;
	}

	// ─── Supabase (optional – swap these with your actual creds) ─────────────
	// import { createClient } from '@supabase/supabase-js';
	// const supabase = createClient('YOUR_URL', 'YOUR_ANON_KEY');
	// async function saveSnapshot(cardId: number, data: number[]) {
	//   await supabase.from('chart_snapshots').insert({ card_id: cardId, data, created_at: new Date() });
	// }

	// ─── Config ───────────────────────────────────────────────────────────────
	const LABELS_WEEK   = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	const LABELS_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
	const LABELS_CAT    = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta'];
	const LABELS_POLAR  = ['Design', 'Dev', 'QA', 'DevOps', 'PM', 'UX'];

	let cards: CardConfig[] = [
		{ id: 1, title: 'Weekly Traffic',    subtitle: 'Page visits per day',          type: 'line',      realtime: false, color: '#6ee7f7', accent: '#0e7490', icon: '📈' },
		{ id: 2, title: 'Revenue Breakdown', subtitle: 'Monthly revenue in $K',        type: 'bar',       realtime: false, color: '#a78bfa', accent: '#6d28d9', icon: '💰' },
		{ id: 3, title: 'Market Share',      subtitle: 'Segment distribution',         type: 'doughnut',  realtime: false, color: '#fb923c', accent: '#c2410c', icon: '🍩' },
		{ id: 4, title: 'Skill Radar',       subtitle: 'Team competency scores',       type: 'radar',     realtime: false, color: '#4ade80', accent: '#15803d', icon: '🕸️' },
		{ id: 5, title: 'Live Metrics',      subtitle: 'Real-time sensor feed',        type: 'line',      realtime: true,  color: '#f472b6', accent: '#be185d', icon: '⚡' },
		{ id: 6, title: 'Polar Analysis',    subtitle: 'Resource allocation overview', type: 'polarArea', realtime: false, color: '#fbbf24', accent: '#b45309', icon: '🎯' },
	];

	let canvases: Record<number, HTMLCanvasElement> = {};

	function getLabels(type: ChartType): string[] {
		if (type === 'radar' || type === 'polarArea') return LABELS_POLAR;
		if (type === 'pie' || type === 'doughnut') return LABELS_CAT;
		return Math.random() > 0.5 ? LABELS_WEEK : LABELS_MONTHS;
	}

	function randomData(n: number, max = 100): number[] {
		return Array.from({ length: n }, () => Math.floor(Math.random() * max) + 10);
	}

	function hexToRgba(hex: string, a: number): string {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return `rgba(${r},${g},${b},${a})`;
	}

	function buildChart(card: CardConfig) {
		const canvas = canvases[card.id];
		if (!canvas) return;
		if (card.chart) card.chart.destroy();

		const labels = getLabels(card.type);
		const data   = randomData(labels.length);
		const isPie  = card.type === 'pie' || card.type === 'doughnut' || card.type === 'polarArea';

		const pieColors = ['#6ee7f7','#a78bfa','#fb923c','#4ade80','#f472b6','#fbbf24'];

		card.chart = new Chart(canvas, {
			type: card.type,
			data: {
				labels,
				datasets: [{
					label: card.title,
					data,
					borderWidth: 2,
					borderColor:            isPie ? pieColors : card.color,
					backgroundColor:        isPie ? pieColors.map(c => hexToRgba(c, 0.75))
					                               : hexToRgba(card.color, 0.15),
					pointBackgroundColor:   card.color,
					pointBorderColor:       '#fff',
					pointRadius:            4,
					pointHoverRadius:       7,
					fill:                   card.type === 'line',
					tension:                0.4,
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				animation: { duration: 600, easing: 'easeInOutCubic' },
				plugins: {
					legend: {
						display: isPie,
						labels: { color: '#cbd5e1', font: { family: 'DM Mono, monospace', size: 11 } }
					},
					tooltip: {
						backgroundColor: '#0f172a',
						titleColor:      card.color,
						bodyColor:       '#e2e8f0',
						borderColor:     card.color,
						borderWidth:     1,
					}
				},
				scales: isPie ? {} : {
					x: {
						ticks:  { color: '#64748b', font: { family: 'DM Mono, monospace', size: 11 } },
						grid:   { color: 'rgba(255,255,255,0.04)' }
					},
					y: {
						ticks:  { color: '#64748b', font: { family: 'DM Mono, monospace', size: 11 } },
						grid:   { color: 'rgba(255,255,255,0.04)' }
					}
				}
			}
		});

		cards = cards; // trigger reactivity
	}

	function changeType(card: CardConfig, type: ChartType) {
		card.type = type;
		buildChart(card);
	}

	function regenerate(card: CardConfig) {
		buildChart(card);
	}

	function toggleRealtime(card: CardConfig) {
		card.realtime = !card.realtime;

		if (card.realtime) {
			card.intervalRef = setInterval(() => {
				if (!card.chart) return;
				const labels = getLabels(card.type);
				card.chart.data.datasets[0].data = randomData(labels.length);
				card.chart.update('active');
			}, 1800);
		} else {
			clearInterval(card.intervalRef);
		}

		cards = cards;
	}

	function removeCard(id: number) {
		const card = cards.find(c => c.id === id);
		if (card) {
			clearInterval(card.intervalRef);
			card.chart?.destroy();
		}
		cards = cards.filter(c => c.id !== id);
	}

	let nextId = 7;
	const CHART_TYPES: ChartType[] = ['line','bar','pie','doughnut','radar','polarArea'];
	const PALETTES = [
		{ color: '#67e8f9', accent: '#0891b2', icon: '🌊' },
		{ color: '#c084fc', accent: '#9333ea', icon: '✨' },
		{ color: '#86efac', accent: '#16a34a', icon: '🌿' },
		{ color: '#fda4af', accent: '#e11d48', icon: '🔥' },
		{ color: '#fed7aa', accent: '#ea580c', icon: '🌅' },
		{ color: '#a5f3fc', accent: '#0284c7', icon: '💎' },
	];

	function addCard() {
		const pal   = PALETTES[Math.floor(Math.random() * PALETTES.length)];
		const type  = CHART_TYPES[Math.floor(Math.random() * CHART_TYPES.length)];
		const names = ['Conversion Rate','Bounce Rate','Session Duration','Error Rate','Latency P99','CPU Usage','Memory Heap','Req/sec'];
		const subs  = ['Last 7 days','Real-time view','Monthly aggregate','Hourly breakdown'];
		const newCard: CardConfig = {
			id:       nextId++,
			title:    names[Math.floor(Math.random() * names.length)],
			subtitle: subs[Math.floor(Math.random() * subs.length)],
			type,
			realtime: false,
			color:    pal.color,
			accent:   pal.accent,
			icon:     pal.icon,
		};
		cards = [...cards, newCard];

		// Mount chart after DOM update
		setTimeout(() => buildChart(newCard), 50);
	}

	onMount(() => {
		cards.forEach(card => buildChart(card));

		// Start auto-realtime cards
		cards.filter(c => c.realtime).forEach(card => {
			card.intervalRef = setInterval(() => {
				if (!card.chart) return;
				const labels = getLabels(card.type);
				card.chart.data.datasets[0].data = randomData(labels.length);
				card.chart.update('active');
			}, 1800);
		});
	});

	onDestroy(() => {
		cards.forEach(card => {
			clearInterval(card.intervalRef);
			card.chart?.destroy();
		});
	});

	const TYPE_ICONS: Record<ChartType, string> = {
		line: '〰', bar: '▊', pie: '◑', doughnut: '◎', radar: '✦', polarArea: '◉'
	};
</script>

<!-- ── Google Fonts ───────────────────────────────────────────────────────── -->
<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet" />
</svelte:head>

<div class="shell">
	<!-- ── Noise / grid overlay ─────────────────────────────────────────────── -->
	<div class="bg-grid" aria-hidden="true"></div>
	<div class="bg-glow g1" aria-hidden="true"></div>
	<div class="bg-glow g2" aria-hidden="true"></div>

	<!-- ── Header ───────────────────────────────────────────────────────────── -->
	<header>
		<div class="header-left">
			<span class="logo-mark">◈</span>
			<div>
				<h1>Chart<span>Lab</span></h1>
				<p class="tagline">Interactive data visualization playground</p>
			</div>
		</div>

		<button class="btn-add" on:click={addCard}>
			<span>+</span> Add Chart
		</button>
	</header>

	<!-- ── Grid ─────────────────────────────────────────────────────────────── -->
	<div class="grid">
		{#each cards as card (card.id)}
			<div class="card" style="--clr: {card.color}; --acc: {card.accent}">

				<!-- card top bar -->
				<div class="card-header">
					<div class="card-title-group">
						<span class="card-icon">{card.icon}</span>
						<div>
							<h3>{card.title}</h3>
							<span class="card-sub">{card.subtitle}</span>
						</div>
					</div>

					<button class="btn-close" on:click={() => removeCard(card.id)} title="Remove card">✕</button>
				</div>

				<!-- chart area -->
				<div class="chart-wrap">
					<canvas bind:this={canvases[card.id]}></canvas>
				</div>

				<!-- controls -->
				<div class="card-controls">
					<!-- type switcher -->
					<div class="type-pills">
						{#each CHART_TYPES as t}
							<button
								class="pill"
								class:active={card.type === t}
								on:click={() => changeType(card, t)}
								title={t}
							>{TYPE_ICONS[t]}</button>
						{/each}
					</div>

					<div class="actions">
						<button class="btn-sm" on:click={() => regenerate(card)}>
							↻ Refresh
						</button>
						<button
							class="btn-sm"
							class:live={card.realtime}
							on:click={() => toggleRealtime(card)}
						>
							{#if card.realtime}
								<span class="pulse-dot"></span> Live
							{:else}
								◉ Go Live
							{/if}
						</button>
					</div>
				</div>

			</div>
		{/each}

		<!-- empty state -->
		{#if cards.length === 0}
			<div class="empty">
				<span>◈</span>
				<p>No charts yet. Add one above.</p>
			</div>
		{/if}
	</div>
</div>

<style>
	/* ── Reset / base ────────────────────────────────────────────────────────── */
	*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

	/* ── Shell ───────────────────────────────────────────────────────────────── */
	.shell {
		position: relative;
		min-height: 100vh;
		background: #070b14;
		color: #e2e8f0;
		font-family: 'DM Mono', monospace;
		padding: 40px 32px 80px;
		overflow-x: hidden;
	}

	/* ── Background decorations ──────────────────────────────────────────────── */
	.bg-grid {
		position: fixed; inset: 0; z-index: 0; pointer-events: none;
		background-image:
			linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
		background-size: 48px 48px;
	}
	.bg-glow {
		position: fixed; z-index: 0; pointer-events: none;
		border-radius: 50%; filter: blur(120px); opacity: .25;
	}
	.g1 { width: 600px; height: 600px; top: -200px; left: -200px; background: #6ee7f7; }
	.g2 { width: 500px; height: 500px; bottom: -150px; right: -100px; background: #a78bfa; }

	/* ── Header ──────────────────────────────────────────────────────────────── */
	header {
		position: relative; z-index: 1;
		display: flex; justify-content: space-between; align-items: center;
		max-width: 1400px; margin: 0 auto 40px;
		padding-bottom: 24px;
		border-bottom: 1px solid rgba(255,255,255,.07);
	}
	.header-left { display: flex; align-items: center; gap: 16px; }
	.logo-mark {
		font-size: 40px;
		background: linear-gradient(135deg, #6ee7f7, #a78bfa);
		-webkit-background-clip: text; -webkit-text-fill-color: transparent;
	}
	h1 {
		font-family: 'Syne', sans-serif;
		font-size: 32px; font-weight: 800; letter-spacing: -1px;
		line-height: 1;
	}
	h1 span { color: #6ee7f7; }
	.tagline { font-size: 12px; color: #475569; margin-top: 4px; }

	.btn-add {
		display: flex; align-items: center; gap: 8px;
		padding: 10px 22px;
		background: linear-gradient(135deg, #6ee7f7, #a78bfa);
		color: #070b14;
		font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px;
		border: none; border-radius: 12px; cursor: pointer;
		transition: opacity .2s, transform .15s;
	}
	.btn-add:hover { opacity: .9; transform: translateY(-1px); }
	.btn-add span { font-size: 18px; line-height: 1; }

	/* ── Grid ────────────────────────────────────────────────────────────────── */
	.grid {
		position: relative; z-index: 1;
		max-width: 1400px; margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
		gap: 24px;
	}

	/* ── Card ────────────────────────────────────────────────────────────────── */
	.card {
		background: rgba(15, 23, 42, 0.75);
		border: 1px solid rgba(255,255,255,.06);
		border-radius: 20px;
		padding: 20px;
		backdrop-filter: blur(16px);
		box-shadow: 0 4px 24px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.05);
		transition: transform .2s, box-shadow .2s;
		display: flex; flex-direction: column; gap: 16px;

		/* accent line on top */
		position: relative; overflow: hidden;
	}
	.card::before {
		content: '';
		position: absolute; top: 0; left: 0; right: 0; height: 2px;
		background: linear-gradient(90deg, transparent, var(--clr), transparent);
		opacity: .7;
	}
	.card:hover {
		transform: translateY(-3px);
		box-shadow: 0 12px 36px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.07);
	}

	/* card header */
	.card-header {
		display: flex; justify-content: space-between; align-items: flex-start;
	}
	.card-title-group { display: flex; align-items: center; gap: 12px; }
	.card-icon { font-size: 22px; }
	h3 {
		font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px;
		color: var(--clr);
	}
	.card-sub { font-size: 10px; color: #475569; }

	.btn-close {
		background: rgba(255,255,255,.05); border: none;
		color: #475569; cursor: pointer; border-radius: 8px;
		width: 28px; height: 28px; font-size: 11px;
		display: flex; align-items: center; justify-content: center;
		transition: background .15s, color .15s; flex-shrink: 0;
	}
	.btn-close:hover { background: rgba(239,68,68,.25); color: #f87171; }

	/* chart */
	.chart-wrap { height: 240px; }

	/* controls row */
	.card-controls {
		display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;
	}

	.type-pills { display: flex; gap: 4px; }
	.pill {
		padding: 5px 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,.07);
		background: rgba(255,255,255,.04); color: #64748b;
		font-size: 12px; cursor: pointer; transition: all .15s;
	}
	.pill.active {
		background: var(--clr); color: #070b14;
		border-color: var(--clr); font-weight: 700;
	}
	.pill:not(.active):hover { border-color: var(--clr); color: var(--clr); }

	.actions { display: flex; gap: 6px; }
	.btn-sm {
		padding: 6px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,.08);
		background: rgba(255,255,255,.04); color: #94a3b8;
		font-family: 'DM Mono', monospace; font-size: 11px; cursor: pointer;
		display: flex; align-items: center; gap: 6px;
		transition: all .15s;
	}
	.btn-sm:hover { border-color: var(--clr); color: var(--clr); }
	.btn-sm.live {
		background: rgba(239,68,68,.15); border-color: #ef4444; color: #f87171;
	}

	/* pulsing live dot */
	.pulse-dot {
		width: 6px; height: 6px; border-radius: 50%;
		background: #ef4444; flex-shrink: 0;
		animation: pulse 1s infinite;
	}
	@keyframes pulse {
		0%,100% { opacity: 1; transform: scale(1); }
		50%      { opacity: .4; transform: scale(1.4); }
	}

	/* empty state */
	.empty {
		grid-column: 1 / -1; text-align: center; padding: 80px;
		color: #334155;
	}
	.empty span { font-size: 48px; display: block; margin-bottom: 12px; }
	.empty p { font-size: 14px; }

	/* ── Responsive ──────────────────────────────────────────────────────────── */
	@media (max-width: 640px) {
		.shell { padding: 24px 16px 60px; }
		header { flex-direction: column; align-items: flex-start; gap: 16px; }
		.grid { grid-template-columns: 1fr; }
	}
</style>