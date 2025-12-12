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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

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

        <nav
          className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}
          aria-label="Main navigation"
          id="main-menu"
        >
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Close menu"
            onClick={closeMenu}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="/" className={styles.navLink} onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/catalog" className={styles.navLink} onClick={closeMenu}>
                Catalog
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/workshops" className={styles.navLink} onClick={closeMenu}>
                Workshops
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/custom-creations" className={styles.navLink} onClick={closeMenu}>
                Custom Creations
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/about" className={styles.navLink} onClick={closeMenu}>
                About
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/contacts" className={styles.navLink} onClick={closeMenu}>
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
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="main-menu"
            onClick={toggleMenu}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>

          <Link
            href="/cart"
            className={`${styles.iconButton} ${styles.cartButton}`}
            aria-label="Open cart"
            data-cart-target
          >
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
      <button
        type="button"
        className={`${styles.backdrop} ${isMenuOpen ? styles.backdropVisible : ''}`}
        aria-hidden="true"
        tabIndex={-1}
        onClick={closeMenu}
      />
    </header>
  );
}
