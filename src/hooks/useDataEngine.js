import { useState, useEffect, useCallback } from 'react';

// ─── MOCK FALLBACK DATA ───────────────────────────────────────────────────────
const MOCK_REDDIT_POSTS = [
  { title: 'Heavy flooding reported in North Bengaluru areas', score: 1240, subreddit: 'bangalore', created: Date.now() / 1000 },
  { title: 'Water shortage crisis worsening across Karnataka', score: 890, subreddit: 'karnataka', created: Date.now() / 1000 },
  { title: 'Mumbai local train disruptions due to protests', score: 2100, subreddit: 'india', created: Date.now() / 1000 },
  { title: 'Delhi air quality reaching dangerous levels again', score: 1800, subreddit: 'india', created: Date.now() / 1000 },
  { title: 'Rising fuel prices causing panic buying in Chennai', score: 760, subreddit: 'indiaspeaks', created: Date.now() / 1000 },
  { title: 'Kerala floods: Relief operations underway in Wayanad', score: 3200, subreddit: 'india', created: Date.now() / 1000 },
  { title: 'Hyderabad sees large scale protests near Charminar', score: 980, subreddit: 'indiaspeaks', created: Date.now() / 1000 },
  { title: 'Kolkata market crash fears amid economic uncertainty', score: 540, subreddit: 'india', created: Date.now() / 1000 },
  { title: 'Punjab farmers begin fresh agitation on highways', score: 2400, subreddit: 'india', created: Date.now() / 1000 },
  { title: 'Rajasthan drought conditions intensify — farmers distressed', score: 670, subreddit: 'indiaspeaks', created: Date.now() / 1000 },
  { title: 'UP: Sectarian tensions rising in multiple districts', score: 890, subreddit: 'india', created: Date.now() / 1000 },
  { title: 'Assam flood warning: Brahmaputra above danger mark', score: 1100, subreddit: 'india', created: Date.now() / 1000 },
];

const MOCK_NEWS_ARTICLES = [
  { title: 'Bengaluru braces for flood as IMD issues red alert', description: 'Heavy rain forecast for next 72 hours across coastal Karnataka', publishedAt: new Date().toISOString(), source: { name: 'Times of India' } },
  { title: 'Maharashtra protests escalate over reservation demands', description: 'Thousands gather in Mumbai, police deployed across districts', publishedAt: new Date().toISOString(), source: { name: 'NDTV' } },
  { title: 'Delhi pollution hits severe category, schools shut', description: 'AQI crosses 400 in multiple zones, emergency declared', publishedAt: new Date().toISOString(), source: { name: 'Hindustan Times' } },
  { title: 'Kerala flood warning: 3 districts on high alert', description: 'Red alert issued for Wayanad, Idukki, Thrissur', publishedAt: new Date().toISOString(), source: { name: 'The Hindu' } },
  { title: 'UP: Sectarian tensions rise in multiple districts', description: 'Police deployed, internet suspended in 5 districts', publishedAt: new Date().toISOString(), source: { name: 'India Today' } },
  { title: 'Tamil Nadu fishermen protest Chinese incursion', description: 'Coast guard on high alert, fishermen return to harbour', publishedAt: new Date().toISOString(), source: { name: 'Deccan Herald' } },
  { title: 'Punjab farmers block highways for 3rd consecutive day', description: 'Thousands of farmers continue their agitation on GT Road', publishedAt: new Date().toISOString(), source: { name: 'Tribune' } },
  { title: 'Assam: 12 districts face flood threat as Brahmaputra swells', description: 'NDRF teams deployed, thousands evacuated', publishedAt: new Date().toISOString(), source: { name: 'NE Live' } },
];

const MOCK_RECOMMENDATIONS = [
  { priority:'P1', target:'Disaster Management Authority', recommendation:'Activate emergency response teams in Karnataka and Kerala. Pre-position flood relief materials in Bengaluru North and Wayanad districts immediately.', actionType:'Deploy', urgency:'HIGH' },
  { priority:'P2', target:'State Police Forces', recommendation:'Increase patrol presence in Maharashtra and UP districts showing unrest signals. Deploy rapid response units at key flashpoints.', actionType:'Alert', urgency:'MEDIUM' },
  { priority:'P3', target:'I&B Ministry', recommendation:'Issue public advisories countering misinformation spikes in Delhi. Activate verified communication channels on social media.', actionType:'Communicate', urgency:'MEDIUM' },
];

