export const FALLBACK_WORKSHOPS = [
  {
    id: "demo-01",
    name: "Jewelry Workshop",
    description: "Design and craft a unique pendant that reflects your personal style and vision.",
    img: ["/images/workshops/1.jpg"],
    materials: "2026-01-22",
    stone: 2,
    typeofmessage: 10,
    price: 60,
    category: "workshop",
    href: "/workshops/demo-01",
  },
  {
    id: "demo-02",
    name: "Jewelry Workshop",
    description: "Design and craft a unique pendant that reflects your personal style and vision.",
    img: ["/images/workshops/2.jpg"],
    materials: "2026-01-22",
    stone: 2,
    typeofmessage: 10,
    price: 60,
    category: "workshop",
    href: "/workshops/demo-02",
  },
  {
    id: "demo-03",
    name: "Jewelry Workshop",
    description: "Design and craft a unique pendant that reflects your personal style and vision.",
    img: ["/images/workshops/3.jpg"],
    materials: "2026-01-22",
    stone: 2,
    typeofmessage: 10,
    price: 60,
    category: "workshop",
    href: "/workshops/demo-03",
  },
  {
    id: "demo-04",
    name: "Jewelry Workshop",
    description: "Design and craft a unique pendant that reflects your personal style and vision.",
    img: ["/images/workshops/4.jpg"],
    materials: "2026-01-22",
    stone: 2,
    typeofmessage: 10,
    price: 60,
    category: "workshop",
    href: "/workshops/demo-04",
  },
];

export const getFallbackWorkshopById = (id) => {
  if (!id) return undefined;
  const normalized = String(id);
  return FALLBACK_WORKSHOPS.find((item) => String(item.id) === normalized);
};
