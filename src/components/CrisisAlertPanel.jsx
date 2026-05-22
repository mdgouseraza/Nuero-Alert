import { getRiskLevel } from '../hooks/useDataEngine';

const ALERT_DATA = [
  {
    state: 'Karnataka', emoji: '🌊', crisisType: 'Flood Panic Risk', riskScore: 78,
    emotion: 'Fear + Panic',
    signals: ['IMD Red Alert issued', 'Reddit panic surge +340%', '"flood bengaluru" searches up'],
    recommendation: 'Activate disaster response teams',
  },
  {
    state: 'Kerala', emoji: '⛈️', crisisType: 'Flood Emergency Risk', riskScore: 71,
    emotion: 'Fear',
    signals: ['3 districts on red alert', 'Wayanad evacuation orders', 'River levels critical'],
    recommendation: 'Pre-position NDRF teams in Wayanad',
  },
  {
    state: 'Uttar Pradesh', emoji: '⚡', crisisType: 'Communal Tension Risk', riskScore: 67,
    emotion: 'Unrest',
    signals: ['Internet suspended 5 districts', 'Curfew imposed in 2 cities', 'Police deployment active'],
    recommendation: 'Increase intelligence surveillance',
  },
];

const CrisisAlertPanel = ({ stateScores }) => {
  const dynamic = Object.entries(stateScores || {})
    .filter(([, d]) => d.score >= 60)
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, 3)
    .map(([name, d]) => ({
      state: name,
      emoji: d.emotion?.toLowerCase().includes('fear') ? '🌊' : d.emotion?.toLowerCase().includes('anger') ? '⚡' : '🔥',
      crisisType: d.crisis,
      riskScore: d.score,
      emotion: d.emotion,
      signals: ALERT_DATA.find(a => a.state === name)?.signals || ['Signal detected', 'Monitoring active', 'Alert issued'],
      recommendation: ALERT_DATA.find(a => a.state === name)?.recommendation || 'Monitor and prepare response',
    }));

  const alerts = dynamic.length > 0 ? dynamic : ALERT_DATA;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF2D55', animation: 'blink 1.2s infinite' }} />
        <span className="section-label" style={{ fontSize: '10px' }}>CRISIS ALERTS</span>
      </div>

      {alerts.map((alert, i) => {
        const { color } = getRiskLevel(alert.riskScore);
        return (
          <div key={alert.state} className="card" style={{
            flex: 1, padding: '12px 14px',
            borderLeft: `3px solid ${color}`,
            animation: alert.riskScore >= 61 ? 'pulse-red 2.5s infinite' : 'none',
            animationDelay: `${i * 0.4}s`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '14px' }}>{alert.emoji}</span>
                <div>
                  <div style={{ fontFamily: 'Orbitron', color, fontSize: '10px', letterSpacing: '0.08em' }}>{alert.state}</div>
                  <div style={{ fontFamily: 'Inter', color: 'var(--text-secondary)', fontSize: '9px', marginTop: '1px' }}>{alert.crisisType}</div>
                </div>
              </div>
              <div style={{ background: `${color}20`, border: `1px solid ${color}`, borderRadius: '4px', padding: '2px 7px', fontFamily: 'Share Tech Mono', color, fontSize: '9px' }}>
                {getRiskLevel(alert.riskScore).level}
              </div>
            </div>

            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span style={{ fontFamily: 'Share Tech Mono', color: 'var(--text-dim)', fontSize: '8px' }}>RISK SCORE</span>
                <span style={{ fontFamily: 'Share Tech Mono', color, fontSize: '11px' }}>{alert.riskScore}%</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${alert.riskScore}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
              </div>
            </div>

            {alert.signals.map((s, si) => (
              <div key={si} style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
                <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontFamily: 'Inter', color: 'var(--text-secondary)', fontSize: '9px' }}>{s}</span>
              </div>
            ))}

            <div style={{ marginTop: '6px', display: 'inline-block', background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '4px', padding: '2px 8px', fontFamily: 'Share Tech Mono', color: '#A855F7', fontSize: '8px' }}>
              {alert.emotion}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CrisisAlertPanel;
