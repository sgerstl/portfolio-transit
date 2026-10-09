import { useEffect, useRef, useState } from 'react';
import { FONT_M } from './dotfont';

// The hero's amber LED departure board. At rest it shows the rooftop
// portrait, or with ?idle=ring Berlin's Ringbahn, Stadtbahn and Spree as a
// slowly turning 3D object with the TV tower standing up out of it (the
// Ring's coordinates are approximate, ±100–300 m, which is fine at this
// resolution). Hovering or focusing a work tile pours
// the lit LEDs into a departure for that case: line, name, reading time, and
// where the work started and where it ended. The how is the click.
//
// Board look: one LED per cell on a fixed grid, unlit LEDs faintly visible,
// amber from the site's departure board tokens. Motion steps at 15 frames a
// second like a real display, and a change between two pictures passes
// through a moment of noise instead of showing both (the rule from Ziggy's
// OLED transitions). Lettering is Ziggy's font M, one LED per font pixel.
//
// The canvas is decoration: hidden from assistive tech, and each tile link
// carries the same words as a description. The idle turn runs past five
// seconds, so the board has a pause button (WCAG 2.2.2); it starts paused
// under reduced motion and stops drawing whenever the hero is hidden.

const COLS = 136; // LEDs across; the pitch follows from the board's width
const FPS = 15;
const STEP_MS = 1000 / FPS;
const SCATTER_FRAMES = 2;
const TRAVEL_FRAMES = 5;
const INTRO_FRAMES = 12;
const TURN_SECONDS = 60;
const TILT = (64 * Math.PI) / 180; // 0 is straight down onto the map
const UNLIT = 0.07;

export type Departure = { line: string; name: string; minutes: number; from: string; to: string };
// What the board shows at rest. 'ring' turns; 'face' is the still rooftop
// portrait, the default.
export type Idle = 'ring' | 'face';
const PORTRAIT = '/images/hero/scott-rooftop.webp';
type Cell = { x: number; y: number; a: number };
type V3 = [number, number, number, number]; // x (east), y (up), z (north), brightness

// A flat projection into a 600 × 381 frame, drawing in y 18–350.
const RING = 'M84.2 214.3 L101.1 230.6 L123.6 258.9 L149.1 291.1 L186 298.4 L217.3 296.6 L235.6 292.6 L267.8 307.1 L312.4 325.6 L414.7 336.5 L439.1 329.9 L467.6 315.8 L481.3 241.1 L498.4 206.3 L511.6 167.9 L488.4 131.2 L467.8 112 L429.8 71.8 L404.7 55.8 L375.8 38.8 L318.7 41.3 L270.2 62.7 L219.3 85.9 L186.7 93.2 L121.3 107 L88.7 152.3 L85.3 190 L84.2 214.3';
const STADTBAHN = 'M84.2 214.3 L132.9 199 L194.2 193.6 L232.7 181.6 L276.4 142.1 L315.3 143.9 L369.6 139.9 L384.4 163.2 L421.6 180.9 L498.4 206.3';
const SPREE = 'M545.6 252 L490 226.6 L446 210.7 L410.2 186 L384.4 163.2 L354.4 155.2 L327.8 143.2 L295.1 146.8 L267.8 137.8 L234.4 133.1 L190 146.5 L145.6 146.8 L101.1 124 L56.7 92.5';
const CX = 300, CY = 184; // turn around the middle of the Ring
const HOME = { x: 365.3, y: 142.1 };
// The Ring reaches about 218 map units from its centre; the Spree is trimmed
// just past that so the turning object can be sized to the Ring, not the river.
const FIT_R = 230;
const TOWER = 75; // map units tall, for the eye rather than to scale

const pts = (d: string) =>
  d.replace(/[ML]/g, ' ').trim().split(/\s+/).map(Number).reduce<[number, number][]>((acc, v, i, arr) => {
    if (i % 2 === 0) acc.push([v, arr[i + 1]]);
    return acc;
  }, []);

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

