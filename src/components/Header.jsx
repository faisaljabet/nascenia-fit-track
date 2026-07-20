import React from 'react';
import { Sun, Moon, Dumbbell } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export default function Header({ lastUpdatedDate, theme, toggleTheme }) {
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
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '2px' }}>
              Last Updated: <span style={{ color: 'var(--text-secondary)' }}>{formatDate(lastUpdatedDate)}</span>
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
