import React from 'react';
import { Trophy, TrendingDown, Sparkles } from 'lucide-react';
import { formatWeight } from '../utils/formatters';

export default function WeeklyWinner({ winner }) {
  if (!winner) {
    return (
      <div className="glass-card flex flex-col items-center justify-center" style={{ height: '100%', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '1rem' }}>
        <div style={{
          background: 'rgba(107, 114, 128, 0.1)',
          borderRadius: '50%',
          padding: '1.25rem',
          color: 'var(--text-muted)'
        }}>
          <Trophy size={40} />
        </div>
        <div>
          <h2 className="text-display" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            No Weekly Winner
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '240px', margin: '0 auto' }}>
            Add more weight data to calculate the first weekly winner!
          </p>
        </div>
      </div>
    );
  }

  const { member, loss, previousWeight, currentWeight } = winner;

  return (
    <div className="glass-card glow-animation" style={{
      height: '100%',
      minHeight: '300px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      border: '1px solid rgba(245, 158, 11, 0.35)',
      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(236, 72, 153, 0.03)), var(--card-bg)'
    }}>
      {/* Decorative stars */}
      <div style={{ position: 'absolute', top: '1rem', right: '1.25rem', display: 'flex', gap: '0.5rem', color: 'var(--accent-gold)' }}>
        <Sparkles size={18} className="float-animation" />
      </div>

      <div>
        <span className="badge" style={{
          backgroundColor: 'var(--accent-gold-glow)',
          color: 'var(--accent-gold)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          marginBottom: '1rem'
        }}>
          🏆 Weekly Winner
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="float-animation" style={{
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            borderRadius: '1rem',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)'
          }}>
            <Trophy size={36} />
          </div>
          <div>
            <h2 className="text-display" style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.1, color: 'var(--text-primary)' }}>
              {member.name}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '2px' }}>
              Most active weight loss this week!
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Weight Loss Stat */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.06)',
          border: '1px solid rgba(16, 185, 129, 0.15)',
          borderRadius: '1rem',
          padding: '1rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ color: 'var(--success)' }}>
              <TrendingDown size={24} />
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Weight Lost</p>
              <h3 className="text-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>
                {loss.toFixed(1)} kg
              </h3>
            </div>
          </div>
        </div>

        {/* Previous vs Current Weight */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', textAlign: 'center' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--card-border)', borderRadius: '0.75rem', padding: '0.75rem' }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Previous</p>
            <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'var(--font-display)' }}>
              {formatWeight(previousWeight)}
            </p>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--card-border)', borderRadius: '0.75rem', padding: '0.75rem' }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current</p>
            <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              {formatWeight(currentWeight)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
