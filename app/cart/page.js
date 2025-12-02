'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/hooks/useCart';
import styles from './page.module.css';

const formatPrice = (value) => `${(Number(value) || 0).toFixed(2)} CHF`;

export default function CartPage() {
  const { items, setQuantity, removeItem, totalPrice, totalCount } = useCart();
  const hasItems = items.length > 0;

  const handleDecrease = (id, currentQty) => {
    setQuantity(id, (currentQty || 1) - 1);
  };

  const handleIncrease = (id, currentQty) => {
    setQuantity(id, (currentQty || 1) + 1);
  };

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <p className={styles.kicker}>Cart</p>
            <h1 className={styles.title}>Your selection</h1>
          </div>
          {hasItems && (
            <p className={styles.meta}>
              {totalCount} item{totalCount === 1 ? '' : 's'}
            </p>
          )}
        </div>

        {!hasItems ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>Your cart is empty</p>
            <p className={styles.emptyText}>
              Add a piece you love to start checkout.
            </p>
            <Link href="/" className={`${styles.button} ${styles.secondary}`}>
              Buy more
            </Link>
          </div>
        ) : (
          <div className={styles.layout}>
            <ul className={styles.list} aria-label="Items in your cart">
              {items.map((item) => {
                const lineTotal =
                  (Number(item.price) || 0) * (item.quantity || 1);
                return (
                  <li key={item.id} className={styles.item}>
                    <div className={styles.thumb}>
                      <Image
                        src={item.img || '/images/product.jpg'}
                        alt={item.name || 'Product'}
                        fill
                        className={styles.thumbImg}
                        sizes="120px"
                      />
                    </div>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemTop}>
                        <div>
                          <p className={styles.itemName}>
                            {item.name || 'Product'}
                          </p>
                          {item.materials && (
                            <p className={styles.itemMeta}>{item.materials}</p>
                          )}
                          {item.category && (
                            <p className={styles.itemMeta}>{item.category}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          className={styles.remove}
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </button>
                      </div>

                      <div className={styles.itemBottom}>
                        <div className={styles.qtyControl} aria-label="Change quantity">
                          <button
                            type="button"
                            className={styles.qtyButton}
                            onClick={() => handleDecrease(item.id, item.quantity)}
                            aria-label={`Decrease quantity for ${item.name}`}
                          >
                            &minus;
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity ?? 1}
                            onChange={(e) =>
                              setQuantity(item.id, parseInt(e.target.value, 10) || 1)
                            }
                            className={styles.qtyInput}
                            aria-label={`Quantity for ${item.name}`}
                          />
                          <button
                            type="button"
                            className={styles.qtyButton}
                            onClick={() => handleIncrease(item.id, item.quantity)}
                            aria-label={`Increase quantity for ${item.name}`}
                          >
                            +
                          </button>
                        </div>
                        <p className={styles.itemPrice}>{formatPrice(lineTotal)}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <aside className={styles.summary} aria-label="Order summary">
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span className={styles.summaryPrice}>{formatPrice(totalPrice)}</span>
              </div>
              <p className={styles.summaryNote}>
                Taxes and shipping calculated during checkout.
              </p>
              <div className={styles.ctaRow}>
                <Link href="/" className={`${styles.button} ${styles.secondary}`}>
                  Buy more
                </Link>
                <Link href="/checkout" className={`${styles.button} ${styles.primary}`}>
                  Go to checkout
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
