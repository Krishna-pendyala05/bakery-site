import React from 'react';

export const Philosophy: React.FC = () => (
  <>
    <style>{`
      /* ── Philosophy Section ─────────────────────────────────── */
      .philosophy-section {
        background: var(--color-bg);
        padding: 24px clamp(24px, 8vw, 160px) 32px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 28px;
        border-bottom: 1px solid var(--color-border);
      }

      /* ── Title row ──────────────────────────────────────────── */
      .philosophy-title-row {
        display: flex;
        align-items: center;
        gap: 18px;
      }

      .philosophy-title {
        font-family: var(--font-logo);
        font-size: clamp(1.7rem, 3vw, 2.5rem);
        font-weight: 700;
        color: var(--color-ink);
        letter-spacing: 0.04em;
        margin: 0;
      }

      .philosophy-icon {
        width: clamp(26px, 2.5vw, 36px);
        height: auto;
        display: block;
        flex-shrink: 0;
      }

      /* ── Body ───────────────────────────────────────────────── */
      .philosophy-body {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        width: 100%;
      }

      .philosophy-p {
        font-family: var(--font-upright);
        font-size: clamp(1rem, 1.4vw, 1.2rem);
        font-weight: 500;
        letter-spacing: 0.02em;
        color: var(--color-ink);
        line-height: 1.75;
        text-align: center;
        margin: 0;
      }

      /* ── Responsive ─────────────────────────────────────────── */
      @media (max-width: 700px) {
        .philosophy-section {
          padding: 20px 24px 28px;
          gap: 20px;
        }
        .philosophy-p {
          font-size: 0.95rem;
        }
      }
    `}</style>

    <section className="philosophy-section" aria-labelledby="philosophy-heading">
      <div className="philosophy-title-row">
        <img src="/pastrie.png" alt="" aria-hidden="true" className="philosophy-icon" />
        <h2 className="philosophy-title" id="philosophy-heading">Our Philosophy</h2>
        <img
          src="/pastrie.png"
          alt=""
          aria-hidden="true"
          className="philosophy-icon"
          style={{ transform: 'scaleX(-1)' }}
        />
      </div>

      <div className="philosophy-body">
        <p className="philosophy-p">
          We believe a great cake is never just flour and sugar — it is a crafted moment.
        </p>
        <p className="philosophy-p">
          At L'Étoile Sucrée, we fuse the warmth of every festive tradition with the restraint of modern pastry artistry.
        </p>
        <p className="philosophy-p">
          From our kitchen in Hyderabad, each cake is assembled by hand, dressed with intention, and dispatched with care.
        </p>
      </div>
    </section>
  </>
);
