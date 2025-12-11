import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProductById } from "@/lib/api";
import BookingForm from "@/components/workshops/BookingForm";
import WorkshopGallery from "@/components/workshops/WorkshopGallery";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const FALLBACK_IMAGE = "/images/workshops-hero.jpg";

export default async function WorkshopDetailPage({ params = {} }) {
  const resolved = await params;
  const rawId = resolved?.id;
  const workshopId = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!workshopId) notFound();

  const product = await fetchProductById(String(workshopId));
  if (!product) notFound();

  const isWorkshop =
    String(product.category || "").toLowerCase() === "workshop";
  if (!isWorkshop) notFound();

  const images = Array.isArray(product.img) ? product.img : [];
  const galleryId =
    product.productId ??
    product.product_id ??
    product.gallery ??
    product.galleryId ??
    product.id ??
    workshopId;

  const name = product.name || "Workshop";
  const price = product.price ? `${product.price} CHF` : "60 CHF";
  const discountValue = Number.parseFloat(product.discount);
  const hasDiscount = Number.isFinite(discountValue) && discountValue > 0;
  const description =
    product.description ||
    "Design and craft a unique pendant that reflects your personal style and vision.";

  const formatDate = (value) => {
    if (!value) return "";
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) return "";
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(parsed));
  };
  const formatDuration = (value) => {
    if (value === undefined || value === null || value === "") return "";
    const num = Number(value);
    if (Number.isFinite(num)) {
      const unit = num === 1 ? "hour" : "hours";
      return `${num} ${unit}`;
    }
    return String(value);
  };
  const formatParticipants = (value) => {
    if (value === undefined || value === null || value === "") return "";
    const num = Number(value);
    if (Number.isFinite(num)) {
      const unit = num === 1 ? "participant" : "participants";
      return `${num} ${unit}`;
    }
    return String(value);
  };

  const metaItems = [
    { key: "date", label: formatDate(product.materials), Icon: CalendarIcon },
    { key: "duration", label: formatDuration(product.stone), Icon: ClockIcon },
    { key: "participants", label: formatParticipants(product.typeofmessage), Icon: UsersIcon },
  ].filter((item) => item.label);

  return (
    <section className={styles.section}>
      <div className="container">
        <Link href="/workshops" className={styles.backLink}>
          <span aria-hidden="true">{"<"}</span> Back to workshops
        </Link>

        <div className={styles.layout}>
          <div className={styles.media}>
            <WorkshopGallery name={name} galleryId={galleryId} images={images} />
          </div>

          <div className={styles.info}>
            <h1 className={styles.title}>{name}</h1>
            <div className={styles.priceRow}>
              <p className={styles.price}>{price}</p>
              {hasDiscount && <span className={styles.discount}>-{discountValue}%</span>}
            </div>

            <ul className={styles.metaList}>
              {metaItems.map((item) => (
                <li key={item.key} className={styles.metaItem}>
                  <item.Icon className={styles.metaIcon} />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>

            <p className={styles.description}>{description}</p>

            <BookingForm workshopName={name} />
          </div>
        </div>
      </div>
    </section>
  );
}

function CalendarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect
        x="3"
        y="4"
        width="18"
        height="18"
        rx="2.5"
        ry="2.5"
        strokeWidth="1.5"
      />
      <path
        d="M8 2.5v4.5M16 2.5v4.5M3 11h18"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
      <path
        d="M12 7v5l3 2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UsersIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M7.5 14.5c-2.2.2-4 1.9-4 4.1V20h9.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM17 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        strokeWidth="1.5"
      />
      <path
        d="M15.5 15.2c2.2.2 3.9 1.9 3.9 4.1V20h-4.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
