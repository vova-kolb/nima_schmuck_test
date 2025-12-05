'use client';

import Image from "next/image";
import styles from "./AdminProductTable.module.css";

const fallbackImg = "/images/product.jpg";

export default function AdminProductTable({
  products,
  loading,
  error,
  onEdit,
  onDelete,
  onRefresh,
  disableActions,
  page = 1,
  totalPages = 1,
  onPageChange,
}) {
  const renderRow = (product) => {
    const {
      id,
      name,
      category,
      price,
      availability,
      discount,
      featured,
      img,
    } = product;
    const rawImage = (Array.isArray(img) ? img[0] : img) || fallbackImg;
    const imageSrc =
      typeof rawImage === "string" && rawImage.startsWith("http")
        ? rawImage
        : rawImage.startsWith("/")
          ? rawImage
          : `/${rawImage}`;

    return (
      <div key={id ?? name} className={styles.row}>
        <div className={styles.cellImage}>
          <div className={styles.thumb}>
            <Image
              src={imageSrc.startsWith("/") ? imageSrc : `/${imageSrc}`}
              alt={name || "product"}
              fill
              className={styles.img}
              sizes="64px"
            />
          </div>
        </div>
        <div className={styles.cell}>
          <p className={styles.name}>{name || "Untitled"}</p>
          <p className={styles.meta}>
            {category || "—"} · CHF {price ?? "—"}
          </p>
        </div>
        <div className={styles.cell}>
          <span className={styles.badge}>{availability || "n/a"}</span>
        </div>
        <div className={styles.cell}>
          <span className={styles.muted}>{discount || 0}% off</span>
          {featured && <span className={styles.featured}>Featured</span>}
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.button} ${styles.secondary}`}
            onClick={() => onEdit?.(product)}
            disabled={disableActions}
          >
            Edit
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.danger}`}
            onClick={() => onDelete?.(product)}
            disabled={disableActions}
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.kicker}>Products</p>
          <h3 className={styles.title}>Inventory overview</h3>
        </div>
        <div className={styles.panelActions}>
          {onRefresh && (
            <button
              type="button"
              className={`${styles.button} ${styles.ghost}`}
              onClick={onRefresh}
            >
              Refresh
            </button>
          )}
        </div>
      </div>

      {loading && <div className={styles.notice}>Loading products…</div>}
      {error && <div className={styles.error}>{error}</div>}

      {!loading && !error && products.length === 0 && (
        <div className={styles.notice}>No products found.</div>
      )}

      <div className={styles.table}>{products.map(renderRow)}</div>

      <div className={styles.pagination}>
        <button
          type="button"
          className={`${styles.button} ${styles.secondary}`}
          onClick={() => onPageChange?.(page - 1)}
          disabled={page <= 1 || disableActions}
        >
          Prev
        </button>
        <span className={styles.pageInfo}>
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          className={`${styles.button} ${styles.secondary}`}
          onClick={() => onPageChange?.(page + 1)}
          disabled={page >= totalPages || disableActions}
        >
          Next
        </button>
      </div>
    </div>
  );
}