export const BASE_STATE_SCORES = {
  'Karnataka':       { score:78, emotion:'Fear + Panic',   crisis:'Flood Panic Risk',        level:'HIGH',     trend:'↑', newsCount: 8, redditCount: 12 },
  'Maharashtra':     { score:63, emotion:'Anger + Unrest', crisis:'Protest Activity',         level:'HIGH',     trend:'↑', newsCount: 6, redditCount: 9 },
  'Delhi':           { score:55, emotion:'Anxiety',        crisis:'Pollution + Civil Unrest', level:'MEDIUM',   trend:'→', newsCount: 5, redditCount: 7 },
  'Tamil Nadu':      { score:41, emotion:'Panic',          crisis:'Economic Stress',          level:'MEDIUM',   trend:'↓', newsCount: 3, redditCount: 4 },
  'Kerala':          { score:74, emotion:'Fear',           crisis:'Flood Emergency Risk',     level:'HIGH',     trend:'↑', newsCount: 7, redditCount: 10 },
  'Telangana':       { score:48, emotion:'Anger',          crisis:'Protest Signals',          level:'MEDIUM',   trend:'→', newsCount: 4, redditCount: 5 },
  'Gujarat':         { score:28, emotion:'Calm',           crisis:'Low Risk',                 level:'LOW',      trend:'↓', newsCount: 2, redditCount: 2 },
  'Uttar Pradesh':   { score:67, emotion:'Unrest',         crisis:'Communal Tension Risk',    level:'HIGH',     trend:'↑', newsCount: 6, redditCount: 8 },
  'West Bengal':     { score:53, emotion:'Anxiety',        crisis:'Political Tension',        level:'MEDIUM',   trend:'→', newsCount: 4, redditCount: 6 },
  'Rajasthan':       { score:34, emotion:'Anxiety',        crisis:'Drought Stress',           level:'MEDIUM',   trend:'→', newsCount: 3, redditCount: 3 },
  'Punjab':          { score:44, emotion:'Anger',          crisis:'Farmer Protests',          level:'MEDIUM',   trend:'↑', newsCount: 4, redditCount: 5 },
  'Bihar':           { score:38, emotion:'Anxiety',        crisis:'Flood Preparedness',       level:'MEDIUM',   trend:'→', newsCount: 3, redditCount: 3 },
  'Madhya Pradesh':  { score:31, emotion:'Calm',           crisis:'Low Risk',                 level:'LOW',      trend:'↓', newsCount: 2, redditCount: 2 },
  'Assam':           { score:46, emotion:'Fear',           crisis:'Flood Watch',              level:'MEDIUM',   trend:'→', newsCount: 4, redditCount: 4 },
  'Odisha':          { score:37, emotion:'Anxiety',        crisis:'Cyclone Preparedness',     level:'MEDIUM',   trend:'→', newsCount: 3, redditCount: 3 },
  'Jharkhand':       { score:29, emotion:'Calm',           crisis:'Low Risk',                 level:'LOW',      trend:'↓', newsCount: 1, redditCount: 1 },
  'Chhattisgarh':    { score:33, emotion:'Anxiety',        crisis:'Infrastructure Stress',    level:'MEDIUM',   trend:'→', newsCount: 2, redditCount: 2 },
  'Andhra Pradesh':  { score:42, emotion:'Anxiety',        crisis:'Economic Stress',          level:'MEDIUM',   trend:'→', newsCount: 3, redditCount: 3 },
  'Himachal Pradesh':{ score:22, emotion:'Calm',           crisis:'Low Risk',                 level:'LOW',      trend:'↓', newsCount: 1, redditCount: 1 },
  'Uttarakhand':     { score:35, emotion:'Fear',           crisis:'Landslide Watch',          level:'MEDIUM',   trend:'→', newsCount: 2, redditCount: 3 },
  'Haryana':         { score:40, emotion:'Unrest',         crisis:'Protest Signals',          level:'MEDIUM',   trend:'→', newsCount: 2, redditCount: 4 },
  'Goa':             { score:18, emotion:'Calm',           crisis:'Low Risk',                 level:'LOW',      trend:'↓', newsCount: 0, redditCount: 1 },
};

