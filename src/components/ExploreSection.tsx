import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Search, ChevronRight, Database } from 'lucide-react';
import { getFoodImageFallback, searchFoodByName } from '../services/foodService';
import { FoodItem } from '../types';

export default function ExploreSection() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [resultLimit, setResultLimit] = useState(8);
  const [suggestions, setSuggestions] = useState<FoodItem[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setSuggestions([]);
      setLoadingSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);
    const timeout = window.setTimeout(async () => {
      const data = await searchFoodByName(trimmedQuery, 6);
      setSuggestions(data);
      setLoadingSuggestions(false);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [query]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setResultLimit(8);
    const data = await searchFoodByName(query, 8);
    setResults(data);
    setSuggestions([]);
    setLoading(false);
  };

  const handleLoadMore = async () => {
    if (!query.trim()) return;
    setLoadingMore(true);
    const nextLimit = resultLimit + 8;
    const data = await searchFoodByName(query, nextLimit);
    setResultLimit(nextLimit);
    setResults(data);
    setLoadingMore(false);
  };

  const handleItemClick = (item: FoodItem) => {
    navigate(`/product/${item.id}`);
  };

  const handleSuggestionClick = async (item: FoodItem) => {
    setQuery(item.name);
    setLoading(true);
    const data = await searchFoodByName(item.name, 12);
    setResults(data);
    setSuggestions([]);
    setLoading(false);
  };

  return (
    <section className="py-32 bg-burgundy border-t border-white/5 relative overflow-hidden" id="explore">
       <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
             <div className="flex items-center gap-2 text-brand mb-4">
                <Database size={16} />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Live Food Index</span>
             </div>
             <h2 className="text-6xl md:text-8xl text-white tracking-tighter mb-8 font-display italic">EXPLORE FOODIES</h2>
             
             <form onSubmit={handleSearch} className="w-full max-w-2xl relative">
                <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" />
                <input 
                   id="explore-input"
                   type="text" 
                   value={query}
                   onChange={(e) => setQuery(e.target.value)}
                   placeholder="Search live plant-based food... steak, tacos, biryani, burgers"
                   className="w-full bg-white/5 border border-white/10 rounded-full pl-14 pr-32 py-5 text-white outline-none focus:border-brand transition-all font-light"
                />
                <button 
                   type="submit"
                   disabled={loading}
                   className="absolute right-3 top-1/2 -translate-y-1/2 px-6 h-12 bg-brand text-white rounded-full flex items-center justify-center hover:bg-brand-light transition-all disabled:opacity-50 font-bold uppercase tracking-widest text-[10px]"
                >
                   {loading ? <Loader2 size={16} className="animate-spin" /> : 'SEARCH'}
                </button>
                {(suggestions.length > 0 || loadingSuggestions) && (
                   <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] bg-burgundy border border-white/15 rounded-lg overflow-hidden shadow-2xl z-20 text-left">
                      {suggestions.map((item) => (
                         <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSuggestionClick(item)}
                            className="w-full flex items-center gap-4 p-4 hover:bg-white/10 transition-colors"
                         >
                            <img
                               src={item.image}
                               alt={item.name}
                               className="w-14 h-14 object-cover rounded-md bg-white/5"
                               referrerPolicy="no-referrer"
                               onError={(event) => {
                                  event.currentTarget.src = getFoodImageFallback(item.name);
                               }}
                            />
                            <span className="min-w-0 flex-1">
                               <span className="block text-white font-bold truncate">{item.name}</span>
                               <span className="block text-white/45 text-xs truncate">{item.offer || item.restaurant}</span>
                            </span>
                            <ChevronRight size={16} className="text-brand flex-shrink-0" />
                         </button>
                      ))}
                      {loadingSuggestions && suggestions.length === 0 && (
                         <div className="p-5 text-white/60 text-sm flex items-center gap-3">
                            <Loader2 size={16} className="animate-spin text-brand" /> Loading related foodies...
                         </div>
                      )}
                   </div>
                )}
             </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
             <AnimatePresence mode="popLayout">
                {results.map((item, i) => (
                   <motion.button
                      key={`${item.id}-${i}`}
                      onClick={() => handleItemClick(item)}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", damping: 20, stiffness: 100, delay: (i % 4) * 0.1 }}
                      className="bg-white/5 border border-white/10 p-5 rounded-lg hover:border-brand/30 transition-all group flex flex-col h-full text-left cursor-pointer"
                   >
                      <div className="aspect-square w-full rounded-md overflow-hidden mb-6 bg-black relative">
                         <img 
                            src={item.image}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-100" 
                            referrerPolicy="no-referrer"
                            alt={item.name}
                            onError={(event) => {
                               event.currentTarget.src = getFoodImageFallback(item.name, i);
                            }}
                         />
                         <div className="absolute inset-x-4 bottom-4">
                            <span className="inline-block bg-brand text-white px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest max-w-full truncate">
                               {item.category}
                            </span>
                         </div>
                      </div>
                      <div className="flex-1 flex flex-col px-2">
                         <h3 className="text-lg text-white mb-3 leading-tight group-hover:text-brand transition-colors font-sans font-black">{item.name}</h3>
                         <p className="text-white/40 text-[11px] leading-relaxed font-light mb-auto">{item.description}</p>
                         <div className="mt-6 flex items-center justify-between gap-3">
                            <span className="text-brand font-bold">${item.price}</span>
                            <span className="flex items-center gap-2 text-[9px] text-white font-bold uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                               View <ChevronRight size={10} className="text-brand" />
                            </span>
                         </div>
                         {item.offer && (
                            <p className="mt-3 text-brand-light text-[10px] font-bold uppercase tracking-wider truncate">{item.offer}</p>
                         )}
                         <p className="mt-3 text-white/35 text-[10px] truncate">{item.restaurant}</p>
                      </div>
                   </motion.button>
                ))}
             </AnimatePresence>
          </div>

          {results.length > 0 && (
             <div className="flex justify-center">
                <button 
                   onClick={handleLoadMore}
                   disabled={loadingMore}
                   className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-brand hover:border-brand transition-all flex items-center gap-3 disabled:opacity-50"
                >
                   {loadingMore ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                   {loadingMore ? 'INDEXING MORE...' : 'LOAD MORE FOODIES'}
                </button>
             </div>
          )}

          {!loading && results.length === 0 && (
             <div className="text-center py-20 opacity-20 italic">
                <p className="text-2xl text-white">Search the live food index.</p>
             </div>
          )}
       </div>
    </section>
  );
}
