import React from 'react';
import { Sun, Moon, Dumbbell } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export default function Header({ lastUpdatedDate, theme, toggleTheme, dataSource }) {
  return (
    <header className="glass-card flex items-center justify-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--accent-gold), #ec4899)',
          borderRadius: '0.75rem',
          padding: '0.625rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)'
        }}>
          <Dumbbell size={24} />
        </div>
        <div>
          <h1 className="text-display" style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            margin: 0,
            background: 'linear-gradient(to right, var(--text-primary), var(--text-secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>
            NASCENIA FITTRACK
          </h1>
          {lastUpdatedDate && (
            <p style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              fontWeight: 500,
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <span>Last Updated: <span style={{ color: 'var(--text-secondary)' }}>{formatDate(lastUpdatedDate)}</span></span>
              <span style={{ color: 'var(--text-muted)', opacity: 0.5 }}>|</span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                padding: '0.1rem 0.5rem',
                borderRadius: '9999px',
                background: dataSource === 'sheets'
                  ? 'rgba(16, 185, 129, 0.08)'
                  : dataSource === 'fallback'
                    ? 'rgba(239, 68, 68, 0.08)'
                    : 'rgba(115, 115, 115, 0.08)',
                color: dataSource === 'sheets'
                  ? '#10b981'
                  : dataSource === 'fallback'
                    ? '#ef4444'
                    : 'var(--text-muted)',
                border: `1px solid ${dataSource === 'sheets'
                    ? 'rgba(16, 185, 129, 0.15)'
                    : dataSource === 'fallback'
                      ? 'rgba(239, 68, 68, 0.15)'
                      : 'rgba(115, 115, 115, 0.15)'
                  }`
              }}>
                <span style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: dataSource === 'sheets'
                    ? '#10b981'
                    : dataSource === 'fallback'
                      ? '#ef4444'
                      : 'var(--text-muted)',
                  display: 'inline-block',
                  boxShadow: dataSource === 'sheets'
                    ? '0 0 4px #10b981'
                    : dataSource === 'fallback'
                      ? '0 0 4px #ef4444'
                      : 'none'
                }}></span>
                {dataSource === 'sheets'
                  ? 'Live Sync'
                  : dataSource === 'fallback'
                    ? 'Fallback'
                    : 'Static Data'}
              </span>
            </p>
          )}
        </div>
      </div>

      <button
        onClick={toggleTheme}
        className="theme-btn"
        aria-label="Toggle Theme"
        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {theme === 'dark' ? <Sun size={20} style={{ color: 'var(--accent-gold)' }} /> : <Moon size={20} />}
      </button>
    </header>
  );
}
