import React from 'react';
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
    <header>
      {/* Brand */}
      <div onClick={() => setTab('cakes')}>
        <span>L'Étoile Sucrée</span>
      </div>

      {/* Nav */}
      <nav>
        <button onClick={() => setTab('cakes')} aria-current={currentTab === 'cakes'}>
          Menu
        </button>

        <button onClick={() => setTab('checkout')} aria-current={currentTab === 'checkout'}>
          Cart {cartCount > 0 && `(${cartCount}) — $${cartTotal.toFixed(2)}`}
        </button>

        {user ? (
          <>
            <span>{user.name || user.mobile}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <button onClick={() => setTab('login')} aria-current={currentTab === 'login'}>
            Login
          </button>
        )}
      </nav>
    </header>
  );
};
