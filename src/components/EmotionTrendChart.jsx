import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EMOTION_CONFIG = [
  { key: 'Fear',    color: '#FF2D55' },
  { key: 'Anger',   color: '#FF6B35' },
  { key: 'Panic',   color: '#FFB800' },
  { key: 'Unrest',  color: '#A855F7' },
  { key: 'Anxiety', color: '#00C8FF' },
  { key: 'Hope',    color: '#00FF88' },
  { key: 'Calm',    color: '#3A6A9A' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(6,14,31,0.97)', border: '1px solid rgba(0,200,255,0.3)',
      borderRadius: '8px', padding: '10px 14px', fontSize: '10px',
    }}>
      <div style={{ fontFamily: 'Orbitron', color: 'var(--accent-cyan)', fontSize: '9px', marginBottom: '6px' }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '2px' }}>
          <span style={{ fontFamily: 'Inter', color: p.color }}>{p.dataKey}</span>
          <span style={{ fontFamily: 'Share Tech Mono', color: p.color }}>{Math.round(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

const EmotionTrendChart = ({ emotionTrend }) => {
  const data = emotionTrend || [];
  const display = data.filter((_, i) => i % 2 === 0); // show every 2nd hour for clarity

  return (
    <div className="card" style={{ padding: '14px 16px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexShrink: 0 }}>
        <div>
          <div className="section-label" style={{ fontSize: '10px' }}>📈 EMOTION TREND ANALYSIS</div>
          <div style={{ fontFamily: 'Inter', color: 'var(--text-dim)', fontSize: '9px', marginTop: '2px' }}>
            24-hour national sentiment waveform
          </div>
        </div>
        <div style={{ fontFamily: 'Share Tech Mono', color: 'var(--text-dim)', fontSize: '8px' }}>LIVE · 24H</div>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={display} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {EMOTION_CONFIG.map(e => (
                <linearGradient key={e.key} id={`grad-${e.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={e.color} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={e.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#0D2040" vertical={false} />
            <XAxis dataKey="time" tick={{ fontFamily: 'Share Tech Mono', fill: '#3A5A7A', fontSize: 8 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontFamily: 'Share Tech Mono', fill: '#3A5A7A', fontSize: 8 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontFamily: 'Share Tech Mono', fontSize: '9px', paddingTop: '4px' }} />
            {EMOTION_CONFIG.map(e => (
              <Area
                key={e.key}
                type="monotone"
                dataKey={e.key}
                stroke={e.color}
                strokeWidth={1.5}
                fill={`url(#grad-${e.key})`}
                dot={false}
                activeDot={{ r: 3, fill: e.color }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EmotionTrendChart;
