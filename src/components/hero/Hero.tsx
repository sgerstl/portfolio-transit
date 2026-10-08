import { useEffect, useRef, useState } from 'react';
import './hero-variants.css';
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
type Variant = 'current' | 'a' | 'b' | 'c';
const VARIANTS: { key: Variant; label: string }[] = [
  { key: 'current', label: 'Live' },
  { key: 'a', label: 'A · Refine' },
  { key: 'b', label: 'B · Route strip' },
  { key: 'c', label: 'C · Station sign' },
];

// Proof points matched to the 2026-10-08 resume screen pass: paid work only.
const PROOF = [
  { href: '/work/brightly', fig: '$1.575B', label: 'Set the design direction for the Brightly acquisition', short: 'Brightly' },
  { href: '/work/pqdr', fig: '200+', label: 'Industrial locations running operator tools I designed', short: 'PQDR' },
  { href: '/work/sim-racing', fig: '2', label: 'Paid AI-agent engagements since 2025', short: 'Sim Racing' },
];
const KICKER = 'Scott Gerstl · Design leader · Berlin';

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
    if (v === 'a' || v === 'b' || v === 'c') setVariant(v);
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

  if (variant === 'c') {
    return (
      <>
        <section className="hero hv hv--c" aria-label={ui('hero.ariaIntro')} ref={heroRef}>
          <ul className="hero-cards hv-signwrap">
            <li className="hero-card hv-sign">
              <div className="hv-sign-panel">
                <p className="hv-kicker">{KICKER}</p>
                <h1 className="hv-h1">{ui('hero.propPrimary')}</h1>
              </div>
              <ul className="hv-sign-lines" aria-label="Lines on this site">
                <li><span className="hv-pill hv-pill--ai">CS1</span>Professional work</li>
                <li><span className="hv-pill hv-pill--ent">CS2</span>Independent builds</li>
                <li><span className="hv-pill hv-pill--pers">P</span>About and contact</li>
              </ul>
            </li>
            <li className="hero-card hv-transfer">
              <p className="hv-lead">{ui('hero.propSecondary')}</p>
              <div className="hv-transfer-row">
                <span className="hv-transfer-label">Change here for</span>
                {PROOF.map((p) => (
                  <a key={p.href} href={p.href} className="hv-transfer-link">
                    <span className="hv-transfer-fig">{p.fig}</span> {p.short}
                    <span aria-hidden="true"> →</span>
                  </a>
                ))}
              </div>
            </li>
          </ul>
          {qualifiers}
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
