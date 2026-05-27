import axios from 'axios';
import { FoodItem } from '../types';

// API Configuration
const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY || 'demo';
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || '';
const RAPIDAPI_HOST = import.meta.env.VITE_RAPIDAPI_HOST || '';

// Track indexed foods for performance
interface CachedFoodIndex {
  foods: FoodItem[];
  indexedAt: number;
  source: string;
  query: string;
}

let foodIndexCache: Map<string, CachedFoodIndex> = new Map();
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

// Popular plant-based search terms
const PLANT_BASED_KEYWORDS = [
  'impossible meat', 'plant-based burger', 'vegan burger',
  'vegetarian meal', 'tofu', 'plant protein', 'meat substitute',
  'vegan taco', 'plant-based sausage', 'impossible foods'
];

const FOOD_CATALOG = [
  { keys: ['biryani', 'biriyani', 'biryabi'], label: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=900&h=700&fit=crop&q=80&auto=format', items: ['Hyderabadi Chicken Biryani', 'Dum Mutton Biryani', 'Paneer Biryani', 'Egg Biryani', 'Boneless Chicken Biryani', 'Biryani Combo Bowl'] },
  { keys: ['burger', 'burgers', 'kfc'], label: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450fc529?w=900&h=700&fit=crop&q=80&auto=format', items: ['Crispy Chicken Burger', 'Classic Beef Burger', 'Zinger-Style Burger', 'Cheese Loaded Burger', 'Double Patty Burger', 'Spicy Veg Burger'] },
  { keys: ['fried chicken', 'frid cikend', 'kfc', 'chicken'], label: 'Fried Chicken', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=900&h=700&fit=crop&q=80&auto=format', items: ['Crispy Fried Chicken Bucket', 'Spicy Chicken Wings', 'Chicken Popcorn', 'Chicken Strips', 'Hot Drumsticks', 'Chicken Combo Meal'] },
  { keys: ['fried rice', 'fridrice', 'rice'], label: 'Fried Rice', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=900&h=700&fit=crop&q=80&auto=format', items: ['Chicken Fried Rice', 'Egg Fried Rice', 'Schezwan Fried Rice', 'Veg Fried Rice', 'Prawn Fried Rice', 'Mixed Non-Veg Fried Rice'] },
  { keys: ['starter', 'starters'], label: 'Starters', image: 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=900&h=700&fit=crop&q=80&auto=format', items: ['Chicken 65', 'Paneer Tikka', 'Fish Fingers', 'Mutton Pepper Fry', 'Crispy Corn', 'Chilli Chicken Starter'] },
  { keys: ['chinese', 'chien', 'noodles'], label: 'Chinese', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=900&h=700&fit=crop&q=80&auto=format', items: ['Chicken Noodles', 'Chilli Chicken', 'Manchurian Gravy', 'Schezwan Noodles', 'Dragon Chicken', 'Hakka Noodles'] },
  { keys: ['mutton', 'muttona'], label: 'Mutton', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=900&h=700&fit=crop&q=80&auto=format', items: ['Mutton Curry', 'Mutton Chukka', 'Mutton Biryani', 'Mutton Kebab', 'Mutton Pepper Fry', 'Mutton Mandi'] },
  { keys: ['fish', 'fhs', 'seafood'], label: 'Fish', image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=900&h=700&fit=crop&q=80&auto=format', items: ['Fish Fry', 'Fish Curry', 'Grilled Fish', 'Fish Fingers', 'Prawn Masala', 'Seafood Platter'] },
  { keys: ['france', 'froncve', 'french'], label: 'French', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&h=700&fit=crop&q=80&auto=format', items: ['French Fries', 'Creamy Pasta', 'Garlic Bread', 'Grilled Sandwich', 'Cheese Croissant', 'French Toast'] },
  { keys: ['icecream', 'ice cream', 'dessert'], label: 'Ice Cream', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=900&h=700&fit=crop&q=80&auto=format', items: ['Chocolate Ice Cream', 'Vanilla Sundae', 'Brownie Ice Cream', 'Strawberry Scoop', 'Butterscotch Sundae', 'Kulfi Falooda'] },
  { keys: ['rasmalai', 'recmmulai', 'sweet'], label: 'Rasmalai', image: '', items: ['Rasmalai Cup', 'Kesar Rasmalai', 'Rabri Rasmalai', 'Rasmalai Jar', 'Malai Sweet Box', 'Rasmalai Ice Cream'] },
  { keys: ['kunafa', 'knafeh'], label: 'Kunafa', image: '', items: ['Cheese Kunafa', 'Cream Kunafa', 'Pistachio Kunafa', 'Nutella Kunafa', 'Mini Kunafa Box', 'Kunafa With Ice Cream'] },
  { keys: ['mandi', 'mandi rice'], label: 'Mandi Rice', image: '', items: ['Chicken Mandi', 'Mutton Mandi', 'Fish Mandi', 'Mandi Rice Bowl', 'Al Faham Mandi', 'Mandi Family Pack'] },
  { keys: ['shawarma', 'roll'], label: 'Shawarma', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=900&h=700&fit=crop&q=80&auto=format', items: ['Chicken Shawarma', 'Plate Shawarma', 'Spicy Shawarma Roll', 'Mutton Shawarma', 'Falafel Roll', 'Loaded Shawarma'] },
  { keys: ['pizza'], label: 'Pizza', image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=900&h=700&fit=crop&q=80&auto=format', items: ['Chicken Pizza', 'Margherita Pizza', 'Pepperoni Pizza', 'Paneer Tikka Pizza', 'Cheese Burst Pizza', 'BBQ Chicken Pizza'] },
  { keys: ['pasta'], label: 'Pasta', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=900&h=700&fit=crop&q=80&auto=format', items: ['White Sauce Pasta', 'Chicken Alfredo Pasta', 'Arrabbiata Pasta', 'Cheese Pasta', 'Pesto Pasta', 'Mushroom Pasta'] },
];

export async function searchFoodByName(query: string, number: number = 12): Promise<FoodItem[]> {
  const normalizedQuery = normalizeQuery(query);
  if (!normalizedQuery) return [];

  try {
    const cacheKey = `search_${normalizedQuery}_${number}`;
    const cached = getCachedFoods(cacheKey);
    if (cached) {
      return cached;
    }

    // Search with Spoonacular API
    const response = await axios.get(`${SPOONACULAR_BASE_URL}/complexSearch`, {
      params: {
        query: buildApiQuery(normalizedQuery),
        number,
        apiKey: SPOONACULAR_API_KEY,
        addRecipeInformation: true,
        fillIngredients: true,
        instructionsRequired: false,
        ranking: 2, // Maximize used ingredients
      }
    });

    const foodItems = await mapSpoonacularResults(response.data.results || [], normalizedQuery, number);

    setCachedFoods(cacheKey, normalizedQuery, foodItems, 'Spoonacular live food API');

    return foodItems;
  } catch (error) {
    console.error('Error searching food:', error);
    const fallbackFoods = await getFallbackFoodData(normalizedQuery, number);
    setCachedFoods(`fallback_${normalizedQuery}_${number}`, normalizedQuery, fallbackFoods, 'Restaurant image API');
    return fallbackFoods;
  }
}

export async function getRestaurantFood(cuisine: string = 'vegan', number: number = 12): Promise<FoodItem[]> {
  const normalizedCuisine = normalizeQuery(cuisine) || 'vegan';

  try {
    const cacheKey = `cuisine_${normalizedCuisine}_${number}`;
    const cached = getCachedFoods(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await axios.get(`${SPOONACULAR_BASE_URL}/complexSearch`, {
      params: {
        cuisine: normalizedCuisine,
        number,
        apiKey: SPOONACULAR_API_KEY,
        addRecipeInformation: true,
        type: 'main course',
        diet: 'vegetarian',
      }
    });

    const foodItems = await mapSpoonacularResults(response.data.results || [], normalizedCuisine, number);

    setCachedFoods(cacheKey, normalizedCuisine, foodItems, 'Spoonacular live food API');

    return foodItems;
  } catch (error) {
    console.error('Error fetching restaurant food:', error);
    const fallbackFoods = await getFallbackFoodData(normalizedCuisine, number);
    setCachedFoods(`fallback_${normalizedCuisine}_${number}`, normalizedCuisine, fallbackFoods, 'Restaurant image API');
    return fallbackFoods;
  }
}

export async function getFoodDetails(foodId: number): Promise<any> {
  try {
    const response = await axios.get(`${SPOONACULAR_BASE_URL}/${foodId}/information`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        includeNutrition: true,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching food details:', error);
    return null;
  }
}

// Get all indexed foods (for analytics/tracking)
export function getAllIndexedFoods(): FoodItem[] {
  const allFoods: FoodItem[] = [];
  foodIndexCache.forEach(({ foods }) => {
    allFoods.push(...foods);
  });
  return allFoods;
}

export function getIndexedFoodById(foodId: number): FoodItem | null {
  return getAllIndexedFoods().find((food) => food.id === foodId) || null;
}

// Get cache statistics
export function getCacheStats() {
  const entries = Array.from(foodIndexCache.values());
  const latestIndexTime = entries.reduce((latest, entry) => Math.max(latest, entry.indexedAt), 0);

  return {
    cachedQueries: foodIndexCache.size,
    totalCachedItems: entries.reduce((sum, entry) => sum + entry.foods.length, 0),
    cacheAge: latestIndexTime ? Date.now() - latestIndexTime : 0,
    cacheSize: new Blob([JSON.stringify(Array.from(foodIndexCache.entries()))]).size,
    latestIndexedAt: latestIndexTime ? new Date(latestIndexTime).toISOString() : null,
    liveSources: Array.from(new Set(entries.map((entry) => entry.source))),
  };
}

// Clear cache
export function clearFoodCache() {
  foodIndexCache.clear();
}

function normalizeQuery(value: string): string {
  return value.trim().replace(/\s+/g, ' ').slice(0, 80);
}

function getCachedFoods(cacheKey: string): FoodItem[] | null {
  const cached = foodIndexCache.get(cacheKey);
  if (!cached) return null;
  if (Date.now() - cached.indexedAt > CACHE_DURATION) {
    foodIndexCache.delete(cacheKey);
    return null;
  }
  return cached.foods;
}

function setCachedFoods(cacheKey: string, query: string, foods: FoodItem[], source: string) {
  foodIndexCache.set(cacheKey, {
    foods,
    indexedAt: Date.now(),
    source,
    query,
  });
}

async function mapSpoonacularResults(results: any[], query: string, number: number): Promise<FoodItem[]> {
  const fallbackImage = await getRapidFoodImage(query);
  const indexedAt = new Date().toISOString();
  const mappedFoods = results.slice(0, number).map((item: any, index: number) => ({
    id: Number(item.id) || stableId(`${query}-${index}`),
    name: item.title || `${query} special`,
    description: stripHtml(item.summary) || buildDescription(query),
    image: getSafeImage(item.image, item.title || query, index, fallbackImage),
    price: getStablePrice(item.id || index),
    restaurant: getPartnerName(index),
    rating: getStableRating(item.id || index),
    category: getMatchedCatalog(item.title || query)?.label || item.cuisines?.[0] || item.dishTypes?.[0] || getMatchedCatalog(query)?.label || 'Live Food',
    source: 'Spoonacular',
    indexedAt,
    offer: getOffer(index),
  }));

  if (mappedFoods.length >= number) {
    return mappedFoods;
  }

  const fallbackFoods = await getFallbackFoodData(query, number - mappedFoods.length);
  return [...mappedFoods, ...fallbackFoods].slice(0, number);
}

function stripHtml(value?: string): string {
  return value?.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() || '';
}

function buildDescription(query: string): string {
  return `A fresh ${query} option indexed from live food data with matching images, offers, and restaurant-style availability.`;
}

function buildApiQuery(query: string): string {
  const lowerQuery = query.toLowerCase();
  const asksForPlantBased = PLANT_BASED_KEYWORDS.some((keyword) => lowerQuery.includes(keyword));
  const asksForNonVeg = ['chicken', 'mutton', 'fish', 'prawn', 'beef', 'non veg', 'fried chicken', 'biryani', 'mandi', 'kfc'].some((keyword) => lowerQuery.includes(keyword));

  if (asksForPlantBased && !asksForNonVeg) {
    return `${query} plant-based impossible vegan vegetarian`;
  }

  return `${query} restaurant food`;
}

async function getRapidFoodImage(query: string): Promise<string | null> {
  if (!RAPIDAPI_KEY || !RAPIDAPI_HOST || RAPIDAPI_KEY === 'demo') return null;

  try {
    const response = await axios.get(`https://${RAPIDAPI_HOST}/api/`, {
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST,
      },
      params: { q: query },
    });
    return response.data?.image || null;
  } catch (error) {
    console.error('Error fetching RapidAPI food image:', error);
    return null;
  }
}

function getPartnerName(index: number): string {
  const partners = [
    'Live Food Partner Kitchen',
    'Zomato-Style Menu Partner',
    'Swiggy-Style Delivery Partner',
    'Neighborhood Cloud Kitchen',
    'Hot Deals Restaurant',
  ];
  return partners[index % partners.length];
}

function getStablePrice(seed: number | string): number {
  const id = stableId(String(seed));
  return Number((8.99 + (id % 1100) / 100).toFixed(2));
}

function getStableRating(seed: number | string): number {
  const id = stableId(String(seed));
  return Number((4.1 + (id % 9) / 10).toFixed(1));
}

function getOffer(index: number): string {
  const offers = [
    '15% off first order',
    'Free delivery today',
    'Combo upgrade available',
    'Limited lunch deal',
    'Plant protein special',
  ];
  return offers[index % offers.length];
}

function getSafeImage(image: string | undefined, query: string, index: number, fallbackImage?: string | null): string {
  if (image && image.startsWith('http')) {
    return image;
  }

  return fallbackImage || getCategoryImage(query, index);
}

function stableId(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash || 1;
}

function getCategoryImage(query: string, index: number): string {
  const lowerQuery = query.toLowerCase();
  const catalog = getMatchedCatalog(lowerQuery);
  if (catalog) {
    return getRealFoodPhotoUrl(`${catalog.label} ${query}`, index);
  }

  if (lowerQuery.includes('steak')) {
    return getRealFoodPhotoUrl('steak food', index);
  }
  if (lowerQuery.includes('taco')) {
    return getRealFoodPhotoUrl('tacos food', index);
  }
  if (lowerQuery.includes('pizza')) {
    return getRealFoodPhotoUrl('pizza food', index);
  }
  if (lowerQuery.includes('pasta')) {
    return getRealFoodPhotoUrl('pasta food', index);
  }

  return getRealFoodPhotoUrl(query || 'restaurant food', index);
}

export function getFoodImageFallback(query: string, index: number = 0): string {
  return getRealFoodPhotoUrl(query, index + 97);
}

async function getFallbackFoodData(query: string, number: number = 12): Promise<FoodItem[]> {
  const catalog = getMatchedCatalog(query);
  const catalogItems = catalog?.items || [
    `${query} Special Combo`,
    `Spicy ${query} Burger`,
    `${query} Fried Rice`,
    `${query} Starter Platter`,
    `${query} Noodles`,
    `${query} Family Pack`,
    `${query} Dessert Combo`,
    `${query} Mandi Rice`,
  ];

  const indexedAt = new Date().toISOString();
  return Array.from({ length: number }, (_, index) => {
    const name = catalogItems[index % catalogItems.length];
    return {
      id: stableId(`${query}-${name}-${index}`),
      name,
      description: buildFallbackDescription(name, catalog?.label || query),
      image: getCategoryImage(name, index),
      price: getStablePrice(`${query}-${index}`),
      restaurant: getPartnerName(index),
      rating: getStableRating(`${query}-${index}`),
      category: catalog?.label || query,
      source: 'Restaurant image API',
      indexedAt,
      offer: getOffer(index),
    };
  });
}

function getMatchedCatalog(query: string) {
  const lowerQuery = query.toLowerCase();
  return FOOD_CATALOG.find((entry) => entry.keys.some((key) => lowerQuery.includes(key) || key.includes(lowerQuery)));
}

function buildFallbackDescription(name: string, category: string): string {
  return `${name} from the ${category} live food index, loaded with a matching image, current-style offer, rating, and quick-order availability.`;
}

function getRealFoodPhotoUrl(query: string, index: number = 0): string {
  const catalog = getMatchedCatalog(query);
  const keyword = catalog?.label || query || 'restaurant food';
  const cleanKeyword = keyword
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ',')
    .slice(0, 60);
  const lock = stableId(`${query}-${index}`) % 100000;

  return `https://loremflickr.com/900/700/${cleanKeyword},food?lock=${lock}`;
}
