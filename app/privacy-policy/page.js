import styles from './page.module.css';

export const metadata = {
  title: 'Privacy Policy | Nima Schmuck',
  description:
    'Learn how Nima Schmuck collects, uses, and protects your personal information, including data rights and security practices.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroCard}>
            <div className={styles.iconCircle} aria-hidden="true">
              <svg
                className={styles.icon}
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4.75L6.5 6.75V12c0 1.55.73 3.03 1.97 4.1L12 19.25l3.53-3.15A5.6 5.6 0 0 0 17.5 12V6.75L12 4.75Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.25 11.75 12 13.5l2.25-2.25"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className={styles.heroTitle}>Privacy Policy</h1>
            <p className={styles.heroSubtitle}>
              Your privacy is important to us. Learn how we collect, use, and protect your personal information.
            </p>
            <p className={styles.updated}>Last Updated: December 2, 2025</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.content}>
            <h2 className={styles.sectionTitle}>Introduction</h2>
            <div className={styles.body}>
              <p>
                At Nima Schmuck, we take your privacy seriously. This Privacy Policy explains how we collect, use,
                store, and protect your personal information when you visit our website, make a purchase, or interact
                with our services.
              </p>
              <p>
                We are committed to protecting your personal data in accordance with the Swiss Federal Act on Data
                Protection (FADP) and the European General Data Protection Regulation (GDPR) where applicable.
              </p>
              <p>
                By using our website and services, you consent to the collection and use of information as described in
                this policy. If you have any questions or concerns, please contact us at info@nimaschmuck.ch.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.content}>
            <h2 className={styles.sectionTitle}>Information We Collect</h2>
            <div className={styles.body}>
              <p>We collect information that you provide directly to us, including:</p>
              <ul className={styles.list}>
                <li>Personal identification information (name, email address, phone number, mailing address)</li>
                <li>Payment information (processed securely through our payment providers)</li>
                <li>Order history and preferences</li>
                <li>Communication preferences and correspondence with us</li>
                <li>Custom design requirements, measurements, and specifications</li>
                <li>Workshop registration details</li>
              </ul>
              <p>We also automatically collect certain information when you visit our website:</p>
              <ul className={styles.list}>
                <li>Browser type and version</li>
                <li>Device information and IP address</li>
                <li>Pages visited and time spent on our website</li>
                <li>Referring website addresses</li>
                <li>Cookies and similar tracking technologies (see our Cookie Policy section)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.content}>
            <h2 className={styles.sectionTitle}>How We Use Your Information</h2>
            <div className={styles.body}>
              <p>We use the information we collect for the following purposes:</p>
              <ul className={styles.list}>
                <li>Processing and fulfilling your orders</li>
                <li>Communicating with you about your orders, custom projects, or workshop bookings</li>
                <li>Providing customer service and responding to your inquiries</li>
                <li>Sending you important updates about our services, policies, or terms</li>
                <li>
                  With your consent, sending you marketing communications about new collections, workshops, or special
                  offers
                </li>
                <li>Improving our website, products, and services</li>
                <li>Detecting and preventing fraud or unauthorized access</li>
                <li>Complying with legal obligations and protecting our legal rights</li>
                <li>Creating personalized experiences and recommendations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.content}>
            <h2 className={styles.sectionTitle}>How We Share Your Information</h2>
            <div className={styles.body}>
              <p>
                We do not sell your personal information to third parties. We only share your information in the
                following circumstances:
              </p>
              <ul className={styles.list}>
                <li>
                  Service Providers: We work with trusted third-party service providers who assist us with payment
                  processing, shipping, email communications, website hosting, and analytics. These providers are
                  contractually obligated to protect your data and use it only for the purposes we specify.
                </li>
                <li>
                  Legal Requirements: We may disclose your information if required by law, court order, or governmental
                  regulation, or if we believe disclosure is necessary to protect our rights, your safety, or the safety
                  of others.
                </li>
                <li>
                  Business Transfers: In the event of a merger, acquisition, or sale of assets, your information may be
                  transferred to the new owner, who will be required to honor this privacy policy.
                </li>
                <li>
                  With Your Consent: We may share your information with other parties when you have given us explicit
                  permission to do so.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.content}>
            <h2 className={styles.sectionTitle}>Data Security</h2>
            <div className={styles.body}>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information
                against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className={styles.list}>
                <li>SSL/TLS encryption for all data transmitted between your browser and our servers</li>
                <li>Secure payment processing through PCI-DSS compliant payment providers</li>
                <li>Regular security assessments and updates</li>
                <li>Restricted access to personal data on a need-to-know basis</li>
                <li>Employee training on data protection and privacy</li>
              </ul>
              <p>
                While we strive to protect your personal information, no method of transmission over the internet or
                electronic storage is 100% secure. We cannot guarantee absolute security but continuously work to
                maintain the highest standards of data protection.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.content}>
            <h2 className={styles.sectionTitle}>Cookies and Tracking Technologies</h2>
            <div className={styles.body}>
              <p>
                Our website uses cookies and similar technologies to enhance your browsing experience, analyze website
                traffic, and personalize content. Cookies are small text files stored on your device.
              </p>
              <p>We use the following types of cookies:</p>
              <ul className={styles.list}>
                <li>
                  Essential Cookies: Necessary for the website to function properly, including shopping cart
                  functionality and secure login.
                </li>
                <li>
                  Performance Cookies: Help us understand how visitors use our website by collecting anonymous
                  statistical data.
                </li>
                <li>
                  Functional Cookies: Remember your preferences and settings to provide a personalized experience.
                </li>
                <li>
                  Marketing Cookies: Track your browsing activity to show you relevant advertisements (only with your
                  consent).
                </li>
              </ul>
              <p>
                You can control cookie preferences through your browser settings. Please note that disabling certain
                cookies may affect website functionality. For more detailed information about the cookies we use, please
                contact us.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.content}>
            <h2 className={styles.sectionTitle}>Your Privacy Rights</h2>
            <div className={styles.body}>
              <p>
                Under Swiss and European data protection laws, you have the following rights regarding your personal
                information:
              </p>
              <ul className={styles.list}>
                <li>Right to Access: Request a copy of the personal information we hold about you.</li>
                <li>Right to Rectification: Request correction of inaccurate or incomplete information.</li>
                <li>Right to Erasure: Request deletion of your personal data (subject to legal retention requirements).</li>
                <li>Right to Restriction: Request that we limit how we use your information.</li>
                <li>Right to Data Portability: Request a copy of your data in a structured, commonly used format.</li>
                <li>Right to Object: Object to our processing of your information for certain purposes, including marketing.</li>
                <li>
                  Right to Withdraw Consent: If we process your data based on consent, you can withdraw it at any time.
                </li>
              </ul>
              <p>
                To exercise any of these rights, please contact us at info@nimaschmuck.ch. We will respond to your
                request within 30 days. You also have the right to lodge a complaint with the Swiss Federal Data
                Protection and Information Commissioner (FDPIC) or your local data protection authority.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.content}>
            <h2 className={styles.sectionTitle}>Marketing Communications</h2>
            <div className={styles.body}>
              <p>
                With your consent, we may send you marketing emails about new collections, exclusive offers, workshop
                announcements, and jewelry care tips. You can unsubscribe from marketing communications at any time by:
              </p>
              <ul className={styles.list}>
                <li>Clicking the &apos;unsubscribe&apos; link in any marketing email</li>
                <li>Contacting us at info@nimaschmuck.ch</li>
                <li>Updating your preferences in your account settings</li>
              </ul>
              <p>
                Please note that even if you opt out of marketing communications, we will still send you transactional
                emails related to your orders, customer service inquiries, and important account updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.content}>
            <h2 className={styles.sectionTitle}>Data Retention</h2>
            <div className={styles.body}>
              <p>
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in
                this policy or as required by law. Generally:
              </p>
              <ul className={styles.list}>
                <li>Order and transaction data: Retained for 10 years to comply with Swiss commercial and tax law</li>
                <li>Customer account information: Retained until you request deletion or close your account</li>
                <li>Marketing communications data: Retained until you unsubscribe or withdraw consent</li>
                <li>Website analytics data: Typically retained for 26 months</li>
                <li>Custom design specifications and consultations: Retained for 7 years</li>
              </ul>
              <p>After the retention period expires, we securely delete or anonymize your personal information.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.content}>
            <h2 className={styles.sectionTitle}>Third-Party Links and Services</h2>
            <div className={styles.body}>
              <p>
                Our website may contain links to third-party websites, including social media platforms and payment
                processors. We are not responsible for the privacy practices of these external sites. We encourage you
                to review their privacy policies before providing any personal information.
              </p>
              <p>We use the following third-party services:</p>
              <ul className={styles.list}>
                <li>Payment Processing: Secure payment providers that comply with PCI-DSS standards</li>
                <li>Email Communications: Email service providers for newsletters and transactional emails</li>
                <li>Shipping: Courier services for package delivery</li>
                <li>Analytics: Website analytics tools to understand visitor behavior</li>
              </ul>
              <p>
                These service providers may have access to your personal information only to perform specific tasks on
                our behalf and are obligated to protect your data.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.content}>
            <h2 className={styles.sectionTitle}>Children&apos;s Privacy</h2>
            <div className={styles.body}>
              <p>
                Our website and services are not directed to individuals under the age of 16. We do not knowingly collect
                personal information from children. If you are a parent or guardian and believe your child has provided
                us with personal information, please contact us immediately, and we will delete such information from our
                systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.content}>
            <h2 className={styles.sectionTitle}>International Data Transfers</h2>
            <div className={styles.body}>
              <p>
                Your personal information may be transferred to and processed in countries other than Switzerland. When
                we transfer data internationally, we ensure appropriate safeguards are in place, such as:
              </p>
              <ul className={styles.list}>
                <li>Standard contractual clauses approved by the European Commission</li>
                <li>Data processing agreements with service providers</li>
                <li>Ensuring recipients are located in countries with adequate data protection laws</li>
              </ul>
              <p>
                We take steps to ensure your information receives the same level of protection as it would in Switzerland.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <div className={styles.content}>
            <h2 className={styles.sectionTitle}>Changes to This Policy</h2>
            <div className={styles.body}>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal
                requirements, or other factors. We will notify you of any material changes by:
              </p>
              <ul className={styles.list}>
                <li>Posting the updated policy on our website with a new &apos;Last Updated&apos; date</li>
                <li>Sending you an email notification (for significant changes)</li>
              </ul>
              <p>
                We encourage you to review this policy periodically to stay informed about how we protect your
                information. Your continued use of our services after any changes indicates your acceptance of the
                updated policy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
