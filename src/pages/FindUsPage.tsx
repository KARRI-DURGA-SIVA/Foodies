import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Phone, Clock, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getFoodImageFallback } from '../services/foodService';

interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  image: string;
  lat: number;
  lng: number;
}

const LOCATIONS: Location[] = [
  {
    id: 1,
    name: 'Impossible Foods - San Francisco',
    address: '123 Market Street',
    city: 'San Francisco, CA 94105',
    phone: '+1 (415) 555-0123',
    hours: 'Mon-Sun: 10AM - 10PM',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561615?w=600',
    lat: 37.7749,
    lng: -122.4194
  },
  {
    id: 2,
    name: 'Impossible Foods - Los Angeles',
    address: '456 Sunset Boulevard',
    city: 'Los Angeles, CA 90028',
    phone: '+1 (323) 555-0456',
    hours: 'Mon-Sun: 11AM - 11PM',
    image: 'https://images.unsplash.com/photo-1537214537257-62c80ee0ee60?w=600',
    lat: 34.0522,
    lng: -118.2437
  },
  {
    id: 3,
    name: 'Impossible Foods - New York',
    address: '789 5th Avenue',
    city: 'New York, NY 10001',
    phone: '+1 (212) 555-0789',
    hours: 'Mon-Sun: 10AM - 11PM',
    image: 'https://images.unsplash.com/photo-1550909-9ad7de99125f?w=600',
    lat: 40.7128,
    lng: -74.0060
  },
  {
    id: 4,
    name: 'Impossible Foods - Chicago',
    address: '321 N Michigan Ave',
    city: 'Chicago, IL 60601',
    phone: '+1 (312) 555-0321',
    hours: 'Mon-Sun: 10AM - 10PM',
    image: 'https://images.unsplash.com/photo-1414457421481-27e7b5ce6c73?w=600',
    lat: 41.8781,
    lng: -87.6298
  },
];

export default function FindUsPage() {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(LOCATIONS[0]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Get user's location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          console.log('Location access denied');
        }
      );
    }
  }, []);

  const getDirections = (location: Location) => {
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(location.address + ' ' + location.city)}`;
    window.open(mapsUrl, '_blank');
  };

  const calculateDistance = (location: Location) => {
    if (!userLocation) return null;
    const lat1 = userLocation.lat;
    const lon1 = userLocation.lng;
    const lat2 = location.lat;
    const lon2 = location.lng;
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 10) / 10;
  };

  return (
    <div className="min-h-screen bg-burgundy pt-24">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-brand hover:text-white transition-colors font-bold uppercase tracking-wider"
        >
          <ArrowLeft size={20} /> Back to Home
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-32">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-display italic text-white mb-4 tracking-tighter">FIND US</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Discover Impossible Foods locations near you. Visit any of our restaurants to experience the future of meat, made from plants.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Location List */}
          <div className="md:col-span-1 space-y-4 max-h-[600px] overflow-y-auto">
            {LOCATIONS.map((location) => (
              <button
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                  selectedLocation?.id === location.id
                    ? 'bg-brand/20 border-brand'
                    : 'bg-white/5 border-white/10 hover:border-brand/50'
                }`}
              >
                <h3 className="font-bold text-white mb-2">{location.name}</h3>
                <p className="text-white/60 text-sm mb-2 flex items-center gap-1">
                  <MapPin size={14} /> {location.city}
                </p>
                {userLocation && (
                  <p className="text-brand text-sm font-bold">
                    {calculateDistance(location)} miles away
                  </p>
                )}
              </button>
            ))}
          </div>

          {/* Location Details */}
          {selectedLocation && (
            <div className="md:col-span-2">
              <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                {/* Image */}
                <img 
                  src={selectedLocation.image}
                  alt={selectedLocation.name}
                  className="w-full h-64 object-cover"
                  onError={(event) => {
                    event.currentTarget.src = getFoodImageFallback(selectedLocation.name);
                  }}
                />

                {/* Details */}
                <div className="p-8">
                  <h2 className="text-3xl font-display italic text-white mb-6">{selectedLocation.name}</h2>

                  {/* Address */}
                  <div className="mb-6 pb-6 border-b border-white/10">
                    <div className="flex items-start gap-3 text-white/80">
                      <MapPin size={20} className="text-brand mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-white/60 uppercase tracking-wider font-bold mb-1">Address</p>
                        <p className="text-lg">{selectedLocation.address}</p>
                        <p className="text-lg">{selectedLocation.city}</p>
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="mb-6 pb-6 border-b border-white/10">
                    <div className="flex items-center gap-3 text-white/80">
                      <Phone size={20} className="text-brand flex-shrink-0" />
                      <div>
                        <p className="text-sm text-white/60 uppercase tracking-wider font-bold mb-1">Phone</p>
                        <a href={`tel:${selectedLocation.phone}`} className="text-lg hover:text-brand transition-colors">
                          {selectedLocation.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="mb-8 pb-8 border-b border-white/10">
                    <div className="flex items-start gap-3 text-white/80">
                      <Clock size={20} className="text-brand mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-white/60 uppercase tracking-wider font-bold mb-1">Hours</p>
                        <p className="text-lg">{selectedLocation.hours}</p>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => getDirections(selectedLocation)}
                      className="px-6 py-3 bg-brand text-white rounded-lg font-bold uppercase tracking-wider hover:bg-brand-light transition-all flex items-center justify-center gap-2"
                    >
                      <Globe size={18} /> Get Directions
                    </button>
                    <a
                      href={`tel:${selectedLocation.phone}`}
                      className="px-6 py-3 border border-white/20 text-white rounded-lg font-bold uppercase tracking-wider hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      <Phone size={18} /> Call
                    </a>
                  </div>

                  {/* Distance */}
                  {userLocation && (
                    <p className="text-center mt-6 text-brand font-bold">
                      📍 {calculateDistance(selectedLocation)} miles from your location
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
