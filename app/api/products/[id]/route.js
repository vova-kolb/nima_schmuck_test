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

const extractId = (req, params) => {
  if (params?.id) return params.id;
  const pathname = req?.nextUrl?.pathname || "";
  const segments = pathname.split("/").filter(Boolean);
  return segments[segments.length - 1];
};

async function proxy(req, context = {}) {
  const awaitedParams = context?.params ? await context.params : {};
  const id = extractId(req, awaitedParams);
  if (!id) {
    return NextResponse.json({ error: "Product id is required" }, { status: 400 });
  }

  if (req.method && !["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  if (!BACKEND_BASE) {
    return NextResponse.json(
      { error: "Backend base URL is not configured" },
      { status: 500 }
    );
  }

  const targetUrl = `${BACKEND_BASE}/api/products/${encodeURIComponent(id)}${
    req.nextUrl.search || ""
  }`;

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
