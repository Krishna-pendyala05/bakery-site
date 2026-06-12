import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useCart } from '../hooks/useCart';
import type { Cake } from '../hooks/useCart';
import { ShoppingBag, Star, RefreshCw } from 'lucide-react';

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
    imageUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=600&auto=format&fit=crop&q=80',
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
  }
];

export const Cakes: React.FC = () => {
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

  // Resolve unique available categories in the data
  const availableCategories = ['All', ...Array.from(new Set(cakes.map(c => c.category)))];

  const filteredCakes = activeCategory === 'All' 
    ? cakes 
    : cakes.filter(cake => cake.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto 4rem auto', padding: '0 1rem' }}>
      
      {/* Hero Header */}
      <div style={{ textAlign: 'center', margin: '3rem 0' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Our Freshly Baked Collection
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.75rem auto 0 auto', fontSize: '1rem' }}>
          Indulge in our selection of premium hand-crafted cakes made with organic, locally sourced ingredients and absolute love.
        </p>
        
        {apiFailed && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '1rem',
            fontSize: '0.8rem',
            backgroundColor: 'rgba(219, 110, 38, 0.08)',
            border: '1px solid rgba(219, 110, 38, 0.2)',
            color: 'var(--primary-dark)',
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-full)'
          }}>
            Offline Mode: Operating with local offline catalog.
            <button onClick={fetchCakes} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex' }} title="Retry API">
              <RefreshCw size={12} />
            </button>
          </span>
        )}
      </div>

      {/* Category Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '0.75rem',
        marginBottom: '2.5rem',
        flexWrap: 'wrap'
      }}>
        {availableCategories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`btn ${activeCategory === category ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              padding: '0.5rem 1.25rem',
              fontSize: '0.85rem',
              borderRadius: 'var(--radius-full)'
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid List */}
      {loading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card" style={{ height: '420px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div className="shimmer" style={{ height: '220px', width: '100%' }} />
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                <div className="shimmer" style={{ height: '24px', width: '70%', borderRadius: '4px' }} />
                <div className="shimmer" style={{ height: '16px', width: '90%', borderRadius: '4px' }} />
                <div className="shimmer" style={{ height: '16px', width: '50%', borderRadius: '4px', marginTop: 'auto' }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2.5rem'
        }}>
          {filteredCakes.map(cake => (
            <div 
              key={cake.id} 
              className="glass-card" 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                overflow: 'hidden', 
                transition: 'all var(--transition-normal)',
                position: 'relative'
              }}
            >
              {/* Product Image */}
              <div style={{ position: 'relative', height: '220px', width: '100%', overflow: 'hidden' }}>
                <img 
                  src={cake.imageUrl} 
                  alt={cake.name} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                  }} 
                />
                <span style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  backgroundColor: 'var(--bg-surface-glass)',
                  backdropFilter: 'blur(8px)',
                  color: 'var(--primary-dark)',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {cake.category}
                </span>
              </div>

              {/* Product Info */}
              <div style={{ 
                padding: '1.5rem', 
                display: 'flex', 
                flexDirection: 'column', 
                flex: 1, 
                gap: '0.75rem' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                    {cake.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#EAB308', flexShrink: 0 }}>
                    <Star size={16} fill="#EAB308" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>4.9</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', flex: 1 }}>
                  {cake.description}
                </p>

                {/* Footer details */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  marginTop: '1rem',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '1rem'
                }}>
                  <div>
                    <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Price</p>
                    <p style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                      ${cake.price.toFixed(2)}
                    </p>
                  </div>

                  <button 
                    className="btn btn-primary"
                    onClick={() => addToCart(cake)}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                  >
                    <ShoppingBag size={16} />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
