import { useEffect, useRef, useState } from 'react';
import './hero-variants.css';
import RingObject from './RingObject';
import { smoothScrollTo } from '../../lib/scroll';
import { ui } from '../../lib/ui';

type StatCard = {
  num: string;
  target: 'brightly' | 'epilog' | 'cal';
  ariaLabel: string;
  text: React.ReactNode;
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// MOCK: three hero directions behind ?hero=a|b|c, for comparison only.
type Variant = 'current' | 'a' | 'b' | 'c' | 'd' | 'e';
const VARIANTS: { key: Variant; label: string }[] = [
  { key: 'current', label: 'Live' },
  { key: 'a', label: 'A · Refine' },
  { key: 'b', label: 'B · Route strip' },
  { key: 'c', label: 'C · Station sign' },
  { key: 'd', label: 'D · Lit map' },
  { key: 'e', label: 'E · Ring' },
];

// Proof points matched to the 2026-10-08 resume screen pass: paid work only.
const PROOF = [
  { href: '/work/brightly', fig: '$1.575B', label: 'Set the design direction for the Brightly acquisition', short: 'Brightly' },
  { href: '/work/pqdr', fig: '200+', label: 'Industrial locations running operator tools I designed', short: 'PQDR' },
  { href: '/work/sim-racing', fig: '2', label: 'Paid AI-agent engagements since 2025', short: 'Sim Racing' },
];
const KICKER = 'Scott Gerstl · Design leader · Berlin';

// D: an excerpt of the network, drawn in the wallpaper map's language. Both
// lines leave from the headshot; each station is a case on its real domain.
// Coordinates are in a 540 × 560 viewBox.
type Stop = { href: string; name: string; domain: string; x: number; y: number; side: 'right' | 'above' };
const NET_ORIGIN = { x: 84, y: 84, r: 44 };
const NET_LINES: { key: 'cs1' | 'cs2'; d: string; stops: Stop[] }[] = [
  {
    key: 'cs1',
    d: 'M128 84 H300 L380 164 V500',
    stops: [
      { href: '/work/brightly', name: 'Brightly', domain: 'Manufacturing', x: 222, y: 84, side: 'above' },
      { href: '/work/pqdr', name: 'PQ + DR', domain: 'Energy', x: 380, y: 236, side: 'right' },
      { href: '/work/fleet', name: 'Fleet', domain: 'Logistics', x: 380, y: 336, side: 'right' },
      { href: '/work/sim-racing', name: 'Sim Racing', domain: 'Motorsports', x: 380, y: 436, side: 'right' },
    ],
  },
  {
    key: 'cs2',
    d: 'M115 115 L170 170 V500',
    stops: [
      { href: '/work/epilog', name: 'Epilog', domain: 'Healthcare', x: 170, y: 252, side: 'right' },
      { href: '/work/ziggy', name: 'Ziggy', domain: 'Everyday', x: 170, y: 352, side: 'right' },
      { href: '/work/cal', name: 'Cal', domain: 'Cycling', x: 170, y: 452, side: 'right' },
    ],
  },
];

function NetworkExcerpt() {
  return (
    <svg className="hv-net" viewBox="0 0 540 560" role="group" aria-label="Case studies by line and domain">
      <defs>
        <clipPath id="hv-net-face">
          <circle cx={NET_ORIGIN.x} cy={NET_ORIGIN.y} r={NET_ORIGIN.r - 4} />
        </clipPath>
      </defs>
      {NET_LINES.map((line) => (
        <g key={line.key} className={`hv-net-line hv-net-line--${line.key}`}>
          <path className="hv-net-track" d={line.d} pathLength={1} />
          <rect className="hv-net-term" x={line.key === 'cs1' ? 372 : 162} y={496} width={16} height={8} rx={4} />
        </g>
      ))}
      {NET_LINES.flatMap((line) =>
        line.stops.map((st, i) => (
          <a
            key={st.href}
            href={st.href}
            className="hv-net-stop"
            style={{ ['--i' as string]: i }}
            aria-label={`${st.name}, ${st.domain}`}
          >
            <rect className="hv-net-hit" x={st.x - 18} y={st.side === 'above' ? st.y - 58 : st.y - 22} width={st.side === 'above' ? 110 : 160} height={st.side === 'above' ? 80 : 44} />
            <circle className="hv-net-ring" cx={st.x} cy={st.y} r={8} />
            {st.side === 'right' ? (
              <>
                <text className="hv-net-name" x={st.x + 22} y={st.y + 1}>{st.name}</text>
                <text className="hv-net-domain" x={st.x + 22} y={st.y + 19}>{st.domain}</text>
              </>
            ) : (
              <>
                <text className="hv-net-domain" x={st.x} y={st.y - 40} textAnchor="middle">{st.domain}</text>
                <text className="hv-net-name" x={st.x} y={st.y - 20} textAnchor="middle">{st.name}</text>
              </>
            )}
          </a>
        )),
      )}
      <g className="hv-net-origin">
        <circle cx={NET_ORIGIN.x} cy={NET_ORIGIN.y} r={NET_ORIGIN.r} className="hv-net-origin-ring" />
        <image
          href="/images/scott-headshot.png"
          x={NET_ORIGIN.x - NET_ORIGIN.r + 4}
          y={NET_ORIGIN.y - NET_ORIGIN.r + 4}
          width={(NET_ORIGIN.r - 4) * 2}
          height={(NET_ORIGIN.r - 4) * 2}
          clipPath="url(#hv-net-face)"
          aria-hidden="true"
        />
        <text className="hv-net-domain" x={NET_ORIGIN.x} y={NET_ORIGIN.y + NET_ORIGIN.r + 22} textAnchor="middle">Berlin</text>
      </g>
      <g className="hv-net-legend" aria-hidden="true">
        <rect x={250} y={520} width={34} height={18} rx={9} className="hv-net-pill hv-net-pill--cs1" />
        <text x={267} y={533} textAnchor="middle" className="hv-net-pilltext">CS1</text>
        <text x={292} y={533} className="hv-net-domain">Professional</text>
        <rect x={380} y={520} width={34} height={18} rx={9} className="hv-net-pill hv-net-pill--cs2" />
        <text x={397} y={533} textAnchor="middle" className="hv-net-pilltext">CS2</text>
        <text x={422} y={533} className="hv-net-domain">Independent</text>
      </g>
    </svg>
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

  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get('hero');
    if (v === 'a' || v === 'b' || v === 'c' || v === 'd' || v === 'e') setVariant(v);
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
      const exitDistance = getExitDistance();
      if (y <= exitDistance) {
        showHero();
        applyHeroProgress(clamp01(y / exitDistance));
      } else {
        hideHero();
      }
    };

    updateHero();

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

  if (variant === 'b') {
    return (
      <>
        <section className="hero hv hv--b" aria-label={ui('hero.ariaIntro')} ref={heroRef}>
          {header}
          <ul className="hero-cards hv-routewrap">
            <li className="hero-card hv-route">
              <ol className="hv-stops">
                {PROOF.map((p) => (
                  <li key={p.href} className="hv-stop">
                    <a href={p.href}>
                      <span className="hv-fig">{p.fig}</span>
                      <span className="hv-ring" aria-hidden="true"></span>
                      <span className="hv-label">{p.label}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </li>
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

  if (variant === 'd') {
    return (
      <>
        <section className="hero hv hv--d" aria-label={ui('hero.ariaIntro')} ref={heroRef}>
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
            <NetworkExcerpt />
          </div>
        </section>
        {switcher}
      </>
    );
  }

  if (variant === 'c') {
    // Modelled on a Berlin S-Bahn platform sign: station name on a dark
    // panel, then connection bands packed to the right edge. Each band reads
    // destination, pictograms, line badge, arrow tile.
    const rows: {
      href: string;
      name: string;
      detail: string;
      tiles?: ('ai' | 'doc')[];
      line?: 'cs1' | 'cs2';
      dir: 'right' | 'down';
    }[] = [
      { href: '/work/brightly', name: 'Brightly', detail: 'Design direction for a $1.575B acquisition', line: 'cs1', dir: 'right' },
      { href: '/work/pqdr', name: 'Power Quality', detail: 'Operator tools at 200+ industrial locations', tiles: ['ai'], line: 'cs1', dir: 'right' },
      { href: '/work/sim-racing', name: 'Sim Racing Coach', detail: 'Two paid AI-agent engagements', tiles: ['ai'], line: 'cs1', dir: 'right' },
      { href: '#section-ent', name: 'Independent builds', detail: 'Epilog, Ziggy, Cal', line: 'cs2', dir: 'down' },
      { href: '/resume', name: 'Resume', detail: 'Two pages, PDF', tiles: ['doc'], dir: 'right' },
    ];
    return (
      <>
        <section className="hero hv hv--c" aria-label={ui('hero.ariaIntro')} ref={heroRef}>
          <ul className="hero-cards hv-signwrap">
            <li className="hero-card hv-sign">
              <div className="hv-sign-name">
                <p className="hv-sign-sub">{KICKER}</p>
                <h1 className="hv-h1">{ui('hero.propPrimary')}</h1>
              </div>
              <nav aria-label="Connections">
                <ul className="hv-sign-rows">
                  {rows.map((r) => (
                    <li key={r.href}>
                      <a href={r.href} className="hv-sign-row">
                        <span className="hv-sign-dest">
                          <span className="hv-sign-destname">{r.name}</span>
                          <span className="hv-sign-detail">{r.detail}</span>
                        </span>
                        <span className="hv-sign-marks" aria-hidden="true">
                          {r.tiles?.map((t) =>
                            t === 'ai' ? (
                              <span key={t} className="hv-tile hv-tile--text">AI</span>
                            ) : (
                              <span key={t} className="hv-tile">
                                <svg viewBox="0 0 16 16"><path d="M4 1.5h5.5L12.5 4.5V14.5H4Z M9.5 1.5V4.5H12.5 M6 8h4.5 M6 10.5h4.5" /></svg>
                              </span>
                            ),
                          )}
                          {r.line && (
                            <span className={`hv-badge hv-badge--${r.line}`}>{r.line.toUpperCase()}</span>
                          )}
                          <span className="hv-tile hv-tile--arrow">
                            <svg viewBox="0 0 16 16">
                              {r.dir === 'right' ? (
                                <path d="M2.5 8h10 M8.5 3.5 13 8l-4.5 4.5" />
                              ) : (
                                <path d="M8 2.5v10 M3.5 8.5 8 13l4.5-4.5" />
                              )}
                            </svg>
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </li>
            <li className="hero-card hv-under">
              <p className="hv-lead">{ui('hero.propSecondary')}</p>
              {qualifiers}
            </li>
          </ul>
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