// The model, built once: ground lines, a thin point cloud inside the Ring,
// and the TV tower as the one thing with height.
function buildModel(): V3[] {
  const out: V3[] = [];
  const ground = (x: number, y: number, a: number): V3 => [x - CX, 0, CY - y, a];
  const near = (x: number, y: number) => Math.hypot(x - CX, y - CY) <= FIT_R;
  const line = (d: string, step: number, a: number) => {
    const p = pts(d);
    for (let i = 1; i < p.length; i++) {
      const [x0, y0] = p[i - 1], [x1, y1] = p[i];
      const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / step));
      for (let s = 0; s < n; s++) {
        const x = x0 + ((x1 - x0) * s) / n, y = y0 + ((y1 - y0) * s) / n;
        if (near(x, y)) out.push(ground(x, y, a));
      }
    }
  };
  line(SPREE, 4, 0.45);
  line(STADTBAHN, 4, 0.7);
  line(RING, 2.5, 1);
  const ring = pts(RING);
  const r = rng(52);
  for (let i = 0; i < 260; i++) {
    const x = 84 + r() * 430, y = 38 + r() * 300;
    if (inPoly(x, y, ring)) out.push(ground(x, y, 0.22 + r() * 0.2));
  }
  const hx = HOME.x - CX, hz = CY - HOME.y;
  for (let h = 0; h <= TOWER; h += 2.5) out.push([hx, h, hz, 1]);
  for (let k = 0; k < 16; k++) {
    const t = (k / 16) * Math.PI * 2;
    out.push([hx + Math.cos(t) * 9, TOWER * 0.72, hz + Math.sin(t) * 9, 1]);
  }
  return out;
}

function ringCells(model: V3[], angle: number, cols: number, rows: number): Cell[] {
  const R = FIT_R;
  const k = Math.min((cols - 10) / (2 * R), (rows - 8) / (2 * R * Math.cos(TILT) + TOWER * Math.sin(TILT)));
  // Perspective shrinks the far side, so the visible shape sits low if
  // centred on its bounding box; lift it most of the way back.
  const oy = rows / 2 + TOWER * Math.sin(TILT) * k * 0.15;
  const cos = Math.cos(angle), sin = Math.sin(angle);
  const cells = new Map<number, number>();
  for (const [x, y, z, a] of model) {
    const rx = x * cos - z * sin;
    const rz = x * sin + z * cos;
    // Far side dims, near side is full; a touch of perspective.
    const depth = (rz / R + 1) / 2;
    const p = 1 / (1 + depth * 0.18);
    const sx = Math.round(cols / 2 + rx * k * p);
    const sy = Math.round(oy - rz * Math.cos(TILT) * k * p - y * Math.sin(TILT) * k * p);
    if (sx < 0 || sy < 0 || sx >= cols || sy >= rows) continue;
    const lit = a * (1 - depth * 0.45);
    const key = sy * cols + sx;
    if ((cells.get(key) ?? 0) < lit) cells.set(key, lit);
  }
  return [...cells].map(([key, a]) => ({ x: key % cols, y: Math.floor(key / cols), a }));
}

// Proportional setting: each glyph trimmed to its lit columns plus one blank.
function glyphSpan(ch: string): [number, number] {
  const glyph = FONT_M[ch];
  if (!glyph) return [0, 2];
  let lo = 5, hi = -1;
  for (const row of glyph) for (let x = 0; x < row.length; x++) if (row[x] === '1') { lo = Math.min(lo, x); hi = Math.max(hi, x); }
  return hi < 0 ? [0, 2] : [lo, hi];
}
const textWidth = (s: string) => [...s].reduce((w, ch) => { const [lo, hi] = glyphSpan(ch); return w + hi - lo + 2; }, -1);

function setText(out: Cell[], s: string, x0: number, y0: number, a: number) {
  let pen = x0;
  for (const ch of s) {
    const [lo, hi] = glyphSpan(ch);
    FONT_M[ch]?.forEach((row, gy) => {
      for (let gx = lo; gx <= hi; gx++) if (row[gx] === '1') out.push({ x: pen + gx - lo, y: y0 + gy, a });
    });
    pen += hi - lo + 2;
  }
}

// A departure, laid out like a platform display: line and name left, time
// right, a dotted rule, then FROM and TO with their values.
function departureCells(d: Departure, cols: number, rows: number): Cell[] {
  const m = 4;
  const lh = 10;
  const top = Math.max(2, Math.floor((rows - (6 * lh - 3)) / 2));
  const out: Cell[] = [];
  setText(out, `${d.line}  ${d.name}`.toUpperCase(), m, top, 1);
  const time = `${d.minutes} MIN`;
  setText(out, time, cols - m - textWidth(time), top, 1);
  for (let x = m; x < cols - m; x += 2) out.push({ x, y: top + lh + 2, a: 0.35 });
  setText(out, 'FROM', m, top + lh * 2 - 2, 0.5);
  setText(out, d.from.toUpperCase(), m, top + lh * 3 - 2, 1);
  setText(out, 'TO', m, top + lh * 4 - 1, 0.5);
  setText(out, d.to.toUpperCase(), m, top + lh * 5 - 1, 1);
  return out.filter((c) => c.x >= 0 && c.y >= 0 && c.x < cols && c.y < rows);
}

