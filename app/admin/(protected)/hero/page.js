"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import HeroForm from "@/components/admin/HeroForm";
import { createHero, deleteHero, fetchHeroes } from "@/lib/heroApi";
import styles from "./page.module.css";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function AdminHeroPage() {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const totalHeroes = useMemo(() => heroes.length, [heroes]);

  const loadHeroes = async () => {
    setLoading(true);
    setError("");
    try {
      const list = await fetchHeroes();
      setHeroes(list);
    } catch (e) {
      setError("Unable to load heroes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHeroes();
  }, []);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      setFormOpen(false);
      setActionError("");
    }
  };

  const handleCreate = async (payload) => {
    setSubmitting(true);
    setActionError("");
    try {
      await createHero(payload);
      await loadHeroes();
      setFormOpen(false);
    } catch (e) {
      setActionError("Failed to create hero.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (hero) => {
    if (!hero?.id) return;
    const confirmed = window.confirm(
      `Delete hero "${hero.heroheader || hero.id}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setSubmitting(true);
    setActionError("");
    try {
      await deleteHero(hero.id);
      await loadHeroes();
    } catch (e) {
      setActionError("Failed to delete hero.");
    } finally {
      setSubmitting(false);
    }
  };

  const heroRows = heroes.map((hero) => {
    const canEdit = hero?.id !== undefined && hero?.id !== null;
    const editHref = canEdit ? `/admin/hero/${hero.id}` : "#";

    return (
      <div key={hero.id ?? hero.heroheader} className={styles.row}>
        <div className={styles.cell}>
          <p className={styles.name}>{hero.heroheader || "Untitled hero"}</p>
          <p className={styles.subtle}>ID: {hero.id ?? "-"}</p>
        </div>
        <div className={styles.cell}>{hero.targeturl || "-"}</div>
        <div className={styles.cell}>{formatDate(hero.created_at)}</div>
        <div className={styles.cell}>
          <span className={styles.badge}>{hero.heroimg_count ?? 0}</span>
        </div>
        <div className={`${styles.cell} ${styles.actionsCell}`}>
          <Link
            href={editHref}
            className={`${styles.button} ${styles.secondary}`}
            aria-disabled={!canEdit}
            onClick={(event) => {
              if (!canEdit) {
                event.preventDefault();
              }
            }}
          >
            Edit
          </Link>
          <button
            type="button"
            className={`${styles.button} ${styles.danger}`}
            onClick={() => handleDelete(hero)}
            disabled={submitting || !canEdit}
          >
            Delete
          </button>
        </div>
      </div>
    );
  });

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.pageHeader}>
          <div>
            <p className={styles.kicker}>Admin</p>
            <h1 className={styles.title}>Hero banners</h1>
            <p className={styles.subtitle}>
              Manage the hero headline, destination, and supporting titles for your storefront.
            </p>
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={`${styles.button} ${styles.ghost}`}
              onClick={loadHeroes}
              disabled={loading || submitting}
            >
              Refresh
            </button>
            <button
              type="button"
              className={`${styles.button} ${styles.primary}`}
              onClick={() => {
                setFormOpen(true);
                setActionError("");
              }}
              disabled={submitting}
            >
              + Create new hero
            </button>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.kicker}>All heroes</p>
              <p className={styles.meta}>
                {totalHeroes} hero{totalHeroes === 1 ? "" : "es"} configured
              </p>
            </div>
          </div>

          {loading && <div className={styles.notice}>Loading heroes...</div>}
          {error && <div className={styles.error}>{error}</div>}
          {actionError && !loading && <div className={styles.error}>{actionError}</div>}

          {!loading && !error && (
            <div className={styles.table}>
              <div className={styles.head}>
                <span>Hero header</span>
                <span>Target URL</span>
                <span>Created</span>
                <span>Images</span>
                <span className={styles.alignRight}>Actions</span>
              </div>
              <div className={styles.body}>
                {heroes.length === 0 ? (
                  <div className={styles.empty}>No heroes yet.</div>
                ) : (
                  heroRows
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {formOpen && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          onClick={handleOverlayClick}
        >
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div>
                <p className={styles.modalKicker}>Create</p>
                <h3 className={styles.modalTitle}>New hero</h3>
              </div>
              <button
                type="button"
              className={styles.closeButton}
              onClick={() => setFormOpen(false)}
              aria-label="Close form"
            >
              x
            </button>
            </div>
            <HeroForm
              mode="create"
              onSubmit={handleCreate}
              onCancel={() => setFormOpen(false)}
              submitting={submitting}
              serverError={actionError}
            />
          </div>
        </div>
      )}
    </section>
  );
}
