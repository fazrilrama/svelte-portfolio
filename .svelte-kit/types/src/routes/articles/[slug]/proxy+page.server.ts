// @ts-nocheck
// src/routes/articles/[slug]/+page.server.ts
import { error } from '@sveltejs/kit';
import { getArticleBySlug } from '$lib/services/articles';
import type { PageServerLoad } from './$types';

export const load = async ({ params }: Parameters<PageServerLoad>[0]) => {
	try {
		const article = await getArticleBySlug(params.slug);

		// Check if article is published
		if (!article.published) {
			throw error(404, 'Article not found');
		}

		return {
			article
		};
	} catch (err) {
		console.error('Error loading article:', err);
		throw error(404, 'Article not found');
	}
};