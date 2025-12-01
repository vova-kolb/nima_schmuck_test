import styles from '../page.module.css';
import HeroBanner from '@/components/layout/HeroBanner/HeroBanner';

export default function WorkshopsPage() {
  return (
    <main className={styles.main}>
      <div className="container">
        <HeroBanner pageKey="workshops" />
      </div>
    </main>
  );
}
