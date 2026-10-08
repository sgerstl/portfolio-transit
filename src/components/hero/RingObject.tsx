import { useEffect, useRef, useState } from 'react';

// MOCK spike: a slowly turning wireframe of Berlin's Ringbahn with a train
// that never stops, drawn on a 2D canvas with a hand-rolled projection (the
// same approach as the old site's HeroAnimation, no 3D library).
//
// Coordinates are approximate (station positions from memory, ±100–300 m).
// Good enough to judge the object; replace with OSM or VBB GTFS geometry
// before shipping.

type LatLon = [number, number];

// Ringbahn stations, clockwise from Westkreuz.
const RING: { name: string; at: LatLon; label?: boolean }[] = [
  { name: 'Westkreuz', at: [52.5009, 13.2829], label: true },
  { name: 'Halensee', at: [52.4964, 13.2905] },
  { name: 'Hohenzollerndamm', at: [52.4886, 13.3006] },
  { name: 'Heidelberger Platz', at: [52.4797, 13.3121] },
  { name: 'Bundesplatz', at: [52.4777, 13.3287] },
  { name: 'Innsbrucker Platz', at: [52.4782, 13.3428] },
  { name: 'Schöneberg', at: [52.4793, 13.351] },
  { name: 'Südkreuz', at: [52.4753, 13.3655], label: true },
  { name: 'Tempelhof', at: [52.4702, 13.3856] },
  { name: 'Hermannstraße', at: [52.4672, 13.4316] },
  { name: 'Neukölln', at: [52.469, 13.4426] },
  { name: 'Sonnenallee', at: [52.4729, 13.4554] },
  { name: 'Treptower Park', at: [52.4935, 13.4616] },
  { name: 'Ostkreuz', at: [52.5031, 13.4693], label: true },
  { name: 'Frankfurter Allee', at: [52.5137, 13.4752] },
  { name: 'Storkower Straße', at: [52.5238, 13.4648] },
  { name: 'Landsberger Allee', at: [52.5291, 13.4555] },
  { name: 'Greifswalder Straße', at: [52.5402, 13.4384] },
  { name: 'Prenzlauer Allee', at: [52.5446, 13.4271] },
  { name: 'Schönhauser Allee', at: [52.5493, 13.4141] },
  { name: 'Gesundbrunnen', at: [52.5486, 13.3884], label: true },
  { name: 'Wedding', at: [52.5427, 13.3666] },
  { name: 'Westhafen', at: [52.5363, 13.3437] },
  { name: 'Beusselstraße', at: [52.5343, 13.329] },
  { name: 'Jungfernheide', at: [52.5305, 13.2996] },
  { name: 'Westend', at: [52.518, 13.2849] },
  { name: 'Messe Nord', at: [52.5076, 13.2834] },
];

// The Stadtbahn: the east–west line through the middle of the Ring.
const STADTBAHN: LatLon[] = [
  [52.5009, 13.2829], [52.5051, 13.3048], [52.5066, 13.3324], [52.5099, 13.3497],
  [52.5208, 13.3694], [52.5203, 13.3869], [52.5214, 13.4113], [52.515, 13.418],
  [52.5101, 13.4347], [52.5031, 13.4693],
];

// The Spree, roughly, east to west.
const SPREE: LatLon[] = [
  [52.4905, 13.4905], [52.4975, 13.4655], [52.5019, 13.4457], [52.5087, 13.4296],
  [52.515, 13.418], [52.5172, 13.4045], [52.5205, 13.3925], [52.5195, 13.3778],
  [52.522, 13.3655], [52.5233, 13.3505], [52.5196, 13.3305], [52.5195, 13.3105],
  [52.5258, 13.2905], [52.5345, 13.2705],
];

const TV_TOWER: LatLon = [52.5208, 13.4094];
const CENTER: LatLon = [52.508, 13.378];
const M_PER_UNIT = 8200;

type V3 = [number, number, number];

function toLocal([lat, lon]: LatLon, y = 0): V3 {
  const x = ((lon - CENTER[1]) * 111320 * Math.cos((CENTER[0] * Math.PI) / 180)) / M_PER_UNIT;
  const z = (-(lat - CENTER[0]) * 110540) / M_PER_UNIT;
  return [x, y, z];
}

