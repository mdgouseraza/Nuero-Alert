import { useState, useEffect } from 'react';

const Navbar = ({ stateScores, isLoading, lastUpdated }) => {
  const [time, setTime] = useState({ ist: '', date: '' });
  
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const ist = now.toLocaleTimeString('en-IN', { timeZone:'Asia/Kolkata', hour12:false });
      const date = now.toLocaleDateString('en-IN', { timeZone:'Asia/Kolkata', day:'numeric', month:'short', year:'numeric' });
      setTime({ ist, date });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const getNationalThreatLevel = () => {
    if (!stateScores || Object.keys(stateScores).length === 0) return 'MEDIUM';
    const maxScore = Math.max(...Object.values(stateScores).map(s => s.score));
    if (maxScore >= 86) return 'CRITICAL';
    if (maxScore >= 61) return 'HIGH';
    if (maxScore >= 31) return 'MEDIUM';
    return 'LOW';
  };

  const nationalThreatLevel = getNationalThreatLevel();
  const threatColors = { LOW:'#00E676', MEDIUM:'#FFB020', HIGH:'#FF7043', CRITICAL:'#FF3B5C' };
  const tc = threatColors[nationalThreatLevel] || '#FFB020';

  return (
    <nav style={{
      position:'sticky', top:0, zIndex:200,
      background:'rgba(7,16,31,0.92)',
      backdropFilter:'blur(16px)',
      borderBottom:'1px solid var(--border-dim)',
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0 28px', height:64,
    }}>
      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:32, height:32, borderRadius:'50%', border:`2px solid var(--cyan)`,
          display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
          <div style={{ width:10, height:10, borderRadius:'50%', background:'var(--cyan)',
            boxShadow:'0 0 8px var(--cyan)', animation:'blink-dot 2s infinite' }} />
        </div>
        <div>
          <div style={{ fontFamily:'Orbitron', fontSize:14, fontWeight:700, color:'var(--cyan)', letterSpacing:'0.15em' }}>
            PULSESPHERE AI
          </div>
          <div style={{ fontSize:9, color:'var(--text-3)', letterSpacing:'0.12em', fontFamily:'Share Tech Mono' }}>
            INDIA CRISIS INTELLIGENCE COMMAND CENTER
          </div>
        </div>
      </div>

      {/* Center: Live + Clock */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:7,height:7,borderRadius:'50%',background:'#FF3B5C',
            animation:'blink-dot 1.2s infinite',boxShadow:'0 0 6px #FF3B5C' }} />
          <span style={{ fontFamily:'Share Tech Mono', fontSize:11, color:'#FF3B5C', letterSpacing:'0.1em' }}>LIVE</span>
        </div>
        <div style={{ fontFamily:'Share Tech Mono', fontSize:22, color:'var(--text-1)', letterSpacing:'0.08em' }}>
          {time.ist}
        </div>
        <div style={{ fontFamily:'Share Tech Mono', fontSize:9, color:'var(--text-3)' }}>{time.date} · IST</div>
      </div>

      {/* Right: Threat Level */}
      <div style={{ textAlign:'right', display: 'flex', alignItems: 'center', gap: 16 }}>
        {isLoading && (
          <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'Share Tech Mono' }}>
            SYNCING DATA...
          </div>
        )}
        <div>
          <div style={{ fontSize:9, color:'var(--text-3)', fontFamily:'Share Tech Mono', letterSpacing:'0.1em', marginBottom:4 }}>
            NATIONAL THREAT LEVEL
          </div>
          <div style={{
            fontFamily:'Orbitron', fontSize:13, fontWeight:700,
            color: tc, border:`1px solid ${tc}`,
            borderRadius:6, padding:'4px 14px', display:'inline-block',
            boxShadow: nationalThreatLevel === 'CRITICAL' ? `0 0 12px ${tc}44` : 'none',
          }}>
            ▲ {nationalThreatLevel} {
              Object.values(stateScores || {}).length
                ? Math.max(...Object.values(stateScores).map(s=>s.score)) + '%'
                : '—'
            }
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
