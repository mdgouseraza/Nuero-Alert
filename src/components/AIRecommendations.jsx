import { useState } from 'react';

const AIRecommendations = ({ recommendations, setRecommendations, stateScores }) => {
  const [loading, setLoading] = useState(false);

  const onRefresh = async () => {
    setLoading(true);
    // Fake a small delay to show the loading state, but use the engine's refresh in a real app
    // For now we'll just wait 1s.
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="panel" style={{ height:'100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <div>
          <p className="panel-title">AI Recommendations</p>
          <p className="panel-sub">Groq LLaMA3 · crisis analysis</p>
        </div>
        <button onClick={onRefresh} style={{
          background:'rgba(0,200,255,0.08)', border:'1px solid rgba(0,200,255,0.3)',
          color:'var(--cyan)', borderRadius:7, padding:'6px 12px',
          fontFamily:'Share Tech Mono', fontSize:10, cursor:'pointer',
          display:'flex', alignItems:'center', gap:6,
          transition: 'all 0.2s',
        }}>
          ⚡ Refresh
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', minHeight: 0 }}>
        {loading ? (
          <div style={{ textAlign:'center', padding:'40px 0', color:'var(--text-3)', fontFamily:'Share Tech Mono', fontSize:11 }}>
            <div style={{ animation:'blink-dot 1s infinite', display:'inline-block' }}>●</div>
            {' '}Analyzing signals...
          </div>
        ) : recommendations.map((r, i) => (
          <div key={i} style={{
            background:'var(--bg-panel)', borderRadius:10,
            border:'1px solid var(--border-dim)', padding:'12px 14px', marginBottom:10,
          }}>
            <div style={{ display:'flex', gap:8, marginBottom:8 }}>
              <span style={{ fontFamily:'Share Tech Mono', fontSize:10, color:'#FF7043',
                background:'rgba(255,112,67,0.12)', border:'1px solid rgba(255,112,67,0.3)',
                borderRadius:4, padding:'2px 8px' }}>{r.priority}</span>
              <span style={{ fontFamily:'Share Tech Mono', fontSize:10, color:'#00C8FF',
                background:'rgba(0,200,255,0.08)', border:'1px solid rgba(0,200,255,0.2)',
                borderRadius:4, padding:'2px 8px' }}>{r.actionType}</span>
            </div>
            <div style={{ fontSize:10, color:'var(--cyan)', fontFamily:'Share Tech Mono', marginBottom:6 }}>
              → {r.target}
            </div>
            <div style={{ fontSize:11, color:'var(--text-1)', lineHeight:1.6 }}>{r.recommendation}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendations;
