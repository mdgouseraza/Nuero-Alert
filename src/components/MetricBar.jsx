import { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Newspaper, MessageSquare, TrendingUp, Brain } from 'lucide-react';

const generateSparkline = (base) =>
  Array.from({ length: 10 }, (_, i) => ({ v: base + Math.sin(i * 0.8) * base * 0.15 + Math.random() * base * 0.08 }));

const MetricCard = ({ icon: Icon, label, value, color, delay }) => {
  const [displayed, setDisplayed] = useState(0);
  const [spark] = useState(() => generateSparkline(value * 0.85));

  useEffect(() => {
    let start = 0;
    const duration = 1800;
    const startTime = Date.now() + delay;
    const step = () => {
      const now = Date.now();
      if (now < startTime) { requestAnimationFrame(step); return; }
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.floor(ease * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, delay]);

  return (
    <div className="card" style={{
      flex: 1, padding: '16px 20px',
      display: 'flex', alignItems: 'center', gap: '16px',
      animation: 'slide-in-top 0.5s ease forwards',
      animationDelay: `${delay}ms`,
      opacity: 0,
    }}>
      <div style={{
        width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0,
        background: `linear-gradient(135deg, ${color}22, ${color}08)`,
        border: `1px solid ${color}44`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 15px ${color}22`,
      }}>
        <Icon size={18} color={color} strokeWidth={1.5} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'Share Tech Mono', color, fontSize: '22px', fontWeight: 400, lineHeight: 1, letterSpacing: '0.04em' }}>
          {displayed.toLocaleString()}
        </div>
        <div style={{ fontFamily: 'Inter', color: 'var(--text-secondary)', fontSize: '10px', marginTop: '3px', letterSpacing: '0.04em' }}>
          {label}
        </div>
      </div>
      <div style={{ width: '70px', height: '36px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={spark}>
            <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const MetricBar = ({ totalArticles, totalReddit, trendSpikes, aiPredictions }) => (
  <div style={{ display: 'flex', gap: '12px' }}>
    <MetricCard icon={Newspaper}     label="News Articles Scanned"    value={totalArticles} color="#00C8FF" delay={0}   />
    <MetricCard icon={MessageSquare} label="Reddit Posts Analyzed"    value={totalReddit}   color="#A855F7" delay={150} />
    <MetricCard icon={TrendingUp}    label="Search Trend Spikes"      value={trendSpikes}   color="#FFB800" delay={300} />
    <MetricCard icon={Brain}         label="AI Predictions Made"      value={aiPredictions} color="#00FF88" delay={450} />
  </div>
);

export default MetricBar;
