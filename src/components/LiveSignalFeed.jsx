import { useState, useEffect, useRef } from 'react';

const SIGNAL_POOL = [
  { source: 'Reddit', icon: '🔴', text: 'Spike in "flood" discussions — r/bangalore', emotion: 'FEAR', state: 'Karnataka', severity: 'HIGH' },
  { source: 'News', icon: '📰', text: 'IMD issues red alert for coastal Karnataka', emotion: 'PANIC', state: 'Karnataka', severity: 'HIGH' },
  { source: 'Trends', icon: '📈', text: '"water shortage bengaluru" search up 340%', emotion: 'ANXIETY', state: 'Karnataka', severity: 'MEDIUM' },
  { source: 'Reddit', icon: '🔴', text: 'Mumbai protest march gaining traction — r/india', emotion: 'ANGER', state: 'Maharashtra', severity: 'MEDIUM' },
  { source: 'News', icon: '📰', text: 'Delhi pollution: Schools shut, AQI at 450+', emotion: 'ANXIETY', state: 'Delhi', severity: 'HIGH' },
  { source: 'Reddit', icon: '🔴', text: 'Fuel shortage panic reported — r/indiaspeaks', emotion: 'PANIC', state: 'UP', severity: 'MEDIUM' },
  { source: 'Trends', icon: '📈', text: '"bandh tomorrow" search spiking in Kolkata', emotion: 'UNREST', state: 'West Bengal', severity: 'HIGH' },
  { source: 'News', icon: '📰', text: 'Kerala: 3 districts on flood alert, evacuations begin', emotion: 'FEAR', state: 'Kerala', severity: 'CRITICAL' },
  { source: 'Reddit', icon: '🔴', text: 'Hyderabad protest: Large crowds near Charminar', emotion: 'ANGER', state: 'Telangana', severity: 'MEDIUM' },
  { source: 'Trends', icon: '📈', text: '"earthquake" search spike in Gujarat region', emotion: 'FEAR', state: 'Gujarat', severity: 'LOW' },
  { source: 'News', icon: '📰', text: 'Punjab farmers block 3 national highways', emotion: 'ANGER', state: 'Punjab', severity: 'HIGH' },
  { source: 'Reddit', icon: '🔴', text: 'Brahmaputra above danger level — Assam floods', emotion: 'FEAR', state: 'Assam', severity: 'CRITICAL' },
  { source: 'Trends', icon: '📈', text: '"cyclone" alert trending in Odisha coastal belt', emotion: 'FEAR', state: 'Odisha', severity: 'MEDIUM' },
  { source: 'News', icon: '📰', text: 'UP: Internet suspended in 5 districts amid tension', emotion: 'UNREST', state: 'Uttar Pradesh', severity: 'HIGH' },
  { source: 'Reddit', icon: '🔴', text: 'Rajasthan drought: Farmers demand compensation', emotion: 'ANXIETY', state: 'Rajasthan', severity: 'MEDIUM' },
];

const SEVERITY_COLORS = { CRITICAL: '#FF2D55', HIGH: '#FF6B35', MEDIUM: '#FFB800', LOW: '#00FF88' };
const EMOTION_COLORS  = { FEAR: '#FF2D55', ANGER: '#FF6B35', PANIC: '#FFB800', UNREST: '#A855F7', ANXIETY: '#00C8FF' };

const SignalItem = ({ signal, isNew }) => {
  const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  return (
    <div style={{
      padding: '10px 12px',
      borderRadius: '8px',
      background: 'rgba(10,22,40,0.8)',
      border: `1px solid ${SEVERITY_COLORS[signal.severity]}22`,
      borderLeft: `3px solid ${SEVERITY_COLORS[signal.severity]}`,
      animation: isNew ? 'slide-in-left 0.35s ease' : 'none',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
        <span style={{ fontSize: '11px' }}>{signal.icon}</span>
        <span style={{ fontFamily: 'Share Tech Mono', color: 'var(--text-dim)', fontSize: '9px' }}>{time}</span>
        <span style={{ fontFamily: 'Orbitron', color: SEVERITY_COLORS[signal.severity], fontSize: '8px', letterSpacing: '0.08em', marginLeft: 'auto' }}>
          {signal.severity}
        </span>
      </div>
      <div style={{ fontFamily: 'Inter', color: 'var(--text-primary)', fontSize: '11px', lineHeight: 1.4, marginBottom: '6px' }}>
        {signal.text}
      </div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <span style={{
          background: `${EMOTION_COLORS[signal.emotion] || '#7A9EC0'}18`,
          border: `1px solid ${EMOTION_COLORS[signal.emotion] || '#7A9EC0'}44`,
          borderRadius: '4px', padding: '1px 6px',
          fontFamily: 'Share Tech Mono', color: EMOTION_COLORS[signal.emotion] || '#7A9EC0', fontSize: '8px',
        }}>{signal.emotion}</span>
        <span style={{
          background: 'rgba(0,200,255,0.08)', border: '1px solid rgba(0,200,255,0.2)',
          borderRadius: '4px', padding: '1px 6px',
          fontFamily: 'Share Tech Mono', color: 'var(--text-secondary)', fontSize: '8px',
        }}>{signal.state}</span>
      </div>
    </div>
  );
};

const LiveSignalFeed = () => {
  const [signals, setSignals] = useState(() => SIGNAL_POOL.slice(0, 6).map((s, i) => ({ ...s, id: i, isNew: false })));
  const counterRef = useRef(100);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = SIGNAL_POOL[Math.floor(Math.random() * SIGNAL_POOL.length)];
      counterRef.current += 1;
      setSignals(prev => {
        const updated = [{ ...next, id: counterRef.current, isNew: true }, ...prev.slice(0, 7)];
        return updated.map((s, i) => ({ ...s, isNew: i === 0 }));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF2D55', animation: 'blink 1.2s infinite' }} />
          <span className="section-label" style={{ fontSize: '10px' }}>LIVE SIGNAL FEED</span>
        </div>
        <div style={{ fontFamily: 'Inter', color: 'var(--text-dim)', fontSize: '9px' }}>
          Auto-updating every 4 seconds
        </div>
      </div>
      {/* Feed */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {signals.map(signal => (
          <SignalItem key={signal.id} signal={signal} isNew={signal.isNew} />
        ))}
      </div>
    </div>
  );
};

export default LiveSignalFeed;
