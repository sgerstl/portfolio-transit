import { useEffect, useRef, useState } from 'react';

// MOCK spike: a turning wireframe of Berlin's Ringbahn. Scott's industries
// sit on it as real Berlin landmarks; hover or focus one and the Ring turns
// to face it, the train runs there, and the caption links the case.
// Hand-rolled canvas projection (the old site's HeroAnimation approach, no
// 3D library). Labels are real links laid over the canvas, so they stay
// crisp, focusable and readable by screen readers.
//
// Coordinates are approximate (±100–300 m, from memory). Replace with OSM or
// VBB GTFS geometry before shipping. Landmarks are icons, not to scale.

type LatLon = [number, number];
type V3 = [number, number, number];
type Seg = [V3, V3];

const RING: LatLon[] = [
  [52.5009, 13.2829], [52.4964, 13.2905], [52.4886, 13.3006], [52.4797, 13.3121],
  [52.4777, 13.3287], [52.4782, 13.3428], [52.4793, 13.351], [52.4753, 13.3655],
  [52.4702, 13.3856], [52.4672, 13.4316], [52.469, 13.4426], [52.4729, 13.4554],
  [52.4935, 13.4616], [52.5031, 13.4693], [52.5137, 13.4752], [52.5238, 13.4648],
  [52.5291, 13.4555], [52.5402, 13.4384], [52.5446, 13.4271], [52.5493, 13.4141],
  [52.5486, 13.3884], [52.5427, 13.3666], [52.5363, 13.3437], [52.5343, 13.329],
  [52.5305, 13.2996], [52.518, 13.2849], [52.5076, 13.2834],
];

const STADTBAHN: LatLon[] = [
  [52.5009, 13.2829], [52.5051, 13.3048], [52.5066, 13.3324], [52.5099, 13.3497],
  [52.5208, 13.3694], [52.5203, 13.3869], [52.5214, 13.4113], [52.515, 13.418],
  [52.5101, 13.4347], [52.5031, 13.4693],
];

const SPREE: LatLon[] = [
  [52.4905, 13.4905], [52.4975, 13.4655], [52.5019, 13.4457], [52.5087, 13.4296],
  [52.515, 13.418], [52.5172, 13.4045], [52.5205, 13.3925], [52.5195, 13.3778],
  [52.522, 13.3655], [52.5233, 13.3505], [52.5196, 13.3305], [52.5195, 13.3105],
  [52.5258, 13.2905], [52.5345, 13.2705],
];

const TV_TOWER: LatLon = [52.5208, 13.4094];
const CENTER: LatLon = [52.508, 13.378];
const M_PER_UNIT = 8200;

function toLocal([lat, lon]: LatLon, y = 0): V3 {
  const x = ((lon - CENTER[1]) * 111320 * Math.cos((CENTER[0] * Math.PI) / 180)) / M_PER_UNIT;
  // North is +z, so with the camera south of the city east lands on the right.
  const z = ((lat - CENTER[0]) * 110540) / M_PER_UNIT;
  return [x, y, z];
}

