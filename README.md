# Weather Data Fetcher - Cloud Computing Course Project

**Student Name**: Harshith T J  
**Register Number**: 24UG00206  
**Course**: Cloud Computing Project  
**GitHub Repository**: [https://github.com/harshuharshith6449/weather-data-fetcher.git](https://github.com/harshuharshith6449/weather-data-fetcher.git)  
**Target Supabase Project Ref**: `okrctxvndvqztijhisuq`  
**Target Supabase URL**: `https://okrctxvndvqztijhisuq.supabase.co`  

---

## 1. Project Title
**Weather Data Fetcher: Cloud-Native Automated Atmospheric Data Pipeline**

## 2. Student Name
**Harshith T J**

## 3. Register Number
**24UG00206**

## 4. Project Objective
Build and deploy a complete, serverless, cloud-native Weather Data Fetcher system that:
1. Fetches real-time atmospheric weather metrics for **Bengaluru, Karnataka, India** (Latitude: `12.9716`, Longitude: `77.5946`) from the **Open-Meteo API**.
2. Processes weather parameters through a **Supabase Edge Function** (`fetch-weather`).
3. Stores observation metrics in **Supabase PostgreSQL** (`weather_data` table).
4. Automates daily fetches using **Supabase pg_cron** and **pg_net** scheduled at `0 6 * * *` (11:30 AM IST).
5. Exposes a modern **React/Vite** dashboard with live metrics, manual trigger capability, historical record logs, database analytics/statistics, and dynamic system architecture visualization.
6. Enforces PostgreSQL Row Level Security (RLS).
7. Uses exclusively REAL weather data (zero mock data).

## 5. Problem Statement
Manual collection of atmospheric weather data is prone to inconsistency, human error, and downtime. Building an automated, cloud-based data ingestion pipeline ensures continuous, reliable observation recording without requiring permanent local server infrastructure or user browser sessions.

## 6. Features
- **Live Bengaluru Dashboard**: Real-time display of current temperature, apparent temperature, relative humidity, wind speed, precipitation, rain volume, barometric pressure, and weather status.
- **Manual "Trigger Fetch Now"**: Immediate invocation of the weather fetching routine to fetch and upsert live metrics into PostgreSQL.
- **Historical Weather Records**: Searchable and sortable repository of past weather observations stored in Supabase PostgreSQL.
- **Database-Backed Analytics**: Dynamic calculation of total records, average/max/min temperatures, average humidity, average wind velocity, and accumulated rainfall.
- **Automated Cloud Cron**: Daily cron execution (`0 6 * * *`) via `pg_cron` and `pg_net` that runs independently in the cloud even when all local computers and browsers are powered off.
- **Intentional Row Level Security (RLS)**: Public read access for client applications alongside secure, privileged service-role write access for Edge Functions.
- **Responsive Dark Theme UI**: Glassmorphic styling, custom status badges, animated indicators, and modern typography.

## 7. Technology Stack
- **Frontend Framework**: React 18 + Vite + TypeScript
- **Styling**: Custom CSS Design System (Glassmorphic Dark Theme, Plus Jakarta Sans, JetBrains Mono)
- **UI Components & Icons**: Lucide-React
- **Database & Auth**: Supabase PostgreSQL + Supabase JS Client (`@supabase/supabase-js`)
- **Serverless Compute**: Supabase Edge Functions (Deno Runtime)
- **Automation Scheduler**: Supabase `pg_cron` & `pg_net` extensions
- **Weather API**: Open-Meteo REST API (`api.open-meteo.com`)
- **Deployment & Hosting**: Vercel + GitHub (`main` branch)

## 8. Architecture
```
┌─────────────────┐       ┌──────────────────┐       ┌───────────────────┐
│   Vercel Web    │       │ Supabase pg_cron │       │   Open-Meteo API  │
│ React/Vite App  │       │ (0 6 * * * Daily)│       │  (Bengaluru Data) │
└────────┬────────┘       └────────┬─────────┘       └─────────┬─────────┘
         │                         │                           │
         │ (Read / Trigger)        │ (HTTP POST via pg_net)    │ (JSON Response)
         ▼                         ▼                           │
┌────────────────────────────────────────────────────────────┐ │
│          Supabase Edge Function (`fetch-weather`)           │◄┘
└────────────────────────────┬───────────────────────────────┘
                             │
                             │ (Upsert Payload)
                             ▼
┌────────────────────────────────────────────────────────────┐
│      Supabase PostgreSQL Database (`weather_data` table)    │
│            Row Level Security (RLS) Enabled               │
└────────────────────────────────────────────────────────────┘
```

## 9. Data Flow
1. **Trigger**: Either `pg_cron` fires at 06:00 UTC (11:30 AM IST) or a user clicks **"Trigger Fetch Now"** on the React dashboard.
2. **API Request**: The Supabase Edge Function (`fetch-weather`) sends an HTTP GET request to Open-Meteo API using Bengaluru coordinates (`12.9716`, `77.5946`).
3. **Payload Extraction**: Metrics (`temperature_2m`, `apparent_temperature`, `relative_humidity_2m`, `wind_speed_10m`, `precipitation`, `rain`, `weather_code`, `surface_pressure`) are extracted and formatted.
4. **Database Storage**: The Edge Function upserts the record into the `weather_data` PostgreSQL table using `(location_name, observation_date)` as unique constraint.
5. **Dashboard Render**: The React dashboard queries `weather_data` and `weather_analytics_summary` to display real-time analytics.

## 10. Database Schema
### `weather_data` Table
| Column Name | Type | Constraints / Defaults | Description |
|---|---|---|---|
| `id` | `uuid` | PRIMARY KEY, `gen_random_uuid()` | Unique record identifier |
| `location_name` | `text` | NOT NULL | Location identifier (`Bengaluru, Karnataka, India`) |
| `latitude` | `float8` | NOT NULL | Latitude coordinate (`12.9716`) |
| `longitude` | `float8` | NOT NULL | Longitude coordinate (`77.5946`) |
| `observation_date` | `date` | NOT NULL | Date of weather observation (`YYYY-MM-DD`) |
| `fetched_at` | `timestamptz` | DEFAULT `now()` | Exact timestamp of data retrieval |
| `temperature` | `numeric` | NOT NULL | Air temperature in °C |
| `apparent_temperature` | `numeric` | NOT NULL | Feels-like temperature in °C |
| `humidity` | `numeric` | NOT NULL | Relative humidity percentage (%) |
| `wind_speed` | `numeric` | NOT NULL | Wind velocity at 10m in km/h |
| `precipitation` | `numeric` | NOT NULL | Total precipitation in mm |
| `rain` | `numeric` | NOT NULL | Rain volume in mm |
| `weather_code` | `int4` | NOT NULL | WMO weather code |
| `surface_pressure` | `numeric` | NOT NULL | Barometric pressure in hPa |
| `created_at` | `timestamptz` | DEFAULT `now()` | Database insertion timestamp |

**Unique Constraint**: `UNIQUE(location_name, observation_date)`

## 11. Edge Function
Path: `supabase/functions/fetch-weather/index.ts`
- Language: TypeScript (Deno Runtime)
- Performs HTTP request to Open-Meteo, validates response, constructs payload, and performs an upsert into Supabase PostgreSQL.
- Includes CORS headers (`Access-Control-Allow-Origin: *`).

## 12. Open-Meteo Integration
- Endpoint: `https://api.open-meteo.com/v1/forecast`
- Parameters: `latitude=12.9716&longitude=77.5946&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,surface_pressure,wind_speed_10m&timezone=Asia/Kolkata`
- No API key required; strictly real meteorological data processed.

## 13. pg_cron Scheduling
- Job Name: `fetch-weather-daily`
- Schedule Expression: `0 6 * * *` (06:00 UTC = 11:30 AM IST daily)
- SQL Definition:
```sql
SELECT cron.schedule(
    'fetch-weather-daily',
    '0 6 * * *',
    $$
    SELECT net.http_post(
        url := 'https://okrctxvndvqztijhisuq.supabase.co/functions/v1/fetch-weather',
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body := '{}'::jsonb
    );
    $$
);
```

## 14. pg_net
The `pg_net` PostgreSQL extension allows asynchronous HTTP requests directly from inside PostgreSQL cron tasks to trigger serverless Edge Functions without blocking database worker threads.

## 15. RLS / Security Model
- **Table Security**: Row Level Security enabled on `weather_data`.
- **Public Policy**: SELECT allowed for `anon` and `authenticated` roles to serve web client dashboards.
- **Service Role Policy**: INSERT / UPDATE privileges restricted to `service_role` or authorized Edge Functions.
- **Zero Exposure**: `SUPABASE_SERVICE_ROLE_KEY` is NEVER bundled in client-side code, Git repos, or frontend environment variables.

## 16. Local Setup
```bash
# Clone repository
git clone https://github.com/harshuharshith6449/weather-data-fetcher.git
cd weather-data-fetcher

# Install dependencies
npm install

# Configure environment variables (.env)
cp .env.example .env

# Run development server
npm run dev

# Run production build
npm run build
```

## 17. Supabase Setup
```bash
# Login to Supabase CLI
npx supabase login

# Link local repository to target project
npx supabase link --project-ref okrctxvndvqztijhisuq

# Push database migrations
npx supabase db push

# Deploy fetch-weather Edge Function
npx supabase functions deploy fetch-weather --project-ref okrctxvndvqztijhisuq
```

## 18. GitHub Repository
- URL: [https://github.com/harshuharshith6449/weather-data-fetcher.git](https://github.com/harshuharshith6449/weather-data-fetcher.git)
- Branch: `main`

## 19. Vercel Deployment
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables required on Vercel:
  - `VITE_SUPABASE_URL`: `https://okrctxvndvqztijhisuq.supabase.co`
  - `VITE_SUPABASE_ANON_KEY`: `[Browser-safe anon key]`
- Routing: Configured via `vercel.json` SPA rewrites.

## 20. Testing & Verification
1. **Build Test**: Executed `npm run build` -> Clean success (`dist/index.html`, `dist/assets/`).
2. **API Verification**: Tested live Open-Meteo REST API endpoint for Bengaluru -> Returned real meteorological values (30.8°C, 40% humidity, 910.3 hPa).
3. **Database Verification**: Verified SQL migration schemas, UNIQUE constraints, indexes, and RLS policies.
4. **Security Audit**: Scanned repository for secret keys -> Confirmed zero service-role keys exposed in frontend code.

## 21. Future Enhancements
- Interactive historical trend charts using Recharts or Chart.js.
- Multi-city location selector allowing users to compare Bengaluru weather with other regions in Karnataka.
- Automated email alerts via Supabase Webhooks when extreme weather conditions (heavy rain/high temperature) are observed.
