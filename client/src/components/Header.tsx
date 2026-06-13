import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, CircleUser, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { ProfileDrawer } from './ProfileDrawer';

/* ── Prop types ──────────────────────────────────────────── */
interface HeaderProps {
  currentTab: 'cakes' | 'checkout' | 'login';
  setTab: (tab: 'cakes' | 'checkout' | 'login') => void;
}

/* ── NAV ITEMS ───────────────────────────────────────────── */
const NAV_LINKS: { label: string; tab: 'cakes' | 'checkout' | 'login' }[] = [
  { label: 'Menu',         tab: 'cakes'    },
  { label: 'Custom Order', tab: 'cakes'    },
  { label: 'Our Story',    tab: 'cakes'    }, // placeholder — wire to page later
];

/* ── Component ───────────────────────────────────────────── */
export const Header: React.FC<HeaderProps> = ({ currentTab, setTab }) => {
  const { user, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Get initials from user name
  const getInitials = (name?: string) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  /* Scroll Spy and Active Label Synchronizer */
  useEffect(() => {
    if (currentTab === 'checkout') {
      setActiveLabel('Custom Order');
      return;
    }
    if (currentTab === 'login') {
      setActiveLabel(null);
      return;
    }

    let isFirstCall = true;

    const handleScroll = () => {
      if ((window as any).isProgrammaticScroll) {
        return;
      }

      const menuSection = document.getElementById('menu-section');
      const customSection = document.getElementById('custom-order-section');
      const customContainer = document.getElementById('custom-order-container');
      const navHeight = 80;

      if (customSection && customContainer) {
        const customRect = customSection.getBoundingClientRect();
        if (customRect.top <= navHeight + 120 && customRect.bottom >= navHeight) {
          const containerRect = customContainer.getBoundingClientRect();
          const startY = containerRect.top;
          const scrollRange = window.innerHeight * 1.3;
          const scrollOffset = -startY;
          const deadZone = 200;

          let progress = 0;
          if (scrollOffset > deadZone) {
            progress = Math.min((scrollOffset - deadZone) / (scrollRange - deadZone), 1);
          }

          if (progress >= 0.5) {
            setActiveLabel('Our Story');
            if (window.location.hash !== '#our-story') {
              window.history.replaceState(null, '', '#our-story');
            }
          } else {
            setActiveLabel('Custom Order');
            if (window.location.hash !== '#custom-order') {
              window.history.replaceState(null, '', '#custom-order');
            }
          }
          return;
        }
      }

      if (menuSection) {
        const menuRect = menuSection.getBoundingClientRect();
        if (menuRect.top <= navHeight + 80 && menuRect.bottom >= navHeight + 80) {
          setActiveLabel('Menu');
          if (window.location.hash !== '#menu') {
            window.history.replaceState(null, '', '#menu');
          }
          return;
        }
      }

      setActiveLabel(null);
      if (!isFirstCall) {
        if (window.location.hash === '#menu' || window.location.hash === '#custom-order' || window.location.hash === '#our-story') {
          window.history.replaceState(null, '', '#');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    isFirstCall = false;

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentTab]);

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

  /* Helper for nice and smooth easing scroll (easeInOutCubic curve) */
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

  /* Navigate — handles smooth scrolling to Menu and URL updating */
  const navigateNav = (label: string, tab: 'cakes' | 'checkout' | 'login') => {
    setTab(tab);
    setMobileOpen(false);

    if (label === 'Menu') {
      if (currentTab === 'cakes') {
        const menuSection = document.getElementById('menu-section');
        if (menuSection) {
          const navHeight = 80;
          const targetY = menuSection.getBoundingClientRect().top + window.scrollY - navHeight;
          customSmoothScroll(targetY, 1600); // majestic 1.6s scroll
        }
      } else {
        window.location.hash = 'menu';
      }
    } else if (label === 'Custom Order') {
      if (currentTab === 'cakes') {
        const customContainer = document.getElementById('custom-order-container');
        if (customContainer) {
          const navHeight = 80;
          const targetY = customContainer.getBoundingClientRect().top + window.scrollY - navHeight;
          customSmoothScroll(targetY, 1600); // majestic 1.6s scroll
        }
      } else {
        window.location.hash = 'custom-order';
      }
    } else if (label === 'Our Story') {
      if (currentTab === 'cakes') {
        const customContainer = document.getElementById('custom-order-container');
        if (customContainer) {
          const navHeight = 80;
          const containerRect = customContainer.getBoundingClientRect();
          const scrollRange = window.innerHeight * 1.3;
          const targetY = containerRect.top + window.scrollY + scrollRange - navHeight + 20;
          customSmoothScroll(targetY, 1600);
        }
      } else {
        window.location.hash = 'our-story';
      }
    } else {
      setActiveLabel(label);
      window.location.hash = '';
    }
  };

  /* Icon buttons (cart, login) navigate without setting an active nav label */
  const navigateIcon = (tab: 'cakes' | 'checkout' | 'login') => {
    setTab(tab);
    setMobileOpen(false);
    window.location.hash = '';
    if (tab === 'cakes') {
      customSmoothScroll(0, 1600);
    }
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
        .nav-link:focus {
          outline: none;
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
        .nav-icon-btn:focus {
          outline: none;
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

        /* ── Logged-in Initials Avatar ──────────────────────── */
        .nav-avatar-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: var(--radius-full);
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          transition: transform var(--transition-fast);
        }
        .nav-avatar-btn:hover { transform: scale(1.08); }
        .nav-avatar-btn:focus { outline: none; }

        .nav-avatar-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--nav-bg, #E8D96B);
          border: 2.5px solid var(--color-ink);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-logo);
          font-size: 1rem;
          letter-spacing: 0.03em;
          color: var(--color-ink);
          position: relative;
          overflow: visible;
          animation: avatar-pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes avatar-pop-in {
          0% { transform: scale(0.3) rotate(-15deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        /* Spinning ring around avatar */
        .nav-avatar-ring {
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          border: 2px dashed rgba(26,26,26,0.25);
          animation: avatar-ring-spin 8s linear infinite;
          pointer-events: none;
        }
        @keyframes avatar-ring-spin {
          to { transform: rotate(360deg); }
        }
        /* Pulse glow on hover */
        .nav-avatar-btn:hover .nav-avatar-circle {
          box-shadow: 0 0 0 4px rgba(26,26,26,0.10);
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
          .nav-hamburger:focus { outline: none; }
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
              onClick={() => setIsCartOpen(true)}
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
                className="nav-avatar-btn"
                onClick={() => setIsProfileOpen(true)}
                aria-label={`Profile — ${user.name || user.mobile}`}
                title={`${user.name || user.mobile} — View Profile`}
              >
                <div className="nav-avatar-circle">
                  {getInitials(user.name)}
                  <div className="nav-avatar-ring" aria-hidden="true" />
                </div>
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

      {/* ─── Profile Drawer ─────────────────────────────────── */}
      <ProfileDrawer 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)}
        onEditProfile={() => navigateIcon('login')}
        onGoToOrders={() => navigateIcon('checkout')}
      />
    </>
  );
};
