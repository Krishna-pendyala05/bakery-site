import React from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

interface HeroProps {
  setTab: (tab: 'cakes' | 'checkout' | 'login') => void;
}

export const Hero: React.FC<HeroProps> = ({ setTab }) => {
  const { cartCount } = useCart();
  const { user } = useAuth();

  return (
    <section aria-label="Hero">
      {/* Background video */}
      <video
        src="/hero-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />

      {/* Hero nav */}
      <nav>
        <button onClick={() => setTab('cakes')}>Menu</button>
        <button onClick={() => setTab('cakes')}>Custom</button>
        <button onClick={() => setTab('cakes')}>About Us</button>
        <button onClick={() => setTab('checkout')}>
          Cart {cartCount > 0 && `(${cartCount})`}
        </button>
        <button onClick={() => setTab('login')}>
          {user ? user.mobile : 'Login'}
        </button>
      </nav>

      {/* Hero content */}
      <div>
        <img src="/blob.png" alt="Artisan cake centerpiece" />
        <img src="/Hearts.png" alt="Decorative hearts" />
      </div>

      {/* Hero taglines */}
      <div>
        <h1>Every Slice Tells a Story</h1>
        <p>Baked with Love. Made to make Memories.</p>
      </div>
    </section>
  );
};
