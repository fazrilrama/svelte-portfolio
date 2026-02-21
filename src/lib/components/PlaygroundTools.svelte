<script lang="ts">
	// ── Types ─────────────────────────────────────────────────────────────────
	type ToolId = 'regex' | 'json' | 'base64' | 'diff' | 'hash' | 'url';

	interface Tool {
		id: ToolId;
		icon: string;
		label: string;
		sub: string;
		color: string;
	}

	// ── Tools config ──────────────────────────────────────────────────────────
	const TOOLS: Tool[] = [
		{ id: 'regex',  icon: '∕∗',  label: 'Regex Tester',     sub: 'Test & highlight matches',    color: '#f472b6' },
		{ id: 'json',   icon: '{ }', label: 'JSON Formatter',   sub: 'Prettify & validate JSON',    color: '#6ee7f7' },
		{ id: 'base64', icon: '64',  label: 'Base64',           sub: 'Encode & decode strings',     color: '#a78bfa' },
		{ id: 'diff',   icon: '±',   label: 'Text Diff',        sub: 'Compare two text blocks',     color: '#4ade80' },
		{ id: 'hash',   icon: '#',   label: 'Hash Generator',   sub: 'SHA-256, MD5 & more',         color: '#fbbf24' },
		{ id: 'url',    icon: '⇄',   label: 'URL En/Decoder',   sub: 'Encode & decode URLs',        color: '#fb923c' },
	];

	let activeTool: ToolId = 'regex';

	// ─────────────────────────────────────────────────────────────────────────
	// 1. REGEX TESTER
	// ─────────────────────────────────────────────────────────────────────────
	let regexPattern   = '\\b\\w{4}\\b';
	let regexFlags     = 'gi';
	let regexInput     = 'The quick brown fox jumps over the lazy dog near the big tree';
	let regexError: string | null = null;

	interface RegexMatch { start: number; end: number; text: string; groups: string[] }
	let regexMatches: RegexMatch[] = [];

	$: {
		regexMatches = [];
		regexError   = null;
		if (regexPattern) {
			try {
				const re = new RegExp(regexPattern, regexFlags.includes('g') ? regexFlags : regexFlags + 'g');
				let m;
				while ((m = re.exec(regexInput)) !== null) {
					regexMatches.push({ start: m.index, end: m.index + m[0].length, text: m[0], groups: m.slice(1) });
					if (!regexFlags.includes('g')) break;
				}
			} catch (e: any) { regexError = e.message; }
		}
	}

	function highlightRegex(text: string, matches: RegexMatch[]): string {
		if (!matches.length) return escHtml(text);
		let out = ''; let cursor = 0;
		for (const m of matches) {
			out += escHtml(text.slice(cursor, m.start));
			out += `<mark>${escHtml(m.text)}</mark>`;
			cursor = m.end;
		}
		out += escHtml(text.slice(cursor));
		return out;
	}

	// ─────────────────────────────────────────────────────────────────────────
	// 2. JSON FORMATTER
	// ─────────────────────────────────────────────────────────────────────────
	let jsonRaw = `{"name":"fazrilrama","role":"Full Stack Engineer","skills":["Svelte","Vue","Laravel","Go"],"open_to_work":true}`;
	let jsonIndent = 2;
	let jsonError: string | null = null;
	let jsonOutput = '';
	let jsonCopied = false;

	$: {
		jsonError = null;
		try {
			jsonOutput = JSON.stringify(JSON.parse(jsonRaw), null, jsonIndent);
		} catch (e: any) {
			jsonError  = e.message;
			jsonOutput = '';
		}
	}

	async function copyJson() {
		await navigator.clipboard.writeText(jsonOutput);
		jsonCopied = true;
		setTimeout(() => jsonCopied = false, 1500);
	}

	function minifyJson() {
		try { jsonRaw = JSON.stringify(JSON.parse(jsonRaw)); }
		catch {}
	}

	// ─────────────────────────────────────────────────────────────────────────
	// 3. BASE64
	// ─────────────────────────────────────────────────────────────────────────
	let b64Mode: 'encode' | 'decode' = 'encode';
	let b64Input  = 'Hello, fazrilrama!';
	let b64Output = '';
	let b64Error: string | null = null;
	let b64Copied = false;

	$: {
		b64Error = null;
		try {
			b64Output = b64Mode === 'encode'
				? btoa(unescape(encodeURIComponent(b64Input)))
				: decodeURIComponent(escape(atob(b64Input)));
		} catch (e: any) { b64Error = 'Invalid input for decoding'; b64Output = ''; }
	}

	async function copyB64() {
		await navigator.clipboard.writeText(b64Output);
		b64Copied = true;
		setTimeout(() => b64Copied = false, 1500);
	}

	// ─────────────────────────────────────────────────────────────────────────
	// 4. TEXT DIFF
	// ─────────────────────────────────────────────────────────────────────────
	let diffA = `The quick brown fox
jumps over the lazy dog
near the riverbank`;
	let diffB = `The quick red fox
leaps over the lazy cat
near the riverbank
on a sunny day`;

	interface DiffLine { type: 'same' | 'add' | 'remove'; text: string }

	$: diffResult = computeDiff(diffA, diffB);

	function computeDiff(a: string, b: string): DiffLine[] {
		const la = a.split('\n'), lb = b.split('\n');
		const out: DiffLine[] = [];
		const maxLen = Math.max(la.length, lb.length);
		for (let i = 0; i < maxLen; i++) {
			if (la[i] === undefined)       out.push({ type: 'add',    text: lb[i] });
			else if (lb[i] === undefined)  out.push({ type: 'remove', text: la[i] });
			else if (la[i] === lb[i])      out.push({ type: 'same',   text: la[i] });
			else {
				out.push({ type: 'remove', text: la[i] });
				out.push({ type: 'add',    text: lb[i] });
			}
		}
		return out;
	}

	// ─────────────────────────────────────────────────────────────────────────
	// 5. HASH GENERATOR
	// ─────────────────────────────────────────────────────────────────────────
	let hashInput = 'fazrilrama';
	let hashResults: Record<string, string> = {};
	let hashLoading = false;

	async function computeHashes() {
		if (!hashInput) return;
		hashLoading = true;
		hashResults = {};
		const enc = new TextEncoder();
		const data = enc.encode(hashInput);
		const algos: [string, string][] = [
			['SHA-1', 'SHA-1'], ['SHA-256', 'SHA-256'], ['SHA-384', 'SHA-384'], ['SHA-512', 'SHA-512']
		];
		for (const [label, algo] of algos) {
			const buf    = await crypto.subtle.digest(algo, data);
			const hex    = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
			hashResults[label] = hex;
		}
		hashLoading = false;
		hashResults = hashResults;
	}

	// ─────────────────────────────────────────────────────────────────────────
	// 6. URL ENCODER / DECODER
	// ─────────────────────────────────────────────────────────────────────────
	let urlMode: 'encode' | 'decode' = 'encode';
	let urlInput  = 'https://example.com/search?q=hello world&lang=en&tag=svelte+dev';
	let urlOutput = '';
	let urlError: string | null = null;
	let urlCopied = false;

	$: {
		urlError = null;
		try {
			urlOutput = urlMode === 'encode' ? encodeURIComponent(urlInput) : decodeURIComponent(urlInput);
		} catch (e: any) { urlError = 'Invalid encoded URL'; urlOutput = ''; }
	}

	async function copyUrl() {
		await navigator.clipboard.writeText(urlOutput);
		urlCopied = true;
		setTimeout(() => urlCopied = false, 1500);
	}

	// ─────────────────────────────────────────────────────────────────────────
	// Helpers
	// ─────────────────────────────────────────────────────────────────────────
	function escHtml(s: string): string {
		return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
	}

	$: activeToolMeta = TOOLS.find(t => t.id === activeTool)!;
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
</svelte:head>

