'use client';

// Creates a small circle that flies from the clicked button to the cart icon.
export function flyToCart(sourceEl) {
  if (typeof document === 'undefined' || !sourceEl) return;

  const cartTarget = document.querySelector('[data-cart-target]');
  if (!cartTarget) return;

  const sourceRect = sourceEl.getBoundingClientRect();
  const targetRect = cartTarget.getBoundingClientRect();
  if (!sourceRect.width || !sourceRect.height || !targetRect.width || !targetRect.height) return;

  const circle = document.createElement('span');
  circle.className = 'cart-fly-circle';

  const size = Math.min(24, Math.max(12, Math.min(sourceRect.width, sourceRect.height) * 0.35));
  const startX = sourceRect.left + sourceRect.width / 2 - size / 2;
  const startY = sourceRect.top + sourceRect.height / 2 - size / 2;

  circle.style.width = `${size}px`;
  circle.style.height = `${size}px`;
  circle.style.left = `${startX}px`;
  circle.style.top = `${startY}px`;
  circle.style.transform = 'translate(0, 0) scale(1.08)';

  document.body.appendChild(circle);

  // Trigger transition on the next frame so initial styles are applied.
  requestAnimationFrame(() => {
    const endX = targetRect.left + targetRect.width / 2 - startX;
    const endY = targetRect.top + targetRect.height / 2 - startY;
    circle.style.transform = `translate(${endX}px, ${endY}px) scale(0.7)`;
  });

  circle.addEventListener(
    'transitionend',
    () => {
      circle.remove();
    },
    { once: true },
  );
}
