import { useEffect, useRef } from 'react';
import { FONT_M } from './dotfont';

// MOCK sketch (hero G): Berlin's Ringbahn, Stadtbahn and Spree as a field of
// display dots. Hovering or focusing a work tile pours the dots into that
// case's industries; leaving pours them back into the map.
//
// The material is Ziggy's OLED (~/code/ziggy/components/device/pixelmotion.ts):
// one 1.5px dot on a 2px grid, bigger means more dots never bigger ones,
// motion steps at 15 frames a second, and a change between two pictures
// passes through a neutral midpoint (white noise) instead of showing both.
//
// The field is decoration. Every word it spells is also real text in the
// tile, so it is hidden from assistive tech and says nothing on its own.
// It moves only on load (under a second) and on a tile's hover or focus,
// then holds still. Reduced motion, or a hidden page, just changes.

const PITCH = 2; // CSS px between dot centres
const DOT = 1.5; // CSS px dot size
const FPS = 15;
const STEP_MS = 1000 / FPS;
const SCATTER_FRAMES = 2;
const TRAVEL_FRAMES = 5;
const INTRO_FRAMES = 12;

type Target = { x: number; y: number; a: number };
type Particle = { x: number; y: number; a: number; fx: number; fy: number; fa: number; tx: number; ty: number; ta: number; sx: number; sy: number };

// Same projection as hero F's map, cropped to y 18–350 of a 600 × 381 frame.
const MAP_W = 600;
const MAP_H = 332;
const MAP_Y0 = 18;
const RING = 'M84.2 214.3 L101.1 230.6 L123.6 258.9 L149.1 291.1 L186 298.4 L217.3 296.6 L235.6 292.6 L267.8 307.1 L312.4 325.6 L414.7 336.5 L439.1 329.9 L467.6 315.8 L481.3 241.1 L498.4 206.3 L511.6 167.9 L488.4 131.2 L467.8 112 L429.8 71.8 L404.7 55.8 L375.8 38.8 L318.7 41.3 L270.2 62.7 L219.3 85.9 L186.7 93.2 L121.3 107 L88.7 152.3 L85.3 190 L84.2 214.3';
const STADTBAHN = 'M84.2 214.3 L132.9 199 L194.2 193.6 L232.7 181.6 L276.4 142.1 L315.3 143.9 L369.6 139.9 L384.4 163.2 L421.6 180.9 L498.4 206.3';
const SPREE = 'M545.6 252 L490 226.6 L446 210.7 L410.2 186 L384.4 163.2 L354.4 155.2 L327.8 143.2 L295.1 146.8 L267.8 137.8 L234.4 133.1 L190 146.5 L145.6 146.8 L101.1 124 L56.7 92.5';
const HOME = { x: 365.3, y: 142.1 };

const pts = (d: string) =>
  d.replace(/[ML]/g, ' ').trim().split(/\s+/).map(Number).reduce<[number, number][]>((acc, v, i, arr) => {
    if (i % 2 === 0) acc.push([v, arr[i + 1] - MAP_Y0]);
    return acc;
  }, []);

// Deterministic noise, so the cloud is the same on every load.
function rng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function inPoly(x: number, y: number, poly: [number, number][]) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function mapTargets(cols: number, rows: number): Target[] {
  const margin = Math.max(4, Math.round(cols * 0.05));
  const k = Math.min((cols - margin * 2) / MAP_W, (rows - margin * 2) / MAP_H);
  const ox = (cols - MAP_W * k) / 2;
  const oy = (rows - MAP_H * k) / 2;
  const cells = new Map<number, number>();
  const put = (cx: number, cy: number, a: number) => {
    if (cx < 0 || cy < 0 || cx >= cols || cy >= rows) return;
    const key = cy * cols + cx;
    cells.set(key, Math.max(cells.get(key) ?? 0, a));
  };
  const stroke = (d: string, brush: number, a: number) => {
    const p = pts(d);
    for (let i = 1; i < p.length; i++) {
      const [x0, y0] = p[i - 1], [x1, y1] = p[i];
      const len = Math.hypot(x1 - x0, y1 - y0) * k;
      const n = Math.max(1, Math.ceil(len * 2));
      for (let s = 0; s <= n; s++) {
        const cx = Math.round(ox + (x0 + ((x1 - x0) * s) / n) * k);
        const cy = Math.round(oy + (y0 + ((y1 - y0) * s) / n) * k);
        for (let bx = 0; bx < brush; bx++) for (let by = 0; by < brush; by++) put(cx + bx, cy + by, a);
      }
    }
  };
  stroke(SPREE, 2, 0.38);
  stroke(STADTBAHN, 1, 0.7);
  stroke(RING, 2, 1);

  // The city as a point cloud: dense inside the Ring, thinning outside it.
  const ring = pts(RING);
  const r = rng(52);
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      const mx = (cx - ox) / k, my = (cy - oy) / k;
      const inside = inPoly(mx, my, ring);
      const dx = (mx - HOME.x) / MAP_W, dy = (my - (HOME.y - MAP_Y0)) / MAP_H;
      const p = inside ? 0.075 : 0.03 * Math.exp(-Math.hypot(dx, dy) * 4);
      if (r() < p) put(cx, cy, 0.18 + r() * 0.32);
    }
  }
  // Home: a small bright block at the TV tower.
  const hx = Math.round(ox + HOME.x * k), hy = Math.round(oy + (HOME.y - MAP_Y0) * k);
  for (let bx = -2; bx <= 2; bx++) for (let by = -2; by <= 2; by++) if (Math.abs(bx) + Math.abs(by) < 4) put(hx + bx, hy + by, 1);

  return [...cells].map(([key, a]) => ({ x: key % cols, y: Math.floor(key / cols), a }));
}

