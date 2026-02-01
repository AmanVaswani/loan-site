import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Server-side client (with service key for full access)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Client-side client (with anon key for limited access)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
