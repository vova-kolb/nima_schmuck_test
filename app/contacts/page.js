import Image from 'next/image';
import HeroBanner from '@/components/layout/HeroBanner/HeroBanner';
import styles from './page.module.css';

const contactMethods = [
  {
    icon: 'contact-email.svg',
    label: 'Email',
    value: 'info@nimaschmuck.ch',
    href: 'mailto:info@nimaschmuck.ch',
  },
  {
    icon: 'contact-instagram.svg',
    label: 'Instagram',
    value: '@nima_schmuck',
    href: 'https://www.instagram.com/nima_schmuck',
  },
];

export default function ContactsPage() {
  return (
    <main className={styles.main}>
      <div className="container">
        <HeroBanner pageKey="contact" showHeroImage={false} />
      </div>

      <section className={styles.contactSection} aria-labelledby="contact-heading">
        <div className="container">
          <div className={styles.contactLayout}>
            <div className={styles.infoColumn}>
              <p className={styles.kicker}>Get in touch</p>
              <h1 id="contact-heading" className={styles.title}>
                Visit Our Atelier
              </h1>
              <p className={styles.description}>
                We&apos;d love to meet you and discuss your jewelry needs. Visit our showroom or reach out to schedule
                a private consultation.
              </p>

              <div className={styles.contactList}>
                {contactMethods.map((method) => (
                  <div key={method.label} className={styles.contactItem}>
                    <div className={styles.iconBadge}>
                      <Image
                        src={`/images/${method.icon}`}
                        alt={`${method.label} icon`}
                        width={28}
                        height={28}
                        className={styles.contactIcon}
                      />
                    </div>
                    <div>
                      <p className={styles.contactLabel}>{method.label}</p>
                      {method.href ? (
                        <a
                          className={styles.contactValue}
                          href={method.href}
                          target={method.href.startsWith('http') ? '_blank' : undefined}
                          rel={method.href.startsWith('http') ? 'noreferrer' : undefined}
                        >
                          {method.value}
                        </a>
                      ) : (
                        <span className={styles.contactValue}>{method.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.formColumn}>
              <div className={styles.formCard}>
                <form className={styles.form} action="#" method="post">
                  <label className={styles.label}>
                    Name
                    <input className={styles.input} type="text" name="name" placeholder="Your name" required />
                  </label>

                  <label className={styles.label}>
                    Email
                    <input
                      className={styles.input}
                      type="email"
                      name="email"
                      placeholder="your.email@example.com"
                      required
                    />
                  </label>

                  <label className={styles.label}>
                    Message
                    <textarea
                      className={styles.textarea}
                      name="message"
                      rows={5}
                      placeholder="Tell us about your jewelry needs..."
                      required
                    />
                  </label>

                  <button type="submit" className={styles.submitButton} disabled>
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
