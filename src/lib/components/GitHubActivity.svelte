<script lang="ts">
	import { onMount } from 'svelte';

	// ── Types ─────────────────────────────────────────────────────────────────
	interface Repo {
		id: number;
		name: string;
		description: string | null;
		html_url: string;
		language: string | null;
		stargazers_count: number;
		forks_count: number;
		updated_at: string;
		topics: string[];
	}


	interface UserProfile {
		login: string;
		name: string;
		bio: string | null;
		avatar_url: string;
		public_repos: number;
		followers: number;
		following: number;
		html_url: string;
	}

	// ── State ─────────────────────────────────────────────────────────────────
	const USERNAME  = 'fazrilrama';
	const GH_API    = 'https://api.github.com';
	const GH_GRAPH  = 'https://api.github.com/graphql';
	const GH_TOKEN  = import.meta.env.VITE_GITHUB_TOKEN as string;

	let profile:  UserProfile | null = null;
	let repos:    Repo[]   = [];
	let loading   = true;
	let error: string | null = null;

	let sortBy: 'updated' | 'stars' = 'updated';

	// ── Language colors ───────────────────────────────────────────────────────
	const LANG_COLOR: Record<string, string> = {
		TypeScript:  '#3178c6',
		JavaScript:  '#f7df1e',
		Python:      '#3572A5',
		Go:          '#00ADD8',
		Svelte:      '#ff3e00',
		Vue:         '#42b883',
		PHP:         '#8993be',
		Dart:        '#00B4AB',
		Rust:        '#dea584',
		CSS:         '#563d7c',
		HTML:        '#e34c26',
		Shell:       '#89e051',
	};


	// ── Helpers ───────────────────────────────────────────────────────────────
	function timeAgo(dateStr: string): string {
		const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
		if (diff < 60)    return `${Math.floor(diff)}s ago`;
		if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
		if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
		return `${Math.floor(diff / 86400)}d ago`;
	}

	// ── Data fetching ─────────────────────────────────────────────────────────
	async function fetchAll() {
		loading = true;
		error   = null;
		try {
			const authHeaders = {
				'Content-Type':  'application/json',
				'Authorization': `bearer ${GH_TOKEN}`,
			};

			const gqlQuery = `
				query {
					user(login: "${USERNAME}") {
						name login bio avatarUrl url
						followers { totalCount }
						following { totalCount }
						repositories { totalCount }
						pinnedItems(first: 6, types: REPOSITORY) {
							nodes {
								... on Repository {
									databaseId name description url
									primaryLanguage { name }
									stargazerCount forkCount updatedAt
									repositoryTopics(first: 4) {
										nodes { topic { name } }
									}
								}
							}
						}
					}
				}
			`;

			const gqlRes = await fetch(GH_GRAPH, {
				method:  'POST',
				headers: authHeaders,
				body:    JSON.stringify({ query: gqlQuery }),
			});

			if (!gqlRes.ok) throw new Error(`GitHub GraphQL error: ${gqlRes.status}`);

			const gql = await gqlRes.json();
			if (gql.errors) throw new Error(gql.errors[0]?.message ?? 'GraphQL error');

			const u = gql.data.user;

			profile = {
				login:        u.login,
				name:         u.name,
				bio:          u.bio,
				avatar_url:   u.avatarUrl,
				html_url:     u.url,
				public_repos: u.repositories.totalCount,
				followers:    u.followers.totalCount,
				following:    u.following.totalCount,
			};

			repos = u.pinnedItems.nodes.map((r: any): Repo => ({
				id:               r.databaseId,
				name:             r.name,
				description:      r.description,
				html_url:         r.url,
				language:         r.primaryLanguage?.name ?? null,
				stargazers_count: r.stargazerCount,
				forks_count:      r.forkCount,
				updated_at:       r.updatedAt,
				topics:           r.repositoryTopics.nodes.map((n: any) => n.topic.name),
			}));

		} catch (err: any) {
			error = err.message ?? 'Failed to fetch GitHub data';
		} finally {
			loading = false;
		}
	}

	$: sortedRepos = [...repos].sort((a, b) => {
		if (sortBy === 'stars') return b.stargazers_count - a.stargazers_count;
		return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
	});

	onMount(fetchAll);
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
</svelte:head>

