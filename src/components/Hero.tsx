import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { getFoodImageFallback } from '../services/foodService';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 overflow-hidden bg-burgundy">
      <div className="absolute left-0 top-14 bottom-0 w-[34vw] min-w-[320px] hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1568901346375-23c9450fc529?q=80&w=1200&auto=format&fit=crop"
          className="w-full h-full object-cover brightness-75"
          referrerPolicy="no-referrer"
          alt="Impossible Burger landing image"
          onError={(event) => {
            event.currentTarget.src = getFoodImageFallback('burger');
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-burgundy/30 to-burgundy" />
      </div>
      {/* Floating Food Elements - All Plant-Based Impossible Dishes */}
      <motion.img
        src="https://images.unsplash.com/photo-1568901346375-23c9450fc529?q=80&w=400&h=400&fit=crop" // Impossible Burger
        className="absolute top-24 left-6 w-48 h-48 rounded-3xl object-cover shadow-2xl rotate-12 brightness-95 hidden md:block border-4 border-white/5"
        animate={{ y: [0, -20, 0], rotate: [12, 10, 12] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        referrerPolicy="no-referrer"
        alt="Impossible Burger"
        onError={(event) => {
          event.currentTarget.src = getFoodImageFallback('burger');
        }}
      />
      <motion.img
        src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=400&h=400&fit=crop" // Impossible Meat Burger
        className="absolute top-10 right-[-5%] w-56 h-56 rounded-full object-cover shadow-2xl -rotate-12 brightness-100 hidden md:block border-4 border-white/5"
        animate={{ y: [0, 20, 0], rotate: [-12, -15, -12] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        referrerPolicy="no-referrer"
        alt="Premium Impossible Burger"
        onError={(event) => {
          event.currentTarget.src = getFoodImageFallback('cheese burger');
        }}
      />
      <motion.img
        src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=400&h=400&fit=crop" // Impossible Tacos
        className="absolute bottom-20 left-[5%] w-64 h-48 rounded-2xl object-cover shadow-2xl -rotate-6 brightness-95 hidden md:block border-4 border-white/5"
        animate={{ x: [0, 10, 0], y: [0, 15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        referrerPolicy="no-referrer"
        alt="Impossible Tacos"
        onError={(event) => {
          event.currentTarget.src = getFoodImageFallback('tacos');
        }}
      />
      <motion.img
        src="https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=400&h=400&fit=crop" // Impossible Steak
        className="absolute bottom-5 right-[5%] w-72 h-64 rounded-[40px] object-cover shadow-2xl rotate-3 brightness-100 hidden md:block border-4 border-white/5"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        referrerPolicy="no-referrer"
        alt="Impossible Steak"
        onError={(event) => {
          event.currentTarget.src = getFoodImageFallback('steak');
        }}
      />

      {/* Main Copy */}
      <div className="relative z-10 text-center flex flex-col items-center max-w-4xl px-6">
        <p className="text-white text-[10px] font-bold uppercase tracking-[0.4em] mb-4 opacity-70">Impossible Foods™ - Made From Plants</p>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4 text-brand mb-2">
            <div className="h-px w-8 bg-brand" />
            <span className="font-display text-2xl">IT'S GIVING</span>
            <div className="h-px w-8 bg-brand" />
          </div>
          
          <h1 className="text-[100px] md:text-[180px] leading-[0.8] text-brand tracking-tighter mb-4 select-none drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] font-black">
            IMPOSSIBLE
          </h1>
          
          <div className="relative -mt-12 md:-mt-20 mb-12 group cursor-pointer">
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 1, ease: "anticipate" }}
              className="bg-black/80 backdrop-blur-sm p-4 rounded-full border-2 border-brand/70 shadow-[0_0_50px_rgba(200,16,46,0.5)] rotate-3"
            >
               <img 
                 src="https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=240&h=240&fit=crop" 
                 className="w-32 h-32 rounded-full object-cover group-hover:brightness-125 transition-all shadow-lg" 
                 referrerPolicy="no-referrer" 
                 alt="Impossible Steak - Made from Plants"
                 onError={(event) => {
                   event.currentTarget.src = getFoodImageFallback('steak');
                 }}
               />
            </motion.div>
          </div>
          
          <h2 className="text-5xl md:text-7xl text-brand-light leading-tight mb-8 italic font-display">
            STEAK
          </h2>

          <p className="text-lg md:text-2xl text-white/80 mb-12 max-w-2xl font-light">
            The future of food is here. Impossible™ steak made from plants sears, sizzles, and eats like the craveable classic.
          </p>
          
          <motion.button
            onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-10 py-5 bg-brand text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-brand-light transition-colors shadow-[0_10px_20px_rgba(200,16,46,0.3)]"
          >
            Discover Now <ChevronRight size={18} />
          </motion.button>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <span className="text-[10px] uppercase tracking-tighter mb-2">Scroll to explore</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-12 bg-white/50" 
        />
      </div>
    </section>
  );
}
