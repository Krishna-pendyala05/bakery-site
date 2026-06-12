import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Cake {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  available: boolean;
}

export interface CartItem {
  cake: Cake;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (cake: Cake) => void;
  removeFromCart: (cakeId: number) => void;
  updateQuantity: (cakeId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart from localStorage:', e);
      }
    }
  }, []);

  // Sync cart to local storage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const addToCart = (cake: Cake) => {
    const existingIndex = cart.findIndex((item) => item.cake.id === cake.id);
    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += 1;
      saveCart(newCart);
    } else {
      saveCart([...cart, { cake, quantity: 1 }]);
    }
  };

  const removeFromCart = (cakeId: number) => {
    const newCart = cart.filter((item) => item.cake.id !== cakeId);
    saveCart(newCart);
  };

  const updateQuantity = (cakeId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cakeId);
      return;
    }
    const newCart = cart.map((item) =>
      item.cake.id === cakeId ? { ...item, quantity } : item
    );
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.cake.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
