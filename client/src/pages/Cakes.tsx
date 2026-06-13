import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useCart } from '../hooks/useCart';
import type { Cake } from '../hooks/useCart';
import { Hero } from '../components/Hero';
import { Philosophy } from '../components/Philosophy';
import { MenuHeader } from '../components/MenuHeader';
import { CakeCard } from '../components/CakeCard';
import { CustomOrder } from '../components/CustomOrder';

// Fallback products (matching database seeds) in case backend is loading/offline
const FALLBACK_CAKES: Cake[] = [
  {
    id: 1,
    name: 'Pineapple Fresh Cream Cake',
    description: 'Ultra-moist vanilla sponge layers filled with juicy pineapple chunks, layered with fresh whipped cream and topped with glazed pineapple slices.',
    price: 29.99,
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
    category: 'Fruity',
    available: true,
  },
  {
    id: 2,
    name: 'Classic Red Velvet Cake',
    description: 'Velvety cocoa-infused red sponge layers frosted with our signature Madagascar vanilla cream cheese icing and decorated with red velvet crumbs.',
    price: 34.99,
    imageUrl: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=600&auto=format&fit=crop&q=80',
    category: 'Signature',
    available: true,
  },
  {
    id: 3,
    name: 'Wild Blue Berry Custard Cake',
    description: 'Fresh vanilla sponge layers layered with premium blueberry compote and creamy custard, topped with a cascade of fresh wild blueberries.',
    price: 32.99,
    imageUrl: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&auto=format&fit=crop&q=80',
    category: 'Fruity',
    available: true,
  },
  {
    id: 4,
    name: 'Black Forest Gateau',
    description: 'Traditional German sponge cake layered with rich chocolate cream, dark sweet cherries, and kirsch, covered in dark chocolate flakes.',
    price: 31.99,
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
    category: 'Chocolate',
    available: true,
  },
  {
    id: 5,
    name: 'Classic Chocolate Fudge Cake',
    description: 'Rich and moist double chocolate sponge layered with a decadent Belgian chocolate fudge frosting and topped with chocolate curls.',
    price: 35.99,
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
    category: 'Chocolate',
    available: true,
  },
  {
    id: 6,
    name: 'Lavender Blue Berry Cake',
    description: 'Delicate lavender-infused cake layers filled with sweet blueberry coulis and coated in a smooth white chocolate frosting.',
    price: 36.99,
    imageUrl: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&auto=format&fit=crop&q=80',
    category: 'Fruity',
    available: true,
  },
  {
    id: 7,
    name: 'Double Choco Chip Cake',
    description: 'Moist chocolate cake loaded with premium dark chocolate chips inside and out, layered with fluffy vanilla buttercream.',
    price: 33.99,
    imageUrl: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=600&auto=format&fit=crop&q=80',
    category: 'Chocolate',
    available: true,
  },
  {
    id: 8,
    name: 'Kaju Katli Celebration Cake',
    description: 'A luxurious fusion cake flavored with cardamom, topped with premium crushed cashew nuts, and finished with elegant edible silver leaf.',
    price: 45.99,
    imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&auto=format&fit=crop&q=80',
    category: 'Fusion',
    available: true,
  },
  {
    id: 9,
    name: 'Rasmalai Cardamom Cake',
    description: 'Soft saffron-infused sponge soaked in cardamom milk, layered with fresh pistachio crumbs and real Rasmalai sweet pieces.',
    price: 49.99,
    imageUrl: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=600&auto=format&fit=crop&q=80',
    category: 'Fusion',
    available: true,
  }
];

interface CakesProps {
  setTab: (tab: 'cakes' | 'checkout' | 'login') => void;
}

