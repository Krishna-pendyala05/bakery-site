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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Premium Header */}
      <Header currentTab={tab} setTab={setTab} />

      {/* Main Page Area */}
      <main style={{ flex: 1, paddingBottom: '3rem' }}>
        {tab === 'cakes' && <Cakes />}
        
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

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        borderTop: '1px solid var(--border-color)',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
        marginTop: 'auto'
      }}>
        <p>© {new Date().getFullYear()} L'Étoile Sucrée Cake Atelier. All rights reserved.</p>
        <p style={{ marginTop: '0.25rem', fontSize: '0.75rem' }}>Indulging sweet moments with premium local craft.</p>
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
