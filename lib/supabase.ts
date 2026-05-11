// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Add error checking
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('supabaseUrl and supabaseAnonKey are required. Check your environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)