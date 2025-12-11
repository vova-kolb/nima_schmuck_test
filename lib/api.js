export const API_BASE = "/api";
const PUBLIC_API_BASE = "/api";
const ADMIN_API_BASE = "/api/admin";

const normalizeBase = (base) => base?.replace(/\/+$/, "") || "";
const deriveImageKey = (item, fallback) =>
  item?.productId ??
  item?.product_id ??
  item?.galleryId ??
  item?.gallery_id ??
  item?.gallery ??
  fallback ??
  item?.id ??
  item?._id;

export const DEFAULT_API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://project-25-2-scrum-team-2.onrender.com";

export const normalizeAvailabilityStatus = (item = {}) => {
  const raw =
    item.availabilitystatus ??
    item.availabilityStatus ??
    item.availability_status ??
    item.availability ??
    "";
  return String(raw ?? "").trim().toLowerCase();
};

export const isAvailableForStorefront = (item = {}) => {
  const status = normalizeAvailabilityStatus(item);
  if (!status) return true;
  return !(
    status.includes("not available") ||
    status.includes("unavailable")
  );
};

const API_BASE_FOR_FETCH = (() => {
  const isServer = typeof window === "undefined";
  if (isServer) {
    const normalized = normalizeBase(DEFAULT_API_BASE);
    return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
  }
  return PUBLIC_API_BASE;
})();
const IMAGE_SERVICE_BASE = (() => {
  const apiBase = normalizeBase(DEFAULT_API_BASE);
  return `${apiBase}/img-upload`;
})();

export const buildGalleryAvatarUrl = (galleryId) => {
  if (galleryId === undefined || galleryId === null) return "";
  return `${IMAGE_SERVICE_BASE}/api/gallery/by-product/${encodeURIComponent(
    galleryId
  )}/avatar`;
};

export const buildGalleryImageUrl = (productId, idx = 0) => {
  if (productId === undefined || productId === null) return "";
  return `${IMAGE_SERVICE_BASE}/api/gallery/by-product/${encodeURIComponent(
    productId
  )}/${idx}`;
};

const buildProductPayload = (product = {}) => {
  const normalizeNumber = (value) => {
    if (value === undefined || value === null || value === "") return 0;
    const num = Number(value);
    return Number.isFinite(num) ? num : value;
  };
  const normalizeText = (value) =>
    value === undefined || value === null ? "" : String(value).trim();

  const messageType =
    product.typeofmessage ?? product.typeOfMessage ?? product.messageType ?? "";
  const normalizedMessageType =
    typeof messageType === "string" ? messageType.trim() : "";
  const normalizedAvailability = normalizeText(product.availability);
  const rawAvailabilityStatus =
    product.availabilitystatus ??
    product.availabilityStatus ??
    product.availability_status ??
    "";
  const normalizedAvailabilityStatus =
    normalizeText(rawAvailabilityStatus) || normalizedAvailability;

  const payload = {
    name: product.name?.trim() ?? "",
    category: product.category?.trim() ?? "",
    materials: product.materials?.trim() ?? "",
    featured: Boolean(product.featured),
    stone: product.stone?.trim() ?? "",
    price: normalizeNumber(product.price),
    discount: normalizeNumber(product.discount),
    // keep all naming variants to satisfy backend expectations
    typeofmessage: normalizedMessageType,
    typeOfMessage: normalizedMessageType,
    messageType: normalizedMessageType,
    message: product.message?.trim() ?? "",
    description: product.description?.trim() ?? "",
    availability: normalizedAvailability,
    availabilitystatus: normalizedAvailabilityStatus,
    availabilityStatus: normalizedAvailabilityStatus,
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

  const res = await fetch(`${API_BASE_FOR_FETCH}/products?${params.toString()}`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();
  const items = (data.items ?? []).map((item) => {
  const rawImg = item.img ?? item.images ?? [];
  const galleryId = deriveImageKey(item);
  const avatarUrl = buildGalleryAvatarUrl(galleryId);
  const galleryImages = galleryId
    ? Array.from({ length: 4 }, (_, idx) => buildGalleryImageUrl(galleryId, idx))
    : [];
  const normalizedImgs = Array.isArray(rawImg)
    ? rawImg.map(normalizeImageSrc)
    : [normalizeImageSrc(rawImg)];

  const mergedImages = [avatarUrl, ...galleryImages, ...normalizedImgs].reduce(
    (acc, value) => {
      const cleaned = normalizeImageSrc(value);
      if (cleaned && !acc.includes(cleaned)) {
        acc.push(cleaned);
      }
      return acc;
    },
    []
  );

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
  const fetchOnce = async (url) => {
    try {
      const res = await fetch(url, {
        cache: "no-store",
        credentials: "include",
      });
      if (!res.ok) return { ok: false, status: res.status };
      const data = await res.json();
      return { ok: true, data };
    } catch (e) {
      return { ok: false, error: e };
    }
  };

  const primary = await fetchOnce(`${API_BASE_FOR_FETCH}/products/${safeId}`);
  if (primary.ok) {
    item = primary.data;
  } else {
    const fallback = await fetchOnce(
      `${DEFAULT_API_BASE}/api/products/${safeId}`
    );
    if (!fallback.ok) {
      return null;
    }
    item = fallback.data;
  }

  const rawImg = item.img ?? item.images ?? [];
  const galleryId = deriveImageKey(item, safeId);
  const avatarUrl = buildGalleryAvatarUrl(galleryId);
  const galleryImages = galleryId
    ? Array.from({ length: 4 }, (_, idx) => buildGalleryImageUrl(galleryId, idx))
    : [];
  const normalizedImgs = Array.isArray(rawImg)
    ? rawImg.map(normalizeImageSrc)
    : [normalizeImageSrc(rawImg)];

  const mergedImages = [avatarUrl, ...galleryImages, ...normalizedImgs].reduce(
    (acc, value) => {
      const cleaned = normalizeImageSrc(value);
      if (cleaned && !acc.includes(cleaned)) {
        acc.push(cleaned);
      }
      return acc;
    },
    []
  );

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

export async function uploadProductGallery({
  productId,
  avatarFile,
  galleryFiles = [],
}) {
  if (!productId) {
    throw new Error("productId is required for gallery upload");
  }

  const hasAvatar = avatarFile instanceof Blob;
  const validGallery = Array.from(galleryFiles || []).filter(
    (file) => file instanceof Blob
  );
  if (!hasAvatar && validGallery.length === 0) {
    return null;
  }

  const formData = new FormData();
  formData.append("name", String(productId));
  formData.append("productId", String(productId));
  if (hasAvatar) {
    formData.append("avatar", avatarFile);
  }
  validGallery.slice(0, 8).forEach((file) => {
    formData.append("gallery", file);
  });

  const uploadUrl = `${DEFAULT_API_BASE}/img-upload/admin/img-upload/gallery/by-product/${encodeURIComponent(
    productId
  )}`;

  const res = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to upload gallery");
  }

  return res.json();
}
