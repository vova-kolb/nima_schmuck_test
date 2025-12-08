"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logoutAdmin } from "@/lib/auth";
import styles from "./LogoutButton.module.css";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setLoading(true);
    setError("");
    try {
      await logoutAdmin();
      router.replace("/admin/login");
      router.refresh();
    } catch (e) {
      setError(e?.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        className={styles.button}
        onClick={handleLogout}
        disabled={loading}
      >
        {loading ? "Signing out…" : "Logout"}
      </button>
      {error ? <span className={styles.error}>{error}</span> : null}
    </div>
  );
}
