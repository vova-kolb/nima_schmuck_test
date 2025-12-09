import { API_BASE } from "./api";

// Default to bypass in dev unless explicitly disabled.
const SKIP_ADMIN_AUTH =
  process.env.NEXT_PUBLIC_SKIP_ADMIN_AUTH !== "false";

const extractBody = async (res) => {
  try {
    return await res.json();
  } catch (e) {
    return null;
  }
};

const deriveAuthFlag = (payload) => {
  if (!payload || typeof payload !== "object") return true;
  if ("authenticated" in payload) return Boolean(payload.authenticated);
  if ("isAuthenticated" in payload) return Boolean(payload.isAuthenticated);
  if ("loggedIn" in payload) return Boolean(payload.loggedIn);
  if ("user" in payload) return Boolean(payload.user);
  return true;
};

export async function loginAdmin({ email, password }) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    cache: "no-store",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await extractBody(res);
    const message =
      data?.message ||
      data?.error ||
      "Unable to log in. Check your credentials and try again.";
    throw new Error(message);
  }

  return extractBody(res);
}

export async function fetchAdminSession(cookieHeader) {
  try {
    if (SKIP_ADMIN_AUTH) {
      return { authenticated: true, data: { skipped: true } };
    }

    const headers = cookieHeader ? { Cookie: cookieHeader } : {};
    const res = await fetch(`${API_BASE}/admin/me`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      headers,
    });

    if (!res.ok) {
      return { authenticated: false, data: null };
    }

    const data = await extractBody(res);
    return {
      authenticated: deriveAuthFlag(data),
      data,
    };
  } catch (e) {
    return { authenticated: false, data: null };
  }
}

export async function logoutAdmin() {
  const res = await fetch(`${API_BASE}/admin/logout`, {
    method: "POST",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const data = await extractBody(res);
    const message = data?.message || "Failed to log out. Please try again.";
    throw new Error(message);
  }

  return extractBody(res);
}