// Closed Catmull-Rom so the Ring reads as track, not a polygon.
function smoothClosed(pts: V3[], steps = 8): V3[] {
  const out: V3[] = [];
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    for (let s = 0; s < steps; s++) {
      const t = s / steps, t2 = t * t, t3 = t2 * t;
      out.push([0, 1, 2].map((k) =>
        0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 +
          (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3),
      ) as V3);
    }
  }
  return out;
}

function smoothOpen(pts: V3[], steps = 6): V3[] {
  const out: V3[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, pts.length - 1)];
    for (let s = 0; s < steps; s++) {
      const t = s / steps, t2 = t * t, t3 = t2 * t;
      out.push([0, 1, 2].map((k) =>
        0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 +
          (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3),
      ) as V3);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

export default function RingObject() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    // Respect reduced motion: start paused, the visitor can press play.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      pausedRef.current = true;
      setPaused(true);
    }
  }, []);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const css = getComputedStyle(document.documentElement);
    const token = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
    const RAIL = token('--color-rail-blue', '#009DE0');
    const INK = token('--color-text', '#4B4B4B');
    const SOFT = token('--color-text-soft', '#6a6258');
    const RING_STROKE = token('--color-ring-stroke', '#555555');
    // MOCK: --color-line-ai holds the brand orange in this branch.
    const TRAIN = token('--color-line-ai', '#DA5A00');

    const ringStations = RING.map((s) => ({ ...s, p: toLocal(s.at) }));
    const ringTrack = smoothClosed(ringStations.map((s) => s.p), 10);
    const stadtbahn = smoothOpen(STADTBAHN.map((p) => toLocal(p)), 6);
    const spree = smoothOpen(SPREE.map((p) => toLocal(p, -0.02)), 6);
    const tv = toLocal(TV_TOWER);
    const TOWER_H = 0.42; // exaggerated about 6x so it reads at this scale

    // Arc length along the Ring, for a train moving at constant speed.
    const seg: number[] = [0];
    for (let i = 1; i <= ringTrack.length; i++) {
      const a = ringTrack[i - 1], b = ringTrack[i % ringTrack.length];
      seg.push(seg[i - 1] + Math.hypot(b[0] - a[0], b[2] - a[2]));
    }
    const LOOP = seg[seg.length - 1];
    const pointAt = (d: number): V3 => {
      d = ((d % LOOP) + LOOP) % LOOP;
      let i = 1;
      while (seg[i] < d) i++;
      const t = (d - seg[i - 1]) / (seg[i] - seg[i - 1]);
      const a = ringTrack[i - 1], b = ringTrack[i % ringTrack.length];
      return [a[0] + (b[0] - a[0]) * t, 0, a[2] + (b[2] - a[2]) * t];
    };

    // Faint ground grid gives the plane depth.
    const grid: V3[] = [];
    for (let gx = -1.4; gx <= 1.41; gx += 0.2) for (let gz = -1.1; gz <= 1.11; gz += 0.2) grid.push([gx, -0.03, gz]);

    let w = 0, h = 0, dpr = 1;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let yaw = -0.5, pitch = 0.95, vYaw = 0;
    let dragging = false, lastX = 0, lastY = 0, idleAt = 0;
    let trainD = 0, last = performance.now();

    const project = ([x, y, z]: V3) => {
      const cy = Math.cos(yaw), sy = Math.sin(yaw);
      const x1 = x * cy - z * sy, z1 = x * sy + z * cy;
      const cp = Math.cos(pitch), sp = Math.sin(pitch);
      const y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
      const D = 3.4, f = Math.min(w, h) * 1.05;
      const s = f / (z2 + D);
      return { x: w / 2 + x1 * s, y: h * 0.52 - y2 * s, depth: z2, s };
    };
    // Nearer is darker; the far side of the Ring recedes.
    const alpha = (depth: number) => Math.max(0.28, Math.min(1, 0.85 - depth * 0.45));

    const polyline = (pts: V3[], color: string, width: number, closed = false, aMul = 1) => {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = width;
      ctx.strokeStyle = color;
      const n = closed ? pts.length : pts.length - 1;
      for (let i = 0; i < n; i++) {
        const a = project(pts[i]), b = project(pts[(i + 1) % pts.length]);
        ctx.globalAlpha = alpha((a.depth + b.depth) / 2) * aMul;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const drawTower = () => {
      const base = project(tv);
      const top = project([tv[0], TOWER_H, tv[2]]);
      const ball = project([tv[0], TOWER_H * 0.6, tv[2]]);
      const tip = project([tv[0], TOWER_H * 1.25, tv[2]]);
      ctx.strokeStyle = INK;
      ctx.globalAlpha = alpha(base.depth);
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(base.x, base.y); ctx.lineTo(top.x, top.y); ctx.stroke();
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(top.x, top.y); ctx.lineTo(tip.x, tip.y); ctx.stroke();
      // The sphere as a wireframe: an outline and two latitude bands.
      const r = Math.min(14, 0.055 * ball.s);
      ctx.lineWidth = 1.25;
      ctx.beginPath(); ctx.arc(ball.x, ball.y, r, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(ball.x, ball.y, r, r * 0.32, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(ball.x, ball.y - r * 0.5, r * 0.86, r * 0.26, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const heroGone = window.scrollY > window.innerHeight * 1.3;
      const moving = !pausedRef.current && !document.hidden && !heroGone;

      if (!dragging) {
        if (moving && now - idleAt > 1500) yaw += 0.09 * dt;
        yaw += vYaw;
        vYaw *= 0.92;
      }
      if (moving) trainD += LOOP * dt / 36; // one lap every 36 seconds

      if (!heroGone && w > 60) {
        ctx.clearRect(0, 0, w, h);

        ctx.fillStyle = SOFT;
        for (const g of grid) {
          const p = project(g);
          ctx.globalAlpha = alpha(p.depth) * 0.22;
          ctx.fillRect(p.x - 0.75, p.y - 0.75, 1.5, 1.5);
        }
        ctx.globalAlpha = 1;

        polyline(spree, RAIL, 7, false, 0.22);
        polyline(stadtbahn, INK, 2, false, 0.55);
        polyline(ringTrack, RAIL, 4, true);

        for (const st of ringStations) {
          const p = project(st.p);
          ctx.globalAlpha = alpha(p.depth);
          ctx.fillStyle = 'white';
          ctx.strokeStyle = RING_STROKE;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, st.label ? 4.5 : 2.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          if (st.label) {
            ctx.fillStyle = INK;
            ctx.font = '600 13px "Barlow Condensed", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(st.name.toUpperCase(), p.x, p.y - 10);
          }
        }
        ctx.globalAlpha = 1;

        drawTower();

        // The train: a short bright segment with a fading trail.
        for (let k = 14; k >= 0; k--) {
          const a = project(pointAt(trainD - k * 0.018));
          const b = project(pointAt(trainD - (k + 1) * 0.018));
          ctx.globalAlpha = (1 - k / 15) * (k < 3 ? 1 : 0.55);
          ctx.strokeStyle = TRAIN;
          ctx.lineWidth = k < 3 ? 7 : 4;
          ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(a.x, a.y); ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // Drag to turn it; it settles and resumes its own slow turn.
    const down = (e: PointerEvent) => {
      dragging = true; lastX = e.clientX; lastY = e.clientY; vYaw = 0;
      canvas.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      yaw += dx * 0.008; vYaw = dx * 0.008;
      pitch = Math.max(0.55, Math.min(1.35, pitch + dy * 0.005));
    };
    const up = () => { dragging = false; idleAt = performance.now(); };
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', up);
    };
  }, []);

  return (
    <figure className="hv-ring">
      <canvas
        ref={canvasRef}
        className="hv-ring-canvas"
        role="img"
        aria-label="A slowly turning wireframe of Berlin's Ringbahn, with the Spree, the TV tower and a train circling the Ring."
      />
      <figcaption className="hv-ring-cap">
        <span>Berlin · Ringbahn · 37 km · drag to turn</span>
        <button
          type="button"
          className="hv-ring-pause"
          aria-pressed={paused}
          aria-label={paused ? 'Play animation' : 'Pause animation'}
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? (
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.5v9l7-4.5z" /></svg>
          ) : (
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.5h2v9H5zM9 3.5h2v9H9z" /></svg>
          )}
        </button>
      </figcaption>
    </figure>
  );
}
