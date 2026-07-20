import React from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { formatWeight, formatDelta } from '../utils/formatters';

export default function MemberCard({ member }) {
  const { name, avatar, color, weightHistory, startingWeight, currentWeight, totalChange, weeklyChange, heightCm, startingBmi, currentBmi, bmiChange } = member;

  // Determine BMI status details
  const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'rgba(156, 163, 175, 1)', bg: 'rgba(156, 163, 175, 0.1)' };
    if (bmi < 25.0) return { label: 'Normal', color: 'rgba(16, 185, 129, 1)', bg: 'rgba(16, 185, 129, 0.1)' };
    if (bmi < 30.0) return { label: 'Overweight', color: 'rgba(245, 158, 11, 1)', bg: 'rgba(245, 158, 11, 0.1)' };
    return { label: 'Obese', color: 'rgba(239, 68, 68, 1)', bg: 'rgba(239, 68, 68, 0.1)' };
  };

  const bmiInfo = getBmiCategory(currentBmi);

  // Determine badge type based on value
  const getDeltaBadge = (val) => {
    if (val < 0) {
      return (
        <span className="badge badge-success">
          <TrendingDown size={14} /> {formatDelta(val)}
        </span>
      );
    }
    if (val > 0) {
      return (
        <span className="badge badge-danger">
          <TrendingUp size={14} /> {formatDelta(val)}
        </span>
      );
    }
    return (
      <span className="badge badge-neutral">
        <Minus size={14} /> 0.0 kg
      </span>
    );
  };

  // Generate SVG Sparkline points
  const renderSparkline = () => {
    if (weightHistory.length < 2) return null;
    
    const width = 120;
    const height = 30;
    const padding = 2;
    
    const weights = weightHistory.map(h => h.weight);
    const minW = Math.min(...weights);
    const maxW = Math.max(...weights);
    const range = maxW - minW || 1;

    const points = weightHistory.map((h, i) => {
      const x = padding + (i / (weightHistory.length - 1)) * (width - padding * 2);
      const y = padding + height - padding * 2 - ((h.weight - minW) / range) * (height - padding * 2);
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        {/* Draw dot on the last point */}
        {weightHistory.length > 0 && (() => {
          const lastIndex = weightHistory.length - 1;
          const x = padding + (lastIndex / (weightHistory.length - 1)) * (width - padding * 2);
          const y = padding + height - padding * 2 - ((weightHistory[lastIndex].weight - minW) / range) * (height - padding * 2);
          return (
            <circle
              cx={x}
              cy={y}
              r={3}
              fill={color}
              stroke="var(--bg-color)"
              strokeWidth={1}
            />
          );
        })()}
      </svg>
    );
  };

  return (
    <div className="glass-card interactive" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Avatar Icon */}
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '0.75rem',
            backgroundColor: `${color}18`,
            border: `1px solid ${color}30`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.875rem',
            fontFamily: 'var(--font-display)'
          }}>
            {avatar}
          </div>
          <div>
            <h3 className="text-display" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {name}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Weight Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Current Weight
          </p>
          <h2 className="text-display" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, lineHeight: 1.1 }}>
            {formatWeight(currentWeight)}
          </h2>
        </div>
        {/* Trend Sparkline */}
        <div style={{ opacity: 0.85 }}>
          {renderSparkline()}
        </div>
      </div>

      {/* Nice Progress Bar */}
      {(() => {
        const totalLoss = startingWeight - currentWeight;
        const targetLoss = startingWeight * 0.1; // 10% weight loss goal
        const progressPercent = totalLoss > 0 ? Math.min(100, (totalLoss / targetLoss) * 100) : 0;
        
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              <span>Target Progress (-10%)</span>
              <span style={{ color: totalLoss > 0 ? 'var(--success)' : 'var(--text-muted)' }}>
                {totalLoss > 0 ? `${progressPercent.toFixed(0)}%` : '0%'}
              </span>
            </div>
            
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'var(--card-border)',
              borderRadius: '9999px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: totalLoss > 0 ? `linear-gradient(90deg, ${color}, var(--success))` : 'transparent',
                borderRadius: '9999px',
                transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              <span>{totalLoss > 0 ? `${totalLoss.toFixed(1)} kg lost` : '0.0 kg lost'}</span>
              <span>Target: -{targetLoss.toFixed(1)} kg</span>
            </div>
          </div>
        );
      })()}

      <hr style={{ border: 0, borderTop: '1px solid var(--card-border)', margin: '0' }} />

      {/* Progress Stats Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        
        {/* Weekly Progress */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Weekly Delta
          </span>
          {getDeltaBadge(weeklyChange)}
        </div>

        {/* Total Progress */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Total Progress
          </span>
          {getDeltaBadge(totalChange)}
        </div>

        {/* Height */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Height
          </span>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'var(--font-display)' }}>
            {heightCm} cm
          </span>
        </div>

        {/* BMI Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            BMI Status
          </span>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 750,
            color: bmiInfo.color,
            backgroundColor: bmiInfo.bg,
            padding: '0.2rem 0.5rem',
            borderRadius: '0.5rem',
            border: `1px solid ${bmiInfo.color}25`
          }}>
            {currentBmi.toFixed(1)} ({bmiInfo.label})
          </span>
        </div>

        {/* Starting Weight */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Starting Weight
          </span>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'var(--font-display)' }}>
            {formatWeight(startingWeight)}
          </span>
        </div>

      </div>

    </div>
  );
}
