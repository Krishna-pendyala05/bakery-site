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
  id: string; // Composite ID: `${cake.id}-${weight}`
  cake: Cake;
  weight: '500g' | '1kg';
  quantity: number;
  price: number; // INR price
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (cake: Cake, weight: '500g' | '1kg', price: number, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  updateWeight: (cartItemId: string, weight: '500g' | '1kg') => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Load cart on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          const normalized = parsed.map((item: any) => {
            if (typeof item.price === 'number') return item;
            const calculatedPrice = item.weight === '500g'
              ? Math.round(item.cake.price * 30)
              : Math.round(item.cake.price * 55);
            return { ...item, price: calculatedPrice };
          });
          setCart(normalized);
        }
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

  const addToCart = (cake: Cake, weight: '500g' | '1kg', price: number, quantity: number = 1) => {
    const compositeId = `${cake.id}-${weight}`;
    const existingIndex = cart.findIndex((item) => item.id === compositeId);
    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += quantity;
      saveCart(newCart);
    } else {
      saveCart([...cart, { id: compositeId, cake, weight, quantity, price }]);
    }
    // Automatically open cart drawer when item is added!
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    const newCart = cart.filter((item) => item.id !== cartItemId);
    saveCart(newCart);
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    const newCart = cart.map((item) =>
      item.id === cartItemId ? { ...item, quantity } : item
    );
    saveCart(newCart);
  };

  const updateWeight = (cartItemId: string, weight: '500g' | '1kg') => {
    const item = cart.find(i => i.id === cartItemId);
    if (!item || item.weight === weight) return;

    const newPrice = weight === '500g' ? Math.round(item.cake.price * 30) : Math.round(item.cake.price * 55);
    const newCompositeId = `${item.cake.id}-${weight}`;
    const existingIndex = cart.findIndex(i => i.id === newCompositeId);

    if (existingIndex > -1) {
      const newCart = cart.filter(i => i.id !== cartItemId);
      newCart[existingIndex].quantity += item.quantity;
      saveCart(newCart);
    } else {
      const newCart = cart.map(i =>
        i.id === cartItemId
          ? { ...i, id: newCompositeId, weight, price: newPrice }
          : i
      );
      saveCart(newCart);
    }
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateWeight,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
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
