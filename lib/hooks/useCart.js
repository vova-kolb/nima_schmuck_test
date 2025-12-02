'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'nima-cart-items';

const CartContext = createContext(null);

const normalizeItem = (product, quantity = 1) => {
  const baseImg = Array.isArray(product?.img) ? product.img[0] : product?.img;

  return {
    id: product.id,
    name: product.name || 'Product',
    price: product.price ?? 0,
    img: baseImg || '/images/product.jpg',
    category: product.category,
    materials: product.materials,
    quantity: Math.max(1, quantity),
  };
};

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setItems(parsed);
      }
    } catch (e) {
      // ignore invalid storage content
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product, quantity = 1) => {
    if (!product?.id) return;
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + Math.max(1, quantity) }
            : item,
        );
      }
      return [...prev, normalizeItem(product, quantity)];
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const setQuantity = useCallback((id, quantity) => {
    const safeQty = Number.isFinite(quantity) ? Math.max(0, Math.floor(quantity)) : 0;
    setItems((prev) => {
      if (safeQty <= 0) {
        return prev.filter((item) => item.id !== id);
      }
      return prev.map((item) =>
        item.id === id ? { ...item, quantity: safeQty } : item,
      );
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalCount = useMemo(
    () => items.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [items],
  );

  const totalPrice = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 0),
        0,
      ),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      totalCount,
      totalPrice,
    }),
    [items, addItem, removeItem, setQuantity, clearCart, totalCount, totalPrice],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
