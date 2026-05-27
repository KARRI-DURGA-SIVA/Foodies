import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Leaf, Loader2, ShieldCheck, Tag } from 'lucide-react';
import { getFoodImageFallback, searchFoodByName } from '../services/foodService';
import { FoodItem } from '../types';

const PAGE_COPY: Record<string, { title: string; eyebrow: string; body: string; query: string; image: string; points: string[] }> = {
  products: {
    title: 'Products',
    eyebrow: 'Live Product Menu',
    body: 'Browse plant-based beef, sausage, chicken, pork, and steak-inspired dishes pulled into the live food index.',
    query: 'impossible plant based burger sausage chicken pork',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1600&auto=format&fit=crop',
    points: ['Sears and sizzles', 'Built for delivery', 'Indexed from live food data'],
  },
  mission: {
    title: 'Mission',
    eyebrow: 'Made From Plants',
    body: 'The mission is simple: make food people crave while giving them a plant-based path that feels familiar, satisfying, and easy to order.',
    query: 'plant based sustainable impossible food',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1600&auto=format&fit=crop',
    points: ['Plant protein focus', 'Lower-impact meals', 'Flavor-first experience'],
  },
  nutrition: {
    title: 'Nutrition',
    eyebrow: 'What Is Inside',
    body: 'Explore protein-forward plant-based meals, nutrition-style menu ideas, ingredient-led dishes, and allergen-aware options.',
    query: 'healthy plant based protein bowl',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1600&auto=format&fit=crop',
    points: ['Protein-forward dishes', 'Ingredient visibility', 'Fresh menu discovery'],
  },
  recipes: {
    title: 'Recipes',
    eyebrow: 'Cook And Crave',
    body: 'Find live recipe-style food ideas for tacos, burgers, bowls, sandwiches, and steakhouse plates made from plants.',
    query: 'plant based recipe burger tacos steak',
    image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=1600&auto=format&fit=crop',
    points: ['Weeknight meals', 'Restaurant-style plates', 'Searchable food inspiration'],
  },
  foodservice: {
    title: 'Foodservice',
    eyebrow: 'For Operators',
    body: 'Live menu concepts and offer-ready food cards for restaurants, delivery menus, and plant-based partner kitchens.',
    query: 'restaurant plant based menu special',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1600&auto=format&fit=crop',
    points: ['Menu-ready offers', 'Partner kitchen style', 'Delivery-friendly ideas'],
  },
};

const DETAIL_COPY: Record<string, { title: string; body: string; query: string }> = {
  beef: { title: 'Beef Patties', body: 'Plant-based beef ideas for burgers, bowls, tacos, and steakhouse-style plates.', query: 'impossible beef burger plant based' },
  sausage: { title: 'Sausage', body: 'Savory sausage dishes for breakfast, pasta, grills, and street-food menus.', query: 'impossible sausage plant based' },
  chicken: { title: 'Chicken Nuggets', body: 'Crispy chicken-style nuggets, tenders, sandwiches, and bowls made from plants.', query: 'plant based chicken nuggets impossible' },
  pork: { title: 'Pork', body: 'Smoky pork-style tacos, rice bowls, bao, and hearty dinner ideas made from plants.', query: 'plant based pork impossible' },
  impact: { title: 'Impact', body: 'Plant-based swaps can make familiar meals feel more future-friendly without losing appetite appeal.', query: 'sustainable plant based food' },
  sustainability: { title: 'Sustainability', body: 'Live menu ideas that keep plant-based eating practical, craveable, and easy to discover.', query: 'sustainable vegan restaurant food' },
  ingredients: { title: 'Ingredients', body: 'Ingredient-led plant-based food ideas with vegetables, grains, sauces, and protein-rich menu builds.', query: 'plant based ingredients protein' },
  allergens: { title: 'Allergens', body: 'Browse cleaner menu ideas and always check restaurant details before ordering allergen-sensitive dishes.', query: 'allergen friendly plant based food' },
};

export default function InfoPage({ type }: { type: keyof typeof PAGE_COPY }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { category = '' } = useParams();
  const pathKey = location.pathname.split('/').filter(Boolean).at(-1) || '';
  const detail = DETAIL_COPY[category] || DETAIL_COPY[pathKey];
  const base = PAGE_COPY[type];
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  const title = detail?.title || base.title;
  const body = detail?.body || base.body;
  const query = detail?.query || base.query;

  useEffect(() => {
    let cancelled = false;
    const fetchFoods = async () => {
      setLoading(true);
      const data = await searchFoodByName(query, 9);
      if (!cancelled) {
        setFoods(data);
        setLoading(false);
      }
    };

    fetchFoods();
    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <div className="min-h-screen bg-burgundy pt-24">
      <div className="max-w-7xl mx-auto px-6 pb-28">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-brand hover:text-white transition-colors font-bold uppercase tracking-wider mb-10"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <section className="grid lg:grid-cols-[0.95fr_1.05fr] gap-12 items-center mb-20">
          <div>
            <p className="text-brand text-[10px] font-bold uppercase tracking-[0.4em] mb-5">{base.eyebrow}</p>
            <h1 className="text-7xl md:text-9xl text-white font-display italic tracking-tighter mb-8">{title}</h1>
            <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-8">{body}</p>
            <div className="grid sm:grid-cols-3 gap-3">
              {base.points.map((point) => (
                <div key={point} className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <ShieldCheck size={18} className="text-brand mb-3" />
                  <p className="text-white text-xs font-bold uppercase tracking-wider">{point}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-white/5">
            <img
              src={base.image}
              alt={title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(event) => {
                event.currentTarget.src = getFoodImageFallback(title);
              }}
            />
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-burgundy to-transparent">
              <div className="inline-flex items-center gap-2 bg-brand text-white rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest">
                <Leaf size={14} /> Live Indexed
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between gap-6 mb-8">
            <div>
              <p className="text-brand text-[10px] font-bold uppercase tracking-[0.35em] mb-3">Related Foodies And Offers</p>
              <h2 className="text-4xl text-white font-display italic">Loaded From The Live Index</h2>
            </div>
            <button
              onClick={() => navigate(`/search?q=${encodeURIComponent(query)}`)}
              className="hidden sm:flex items-center gap-2 px-5 py-3 bg-brand rounded-full text-white text-[10px] font-bold uppercase tracking-wider hover:bg-brand-light transition-all"
            >
              Explore More <ArrowRight size={14} />
            </button>
          </div>

          {loading && (
            <div className="py-24 flex justify-center">
              <Loader2 size={42} className="text-brand animate-spin" />
            </div>
          )}

          {!loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foods.map((food) => (
                <button
                  key={food.id}
                  onClick={() => navigate(`/product/${food.id}`)}
                  className="bg-white/5 border border-white/10 rounded-lg overflow-hidden text-left hover:border-brand/50 transition-all"
                >
                  <img
                    src={food.image}
                    alt={food.name}
                    className="h-52 w-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(event) => {
                      event.currentTarget.src = getFoodImageFallback(food.name);
                    }}
                  />
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="text-brand text-[10px] font-bold uppercase tracking-wider">{food.category}</span>
                      <span className="text-white/60 text-[10px] flex items-center gap-1"><Clock size={12} /> Live</span>
                    </div>
                    <h3 className="text-white font-black mb-3 line-clamp-2">{food.name}</h3>
                    <p className="text-white/45 text-xs line-clamp-2 mb-4">{food.description}</p>
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                      <span className="text-brand font-bold">${food.price}</span>
                      <span className="text-white/60 text-[10px] flex items-center gap-1"><Tag size={12} /> {food.offer}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
