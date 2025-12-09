"use client";

import { useCallback, useEffect, useState } from "react";
import AdminProductForm from "@/components/admin/AdminProductForm";
import AdminProductTable from "@/components/admin/AdminProductTable";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "@/lib/api";
import styles from "../../page.module.css";

const PAGE_SIZE = 10;
const SORT_FIELD = "id";
const SORT_ORDER = "desc";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [activeProduct, setActiveProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadProducts = useCallback(async (nextPage = 1) => {
    setLoading(true);
    setError("");
    try {
      const { items, totalPages: apiPages, page: apiPage } =
        await fetchProducts({
          page: nextPage,
          limit: PAGE_SIZE,
          sortBy: SORT_FIELD,
          order: SORT_ORDER,
        });

      const sortedItems = [...items].sort((a, b) => {
        const aId = Number(a.id) || 0;
        const bId = Number(b.id) || 0;
        return bId - aId;
      });

      setProducts(sortedItems);
      setPage(apiPage || nextPage);
      setTotalPages(apiPages || 1);
    } catch (e) {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts(1);
  }, [loadProducts]);

  const handlePageChange = async (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    await loadProducts(nextPage);
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
      } else {
        await createProduct(payload);
      }
      await loadProducts(formMode === "edit" ? page : 1);
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
      await loadProducts(page);
    } catch (e) {
      setActionError("Failed to delete product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.hero}>
          <div>
            <p className={styles.kicker}>Admin panel</p>
            <h1 className={styles.title}>Products</h1>
          </div>
          <div className={styles.heroActions}>
            <button
              type="button"
              className={`${styles.button} ${styles.primary}`}
              onClick={openCreateForm}
              disabled={submitting}
            >
              Add Product
            </button>
            <button
              type="button"
              className={`${styles.button} ${styles.secondary}`}
              onClick={loadProducts}
              disabled={loading || submitting}
            >
              Refresh
            </button>
          </div>
        </div>

        <div className={styles.layout}>
          <AdminProductTable
            products={products}
            loading={loading}
            error={error}
            onEdit={openEditForm}
            onDelete={handleDelete}
            onRefresh={() => loadProducts(page)}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            disableActions={submitting}
          />

          <div className={styles.formColumn}>
            {formOpen ? (
              <AdminProductForm
                mode={formMode}
                initialData={activeProduct}
                onSubmit={handleSave}
                onCancel={handleCancel}
                submitting={submitting}
                serverError={actionError}
              />
            ) : (
              <div className={styles.formPlaceholder}>
                <p className={styles.placeholderTitle}>
                  Select a product to edit or create a new one.
                </p>
                <p className={styles.placeholderText}>
                  The form will appear here with all database fields, ready for
                  quick changes.
                </p>
                <button
                  type="button"
                  className={`${styles.button} ${styles.primary}`}
                  onClick={openCreateForm}
                >
                  Add Product
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
