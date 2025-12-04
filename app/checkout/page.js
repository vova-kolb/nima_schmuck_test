'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useCart } from '@/lib/hooks/useCart';
import styles from './page.module.css';

const formatPrice = (value) => `${(Number(value) || 0).toFixed(2)} CHF`;

export default function CheckoutPage() {
  const { items, totalPrice, totalCount } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const lineItems = useMemo(
    () =>
      items.map((item) => ({
        id: item.id,
        name: item.name || 'Product',
        price: Number(item.price) || 0,
        quantity: item.quantity || 1,
        image: Array.isArray(item.img) ? item.img[0] : item.img,
      })),
    [items],
  );

  const handlePay = async () => {
    if (!lineItems.length) {
      setStatus({ type: 'error', message: 'Add items to cart before checkout.' });
      return;
    }

    setStatus({ type: '', message: '' });
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: lineItems }),
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
          <div className={styles.empty}>
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
        <div className={styles.layout}>
          <div className={styles.main}>
            <p className={styles.kicker}>Checkout</p>
            <h1 className={styles.title}>Review your order</h1>
            <p className={styles.text}>
              Confirm items and quantities, then pay securely with Stripe.
            </p>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <p className={styles.cardTitle}>Items</p>
                  <p className={styles.cardMeta}>
                    {totalCount} {totalCount === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>

              <ul className={styles.list}>
                {lineItems.map((item) => {
                  const lineTotal = (Number(item.price) || 0) * (item.quantity || 1);
                  return (
                    <li key={item.id} className={styles.item}>
                      <div className={styles.thumb}>
                        <Image
                          src={item.image || '/images/product.jpg'}
                          alt={item.name}
                          fill
                          sizes="96px"
                          className={styles.thumbImg}
                        />
                      </div>
                      <div className={styles.itemContent}>
                        <p className={styles.itemName}>{item.name}</p>
                        <p className={styles.itemMeta}>
                          Qty: {item.quantity} · Price: {formatPrice(item.price)}
                        </p>
                      </div>
                    <p className={styles.itemPrice}>{formatPrice(lineTotal)}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <aside className={styles.summary} aria-label="Order summary">
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span className={styles.summaryValue}>{formatPrice(totalPrice)}</span>
            </div>
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
              You will be redirected to Stripe’s secure checkout to choose your payment method.
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
