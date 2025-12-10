import Image from 'next/image';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
       <div className={`container ${styles.container}`}>
        <div className={styles.topRow}>
          <div className={styles.brandBlock}>
            <Image
              src="/images/logo-sm-white.svg"
              alt="Nima Schmuck"
              width={200}
              height={72}
              className={styles.logo}
            />
            <p className={styles.tagline}>
              Handcrafted jewelry that tells your story.
            </p>
            <div className={styles.socials}>
              <a
                href="https://instagram.com/nimaschmuck"
                className={styles.socialButton}
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  className={styles.socialIcon}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3.2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle cx="16.5" cy="7.5" r="0.85" />
                </svg>
              </a>
            </div>
            <a className={styles.contactLink} href="mailto:info@nimaschmuck.ch">
              info@nimaschmuck.ch
            </a>
          </div>

          <div className={styles.linkColumns}>

            <div className={styles.linkColumn}>
              <p className={styles.columnTitle}>Quick Links</p>
              <ul className={styles.linkList}>
                <li>
                  <Link className={styles.link} href="/catalog">
                    Catalog
                  </Link>
                </li>
                <li>
                  <Link className={styles.link} href="/workshops">
                    Workshops
                  </Link>
                </li>
                <li>
                  <Link className={styles.link} href="/custom-creations">
                    Custom Creations
                  </Link>
                </li>
                <li>
                  <Link className={styles.link} href="/about">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            <div className={styles.linkColumn}>
              <p className={styles.columnTitle}>Customer Service</p>
              <ul className={styles.linkList}>
                <li>
                  <Link className={styles.link} href="/shipping-returns">
                    Shipping &amp; Returns
                  </Link>
                </li>
                <li>
                  <Link className={styles.link} href="/faqs">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>
          </div>

        </div>

        <div className={styles.bottomRow}>
          <p className={styles.copyright}>
            &copy; {currentYear} Nima Schmuck. All rights reserved.
          </p>
          <div className={styles.policyLinks}>
            <Link className={styles.link} href="/privacy-policy">
              Privacy Policy
            </Link>
            <Link className={styles.link} href="/terms-of-service">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
