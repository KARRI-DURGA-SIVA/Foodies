import { useEffect, useState } from 'react';
import { BarChart3, Zap, Database } from 'lucide-react';
import { getAllIndexedFoods, getCacheStats } from '../services/foodService';

interface CacheStats {
  cachedQueries: number;
  totalCachedItems: number;
  cacheAge: number;
  cacheSize: number;
  latestIndexedAt: string | null;
  liveSources: string[];
}

export default function FoodIndexPanel() {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [totalFoods, setTotalFoods] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const updateStats = () => {
      const cacheStats = getCacheStats();
      setStats(cacheStats);
      const foods = getAllIndexedFoods();
      setTotalFoods(foods.length);
    };

    updateStats();
    const interval = setInterval(updateStats, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) return null;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${Math.round(ms / 1000)}s`;
    return `${Math.round(ms / 60000)}m`;
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-brand text-white p-3 rounded-full shadow-lg hover:bg-brand-light transition-all"
        title="Toggle Food Index Panel"
      >
        <Database size={20} />
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-40 w-80 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <BarChart3 size={18} /> Live Food Index
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>

          {/* Stats Grid */}
          <div className="space-y-3">
            {/* Cached Queries */}
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Cached Queries</p>
              <p className="text-white text-2xl font-bold">{stats.cachedQueries}</p>
            </div>

            {/* Total Items */}
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Indexed Foods</p>
              <p className="text-brand text-2xl font-bold">{totalFoods}</p>
            </div>

            {/* Cache Size */}
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Cache Size</p>
              <p className="text-white text-lg font-bold">{formatBytes(stats.cacheSize)}</p>
            </div>

            {/* Cache Age */}
            <div className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Last Indexed</p>
                <p className="text-white text-lg font-bold">{formatTime(stats.cacheAge)}</p>
              </div>
              <Zap size={16} className="text-yellow-400 animate-pulse" />
            </div>
          </div>

          {/* Status */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <p className="text-white/70 text-xs">
                API Integration: {stats.liveSources[0] || 'Waiting for search'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
