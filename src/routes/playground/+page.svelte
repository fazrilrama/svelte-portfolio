<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Chart from 'chart.js/auto';

	let canvas: HTMLCanvasElement;
	let chart: Chart;
	let chartType: 'line' | 'bar' | 'pie' = 'line';
	let realtime = false;
	let intervalRef: any;

	const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

	function randomData() {
		return labels.map(() => Math.floor(Math.random() * 100));
	}

	function buildDataset() {
		return {
			label: 'Analytics Demo',
			data: randomData(),
			borderWidth: 2
		};
	}

	function createChart() {
		if (chart) chart.destroy();

		chart = new Chart(canvas, {
			type: chartType,
			data: {
				labels,
				datasets: [buildDataset()]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				animation: {
					duration: 500
				}
			}
		});
	}

	function regenerate() {
		createChart();
	}

	function toggleRealtime() {
		realtime = !realtime;

		if (realtime) {
			intervalRef = setInterval(() => {
				if (!chart) return;
				chart.data.datasets[0].data = randomData();
				chart.update();
			}, 2000);
		} else {
			clearInterval(intervalRef);
		}
	}

	function changeType(type: 'line' | 'bar' | 'pie') {
		chartType = type;
		createChart();
	}

	onMount(createChart);
	onDestroy(() => clearInterval(intervalRef));
</script>

<div class="card">
	<div class="top">
		<h2>Chart Visualization Playground</h2>

		<div class="controls">
			<select bind:value={chartType} on:change={() => changeType(chartType)}>
				<option value="line">Line</option>
				<option value="bar">Bar</option>
				<option value="pie">Pie</option>
			</select>

			<button on:click={regenerate}>
				New Data
			</button>

			<button class:active={realtime} on:click={toggleRealtime}>
				{realtime ? 'Stop Live' : 'Live Mode'}
			</button>
		</div>
	</div>

	<div class="chartBox">
		<canvas bind:this={canvas}></canvas>
	</div>
</div>

<style>
	.card {
		background: rgba(255,255,255,0.05);
		border-radius: 20px;
		padding: 24px;
		max-width: 800px;
		margin: auto;
		backdrop-filter: blur(12px);
		box-shadow: 0 10px 30px rgba(0,0,0,0.2);
	}

	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 12px;
		margin-bottom: 20px;
	}

	h2 {
		margin: 0;
		font-size: 24px;
	}

	.controls {
		display: flex;
		gap: 10px;
	}

	select, button {
		padding: 8px 14px;
		border-radius: 10px;
		border: none;
		font-weight: 600;
		cursor: pointer;
	}

	button {
		background: #ffffff15;
		color: white;
	}

	button.active {
		background: #ff4d4f;
	}

	.chartBox {
		height: 400px;
	}
</style>
