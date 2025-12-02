'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/hooks/useCart';
import styles from './ProductActions.module.css';

export default function ProductActions({ product }) {
  const router = useRouter();
  const { addItem } = useCart();

  if (!product) {
    return null;
  }

  const handleAdd = () => {
    addItem(product, 1);
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
        onClick={handleAdd}
      >
        Add to cart
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
