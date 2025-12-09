import { NextResponse } from "next/server";

const BACKEND_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://project-25-2-scrum-team-2.onrender.com";

const FORBIDDEN_HEADERS = new Set([
  "host",
  "connection",
  "content-length",
  "accept-encoding",
]);

const rewriteCookie = (cookie) => {
  if (!cookie) return cookie;
  let rewritten = cookie;

  // Drop domain to keep it host-only for the current origin
  rewritten = rewritten.replace(/;\s*Domain=[^;]*/gi, "");
  // Allow HTTP during local dev
  rewritten = rewritten.replace(/;\s*Secure/gi, "");
  // Normalize SameSite to Lax for browsers that reject None without Secure
  rewritten = rewritten.replace(/;\s*SameSite=[^;]*/gi, "");
  rewritten += "; SameSite=Lax";

  // Ensure the path is set
  if (!/;\s*Path=/i.test(rewritten)) {
    rewritten += "; Path=/";
  }

  return rewritten;
};

async function proxy(req, context) {
  const resolved = (await context?.params) || {};
  const pathSegments = Array.isArray(resolved.path) ? resolved.path : [];
  const targetPath = pathSegments.join("/");
  const targetUrl = `${BACKEND_BASE}/admin/${targetPath}${req.nextUrl.search}`;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (!FORBIDDEN_HEADERS.has(key)) {
      headers.append(key, value);
    }
  });

  const method = req.method || "GET";
  const hasBody = !["GET", "HEAD"].includes(method.toUpperCase());
  const body = hasBody ? await req.text() : undefined;

  const backendResponse = await fetch(targetUrl, {
    method,
    headers,
    body,
    redirect: "manual",
  });

  const responseText = await backendResponse.text();
  const contentType =
    backendResponse.headers.get("content-type") || "application/json";

  const response = new NextResponse(responseText, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
    headers: {
      "content-type": contentType,
      "cache-control": "no-store",
    },
  });

  const setCookies =
    backendResponse.headers.getSetCookie?.() ||
    backendResponse.headers.get("set-cookie");

  if (Array.isArray(setCookies)) {
    setCookies.forEach((cookie) =>
      response.headers.append("set-cookie", rewriteCookie(cookie))
    );
  } else if (setCookies) {
    response.headers.append("set-cookie", rewriteCookie(setCookies));
  }

  return response;
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const PATCH = proxy;
export const OPTIONS = proxy;
export const HEAD = proxy;
