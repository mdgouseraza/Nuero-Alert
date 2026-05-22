import { useState } from 'react';
import { getRiskLevel } from '../hooks/useDataEngine';

const STATES_SVG = [
  { id: 'jammu-kashmir',   name: 'J&K / Ladakh',        path: 'M 200,30 L 280,20 L 320,50 L 310,90 L 270,110 L 230,100 L 200,70 Z' },
  { id: 'himachal',        name: 'Himachal Pradesh',     path: 'M 270,110 L 310,90 L 330,120 L 300,150 L 265,140 Z' },
  { id: 'punjab',          name: 'Punjab',               path: 'M 230,100 L 270,110 L 265,140 L 240,160 L 215,140 L 210,115 Z' },
  { id: 'uttarakhand',     name: 'Uttarakhand',          path: 'M 300,150 L 340,130 L 370,155 L 350,185 L 310,180 Z' },
  { id: 'haryana',         name: 'Haryana',              path: 'M 240,160 L 270,150 L 300,170 L 285,200 L 255,205 L 238,185 Z' },
  { id: 'delhi',           name: 'Delhi',                path: 'M 275,168 L 290,162 L 298,176 L 283,186 Z' },
  { id: 'uttar-pradesh',   name: 'Uttar Pradesh',        path: 'M 290,162 L 370,155 L 430,165 L 450,195 L 420,235 L 370,250 L 315,240 L 285,215 L 283,186 L 298,176 Z' },
  { id: 'rajasthan',       name: 'Rajasthan',            path: 'M 140,160 L 215,140 L 240,160 L 238,185 L 255,205 L 240,260 L 210,300 L 150,310 L 110,270 L 100,215 Z' },
  { id: 'gujarat',         name: 'Gujarat',              path: 'M 80,300 L 140,295 L 170,320 L 175,380 L 140,420 L 90,410 L 60,370 L 55,330 Z' },
  { id: 'madhya-pradesh',  name: 'Madhya Pradesh',       path: 'M 210,300 L 310,280 L 390,285 L 420,315 L 400,370 L 330,390 L 250,385 L 190,360 L 175,320 Z' },
  { id: 'bihar',           name: 'Bihar',                path: 'M 420,215 L 480,205 L 510,220 L 505,260 L 455,275 L 420,260 Z' },
  { id: 'jharkhand',       name: 'Jharkhand',            path: 'M 420,260 L 455,275 L 490,270 L 510,305 L 480,340 L 430,345 L 400,315 L 395,280 Z' },
  { id: 'west-bengal',     name: 'West Bengal',          path: 'M 505,220 L 550,215 L 570,250 L 555,320 L 525,360 L 505,335 L 510,305 L 490,270 L 510,260 Z' },
  { id: 'odisha',          name: 'Odisha',               path: 'M 430,345 L 480,340 L 515,355 L 525,400 L 500,440 L 450,450 L 415,420 L 405,380 Z' },
  { id: 'chhattisgarh',    name: 'Chhattisgarh',         path: 'M 395,350 L 430,345 L 455,375 L 450,430 L 415,460 L 380,445 L 360,400 L 365,360 Z' },
  { id: 'maharashtra',     name: 'Maharashtra',          path: 'M 150,390 L 200,375 L 280,380 L 330,390 L 360,400 L 365,460 L 340,510 L 270,530 L 185,510 L 145,460 L 130,420 Z' },
  { id: 'andhra-pradesh',  name: 'Andhra Pradesh',       path: 'M 340,510 L 380,490 L 430,500 L 490,480 L 510,520 L 490,570 L 440,600 L 370,595 L 330,560 Z' },
  { id: 'telangana',       name: 'Telangana',            path: 'M 330,450 L 380,445 L 415,460 L 430,500 L 380,490 L 340,510 L 310,490 L 305,460 Z' },
  { id: 'karnataka',       name: 'Karnataka',            path: 'M 185,510 L 270,530 L 310,530 L 330,560 L 300,620 L 255,650 L 200,640 L 160,600 L 155,550 Z' },
  { id: 'goa',             name: 'Goa',                  path: 'M 155,555 L 175,548 L 180,568 L 160,572 Z' },
  { id: 'tamil-nadu',      name: 'Tamil Nadu',           path: 'M 255,650 L 300,620 L 340,630 L 360,680 L 330,740 L 280,760 L 245,720 L 235,680 Z' },
  { id: 'kerala',          name: 'Kerala',               path: 'M 200,640 L 255,650 L 245,720 L 220,750 L 190,720 L 185,675 Z' },
  { id: 'assam',           name: 'Assam',                path: 'M 560,200 L 620,190 L 660,205 L 650,235 L 590,245 L 555,230 Z' },
  { id: 'arunachal',       name: 'Arunachal Pradesh',    path: 'M 580,155 L 660,145 L 700,165 L 680,195 L 620,190 L 565,175 Z' },
  { id: 'manipur',         name: 'Manipur',              path: 'M 650,240 L 680,235 L 690,260 L 665,275 L 645,265 Z' },
  { id: 'meghalaya',       name: 'Meghalaya',            path: 'M 570,245 L 610,240 L 625,258 L 600,270 L 568,262 Z' },
  { id: 'nagaland',        name: 'Nagaland',             path: 'M 650,215 L 680,210 L 690,235 L 660,242 L 648,228 Z' },
  { id: 'tripura',         name: 'Tripura',              path: 'M 600,270 L 622,265 L 628,285 L 606,290 Z' },
  { id: 'sikkim',          name: 'Sikkim',               path: 'M 530,180 L 548,175 L 553,192 L 535,196 Z' },
];

