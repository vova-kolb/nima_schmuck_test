import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchAdminSession } from "@/lib/auth";
import LogoutButton from "@/components/admin/LogoutButton";
import styles from "./layout.module.css";

export default async function ProtectedAdminLayout({ children }) {
  const cookieHeader = cookies()
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
