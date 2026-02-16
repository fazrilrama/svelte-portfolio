// src/lib/services/articles.ts
import { supabase, type Article, type ArticleInsert, type ArticleUpdate } from '$lib/supabaseClient'

/**
 * Article Service
 * CRUD operations untuk articles dengan Supabase
 */

// Get all articles (with optional filters)
export async function getArticles(options?: {
  published?: boolean
  limit?: number
  offset?: number
  orderBy?: string
}) {
  let query = supabase
    .from('articles')
    .select('*')

  // Filter by published status
  if (options?.published !== undefined) {
    query = query.eq('published', options.published)
  }

  // Order by (default: created_at desc)
  const orderBy = options?.orderBy || 'created_at'
  query = query.order(orderBy, { ascending: false })

  // Pagination
  if (options?.limit) {
    query = query.limit(options.limit)
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching articles:', error)
    throw error
  }

  return data as Article[]
}

// Get single article by slug
export async function getArticleBySlug(slug: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching article:', error)
    throw error
  }

  // Increment views
  if (data) {
    await incrementViews(data.id)
  }

  return data as Article
}

// Get single article by ID
export async function getArticleById(id: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching article:', error)
    throw error
  }

  return data as Article
}

// Create new article
export async function createArticle(article: ArticleInsert) {
  const { data, error } = await supabase
    .from('articles')
    .insert([article])
    .select()
    .single()

  if (error) {
    console.error('Error creating article:', error)
    throw error
  }

  return data as Article
}

// Update article
export async function updateArticle(id: string, updates: ArticleUpdate) {
  const { data, error } = await supabase
    .from('articles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating article:', error)
    throw error
  }

  return data as Article
}

// Delete article
export async function deleteArticle(id: string) {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting article:', error)
    throw error
  }

  return true
}

// Increment views count
export async function incrementViews(id: string) {
  const { error } = await supabase.rpc('increment_views', {
    article_id: id
  })

  if (error) {
    console.error('Error incrementing views:', error)
  }
}

// Search articles
export async function searchArticles(query: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching articles:', error)
    throw error
  }

  return data as Article[]
}

// Get articles by tag
export async function getArticlesByTag(tag: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .contains('tags', [tag])
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching articles by tag:', error)
    throw error
  }

  return data as Article[]
}

// Get popular articles (most views)
export async function getPopularArticles(limit: number = 5) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .order('views', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching popular articles:', error)
    throw error
  }

  return data as Article[]
}

// Get recent articles
export async function getRecentArticles(limit: number = 5) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching recent articles:', error)
    throw error
  }

  return data as Article[]
}