export type LineKey = 'ai' | 'ent' | 'pers';

export type CaseSlug =
  | 'epilog'
  | 'cal'
  | 'racemake'
  | 'brightly'
  | 'fleet'
  | 'pqdr'
  | 'about'
  | 'contact';

export type CaseMetric = {
  num: string;
  label: string;
};

export type CaseBody = {
  domains: string[];
  outcome: string;
  visualLabel: string;
  metrics: CaseMetric[];
  claim: string;
  ctaHref: string;
};

export type ContactLink = {
  href: string;
  icon: 'email' | 'linkedin';
  label: string;
  value: string;
};

export type PersonalBody = {
  paragraphs?: string[];
  links?: ContactLink[];
};

export type CaseEntry = {
  slug: CaseSlug;
  name: string;
  tagline: string;
  line: LineKey;
  readingMinutes: number;
  body?: CaseBody;
  personal?: PersonalBody;
};

export const CASES: CaseEntry[] = [
  {
    slug: 'epilog',
    name: 'Epilog',
    tagline: 'AI surfaced a clinical pattern. The neurologist concurred.',
    line: 'ai',
    readingMinutes: 4,
    body: {
      domains: ['Healthcare', 'Personal AI', 'Wearables-adjacent'],
      outcome:
        'Built for one user with epilepsy. App in active daily use, events logged in real time. The AI Insights page surfaced a specific pattern around psyllium husk affecting medication absorption that the user did not previously know about. Used in an actual neurology appointment. The neurologist independently arrived at the same treatment direction the AI had suggested.',
      visualLabel: 'EPILOG · INSIGHTS SCREEN',
      metrics: [
        { num: '1', label: 'Active daily user with epilepsy' },
        { num: 'Confirmed', label: "Neurologist independently agreed with AI's suggested direction" },
        { num: 'Live', label: 'PWA running at epilog-demo.scottgerstl.com' },
      ],
      claim:
        'I design AI features that produce clinical-grade outcomes. Surfacing patterns a clinician verifies and acts on.',
      ctaHref: '/work/epilog',
    },
  },
  {
    slug: 'cal',
    name: 'Cal',
    tagline: 'AI at every layer: research, design, build, deploy.',
    line: 'ai',
    readingMinutes: 3,
    body: {
      domains: ['Cycling', 'Personal AI', 'Practice'],
      outcome:
        'Workout planning app built with AI at every layer. AI as design deliverable (annotated prompt as IA). AI as builder (Claude Code shipping the codebase). AI inside the product (live workout generation in production). One-week build, three users, end-to-end ownership.',
      visualLabel: 'CAL · LIVE PLAN DEMO',
      metrics: [
        { num: '3', label: 'Layers of AI: as deliverable, as builder, in product' },
        { num: '~1 week', label: 'Research to shipped, end-to-end' },
        { num: 'Live', label: 'Working app with live AI plan generation' },
      ],
      claim:
        'I am AI-fluent at every layer where a designer can be. Thinking, building, shipping features.',
      ctaHref: '/work/cal',
    },
  },
  {
    slug: 'racemake',
    name: 'RaceMake',
    tagline: 'Race-engineer craft applied to AI product design.',
    line: 'ai',
    readingMinutes: 4,
    body: {
      domains: ['Motorsports', 'AI Products', 'Domain Depth'],
      outcome:
        "AI tooling for race engineers. Design rooted in the discipline rather than imposed on it. I've built and prepared cars, driven at the limit, and read the same telemetry the user reads. The case study is about domain depth as design leverage. What changes when the designer already knows the work.",
      visualLabel: 'RACEMAKE · TELEMETRY VIEW',
      metrics: [
        { num: 'Domain', label: 'Designer with race-engineering background' },
        { num: 'Engaged', label: 'Paid past work, contingent future engagement' },
        { num: 'Anonymized', label: 'Review-before-publish gate, with consent' },
      ],
      claim:
        'I bring race-engineer craft thinking to AI product design. Using domain depth as design leverage.',
      ctaHref: '/work/racemake',
    },
  },
  {
    slug: 'brightly',
    name: 'Brightly',
    tagline: 'Design direction for a $1.575B acquisition.',
    line: 'ent',
    readingMinutes: 6,
    body: {
      domains: ['Manufacturing', 'Healthcare', 'Education', 'Government'],
      outcome:
        'Vision design across 12 siloed products at Brightly. New design language and direction for product, functionality, and integration standards across the portfolio. Designs were used in acquisition-stage presentations to Siemens to demonstrate the platform vision and integration roadmap. Brightly was acquired for $1.575B.',
      visualLabel: 'BRIGHTLY · PLATFORM VISION HERO',
      metrics: [
        { num: '$1.575B', label: 'Siemens acquisition' },
        { num: '74%', label: 'Conference attendees excited about product future' },
        { num: '5×', label: 'Increase in time on dashboard pages in user testing' },
      ],
      claim:
        'I lead design vision that holds up under acquisition-grade scrutiny and produces business outcomes at enterprise scale.',
      ctaHref: '/work/brightly',
    },
  },
  {
    slug: 'fleet',
    name: 'Fleet',
    tagline: 'Three tools and two forms, consolidated into one.',
    line: 'ent',
    readingMinutes: 5,
    body: {
      domains: ['Logistics', 'Industrial', 'Cold Chain'],
      outcome:
        '0→1 industrial fleet operations product. Sole UX designer from initial research through shipped pilot. Consolidated three software tools and two paper forms into a single workflow that holds up in real industrial conditions. Gloves, dust, time pressure.',
      visualLabel: 'FLEET · WORKFLOW BEFORE & AFTER',
      metrics: [
        { num: '3 + 2 → 1', label: 'Tools and forms consolidated to a single workflow' },
        { num: 'Sole UX', label: 'Research, design, and pilot delivery' },
        { num: 'Shipped', label: 'Live with industrial users in cold-storage logistics' },
      ],
      claim:
        'I own design end-to-end on industrial products that have to work in physical-world conditions.',
      ctaHref: '/work/fleet',
    },
  },
  {
    slug: 'pqdr',
    name: 'PQ + DR',
    tagline: 'AI insight, operator decision. 200+ industrial locations.',
    line: 'ent',
    readingMinutes: 4,
    body: {
      domains: ['Energy', 'Industrial', 'Operator UX'],
      outcome:
        'Operator surfaces for AI-powered energy intelligence. Power Quality and Demand Response as two distinct operator views on one underlying AI system. Deployed across more than 200 industrial sites of a single customer. Penalty-avoidance value framed structurally rather than as measured savings.',
      visualLabel: 'PQ + DR · OPERATOR DASHBOARD',
      metrics: [
        { num: '200+', label: 'Industrial locations of one customer' },
        { num: '2 surfaces', label: 'PQ and DR built on one AI system' },
        { num: 'Operators', label: 'Industrial-scale operational decisions' },
      ],
      claim:
        'I design operator-facing surfaces that turn AI insight into industrial-scale operational decisions.',
      ctaHref: '/work/pqdr',
    },
  },
  {
    slug: 'about',
    name: 'About',
    tagline: 'Two crafts I keep close to.',
    line: 'pers',
    readingMinutes: 2,
    personal: {
      paragraphs: [
        "I've built and prepared cars for track days, driven them at their limits, and taught others to find theirs. Getting someone fast requires understanding exactly what's wrong before suggesting anything different.",
        "I've been riding since the 90s. Mountain bikes first, then road racing, cyclocross, and now back to the road and gravel in Berlin. The best days are the hard ones that remind you of how much further you can actually go.",
      ],
    },
  },
  {
    slug: 'contact',
    name: 'Contact',
    tagline: 'Email or LinkedIn. I read both.',
    line: 'pers',
    readingMinutes: 1,
    personal: {
      links: [
        {
          href: 'mailto:scottgerstl@gmail.com',
          icon: 'email',
          label: 'Email',
          value: 'scottgerstl@gmail.com',
        },
        {
          href: 'https://www.linkedin.com/in/scottgerstl',
          icon: 'linkedin',
          label: 'LinkedIn',
          value: 'linkedin.com/in/scottgerstl',
        },
      ],
    },
  },
];

export const SECTIONS: { line: LineKey; code: string; title: string; subtitle: string }[] = [
  { line: 'ai',   code: 'CS1', title: 'AI Case Studies',         subtitle: '3 stops · designing AI features and shipping them' },
  { line: 'ent',  code: 'CS2', title: 'Enterprise Case Studies', subtitle: '3 stops · platform vision and operator-facing systems' },
  { line: 'pers', code: 'P',   title: 'Personal',                subtitle: '2 stops · who I am off the clock, and how to reach me' },
];

export function casesForLine(line: LineKey): CaseEntry[] {
  return CASES.filter((c) => c.line === line);
}
