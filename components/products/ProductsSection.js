'use client';

import { useProducts } from '@/lib/hooks/useProducts';
import ProductGrid from './ProductGrid';
import ProductFilters from './ProductFilters';
import styles from './ProductsSection.module.css';

export default function ProductsSection({ pageSize } = {}) {
  const normalize = (value) => String(value || '').toLowerCase().trim();
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
  } = useProducts({ pageSize, hideUnavailable: true });

  const filteredProducts = products.filter(
    (item) => normalize(item.category) !== 'workshop'
  );
  const filteredCategories = categories.filter(
    (cat) => normalize(cat) !== 'workshop'
  );
  const safeSelectedCategory =
    normalize(selectedCategory) === 'workshop' ? '' : selectedCategory;

  const handleCategoryChange = (value) => {
    if (normalize(value) === 'workshop') {
      selectCategory('');
      return;
    }
    selectCategory(value);
  };

  const sortOptions = [
    { label: 'Default', value: '' },
    { label: 'Price: Low to High', value: 'price:asc' },
    { label: 'Price: High to Low', value: 'price:desc' },
  ];

  return (
    <section className={`${styles.section} reveal-up reveal-after-hero`}>
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

        <ProductFilters
          className={styles.filterBar}
          searchTerm={searchTerm}
          onSearchChange={updateSearch}
          categories={filteredCategories}
          selectedCategory={safeSelectedCategory}
          onCategoryChange={handleCategoryChange}
          materials={materials}
          selectedMaterial={selectedMaterial}
          onMaterialChange={selectMaterial}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={selectSort}
          sortOptions={sortOptions}
        />

        {loading && (
          <div className={styles.loaderWrap}>
            <span className="loader" aria-label="Loading products" />
          </div>
        )}
        {error && <p className={`${styles.status} ${styles.error}`}>{error}</p>}

        {!loading && !error && <ProductGrid products={filteredProducts} />}

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
