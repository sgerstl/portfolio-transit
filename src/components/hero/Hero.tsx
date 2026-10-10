import { useEffect, useRef, useState } from 'react';
import './hero.css';
import DotField, { type Departure, type Idle } from './DotField';
import { ui } from '../../lib/ui';

// Positioning first, then the work on the first screen, with the departure
// board as the one visual object. The board is a picture, not a control: the
// tiles are the links, and hovering or focusing one puts its departure up.
// Copy source: vault Projects/Dev/Portfolio Site/hero-f-copy-2026-10-09.md.
const H1 = 'I design software for the people who keep things running, and the AI inside it.';
// The headline names the work; the lead and the qualifier line carry the
// leadership and the product thinking (chosen 2026-10-09; drafts in the vault
// copy file).
const LEAD = "My thinking starts with the outcome and who it's for, returning measurable outcomes and effective solutions.";
const QUALIFIERS = ['15 years', 'Led design across 12 products', 'US/German citizen, EU work-authorized'];

type Proof = { href: string; slug: string; name: string; domains: string[]; img: string; w: number; h: number };
// Each tile's figure comes from the case data (body.heroMetric), passed in by HomePage, so the phone's station cards
// and these tiles share one source.
export type HeroFigures = Record<string, { num: string; label: string }>;
const PROOF: Proof[] = [
  {
    href: '/work/brightly/', slug: 'brightly', name: 'Brightly',
    domains: ['Manufacturing', 'Healthcare', 'Education', 'Government'],
    img: '/images/cases/brightly/brightly-dashboard.jpeg', w: 2001, h: 1125,
  },
  {
    href: '/work/pqdr/', slug: 'pqdr', name: 'PQ + DR', domains: ['Energy'],
    img: '/images/cases/pqdr/pq-one-line.png', w: 1440, h: 1024,
  },
  {
    href: '/work/sim-racing/', slug: 'sim-racing', name: 'Sim Racing Coach', domains: ['Motorsports'],
    img: '/images/cases/sim-racing/prototype-web-idle.webp', w: 2000, h: 1107,
  },
];

// The departure each tile puts on the board. Copy source: the vault
// draft (hero-f-copy-2026-10-09.md); every line comes from the case itself.
const DEPARTURES: Record<string, Departure> = {
  brightly: { line: 'CS1', name: 'Brightly', minutes: 6, from: '12 siloed products', to: 'One platform vision' },
  pqdr: { line: 'CS1', name: 'PQ + DR', minutes: 5, from: 'AI insight', to: 'Operator decision' },
  'sim-racing': { line: 'CS1', name: 'Sim Racing', minutes: 7, from: 'Data and a chat window', to: 'A race engineer' },
};
// The domains that scroll up the board's left side at rest: the tiles' own
// list, once each, so the board never says anything the page doesn't.
const DOMAINS = [...new Set(PROOF.flatMap((p) => p.domains))];
const describe = (slug: string) => {
  const d = DEPARTURES[slug];
  return d ? `From ${d.from.toLowerCase()} to ${d.to.toLowerCase()}. ${d.minutes} minute read.` : '';
};

