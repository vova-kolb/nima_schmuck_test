import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProductById } from "@/lib/api";
import ProductActions from "@/components/products/ProductActions";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params = {} }) {
  const resolvedParams = await params;
  const rawId = resolvedParams?.id;
  const productId = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!productId) {
    notFound();
  }

  const product = await fetchProductById(String(productId));

  if (!product) {
    notFound();
  }

  const {
    name,
    category,
    materials,
    price,
    discount,
    availability,
    availabilityStatus,
    stone,
    typeOfMessage,
    message,
    description,
    featured,
    img = [],
  } = product;

  const mainImage = img[0] || "/images/product.jpg";

  return (
    <section className={styles.section}>
      <div className="container">
        <Link href="/" className={styles.backLink}>
          <span aria-hidden="true">&larr;</span> Back to catalog
        </Link>

        <div className={styles.layout}>
          <div className={styles.media}>
            <div className={styles.imageWrapper}>
              <Image
                src={mainImage}
                alt={name || "Product image"}
                fill
                className={styles.image}
                sizes="(max-width: 900px) 90vw, 520px"
                priority
              />
            </div>

            {img.length > 1 && (
              <div className={styles.thumbRow}>
                {img.slice(1).map((src, idx) => (
                  <div key={src + idx} className={styles.thumb}>
                    <Image
                      src={src}
                      alt={`${name || "Product"} thumbnail ${idx + 1}`}
                      fill
                      className={styles.image}
                      sizes="120px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.info}>
            {category && <p className={styles.meta}>{category}</p>}
            <h1 className={styles.title}>{name || "Product"}</h1>
            {materials && <p className={styles.meta}>Materials: {materials}</p>}
            {stone && <p className={styles.meta}>Stone: {stone}</p>}

            <div className={styles.priceRow}>
              {price !== undefined && (
                <span className={styles.price}>{price} CHF</span>
              )}
              {discount && (
                <span className={styles.discount}>-{discount}%</span>
              )}
            </div>

            <div className={styles.badges}>
              {availability && (
                <span className={styles.badge}>
                  Availability: {availability}
                </span>
              )}
              {availabilityStatus && (
                <span className={styles.badge}>{availabilityStatus}</span>
              )}
              {featured && <span className={styles.badge}>Featured</span>}
            </div>

            {description && <p className={styles.description}>{description}</p>}

            {message && (
              <div className={styles.messageBlock}>
                {typeOfMessage && (
                  <p className={styles.meta}>Type: {typeOfMessage}</p>
                )}
                <p className={styles.message}>"{message}"</p>
              </div>
            )}

            <ProductActions product={product} />
          </div>
        </div>
      </div>
    </section>
  );
}