// Words in font M. Each font pixel is an s × s block of dots; s is the
// largest that fits, so short words come out big and long lists smaller.
// Letters are set proportionally: each glyph is trimmed to its lit columns
// and followed by one blank column, so a narrow I doesn't leave a hole.
function glyphSpan(ch: string): [number, number] {
  const glyph = FONT_M[ch];
  if (!glyph) return [0, 2]; // space
  let lo = 5, hi = -1;
  for (const row of glyph) for (let x = 0; x < row.length; x++) if (row[x] === '1') { lo = Math.min(lo, x); hi = Math.max(hi, x); }
  return hi < 0 ? [0, 2] : [lo, hi];
}

function textTargets(lines: string[], cols: number, rows: number): Target[] {
  const margin = Math.max(8, Math.round(cols * 0.08));
  const widthPx = (line: string) => [...line].reduce((w, ch) => { const [lo, hi] = glyphSpan(ch); return w + hi - lo + 2; }, -1);
  const wide = Math.max(...lines.map(widthPx));
  const tall = lines.length * 7 + (lines.length - 1) * 3;
  let s = 6;
  while (s > 1 && (wide * s > cols - margin * 2 || tall * s > rows - margin * 2)) s--;
  const oy = Math.floor((rows - tall * s) / 2);
  const out: Target[] = [];
  lines.forEach((line, li) => {
    let pen = Math.floor((cols - widthPx(line) * s) / 2);
    const top = oy + li * 10 * s;
    for (const ch of line) {
      const [lo, hi] = glyphSpan(ch);
      FONT_M[ch]?.forEach((row, gy) => {
        for (let gx = lo; gx <= hi; gx++) {
          if (row[gx] !== '1') continue;
          for (let bx = 0; bx < s; bx++) for (let by = 0; by < s; by++) {
            out.push({ x: pen + (gx - lo) * s + bx, y: top + gy * s + by, a: 1 });
          }
        }
      });
      pen += (hi - lo + 2) * s;
    }
  });
  return out;
}

const ease = (t: number) => 1 - (1 - t) ** 3;

