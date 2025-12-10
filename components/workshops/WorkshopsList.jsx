"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./WorkshopsList.module.css";

const META_ITEMS = [
  { key: "date", label: "January 22, 2026", Icon: CalendarIcon },
  { key: "duration", label: "2 hours", Icon: ClockIcon },
  { key: "participants", label: "10 participants", Icon: UsersIcon },
];

const FALLBACK_DESCRIPTION =
  "Design and craft a unique pendant that reflects your personal style and vision.";
const FALLBACK_IMAGE = "/images/workshops-hero.jpg";

const normalizeSrc = (src) => {
  if (!src) return FALLBACK_IMAGE;
  const trimmed = String(src).trim();
  if (!trimmed) return FALLBACK_IMAGE;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const cleaned = trimmed.replace(/^\.?\/?public/, "");
  return cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
};

function WorkshopCard({ workshop, onBook }) {
  const [src, setSrc] = useState(workshop.image || FALLBACK_IMAGE);
  const discountValue = Number.parseFloat(workshop.discount);
  const hasDiscount = Number.isFinite(discountValue) && discountValue > 0;

  return (
    <article className={styles.card}>
      <Link href={workshop.href} className={styles.media}>
        <Image
          src={src || FALLBACK_IMAGE}
          alt={workshop.name}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          className={styles.cardImage}
          priority={false}
          onError={() => setSrc(FALLBACK_IMAGE)}
        />
      </Link>

      <div className={styles.cardBody}>
        <Link href={workshop.href} className={styles.titleLink}>
          <h3 className={styles.cardTitle}>{workshop.name}</h3>
        </Link>
        <p className={styles.description}>{workshop.description}</p>

        <ul className={styles.metaList}>
          {META_ITEMS.map((item) => (
            <li key={item.key} className={styles.metaItem}>
              <item.Icon className={styles.metaIcon} />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>

        <div className={styles.cardFooter}>
          <div className={styles.priceGroup}>
            <span className={styles.price}>{workshop.price}</span>
            {hasDiscount && <span className={styles.discount}>-{discountValue}%</span>}
          </div>
          <button
            type="button"
            className={styles.bookButton}
            onClick={() => onBook(workshop.name)}
          >
            Book Now
          </button>
        </div>
      </div>
    </article>
  );
}

export default function WorkshopsList({ workshops = [], onBook = () => {} }) {
  const normalizedWorkshops = useMemo(
    () =>
      (workshops || []).map((item, index) => {
        const images = Array.isArray(item?.img) ? item.img : [];
        const imageSrc = normalizeSrc(images[0] || FALLBACK_IMAGE);
        const id =
          item?.id ??
          item?._id ??
          item?.productId ??
          item?.product_id ??
          `workshop-${index}`;
        const rawDiscount = Number.parseFloat(item?.discount);
        const hasDiscount = Number.isFinite(rawDiscount) && rawDiscount > 0;

        return {
          id,
          href: id ? `/workshops/${encodeURIComponent(id)}` : "#",
          name: item?.name || "Jewelry Workshop",
          description: item?.description?.trim() || FALLBACK_DESCRIPTION,
          image: imageSrc,
          price: item?.price ? `${item.price} CHF` : "60 CHF",
          discount: hasDiscount ? rawDiscount : null,
        };
      }),
    [workshops]
  );

  const hasWorkshops = normalizedWorkshops.length > 0;

  return (
    <section className={styles.cardsSection} aria-labelledby="workshops-heading">
      <div className="container">
        <div className={styles.cardsHeader}>
          <p className={styles.kicker}>Learn & Create</p>
          <h1 id="workshops-heading" className={styles.sectionTitle}>
            Jewelry Workshops
          </h1>
          <p className={styles.sectionSubtitle}>
            Join intimate sessions where you will design and craft jewelry with expert guidance,
            premium materials, and a relaxed studio atmosphere.
          </p>
        </div>

        {!hasWorkshops && (
          <p className={styles.status}>Workshops will be announced soon. Stay tuned!</p>
        )}

        {hasWorkshops && (
          <div className={styles.grid}>
            {normalizedWorkshops.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} onBook={onBook} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CalendarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2.5" ry="2.5" strokeWidth="1.5" />
      <path d="M8 2.5v4.5M16 2.5v4.5M3 11h18" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
      <path d="M12 7v5l3 2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
