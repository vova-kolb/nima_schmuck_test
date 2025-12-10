import styles from '../page.module.css';
import HeroBanner from '@/components/layout/HeroBanner/HeroBanner';
import ProductsSection from '@/components/products/ProductsSection';

export default function CatalogPage() {
  return (
    <main className={styles.main}>
      <HeroBanner pageKey="catalog" showHeroImage={false} />
      <ProductsSection pageSize={12} />
    </main>
  );
}
