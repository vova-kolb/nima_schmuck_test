import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProductById } from "@/lib/api";
import ProductActions from "@/components/products/ProductActions";
import ProductGallery from "@/components/products/ProductGallery";
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
    description,
    featured,
    img = [],
    galleryId: productGalleryId,
  } = product;

  const availabilityStatus =
    product.availabilityStatus ?? product.availabilitystatus ?? "";
  const galleryId = name || productGalleryId || productId;

  const basePrice = Number.parseFloat(price);
  const hasPrice = Number.isFinite(basePrice);
  const discountValue = Number.parseFloat(discount);
  const hasDiscount = hasPrice && Number.isFinite(discountValue) && discountValue > 0;
  const oldPrice = hasPrice ? `${basePrice.toFixed(2)} CHF` : "";
  const newPrice = hasDiscount
    ? `${(basePrice * (1 - discountValue / 100)).toFixed(2)} CHF`
    : oldPrice;

  return (
    <section className={`${styles.section} reveal-up reveal-delay-sm`}>
      <div className="container">
        <Link href="/" className={styles.backLink}>
          <span aria-hidden="true">&larr;</span> Back to catalog
        </Link>

        <div className={styles.layout}>
          <div className={`${styles.media} reveal-up reveal-delay-md`}>
            <ProductGallery name={name} galleryId={galleryId} images={img} />
          </div>

          <div className={`${styles.info} reveal-up reveal-delay-lg`}>
            {category && <p className={styles.meta}>{category}</p>}
            <h1 className={styles.title}>{name || "Product"}</h1>

            <div className={styles.badges}>
              {availability && (
                <span className={styles.badge}>Availability: {availability}</span>
              )}
              {availabilityStatus && (
                <span className={styles.badge}>{availabilityStatus}</span>
              )}
              {featured && <span className={styles.badge}>Featured</span>}
            </div>

            {description && <p className={styles.description}>{description}</p>}
            {materials && <p className={styles.infoLine}>Materials: {materials}</p>}

            <div className={styles.priceRow}>
              {hasDiscount ? (
                <>
                  <span className={styles.priceOldWrap}>
                    <span className={`${styles.price} ${styles.priceOld}`}>{oldPrice}</span>
                    <span className={styles.priceDiscountBadge}>-{discountValue}%</span>
                  </span>
                  <span className={styles.priceNew}>{newPrice}</span>
                </>
              ) : hasPrice ? (
                <span className={styles.price}>{oldPrice}</span>
              ) : null}
            </div>

            <ProductActions product={product} />
          </div>
        </div>
      </div>
    </section>
  );
}