// ── Wireframe primitives, all built around a ground point ────────────────
function box(c: V3, w: number, d: number, h: number): Seg[] {
  const [x, , z] = c, hw = w / 2, hd = d / 2;
  const b: V3[] = [[x - hw, 0, z - hd], [x + hw, 0, z - hd], [x + hw, 0, z + hd], [x - hw, 0, z + hd]];
  const t = b.map(([px, , pz]) => [px, h, pz] as V3);
  const out: Seg[] = [];
  for (let i = 0; i < 4; i++) {
    out.push([b[i], b[(i + 1) % 4]], [t[i], t[(i + 1) % 4]], [b[i], t[i]]);
  }
  return out;
}
function cylinder(c: V3, r: number, h: number, n = 14, y0 = 0): Seg[] {
  const [x, , z] = c;
  const ring = (y: number) =>
    Array.from({ length: n }, (_, i) => [x + r * Math.cos((i / n) * Math.PI * 2), y, z + r * Math.sin((i / n) * Math.PI * 2)] as V3);
  const lo = ring(y0), hi = ring(y0 + h);
  const out: Seg[] = [];
  for (let i = 0; i < n; i++) {
    out.push([lo[i], lo[(i + 1) % n]], [hi[i], hi[(i + 1) % n]]);
    if (i % Math.ceil(n / 4) === 0) out.push([lo[i], hi[i]]);
  }
  return out;
}
function dome(c: V3, r: number, y0: number, n = 12): Seg[] {
  const [x, , z] = c;
  const out: Seg[] = [];
  for (let k = 0; k < 3; k++) {
    const a = (k / 3) * Math.PI;
    for (let i = 0; i < n; i++) {
      const t0 = (i / n) * Math.PI, t1 = ((i + 1) / n) * Math.PI;
      const p = (t: number): V3 => [x + r * Math.cos(t) * Math.cos(a), y0 + r * Math.sin(t), z + r * Math.cos(t) * Math.sin(a)];
      out.push([p(t0), p(t1)]);
    }
  }
  return out;
}
function line(pts: V3[]): Seg[] {
  return pts.slice(1).map((p, i) => [pts[i], p] as Seg);
}

type Landmark = {
  id: string;
  domain: string;
  place: string;
  at: LatLon;
  href: string;
  caseName: string;
  minutes: number;
  blurb: string;
  lift: number; // label height above ground
  below?: boolean; // hang the label under the landmark instead
  build: (c: V3) => Seg[];
};

