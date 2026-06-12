import React from 'react';

interface HeroProps {
  setTab: (tab: 'cakes' | 'checkout' | 'login') => void;
}

export const Hero: React.FC<HeroProps> = ({ setTab: _setTab }) => {
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

      {/* Hero content */}
      <div>
        <img src="/blob.png"   alt="Artisan cake centerpiece" />
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
