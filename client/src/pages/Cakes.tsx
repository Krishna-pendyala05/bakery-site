import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useCart } from '../hooks/useCart';
import type { Cake } from '../hooks/useCart';
import { Hero } from '../components/Hero';
import { Philosophy } from '../components/Philosophy';

// Fallback products (matching database seeds) in case backend is loading/offline
const FALLBACK_CAKES: Cake[] = [
  {
    id: 1,
    name: 'Classic Red Velvet Cake',
    description: 'Velvety cocoa-infused layers frosted with our signature Madagascar vanilla cream cheese icing.',
    price: 34.99,
    imageUrl: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=600&auto=format&fit=crop&q=80',
    category: 'Signature',
    available: true,
  },
  {
    id: 2,
    name: 'Decadent Dark Chocolate Fudge',
    description: 'Rich 70% Valrhona dark chocolate cake layered with silky chocolate fudge ganache and topped with dark chocolate curls.',
    price: 38.99,
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
    category: 'Chocolate',
    available: true,
  },
  {
    id: 3,
    name: 'Zesty Lemon Blueberry Cake',
    description: 'Light lemon sponge layers studded with fresh wild blueberries, filled with house-made tangy lemon curd and swiss meringue buttercream.',
    price: 36.99,
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop&q=80',
    category: 'Fruity',
    available: true,
  },
  {
    id: 4,
    name: 'Premium Salted Caramel Drip',
    description: 'Moist brown sugar cake layered with salted caramel buttercream and finished with a rich caramel drip and sea salt crystals.',
    price: 42.99,
    imageUrl: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=600&auto=format&fit=crop&q=80',
    category: 'Gourmet',
    available: true,
  },
  {
    id: 5,
    name: 'Tropical Mango Coconut Cake',
    description: 'Fluffy coconut sponge layered with fresh mango compote and light whipped coconut cream, coated with toasted coconut flakes.',
    price: 39.99,
    imageUrl: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=600&auto=format&fit=crop&q=80',
    category: 'Fruity',
    available: true,
  },
  {
    id: 6,
    name: 'Classic Carrot & Walnut Cake',
    description: 'Spiced carrot cake packed with toasted walnuts and raisins, finished with a smooth, tangy cream cheese frosting layer.',
    price: 35.99,
    imageUrl: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&auto=format&fit=crop&q=80',
    category: 'Signature',
    available: true,
  },
];

interface CakesProps {
  setTab: (tab: 'cakes' | 'checkout' | 'login') => void;
}

export const Cakes: React.FC<CakesProps> = ({ setTab }) => {
  const { addToCart } = useCart();
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [apiFailed, setApiFailed] = useState<boolean>(false);

  const fetchCakes = async () => {
    setLoading(true);
    setApiFailed(false);
    try {
      const response = await api.get('/cakes');
      setCakes(response.data);
    } catch (err) {
      console.warn('API fetch failed, loading local fallback data:', err);
      setCakes(FALLBACK_CAKES);
      setApiFailed(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCakes();
  }, []);

  const availableCategories = ['All', ...Array.from(new Set(cakes.map(c => c.category)))];

  const filteredCakes = activeCategory === 'All'
    ? cakes
    : cakes.filter(cake => cake.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <>
      <Hero setTab={setTab} />
      <Philosophy />

      <main>
        {/* Offline notice */}
        {apiFailed && (
          <p>
            Offline mode — showing local catalog.{' '}
            <button onClick={fetchCakes}>Retry</button>
          </p>
        )}

        {/* Category filter */}
        <nav aria-label="Cake categories">
          {availableCategories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
            >
              {category}
            </button>
          ))}
        </nav>

        {/* Product grid */}
        {loading ? (
          <p>Loading cakes…</p>
        ) : (
          <ul>
            {filteredCakes.map(cake => (
              <li key={cake.id}>
                <img src={cake.imageUrl} alt={cake.name} />
                <div>
                  <h2>{cake.name}</h2>
                  <p>{cake.category}</p>
                  <p>{cake.description}</p>
                  <p>${cake.price.toFixed(2)}</p>
                  <button onClick={() => addToCart(cake)}>Add to Cart</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
};
