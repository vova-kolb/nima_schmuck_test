'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { calculateCartTotals, normalizeDiscount, normalizePrice } from '@/lib/pricing';

const STORAGE_KEY = 'nima-cart-items';

const CartContext = createContext(null);

const normalizeItem = (product, quantity = 1) => {
  if (!product?.id) return null;

  const baseImg = Array.isArray(product?.img) ? product.img[0] : product?.img;
  const safeQty = Number.isFinite(quantity) ? Math.max(1, Math.floor(quantity)) : 1;

  return {
    id: product.id,
    name: product.name || 'Product',
    price: normalizePrice(product.price),
    discount: normalizeDiscount(product.discount),
    img: baseImg || '/images/product.jpg',
    category: product.category,
    materials: product.materials,
    quantity: safeQty,
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
        const sanitized = parsed
          .map((item) => normalizeItem(item, item?.quantity))
          .filter(Boolean);
        setItems(sanitized);
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
      const normalized = normalizeItem(product, quantity);
      if (!normalized) return prev;
      const existing = prev.find((item) => item.id === normalized.id);
      if (existing) {
        const mergedQuantity = existing.quantity + normalized.quantity;
        return prev.map((item) =>
          item.id === normalized.id ? { ...item, ...normalized, quantity: mergedQuantity } : item,
        );
      }
      return [...prev, normalized];
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

  const totals = useMemo(() => calculateCartTotals(items), [items]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      totalCount,
      totalPrice: totals.total,
      subtotal: totals.subtotal,
      discountTotal: totals.discountTotal,
    }),
    [items, addItem, removeItem, setQuantity, clearCart, totalCount, totals],
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
