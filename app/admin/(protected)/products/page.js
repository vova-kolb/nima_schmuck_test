"use client";

import { useEffect, useMemo, useState } from "react";
import AdminProductForm from "@/components/admin/AdminProductForm";
import AdminProductTable from "@/components/admin/AdminProductTable";
import ProductFilters from "@/components/products/ProductFilters";
import { createProduct, deleteProduct, updateProduct } from "@/lib/api";
import { useProducts } from "@/lib/hooks/useProducts";
import styles from "./page.module.css";

const PAGE_SIZE = 10;
const TABS = [
  { id: "products", label: "Products" },
  { id: "workshops", label: "Workshops" },
];

const SORT_OPTIONS = [
  { label: "No Sorting", value: "" },
  { label: "Price: Low to High", value: "price:asc" },
  { label: "Price: High to Low", value: "price:desc" },
  { label: "Name: A to Z", value: "name:asc" },
  { label: "Name: Z to A", value: "name:desc" },
];

export default function AdminProductsPage() {
  const [activeTab, setActiveTab] = useState("products");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [activeProduct, setActiveProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState("");

  const {
    products,
    categories,
    materials,
    selectedCategory,
    selectedMaterial,
    searchTerm,
    sortBy,
    sortOrder,
    page,
    totalPages,
    total,
    loading,
    error,
    selectCategory,
    selectMaterial,
    updateSearch,
    selectSort,
    goToPage,
    reload,
  } = useProducts({ pageSize: PAGE_SIZE });

  useEffect(() => {
    if (activeTab === "workshops" && selectedCategory.toLowerCase() !== "workshop") {
      selectCategory("workshop");
    }
    if (activeTab === "products" && selectedCategory.toLowerCase() === "workshop") {
      selectCategory("");
    }
  }, [activeTab, selectCategory, selectedCategory]);

  const visibleProducts = useMemo(() => {
    const normalize = (value) => String(value || "").toLowerCase();
    return products.filter((item) => {
      const isWorkshop = normalize(item.category) === "workshop";
      return activeTab === "workshops" ? isWorkshop : !isWorkshop;
    });
  }, [products, activeTab]);

  const categoriesForTab = useMemo(() => {
    const normalize = (value) => String(value || "").toLowerCase();
    const filtered = categories.filter((cat) =>
      activeTab === "workshops"
        ? normalize(cat) === "workshop"
        : normalize(cat) !== "workshop"
    );
    if (activeTab === "workshops" && !filtered.some((cat) => normalize(cat) === "workshop")) {
      return [...filtered, "workshop"];
    }
    return filtered;
  }, [categories, activeTab]);

  const handlePageChange = async (nextPage) => {
    await goToPage(nextPage);
  };

  const handleRefresh = async () => {
    await reload();
  };

  const openCreateForm = () => {
    setFormMode("create");
    setActiveProduct(null);
    setFormOpen(true);
    setActionError("");
  };

  const openEditForm = (product) => {
    setFormMode("edit");
    setActiveProduct(product);
    setFormOpen(true);
    setActionError("");
  };

  const handleCancel = () => {
    setFormOpen(false);
    setActiveProduct(null);
    setActionError("");
  };

  const handleSave = async (payload) => {
    setSubmitting(true);
    setActionError("");
    try {
      if (formMode === "edit" && activeProduct?.id !== undefined) {
        await updateProduct(activeProduct.id, payload);
        await reload();
      } else {
        await createProduct(payload);
        await goToPage(1);
      }
      setFormOpen(false);
      setActiveProduct(null);
    } catch (e) {
      setActionError("Unable to save product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (product) => {
    if (!product?.id) return;
    const confirmed = window.confirm(
      `Delete "${product.name || "product"}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setSubmitting(true);
    setActionError("");
    try {
      await deleteProduct(product.id);
      await reload();
    } catch (e) {
      setActionError("Failed to delete product.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategorySelect = (value) => {
    if (activeTab === "workshops") {
      selectCategory("workshop");
      return;
    }
    selectCategory(value);
  };

  const currentTitle = activeTab === "workshops" ? "Workshops" : "Products";
  const perPageLabel =
    activeTab === "workshops"
      ? `${visibleProducts.length} workshops on this page`
      : `${visibleProducts.length} products on this page`;

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      handleCancel();
    }
  };

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.pageHeader}>
          <div>
            <p className={styles.kicker}>Admin</p>
            <h1 className={styles.title}>Products & Workshops</h1>
            <p className={styles.subtitle}>
              Manage your handmade bracelet collection and workshops in one place.
            </p>
          </div>
          <div className={styles.tabs}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`${styles.tabButton} ${activeTab === tab.id ? styles.activeTab : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.toolbar}>
          <ProductFilters
            className={styles.filters}
            variant="toolbar"
            searchPlaceholder={`Search ${currentTitle.toLowerCase()}...`}
            searchTerm={searchTerm}
            onSearchChange={updateSearch}
            categories={categoriesForTab}
            selectedCategory={activeTab === "workshops" ? "workshop" : selectedCategory}
            onCategoryChange={handleCategorySelect}
            categoryPlaceholder="All categories"
            materials={materials}
            selectedMaterial={selectedMaterial}
            onMaterialChange={selectMaterial}
            materialPlaceholder="All materials"
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={selectSort}
            sortOptions={SORT_OPTIONS}
            showLabels={false}
            showMaterial={materials.length > 0}
          />

          <div className={styles.toolbarActions}>
            <button
              type="button"
              className={`${styles.button} ${styles.primary}`}
              onClick={openCreateForm}
              disabled={submitting}
            >
              + Add Product
            </button>
          </div>
        </div>

        <AdminProductTable
          products={visibleProducts}
          loading={loading}
          error={error}
          onEdit={openEditForm}
          onDelete={handleDelete}
          onRefresh={handleRefresh}
          page={page}
          totalPages={totalPages}
          total={total}
          onPageChange={handlePageChange}
          disableActions={submitting}
          title={`All ${currentTitle}`}
          subtitle={perPageLabel}
        />

        {formOpen && (
          <div
            className={styles.modalOverlay}
            role="dialog"
            aria-modal="true"
            onClick={handleOverlayClick}
          >
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <div>
                  <p className={styles.modalKicker}>
                    {formMode === "edit" ? "Edit" : "Create"}
                  </p>
                  <h3 className={styles.modalTitle}>
                    {formMode === "edit" ? "Edit product" : "Add a new product"}
                  </h3>
                </div>
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={handleCancel}
                  aria-label="Close form"
                >
                  ×
                </button>
              </div>
              <AdminProductForm
                mode={formMode}
                initialData={activeProduct}
                onSubmit={handleSave}
                onCancel={handleCancel}
                submitting={submitting}
                serverError={actionError}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
