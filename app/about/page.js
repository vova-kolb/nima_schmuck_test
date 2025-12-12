import Image from "next/image";
import HeroBanner from "@/components/layout/HeroBanner/HeroBanner";
import styles from "./page.module.css";

const highlights = [
  {
    title: "Passion",
    description: "Every piece is crafted with love and dedication to excellence.",
    icon: "about-passion.svg",
  },
  {
    title: "Quality",
    description: "We use only the finest materials and time-honored techniques.",
    icon: "about-quality.svg",
  },
  {
    title: "Craftsmanship",
    description: "Over 25 years of jewelry-making expertise and innovation.",
    icon: "about-craftsmanship.svg",
  },
];

export default function AboutPage() {
  return (
    <main className={styles.main}>
      <div className="container">
        <HeroBanner pageKey="about" showHeroImage={false} />
      </div>

      <section className={`${styles.storySection} reveal-up reveal-after-logo`}>
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.storyText}>
              <p className={styles.kicker}>My Story</p>
              <h1 className={styles.title}>Handcrafted Jewelry with a Soul</h1>
              <div className={styles.copy}>
                <p>
                  Welcome to <strong>nima_schmuck</strong>, a space for handcrafted jewelry with a soul made in Bern.
                </p>
                <p>
                  I&apos;m Nima, the hands and heart behind every bracelet you see here. I work with natural stones,
                  colors and textures that spark emotion, and I turn them into pieces that feel personal and meaningful.
                  This is jewelry you choose not only to wear but also to connect with.
                </p>
                <p>
                  Every bracelet is created slowly and intentionally with attention to detail and materials that speak
                  for themselves. There is no mass production and no shortcuts. Only honest craft designed to stay with
                  you for a long time.
                </p>
                <p>
                  If you want to create something truly yours, you are welcome to join one of my small workshops where
                  you can explore your style, learn the craft and make a piece that reflects you.
                </p>
                <p>Let&apos;s create something meaningful together.</p>
              </div>

              <div className={styles.valuesGrid} aria-label="Brand values">
                {highlights.map((item) => (
                  <div key={item.title} className={styles.valueCard}>
                    <div className={styles.iconBadge}>
                      <Image
                        src={`/images/${item.icon}`}
                        alt={`${item.title} icon`}
                        width={36}
                        height={36}
                        className={styles.icon}
                      />
                    </div>
                    <h3 className={styles.valueTitle}>{item.title}</h3>
                    <p className={styles.valueDescription}>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.storyImageWrapper}>
              <Image
                src="/images/about-portrait.jpg"
                alt="Nima smiling while wearing handcrafted bracelets"
                fill
                sizes="(min-width: 1200px) 560px, (min-width: 900px) 50vw, 100vw"
                className={styles.storyImage}
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
