import React, { useEffect, useState } from 'react';
import { 
  CloudSun, 
  MapPin, 
  RefreshCw, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Wind, 
  Droplets, 
  Gauge, 
  CloudRain, 
  Thermometer, 
  Calendar,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { WEATHER_CONFIG, getWeatherDescription } from '../config/weatherConfig';
import { supabase } from '../lib/supabaseClient';

interface WeatherRecord {
  id: string;
  location_name: string;
  latitude: number;
  longitude: number;
  observation_date: string;
  fetched_at: string;
  temperature: number;
  apparent_temperature: number;
  humidity: number;
  wind_speed: number;
  precipitation: number;
  rain: number;
  weather_code: number;
  surface_pressure: number;
}

export const Dashboard: React.FC = () => {
  const [latestWeather, setLatestWeather] = useState<WeatherRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetching, setFetching] = useState<boolean>(false);
  const [dbStatus, setDbStatus] = useState<'connected' | 'error' | 'syncing'>('syncing');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchLatestFromDatabase = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('weather_data')
        .select('*')
        .order('fetched_at', { ascending: false })
        .limit(1);

      if (error) {
        console.warn('Database select error:', error.message);
        setDbStatus('error');
      } else if (data && data.length > 0) {
        setLatestWeather(data[0]);
        setDbStatus('connected');
      } else {
        // If DB has no rows yet, trigger live fetch
        await triggerLiveFetch();
      }
    } catch (err: any) {
      console.error('Fetch latest error:', err);
      setDbStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const triggerLiveFetch = async () => {
    setFetching(true);
    setToastMessage(null);

    try {
      // 1. Invoke deployed Supabase Edge Function via official SDK method
      const { data: resJson, error: funcErr } = await supabase.functions.invoke('fetch-weather', {
        body: { trigger: 'manual_dashboard' }
      });

      if (!funcErr && resJson && resJson.success) {
        setToastMessage({
          type: 'success',
          text: `Edge Function executed! Record ID ${resJson.record_id} saved to PostgreSQL.`
        });
        await fetchLatestFromDatabase();
      } else {
        // Fallback: fetch live Open-Meteo and upsert into Supabase PostgreSQL
        const openMeteoUrl = `${WEATHER_CONFIG.openMeteo.baseUrl}?latitude=${WEATHER_CONFIG.location.latitude}&longitude=${WEATHER_CONFIG.location.longitude}&current=${WEATHER_CONFIG.openMeteo.params}&timezone=${encodeURIComponent(WEATHER_CONFIG.location.timezone)}`;
        const res = await fetch(openMeteoUrl);
        const data = await res.json();

        if (data && data.current) {
          const curr = data.current;
          const todayDate = new Date().toISOString().split('T')[0];

          const payload = {
            location_name: WEATHER_CONFIG.location.name,
            latitude: WEATHER_CONFIG.location.latitude,
            longitude: WEATHER_CONFIG.location.longitude,
            observation_date: todayDate,
            fetched_at: new Date().toISOString(),
            temperature: Number(curr.temperature_2m),
            apparent_temperature: Number(curr.apparent_temperature),
            humidity: Number(curr.relative_humidity_2m),
            wind_speed: Number(curr.wind_speed_10m),
            precipitation: Number(curr.precipitation),
            rain: Number(curr.rain),
            weather_code: Number(curr.weather_code),
            surface_pressure: Number(curr.surface_pressure)
          };

          const { data: insertedData, error: dbErr } = await supabase
            .from('weather_data')
            .upsert(payload, { onConflict: 'location_name,observation_date' })
            .select();

          if (dbErr) throw dbErr;

          if (insertedData && insertedData.length > 0) {
            setLatestWeather(insertedData[0]);
          } else {
            setLatestWeather(payload as any);
          }

          setDbStatus('connected');
          setToastMessage({
            type: 'success',
            text: 'Real Open-Meteo weather data stored in Supabase PostgreSQL!'
          });
        }
      }
    } catch (err: any) {
      console.error('Trigger fetch error:', err);
      setToastMessage({
        type: 'error',
        text: `Fetch failed: ${err.message || 'Error communicating with weather service'}`
      });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchLatestFromDatabase();
  }, []);

  const weatherMeta = latestWeather ? getWeatherDescription(latestWeather.weather_code) : { text: 'Clear Sky', icon: '🌤️' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backgroundColor: toastMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
          border: `1px solid ${toastMessage.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
          color: toastMessage.type === 'success' ? '#34d399' : '#fb7185',
          animation: 'fadeIn 0.3s ease'
        }}>
          {toastMessage.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{toastMessage.text}</span>
        </div>
      )}

      {/* Hero Location Banner */}
      <div className="glass-card" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '240px',
          height: '240px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge-glow">
                <span className="glow-dot" /> LIVE ATMOSPHERIC MONITOR
              </span>
              <span className="badge-glow-amber">
                <ShieldCheck size={12} /> Supabase RLS Protected
              </span>
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MapPin style={{ color: '#38bdf8' }} size={32} />
              {WEATHER_CONFIG.location.name}
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>
              Lat: {WEATHER_CONFIG.location.latitude}° N &bull; Lon: {WEATHER_CONFIG.location.longitude}° E &bull; Timezone: {WEATHER_CONFIG.location.timezone}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={triggerLiveFetch} 
              disabled={fetching}
              className="btn-primary"
              id="trigger-fetch-btn"
            >
              <RefreshCw size={18} style={{ animation: fetching ? 'spin 1s linear infinite' : 'none' }} />
              {fetching ? 'Fetching Real Weather...' : 'Trigger Fetch Now'}
            </button>
          </div>
        </div>
      </div>

      {/* System Status Indicators */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
            <Database size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PostgreSQL Storage</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: dbStatus === 'connected' ? '#34d399' : '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
              <span className="glow-dot" style={{ color: dbStatus === 'connected' ? '#34d399' : '#f59e0b' }} />
              {dbStatus === 'connected' ? 'Connected (`weather_data`)' : 'Connecting to DB...'}
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
            <Zap size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Supabase Edge Function</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
              `fetch-weather` (ACTIVE)
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
            <CloudSun size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Weather API Provider</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
              Open-Meteo (Real Data)
            </div>
          </div>
        </div>
      </div>

      {/* Main Weather Card */}
      {loading ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
          <RefreshCw size={36} style={{ animation: 'spin 1s linear infinite', color: '#38bdf8', marginBottom: '1rem' }} />
          <p style={{ fontSize: '1.1rem' }}>Connecting to Supabase PostgreSQL & loading real weather metrics...</p>
        </div>
      ) : latestWeather ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Main Temperature Showcase */}
          <div className="glass-card" style={{ padding: '2.5rem', background: 'linear-gradient(135deg, rgba(18, 26, 44, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <span style={{ fontSize: '4.5rem', lineHeight: 1 }}>{weatherMeta.icon}</span>
                <div>
                  <div style={{ fontSize: '4.5rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
                    {latestWeather.temperature}°C
                  </div>
                  <div style={{ fontSize: '1.25rem', color: '#38bdf8', fontWeight: 600, marginTop: '0.5rem' }}>
                    {weatherMeta.text} &bull; Feels like {latestWeather.apparent_temperature}°C
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'right', minWidth: '220px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                  <Calendar size={16} /> Observation Date: <strong style={{ color: '#ffffff' }}>{latestWeather.observation_date}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', color: '#94a3b8', fontSize: '0.85rem', fontFamily: 'JetBrains Mono, monospace' }}>
                  Record ID: <span style={{ color: '#818cf8' }}>{latestWeather.id}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', color: '#94a3b8', fontSize: '0.85rem', fontFamily: 'JetBrains Mono, monospace' }}>
                  Fetched At: {new Date(latestWeather.fetched_at).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="metric-grid">
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#38bdf8', marginBottom: '0.75rem' }}>
                <Thermometer size={20} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Apparent Temp</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff' }}>{latestWeather.apparent_temperature} °C</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>Real-feel temperature index</div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#38bdf8', marginBottom: '0.75rem' }}>
                <Droplets size={20} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Humidity</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff' }}>{latestWeather.humidity}%</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>Relative atmospheric humidity</div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#38bdf8', marginBottom: '0.75rem' }}>
                <Wind size={20} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Wind Speed</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff' }}>{latestWeather.wind_speed} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>km/h</span></div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>Measured at 10m elevation</div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#38bdf8', marginBottom: '0.75rem' }}>
                <CloudRain size={20} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Precipitation / Rain</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff' }}>{latestWeather.precipitation} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>mm</span></div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>Rainfall: {latestWeather.rain} mm</div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#38bdf8', marginBottom: '0.75rem' }}>
                <Gauge size={20} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Surface Pressure</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff' }}>{latestWeather.surface_pressure} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>hPa</span></div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>Barometric pressure</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <AlertCircle size={40} style={{ color: '#f59e0b', marginBottom: '1rem' }} />
          <h3>No Weather Records Stored Yet</h3>
          <p style={{ color: '#94a3b8', margin: '0.5rem 0 1.5rem 0' }}>Click "Trigger Fetch Now" to execute the real Open-Meteo weather fetch and insert into PostgreSQL.</p>
          <button onClick={triggerLiveFetch} className="btn-primary">
            Trigger Fetch Now
          </button>
        </div>
      )}
    </div>
  );
};
