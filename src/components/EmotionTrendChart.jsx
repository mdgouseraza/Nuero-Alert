import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EMOTION_BAR_DATA = [
  { hour: '11AM', Fear:35, Anger:28, Panic:20, Unrest:15, Anxiety:40 },
  { hour: '12PM', Fear:42, Anger:35, Panic:38, Unrest:18, Anxiety:45 },
  { hour: '1PM',  Fear:38, Anger:30, Panic:25, Unrest:22, Anxiety:38 },
  { hour: '2PM',  Fear:55, Anger:42, Panic:48, Unrest:30, Anxiety:52 },
  { hour: '3PM',  Fear:68, Anger:38, Panic:55, Unrest:28, Anxiety:60 },
  { hour: '4PM',  Fear:72, Anger:45, Panic:62, Unrest:35, Anxiety:65 },
];

const EMOTION_COLORS = {
  Fear:'#FF3B5C', Anger:'#FF7043', Panic:'#FFB020',
  Unrest:'#B06EFF', Anxiety:'#00C8FF',
};

const EmotionTrendChart = () => (
  <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <p className="panel-title">Emotion Trend Analysis</p>
    <p className="panel-sub">6-hour national sentiment breakdown</p>
    <div style={{ flex: 1, minHeight: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={EMOTION_BAR_DATA} barCategoryGap="20%" barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="hour" tick={{ fill:'var(--text-3)', fontSize:10, fontFamily:'Share Tech Mono' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill:'var(--text-3)', fontSize:10, fontFamily:'Share Tech Mono' }} axisLine={false} tickLine={false} width={28} />
          <Tooltip
            contentStyle={{ background:'var(--bg-card)', border:'1px solid var(--border-med)', borderRadius:8, fontFamily:'Share Tech Mono', fontSize:11 }}
            labelStyle={{ color:'var(--cyan)', fontFamily:'Orbitron', fontSize:10 }}
            cursor={{ fill:'rgba(0,200,255,0.05)' }}
          />
          <Legend wrapperStyle={{ fontSize:10, fontFamily:'Share Tech Mono', color:'var(--text-2)' }} />
          {Object.entries(EMOTION_COLORS).map(([key, color]) => (
            <Bar key={key} dataKey={key} fill={color} fillOpacity={0.85} radius={[3,3,0,0]} maxBarSize={18} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default EmotionTrendChart;
