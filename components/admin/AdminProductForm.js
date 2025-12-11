'use client';

import { useEffect, useState } from "react";
import styles from "./AdminProductForm.module.css";

const AVAILABILITY_OPTIONS = [
  { value: "not available", label: "Not available" },
  { value: "in stock", label: "In stock" },
  { value: "on request", label: "On request" },
];

const normalizeAvailability = (value) => {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!normalized) return "";
  if (normalized.includes("request")) return "on request";
  if (
    normalized.includes("in stock") ||
    normalized === "instock" ||
    normalized === "in-stock"
  ) {
    return "in stock";
  }
  if (normalized.includes("not") || normalized.includes("out")) {
    return "not available";
  }
  return AVAILABILITY_OPTIONS.some((option) => option.value === normalized) ? normalized : "";
};

const toDateInputValue = (value) => {
  if (!value) return "";
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return "";
  return new Date(parsed).toISOString().slice(0, 10);
};

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
  variant = "product",
}) {
  const isWorkshop = variant === "workshop";
  const [formData, setFormData] = useState(DEFAULT_PRODUCT);
  const [localError, setLocalError] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  useEffect(() => {
    if (initialData) {
      const normalizedAvailability = normalizeAvailability(
        initialData.availability ??
          initialData.availabilitystatus ??
          initialData.availabilityStatus ??
          initialData.availability_status ??
          ""
      );
      const normalizedMessageType =
        initialData.typeofmessage ?? initialData.typeOfMessage ?? initialData.messageType ?? "";
      const normalizedDate = isWorkshop ? toDateInputValue(initialData.materials) : undefined;
      setFormData({
        ...DEFAULT_PRODUCT,
        category: isWorkshop ? "workshop" : initialData.category ?? "",
        ...initialData,
        materials: isWorkshop ? normalizedDate || "" : initialData.materials ?? "",
        price: initialData.price ?? "",
        discount: initialData.discount ?? "",
        typeofmessage: normalizedMessageType,
        availability: normalizedAvailability,
        availabilitystatus: normalizedAvailability,
      });
    } else {
      setFormData({
        ...DEFAULT_PRODUCT,
        category: isWorkshop ? "workshop" : "",
        availability: isWorkshop ? "in stock" : "",
        availabilitystatus: isWorkshop ? "in stock" : "",
      });
    }
    setAvatarFile(null);
    setGalleryFiles([]);
    setLocalError("");
  }, [initialData, isWorkshop]);

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
    const required = isWorkshop
      ? ["name", "price", "materials", "stone", "typeofmessage", "description", "availability"]
      : [
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
    const missing = required.filter((key) => !String(formData[key] ?? "").trim());
    if (missing.length > 0) {
      setLocalError("Please fill all required fields.");
      return;
    }

    setLocalError("");
    const normalizedAvailability = normalizeAvailability(formData.availability);
    onSubmit?.({
      data: isWorkshop
        ? {
            name: formData.name,
            category: "workshop",
            price: formData.price,
            discount: formData.discount,
            materials: formData.materials,
            stone: formData.stone,
            typeofmessage: formData.typeofmessage,
            description: formData.description,
            availability: normalizedAvailability,
            availabilitystatus: normalizedAvailability,
          }
        : {
            ...formData,
            availability: normalizedAvailability,
            availabilitystatus: normalizedAvailability,
          },
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

          {!isWorkshop && (
            <>
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
            </>
          )}

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

          {!isWorkshop && (
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
          )}

          {isWorkshop && (
            <>
              <label className={styles.field}>
                <span>Date *</span>
                <input
                  type="date"
                  value={formData.materials}
                  onChange={handleChange("materials")}
                  placeholder="Select date"
                />
              </label>

              <label className={styles.field}>
                <span>Duration *</span>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.stone}
                  onChange={handleChange("stone")}
                  placeholder="e.g. 2"
                />
              </label>

              <label className={styles.field}>
                <span>Participants *</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={formData.typeofmessage}
                  onChange={handleChange("typeofmessage")}
                  placeholder="e.g. 10"
                />
              </label>
            </>
          )}

          <label className={styles.field}>
            <span>Availability *</span>
            <select
              value={formData.availability}
              onChange={(event) => {
                const normalized = normalizeAvailability(event.target.value);
                setFormData((prev) => ({
                  ...prev,
                  availability: normalized,
                  availabilitystatus: normalized,
                }));
              }}
            >
              <option value="">Select availability</option>
              {AVAILABILITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          {!isWorkshop && (
            <>
              <label className={styles.field}>
                <span>Type of message *</span>
                <input
                  type="text"
                  value={formData.typeofmessage}
                  onChange={handleChange("typeofmessage")}
                  placeholder="love, healing, friendship..."
                />
              </label>

              <label className={`${styles.field} ${styles.checkboxField}`}>
                <span>Featured</span>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={handleChange("featured")}
                />
              </label>
            </>
          )}
        </div>

        {!isWorkshop && (
          <label className={styles.field}>
            <span>Short message *</span>
            <textarea
              rows={2}
              value={formData.message}
              onChange={handleChange("message")}
              placeholder="A quick note about the product."
            />
          </label>
        )}

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
