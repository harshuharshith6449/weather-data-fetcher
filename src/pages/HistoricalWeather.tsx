import React, { useEffect, useState } from 'react';
import { History, Search, Calendar, RefreshCw, ArrowUpDown, Filter, Database, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { getWeatherDescription } from '../config/weatherConfig';

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

export const HistoricalWeather: React.FC = () => {
  const [records, setRecords] = useState<WeatherRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<'observation_date' | 'temperature' | 'humidity'>('observation_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchHistoricalData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('weather_data')
        .select('*')
        .order(sortField, { ascending: sortOrder === 'asc' });

      if (error) {
        console.error('Fetch historical weather error:', error);
      } else {
        setRecords(data || []);
      }
    } catch (err) {
      console.error('Error querying historical weather:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoricalData();
  }, [sortField, sortOrder]);

  const toggleSort = (field: 'observation_date' | 'temperature' | 'humidity') => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredRecords = records.filter(rec => 
    rec.observation_date.includes(searchTerm) ||
    rec.location_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getWeatherDescription(rec.weather_code).text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Header */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge-glow"><Database size={12} /> SUPABASE POSTGRESQL STORE</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <History style={{ color: '#38bdf8' }} size={28} />
              Historical Weather Log
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              Historical observation records stored in `weather_data` table for Bengaluru, Karnataka, India.
            </p>
          </div>

          <button onClick={fetchHistoricalData} className="btn-primary">
            <RefreshCw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh Records
          </button>
        </div>
      </div>

      {/* Controls & Filters */}
      <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1', minWidth: '260px' }}>
          <Search size={18} style={{ color: '#94a3b8' }} />
          <input 
            type="text"
            placeholder="Search by date (YYYY-MM-DD) or condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '0.6rem 1rem',
              color: '#ffffff',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Filter size={14} /> Sort By:
          </span>
          <button 
            onClick={() => toggleSort('observation_date')}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: sortField === 'observation_date' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15,23,42,0.5)',
              color: sortField === 'observation_date' ? '#38bdf8' : '#94a3b8',
              cursor: 'pointer',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            Date <ArrowUpDown size={12} />
          </button>
          <button 
            onClick={() => toggleSort('temperature')}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: sortField === 'temperature' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15,23,42,0.5)',
              color: sortField === 'temperature' ? '#38bdf8' : '#94a3b8',
              cursor: 'pointer',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            Temperature <ArrowUpDown size={12} />
          </button>
        </div>
      </div>

      {/* Table Data */}
      {loading ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
          <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', color: '#38bdf8', marginBottom: '0.75rem' }} />
          <p>Querying PostgreSQL `weather_data` table...</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
          <AlertCircle size={36} style={{ color: '#f59e0b', marginBottom: '0.75rem' }} />
          <h3>No Historical Weather Records Found</h3>
          <p style={{ marginTop: '0.5rem' }}>Trigger a fresh weather fetch on the Dashboard to insert records into Supabase PostgreSQL.</p>
        </div>
      ) : (
        <div className="glass-card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15, 23, 42, 0.4)', color: '#94a3b8' }}>
                <th style={{ padding: '1rem 1.25rem' }}>Observation Date</th>
                <th style={{ padding: '1rem 1.25rem' }}>Condition</th>
                <th style={{ padding: '1rem 1.25rem' }}>Temp / Apparent</th>
                <th style={{ padding: '1rem 1.25rem' }}>Humidity</th>
                <th style={{ padding: '1rem 1.25rem' }}>Wind Speed</th>
                <th style={{ padding: '1rem 1.25rem' }}>Precipitation</th>
                <th style={{ padding: '1rem 1.25rem' }}>Pressure</th>
                <th style={{ padding: '1rem 1.25rem' }}>Fetched Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((row) => {
                const desc = getWeatherDescription(row.weather_code);
                return (
                  <tr 
                    key={row.id || row.observation_date}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#ffffff', fontFamily: 'JetBrains Mono, monospace' }}>
                      <Calendar size={14} style={{ display: 'inline', marginRight: '6px', color: '#38bdf8' }} />
                      {row.observation_date}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: '#e2e8f0' }}>
                      <span style={{ marginRight: '6px' }}>{desc.icon}</span> {desc.text}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: '#ffffff', fontWeight: 700 }}>
                      {row.temperature}°C <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '0.85rem' }}>({row.apparent_temperature}°C)</span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: '#cbd5e1' }}>{row.humidity}%</td>
                    <td style={{ padding: '1rem 1.25rem', color: '#cbd5e1' }}>{row.wind_speed} km/h</td>
                    <td style={{ padding: '1rem 1.25rem', color: '#cbd5e1' }}>{row.precipitation} mm</td>
                    <td style={{ padding: '1rem 1.25rem', color: '#cbd5e1' }}>{row.surface_pressure} hPa</td>
                    <td style={{ padding: '1rem 1.25rem', color: '#94a3b8', fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace' }}>
                      {new Date(row.fetched_at).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