// The portrait in LEDs: a low-poly illustration of Scott on a Berlin rooftop
// (public/images/hero/scott-rooftop.webp), cropped to the board's shape so it
// fills the display edge to edge. Not mirrored: he already sits right and
// looks into the frame, and mirroring would flip the skyline. One LED per
// cell. Brightness is weighted toward warm tones (red over blue), so skin
// and the autumn trees glow while the bright sky and the blue shirt recede;
// plain brightness let the sky outshine the face. Levels are stretched
// between the 1st and 99th percentile, then a 1.3 gamma deepens the shadows.
const PORTRAIT_WARMTH = 2.2;
function faceCells(img: HTMLImageElement, cols: number, rows: number): Cell[] {
  const c = document.createElement('canvas');
  c.width = cols;
  c.height = rows;
  const g = c.getContext('2d', { willReadFrequently: true });
  if (!g) return [];
  g.imageSmoothingQuality = 'high';
  // Cover the board: scale to fill, centre, crop any excess.
  const scale = Math.max(cols / img.naturalWidth, rows / img.naturalHeight);
  const dw = img.naturalWidth * scale, dh = img.naturalHeight * scale;
  g.drawImage(img, (cols - dw) / 2, (rows - dh) / 2, dw, dh);
  const d = g.getImageData(0, 0, cols, rows).data;
  const raw = new Float32Array(cols * rows);
  for (let i = 0; i < cols * rows; i++) {
    const r = d[i * 4] / 255, gr = d[i * 4 + 1] / 255, b = d[i * 4 + 2] / 255;
    const lum = 0.2126 * r + 0.7152 * gr + 0.0722 * b;
    const warm = Math.max(0, Math.min(1, (r - b) * PORTRAIT_WARMTH + 0.15));
    raw[i] = lum * (0.2 + 1.2 * warm);
  }
  const sorted = Array.from(raw).sort((a, b) => a - b);
  const lo = sorted[Math.floor(sorted.length * 0.01)], hi = sorted[Math.floor(sorted.length * 0.99)];
  const out: Cell[] = [];
  for (let i = 0; i < cols * rows; i++) {
    const v = Math.max(0, Math.min(1, (raw[i] - lo) / (hi - lo || 1))) ** 1.3;
    if (v > 0.06) out.push({ x: i % cols, y: Math.floor(i / cols), a: v });
  }
  return out;
}

const ease = (t: number) => 1 - (1 - t) ** 3;

type Particle = { x: number; y: number; a: number; fx: number; fy: number; fa: number; sx: number; sy: number; tx: number; ty: number; ta: number };

