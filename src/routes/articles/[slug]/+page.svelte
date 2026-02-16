<script lang="ts">
	import { page } from '$app/stores';
	import FaExternalLinkAlt from 'svelte-icons/fa/FaExternalLinkAlt.svelte';
	import type { Article } from '$lib/supabaseClient';

	export let data: { article: Article };
	let article: Article = data.article;
</script>

<svelte:head>
	<title>Fazril Ramadhan — {article?.title || 'Missing article'}</title>
	{#if article?.excerpt}
		<meta name="description" content={article.excerpt} />
	{/if}
	{#if article?.cover_image}
		<meta property="og:image" content={article.cover_image} />
	{/if}
</svelte:head>

<div class="articleContainer">
	<div class="article">
		{#if article}
			<!-- Article Header -->
			<div class="article-header">
				<h1 class="title">
					{#if article.url}
						<a href={article.url} target="_blank" rel="noreferrer">{article.title}</a>
						<a class="icon" href={article.url} target="_blank" rel="noreferrer">
							<FaExternalLinkAlt />
						</a>
					{:else}
						{article.title}
					{/if}
				</h1>

				<!-- Article Meta -->
				<div class="article-meta">
					<time datetime={article.created_at}>
						{new Date(article.created_at).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})}
					</time>
					{#if article.views}
						<span class="views">• {article.views} views</span>
					{/if}
				</div>

				<!-- Tags -->
				{#if article.tags && article.tags.length > 0}
					<div class="tags">
						{#each article.tags as tag}
							<a href="/articles/tag/{tag}" class="tag">#{tag}</a>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Cover Image -->
			{#if article.cover_image}
				<div class="cover-image">
					<img src={article.cover_image} alt={article.title} />
				</div>
			{/if}

			<!-- Article Body -->
			<div class="article-body">
				{@html article.body_html}
			</div>
		{:else}
			<div class="error">
				<h2>Article not found</h2>
				<p>The article you're looking for doesn't exist or has been removed.</p>
				<a href="/articles" class="back-link">← Back to articles</a>
			</div>
		{/if}
	</div>
</div>

<style>
	.articleContainer {
		width: 100%;
		max-width: 350px;
		display: flex;
		justify-content: center;
		box-sizing: border-box;
		padding: 0;
		margin: 50px 10px 0;
	}

	.article {
		text-align: start;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		padding: 30px;
		width: 100%;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	/* Article Header */
	.article-header {
		margin-bottom: 32px;
	}

	h1 {
		font-weight: 700;
		text-align: start;
		margin: 0 0 16px 0;
		font-size: 28px;
		line-height: 1.3;
	}

	.title {
		display: flex;
		align-items: flex-start;
		gap: 12px;
	}

	.title a {
		color: white;
		text-decoration: none;
		transition: color 0.3s;
	}

	.title a:hover {
		color: #14B8A6;
	}

	.icon {
		width: 20px;
		height: 20px;
		flex-shrink: 0;
		margin-top: 4px;
		opacity: 0.6;
		transition: opacity 0.3s;
	}

	.icon:hover {
		opacity: 1;
	}

	/* Article Meta */
	.article-meta {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
		color: #94A3B8;
		margin-bottom: 16px;
	}

	.views {
		color: #14B8A6;
	}

	/* Tags */
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.tag {
		padding: 4px 12px;
		background: rgba(99, 102, 241, 0.1);
		border: 1px solid rgba(99, 102, 241, 0.3);
		border-radius: 6px;
		font-size: 13px;
		color: #6366F1;
		text-decoration: none;
		transition: all 0.3s;
		font-weight: 500;
	}

	.tag:hover {
		background: rgba(99, 102, 241, 0.2);
		border-color: #6366F1;
		transform: translateY(-2px);
	}

	/* Cover Image */
	.cover-image {
		margin: 32px 0;
		border-radius: 8px;
		overflow: hidden;
	}

	.cover-image img {
		width: 100%;
		height: auto;
		display: block;
	}

	/* Article Body */
	.article-body {
		font-size: 16px;
		line-height: 1.8;
		color: #E2E8F0;
	}

	.article-body :global(h2) {
		font-size: 24px;
		font-weight: 700;
		margin: 32px 0 16px 0;
		color: white;
	}

	.article-body :global(h3) {
		font-size: 20px;
		font-weight: 600;
		margin: 24px 0 12px 0;
		color: white;
	}

	.article-body :global(p) {
		margin: 16px 0;
	}

	.article-body :global(a) {
		color: #14B8A6;
		text-decoration: none;
		border-bottom: 1px solid rgba(20, 184, 166, 0.3);
		transition: all 0.3s;
	}

	.article-body :global(a:hover) {
		color: #0EA99C;
		border-bottom-color: #0EA99C;
	}

	.article-body :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: 8px;
		margin: 24px 0;
	}

	.article-body :global(code) {
		padding: 2px 6px;
		background: rgba(99, 102, 241, 0.1);
		border: 1px solid rgba(99, 102, 241, 0.3);
		border-radius: 4px;
		font-size: 14px;
		font-family: 'JetBrains Mono', monospace;
		color: #A5B4FC;
	}

	.article-body :global(pre) {
		padding: 20px;
		background: rgba(15, 23, 42, 0.6);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		overflow-x: auto;
		margin: 24px 0;
	}

	.article-body :global(pre code) {
		padding: 0;
		background: none;
		border: none;
		font-size: 14px;
	}

	.article-body :global(blockquote) {
		padding: 16px 20px;
		margin: 24px 0;
		border-left: 4px solid #14B8A6;
		background: rgba(20, 184, 166, 0.05);
		border-radius: 4px;
		font-style: italic;
		color: #94A3B8;
	}

	.article-body :global(ul),
	.article-body :global(ol) {
		padding-left: 24px;
		margin: 16px 0;
	}

	.article-body :global(li) {
		margin: 8px 0;
	}

	/* Error State */
	.error {
		text-align: center;
		padding: 60px 20px;
	}

	.error h2 {
		font-size: 28px;
		margin-bottom: 16px;
		color: white;
	}

	.error p {
		color: #94A3B8;
		margin-bottom: 32px;
	}

	.back-link {
		display: inline-block;
		padding: 12px 24px;
		background: rgba(99, 102, 241, 0.1);
		border: 1px solid rgba(99, 102, 241, 0.3);
		border-radius: 8px;
		color: #6366F1;
		text-decoration: none;
		transition: all 0.3s;
		font-weight: 600;
	}

	.back-link:hover {
		background: rgba(99, 102, 241, 0.2);
		border-color: #6366F1;
		transform: translateY(-2px);
	}

	/* Responsive */
	@media (min-width: 900px) {
		.articleContainer {
			padding: 0;
			max-width: 900px;
		}

		h1 {
			font-size: 48px;
			margin: 0 0 24px 0;
		}

		.article {
			padding: 60px;
		}

		.article-body {
			font-size: 18px;
		}

		.article-body :global(h2) {
			font-size: 32px;
		}

		.article-body :global(h3) {
			font-size: 24px;
		}
	}
</style>