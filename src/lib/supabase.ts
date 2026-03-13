import { createClient } from '@supabase/supabase-js'

console.log('Inicializando Supabase...');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY (primeros 10 chars):', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 10));

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
