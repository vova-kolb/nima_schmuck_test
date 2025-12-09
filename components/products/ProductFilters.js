'use client';

import styles from './ProductFilters.module.css';

const defaultSortOptions = [
  { label: 'Default', value: '' },
  { label: 'Price: Low to High', value: 'price:asc' },
  { label: 'Price: High to Low', value: 'price:desc' },
];

const classNames = (...values) => values.filter(Boolean).join(' ');

export default function ProductFilters({
  className,
  searchLabel = 'Search',
  searchPlaceholder = 'Search products',
  searchTerm = '',
  onSearchChange,
  categories = [],
  selectedCategory = '',
  onCategoryChange,
  categoryPlaceholder = 'All categories',
  materials = [],
  selectedMaterial = '',
  onMaterialChange,
  materialPlaceholder = 'All materials',
  sortLabel = 'Sort',
  sortBy = '',
  sortOrder = '',
  sortOptions = defaultSortOptions,
  onSortChange,
  showCategory = true,
  showMaterial = true,
  showSort = true,
  showLabels = true,
  variant = 'card',
}) {
  const currentSortValue =
    sortBy && sortOrder ? `${sortBy}:${sortOrder}` : '';

  const handleSortSelect = (value) => {
    const [sort, order] = value ? value.split(':') : ['', ''];
    onSortChange?.({ sort: sort || '', order: order || '' });
  };

  return (
    <div className={classNames(styles.filters, styles[variant], className)}>
      <label className={styles.field}>
        {showLabels && <span className={styles.label}>{searchLabel}</span>}
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder={searchPlaceholder}
          className={styles.input}
        />
      </label>

      {showMaterial && (
        <label className={styles.field}>
          {showLabels && <span className={styles.label}>Material</span>}
          <select
            value={selectedMaterial}
            onChange={(e) => onMaterialChange?.(e.target.value)}
            className={classNames(styles.input, styles.select)}
          >
            <option value="">{materialPlaceholder}</option>
            {materials.map((material) => (
              <option key={material} value={material}>
                {material}
              </option>
            ))}
          </select>
        </label>
      )}

      {showCategory && (
        <label className={styles.field}>
          {showLabels && <span className={styles.label}>Category</span>}
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange?.(e.target.value)}
            className={classNames(styles.input, styles.select)}
          >
            <option value="">{categoryPlaceholder}</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      )}

      {showSort && (
        <label className={styles.field}>
          {showLabels && <span className={styles.label}>{sortLabel}</span>}
          <select
            value={currentSortValue}
            onChange={(e) => handleSortSelect(e.target.value)}
            className={classNames(styles.input, styles.select)}
          >
            {sortOptions.map((option) => (
              <option key={option.value || option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}
