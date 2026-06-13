import React from 'react';

export const MenuHeader: React.FC = () => {
  return (
    <>
      <style>{`
        .menu-header-banner {
          position: relative;
          background: #7A5145; /* Warm milk chocolate brown */
          width: 100%;
          padding: 36px 24px 48px; /* extra bottom padding for spacing */
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .menu-header-title-container {
          background: var(--color-bg);
          border: 2px solid var(--color-ink);
          padding: 16px 48px;
          border-radius: 24px 0px 24px 0px; /* leaf motif matches hero buttons */
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          transform: rotate(-1.2deg); /* subtle tilt for organic/artisan feel */
          z-index: 10;
          position: relative;
        }

        .menu-header-title {
          font-family: var(--font-logo);
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          font-weight: 700;
          color: var(--color-ink);
          letter-spacing: 0.08em;
          margin: 0;
          padding: 0;
          line-height: 1.1;
          text-transform: uppercase;
        }

        .menu-header-subtitle {
          font-family: var(--font-heading);
          font-size: clamp(0.75rem, 1.2vw, 0.85rem);
          font-weight: 700;
          color: var(--color-ink);
          letter-spacing: 0.25em;
          text-transform: uppercase;
          margin: 0;
          padding: 0;
          opacity: 0.65;
        }

        .menu-header-drips {
          position: absolute;
          bottom: -38px; /* push down to overflow */
          left: 0;
          width: 100%;
          height: 40px;
          z-index: 4;
          pointer-events: none;
        }

        .menu-header-drips path {
          fill: #7A5145; /* matches the chocolate background */
        }

        @media (max-width: 600px) {
          .menu-header-banner {
            padding: 28px 16px 42px;
          }
          .menu-header-title-container {
            padding: 12px 32px;
            border-radius: 18px 0px 18px 0px;
          }
          .menu-header-drips {
            bottom: -28px;
            height: 30px;
          }
        }
      `}</style>

      <div className="menu-header-banner">
        <div className="menu-header-title-container">
          <h2 className="menu-header-title">The Menu</h2>
          <span className="menu-header-subtitle">Signature Creations</span>
        </div>
        
        {/* Organic chocolate drips */}
        <svg 
          className="menu-header-drips" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M 0 0 L 0 50 C 30 50, 40 75, 60 75 C 80 75, 90 50, 120 50 C 135 50, 140 100, 155 100 C 170 100, 180 50, 190 50 C 210 50, 225 85, 245 85 C 265 85, 280 50, 300 50 C 320 50, 335 65, 355 65 C 375 65, 390 50, 410 50 C 430 50, 445 110, 465 110 C 485 110, 500 50, 520 50 C 535 50, 545 75, 555 75 C 565 75, 570 50, 580 50 C 600 50, 615 95, 630 95 C 645 95, 660 50, 680 50 C 700 50, 720 65, 740 65 C 760 65, 780 50, 800 50 C 820 50, 835 115, 850 115 C 865 115, 880 50, 900 50 C 920 50, 935 70, 950 70 C 965 70, 980 50, 1000 50 C 1020 50, 1035 90, 1050 90 C 1065 90, 1080 50, 1100 50 C 1120 50, 1140 70, 1160 70 C 1180 70, 1190 50, 1200 50 L 1200 0 Z" />
        </svg>
      </div>
    </>
  );
};
