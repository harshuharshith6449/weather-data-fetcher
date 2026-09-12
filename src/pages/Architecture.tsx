import React from 'react';
import { 
  Network, 
  Server, 
  Clock, 
  Database, 
  CloudSun, 
  ShieldCheck, 
  ArrowRight, 
  Cpu, 
  Globe, 
  CheckCircle2,
  Lock,
  Layers
} from 'lucide-react';
import { WEATHER_CONFIG } from '../config/weatherConfig';

export const Architecture: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge-glow"><Network size={12} /> SYSTEM DESIGN & CLOUD ARCHITECTURE</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Cpu style={{ color: '#38bdf8' }} size={28} />
              Cloud Architecture & Data Flow
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              End-to-end technical overview of the automated serverless weather data ingestion pipeline.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Pipeline Flow */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers style={{ color: '#38bdf8' }} size={20} /> End-to-End System Pipeline
        </h3>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', background: 'rgba(15, 23, 42, 0.6)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ textAlign: 'center', flex: '1', minWidth: '120px' }}>
            <div style={{ width: '48px', height: '48px', margin: '0 auto 0.5rem auto', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={24} />
            </div>
            <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem' }}>Vercel Edge</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>React/Vite App</div>
          </div>

          <ArrowRight size={20} style={{ color: '#64748b' }} />

          <div style={{ textAlign: 'center', flex: '1', minWidth: '120px' }}>
            <div style={{ width: '48px', height: '48px', margin: '0 auto 0.5rem auto', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={24} />
            </div>
            <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem' }}>Supabase pg_cron</div>
            <div style={{ fontSize: '0.75rem', color: '#818cf8', fontFamily: 'JetBrains Mono, monospace' }}>0 6 * * *</div>
          </div>

          <ArrowRight size={20} style={{ color: '#64748b' }} />

          <div style={{ textAlign: 'center', flex: '1', minWidth: '120px' }}>
            <div style={{ width: '48px', height: '48px', margin: '0 auto 0.5rem auto', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Server size={24} />
            </div>
            <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem' }}>pg_net HTTP Call</div>
            <div style={{ fontSize: '0.75rem', color: '#34d399' }}>POST Request</div>
          </div>

          <ArrowRight size={20} style={{ color: '#64748b' }} />

          <div style={{ textAlign: 'center', flex: '1', minWidth: '120px' }}>
            <div style={{ width: '48px', height: '48px', margin: '0 auto 0.5rem auto', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu size={24} />
            </div>
            <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem' }}>Edge Function</div>
            <div style={{ fontSize: '0.75rem', color: '#fbbf24', fontFamily: 'JetBrains Mono, monospace' }}>fetch-weather</div>
          </div>

          <ArrowRight size={20} style={{ color: '#64748b' }} />

          <div style={{ textAlign: 'center', flex: '1', minWidth: '120px' }}>
            <div style={{ width: '48px', height: '48px', margin: '0 auto 0.5rem auto', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CloudSun size={24} />
            </div>
            <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem' }}>Open-Meteo API</div>
            <div style={{ fontSize: '0.75rem', color: '#fb7185' }}>Bengaluru Coordinates</div>
          </div>

          <ArrowRight size={20} style={{ color: '#64748b' }} />

          <div style={{ textAlign: 'center', flex: '1', minWidth: '120px' }}>
            <div style={{ width: '48px', height: '48px', margin: '0 auto 0.5rem auto', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Database size={24} />
            </div>
            <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem' }}>Supabase PostgreSQL</div>
            <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontFamily: 'JetBrains Mono, monospace' }}>weather_data</div>
          </div>
        </div>
      </div>

      {/* Component Parameters Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#38bdf8', marginBottom: '1rem' }}>
            <Cpu size={20} />
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', fontWeight: 700 }}>Supabase Edge Function</h3>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
            <li><strong>Function Name:</strong> <code style={{ color: '#38bdf8' }}>{WEATHER_CONFIG.supabase.functionName}</code></li>
            <li><strong>Runtime:</strong> Deno / Supabase Edge Runtime</li>
            <li><strong>Target Project:</strong> <code style={{ color: '#818cf8' }}>{WEATHER_CONFIG.supabase.projectRef}</code></li>
            <li><strong>Endpoint URL:</strong> <div style={{ fontSize: '0.8rem', color: '#94a3b8', wordBreak: 'break-all', fontFamily: 'JetBrains Mono, monospace', marginTop: '0.2rem' }}>{WEATHER_CONFIG.supabase.edgeFunctionUrl}</div></li>
          </ul>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#818cf8', marginBottom: '1rem' }}>
            <Clock size={20} />
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', fontWeight: 700 }}>Cloud Scheduler (pg_cron)</h3>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
            <li><strong>Job Name:</strong> <code style={{ color: '#818cf8' }}>{WEATHER_CONFIG.cron.name}</code></li>
            <li><strong>Cron Expression:</strong> <code style={{ color: '#34d399' }}>{WEATHER_CONFIG.cron.expression}</code></li>
            <li><strong>Execution Schedule:</strong> {WEATHER_CONFIG.cron.scheduleDescription}</li>
            <li><strong>HTTP Invoker:</strong> PostgreSQL <code style={{ color: '#38bdf8' }}>pg_net</code> extension</li>
          </ul>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#34d399', marginBottom: '1rem' }}>
            <Database size={20} />
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', fontWeight: 700 }}>PostgreSQL Storage</h3>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
            <li><strong>Target Table:</strong> <code style={{ color: '#34d399' }}>weather_data</code></li>
            <li><strong>Unique Constraint:</strong> <code style={{ color: '#fbbf24' }}>UNIQUE(location_name, observation_date)</code></li>
            <li><strong>Analytics View:</strong> <code style={{ color: '#38bdf8' }}>weather_analytics_summary</code></li>
            <li><strong>RLS Security:</strong> Enabled (Public SELECT, Service-Role Write)</li>
          </ul>
        </div>
      </div>

      {/* Security Boundaries Explanation */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck style={{ color: '#34d399' }} size={22} /> Security Model & Credential Isolation
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 700, marginBottom: '0.5rem' }}>
              <Globe size={18} /> Frontend Security Boundary
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
              The client-side browser receives ONLY the public anonymous key (<code style={{ color: '#38bdf8' }}>VITE_SUPABASE_ANON_KEY</code>). It is restricted by RLS policies to perform SELECT queries only on <code style={{ color: '#38bdf8' }}>weather_data</code>.
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontWeight: 700, marginBottom: '0.5rem' }}>
              <Lock size={18} /> Edge Function Privileged Boundary
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Privileged write access relies on <code style={{ color: '#fbbf24' }}>SUPABASE_SERVICE_ROLE_KEY</code>, which is isolated strictly server-side within the Supabase Edge Runtime environment and NEVER exposed to frontend bundles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
