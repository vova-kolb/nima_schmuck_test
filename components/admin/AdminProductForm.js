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
  onUploadChange,
}) {
  const [formData, setFormData] = useState(DEFAULT_PRODUCT);
  const [localError, setLocalError] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

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
    setAvatarFile(null);
    setGalleryFiles([]);
    setLocalError("");
  }, [initialData]);

  const handleChange = (field) => (event) => {
    const { value, type, checked } = event.target;
    const nextValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [field]: nextValue }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0] || null;
    setAvatarFile(file);
    onUploadChange?.({ avatarFile: file, galleryFiles });
  };

  const handleGalleryChange = (event) => {
    const files = Array.from(event.target.files || []);
    setGalleryFiles(files);
    onUploadChange?.({ avatarFile, galleryFiles: files });
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
    onSubmit?.({
      data: formData,
      avatarFile,
      galleryFiles,
    });
  };

  return (
    <div className={styles.card}>
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

        <div className={styles.uploadGrid}>
          <div className={`${styles.field} ${styles.fileInput}`}>
            <span>Avatar image</span>
            <div className={styles.fileRow}>
              <label className={styles.fileButton}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={submitting}
                  className={styles.hiddenInput}
                />
                Choose avatar
              </label>
              <span className={styles.fileMeta}>
                {avatarFile ? avatarFile.name : "No file chosen"}
              </span>
            </div>
          </div>

          <div className={`${styles.field} ${styles.fileInput}`}>
            <span>Gallery images (max 8)</span>
            <div className={styles.fileRow}>
              <label className={styles.fileButton}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryChange}
                  disabled={submitting}
                  className={styles.hiddenInput}
                />
                Choose files
              </label>
              <span className={styles.fileMeta}>
                {galleryFiles.length > 0
                  ? `${galleryFiles.length} file${galleryFiles.length > 1 ? "s" : ""} selected`
                  : "No files chosen"}
              </span>
            </div>
          </div>
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
