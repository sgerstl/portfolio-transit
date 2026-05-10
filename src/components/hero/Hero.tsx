import { useEffect, useRef } from 'react';

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
    text: 'Built an AI tool that changed a neurological treatment plan',
  },
  {
    num: '03',
    target: 'cal',
    ariaLabel: 'Jump to Cal case study',
    text: 'Shipped a working app in a week using AI: research, design, build, deploy',
  },
];

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

function smoothScrollTo(targetY: number, reducedMotion: boolean) {
  if (reducedMotion) {
    window.scrollTo(0, targetY);
    return;
  }
  const startY = window.scrollY;
  const distance = targetY - startY;
  if (Math.abs(distance) < 2) return;
  const startTime = performance.now();
  const dur = Math.max(600, Math.min(1400, Math.abs(distance) * 0.7));
  function tick(now: number) {
    const elapsed = now - startTime;
    const t = clamp01(elapsed / dur);
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    window.scrollTo(0, startY + distance * eased);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

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

    const getExitDistance = () => window.innerHeight * 1.2;

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
      const targetEl = document.getElementById(`case-${target}`);
      // Case study sections are deferred to a future session. When they
      // land, this handler scrolls + opens. Until then, fall back to
      // scrolling to the cases anchor so the click still feels alive.
      if (targetEl) {
        const rect = targetEl.getBoundingClientRect();
        smoothScrollTo(window.scrollY + rect.top - 80, reducedMotion);
        return;
      }
      const cases = document.getElementById('cases');
      if (cases) {
        const rect = cases.getBoundingClientRect();
        smoothScrollTo(window.scrollY + rect.top - 80, reducedMotion);
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
        Let's take a ride. Three stops. Destination: Value
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
            I bring enterprise design judgment to AI products and enterprise systems.
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
