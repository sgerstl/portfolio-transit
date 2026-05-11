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
  linkText?: string;
  linkHref?: string;
};

export type CaseBody = {
  domains: string[];
  outcome: string;
  visualLabel: string;
  metrics: CaseMetric[];
  claim: string;
  ctaHref: string;
};

export type CaseDecision = { title: string; body: string };
export type CaseScreenshot = { src: string; alt: string; caption?: string };
export type CaseScreenshotGrid = { columns: 2 | 3; images: CaseScreenshot[] };

export type CaseSection = {
  title: string;
  subtitle: string;
  paragraphs: string[];
  decisions?: CaseDecision[];
  italicOutro?: string;
  tryIts?: string[];
  screenshots?: CaseScreenshotGrid;
};

export type CaseDetail = {
  demoUrl?: string;
  chips?: string[];
  hook: string[];
  sections: CaseSection[];
  outcomeBeat?: {
    title: string;
    paragraphs: string[];
    highlight?: string;
  };
};

export type ContactLink = {
  href: string;
  icon: 'email' | 'linkedin';
  label: string;
  value: string;
};

export type GalleryPiece = {
  src: string;
  title: string;
  subtitle: string;
};

export type PersonalBody = {
  paragraphs?: string[];
  links?: ContactLink[];
  gallery?: GalleryPiece[];
};

export type CaseEntry = {
  slug: CaseSlug;
  name: string;
  tagline: string;
  line: LineKey;
  readingMinutes: number;
  body?: CaseBody;
  detail?: CaseDetail;
  personal?: PersonalBody;
};

