import React, { useState, useRef } from 'react';
import type { Cake } from '../hooks/useCart';

interface CakeCardProps {
  cake: Cake;
  onAddToCart: (cake: Cake, weight: '500g' | '1kg', price: number, quantity: number) => void;
}

export const CakeCard: React.FC<CakeCardProps> = ({ cake, onAddToCart }) => {
  const [selectedWeight, setSelectedWeight] = useState<'500g' | '1kg'>('500g');
  const [quantity, setQuantity] = useState<number>(1);
  const [minusParticles, setMinusParticles] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const [plusParticles, setPlusParticles] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const addToCartBtnRef = useRef<HTMLButtonElement>(null);

  // Track exact mouse-entry point so the radial ripple originates there.
  // Also compute the exact diameter needed to FULLY cover the button from that point
  // (= 2 × distance to the farthest corner).
  const handleAddToCartMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = addToCartBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Distance to each of the 4 corners — take the largest
    const dx = Math.max(x, rect.width - x);
    const dy = Math.max(y, rect.height - y);
    const diameter = Math.ceil(Math.sqrt(dx * dx + dy * dy)) * 2;
    btn.style.setProperty('--ripple-x', `${x}px`);
    btn.style.setProperty('--ripple-y', `${y}px`);
    btn.style.setProperty('--ripple-size', `${diameter}px`);
  };

  // On mouse leave: snap the ripple origin to the EXIT point so the
  // collapsing circle retreats toward where the mouse left the button.
  const handleAddToCartMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = addToCartBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    btn.style.setProperty('--ripple-x', `${e.clientX - rect.left}px`);
    btn.style.setProperty('--ripple-y', `${e.clientY - rect.top}px`);
  };

  // INR pricing calculation helper:
  // USD price * 30 for 500g, * 55 for 1kg
  const price500g = Math.round(cake.price * 30);
  const price1kg = Math.round(cake.price * 55);
  const currentPrice = selectedWeight === '500g' ? price500g : price1kg;

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
    
    // Spawn 6 pink particles
    const newParticles = Array.from({ length: 6 }).map((_, i) => {
      const angle = (Math.PI / 4) + Math.random() * (Math.PI / 2); // angle between 45 and 135 degrees (upwards)
      const distance = 16 + Math.random() * 32;
      return {
        id: Date.now() + i + Math.random(),
        x: Math.cos(angle) * distance,
        y: -10 - Math.sin(angle) * distance,
        size: 3 + Math.random() * 5,
      };
    });
    setPlusParticles(prev => [...prev, ...newParticles]);
    
    setTimeout(() => {
      setPlusParticles(prev => prev.filter(p => !newParticles.find(n => n.id === p.id)));
    }, 600);
  };

  const handleDecrement = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    
    if (quantity > 1) {
      // Spawn 6 teal particles
      const newParticles = Array.from({ length: 6 }).map((_, i) => {
        const angle = (Math.PI / 4) + Math.random() * (Math.PI / 2); // angle between 45 and 135 degrees (upwards)
        const distance = 16 + Math.random() * 32;
        return {
          id: Date.now() + i + Math.random(),
          x: Math.cos(angle) * distance,
          y: -10 - Math.sin(angle) * distance,
          size: 3 + Math.random() * 5,
        };
      });
      setMinusParticles(prev => [...prev, ...newParticles]);
      
      setTimeout(() => {
        setMinusParticles(prev => prev.filter(p => !newParticles.find(n => n.id === p.id)));
      }, 600);
    }
  };

  const handleAdd = () => {
    onAddToCart(cake, selectedWeight, currentPrice, quantity);
    // Reset quantity back to 1 after adding to cart
    setQuantity(1);
  };

  return (
    <>
      <style>{`
        .cake-card {
          display: flex;
          flex-direction: column;
          background: transparent;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          width: 100%;
          max-width: 380px;
          margin: 0 auto;
        }

        /* ── Image ───────────────────────────────────────────────── */
        .cake-card-image-wrapper {
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          border-radius: 36px; /* High round corners matching the screenshot */
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
          background-color: #ECEBE6;
        }

        .cake-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .cake-card-image-wrapper:hover .cake-card-image {
          transform: scale(1.03);
        }

        /* ── Info & Title ────────────────────────────────────────── */
        .cake-card-info {
          padding: 16px 4px 8px;
        }

        .cake-card-title {
          font-family: var(--font-logo), 'Jaro', sans-serif;
          font-size: clamp(1.2rem, 2.5vw, 1.45rem);
          font-weight: 400; /* Jaro usually looks best around 400 since it is inherently a blocky display font */
          color: var(--color-ink);
          text-transform: uppercase; /* Uppercase title matching screenshot */
          margin: 0 0 10px;
          line-height: 1.1;
          letter-spacing: 0.02em;
        }

        .cake-card-description {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem;
          font-weight: 500;
          color: var(--color-ink);
          line-height: 1.4;
          margin: 0 0 14px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          height: 3em; /* stable height for grid alignment */
        }

        /* ── Weight Selector ────────────────────────────────────── */
        .cake-card-weight-selector {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
        }

        .weight-option-btn {
          min-width: 72px;
          text-align: center;
          padding: 6px 12px;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 700;
          border: 1.5px solid var(--color-border);
          color: var(--color-ink-muted);
          cursor: pointer;
          background: #FFFFFF;
          transition: all 0.2s ease;
        }

        .weight-option-btn:hover {
          background-color: var(--color-hover-overlay);
          border-color: var(--color-ink-muted);
        }

        .weight-option-btn.active {
          background-color: var(--color-ink);
          border-color: var(--color-ink);
          color: #FFFFFF;
        }

        /* ── Pricing & Quantity Row ────────────────────────────── */
        .cake-card-action-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
          min-height: 44px;
        }

        .cake-card-price {
          font-family: var(--font-logo), 'Jaro', sans-serif;
          font-size: clamp(1.2rem, 2.2vw, 1.45rem);
          font-weight: 400;
          color: var(--color-ink);
          letter-spacing: 0.02em;
        }

        .cake-card-quantity-control {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        @keyframes bubble-up {
          0% {
            transform: translate(-50%, -50%) scale(0.6);
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0);
            opacity: 0;
          }
        }

        .particle {
          position: absolute;
          top: 50%;
          left: 50%;
          width: var(--size);
          height: var(--size);
          border-radius: 50%;
          background-color: var(--color);
          pointer-events: none;
          z-index: 10;
          animation: bubble-up 0.5s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }

        .quantity-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          position: relative;
          cursor: pointer;
          border: none;
          transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.22s ease,
                      border-radius 0.22s cubic-bezier(0.34, 1.56, 0.64, 1),
                      opacity 0.15s ease;
          user-select: none;
        }

        /* ── Hover: scale-up + glow + bitten-circle (border-radius morph) ── */
        .quantity-btn.minus:hover {
          transform: scale(1.12);
          box-shadow: 0 0 0 4px rgba(20, 124, 152, 0.22),
                      0 4px 14px rgba(20, 124, 152, 0.35);
          /* Asymmetric border-radius creates a 'bitten top-right' look */
          border-radius: 50% 30% 50% 50% / 50% 30% 50% 50%;
        }

        .quantity-btn.plus:hover {
          transform: scale(1.12);
          box-shadow: 0 0 0 4px rgba(255, 167, 238, 0.30),
                      0 4px 14px rgba(255, 167, 238, 0.45);
          /* Asymmetric border-radius creates a 'bitten bottom-left' look */
          border-radius: 50% 50% 50% 28% / 50% 50% 50% 28%;
        }

        .quantity-btn::before,
        .quantity-btn::after {
          content: '';
          position: absolute;
          background-color: currentColor;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 99px;
        }

        /* Minus: single horizontal line */
        .quantity-btn.minus::before {
          width: 12px;
          height: 2px;
        }
        .quantity-btn.minus::after {
          display: none;
        }

        /* Plus: one horizontal and one vertical line */
        .quantity-btn.plus::before {
          width: 12px;
          height: 2px;
        }
        .quantity-btn.plus::after {
          width: 2px;
          height: 12px;
        }

        .quantity-btn:active {
          transform: scale(0.95);
          border-radius: 50%; /* snap back to circle on press */
        }

        /* Teal Minus Button */
        .quantity-btn.minus {
          background-color: #147c98;
          color: #FFFFFF;
        }

        /* Pink Plus Button */
        .quantity-btn.plus {
          background-color: #ffa7ee;
          color: #112229;
        }

        .quantity-value {
          font-family: var(--font-logo), 'Jaro', sans-serif;
          font-size: 1.35rem;
          font-weight: 400;
          color: var(--color-ink);
          min-width: 14px;
          text-align: center;
        }

        /* ── Add to Cart Button ──────────────────────────────────── */
        .add-to-cart-btn {
          width: 100%;
          padding: 14px 24px;
          border-radius: 9999px;
          background-color: #ffa7ee;
          color: #112229;
          font-family: var(--font-logo), 'Jaro', sans-serif;
          font-size: 1.1rem;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          border: 2px solid #ffa7ee; /* same as fill — invisible at rest, revealed on hover */
          cursor: pointer;
          position: relative;
          overflow: hidden;          /* clips the expanding circle to pill shape */
          isolation: isolate;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* ── Radial fill: the circle that grows from mouse entry point ── */
        .add-to-cart-btn::before {
          content: '';
          position: absolute;
          /* anchored to the exact mouse-entry coordinate via JS */
          top:  var(--ripple-y, 50%);
          left: var(--ripple-x, 50%);
          width: 0;
          height: 0;
          border-radius: 50%;
          /* Page bg color — what the button looks like "unfilled" */
          background-color: #FAF9F5;
          transform: translate(-50%, -50%);
          /* Grows on hover, collapses on mouse-leave */
          transition: width 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      height 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          pointer-events: none;
          z-index: 0;
        }

        /* Expand to exactly cover the button — size computed dynamically in JS */
        .add-to-cart-btn:hover::before {
          width: var(--ripple-size, 1000px);
          height: var(--ripple-size, 1000px);
        }

        /* Text floats above the expanding circle */
        .add-to-cart-btn-text {
          position: relative;
          z-index: 1;
        }

        .add-to-cart-btn:active {
          transform: scale(0.97);
        }
      `}</style>

      <div className="cake-card">
        <div className="cake-card-image-wrapper">
          <img src={cake.imageUrl} alt={cake.name} className="cake-card-image" loading="lazy" />
        </div>

        <div className="cake-card-info">
          <h3 className="cake-card-title">{cake.name}</h3>
          <p className="cake-card-description">{cake.description}</p>

          {/* Weight Option Pills */}
          <div className="cake-card-weight-selector">
            <button
              className={`weight-option-btn ${selectedWeight === '500g' ? 'active' : ''}`}
              onClick={() => setSelectedWeight('500g')}
              aria-label="Select 500 grams weight"
            >
              500g
            </button>
            <button
              className={`weight-option-btn ${selectedWeight === '1kg' ? 'active' : ''}`}
              onClick={() => setSelectedWeight('1kg')}
              aria-label="Select 1 kilogram weight"
            >
              1kg
            </button>
          </div>

          {/* Pricing & Quantity row */}
          <div className="cake-card-action-row">
            <div className="cake-card-price">
              FROM ₹{currentPrice}
            </div>

            <div className="cake-card-quantity-control">
              <button 
                className="quantity-btn minus" 
                onClick={handleDecrement}
                aria-label="Decrease quantity"
              >
                {minusParticles.map(p => (
                  <span
                    key={p.id}
                    className="particle"
                    style={{
                      '--tx': `${p.x}px`,
                      '--ty': `${p.y}px`,
                      '--size': `${p.size}px`,
                      '--color': '#147c98',
                    } as React.CSSProperties}
                  />
                ))}
              </button>
              <span className="quantity-value">{quantity}</span>
              <button 
                className="quantity-btn plus" 
                onClick={handleIncrement}
                aria-label="Increase quantity"
              >
                {plusParticles.map(p => (
                  <span
                    key={p.id}
                    className="particle"
                    style={{
                      '--tx': `${p.x}px`,
                      '--ty': `${p.y}px`,
                      '--size': `${p.size}px`,
                      '--color': '#ffa7ee',
                    } as React.CSSProperties}
                  />
                ))}
              </button>
            </div>
          </div>

          {/* Add to Cart button */}
          <button
            ref={addToCartBtnRef}
            className="add-to-cart-btn"
            onClick={handleAdd}
            onMouseEnter={handleAddToCartMouseEnter}
            onMouseLeave={handleAddToCartMouseLeave}
          >
            <span className="add-to-cart-btn-text">Add to Cart</span>
          </button>
        </div>
      </div>
    </>
  );
};
