'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import styles from './page.module.css';

function SuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get('session_id');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email.includes('@')) {
      setStatus({ type: 'error', message: 'Please enter a valid email.' });
      return;
    }

    setStatus({
      type: 'success',
      message: 'Thanks! We will send order updates to this email.',
    });
    setEmail('');
  };

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

          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label} htmlFor="email">
              Email for updates
            </label>
            <div className={styles.inputRow}>
              <input
                id="email"
                type="email"
                value={email}
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
              <button type="submit" className={styles.button}>
                Subscribe
              </button>
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
          </form>

          <div className={styles.actions}>
            <Link href="/" className={styles.link}>
              Back to catalog
            </Link>
            <Link href="/cart" className={styles.linkSecondary}>
              View cart
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
