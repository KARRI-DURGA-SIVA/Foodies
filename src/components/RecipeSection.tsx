import { motion } from 'motion/react';
import { FEATURED_DISHES } from '../constants';
import { getFoodImageFallback } from '../services/foodService';

export default function RecipeSection() {
  return (
    <section className="py-32 bg-burgundy">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-4">Want Recipe Inspo? We Got You.</p>
        <div className="flex justify-center gap-4 mb-16 px-4 flex-wrap">
          <button className="px-6 py-2 bg-white/10 text-white rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20">Fan Faves</button>
          <button className="px-6 py-2 hover:bg-white/10 text-white/50 hover:text-white rounded-full text-[10px] font-bold uppercase tracking-widest transition-all">Burgers</button>
          <button className="px-6 py-2 hover:bg-white/10 text-white/50 hover:text-white rounded-full text-[10px] font-bold uppercase tracking-widest transition-all">Quick</button>
          <button className="px-6 py-2 hover:bg-white/10 text-white/50 hover:text-white rounded-full text-[10px] font-bold uppercase tracking-widest transition-all">Dinner</button>
        </div>

        <div className="flex flex-col items-center mb-20">
          <h2 className="text-brand text-6xl md:text-9xl tracking-tighter italic drop-shadow-lg">THE POTLUCK</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {FEATURED_DISHES.slice(0, 2).map((recipe) => (
            <motion.div 
              key={recipe.id}
              whileHover={{ y: -15 }}
              className="flex flex-col gap-6 text-left group"
            >
              <div className="aspect-[4/3] relative overflow-hidden rounded-[40px] shadow-2xl border border-white/5 bg-black/40">
                 <img 
                    src={recipe.image} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    referrerPolicy="no-referrer" 
                    alt={recipe.name}
                    onError={(event) => {
                      event.currentTarget.src = getFoodImageFallback(recipe.name);
                    }}
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
                 <div className="absolute inset-x-8 bottom-8 flex justify-center">
                    <button className="w-full py-4 bg-brand text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-brand-light transition-colors shadow-2xl">
                      View Recipe
                    </button>
                 </div>
              </div>
              <div className="flex flex-col items-center text-center px-4">
                <span className="bg-brand text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 shadow-lg">
                  {recipe.category === 'LUNCH' ? 'AN EASY MEAL' : recipe.category}
                </span>
                <h3 className="text-3xl text-white mb-2 leading-tight max-w-sm tracking-tight">{recipe.name}</h3>
                <p className="text-white/50 text-[11px] font-bold uppercase tracking-widest mb-4">{recipe.preparationTime} TO PREPARE</p>
                <p className="text-white/40 text-sm leading-relaxed max-w-md font-light">
                  {recipe.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <button className="mt-24 px-12 py-5 border-2 border-brand text-brand rounded-full font-bold uppercase tracking-widest text-xs hover:bg-brand hover:text-white transition-all shadow-xl">
          See All Recipes
        </button>
      </div>
    </section>
  );
}
