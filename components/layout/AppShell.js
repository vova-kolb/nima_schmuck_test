'use client';

import { usePathname } from 'next/navigation';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import { CartProvider } from '@/lib/hooks/useCart';

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <CartProvider>
      <div className="app-shell">
        {!isAdmin && <Header />}
        <div className="app-shell__content">{children}</div>
        {!isAdmin && <Footer />}
      </div>
    </CartProvider>
  );
}
