'use client';

import { useEffect, useState } from "react";
import styles from "./HeroForm.module.css";

const DEFAULT_HERO = {
  heroheader: "",
  herotitle1: "",
  herotitle2: "",
  herotitle3: "",
  targeturl: "/home",
};

const TARGET_OPTIONS = ["/home", "/workshops", "/custom-creations"];

export default function HeroForm({
  mode = "create",
  initialData,
  submitting,
  onSubmit,
  onCancel,
  serverError,
  submitLabel,
}) {
  const [formData, setFormData] = useState(DEFAULT_HERO);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...DEFAULT_HERO,
        ...initialData,
      });
    } else {
      setFormData(DEFAULT_HERO);
    }
    setLocalError("");
  }, [initialData]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.heroheader.trim() || !formData.targeturl) {
      setLocalError("Please provide a hero header and target URL.");
      return;
    }
    setLocalError("");
    onSubmit?.(formData);
  };

  const actionLabel =
    submitLabel || (mode === "edit" ? "Save changes" : "Create hero");

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.grid}>
        <label className={styles.field}>
          <span>Hero header *</span>
          <input
            type="text"
            value={formData.heroheader}
            onChange={handleChange("heroheader")}
            placeholder="Summer Collection"
            disabled={submitting}
          />
        </label>

        <label className={styles.field}>
          <span>Title line 1</span>
          <input
            type="text"
            value={formData.herotitle1}
            onChange={handleChange("herotitle1")}
            placeholder="Main headline"
            disabled={submitting}
          />
        </label>

        <label className={styles.field}>
          <span>Title line 2</span>
          <input
            type="text"
            value={formData.herotitle2}
            onChange={handleChange("herotitle2")}
            placeholder="Second line"
            disabled={submitting}
          />
        </label>

        <label className={styles.field}>
          <span>Title line 3</span>
          <input
            type="text"
            value={formData.herotitle3}
            onChange={handleChange("herotitle3")}
            placeholder="Third line"
            disabled={submitting}
          />
        </label>

        <label className={styles.field}>
          <span>Target URL *</span>
          <select
            value={formData.targeturl}
            onChange={handleChange("targeturl")}
            disabled={submitting}
          >
            {TARGET_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className={styles.helper}>
            Page where this hero banner should appear.
          </span>
        </label>
      </div>

      {(localError || serverError) && (
        <div className={styles.error}>{localError || serverError}</div>
      )}

      <div className={styles.actions}>
        <button
          type="submit"
          className={`${styles.button} ${styles.primary}`}
          disabled={submitting}
        >
          {submitting ? "Saving..." : actionLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            className={`${styles.button} ${styles.secondary}`}
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
