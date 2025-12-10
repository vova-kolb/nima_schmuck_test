import Image from 'next/image';
import HeroBanner from '@/components/layout/HeroBanner/HeroBanner';
import styles from './page.module.css';

const steps = [
  {
    label: 'Step 1',
    title: 'Consultation',
    description:
      'We clarify your preferences, mood, and desired symbolism to create a clear direction for your custom piece.',
    icon: 'custom-process-consultation.svg',
  },
  {
    label: 'Step 2',
    title: 'Creative Draft',
    description:
      'We create gentle sketches that shape the first vision of your piece and adjust it until it feels right.',
    icon: 'custom-process-creative-draft.svg',
  },
  {
    label: 'Step 3',
    title: 'Selection',
    description:
      'Choose from carefully curated gemstones and elements that define the look, energy, and tone of your jewelry.',
    icon: 'custom-process-selection.svg',
  },
  {
    label: 'Step 4',
    title: 'Making',
    description:
      'Each bracelet is handcrafted with meticulous detail, blending traditional craftsmanship with modern minimalism.',
    icon: 'custom-process-making.svg',
  },
  {
    label: 'Step 5',
    title: 'Approval',
    description:
      'We complete a quality check to ensure your piece feels beautiful, meaningful, and ready to be worn.',
    icon: 'custom-process-approval.svg',
  },
];

export default function CustomCreationsPage() {
  return (
    <main className={styles.main}>
      <div className="container">
        <HeroBanner pageKey="custom-creations" />
      </div>

      <section className={styles.processSection}>
        <div className="container">
          <div className={styles.processHeader}>
            <p className={styles.kicker}>Bespoke Design</p>
            <h2 className={styles.processTitle}>The Custom Design Process</h2>
            <p className={styles.processSubtitle}>
              From concept to creation, we guide you through every step of bringing your vision to life.
            </p>
          </div>

          <div className={styles.stepsGrid}>
            {steps.map((step) => (
              <div key={step.title} className={styles.stepCard}>
                <div className={styles.iconWrapper}>
                  <Image
                    src={`/images/${step.icon}`}
                    alt={`${step.title} icon`}
                    width={48}
                    height={48}
                    className={styles.icon}
                  />
                </div>
                <p className={styles.stepLabel}>{step.label}</p>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className="container">
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Custom Creations</h2>
            <p className={styles.formSubtitle}>
              If you would like to create your own piece, please fill out the form below.
            </p>
            <p className={styles.formSubtitle}>
              I will contact you to discuss ideas, materials and timing.
            </p>
          </div>

          <form className={styles.form} action="#" method="post">
            <div className={styles.fieldGrid}>
              <label className={styles.label}>
                <span className={styles.labelTitle}>
                  Full Name <span className={styles.requiredMark}>*</span>
                </span>
                <input
                  className={styles.input}
                  type="text"
                  name="fullName"
                  placeholder="Your name"
                  required
                />
              </label>
              <label className={styles.label}>
                <span className={styles.labelTitle}>
                  Email Address <span className={styles.requiredMark}>*</span>
                </span>
                <input
                  className={styles.input}
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  required
                />
              </label>
            </div>

            <label className={styles.label}>
              Phone Number
              <input
                className={styles.input}
                type="tel"
                name="phone"
                placeholder="+41 XX XXX XX XX"
              />
            </label>

            <ol className={styles.questionList}>
              <li>What type of bracelet would you like to create? (classic, minimalist, colorful, symbolic)</li>
              <li>Do you have preferred colors or stones? (beige, black, turquoise, rose quartz, amethyst)</li>
              <li>Should the bracelet have a special meaning or intention? (protection, calmness, balance, love)</li>
              <li>What is your wrist size? Please provide your wrist measurement in cm.</li>
              <li>Do you have any inspiration images or references? You can upload a photo or paste a link.</li>
              <li>When do you need the bracelet? (specific date, as soon as possible, no rush)</li>
              <li>Is this bracelet for you or as a gift? (for myself, a gift, gift with special packaging)</li>
            </ol>

            <label className={styles.label}>
              <span className={styles.labelTitle}>
                Tell Us About Your Vision <span className={styles.requiredMark}>*</span>
              </span>
              <textarea
                className={styles.textarea}
                name="vision"
                rows={6}
                placeholder="Describe your ideal piece... What style appeals to you? Are there any special meanings or stories? Do you have inspiration images?"
                required
              />
            </label>

            <div className={styles.submitRow}>
              <button type="submit" className={styles.submitButton}>
                Send Request
              </button>
            </div>

            <p className={styles.responseNote}>
              We&apos;ll respond within 24 hours to schedule your complimentary consultation.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
