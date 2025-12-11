"use client";

import Link from "next/link";
import { use, useEffect, useRef, useState } from "react";
import HeroForm from "@/components/admin/HeroForm";
import {
  buildHeroImageUrl,
  fetchHeroById,
  updateHero,
  uploadHeroImages,
} from "@/lib/heroApi";
import styles from "./page.module.css";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function EditHeroPage({ params }) {
  const unwrappedParams = use(params);
  const heroId = unwrappedParams?.id;
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [images, setImages] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef(null);
  const imageUrlsRef = useRef([]);

  const resetImages = (nextImages = []) => {
    imageUrlsRef.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {
        // ignore revoke errors
      }
    });
    imageUrlsRef.current = nextImages;
    setImages(nextImages);
  };

  useEffect(() => {
    loadHero();
  }, [heroId]);

  useEffect(() => {
    return () => {
      resetImages([]);
    };
  }, []);

  const loadImages = async (heroData) => {
    resetImages([]);
    const count = Number(heroData?.heroimg_count ?? 0);
    if (!heroData?.id || count <= 0) {
      setImageLoading(false);
      return;
    }

    setImageLoading(true);
    const limit = Math.min(3, count);
    const urls = [];

    for (let idx = 0; idx < limit; idx += 1) {
      const imgUrl = buildHeroImageUrl(heroData.id, idx);
      try {
        const res = await fetch(imgUrl, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });
        if (!res.ok) continue;
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        urls.push(objectUrl);
      } catch (e) {
        // ignore fetch errors for individual images
      }
    }

    resetImages(urls);
    setImageLoading(false);
  };

  const loadHero = async () => {
    setLoading(true);
    setPageError("");
    try {
      const data = await fetchHeroById(heroId);
      setHero(data);
      await loadImages(data);
    } catch (e) {
      setPageError("Unable to load hero. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (payload) => {
    if (!heroId) return;
    setSaving(true);
    setSaveError("");
    try {
      await updateHero(heroId, payload);
      await loadHero();
    } catch (e) {
      setSaveError("Failed to update hero.");
    } finally {
      setSaving(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files || []).slice(0, 3);
    event.target.value = "";
    if (!heroId || files.length === 0) return;

    setUploading(true);
    setUploadError("");
    try {
      await uploadHeroImages(heroId, files);
      await loadHero();
    } catch (e) {
      setUploadError("Failed to upload hero images.");
    } finally {
      setUploading(false);
    }
  };

  const heroMeta = [
    { label: "ID", value: hero?.id ?? "-" },
    { label: "Target", value: hero?.targeturl || "-" },
    { label: "Created", value: formatDate(hero?.created_at) },
    { label: "Updated", value: formatDate(hero?.updated_at) },
    { label: "Images", value: hero?.heroimg_count ?? 0 },
  ];

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.breadcrumbs}>
          <Link href="/admin/hero" className={styles.backLink}>
            {"<"} Back to heroes
          </Link>
        </div>

        {loading ? (
          <div className={styles.notice}>Loading hero...</div>
        ) : pageError ? (
          <div className={styles.error}>{pageError}</div>
        ) : !hero ? (
          <div className={styles.error}>Hero not found.</div>
        ) : (
          <>
            <div className={styles.pageHeader}>
              <div>
                <p className={styles.kicker}>Edit hero</p>
                <h1 className={styles.title}>{hero.heroheader || "Untitled hero"}</h1>
                <p className={styles.subtitle}>
                  Update hero text, destination, and imagery shown on the storefront.
                </p>
              </div>
              <div className={styles.actions}>
                <button
                  type="button"
                  className={`${styles.button} ${styles.ghost}`}
                  onClick={loadHero}
                  disabled={saving || uploading}
                >
                  Refresh
                </button>
              </div>
            </div>

            <div className={styles.metaRow}>
              {heroMeta.map((item) => (
                <div key={item.label} className={styles.metaItem}>
                  <span className={styles.metaLabel}>{item.label}</span>
                  <span className={styles.metaValue}>{item.value}</span>
                </div>
              ))}
            </div>

            <div className={styles.grid}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>Hero details</div>
                <HeroForm
                  mode="edit"
                  initialData={hero}
                  submitting={saving || uploading}
                  onSubmit={handleSave}
                  serverError={saveError}
                  submitLabel="Save hero"
                />
              </div>

              <div className={styles.card}>
              <div className={styles.cardHeader}>Hero images</div>
                <p className={styles.helper}>
                  Upload up to 3 hero images.
                </p>

                {uploadError && <div className={styles.error}>{uploadError}</div>}

                <div className={styles.imageGrid}>
                  {imageLoading ? (
                    <div className={styles.notice}>Loading images...</div>
                  ) : images.length === 0 ? (
                    <div className={styles.empty}>No hero images uploaded.</div>
                  ) : (
                    images.map((src, idx) => (
                      <div key={src} className={styles.imageItem}>
                        <img src={src} alt={`Hero ${idx + 1}`} className={styles.image} />
                        <span className={styles.imageLabel}>#{idx + 1}</span>
                      </div>
                    ))
                  )}
                </div>

                <div className={styles.uploadBar}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className={styles.hiddenInput}
                    onChange={handleFileChange}
                  />
                  <button
                    type="button"
                    className={`${styles.button} ${styles.primary}`}
                    onClick={handleUploadClick}
                    disabled={uploading || saving}
                  >
                    {uploading ? "Uploading..." : "Upload Hero Images"}
                  </button>
                  <button
                    type="button"
                    className={`${styles.button} ${styles.secondary}`}
                    onClick={() => loadImages(hero)}
                    disabled={imageLoading || loading}
                  >
                    Refresh images
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
