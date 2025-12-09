"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchAdminSession, loginAdmin, logoutAdmin } from "@/lib/auth";
import styles from "./page.module.css";

const prettyPrint = (value) => {
  if (value === undefined || value === null) return "";
  try {
    return JSON.stringify(value, null, 2);
  } catch (e) {
    return String(value);
  }
};

const statusClass = (status) => {
  switch (status) {
    case "success":
      return styles.success;
    case "warning":
      return styles.warning;
    case "error":
      return styles.error;
    case "loading":
      return styles.pending;
    default:
      return styles.idle;
  }
};

const initialCallState = { status: "idle", payload: null, error: "" };

export default function AdminEndpointCheckPage() {
  const [email, setEmail] = useState("admin@shop.com");
  const [password, setPassword] = useState("nimaschmuck");
  const [sessionState, setSessionState] = useState(initialCallState);
  const [loginState, setLoginState] = useState(initialCallState);
  const [logoutState, setLogoutState] = useState(initialCallState);
  const [lastAction, setLastAction] = useState("");

  const handleSessionCheck = useCallback(
    async ({ silentLastAction = false } = {}) => {
      setSessionState({ status: "loading", payload: null, error: "" });
      if (!silentLastAction) {
        setLastAction("GET /admin/me");
      }
      try {
        const payload = await fetchAdminSession();
        setSessionState({
          status: payload?.authenticated ? "success" : "warning",
          payload,
          error: "",
        });
      } catch (e) {
        setSessionState({
          status: "error",
          payload: null,
          error: e?.message || "Unable to reach /admin/me",
        });
      }
    },
    []
  );

  useEffect(() => {
    handleSessionCheck();
  }, [handleSessionCheck]);

  const handleLogin = async () => {
    setLoginState({ status: "loading", payload: null, error: "" });
    setLastAction("POST /admin/login");
    try {
      const payload = await loginAdmin({ email, password });
      setLoginState({ status: "success", payload, error: "" });
      await handleSessionCheck({ silentLastAction: true });
    } catch (e) {
      setLoginState({
        status: "error",
        payload: null,
        error: e?.message || "Login failed",
      });
    }
  };

  const handleLogout = async () => {
    setLogoutState({ status: "loading", payload: null, error: "" });
    setLastAction("POST /admin/logout");
    try {
      const payload = await logoutAdmin();
      setLogoutState({ status: "success", payload, error: "" });
      await handleSessionCheck({ silentLastAction: true });
    } catch (e) {
      setLogoutState({
        status: "error",
        payload: null,
        error: e?.message || "Logout failed",
      });
    }
  };

  const busy =
    sessionState.status === "loading" ||
    loginState.status === "loading" ||
    logoutState.status === "loading";

  return (
    <section className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <p className={styles.kicker}>Internal check</p>
            <h1 className={styles.title}>Admin auth endpoints</h1>
            <p className={styles.lede}>
              Hidden utility for quickly verifying /admin/login, /admin/logout,
              and /admin/me. Responses render below with the provided test
              credentials.
            </p>
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.refresh}
              onClick={() => handleSessionCheck()}
              disabled={sessionState.status === "loading"}
            >
              {sessionState.status === "loading"
                ? "Checking..."
                : "Re-run /admin/me"}
            </button>
            <span className={`${styles.pill} ${statusClass(sessionState.status)}`}>
              {sessionState.status}
            </span>
          </div>
        </div>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Email</span>
            <span className={styles.metaValue}>{email}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Password</span>
            <span className={styles.metaValue}>{password}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Last call</span>
            <span className={styles.metaValue}>{lastAction || "None yet"}</span>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.label}>POST /admin/login</span>
              <span className={`${styles.pill} ${statusClass(loginState.status)}`}>
                {loginState.status}
              </span>
            </div>
            <p className={styles.helper}>
              Submits the form below and expects a session cookie on success.
            </p>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Email</span>
              <input
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@shop.com"
                autoComplete="email"
              />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Password</span>
              <input
                className={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                autoComplete="current-password"
              />
            </label>

            <button
              type="button"
              className={styles.primary}
              onClick={handleLogin}
              disabled={busy}
            >
              {loginState.status === "loading"
                ? "Logging in..."
                : "Call /admin/login"}
            </button>

            {loginState.error ? (
              <p className={styles.errorText}>{loginState.error}</p>
            ) : null}

            <div className={styles.payload}>
              <span className={styles.payloadLabel}>Response body</span>
              <pre className={styles.code}>
                {prettyPrint(loginState.payload) || "No response yet."}
              </pre>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.label}>GET /admin/me</span>
              <span className={`${styles.pill} ${statusClass(sessionState.status)}`}>
                {sessionState.status}
              </span>
            </div>
            <p className={styles.helper}>
              Checks whether the current browser has an active admin session.
            </p>

            <button
              type="button"
              className={styles.secondary}
              onClick={() => handleSessionCheck()}
              disabled={sessionState.status === "loading"}
            >
              {sessionState.status === "loading"
                ? "Checking..."
                : "Call /admin/me"}
            </button>

            {sessionState.error ? (
              <p className={styles.errorText}>{sessionState.error}</p>
            ) : null}

            <div className={styles.sessionResult}>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Authenticated</span>
                <span className={styles.metaValue}>
                  {sessionState.payload?.authenticated ? "Yes" : "No"}
                </span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Raw payload</span>
              </div>
              <pre className={styles.code}>
                {prettyPrint(sessionState.payload) || "No response yet."}
              </pre>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.label}>POST /admin/logout</span>
              <span className={`${styles.pill} ${statusClass(logoutState.status)}`}>
                {logoutState.status}
              </span>
            </div>
            <p className={styles.helper}>
              Destroys the current admin session cookie.
            </p>

            <button
              type="button"
              className={styles.danger}
              onClick={handleLogout}
              disabled={busy}
            >
              {logoutState.status === "loading"
                ? "Logging out..."
                : "Call /admin/logout"}
            </button>

            {logoutState.error ? (
              <p className={styles.errorText}>{logoutState.error}</p>
            ) : null}

            <div className={styles.payload}>
              <span className={styles.payloadLabel}>Response body</span>
              <pre className={styles.code}>
                {prettyPrint(logoutState.payload) || "No response yet."}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
