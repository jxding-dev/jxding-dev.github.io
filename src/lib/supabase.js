import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const hasPlaceholderValue =
  supabaseUrl === 'https://your-project-ref.supabase.co' ||
  supabaseAnonKey === 'your-supabase-anon-key';

function isValidSupabaseUrl(value) {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname.endsWith('.supabase.co');
  } catch {
    return false;
  }
}

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !hasPlaceholderValue && isValidSupabaseUrl(supabaseUrl)
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
