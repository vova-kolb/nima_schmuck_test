import ProductCard from './ProductCard';
import styles from './ProductGrid.module.css';

export default function ProductGrid({ products = [] }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {products.map((p, index) => {
          const baseKey =
            p.id ?? p.productId ?? p._id ?? p.galleryId ?? p.name ?? "product";
          const key = `${String(baseKey)}-${index}`;
          return <ProductCard key={key} product={p} />;
        })}
      </div>
    </div>
  );
}
