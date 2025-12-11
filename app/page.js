import styles from "./page.module.css";
import HeroBanner from "@/components/layout/HeroBanner/HeroBanner";
import ProductsSection from "@/components/products/ProductsSection";

const demoDelay = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function HomePage() {
  await demoDelay();
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