export default function DotField({ active, states, panel }: { active: string | null; states: Record<string, string[]>; panel: boolean }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const api = useRef<{ show: (key: string | null) => void } | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current, canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const css = getComputedStyle(document.documentElement);
    const ink = panel ? '#ffffff' : css.getPropertyValue('--color-text').trim() || '#4B4B4B';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    let cols = 0, rows = 0, dpr = 1;
    let pictures: Record<string, Target[]> = {};
    let parts: Particle[] = [];
    let current: string = 'map';
    let raf = 0;
    const rand = rng(7);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = ink;
      const d = DOT * dpr, p = PITCH * dpr;
      // Bucket by alpha so the canvas state changes a handful of times a frame.
      const buckets = new Map<number, Particle[]>();
      for (const q of parts) {
        if (q.a < 0.04) continue;
        const b = Math.round(q.a * 10);
        (buckets.get(b) ?? buckets.set(b, []).get(b)!).push(q);
      }
      for (const [b, list] of buckets) {
        ctx.globalAlpha = b / 10;
        for (const q of list) ctx.fillRect(Math.round(q.x) * p, Math.round(q.y) * p, d, d);
      }
      ctx.globalAlpha = 1;
    };

    // Give every particle a target in the picture; spares fade out on top
    // of a lit dot so the count never changes.
    const assign = (key: string) => {
      const pic = pictures[key] ?? pictures.map;
      const order = pic.map((_, i) => i);
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      parts.forEach((q, i) => {
        const t = i < order.length ? pic[order[i]] : pic[Math.floor(rand() * pic.length)];
        q.tx = t.x; q.ty = t.y; q.ta = i < order.length ? t.a : 0;
      });
    };

    const snap = () => {
      for (const q of parts) { q.x = q.tx; q.y = q.ty; q.a = q.ta; }
      draw();
    };

    const animate = (frames: number, scatter: number, intro = false) => {
      cancelAnimationFrame(raf);
      for (const q of parts) {
        q.fx = q.x; q.fy = q.y; q.fa = q.a;
        // The neutral midpoint: every dot jumps to a nearby random cell at
        // full brightness, so the field reads as white noise between pictures.
        const spread = 10 + rand() * 16;
        const ang = rand() * Math.PI * 2;
        q.sx = intro ? rand() * cols : q.x + Math.cos(ang) * spread;
        q.sy = intro ? rand() * rows : q.y + Math.sin(ang) * spread;
      }
      const start = performance.now();
      let last = -1;
      const tick = (now: number) => {
        const frame = Math.floor((now - start) / STEP_MS);
        if (frame !== last) {
          last = frame;
          for (const q of parts) {
            if (frame < scatter) {
              const t = (frame + 1) / scatter;
              q.x = q.fx + (q.sx - q.fx) * t;
              q.y = q.fy + (q.sy - q.fy) * t;
              q.a = Math.max(q.fa, q.ta) > 0.04 ? 0.85 : 0;
            } else {
              const t = ease(Math.min(1, (frame - scatter + 1) / frames));
              // Dots that were lit leave the noise at its brightness; the
              // intro fades everything up from dark.
              const fromA = !intro && Math.max(q.fa, q.ta) > 0.04 ? 0.85 : 0;
              q.x = q.sx + (q.tx - q.sx) * t;
              q.y = q.sy + (q.ty - q.sy) * t;
              q.a = fromA + (q.ta - fromA) * t;
            }
          }
          draw();
        }
        if (frame < scatter + frames - 1) raf = requestAnimationFrame(tick);
        else snap();
      };
      raf = requestAnimationFrame(tick);
    };

    const still = () => reduced.matches || document.hidden;

    const show = (key: string | null) => {
      const next = key && pictures[key] ? key : 'map';
      if (next === current) return;
      current = next;
      assign(next);
      if (still()) { cancelAnimationFrame(raf); snap(); } else animate(TRAVEL_FRAMES, SCATTER_FRAMES);
    };
    api.current = { show };

    let built = false;
    const build = () => {
      const w = wrap.clientWidth, h = wrap.clientHeight;
      if (!w || !h) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      cols = Math.floor(w / PITCH);
      rows = Math.floor(h / PITCH);
      pictures = { map: mapTargets(cols, rows) };
      for (const [k, lines] of Object.entries(states)) pictures[k] = textTargets(lines, cols, rows);
      const n = Math.max(...Object.values(pictures).map((p) => p.length));
      parts = Array.from({ length: n }, () => ({ x: 0, y: 0, a: 0, fx: 0, fy: 0, fa: 0, tx: 0, ty: 0, ta: 0, sx: 0, sy: 0 }));
      assign(current);
      if (!built && !still()) {
        built = true;
        animate(INTRO_FRAMES, 0, true);
      } else {
        built = true;
        cancelAnimationFrame(raf);
        snap();
      }
    };

    build();
    let t: ReturnType<typeof setTimeout> | undefined;
    const ro = new ResizeObserver(() => {
      clearTimeout(t);
      t = setTimeout(build, 120);
    });
    ro.observe(wrap);
    return () => {
      ro.disconnect();
      clearTimeout(t);
      cancelAnimationFrame(raf);
      api.current = null;
    };
  }, [states, panel]);

  useEffect(() => {
    api.current?.show(active);
  }, [active]);

  return (
    <div className={`hvg-field${panel ? ' hvg-field--panel' : ''}`} ref={wrapRef} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
