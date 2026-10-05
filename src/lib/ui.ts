// UI chrome strings: the hardcoded labels that live in components rather than
// in cases.ts / lab.ts data. Keep this list short: prefer putting copy in the
// data file when it's content; reserve this dictionary for chrome and labels.
//
// The site is English-only since 2026-10-05. The bilingual EN/DE version is
// preserved at the git tag `bilingual-final`.

export type UIKey =
  | 'nav.cases'
  | 'nav.lab'
  | 'nav.resume'
  | 'nav.about'
  | 'nav.contact'
  | 'header.tagline'
  | 'departureBoard.currentStop'
  | 'departureBoard.home'
  | 'casecard.cta'
  | 'casecard.galleryMore'
  | 'casecard.galleryLess'
  | 'case.back'
  | 'case.openDemo'
  | 'case.tryDemo'
  | 'case.demoCaption'
  | 'case.placeholder'
  | 'lab.back'
  | 'lab.title'
  | 'lab.lede'
  | 'lab.readMore'
  | 'lab.collapse'
  | 'lab.tried'
  | 'lab.learned'
  | 'lab.didntWork'
  | 'lab.forYourTeam'
  | 'lab.openDemo'
  | 'hero.prelude'
  | 'hero.qualifiers'
  | 'hero.propLabel'
  | 'hero.propPrimary'
  | 'hero.propSecondary'
  | 'hero.statBrightly'
  | 'hero.statEpilog'
  | 'hero.statCal'
  | 'hero.ariaBrightly'
  | 'hero.ariaEpilog'
  | 'hero.ariaCal'
  | 'hero.ariaIntro'
  | 'resume.title'
  | 'resume.lede'
  | 'resume.download'
  | 'resume.openTab'
  | 'contactFab.label'
  | 'contactFab.aria'
  | 'header.menuOpen'
  | 'header.menuClose'
  | 'siteTitle'
  | 'siteTitleCase'
  | 'siteTitleLab'
  | 'siteTitleResume'
  | 'og.title'
  | 'og.description';

export const UI: Record<UIKey, string> = {
  'nav.cases': 'Cases',
  'nav.lab': 'Lab',
  'nav.resume': 'Resume',
  'nav.about': 'About',
  'nav.contact': 'Contact',
  'header.tagline': 'North Carolina → Berlin',
  'departureBoard.currentStop': 'Current stop:',
  'departureBoard.home': 'Home',
  'casecard.cta': 'Read the full case study →',
  'casecard.galleryMore': 'View more ↓',
  'casecard.galleryLess': 'Show less ↑',
  'case.back': '← Back to cases',
  'case.openDemo': 'Open interactive demo ↗',
  'case.tryDemo': 'Try the live demo ↗',
  'case.demoCaption': 'Interactive demo with sample data',
  'case.placeholder': 'Full case study coming soon.',
  'lab.back': '← Back to home',
  'lab.title': 'AI Lab',
  'lab.lede': "A running log of experiments, systems, and tools built at the intersection of UX and AI. Not polished case studies, just honest notes from the process, including what's still unresolved.",
  'lab.readMore': 'Read more ↓',
  'lab.collapse': 'Collapse ↑',
  'lab.tried': 'Tried',
  'lab.learned': 'Learned',
  'lab.didntWork': "What didn't work",
  'lab.forYourTeam': 'For your team',
  'lab.openDemo': 'Open demo ↗',
  'resume.title': 'Resume',
  'resume.lede': 'Senior product designer. Berlin. Enterprise platforms and AI products.',
  'resume.download': 'Download PDF',
  'resume.openTab': 'Open in new tab ↗',
  'contactFab.label': 'Contact Me',
  'contactFab.aria': 'Jump to contact section',
  'header.menuOpen': 'Open menu',
  'header.menuClose': 'Close menu',
  'hero.prelude': 'All aboard! Three stops to your destination.',
  'hero.qualifiers': '15 years · Enterprise systems and AI products · US/German citizen, EU work-authorized',
  'hero.propLabel': 'Proposition',
  'hero.propPrimary': 'Senior product design judgment for AI features and enterprise systems.',
  'hero.propSecondary': 'Outcomes land in factories, schools, and hospitals, with the people who run them and the people they serve.',
  'hero.statBrightly': 'Set the design direction for a $1.575B acquisition',
  'hero.statEpilog': 'Built an AI tool that caught a drug interaction a doctor missed',
  'hero.statCal': 'Shipped a working app in a week using AI to research, design, build, and deploy',
  'hero.ariaBrightly': 'Jump to Brightly case study',
  'hero.ariaEpilog': 'Jump to Epilog case study',
  'hero.ariaCal': 'Jump to Cal case study',
  'hero.ariaIntro': 'Introduction',
  'siteTitle': 'Scott Gerstl | Portfolio',
  'siteTitleCase': '{name} | Scott Gerstl',
  'siteTitleLab': 'AI Lab | Scott Gerstl',
  'siteTitleResume': 'Resume | Scott Gerstl',
  'og.title': 'Scott Gerstl — Senior product designer',
  'og.description': '15 years shipping enterprise platforms and AI products. Berlin.',
};

export function ui(key: UIKey): string {
  return UI[key];
}
