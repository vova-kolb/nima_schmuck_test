"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/hooks/useCart";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  const router = useRouter();
  const { addItem } = useCart();

  const { img, name, category, materials, price, message, id, discount } = product;
  const placeholder = "/images/product.jpg";

  const rawSrc = Array.isArray(img) && img.length > 0 ? img[0] : placeholder;

  const imageSrc = rawSrc.replace(/^\.?\/?public/, "");
  const isAbsolute = /^https?:\/\//i.test(imageSrc);
  const normalizedSrc = isAbsolute
    ? imageSrc
    : imageSrc
    ? imageSrc.startsWith("/")
      ? imageSrc
      : `/${imageSrc}`
    : placeholder;

  const [displaySrc, setDisplaySrc] = useState(normalizedSrc || placeholder);

  const displayPrice = price ? `${price} CHF` : "";
  const discountValue = Number.parseFloat(discount);
  const hasDiscount = Number.isFinite(discountValue) && discountValue > 0;
  const displayName = name || "Jewelry piece";
  const href = id ? `/products/${encodeURIComponent(id)}` : "#";

  const handleAddToCart = (event) => {
    event.preventDefault();
    addItem(product, 1);
  };

  const handleBuyNow = (event) => {
    event.preventDefault();
    addItem(product, 1);
    router.push("/cart");
  };

  return (
    <article className={styles.card}>
      <Link href={href} className={styles.mediaLink}>
        <div className={styles.media}>
          <Image
            src={displaySrc}
            alt={displayName}
            fill
            className={styles.img}
            sizes="(max-width: 768px) 50vw, 25vw"
            priority={false}
            onError={() => {
              setDisplaySrc(placeholder);
            }}
          />
        </div>
      </Link>

      <div className={styles.info}>
        <div className={styles.headerRow}>
          {category && <p className={styles.category}>{category}</p>}
          {(displayPrice || hasDiscount) && (
            <div className={styles.priceGroup}>
              {displayPrice && <p className={styles.price}>{displayPrice}</p>}
              {hasDiscount && <p className={styles.discount}>-{discountValue}%</p>}
            </div>
          )}
        </div>
        <Link href={href} className={styles.titleLink}>
          <h3 className={styles.title}>{displayName}</h3>
        </Link>
        {materials && <p className={styles.material}>{materials}</p>}
        {message && <p className={styles.message}>{message}</p>}

        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.button} ${styles.secondary}`}
            onClick={handleAddToCart}
          >
            Add to cart
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.primary}`}
            onClick={handleBuyNow}
          >
            Buy now
          </button>
        </div>
      </div>
    </article>
  );
}
