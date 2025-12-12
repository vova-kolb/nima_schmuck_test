'use client';

import { useState } from 'react';
import styles from './page.module.css';

const sections = [
  {
    id: 'orders-payments',
    title: 'Bestellung & Bezahlung',
    faqs: [
      {
        question: 'Wie kann ich ein Schmuckstück bestellen?',
        answer: [
          'Bestellungen sind ganz einfach! Sende uns eine persönliche Nachricht (PN/DM) auf Instagram oder Facebook mit einem Screenshot des gewünschten Schmuckstücks sowie deinem Namen und deiner Lieferadresse. Wir melden uns innerhalb von 24 Stunden mit einer Bestätigung, Zahlungsdetails und dem voraussichtlichen Lieferdatum.',
        ],
      },
      {
        question: 'Where is your atelier located?',
        answer: [
          'Our atelier is based in Bern, close to the city center. Visits are by appointment so we can give you our full attention. If you prefer, we are also happy to meet virtually and send detailed photos and videos before you order.',
        ],
      },
      {
        question: 'Do you ship internationally?',
        answer: [
          'Yes. We ship across Switzerland via Swiss Post and to most EU countries with tracked service. International delivery usually takes 4–10 business days depending on the destination; we will confirm exact timing and duties information before you place your order.',
        ],
      },
    ],
  },
  {
    id: 'products-materials',
    title: 'Produkte & Materialien',
    faqs: [
      {
        question: 'How does the custom creation process work?',
        answer: [
          'We start with a short consultation to understand your style, preferred colors, and any symbolism that matters to you. Next, we sketch and curate gemstones or beads that fit your mood, then share the concept for feedback.',
          'Once you approve the direction, we handcraft the piece, send you final photos for sign-off, and pack it securely for delivery.',
        ],
      },
      {
        question: 'How much does a custom piece cost?',
        answer: [
          'Delicate bracelets start around CHF 95, while more intricate gemstone combinations typically range between CHF 140–220. For heirloom redesigns or rare stones, we will provide a tailored quote after the consultation.',
        ],
      },
      {
        question: 'Can you recreate a piece I’ve seen elsewhere?',
        answer: [
          'We use your inspiration as a mood board but never copy another designer’s work one-to-one. Instead, we reinterpret the idea with our aesthetic, materials we trust, and details that feel authentic to you.',
        ],
      },
      {
        question: 'Can you redesign or repurpose existing jewelry?',
        answer: [
          'Absolutely. We can reuse beads, stones, or charms you already own, or blend them with new materials to refresh the look. If the original piece is sentimental, we work gently to preserve what you love while improving comfort and durability.',
        ],
      },
    ],
  },
  {
    id: 'shipping-delivery',
    title: 'Versand & Lieferung',
    faqs: [
      {
        question: 'How long does shipping take?',
        answer: [
          'In-stock pieces ship within 2–3 business days. Custom creations usually need 5–10 business days after design approval. Swiss deliveries arrive in 1–2 days; EU deliveries typically arrive within a week.',
        ],
      },
      {
        question: 'Can I track my order?',
        answer: [
          'Yes. Every parcel is sent with tracking. You will receive a tracking link via email as soon as your order leaves the studio so you can follow each step.',
        ],
      },
      {
        question: 'Do you offer local pickup in Bern?',
        answer: [
          'Yes. If you prefer to pick up your jewelry, we can schedule a handover at our atelier by appointment. This is a great option if you want to try the fit or see a custom piece before it leaves the studio.',
        ],
      },
    ],
  },
  {
    id: 'workshops-events',
    title: 'Workshops & Events',
    faqs: [
      {
        question: 'What workshops do you offer?',
        answer: [
          'We host small-group bracelet workshops focused on color theory, gemstone selection, and mindful making. Private sessions for birthdays, team events, or bridal parties can be arranged on request.',
        ],
      },
      {
        question: 'What materials do you work with?',
        answer: [
          'We use high-quality glass beads, freshwater pearls, semi-precious stones, and sterling silver or gold-filled findings. For workshops, we pre-select palettes so you can mix and match textures safely.',
        ],
      },
      {
        question: 'Are your materials ethically sourced?',
        answer: [
          'Yes. We vet suppliers for traceability and responsible sourcing, prioritizing recycled metals and conflict-free stones. When a material has special care instructions, we include them with your piece.',
        ],
      },
    ],
  },
  {
    id: 'customization',
    title: 'Spezialanfertigungen & Personalisierung',
    faqs: [
      {
        question: 'What forms of payment do you accept?',
        answer: [
          'We accept major credit cards, TWINT, PayPal, and bank transfers. For local pickups, card and contactless payments are available on-site.',
        ],
      },
      {
        question: 'Do you offer payment plans?',
        answer: [
          'For custom projects above CHF 250, we can split payments into two installments: 50% to begin sourcing materials and 50% when the piece is ready to ship or pick up.',
        ],
      },
    ],
  },
];

export default function FaqsPage() {
  const [openItems, setOpenItems] = useState(() => new Set([`${sections[0].id}-0`]));

  const toggleItem = (itemKey) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemKey)) {
        next.delete(itemKey);
      } else {
        next.add(itemKey);
      }
      return next;
    });
  };

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroIcon} aria-hidden="true">
              ?
            </div>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>Frequently Asked Questions</h1>
              <p className={styles.heroSubtitle}>
                Find answers to common questions about our jewelry, custom creation process, workshops, and more.
                Can&apos;t find what you&apos;re looking for? We&apos;re here to help.
              </p>
            </div>
          </div>
        </div>
      </section>

      {sections.map((section) => (
        <section key={section.id} className={styles.faqSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              <span className={styles.sectionAccent} aria-hidden="true" />
            </div>

            <div className={styles.accordionList}>
              {section.faqs.map((faq, index) => {
                const itemKey = `${section.id}-${index}`;
                const isOpen = openItems.has(itemKey);

                return (
                  <article key={itemKey} className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}>
                    <button
                      type="button"
                      className={styles.itemHeader}
                      onClick={() => toggleItem(itemKey)}
                      aria-expanded={isOpen}
                    >
                      <span className={styles.question}>{faq.question}</span>
                      <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} aria-hidden="true">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M6 9l6 6 6-6"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>

                    {isOpen && (
                      <div className={styles.answer}>
                        {faq.answer.map((paragraph, paragraphIndex) => (
                          <p key={paragraphIndex}>{paragraph}</p>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
