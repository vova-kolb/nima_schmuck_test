'use client';

import { useProducts } from '@/lib/hooks/useProducts';
import ProductGrid from './ProductGrid';
import styles from './ProductsSection.module.css';

export default function ProductsSection() {
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
    loading,
    error,
    selectCategory,
    selectMaterial,
    nextPage,
    prevPage,
    updateSearch,
    selectSort,
  } = useProducts();
  const categoryOptions = ['All', ...categories];

  const handleCategoryChange = async (e) => {
    await selectCategory(e.target.value);
  };

  const handleMaterialChange = async (e) => {
    await selectMaterial(e.target.value);
  };

  const handleSearchChange = (e) => {
    updateSearch(e.target.value);
  };

  const handleSortChange = async (e) => {
    const value = e.target.value;
    if (!value) {
      await selectSort({ sort: '', order: '' });
      return;
    }
    const [sort, order] = value.split(':');
    await selectSort({ sort, order });
  };

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <p className={styles.kicker}>Our Collections</p>
          <h2 className={styles.title}>Exquisite Jewelry</h2>
          <p className={styles.subtitle}>
            Browse our carefully curated selection of fine jewelry, from elegant
            rings to stunning necklaces.
          </p>
          {/* <div
            className={styles.filters}
            role="tablist"
            aria-label="Filter by category"
          >
            {categoryOptions.map((option) => {
              const value = option === "All" ? "" : option;
              const isActive = selectedCategory === value;
              return (
                <button
                  key={option}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.filterChip} ${isActive ? styles.active : ""}`}
                  onClick={() => selectCategory(value)}
                >
                  {option}
                </button>
              );
            })}
          </div> */}
        </div>

        <div className={styles.controlsRow}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="search">
              Search
            </label>
            <input
              id="search"
              type="search"
              className={styles.input}
              placeholder="Search products"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="material">
              Material
            </label>
            <select
              id="material"
              className={`${styles.input} ${styles.select}`}
              value={selectedMaterial}
              onChange={handleMaterialChange}
            >
              <option value="">All materials</option>
              {materials.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className={`${styles.input} ${styles.select}`}
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="sort">
              Sort
            </label>
            <select
              id="sort"
              className={`${styles.input} ${styles.select}`}
              value={sortBy && sortOrder ? `${sortBy}:${sortOrder}` : ''}
              onChange={handleSortChange}
            >
              <option value="">Default</option>
              <option value="price:asc">Price: Low to High</option>
              <option value="price:desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading && <p className={styles.status}>Loading...</p>}
        {error && <p className={`${styles.status} ${styles.error}`}>{error}</p>}

        {!loading && !error && <ProductGrid products={products} />}

        {!loading && !error && totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.pageButton}
              disabled={page <= 1 || loading}
              onClick={prevPage}
            >
              Previous
            </button>
            <span className={styles.pageInfo}>
              Page {page} of {totalPages}
            </span>
            <button
              className={styles.pageButton}
              disabled={page >= totalPages || loading}
              onClick={nextPage}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
