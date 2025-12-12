const normalizeNumber = (value, fallback = 0) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return num;
};

export const normalizePrice = (value) => {
  const price = normalizeNumber(value, 0);
  return price < 0 ? 0 : price;
};

export const normalizeDiscount = (value) => {
  const discount = normalizeNumber(value, 0);
  if (discount <= 0) return 0;
  if (discount > 100) return 100;
  return discount;
};

export const resolveItemPricing = (item = {}) => {
  const basePrice = normalizePrice(item.price);
  const discountValue = normalizeDiscount(item.discount);
  const hasDiscount = discountValue > 0;

  const rawQty = normalizeNumber(item.quantity, 1);
  const quantity = rawQty > 0 ? Math.floor(rawQty) || 1 : 1;

  const unitPrice = hasDiscount ? basePrice * (1 - discountValue / 100) : basePrice;
  const lineTotal = unitPrice * quantity;
  const lineDiscount = hasDiscount ? (basePrice - unitPrice) * quantity : 0;

  return {
    basePrice,
    discountValue,
    hasDiscount,
    quantity,
    unitPrice,
    lineTotal,
    lineDiscount,
  };
};

export const calculateCartTotals = (items = []) =>
  items.reduce(
    (acc, item) => {
      const pricing = resolveItemPricing(item);
      acc.subtotal += pricing.basePrice * pricing.quantity;
      acc.discountTotal += pricing.lineDiscount;
      acc.total += pricing.lineTotal;
      return acc;
    },
    { subtotal: 0, discountTotal: 0, total: 0 },
  );

