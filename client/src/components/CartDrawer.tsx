import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useCart } from '../hooks/useCart';

interface CartDrawerProps {
  setTab: (tab: 'cakes' | 'checkout' | 'login') => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ setTab }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    updateWeight,
    cartTotal,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);
  const checkoutBtnRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key + lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    if (isCartOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isCartOpen, setIsCartOpen]);

  // Ripple effect for Checkout button (mirrors Add to Cart)
  const handleCheckoutMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = checkoutBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = Math.max(x, rect.width - x);
    const dy = Math.max(y, rect.height - y);
    const diameter = Math.ceil(Math.sqrt(dx * dx + dy * dy)) * 2;
    btn.style.setProperty('--ripple-x', `${x}px`);
    btn.style.setProperty('--ripple-y', `${y}px`);
    btn.style.setProperty('--ripple-size', `${diameter}px`);
  };

  const handleCheckoutMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = checkoutBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    btn.style.setProperty('--ripple-x', `${e.clientX - rect.left}px`);
    btn.style.setProperty('--ripple-y', `${e.clientY - rect.top}px`);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
      setIsCartOpen(false);
    }
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setTab('checkout');
  };

  return (
    <>
      <style>{`
        /* ── Backdrop ───────────────────────────────────────────── */
        .cart-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(17, 34, 41, 0.40);
          backdrop-filter: blur(4px);
          z-index: 999;
          opacity: 0;
          pointer-events: none;
          transition: opacity 750ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .cart-backdrop.open {
          opacity: 1;
          pointer-events: auto;
        }

        /* ── Drawer ─────────────────────────────────────────────── */
        .cart-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 38vw;
          min-width: 400px;
          max-width: 560px;
          background: #FFFFFF;
          box-shadow: -12px 0 40px rgba(0, 0, 0, 0.10);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 750ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .cart-drawer.open {
          transform: translateX(0);
        }

        /* ── Header ─────────────────────────────────────────────── */
        .cart-drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 28px 32px 16px;
        }
        .cart-drawer-title {
          font-family: var(--font-logo), 'Jaro', sans-serif;
          font-size: 2rem;
          font-weight: 400;
          letter-spacing: 0.06em;
          color: var(--color-ink);
          margin: 0;
          text-transform: uppercase;
        }
        .cart-drawer-close-btn {
          width: 36px;
          height: 36px;
          border: none;
          background: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-ink);
          border-radius: 50%;
          transition: background 0.2s, transform 0.2s;
        }
        .cart-drawer-close-btn:hover {
          background: rgba(0,0,0,0.06);
          transform: scale(1.08);
        }
        .cart-drawer-close-btn:focus { outline: none; }

        /* ── Teal hairline divider (matches Bernice design) ─────── */
        .cart-drawer-divider {
          height: 2px;
          background: #147c98;
          margin: 0 32px;
        }

        /* ── Scrollable body ─────────────────────────────────────── */
        .cart-drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 28px 32px;
        }
        .cart-empty-msg {
          text-align: center;
          font-family: var(--font-upright);
          font-size: 1.2rem;
          color: var(--color-ink-muted);
          margin-top: 64px;
        }

        /* ── Item row ───────────────────────────────────────────── */
        .cart-item {
          display: flex;
          gap: 20px;
          align-items: stretch;
          padding-bottom: 28px;
          margin-bottom: 28px;
          border-bottom: 1px solid #EBEBEB;
        }
        .cart-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        .cart-item-img-wrap {
          width: 110px;
          flex-shrink: 0;
          align-self: stretch; /* makes this div fill the full row height */
          border-radius: 14px;
          overflow: hidden;
          border: 1.5px solid #112229;
          box-sizing: border-box;
        }
        .cart-item-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .cart-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        /* Name – matches cake card title exactly */
        .cart-item-name {
          font-family: var(--font-logo), 'Jaro', sans-serif;
          font-size: 1.2rem;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--color-ink);
          margin: 0;
          line-height: 1.15;
        }

        /* Weight pill selector */
        .cart-weight-selector {
          display: flex;
          gap: 8px;
          margin: 6px 0 4px;
        }
        .cart-weight-pill {
          min-width: 60px;
          text-align: center;
          padding: 4px 12px;
          border-radius: 9999px;
          font-family: var(--font-logo), 'Jaro', sans-serif;
          font-size: 0.82rem;
          font-weight: 400;
          letter-spacing: 0.05em;
          border: 1.5px solid #D0D0D0;
          color: #888;
          cursor: pointer;
          background: #FFFFFF;
          transition: all 0.18s ease;
        }
        .cart-weight-pill:focus { outline: none; }
        .cart-weight-pill:hover {
          border-color: #112229;
          color: #112229;
        }
        .cart-weight-pill.active {
          background: #112229;
          border-color: #112229;
          color: #FFFFFF;
        }

        /* Price — Jaro font, smaller */
        .cart-item-price {
          font-family: var(--font-logo), 'Jaro', sans-serif;
          font-size: 1.05rem;
          font-weight: 400;
          color: var(--color-ink);
          letter-spacing: 0.03em;
          margin-top: 2px;
        }

        /* ── Controls row ───────────────────────────────────────── */
        .cart-controls-row {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: 12px;
        }

        /* Qty buttons — IDENTICAL to CakeCard quantity-btn */
        .cart-qty-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition:
            transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.22s ease,
            border-radius 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
          flex-shrink: 0;
        }
        .cart-qty-btn:focus { outline: none; }
        .cart-qty-btn:active {
          transform: scale(0.95) !important;
          border-radius: 50% !important;
        }

        /* Minus = teal */
        .cart-qty-btn.minus {
          background: #147c98;
          color: #FFFFFF;
        }
        .cart-qty-btn.minus::before {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 12px; height: 2px;
          background: currentColor;
          border-radius: 99px;
        }
        .cart-qty-btn.minus:hover {
          transform: scale(1.12);
          box-shadow: 0 0 0 4px rgba(20, 124, 152, 0.22), 0 4px 14px rgba(20, 124, 152, 0.35);
          border-radius: 50% 30% 50% 50% / 50% 30% 50% 50%;
        }

        /* Plus = pink */
        .cart-qty-btn.plus {
          background: #ffa7ee;
          color: #112229;
        }
        .cart-qty-btn.plus::before {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 12px; height: 2px;
          background: currentColor;
          border-radius: 99px;
        }
        .cart-qty-btn.plus::after {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 2px; height: 12px;
          background: currentColor;
          border-radius: 99px;
        }
        .cart-qty-btn.plus:hover {
          transform: scale(1.12);
          box-shadow: 0 0 0 4px rgba(255, 167, 238, 0.30), 0 4px 14px rgba(255, 167, 238, 0.45);
          border-radius: 50% 50% 50% 28% / 50% 50% 50% 28%;
        }

        /* Qty number */
        .cart-qty-value {
          font-family: var(--font-logo), 'Jaro', sans-serif;
          font-size: 1.35rem;
          font-weight: 400;
          color: var(--color-ink);
          min-width: 18px;
          text-align: center;
        }

        /* Remove link */
        .cart-remove-btn {
          background: none;
          border: none;
          font-family: var(--font-logo), 'Jaro', sans-serif;
          font-size: 1rem;
          font-weight: 400;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--color-ink);
          cursor: pointer;
          margin-left: auto;
          padding: 0;
          transition: opacity 0.18s;
        }
        .cart-remove-btn:hover { opacity: 0.55; }
        .cart-remove-btn:focus { outline: none; }

        /* ── Footer ─────────────────────────────────────────────── */
        .cart-drawer-footer {
          padding: 20px 32px 28px;
          background: #FFFFFF;
        }

        /* Checkout button — EXACT same as Add to Cart */
        .cart-checkout-btn {
          width: 100%;
          padding: 16px 24px;
          border-radius: 9999px;
          background-color: #ffa7ee;
          color: #112229;
          font-family: var(--font-logo), 'Jaro', sans-serif;
          font-size: 1.2rem;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          border: 2px solid #ffa7ee;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          isolation: isolate;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* Same radial fill ripple as Add to Cart */
        .cart-checkout-btn::before {
          content: '';
          position: absolute;
          top: var(--ripple-y, 50%);
          left: var(--ripple-x, 50%);
          width: 0;
          height: 0;
          border-radius: 50%;
          background-color: #FAF9F5;
          transform: translate(-50%, -50%);
          transition:
            width 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            height 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          pointer-events: none;
          z-index: 0;
        }
        .cart-checkout-btn:hover::before {
          width: var(--ripple-size, 1000px);
          height: var(--ripple-size, 1000px);
        }
        .cart-checkout-btn-text {
          position: relative;
          z-index: 1;
        }
        .cart-checkout-btn:active { transform: scale(0.97); }
        .cart-checkout-btn:focus { outline: none; }
        .cart-checkout-btn:disabled {
          background: #E0E0E0;
          border-color: #E0E0E0;
          color: #9E9E9E;
          cursor: not-allowed;
          transform: none;
        }
        .cart-checkout-btn:disabled::before { display: none; }
      `}</style>

      {/* Backdrop */}
      <div
        className={`cart-backdrop${isCartOpen ? ' open' : ''}`}
        onClick={handleBackdropClick}
      />

      {/* Drawer */}
      <div className={`cart-drawer${isCartOpen ? ' open' : ''}`} ref={drawerRef}>

        {/* Header */}
        <div className="cart-drawer-header">
          <h2 className="cart-drawer-title">Cart</h2>
          <button
            className="cart-drawer-close-btn"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            <X size={22} strokeWidth={2.2} />
          </button>
        </div>

        {/* Teal divider */}
        <div className="cart-drawer-divider" />

        {/* Item list */}
        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <p className="cart-empty-msg">Your sweet cart is empty.</p>
          ) : (
            cart.map(item => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-img-wrap">
                  <img
                    className="cart-item-img"
                    src={item.cake.imageUrl}
                    alt={item.cake.name}
                  />
                </div>
                <div className="cart-item-info">
                  <h4 className="cart-item-name">{item.cake.name}</h4>

                  {/* Weight switcher pills */}
                  <div className="cart-weight-selector">
                    {(['500g', '1kg'] as const).map(w => (
                      <button
                        key={w}
                        className={`cart-weight-pill${item.weight === w ? ' active' : ''}`}
                        onClick={() => updateWeight(item.id, w)}
                        aria-label={`Switch to ${w}`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>

                  <span className="cart-item-price">₹ {item.price}</span>

                  {/* Controls */}
                  <div className="cart-controls-row">
                    <button
                      className="cart-qty-btn minus"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    />
                    <span className="cart-qty-value">{item.quantity}</span>
                    <button
                      className="cart-qty-btn plus"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    />
                    <button
                      className="cart-remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="cart-drawer-footer">
          <button
            ref={checkoutBtnRef}
            className="cart-checkout-btn"
            disabled={cart.length === 0}
            onClick={handleCheckoutClick}
            onMouseEnter={handleCheckoutMouseEnter}
            onMouseLeave={handleCheckoutMouseLeave}
          >
            <span className="cart-checkout-btn-text">
              Checkout&nbsp;•&nbsp;₹{cartTotal.toFixed(2)}
            </span>
          </button>
        </div>

      </div>
    </>
  );
};