export const CASES: CaseEntry[] = [
  {
    slug: 'epilog',
    name: 'Epilog',
    tagline: 'AI caught a drug interaction. The neurologist confirmed it.',
    line: 'ai',
    readingMinutes: 4,
    body: {
      domains: ['Healthcare', 'Personal AI', 'Wearables-adjacent'],
      outcome:
        "An app built for one user with epilepsy. It's used daily to log events as the user experiences them. The AI Insights built into the app used the tracked data to surface an adverse drug interaction. A drug prescribed by the user's primary care physician was inhibiting the absorption of the anti-epileptic drugs the user depends on. This information was brought to the neurologist and they confirmed the interaction. The neurologist independently arrived at the same treatment direction the AI had suggested.",
      visualLabel: 'EPILOG · INSIGHTS SCREEN',
      metrics: [
        { num: '1', label: 'Active daily user with epilepsy' },
        { num: 'Confirmed', label: 'Neurologist independently reached the same conclusion' },
        {
          num: 'Live',
          label: 'PWA running at',
          linkText: 'epilog-demo.scottgerstl.com',
          linkHref: 'https://epilog-demo.scottgerstl.com',
        },
      ],
      claim:
        'I design AI features that produce clinical-grade outcomes. Surfacing patterns a clinician verifies and acts on.',
      ctaHref: '/work/epilog',
    },
    detail: {
      demoUrl: 'https://epilog-demo.scottgerstl.com',
      chips: ['Personal', 'Health', 'AI', 'PWA'],
      hook: [
        'A seizure and aura tracker built for a family member. Log an event in seconds, find patterns across months, and surface insights that change a clinical conversation.',
        "Its AI analysis caught a drug interaction their GP had missed: a fiber supplement was interfering with their anti-epileptic medication. They brought the finding to their neurologist, stopped the supplement, and seizure activity went down.",
      ],
      sections: [
        {
          title: 'Understanding the constraint',
          subtitle: 'What it took to define the right problem',
          paragraphs: [
            "Someone you love has epilepsy. You watch them try to log an event after a seizure or aura, still foggy, motor control off, cognitive function not fully back online. The event is over, but the aftermath is real. That's not a user story you write on a whiteboard. It's something you understand by being in the room.",
            'Three constraints came out of that proximity:',
          ],
          decisions: [
            {
              title: 'Log in seconds while still recovering.',
              body: "Events get logged in the aftermath, when brain function is still impaired. If the logging flow requires concentration, the data doesn't get captured. This wasn't a performance goal. It was a clinical one.",
            },
            {
              title: 'Find correlations without being a data analyst.',
              body: 'The calendar and insights views needed to surface patterns visually, without an interpretation step. A list of events tells you what happened. A calendar tells you what the pattern is.',
            },
            {
              title: 'Serve the caregiver relationship too.',
              body: 'Data collected for personal use is only half the value. The other half is the conversation between a patient and their neurologist. Designing for that conversation was a first-class requirement.',
            },
          ],
          italicOutro:
            'AI can build a health tracker in an afternoon. Knowing which three constraints actually matter requires sitting in the room where the problem lives.',
          tryIts: [
            'Open the add flow and walk through logging a seizure. Every input is a single gesture: no typing, no scrolling, no decisions that require concentration.',
          ],
          screenshots: {
            columns: 3,
            images: [
              { src: '/images/cases/epilog/epilog-log-event.jpeg', alt: 'Event type selection', caption: 'Type selection' },
              { src: '/images/cases/epilog/epilog-aura-details.jpeg', alt: 'Severity and duration', caption: 'Severity + duration' },
              { src: '/images/cases/epilog/epilog-aura-characteristics.jpeg', alt: 'Characteristics', caption: 'Characteristics' },
            ],
          },
        },
        {
          title: 'Knowing what to kill',
          subtitle: 'Why the best design decision was deleting a feature',
          paragraphs: [
            "Early on, I built a medication reminder system. Push notifications at dosing times, confirmation flows, the whole pattern you'd expect. It didn't survive first contact with real use.",
            "The problem wasn't the reminders. It was the assumption. Most of the time, medication is taken on schedule. Building a system that demanded confirmation twice a day created friction on the 95% of days when everything was fine. The user stopped engaging with the app entirely.",
            'So I stripped it out and inverted the model: assume adherence, only capture deviations. A "Missed Dose" event type replaced the entire notification system. One tap when something goes wrong, silence when it doesn\'t.',
          ],
          italicOutro:
            'AI can generate a notification system in minutes. Recognizing that the right move is to delete it requires judgment that only comes from watching someone actually use it.',
          tryIts: [
            'Tap the + button and look at the event types. "Missed Medication" is a first-class event, not a setting buried in a menu. That\'s the entire medication tracking system.',
          ],
        },
        {
          title: 'The outcome',
          subtitle: 'How the AI caught something a doctor missed',
          paragraphs: [
            "The user's seizure activity had been increasing over several weeks. They'd been logging consistently: seizures, auras, missed doses, sleep data from their wearable. They ran the AI analysis.",
            "The analysis flagged something unexpected: a potential interaction between psyllium husk, a fiber supplement their GP had prescribed for digestive issues, and their anti-epileptic medication. Psyllium husk can interfere with drug absorption when taken at the same time. The GP hadn't considered this. It's not their domain.",
            'The user brought the finding to their neurologist. The neurologist confirmed the concern. They stopped the supplement. Seizure activity decreased.',
            "An AI tool, built by one designer, caught something a doctor missed. Not because the AI was smarter than the doctor. Because it had the right data, in the right context, and surfaced the right question.",
          ],
          italicOutro:
            "The AI didn't replace clinical judgment. The designer's job was knowing what data to collect, how to frame the output, and when to get out of the way. That's the part AI can't do for you.",
          tryIts: [
            'Open the Insights tab and switch to "AI Analysis." Tap "Analyze my data" to see the kind of output the tool produces. The demo uses a curated dataset, but the structure mirrors real results.',
            'Head to the Export tab and tap "Export PDF." The generated report is structured for a neurologist visit: findings, medication history, and event timeline in a format that respects their time.',
          ],
          screenshots: {
            columns: 2,
            images: [
              { src: '/images/cases/epilog/epilog-summary.jpeg', alt: 'Insights summary', caption: 'Pattern analysis' },
              { src: '/images/cases/epilog/epilog-export.jpeg', alt: 'PDF export', caption: 'Clinical PDF export' },
            ],
          },
        },
      ],
    },
  },
  {
    slug: 'cal',
    name: 'Cal',
    tagline: 'AI as deliverable. AI as builder. AI inside the product.',
    line: 'ai',
    readingMinutes: 3,
    body: {
      domains: ['Cycling', 'Personal AI', 'Practice'],
      outcome:
        'Workout planning app with AI at three layers: as design deliverable, as builder, and inside the product. Research to shipped in 5 days. Three real users. End-to-end ownership from prompt to PWA.',
      visualLabel: 'CAL · LIVE PLAN DEMO',
      metrics: [
        { num: '3', label: 'Layers of AI: as deliverable, as builder, in product' },
        { num: '5 days', label: 'Research to shipped, end-to-end' },
        {
          num: 'Live',
          label: 'Working app at',
          linkText: 'cal-demo.scottgerstl.com',
          linkHref: 'https://cal-demo.scottgerstl.com',
        },
      ],
      claim:
        'I am AI-fluent at every layer of design. Research, analysis, building, shipping.',
      ctaHref: '/work/cal',
    },
    detail: {
      demoUrl: 'https://cal-demo.scottgerstl.com',
      chips: ['Personal', 'AI', 'Fitness', 'PWA'],
      hook: [
        "The code didn't take long. What took time was everything the AI couldn't do: deciding what to build, evaluating whether the output was trustworthy, and catching the interaction patterns that were technically correct but experientially wrong.",
        "When production velocity is cheap, judgment becomes expensive. That's the shift this project is about.",
      ],
      sections: [
        {
          title: 'When execution is free, judgment is expensive',
          subtitle: 'What building at speed revealed',
          paragraphs: [
            "Cal shipped in 5 days. Claude Code produced functioning UI, wired-up components, and working API integrations faster than any developer handoff I've experienced. But the timeline isn't a boast. It's a data point about where the design effort went.",
            'What took time was the evaluation loop. Running each generated plan through the same criteria a human trainer would: Does this progression make sense for someone at this fitness level? Are the rest periods appropriate for the intensity? Would a real athlete trust this enough to follow it for six weeks?',
            'Zero visible AI scaffolding. The experience reads as a polished, intentional product, not a prototype. That\'s not because the AI was good enough on its own. It\'s because the evaluation criteria were specific enough to catch what "good enough" actually means.',
          ],
          italicOutro:
            "The role stops being about making things and starts being about deciding what's worth making and whether what was made is good enough.",
          tryIts: [
            'Browse the plan overview and tap into a day. The warmup sets, progressive overload, and rest periods are all AI-generated from one profile. Notice how injury accommodations (lower back) shape exercise selection across every session.',
          ],
          screenshots: {
            columns: 2,
            images: [
              { src: '/images/cases/cal/cal-active-workout.jpeg', alt: 'Active workout', caption: 'Live workout' },
              { src: '/images/cases/cal/cal-workout-detail.jpeg', alt: 'Workout detail', caption: 'Workout detail' },
            ],
          },
        },
        {
          title: 'The prompt is the deliverable',
          subtitle: "Why the most important design artifact isn't visual",
          paragraphs: [
            "The AI prompt for plan generation is a 400-word structured brief that reads more like a creative brief than a software function. It defines Cal's persona, communication style, hard constraints (training days, injuries, equipment), soft constraints (weekly progression themes, RPE modulation), and the exact JSON schema the UI depends on.",
            "I treated this prompt the way I'd treat any design artifact: iterating on it, running heuristic evaluations against its output, and refining based on what the AI produced rather than what I expected. The prompt went through more revisions than any single screen in the app.",
          ],
          decisions: [
            {
              title: 'Persona in two sentences, not two paragraphs.',
              body: '"Be direct, technical, and motivational. Avoid mechanical metaphors." That second sentence came from v1 output that read like an instruction manual. One exclusion changed the entire tone.',
            },
            {
              title: '"No exceptions" is load-bearing.',
              body: '"Max 3 working sets per exercise. No exceptions." Removed that phrase once in testing. The model added a 4th set "for advanced athletes." Constraint specificity replaces judgment calls you don\'t want delegated.',
            },
            {
              title: 'Phase names over phase numbers.',
              body: 'Weeks 1-6 became Foundation, Accumulate, Intensify, Peak. Named phases give the model a conceptual anchor for each block. This produced more coherent progressions than numeric targets alone.',
            },
          ],
          italicOutro:
            'Any team shipping AI features needs this distinction: the prompt is a design artifact, not an engineering concern. The quality of AI output is a design outcome.',
          tryIts: [
            'Watch the plan generate in the demo. The briefing, week themes, and exercise selections all come from a single structured prompt. Tap into any week to see how constraints like "max 3 working sets" and injury accommodations carry through.',
          ],
          screenshots: {
            columns: 2,
            images: [
              { src: '/images/cases/cal/cal-plan-overview.jpeg', alt: 'Plan overview', caption: 'Plan generation' },
              { src: '/images/cases/cal/cal-week-sessions.jpeg', alt: 'Week sessions', caption: 'Week structure' },
            ],
          },
        },
        {
          title: 'What the voice taught me',
          subtitle: 'Why the hardest UX problems are physical, not digital',
          paragraphs: [
            "The voice control system is the feature I'm most honest about. It works. It's also the roughest part of the app, and the reasons why are instructive.",
            'The architecture is sound: two-tier parsing with local regex handling ~90% of commands instantly (no network round-trip) and Claude Haiku as a fallback for edge cases. ElevenLabs TTS for synthesized coaching cues, with IndexedDB caching to avoid re-fetching repeated phrases.',
            'The failure modes are physical, not digital. A missed "done" command mid-set means the user has to touch their phone between reps, exactly the friction the feature was supposed to eliminate. Commands fired twice when the transcript updated incrementally. Haiku triggered on background noise that regex correctly ignored. Each fix revealed a new edge case.',
            "This isn't a solvable problem in the traditional sense. It's a calibration problem that requires real-world testing with real users in gyms. Heuristic evaluation in a quiet office catches maybe 30% of failure modes. The other 70% only appear under physical use conditions.",
          ],
          italicOutro:
            'Voice UX requires a different evaluation methodology than visual UX. If your product has voice features, the test environment is part of the design spec, not an afterthought.',
          tryIts: [
            'Start a workout in the demo, then tap the microphone icon at the bottom of the screen to activate voice control. Try saying "done" to complete a set, or "skip rest" to jump ahead. The two-tier parsing handles most commands locally with no network delay.',
          ],
          screenshots: {
            columns: 2,
            images: [
              { src: '/images/cases/cal/cal-session-complete.jpeg', alt: 'Session complete', caption: 'Session summary' },
              { src: '/images/cases/cal/cal-performance.jpeg', alt: 'Performance tracking', caption: 'Progress tracking' },
            ],
          },
        },
      ],
      outcomeBeat: {
        title: 'What Cal is now',
        paragraphs: [
          'Cal runs as the coach I use for my own training. The plans hold up across six-week cycles. Voice control has its rough edges, but it does the one thing it was supposed to do: keeps my hands off the phone between sets. Both plan types, strength and mobility, generate from a single profile, and the two halves of the week support each other instead of competing for attention.',
        ],
        highlight:
          "That's the honest test for an AI-built product. Not whether it shipped fast, but whether it's still the tool you reach for when you have other options.",
      },
    },
  },
  {
    slug: 'racemake',
    name: 'RaceMake',
    tagline: 'Race-engineer practice, designed into an AI product.',
    line: 'ai',
    readingMinutes: 4,
    body: {
      domains: ['Motorsports', 'AI Products', 'Domain Depth'],
      outcome:
        "Design consulting on an AI sim-racing telemetry tool. Reframed the analysis app as the AI agent's workspace, not a chat panel beside it. Designed a race engineer pattern that translates expert practice into UX for sim-racers who don't have an engineer. Four worked archetypes shipped against the product's telemetry schemas.",
      visualLabel: 'RACEMAKE · TELEMETRY VIEW',
      metrics: [
        { num: 'Domain', label: 'Race-engineer perspective brought to AI tooling for sim-racers' },
        { num: 'Reframe', label: 'Analysis surface as agent workspace, not chat panel' },
        { num: '4 archetypes', label: "Worked patterns shipped against the product's telemetry schemas" },
      ],
      claim:
        'I bring motorsports domain knowledge to AI product design. I use AI to scale expert practice and analysis so drivers at every level can benefit.',
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
        'Vision design across 12 siloed products at Brightly. A unified design language and integration model proposed across the portfolio. Designs were used in acquisition-stage presentations to Siemens to demonstrate the platform vision and integration roadmap. Brightly was acquired for $1.575B.',
      visualLabel: 'BRIGHTLY · PLATFORM VISION HERO',
      metrics: [
        { num: '$1.575B', label: 'Siemens acquisition' },
        { num: '74%', label: 'Customers excited by the future product direction' },
        { num: '5×', label: 'Increase in time on dashboard pages in user testing' },
      ],
      claim:
        'I lead design vision that holds up under acquisition-grade scrutiny.',
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
        '0→1 industrial fleet operations product. Sole UX designer from initial research through shipped pilot. Consolidated three software tools and two paper forms into a single workflow. Gloves, dust, time pressure.',
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
    name: 'Power Quality and Demand Response',
    tagline: 'AI insight, operator decision. 200+ industrial locations.',
    line: 'ent',
    readingMinutes: 4,
    body: {
      domains: ['Energy', 'Industrial', 'Operator UX'],
      outcome:
        'Operator surfaces for AI-powered energy intelligence. Power Quality and Demand Response as two distinct operator views on one underlying AI system. Deployed across more than 200 industrial sites of a single customer. Penalty avoidance was the structural value, not a measured-savings claim.',
      visualLabel: 'PQ + DR · OPERATOR DASHBOARD',
      metrics: [
        { num: '200+', label: 'Industrial locations of one customer' },
        { num: '2 surfaces', label: 'Power Quality and Demand Response built on one AI system' },
        { num: 'Operators', label: 'AI surfaces, operators decide' },
      ],
      claim:
        'I design operator-facing surfaces that turn AI insight into industrial-scale operational decisions.',
      ctaHref: '/work/pqdr',
    },
  },
  {
    slug: 'about',
    name: 'About',
    tagline: 'Wheels, speed, freedom.',
    line: 'pers',
    readingMinutes: 2,
    personal: {
      paragraphs: [
        'I love wheeled things. Bikes, cars, and even public transit.',
        "I've built and prepped cars for high performance track driving, driven them at the limit, and coached others to find theirs. Helping someone get fast means understanding what needs to happen, and what can go wrong, before you suggest anything different.",
        "I've been a cyclist since the 90s. I cut my teeth on mountain bikes, then fell headlong into road cycling, racing, endurance rides, cyclocross, and commuting. Now I'm combining it all, on and off road, in and around Berlin.",
        "I'm also a fan of public transit and the freedom it offers. As an American in Berlin, the freedom of not needing a car is a welcome change, even with how much I love cars and driving. This page is themed in celebration of that freedom.",
        "It's all about the user experience.",
        'I also like to draw sometimes...',
      ],
      gallery: [
        { src: '/images/gallery/bmw-m3-e30.jpg', title: 'BMW M3 E30', subtitle: 'Digital illustration' },
        { src: '/images/gallery/porsche-911-turbo.jpg', title: 'Porsche 911 Turbo', subtitle: 'Digital illustration' },
        { src: '/images/gallery/singer-930.jpg', title: 'Singer 930', subtitle: 'Digital illustration' },
        { src: '/images/gallery/bmw-m2.jpg', title: 'BMW M2', subtitle: 'Digital illustration' },
        { src: '/images/gallery/polestar-2.jpg', title: 'Polestar 2', subtitle: 'Digital illustration' },
        { src: '/images/gallery/merc-sl.jpg', title: 'Mercedes SL', subtitle: 'After Shane Baxley' },
        { src: '/images/gallery/911-night-race.jpg', title: '911 Night Race', subtitle: 'Digital illustration' },
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
      paragraphs: [
        'Open to design leadership and senior product design roles, AI product work, and design consulting.',
      ],
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
  { line: 'ai',   code: 'CS1', title: 'AI Case Studies',         subtitle: '3 stops · AI features, AI products, AI as the design medium' },
  { line: 'ent',  code: 'CS2', title: 'Enterprise Case Studies', subtitle: '3 stops · vision, workflows, and operator surfaces' },
  { line: 'pers', code: 'P',   title: 'Personal',                subtitle: '2 stops · who I am off the clock, and how to reach me' },
];

export function casesForLine(line: LineKey): CaseEntry[] {
  return CASES.filter((c) => c.line === line);
}
