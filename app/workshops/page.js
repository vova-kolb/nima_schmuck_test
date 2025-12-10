import HeroBanner from "@/components/layout/HeroBanner/HeroBanner";
import { fetchProducts } from "@/lib/api";
import WorkshopsContent from "@/components/workshops/WorkshopsContent";
import styles from "./page.module.css";

export const revalidate = 0;

export default async function WorkshopsPage() {
  let workshops = [];

  try {
    const { items } = await fetchProducts({ category: "workshop", limit: 24 });
    workshops = items || [];
  } catch (e) {
    workshops = [];
  }

  return (
    <main className={styles.main}>
      <div className="container">
        <HeroBanner pageKey="workshops" />
      </div>

      <WorkshopsContent workshops={workshops} />
    </main>
  );
}
