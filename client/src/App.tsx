import { useState, useEffect } from 'react';
import { AuthProvider } from './hooks/useAuth';
import { CartProvider } from './hooks/useCart';
import { Header } from './components/Header';
import { Cakes } from './pages/Cakes';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';

function AppContent() {
  const [tab, setTab] = useState<'cakes' | 'checkout' | 'login'>(() => {
    const hash = window.location.hash;
    if (hash === '#login' || hash === '#register') {
      return 'login';
    }
    return 'cakes';
  });

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#login' || hash === '#register') {
        setTab('login');
      } else if (hash === '#menu' || hash === '#custom-order' || hash === '#our-story') {
        setTab('cakes');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  return (
    <div>
      {/* Header shown on every page for consistency */}
      <Header currentTab={tab} setTab={setTab} />

      <main>
        {tab === 'cakes' && <Cakes setTab={setTab} />}

        {tab === 'checkout' && (
          <Checkout
            onRequireLogin={() => setTab('login')}
            onContinueShopping={() => setTab('cakes')}
          />
        )}

        {tab === 'login' && (
          <Login onLoginSuccess={() => setTab('cakes')} />
        )}
      </main>

      {/* Footer shown on every page */}
      <Footer setTab={setTab} />

      {/* Slide-in cart drawer overlay */}
      <CartDrawer setTab={setTab} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
