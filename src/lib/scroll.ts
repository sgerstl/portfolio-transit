const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function smoothScrollTo(targetY: number) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    window.scrollTo(0, targetY);
    return;
  }
  const startY = window.scrollY;
  const distance = targetY - startY;
  if (Math.abs(distance) < 2) return;
  const startTime = performance.now();
  const dur = Math.max(600, Math.min(1400, Math.abs(distance) * 0.7));
  function tick(now: number) {
    const elapsed = now - startTime;
    const t = clamp01(elapsed / dur);
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    window.scrollTo(0, startY + distance * eased);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
