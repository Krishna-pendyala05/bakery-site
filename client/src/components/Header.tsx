import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, CircleUser, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

/* ── Prop types ──────────────────────────────────────────── */
interface HeaderProps {
  currentTab: 'cakes' | 'checkout' | 'login';
  setTab: (tab: 'cakes' | 'checkout' | 'login') => void;
}

/* ── NAV ITEMS ───────────────────────────────────────────── */
const NAV_LINKS: { label: string; tab: 'cakes' | 'checkout' | 'login' }[] = [
  { label: 'Menu',         tab: 'cakes'    },
  { label: 'Custom Order', tab: 'checkout' },
  { label: 'Our Story',    tab: 'cakes'    }, // placeholder — wire to page later
];

/* ── Component ───────────────────────────────────────────── */
export const Header: React.FC<HeaderProps> = ({ currentTab, setTab }) => {
  const { user, logout } = useAuth();
  const { cartCount }    = useCart();
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  /* Close drawer when clicking outside */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    if (mobileOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [mobileOpen]);

  /* Close drawer on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  /* Navigate — only nav-link clicks set the active label */
  const navigateNav = (label: string, tab: 'cakes' | 'checkout' | 'login') => {
    setActiveLabel(label);
    setTab(tab);
    setMobileOpen(false);
  };

  /* Icon buttons (cart, login) navigate without setting an active nav label */
  const navigateIcon = (tab: 'cakes' | 'checkout' | 'login') => {
    setTab(tab);
    setMobileOpen(false);
  };

  return (
    <>
      {/* ─── Scoped styles ─────────────────────────────────── */}
      <style>{`
        /* ── Shell ────────────────────────────────────────── */
        .nav-header {
          position: sticky;
          top: 0;
          z-index: 100;
          width: 100%;
          height: var(--nav-height);
          background: var(--nav-bg);
          border-bottom: 10px solid var(--color-bg);
          display: flex;
          align-items: center;
          padding: 0 var(--space-7);
        }

        /* inner layout: logo | center-links | icons */
        .nav-inner {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: var(--space-4);
        }

        /* ── Logo ─────────────────────────────────────────── */
        .nav-logo {
          font-family: var(--font-logo);
          font-size: 1.95rem;
          font-weight: 700;
          color: var(--color-ink);
          letter-spacing: -0.01em;
          cursor: pointer;
          user-select: none;
          transition: opacity var(--transition-fast);
          white-space: nowrap;
        }
        .nav-logo:hover { opacity: 0.8; }

        /* ── Desktop centre links ─────────────────────────── */
        .nav-links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-8);
        }

        .nav-link {
          font-family: var(--font-heading);
          font-size: 0.88rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink);
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-full);
          cursor: pointer;
          background: none;
          border: none;
          transition: background var(--transition-fast);
        }
        .nav-link:hover {
          background: var(--color-bg);
        }
        .nav-link[aria-current="true"] {
          background: var(--color-bg);
        }

        /* ── Icon group (desktop + shared) ───────────────── */
        .nav-icons {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .nav-icon-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: var(--radius-full);
          color: var(--color-ink);
          cursor: pointer;
          background: none;
          border: none;
          transition: background var(--transition-fast), transform var(--transition-fast);
        }
        .nav-icon-btn:hover {
          background: var(--color-hover-overlay);
          transform: scale(1.05);
        }
        .nav-icon-btn svg {
          width: var(--nav-icon-size);
          height: var(--nav-icon-size);
          stroke-width: 1.6;
        }

        /* Cart badge */
        .nav-cart-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          border-radius: var(--radius-full);
          background: var(--color-ink);
          color: var(--color-brand);
          font-family: var(--font-logo);
          font-size: 0.68rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          pointer-events: none;
        }

        /* ── Mobile hamburger ─────────────────────────────── */
        .nav-hamburger { display: none; }

        /* ── Mobile drawer ────────────────────────────────── */
        .nav-drawer {
          display: none;
        }

        /* ── Responsive breakpoint ────────────────────────── */
        @media (max-width: 700px) {
          .nav-header { padding: 0 var(--space-4); }

          .nav-links { display: none; }

          .nav-hamburger {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: var(--radius-full);
            background: none;
            border: none;
            color: var(--color-ink);
            cursor: pointer;
            transition: background var(--transition-fast);
          }
          .nav-hamburger:hover { background: var(--color-hover-overlay); }
          .nav-hamburger svg { width: var(--nav-icon-size); height: var(--nav-icon-size); stroke-width: 1.8; }

          /* Slide-down mobile drawer */
          .nav-drawer {
            display: block;
            position: fixed;
            top: var(--nav-height);
            left: 0;
            right: 0;
            z-index: 99;
            background: var(--nav-bg);
            overflow: hidden;
            max-height: 0;
            transition: max-height 300ms cubic-bezier(0.4, 0, 0.2, 1),
                        opacity 200ms ease;
            opacity: 0;
            border-bottom: 1.5px solid var(--color-hover-overlay);
          }
          .nav-drawer.open {
            max-height: 320px;
            opacity: 1;
          }

          .nav-drawer-inner {
            padding: var(--space-4) var(--space-4) var(--space-5);
            display: flex;
            flex-direction: column;
            gap: var(--space-2);
          }

          .nav-drawer-link {
            font-family: var(--font-heading);
            font-size: 1.05rem;
            font-weight: 500;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--color-ink);
            background: none;
            border: none;
            text-align: left;
            padding: var(--space-3) var(--space-2);
            border-radius: var(--radius-md);
            cursor: pointer;
            width: 100%;
            transition: background var(--transition-fast);
          }
          .nav-drawer-link:hover,
          .nav-drawer-link[aria-current="true"] {
            background: var(--color-hover-overlay);
          }

          .nav-drawer-divider {
            height: 1px;
            background: var(--color-hover-overlay);
            margin: var(--space-2) 0;
          }

          .nav-drawer-action {
            font-family: var(--font-heading);
            font-size: 0.88rem;
            letter-spacing: 0.06em;
            color: var(--color-ink-muted);
            text-align: left;
            padding: var(--space-2) var(--space-2);
            background: none;
            border: none;
            cursor: pointer;
            width: 100%;
          }
        }
      `}</style>

      {/* ─── Navbar ────────────────────────────────────────── */}
      <header className="nav-header" role="banner">
        <div className="nav-inner">

          {/* Logo */}
          <span
            className="nav-logo"
            onClick={() => navigateIcon('cakes')}
            role="link"
            aria-label="L'Étoile Sucrée — Home"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && navigateIcon('cakes')}
          >
            L'Étoile Sucrée
          </span>

          {/* Desktop centre nav */}
          <nav className="nav-links" aria-label="Primary navigation">
            {NAV_LINKS.map(({ label, tab }) => (
              <button
                key={label}
                className="nav-link"
                onClick={() => navigateNav(label, tab)}
                aria-current={activeLabel === label ? 'true' : undefined}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Icon strip */}
          <div className="nav-icons">
            {/* Cart */}
            <button
              id="nav-cart-btn"
              className="nav-icon-btn"
              onClick={() => navigateIcon('checkout')}
              aria-label={`Cart — ${cartCount} item${cartCount !== 1 ? 's' : ''}`}
            >
              <ShoppingBag />
              {cartCount > 0 && (
                <span className="nav-cart-badge" aria-hidden="true">{cartCount}</span>
              )}
            </button>

            {/* Account / Login */}
            {user ? (
              <button
                id="nav-account-btn"
                className="nav-icon-btn"
                onClick={logout}
                aria-label={`Logged in as ${user.name || user.mobile} — click to log out`}
                title={`${user.name || user.mobile} — Log out`}
              >
                <CircleUser />
              </button>
            ) : (
              <button
                id="nav-login-btn"
                className="nav-icon-btn"
                onClick={() => navigateIcon('login')}
                aria-label="Log in"
              >
                <CircleUser />
              </button>
            )}

            {/* Hamburger (mobile only) */}
            <button
              id="nav-menu-btn"
              className="nav-hamburger"
              onClick={() => setMobileOpen(o => !o)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>

        </div>
      </header>

      {/* ─── Mobile drawer ─────────────────────────────────── */}
      <div
        ref={drawerRef}
        className={`nav-drawer${mobileOpen ? ' open' : ''}`}
        aria-hidden={!mobileOpen}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="nav-drawer-inner">
          {NAV_LINKS.map(({ label, tab }) => (
            <button
              key={label}
              className="nav-drawer-link"
              onClick={() => navigateNav(label, tab)}
              aria-current={activeLabel === label ? 'true' : undefined}
            >
              {label}
            </button>
          ))}

          <div className="nav-drawer-divider" role="separator" />

          {user ? (
            <>
              <span className="nav-drawer-action" style={{ pointerEvents: 'none' }}>
                {user.name || user.mobile}
              </span>
              <button className="nav-drawer-action" onClick={() => { logout(); setMobileOpen(false); }}>
                Log out
              </button>
            </>
          ) : (
            <button className="nav-drawer-action" onClick={() => navigateIcon('login')}>
              Log in
            </button>
          )}
        </div>
      </div>
    </>
  );
};
