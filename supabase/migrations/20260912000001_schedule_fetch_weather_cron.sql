-- Migration: 20260912000001_schedule_fetch_weather_cron.sql
-- Description: Enable pg_cron and pg_net extensions and schedule daily fetch-weather Edge Function call at 06:00 UTC (11:30 AM IST)

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Unschedue any pre-existing job to prevent duplicate triggers
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'fetch-weather-daily') THEN
        PERFORM cron.unschedule('fetch-weather-daily');
    END IF;
END $$;

-- 3. Schedule Daily Cloud Weather Fetch Job using pg_cron and pg_net
-- Cron Expression: 0 6 * * * (Every day at 06:00 UTC / 11:30 AM IST)
SELECT cron.schedule(
    'fetch-weather-daily',
    '0 6 * * *',
    $$
    SELECT net.http_post(
        url := 'https://okrctxvndvqztijhisuq.supabase.co/functions/v1/fetch-weather',
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body := '{}'::jsonb,
        timeout_milliseconds := 10000
    );
    $$
);
