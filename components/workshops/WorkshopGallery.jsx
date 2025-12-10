"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  buildGalleryAvatarUrl,
  buildGalleryImageUrl,
  normalizeImageSrc,
} from "@/lib/api";
import styles from "./WorkshopGallery.module.css";

const FALLBACK_IMAGE = "/images/workshops-hero.jpg";

const buildSlides = (productId, rawImages = []) => {
  const galleryImages = productId
    ? Array.from({ length: 4 }, (_, idx) => buildGalleryImageUrl(productId, idx))
    : [];
  const avatar = buildGalleryAvatarUrl(productId);
  const fallbackImages = Array.isArray(rawImages) ? rawImages : rawImages ? [rawImages] : [];

  const seen = new Set();
  const combined = [...galleryImages, avatar, ...fallbackImages]
    .map((src) => normalizeImageSrc(src))
    .filter((src) => {
      if (!src) return false;
      if (seen.has(src)) return false;
      seen.add(src);
      return true;
    });

  return combined.length ? combined.slice(0, 4) : [FALLBACK_IMAGE];
};

export default function WorkshopGallery({ name, galleryId, images }) {
  const slides = useMemo(() => buildSlides(galleryId, images), [galleryId, images]);
  const [active, setActive] = useState(0);
  const [overrides, setOverrides] = useState({});

  useEffect(() => {
    setActive(0);
  }, [slides.length]);

  const resolvedSlides = useMemo(
    () => slides.map((src, idx) => overrides[idx] || src),
    [slides, overrides]
  );

  const handleError = (idx) => {
    setOverrides((prev) => {
      if (prev[idx] === FALLBACK_IMAGE) return prev;
      return { ...prev, [idx]: FALLBACK_IMAGE };
    });
  };

  const total = resolvedSlides.length;
  const current = resolvedSlides[active] || FALLBACK_IMAGE;

  const goPrev = () => {
    setActive((prev) => (prev - 1 + total) % total);
  };

  const goNext = () => {
    setActive((prev) => (prev + 1) % total);
  };

  return (
    <div className={styles.slider}>
      <div className={styles.frame}>
        <Image
          src={current}
          alt={name || "Workshop image"}
          fill
          className={styles.image}
          sizes="(max-width: 900px) 90vw, 520px"
          priority
          onError={() => handleError(active)}
        />

        {total > 1 && (
          <>
            <button
              type="button"
              className={`${styles.nav} ${styles.prev}`}
              onClick={goPrev}
              aria-label="Previous image"
            >
              &#8249;
            </button>
            <button
              type="button"
              className={`${styles.nav} ${styles.next}`}
              onClick={goNext}
              aria-label="Next image"
            >
              &#8250;
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <div className={styles.thumbs}>
          {resolvedSlides.map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              type="button"
              className={`${styles.thumb} ${idx === active ? styles.active : ""}`}
              onClick={() => setActive(idx)}
              aria-label={`Show image ${idx + 1}`}
            >
              <Image
                src={src}
                alt={`${name || "Workshop"} image ${idx + 1}`}
                fill
                className={styles.thumbImage}
                sizes="80px"
                onError={() => handleError(idx)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
