'use client';

import Image from "next/image";
import { useMemo, useState } from "react";
import { buildGalleryAvatarUrl, normalizeImageSrc } from "@/lib/api";
import styles from "./AdminProductTable.module.css";

const fallbackImg = "/images/product.jpg";

const classNames = (...values) => values.filter(Boolean).join(" ");

const deriveProductKey = (product) =>
  product?.productId ??
  product?.product_id ??
  product?.id ??
  product?._id ??
  product?.galleryId ??
  product?.gallery;

const resolveImageSrc = (product) => {
  const key = deriveProductKey(product);
  const avatar = buildGalleryAvatarUrl(key);
  const raw = Array.isArray(product?.img) ? product.img[0] : product?.img;
  const candidates = [avatar, raw, fallbackImg];
  return candidates
    .map((candidate) => normalizeImageSrc(candidate))
    .find(Boolean);
};

const ProductThumb = ({ product, name }) => {
  const initialSrc = useMemo(() => resolveImageSrc(product), [product]);
  const [src, setSrc] = useState(initialSrc || fallbackImg);

  return (
    <Image
      src={src || fallbackImg}
      alt={name || "product"}
      fill
      className={styles.img}
      sizes="64px"
      onError={() => setSrc(fallbackImg)}
    />
  );
};

const deriveStatus = (product) => {
  const rawStatus = product.availabilitystatus || product.availability || "";
  const normalized = String(rawStatus).trim().toLowerCase();

  if (!normalized) return { label: "Unknown", tone: "muted" };
  if (normalized.includes("low")) {
    return { label: rawStatus || "Low stock", tone: "warning" };
  }
  if (normalized.includes("not") || normalized.includes("out")) {
    return { label: rawStatus || "Out of stock", tone: "danger" };
  }
  return { label: rawStatus || "In stock", tone: "success" };
};

const formatPrice = (price) => {
  if (price === undefined || price === null || price === "") return "¢?\"";
  return `CHF ${price}`;
};

const PencilIcon = () => (
  <svg viewBox="0 0 20 20" aria-hidden className={styles.icon}>
    <path
      d="M3 13.5 12.5 4l3.5 3.5L6.5 17H3v-3.5Z"
      fill="currentColor"
    />
    <path
      d="m11.5 5 3.5 3.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 20 20" aria-hidden className={styles.icon}>
    <path
      d="M4.5 6.5h11M13.5 6.5v8a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-8m2.5 0v-2a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function AdminProductTable({
  products = [],
  loading,
  error,
  onEdit,
  onDelete,
  onRefresh,
  disableActions,
  page = 1,
  totalPages = 1,
  total = 0,
  onPageChange,
  title = "All Products",
  subtitle,
}) {
  const renderRow = (product) => {
    const { id, name, category, price, img, materials } = product;
    const status = deriveStatus(product);

    return (
      <div key={id ?? name} className={styles.row}>
        <div className={styles.productCell}>
          <div className={styles.thumb}>
            <ProductThumb product={product} name={name} />
          </div>
          <div className={styles.productText}>
            <p className={styles.name}>{name || "Untitled"}</p>
            <p className={styles.subtle}>{materials || "¢?\""}</p>
          </div>
        </div>
        <div className={styles.cell}>{category || "¢?\""}</div>
        <div className={styles.cell}>{formatPrice(price)}</div>
        <div className={styles.cell}>
          <span className={classNames(styles.status, styles[status.tone])}>
            {status.label}
          </span>
        </div>
        <div className={classNames(styles.cell, styles.actionsCell)}>
          <button
            type="button"
            className={classNames(styles.iconButton, styles.edit)}
            onClick={() => onEdit?.(product)}
            disabled={disableActions}
            aria-label={`Edit ${name || "product"}`}
          >
            <PencilIcon />
          </button>
          <button
            type="button"
            className={classNames(styles.iconButton, styles.danger)}
            onClick={() => onDelete?.(product)}
            disabled={disableActions}
            aria-label={`Delete ${name || "product"}`}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    );
  };

  const infoLine =
    subtitle ||
    (total ? `${total} total ${total === 1 ? "product" : "products"}` : "");

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.kicker}>{title}</p>
          {infoLine && <p className={styles.meta}>{infoLine}</p>}
        </div>
        <div className={styles.panelActions}>
          {onRefresh && (
            <button
              type="button"
              className={classNames(styles.button, styles.ghost)}
              onClick={onRefresh}
              disabled={loading}
            >
              Refresh
            </button>
          )}
        </div>
      </div>

      {loading && <div className={styles.notice}>Loading products...</div>}
      {error && <div className={styles.error}>{error}</div>}

      {!loading && !error && (
        <div className={styles.table}>
          <div className={styles.head}>
            <span>Product</span>
            <span>Category</span>
            <span>Price</span>
            <span>Status</span>
            <span className={styles.alignRight}>Actions</span>
          </div>

          <div className={styles.body}>
            {products.length === 0 ? (
              <div className={styles.empty}>No products found.</div>
            ) : (
              products.map(renderRow)
            )}
          </div>
        </div>
      )}

      <div className={styles.pagination}>
        <button
          type="button"
          className={classNames(styles.button, styles.secondary)}
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
          className={classNames(styles.button, styles.secondary)}
          onClick={() => onPageChange?.(page + 1)}
          disabled={page >= totalPages || disableActions}
        >
          Next
        </button>
      </div>
    </div>
  );
}
