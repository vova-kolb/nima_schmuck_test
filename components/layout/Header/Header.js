'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@/lib/hooks/useCart';
import { fetchAdminSession } from '@/lib/auth';
import styles from './Header.module.css';

export default function Header() {
  const { totalCount } = useCart();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;
    const check = async () => {
      const { authenticated } = await fetchAdminSession();
      if (!active) return;
      setIsAdmin(Boolean(authenticated));
    };
    check();
    return () => {
      active = false;
    };
  }, []);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.container}`}>
        <div className={styles.brand}>
          <Link href="/" aria-label="Go to home page">
            <Image
              src="/images/logo-sm.svg"
              alt="Nima Schmuck"
              className={styles.logoImage}
              width={140}
              height={40}
              priority
            />
          </Link>
        </div>

        <nav className={styles.nav} aria-label="Main navigation">
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="/" className={styles.navLink}>
                Home
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/catalog" className={styles.navLink}>
                Catalog
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/workshops" className={styles.navLink}>
                Workshops
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/custom-creations" className={styles.navLink}>
                Custom Creations
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/about" className={styles.navLink}>
                About
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/contacts" className={styles.navLink}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        <div className={styles.actions}>
          {isAdmin && (
            <Link href="/admin/products" className={styles.navLink}>
              Admin
            </Link>
          )}
          <button
            type="button"
            className={`${styles.iconButton} ${styles.burgerButton}`}
            aria-label="Open menu"
          >
            <span />
            <span />
            <span />
          </button>

          <Link href="/cart" className={`${styles.iconButton} ${styles.cartButton}`} aria-label="Open cart">
            <Image
              src="/images/cart-icon.svg"
              alt="Cart icon"
              width={36}
              height={36}
              className={styles.cartIcon}
              priority={false}
            />
            {totalCount > 0 && (
              <span className={styles.cartBadge} aria-label={`${totalCount} items in cart`}>
                {totalCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
