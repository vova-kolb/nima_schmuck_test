"use client";

import styles from "./WorkshopBookingForm.module.css";

export default function WorkshopBookingForm({
  formRef,
  selectedWorkshop = "",
  hasWorkshops = false,
}) {
  const canSubmit = !hasWorkshops || selectedWorkshop.trim().length > 0;

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <section className={styles.formSection} id="workshop-form" ref={formRef}>
      <div className="container">
        <div className={styles.formWrapper}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Book Your Workshop</h2>
            <p className={styles.formSubtitle}>
              Select a workshop above to get started, or contact us for a custom session.
            </p>
            <p className={styles.selectionNotice}>
              {selectedWorkshop
                ? `Selected workshop: ${selectedWorkshop}`
                : hasWorkshops
                ? "Choose a workshop card and click Book Now to attach it to your request."
                : "Tell us what you are interested in and we will tailor a session for you."}
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <input type="hidden" name="workshop" value={selectedWorkshop} />

            <label className={styles.label}>
              Full Name *
              <input
                className={styles.input}
                type="text"
                name="fullName"
                placeholder="Your name"
                required
              />
            </label>

            <label className={styles.label}>
              Email Address *
              <input
                className={styles.input}
                type="email"
                name="email"
                placeholder="your.email@example.com"
                required
              />
            </label>

            <label className={styles.label}>
              Phone Number
              <input
                className={styles.input}
                type="tel"
                name="phone"
                placeholder="+41 XX XXX XX XX"
              />
            </label>

            <label className={styles.label}>
              Message
              <textarea
                className={styles.textarea}
                name="message"
                placeholder="Any questions or special requirements..."
              />
            </label>

            <button className={styles.submitButton} type="submit" disabled={!canSubmit}>
              {canSubmit ? "Send booking request" : "Please select a workshop above"}
            </button>

            <p className={styles.helperText}>
              After submitting, we&apos;ll contact you within 24 hours to confirm your booking and
              process payment.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