// Order is the tab order: paid work first, matching the lines below.
const LANDMARKS: Landmark[] = [
  {
    id: 'siemensstadt', domain: 'Manufacturing', place: 'Siemensstadt', at: [52.5387, 13.2702],
    href: '/work/brightly', caseName: 'Brightly', minutes: 6,
    blurb: 'Siemens acquired Brightly for $1.575B in 2022. I set its design direction.',
    lift: 0.2,
    build: (c) => [
      ...box([c[0] + 0.03, 0, c[2]], 0.11, 0.06, 0.06),
      // sawtooth roof
      ...line([[c[0] - 0.025, 0.06, c[2] - 0.03], [c[0] + 0.0, 0.09, c[2] - 0.03], [c[0] + 0.0, 0.06, c[2] - 0.03], [c[0] + 0.03, 0.09, c[2] - 0.03], [c[0] + 0.03, 0.06, c[2] - 0.03], [c[0] + 0.06, 0.09, c[2] - 0.03], [c[0] + 0.06, 0.06, c[2] - 0.03]]),
      // the Wernerwerk clock tower
      ...box([c[0] - 0.05, 0, c[2]], 0.025, 0.025, 0.17),
    ],
  },
  {
    id: 'klingenberg', domain: 'Energy', place: 'Kraftwerk Klingenberg', at: [52.495, 13.496],
    href: '/work/pqdr', caseName: 'PQ + DR', minutes: 5,
    blurb: 'A city power station. PQ + DR put AI insight in front of operators at 200+ industrial sites.',
    lift: 0.2,
    build: (c) => [
      ...box(c, 0.1, 0.05, 0.07),
      ...cylinder([c[0] - 0.025, 0, c[2]], 0.009, 0.18, 8, 0.07),
      ...cylinder([c[0] + 0.025, 0, c[2]], 0.009, 0.18, 8, 0.07),
    ],
  },
  {
    id: 'westhafen', domain: 'Logistics', place: 'Westhafen', at: [52.5395, 13.3415],
    href: '/work/fleet', caseName: 'Fleet', minutes: 5,
    blurb: "Berlin's freight port. Fleet turned three yard tools and two forms into one.",
    lift: 0.15,
    build: (c) => [
      ...box([c[0], 0, c[2] + 0.02], 0.12, 0.03, 0.025),
      // two quay cranes
      ...line([[c[0] - 0.03, 0, c[2]], [c[0] - 0.03, 0.11, c[2]], [c[0] - 0.08, 0.11, c[2]], [c[0] - 0.08, 0.095, c[2]]]),
      ...line([[c[0] + 0.03, 0, c[2]], [c[0] + 0.03, 0.11, c[2]], [c[0] - 0.02, 0.11, c[2]], [c[0] - 0.02, 0.095, c[2]]]),
    ],
  },
  {
    id: 'avus', domain: 'Motorsports', place: 'AVUS', at: [52.4855, 13.2645],
    href: '/work/sim-racing', caseName: 'Sim Racing Coach', minutes: 6,
    blurb: "Berlin's old racing circuit. Two paid engagements designing an AI race engineer.",
    lift: 0.08,
    build: (c) => {
      // a long straight with the banked Nordkurve, as a narrow loop
      const a: V3 = [c[0] + 0.1, 0, c[2] - 0.17], b: V3 = [c[0] - 0.1, 0, c[2] + 0.17];
      const off = 0.012;
      const out: Seg[] = [
        [[a[0] - off, 0, a[2] - off * 0.6], [b[0] - off, 0, b[2] - off * 0.6]],
        [[a[0] + off, 0, a[2] + off * 0.6], [b[0] + off, 0, b[2] + off * 0.6]],
      ];
      // banking at the north end
      out.push([[a[0] - off, 0, a[2] - off * 0.6], [a[0], 0.03, a[2] - 0.02]], [[a[0] + off, 0, a[2] + off * 0.6], [a[0], 0.03, a[2] - 0.02]]);
      return out;
    },
  },
  {
    id: 'charite', domain: 'Healthcare', place: 'Charité', at: [52.5265, 13.3775],
    href: '/work/epilog', caseName: 'Epilog', minutes: 4,
    blurb: "Berlin's university hospital. Epilog's AI caught a drug interaction a doctor missed.",
    lift: 0.24,
    build: (c) => [...box(c, 0.035, 0.07, 0.19), ...box([c[0] + 0.04, 0, c[2] + 0.02], 0.05, 0.05, 0.05)],
  },
  {
    id: 'velodrom', domain: 'Cycling', place: 'Velodrom', at: [52.53, 13.45],
    href: '/work/cal', caseName: 'Cal', minutes: 3,
    blurb: "Berlin's track-cycling arena. Cal coaches my own training.",
    lift: 0.09,
    build: (c) => cylinder(c, 0.055, 0.025, 18),
  },
  {
    id: 'tu', domain: 'Education', place: 'TU Berlin', at: [52.5126, 13.3267],
    href: '/work/brightly', caseName: 'Brightly', minutes: 6,
    blurb: "Brightly's platform ran schools and universities as well as factories.",
    lift: 0.12,
    build: (c) => box(c, 0.13, 0.035, 0.055),
  },
  {
    id: 'reichstag', domain: 'Government', place: 'Reichstag', at: [52.5186, 13.3762],
    href: '/work/brightly', caseName: 'Brightly', minutes: 6,
    blurb: 'And city and state governments.',
    lift: 0,
    below: true,
    build: (c) => [...box(c, 0.08, 0.055, 0.045), ...dome(c, 0.025, 0.045)],
  },
];

const DEFAULT_CAPTION = 'Berlin · Ringbahn · pick an industry';

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

const angDiff = (a: number, b: number) => {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
};

