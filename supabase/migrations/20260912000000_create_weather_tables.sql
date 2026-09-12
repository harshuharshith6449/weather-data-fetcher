-- Migration: 20260912000000_create_weather_tables.sql
-- Description: Create weather_data table, RLS policies, indexes, weather_analytics_summary view, and Data API grants for Harshith T J (24UG00206)

-- 1. Create weather_data table
CREATE TABLE IF NOT EXISTS public.weather_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_name TEXT NOT NULL,
    latitude FLOAT8 NOT NULL,
    longitude FLOAT8 NOT NULL,
    observation_date DATE NOT NULL,
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    temperature NUMERIC NOT NULL,
    apparent_temperature NUMERIC NOT NULL,
    humidity NUMERIC NOT NULL,
    wind_speed NUMERIC NOT NULL,
    precipitation NUMERIC NOT NULL,
    rain NUMERIC NOT NULL,
    weather_code INT4 NOT NULL,
    surface_pressure NUMERIC NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_location_observation_date UNIQUE (location_name, observation_date)
);

-- 2. Create Indexes for Performance Optimization
CREATE INDEX IF NOT EXISTS idx_weather_data_location_date 
    ON public.weather_data (location_name, observation_date);

CREATE INDEX IF NOT EXISTS idx_weather_data_observation_date 
    ON public.weather_data (observation_date DESC);

CREATE INDEX IF NOT EXISTS idx_weather_data_fetched_at 
    ON public.weather_data (fetched_at DESC);

-- 3. Enable PostgreSQL Row Level Security (RLS)
ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies to prevent conflicts during re-runs
DROP POLICY IF EXISTS "Allow public read access" ON public.weather_data;
DROP POLICY IF EXISTS "Allow service role write access" ON public.weather_data;
DROP POLICY IF EXISTS "Allow service role insert" ON public.weather_data;
DROP POLICY IF EXISTS "Allow service role update" ON public.weather_data;

-- 5. Define Intentional RLS Security Policies
-- Policy A: Allow anonymous and authenticated client-side browsers to SELECT weather records
CREATE POLICY "Allow public read access" 
    ON public.weather_data 
    FOR SELECT 
    USING (true);

-- Policy B: Allow full access for service_role and anon
CREATE POLICY "Allow service role write access" 
    ON public.weather_data 
    FOR ALL 
    USING (auth.role() = 'service_role' OR auth.role() = 'anon');

-- 6. Explicit Data API Table & Schema Grants
GRANT ALL ON TABLE public.weather_data TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.weather_data TO anon, authenticated, service_role;

-- 7. Create weather_analytics_summary View for Database-Backed Statistics
CREATE OR REPLACE VIEW public.weather_analytics_summary AS
SELECT 
    location_name,
    COUNT(*)::INT AS total_records,
    ROUND(AVG(temperature)::NUMERIC, 2) AS avg_temperature,
    MAX(temperature) AS max_temperature,
    MIN(temperature) AS min_temperature,
    ROUND(AVG(humidity)::NUMERIC, 2) AS avg_humidity,
    ROUND(AVG(wind_speed)::NUMERIC, 2) AS avg_wind_speed,
    ROUND(SUM(precipitation)::NUMERIC, 2) AS total_precipitation,
    MAX(fetched_at) AS last_updated
FROM public.weather_data
GROUP BY location_name;

-- Grant access on the view
GRANT SELECT ON public.weather_analytics_summary TO anon, authenticated, service_role;

-- 8. Create RPC Function for Dynamic Frontend Analytics Querying
CREATE OR REPLACE FUNCTION public.get_weather_stats()
RETURNS TABLE (
    location TEXT,
    total_records INT,
    avg_temp NUMERIC,
    max_temp NUMERIC,
    min_temp NUMERIC,
    avg_humidity NUMERIC,
    avg_wind_speed NUMERIC,
    total_precipitation NUMERIC
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT 
        location_name AS location,
        COUNT(*)::INT AS total_records,
        ROUND(AVG(temperature)::NUMERIC, 2) AS avg_temp,
        MAX(temperature) AS max_temp,
        MIN(temperature) AS min_temp,
        ROUND(AVG(humidity)::NUMERIC, 2) AS avg_humidity,
        ROUND(AVG(wind_speed)::NUMERIC, 2) AS avg_wind_speed,
        ROUND(SUM(precipitation)::NUMERIC, 2) AS total_precipitation
    FROM public.weather_data
    GROUP BY location_name;
$$;

GRANT EXECUTE ON FUNCTION public.get_weather_stats() TO anon, authenticated, service_role;

-- 9. Force PostgREST Data API to Reload Schema Cache Immediately
NOTIFY pgrst, 'reload schema';
