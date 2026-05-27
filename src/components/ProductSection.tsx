import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Loader2, MapPin, Tag } from 'lucide-react';
import { getFoodImageFallback, searchFoodByName } from '../services/foodService';
import { FoodItem } from '../types';

const CATEGORIES = ['Beef', 'Sausage', 'Chicken', 'Pork'];

const CATEGORY_COPY: Record<string, string> = {
  Beef: 'Live burgers, bowls, steaks, and comfort-food specials built around plant-based beef.',
  Sausage: 'Breakfast, grill, pasta, and street-food ideas with savory plant-based sausage.',
  Chicken: 'Crispy sandwiches, nuggets, tenders, and bowls with a plant-based chicken feel.',
  Pork: 'Hearty tacos, rice plates, bao, and smoky dishes inspired by plant-based pork.',
};

export default function ProductSection() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Beef');
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveTab((current) => CATEGORIES[(CATEGORIES.indexOf(current) + 1) % CATEGORIES.length]);
    }, 9000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchFoods = async () => {
      setLoading(true);
      const data = await searchFoodByName(`impossible ${activeTab.toLowerCase()}`, visibleCount);
      if (!cancelled) {
        setFoods(data);
        setLoading(false);
      }
    };

    fetchFoods();
    return () => {
      cancelled = true;
    };
  }, [activeTab, visibleCount]);

  const moveCategory = (direction: number) => {
    const currentIndex = CATEGORIES.indexOf(activeTab);
    const nextIndex = (currentIndex + direction + CATEGORIES.length) % CATEGORIES.length;
    setActiveTab(CATEGORIES[nextIndex]);
    setVisibleCount(8);
  };

  const selectCategory = (category: string) => {
    setActiveTab(category);
    setVisibleCount(8);
  };

  return (
    <section className="py-32 bg-burgundy overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-14 px-4 text-center">
          <h2 className="text-4xl text-white mb-6 tracking-tight font-display italic">Speaking Of Meat From Plants...</h2>
          <p className="text-white/60 max-w-2xl text-sm md:text-base leading-relaxed mb-10">
            {CATEGORY_COPY[activeTab]}
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => moveCategory(-1)}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all"
              title="Previous category"
            >
              <ArrowLeft size={16} />
            </button>

            <div className="flex gap-4 md:gap-8 text-white/50 font-display text-lg md:text-2xl uppercase tracking-tighter flex-wrap justify-center">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => selectCategory(category)}
                  className={`transition-all pb-1 border-b-2 ${activeTab === category ? 'text-white border-brand' : 'hover:text-white border-transparent'}`}
                >
                  {category}
                </button>
              ))}
            </div>

            <button
              onClick={() => moveCategory(1)}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all"
              title="Next category"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="relative"
          >
            {loading && (
              <div className="min-h-[420px] flex flex-col items-center justify-center">
                <Loader2 size={42} className="text-brand animate-spin mb-4" />
                <p className="text-white/60 text-sm uppercase tracking-[0.2em]">Loading live {activeTab} foodies</p>
              </div>
            )}

            {!loading && (
              <div className="flex gap-6 overflow-x-auto pb-8 scroll-hidden snap-x">
                {foods.map((food) => (
                  <motion.article
                    key={food.id}
                    whileHover={{ y: -8 }}
                    className="min-w-[280px] md:min-w-[340px] max-w-[340px] snap-start bg-white/5 rounded-lg border border-white/10 hover:border-brand/50 transition-all shadow-xl overflow-hidden"
                  >
                    <button onClick={() => navigate(`/product/${food.id}`)} className="block w-full text-left">
                      <div className="relative aspect-[4/3] bg-white/5 overflow-hidden">
                        <img
                          src={food.image}
                          alt={food.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                          onError={(event) => {
                            event.currentTarget.src = getFoodImageFallback(food.name);
                          }}
                        />
                        <span className="absolute left-4 top-4 bg-brand text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">
                          {food.category}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="text-white font-sans font-black leading-tight mb-3 line-clamp-2">{food.name}</h3>
                        <p className="text-white/45 text-[11px] leading-relaxed line-clamp-3 mb-5">{food.description}</p>
                        <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                          <span className="text-brand font-bold">${food.price}</span>
                          <span className="flex items-center gap-1 text-white/60 text-[10px]">
                            <Tag size={12} className="text-brand" /> {food.offer}
                          </span>
                        </div>
                      </div>
                    </button>
                    <div className="px-5 pb-5">
                      <button
                        onClick={() => navigate('/find-us')}
                        className="w-full flex items-center justify-center gap-2 py-3 border border-white/15 rounded-md text-white text-[10px] font-bold uppercase tracking-wider hover:bg-white/10 transition-all"
                      >
                        <MapPin size={13} className="text-brand" /> Find It
                      </button>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col items-center gap-6 mt-6">
          <div className="flex justify-center gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => selectCategory(category)}
                className={`w-2 h-2 rounded-full transition-all ${activeTab === category ? 'bg-brand scale-125' : 'bg-white/20'}`}
                title={category}
              />
            ))}
          </div>
          <button
            onClick={() => setVisibleCount((count) => count + 8)}
            disabled={loading}
            className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-brand hover:border-brand transition-all flex items-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
            Load More Live Foodies
          </button>
        </div>
      </div>
    </section>
  );
}
