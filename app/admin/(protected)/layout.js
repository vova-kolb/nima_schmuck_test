import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchAdminSession } from "@/lib/auth";
import { shouldSkipAdminAuth } from "@/lib/api";
import LogoutButton from "@/components/admin/LogoutButton";
import styles from "./layout.module.css";

export default async function ProtectedAdminLayout({ children }) {
  if (shouldSkipAdminAuth()) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.topBar}>
          <div className="container">
            <div className={styles.topBarInner}>
              <span className={styles.brand}>Admin (auth bypassed)</span>
              <LogoutButton />
            </div>
          </div>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    );
  }

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
  const { authenticated } = await fetchAdminSession(cookieHeader);

  if (!authenticated) {
    redirect("/admin/login");
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBar}>
        <div className="container">
          <div className={styles.topBarInner}>
            <span className={styles.brand}>Admin</span>
            <LogoutButton />
          </div>
        </div>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