<section class="pg-root">
	<div class="bg-grid"  aria-hidden="true"></div>
	<div class="bg-glow2" aria-hidden="true"></div>

	<div class="inner">

		<!-- ── Section header ─────────────────────────────────────────────── -->
		<div class="section-label">
			<span class="label-icon">⌥</span>
			<span>Dev Playground</span>
		</div>

		<p class="section-desc">Quick tools for everyday development tasks.</p>

		<!-- ── Tool picker cards ──────────────────────────────────────────── -->
		<div class="tool-picker">
			{#each TOOLS as tool}
				<button
					class="tool-chip"
					class:active={activeTool === tool.id}
					style="--tc: {tool.color}"
					on:click={() => activeTool = tool.id}
				>
					<span class="chip-icon">{tool.icon}</span>
					<span class="chip-label">{tool.label}</span>
				</button>
			{/each}
		</div>

		<!-- ── Active tool panel ──────────────────────────────────────────── -->
		<div class="panel" style="--tc: {activeToolMeta.color}">
			<div class="panel-header">
				<span class="panel-icon">{activeToolMeta.icon}</span>
				<div>
					<h3>{activeToolMeta.label}</h3>
					<span class="panel-sub">{activeToolMeta.sub}</span>
				</div>
			</div>

			<!-- ── REGEX ──────────────────────────────────────────────────── -->
			{#if activeTool === 'regex'}
				<div class="tool-body">
					<div class="row2">
						<div class="field flex1">
							<label>Pattern</label>
							<div class="input-wrap">
								<span class="input-prefix">/</span>
								<input bind:value={regexPattern} spellcheck="false" placeholder="\\w+" />
								<span class="input-suffix">/</span>
							</div>
						</div>
						<div class="field" style="width:90px">
							<label>Flags</label>
							<input bind:value={regexFlags} spellcheck="false" placeholder="gi" maxlength="6" />
						</div>
					</div>

					<div class="field">
						<label>Test string</label>
						<textarea bind:value={regexInput} rows="4" spellcheck="false"></textarea>
					</div>

					{#if regexError}
						<div class="error-bar">⚠ {regexError}</div>
					{:else}
						<div class="result-bar">
							<span class="match-count" class:zero={!regexMatches.length}>
								{regexMatches.length} match{regexMatches.length !== 1 ? 'es' : ''}
							</span>
						</div>

						<div class="highlight-box">
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html highlightRegex(regexInput, regexMatches)}
						</div>

						{#if regexMatches.length}
							<div class="match-list">
								{#each regexMatches as m, i}
									<span class="match-pill">
										<span class="match-idx">{i+1}</span>
										{m.text}
									</span>
								{/each}
							</div>
						{/if}
					{/if}
				</div>

			<!-- ── JSON ───────────────────────────────────────────────────── -->
			{:else if activeTool === 'json'}
				<div class="tool-body">
					<div class="row2">
						<div class="field flex1">
							<label>Raw JSON</label>
							<textarea bind:value={jsonRaw} rows="6" spellcheck="false"></textarea>
						</div>
						<div class="field flex1">
							<div class="label-row">
								<label>Output</label>
								<div class="action-row">
									<button class="mini-btn" on:click={minifyJson}>Minify</button>
									<button class="mini-btn" on:click={copyJson}>{jsonCopied ? '✓ Copied' : '⎘ Copy'}</button>
								</div>
							</div>
							{#if jsonError}
								<div class="error-bar">⚠ {jsonError}</div>
							{:else}
								<textarea readonly value={jsonOutput} rows="6" class="readonly"></textarea>
							{/if}
						</div>
					</div>
					<div class="field" style="max-width:200px">
						<label>Indent: {jsonIndent}</label>
						<input type="range" min="1" max="8" bind:value={jsonIndent} />
					</div>
				</div>

			<!-- ── BASE64 ─────────────────────────────────────────────────── -->
			{:else if activeTool === 'base64'}
				<div class="tool-body">
					<div class="mode-toggle">
						<button class="mode-btn" class:active={b64Mode==='encode'} on:click={() => b64Mode='encode'}>Encode →</button>
						<button class="mode-btn" class:active={b64Mode==='decode'} on:click={() => b64Mode='decode'}>← Decode</button>
					</div>

					<div class="row2">
						<div class="field flex1">
							<label>{b64Mode === 'encode' ? 'Plain text' : 'Base64 string'}</label>
							<textarea bind:value={b64Input} rows="5" spellcheck="false"></textarea>
						</div>
						<div class="field flex1">
							<div class="label-row">
								<label>{b64Mode === 'encode' ? 'Base64 output' : 'Decoded text'}</label>
								<button class="mini-btn" on:click={copyB64}>{b64Copied ? '✓ Copied' : '⎘ Copy'}</button>
							</div>
							{#if b64Error}
								<div class="error-bar">⚠ {b64Error}</div>
							{:else}
								<textarea readonly value={b64Output} rows="5" class="readonly"></textarea>
							{/if}
						</div>
					</div>
				</div>

			<!-- ── DIFF ───────────────────────────────────────────────────── -->
			{:else if activeTool === 'diff'}
				<div class="tool-body">
					<div class="row2">
						<div class="field flex1">
							<label>Text A (original)</label>
							<textarea bind:value={diffA} rows="6" spellcheck="false"></textarea>
						</div>
						<div class="field flex1">
							<label>Text B (modified)</label>
							<textarea bind:value={diffB} rows="6" spellcheck="false"></textarea>
						</div>
					</div>

					<div class="diff-output">
						{#each diffResult as line}
							<div class="diff-line diff-{line.type}">
								<span class="diff-gutter">
									{line.type === 'add' ? '+' : line.type === 'remove' ? '−' : ' '}
								</span>
								<span>{line.text || ' '}</span>
							</div>
						{/each}
					</div>

					<div class="diff-legend">
						<span class="leg add">+ Added</span>
						<span class="leg remove">− Removed</span>
						<span class="leg same">·· Unchanged</span>
					</div>
				</div>

			<!-- ── HASH ───────────────────────────────────────────────────── -->
			{:else if activeTool === 'hash'}
				<div class="tool-body">
					<div class="field">
						<label>Input string</label>
						<div class="input-btn-row">
							<input bind:value={hashInput} spellcheck="false" placeholder="Type something…" on:input={() => hashResults={}} />
							<button class="btn-compute" on:click={computeHashes}>
								{hashLoading ? '…' : '# Compute'}
							</button>
						</div>
					</div>

					{#if Object.keys(hashResults).length}
						<div class="hash-results">
							{#each Object.entries(hashResults) as [algo, hex]}
								<div class="hash-row">
									<span class="hash-algo">{algo}</span>
									<code class="hash-val">{hex}</code>
									<button class="icon-btn" on:click={() => navigator.clipboard.writeText(hex)}>⎘</button>
								</div>
							{/each}
						</div>
					{:else}
						<div class="empty-hint">Click "# Compute" to generate hashes</div>
					{/if}
				</div>

			<!-- ── URL ────────────────────────────────────────────────────── -->
			{:else if activeTool === 'url'}
				<div class="tool-body">
					<div class="mode-toggle">
						<button class="mode-btn" class:active={urlMode==='encode'} on:click={() => urlMode='encode'}>Encode →</button>
						<button class="mode-btn" class:active={urlMode==='decode'} on:click={() => urlMode='decode'}>← Decode</button>
					</div>
					<div class="row2">
						<div class="field flex1">
							<label>{urlMode === 'encode' ? 'Raw URL / string' : 'Encoded URL'}</label>
							<textarea bind:value={urlInput} rows="4" spellcheck="false"></textarea>
						</div>
						<div class="field flex1">
							<div class="label-row">
								<label>{urlMode === 'encode' ? 'Encoded output' : 'Decoded URL'}</label>
								<button class="mini-btn" on:click={copyUrl}>{urlCopied ? '✓ Copied' : '⎘ Copy'}</button>
							</div>
							{#if urlError}
								<div class="error-bar">⚠ {urlError}</div>
							{:else}
								<textarea readonly value={urlOutput} rows="4" class="readonly"></textarea>
							{/if}
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

	.pg-root {
		position: relative;
		background: #070b14;
		color: #e2e8f0;
		font-family: 'DM Mono', monospace;
		padding: 60px 24px 80px;
		overflow: hidden;
	}

	.inner {
		position: relative; z-index: 1;
		max-width: 960px; margin: 0 auto;
		display: flex; flex-direction: column; gap: 28px;
	}

	/* BG */
	.bg-grid {
		position: absolute; inset: 0; pointer-events: none;
		background-image: radial-gradient(rgba(255,255,255,.03) 1px, transparent 1px);
		background-size: 28px 28px;
	}
	.bg-glow2 {
		position: absolute; bottom: -200px; left: -200px;
		width: 600px; height: 600px; border-radius: 50%;
		background: #a78bfa; filter: blur(140px); opacity: .08;
		pointer-events: none;
	}

	/* Section header */
	.section-label {
		display: inline-flex; align-items: center; gap: 8px;
		font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
		color: #a78bfa; letter-spacing: .1em; text-transform: uppercase;
	}
	.label-icon { font-size: 16px; }
	.section-desc { font-size: 13px; color: #475569; }

	/* Tool picker */
	.tool-picker {
		display: flex; flex-wrap: wrap; gap: 10px;
	}
	.tool-chip {
		display: flex; align-items: center; gap: 8px;
		padding: 10px 16px; border-radius: 12px;
		border: 1px solid rgba(255,255,255,.07);
		background: rgba(255,255,255,.03); color: #64748b;
		font-family: 'DM Mono', monospace; font-size: 12px; cursor: pointer;
		transition: all .15s;
	}
	.tool-chip:hover { border-color: var(--tc); color: var(--tc); }
	.tool-chip.active {
		background: color-mix(in srgb, var(--tc) 12%, transparent);
		border-color: color-mix(in srgb, var(--tc) 40%, transparent);
		color: var(--tc);
	}
	.chip-icon { font-size: 13px; font-weight: 700; }
	.chip-label { font-family: 'Syne', sans-serif; font-weight: 600; font-size: 12px; }

	/* Panel */
	.panel {
		background: rgba(15,23,42,.75); border: 1px solid rgba(255,255,255,.07);
		border-radius: 20px; overflow: hidden;
		box-shadow: 0 4px 24px rgba(0,0,0,.3);
		position: relative;
	}
	.panel::before {
		content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
		background: linear-gradient(90deg, transparent, var(--tc), transparent);
	}

	.panel-header {
		display: flex; align-items: center; gap: 14px;
		padding: 20px 24px;
		border-bottom: 1px solid rgba(255,255,255,.06);
	}
	.panel-icon {
		width: 40px; height: 40px; border-radius: 12px;
		background: color-mix(in srgb, var(--tc) 12%, transparent);
		border: 1px solid color-mix(in srgb, var(--tc) 30%, transparent);
		display: flex; align-items: center; justify-content: center;
		color: var(--tc); font-weight: 700; font-size: 13px; flex-shrink: 0;
	}
	.panel-header h3 {
		font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px;
		color: var(--tc);
	}
	.panel-sub { font-size: 11px; color: #475569; }

	.tool-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }

	/* Form elements */
	.field { display: flex; flex-direction: column; gap: 6px; }
	.field.flex1 { flex: 1; }
	label { font-size: 10px; color: #475569; letter-spacing: .06em; text-transform: uppercase; }

	input, textarea {
		background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08);
		border-radius: 10px; color: #e2e8f0;
		font-family: 'DM Mono', monospace; font-size: 12px; line-height: 1.6;
		padding: 10px 14px; resize: vertical; outline: none;
		transition: border-color .15s;
	}
	input:focus, textarea:focus {
		border-color: color-mix(in srgb, var(--tc) 50%, transparent);
	}
	input[type="range"] {
		padding: 0; height: 4px; accent-color: var(--tc); cursor: pointer;
	}
	textarea.readonly { color: #94a3b8; cursor: default; }

	.row2 { display: flex; gap: 16px; flex-wrap: wrap; }
	.row2 > * { min-width: 0; }

	.input-wrap { position: relative; display: flex; align-items: center; }
	.input-wrap input { flex: 1; padding-left: 28px; padding-right: 28px; }
	.input-prefix, .input-suffix {
		position: absolute; color: var(--tc); font-size: 16px; pointer-events: none; opacity: .6;
	}
	.input-prefix { left: 10px; }
	.input-suffix { right: 10px; }

	.label-row { display: flex; justify-content: space-between; align-items: center; }
	.action-row { display: flex; gap: 6px; }

	.mini-btn {
		padding: 4px 10px; border-radius: 6px;
		border: 1px solid rgba(255,255,255,.1);
		background: rgba(255,255,255,.04); color: #94a3b8;
		font-family: 'DM Mono', monospace; font-size: 10px; cursor: pointer;
		transition: all .15s;
	}
	.mini-btn:hover { border-color: var(--tc); color: var(--tc); }

	.error-bar {
		padding: 10px 14px; border-radius: 10px;
		background: rgba(248,113,113,.08); border: 1px solid rgba(248,113,113,.2);
		color: #f87171; font-size: 11px;
	}

	/* Regex */
	.result-bar { display: flex; align-items: center; }
	.match-count { font-size: 11px; color: var(--tc); }
	.match-count.zero { color: #475569; }

	.highlight-box {
		padding: 12px 14px; border-radius: 10px;
		background: rgba(0,0,0,.25); border: 1px solid rgba(255,255,255,.06);
		font-size: 13px; line-height: 1.7; color: #94a3b8; white-space: pre-wrap; word-break: break-all;
	}
	:global(.highlight-box mark) {
		background: rgba(244, 114, 182, .3);
		color: #f472b6; border-radius: 3px; padding: 0 2px;
	}

	.match-list { display: flex; flex-wrap: wrap; gap: 6px; }
	.match-pill {
		display: inline-flex; align-items: center; gap: 6px;
		padding: 3px 10px; border-radius: 20px;
		background: rgba(244,114,182,.1); border: 1px solid rgba(244,114,182,.2);
		color: #f472b6; font-size: 11px;
	}
	.match-idx { opacity: .5; font-size: 9px; }

	/* Mode toggle */
	.mode-toggle { display: flex; gap: 4px; }
	.mode-btn {
		padding: 7px 16px; border-radius: 10px;
		border: 1px solid rgba(255,255,255,.08);
		background: rgba(255,255,255,.03); color: #64748b;
		font-family: 'DM Mono', monospace; font-size: 12px; cursor: pointer;
		transition: all .15s;
	}
	.mode-btn.active {
		background: color-mix(in srgb, var(--tc) 12%, transparent);
		border-color: color-mix(in srgb, var(--tc) 40%, transparent);
		color: var(--tc);
	}

	/* Diff */
	.diff-output {
		font-size: 12px; border-radius: 12px; overflow: hidden;
		border: 1px solid rgba(255,255,255,.06);
	}
	.diff-line {
		display: flex; gap: 12px; padding: 5px 14px; line-height: 1.5;
	}
	.diff-add    { background: rgba(74,222,128,.07); color: #86efac; }
	.diff-remove { background: rgba(248,113,113,.07); color: #fca5a5; }
	.diff-same   { color: #475569; }
	.diff-gutter { min-width: 12px; opacity: .6; }

	.diff-legend { display: flex; gap: 16px; font-size: 10px; }
	.leg { padding: 3px 10px; border-radius: 20px; }
	.leg.add    { background: rgba(74,222,128,.1);  color: #4ade80; border: 1px solid rgba(74,222,128,.2); }
	.leg.remove { background: rgba(248,113,113,.1); color: #f87171; border: 1px solid rgba(248,113,113,.2); }
	.leg.same   { background: rgba(255,255,255,.04); color: #475569; border: 1px solid rgba(255,255,255,.06); }

	/* Hash */
	.input-btn-row { display: flex; gap: 8px; }
	.input-btn-row input { flex: 1; }
	.btn-compute {
		padding: 10px 18px; border-radius: 10px;
		background: color-mix(in srgb, var(--tc) 15%, transparent);
		border: 1px solid color-mix(in srgb, var(--tc) 40%, transparent);
		color: var(--tc); font-family: 'Syne', sans-serif; font-weight: 700;
		font-size: 12px; cursor: pointer; white-space: nowrap;
		transition: all .15s;
	}
	.btn-compute:hover { background: color-mix(in srgb, var(--tc) 25%, transparent); }

	.hash-results {
		display: flex; flex-direction: column;
		border: 1px solid rgba(255,255,255,.06); border-radius: 12px; overflow: hidden;
	}
	.hash-row {
		display: flex; align-items: center; gap: 12px;
		padding: 12px 16px;
		border-bottom: 1px solid rgba(255,255,255,.04);
	}
	.hash-row:last-child { border-bottom: none; }
	.hash-algo { min-width: 72px; font-size: 10px; color: var(--tc); font-weight: 500; }
	.hash-val { flex: 1; font-size: 10px; color: #94a3b8; word-break: break-all; }
	.icon-btn {
		background: none; border: none; color: #475569; cursor: pointer;
		font-size: 14px; transition: color .15s;
	}
	.icon-btn:hover { color: var(--tc); }

	.empty-hint {
		padding: 24px; text-align: center;
		color: #334155; font-size: 12px; font-style: italic;
	}

	@media (max-width: 640px) {
		.row2 { flex-direction: column; }
		.tool-picker { gap: 6px; }
		.tool-chip { padding: 8px 12px; }
	}
</style>