'use client';

import { useEffect, useRef, useState } from 'react';
import { useProducts } from '@/lib/hooks/useProducts';
import ProductGrid from './ProductGrid';
import ProductFilters from './ProductFilters';
import styles from './ProductsSection.module.css';

export default function ProductsSection({ pageSize } = {}) {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const [contentMinHeight, setContentMinHeight] = useState(0);
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
  const placeholderCount = Number.isFinite(Number(pageSize))
    ? Math.max(Number(pageSize), 8)
    : 12;

  const measureContentHeight = () => {
    if (!contentRef.current) return;
    const rect = contentRef.current.getBoundingClientRect();
    if (rect.height > 0) {
      setContentMinHeight((prev) => Math.max(prev, Math.ceil(rect.height)));
    }
  };

  const getHeaderOffset = () => {
    const header = typeof document !== 'undefined' ? document.querySelector('header') : null;
    const headerHeight = header?.getBoundingClientRect().height || 0;
    return Math.max(headerHeight + 12, 60);
  };

  const scrollToSectionTop = () => {
    if (!sectionRef.current || typeof window === 'undefined') return;
    const rect = sectionRef.current.getBoundingClientRect();
    const offset = getHeaderOffset();
    const targetTop = rect.top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
  };

  useEffect(() => {
    measureContentHeight();
  }, []);

  useEffect(() => {
    if (!loading) {
      measureContentHeight();
    }
  }, [loading]);

  const handlePrevPage = () => {
    prevPage();
    scrollToSectionTop();
  };

  const handleNextPage = () => {
    nextPage();
    scrollToSectionTop();
  };

  return (
    <section ref={sectionRef} className={`${styles.section} reveal-up reveal-after-hero`}>
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
          <div className={styles.placeholderGrid} aria-hidden="true">
            {Array.from({ length: placeholderCount }).map((_, index) => (
              <div key={index} className={styles.placeholderCard}>
                <div className={styles.placeholderMedia} />
                <div className={styles.placeholderBody}>
                  <div className={styles.placeholderLineShort} />
                  <div className={styles.placeholderLine} />
                  <div className={styles.placeholderLine} />
                </div>
              </div>
            ))}
          </div>
        )}

        <div
          ref={contentRef}
          className={styles.contentArea}
          style={contentMinHeight ? { minHeight: `${contentMinHeight}px` } : undefined}
        >
          {error && <p className={`${styles.status} ${styles.error}`}>{error}</p>}

          {!loading && !error && <ProductGrid products={filteredProducts} />}

          {!loading && !error && totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageButton}
                disabled={page <= 1 || loading}
                onClick={handlePrevPage}
              >
                Previous
              </button>
              <span className={styles.pageInfo}>
                Page {page} of {totalPages}
              </span>
              <button
                className={styles.pageButton}
                disabled={page >= totalPages || loading}
                onClick={handleNextPage}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
