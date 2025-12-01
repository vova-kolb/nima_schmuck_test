const API_BASE = "https://project-25-2-scrum-team-2.onrender.com";

const normalizeImageSrc = (src) => {
  if (!src) return "";
  let cleaned = src.trim();
  cleaned = cleaned.replace(/^(\.\.\/)+/, "/");
  cleaned = cleaned.replace(/^\.?\/?public/, "");
  if (!cleaned.startsWith("/")) {
    cleaned = `/${cleaned}`;
  }
  if (!/\.[a-zA-Z0-9]{2,4}$/.test(cleaned)) {
    cleaned = `${cleaned}.jpg`;
  }
  return cleaned;
};

export async function fetchProducts({
  category,
  materials,
  page = 1,
  limit = 12,
  name,
  sortBy,
  order,
} = {}) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (category) params.set("category", category);
  if (materials) params.set("materials", materials);
  if (name) params.set("name", name);
  if (sortBy) params.set("sortBy", sortBy);
  if (order) params.set("order", order);

  const res = await fetch(`${API_BASE}/admin/products?${params.toString()}`);
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();
  const items = (data.items ?? []).map((item) => {
    const rawImg = item.img ?? item.images ?? [];
    const normalizedImgs = Array.isArray(rawImg)
      ? rawImg.map(normalizeImageSrc)
      : [normalizeImageSrc(rawImg)];

    return {
      ...item,
      img: normalizedImgs.filter(Boolean),
    };
  });
  const total = data.total ?? data.count ?? 0;
  const totalPages =
    data.totalPages ??
    data.pages ??
    (total > 0 ? Math.max(1, Math.ceil(total / limit)) : 1);

  return {
    items,
    page: data.page ?? page,
    limit,
    total,
    totalPages,
  };
}

export async function fetchProductById(id) {
  if (!id) {
    throw new Error("Product id is required");
  }

  const safeId = encodeURIComponent(id);
  let item = null;
  try {
    const res = await fetch(`${API_BASE}/admin/products/${safeId}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return null;
    }
    item = await res.json();
  } catch (e) {
    return null;
  }

  const rawImg = item.img ?? item.images ?? [];
  const normalizedImgs = Array.isArray(rawImg)
    ? rawImg.map(normalizeImageSrc)
    : [normalizeImageSrc(rawImg)];

  return {
    ...item,
    img: normalizedImgs.filter(Boolean),
  };
}
