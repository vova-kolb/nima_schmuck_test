import Link from 'next/link';
import styles from './page.module.css';

export default function CheckoutPage() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.card}>
          <p className={styles.kicker}>Checkout</p>
          <h1 className={styles.title}>Coming soon</h1>
          <p className={styles.text}>
            We are getting the checkout experience ready. In the meantime, you can
            review your cart or continue shopping.
          </p>
          <div className={styles.actions}>
            <Link href="/cart" className={styles.link}>
              Back to cart
            </Link>
            <Link href="/" className={styles.linkSecondary}>
              Keep shopping
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
