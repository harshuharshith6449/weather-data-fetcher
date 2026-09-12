import { createClient } from '@supabase/supabase-js';
import { WEATHER_CONFIG } from '../config/weatherConfig';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || WEATHER_CONFIG.supabase.url;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rcmN0eHZuZHZxenRpamhpc3VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxODMxNjEsImV4cCI6MjEwNDc1OTE2MX0.placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
