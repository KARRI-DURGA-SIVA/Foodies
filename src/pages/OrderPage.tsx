import { useState } from 'react';
import type React from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, DollarSign, Check } from 'lucide-react';

export default function OrderPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const quantity = parseInt(searchParams.get('quantity') || '1');
  const price = 12.99;
  const total = price * quantity;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.street || !formData.city || !formData.state || !formData.zip) {
      alert('Please fill in all fields');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-burgundy pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={48} className="text-white" />
          </div>
          <h2 className="text-4xl font-display italic text-white mb-4">Order Confirmed!</h2>
          <p className="text-white/80 mb-2">Thank you for your order</p>
          <p className="text-brand font-bold">Total: ${total.toFixed(2)}</p>
          <p className="text-white/60 text-sm mt-4">Redirecting home in 3 seconds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-burgundy pt-24">
      {/* Back Button */}
      <div className="max-w-3xl mx-auto px-6 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-brand hover:text-white transition-colors font-bold uppercase tracking-wider"
        >
          <ArrowLeft size={20} /> Back
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10 sticky top-32">
              <h3 className="text-2xl font-display italic text-white mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-white/10">
                <div className="flex justify-between text-white">
                  <span>Impossible Burger</span>
                  <span>x{quantity}</span>
                </div>
                <div className="flex justify-between text-white/70 text-sm">
                  <span>${price} each</span>
                  <span>${(price * quantity).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-white/60 text-sm mb-4">
                <span>Subtotal</span>
                <span>${(price * quantity).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/60 text-sm mb-4">
                <span>Delivery</span>
                <span>$3.00</span>
              </div>
              <div className="flex justify-between text-white/60 text-sm mb-6 pb-6 border-b border-white/10">
                <span>Tax</span>
                <span>${((price * quantity + 3.00) * 0.1).toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-white text-xl font-bold">
                <span>Total</span>
                <span className="text-brand">${(price * quantity + 3.00 + ((price * quantity + 3.00) * 0.1)).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Form */}
          <div className="md:col-span-2">
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-display italic text-white mb-8">Delivery Address</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 text-sm font-bold uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-brand transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm font-bold uppercase tracking-wider mb-2">
                      Email
                    </label>
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-brand transition-all"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-white/60 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Phone size={14} /> Phone Number
                  </label>
                  <input 
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-brand transition-all"
                  />
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-white/60 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                    <MapPin size={14} /> Street Address
                  </label>
                  <input 
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-brand transition-all"
                  />
                </div>

                {/* City, State, Zip */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white/60 text-sm font-bold uppercase tracking-wider mb-2">
                      City
                    </label>
                    <input 
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="San Francisco"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-brand transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm font-bold uppercase tracking-wider mb-2">
                      State
                    </label>
                    <input 
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="CA"
                      maxLength={2}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-brand transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm font-bold uppercase tracking-wider mb-2">
                      ZIP Code
                    </label>
                    <input 
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      placeholder="94105"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-brand transition-all"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="grid md:grid-cols-2 gap-4 pt-6">
                  <button 
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 border border-white/20 rounded-lg text-white font-bold uppercase tracking-wider hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-brand text-white rounded-lg font-bold uppercase tracking-wider hover:bg-brand-light transition-all flex items-center justify-center gap-2"
                  >
                    <DollarSign size={18} /> Complete Order ${(price * quantity + 3.00 + ((price * quantity + 3.00) * 0.1)).toFixed(2)}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
