'use client';

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/hooks/useCart";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  const router = useRouter();
  const { addItem } = useCart();

  const { img, name, category, materials, price, message, id } = product;

  const rawSrc =
    Array.isArray(img) && img.length > 0 ? img[0] : "/images/product.jpg";

  const imageSrc = rawSrc.replace(/^\.?\/?public/, "");
  const normalizedSrc = imageSrc
    ? imageSrc.startsWith("/")
      ? imageSrc
      : `/${imageSrc}`
    : "/images/product.jpg";

  const displayPrice = price ? `${price} CHF` : "";
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
            src={normalizedSrc}
            alt={displayName}
            fill
            className={styles.img}
            sizes="(max-width: 768px) 50vw, 25vw"
            priority={false}
          />
        </div>
      </Link>

      <div className={styles.info}>
        <div className={styles.headerRow}>
          {category && <p className={styles.category}>{category}</p>}
          {displayPrice && <p className={styles.price}>{displayPrice}</p>}
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
