<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import type { Article } from '$lib/supabaseClient';

	export let data: { articles: Article[] };
	
	let articles: Article[] = data.articles;
	let filteredArticles: Article[] = articles;
	let searchQuery = '';
	let selectedTag: string | null = null;
	let visible = false;

	// Get all unique tags
	$: allTags = [...new Set(articles.flatMap(a => a.tags || []))].sort();

	// Filter articles
	$: {
		filteredArticles = articles.filter(article => {
			const matchesSearch = searchQuery === '' || 
				article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(article.excerpt && article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
			
			const matchesTag = !selectedTag || (article.tags && article.tags.includes(selectedTag));
			
			return matchesSearch && matchesTag;
		});
	}

	onMount(() => {
		visible = true;
	});

	function clearFilters() {
		searchQuery = '';
		selectedTag = null;
	}
</script>

<svelte:head>
	<title>Fazril Ramadhan — Articles</title>
	<meta name="description" content="Articles and blog posts about web development, automation testing, and programming." />
</svelte:head>

<div class="container">
	{#if visible}
		<main>
			<!-- Hero Section -->
			<div class="hero-section" in:fade={{ duration: 600 }}>
				<h1 in:fly={{ y: 30, duration: 800, delay: 100, easing: quintOut }}>
					Articles
				</h1>
				<div class="hero-tagline" in:fly={{ y: 30, duration: 800, delay: 200, easing: quintOut }}>
					Thoughts on <span class="gradient-text">development, testing, and tech</span>
				</div>
			</div>

			<!-- Filters -->
			<div class="filters" in:fly={{ y: 30, duration: 800, delay: 300, easing: quintOut }}>
				<!-- Search Bar -->
				<div class="search-bar">
					<input
						type="text"
						placeholder="Search articles..."
						bind:value={searchQuery}
						class="search-input"
					/>
				</div>

				<!-- Tags Filter -->
				{#if allTags.length > 0}
					<div class="tags-filter">
						<button
							class="tag-btn"
							class:active={!selectedTag}
							on:click={() => selectedTag = null}
						>
							All
						</button>
						{#each allTags as tag}
							<button
								class="tag-btn"
								class:active={selectedTag === tag}
								on:click={() => selectedTag = tag}
							>
								#{tag}
							</button>
						{/each}
					</div>
				{/if}

				<!-- Clear Filters -->
				{#if searchQuery || selectedTag}
					<button class="clear-btn" on:click={clearFilters}>
						Clear filters
					</button>
				{/if}
			</div>

			<!-- Articles Grid -->
			<div class="articles-grid">
				{#if filteredArticles.length > 0}
					{#each filteredArticles as article, idx}
						<a 
							href="/articles/{article.slug}" 
							class="article-card"
							in:fly={{ y: 40, duration: 700, delay: 400 + (idx * 100), easing: quintOut }}
						>
							{#if article.cover_image}
								<div class="article-image">
									<img src={article.cover_image} alt={article.title} />
								</div>
							{/if}

							<div class="article-content">
								<h2>{article.title}</h2>

								{#if article.excerpt}
									<p class="excerpt">{article.excerpt}</p>
								{/if}

								<div class="article-meta">
									<time datetime={article.created_at}>
										{new Date(article.created_at).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'short',
											day: 'numeric'
										})}
									</time>
									{#if article.views}
										<span class="views">• {article.views} views</span>
									{/if}
								</div>

								{#if article.tags && article.tags.length > 0}
									<div class="article-tags">
										{#each article.tags as tag}
											<span class="tag">#{tag}</span>
										{/each}
									</div>
								{/if}
							</div>
						</a>
					{/each}
				{:else}
					<div class="no-results" in:fade={{ duration: 600 }}>
						<p>No articles found</p>
						<button class="clear-btn" on:click={clearFilters}>
							Clear filters
						</button>
					</div>
				{/if}
			</div>
		</main>
	{/if}
</div>

<style>
	:global(body) {
		--primary: #6366F1;
		--secondary: #EC4899;
		--accent: #14B8A6;
		--text-primary: #F1F5F9;
		--text-secondary: #94A3B8;
		--bg-card: rgba(255, 255, 255, 0.03);
		--border-color: rgba(255, 255, 255, 0.1);
	}

	.container {
		max-width: 1400px;
		padding: 60px 20px;
		margin: 0 auto;
	}

	main {
		width: 100%;
	}

	/* Hero Section */
	.hero-section {
		text-align: center;
		margin-bottom: 60px;
	}

	h1 {
		font-weight: 800;
		margin: 0 0 20px 0;
		font-size: 48px;
		background: linear-gradient(135deg, var(--primary), var(--accent));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.hero-tagline {
		font-size: 20px;
		color: var(--text-secondary);
		line-height: 1.6;
	}

	.gradient-text {
		background: linear-gradient(135deg, var(--secondary), var(--primary));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		font-weight: 700;
	}

	/* Filters */
	.filters {
		margin-bottom: 48px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.search-bar {
		width: 100%;
	}

	.search-input {
		width: 100%;
		max-width: 500px;
		padding: 14px 20px;
		background: var(--bg-card);
		border: 1px solid var(--border-color);
		border-radius: 12px;
		color: var(--text-primary);
		font-size: 16px;
		font-family: inherit;
		transition: all 0.3s;
	}

	.search-input:focus {
		outline: none;
		border-color: var(--accent);
		box-shadow: 0 0 20px rgba(20, 184, 166, 0.2);
		background: rgba(255, 255, 255, 0.05);
	}

	.search-input::placeholder {
		color: var(--text-secondary);
	}

	.tags-filter {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.tag-btn {
		padding: 8px 16px;
		background: var(--bg-card);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		color: var(--text-secondary);
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.3s;
		font-family: inherit;
	}

	.tag-btn:hover {
		background: rgba(255, 255, 255, 0.05);
		border-color: var(--accent);
		color: var(--text-primary);
	}

	.tag-btn.active {
		background: rgba(20, 184, 166, 0.1);
		border-color: var(--accent);
		color: var(--accent);
	}

	.clear-btn {
		padding: 8px 16px;
		background: transparent;
		border: 1px solid var(--border-color);
		border-radius: 8px;
		color: var(--text-secondary);
		font-size: 14px;
		cursor: pointer;
		transition: all 0.3s;
		font-family: inherit;
		width: fit-content;
	}

	.clear-btn:hover {
		background: rgba(255, 255, 255, 0.05);
		border-color: var(--text-primary);
		color: var(--text-primary);
	}

	/* Articles Grid */
	.articles-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		gap: 32px;
	}

	.article-card {
		background: var(--bg-card);
		border: 1px solid var(--border-color);
		border-radius: 16px;
		overflow: hidden;
		text-decoration: none;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.article-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: linear-gradient(90deg, var(--primary), var(--accent));
		transform: scaleX(0);
		transition: transform 0.3s;
	}

	.article-card:hover {
		transform: translateY(-8px);
		border-color: var(--primary);
		box-shadow: 0 20px 60px rgba(99, 102, 241, 0.2);
		background: rgba(255, 255, 255, 0.05);
	}

	.article-card:hover::before {
		transform: scaleX(1);
	}

	.article-image {
		width: 100%;
		height: 200px;
		overflow: hidden;
	}

	.article-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s;
	}

	.article-card:hover .article-image img {
		transform: scale(1.05);
	}

	.article-content {
		padding: 24px;
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.article-content h2 {
		font-size: 24px;
		font-weight: 700;
		margin: 0 0 12px 0;
		color: var(--text-primary);
		line-height: 1.3;
	}

	.excerpt {
		font-size: 15px;
		line-height: 1.6;
		color: var(--text-secondary);
		margin: 0 0 16px 0;
		flex: 1;
	}

	.article-meta {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 13px;
		color: var(--text-secondary);
		margin-bottom: 12px;
	}

	.views {
		color: var(--accent);
	}

	.article-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.tag {
		padding: 4px 10px;
		background: rgba(99, 102, 241, 0.1);
		border: 1px solid rgba(99, 102, 241, 0.3);
		border-radius: 4px;
		font-size: 12px;
		color: var(--primary);
		font-weight: 500;
	}

	/* No Results */
	.no-results {
		grid-column: 1 / -1;
		text-align: center;
		padding: 60px 20px;
	}

	.no-results p {
		font-size: 18px;
		color: var(--text-secondary);
		margin-bottom: 24px;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.container {
			padding: 40px 16px;
		}

		h1 {
			font-size: 36px;
		}

		.hero-tagline {
			font-size: 18px;
		}

		.articles-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (min-width: 900px) {
		h1 {
			font-size: 64px;
		}
	}
</style>