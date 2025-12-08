"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAdminSession, loginAdmin } from "@/lib/auth";
import styles from "./page.module.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      const { authenticated } = await fetchAdminSession();
      if (!active) return;
      if (authenticated) {
        router.replace("/admin/products");
      } else {
        setCheckingSession(false);
      }
    };

    checkSession();

    return () => {
      active = false;
    };
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await loginAdmin({ email, password });
      router.replace("/admin/products");
      router.refresh();
    } catch (e) {
      setError(e?.message || "Unable to log in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const disabled = submitting || checkingSession;

  return (
    <section className={styles.page}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.card}>
            <h1 className={styles.title}>Admin login</h1>
            {/* <p className={styles.subtitle}>
              Sign in to manage products and inventory. Your session is secured
              with server-side cookies.
            </p> */}

            <form onSubmit={handleSubmit} className={styles.formGroup}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={disabled}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={disabled}
                />
              </div>

              <div className={styles.actions}>
                <button
                  type="submit"
                  className={styles.button}
                  disabled={disabled}
                >
                  {submitting ? "Signing in…" : "Sign in"}
                </button>
                {checkingSession && (
                  <p className={styles.status}>Checking session…</p>
                )}
              </div>

              {error ? <div className={styles.error}>{error}</div> : null}
            </form>
          </div>

          {/* <div className={styles.hero}>
            <div className={styles.badge}>Admin area</div>
            <h2 className={styles.heroTitle}>Secure access for staff</h2>
            <p className={styles.heroText}>
              Authentication is handled through HTTP-only session cookies. No
              tokens stored in the browser, and no data saved to localStorage.
            </p>
            <p className={styles.heroText}>
              Once signed in, you can manage the product catalog and keep the
              storefront in sync with the latest inventory changes.
            </p>
          </div> */}
        </div>
      </div>
    </section>
  );
}
