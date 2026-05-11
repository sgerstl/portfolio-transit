import { useEffect, useRef } from 'react';
import { smoothScrollTo } from '../../lib/scroll';

type StatCard = {
  num: string;
  target: 'brightly' | 'epilog' | 'cal';
  ariaLabel: string;
  text: React.ReactNode;
};

const STAT_CARDS: StatCard[] = [
  {
    num: '01',
    target: 'brightly',
    ariaLabel: 'Jump to Brightly case study',
    text: (
      <>
        Set the design direction for a <strong>$1.575B</strong> acquisition
      </>
    ),
  },
  {
    num: '02',
    target: 'epilog',
    ariaLabel: 'Jump to Epilog case study',
    text: 'Built an AI tool that caught a drug interaction a doctor missed',
  },
  {
    num: '03',
    target: 'cal',
    ariaLabel: 'Jump to Cal case study',
    text: 'Shipped a working app in a week using AI to research, design, build, and deploy',
  },
];

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const preludeRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLLIElement[]>([]);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const heroEl = heroRef.current;
    const preludeEl = preludeRef.current;
    const cardsEls = cardsRef.current.filter(Boolean);
    if (!heroEl) return;

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
  }, []);

  return (
    <section className="hero" aria-label="Introduction" ref={heroRef}>
      <div className="hero-prelude" ref={preludeRef}>
        All aboard! Three stops to my best work.
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
          <span className="prop-label">Proposition</span>
          <p className="prop-primary">
            I bring senior product design judgment to AI features and the enterprise systems they ship into.
          </p>
          <p className="prop-secondary">
            Outcomes land in factories, schools, and hospitals, with the people who run them and
            the people they serve.
          </p>
        </li>
      </ul>
    </section>
  );
}