const STATE_LABELS = [
  { name: 'Karnataka',      x: 225, y: 585 },
  { name: 'Maharashtra',    x: 248, y: 458 },
  { name: 'Delhi',          x: 283, y: 175 },
  { name: 'Tamil Nadu',     x: 290, y: 698 },
  { name: 'Kerala',         x: 215, y: 698 },
  { name: 'Telangana',      x: 358, y: 475 },
  { name: 'Gujarat',        x: 112, y: 362 },
  { name: 'Uttar Pradesh',  x: 365, y: 208 },
  { name: 'West Bengal',    x: 538, y: 282 },
  { name: 'Rajasthan',      x: 172, y: 242 },
  { name: 'Punjab',         x: 245, y: 125 },
  { name: 'Bihar',          x: 463, y: 238 },
  { name: 'Assam',          x: 608, y: 218 },
  { name: 'Odisha',         x: 468, y: 398 },
  { name: 'Madhya Pradesh', x: 302, y: 335 },
];

const getStateColor = (stateName, stateScores) => {
  const data = stateScores?.[stateName];
  if (!data) return '#1A2A3A';
  const s = data.score;
  if (s >= 86) return '#FF2D55';
  if (s >= 61) return '#FF6B35';
  if (s >= 31) return '#FFB800';
  return '#00FF88';
};

