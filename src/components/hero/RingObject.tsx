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
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * Math.PI;
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
// Floor lines: horizontal rings around a box at even heights.
function floors(c: V3, w: number, d: number, h: number, n: number, y0 = 0): Seg[] {
  const [x, , z] = c, hw = w / 2, hd = d / 2;
  const out: Seg[] = [];
  for (let k = 1; k < n; k++) {
    const y = y0 + (h * k) / n;
    const r: V3[] = [[x - hw, y, z - hd], [x + hw, y, z - hd], [x + hw, y, z + hd], [x - hw, y, z + hd]];
    for (let i = 0; i < 4; i++) out.push([r[i], r[(i + 1) % 4]]);
  }
  return out;
}
// Window bays: verticals on both long faces.
function bays(c: V3, w: number, d: number, h: number, n: number, y0 = 0): Seg[] {
  const [x, , z] = c, hw = w / 2, hd = d / 2;
  const out: Seg[] = [];
  for (let k = 1; k < n; k++) {
    const bx = x - hw + (w * k) / n;
    out.push([[bx, y0, z - hd], [bx, y0 + h, z - hd]], [[bx, y0, z + hd], [bx, y0 + h, z + hd]]);
  }
  return out;
}
function boxAt(c: V3, w: number, d: number, h: number, y0: number): Seg[] {
  return box(c, w, d, h).map(([a, b]) => [[a[0], a[1] + y0, a[2]], [b[0], b[1] + y0, b[2]]] as Seg);
}
function pyramid(c: V3, s: number, y0: number, h: number): Seg[] {
  const [x, , z] = c, hs = s / 2;
  const apex: V3 = [x, y0 + h, z];
  const b: V3[] = [[x - hs, y0, z - hs], [x + hs, y0, z - hs], [x + hs, y0, z + hs], [x - hs, y0, z + hs]];
  return b.map((p) => [p, apex] as Seg);
}
function ring(c: V3, r: number, y: number, n = 16): Seg[] {
  const [x, , z] = c;
  const pts = Array.from({ length: n }, (_, i) => [x + r * Math.cos((i / n) * Math.PI * 2), y, z + r * Math.sin((i / n) * Math.PI * 2)] as V3);
  return pts.map((p, i) => [p, pts[(i + 1) % n]] as Seg);
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
  // 'home' is the one stop that isn't an industry: it leads to About, is
  // styled differently, and the train doesn't run to it.
  kind?: 'home';
  // m: outlines, drawn full weight; d: floors, bays and roof detail, drawn light
  build: (c: V3) => { m: Seg[]; d: Seg[] };
};

