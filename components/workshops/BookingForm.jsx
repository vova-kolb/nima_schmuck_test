"use client";

import { useState } from "react";
import styles from "./BookingForm.module.css";

export default function BookingForm({ workshopName = "" }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus("Submitted! We'll get back to you shortly.");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input type="hidden" name="workshop" value={workshopName} />

      <label className={styles.label}>
        Full Name *
        <input
          type="text"
          className={styles.input}
          required
          placeholder="Your name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </label>

      <label className={styles.label}>
        Phone Number
        <input
          type="tel"
          className={styles.input}
          placeholder="+41 XX XXX XX XX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </label>

      <button type="submit" className={styles.submitButton}>
        Book Now
      </button>

      {status && <p className={styles.statusText}>{status}</p>}
    </form>
  );
}
