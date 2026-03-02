import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl); // Debug
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Found' : 'Missing'); // Debug

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials missing! Check your .env file and RESTART THE DEV SERVER.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