// Order is the tab order: paid work first, matching the lines below.
const LANDMARKS: Landmark[] = [
  {
    id: 'siemensstadt', domain: 'Manufacturing', place: 'Siemensstadt', at: [52.5387, 13.2702],
    href: '/work/brightly/', caseName: 'Brightly', minutes: 6,
    blurb: 'Siemens acquired Brightly for $1.575B in 2022. I set its design direction.',
    lift: 0.24,
    build: (c) => {
      const hall: V3 = [c[0] + 0.03, 0, c[2]];
      const tower: V3 = [c[0] - 0.055, 0, c[2]];
      // sawtooth roof: four north-light teeth across the hall
      const teeth: Seg[] = [];
      for (let k = 0; k < 4; k++) {
        const x0 = hall[0] - 0.06 + k * 0.03, x1 = x0 + 0.03;
        teeth.push(
          ...line([[x0, 0.055, hall[2] - 0.03], [x0, 0.078, hall[2] - 0.03], [x1, 0.055, hall[2] - 0.03]]),
          ...line([[x0, 0.055, hall[2] + 0.03], [x0, 0.078, hall[2] + 0.03], [x1, 0.055, hall[2] + 0.03]]),
          [[x0, 0.078, hall[2] - 0.03], [x0, 0.078, hall[2] + 0.03]],
        );
      }
      return {
        m: [...box(hall, 0.12, 0.06, 0.055), ...teeth, ...box(tower, 0.026, 0.026, 0.17), ...pyramid(tower, 0.026, 0.17, 0.03)],
        d: [
          ...floors(hall, 0.12, 0.06, 0.055, 2), ...bays(hall, 0.12, 0.06, 0.055, 8),
          ...floors(tower, 0.026, 0.026, 0.17, 7),
          // the clock face near the top
          ...boxAt(tower, 0.016, 0.028, 0.016, 0.135),
        ],
      };
    },
  },
  {
    id: 'klingenberg', domain: 'Energy', place: 'Kraftwerk Klingenberg', at: [52.495, 13.496],
    href: '/work/pqdr/', caseName: 'PQ + DR', minutes: 5,
    blurb: 'A city power station. PQ + DR put AI insight in front of operators at 200+ industrial sites.',
    lift: 0.27,
    build: (c) => {
      const stacks = [-0.035, 0, 0.035].flatMap((dx) => cylinder([c[0] + dx, 0, c[2] - 0.008], 0.0085, 0.17, 10, 0.075));
      return {
        m: [...box(c, 0.11, 0.05, 0.075), ...stacks],
        d: [
          ...floors(c, 0.11, 0.05, 0.075, 3), ...bays(c, 0.11, 0.05, 0.075, 9),
          ...[-0.035, 0, 0.035].flatMap((dx) => ring([c[0] + dx, 0, c[2] - 0.008], 0.0085, 0.2, 10)),
        ],
      };
    },
  },
  {
    id: 'westhafen', domain: 'Logistics', place: 'Westhafen', at: [52.5395, 13.3415],
    href: '/work/fleet/', caseName: 'Fleet', minutes: 5,
    blurb: "Berlin's freight port. Fleet turned three yard tools and two forms into one.",
    lift: 0.17,
    build: (c) => {
      const store: V3 = [c[0] + 0.03, 0, c[2] + 0.028];
      const hw = 0.05, hd = 0.016, eave = 0.035, ridge = 0.052;
      const roof: Seg[] = [
        [[store[0] - hw, ridge, store[2]], [store[0] + hw, ridge, store[2]]],
        [[store[0] - hw, eave, store[2] - hd], [store[0] - hw, ridge, store[2]]], [[store[0] - hw, ridge, store[2]], [store[0] - hw, eave, store[2] + hd]],
        [[store[0] + hw, eave, store[2] - hd], [store[0] + hw, ridge, store[2]]], [[store[0] + hw, ridge, store[2]], [store[0] + hw, eave, store[2] + hd]],
      ];
      // a portal crane: two leg pairs, a deck, a mast and a jib reaching over the water
      const crane = (x0: number): Seg[] => {
        const z0 = c[2] - 0.01, zf = z0 - 0.012, zb = z0 + 0.012;
        return [
          [[x0 - 0.01, 0, zf], [x0 - 0.01, 0.07, zf]], [[x0 + 0.01, 0, zf], [x0 + 0.01, 0.07, zf]],
          [[x0 - 0.01, 0, zb], [x0 - 0.01, 0.07, zb]], [[x0 + 0.01, 0, zb], [x0 + 0.01, 0.07, zb]],
          ...ring([x0, 0, z0], 0.014, 0.07, 4),
          [[x0, 0.07, z0], [x0, 0.12, z0]],
          [[x0, 0.09, z0], [x0 - 0.075, 0.09, z0]],
          [[x0, 0.12, z0], [x0 - 0.075, 0.09, z0]],
          [[x0 - 0.075, 0.09, z0], [x0 - 0.075, 0.07, z0]],
        ];
      };
      return {
        m: [...box(store, hw * 2, hd * 2, eave), ...roof, ...crane(c[0] - 0.02), ...crane(c[0] + 0.035)],
        d: [...floors(store, hw * 2, hd * 2, eave, 3), ...bays(store, hw * 2, hd * 2, eave, 8)],
      };
    },
  },
  {
    id: 'avus', domain: 'Motorsports', place: 'AVUS', at: [52.4855, 13.2645],
    href: '/work/sim-racing/', caseName: 'Sim Racing Coach', minutes: 6,
    blurb: "Berlin's old racing circuit. Two paid engagements designing an AI race engineer.",
    lift: 0.1,
    build: (c) => {
      // the long straights, with the banked Nordkurve swinging round at the north end
      const dir: [number, number] = [0.5, -0.86];
      const nrm: [number, number] = [0.86, 0.5];
      const L = 0.075, sep = 0.042;
      const pt = (t: number, side: number, y = 0): V3 => [c[0] + dir[0] * t + nrm[0] * side, y, c[2] + dir[1] * t + nrm[1] * side];
      const curve: Seg[] = [];
      const n = 14, r = sep;
      for (const end of [1, -1]) {
        for (let i = 0; i < n; i++) {
          const a0 = (i / n) * Math.PI, a1 = ((i + 1) / n) * Math.PI;
          // the north end is the banked Nordkurve
          const bank = end === 1 ? 0.02 : 0;
          const q = (a: number): V3 => pt(end * (L + Math.sin(a) * r), -Math.cos(a) * r, bank * Math.sin(a));
          curve.push([q(a0), q(a1)]);
        }
      }
      const stand: V3 = pt(0, sep + 0.02);
      return {
        m: [[pt(-L, -r), pt(L, -r)], [pt(-L, r), pt(L, r)], ...curve, ...box(stand, 0.05, 0.018, 0.022)],
        d: [...bays(stand, 0.05, 0.018, 0.022, 6), [pt(-L, 0), pt(L, 0)]],
      };
    },
  },
  {
    id: 'charite', domain: 'Healthcare', place: 'Charité', at: [52.5265, 13.3775],
    href: '/work/epilog/', caseName: 'Epilog', minutes: 4,
    blurb: "Berlin's university hospital. Epilog's AI caught a drug interaction a doctor missed.",
    lift: 0.26,
    build: (c) => {
      const pod: V3 = [c[0] + 0.045, 0, c[2] + 0.012];
      return {
        m: [...box(c, 0.034, 0.075, 0.2), ...box(pod, 0.06, 0.06, 0.04)],
        d: [...floors(c, 0.034, 0.075, 0.2, 14), ...floors(pod, 0.06, 0.06, 0.04, 3)],
      };
    },
  },
  {
    id: 'velodrom', domain: 'Cycling', place: 'Velodrom', at: [52.53, 13.45],
    href: '/work/cal/', caseName: 'Cal', minutes: 3,
    blurb: "Berlin's track-cycling arena. Cal coaches my own training.",
    lift: 0.1,
    build: (c) => {
      const ribs: Seg[] = [];
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        ribs.push([[c[0] + 0.03 * Math.cos(a), 0.03, c[2] + 0.03 * Math.sin(a)], [c[0] + 0.058 * Math.cos(a), 0.022, c[2] + 0.058 * Math.sin(a)]]);
      }
      return {
        m: [...cylinder(c, 0.058, 0.022, 32), ...ring(c, 0.03, 0.03, 20)],
        d: [...ribs, ...ring(c, 0.058, 0.011, 32)],
      };
    },
  },
  {
    id: 'tu', domain: 'Education', place: 'TU Berlin', at: [52.5126, 13.3267],
    href: '/work/brightly/', caseName: 'Brightly', minutes: 6,
    blurb: "Brightly's platform ran schools and universities as well as factories.",
    lift: 0.13,
    build: (c) => {
      const front = c[2] - 0.0225;
      // central bay stepping forward, with a pediment
      const ped: Seg[] = line([[c[0] - 0.016, 0.06, front], [c[0], 0.075, front], [c[0] + 0.016, 0.06, front]]);
      return {
        m: [...box(c, 0.14, 0.035, 0.05), ...box([c[0], 0, c[2] - 0.005], 0.032, 0.045, 0.06), ...ped],
        d: [...floors(c, 0.14, 0.035, 0.05, 3), ...bays(c, 0.14, 0.035, 0.05, 12)],
      };
    },
  },
  {
    id: 'reichstag', domain: 'Government', place: 'Reichstag', at: [52.5186, 13.3762],
    href: '/work/brightly/', caseName: 'Brightly', minutes: 6,
    blurb: 'And city and state governments.',
    lift: 0,
    below: true,
    build: (c) => {
      const towers = [[-1, -1], [1, -1], [1, 1], [-1, 1]].flatMap(([sx, sz]) =>
        box([c[0] + sx * 0.032, 0, c[2] + sz * 0.02], 0.016, 0.016, 0.058),
      );
      return {
        m: [...box(c, 0.08, 0.056, 0.045), ...towers, ...ring(c, 0.022, 0.045, 16), ...dome(c, 0.022, 0.045)],
        d: [...floors(c, 0.08, 0.056, 0.045, 2), ...bays(c, 0.08, 0.056, 0.045, 7), ...ring(c, 0.016, 0.061, 14)],
      };
    },
  },
  {
    id: 'fernsehturm', domain: 'About me', place: 'Berlin, by way of North Carolina', at: [52.5208, 13.4094],
    href: '/#case-about', caseName: 'About', minutes: 2,
    blurb: 'What I do, and why this site is a transit map.',
    lift: 0.6, // floats clear of the antenna tip, and of the Healthcare label below it
    kind: 'home',
    build: (c) => {
      const [x, , z] = c;
      const m: Seg[] = [], d: Seg[] = [];
      // tapered concrete shaft
      const shaftTop = 0.24, n = 8;
      const rAt = (y: number) => 0.012 - (0.005 * y) / shaftTop;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const p = (y: number): V3 => [x + rAt(y) * Math.cos(a), y, z + rAt(y) * Math.sin(a)];
        (i % 2 === 0 ? m : d).push([p(0.02), p(shaftTop)]);
      }
      for (let k = 1; k <= 5; k++) d.push(...ring(c, rAt((shaftTop * k) / 6), (shaftTop * k) / 6, n));
      // the sphere: meridians as outline, parallels as detail
      const cy = 0.275, R = 0.034, segs = 20;
      for (let k = 0; k < 4; k++) {
        const ang = (k / 4) * Math.PI;
        for (let i = 0; i < segs; i++) {
          const t0 = (i / segs) * Math.PI * 2, t1 = ((i + 1) / segs) * Math.PI * 2;
          const q = (t: number): V3 => [x + R * Math.cos(t) * Math.cos(ang), cy + R * Math.sin(t), z + R * Math.cos(t) * Math.sin(ang)];
          m.push([q(t0), q(t1)]);
        }
      }
      for (const lat of [-0.5, 0, 0.5]) d.push(...ring(c, R * Math.cos(lat), cy + R * Math.sin(lat), 18));
      // upper shaft and antenna
      m.push(...cylinder(c, 0.005, 0.07, 6, cy + R));
      m.push([[x, cy + R + 0.07, z], [x, 0.5, z]]);
      for (let k = 0; k < 5; k++) d.push(...ring(c, 0.004, cy + R + 0.08 + k * 0.022, 6));
      // the pavilion at its foot, with its folded roof
      m.push(...ring(c, 0.05, 0, 20), ...ring(c, 0.05, 0.016, 20));
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        d.push([[x + 0.05 * Math.cos(a), 0.016, z + 0.05 * Math.sin(a)], [x + rAt(0.02) * Math.cos(a), 0.024, z + rAt(0.02) * Math.sin(a)]]);
      }
      return { m, d };
    },
  },
];


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
  // How the current selection was made. Only keyboard focus turns the Ring;
  // a pointer selection never moves its target out from under the cursor.
  const modeRef = useRef<'pointer' | 'focus' | null>(null);
  const pointerInRef = useRef(false);
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
    if (i >= 0) { snapRef.current = true; modeRef.current = 'focus'; activeRef.current = i; setActive(i); }
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
      return { c, geo: lm.build(c), stopD: seg[best], facing: Math.atan2(c[0], c[2]) };
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
    const ro = new ResizeObserver(() => { resize(); measure(); });
    ro.observe(canvas);

    // North at the back, turned a little so the Ring reads as an object.
    // A gentle sway around a good viewing angle instead of a full spin, so
    // landmarks never line up behind one another and the layout stays
    // familiar. Dragging moves the base; the sway continues around it.
    let baseYaw = -0.35, swayT = 0, yaw = baseYaw, pitch = 0.95, vYaw = 0;
    const SWAY = 0.42, SWAY_PERIOD = 38;
    let dragging = false, lastX = 0, lastY = 0, idleAt = 0;
    let trainD = 0, last = performance.now();

    // Camera above the plane looking down: far is higher on screen and smaller.
    const project = ([x, y, z]: V3) => {
      const cy = Math.cos(yaw), sy = Math.sin(yaw);
      const x1 = x * cy - z * sy, z1 = x * sy + z * cy;
      const cp = Math.cos(pitch), sp = Math.sin(pitch);
      const y2 = y * cp + z1 * sp, z2 = -y * sp + z1 * cp;
      const D = 3.2, f = Math.min(w, h) * 1.55;
      const s = f / (z2 + D);
      return { x: w / 2 + x1 * s, y: h * 0.45 - y2 * s, depth: z2, s };
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


    // ── Label placement, the way a cartographer would ──────────────────
    // Each frame: the chosen label first, then nearest-first. Each tries
    // its preferred side, then the others; if none fits without overlap it
    // fades out until there's room. A label keeps its last good side.
    type Side = 'above' | 'below' | 'right' | 'left';
    const sizes: [number, number][] = LANDMARKS.map(() => [80, 24]);
    const measure = () => {
      labelRefs.current.forEach((el, i) => { if (el) sizes[i] = [el.offsetWidth, el.offsetHeight]; });
    };
    measure();
    document.fonts?.ready.then(measure);
    const lastSide: (Side | null)[] = LANDMARKS.map(() => null);
    const hitBoxes: [number, number, number, number, number][] = LANDMARKS.map(() => [0, 0, 0, 0, 0]);
    // The landmark under a canvas point, nearest first; a few px of slack.
    const landmarkAt = (px: number, py: number) => {
      let best = -1, bestDepth = Infinity;
      hitBoxes.forEach(([x0, y0, x1, y1, d], i) => {
        if (px >= x0 - 6 && px <= x1 + 6 && py >= y0 - 6 && py <= y1 + 6 && d < bestDepth) { best = i; bestDepth = d; }
      });
      return best;
    };
    const shown: boolean[] = LANDMARKS.map(() => true);
    const placeLabels = (act: number | null) => {
      const items = marks.map((m, i) => {
        const top = project([m.c[0], LANDMARKS[i].lift, m.c[2]]);
        const base = project([m.c[0], 0, m.c[2]]);
        return { i, top, base, depth: base.depth };
      });
      // Chosen stop first, then industries nearest-first; the home stop yields.
      const rank = (k: number) => (k === act ? 0 : LANDMARKS[k].kind === 'home' ? 2 : 1);
      items.sort((a, b) => rank(a.i) - rank(b.i) || a.depth - b.depth);
      const placed: [number, number, number, number][] = [];
      const PAD = 4;
      const hits = (x: number, y: number, lw: number, lh: number) =>
        placed.some(([px, py, pw, ph]) => x < px + pw + PAD && x + lw + PAD > px && y < py + ph + PAD && y + lh + PAD > py);
      for (const it of items) {
        const { i, top, base } = it;
        const [lw, lh] = sizes[i];
        const half = 0.075 * top.s;
        const mid = (top.y + base.y) / 2;
        const at = (side: Side): [number, number] => {
          switch (side) {
            case 'above': return [top.x - lw / 2, top.y - lh - 4];
            case 'below': return [base.x - lw / 2, base.y + 8];
            case 'right': return [top.x + half, mid - lh / 2];
            default: return [top.x - half - lw, mid - lh / 2];
          }
        };
        const pref: Side[] = LANDMARKS[i].kind === 'home'
          ? ['above', 'right', 'below', 'left'] // stay clear of the Mitte cluster to its west
          : LANDMARKS[i].below ? ['below', 'above', 'right', 'left'] : ['above', 'below', 'right', 'left'];
        const tries = lastSide[i] ? [lastSide[i] as Side, ...pref.filter((p) => p !== lastSide[i])] : pref;
        // A label sitting on a different landmark's building implies the
        // wrong place, so the first pass avoids other buildings as well as
        // labels; the second pass relaxes that before giving up.
        const onOtherBuilding = (x: number, y: number) =>
          hitBoxes.some(([bx0, by0, bx1, by1], k) => k !== i && x < bx1 && x + lw > bx0 && y < by1 && y + lh > by0);
        let pos: [number, number] | null = null;
        for (const strict of [true, false]) {
          for (const side of tries) {
            const [x, y] = at(side);
            const inside = x >= 0 && x + lw <= w && y >= 0 && y + lh <= h;
            if (inside && !hits(x, y, lw, lh) && !(strict && onOtherBuilding(x, y))) { pos = [x, y]; lastSide[i] = side; break; }
          }
          if (pos) break;
        }
        if (!pos && i === act) pos = at(lastSide[i] ?? pref[0]);
        const el = labelRefs.current[i];
        if (!el) continue;
        if (pos) {
          placed.push([pos[0], pos[1], lw, lh]);
          el.style.transform = `translate(${pos[0]}px, ${pos[1]}px)`;
          el.style.opacity = String(i === act ? 1 : Math.max(0.6, alpha(it.depth)));
          el.style.pointerEvents = 'auto';
          shown[i] = true;
        } else if (shown[i]) {
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
          shown[i] = false;
        }
        el.style.zIndex = String(i === act ? 50 : Math.round(20 - it.depth * 10));
      }
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

      // While the pointer is over the object, it holds still so targets
      // stay where the visitor is aiming. Dragging still turns it.
      const hold = pointerInRef.current;

      if (moving && !hold && !dragging && now - idleAt > 1500 && act === null) swayT += dt;
      const swayOff = SWAY * Math.sin((swayT / SWAY_PERIOD) * Math.PI * 2);

      // Selections never turn the map: the layout stays where the visitor
      // learned it, and label placement already guarantees the chosen
      // label is shown. Only dragging moves the base angle.
      if (!dragging) {
        baseYaw += vYaw;
        vYaw *= 0.92;
      }
      yaw = baseYaw + swayOff;

      if (act !== null && LANDMARKS[act].kind !== 'home') {
        // Run the train to the chosen landmark and wait there.
        const td = angDiff((trainD / LOOP) * Math.PI * 2, (marks[act].stopD / LOOP) * Math.PI * 2) / (Math.PI * 2) * LOOP;
        if (instant) trainD = marks[act].stopD;
        else trainD += Math.sign(td) * Math.min(Math.abs(td), LOOP * dt * 0.45);
      } else if (moving) {
        trainD += (LOOP * dt) / 36;
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


        marks.forEach((m, i) => {
          const on = act === i;
          strokeSegs(m.geo.d, on ? ACCENT : INK, on ? 0.9 : 0.6, on ? 0.9 : 0.5);
          strokeSegs(m.geo.m, on ? ACCENT : INK, on ? 1.75 : 1.15, on ? 1.25 : 0.9);
          // Screen bounds of the building, so the building itself is a target.
          let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
          for (const sg of m.geo.m) for (const v of sg) {
            const p = project(v);
            if (p.x < x0) x0 = p.x; if (p.x > x1) x1 = p.x;
            if (p.y < y0) y0 = p.y; if (p.y > y1) y1 = p.y;
          }
          hitBoxes[i] = [x0, y0, x1, y1, project(m.c).depth];
        });
        placeLabels(act);

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

    let downX = 0, downY = 0;
    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top] as const;
    };
    const down = (e: PointerEvent) => {
      dragging = true; lastX = downX = e.clientX; lastY = downY = e.clientY; vYaw = 0;
      canvas.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) {
        // Hovering a building does what hovering its label does.
        const [px, py] = local(e);
        const i = landmarkAt(px, py);
        canvas.style.cursor = i >= 0 ? 'pointer' : '';
        if (i >= 0 && e.pointerType === 'mouse' && activeRef.current !== i) {
          modeRef.current = 'pointer';
          activeRef.current = i;
          setActive(i);
        }
        return;
      }
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      baseYaw += dx * 0.008; vYaw = dx * 0.008;
      pitch = Math.max(0.55, Math.min(1.35, pitch - dy * 0.005));
    };
    const up = (e: PointerEvent) => {
      dragging = false; idleAt = performance.now();
      // A press that barely moved is a click: open the building's case.
      if (Math.hypot(e.clientX - downX, e.clientY - downY) < 5) {
        const [px, py] = local(e);
        const i = landmarkAt(px, py);
        if (i >= 0) window.location.href = LANDMARKS[i].href;
      }
    };
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
    <figure
      className="hv-rb"
      // The pointer area spans the Ring and its legend, so the visitor can
      // travel down to the case link without dropping the selection.
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') pointerInRef.current = true; }}
      onPointerLeave={() => {
        pointerInRef.current = false;
        if (modeRef.current === 'pointer') { modeRef.current = null; setActive(null); }
      }}
    >
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
              className={`hv-rb-label${m.kind === 'home' ? ' hv-rb-label--home' : ''}${active === i ? ' is-active' : ''}`}
              onMouseEnter={() => { modeRef.current = 'pointer'; setActive(i); }}
              onFocus={() => {
                // Focus that follows a click is the pointer's, not the keyboard's.
                if (!pointerInRef.current) modeRef.current = 'focus';
                setActive(i);
              }}
              onBlur={() => {
                if (modeRef.current === 'focus') { modeRef.current = null; setActive((a) => (a === i ? null : a)); }
              }}
              aria-label={m.kind === 'home' ? `About me: ${m.place}. ${m.blurb}` : `${m.domain}: ${m.place}. ${m.blurb} Read the ${m.caseName} case study.`}
            >
              {m.kind === 'home' ? 'About' : m.domain}
            </a>
          ))}
        </nav>
      </div>
      <figcaption className="hv-rb-cap">
        {/* Stable live region; the keyed inner block restarts its fade. */}
        <div className="hv-rb-live" aria-live="polite">
          <div className="hv-rb-legend" key={active ?? 'idle'}>
            {lm ? (
              <>
                <p className="hv-rb-eyebrow">
                  <span className={`hv-rb-marker${lm.kind === 'home' ? ' hv-rb-marker--home' : ''}`} aria-hidden="true" />
                  {lm.domain}
                </p>
                <p className="hv-rb-place">{lm.place}</p>
                <p className="hv-rb-blurb">{lm.blurb}</p>
                {/* Pointer convenience: keyboard users already have the label link. */}
                <a className="hv-rb-go" href={lm.href} tabIndex={-1}>
                  <span className="hv-rb-go-text">{lm.kind === 'home' ? 'Read about me' : `Read the ${lm.caseName} case`}</span>
                  <span className="hv-rb-go-time">{lm.minutes} min</span>
                  <span className="hv-rb-go-arrow" aria-hidden="true">
                    <svg viewBox="0 0 16 16"><path d="M2.5 8h10M8.5 3.5 13 8l-4.5 4.5" /></svg>
                  </span>
                </a>
              </>
            ) : (
              <>
                <p className="hv-rb-eyebrow">
                  <span className="hv-rb-marker hv-rb-marker--idle" aria-hidden="true" />
                  Ringbahn · {LANDMARKS.filter((m) => m.kind !== 'home').length} industries
                </p>
                <p className="hv-rb-place">Pick an industry</p>
                <p className="hv-rb-blurb">Each stop is a place in Berlin tied to work I've done.</p>
              </>
            )}
          </div>
        </div>
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
