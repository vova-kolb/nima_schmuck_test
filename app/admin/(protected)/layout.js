import { cookies } from "next/headers";
import { fetchAdminSession } from "@/lib/auth";
import LogoutButton from "@/components/admin/LogoutButton";
import styles from "./layout.module.css";

export default async function ProtectedAdminLayout({ children }) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
  const { authenticated } = await fetchAdminSession(cookieHeader);

  if (!authenticated) {
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
        <div className={styles.content}>
          <div className="container">
            <p>Not authenticated. Please log in.</p>
          </div>
        </div>
      </div>
    );
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
