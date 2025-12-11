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
  const rawList = Array.isArray(product?.img) ? product.img : [product?.img];
  const rawAvatar = rawList.find(
    (src) => typeof src === "string" && src.toLowerCase().includes("avatar")
  );
  const raw = rawAvatar || rawList.find(Boolean);
  const candidates = [avatar, raw, fallbackImg];
  return candidates.map((candidate) => normalizeImageSrc(candidate)).find(Boolean);
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
  const rawStatus =
    product.availabilitystatus ??
    product.availabilityStatus ??
    product.availability_status ??
    "";

  const normalized = String(rawStatus).trim().toLowerCase();

  if (!normalized) return { label: "no status", tone: "muted" };
  if (normalized.includes("request")) {
    return { label: rawStatus || "On Request", tone: "warning" };
  }
  if (normalized.includes("low")) {
    return { label: rawStatus || "Low stock", tone: "warning" };
  }
  if (normalized.includes("not") || normalized.includes("out")) {
    return { label: rawStatus || "Not available", tone: "danger" };
  }
  return { label: rawStatus || "In stock", tone: "success" };
};

const formatPrice = (price, discount) => {
  if (price === undefined || price === null || price === "") return "—";
  const priceLabel = `CHF ${price}`;
  const discountValue = Number.parseFloat(discount);
  const hasDiscount = Number.isFinite(discountValue) && discountValue > 0;
  return hasDiscount ? `${priceLabel} (-${discountValue}%)` : priceLabel;
};

const formatDuration = (value) => {
  if (value === undefined || value === null || value === "") return "—";
  const num = Number(value);
  if (Number.isFinite(num)) {
    const unit = num === 1 ? "hour" : "hours";
    return `${num} ${unit}`;
  }
  return value;
};

const PencilIcon = () => (
  <svg viewBox="0 0 20 20" aria-hidden className={styles.icon}>
    <path d="M3 13.5 12.5 4l3.5 3.5L6.5 17H3v-3.5Z" fill="currentColor" />
    <path d="m11.5 5 3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
  variant = "product",
}) {
  const isWorkshop = variant === "workshop";
  const tableClass = classNames(styles.table, isWorkshop && styles.workshop);

  const renderRow = (product) => {
    const { id, name, category, price, materials } = product;
    const status = deriveStatus(product);
    const dateValue =
      product.date ??
      product.workshopDate ??
      product.workshopdate ??
      product.dateTime ??
      product.datetime ??
      product.scheduledDate ??
      (variant === "workshop" ? product.materials : undefined) ??
      "";
    const duration =
      product.duration ??
      product.durationHours ??
      product.durationhours ??
      product.length ??
      product.time ??
      (variant === "workshop" ? product.stone : undefined) ??
      "";

    return (
      <div key={id ?? name} className={classNames(styles.row, isWorkshop && styles.workshopRow)}>
        <div className={styles.productCell}>
          <div className={styles.thumb}>
            <ProductThumb product={product} name={name} />
          </div>
          <div className={styles.productText}>
            <p className={styles.name}>{name || "Untitled"}</p>
            {!isWorkshop && <p className={styles.subtle}>{materials || "—"}</p>}
          </div>
        </div>
        <div className={styles.cell}>{isWorkshop ? dateValue || "—" : category || "—"}</div>
        {isWorkshop && <div className={styles.cell}>{formatDuration(duration)}</div>}
        <div className={styles.cell}>{formatPrice(price, product.discount)}</div>
        <div className={styles.cell}>
          <span className={classNames(styles.status, styles[status.tone])}>{status.label}</span>
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

  const infoLine = subtitle || (total ? `${total} total ${total === 1 ? "product" : "products"}` : "");

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
        <div className={tableClass}>
          <div className={classNames(styles.head, isWorkshop && styles.workshopHead)}>
            <span>{isWorkshop ? "Workshop" : "Product"}</span>
            <span>{isWorkshop ? "Date" : "Category"}</span>
            {isWorkshop && <span>Duration</span>}
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
