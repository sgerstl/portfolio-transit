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
