export const API_BASE = "/api";
const PUBLIC_API_BASE = "/api";
const ADMIN_API_BASE = "/api/admin";

const normalizeBase = (base) => base?.replace(/\/+$/, "") || "";
const DEFAULT_API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://project-25-2-scrum-team-2.onrender.com";
const IMAGE_SERVICE_BASE = (() => {
  const apiBase = normalizeBase(DEFAULT_API_BASE);
  return `${apiBase}/img-upload`;
})();

export const buildGalleryAvatarUrl = (galleryId) => {
  if (galleryId === undefined || galleryId === null) return "";
  return `${IMAGE_SERVICE_BASE}/api/gallery/${encodeURIComponent(
    galleryId
  )}/avatar`;
};

export const buildGalleryImageUrl = (galleryId, idx = 0) => {
  if (galleryId === undefined || galleryId === null) return "";
  return `${IMAGE_SERVICE_BASE}/api/gallery/${encodeURIComponent(
    galleryId
  )}/gallery/${idx}`;
};

const buildProductPayload = (product = {}) => {
  const normalizeNumber = (value) => {
    if (value === undefined || value === null || value === "") return 0;
    const num = Number(value);
    return Number.isFinite(num) ? num : value;
  };

  const messageType =
    product.typeofmessage ?? product.typeOfMessage ?? product.messageType ?? "";

  const payload = {
    name: product.name?.trim() ?? "",
    category: product.category?.trim() ?? "",
    materials: product.materials?.trim() ?? "",
    featured: Boolean(product.featured),
    stone: product.stone?.trim() ?? "",
    price: normalizeNumber(product.price),
    discount: normalizeNumber(product.discount),
    typeofmessage: typeof messageType === "string" ? messageType.trim() : "",
    message: product.message?.trim() ?? "",
    description: product.description?.trim() ?? "",
    availability: product.availability?.trim() ?? "",
    availabilitystatus:
      product.availabilitystatus?.trim() ?? product.availabilitystatus ?? "",
  };

  if (product.img) {
    payload.img = Array.isArray(product.img)
      ? product.img.filter(Boolean)
      : [product.img];
  }

  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) {
      delete payload[key];
    }
  });

  return payload;
};

export const normalizeImageSrc = (src) => {
  if (!src) return "";
  let cleaned = String(src).trim();
  if (/^https?:\/\//i.test(cleaned)) {
    return cleaned;
  }
  cleaned = cleaned.replace(/^(\.\.\/)+/, "/");
  cleaned = cleaned.replace(/^\.?\/?public/, "");
  cleaned = cleaned.replace(/^\/+/, "/");
  if (!cleaned.startsWith("/")) cleaned = `/${cleaned}`;

  const looksLikeApi =
    cleaned.includes("/api/") || cleaned.includes("/img-upload/");
  const hasExtension = /\.[a-zA-Z0-9]{2,4}(\?|$)/.test(cleaned);

  return !hasExtension && !looksLikeApi ? `${cleaned}.jpg` : cleaned;
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

  const res = await fetch(`${PUBLIC_API_BASE}/products?${params.toString()}`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();
  const items = (data.items ?? []).map((item) => {
    const rawImg = item.img ?? item.images ?? [];
    const galleryId =
      item.galleryId ?? item.gallery_id ?? item.gallery ?? item.id ?? item._id;
    const avatarUrl = buildGalleryAvatarUrl(galleryId);
    const normalizedImgs = Array.isArray(rawImg)
      ? rawImg.map(normalizeImageSrc)
      : [normalizeImageSrc(rawImg)];

    const mergedImages = [avatarUrl, ...normalizedImgs].reduce((acc, value) => {
      const cleaned = normalizeImageSrc(value);
      if (cleaned && !acc.includes(cleaned)) {
        acc.push(cleaned);
      }
      return acc;
    }, []);

    return {
      ...item,
      galleryId,
      img: mergedImages.filter(Boolean),
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
    const res = await fetch(`${PUBLIC_API_BASE}/products/${safeId}`, {
      cache: "no-store",
      credentials: "include",
    });
    if (!res.ok) {
      return null;
    }
    item = await res.json();
  } catch (e) {
    return null;
  }

  const rawImg = item.img ?? item.images ?? [];
  const galleryId =
    item.galleryId ?? item.gallery_id ?? item.gallery ?? item.id ?? item._id;
  const avatarUrl = buildGalleryAvatarUrl(galleryId);
  const normalizedImgs = Array.isArray(rawImg)
    ? rawImg.map(normalizeImageSrc)
    : [normalizeImageSrc(rawImg)];

  const mergedImages = [avatarUrl, ...normalizedImgs].reduce((acc, value) => {
    const cleaned = normalizeImageSrc(value);
    if (cleaned && !acc.includes(cleaned)) {
      acc.push(cleaned);
    }
    return acc;
  }, []);

  return {
    ...item,
    galleryId,
    img: mergedImages.filter(Boolean),
  };
}

export async function createProduct(product) {
  const payload = buildProductPayload(product);

  const res = await fetch(`${ADMIN_API_BASE}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to create product");
  }

  return res.json();
}

export async function updateProduct(id, product) {
  if (!id) {
    throw new Error("Product id is required");
  }

  const payload = buildProductPayload(product);

  const res = await fetch(
    `${ADMIN_API_BASE}/products/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update product");
  }

  return res.json();
}

export async function deleteProduct(id) {
  if (!id) {
    throw new Error("Product id is required");
  }

  const res = await fetch(
    `${ADMIN_API_BASE}/products/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to delete product");
  }

  return res.json();
}
