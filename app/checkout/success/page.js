'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { useCart } from '@/lib/hooks/useCart';
import styles from './page.module.css';

function SuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get('session_id');
  const { clearCart } = useCart();

  useEffect(() => {
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.card}>
          <div className={styles.badge}>OK</div>
          <p className={styles.kicker}>Payment completed</p>
          <h1 className={styles.title}>Thank you for your purchase</h1>
          <p className={styles.text}>
            We will email your receipt and order updates. If anything seems off, feel free to reach
            out.
          </p>
          {sessionId && <p className={styles.meta}>Transaction ID: {sessionId}</p>}

          <div className={styles.actions}>
            <Link href="/" className={styles.link}>
              Back to catalog
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<section className={styles.section}>Loading...</section>}>
      <SuccessContent />
    </Suspense>
  );
}
