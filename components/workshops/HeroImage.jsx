"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./HeroImage.module.css";

const FALLBACK_IMAGE = "/images/workshops-hero.jpg";

const normalizeSrc = (src) => {
  if (!src) return FALLBACK_IMAGE;
  const trimmed = String(src).trim();
  if (!trimmed) return FALLBACK_IMAGE;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const cleaned = trimmed.replace(/^\.?\/?public/, "");
  return cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
};

export default function HeroImage({ src, alt }) {
  const [current, setCurrent] = useState(normalizeSrc(src));

  return (
    <Image
      src={current}
      alt={alt || "Workshop"}
      fill
      className={styles.heroImage}
      sizes="(max-width: 960px) 100vw, 50vw"
      priority
      onError={() => setCurrent(FALLBACK_IMAGE)}
    />
  );
}
