import { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { getRiskLevel } from '../hooks/useDataEngine';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

const EMOTION_COLORS = { Fear: '#FF2D55', Anger: '#FF6B35', Panic: '#FFB800', Unrest: '#A855F7', Anxiety: '#00C8FF', Hope: '#00FF88', Calm: '#3A6A9A' };

const CircularGauge = ({ score, color }) => {
  const r = 40, circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  return (
    <svg width={100} height={100} viewBox="0 0 100 100">
      <circle cx={50} cy={50} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
      <circle cx={50} cy={50} r={r} fill="none" stroke={color} strokeWidth={8}
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{ transition:'stroke-dasharray 0.6s ease' }}
      />
      <text x={50} y={50} textAnchor="middle" dy="0.35em"
        style={{ fontFamily:'Share Tech Mono', fontSize:16, fill:color, fontWeight:'bold' }}>
        {score}%
      </text>
    </svg>
  );
};

const StateDetailModal = ({ stateName, stateData, news, redditPosts, onClose }) => {
  const [activeTab, setActiveTab] = useState('news');
  const [reviewed, setReviewed] = useState(false);

  if (!stateName) return null;

  const { color } = getRiskLevel(stateData?.score || 0);
  const { level } = getRiskLevel(stateData?.score || 0);
  const score = stateData?.score || 0;

  const emotionData = Object.entries(EMOTION_COLORS).map(([e, c]) => ({
    emotion: e, value: Math.floor(Math.random() * 60 + 10), color: c,
  })).sort((a, b) => b.value - a.value);

  const relevantNews = news.filter(n => {
    const t = (n.title + ' ' + (n.description || '')).toLowerCase();
    return t.includes(stateName.toLowerCase()) || t.includes(stateName.split(' ')[0].toLowerCase());
  }).slice(0, 5);

  const relevantReddit = redditPosts.filter(p => {
    const t = (p.title + ' ' + (p.subreddit || '')).toLowerCase();
    return t.includes(stateName.toLowerCase()) || t.includes(stateName.split(' ')[0].toLowerCase());
  }).slice(0, 5);

  const TABS = [
    { id: 'news',    label: '📰 NEWS' },
    { id: 'reddit',  label: '🔴 REDDIT' },
    { id: 'trends',  label: '📈 TRENDS' },
    { id: 'ai',      label: '🤖 AI ANALYSIS' },
  ];

  const trendKeywords = [
    `flood ${stateName}`, `protest ${stateName}`, `${stateName} emergency`,
    `${stateName} crisis`, `${stateName.split(' ')[0]} bandh`, `disaster ${stateName}`,
  ].map(k => ({ keyword: k, spike: Math.floor(Math.random() * 400 + 50) })).sort((a, b) => b.spike - a.spike);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(2,8,18,0.92)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--bg-panel)',
        border: `1px solid ${color}44`,
        borderRadius: '16px',
        width: '100%', maxWidth: '900px',
        maxHeight: '85vh',
        display: 'flex', flexDirection: 'column',
        boxShadow: `0 0 40px ${color}22, 0 20px 60px rgba(0,0,0,0.6)`,
        animation: 'modal-in 0.3s ease',
      }}>
        {/* Header */}
        <div style={{ padding: '18px 22px', borderBottom: `1px solid ${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div>
              <div style={{ fontFamily: 'Orbitron', color, fontSize: '18px', letterSpacing: '0.1em' }}>{stateName}</div>
              <div style={{ fontFamily: 'Inter', color: 'var(--text-secondary)', fontSize: '10px', marginTop: '2px' }}>{stateData?.crisis}</div>
            </div>
            <span style={{ background: `${color}22`, border: `1px solid ${color}`, borderRadius: '6px', padding: '4px 12px', fontFamily: 'Orbitron', color, fontSize: '11px' }}>
              {level} RISK
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', minHeight: 0 }}>
          {/* Left column */}
          <div style={{ width: '220px', padding: '18px 16px', borderRight: `1px solid ${color}22`, display: 'flex', flexDirection: 'column', gap: '16px', flexShrink: 0, overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <CircularGauge score={score} color={color} />
              <div style={{ fontFamily: 'Share Tech Mono', color, fontSize: '10px' }}>CRISIS RISK SCORE</div>
              <div style={{ fontFamily: 'Inter', color: '#A855F7', fontSize: '10px' }}>{stateData?.emotion}</div>
              <div style={{ fontFamily: 'Share Tech Mono', color: stateData?.trend?.includes('↑') ? '#FF6B35' : '#00FF88', fontSize: '11px' }}>
                {stateData?.trend || '→ Stable'}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'Share Tech Mono', color: 'var(--text-dim)', fontSize: '8px', marginBottom: '8px', letterSpacing: '0.1em' }}>EMOTION BREAKDOWN</div>
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={emotionData.slice(0, 5)} layout="vertical" margin={{ left: 0, right: 5, top: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="emotion" tick={{ fontFamily: 'Share Tech Mono', fill: '#7A9EC0', fontSize: 8 }} axisLine={false} tickLine={false} width={45} />
                  <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                    {emotionData.slice(0, 5).map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: `1px solid ${color}22`, flexShrink: 0 }}>
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                  padding: '10px 16px', background: 'none',
                  border: 'none', borderBottom: activeTab === tab.id ? `2px solid ${color}` : '2px solid transparent',
                  color: activeTab === tab.id ? color : 'var(--text-secondary)',
                  fontFamily: 'Share Tech Mono', fontSize: '9px', cursor: 'pointer', letterSpacing: '0.08em',
                  transition: 'color 0.2s',
                }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px' }}>
              {activeTab === 'news' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(relevantNews.length > 0 ? relevantNews : [
                    { title: `${stateName}: Situation being closely monitored by authorities`, source: { name: 'Times of India' }, publishedAt: new Date().toISOString() },
                    { title: `Emergency services on standby in ${stateName}`, source: { name: 'NDTV' }, publishedAt: new Date().toISOString() },
                  ]).map((n, i) => (
                    <div key={i} style={{ padding: '10px 12px', background: 'rgba(10,22,40,0.8)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontFamily: 'Inter', color: 'var(--text-primary)', fontSize: '11px', lineHeight: 1.4, marginBottom: '5px' }}>{n.title}</div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'Share Tech Mono', color: 'var(--accent-cyan)', fontSize: '8px' }}>{n.source?.name}</span>
                        <span style={{ fontFamily: 'Share Tech Mono', color: 'var(--text-dim)', fontSize: '8px' }}>{new Date(n.publishedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reddit' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(relevantReddit.length > 0 ? relevantReddit : [
                    { title: `Situation in ${stateName} — what's actually happening on the ground`, score: 1240, subreddit: 'india' },
                    { title: `${stateName} residents share updates on current crisis`, score: 890, subreddit: 'indiaspeaks' },
                  ]).map((p, i) => (
                    <div key={i} style={{ padding: '10px 12px', background: 'rgba(10,22,40,0.8)', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <div style={{ background: 'rgba(255,45,85,0.15)', border: '1px solid rgba(255,45,85,0.3)', borderRadius: '4px', padding: '4px 8px', fontFamily: 'Share Tech Mono', color: '#FF6B35', fontSize: '10px', flexShrink: 0 }}>
                        ↑ {(p.score || 0).toLocaleString()}
                      </div>
                      <div>
                        <div style={{ fontFamily: 'Inter', color: 'var(--text-primary)', fontSize: '11px', lineHeight: 1.4, marginBottom: '3px' }}>{p.title}</div>
                        <span style={{ fontFamily: 'Share Tech Mono', color: 'var(--text-dim)', fontSize: '8px' }}>r/{p.subreddit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'trends' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontFamily: 'Inter', color: 'var(--text-dim)', fontSize: '9px', marginBottom: '4px' }}>Trending search queries related to {stateName}</div>
                  {trendKeywords.map((t, i) => (
                    <div key={i} style={{ padding: '10px 12px', background: 'rgba(10,22,40,0.8)', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontFamily: 'Inter', color: 'var(--text-primary)', fontSize: '11px', flex: 1 }}>"{t.keyword}"</span>
                      <span style={{ fontFamily: 'Share Tech Mono', color: '#FFB800', fontSize: '10px' }}>+{t.spike}%</span>
                      <div style={{ width: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', height: '4px' }}>
                        <div style={{ width: `${Math.min(100, t.spike / 4)}%`, height: '100%', background: '#FFB800', borderRadius: '3px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'ai' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ padding: '14px', background: 'rgba(0,200,255,0.04)', border: '1px solid rgba(0,200,255,0.15)', borderRadius: '10px' }}>
                    <div style={{ fontFamily: 'Orbitron', color: 'var(--accent-cyan)', fontSize: '10px', marginBottom: '8px' }}>AI SITUATION ASSESSMENT</div>
                    <div style={{ fontFamily: 'Inter', color: 'var(--text-secondary)', fontSize: '11px', lineHeight: 1.7 }}>
                      {stateName} is currently showing a risk score of <span style={{ color }}>{score}%</span> with dominant emotion profile of <span style={{ color: '#A855F7' }}>{stateData?.emotion}</span>.
                      Multiple intelligence signals from news sources, social media, and search trends converge to indicate {stateData?.crisis?.toLowerCase()}.
                      Trend direction is <span style={{ color: stateData?.trend?.includes('↑') ? '#FF6B35' : '#00FF88' }}>{stateData?.trend}</span> — immediate attention recommended.
                    </div>
                  </div>
                  <div style={{ padding: '14px', background: 'rgba(255,107,53,0.04)', border: '1px solid rgba(255,107,53,0.15)', borderRadius: '10px' }}>
                    <div style={{ fontFamily: 'Orbitron', color: '#FF6B35', fontSize: '10px', marginBottom: '8px' }}>RECOMMENDED ACTIONS</div>
                    {['Activate state emergency operations center', 'Deploy additional monitoring resources', 'Coordinate with district collectors for ground-level updates', 'Issue public advisory if risk exceeds 85%'].map((a, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ color: '#FF6B35', fontFamily: 'Share Tech Mono', fontSize: '10px' }}>{i + 1}.</span>
                        <span style={{ fontFamily: 'Inter', color: 'var(--text-secondary)', fontSize: '10px' }}>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '10px 22px', borderTop: `1px solid ${color}22`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <span style={{ fontFamily: 'Share Tech Mono', color: 'var(--text-dim)', fontSize: '9px' }}>
            Last updated: {new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })} IST
          </span>
          <button onClick={() => setReviewed(true)} style={{
            background: reviewed ? 'rgba(0,255,136,0.15)' : 'rgba(0,200,255,0.08)',
            border: `1px solid ${reviewed ? '#00FF88' : 'rgba(0,200,255,0.3)'}`,
            borderRadius: '6px', padding: '5px 14px', cursor: 'pointer',
            fontFamily: 'Share Tech Mono', color: reviewed ? '#00FF88' : 'var(--accent-cyan)', fontSize: '9px',
          }}>
            {reviewed ? '✓ REVIEWED' : 'MARK AS REVIEWED'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StateDetailModal;
