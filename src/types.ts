export interface Dish {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  preparationTime: string;
}

export interface FoodItem {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  restaurant: string;
  rating: number;
  category: string;
  source?: string;
  indexedAt?: string;
  offer?: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  items: CartItem[];
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
  };
  total: number;
}

export type AppView = 'home' | 'discover' | 'saved' | 'dish-detail';
