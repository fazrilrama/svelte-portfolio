// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Supabase credentials - JANGAN commit ke git, gunakan .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types untuk database
export interface Article {
  id: string
  created_at: string
  title: string
  slug: string
  body_html: string
  url?: string
  excerpt?: string
  cover_image?: string
  published: boolean
  views?: number
  tags?: string[]
}

export interface ArticleInsert {
  title: string
  slug: string
  body_html: string
  url?: string
  excerpt?: string
  cover_image?: string
  published?: boolean
  tags?: string[]
}

export interface ArticleUpdate {
  title?: string
  slug?: string
  body_html?: string
  url?: string
  excerpt?: string
  cover_image?: string
  published?: boolean
  tags?: string[]
}