import { createClient } from '@supabase/supabase-js';
import { WEATHER_CONFIG } from '../config/weatherConfig';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || WEATHER_CONFIG.supabase.url;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rcmN0eHZuZHZxenRpamhpc3VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxOTAyNDAsImV4cCI6MjEwNDc2NjI0MH0.UO2luQL8abfD_foT-9n_e65IGrCPGdTCTNUPlKxeuhs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
