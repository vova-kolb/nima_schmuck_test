import styles from '../page.module.css';
import HeroBanner from '@/components/layout/HeroBanner/HeroBanner';

export default function CustomCreationsPage() {
  return (
    <main className={styles.main}>
      <div className="container">
        <HeroBanner pageKey="custom-creations" />
      </div>
    </main>
  );
}
