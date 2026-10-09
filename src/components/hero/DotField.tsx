import { useEffect, useRef, useState } from 'react';
import { FONT_M } from './dotfont';

// MOCK sketch (hero G): an amber LED departure board. At rest it shows
// Berlin's Ringbahn, Stadtbahn and Spree as a slowly turning 3D object, with
// the TV tower standing up out of it. Hovering or focusing a work tile pours
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
type Cell = { x: number; y: number; a: number };
type V3 = [number, number, number, number]; // x (east), y (up), z (north), brightness

// Same projection as hero F's map: a 600 × 381 frame, drawing in y 18–350.
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

const ease = (t: number) => 1 - (1 - t) ** 3;

type Particle = { x: number; y: number; a: number; fx: number; fy: number; fa: number; sx: number; sy: number; tx: number; ty: number; ta: number };

export default function DotField({ active, departures }: { active: string | null; departures: Record<string, Departure> }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
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

    let cols = COLS, rows = 0, pitch = 4, dpr = 1;
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
      const size = Math.max(2, Math.round(pitch * dpr));
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
          g.globalAlpha = alpha;
          g.fillStyle = amber;
          g.beginPath();
          g.arc(size / 2, size / 2, r, 0, Math.PI * 2);
          g.fill();
        }
        return c;
      };
      sprite = dot(1, true);
      const one = dot(UNLIT, false);
      unlit = document.createElement('canvas');
      unlit.width = canvas.width;
      unlit.height = canvas.height;
      const u = unlit.getContext('2d')!;
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) u.drawImage(one, Math.round(x * pitch * dpr), Math.round(y * pitch * dpr));
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
      const p = pitch * dpr;
      for (const [b, list] of buckets) {
        ctx.globalAlpha = b / 10;
        for (const c of list) ctx.drawImage(sprite, Math.round(Math.round(c.x) * p), Math.round(Math.round(c.y) * p));
      }
      ctx.globalAlpha = 1;
    };

    const picture = (key: string | null): Cell[] =>
      key && departures[key] ? departureCells(departures[key], cols, rows) : ringCells(model, angle, cols, rows);

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
    const needed = () => mode === 'move' || (mode === 'ring' && !isPaused);
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
      } else if (mode === 'ring' && !isPaused) {
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
      pitch = w / COLS;
      cols = COLS;
      rows = Math.floor(h / pitch);
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
  }, [departures]);

  useEffect(() => {
    api.current?.show(active);
  }, [active]);

  useEffect(() => {
    api.current?.setPaused(paused);
  }, [paused]);

  // The housing follows a BVG platform display (U Frankfurter Tor was the
  // reference): enamel frame, header strip, recessed LED panel behind glass,
  // footer strip with the stop. No BVG logo; the site borrows the type of
  // object, not the operator's mark.
  return (
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
        </div>
        <div className="hvg-foot">
          <span className="hvg-stop" aria-hidden="true">Berlin</span>
          {/* Where the real board has its operator badge: a plain yellow key
              that pauses the turn. */}
          <button
            type="button"
            className="hvg-pause"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Play the map animation' : 'Pause the map animation'}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              {paused ? <path d="M5 3.5v9l7.5-4.5z" /> : <path d="M4.5 3.5h2.5v9H4.5zM9 3.5h2.5v9H9z" />}
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
