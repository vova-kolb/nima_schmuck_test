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
      {!isAdmin && <Header />}
      {children}
      {!isAdmin && <Footer />}
    </CartProvider>
  );
}
