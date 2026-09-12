// Supabase Edge Function: fetch-weather
// Student: Harshith T J (24UG00206)
// Project: Weather Data Fetcher
// Target Supabase Project Ref: okrctxvndvqztijhisuq

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const BENGALURU_LAT = 12.9716;
const BENGALURU_LON = 77.5946;
const LOCATION_NAME = "Bengaluru, Karnataka, India";

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log(`[fetch-weather] Initiating real weather fetch for ${LOCATION_NAME}...`);

    // 1. Request real-time weather data from Open-Meteo API
    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${BENGALURU_LAT}&longitude=${BENGALURU_LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,surface_pressure,wind_speed_10m&timezone=Asia/Kolkata`;
    
    const apiResponse = await fetch(openMeteoUrl);
    if (!apiResponse.ok) {
      throw new Error(`Open-Meteo API request failed with status ${apiResponse.status}: ${apiResponse.statusText}`);
    }

    const weatherJson = await apiResponse.json();
    if (!weatherJson || !weatherJson.current) {
      throw new Error("Invalid or empty response payload received from Open-Meteo API.");
    }

    const current = weatherJson.current;
    const observationTimestamp = current.time ? new Date(current.time) : new Date();
    const observationDate = observationTimestamp.toISOString().split("T")[0];

    const weatherPayload = {
      location_name: LOCATION_NAME,
      latitude: BENGALURU_LAT,
      longitude: BENGALURU_LON,
      observation_date: observationDate,
      fetched_at: new Date().toISOString(),
      temperature: Number(current.temperature_2m),
      apparent_temperature: Number(current.apparent_temperature),
      humidity: Number(current.relative_humidity_2m),
      wind_speed: Number(current.wind_speed_10m),
      precipitation: Number(current.precipitation),
      rain: Number(current.rain),
      weather_code: Number(current.weather_code),
      surface_pressure: Number(current.surface_pressure),
    };

    console.log("[fetch-weather] Parsed weather payload:", weatherPayload);

    // 2. Initialize Supabase Client with Privileged Credentials
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://okrctxvndvqztijhisuq.supabase.co";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY") || "";

    if (!supabaseUrl) {
      throw new Error("SUPABASE_URL environment variable is missing.");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 3. Upsert record into weather_data PostgreSQL table
    const { data, error } = await supabase
      .from("weather_data")
      .upsert(weatherPayload, {
        onConflict: "location_name,observation_date",
      })
      .select();

    if (error) {
      console.error("[fetch-weather] Supabase database upsert error:", error);
      throw new Error(`Database operation failed: ${error.message}`);
    }

    const recordId = data && data.length > 0 ? data[0].id : "upserted";

    const responseBody = {
      success: true,
      message: "Weather data fetched successfully from Open-Meteo and stored in Supabase PostgreSQL.",
      location: LOCATION_NAME,
      date: observationDate,
      record_id: recordId,
      weather: weatherPayload,
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(responseBody), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (err: any) {
    console.error("[fetch-weather] Execution error:", err.message);

    return new Response(
      JSON.stringify({
        success: false,
        error: err.message || "An unexpected error occurred while fetching weather data.",
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
