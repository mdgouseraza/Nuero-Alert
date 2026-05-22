import { useState, useEffect } from 'react';

const BASE = [
  { label: '📊 SENSEX',       base: 72841, suffix: '',   prefix: '',  decimals: 0, change: -0.34 },
  { label: '🔷 NIFTY',        base: 22104, suffix: '',   prefix: '',  decimals: 0, change: -0.28 },
  { label: '💵 USD/INR',      base: 83.42, suffix: '',   prefix: '₹', decimals: 2, change: +0.12 },
  { label: '🪙 GOLD/10g',     base: 71240, suffix: '',   prefix: '₹', decimals: 0, change: +0.21 },
  { label: '🛢️ CRUDE OIL',   base: 84.32, suffix: '/bbl',prefix: '$', decimals: 2, change: -0.45 },
  { label: '😱 Fear Index',   base: 38,    suffix: ' (FEAR)', prefix: '', decimals: 0, change: 0 },
  { label: '📡 VIX INDIA',    base: 14.2,  suffix: '',   prefix: '',  decimals: 1, change: +1.8  },
];

const EconomicTicker = () => {
  const [values, setValues] = useState(BASE.map(b => b.base));

  useEffect(() => {
    const interval = setInterval(() => {
      setValues(prev => prev.map((v, i) => {
        const drift = (Math.random() - 0.5) * BASE[i].base * 0.003;
        return parseFloat((v + drift).toFixed(BASE[i].decimals));
      }));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const items = BASE.map((b, i) => ({
    ...b,
    value: values[i],
    formatted: `${b.prefix}${values[i].toLocaleString('en-IN', { minimumFractionDigits: b.decimals, maximumFractionDigits: b.decimals })}${b.suffix}`,
    changeStr: b.change === 0 ? '' : `${b.change > 0 ? '▲' : '▼'} ${Math.abs(b.change).toFixed(2)}%`,
    changeColor: b.change > 0 ? '#00FF88' : b.change < 0 ? '#FF2D55' : '#7A9EC0',
  }));

  const doubled = [...items, ...items]; // duplicate for seamless loop

  return (
    <div style={{
      background: 'rgba(6,14,31,0.9)',
      borderTop: '1px solid rgba(0,200,255,0.1)',
      padding: '0',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Static label */}
        <div style={{
          padding: '7px 14px',
          background: 'rgba(0,200,255,0.08)',
          borderRight: '1px solid rgba(0,200,255,0.15)',
          flexShrink: 0,
          fontFamily: 'Orbitron', color: 'var(--accent-cyan)', fontSize: '8px', letterSpacing: '0.15em',
          whiteSpace: 'nowrap',
        }}>
          MACRO INDICATORS
        </div>

        {/* Scrolling ticker */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <div style={{
            display: 'flex', gap: '0',
            animation: 'ticker-scroll 35s linear infinite',
            width: 'max-content',
          }}>
            {doubled.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '7px 20px',
                borderRight: '1px solid rgba(13,32,64,0.8)',
                whiteSpace: 'nowrap',
              }}>
                <span style={{ fontFamily: 'Share Tech Mono', color: 'var(--text-secondary)', fontSize: '9px' }}>
                  {item.label}:
                </span>
                <span style={{ fontFamily: 'Share Tech Mono', color: 'var(--text-primary)', fontSize: '11px' }}>
                  {item.formatted}
                </span>
                {item.changeStr && (
                  <span style={{ fontFamily: 'Share Tech Mono', color: item.changeColor, fontSize: '9px' }}>
                    {item.changeStr}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EconomicTicker;
