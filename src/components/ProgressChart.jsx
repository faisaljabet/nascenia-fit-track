import React, { useState, useRef, useEffect } from 'react';
import { formatDate, formatWeight } from '../utils/formatters';

export default function ProgressChart({ parsedMembers, dates }) {
  // State for the selected member on the chart ('all' or specific member ID)
  const [selectedMemberId, setSelectedMemberId] = useState('all');

  // State for tracking hovered date column
  const [hoveredIndex, setHoveredIndex] = useState(null);
  // Tooltip coordinates
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);

  // Dimensions of the SVG ViewBox
  const width = 800;
  const height = 400;
  const paddingLeft = 55;
  const paddingRight = 35;
  const paddingTop = 30;
  const paddingBottom = 40;

  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  // Filter members based on selection
  const activeMembers = selectedMemberId === 'all'
    ? parsedMembers
    : parsedMembers.filter(m => m.id === selectedMemberId);

  // Filter weights to calculate axis limits
  const allWeights = activeMembers.flatMap(m => m.weightHistory.map(h => h.weight));

  let minW = allWeights.length > 0 ? Math.min(...allWeights) : 60;
  let maxW = allWeights.length > 0 ? Math.max(...allWeights) : 90;

  // Add Y-axis bounds buffer
  const yMin = Math.max(0, Math.floor(minW - 1.5));
  const yMax = Math.ceil(maxW + 1.5);
  const yRange = yMax - yMin;

  // Calculate coordinates
  const getX = (index) => {
    if (dates.length <= 1) return paddingLeft + plotWidth / 2;
    return paddingLeft + (index / (dates.length - 1)) * plotWidth;
  };

  const getY = (weight) => {
    if (yRange === 0) return paddingTop + plotHeight / 2;
    return paddingTop + plotHeight - ((weight - yMin) / yRange) * plotHeight;
  };

  // Generate grid values for Y-axis (4 division marks)
  const yGridMarks = [];
  const divisionCount = 4;
  for (let i = 0; i <= divisionCount; i++) {
    yGridMarks.push(yMin + (yRange / divisionCount) * i);
  }

  // Handle touch and mouse events to position tooltip
  const handleMouseMove = (e, index) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Position the tooltip based on mouse position relative to container
    const xPos = e.clientX - rect.left;
    const yPos = e.clientY - rect.top;

    // Constrain tooltip inside container
    let finalX = xPos + 15;
    if (finalX + 180 > rect.width) {
      finalX = xPos - 195;
    }

    setTooltipPos({ x: finalX, y: yPos - 30 });
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  // Reset hovered index if selection changes (prevent dangling tooltip indices)
  useEffect(() => {
    setHoveredIndex(null);
  }, [selectedMemberId]);

  // Get active hover items details
  const getTooltipData = () => {
    if (hoveredIndex === null || !dates[hoveredIndex]) return null;
    const date = dates[hoveredIndex];
    const items = activeMembers
      .map(m => {
        const entry = m.weightHistory.find(h => h.date === date);
        return {
          name: m.name,
          color: m.color,
          weight: entry ? entry.weight : null
        };
      })
      .filter(item => item.weight !== null)
      // Sort desc by weight for cleaner presentation
      .sort((a, b) => b.weight - a.weight);

    return { date, items };
  };

  const tooltipData = getTooltipData();

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, position: 'relative' }}>
      
      {/* Header and Legend Row (On Top) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>
        <div>
          <h2 className="text-display" style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Weight Progress Over Time
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Show recorded Mondays. Select a member to view their individual progress.
          </p>
        </div>

        {/* Legend / Tabs */}
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedMemberId('all')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              border: '1px solid',
              borderColor: selectedMemberId === 'all' ? 'var(--text-primary)' : 'var(--card-border)',
              background: selectedMemberId === 'all' ? 'var(--text-primary)' : 'transparent',
              color: selectedMemberId === 'all' ? 'var(--bg-color)' : 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            All Members
          </button>
          
          {parsedMembers.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedMemberId(m.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: selectedMemberId === m.id ? m.color : 'var(--card-border)',
                background: selectedMemberId === m.id ? `${m.color}20` : 'transparent',
                color: selectedMemberId === m.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: m.color,
                display: 'inline-block'
              }}></span>
              {m.name}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart Layout Container */}
      <div className="chart-layout">
        
        {/* SVG Line Chart Container */}
        <div ref={containerRef} style={{ width: '100%', position: 'relative' }}>
          <svg 
            viewBox={`0 0 ${width} ${height}`} 
            width="100%" 
            height="100%" 
            style={{ overflow: 'visible' }}
          >
            {/* Grids and Axes */}
            {yGridMarks.map((mark, i) => {
              const y = getY(mark);
              return (
                <g key={i}>
                  <line 
                    x1={paddingLeft} 
                    y1={y} 
                    x2={width - paddingRight} 
                    y2={y} 
                    className="chart-grid-line" 
                  />
                  <text 
                    x={paddingLeft - 8} 
                    y={y + 4} 
                    textAnchor="end" 
                    className="chart-axis-text"
                  >
                    {mark.toFixed(0)}
                  </text>
                </g>
              );
            })}

            {/* X Axis Dates */}
            {dates.map((date, i) => {
              const x = getX(i);
              return (
                <text
                  key={i}
                  x={x}
                  y={height - paddingBottom + 20}
                  textAnchor="middle"
                  className="chart-axis-text"
                  style={{ fontSize: '0.7rem' }}
                >
                  {formatDate(date, true)}
                </text>
              );
            })}

            {/* Hover Vertical Line */}
            {hoveredIndex !== null && (
              <line
                x1={getX(hoveredIndex)}
                y1={paddingTop}
                x2={getX(hoveredIndex)}
                y2={height - paddingBottom}
                stroke="var(--text-muted)"
                strokeWidth={1}
                strokeDasharray="4,4"
                opacity={0.6}
              />
            )}

            {/* Draw Areas (Gradients underneath) */}
            {activeMembers.map(m => {
              if (m.weightHistory.length === 0) return null;
              
              // Construct path for shaded gradient area
              let pathD = '';
              m.weightHistory.forEach((h, index) => {
                const dateIndex = dates.indexOf(h.date);
                if (dateIndex !== -1) {
                  const x = getX(dateIndex);
                  const y = getY(h.weight);
                  if (index === 0) {
                    pathD += `M ${x} ${y}`;
                  } else {
                    pathD += ` L ${x} ${y}`;
                  }
                }
              });

              if (!pathD) return null;

              // Complete the path to close at bottom axis
              const firstX = getX(dates.indexOf(m.weightHistory[0].date));
              const lastX = getX(dates.indexOf(m.weightHistory[m.weightHistory.length - 1].date));
              const bottomY = height - paddingBottom;
              const areaD = `${pathD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;

              return (
                <g key={`area-${m.id}`}>
                  <defs>
                    <linearGradient id={`gradient-${m.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={m.color} stopOpacity="0.25" />
                      <stop offset="100%" stopColor={m.color} stopOpacity="0.00" />
                    </linearGradient>
                  </defs>
                  <path
                    d={areaD}
                    fill={`url(#gradient-${m.id})`}
                  />
                </g>
              );
            })}

            {/* Draw Lines */}
            {activeMembers.map(m => {
              if (m.weightHistory.length === 0) return null;
              
              let pathD = '';
              m.weightHistory.forEach((h, index) => {
                const dateIndex = dates.indexOf(h.date);
                if (dateIndex !== -1) {
                  const x = getX(dateIndex);
                  const y = getY(h.weight);
                  if (index === 0) {
                    pathD += `M ${x} ${y}`;
                  } else {
                    pathD += ` L ${x} ${y}`;
                  }
                }
              });

              return (
                <path
                  key={`line-${m.id}`}
                  d={pathD}
                  className="chart-line"
                  stroke={m.color}
                  strokeWidth={3}
                />
              );
            })}

            {/* Draw Point Markers */}
            {activeMembers.map(m => {
              return m.weightHistory.map((h, index) => {
                const dateIndex = dates.indexOf(h.date);
                if (dateIndex === -1) return null;

                const x = getX(dateIndex);
                const y = getY(h.weight);
                const isHovered = hoveredIndex === dateIndex;

                return (
                  <circle
                    key={`point-${m.id}-${index}`}
                    cx={x}
                    cy={y}
                    r={isHovered ? 6 : 4}
                    fill={m.color}
                    stroke="var(--bg-color)"
                    strokeWidth={isHovered ? 2.5 : 1.5}
                    style={{ transition: 'all 0.15s ease', cursor: 'pointer' }}
                  />
                );
              });
            })}

            {/* Transparent Hover Columns for Mouse Tracking */}
            {dates.map((date, i) => {
              const x = getX(i);
              const colWidth = dates.length > 1 ? plotWidth / (dates.length - 1) : plotWidth;
              const triggerWidth = Math.max(20, colWidth);
              
              return (
                <rect
                  key={`trigger-${i}`}
                  x={x - triggerWidth / 2}
                  y={paddingTop}
                  width={triggerWidth}
                  height={plotHeight}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseMove={(e) => handleMouseMove(e, i)}
                  onMouseLeave={handleMouseLeave}
                />
              );
            })}
          </svg>

          {/* Floating Tooltip Component */}
          {hoveredIndex !== null && tooltipData && (
            <div 
              className="chart-tooltip" 
              style={{ 
                left: `${tooltipPos.x}px`, 
                top: `${tooltipPos.y}px`,
                minWidth: '180px'
              }}
            >
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, borderBottom: '1px solid var(--card-border)', paddingBottom: '4px', marginBottom: '4px' }}>
                {formatDate(tooltipData.date)}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {tooltipData.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: item.color }}></span>
                      <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{item.name}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                      {formatWeight(item.weight)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
