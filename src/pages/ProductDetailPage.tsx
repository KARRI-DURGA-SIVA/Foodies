import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Clock, Users } from 'lucide-react';
import { getFoodDetails, getFoodImageFallback, getIndexedFoodById } from '../services/foodService';
import { FoodItem } from '../types';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<FoodItem | null>(null);
  const [details, setDetails] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      const numericId = parseInt(id);
      const indexedProduct = getIndexedFoodById(numericId);
      const fallbackProduct: FoodItem = {
        id: numericId,
        name: 'Impossible Burger',
        description: 'A delicious plant-based burger made with our famous Impossible meat',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450fc529?w=600',
        price: 12.99,
        restaurant: 'Impossible Foods Partner',
        rating: 4.8,
        category: 'Beef'
      };
      
      setProduct(indexedProduct || fallbackProduct);
      
      // Fetch additional details
      const detailsData = await getFoodDetails(numericId);
      setDetails(detailsData);
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-burgundy pt-32 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-burgundy pt-32 flex items-center justify-center">
        <div className="text-white text-2xl">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-burgundy pt-24">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-brand hover:text-white transition-colors font-bold uppercase tracking-wider"
        >
          <ArrowLeft size={20} /> Back
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="flex items-center justify-center bg-white/5 rounded-2xl overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(event) => {
                event.currentTarget.src = getFoodImageFallback(product.name);
              }}
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center text-white">
            <div className="mb-4">
              <p className="text-brand text-sm font-bold uppercase tracking-widest mb-2">{product.category}</p>
              <h1 className="text-5xl md:text-6xl font-display italic mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      size={16}
                      className={i < Math.floor(product.rating) ? 'fill-brand text-brand' : 'text-white/30'}
                    />
                  ))}
                </div>
                <span className="text-sm text-white/70">{product.rating.toFixed(1)} ({123} reviews)</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Details */}
            <div className="grid grid-cols-3 gap-4 mb-8 py-6 border-t border-b border-white/10">
              <div className="flex flex-col items-center text-center">
                <Clock size={20} className="text-brand mb-2" />
                <p className="text-xs text-white/60">PREP TIME</p>
                <p className="text-lg font-bold">20 min</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Users size={20} className="text-brand mb-2" />
                <p className="text-xs text-white/60">SERVES</p>
                <p className="text-lg font-bold">2-3</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <ShoppingCart size={20} className="text-brand mb-2" />
                <p className="text-xs text-white/60">PRICE</p>
                <p className="text-lg font-bold">${product.price}</p>
              </div>
            </div>

            {/* Restaurant Info */}
            <p className="text-sm text-white/60 mb-8">From <span className="font-bold text-white">{product.restaurant}</span></p>
            {product.offer && (
              <div className="mb-8 bg-brand/15 border border-brand/30 rounded-lg px-5 py-4">
                <p className="text-brand-light text-sm font-bold uppercase tracking-wider">{product.offer}</p>
              </div>
            )}

            {/* Quantity & Order */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-white/20 rounded-full">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-brand hover:bg-white/10 transition-all"
                >
                  −
                </button>
                <span className="px-6 py-2 font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-brand hover:bg-white/10 transition-all"
                >
                  +
                </button>
              </div>
              <span className="text-2xl font-bold">${(product.price * quantity).toFixed(2)}</span>
            </div>

            {/* Add to Cart & Order */}
            <div className="flex gap-4">
              <button 
                onClick={() => navigate(`/order/${product.id}?quantity=${quantity}`)}
                className="flex-1 px-8 py-4 bg-brand text-white rounded-full font-bold uppercase tracking-wider hover:bg-brand-light transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} /> Place Order
              </button>
              <button className="px-8 py-4 border border-white rounded-full font-bold uppercase tracking-wider hover:bg-white/10 transition-all">
                Save
              </button>
            </div>

            {/* Nutrition Info */}
            {details?.nutrition && (
              <div className="mt-12 p-6 bg-white/5 rounded-xl border border-white/10">
                <h3 className="text-lg font-bold mb-4">Nutrition Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/60">Calories</p>
                    <p className="font-bold text-lg">{Math.round(details.nutrition?.calories || 450)}</p>
                  </div>
                  <div>
                    <p className="text-white/60">Protein</p>
                    <p className="font-bold text-lg">{Math.round(details.nutrition?.protein || 28)}g</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
