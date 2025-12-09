import "./globals.css";
import { jost } from "./fonts";
import AppShell from "@/components/layout/AppShell";

export const metadata = {
  title: "Nima Schmuck",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jost.variable}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
