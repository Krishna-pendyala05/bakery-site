import { useState } from 'react';
import { AuthProvider } from './hooks/useAuth';
import { CartProvider } from './hooks/useCart';
import { Header } from './components/Header';
import { Cakes } from './pages/Cakes';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';

function AppContent() {
  const [tab, setTab] = useState<'cakes' | 'checkout' | 'login'>('cakes');

  return (
    <div>
      {tab !== 'cakes' && <Header currentTab={tab} setTab={setTab} />}

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

      <footer>
        <p>© {new Date().getFullYear()} L'Étoile Sucrée Cake Atelier. All rights reserved.</p>
      </footer>
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
