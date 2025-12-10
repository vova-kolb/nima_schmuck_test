import styles from "./page.module.css";
import HeroBanner from "@/components/layout/HeroBanner/HeroBanner";
import ProductsSection from "@/components/products/ProductsSection";

export default async function HomePage() {
  return (
    <>
      <main className={styles.main}>
        <div className="container">
          <HeroBanner pageKey="home" />
        </div>

        <ProductsSection />
      </main>
    </>
  );
}
