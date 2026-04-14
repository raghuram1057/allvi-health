import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project-url.supabase.co'
const supabaseAnonKey = 'your-public-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)