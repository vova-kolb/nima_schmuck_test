"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchAdminSession } from "@/lib/auth";
import LogoutButton from "@/components/admin/LogoutButton";
import styles from "./layout.module.css";

export default function ProtectedAdminLayout({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const skipAuth = process.env.NEXT_PUBLIC_SKIP_ADMIN_AUTH !== "false";

  useEffect(() => {
    let active = true;
    const check = async () => {
      if (skipAuth) {
        setAuthenticated(true);
        setChecking(false);
        return;
      }

      const { authenticated: ok } = await fetchAdminSession();
      if (!active) return;
      if (ok) {
        setAuthenticated(true);
      } else {
        router.replace("/admin/login");
      }
      setChecking(false);
    };
    check();
    return () => {
      active = false;
    };
  }, [router, skipAuth]);

  if (checking) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.topBar}>
          <div className="container">
            <div className={styles.topBarInner}>
              <div className={styles.brandRow}>
                <Image
                  src="/images/logo-sm.svg"
                  alt="Nima Schmuck"
                  width={120}
                  height={36}
                  className={styles.logo}
                />
                <span className={styles.brandLabel}>Admin Panel</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.content}>
          <div className="container">
            <p>Checking session...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBar}>
        <div className="container">
          <div className={styles.topBarInner}>
            <div className={styles.brandRow}>
              <Image
                src="/images/logo-sm.svg"
                alt="Nima Schmuck"
                width={120}
                height={36}
                className={styles.logo}
              />
              <span className={styles.brandLabel}>Admin Panel</span>
            </div>
            <div className={styles.actions}>
              <div className={styles.navLinks}>
                <Link href="/admin/products" className={styles.navLink}>
                  Products
                </Link>
                <Link href="/admin/hero" className={styles.navLink}>
                  Hero
                </Link>
              </div>
              <Link href="/" className={styles.backButton}>
                Back to web
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
