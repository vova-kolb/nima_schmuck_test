"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./WorkshopsList.module.css";

const META_ICONS = {
  date: "/images/calendar.svg",
  duration: "/images/clock.svg",
  participants: "/images/participants.svg",
};

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
  const meta = workshop.meta || [];

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
          {meta.map((item) => (
            <li key={item.key} className={styles.metaItem}>
              <img src={item.icon} alt="" className={styles.metaIcon} loading="lazy" />
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

  const normalizedWorkshops = useMemo(
    () =>
      (workshops || []).map((item, index) => {
        const images = Array.isArray(item?.img)
          ? item.img
          : typeof item?.image === "string" && item.image.trim()
          ? [item.image]
          : [];
        const imageSrc = normalizeSrc(images[0] || FALLBACK_IMAGE);
        const id =
          item?.id ??
          item?._id ??
          item?.productId ??
          item?.product_id ??
          `workshop-${index}`;
        const customHref = typeof item?.href === "string" ? item.href.trim() : "";
        const rawDiscount = Number.parseFloat(item?.discount);
        const hasDiscount = Number.isFinite(rawDiscount) && rawDiscount > 0;
        const dateLabel = formatDate(item?.materials);
        const durationLabel = formatDuration(item?.stone);
        const participantsLabel = formatParticipants(item?.typeofmessage);
        const meta = [
          dateLabel && { key: "date", label: dateLabel, icon: META_ICONS.date },
          durationLabel && { key: "duration", label: durationLabel, icon: META_ICONS.duration },
          participantsLabel && {
            key: "participants",
            label: participantsLabel,
            icon: META_ICONS.participants,
          },
        ].filter(Boolean);

        return {
          id,
          href: customHref || (id ? `/workshops/${encodeURIComponent(id)}` : "#"),
          name: item?.name || "Jewelry Workshop",
          description: item?.description?.trim() || FALLBACK_DESCRIPTION,
          image: imageSrc,
          price: item?.price ? `${item.price} CHF` : "60 CHF",
          discount: hasDiscount ? rawDiscount : null,
          meta,
        };
      }),
    [workshops]
  );

  const hasWorkshops = normalizedWorkshops.length > 0;

  return (
    <section
      className={`${styles.cardsSection} reveal-up reveal-after-hero`}
      aria-labelledby="workshops-heading"
    >
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
