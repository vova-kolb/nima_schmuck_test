import Image from 'next/image';
import styles from './HeroBanner.module.css';

const HERO_VARIANTS = {
  home: {
    image: {
      src: '/images/main-hero.jpg',
      alt: 'Handcrafted jewelry with a meaningful message',
    },
    title: 'HANDCRAFTED JEWELRY WITH\nA MEANINGFUL MESSAGE',
  },
  workshops: {
    image: {
      src: '/images/workshops-hero.jpg',
      alt: 'Hands crafting unique jewelry pieces in a workshop',
    },
    title: '',
  },
  'custom-creations': {
    image: {
      src: '/images/custom-creations-hero.jpg',
      alt: 'Custom jewelry designs crafted for you',
    },
    title: '',
  },
};

const DEFAULT_HERO = HERO_VARIANTS.home;

export default function HeroBanner({ pageKey = 'home' }) {
  const hero = HERO_VARIANTS[pageKey] || DEFAULT_HERO;

  return (
    <div className="container">
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

      <section className={styles.heroSection} aria-labelledby="hero-heading">
        <div className={styles.heroWrapper}>
          <div className={styles.heroImageWrapper}>
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              fill
              sizes="100vw"
              className={styles.heroImage}
              priority
            />
          </div>

          {hero.title && (
            <div className={styles.heroTextOverlay}>
              <h1 id="hero-heading" className={styles.heroTitle}>
                {hero.title}
              </h1>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