<section class="gh-root">
	<!-- background decorations -->
	<div class="bg-dots"  aria-hidden="true"></div>
	<div class="bg-glow1" aria-hidden="true"></div>

	<div class="inner">

		<!-- ── Header ─────────────────────────────────────────────────────────── -->
		<div class="section-label">
			<span class="label-icon">◈</span>
			<span>GitHub Activity</span>
		</div>

		<!-- ── Loading ────────────────────────────────────────────────────────── -->
		{#if loading}
			<div class="state-box">
				<div class="spinner"></div>
				<p>Fetching <span class="accent">@{USERNAME}</span>…</p>
			</div>

		<!-- ── Error ──────────────────────────────────────────────────────────── -->
		{:else if error}
			<div class="state-box error">
				<span class="state-icon">⚠</span>
				<p>{error}</p>
				<button class="btn-retry" on:click={fetchAll}>↻ Retry</button>
			</div>

		<!-- ── Content ────────────────────────────────────────────────────────── -->
		{:else if profile}

			<!-- Profile card -->
			<div class="profile-card">
				<div class="avatar-wrap">
					<img src={profile.avatar_url} alt={profile.login} class="avatar" />
					<div class="avatar-ring"></div>
				</div>

				<div class="profile-info">
					<h2>{profile.name ?? profile.login}</h2>
					{#if profile.bio}<p class="bio">{profile.bio}</p>{/if}
					<a href={profile.html_url} target="_blank" rel="noopener" class="gh-link">
						<span>⑂</span> @{profile.login}
					</a>
				</div>

				<div class="profile-stats">
					<div class="stat">
						<span class="stat-val">{profile.public_repos}</span>
						<span class="stat-key">repos</span>
					</div>
					<div class="stat-divider"></div>
					<div class="stat">
						<span class="stat-val">{profile.followers}</span>
						<span class="stat-key">followers</span>
					</div>
					<div class="stat-divider"></div>
					<div class="stat">
						<span class="stat-val">{profile.following}</span>
						<span class="stat-key">following</span>
					</div>
				</div>
			</div>

			<!-- Sort -->
				<div class="sort-row">
					<span class="sort-label">▤ Pinned Repositories <span class="badge">{repos.length}</span></span>
					<div class="sort-btns">
						<button class="sort-btn" class:active={sortBy==='updated'} on:click={() => sortBy='updated'}>Recent</button>
						<button class="sort-btn" class:active={sortBy==='stars'}   on:click={() => sortBy='stars'}>⭐ Stars</button>
					</div>
				</div>

				<!-- Repos -->
				<div class="repos-grid">
					{#each sortedRepos as repo (repo.id)}
						<a href={repo.html_url} target="_blank" rel="noopener" class="repo-card">
							<div class="repo-top">
								<span class="repo-name">{ repo.name }</span>
								{#if repo.language}
									<span class="lang-dot" style="background:{LANG_COLOR[repo.language] ?? '#64748b'}"></span>
									<span class="lang-name">{repo.language}</span>
								{/if}
							</div>

							{#if repo.description}
								<p class="repo-desc">{repo.description}</p>
							{:else}
								<p class="repo-desc muted">No description</p>
							{/if}

							{#if repo.topics?.length}
								<div class="topics">
									{#each repo.topics.slice(0,4) as t}
										<span class="topic">{t}</span>
									{/each}
								</div>
							{/if}

							<div class="repo-meta">
								<span>★ {repo.stargazers_count}</span>
								<span>⑂ {repo.forks_count}</span>
								<span class="meta-time">{timeAgo(repo.updated_at)}</span>
							</div>
						</a>
					{/each}
				</div>

		{/if}
	</div>
</section>

<style>
	/* ── Base ─────────────────────────────────────────────────────────────── */
	*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

	.gh-root {
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

	/* ── BG ───────────────────────────────────────────────────────────────── */
	.bg-dots {
		position: absolute; inset: 0; pointer-events: none;
		background-image: radial-gradient(rgba(255,255,255,.04) 1px, transparent 1px);
		background-size: 32px 32px;
	}
	.bg-glow1 {
		position: absolute; top: -180px; right: -180px;
		width: 520px; height: 520px; border-radius: 50%;
		background: #4ade80; filter: blur(130px); opacity: .1;
		pointer-events: none;
	}

	/* ── Section label ────────────────────────────────────────────────────── */
	.section-label {
		display: inline-flex; align-items: center; gap: 8px;
		font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
		color: #4ade80; letter-spacing: .1em; text-transform: uppercase;
	}
	.label-icon { font-size: 16px; }
	.accent { color: #4ade80; }

	/* ── Loading / Error ──────────────────────────────────────────────────── */
	.state-box {
		display: flex; flex-direction: column; align-items: center;
		gap: 16px; padding: 60px;
		background: rgba(15,23,42,.6); border: 1px solid rgba(255,255,255,.06);
		border-radius: 20px; color: #64748b; font-size: 14px;
	}
	.state-box.error { color: #f87171; }
	.state-icon { font-size: 32px; }
	.spinner {
		width: 32px; height: 32px; border-radius: 50%;
		border: 2px solid rgba(74,222,128,.2);
		border-top-color: #4ade80;
		animation: spin .8s linear infinite;
	}
	@keyframes spin { to { transform: rotate(360deg); } }
	.btn-retry {
		padding: 8px 20px; background: rgba(248,113,113,.1); border: 1px solid #f87171;
		color: #f87171; border-radius: 10px; cursor: pointer; font-family: inherit;
		font-size: 12px; transition: background .15s;
	}
	.btn-retry:hover { background: rgba(248,113,113,.2); }

	/* ── Profile card ─────────────────────────────────────────────────────── */
	.profile-card {
		display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
		background: rgba(15,23,42,.7); border: 1px solid rgba(255,255,255,.07);
		border-radius: 20px; padding: 24px;
		box-shadow: 0 4px 24px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.05);
		position: relative; overflow: hidden;
	}
	.profile-card::before {
		content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
		background: linear-gradient(90deg, transparent, #4ade80, transparent);
	}

	.avatar-wrap { position: relative; flex-shrink: 0; }
	.avatar {
		width: 72px; height: 72px; border-radius: 50%;
		border: 2px solid rgba(74,222,128,.3); display: block;
	}
	.avatar-ring {
		position: absolute; inset: -4px; border-radius: 50%;
		border: 1px solid rgba(74,222,128,.2);
		animation: ring-pulse 2.5s ease-in-out infinite;
	}
	@keyframes ring-pulse {
		0%,100% { opacity: .4; transform: scale(1); }
		50%      { opacity: .8; transform: scale(1.06); }
	}

	.profile-info { flex: 1; min-width: 180px; }
	.profile-info h2 {
		font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800;
		color: #f1f5f9; margin-bottom: 4px;
	}
	.bio { font-size: 12px; color: #64748b; margin-bottom: 8px; line-height: 1.5; }
	.gh-link {
		display: inline-flex; align-items: center; gap: 6px;
		font-size: 12px; color: #4ade80; text-decoration: none;
		transition: opacity .15s;
	}
	.gh-link:hover { opacity: .75; }

	.profile-stats {
		display: flex; align-items: center; gap: 16px;
		margin-left: auto;
	}
	.stat { text-align: center; }
	.stat-val {
		display: block; font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800;
		color: #4ade80;
	}
	.stat-key { font-size: 10px; color: #475569; }
	.stat-divider { width: 1px; height: 32px; background: rgba(255,255,255,.07); }

	/* ── Sort row ─────────────────────────────────────────────────────────── */
	.sort-row {
		display: flex; justify-content: space-between; align-items: center;
		flex-wrap: wrap; gap: 10px;
	}
	.sort-label {
		font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px;
		color: #94a3b8; display: flex; align-items: center; gap: 8px;
	}
	.badge {
		background: rgba(255,255,255,.08); border-radius: 20px;
		padding: 1px 7px; font-size: 10px; color: #475569;
		font-family: 'DM Mono', monospace;
	}
	.sort-btns { display: flex; gap: 6px; }
	.sort-btn {
		padding: 5px 12px; border-radius: 8px; font-size: 11px;
		border: 1px solid rgba(255,255,255,.07);
		background: transparent; color: #64748b;
		font-family: 'DM Mono', monospace; cursor: pointer; transition: all .15s;
	}
	.sort-btn.active { border-color: rgba(74,222,128,.3); color: #4ade80; background: rgba(74,222,128,.08); }
	.sort-btn:not(.active):hover { color: #94a3b8; }

	/* ── Repos grid ───────────────────────────────────────────────────────── */
	.repos-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 16px;
	}
	.repo-card {
		display: flex; flex-direction: column; gap: 10px;
		padding: 18px;
		background: rgba(15,23,42,.6); border: 1px solid rgba(255,255,255,.06);
		border-radius: 16px; text-decoration: none; color: inherit;
		transition: transform .2s, border-color .2s, box-shadow .2s;
	}
	.repo-card:hover {
		transform: translateY(-3px);
		border-color: rgba(74,222,128,.25);
		box-shadow: 0 8px 24px rgba(0,0,0,.3);
	}

	.repo-top { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
	.repo-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; color: #e2e8f0; flex: 1; }
	.lang-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
	.lang-name { font-size: 10px; color: #64748b; }

	.repo-desc { font-size: 11px; color: #64748b; line-height: 1.5; flex: 1; }
	.repo-desc.muted { font-style: italic; }

	.topics { display: flex; flex-wrap: wrap; gap: 4px; }
	.topic {
		padding: 2px 8px; border-radius: 20px;
		background: rgba(74,222,128,.08); border: 1px solid rgba(74,222,128,.15);
		color: #4ade80; font-size: 9px; letter-spacing: .03em;
	}

	.repo-meta {
		display: flex; gap: 12px; margin-top: auto;
		font-size: 10px; color: #475569;
	}
	.meta-time { margin-left: auto; }

	/* ── Responsive ───────────────────────────────────────────────────────── */
	@media (max-width: 640px) {
		.profile-card { flex-direction: column; align-items: flex-start; }
		.profile-stats { margin-left: 0; }
		.repos-grid { grid-template-columns: 1fr; }
	}
</style>