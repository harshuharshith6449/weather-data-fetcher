import React, { useState } from 'react';
import { CloudSun, LayoutDashboard, History, BarChart3, Cpu, MapPin, UserCheck } from 'lucide-react';
import { WEATHER_CONFIG } from './config/weatherConfig';
import { Dashboard } from './pages/Dashboard';
import { HistoricalWeather } from './pages/HistoricalWeather';
import { Statistics } from './pages/Statistics';
import { Architecture } from './pages/Architecture';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'historical' | 'statistics' | 'architecture'>('dashboard');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header Bar */}
      <header style={{
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '0.85rem 1.5rem'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          {/* Logo & Student Metadata */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0284c7 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)'
            }}>
              <CloudSun size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
                Weather Data Fetcher
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#38bdf8', fontWeight: 600 }}>{WEATHER_CONFIG.student.name} ({WEATHER_CONFIG.student.registerNumber})</span>
                <span>&bull;</span>
                <span>Ref: <code style={{ color: '#818cf8' }}>{WEATHER_CONFIG.supabase.projectRef}</code></span>
              </div>
            </div>
          </div>

          {/* Tab Navigation Controls */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(30, 41, 59, 0.6)', padding: '0.35rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'dashboard' ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' : 'transparent',
                color: activeTab === 'dashboard' ? '#ffffff' : '#94a3b8',
                fontWeight: activeTab === 'dashboard' ? 600 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
            >
              <LayoutDashboard size={16} /> Dashboard
            </button>

            <button
              onClick={() => setActiveTab('historical')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'historical' ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' : 'transparent',
                color: activeTab === 'historical' ? '#ffffff' : '#94a3b8',
                fontWeight: activeTab === 'historical' ? 600 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
            >
              <History size={16} /> Historical Weather
            </button>

            <button
              onClick={() => setActiveTab('statistics')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'statistics' ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' : 'transparent',
                color: activeTab === 'statistics' ? '#ffffff' : '#94a3b8',
                fontWeight: activeTab === 'statistics' ? 600 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
            >
              <BarChart3 size={16} /> Statistics
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'architecture' ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' : 'transparent',
                color: activeTab === 'architecture' ? '#ffffff' : '#94a3b8',
                fontWeight: activeTab === 'architecture' ? 600 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
            >
              <Cpu size={16} /> System & Architecture
            </button>
          </nav>
        </div>
      </header>

      {/* Main View Area */}
      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'historical' && <HistoricalWeather />}
        {activeTab === 'statistics' && <Statistics />}
        {activeTab === 'architecture' && <Architecture />}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
        Cloud Computing Course Project &bull; <strong>{WEATHER_CONFIG.student.name}</strong> ({WEATHER_CONFIG.student.registerNumber}) &bull; Supabase Project Reference: <code style={{ color: '#818cf8' }}>{WEATHER_CONFIG.supabase.projectRef}</code>
      </footer>
    </div>
  );
};
