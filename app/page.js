import styles from './page.module.css';
import HeroBanner from '@/components/layout/HeroBanner/HeroBanner';
import ProductsSection from '@/components/products/ProductsSection';

export default async function HomePage() {
  return (
    <>
      <main className={styles.main}>
        <HeroBanner pageKey="home" />
        <ProductsSection />
      </main>
    </>
  );
}