export default function Hero({ figures }: { figures: HeroFigures }) {
  const heroRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState<string | null>(null);
  // What the board shows at rest: the portrait, or ?idle=ring for the
  // turning Ring.
  const [idle, setIdle] = useState<Idle>('face');
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('idle') === 'ring') setIdle('ring');
  }, []);

  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;
    window.dispatchEvent(new Event('spine:redraw'));

    // The hero scrolls with the page: tell the case list how tall it is so
    // the cases start right after it, and redraw the rail when that changes.
    // Web fonts shift the text after first paint, so measure again then.
    const page = heroEl.closest<HTMLElement>('.page');
    if (!page) return;
    const setHeight = () => {
      page.style.setProperty('--hero-h', `${heroEl.offsetHeight}px`);
      window.dispatchEvent(new Event('spine:redraw'));
    };
    setHeight();
    document.fonts?.ready.then(setHeight);
    const ro = new ResizeObserver(setHeight);
    ro.observe(heroEl);
    return () => {
      ro.disconnect();
      page.style.removeProperty('--hero-h');
    };
  }, []);

  // Slide-over (Scott, 2026-10-09): the headline and board scroll at 0.7x and
  // fade while the work tiles slide over them at full speed. Only at 1200px
  // and up, only while the hero fits the window (zoomed or short screens would
  // otherwise lose the hero's lower part under the tiles), and never under
  // reduced motion. The fade is done by 320px, so the rail's end station,
  // which stays put, is never far from the headline it ends beside.
  useEffect(() => {
    const heroEl = heroRef.current;
    const top = heroEl?.querySelector<HTMLElement>('.hvf-top');
    if (!heroEl || !top) return;
    const RATE = 0.3; // how far behind the page the top falls: 0.3 means it moves at 0.7x
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;
    const on = () => window.innerWidth >= 1200 && heroEl.offsetHeight <= window.innerHeight && !reduced.matches;
    const apply = () => {
      raf = 0;
      if (!on()) {
        heroEl.classList.remove('hv--parallax');
        top.style.transform = '';
        top.style.opacity = '';
        return;
      }
      heroEl.classList.add('hv--parallax');
      const y = Math.max(0, window.scrollY);
      const lag = Math.min(y, heroEl.offsetHeight) * RATE;
      top.style.transform = `translate3d(0, ${lag.toFixed(1)}px, 0)`;
      // Fades out as the tiles reach it, so nothing shows through the gaps between them
      top.style.opacity = String(Math.max(0, 1 - Math.max(0, y - 60) / 260));
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    reduced.addEventListener('change', queue);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
      reduced.removeEventListener('change', queue);
      heroEl.classList.remove('hv--parallax');
      top.style.transform = '';
      top.style.opacity = '';
    };
  }, []);

  // Moving between tiles crosses a 32px gap; a short delay before going
  // back to the resting picture stops the board flickering through it.
  const enter = (key: string) => {
    clearTimeout(leaveTimer.current);
    setActive(key);
  };
  const clear = () => {
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setActive(null), 180);
  };

  return (
    <section className="hero hv hv--f hv--g" aria-label={ui('hero.ariaIntro')} ref={heroRef}>
      <div className="hvf-top">
        <div className="hvf-text">
          <h1 className="hvf-h1">{H1}</h1>
          <p className="hvf-lead">{LEAD}</p>
          <p className="hvf-meta">
            <img className="hvf-face" src="/images/scott-headshot.png" alt="" width={28} height={28} />
            {QUALIFIERS.map((q, i) => (
              <span key={q}>
                {i > 0 && <span className="hvf-sep" aria-hidden="true">·</span>}
                {q}
              </span>
            ))}
          </p>
        </div>
        <DotField active={active} departures={DEPARTURES} domains={DOMAINS} idle={idle} />
      </div>
      <ul className="hvf-work" aria-label="Selected work">
        {PROOF.map((p) => (
          <li key={p.href}>
            <a
              href={p.href}
              data-wash
              aria-describedby={`hvg-desc-${p.slug}`}
              onMouseEnter={() => enter(p.slug)}
              onMouseLeave={clear}
              onFocus={() => enter(p.slug)}
              onBlur={clear}
            >
              <span className="hvf-shot">
                <img src={p.img} alt="" width={p.w} height={p.h} decoding="async" />
              </span>
              <span className="hvf-kicker">{p.name}</span>
              <span className="hvf-fig">{figures[p.slug]?.num}</span>
              <span className="hvf-label">{figures[p.slug]?.label}</span>
              <span className="hvf-domains">{p.domains.join(' · ')}</span>
            </a>
            <span id={`hvg-desc-${p.slug}`} className="sr-only">{describe(p.slug)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
