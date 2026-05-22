import { useState } from 'react';
import { Zap, RefreshCw } from 'lucide-react';
import { fetchGeminiRecommendations } from '../hooks/useDataEngine';

const PRIORITY_COLORS = { P1: '#FF2D55', P2: '#FF6B35', P3: '#FFB800' };
const ACTION_COLORS   = { Deploy: '#FF2D55', Alert: '#FF6B35', Communicate: '#00C8FF', Monitor: '#A855F7' };

const AIRecommendations = ({ recommendations, stateScores, setRecommendations }) => {
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const topStates = Object.entries(stateScores || {})
        .sort((a, b) => b[1].score - a[1].score)
        .slice(0, 3)
        .map(([name, d]) => ({ name, score: d.score, emotion: d.emotion }));
      const recs = await fetchGeminiRecommendations(topStates);
      setRecommendations(recs);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: '14px 16px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexShrink: 0 }}>
        <div>
          <div className="section-label" style={{ fontSize: '10px' }}>🤖 AI RECOMMENDATIONS</div>
          <div style={{ fontFamily: 'Inter', color: 'var(--text-dim)', fontSize: '9px', marginTop: '2px' }}>Gemini-powered crisis analysis</div>
        </div>
        <button className="btn-cyber" onClick={refresh} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '5px', opacity: loading ? 0.6 : 1 }}>
          <RefreshCw size={10} style={{ animation: loading ? 'sphere-rotate 1s linear infinite' : 'none' }} />
          {loading ? 'ANALYZING...' : '⚡ REFRESH'}
        </button>
      </div>

      {loading ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid rgba(0,200,255,0.2)', borderTop: '2px solid var(--accent-cyan)', animation: 'sphere-rotate 0.8s linear infinite' }} />
          <span style={{ fontFamily: 'Share Tech Mono', color: 'var(--text-secondary)', fontSize: '11px', animation: 'blink 1.5s infinite' }}>
            Analyzing crisis signals...
          </span>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
          {(recommendations || []).map((rec, i) => {
            const pc = PRIORITY_COLORS[rec.priority] || '#FFB800';
            const ac = ACTION_COLORS[rec.actionType] || '#00C8FF';
            return (
              <div key={i} style={{
                background: 'rgba(6,14,31,0.8)', border: `1px solid ${pc}22`,
                borderRadius: '10px', padding: '12px 14px',
                borderLeft: `3px solid ${pc}`,
                animation: `fade-in-stagger 0.4s ease both`,
                animationDelay: `${i * 0.15}s`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ background: `${pc}22`, border: `1px solid ${pc}`, borderRadius: '4px', padding: '2px 8px', fontFamily: 'Orbitron', color: pc, fontSize: '9px', letterSpacing: '0.08em' }}>
                    {rec.priority}
                  </span>
                  <span style={{ background: `${ac}18`, border: `1px solid ${ac}44`, borderRadius: '4px', padding: '2px 7px', fontFamily: 'Share Tech Mono', color: ac, fontSize: '8px' }}>
                    {rec.actionType}
                  </span>
                  {rec.urgency && (
                    <span style={{ marginLeft: 'auto', fontFamily: 'Share Tech Mono', color: rec.urgency === 'HIGH' ? '#FF6B35' : '#FFB800', fontSize: '8px' }}>
                      {rec.urgency}
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: 'Inter', color: 'var(--accent-cyan)', fontSize: '10px', fontWeight: 500, marginBottom: '5px' }}>
                  → {rec.target}
                </div>
                <div style={{ fontFamily: 'Inter', color: 'var(--text-secondary)', fontSize: '10px', lineHeight: 1.5 }}>
                  {rec.recommendation}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;