export const SIGNAL_POOL = [
  { source:'Reddit', text:'Heavy flooding reported in North Bengaluru — r/bangalore',        emotion:'FEAR',    state:'Karnataka',    severity:'HIGH' },
  { source:'News',   text:'IMD issues red alert for coastal Karnataka districts',             emotion:'PANIC',   state:'Karnataka',    severity:'HIGH' },
  { source:'Trends', text:'"water shortage bengaluru" search volume up 340%',                emotion:'ANXIETY', state:'Karnataka',    severity:'MEDIUM' },
  { source:'Reddit', text:'Mumbai protest march gaining momentum — r/india',                 emotion:'ANGER',   state:'Maharashtra',  severity:'MEDIUM' },
  { source:'News',   text:'Delhi pollution: Schools shut, AQI at 450+',                      emotion:'ANXIETY', state:'Delhi',        severity:'HIGH' },
  { source:'Reddit', text:'Fuel shortage panic spreading — r/indiaspeaks',                  emotion:'PANIC',   state:'Uttar Pradesh',severity:'MEDIUM' },
  { source:'Trends', text:'"bandh tomorrow kolkata" search spike detected',                  emotion:'UNREST',  state:'West Bengal',  severity:'HIGH' },
  { source:'News',   text:'Kerala: 3 districts on flood alert, evacuations begin',           emotion:'FEAR',    state:'Kerala',       severity:'CRITICAL' },
  { source:'Reddit', text:'Hyderabad protest: Large crowds near Charminar — r/india',        emotion:'ANGER',   state:'Telangana',    severity:'MEDIUM' },
  { source:'Trends', text:'"earthquake" search spike in Gujarat coastal region',             emotion:'FEAR',    state:'Gujarat',      severity:'LOW' },
  { source:'News',   text:'UP: Internet suspended in 5 districts amid tension',              emotion:'UNREST',  state:'Uttar Pradesh',severity:'HIGH' },
  { source:'Reddit', text:'Rajasthan drought: farmers block highway — r/india',              emotion:'ANGER',   state:'Rajasthan',    severity:'MEDIUM' },
  { source:'Trends', text:'"cyclone odisha" searches rising sharply',                        emotion:'FEAR',    state:'Odisha',       severity:'MEDIUM' },
  { source:'News',   text:'Punjab highway blockade resumes, commuters stranded',             emotion:'UNREST',  state:'Punjab',       severity:'MEDIUM' },
  { source:'Reddit', text:'Bihar flood warning issued — multiple villages at risk',          emotion:'FEAR',    state:'Bihar',        severity:'HIGH' },
];

// ─── EMOTION ANALYSIS ─────────────────────────────────────────────────────────
const EMOTION_KEYWORDS = {
  fear:    ['flood', 'earthquake', 'danger', 'tsunami', 'cyclone', 'disaster', 'emergency', 'threat', 'warning', 'alert'],
  anger:   ['protest', 'riot', 'bandh', 'strike', 'corruption', 'injustice', 'outrage', 'fury', 'rage', 'agitation'],
  panic:   ['shortage', 'price hike', 'fuel', 'inflation', 'blackout', 'crash', 'collapse', 'urgent', 'panic'],
  unrest:  ['violence', 'curfew', 'tension', 'clash', 'conflict', 'siege', 'armed', 'sectarian'],
  anxiety: ['recession', 'layoffs', 'unemployment', 'debt', 'poverty', 'crisis', 'unstable', 'uncertainty'],
};

const detectEmotion = (text) => {
  const lower = text.toLowerCase();
  const scores = {};
  for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
    scores[emotion] = keywords.filter(k => lower.includes(k)).length;
  }
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return sorted[0][1] > 0 ? sorted[0][0] : 'anxiety';
};

// ─── STATE MAPPING ─────────────────────────────────────────────────────────────
const STATE_KEYWORDS = {
  'Karnataka':      ['karnataka','bengaluru','bangalore','mysuru','mysore','hubli','mangaluru','belagavi'],
  'Maharashtra':    ['maharashtra','mumbai','pune','nagpur','nashik','aurangabad','thane','solapur'],
  'Delhi':          ['delhi','new delhi','ncr','noida','gurgaon','gurugram','faridabad'],
  'Tamil Nadu':     ['tamil nadu','chennai','coimbatore','madurai','salem','trichy','tiruchirappalli'],
  'Kerala':         ['kerala','thiruvananthapuram','kochi','kozhikode','thrissur','kollam','wayanad','idukki'],
  'Telangana':      ['telangana','hyderabad','warangal','karimnagar','nizamabad','khammam','charminar'],
  'Gujarat':        ['gujarat','ahmedabad','surat','vadodara','rajkot','gandhinagar'],
  'Uttar Pradesh':  ['uttar pradesh','lucknow','kanpur','agra','varanasi','allahabad','prayagraj','meerut','up '],
  'West Bengal':    ['west bengal','kolkata','calcutta','howrah','siliguri','asansol','durgapur'],
  'Rajasthan':      ['rajasthan','jaipur','jodhpur','udaipur','ajmer','kota','bikaner'],
  'Punjab':         ['punjab','chandigarh','ludhiana','amritsar','jalandhar','patiala'],
  'Bihar':          ['bihar','patna','gaya','muzaffarpur','bhagalpur'],
  'Madhya Pradesh': ['madhya pradesh','bhopal','indore','jabalpur','gwalior'],
  'Assam':          ['assam','guwahati','silchar','dibrugarh','jorhat','brahmaputra'],
  'Odisha':         ['odisha','bhubaneswar','cuttack','rourkela','puri'],
};

