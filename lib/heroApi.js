import { DEFAULT_API_BASE } from "./api";

const HERO_PUBLIC_BASE = "/hero/api/hero";
const HERO_ADMIN_BASE = "/hero/admin/hero";
const HERO_IMAGE_BASE = "/img-upload/api/heroimg";
const HERO_UPLOAD_BASE = "/admin/img-upload/heroimg";

const normalizeBase = (base) => base?.replace(/\/+$/, "") || "";

const buildAbsoluteUrl = (path) => {
  const base =
    normalizeBase(process.env.NEXT_PUBLIC_API_BASE) || normalizeBase(DEFAULT_API_BASE);
  if (!base) return path;
  const safePath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${safePath}`;
};

const pickList = (payload) => {
  const dataBlock = payload?.data ?? payload;
  if (Array.isArray(dataBlock)) return dataBlock;
  if (Array.isArray(dataBlock?.heroes)) return dataBlock.heroes;
  if (Array.isArray(dataBlock?.items)) return dataBlock.items;
  if (Array.isArray(dataBlock?.data)) return dataBlock.data;
  return [];
};

const normalizeHero = (hero = {}) => {
  const countValue =
    hero?.heroimg_count ??
    hero?.heroImgCount ??
    hero?.heroimgCount ??
    hero?.imageCount ??
    0;

  return {
    id: hero?.id ?? hero?._id ?? hero?.heroId ?? hero?.hero_id ?? hero?.heroid,
    heroheader: hero?.heroheader ?? "",
    herotitle1: hero?.herotitle1 ?? "",
    herotitle2: hero?.herotitle2 ?? "",
    herotitle3: hero?.herotitle3 ?? "",
    targeturl: hero?.targeturl ?? "",
    created_at: hero?.created_at ?? hero?.createdAt ?? "",
    updated_at: hero?.updated_at ?? hero?.updatedAt ?? "",
    heroimg_count: Number.isFinite(Number(countValue)) ? Number(countValue) : 0,
  };
};

const buildPayload = (hero) => ({
  heroheader: hero?.heroheader?.trim() ?? "",
  herotitle1: hero?.herotitle1?.trim() ?? "",
  herotitle2: hero?.herotitle2?.trim() ?? "",
  herotitle3: hero?.herotitle3?.trim() ?? "",
  targeturl: hero?.targeturl ?? "",
});

export async function fetchHeroes() {
  const res = await fetch(buildAbsoluteUrl(HERO_PUBLIC_BASE), {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch heroes");
  }

  const data = await res.json();
  const list = pickList(data);
  return list.map((item) => normalizeHero(item));
}

export async function fetchHeroById(id) {
  if (!id) {
    throw new Error("Hero id is required");
  }

  const res = await fetch(
    buildAbsoluteUrl(`${HERO_PUBLIC_BASE}/${encodeURIComponent(id)}`),
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch hero");
  }

  const data = await res.json();
  const payload = data?.data ?? data;
  const rawHero = Array.isArray(payload) ? payload[0] : payload?.hero ?? payload;
  return normalizeHero(rawHero);
}

export async function createHero(hero) {
  const payload = buildPayload(hero);

  const res = await fetch(buildAbsoluteUrl(HERO_ADMIN_BASE), {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to create hero");
  }

  return res.json();
}

export async function updateHero(id, hero) {
  if (!id) {
    throw new Error("Hero id is required");
  }

  const payload = buildPayload(hero);

  const res = await fetch(
    buildAbsoluteUrl(`${HERO_ADMIN_BASE}/${encodeURIComponent(id)}`),
    {
      method: "PUT",
      credentials: "include",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update hero");
  }

  return res.json();
}

export async function deleteHero(id) {
  if (!id) {
    throw new Error("Hero id is required");
  }

  const res = await fetch(
    buildAbsoluteUrl(`${HERO_ADMIN_BASE}/${encodeURIComponent(id)}`),
    {
      method: "DELETE",
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to delete hero");
  }

  return res.json();
}

export const buildHeroImageUrl = (heroId, idx = 0) => {
  if (heroId === undefined || heroId === null) return "";
  const safeIdx = Number.isFinite(Number(idx)) ? Math.max(0, Number(idx)) : 0;
  const path = `${HERO_IMAGE_BASE}/${encodeURIComponent(heroId)}/${safeIdx}`;
  return buildAbsoluteUrl(path);
};

export async function uploadHeroImages(heroId, files = []) {
  if (!heroId) {
    throw new Error("Hero id is required for upload");
  }

  const validFiles = Array.from(files || []).filter((file) => file instanceof Blob);
  if (validFiles.length === 0) {
    return null;
  }

  const formData = new FormData();
  validFiles.slice(0, 3).forEach((file) => formData.append("heroImg", file));

  const res = await fetch(
    buildAbsoluteUrl(`${HERO_UPLOAD_BASE}/${encodeURIComponent(heroId)}`),
    {
      method: "POST",
      credentials: "include",
      body: formData,
    },
  );

  if (!res.ok) {
    throw new Error("Failed to upload hero images");
  }

  return res.json();
}
