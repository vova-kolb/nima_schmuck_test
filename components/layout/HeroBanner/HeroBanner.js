"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import styles from "./HeroBanner.module.css";
import { buildHeroImageUrl, fetchHeroes } from "@/lib/heroApi";

const HERO_VARIANTS = {
  home: {
    image: {
      src: "/images/main-hero.jpg",
      alt: "Handcrafted jewelry with a meaningful message",
    },
    title: "HANDCRAFTED JEWELRY WITH\nA MEANINGFUL MESSAGE",
  },
  workshops: {
    image: {
      src: "/images/workshops-hero.jpg",
      alt: "Hands crafting unique jewelry pieces in a workshop",
    },
    title: "",
  },
  "custom-creations": {
    image: {
      src: "/images/custom-creations-hero.jpg",
      alt: "Custom jewelry designs crafted for you",
    },
    title: "",
  },
};

const DEFAULT_HERO = HERO_VARIANTS.home;

const normalizePath = (value) => {
  if (!value || value === "#") return "/";
  let next = String(value).trim();
  next = next.replace(/\/+$/, "");
  if (!next.startsWith("/")) next = `/${next}`;
  if (next === "/") return "/";
  return next;
};

const targetCandidatesForKey = (pageKey) => {
  switch (pageKey) {
    case "home":
      return ["/home", "/", "#"];
    case "workshops":
      return ["/workshops", "workshops"];
    case "custom-creations":
      return ["/custom-creations", "custom-creations"];
    default:
      return [normalizePath(pageKey)];
  }
};

const deriveTitle = (hero, fallbackTitle) => {
  const lines = [hero?.herotitle1, hero?.herotitle2, hero?.herotitle3].filter(
    Boolean
  );
  if (lines.length > 0) return lines.join("\n");
  if (hero?.heroheader) return hero.heroheader;
  return fallbackTitle;
};

export default function HeroBanner({ pageKey = "home", showHeroImage = true }) {
  const fallback = useMemo(
    () => HERO_VARIANTS[pageKey] || DEFAULT_HERO,
    [pageKey]
  );
  const [heroContent, setHeroContent] = useState(fallback);

  useEffect(() => {
    if (!showHeroImage) return undefined;

    let active = true;

    const loadHero = async () => {
      try {
        const heroes = await fetchHeroes();
        const targets = targetCandidatesForKey(pageKey).map(normalizePath);
        const match = heroes.find((item) =>
          targets.includes(normalizePath(item?.targeturl))
        );
        const heroMatch = match || heroes[0];
        if (!heroMatch) {
          if (active) setHeroContent(fallback);
          return;
        }

        const hasImages = Number(heroMatch.heroimg_count) > 0;
        const imageSrc = hasImages
          ? buildHeroImageUrl(heroMatch.id, 0)
          : fallback.image.src;
        const title = deriveTitle(heroMatch, fallback.title);

        if (active) {
          setHeroContent({
            image: {
              src: imageSrc,
              alt: heroMatch.heroheader || fallback.image.alt,
            },
            title,
          });
        }
      } catch (e) {
        if (active) setHeroContent(fallback);
      }
    };

    loadHero();
    return () => {
      active = false;
    };
  }, [pageKey, fallback, showHeroImage]);

  return (
    <>
      <section className={styles.logoSection}>
        <div className={styles.logoWrapper}>
          <Image
            src="/images/logo-big.svg"
            alt="Nima - handcrafted excellence"
            width={438}
            height={182}
            className={styles.logoImage}
            priority
          />
        </div>
      </section>

      {showHeroImage && (
        <section className={styles.heroSection} aria-labelledby="hero-heading">
          <div className={styles.heroWrapper}>
            <div className={styles.heroImageWrapper}>
              <Image
                src={heroContent.image.src}
                alt={heroContent.image.alt}
                fill
                sizes="100vw"
                className={styles.heroImage}
                priority
              />
            </div>

            {heroContent.title && (
              <div className={styles.heroTextOverlay}>
                <h1 id="hero-heading" className={styles.heroTitle}>
                  {heroContent.title}
                </h1>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