const mapToState = (text) => {
  const lower = text.toLowerCase();
  for (const [state, keywords] of Object.entries(STATE_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) return state;
  }
  return null;
};

// ─── RISK SCORE ───────────────────────────────────────────────────────────────
const calculateRiskScore = (newsCount, sentimentScore, emotionIntensity, trendScore) =>
  Math.min(100, Math.round(newsCount * 0.35 + sentimentScore * 0.30 + emotionIntensity * 0.20 + trendScore * 0.15));

export const getRiskLevel = (score) => {
  if (score >= 86) return { level: 'CRITICAL', color: '#FF2D55' };
  if (score >= 61) return { level: 'HIGH',     color: '#FF6B35' };
  if (score >= 31) return { level: 'MEDIUM',   color: '#FFB800' };
  return              { level: 'LOW',      color: '#00FF88' };
};

// ─── REDDIT FEEDS ─────────────────────────────────────────────────────────────
const REDDIT_FEEDS = [
  'https://www.reddit.com/r/india/new.json?limit=25',
  'https://www.reddit.com/r/bangalore/new.json?limit=25',
  'https://www.reddit.com/r/karnataka/new.json?limit=25',
  'https://www.reddit.com/r/indiaspeaks/new.json?limit=25',
];

const fetchReddit = async (url) => {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'PulseSphere/1.0' },
    });
    if (!res.ok) throw new Error('Reddit fetch failed');
    const data = await res.json();
    return data.data.children.map(p => ({
      title: p.data.title,
      score: p.data.score,
      subreddit: p.data.subreddit,
      url: p.data.url,
      created: p.data.created_utc,
    }));
  } catch {
    return [];
  }
};

// ─── NEWS API ─────────────────────────────────────────────────────────────────
const CRISIS_KEYWORDS = 'flood OR protest OR riot OR panic OR bandh OR strike OR earthquake OR emergency OR shortage OR inflation';