export default function DotField({ active, departures, idle = 'ring' }: { active: string | null; departures: Record<string, Departure>; idle?: Idle }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const api = useRef<{ show: (key: string | null) => void; setPaused: (p: boolean) => void } | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) setPaused(true);
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current, canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const css = getComputedStyle(document.documentElement);
    const amber = css.getPropertyValue('--color-board-amber').trim() || '#FFB000';
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const model = buildModel();

    // pDev is the LED pitch in device pixels, always a whole number, so every
    // LED sits the same distance from the next. A fractional pitch rounded
    // each LED to the nearest pixel, alternating 8px and 9px gaps, and the
    // eye read that as LEDs clumping into pairs. gx/gy centre the grid.
    let cols = COLS, rows = 0, pitch = 4, dpr = 1, pDev = 8, gx = 0, gy = 0;
    let angle = -0.5;
    let isPaused = reducedQuery.matches;
    let mode: 'ring' | 'text' | 'move' = 'ring';
    let target: string | null = null;
    let shown: Cell[] = [];
    let parts: Particle[] = [];
    let raf = 0;
    let running = false;
    let moveStart = 0, moveFrames = 0, moveScatter = 0, moveIntro = false;
    let lastStep = -1;
    let unlit: HTMLCanvasElement | null = null;
    let sprite: HTMLCanvasElement | null = null;
    const rand = rng(7);

    // The hero scrolls with the page now, so also stop once the board is off screen.
    let onScreen = true;
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      kick();
    });
    io.observe(wrap);
    const visible = () =>
      onScreen && !document.hidden && (wrap.checkVisibility ? wrap.checkVisibility({ opacityProperty: true, visibilityProperty: true }) : true);

    const makeSprites = () => {
      const size = pDev;
      const r = size * 0.38;
      const dot = (alpha: number, glow: boolean) => {
        const c = document.createElement('canvas');
        c.width = c.height = size;
        const g = c.getContext('2d')!;
        if (glow) {
          const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
          grad.addColorStop(0, amber);
          grad.addColorStop(0.55, amber);
          grad.addColorStop(1, 'transparent');
          g.fillStyle = grad;
          g.fillRect(0, 0, size, size);
        } else {
          // Soft-edged too: the board's 3D tilt resamples the grid, and hard
          // dot edges shimmer into bands when that happens.
          const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, r * 1.25);
          grad.addColorStop(0, amber);
          grad.addColorStop(0.6, amber);
          grad.addColorStop(1, 'transparent');
          g.globalAlpha = alpha;
          g.fillStyle = grad;
          g.fillRect(0, 0, size, size);
        }
        return c;
      };
      sprite = dot(1, true);
      const one = dot(UNLIT, false);
      unlit = document.createElement('canvas');
      unlit.width = canvas.width;
      unlit.height = canvas.height;
      const u = unlit.getContext('2d')!;
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) u.drawImage(one, gx + x * pDev, gy + y * pDev);
    };

    const draw = (cells: { x: number; y: number; a: number }[]) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (unlit) ctx.drawImage(unlit, 0, 0);
      if (!sprite) return;
      const buckets = new Map<number, { x: number; y: number }[]>();
      for (const c of cells) {
        if (c.a < 0.05) continue;
        const b = Math.min(10, Math.round(c.a * 10));
        (buckets.get(b) ?? buckets.set(b, []).get(b)!).push(c);
      }
      for (const [b, list] of buckets) {
        ctx.globalAlpha = b / 10;
        for (const c of list) ctx.drawImage(sprite, gx + Math.round(c.x) * pDev, gy + Math.round(c.y) * pDev);
      }
      ctx.globalAlpha = 1;
    };

    // The resting picture: the turning Ring, or the portrait once it loads.
    const turns = idle === 'ring';
    const portrait = new Image();
    let portraitReady = false;
    let faceCache: { cols: number; rows: number; cells: Cell[] } | null = null;
    const faceIdle = (): Cell[] => {
      if (!portraitReady) return [];
      if (!faceCache || faceCache.cols !== cols || faceCache.rows !== rows) {
        faceCache = { cols, rows, cells: faceCells(portrait, cols, rows) };
      }
      return faceCache.cells;
    };
    const picture = (key: string | null): Cell[] =>
      key && departures[key]
        ? departureCells(departures[key], cols, rows)
        : turns ? ringCells(model, angle, cols, rows) : faceIdle();

    // Start a move from whatever is lit now to the next picture.
    const moveTo = (key: string | null, intro = false) => {
      const from: Cell[] = mode === 'move' ? parts.map((q) => ({ x: q.x, y: q.y, a: q.a })) : shown;
      const to = picture(key);
      const n = Math.max(from.length, to.length, 1);
      const order = to.map((_, i) => i);
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      parts = Array.from({ length: n }, (_, i) => {
        const f = from.length ? from[i % from.length] : { x: rand() * cols, y: rand() * rows, a: 0 };
        const fa = i < from.length ? f.a : 0;
        const t = i < to.length ? to[order[i]] : to.length ? to[Math.floor(rand() * to.length)] : f;
        const ta = i < to.length ? t.a : 0;
        const ang = rand() * Math.PI * 2, spread = 3 + rand() * 6;
        return {
          x: f.x, y: f.y, a: fa, fx: f.x, fy: f.y, fa,
          sx: intro ? rand() * cols : f.x + Math.cos(ang) * spread,
          sy: intro ? rand() * rows : f.y + Math.sin(ang) * spread,
          tx: t.x, ty: t.y, ta,
        };
      });
      target = key;
      if (reducedQuery.matches || !visible()) {
        shown = to;
        mode = key ? 'text' : 'ring';
        draw(shown);
        kick();
        return;
      }
      mode = 'move';
      moveStart = performance.now();
      moveScatter = intro ? 0 : SCATTER_FRAMES;
      moveFrames = intro ? INTRO_FRAMES : TRAVEL_FRAMES;
      moveIntro = intro;
      lastStep = -1;
      kick();
    };

    const stepMove = (now: number) => {
      const frame = Math.floor((now - moveStart) / STEP_MS);
      if (frame === lastStep) return;
      lastStep = frame;
      for (const q of parts) {
        const litEither = Math.max(q.fa, q.ta) > 0.05;
        if (frame < moveScatter) {
          const t = (frame + 1) / moveScatter;
          q.x = q.fx + (q.sx - q.fx) * t;
          q.y = q.fy + (q.sy - q.fy) * t;
          q.a = litEither ? 0.8 : 0;
        } else {
          const t = ease(Math.min(1, (frame - moveScatter + 1) / moveFrames));
          const fromA = !moveIntro && litEither ? 0.8 : 0;
          q.x = q.sx + (q.tx - q.sx) * t;
          q.y = q.sy + (q.ty - q.sy) * t;
          q.a = fromA + (q.ta - fromA) * t;
        }
      }
      if (frame >= moveScatter + moveFrames - 1) {
        mode = target ? 'text' : 'ring';
        shown = picture(target);
        draw(shown);
      } else {
        draw(parts);
      }
    };

    // The turn advances by elapsed time (capped, so a pause or a hidden tab
    // never makes it jump) and redraws only on 15 fps steps.
    const SPEED = (Math.PI * 2) / (TURN_SECONDS * 1000);
    let prevNow = 0, drawnStep = -1;
    const needed = () => mode === 'move' || (mode === 'ring' && turns && !isPaused);
    const schedule = () => {
      running = true;
      raf = requestAnimationFrame(tick);
    };
    function tick(now: number) {
      running = false;
      if (!visible()) { prevNow = 0; return; }
      if (mode === 'move') {
        stepMove(now);
        prevNow = 0;
      } else if (mode === 'ring' && turns && !isPaused) {
        if (prevNow) angle += Math.min(now - prevNow, 200) * SPEED;
        prevNow = now;
        const st = Math.floor(now / STEP_MS);
        if (st !== drawnStep) {
          drawnStep = st;
          shown = ringCells(model, angle, cols, rows);
          draw(shown);
        }
      }
      if (needed()) schedule();
      else prevNow = 0;
    }

    function kick() {
      if (!needed() || running || !visible()) return;
      prevNow = 0;
      schedule();
    }

    let built = false;
    const build = () => {
      const w = wrap.clientWidth, h = wrap.clientHeight;
      if (!w || !h) return;
      cancelAnimationFrame(raf);
      running = false;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      // At least COLS LEDs across (the departure lines need about 130), on a
      // whole-pixel pitch; the count flexes a little with the board's width.
      pDev = Math.max(3, Math.floor((w * dpr) / COLS));
      pitch = pDev / dpr;
      cols = Math.floor((w * dpr) / pDev);
      rows = Math.floor((h * dpr) / pDev);
      gx = Math.floor((Math.round(w * dpr) - cols * pDev) / 2);
      gy = Math.floor((Math.round(h * dpr) - rows * pDev) / 2);
      boardRef.current?.style.setProperty('--hvg-grid-x', `${gx / dpr}px`);
      // The frame's header labels sit over their LED columns: Linie over the
      // line, Ziel over the case name, Lesezeit over the minutes.
      boardRef.current?.style.setProperty('--hvg-pitch', `${pitch}px`);
      boardRef.current?.style.setProperty('--hvg-ziel', String(4 + textWidth('CS1  ') + 1));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      makeSprites();
      if (!built && !reducedQuery.matches) {
        built = true;
        shown = [];
        moveTo(null, true);
      } else {
        built = true;
        mode = target ? 'text' : 'ring';
        shown = picture(target);
        draw(shown);
        kick();
      }
    };

    api.current = {
      show: (key) => {
        const next = key && departures[key] ? key : null;
        if (next === target && mode !== 'move') return;
        moveTo(next);
      },
      setPaused: (p) => {
        isPaused = p;
        kick();
      },
    };

    build();
    if (!turns) {
      portrait.src = PORTRAIT;
      portrait.decode().then(() => {
        portraitReady = true;
        if (!target) moveTo(null, !reducedQuery.matches);
      }).catch(() => {});
    }
    let t: ReturnType<typeof setTimeout> | undefined;
    const ro = new ResizeObserver(() => {
      clearTimeout(t);
      t = setTimeout(build, 120);
    });
    ro.observe(wrap);
    // The hero fades and hides on scroll; pick the turn back up when it returns.
    const wake = () => kick();
    window.addEventListener('scroll', wake, { passive: true });
    document.addEventListener('visibilitychange', wake);
    return () => {
      ro.disconnect();
      io.disconnect();
      clearTimeout(t);
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', wake);
      document.removeEventListener('visibilitychange', wake);
      api.current = null;
    };
  }, [departures, idle]);

  useEffect(() => {
    api.current?.show(active);
  }, [active]);

  // Sway: the board hangs from a pole, so scrolling back up gives it a small
  // swing that settles on its own, a damped spring around the top of the
  // pole. Scrolling down leaves it still (Scott, 2026-10-09: calmer).
  // Capped at 3 degrees, runs only while it is moving and on screen, and is
  // off under reduced motion.
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const K = 52; // stiffness: about 1.1 swings a second
    const C = 5.5; // damping: settles in roughly a second and a half
    const GAIN = 0.18; // degrees a second per pixel scrolled
    const MAX = 3;
    const shadow = shadowRef.current;
    const LAG = 7; // how fast the shadow catches up, per second: a beat behind the board
    const WIDER = 1.15; // the wall is farther from the pivot, so its swing reads a little wider
    let theta = 0, omega = 0, thetaS = 0, last = 0, raf = 0, running = false;
    // The shadow sits inside the mount, so it already turns with the board; it adds only the difference.
    const place = () => {
      mount.style.transform = theta ? `rotate(${theta.toFixed(3)}deg)` : '';
      if (shadow) shadow.style.transform = theta || thetaS ? `rotate(${(thetaS * WIDER - theta).toFixed(3)}deg)` : '';
    };
    let lastY = window.scrollY;
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      omega += (-K * theta - C * omega) * dt;
      theta = Math.max(-MAX, Math.min(MAX, theta + omega * dt));
      thetaS += (theta - thetaS) * Math.min(1, LAG * dt);
      if (Math.abs(theta) < 0.01 && Math.abs(omega) < 0.05 && Math.abs(thetaS) < 0.01) {
        theta = 0;
        omega = 0;
        thetaS = 0;
        place();
        running = false;
        return;
      }
      place();
      raf = requestAnimationFrame(step);
    };
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (dy >= 0 || reduced.matches || mount.getBoundingClientRect().bottom < 0) return;
      omega -= Math.max(-80, Math.min(80, dy)) * GAIN;
      if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(step);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
      mount.style.transform = '';
      if (shadow) shadow.style.transform = '';
    };
  }, []);

  useEffect(() => {
    api.current?.setPaused(paused);
  }, [paused]);

  // The housing follows a BVG platform display (U Frankfurter Tor was the
  // reference): enamel frame, header strip, recessed LED panel behind glass,
  // footer strip with the stop. No BVG logo; the site borrows the type of
  // object, not the operator's mark.
  return (
    <div className="hvg-board-mount" ref={mountRef}>
      {/* The board's shadow on the wall behind it: swings with the board, a beat behind and a little wider */}
      <div className="hvg-shadow" ref={shadowRef} aria-hidden="true">
        <span className="hvg-shadow-pole" />
        <span className="hvg-shadow-board" />
      </div>
      <div className="hvg-side" aria-hidden="true" />
      <div className="hvg-board" ref={boardRef}>
        <div className="hvg-arm" aria-hidden="true" />
        <div className="hvg-face">
          <div className="hvg-head" aria-hidden="true" lang="de">
            <span className="hvg-col-line">Linie</span>
            <span className="hvg-col-ziel">Ziel</span>
            <span className="hvg-col-time">Lesezeit</span>
          </div>
          <div className="hvg-glass">
            <div className="hvg-field" ref={wrapRef} aria-hidden="true">
              <canvas ref={canvasRef} />
            </div>
            {/* Where the real board has its operator badge: a plain yellow
                square at the foot of the right-hand grey bar. */}
            <span className="hvg-badge" aria-hidden="true" />
          </div>
          <div className="hvg-foot">
            <span className="hvg-stop" aria-hidden="true">Berlin</span>
            {/* The turning Ring runs past five seconds, so it gets a pause key
                (WCAG 2.2.2); the still portrait has nothing to pause. */}
            {idle === 'ring' && <button
              type="button"
              className="hvg-pause"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? 'Play the map animation' : 'Pause the map animation'}
            >
              <svg viewBox="0 0 16 16" aria-hidden="true">
                {paused ? <path d="M5 3.5v9l7.5-4.5z" /> : <path d="M4.5 3.5h2.5v9H4.5zM9 3.5h2.5v9H9z" />}
              </svg>
            </button>}
          </div>
        </div>
      </div>
    </div>
  );
}
