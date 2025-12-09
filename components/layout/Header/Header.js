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
              <Link href="/collections" className={styles.navLink}>
                Collections
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
              <Link href="/contact" className={styles.navLink}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        <div className={styles.actions}>
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
            <svg
              className={styles.cartIcon}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M7 6h-2l2.4 9h9.2l2.4-9h-11.6zm0 0l-1-3h-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="9.5" cy="20" r="1.25" />
              <circle cx="15.5" cy="20" r="1.25" />
            </svg>
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
