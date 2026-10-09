import { useEffect, useRef, useState } from 'react';
import './hero-variants.css';
import RingObject from './RingObject';
import DotField, { type Departure } from './DotField';
import { smoothScrollTo } from '../../lib/scroll';
import { ui } from '../../lib/ui';

type StatCard = {
  num: string;
  target: 'brightly' | 'epilog' | 'cal';
  ariaLabel: string;
  text: React.ReactNode;
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// MOCK: hero directions behind ?hero=a|e|f|g, for comparison only (B, C and D
// removed 2026-10-09; they're in git history).
type Variant = 'current' | 'a' | 'e' | 'f' | 'g';
const VARIANTS: { key: Variant; label: string }[] = [
  { key: 'current', label: 'Live' },
  { key: 'a', label: 'A · Refine' },
  { key: 'e', label: 'E · Ring' },
  { key: 'f', label: 'F · Map + work' },
  { key: 'g', label: 'G · Dot field' },
];

// Proof points matched to the 2026-10-08 resume screen pass: paid work only.
const PROOF = [
  { href: '/work/brightly/', fig: '$1.575B', label: 'Set the design direction for the Brightly acquisition', short: 'Brightly' },
  { href: '/work/pqdr/', fig: '200+', label: 'Industrial locations running operator tools I designed', short: 'PQDR' },
  { href: '/work/sim-racing/', fig: '2', label: 'Paid AI-agent engagements since 2025', short: 'Sim Racing' },
];
const KICKER = 'Scott Gerstl · Design leader · Berlin';

// F: positioning first, the work on the first screen, and a still map of
// Berlin as the one visual object. The map is a picture, not a control: the
// proof rows are the links, and hovering or focusing one lights its stop.
// Copy source: vault Projects/Dev/Portfolio Site/hero-f-copy-2026-10-09.md.
const F_H1 = 'I design enterprise software and the AI inside it.';
const F_QUALIFIERS = ['15 years', 'Berlin', 'US/German citizen, EU work-authorized'];
const F_CAPTION = "The industries I've designed for, pinned to Berlin places that do the same work.";
const F_MAP_DESC =
  "Map of Berlin marking six industries I've designed for: manufacturing at Siemensstadt (Brightly), energy at Kraftwerk Klingenberg (PQ + DR), logistics at Westhafen (Fleet), motorsports at the old AVUS circuit (Sim Racing Coach), healthcare at the Charité (Epilog), and cycling at the Velodrom (Cal).";

type FProof = { href: string; slug: string; stop: string; name: string; domains: string[]; fig: string; label: string; img: string; w: number; h: number };
const F_PROOF: FProof[] = [
  {
    href: '/work/brightly/', slug: 'brightly', stop: 'siemensstadt', name: 'Brightly',
    domains: ['Manufacturing', 'Healthcare', 'Education', 'Government'], fig: '$1.575B',
    label: 'Set the design direction for the Brightly acquisition',
    img: '/images/cases/brightly/brightly-dashboard.jpeg', w: 2001, h: 1125,
  },
  {
    href: '/work/pqdr/', slug: 'pqdr', stop: 'klingenberg', name: 'PQ + DR', domains: ['Energy'], fig: '200+',
    label: 'Industrial locations running operator tools I designed',
    img: '/images/cases/pqdr/pq-one-line.png', w: 1440, h: 1024,
  },
  {
    href: '/work/sim-racing/', slug: 'sim-racing', stop: 'avus', name: 'Sim Racing Coach', domains: ['Motorsports'], fig: '2',
    label: 'Paid AI-agent engagements since 2025',
    img: '/images/cases/sim-racing/prototype-web-idle.png', w: 3356, h: 1858,
  },
];

// G: the departure each tile puts on the board. Copy source: the vault
// draft (hero-f-copy-2026-10-09.md); every line comes from the case itself.
const G_DEPARTURES: Record<string, Departure> = {
  brightly: { line: 'CS1', name: 'Brightly', minutes: 6, from: '12 siloed products', to: 'One platform vision' },
  pqdr: { line: 'CS1', name: 'PQ + DR', minutes: 5, from: 'AI insight', to: 'Operator decision' },
  'sim-racing': { line: 'CS1', name: 'Sim Racing', minutes: 6, from: 'Data and a chat window', to: 'A race engineer' },
};
const gDescription = (slug: string) => {
  const d = G_DEPARTURES[slug];
  return d ? `From ${d.from.toLowerCase()} to ${d.to.toLowerCase()}. ${d.minutes} minute read.` : '';
};

// Flat projection of the Ring mock's coordinates (same ±100–300 m caveat:
// replace with OSM or VBB geometry before shipping). Projected into 600 × 381,
// shown cropped to y 18–350 where the drawing actually sits.
const F_RING = 'M84.2 214.3 L101.1 230.6 L123.6 258.9 L149.1 291.1 L186 298.4 L217.3 296.6 L235.6 292.6 L267.8 307.1 L312.4 325.6 L414.7 336.5 L439.1 329.9 L467.6 315.8 L481.3 241.1 L498.4 206.3 L511.6 167.9 L488.4 131.2 L467.8 112 L429.8 71.8 L404.7 55.8 L375.8 38.8 L318.7 41.3 L270.2 62.7 L219.3 85.9 L186.7 93.2 L121.3 107 L88.7 152.3 L85.3 190 Z';
const F_STADTBAHN = 'M84.2 214.3 L132.9 199 L194.2 193.6 L232.7 181.6 L276.4 142.1 L315.3 143.9 L369.6 139.9 L384.4 163.2 L421.6 180.9 L498.4 206.3';
const F_SPREE = 'M545.6 252 L490 226.6 L446 210.7 L410.2 186 L384.4 163.2 L354.4 155.2 L327.8 143.2 L295.1 146.8 L267.8 137.8 L234.4 133.1 L190 146.5 L145.6 146.8 L101.1 124 L56.7 92.5';
const F_HOME = { x: 365.3, y: 142.1, r: 20 };

type FLabel = 'right' | 'left' | 'above' | 'aboveLeft' | 'below';
const F_STOPS: { id: string; name: string; domain: string; x: number; y: number; label: FLabel }[] = [
  { id: 'siemensstadt', name: 'Brightly', domain: 'Manufacturing', x: 56, y: 77.2, label: 'right' },
  { id: 'westhafen', name: 'Fleet', domain: 'Logistics', x: 214.4, y: 74.3, label: 'above' },
  { id: 'charite', name: 'Epilog', domain: 'Healthcare', x: 294.4, y: 121.5, label: 'above' },
  { id: 'velodrom', name: 'Cal', domain: 'Cycling', x: 455.6, y: 108.8, label: 'left' },
  { id: 'klingenberg', name: 'PQ + DR', domain: 'Energy', x: 557.8, y: 235.7, label: 'aboveLeft' },
  { id: 'avus', name: 'Sim Racing', domain: 'Motorsports', x: 43.3, y: 270.1, label: 'below' },
];

// Name and domain positions for each label side, in viewBox units.
function fLabelAt(x: number, y: number, side: FLabel): { x: number; y: number; anchor: 'start' | 'middle' | 'end' } {
  switch (side) {
    case 'right': return { x: x + 16, y: y - 9, anchor: 'start' };
    case 'left': return { x: x - 16, y: y - 9, anchor: 'end' };
    case 'above': return { x, y: y - 40, anchor: 'middle' };
    case 'aboveLeft': return { x: x + 14, y: y - 44, anchor: 'end' };
    case 'below': return { x: x + 6, y: y + 26, anchor: 'middle' };
  }
}

function BerlinMap({ active }: { active: string | null }) {
  return (
    <figure className="hvf-map">
      <svg viewBox="0 18 600 332" role="img" aria-label={F_MAP_DESC}>
        <defs>
          <clipPath id="hvf-face">
            <circle cx={F_HOME.x} cy={F_HOME.y} r={F_HOME.r - 3} />
          </clipPath>
        </defs>
        <path className="hvf-spree" d={F_SPREE} />
        <path className="hvf-ring" d={F_RING} />
        <path className="hvf-stadtbahn" d={F_STADTBAHN} />
        {F_STOPS.map((st) => {
          const l = fLabelAt(st.x, st.y, st.label);
          return (
            <g key={st.id} className={`hvf-stop${active === st.id ? ' is-active' : ''}`}>
              <circle className="hvf-halo" cx={st.x} cy={st.y} r={20} />
              <circle className="hvf-dot" cx={st.x} cy={st.y} r={7} />
              <text className="hvf-name" x={l.x} y={l.y} textAnchor={l.anchor}>{st.name}</text>
              <text className="hvf-domain" x={l.x} y={l.y + 20} textAnchor={l.anchor}>{st.domain}</text>
            </g>
          );
        })}
        <circle className="hvf-home" cx={F_HOME.x} cy={F_HOME.y} r={F_HOME.r} />
        <image
          href="/images/scott-headshot.png"
          x={F_HOME.x - F_HOME.r + 3}
          y={F_HOME.y - F_HOME.r + 3}
          width={(F_HOME.r - 3) * 2}
          height={(F_HOME.r - 3) * 2}
          clipPath="url(#hvf-face)"
        />
      </svg>
      <figcaption className="hvf-caption">{F_CAPTION}</figcaption>
    </figure>
  );
}

// Brightly stat 01 highlights the dollar figure in bold. Split the string on
// the figure and re-wrap. Falls back to plain text if the figure is missing.
function renderBrightlyText(text: string): React.ReactNode {
  const figure = '$1.575B';
  const idx = text.indexOf(figure);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <strong>{figure}</strong>
      {text.slice(idx + figure.length)}
    </>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const preludeRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLLIElement[]>([]);
  const [variant, setVariant] = useState<Variant>('current');
  const [fActive, setFActive] = useState<string | null>(null);
  // MOCK: which hover indicator G's tiles use, ?hover=wash|rule|frame.
  const [gHover, setGHover] = useState<'wash' | 'rule' | 'frame'>('wash');
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get('hero');
    if (v === 'a' || v === 'e' || v === 'f' || v === 'g') setVariant(v);
    const h = new URLSearchParams(window.location.search).get('hover');
    if (h === 'rule' || h === 'frame') setGHover(h);
  }, []);

  const STAT_CARDS: StatCard[] = [
    {
      num: '01',
      target: 'brightly',
      ariaLabel: ui('hero.ariaBrightly'),
      text: renderBrightlyText(ui('hero.statBrightly')),
    },
    {
      num: '02',
      target: 'epilog',
      ariaLabel: ui('hero.ariaEpilog'),
      text: ui('hero.statEpilog'),
    },
    {
      num: '03',
      target: 'cal',
      ariaLabel: ui('hero.ariaCal'),
      text: ui('hero.statCal'),
    },
  ];

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const heroEl = heroRef.current;
    if (!heroEl) return;
    // Query the DOM rather than refs so every variant gets the same scroll-out.
    const preludeEl = heroEl.querySelector<HTMLElement>('.hero-prelude');
    const cardsEls = Array.from(heroEl.querySelectorAll<HTMLLIElement>('.hero-cards > .hero-card'));
    window.dispatchEvent(new Event('spine:redraw'));
    // Web fonts shift the text after first paint; redraw the rings once
    // they've loaded so each ring lands on its station.
    document.fonts?.ready.then(() =>
      requestAnimationFrame(() => window.dispatchEvent(new Event('spine:redraw'))),
    );

    const getExitDistance = () =>
      window.innerHeight * (window.innerWidth < 768 ? 0.7 : 1.2);

    const applyHeroProgress = (progress: number) => {
      if (reducedMotion) {
        cardsEls.forEach((card) => {
          card.style.opacity = String(1 - progress);
        });
        if (preludeEl) preludeEl.style.opacity = String(1 - progress);
        return;
      }
      if (preludeEl) {
        const cp = clamp01(progress / 0.40);
        const eased = cp * cp * (3 - 2 * cp);
        const slideDistance = window.innerWidth * 1.2;
        preludeEl.style.setProperty('--slide-x', `${eased * slideDistance}px`);
        preludeEl.style.opacity = String(1 - cp * 0.4);
      }
      cardsEls.forEach((card, i) => {
        const start = i * 0.06;
        const span = 0.45;
        const cp = clamp01((progress - start) / span);
        const slideDistance = window.innerWidth * 1.2;
        const eased = cp * cp * (3 - 2 * cp);
        card.style.setProperty('--slide-x', `${eased * slideDistance}px`);
        card.style.opacity = String(1 - cp * 0.25);
      });
    };

    const hideHero = () => {
      heroEl.style.opacity = '0';
    };
    const showHero = () => {
      heroEl.style.opacity = '1';
    };

    const updateHero = () => {
      const y = window.scrollY;
      // F has no slide-out: the whole hero fades before the first case
      // scrolls under it, and hides once gone so its links leave the tab
      // order and stop catching clicks meant for the page beneath.
      if (variant === 'g') return;
      if (variant === 'f') {
        const op = 1 - clamp01(y / (window.innerHeight * 0.55));
        heroEl.style.opacity = String(op);
        heroEl.style.visibility = op < 0.02 ? 'hidden' : 'visible';
        return;
      }
      const exitDistance = getExitDistance();
      if (y <= exitDistance) {
        showHero();
        applyHeroProgress(clamp01(y / exitDistance));
      } else {
        hideHero();
      }
    };

    updateHero();

    // G scrolls with the page: tell the case list how tall the hero is so it
    // starts right after it, and redraw the rail when that changes.
    let heroRo: ResizeObserver | undefined;
    const page = heroEl.closest<HTMLElement>('.page');
    if (variant === 'g' && page) {
      const setHeight = () => {
        page.style.setProperty('--hero-h', `${heroEl.offsetHeight}px`);
        window.dispatchEvent(new Event('spine:redraw'));
      };
      setHeight();
      document.fonts?.ready.then(setHeight);
      heroRo = new ResizeObserver(setHeight);
      heroRo.observe(heroEl);
    }

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateHero();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let resizeTimeout: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateHero, 100);
    };
    window.addEventListener('resize', onResize);

    const jumpToCase = (target: string) => {
      // Accordion listens for this and handles open-or-scroll. If no card
      // matches, fall back to anchoring at the cases section.
      window.dispatchEvent(new CustomEvent('case:open', { detail: { slug: target } }));
      if (!document.getElementById(`case-${target}`)) {
        const cases = document.getElementById('cases');
        if (cases) {
          const rect = cases.getBoundingClientRect();
          smoothScrollTo(window.scrollY + rect.top - 80);
        }
      }
    };

    const onCardClick = (target: string) => () => jumpToCase(target);
    const keydownHandlers: Array<[HTMLLIElement, (e: KeyboardEvent) => void]> = [];
    const clickHandlers: Array<[HTMLLIElement, () => void]> = [];

    cardsEls.forEach((card) => {
      const target = card.dataset.target;
      if (!target) return;
      const click = onCardClick(target);
      const key = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          jumpToCase(target);
        }
      };
      card.addEventListener('click', click);
      card.addEventListener('keydown', key);
      clickHandlers.push([card, click]);
      keydownHandlers.push([card, key]);
    });

    return () => {
      heroRo?.disconnect();
      page?.style.removeProperty('--hero-h');
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      clickHandlers.forEach(([card, fn]) => card.removeEventListener('click', fn));
      keydownHandlers.forEach(([card, fn]) => card.removeEventListener('keydown', fn));
    };
  }, [variant]);

  const switcher = (
    <nav className="hv-switch" aria-label="Mock: hero direction">
      <span className="hv-switch-tag">Mock</span>
      {VARIANTS.map((v) => (
        <a
          key={v.key}
          href={v.key === 'current' ? '/' : `/?hero=${v.key}`}
          aria-current={variant === v.key ? 'page' : undefined}
        >
          {v.label}
        </a>
      ))}
    </nav>
  );

  const header = (
    <div className="hero-prelude hv-head">
      <p className="hv-kicker">{KICKER}</p>
      <h1 className="hv-h1">{ui('hero.propPrimary')}</h1>
      <p className="hv-lead">{ui('hero.propSecondary')}</p>
    </div>
  );
  const qualifiers = <p className="hv-meta">{ui('hero.qualifiers')}</p>;

  if (variant === 'f' || variant === 'g') {
    const g = variant === 'g';
    // Moving between tiles crosses a 32px gap; a short delay before going
    // back to the map stops the picture flickering through it.
    const enter = (key: string) => {
      clearTimeout(leaveTimer.current);
      setFActive(key);
    };
    const clear = () => {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = setTimeout(() => setFActive(null), 180);
    };
    return (
      <>
        <section className={`hero hv hv--f${g ? ` hv--g hv--hover-${gHover}` : ''}`} aria-label={ui('hero.ariaIntro')} ref={heroRef}>
          <div className="hvf-top">
            <div className="hvf-text">
              <h1 className="hvf-h1">{F_H1}</h1>
              <p className="hvf-lead">{ui('hero.propSecondary')}</p>
              <p className="hvf-meta">
                <img className="hvf-face" src="/images/scott-headshot.png" alt="" width={28} height={28} />
                {F_QUALIFIERS.map((q, i) => (
                  <span key={q}>
                    {i > 0 && <span className="hvf-sep" aria-hidden="true">·</span>}
                    {q}
                  </span>
                ))}
              </p>
            </div>
            {g ? <DotField active={fActive} departures={G_DEPARTURES} /> : <BerlinMap active={fActive} />}
          </div>
          <ul className="hvf-work" aria-label="Selected work">
            {F_PROOF.map((p) => {
              const key = g ? p.slug : p.stop;
              return (
              <li key={p.href}>
                <a
                  href={p.href}
                  aria-describedby={g ? `hvg-desc-${p.slug}` : undefined}
                  onMouseEnter={() => enter(key)}
                  onMouseLeave={clear}
                  onFocus={() => enter(key)}
                  onBlur={clear}
                >
                  <span className="hvf-shot">
                    <img src={p.img} alt="" width={p.w} height={p.h} decoding="async" />
                  </span>
                  <span className="hvf-kicker">{p.name}</span>
                  <span className="hvf-fig">{p.fig}</span>
                  <span className="hvf-label">{p.label}</span>
                  <span className="hvf-domains">{p.domains.join(' · ')}</span>
                </a>
                {g && <span id={`hvg-desc-${p.slug}`} className="sr-only">{gDescription(p.slug)}</span>}
              </li>
              );
            })}
          </ul>
        </section>
        {switcher}
      </>
    );
  }

  if (variant === 'a') {
    return (
      <>
        <section className="hero hv hv--a" aria-label={ui('hero.ariaIntro')} ref={heroRef}>
          {header}
          <ul className="hero-cards hv-stations">
            {PROOF.map((p) => (
              <li key={p.href} className="hero-card hv-station">
                <a href={p.href}>
                  <span className="hv-fig">{p.fig}</span>
                  <span className="hv-label">{p.label}</span>
                </a>
              </li>
            ))}
          </ul>
          {qualifiers}
        </section>
        {switcher}
      </>
    );
  }

  if (variant === 'e') {
    return (
      <>
        <section className="hero hv hv--d hv--e" aria-label={ui('hero.ariaIntro')} ref={heroRef}>
          <div className="hv-d-grid">
            <div className="hv-d-text">
              <div className="hero-prelude hv-head">
                <p className="hv-kicker">
                  <img className="hv-d-face" src="/images/scott-headshot.png" alt="" />
                  {KICKER}
                </p>
                <h1 className="hv-h1">{ui('hero.propPrimary')}</h1>
                <p className="hv-lead">{ui('hero.propSecondary')}</p>
              </div>
              <ul className="hero-cards hv-stations">
                {PROOF.map((p) => (
                  <li key={p.href} className="hero-card hv-station">
                    <a href={p.href}>
                      <span className="hv-fig">{p.fig}</span>
                      <span className="hv-label">{p.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
              {qualifiers}
            </div>
            <RingObject />
          </div>
        </section>
        {switcher}
      </>
    );
  }

  return (
    <>
    <section className="hero" aria-label={ui('hero.ariaIntro')} ref={heroRef}>
      <div className="hero-prelude" ref={preludeRef}>
        <p className="hero-prelude-line">
          {ui('hero.prelude')}
        </p>
        <p className="hero-qualifiers">
          {ui('hero.qualifiers')}
        </p>
      </div>
      <ul className="hero-cards">
        {STAT_CARDS.map((card, i) => (
          <li
            key={card.target}
            className="hero-card hero-card--stat"
            data-target={card.target}
            role="button"
            tabIndex={0}
            aria-label={card.ariaLabel}
            ref={(el) => {
              if (el) cardsRef.current[i] = el;
            }}
          >
            <span className="stat-num">{card.num}</span>
            <span className="stat-text">{card.text}</span>
          </li>
        ))}
        <li
          className="hero-card hero-card--proposition"
          ref={(el) => {
            if (el) cardsRef.current[STAT_CARDS.length] = el;
          }}
        >
          <span className="prop-label">{ui('hero.propLabel')}</span>
          <p className="prop-primary">
            {ui('hero.propPrimary')}
          </p>
          <p className="prop-secondary">
            {ui('hero.propSecondary')}
          </p>
        </li>
      </ul>
    </section>
    {switcher}
    </>
  );
}