export default function RingObject() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const labelRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const [active, setActive] = useState<number | null>(null);
  const activeRef = useRef<number | null>(null);
  const reducedRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reducedRef.current = true;
      pausedRef.current = true;
      setPaused(true);
    }
  }, []);
  // MOCK: ?lm=<id> preselects a landmark and snaps to it (for review links).
  const snapRef = useRef(false);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('lm');
    const i = LANDMARKS.findIndex((m) => m.id === id);
    if (i >= 0) { snapRef.current = true; activeRef.current = i; setActive(i); }
  }, []);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => { activeRef.current = active; }, [active]);

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
    const ACCENT = token('--color-line-ai', '#DA5A00');

    const stations = RING.map((p) => toLocal(p));
    const ringTrack = smoothClosed(stations, 10);
    const stadtbahn = smoothOpen(STADTBAHN.map((p) => toLocal(p)), 6);
    const spree = smoothOpen(SPREE.map((p) => toLocal(p, -0.02)), 6);
    const tv = toLocal(TV_TOWER);
    const TOWER_H = 0.42;

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

    const marks = LANDMARKS.map((lm) => {
      const c = toLocal(lm.at);
      // The Ring position nearest the landmark: where the train stops for it.
      let best = 0, bestDist = Infinity;
      for (let i = 0; i < ringTrack.length; i++) {
        const dd = Math.hypot(ringTrack[i][0] - c[0], ringTrack[i][2] - c[2]);
        if (dd < bestDist) { bestDist = dd; best = i; }
      }
      return { c, segs: lm.build(c), stopD: seg[best], facing: Math.atan2(c[0], c[2]) };
    });

    const grid: V3[] = [];
    for (let gx = -1.4; gx <= 1.41; gx += 0.2) for (let gz = -1.1; gz <= 1.11; gz += 0.2) grid.push([gx, -0.03, gz]);

    let w = 0, h = 0, dpr = 1;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // North at the back, turned a little so the Ring reads as an object.
    let yaw = -0.35, pitch = 0.95, vYaw = 0;
    let dragging = false, lastX = 0, lastY = 0, idleAt = 0;
    let trainD = 0, last = performance.now();

    // Camera above the plane looking down: far is higher on screen and smaller.
    const project = ([x, y, z]: V3) => {
      const cy = Math.cos(yaw), sy = Math.sin(yaw);
      const x1 = x * cy - z * sy, z1 = x * sy + z * cy;
      const cp = Math.cos(pitch), sp = Math.sin(pitch);
      const y2 = y * cp + z1 * sp, z2 = -y * sp + z1 * cp;
      const D = 3.2, f = Math.min(w, h) * 1.4;
      const s = f / (z2 + D);
      return { x: w / 2 + x1 * s, y: h * 0.5 - y2 * s, depth: z2, s };
    };
    const alpha = (depth: number) => Math.max(0.3, Math.min(1, 0.8 - depth * 0.45));

    const strokeSegs = (segs: Seg[], color: string, width: number, aMul = 1) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      for (const [a3, b3] of segs) {
        const a = project(a3), b = project(b3);
        ctx.globalAlpha = alpha((a.depth + b.depth) / 2) * aMul;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };
    const polyline = (pts: V3[], color: string, width: number, closed = false, aMul = 1) => {
      const segs: Seg[] = [];
      const n = closed ? pts.length : pts.length - 1;
      for (let i = 0; i < n; i++) segs.push([pts[i], pts[(i + 1) % pts.length]]);
      ctx.lineJoin = 'round';
      strokeSegs(segs, color, width, aMul);
    };

    const drawTower = () => {
      const base = project(tv), top = project([tv[0], TOWER_H, tv[2]]);
      const ball = project([tv[0], TOWER_H * 0.6, tv[2]]), tip = project([tv[0], TOWER_H * 1.25, tv[2]]);
      ctx.strokeStyle = INK;
      ctx.globalAlpha = alpha(base.depth);
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(base.x, base.y); ctx.lineTo(top.x, top.y); ctx.stroke();
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(top.x, top.y); ctx.lineTo(tip.x, tip.y); ctx.stroke();
      const r = Math.max(2, Math.min(16, 0.05 * ball.s));
      ctx.lineWidth = 1.25;
      ctx.beginPath(); ctx.arc(ball.x, ball.y, r, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(ball.x, ball.y, r, r * 0.32, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const heroGone = window.scrollY > window.innerHeight * 1.3;
      const moving = !pausedRef.current && !document.hidden && !heroGone;
      const act = activeRef.current;
      const instant = reducedRef.current || snapRef.current;
      snapRef.current = false;

      if (act !== null) {
        // Turn the chosen landmark to the front, and run the train to it.
        const target = marks[act].facing - Math.PI;
        const d = angDiff(yaw, target);
        yaw = instant ? target : yaw + d * Math.min(1, dt * 4);
        const td = angDiff((trainD / LOOP) * Math.PI * 2, (marks[act].stopD / LOOP) * Math.PI * 2) / (Math.PI * 2) * LOOP;
        if (instant) trainD = marks[act].stopD;
        else trainD += Math.sign(td) * Math.min(Math.abs(td), LOOP * dt * 0.45);
      } else if (!dragging) {
        if (moving && now - idleAt > 1500) yaw += 0.09 * dt;
        yaw += vYaw;
        vYaw *= 0.92;
        if (moving) trainD += (LOOP * dt) / 36;
      }

      if (!heroGone && w > 60) {
        ctx.clearRect(0, 0, w, h);

        ctx.fillStyle = SOFT;
        for (const g of grid) {
          const p = project(g);
          ctx.globalAlpha = alpha(p.depth) * 0.22;
          ctx.fillRect(p.x - 0.75, p.y - 0.75, 1.5, 1.5);
        }
        ctx.globalAlpha = 1;

        polyline(spree, RAIL, 8, false, 0.2);
        polyline(stadtbahn, INK, 2, false, 0.5);
        polyline(ringTrack, RAIL, 4.5, true);

        for (const st of stations) {
          const p = project(st);
          ctx.globalAlpha = alpha(p.depth);
          ctx.fillStyle = 'white';
          ctx.strokeStyle = RING_STROKE;
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(p.x, p.y, 2.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        }
        ctx.globalAlpha = 1;

        drawTower();

        marks.forEach((m, i) => {
          const on = act === i;
          strokeSegs(m.segs, on ? ACCENT : INK, on ? 1.75 : 1.15, on ? 1.25 : 0.9);
          // Label anchor floats above the landmark.
          const p = project([m.c[0], LANDMARKS[i].lift, m.c[2]]);
          const el = labelRefs.current[i];
          if (el) {
            const lift = LANDMARKS[i].below ? 'translate(-50%, 10px)' : 'translate(-50%, -100%)';
            el.style.transform = `translate(${p.x}px, ${p.y}px) ${lift}`;
            el.style.opacity = String(on ? 1 : Math.max(0.55, alpha(p.depth)));
            el.style.zIndex = String(on ? 50 : Math.round(20 - p.depth * 10));
          }
        });

        for (let k = 14; k >= 0; k--) {
          const a = project(pointAt(trainD - k * 0.018));
          const b = project(pointAt(trainD - (k + 1) * 0.018));
          ctx.globalAlpha = (1 - k / 15) * (k < 3 ? 1 : 0.55);
          ctx.strokeStyle = ACCENT;
          ctx.lineWidth = k < 3 ? 7 : 4;
          ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(a.x, a.y); ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const down = (e: PointerEvent) => {
      dragging = true; lastX = e.clientX; lastY = e.clientY; vYaw = 0;
      canvas.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      yaw += dx * 0.008; vYaw = dx * 0.008;
      pitch = Math.max(0.55, Math.min(1.35, pitch - dy * 0.005));
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

  const lm = active !== null ? LANDMARKS[active] : null;

  return (
    <figure className="hv-rb">
      <div className="hv-rb-stage">
        <canvas
          ref={canvasRef}
          className="hv-rb-canvas"
          aria-hidden="true"
        />
        <nav className="hv-rb-labels" aria-label="Industries I've designed for, on a map of Berlin">
          {LANDMARKS.map((m, i) => (
            <a
              key={m.id}
              ref={(el) => { labelRefs.current[i] = el; }}
              href={m.href}
              className={`hv-rb-label${active === i ? ' is-active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive((a) => (a === i ? null : a))}
              onFocus={() => setActive(i)}
              onBlur={() => setActive((a) => (a === i ? null : a))}
              aria-label={`${m.domain}: ${m.place}. ${m.blurb} Read the ${m.caseName} case study.`}
            >
              {m.domain}
            </a>
          ))}
        </nav>
      </div>
      <figcaption className="hv-rb-cap">
        <p className="hv-rb-cap-text" aria-live="polite">
          {lm ? (
            <>
              <strong>{lm.place}</strong> · {lm.blurb}{' '}
              <span className="hv-rb-cap-case">{lm.caseName}, {lm.minutes} min →</span>
            </>
          ) : (
            DEFAULT_CAPTION
          )}
        </p>
        <button
          type="button"
          className="hv-rb-pause"
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
