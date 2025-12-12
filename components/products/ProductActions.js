'use client';

import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/hooks/useCart';
import { flyToCart } from '@/lib/cartAnimation';
import styles from './ProductActions.module.css';

export default function ProductActions({ product }) {
  const router = useRouter();
  const { addItem, items } = useCart();
  const addButtonRef = useRef(null);

  if (!product) {
    return null;
  }

  const productId = product?.id;
  const isInCart = useMemo(
    () => (productId ? items.some((item) => item.id === productId) : false),
    [items, productId],
  );

  const handleAdd = () => {
    if (!product || isInCart) return;
    addItem(product, 1);
    flyToCart(addButtonRef.current);
  };

  const handleBuyNow = () => {
    addItem(product, 1);
    router.push('/cart');
  };

  return (
    <div className={styles.actions}>
      <button
        type="button"
        className={`${styles.button} ${styles.secondary}`}
        disabled={isInCart}
        onClick={handleAdd}
        ref={addButtonRef}
      >
        {isInCart ? 'Added' : 'Add to Cart'}
      </button>
      <button
        type="button"
        className={`${styles.button} ${styles.primary}`}
        onClick={handleBuyNow}
      >
        Buy now
      </button>
    </div>
  );
}