const fetchNews = async () => {
  const keys = [
    import.meta.env.VITE_NEWS_API_KEY_1,
    import.meta.env.VITE_NEWS_API_KEY_2,
  ].filter(Boolean);

  for (const key of keys) {
    try {
      const res = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(CRISIS_KEYWORDS)}&language=en&sortBy=publishedAt&pageSize=30&apiKey=${key}`
      );
      if (!res.ok) continue;
      const data = await res.json();
      if (data.articles?.length) return data.articles;
    } catch { continue; }
  }
  return MOCK_NEWS_ARTICLES;
};

// ─── GROQ API ───────────────────────────────────────────────────────────────
export const fetchGroqAnalysis = async (topStates) => {
  const key = import.meta.env.VITE_GROQ_API_KEY;
  if (!key) return MOCK_RECOMMENDATIONS;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are an India crisis management AI. Always respond with valid JSON only, no markdown, no explanation.',
          },
          {
            role: 'user',
            content: `Crisis data: ${JSON.stringify(topStates)}. Give 3 recommendations as JSON array: [{"priority":"P1","target":"Authority Name","recommendation":"Action text","actionType":"Deploy","urgency":"HIGH"}]`,
          },
        ],
        temperature: 0.4,
        max_tokens: 600,
      }),
    });
    const data = await response.json();
    const text = data.choices[0].message.content;
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return MOCK_RECOMMENDATIONS;
  }
};

// ─── GENERATE 24H EMOTION TREND ───────────────────────────────────────────────
const generateEmotionTrend = () => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  return hours.map(h => ({
    time: `${h.toString().padStart(2, '0')}:00`,
    Fear:    Math.round(20 + (h >= 18 && h <= 21 ? 45 : h >= 6 && h <= 8 ? 25 : 10) + Math.random() * 15),
    Anger:   Math.round(15 + (h >= 10 && h <= 14 ? 35 : 10) + Math.random() * 12),
    Panic:   Math.round(10 + (h >= 11 && h <= 13 ? 40 : 8) + Math.random() * 10),
    Unrest:  Math.round(12 + (h >= 16 && h <= 20 ? 30 : 8) + Math.random() * 8),
    Anxiety: Math.round(25 + (h >= 8 && h <= 18 ? 15 : 5) + Math.random() * 10),
    Hope:    Math.round(40 - (h >= 18 ? 20 : 0) + Math.random() * 8),
    Calm:    Math.round(50 - (h >= 20 || h <= 5 ? 20 : 5) + Math.random() * 10),
  }));
};

// ─── MAIN HOOK ────────────────────────────────────────────────────────────────
const useDataEngine = () => {
  const [stateScores, setStateScores] = useState(BASE_STATE_SCORES);
  const [news, setNews] = useState(MOCK_NEWS_ARTICLES);
  const [redditPosts, setRedditPosts] = useState(MOCK_REDDIT_POSTS);
  const [recommendations, setRecommendations] = useState(MOCK_RECOMMENDATIONS);
  const [emotionTrend, setEmotionTrend] = useState(generateEmotionTrend());
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [totalArticles, setTotalArticles] = useState(1247);
  const [totalReddit, setTotalReddit] = useState(3891);
  const [trendSpikes, setTrendSpikes] = useState(23);
  const [aiPredictions, setAiPredictions] = useState(156);

  const processData = useCallback((articles, posts) => {
    const stateData = {};

    // Initialize from mock
    Object.entries(BASE_STATE_SCORES).forEach(([state, data]) => {
      stateData[state] = { ...data, newsItems: [], redditItems: [] };
    });

    // Process real news
    articles.forEach(article => {
      const combined = `${article.title} ${article.description || ''}`;
      const state = mapToState(combined);
      if (state && stateData[state]) {
        stateData[state].newsItems.push(article);
      }
    });

    // Process real reddit
    posts.forEach(post => {
      const state = mapToState(post.title) || mapToState(post.subreddit);
      if (state && stateData[state]) {
        stateData[state].redditItems.push(post);
      }
    });

    // Recalculate scores where we have real data
    Object.entries(stateData).forEach(([state, data]) => {
      if (data.newsItems.length > 0 || data.redditItems.length > 0) {
        const newsCount = Math.min(100, (data.newsItems.length * 15) + (data.redditItems.length * 8));
        const dominantEmotion = detectEmotion(
          [...data.newsItems, ...data.redditItems].map(i => i.title || '').join(' ')
        );
        const emotionIntensity = { fear: 85, anger: 75, panic: 90, unrest: 70, anxiety: 60 }[dominantEmotion] || 50;
        const newScore = calculateRiskScore(newsCount, BASE_STATE_SCORES[state].score, emotionIntensity, 60);
        stateData[state] = {
          ...stateData[state],
          score: newScore,
          newsCount: data.newsItems.length,
          redditCount: data.redditItems.length,
        };
      }
    });

    return stateData;
  }, []);

  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch in parallel with timeout
      const withTimeout = (promise, ms) =>
        Promise.race([promise, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);

      const [articles, ...redditResults] = await Promise.allSettled([
        withTimeout(fetchNews(), 8000),
        ...REDDIT_FEEDS.map(url => withTimeout(fetchReddit(url), 6000)),
      ]);

      const newsData = articles.status === 'fulfilled' ? articles.value : MOCK_NEWS_ARTICLES;
      const allPosts = redditResults
        .filter(r => r.status === 'fulfilled')
        .flatMap(r => r.value);
      const postsData = allPosts.length > 0 ? allPosts : MOCK_REDDIT_POSTS;

      const processed = processData(newsData, postsData);
      setStateScores(processed);
      setNews(newsData);
      setRedditPosts(postsData);

      // Update counters with realistic drift
      setTotalArticles(prev => prev + Math.floor(Math.random() * 12 + 3));
      setTotalReddit(prev => prev + Math.floor(Math.random() * 45 + 10));
      setTrendSpikes(prev => Math.max(18, prev + (Math.random() > 0.5 ? 1 : -1)));
      setAiPredictions(prev => prev + Math.floor(Math.random() * 3 + 1));

      // Get top 3 states for Groq
      const topStates = Object.entries(processed)
        .sort((a, b) => b[1].score - a[1].score)
        .slice(0, 3)
        .map(([name, data]) => ({ name, score: data.score, emotion: data.emotion }));

      const recs = await fetchGroqAnalysis(topStates);
      setRecommendations(recs);
      setEmotionTrend(generateEmotionTrend());
      setLastUpdated(new Date());
    } catch {
      // Silent fail — always show something
    } finally {
      setIsLoading(false);
    }
  }, [processData]);

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 60000);
    return () => clearInterval(interval);
  }, [loadAllData]);

  return {
    stateScores,
    news,
    redditPosts,
    recommendations,
    emotionTrend,
    lastUpdated,
    isLoading,
    totalArticles,
    totalReddit,
    trendSpikes,
    aiPredictions,
    refresh: loadAllData,
    setRecommendations,
  };
};

export default useDataEngine;
