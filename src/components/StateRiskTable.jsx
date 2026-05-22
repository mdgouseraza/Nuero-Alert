import { useState } from 'react';
import { getRiskLevel } from '../hooks/useDataEngine';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

const COLUMNS = [
  { key: 'name',    label: 'STATE',           sortable: true },
  { key: 'score',   label: 'RISK %',          sortable: true },
  { key: 'level',   label: 'LEVEL',           sortable: true },
  { key: 'emotion', label: 'DOMINANT EMOTION',sortable: false },
  { key: 'trend',   label: 'TREND',           sortable: false },
  { key: 'crisis',  label: 'CRISIS SIGNAL',   sortable: false },
];

const TrendCell = ({ trend }) => {
  const color = trend?.includes('↑') ? '#FF6B35' : trend?.includes('↓') ? '#00FF88' : '#7A9EC0';
  return <span style={{ fontFamily: 'Share Tech Mono', color, fontSize: '11px' }}>{trend || '→ Stable'}</span>;
};

const StateRiskTable = ({ stateScores, onStateClick }) => {
  const [sortKey, setSortKey] = useState('score');
  const [sortDir, setSortDir] = useState('desc');

  const rows = Object.entries(stateScores || {}).map(([name, d]) => ({
    name,
    score: d.score,
    level: getRiskLevel(d.score).level,
    color: getRiskLevel(d.score).color,
    emotion: d.emotion,
    trend: d.trend,
    crisis: d.crisis,
  }));

  const sorted = [...rows].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av;
    return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });

  const handleSort = (key) => {
    if (!COLUMNS.find(c => c.key === key)?.sortable) return;
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  return (
    <div className="card" style={{ padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <span className="section-label" style={{ fontSize: '10px' }}>📋 STATE RISK MATRIX</span>
        <span style={{ fontFamily: 'Share Tech Mono', color: 'var(--text-dim)', fontSize: '9px', marginLeft: 'auto' }}>
          {rows.length} STATES MONITORED · Click row for full analysis
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  style={{
                    padding: '7px 10px', textAlign: 'left',
                    fontFamily: 'Orbitron', color: 'var(--text-dim)', fontSize: '8px', letterSpacing: '0.1em',
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: col.sortable ? 'pointer' : 'default',
                    whiteSpace: 'nowrap', userSelect: 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {col.label}
                    {col.sortable && (sortKey === col.key
                      ? (sortDir === 'asc' ? <ChevronUp size={9} color="#00C8FF" /> : <ChevronDown size={9} color="#00C8FF" />)
                      : <ChevronsUpDown size={9} color="#3A5A7A" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr
                key={row.name}
                onClick={() => onStateClick(row.name, stateScores?.[row.name])}
                style={{
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(13,32,64,0.6)',
                  background: row.name === 'Karnataka'
                    ? 'rgba(0,200,255,0.04)'
                    : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                  borderLeft: row.name === 'Karnataka' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,200,255,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = row.name === 'Karnataka' ? 'rgba(0,200,255,0.04)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
              >
                <td style={{ padding: '8px 10px', fontFamily: 'Inter', color: row.name === 'Karnataka' ? 'var(--accent-cyan)' : 'var(--text-primary)', fontSize: '11px', fontWeight: row.name === 'Karnataka' ? 600 : 400, whiteSpace: 'nowrap' }}>
                  {row.name === 'Karnataka' && <span style={{ color: 'var(--accent-cyan)', marginRight: '4px' }}>▶</span>}
                  {row.name}
                </td>
                <td style={{ padding: '8px 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'Share Tech Mono', color: row.color, fontSize: '12px', minWidth: '28px' }}>{row.score}%</span>
                    <div style={{ flex: 1, maxWidth: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', height: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${row.score}%`, height: '100%', background: row.color, borderRadius: '3px' }} />
                    </div>
                  </div>
                </td>
                <td style={{ padding: '8px 10px' }}>
                  <span style={{ background: `${row.color}18`, border: `1px solid ${row.color}44`, borderRadius: '4px', padding: '2px 7px', fontFamily: 'Share Tech Mono', color: row.color, fontSize: '8px' }}>
                    {row.level}
                  </span>
                </td>
                <td style={{ padding: '8px 10px', fontFamily: 'Inter', color: '#A855F7', fontSize: '10px', whiteSpace: 'nowrap' }}>{row.emotion}</td>
                <td style={{ padding: '8px 10px' }}><TrendCell trend={row.trend} /></td>
                <td style={{ padding: '8px 10px', fontFamily: 'Inter', color: 'var(--text-secondary)', fontSize: '10px' }}>{row.crisis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StateRiskTable;
