// src/routes/articles/+page.server.ts
import { getArticles } from '$lib/services/articles';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		// Get all published articles
		const articles = await getArticles({
			published: true,
			orderBy: 'created_at'
		});

		return {
			articles
		};
	} catch (err) {
		console.error('Error loading articles:', err);
		return {
			articles: []
		};
	}
};