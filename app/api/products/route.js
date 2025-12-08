import { NextResponse } from "next/server";

const BACKEND_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://project-25-2-scrum-team-2.onrender.com";

const FORBIDDEN_HEADERS = new Set([
  "host",
  "connection",
  "content-length",
  "accept-encoding",
  "cookie",
]);

async function proxy(req) {
  if (req.method && !["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const targetUrl = `${BACKEND_BASE}/products${req.nextUrl.search}`;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (!FORBIDDEN_HEADERS.has(key)) {
      headers.append(key, value);
    }
  });

  const backendResponse = await fetch(targetUrl, {
    method: req.method || "GET",
    headers,
    redirect: "manual",
  });

  const responseText = await backendResponse.text();
  const contentType =
    backendResponse.headers.get("content-type") || "application/json";

  return new NextResponse(responseText, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
    headers: {
      "content-type": contentType,
      "cache-control": "no-store",
    },
  });
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = proxy;
export const HEAD = proxy;
export const OPTIONS = proxy;