export const Cakes: React.FC<CakesProps> = ({ setTab }) => {
  const { addToCart } = useCart();
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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

  // Smooth scroll to sections based on URL hash
  useEffect(() => {
    const customSmoothScroll = (targetY: number, duration = 1600) => {
      (window as any).isProgrammaticScroll = true;
      const startY = window.scrollY || window.pageYOffset;
      const difference = targetY - startY;
      const startTime = performance.now();

      const easeInOutCubic = (t: number) => 
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const step = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeInOutCubic(progress);
        
        window.scrollTo(0, startY + difference * ease);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setTimeout(() => {
            (window as any).isProgrammaticScroll = false;
          }, 100);
        }
      };

      requestAnimationFrame(step);
    };

    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash === '#menu' || hash === '#custom-order' || hash === '#our-story') {
        const targetId = hash === '#menu' 
          ? 'menu-section' 
          : hash === '#custom-order' 
            ? 'custom-order-section' 
            : 'custom-order-container'; // for our-story
            
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            const navHeight = 80;
            let targetY = el.getBoundingClientRect().top + window.scrollY - navHeight;
            if (hash === '#our-story') {
              const scrollRange = window.innerHeight * 1.3;
              targetY += scrollRange + 20;
            }
            customSmoothScroll(targetY, 1600); // nice majestic 1.6s scroll
          }
        }, 150);
      }
    };

    handleHashScroll();
    window.addEventListener('hashchange', handleHashScroll);
    return () => window.removeEventListener('hashchange', handleHashScroll);
  }, [loading]);

  const filteredCakes = cakes;

  return (
    <>
      <style>{`
        .menu-main-section {
          background-color: var(--color-bg);
          padding: 96px clamp(16px, 6vw, 120px) 80px;
          min-height: 500px;
        }





        /* ── Product Grid ───────────────────────────────────────── */
        .cake-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 56px 36px;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0;
          list-style: none;
        }

        @media (max-width: 700px) {
          .menu-main-section {
            padding: 72px 16px 60px;
          }

          .cake-grid {
            gap: 40px 16px;
            grid-template-columns: 1fr;
          }
        }
        /* ── Skeleton Loading ───────────────────────────────────── */
        @keyframes skeleton-pulse {
          0% {
            background-color: rgba(17, 34, 41, 0.04);
          }
          50% {
            background-color: rgba(17, 34, 41, 0.1);
          }
          100% {
            background-color: rgba(17, 34, 41, 0.04);
          }
        }

        .skeleton-card {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 380px;
          margin: 0 auto;
        }

        .skeleton-image {
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 36px;
          animation: skeleton-pulse 1.5s ease-in-out infinite;
        }

        .skeleton-info {
          padding: 16px 4px 8px;
        }

        .skeleton-title {
          height: 24px;
          width: 65%;
          border-radius: 6px;
          margin-bottom: 12px;
          animation: skeleton-pulse 1.5s ease-in-out infinite;
        }

        .skeleton-desc-line {
          height: 14px;
          width: 100%;
          border-radius: 4px;
          margin-bottom: 8px;
          animation: skeleton-pulse 1.5s ease-in-out infinite;
        }

        .skeleton-desc-line.short {
          width: 80%;
          margin-bottom: 18px;
        }

        .skeleton-weight-row {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .skeleton-weight-pill {
          height: 30px;
          width: 65px;
          border-radius: 9999px;
          animation: skeleton-pulse 1.5s ease-in-out infinite;
        }

        .skeleton-action-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
          height: 44px;
        }

        .skeleton-price {
          height: 24px;
          width: 85px;
          border-radius: 6px;
          animation: skeleton-pulse 1.5s ease-in-out infinite;
        }

        .skeleton-qty {
          height: 36px;
          width: 110px;
          border-radius: 9999px;
          animation: skeleton-pulse 1.5s ease-in-out infinite;
        }

        .skeleton-btn {
          height: 48px;
          width: 100%;
          border-radius: 9999px;
          animation: skeleton-pulse 1.5s ease-in-out infinite;
        }
      `}</style>

      <Hero setTab={setTab} />
      <Philosophy />
      
      <div id="menu-section">
        <MenuHeader />
        <main className="menu-main-section">
          {/* Product grid */}
          {loading ? (
            <ul className="cake-grid" aria-label="Loading cakes">
              {Array.from({ length: 9 }).map((_, i) => (
                <li key={i} className="skeleton-card">
                  <div className="skeleton-image" />
                  <div className="skeleton-info">
                    <div className="skeleton-title" />
                    <div className="skeleton-desc-line" />
                    <div className="skeleton-desc-line short" />
                    <div className="skeleton-weight-row">
                      <div className="skeleton-weight-pill" />
                      <div className="skeleton-weight-pill" />
                    </div>
                    <div className="skeleton-action-row">
                      <div className="skeleton-price" />
                      <div className="skeleton-qty" />
                    </div>
                    <div className="skeleton-btn" />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="cake-grid">
              {filteredCakes.map(cake => (
                <li key={cake.id}>
                  <CakeCard cake={cake} onAddToCart={addToCart} />
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
      <CustomOrder />
    </>
  );
};
