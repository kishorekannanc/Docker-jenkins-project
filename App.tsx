
import React, { useState, useMemo } from 'react';
import { MOCK_RESTAURANTS, CATEGORIES } from './constants';
import { Restaurant, CartItem, MenuItem } from './types';
import { getSmartRecommendation } from './services/gemini';

// --- Sub-components (defined outside to avoid re-renders) ---

const Navbar: React.FC<{ cartCount: number, onOpenCart: () => void, onHome: () => void }> = ({ cartCount, onOpenCart, onHome }) => (
  <nav className="sticky top-0 z-50 glass border-b border-gray-200 px-4 py-3 flex items-center justify-between">
    <div className="flex items-center gap-2 cursor-pointer" onClick={onHome}>
      <div className="bg-orange-500 p-2 rounded-lg text-white font-bold text-xl">G</div>
      <span className="text-xl font-bold tracking-tight text-gray-900">GeminiEats</span>
    </div>
    <div className="flex items-center gap-4">
      <button 
        onClick={onOpenCart}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        {cartCount > 0 && (
          <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  </nav>
);

const RestaurantCard: React.FC<{ restaurant: Restaurant, onClick: (r: Restaurant) => void }> = ({ restaurant, onClick }) => (
  <div 
    onClick={() => onClick(restaurant)}
    className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
  >
    <div className="relative h-48 overflow-hidden">
      <img 
        src={restaurant.image} 
        alt={restaurant.name} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
      />
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
        <span className="text-yellow-500">★</span> {restaurant.rating}
      </div>
    </div>
    <div className="p-4">
      <h3 className="text-lg font-bold text-gray-900 mb-1">{restaurant.name}</h3>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>{restaurant.categories.join(' • ')}</span>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-sm font-medium">
        <span className="text-gray-900">{restaurant.deliveryTime}</span>
        <span className={restaurant.deliveryFee === 0 ? 'text-green-600' : 'text-gray-500'}>
          {restaurant.deliveryFee === 0 ? 'Free Delivery' : `$${restaurant.deliveryFee} Fee`}
        </span>
      </div>
    </div>
  </div>
);

const MenuItemCard: React.FC<{ item: MenuItem, onAdd: (item: MenuItem) => void }> = ({ item, onAdd }) => (
  <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
    <div className="flex-1">
      <h4 className="font-bold text-gray-900">{item.name}</h4>
      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-bold text-orange-600">${item.price.toFixed(2)}</span>
        <button 
          onClick={() => onAdd(item)}
          className="bg-orange-100 text-orange-600 p-2 rounded-full hover:bg-orange-500 hover:text-white transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
    <div className="w-24 h-24 flex-shrink-0">
      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
    </div>
  </div>
);

const CartDrawer: React.FC<{ 
  isOpen: boolean, 
  onClose: () => void, 
  items: CartItem[], 
  onUpdateQty: (id: string, delta: number) => void 
}> = ({ isOpen, onClose, items, onUpdateQty }) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Basket</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-300 text-6xl mb-4">🛒</div>
              <p className="text-gray-500 text-lg">Your basket is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{item.name}</h4>
                  <p className="text-xs text-gray-500">{item.restaurantName}</p>
                  <p className="text-sm font-bold mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => onUpdateQty(item.id, -1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="font-bold w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => onUpdateQty(item.id, 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600 font-medium">Subtotal</span>
            <span className="text-2xl font-bold">${total.toFixed(2)}</span>
          </div>
          <button 
            disabled={items.length === 0}
            className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeRestaurant, setActiveRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<{ item: MenuItem, restaurant: Restaurant, reason: string } | null>(null);

  const filteredRestaurants = useMemo(() => {
    if (selectedCategory === 'All') return MOCK_RESTAURANTS;
    return MOCK_RESTAURANTS.filter(r => r.categories.includes(selectedCategory));
  }, [selectedCategory]);

  const addToCart = (item: MenuItem, restaurant: Restaurant) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, restaurantId: restaurant.id, restaurantName: restaurant.name }];
    });
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const handleSmartSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsAiLoading(true);
    setAiRecommendation(null);
    try {
      const result = await getSmartRecommendation(aiPrompt);
      if (result) {
        const foundRestaurant = MOCK_RESTAURANTS.find(r => r.menu.some(m => m.id === result.dishId));
        const foundItem = foundRestaurant?.menu.find(m => m.id === result.dishId);
        
        if (foundItem && foundRestaurant) {
          setAiRecommendation({
            item: foundItem,
            restaurant: foundRestaurant,
            reason: result.reason
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
        onOpenCart={() => setIsCartOpen(true)}
        onHome={() => {
          setActiveRestaurant(null);
          setAiRecommendation(null);
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!activeRestaurant && !aiRecommendation ? (
          <>
            {/* AI Search Bar */}
            <section className="mb-12">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl p-8 md:p-12 shadow-xl">
                <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">What are you craving today?</h1>
                <p className="text-orange-100 text-lg mb-8 max-w-2xl">
                  Describe your mood or taste, and our Gemini AI will find the perfect dish for you.
                </p>
                <form onSubmit={handleSmartSearch} className="relative max-w-2xl">
                  <input 
                    type="text" 
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. 'Something spicy and vegetarian under $15'"
                    className="w-full h-16 pl-6 pr-32 rounded-2xl border-none focus:ring-4 focus:ring-orange-300 text-lg shadow-inner"
                  />
                  <button 
                    type="submit"
                    disabled={isAiLoading}
                    className="absolute right-2 top-2 bottom-2 px-6 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors flex items-center gap-2"
                  >
                    {isAiLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Search'
                    )}
                  </button>
                </form>
              </div>
            </section>

            {/* Categories */}
            <section className="mb-10 overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex gap-4">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                      selectedCategory === cat 
                        ? 'bg-orange-500 text-white shadow-lg' 
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-500'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>

            {/* Restaurant Grid */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Restaurants</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRestaurants.map(res => (
                  <RestaurantCard key={res.id} restaurant={res} onClick={setActiveRestaurant} />
                ))}
              </div>
            </section>
          </>
        ) : activeRestaurant ? (
          /* Restaurant Detail View */
          <div className="animate-in fade-in duration-500">
            <button 
              onClick={() => setActiveRestaurant(null)}
              className="mb-6 flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Restaurants
            </button>
            <div className="relative h-64 md:h-80 w-full rounded-3xl overflow-hidden mb-8">
              <img src={activeRestaurant.image} alt={activeRestaurant.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{activeRestaurant.name}</h1>
                  <div className="flex items-center gap-4 text-white/90 font-medium">
                    <span className="flex items-center gap-1"><span className="text-yellow-400">★</span> {activeRestaurant.rating}</span>
                    <span>•</span>
                    <span>{activeRestaurant.deliveryTime}</span>
                    <span>•</span>
                    <span>{activeRestaurant.deliveryFee === 0 ? 'Free Delivery' : `$${activeRestaurant.deliveryFee} Fee`}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeRestaurant.menu.map(item => (
                <MenuItemCard key={item.id} item={item} onAdd={(itm) => addToCart(itm, activeRestaurant)} />
              ))}
            </div>
          </div>
        ) : aiRecommendation ? (
          /* AI Recommendation View */
          <div className="max-w-2xl mx-auto animate-in zoom-in duration-500">
             <button 
              onClick={() => setAiRecommendation(null)}
              className="mb-6 flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Try another search
            </button>
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-orange-200">
              <div className="bg-orange-50 p-6 flex items-center gap-3">
                <div className="bg-orange-500 text-white p-2 rounded-lg">✨</div>
                <div>
                  <p className="text-orange-800 font-bold uppercase tracking-wider text-xs">AI Smart Pick</p>
                  <h2 className="text-xl font-bold text-orange-950">We found the perfect match!</h2>
                </div>
              </div>
              <div className="p-8">
                <img src={aiRecommendation.item.image} alt={aiRecommendation.item.name} className="w-full h-64 object-cover rounded-2xl mb-6 shadow-md" />
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-3xl font-black text-gray-900">{aiRecommendation.item.name}</h3>
                    <p className="text-orange-600 font-bold text-lg mt-1">from {aiRecommendation.restaurant.name}</p>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">${aiRecommendation.item.price.toFixed(2)}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl mb-8 border-l-4 border-orange-500">
                  <p className="text-gray-700 italic font-medium leading-relaxed">"{aiRecommendation.reason}"</p>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => addToCart(aiRecommendation.item, aiRecommendation.restaurant)}
                    className="flex-1 bg-orange-500 text-white py-4 rounded-2xl font-bold text-xl hover:bg-orange-600 shadow-lg shadow-orange-200"
                  >
                    Add to Basket
                  </button>
                  <button 
                    onClick={() => setActiveRestaurant(aiRecommendation.restaurant)}
                    className="px-6 border-2 border-gray-200 rounded-2xl font-bold text-gray-600 hover:border-gray-900 hover:text-gray-900"
                  >
                    View Menu
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onUpdateQty={updateCartQty}
      />
    </div>
  );
}
