import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Loader2, Zap } from 'lucide-react';
import { searchFoodByName, getCacheStats, getFoodImageFallback } from '../services/foodService';
import { FoodItem } from '../types';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cacheStats, setCacheStats] = useState<any>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      
      setLoading(true);
      const data = await searchFoodByName(query, 12);
      setResults(data);
      setCacheStats(getCacheStats());
      setLoading(false);
    };

    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-burgundy pt-24">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-brand hover:text-white transition-colors font-bold uppercase tracking-wider"
        >
          <ArrowLeft size={20} /> Back to Home
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-32">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-display italic text-white mb-4 tracking-tighter">
            Search Results for "{query}"
          </h1>
          
          {/* Live Indexing Stats */}
          {cacheStats && (
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                <Zap size={14} className="text-yellow-400" />
                <span className="text-white/70 text-sm">
                  {cacheStats.cachedQueries} cached queries
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                <span className="text-white/70 text-sm">
                  {cacheStats.totalCachedItems} indexed foods
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                <span className="text-white/70 text-sm">
                  {cacheStats.liveSources?.[0] || 'Live food API'}
                </span>
              </div>
            </div>
          )}

          <p className="text-white/70 text-lg mt-6">
            Found {results.length} delicious live food options
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 size={48} className="text-brand animate-spin mb-4" />
            <p className="text-white text-lg">Indexing live food data...</p>
            <p className="text-white/60 text-sm mt-2">Connecting to restaurant APIs</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && (
          <div className="text-center py-32">
            <p className="text-white/70 text-2xl mb-4">No results found for "{query}"</p>
            <p className="text-white/50 mb-8">Try searching for something else or browse our menu</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-brand text-white rounded-full font-bold uppercase tracking-wider hover:bg-brand-light transition-all"
            >
              Return to Home
            </button>
          </div>
        )}

        {/* Results Grid */}
        {!loading && results.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {results.map((item, index) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="group bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-brand hover:bg-white/10 transition-all duration-300 cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden bg-white/5 h-64">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                      onError={(event) => {
                        event.currentTarget.src = getFoodImageFallback(item.name, index);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-burgundy via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-4 right-4 bg-brand/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-white">
                      #{index + 1}
                    </div>
                    {item.source && item.source !== 'Restaurant image API' && (
                      <div className="absolute left-4 top-4 bg-black/70 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                        {item.source}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Category */}
                    <p className="text-brand text-xs font-bold uppercase tracking-wider mb-2">
                      {item.category}
                    </p>

                    {/* Title */}
                    <h3 className="text-white font-display italic text-xl mb-2 line-clamp-2">
                      {item.name}
                    </h3>

                    {/* Description */}
                    <p className="text-white/60 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < Math.floor(Number(item.rating)) ? 'fill-brand text-brand' : 'text-white/30'}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-white/60">{item.rating}</span>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                      <span className="text-brand font-bold text-lg">${item.price}</span>
                      <div className="flex items-center gap-1 text-white/60 text-xs">
                        <Clock size={14} /> Quick order
                      </div>
                    </div>

                    {item.offer && (
                      <p className="text-brand-light text-xs mt-3 font-bold uppercase tracking-wider truncate">
                        {item.offer}
                      </p>
                    )}

                    {/* Restaurant */}
                    <p className="text-white/50 text-xs mt-3 truncate">
                      {item.restaurant}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Live Data Indicator */}
            <div className="text-center py-8 border-t border-white/10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white/70 text-sm">Live food data from partner restaurants</span>
              </div>
              <p className="text-white/50 text-xs">Data indexed and cached for performance</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
