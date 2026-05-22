import { getRiskLevel } from '../hooks/useDataEngine';

const ALERT_DATA = [
  {
    state: 'Karnataka', emoji: '🌊', crisisType: 'Flood Panic Risk', riskScore: 78,
    emotion: 'Fear + Panic',
    signals: ['IMD Red Alert issued', 'Reddit panic surge +340%', '"flood bengaluru" searches up'],
    recommendation: 'Activate disaster response teams',
    aiExplanation: 'High velocity of distress signals correlated with IMD warnings suggests imminent infrastructure stress.',
  },
  {
    state: 'Kerala', emoji: '⛈️', crisisType: 'Flood Emergency Risk', riskScore: 71,
    emotion: 'Fear',
    signals: ['3 districts on red alert', 'Wayanad evacuation orders', 'River levels critical'],
    recommendation: 'Pre-position NDRF teams in Wayanad',
    aiExplanation: 'Evacuation chatter peaking. Historical precedent indicates high probability of dam overflow within 24h.',
  },
  {
    state: 'Uttar Pradesh', emoji: '⚡', crisisType: 'Communal Tension Risk', riskScore: 67,
    emotion: 'Unrest',
    signals: ['Internet suspended 5 districts', 'Curfew imposed in 2 cities', 'Police deployment active'],
    recommendation: 'Increase intelligence surveillance',
    aiExplanation: 'Sectarian keywords spiking on hyper-local channels. Rapid response unit deployment recommended.',
  },
];

const AlertCard = ({ alert }) => {
  const colors = { LOW:'#00E676', MEDIUM:'#FFB020', HIGH:'#FF7043', CRITICAL:'#FF3B5C' };
  const c = colors[alert.riskLevel] || colors.MEDIUM;
  
  return (
    <div style={{
      background:'var(--bg-panel)',
      border:`1px solid ${c}33`,
      borderRadius:12, padding:'14px 16px', marginBottom:10,
      animation: alert.riskLevel === 'CRITICAL' || alert.riskLevel === 'HIGH' ? 'glow-pulse 2.5s infinite' : 'none',
      flexShrink: 0
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
        <div style={{ fontFamily:'Orbitron', fontSize:12, color:c }}>
          {alert.emoji} {alert.state}
        </div>
        <span style={{ fontFamily:'Share Tech Mono', fontSize:9, color:c,
          background:`${c}15`, border:`1px solid ${c}44`, borderRadius:4, padding:'2px 8px' }}>
          {alert.riskLevel}
        </span>
      </div>
      <div style={{ fontSize:11, color:'var(--text-2)', marginBottom:8 }}>{alert.crisisType}</div>
      {/* Progress bar */}
      <div style={{ background:'rgba(255,255,255,0.06)', borderRadius:4, height:4, marginBottom:10 }}>
        <div style={{ width:`${alert.riskScore}%`, height:'100%', background:c, borderRadius:4,
          boxShadow:`0 0 6px ${c}66` }} />
      </div>
      <div style={{ fontSize:10, color:'var(--text-2)', lineHeight:1.6 }}>{alert.aiExplanation}</div>
      <div style={{ marginTop:8, fontSize:10, color:c, fontFamily:'Share Tech Mono' }}>
        → {alert.recommendation}
      </div>
    </div>
  );
};

const CrisisAlertPanel = ({ stateScores }) => {
  const alerts = Object.entries(stateScores || {})
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, 3)
    .map(([name, d]) => {
      const { level } = getRiskLevel(d.score);
      const fallback = ALERT_DATA.find(a => a.state === name);
      return {
        state: name,
        emoji: d.emotion?.toLowerCase().includes('fear') ? '🌊' : d.emotion?.toLowerCase().includes('anger') ? '⚡' : '🔥',
        crisisType: d.crisis,
        riskScore: d.score,
        riskLevel: level,
        emotion: d.emotion,
        signals: fallback?.signals || ['Signal detected', 'Monitoring active', 'Alert issued'],
        recommendation: fallback?.recommendation || 'Monitor and prepare response',
        aiExplanation: fallback?.aiExplanation || 'Automated anomaly detection triggered based on real-time signal aggregation.',
      };
    });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF3B5C', animation: 'blink-dot 1.2s infinite' }} />
        <span className="section-label">CRISIS ALERTS</span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', paddingRight: '4px', minHeight: 0 }}>
        {alerts.map((alert, i) => (
          <AlertCard key={alert.state} alert={alert} />
        ))}
      </div>
    </div>
  );
};

export default CrisisAlertPanel;
