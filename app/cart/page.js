'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/hooks/useCart';
import { resolveItemPricing } from '@/lib/pricing';
import styles from './page.module.css';

const formatPrice = (value) => `${(Number(value) || 0).toFixed(2)} CHF`;

export default function CartPage() {
  const {
    items,
    setQuantity,
    removeItem,
    totalPrice,
    totalCount,
    subtotal,
    discountTotal,
  } = useCart();
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
                const pricing = resolveItemPricing(item);
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
                        <div className={styles.priceBlock}>
                          <div className={styles.priceLine}>
                            {pricing.hasDiscount ? (
                              <>
                                <span className={styles.priceOld}>{formatPrice(pricing.basePrice)}</span>
                                <span className={styles.discountBadge}>-{pricing.discountValue}%</span>
                                <span className={styles.priceNew}>{formatPrice(pricing.unitPrice)}</span>
                              </>
                            ) : (
                              <span className={styles.priceNew}>{formatPrice(pricing.unitPrice)}</span>
                            )}
                          </div>
                          <p className={styles.itemTotalLabel}>Line total</p>
                          <p className={styles.itemPrice}>{formatPrice(pricing.lineTotal)}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <aside className={styles.summary} aria-label="Order summary">
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span className={styles.summaryPrice}>{formatPrice(subtotal)}</span>
              </div>
              {discountTotal > 0 && (
                <div className={`${styles.summaryRow} ${styles.summaryDiscount}`}>
                  <span>Discount</span>
                  <span className={styles.summaryPrice}>-{formatPrice(discountTotal)}</span>
                </div>
              )}
              <div className={styles.summaryTotal}>
                <span>Total</span>
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
