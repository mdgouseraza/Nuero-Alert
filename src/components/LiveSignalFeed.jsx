import { useState, useEffect } from 'react';
import { SIGNAL_POOL } from '../hooks/useDataEngine';

const SignalCard = ({ signal }) => {
  const EMOTION_COLORS = {
    FEAR:'#FF3B5C', ANGER:'#FF7043', PANIC:'#FFB020',
    UNREST:'#B06EFF', ANXIETY:'#00C8FF',
  };
  const SEV_COLORS = { HIGH:'#FF3B5C', MEDIUM:'#FFB020', LOW:'#00E676', CRITICAL:'#FF3B5C' };

  return (
    <div style={{
      background:'var(--bg-panel)',
      border:'1px solid var(--border-dim)',
      borderLeft:`3px solid ${SEV_COLORS[signal.severity]}`,
      borderRadius:'0 10px 10px 0',
      padding:'10px 14px',
      animation:'slide-in 0.3s ease',
      marginBottom:8,
      flexShrink: 0
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
        <span style={{ fontFamily:'Share Tech Mono', fontSize:9, color:'var(--text-3)' }}>
          {signal.source} · {signal.time}
        </span>
        <span style={{ fontSize:9, fontFamily:'Share Tech Mono', color:SEV_COLORS[signal.severity],
          border:`1px solid ${SEV_COLORS[signal.severity]}33`, borderRadius:4, padding:'1px 6px' }}>
          {signal.severity}
        </span>
      </div>
      <div style={{ fontSize:12, color:'var(--text-1)', lineHeight:1.5, marginBottom:7 }}>
        {signal.text}
      </div>
      <div style={{ display:'flex', gap:6 }}>
        <span style={{
          background:`${EMOTION_COLORS[signal.emotion]}18`,
          border:`1px solid ${EMOTION_COLORS[signal.emotion]}44`,
          color: EMOTION_COLORS[signal.emotion],
          fontSize:9, fontFamily:'Share Tech Mono',
          borderRadius:4, padding:'2px 7px',
        }}>
          {signal.emotion}
        </span>
        <span style={{
          background:'rgba(255,255,255,0.04)', color:'var(--text-3)',
          fontSize:9, fontFamily:'Share Tech Mono', borderRadius:4, padding:'2px 7px',
        }}>
          {signal.state}
        </span>
      </div>
    </div>
  );
};

const LiveSignalFeed = () => {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    // Initial load
    const initial = Array.from({ length: 4 }).map(() => ({
      ...SIGNAL_POOL[Math.floor(Math.random() * SIGNAL_POOL.length)],
      id: Math.random(),
      time: new Date(Date.now() - Math.random() * 10000).toLocaleTimeString('en-IN', { hour12: false }),
    }));
    setSignals(initial);

    // Add new signal every 4 seconds
    const interval = setInterval(() => {
      const newSignal = {
        ...SIGNAL_POOL[Math.floor(Math.random() * SIGNAL_POOL.length)],
        id: Math.random(),
        time: new Date().toLocaleTimeString('en-IN', { hour12: false }),
      };
      setSignals(prev => [newSignal, ...prev].slice(0, 8)); // Keep top 8
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <p className="panel-title">Live Signal Feed</p>
          <p className="panel-sub">Real-time crisis telemetry stream</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00C8FF', animation: 'blink-dot 1.5s infinite' }} />
          <span style={{ fontFamily: 'Share Tech Mono', fontSize: 10, color: 'var(--text-3)' }}>LIVE</span>
        </div>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4, minHeight: 0 }}>
        {signals.map((sig) => (
          <SignalCard key={sig.id} signal={sig} />
        ))}
      </div>
    </div>
  );
};

export default LiveSignalFeed;
