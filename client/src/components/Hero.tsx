import React, { useEffect, useRef } from 'react';

interface HeroProps {
  setTab: (tab: 'cakes' | 'checkout' | 'login') => void;
}

export const Hero: React.FC<HeroProps> = ({ setTab }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const hero = heroRef.current;
    if (!container || !hero) return;

    let targetProgress = 0;
    let currentProgress = 0;
    let isAnimating = false;

    const updatePhysics = () => {
      const diff = targetProgress - currentProgress;
      if (Math.abs(diff) < 0.0001) {
        currentProgress = targetProgress;
        isAnimating = false;
      } else {
        // Inertia lerping: target smoothly pulls current progress
        currentProgress += diff * 0.085;
        isAnimating = true;
      }

      // Sine wobble dampens dynamically to zero as progress reaches 1.0
      const wobble = Math.sin(currentProgress * Math.PI * 3.5) * 12 * (1 - currentProgress);

      // Keep edges highly rounded (90px down to 80px) during early/mid scroll, then quick wipe to 0px at the very end
      let radius = 0;
      if (currentProgress < 0.9) {
        radius = 90 - (currentProgress / 0.9) * 10;
      } else {
        radius = 80 * (1 - (currentProgress - 0.9) / 0.1);
      }

      hero.style.setProperty('--unzip-progress', currentProgress.toString());
      hero.style.setProperty('--heart-wobble', `${wobble}deg`);
      hero.style.setProperty('--ticker-radius', `${radius}px`);

      if (isAnimating) {
        requestAnimationFrame(updatePhysics);
      }
    };

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const containerHeight = rect.height;
      const viewportHeight = window.innerHeight;
      const scrollRange = containerHeight - viewportHeight;
      
      // Calculate progress relative to sticky container viewport top
      const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 70;
      const startY = rect.top - navHeight;
      
      const progress = Math.min(Math.max(-startY / scrollRange, 0), 1);
      targetProgress = progress;

      if (!isAnimating) {
        isAnimating = true;
        requestAnimationFrame(updatePhysics);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial target evaluation

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /* Smooth scroll to menu section — same easing as nav bar Menu link */
  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu-section');
    if (!menuSection) return;

    const navHeight = 80;
    const targetY = menuSection.getBoundingClientRect().top + window.scrollY - navHeight;
    const startY = window.scrollY || window.pageYOffset;
    const difference = targetY - startY;
    const duration = 1600;
    const startTime = performance.now();

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + difference * easeInOutCubic(progress));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
    window.history.replaceState(null, '', '#menu');
  };

  /* Smooth scroll to custom order section — same easing */
  const scrollToCustomOrder = () => {
    const customSection = document.getElementById('custom-order-section');
    if (!customSection) return;

    const navHeight = 80;
    const targetY = customSection.getBoundingClientRect().top + window.scrollY - navHeight;
    const startY = window.scrollY || window.pageYOffset;
    const difference = targetY - startY;
    const duration = 1600;
    const startTime = performance.now();

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + difference * easeInOutCubic(progress));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
    window.history.replaceState(null, '', '#custom-order');
  };

  return (
    <>
      <style>{`
        /* ── Scroll Pinned Container ───────────────────────── */
        .hero-scroll-container {
          position: relative;
          height: 230vh; /* creates 130vh of pinning scroll space for a slower, premium unzip */
          background: var(--color-bg);
        }

        /* ── Hero section wrapper ──────────────────────────── */
        .hero-section {
          position: sticky;
          top: var(--nav-height);
          display: flex;
          flex-direction: row;
          gap: 10px;
          background: var(--color-bg);
          width: 100%;
          height: calc(100vh - var(--nav-height));
          min-height: 520px;
          border-bottom: 10px solid var(--color-bg);
          overflow: hidden;
          
          /* Unzip variables */
          --unzip-progress: 0;
          --heart-wobble: 0deg;
          --peel-width: 160px;
        }

        /* ── REVEAL BACKGROUND ────────────────────────────────── */
        .hero-unzip-reveal-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, #FFF8FA 0%, #FFFFFF 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 0;
          pointer-events: none;
        }

        .reveal-text-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-top: -30vh;
          opacity: var(--unzip-progress);
          transform: translateY(calc(60px - var(--unzip-progress) * 60px)) scale(calc(0.92 + 0.08 * var(--unzip-progress)));
          transition: opacity 50ms linear, transform 50ms linear;
        }

        .reveal-title {
          font-family: var(--font-logo);
          font-size: clamp(24px, 3.5vw, 42px);
          color: #7A5145; /* Consistent milk chocolate brown */
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin: 0;
        }

        .reveal-subtitle {
          font-family: var(--font-quote);
          font-size: clamp(16px, 2.2vw, 28px);
          font-style: italic;
          color: #7A5145; /* Consistent milk chocolate brown */
          margin: 0;
        }

        /* ── LEFT PANEL ──────────────────────────────────────── */
        .hero-left {
          position: relative;
          flex: 0 0 calc(50% - 5px);
          min-width: 0;
          height: 100%;
          overflow: hidden;
          isolation: isolate;               /* isolates stacking context to prevent video blend bugs */
          z-index: 2;
          
          /* Morph right edge into a vertical capsule as it slides away */
          border-radius: 0 calc(50px + 300px * var(--unzip-progress)) calc(50px + 300px * var(--unzip-progress)) 0;
          
          /* Slide out to the left */
          transform: translateX(calc(-50vw * var(--unzip-progress)));
          transition: border-radius 50ms linear, transform 50ms linear;
        }

        /* Video fills the left panel fully */
        .hero-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
          transform: scale(1.03);
          transform-origin: center;
          background: transparent;
        }

        /* Quote block — absolute at the top of the left panel */
        .hero-quote {
          position: absolute;
          top: 10%;
          left: 50%;
          transform: translate(-50%, 0) scale(calc(1 - 0.1 * var(--unzip-progress)));
          width: 85%;
          max-width: 500px;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: transform 50ms linear;
        }

        /* Outer wrapper — shrink-wraps to text width */
        .quote-content {
          display: flex;
          flex-direction: column;
          align-items: flex-end;   /* right-align both lines to match mockup */
          gap: 0.25em;             /* spacing between lines since line-height is 1.0 */
        }

        /* Each line is a positioned container so icons anchor to THAT line */
        .quote-line-1,
        .quote-line-2 {
          position: relative;
          display: block;          /* reliable height for absolute children */
          width: fit-content;      /* shrink-wraps to the text */
          white-space: nowrap;
        }

        .quote-text-line {
          font-family: var(--font-quote);
          font-size: clamp(18px, 2.2vw, 36px);
          font-weight: 400;
          color: var(--color-ink);
          line-height: 1.0;        /* 1.0 height matches capital letters and baseline closely */
          margin: 0;
          display: block;
          text-decoration: none;
        }

        /* Open quote (66) */
        .quote-open {
          position: absolute;
          right: 100%;            /* icon right = line-1 left */
          bottom: calc(100% - 0.22em); /* align icon bottom with top edge of capital E */
          margin-right: 10px;
          width: clamp(36px, 4vw, 64px);
          height: auto;
          display: block;
        }

        /* Close quote (99) */
        .quote-close {
          position: absolute;
          left: 100%;             /* icon left = line-2 right */
          top: calc(100% - 0.22em); /* align icon top with baseline of full stop */
          margin-left: 10px;
          width: clamp(36px, 4vw, 64px);
          height: auto;
          display: block;
        }

        /* ── CENTER HEART STICKER (INTACT IN MIDDLE) ─────────── */
        .hero-heart {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) rotate(var(--heart-wobble)) scale(calc(1 - 0.28 * var(--unzip-progress)));
          opacity: 1;
          width: clamp(70px, 7.5vw, 105px);
          height: auto;
          z-index: 10;
          pointer-events: none;
          filter: drop-shadow(0px 6px 12px rgba(0,0,0,0.2));
          transition: transform 50ms linear;
        }

        /* ── RIGHT PANEL ─────────────────────────────────────── */
        .hero-right {
          position: relative;
          flex: 0 0 calc(50% - 5px);
          min-width: 0;
          height: 100%;
          background: var(--color-hero-pink);
          display: flex;
          flex-direction: column;
          align-items: center;              /* center all content horizontally */
          justify-content: center;          /* center all content vertically */
          padding: 48px 0;                  /* balanced vertical padding */
          gap: 36px;
          z-index: 2;
          
          /* Morph left edge into a vertical capsule as it slides away */
          border-radius: calc(50px + 300px * var(--unzip-progress)) 0 0 calc(50px + 300px * var(--unzip-progress));
          
          /* Slide out to the right */
          transform: translateX(calc(50vw * var(--unzip-progress)));
          transition: border-radius 50ms linear, transform 50ms linear;
        }

        /* Jaro 120px — white fill, 1px black stroke (per Figma) */
        .hero-heading {
          font-family: var(--font-logo);
          font-weight: 400;
          text-transform: uppercase;
          color: var(--color-bg);
          -webkit-text-stroke: 1px var(--color-ink);
          line-height: 0.95;
          letter-spacing: 0.02em;
          margin: 0;
          font-size: clamp(52px, 8.5vw, 120px);
          display: flex;
          flex-direction: column;
          align-items: center;              /* center text lines horizontally */
          width: 100%;
          transform: scale(calc(1 - 0.1 * var(--unzip-progress)));
          transition: transform 50ms linear;
        }

        .hero-heading-line {
          display: block;
          white-space: nowrap;
        }

        /* ── CTA buttons ─────────────────────────────────────── */
        .hero-ctas {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;          /* center buttons horizontally */
          width: 100%;
          transform: scale(calc(1 - 0.05 * var(--unzip-progress)));
          transition: transform 50ms linear;
        }

        .hero-cta-btn {
          font-family: var(--font-heading);
          font-size: clamp(0.7rem, 1vw, 0.85rem);
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          border: 2px solid var(--color-ink);
          padding: 11px 26px;
          cursor: pointer;
          white-space: nowrap;
          transition: background var(--transition-fast), color var(--transition-fast);
        }

        .hero-cta-explore {
          background: var(--color-ink);
          color: var(--color-bg);
          border-radius: 25px 0px 25px 0px;
        }
        .hero-cta-explore:hover {
          background: var(--color-bg);
          color: var(--color-ink);
        }

        .hero-cta-custom {
          background: var(--color-bg);
          color: var(--color-ink);
          border-radius: 0px 25px 0px 25px;
        }
        .hero-cta-custom:hover {
          background: var(--color-ink);
          color: var(--color-bg);
        }

        /* ── TICKER ──────────────────────────────────────────── */
        .hero-ticker {
          position: absolute;
          bottom: 0;
          left: calc(50% - 50% * var(--unzip-progress));
          right: calc(50% - 50% * var(--unzip-progress));
          display: flex;
          align-items: center;
          background: var(--color-ticker-bg);
          border-radius: var(--ticker-radius) var(--ticker-radius) 0 0;
          overflow: hidden;
          height: 72px;               /* matches nav bar height exactly */
          box-sizing: border-box;
          border-bottom: 10px solid var(--color-bg); /* matches nav bar bottom stroke */
          padding: 0;
          z-index: 1;
          transform: translateY(calc(100% + 20px - var(--unzip-progress) * 100% - var(--unzip-progress) * 20px));
          transition: transform 50ms linear, left 50ms linear, right 50ms linear, border-radius 50ms linear;
        }

        .ticker-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: marquee 40s linear infinite;
        }

        .ticker-group {
          display: flex;
          align-items: center;
          gap: 28px;
          padding-right: 28px;
        }

        .ticker-text {
          font-family: var(--font-heading);
          font-size: clamp(0.85rem, 1.2vw, 1.05rem);
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ticker-ink);
          white-space: nowrap;
        }

        .ticker-bow {
          width: clamp(28px, 3vw, 36px);
          height: auto;
          flex-shrink: 0;
        }

        @keyframes marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ticker-track {
            animation: none;
            width: 100%;
            flex-wrap: wrap;
            justify-content: center;
          }
          .ticker-group:last-child {
            display: none;
          }
        }

        /* ── Mobile: stack panels vertically ────────────────── */
        @media (max-width: 700px) {
          .hero-scroll-container {
            height: auto !important;
          }
          .hero-unzip-reveal-bg {
            display: none !important;
          }
          .hero-section {
            position: relative !important;
            top: 0 !important;
            flex-direction: column;
            height: auto !important;
          }
          .hero-left {
            width: 100%;
            height: 50vw;
            min-height: 300px;
            transform: none !important;
            border-radius: 0 50px 50px 0 !important;
          }
          .hero-right {
            width: 100%;
            height: 50vw;
            min-height: 300px;
            transform: none !important;
            border-radius: 50px 0 0 50px !important;
            align-items: center !important;
            padding: 24px 6% !important;
          }
          .hero-heading {
            font-size: clamp(36px, 10vw, 64px);
            align-items: center !important;
            text-align: center !important;
            transform: none !important;
          }
          .hero-ctas {
            justify-content: center !important;
            transform: none !important;
          }
          .hero-quote {
            transform: translate(-50%, 0) scale(1) !important;
          }
          .hero-video {
            transform: scale(1.03) !important;
          }
          .hero-heart {
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) scale(1) !important;
            opacity: 1 !important;
            filter: drop-shadow(0px 6px 12px rgba(0,0,0,0.2)) !important;
          }
          .hero-ticker {
            position: relative !important;
            transform: none !important;
            left: auto !important;
            right: auto !important;
            width: 100% !important;
            border-radius: 0 !important;
            height: 72px !important;
            padding: 0 !important;
          }
        }
      `}</style>

      <div ref={containerRef} className="hero-scroll-container">
        {/* ── Hero split ──────────────────────────────────────── */}
        <section ref={heroRef} className="hero-section" aria-label="Hero">

          {/* Reveal Background (revealed on unzip) */}
          <div className="hero-unzip-reveal-bg">
            <div className="reveal-text-wrap">
              <h2 className="reveal-title">L'Étoile Sucrée</h2>
              <span className="reveal-subtitle">L'Art de la Pâtisserie</span>
            </div>
          </div>

          {/* LEFT — video background + quote */}
          <div className="hero-left">
          <video
            className="hero-video"
            src="/hero-bg.mp4"
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
          />

          {/* Quote block: open mark anchored to line-1 top, close mark anchored to line-2 bottom */}
          <div className="hero-quote">
            <div className="quote-content">
              {/* Line 1 — open-quote bottom aligns with this line's bottom (text baseline) */}
              <div className="quote-line-1">
                <img src="/quote 1st.png" alt="" aria-hidden="true" className="quote-open" />
                <span className="quote-text-line">Every slice holds a memory</span>
              </div>
              {/* Line 2 — close-quote top aligns with this line's bottom (text baseline) */}
              <div className="quote-line-2">
                <span className="quote-text-line">waiting to be made.</span>
                <img src="/quote 2nd.png" alt="" aria-hidden="true" className="quote-close" />
              </div>
            </div>
          </div>
        </div>

        {/* CENTER — heart straddling the divider */}
        <img
          src="/purple-heart.png"
          alt=""
          aria-hidden="true"
          className="hero-heart"
        />

        {/* RIGHT — pink panel with heading + CTAs */}
        <div className="hero-right">
          <h1 className="hero-heading">
            <span className="hero-heading-line line-1">Crafting</span>
            <span className="hero-heading-line line-2">Joy In</span>
            <span className="hero-heading-line line-3">Every</span>
            <span className="hero-heading-line line-4">Bite.</span>
          </h1>

          <div className="hero-ctas">
            <button
              id="hero-explore-btn"
              className="hero-cta-btn hero-cta-explore"
              onClick={scrollToMenu}
            >
              Explore Menu
            </button>
            <button
              id="hero-custom-btn"
              className="hero-cta-btn hero-cta-custom"
              onClick={scrollToCustomOrder}
            >
              Custom Order
            </button>
          </div>
        </div>

        {/* ── Ticker strip ────────────────────────────────────── */}
        <div className="hero-ticker" role="complementary" aria-label="Key features">
          <div className="ticker-track">
            <div className="ticker-group">
              <span className="ticker-text">Freshly Baked Daily</span>
              <img src="/bow.png" alt="" aria-hidden="true" className="ticker-bow" />
              <span className="ticker-text">Made With Love</span>
              <img src="/bow.png" alt="" aria-hidden="true" className="ticker-bow" />
              <span className="ticker-text">Custom Orders Welcome</span>
              <img src="/bow.png" alt="" aria-hidden="true" className="ticker-bow" />
              <span className="ticker-text">9 Signature Flavours</span>
              <img src="/bow.png" alt="" aria-hidden="true" className="ticker-bow" />
              <span className="ticker-text">Handcrafted Pastries</span>
              <img src="/bow.png" alt="" aria-hidden="true" className="ticker-bow" />
              <span className="ticker-text">Premium Ingredients</span>
              <img src="/bow.png" alt="" aria-hidden="true" className="ticker-bow" />
              <span className="ticker-text">Artisanal Recipes</span>
              <img src="/bow.png" alt="" aria-hidden="true" className="ticker-bow" />
              <span className="ticker-text">French Baking Tradition</span>
              <img src="/bow.png" alt="" aria-hidden="true" className="ticker-bow" />
            </div>
            <div className="ticker-group" aria-hidden="true">
              <span className="ticker-text">Freshly Baked Daily</span>
              <img src="/bow.png" alt="" aria-hidden="true" className="ticker-bow" />
              <span className="ticker-text">Made With Love</span>
              <img src="/bow.png" alt="" aria-hidden="true" className="ticker-bow" />
              <span className="ticker-text">Custom Orders Welcome</span>
              <img src="/bow.png" alt="" aria-hidden="true" className="ticker-bow" />
              <span className="ticker-text">9 Signature Flavours</span>
              <img src="/bow.png" alt="" aria-hidden="true" className="ticker-bow" />
              <span className="ticker-text">Handcrafted Pastries</span>
              <img src="/bow.png" alt="" aria-hidden="true" className="ticker-bow" />
              <span className="ticker-text">Premium Ingredients</span>
              <img src="/bow.png" alt="" aria-hidden="true" className="ticker-bow" />
              <span className="ticker-text">Artisanal Recipes</span>
              <img src="/bow.png" alt="" aria-hidden="true" className="ticker-bow" />
              <span className="ticker-text">French Baking Tradition</span>
              <img src="/bow.png" alt="" aria-hidden="true" className="ticker-bow" />
            </div>
          </div>
        </div>

      </section>
      </div>
    </>
  );
};
