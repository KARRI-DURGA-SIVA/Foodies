import { useEffect, useState } from 'react';
import type React from 'react';
import { ChevronDown, Loader2, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { getFoodImageFallback, searchFoodByName } from '../services/foodService';
import { FoodItem } from '../types';

const PRODUCTS = [
  { name: 'Beef Patties', path: '/products/beef' },
  { name: 'Sausage', path: '/products/sausage' },
  { name: 'Chicken Nuggets', path: '/products/chicken' },
  { name: 'Pork', path: '/products/pork' },
];

const MISSION = [
  { name: 'Our Story', path: '/mission' },
  { name: 'Impact', path: '/impact' },
  { name: 'Sustainability', path: '/sustainability' },
];

const NUTRITION = [
  { name: 'Nutrition Facts', path: '/nutrition' },
  { name: 'Ingredients', path: '/ingredients' },
  { name: 'Allergens', path: '/allergens' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<FoodItem[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    const trimmedQuery = searchQuery.trim();
    if (!searchOpen || trimmedQuery.length === 0) {
      setSuggestions([]);
      setLoadingSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);
    const timeout = window.setTimeout(async () => {
      const data = await searchFoodByName(trimmedQuery, 5);
      setSuggestions(data);
      setLoadingSuggestions(false);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [searchOpen, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setActiveDropdown(null);
  };

  const openSuggestion = (item: FoodItem) => {
    setSearchQuery('');
    setSuggestions([]);
    setSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(item.name)}`);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand text-white px-6 h-14 flex items-center justify-between font-sans text-[11px] font-bold uppercase tracking-wider">
      <div className="flex items-center gap-8">
        <button 
          onClick={() => navigate('/')}
          className="text-2xl font-display font-black tracking-tighter hover:opacity-80 transition-opacity cursor-pointer"
        >
          IMPOSSIBLE
        </button>
        
        <div className="hidden md:flex items-center gap-6">
          {/* Products Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-white/80 transition-colors py-5">
              Products <ChevronDown size={12} />
            </button>
            <div className="absolute left-0 top-full hidden group-hover:block w-48 bg-burgundy border border-white/20 rounded-lg shadow-lg">
              {PRODUCTS.map((product) => (
                <button
                  key={product.path}
                  onClick={() => handleNavClick(product.path)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  {product.name}
                </button>
              ))}
            </div>
          </div>

          {/* Mission Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-white/80 transition-colors py-5">
              Mission <ChevronDown size={12} />
            </button>
            <div className="absolute left-0 top-full hidden group-hover:block w-48 bg-burgundy border border-white/20 rounded-lg shadow-lg">
              {MISSION.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Nutrition Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-white/80 transition-colors py-5">
              Nutrition <ChevronDown size={12} />
            </button>
            <div className="absolute left-0 top-full hidden group-hover:block w-48 bg-burgundy border border-white/20 rounded-lg shadow-lg">
              {NUTRITION.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => navigate('/recipes')}
            className="hover:text-white/80 transition-colors"
          >
            Recipes
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen ? (
            <div className="relative">
              <motion.form
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                onSubmit={handleSearch}
                className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1"
              >
                {loadingSuggestions ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search live food..."
                  className="bg-transparent outline-none text-sm px-2 py-1 w-56"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                    setSuggestions([]);
                  }}
                  className="p-1 hover:bg-white/20 rounded"
                >
                  <X size={14} />
                </button>
              </motion.form>

              {(suggestions.length > 0 || loadingSuggestions) && (
                <div className="absolute right-0 top-11 w-80 max-w-[calc(100vw-2rem)] bg-burgundy border border-white/20 rounded-lg shadow-2xl overflow-hidden">
                  {suggestions.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => openSuggestion(item)}
                      className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/10 transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-md object-cover bg-white/10"
                        referrerPolicy="no-referrer"
                        onError={(event) => {
                          event.currentTarget.src = getFoodImageFallback(item.name);
                        }}
                      />
                      <span className="min-w-0">
                        <span className="block text-white text-xs truncate">{item.name}</span>
                        <span className="block text-white/50 text-[10px] truncate">{item.offer || item.restaurant}</span>
                      </span>
                    </button>
                  ))}
                  {loadingSuggestions && suggestions.length === 0 && (
                    <div className="p-4 text-white/60 text-xs">Loading live foodies...</div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-2 hover:bg-white/10 rounded-full transition-all flex items-center gap-2"
            >
              <Search size={16} /> <span className="hidden sm:inline">EXPLORE</span>
            </button>
          )}
        </AnimatePresence>

        <button 
          onClick={() => navigate('/foodservice')}
          className="px-4 py-1 border border-white rounded-md hover:bg-white hover:text-brand transition-all hidden sm:block text-[10px]"
        >
          Foodservice
        </button>
        <button 
          onClick={() => navigate('/find-us')}
          className="px-5 py-1.5 bg-white text-brand rounded-md hover:bg-brand-light hover:text-white transition-all text-[10px]"
        >
          Find Us
        </button>
      </div>
    </nav>
  );
}
