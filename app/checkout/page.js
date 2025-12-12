'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useCart } from '@/lib/hooks/useCart';
import { resolveItemPricing } from '@/lib/pricing';
import styles from './page.module.css';

const formatPrice = (value) => `${(Number(value) || 0).toFixed(2)} CHF`;

export default function CheckoutPage() {
  const { items, totalPrice, totalCount, subtotal, discountTotal } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const detailedItems = useMemo(
    () =>
      items.map((item) => {
        const pricing = resolveItemPricing(item);
        return {
          ...item,
          image: Array.isArray(item.img) ? item.img[0] : item.img,
          pricing,
        };
      }),
    [items],
  );

  const payloadItems = useMemo(
    () =>
      detailedItems.map((item) => ({
        id: item.id,
        name: item.name || 'Product',
        price: item.pricing.basePrice,
        discount: item.pricing.discountValue,
        quantity: item.pricing.quantity,
        image: item.image,
      })),
    [detailedItems],
  );

  const handlePay = async () => {
    if (!payloadItems.length) {
      setStatus({ type: 'error', message: 'Add items to cart before checkout.' });
      return;
    }

    setStatus({ type: '', message: '' });
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payloadItems }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to create payment.');
      }

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error('Stripe returned an empty payment link.');
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!items.length) {
    return (
      <section className={styles.section}>
        <div className="container">
          <div className={`${styles.empty} reveal-up reveal-delay-sm`}>
            <p className={styles.kicker}>Checkout</p>
            <h1 className={styles.title}>Your cart is empty</h1>
            <p className={styles.text}>Add jewelry pieces you love and come back to checkout.</p>
            <div className={styles.actions}>
              <Link href="/" className={styles.link}>
                Browse catalog
              </Link>
              <Link href="/cart" className={styles.linkSecondary}>
                Return to cart
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={`${styles.layout} reveal-up reveal-delay-sm`}>
          <div className={styles.main}>
            <p className={styles.kicker}>Checkout</p>
            <h1 className={styles.title}>Review your order</h1>
            <p className={styles.text}>
              Confirm items and quantities, then pay securely with Stripe.
            </p>

            <div className={`${styles.card} reveal-up reveal-delay-md`}>
              <div className={styles.cardHeader}>
                <div>
                  <p className={styles.cardTitle}>Items</p>
                  <p className={styles.cardMeta}>
                    {totalCount} {totalCount === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>

              <ul className={styles.list}>
                {detailedItems.map((item) => {
                  const { basePrice, hasDiscount, discountValue, unitPrice, lineTotal, quantity } =
                    item.pricing;
                  const displayName = item.name || 'Product';
                  return (
                    <li key={item.id} className={styles.item}>
                      <div className={styles.thumb}>
                        <Image
                          src={item.image || '/images/product.jpg'}
                          alt={displayName}
                          fill
                          sizes="96px"
                          className={styles.thumbImg}
                        />
                      </div>
                      <div className={styles.itemContent}>
                        <p className={styles.itemName}>{displayName}</p>
                        <p className={styles.itemMeta}>Qty: {quantity}</p>
                        <div className={styles.itemPrices}>
                          {hasDiscount ? (
                            <>
                              <span className={styles.priceOld}>{formatPrice(basePrice)}</span>
                              <span className={styles.discountBadge}>-{discountValue}%</span>
                              <span className={styles.priceNew}>{formatPrice(unitPrice)}</span>
                            </>
                          ) : (
                            <span className={styles.priceNew}>{formatPrice(unitPrice)}</span>
                          )}
                        </div>
                      </div>
                      <p className={styles.itemPrice}>{formatPrice(lineTotal)}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <aside className={`${styles.summary} reveal-up reveal-delay-lg`} aria-label="Order summary">
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span className={styles.summaryValue}>{formatPrice(subtotal)}</span>
            </div>
            {discountTotal > 0 && (
              <div className={`${styles.summaryRow} ${styles.summaryDiscount}`}>
                <span>Discount</span>
                <span className={styles.summaryValue}>-{formatPrice(discountTotal)}</span>
              </div>
            )}
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span className={styles.summaryValue}>Calculated at Stripe</span>
            </div>
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span className={styles.summaryValue}>{formatPrice(totalPrice)}</span>
            </div>

            {status.message && (
              <p
                className={`${styles.status} ${
                  status.type === 'error' ? styles.error : styles.success
                }`}
              >
                {status.message}
              </p>
            )}

            <button
              type="button"
              className={styles.payButton}
              onClick={handlePay}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating payment...' : 'Pay now'}
            </button>
            <p className={styles.note}>
              You will be redirected to Stripe's secure checkout to choose your payment method.
            </p>
            <div className={styles.links}>
              <Link href="/cart" className={styles.linkSecondary}>
                Edit cart
              </Link>
              <Link href="/" className={styles.linkSecondary}>
                Continue shopping
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