const IndiaHeatmap = ({ stateScores, onStateClick }) => {
  const [hoveredState, setHoveredState] = useState(null);
  const [tooltip, setTooltip] = useState({ x: 0, y: 0, visible: false });

  return (
    <div className="card" style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      animation: 'pulse-glow 3s infinite',
    }}>
      {/* Header */}
      <div style={{ padding: '14px 18px 10px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'Orbitron', color: 'var(--accent-cyan)', fontSize: '11px', letterSpacing: '0.2em' }}>
              🗺 INDIA CRISIS HEATMAP
            </div>
            <div style={{ fontFamily: 'Inter', color: 'var(--text-dim)', fontSize: '9px', marginTop: '2px' }}>
              Real-time emotional intelligence across Indian states
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {[['LOW','#00FF88'], ['MEDIUM','#FFB800'], ['HIGH','#FF6B35'], ['CRITICAL','#FF2D55']].map(([lbl, clr]) => (
              <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: clr, boxShadow: `0 0 5px ${clr}` }} />
                <span style={{ fontFamily: 'Share Tech Mono', color: 'var(--text-dim)', fontSize: '8px' }}>{lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Map */}
      <div style={{ flex: 1, padding: '8px 12px 12px', position: 'relative' }}>
        <svg viewBox="0 0 800 900" style={{ width: '100%', height: '100%' }}>
          <defs>
            <filter id="glow-filter">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow-filter-red">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow-filter-critical">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Ocean background hint */}
          <rect x="0" y="0" width="800" height="900" fill="transparent" />

          {STATES_SVG.map(state => {
            const data = stateScores?.[state.name];
            const color = getStateColor(state.name, stateScores);
            const isHovered = hoveredState === state.name;
            const score = data?.score || 0;
            const isCritical = score >= 86;
            const isHigh = score >= 61;

            return (
              <path
                key={state.id}
                d={state.path}
                fill={color}
                fillOpacity={isHovered ? 0.98 : 0.72}
                stroke={isHovered ? color : 'rgba(0,200,255,0.35)'}
                strokeWidth={isHovered ? 2.5 : 1}
                filter={isCritical ? 'url(#glow-filter-critical)' : isHigh ? 'url(#glow-filter-red)' : isHovered ? 'url(#glow-filter)' : 'none'}
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                onMouseEnter={e => {
                  setHoveredState(state.name);
                  setTooltip({ x: e.clientX, y: e.clientY, visible: true });
                }}
                onMouseLeave={() => {
                  setHoveredState(null);
                  setTooltip(t => ({ ...t, visible: false }));
                }}
                onMouseMove={e => setTooltip({ x: e.clientX, y: e.clientY, visible: true })}
                onClick={() => onStateClick(state.name, data)}
              />
            );
          })}

          {/* State labels */}
          {STATE_LABELS.map(label => (
            <text
              key={label.name}
              x={label.x} y={label.y}
              textAnchor="middle"
              style={{
                fontSize: ['Karnataka','Maharashtra','Uttar Pradesh','Madhya Pradesh'].includes(label.name) ? '8.5px' : '7px',
                fill: 'rgba(255,255,255,0.9)',
                fontFamily: 'Share Tech Mono',
                pointerEvents: 'none',
                filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.9))',
              }}
            >
              {label.name.length > 9 ? label.name.split(' ')[0] : label.name}
            </text>
          ))}

          {/* Karnataka focus indicator */}
          <circle cx="225" cy="580" r="22" fill="none"
            stroke="rgba(0,200,255,0.4)" strokeWidth="1.5" strokeDasharray="4,3"
            style={{ animation: 'sphere-rotate 6s linear infinite', transformOrigin: '225px 580px' }}
          />
        </svg>

        {/* Hover Tooltip */}
        {tooltip.visible && hoveredState && stateScores?.[hoveredState] && (() => {
          const d = stateScores[hoveredState];
          const color = getStateColor(hoveredState, stateScores);
          const { level } = getRiskLevel(d.score);
          return (
            <div style={{
              position: 'fixed', left: tooltip.x + 14, top: tooltip.y - 8,
              background: 'rgba(6,14,31,0.98)',
              border: `1px solid ${color}`,
              borderRadius: '10px', padding: '12px 15px',
              zIndex: 9999, minWidth: '190px', pointerEvents: 'none',
              boxShadow: `0 0 20px ${color}44`,
              animation: 'slide-in-top 0.15s ease',
            }}>
              <div style={{ fontFamily: 'Orbitron', color, fontSize: '12px', marginBottom: '8px' }}>
                {hoveredState}
              </div>
              <div style={{ fontFamily: 'Share Tech Mono', fontSize: '11px', color: '#E8F4FF', lineHeight: 1.9 }}>
                <div>Risk Score: <span style={{ color }}>{d.score}%</span></div>
                <div>Level: <span style={{ color }}>{level}</span></div>
                <div>Emotion: <span style={{ color: '#A855F7' }}>{d.emotion}</span></div>
                <div>Signal: <span style={{ color: '#FFB800' }}>{d.crisis}</span></div>
                <div>Trend: <span style={{ color: d.trend?.includes('↑') ? '#FF6B35' : d.trend?.includes('↓') ? '#00FF88' : '#7A9EC0' }}>{d.trend}</span></div>
              </div>
              <div style={{ marginTop: '8px', fontSize: '8px', color: '#3A5A7A', fontFamily: 'Share Tech Mono' }}>
                Click to view full analysis →
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default IndiaHeatmap;
