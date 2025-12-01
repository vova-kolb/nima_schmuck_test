import Header from '../components/layout/Header/Header';
import Footer from '../components/layout/Footer/Footer';
import './globals.css';
import { jost } from './fonts';

export const metadata = {
  title: 'Nima Schmuck',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jost.variable}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
