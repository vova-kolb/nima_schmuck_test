// javascript
import Link from "next/link";
import Image from "next/image";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
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

  return (
    <Link href={href} className={styles.cardLink}>
      <article className={styles.card}>
        <div className={styles.media}>
          <Image
            src={normalizedSrc}
            alt={displayName}
            fill
            className={styles.img}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>

        <div className={styles.info}>
          {category && <p className={styles.category}>{category}</p>}
          <h3 className={styles.title}>{displayName}</h3>
          {materials && <p className={styles.material}>{materials}</p>}
          {message && <p className={styles.message}>{message}</p>}
          {displayPrice && <p className={styles.price}>{displayPrice}</p>}
        </div>
      </article>
    </Link>
  );
}
