import { useState, useEffect } from 'react';
import { Shield, Radio, AlertTriangle } from 'lucide-react';

const THREAT_LEVELS = [
  { level: 'SECURE',   color: '#00FF88', score: 0  },
  { level: 'ELEVATED', color: '#FFB800', score: 31 },
  { level: 'HIGH',     color: '#FF6B35', score: 61 },
  { level: 'CRITICAL', color: '#FF2D55', score: 86 },
];

const Navbar = ({ stateScores, isLoading, lastUpdated }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const maxScore = stateScores
    ? Math.max(...Object.values(stateScores).map(s => s.score || 0))
    : 0;
  const threat = [...THREAT_LEVELS].reverse().find(t => maxScore >= t.score) || THREAT_LEVELS[0];

  const istTime = time.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });
  const istDate = time.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 1000,
      background: 'rgba(2,8,18,0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0,200,255,0.15)',
      padding: '0 20px',
      height: '58px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      {/* LEFT — Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ position: 'relative', width: '32px', height: '32px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #00C8FF, #0040AA)',
            boxShadow: '0 0 15px rgba(0,200,255,0.6)',
            animation: 'pulse-glow 2s infinite',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            border: '1px solid rgba(0,200,255,0.5)',
            borderRadius: '50%',
            animation: 'sphere-rotate 8s linear infinite',
          }} />
        </div>
        <div>
          <div style={{
            fontFamily: 'Orbitron', color: 'var(--accent-cyan)',
            fontSize: '16px', fontWeight: 700, letterSpacing: '0.15em',
            lineHeight: 1.1,
          }}>
            PULSESPHERE <span style={{ color: 'rgba(0,200,255,0.5)' }}>AI</span>
          </div>
          <div style={{ fontFamily: 'Inter', color: 'var(--text-dim)', fontSize: '9px', letterSpacing: '0.1em' }}>
            INDIA CRISIS INTELLIGENCE COMMAND CENTER
          </div>
        </div>
      </div>

      {/* CENTER — LIVE + Clock */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ position: 'relative', width: '8px', height: '8px' }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: '#FF2D55',
              animation: 'blink 1.2s ease-in-out infinite',
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              width: '8px', height: '8px', borderRadius: '50%',
              background: '#FF2D55',
              animation: 'ping 1.5s ease-out infinite',
            }} />
          </div>
          <span style={{
            fontFamily: 'Orbitron', color: '#FF2D55',
            fontSize: '10px', letterSpacing: '0.25em', fontWeight: 700,
          }}>LIVE</span>
          {isLoading && (
            <span style={{ fontFamily: 'Share Tech Mono', color: 'var(--accent-cyan)', fontSize: '9px' }}>
              ◌ FETCHING...
            </span>
          )}
        </div>
        <div style={{ fontFamily: 'Share Tech Mono', color: 'var(--text-primary)', fontSize: '18px', letterSpacing: '0.06em' }}>
          {istTime} <span style={{ color: 'var(--text-dim)', fontSize: '10px' }}>IST</span>
        </div>
        <div style={{ fontFamily: 'Inter', color: 'var(--text-dim)', fontSize: '9px' }}>
          {istDate}
        </div>
      </div>

      {/* RIGHT — Threat Level + Nav Icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Share Tech Mono', color: 'var(--text-dim)', fontSize: '8px', letterSpacing: '0.1em', marginBottom: '3px' }}>
            NATIONAL THREAT LEVEL
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: `rgba(${threat.color === '#00FF88' ? '0,255,136' : threat.color === '#FFB800' ? '255,184,0' : threat.color === '#FF6B35' ? '255,107,53' : '255,45,85'},0.12)`,
            border: `1px solid ${threat.color}`,
            borderRadius: '6px',
            padding: '4px 10px',
            boxShadow: `0 0 12px ${threat.color}44`,
          }}>
            <AlertTriangle size={11} color={threat.color} />
            <span style={{ fontFamily: 'Orbitron', color: threat.color, fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em' }}>
              {threat.level}
            </span>
            <span style={{ fontFamily: 'Share Tech Mono', color: threat.color, fontSize: '11px' }}>
              {maxScore}%
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ padding: '6px', borderRadius: '8px', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <Shield size={14} />
          </div>
          <div style={{ padding: '6px', borderRadius: '8px', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <Radio size={14} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
