import { useState } from 'react';
import './index.css';
import useDataEngine from './hooks/useDataEngine';
import Navbar from './components/Navbar';
import MetricBar from './components/MetricBar';
import IndiaHeatmap from './components/IndiaHeatmap';
import LiveSignalFeed from './components/LiveSignalFeed';
import CrisisAlertPanel from './components/CrisisAlertPanel';
import EmotionTrendChart from './components/EmotionTrendChart';
import AIRecommendations from './components/AIRecommendations';
import EconomicTicker from './components/EconomicTicker';
import StateRiskTable from './components/StateRiskTable';
import StateDetailModal from './components/StateDetailModal';

function App() {
  const {
    stateScores, news, redditPosts, recommendations, emotionTrend,
    lastUpdated, isLoading, totalArticles, totalReddit, trendSpikes,
    aiPredictions, refresh, setRecommendations,
  } = useDataEngine();

  const [selectedState, setSelectedState] = useState(null);
  const [selectedData, setSelectedData]   = useState(null);

  const handleStateClick = (name, data) => {
    setSelectedState(name);
    setSelectedData(data);
  };

  return (
    <div className="app-layout">
      {/* Scanline sweep */}
      <div className="scanline" />

      {/* Navbar */}
      <Navbar stateScores={stateScores} isLoading={isLoading} lastUpdated={lastUpdated} />

      {/* Main scrollable content */}
      <div className="main-content">
        {/* Row 1 — Metric bar */}
        <MetricBar
          totalArticles={totalArticles}
          totalReddit={totalReddit}
          trendSpikes={trendSpikes}
          aiPredictions={aiPredictions}
        />

        {/* Row 2 — Heatmap (60%) + Live Feed (38%) */}
        <div style={{ display: 'flex', gap: '12px', height: '520px' }}>
          <div style={{ flex: '0 0 60%' }}>
            <IndiaHeatmap stateScores={stateScores} onStateClick={handleStateClick} />
          </div>
          <div style={{ flex: 1 }}>
            <LiveSignalFeed />
          </div>
        </div>

        {/* Row 3 — Crisis Alerts (22%) + Emotion Chart (44%) + AI Recs (30%) */}
        <div style={{ display: 'flex', gap: '12px', height: '340px' }}>
          <div style={{ flex: '0 0 22%' }}>
            <CrisisAlertPanel stateScores={stateScores} />
          </div>
          <div style={{ flex: '0 0 44%' }}>
            <EmotionTrendChart emotionTrend={emotionTrend} />
          </div>
          <div style={{ flex: 1 }}>
            <AIRecommendations
              recommendations={recommendations}
              stateScores={stateScores}
              setRecommendations={setRecommendations}
            />
          </div>
        </div>

        {/* Row 4 — State Risk Table */}
        <StateRiskTable stateScores={stateScores} onStateClick={handleStateClick} />
      </div>

      {/* Economic Ticker */}
      <EconomicTicker />

      {/* State Detail Modal */}
      {selectedState && (
        <StateDetailModal
          stateName={selectedState}
          stateData={selectedData}
          news={news}
          redditPosts={redditPosts}
          onClose={() => { setSelectedState(null); setSelectedData(null); }}
        />
      )}
    </div>
  );
}

export default App;
