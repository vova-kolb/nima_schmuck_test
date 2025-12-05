'use client';

import { useEffect, useState } from "react";
import styles from "./AdminProductForm.module.css";

const DEFAULT_PRODUCT = {
  name: "",
  category: "",
  materials: "",
  stone: "",
  price: "",
  discount: "",
  typeofmessage: "",
  message: "",
  description: "",
  availability: "",
  availabilitystatus: "",
  featured: false,
  img: [],
};

export default function AdminProductForm({
  mode = "create",
  initialData,
  onSubmit,
  onCancel,
  submitting,
  serverError,
}) {
  const [formData, setFormData] = useState(DEFAULT_PRODUCT);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (initialData) {
      const normalizedStatus = (() => {
        const raw = (initialData.availabilitystatus || "").toLowerCase();
        if (raw.includes("in stock")) return "in stock";
        if (raw.includes("not available")) return "not available";
        return initialData.availabilitystatus || "";
      })();
      const normalizedMessageType =
        initialData.typeofmessage ??
        initialData.typeOfMessage ??
        initialData.messageType ??
        "";
      setFormData({
        ...DEFAULT_PRODUCT,
        ...initialData,
        price: initialData.price ?? "",
        discount: initialData.discount ?? "",
        typeofmessage: normalizedMessageType,
        availabilitystatus: normalizedStatus,
      });
    } else {
      setFormData(DEFAULT_PRODUCT);
    }
    setLocalError("");
  }, [initialData]);

  const handleChange = (field) => (event) => {
    const { value, type, checked } = event.target;
    const nextValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [field]: nextValue }));
  };

  const handleImagesChange = (event) => {
    const value = event.target.value;
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, img: items }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const required = [
      "name",
      "category",
      "materials",
      "stone",
      "price",
      "discount",
      "typeofmessage",
      "message",
      "description",
      "availability",
    ];
    const missing = required.filter(
      (key) => !String(formData[key] ?? "").trim(),
    );
    if (missing.length > 0) {
      setLocalError("Please fill all required fields.");
      return;
    }

    setLocalError("");
    onSubmit?.(formData);
  };

  const imageValue = Array.isArray(formData.img) ? formData.img.join(", ") : "";

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>{mode === "edit" ? "Edit" : "Create"}</p>
          <h3 className={styles.title}>
            {mode === "edit" ? "Update product" : "Add a new product"}
          </h3>
        </div>
        {onCancel && (
          <button
            type="button"
            className={`${styles.button} ${styles.ghost}`}
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
        )}
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <label className={styles.field}>
            <span>Name *</span>
            <input
              type="text"
              value={formData.name}
              onChange={handleChange("name")}
              placeholder="Product name"
            />
          </label>

          <label className={styles.field}>
            <span>Category *</span>
            <input
              type="text"
              value={formData.category}
              onChange={handleChange("category")}
              placeholder="Bracelet"
            />
          </label>

          <label className={styles.field}>
            <span>Materials *</span>
            <input
              type="text"
              value={formData.materials}
              onChange={handleChange("materials")}
              placeholder="Leather cord"
            />
          </label>

          <label className={styles.field}>
            <span>Stone *</span>
            <input
              type="text"
              value={formData.stone}
              onChange={handleChange("stone")}
              placeholder="Moonstone, Garnet..."
            />
          </label>

          <label className={styles.field}>
            <span>Price *</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange("price")}
              placeholder="10"
            />
          </label>

          <label className={styles.field}>
            <span>Discount *</span>
            <input
              type="number"
              min="0"
              step="1"
              value={formData.discount}
              onChange={handleChange("discount")}
              placeholder="20"
            />
          </label>

          <label className={styles.field}>
            <span>Type of message *</span>
            <input
              type="text"
              value={formData.typeofmessage}
              onChange={handleChange("typeofmessage")}
              placeholder="love, healing, friendship..."
            />
          </label>

        <label className={styles.field}>
          <span>Availability *</span>
          <input
            type="text"
            value={formData.availability}
            onChange={handleChange("availability")}
            placeholder="in stock"
          />
        </label>

        <label className={styles.field}>
          <span>Availability status</span>
          <select
            value={formData.availabilitystatus}
            onChange={handleChange("availabilitystatus")}
          >
            <option value="">Select status</option>
            <option value="in stock">In stock</option>
            <option value="not available">Not available</option>
          </select>
        </label>

          <label className={`${styles.field} ${styles.checkboxField}`}>
            <span>Featured</span>
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={handleChange("featured")}
            />
          </label>
        </div>

        <label className={styles.field}>
          <span>Short message *</span>
          <textarea
            rows={2}
            value={formData.message}
            onChange={handleChange("message")}
            placeholder="A quick note about the product."
          />
        </label>

        <label className={styles.field}>
          <span>Description *</span>
          <textarea
            rows={3}
            value={formData.description}
            onChange={handleChange("description")}
            placeholder="Full description and story behind the piece."
          />
        </label>

        <label className={styles.field}>
          <span>Images (comma separated)</span>
          <input
            type="text"
            value={imageValue}
            onChange={handleImagesChange}
            placeholder="/images/product.jpg, /images/second.jpg"
          />
        </label>

        {(localError || serverError) && (
          <div className={styles.error}>{localError || serverError}</div>
        )}

        <div className={styles.actions}>
          <button
            type="submit"
            className={`${styles.button} ${styles.primary}`}
            disabled={submitting}
          >
            {submitting
              ? "Saving..."
              : mode === "edit"
                ? "Update"
                : "Create"}
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
    </div>
  );
}
