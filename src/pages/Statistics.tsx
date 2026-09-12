import React, { useEffect, useState } from 'react';
import { BarChart3, Database, RefreshCw, Thermometer, Wind, Droplets, CloudRain, Layers, Activity } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { WEATHER_CONFIG } from '../config/weatherConfig';

interface AnalyticsSummary {
  location_name: string;
  total_records: number;
  avg_temperature: number;
  max_temperature: number;
  min_temperature: number;
  avg_humidity: number;
  avg_wind_speed: number;
  total_precipitation: number;
  last_updated?: string;
}

export const Statistics: React.FC = () => {
  const [stats, setStats] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      // 1. First attempt to read from weather_analytics_summary database view
      const { data: viewData, error: viewErr } = await supabase
        .from('weather_analytics_summary')
        .select('*')
        .limit(1);

      if (!viewErr && viewData && viewData.length > 0) {
        setStats(viewData[0]);
        return;
      }

      // 2. Fallback: Aggregate directly from weather_data table
      const { data: rows, error: rowsErr } = await supabase
        .from('weather_data')
        .select('*');

      if (rowsErr) {
        throw rowsErr;
      }

      if (rows && rows.length > 0) {
        const total = rows.length;
        const temps = rows.map(r => Number(r.temperature));
        const humidities = rows.map(r => Number(r.humidity));
        const winds = rows.map(r => Number(r.wind_speed));
        const precip = rows.map(r => Number(r.precipitation));

        const avgTemp = temps.reduce((a, b) => a + b, 0) / total;
        const maxTemp = Math.max(...temps);
        const minTemp = Math.min(...temps);
        const avgHum = humidities.reduce((a, b) => a + b, 0) / total;
        const avgWind = winds.reduce((a, b) => a + b, 0) / total;
        const sumPrecip = precip.reduce((a, b) => a + b, 0);

        setStats({
          location_name: WEATHER_CONFIG.location.name,
          total_records: total,
          avg_temperature: Number(avgTemp.toFixed(2)),
          max_temperature: Number(maxTemp.toFixed(2)),
          min_temperature: Number(minTemp.toFixed(2)),
          avg_humidity: Number(avgHum.toFixed(2)),
          avg_wind_speed: Number(avgWind.toFixed(2)),
          total_precipitation: Number(sumPrecip.toFixed(2))
        });
      } else {
        setStats(null);
      }
    } catch (err: any) {
      console.error('Analytics fetch error:', err);
      setErrorMsg(err.message || 'Failed to calculate database statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge-glow"><Activity size={12} /> DATABASE AGGREGATIONS</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <BarChart3 style={{ color: '#38bdf8' }} size={28} />
              Weather Analytics & Statistics
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              Database-calculated summary metrics derived strictly from PostgreSQL stored observations.
            </p>
          </div>

          <button onClick={fetchAnalytics} className="btn-primary">
            <RefreshCw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Recalculate Stats
          </button>
        </div>
      </div>

      {loading ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
          <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', color: '#38bdf8', marginBottom: '0.75rem' }} />
          <p>Calculating database aggregations from PostgreSQL...</p>
        </div>
      ) : stats ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Top Summary Banner */}
          <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location Context</span>
                <h3 style={{ fontSize: '1.4rem', color: '#ffffff', fontWeight: 700, marginTop: '0.2rem' }}>{stats.location_name}</h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Weather Observations</span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', fontFamily: 'JetBrains Mono, monospace' }}>
                  {stats.total_records} <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 400 }}>records</span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Analytics Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#38bdf8', marginBottom: '0.75rem' }}>
                <Thermometer size={22} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Average Temperature</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>{stats.avg_temperature} °C</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.35rem' }}>Mean temperature across all daily logs</div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#f43f5e', marginBottom: '0.75rem' }}>
                <Thermometer size={22} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Maximum Temperature</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f43f5e' }}>{stats.max_temperature} °C</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.35rem' }}>Highest recorded temperature</div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#38bdf8', marginBottom: '0.75rem' }}>
                <Thermometer size={22} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Minimum Temperature</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8' }}>{stats.min_temperature} °C</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.35rem' }}>Lowest recorded temperature</div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#818cf8', marginBottom: '0.75rem' }}>
                <Droplets size={22} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Average Humidity</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>{stats.avg_humidity}%</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.35rem' }}>Mean relative humidity</div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#38bdf8', marginBottom: '0.75rem' }}>
                <Wind size={22} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Average Wind Speed</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>{stats.avg_wind_speed} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>km/h</span></div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.35rem' }}>Mean surface wind velocity</div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#34d399', marginBottom: '0.75rem' }}>
                <CloudRain size={22} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Total Precipitation</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399' }}>{stats.total_precipitation} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>mm</span></div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.35rem' }}>Accumulated rainfall volume</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
          <Database size={36} style={{ color: '#f59e0b', marginBottom: '0.75rem' }} />
          <h3>No Data Available for Aggregation</h3>
          <p style={{ marginTop: '0.5rem' }}>Please trigger a weather fetch on the Dashboard page to populate PostgreSQL records.</p>
        </div>
      )}
    </div>
  );
};
