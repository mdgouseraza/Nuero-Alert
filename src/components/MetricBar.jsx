const MetricBar = ({ totalArticles, totalReddit, trendSpikes, aiPredictions }) => {
  const metrics = [
    { icon:'📡', label:'News Articles Scanned',  value: totalArticles, color:'var(--cyan)',   suffix:'' },
    { icon:'💬', label:'Reddit Posts Analyzed',  value: totalReddit,   color:'#B06EFF',      suffix:'' },
    { icon:'🔍', label:'Search Trend Spikes',     value: trendSpikes,   color:'var(--amber)', suffix:'' },
    { icon:'🤖', label:'AI Predictions Made',    value: aiPredictions, color:'var(--green)', suffix:'' },
  ];
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, padding:'0 0' }}>
      {metrics.map(m => (
        <div key={m.label} className="panel" style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 20px' }}>
          <span style={{ fontSize:22 }}>{m.icon}</span>
          <div>
            <div style={{ fontFamily:'Share Tech Mono', fontSize:26, color:m.color, lineHeight:1 }}>
              {m.value?.toLocaleString() || 0}
            </div>
            <div style={{ fontSize:11, color:'var(--text-2)', marginTop:4 }}>{m.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricBar;
