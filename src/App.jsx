import React, { useState, useEffect, useMemo } from 'react';
import membersData from './data/members.json';
import weightsData from './data/weights.json';
import { parseWeightData, calculateWeeklyWinner } from './utils/calculations';

import Header from './components/Header';
import WeeklyWinner from './components/WeeklyWinner';
import ProgressChart from './components/ProgressChart';
import MemberCard from './components/MemberCard';

export default function App() {
  // Theme state: dark (default) or light
  const [theme, setTheme] = useState('dark');

  // Initialize theme from localStorage or prefers-color-scheme
  useEffect(() => {
    const savedTheme = localStorage.getItem('fittrack-theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Toggle theme handler
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('fittrack-theme', nextTheme);
  };

  // Parse weight database and identify winner
  const { parsedMembers, dates } = useMemo(() => {
    return parseWeightData(membersData, weightsData);
  }, []);

  const weeklyWinner = useMemo(() => {
    return calculateWeeklyWinner(parsedMembers, dates);
  }, [parsedMembers, dates]);

  // Sort members by total weight loss (largest negative change is at the top)
  const sortedMembers = useMemo(() => {
    return [...parsedMembers].sort((a, b) => a.totalChange - b.totalChange);
  }, [parsedMembers]);

  const latestDate = dates[dates.length - 1];

  return (
    <div className="dashboard-container">
      {/* Top Navigation / Header */}
      <Header 
        lastUpdatedDate={latestDate} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />

      {/* Main Content Grid: Weekly Winner (left/top) + Chart (right) */}
      <main className="grid-cols-winner-chart">
        <div>
          <WeeklyWinner winner={weeklyWinner} />
        </div>
        <div style={{ display: 'flex' }}>
          <ProgressChart parsedMembers={parsedMembers} dates={dates} />
        </div>
      </main>

      {/* Leaderboard Cards */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <h2 className="text-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.5rem 0' }}>
            Member Leaderboard
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Ranked by overall weight change (largest weight loss first).
          </p>
        </div>

        <div className="grid-cols-members">
          {sortedMembers.map(member => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
        <p>© 2026 Nascenia FitTrack. Developed with premium glassmorphism styling.</p>
      </footer>
    </div>
  );
}
