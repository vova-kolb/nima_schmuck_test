"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/lib/hooks/useCart";
import { buildLocalProductImages } from "@/lib/api";
import { flyToCart } from "@/lib/cartAnimation";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  const router = useRouter();
  const { addItem, items } = useCart();

  const { img, name, category, materials, price, message, id, discount } = product;
  const placeholder = "/images/product.jpg";
  const addButtonRef = useRef(null);

  const galleryKey =
    product?.galleryId ??
    product?.productId ??
    product?.product_id ??
    product?.id ??
    product?._id ??
    null;
  const { avatar, images } = useMemo(
    () => buildLocalProductImages({ ...product, galleryId: galleryKey }),
    [product, galleryKey]
  );
  const primarySrc = avatar || images?.[0] || placeholder;
  const [displaySrc, setDisplaySrc] = useState(primarySrc);

  useEffect(() => {
    setDisplaySrc(primarySrc || placeholder);
  }, [primarySrc, product?.id]);

  const basePrice = Number.parseFloat(price);
  const hasPrice = Number.isFinite(basePrice);
  const oldPrice = hasPrice ? `${basePrice.toFixed(2)} CHF` : "";
  const discountValue = Number.parseFloat(discount);
  const hasDiscount = hasPrice && Number.isFinite(discountValue) && discountValue > 0;
  const newPrice = hasDiscount
    ? `${(basePrice * (1 - discountValue / 100)).toFixed(2)} CHF`
    : oldPrice;
  const displayName = name || "Jewelry piece";
  const href = id ? `/products/${encodeURIComponent(id)}` : "#";
  const isInCart = useMemo(
    () => (id ? items.some((item) => item.id === id) : false),
    [items, id]
  );

  const handleAddToCart = (event) => {
    event.preventDefault();
    if (!product || isInCart) return;
    addItem(product, 1);
    flyToCart(addButtonRef.current);
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
        </div>
        <Link href={href} className={styles.titleLink}>
          <h3 className={styles.title}>{displayName}</h3>
        </Link>
        {materials && <p className={styles.material}>{materials}</p>}
        {message && <p className={styles.message}>{message}</p>}

        {hasPrice && (
          <div className={styles.priceRow}>
            {hasDiscount ? (
              <>
                <span className={styles.priceOldWrap}>
                  <span className={`${styles.price} ${styles.priceOld}`}>{oldPrice}</span>
                  <span className={styles.priceDiscountBadge}>-{discountValue}%</span>
                </span>
                <span className={styles.priceNew}>{newPrice}</span>
              </>
            ) : (
              <span className={styles.price}>{oldPrice}</span>
            )}
          </div>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.button} ${styles.secondary}`}
            disabled={isInCart}
            onClick={handleAddToCart}
            ref={addButtonRef}
          >
            {isInCart ? "Added" : "Add to cart"}
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
