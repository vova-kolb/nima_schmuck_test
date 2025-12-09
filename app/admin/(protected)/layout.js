"use client";

import { useEffect, useState } from "react";
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
              <span className={styles.brand}>Admin</span>
            </div>
          </div>
        </div>
        <div className={styles.content}>
          <div className="container">
            <p>Checking session…</p>
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
            <span className={styles.brand}>Admin</span>
            <LogoutButton />
          </div>
        </div>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
