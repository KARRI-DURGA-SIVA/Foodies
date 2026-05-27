import { getFoodImageFallback } from '../services/foodService';

export default function MissionSection() {
  return (
    <section className="relative py-40 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2000&auto=format&fit=crop" 
          className="w-full h-full object-cover brightness-[0.2]" 
          referrerPolicy="no-referrer"
          alt="Fresh food mission background"
          onError={(event) => {
            event.currentTarget.src = getFoodImageFallback('fresh food');
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-teal">
        <div className="flex justify-center items-center gap-4 mb-8">
          <div className="h-px w-8 bg-teal" />
          <span className="font-display text-4xl italic">MISSION</span>
          <div className="h-px w-8 bg-teal" />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-sans font-black leading-tight mb-12 uppercase tracking-tight text-white">
          We strive to make delicious food that's nutritious, better for the planet, and way better for animals.
        </h2>
        
        <p className="text-lg font-medium max-w-2xl mx-auto mb-16 text-teal/80 leading-relaxed italic">
          "The way to solve the most important and urgent problem humanity has potentially ever faced turned out to be to figure out how to make the best burger on earth."
        </p>
        
        <div className="flex flex-col items-center">
          <p className="font-bold uppercase tracking-widest text-xs mb-1 text-white">Pat Brown</p>
          <p className="text-[10px] uppercase tracking-widest text-white/40">Founder of Impossible Foods</p>
        </div>
      </div>
    </section>
  );
}
