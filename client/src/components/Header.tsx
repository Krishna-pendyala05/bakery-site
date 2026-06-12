import React from 'react';
import { ShoppingBag, LogOut, User as UserIcon, Cake as CakeIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

interface HeaderProps {
  currentTab: 'cakes' | 'checkout' | 'login';
  setTab: (tab: 'cakes' | 'checkout' | 'login') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setTab }) => {
  const { user, logout } = useAuth();
  const { cartCount, cartTotal } = useCart();

  return (
    <header className="glass-card" style={{
      position: 'sticky',
      top: '1rem',
      margin: '1rem auto',
      width: 'calc(100% - 2rem)',
      maxWidth: '1200px',
      zIndex: 100,
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 'var(--radius-lg)'
    }}>
      {/* Brand logo */}
      <div 
        onClick={() => setTab('cakes')} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
      >
        <div style={{
          backgroundColor: 'var(--primary)',
          color: 'var(--text-on-primary)',
          padding: '0.5rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <CakeIcon size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', fontWeight: 800, letterSpacing: '-0.025em' }}>
            L'Étoile <span style={{ color: 'var(--primary)', fontWeight: 400 }}>Sucrée</span>
          </h1>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Artisan Cake Atelier
          </p>
        </div>
      </div>

      {/* Navigation & User Actions */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button 
          className={`btn ${currentTab === 'cakes' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setTab('cakes')}
          style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
        >
          Menu
        </button>

        {/* Cart Trigger */}
        <button 
          className={`btn ${currentTab === 'checkout' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setTab('checkout')}
          style={{ 
            padding: '0.5rem 1rem', 
            fontSize: '0.9rem',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <ShoppingBag size={18} />
          <span style={{ display: 'none' }}>Cart</span>
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--text-on-primary)',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              minWidth: '20px',
              height: '20px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              boxShadow: '0 2px 8px rgba(219, 110, 38, 0.4)',
              border: '2px solid var(--bg-surface)'
            }}>
              {cartCount}
            </span>
          )}
          {cartCount > 0 && (
            <span style={{ fontSize: '0.85rem', fontWeight: 500, marginLeft: '0.25rem' }}>
              ${cartTotal.toFixed(2)}
            </span>
          )}
        </button>

        {/* Auth status / Trigger */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--secondary)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)'
              }}>
                <UserIcon size={16} />
              </div>
              <div style={{ display: 'none' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>{user.name || 'User'}</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user.mobile}</p>
              </div>
            </div>
            <button 
              className="btn btn-secondary" 
              onClick={logout}
              style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)' }}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button 
            className={`btn ${currentTab === 'login' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab('login')}
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
          >
            Login
          </button>
        )}
      </nav>
    </header>
  );
};
