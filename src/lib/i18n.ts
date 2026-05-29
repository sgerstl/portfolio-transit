// Bilingual (EN/DE) i18n helpers.
//
// Data shape rule: every translatable string in cases.ts / lab.ts is wrapped
// in an L10n object built via t(). Untranslated DE strings render with a
// "[DE] " prefix so they're obvious during the placeholder phase. Real
// translations replace the second t() argument.

export const LOCALES = ['en', 'de'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export type L10n<T = string> = { en: T; de: T };

export function t(en: string, de?: string): L10n {
  return { en, de: de ?? `[DE] ${en}` };
}

export function L<T>(en: T, de: T): L10n<T> {
  return { en, de };
}

export function pick<T>(field: L10n<T>, locale: Locale): T {
  return field[locale];
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

// Coerce Astro.currentLocale (which can be undefined or any string) into a Locale.
export function asLocale(value: unknown): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

// Detect locale from a URL or pathname string. /de/* → de, otherwise en.
export function getLocale(url: URL | string): Locale {
  const pathname = typeof url === 'string' ? url : url.pathname;
  return pathname === '/de' || pathname === '/de/' || pathname.startsWith('/de/')
    ? 'de'
    : 'en';
}

// Build a locale-prefixed path. Always returns a path with the right prefix
// for the target locale, regardless of the input's current locale.
//   localizePath('/work/epilog/', 'de') → '/de/work/epilog/'
//   localizePath('/de/work/epilog/', 'en') → '/work/epilog/'
//   localizePath('/', 'de') → '/de/'
export function localizePath(path: string, locale: Locale): string {
  // Strip an existing /de prefix so we're starting from a clean EN-form path.
  const stripped = path.replace(/^\/de(\/|$)/, '/');
  if (locale === 'en') return stripped;
  if (stripped === '/') return '/de/';
  return `/de${stripped}`;
}

// ---- UI string dictionary ---------------------------------------------------
//
// Strings here are the hardcoded UI labels that live in components rather than
// in cases.ts/lab.ts data. Keep this list short: prefer putting copy in the
// data file when it's content; reserve this dictionary for chrome and labels.

export type UIKey =
  | 'nav.cases'
  | 'nav.lab'
  | 'nav.resume'
  | 'nav.about'
  | 'nav.contact'
  | 'header.tagline'
  | 'header.langEnglish'
  | 'header.langGerman'
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
  | 'siteTitle'
  | 'siteTitleCase'
  | 'siteTitleLab'
  | 'siteTitleResume'
  | 'og.title'
  | 'og.description';

// Brand-consistency rule per project spec: case names ("Epilog", "Cal",
// "Brightly", "Fleet", "PQDR", "About", "Contact") stay English in both
// locales. The header nav anchors link to those cases, so nav labels for
// "Cases", "Lab", "About", "Contact" also stay English to avoid the
// UX inconsistency of clicking "Über" and landing on a card titled "About".
// Resume → Lebenslauf is OK (it's a document type, not a case name).
export const UI: Record<UIKey, L10n> = {
  'nav.cases': t('Cases', 'Cases'),
  'nav.lab': t('Lab', 'Lab'),
  'nav.resume': t('Resume', 'Lebenslauf'),
  'nav.about': t('About', 'About'),
  'nav.contact': t('Contact', 'Contact'),
  'header.tagline': t('North Carolina → Berlin', 'North Carolina → Berlin'),
  'header.langEnglish': t('EN', 'EN'),
  'header.langGerman': t('DE', 'DE'),
  'departureBoard.currentStop': t('Current stop:', 'Aktueller Halt:'),
  'departureBoard.home': t('Home', 'Start'),
  'casecard.cta': t('Read the full case study →', 'Die ganze Fallstudie lesen →'),
  'casecard.galleryMore': t('View more ↓', 'Mehr anzeigen ↓'),
  'casecard.galleryLess': t('Show less ↑', 'Weniger anzeigen ↑'),
  'case.back': t('← Back to cases', '← Zurück zu den Fallstudien'),
  'case.openDemo': t('Open interactive demo ↗', 'Interaktive Demo öffnen ↗'),
  'case.tryDemo': t('Try the live demo ↗', 'Live-Demo ausprobieren ↗'),
  'case.demoCaption': t('Interactive demo with sample data', 'Interaktive Demo mit Beispieldaten'),
  'case.placeholder': t('Full case study coming soon.', 'Vollständige Fallstudie folgt in Kürze.'),
  'lab.back': t('← Back to home', '← Zurück zur Startseite'),
  'lab.title': t('AI Lab', 'AI Lab'),
  'lab.lede': t(
    "A running log of experiments, systems, and tools built at the intersection of UX and AI. Not polished case studies, just honest notes from the process, including what's still unresolved.",
    'Ein laufendes Protokoll von Experimenten, Systemen und Tools an der Schnittstelle von UX und KI. Keine geschliffenen Fallstudien, nur ehrliche Notizen aus dem Prozess, inklusive dem, was noch ungelöst ist.',
  ),
  'lab.readMore': t('Read more ↓', 'Mehr lesen ↓'),
  'lab.collapse': t('Collapse ↑', 'Einklappen ↑'),
  'lab.tried': t('Tried', 'Versucht'),
  'lab.learned': t('Learned', 'Gelernt'),
  'lab.didntWork': t("What didn't work", 'Was nicht funktioniert hat'),
  'lab.forYourTeam': t('For your team', 'Für Ihr Team'),
  'lab.openDemo': t('Open demo ↗', 'Demo öffnen ↗'),
  'resume.title': t('Resume', 'Lebenslauf'),
  'resume.lede': t('Senior product designer. Berlin. Enterprise platforms and AI products.'),
  'resume.download': t('Download PDF', 'PDF herunterladen'),
  'resume.openTab': t('Open in new tab ↗', 'In neuem Tab öffnen ↗'),
  'hero.prelude': t(
    'All aboard! Three stops to your destination.',
    'Einsteigen bitte! Drei Stationen bis zum Ziel.',
  ),
  'hero.qualifiers': t(
    '15 years · Enterprise systems and AI products · US/German citizen, EU work-authorized',
    '15 Jahre · Enterprise-Systeme und KI-Produkte · US-/deutsche Staatsbürgerschaft, EU-arbeitsberechtigt',
  ),
  'hero.propLabel': t('Proposition', 'Position'),
  'hero.propPrimary': t(
    'Senior product design judgment for AI features and enterprise systems.',
    'Senior Product Design Urteilsvermögen für KI-Features und Enterprise-Systeme.',
  ),
  'hero.propSecondary': t(
    'Outcomes land in factories, schools, and hospitals, with the people who run them and the people they serve.',
    'Ergebnisse landen in Fabriken, Schulen und Krankenhäusern, bei den Menschen, die sie betreiben, und bei denen, denen sie dienen.',
  ),
  'hero.statBrightly': t(
    'Set the design direction for a $1.575B acquisition',
    'Designrichtung für eine Übernahme im Wert von 1,575 Mrd. $ gesetzt',
  ),
  'hero.statEpilog': t(
    'Built an AI tool that caught a drug interaction a doctor missed',
    'Ein KI-Tool gebaut, das eine Wechselwirkung erkannt hat, die ein Arzt übersehen hatte',
  ),
  'hero.statCal': t(
    'Shipped a working app in a week using AI to research, design, build, and deploy',
    'Eine funktionierende App in einer Woche ausgeliefert, mit KI für Recherche, Design, Bau und Deployment',
  ),
  'hero.ariaBrightly': t('Jump to Brightly case study', 'Zur Brightly Fallstudie springen'),
  'hero.ariaEpilog': t('Jump to Epilog case study', 'Zur Epilog Fallstudie springen'),
  'hero.ariaCal': t('Jump to Cal case study', 'Zur Cal Fallstudie springen'),
  'hero.ariaIntro': t('Introduction', 'Einleitung'),
  'siteTitle': t('Scott Gerstl | Portfolio', 'Scott Gerstl | Portfolio'),
  'siteTitleCase': t('{name} | Scott Gerstl', '{name} | Scott Gerstl'),
  'siteTitleLab': t('AI Lab | Scott Gerstl', 'AI Lab | Scott Gerstl'),
  'siteTitleResume': t('Resume | Scott Gerstl', 'Lebenslauf | Scott Gerstl'),
  'og.title': t('Scott Gerstl — Senior product designer', 'Scott Gerstl — Senior Product Designer'),
  'og.description': t(
    '15 years shipping enterprise platforms and AI products. Berlin.',
    '15 Jahre Erfahrung mit Enterprise-Plattformen und KI-Produkten. Berlin.',
  ),
};

export function ui(key: UIKey, locale: Locale): string {
  return UI[key][locale];
}
