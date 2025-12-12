import HeroBanner from "@/components/layout/HeroBanner/HeroBanner";
import { fetchProducts, isAvailableForStorefront } from "@/lib/api";
import { FALLBACK_WORKSHOPS } from "@/lib/fallbackWorkshops";
import WorkshopsContent from "@/components/workshops/WorkshopsContent";
import styles from "./page.module.css";

const demoDelay = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));

export const revalidate = 0;

export default async function WorkshopsPage() {
  await demoDelay();
  let workshops = [];

  try {
    const { items } = await fetchProducts({ category: "workshop", limit: 24 });
    workshops = (items || []).filter(isAvailableForStorefront);
  } catch (e) {
    workshops = [];
  }

  if (!Array.isArray(workshops) || workshops.length === 0) {
    workshops = FALLBACK_WORKSHOPS;
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
