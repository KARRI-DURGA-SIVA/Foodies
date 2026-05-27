import { Facebook, Twitter, Instagram, Youtube, Linkedin, MapPin, ChevronRight, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-burgundy pt-40 pb-20 overflow-hidden relative">
      {/* Background Large Text */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none opacity-10 select-none">
        <h1 className="text-[25vw] leading-none text-brand tracking-tighter text-center font-display">IMPOSSIBLE</h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Meat Locator Banner */}
        <div className="bg-[#FFEDE0] rounded-[40px] p-12 md:p-24 flex flex-col items-center text-center mb-40 text-burgundy shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-8 bg-burgundy" />
            <span className="font-display text-4xl italic">MEAT</span>
            <div className="h-px w-8 bg-burgundy" />
          </div>
          <h2 className="text-8xl md:text-9xl mb-8 tracking-tighter">LOCATOR</h2>
          <p className="text-lg max-w-lg mb-12 opacity-80 font-medium">
            Where's the meat? This map knows. And it can even give you directions to all the Impossible™ meat from plants you could want.
          </p>
          <button className="px-12 py-5 bg-burgundy text-white rounded-full font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-brand transition-all">
            Get Directions <ChevronRight size={16} />
          </button>
        </div>

        {/* Signup */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-40">
           <div className="max-w-md">
             <h3 className="text-3xl text-white mb-4">SIGN UP TO STAY UPDATED ON THE LATEST IMPOSSIBLE™ RECIPES AND PRODUCT RELEASES</h3>
           </div>
           <div className="w-full max-w-md">
             <div className="flex gap-2">
               <input 
                 type="email" 
                 placeholder="Email*" 
                 className="flex-1 bg-white rounded-full px-6 py-4 text-burgundy outline-none font-medium"
               />
               <button className="px-8 py-4 bg-brand text-white rounded-full font-bold uppercase tracking-widest text-xs">Submit</button>
             </div>
             <p className="text-[10px] text-white/40 mt-4 leading-relaxed">
               Please send me emails about Impossible Foods' products and services. By joining, I agree to Impossible Foods' Terms and Conditions and Privacy Policy.
             </p>
           </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 border-t border-white/10 pt-20 mb-20 text-xs font-bold uppercase tracking-widest">
           <div className="flex flex-col gap-6">
             <span className="text-white/40 mb-2">Follow us</span>
             <div className="flex gap-4 text-white">
                <Facebook size={18} />
                <Twitter size={18} />
                <Instagram size={18} />
                <Youtube size={18} />
                <Linkedin size={18} />
             </div>
           </div>
           
           <div className="flex flex-col gap-4">
             <span className="text-white/40 mb-2">Eat Impossible Products</span>
             <a href="#" className="hover:text-brand transition-colors flex items-center gap-1">Locator <ChevronRight size={10} /></a>
             <a href="#" className="hover:text-brand transition-colors flex items-center gap-1">Recipes <ChevronRight size={10} /></a>
           </div>

           <div className="flex flex-col gap-4 text-white/60">
             <span className="text-white/40 mb-2">Sell Impossible Products</span>
             <a href="#" className="hover:text-white transition-colors">Serve in your Restaurant</a>
             <a href="#" className="hover:text-white transition-colors">Restaurant Resources</a>
             <a href="#" className="hover:text-white transition-colors">Get on our map</a>
           </div>

           <div className="flex flex-col gap-4 text-white/60">
             <span className="text-white/40 mb-2">About Impossible Products</span>
             <a href="#" className="hover:text-white transition-colors">Impact Calculator</a>
             <a href="#" className="hover:text-white transition-colors">Science</a>
             <a href="#" className="hover:text-white transition-colors">Careers</a>
           </div>

           <div className="flex flex-col gap-4 text-white/60">
             <span className="text-white/40 mb-2 invisible">More</span>
             <a href="#" className="hover:text-white transition-colors">Impact Report 2020</a>
             <a href="#" className="hover:text-white transition-colors">Impact Report 2022</a>
             <a href="#" className="hover:text-white transition-colors">Help Center</a>
           </div>

           <div className="flex flex-col gap-4 text-white/60">
             <span className="text-white/40 mb-2 invisible">Legal</span>
             <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
             <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-white transition-colors flex items-center gap-2"><Globe size={14} /> United States</a>
           </div>
        </div>

        <div className="flex justify-between items-center text-[10px] text-white/20 uppercase tracking-[0.2em]">
           <span>© 2024 Impossible Foods Inc.</span>
           <div className="flex items-center gap-2">
              <span className="text-white">IMPOSSIBLE FOODS</span>
              <span className="mx-2">curated by</span>
              <div className="flex items-center gap-1 text-white">
                <div className="w-4 h-4 bg-white rounded-sm" />
                <span>Mobbin</span>
              </div>
           </div>
        </div>
      </div>
    </footer>
  );
}
