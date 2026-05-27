import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
  {
    id: 1,
    q: "WHAT ARE THE INGREDIENTS IN IMPOSSIBLE™ BEEF MEAT FROM PLANTS?",
    a: "Impossible® Beef is a mix of proteins, flavors, fats, and binders. The key difference from your average beef from animals? Our ingredients are derived from plants. We use soy protein, coconut oil, sunflower oil, and heme—the 'magic' molecule that makes meat taste move fleshy."
  },
  {
    id: 2,
    q: "WHAT ARE THE NUTRITION FACTS FOR IMPOSSIBLE™ BEEF MEAT FROM PLANTS?",
    a: "Each serving contains 19g of protein, 0mg of cholesterol, and significantly less total fat than 80/20 ground beef from cows."
  },
  {
    id: 3,
    q: "DO YOUR PRODUCTS CONTAIN GLUTEN?",
    a: "Our core products like Impossible Beef and Burger are certified gluten-free."
  }
];

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(1);

  return (
    <section className="py-32 bg-burgundy">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-start">
        {/* Left: Interactive Tabs */}
        <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
               {['NUTRIENT-PACKED', 'BETTER FOR THE PLANET', 'WAY BETTER FOR ANIMALS', 'QUALITY INGREDIENTS'].map((tab, i) => (
                 <button key={tab} className={`flex justify-between items-center px-8 py-6 rounded-2xl border ${i === 0 ? 'bg-brand/20 border-brand/50' : 'bg-white/5 border-white/10'} text-left text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all`}>
                    {tab} <ChevronRight size={14} />
                 </button>
               ))}
            </div>
            
            <div className="flex flex-col gap-6">
              <h2 className="text-4xl text-white">We are all about making unbelievably tasty meats...</h2>
              <p className="text-white/60 leading-relaxed font-light">
                Our delicious products are nutrient-packed and have 0 mg cholesterol. And our super meaty beef that made us kind of famous has 19g protein/serving and 33% less fat than the animal version.
              </p>
              <button className="self-start px-8 py-4 bg-brand text-white rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-brand-light transition-all">
                Lite Ground Beef
              </button>
            </div>
        </div>

        {/* Right: Actual FAQ */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center mb-8">
            <span className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold">Browse Our</span>
            <h2 className="text-8xl text-brand italic">FAQ'S</h2>
          </div>
          
          <div className="space-y-4">
            {FAQS.map(faq => (
              <div key={faq.id} className="bg-black/40 rounded-3xl overflow-hidden border border-white/5">
                <button 
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full px-8 py-8 flex justify-between items-center text-left gap-4"
                >
                  <span className="font-sans font-black text-sm tracking-tight text-white">{faq.q}</span>
                  {openId === faq.id ? <ChevronUp size={20} className="text-brand" /> : <ChevronDown size={20} className="text-white/40" />}
                </button>
                {openId === faq.id && (
                  <div className="px-8 pb-8 text-white/50 text-xs leading-relaxed font-light">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
             <h2 className="text-8xl text-white/20 mb-4 italic">HAVE QUESTIONS?</h2>
             <p className="text-white/40 text-xs uppercase tracking-widest mb-6">Feel free to contact us.</p>
             <button className="px-8 py-3 bg-brand text-white rounded-md text-[10px] font-bold uppercase tracking-widest">Find Help</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChevronRight({ size }: { size: number }) {
  return <path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }} />;
}
