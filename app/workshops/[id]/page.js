import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { fetchProductById } from "@/lib/api";
import BookingForm from "@/components/workshops/BookingForm";
import { getFallbackWorkshopById } from "@/lib/fallbackWorkshops";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const FALLBACK_IMAGE = "/images/workshops-hero.jpg";
const META_ICONS = {
  date: "/images/calendar.svg",
  duration: "/images/clock.svg",
  participants: "/images/participants.svg",
};

const normalizeSrc = (src) => {
  if (!src) return FALLBACK_IMAGE;
  const trimmed = String(src).trim();
  if (!trimmed) return FALLBACK_IMAGE;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const cleaned = trimmed.replace(/^\.?\/?public/, "");
  return cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
};

export default async function WorkshopDetailPage({ params = {} }) {
  const resolved = await params;
  const rawId = resolved?.id;
  const workshopId = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!workshopId) notFound();

  let product = null;
  try {
    product = await fetchProductById(String(workshopId));
  } catch (e) {
    product = null;
  }

  const fallbackWorkshop = getFallbackWorkshopById(workshopId);
  const workshop = product || fallbackWorkshop;
  if (!workshop) notFound();

  const isWorkshop =
    String(workshop.category || "").toLowerCase() === "workshop";
  if (!isWorkshop) notFound();

  const images = Array.isArray(workshop.img)
    ? workshop.img
    : typeof workshop.img === "string" && workshop.img.trim()
    ? [workshop.img]
    : [];
  const heroSrc = normalizeSrc(images[0] || FALLBACK_IMAGE);

  const name = workshop.name || "Workshop";
  const price = workshop.price ? `${workshop.price} CHF` : "60 CHF";
  const discountValue = Number.parseFloat(workshop.discount);
  const hasDiscount = Number.isFinite(discountValue) && discountValue > 0;
  const description =
    workshop.description ||
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
    { key: "date", label: formatDate(workshop.materials), icon: META_ICONS.date },
    { key: "duration", label: formatDuration(workshop.stone), icon: META_ICONS.duration },
    { key: "participants", label: formatParticipants(workshop.typeofmessage), icon: META_ICONS.participants },
  ].filter((item) => item.label);

  return (
    <section className={`${styles.section} reveal-up reveal-delay-sm`}>
      <div className="container">
        <Link href="/workshops" className={styles.backLink}>
          <span aria-hidden="true">{"<"}</span> Back to workshops
        </Link>

        <div className={styles.layout}>
          <div className={`${styles.media} reveal-up reveal-delay-md`}>
            <Image
              src={heroSrc}
              alt={name || "Workshop image"}
              fill
              className={styles.heroImage}
              sizes="(max-width: 960px) 100vw, 560px"
              priority={false}
            />
          </div>

          <div className={`${styles.info} reveal-up reveal-delay-lg`}>
            <h1 className={styles.title}>{name}</h1>
            <div className={styles.priceRow}>
              <p className={styles.price}>{price}</p>
              {hasDiscount && <span className={styles.discount}>-{discountValue}%</span>}
            </div>

            <ul className={styles.metaList}>
              {metaItems.map((item) => (
                <li key={item.key} className={styles.metaItem}>
                  <Image
                    src={item.icon}
                    alt=""
                    width={16}
                    height={16}
                    className={styles.metaIcon}
                    priority={false}
                  />
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
