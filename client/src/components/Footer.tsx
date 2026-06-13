import React from 'react';

interface FooterProps {
  setTab: (tab: 'cakes' | 'checkout' | 'login') => void;
}

export const Footer: React.FC<FooterProps> = ({ setTab }) => {
  const handleLinkClick = (label: string) => {
    setTab('cakes');

    // Wait a brief frame for tab state to apply if switching
    setTimeout(() => {
      if (label === 'Menu') {
        const menuSection = document.getElementById('menu-section');
        if (menuSection) {
          const navHeight = 80;
          const targetY = menuSection.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      } else if (label === 'Custom Order') {
        const customContainer = document.getElementById('custom-order-container');
        if (customContainer) {
          const navHeight = 80;
          const targetY = customContainer.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      } else if (label === 'Our Story') {
        const customContainer = document.getElementById('custom-order-container');
        if (customContainer) {
          const navHeight = 80;
          const scrollRange = window.innerHeight * 1.3;
          const targetY = customContainer.getBoundingClientRect().top + window.scrollY + scrollRange - navHeight + 20;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <footer className="footer-wrap">
      <style>{`
        .footer-wrap {
          background: #126A7F; /* Rich deep ocean teal, complementing yellow navbar */
          color: #FFFFFF;
          padding: 65px 48px 30px 48px;
          border-top: 10px solid var(--color-bg);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 10;
        }

        .footer-top {
          display: grid;
          grid-template-columns: 1.8fr 1fr 1fr 2fr;
          gap: 48px;
          max-width: 1280px;
          margin: 0 auto;
          width: 100%;
        }

        .footer-col {
          display: flex;
          flex-direction: column;
        }

        .footer-logo-title {
          font-family: var(--font-logo);
          font-size: 1.75rem;
          margin: 0 0 16px 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .footer-text {
          font-family: var(--font-body);
          font-size: 0.95rem;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 8px;
        }

        .footer-text a {
          color: #FFFFFF;
          text-decoration: underline;
        }

        .footer-col-title {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          margin: 0 0 16px 0;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #FFFFFF;
          font-weight: 600;
        }

        .footer-links-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .footer-link-btn {
          font-family: var(--font-body);
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.8);
          text-align: left;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: color var(--transition-fast);
          width: fit-content;
        }

        .footer-link-btn:hover {
          color: #FFFFFF;
        }

        /* ── Delivery Badges ───────────────────────────────── */
        .footer-delivery-badges {
          display: flex;
          gap: 12px;
          margin: 20px 0;
        }

        .delivery-badge {
          height: 38px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 14px;
          box-sizing: border-box;
          user-select: none;
        }

        .delivery-badge.uber-eats {
          background: #06C167;
          color: #000000;
          font-family: sans-serif;
          font-weight: bold;
          font-size: 0.9rem;
          flex-direction: column;
          line-height: 1.0;
          justify-content: center;
        }

        .delivery-badge.uber-eats .badge-uber {
          font-size: 0.6rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .delivery-badge.uber-eats .badge-eats {
          font-size: 0.95rem;
        }

        .delivery-badge.doordash {
          background: #FF3008;
          width: 84px;
        }

        .delivery-badge.doordash .dd-logo {
          height: 18px;
          width: auto;
        }

        /* ── Newsletter Form ───────────────────────────────── */
        .footer-newsletter-desc {
          font-family: var(--font-body);
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.4;
          margin-bottom: 16px;
        }

        .footer-newsletter-form {
          display: flex;
          gap: 8px;
          align-items: center;
          width: 100%;
          max-width: 340px;
        }

        .footer-email-input {
          background: #F4ABBA; /* Sweet pastel pink matching brand colors */
          border: none;
          border-radius: 9999px;
          padding: 12px 20px;
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.9rem;
          color: #1A1A1A;
          flex: 1;
          outline: none;
          min-width: 0;
        }

        .footer-email-input::placeholder {
          color: rgba(26, 26, 26, 0.5);
        }

        .footer-join-btn {
          background: #1A1A1A;
          color: #FFFFFF;
          border: none;
          border-radius: 9999px;
          padding: 12px 24px;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background var(--transition-fast);
          white-space: nowrap;
        }

        .footer-join-btn:hover {
          background: #333333;
        }

        /* ── Huge Brand Name ───────────────────────────────── */
        .footer-brand-huge {
          font-family: var(--font-logo);
          font-size: clamp(60px, 14vw, 240px);
          text-transform: uppercase;
          color: #FFFFFF;
          opacity: 0.95;
          text-align: center;
          line-height: 0.8;
          letter-spacing: -0.01em;
          margin-top: 48px;
          margin-bottom: 24px;
          user-select: none;
          pointer-events: none;
          white-space: nowrap;
          width: 100%;
          overflow: hidden;
        }

        /* ── Footer Bottom Bar ─────────────────────────────── */
        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          padding-top: 24px;
          display: flex;
          justify-content: space-between;
          font-family: var(--font-body);
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
          flex-wrap: wrap;
          gap: 16px;
          max-width: 1280px;
          margin: 0 auto;
          width: 100%;
        }

        .footer-bottom-links {
          display: flex;
          gap: 16px;
        }

        .footer-bottom-links a {
          transition: color var(--transition-fast);
        }

        .footer-bottom-links a:hover {
          color: #FFFFFF;
        }

        /* Responsive Breakpoints */
        @media (max-width: 960px) {
          .footer-top {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
        }

        @media (max-width: 560px) {
          .footer-top {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .footer-wrap {
            padding: 40px 24px 24px 24px;
          }
          .footer-bottom {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
        }
      `}</style>

      <div className="footer-top">
        {/* Col 1: Brand Info */}
        <div className="footer-col">
          <h3 className="footer-logo-title">L'Étoile Sucrée</h3>
          <p className="footer-text">5135 Rue Saint-Denis<br />Montréal, QC H2J 2M1</p>
          <p className="footer-text">
            <a href="mailto:bonjour@letoilesucree.com">bonjour@letoilesucree.com</a>
          </p>
          <p className="footer-text">+1 (514) 931-8444</p>
          
          <div className="footer-delivery-badges">
            <div className="delivery-badge uber-eats">
              <span className="badge-uber">Uber</span>
              <span className="badge-eats">Eats</span>
            </div>
            <div className="delivery-badge doordash">
              <svg className="dd-logo" viewBox="0 0 23 15" fill="none">
                <path d="M23 7.66c0-3.68-3-6.66-6.66-6.66H4.66C3.74 1 3 1.74 3 2.66S3.74 4.32 4.66 4.32h11.68c2.02 0 3.66 1.64 3.66 3.66s-1.64 3.66-3.66 3.66H1.66C.74 11.64 0 12.38 0 13.3c0 .92.74 1.66 1.66 1.66h14.68c3.68 0 6.66-2.98 6.66-6.66z" fill="#FFF" />
              </svg>
            </div>
          </div>
          <p className="footer-text" style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)' }}>
            Follow us on Instagram
          </p>
        </div>

        {/* Col 2: Shop Menu */}
        <div className="footer-col">
          <h4 className="footer-col-title">Menu</h4>
          <div className="footer-links-list">
            <button className="footer-link-btn" onClick={() => handleLinkClick('Menu')}>All Cakes</button>
            <button className="footer-link-btn" onClick={() => handleLinkClick('Custom Order')}>Custom Orders</button>
            <button className="footer-link-btn" onClick={() => handleLinkClick('Menu')}>Signature Flavours</button>
            <button className="footer-link-btn" onClick={() => handleLinkClick('Menu')}>Gift Vouchers</button>
          </div>
        </div>

        {/* Col 3: About Links */}
        <div className="footer-col">
          <h4 className="footer-col-title">About</h4>
          <div className="footer-links-list">
            <button className="footer-link-btn" onClick={() => handleLinkClick('Our Story')}>Our Story</button>
            <button className="footer-link-btn" onClick={() => handleLinkClick('Contact')}>Contact</button>
            <button className="footer-link-btn" onClick={() => handleLinkClick('Wholesale')}>Wholesale</button>
            <button className="footer-link-btn" onClick={() => handleLinkClick('Careers')}>Careers</button>
          </div>
        </div>

        {/* Col 4: Newsletter */}
        <div className="footer-col">
          <h4 className="footer-col-title">Join Our Newsletter</h4>
          <p className="footer-newsletter-desc">
            Receive sweet updates, recipes, and exclusive seasonal offers.
          </p>
          <div className="footer-newsletter-form">
            <input 
              type="email" 
              placeholder="EMAIL" 
              className="footer-email-input" 
              aria-label="Email address for newsletter"
              autoComplete="off"
              data-1p-ignore
              data-lpignore="true"
            />
            <button className="footer-join-btn">JOIN</button>
          </div>
        </div>
      </div>

      {/* Huge Brand Typography */}
      <div className="footer-brand-huge">
        L'Étoile Sucrée
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom">
        <div>Copyright 2026 | L'Étoile Sucrée</div>
        <div className="footer-bottom-links">
          <a href="#terms">Terms of use</a>
          <span>|</span>
          <a href="#privacy">Privacy policy</a>
        </div>
        <div>Made by Casa Media</div>
      </div>
    </footer>
  );
};
