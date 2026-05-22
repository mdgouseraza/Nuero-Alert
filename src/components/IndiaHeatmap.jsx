import { useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

const GEO_URL = 'https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson';

const IndiaHeatmap = ({ stateScores, onStateClick }) => {
  const svgRef = useRef(null);
  const [hoveredState, setHoveredState] = useState(null);
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const getColor = (stateName) => {
    const score = stateScores[stateName]?.score ?? 0;
    if (score >= 86) return '#FF3B5C';
    if (score >= 61) return '#FF7043';
    if (score >= 31) return '#FFB020';
    if (score > 0)   return '#00E676';
    return '#1A2E45';
  };

  useEffect(() => {
    const drawMap = async () => {
      try {
        const geoData = await d3.json(GEO_URL);
        renderMap(geoData);
      } catch (e) {
        console.error('Failed to load map data:', e);
      }
    };

    const renderMap = (geoData) => {
      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();

      const width = svgRef.current.parentElement.clientWidth || 500;
      const height = 480;

      const projection = d3.geoMercator().fitSize([width, height], geoData);
      const path = d3.geoPath().projection(projection);

      svg.attr('viewBox', `0 0 ${width} ${height}`);

      svg.selectAll('path')
        .data(geoData.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', d => getColor(d.properties.NAME_1 || d.properties.st_nm || d.properties.name))
        .attr('stroke', 'rgba(0,200,255,0.2)')
        .attr('stroke-width', 0.8)
        .style('cursor', 'pointer')
        .style('transition', 'fill 0.4s ease, stroke-width 0.2s')
        .on('mouseover', function(event, d) {
          const name = d.properties.NAME_1 || d.properties.st_nm || d.properties.name;
          d3.select(this).attr('stroke', 'rgba(0,200,255,0.8)').attr('stroke-width', 2);
          setHoveredState(name);
          setTooltipData({ name, ...stateScores[name] });
          setTooltipPos({ x: event.offsetX + 12, y: event.offsetY - 10 });
        })
        .on('mousemove', function(event) {
          setTooltipPos({ x: event.offsetX + 12, y: event.offsetY - 10 });
        })
        .on('mouseout', function() {
          d3.select(this).attr('stroke', 'rgba(0,200,255,0.2)').attr('stroke-width', 0.8);
          setHoveredState(null);
          setTooltipData(null);
        })
        .on('click', (event, d) => {
          const name = d.properties.NAME_1 || d.properties.st_nm || d.properties.name;
          onStateClick(name, stateScores[name]);
        });

      // State name labels for major states only
      const LABEL_STATES = ['Karnataka','Maharashtra','Rajasthan','Gujarat','Madhya Pradesh','Uttar Pradesh','West Bengal','Tamil Nadu','Andhra Pradesh','Telangana'];
      svg.selectAll('text')
        .data(geoData.features.filter(f => LABEL_STATES.includes(f.properties.NAME_1 || f.properties.st_nm)))
        .enter()
        .append('text')
        .attr('transform', d => `translate(${path.centroid(d)})`)
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .style('font-family', 'Share Tech Mono')
        .style('font-size', '7px')
        .style('fill', 'rgba(255,255,255,0.7)')
        .style('pointer-events', 'none')
        .text(d => {
          const n = d.properties.NAME_1 || d.properties.st_nm;
          return n?.length > 10 ? n.split(' ')[0] : n;
        });
    };

    drawMap();
  }, [stateScores, onStateClick]);

  const activeHotspots = Object.values(stateScores || {}).filter(s => s.score >= 61).length;
  const criticalStates = Object.values(stateScores || {}).filter(s => s.score >= 86).length;

  return (
    <div className="panel" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
        <div>
          <p className="panel-title">India Crisis Heatmap</p>
          <p className="panel-sub">Real-time emotional intelligence · click any state</p>
        </div>
        {/* Legend */}
        <div style={{ display:'flex', gap:14, alignItems:'center' }}>
          {[['LOW','#00E676'],['MED','#FFB020'],['HIGH','#FF7043'],['CRIT','#FF3B5C']].map(([l,c])=>(
            <div key={l} style={{ display:'flex', alignItems:'center', gap:5 }}>
              <div style={{ width:8,height:8,borderRadius:'50%',background:c }} />
              <span style={{ fontFamily:'Share Tech Mono',fontSize:9,color:'var(--text-3)' }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map Dashboard Metrics row */}
      <div style={{ display:'flex', gap:12, marginBottom:14 }}>
        {[
          { label:'Active Hotspots', value: activeHotspots, color:'#FF7043' },
          { label:'Critical States', value: criticalStates, color:'#FF3B5C' },
          { label:'Signals/min',    value: '14', color:'#00C8FF' },
          { label:'Confidence',     value: '87%', color:'#00E676' },
        ].map(m => (
          <div key={m.label} style={{ flex:1, background:'var(--bg-panel)', borderRadius:8, padding:'8px 12px', border:'1px solid var(--border-dim)' }}>
            <div style={{ fontFamily:'Share Tech Mono', fontSize:18, color:m.color }}>{m.value}</div>
            <div style={{ fontSize:10, color:'var(--text-3)', marginTop:2 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* SVG Map */}
      <div style={{ position:'relative', flex: 1, minHeight: 0 }}>
        <svg ref={svgRef} style={{ width:'100%', height:'100%', display:'block' }} />

        {/* Tooltip */}
        {tooltipData && (
          <div style={{
            position:'absolute',
            left: tooltipPos.x,
            top: tooltipPos.y,
            background:'rgba(10,20,38,0.97)',
            border:`1px solid ${getColor(tooltipData.name)}`,
            borderRadius:10,
            padding:'10px 14px',
            pointerEvents:'none',
            zIndex:100,
            minWidth:170,
            boxShadow:`0 4px 24px rgba(0,0,0,0.5)`,
          }}>
            <div style={{ fontFamily:'Orbitron', fontSize:11, color:getColor(tooltipData.name), marginBottom:8 }}>
              {tooltipData.name}
            </div>
            <div style={{ fontFamily:'Share Tech Mono', fontSize:10, lineHeight:1.9, color:'var(--text-1)' }}>
              <div>Risk Score <span style={{ color:getColor(tooltipData.name) }}>{tooltipData.score ?? '—'}%</span></div>
              <div>Level      <span style={{ color:getColor(tooltipData.name) }}>{tooltipData.level ?? '—'}</span></div>
              <div>Emotion    <span style={{ color:'#B06EFF' }}>{tooltipData.emotion ?? '—'}</span></div>
              <div>Signal     <span style={{ color:'#FFB020' }}>{tooltipData.crisis ?? 'Monitoring'}</span></div>
            </div>
            <div style={{ marginTop:8, fontSize:9, color:'var(--text-3)', fontFamily:'Share Tech Mono' }}>Click for full analysis →</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndiaHeatmap;
