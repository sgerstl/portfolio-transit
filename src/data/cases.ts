export type LineKey = 'ai' | 'ent' | 'pers';

export type CaseSlug =
  | 'epilog'
  | 'cal'
  | 'sim-racing'
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
  visualImage?: string;
  visualImageAlt?: string;
  visualLayout?: 'split' | 'full';
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
      visualImage: '/images/cases/epilog/epilog-events-framed.png',
      visualImageAlt: 'Epilog app Events screen in an iPhone frame, listing tracked seizures and auras',
      visualLayout: 'split',
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
      visualImage: '/images/cases/cal/cal-dashboard.jpeg',
      visualImageAlt: 'Cal app dashboard screen',
      visualLayout: 'split',
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
  /* PENDING CLIENT APPROVAL — re-enable when Milan signs off.
     See Slack DM 2026-05-12. Restoration: remove this comment
     wrapper, restore SECTIONS subtitle to "3 stops · AI features,
     AI products, AI as the design medium", re-add the CS1 row
     to DepartureBoard stops, and uncomment the matching lab
     anonymization entry in data/lab.ts.
  {
    slug: 'sim-racing',
    name: 'Sim Racing Coach',
    tagline: 'Race-engineer practice, designed into an AI product.',
    line: 'ai',
    readingMinutes: 6,
    body: {
      domains: ['Motorsports', 'AI Products', 'Domain Depth'],
      outcome:
        "Design consulting on an AI sim-racing telemetry tool. Reframed the analysis app as the AI agent's workspace, not a chat panel beside it. Designed a race engineer pattern that translates expert practice into UX for sim-racers who don't have an engineer. Four worked archetypes shipped against the product's telemetry schemas.",
      visualLabel: 'SIM RACING COACH · TELEMETRY VIEW',
      visualImage: '/images/cases/sim-racing/prototype-web-idle.png',
      visualImageAlt: 'Sim Racing Coach web prototype, idle state with agent rail',
      metrics: [
        { num: 'Domain', label: 'Race-engineer perspective brought to AI tooling for sim-racers' },
        { num: 'Reframe', label: 'Analysis surface as agent workspace, not chat panel' },
        { num: '4 archetypes', label: "Worked patterns shipped against the product's telemetry schemas" },
      ],
      claim:
        'I bring motorsports domain knowledge to AI product design. I use AI to scale expert practice and analysis so drivers at every level can benefit.',
      ctaHref: '/work/sim-racing',
    },
    detail: {
      chips: ['Consulting', 'AI', 'Agent UX', 'Sim-Racing'],
      hook: [
        'A founder shipping an AI sim-racing telemetry product asked for a design pass. The product had real telemetry data, a chat agent, and a polished analysis surface. Three working pieces, living in different containers.',
        'The user got data, an algorithmic score, and a chat window that could run queries. What they did not get was the experience of being walked through their own session by someone who knew what to look for.',
      ],
      sections: [
        {
          title: 'The agent and the workspace',
          subtitle: 'What the product already had, and what it was missing',
          paragraphs: [
            'The web app already had an AI surface: ten dimensions scored, each with a short coaching tip, all inside a modal. The desktop capture tool had a chat agent that ran corner queries and returned annotated track visualizations. The analysis surface was dense, accurate, demanding.',
            'The team had even shipped the right intent in one agentic feature: click a low-scoring dimension and dots appear on the track marking where the issue occurs. The execution stops halfway. The dots are not labeled. The view does not zoom. The user is left to manually find the corner and read it back to themselves.',
            'The agent had the data. The workspace had no agent thinking with the user inside it. Each surface was doing one piece of the job a real race engineer does in a single conversation.',
          ],
          decisions: [
            {
              title: 'Algorithmic scoring returns a conclusion, not an investigation.',
              body: 'A number on a dimension hides the analysis that produced it. The analysis is the part a self-coached racer needs to see, not the score.',
            },
            {
              title: 'A chat agent in a separate window is architecturally severed from the workspace.',
              body: 'The chat is functional but the user has to carry insights back into their own analysis context by hand. The agent and the work it is supposed to help with are in different rooms.',
            },
            {
              title: 'An agentic feature that stops halfway is worse than none.',
              body: 'A few dots on a map without labels or framing tells the user the agent saw something and then declined to explain it. The user does the rest of the agent\'s job for it.',
            },
          ],
          italicOutro:
            'The product had every ingredient. They were architected as if they belonged to different products.',
        },
        {
          title: 'Agent-as-workspace',
          subtitle: 'One structural move that reframed the whole product',
          paragraphs: [
            'The reframe was a single architectural commitment. The web app stops being an analysis tool with a chat panel. It becomes an AI agent surface, with the analysis view as the workspace the agent operates inside.',
            'Not chat-adjacent-to-data. Not three modes the user toggles between. Three states of one persistent agent rail: idle when the user opens a session and the agent has the floor, investigating when the agent narrates while the workspace annotates, exploring when the agent recedes and the user drives.',
            'Under that architecture sits the behavioral spec. A race engineer pattern, not a chat persona. Diagnose before prescribe. One primary correction per cycle. Specificity over generality. Annotate the workspace, do not just describe it. Suggest a follow-up so the conversation has somewhere to go.',
          ],
          decisions: [
            {
              title: 'Race engineer, not coach.',
              body: 'Coaching is one of the modes a race engineer operates in. Setup work, strategy, tire management are others. Naming the pattern at the role level keeps the door open wherever the product roadmap goes next, instead of pinning it to one of the modes.',
            },
            {
              title: 'Three states, not three modes.',
              body: "States shift the agent's prominence based on what the user is doing. Modes would have made the user choose. The transitions are the agent's responsibility, not the user's.",
            },
            {
              title: 'Diagnose before prescribe.',
              body: 'Tell the user what is wrong before suggesting anything different. The same restraint a real engineer applies, and the restraint that earns trust from a self-coached racer with strong opinions about their own driving.',
            },
          ],
          italicOutro:
            'The architecture is not a coaching tool that will need replacing when the next model arrives. It is the shape of the conversation the user will eventually have with the product wherever it grows.',
          screenshots: {
            columns: 2,
            images: [
              {
                src: '/images/cases/sim-racing/prototype-web-idle.png',
                alt: 'Web prototype, idle state with agent rail and surfaced findings',
                caption: 'Web: agent rail with findings surfaced',
              },
              {
                src: '/images/cases/sim-racing/prototype-desktop-trailer.png',
                alt: 'Desktop prototype, trailer surface with capture and findings preview',
                caption: 'Desktop: capture and trailer',
              },
            ],
          },
        },
        {
          title: 'Four worked archetypes',
          subtitle: 'Proving the pattern across question shapes',
          paragraphs: [
            'The pattern is generalizable, but generalizability needs proof. Four archetypes shipped, each handling a different shape of question, all running inside the same shell.',
            'Spatial questions: where on the track is this happening? The agent zooms the canvas, labels the moments through a corner, walks through what it sees, suggests the next thread to pull.',
            'Temporal questions: where in the session did something change, and why? Same architecture, different canvas, different supporting data, same investigative pattern around it.',
            'Distributional questions: how consistent is the driver across the session, and where should they look closer? The agent walks the lap, points out what is working before flagging what is not, then hands the depth navigation to the user.',
            'State-along-line questions: what was the car doing as it moved through that moment? A different visualization shape, the same conversational shell around it.',
            'The four archetypes were the proof, not the point. The point was that the architecture can carry the kind of question the product roadmap implies but does not yet have a surface for.',
          ],
          decisions: [
            {
              title: 'Each archetype is a question shape, not a screen.',
              body: 'Spatial, temporal, distributional, state-along-line. Four examples prove the architecture handles whatever question comes next, not that there are four views to ship.',
            },
            {
              title: 'Depth navigation lives inside an archetype.',
              body: 'An overview view and a drill-down view are two states of the same investigation, not two separate ones. The pattern handles the transition without leaving the conversation.',
            },
            {
              title: "Designed against the product's existing data.",
              body: 'Each archetype shaped to what the capture layer already produces. The design extends what the team has already built rather than asking for new infrastructure to land first.',
            },
          ],
          italicOutro:
            'The point of working four archetypes was never that there should be four. It was that one architecture can hold whatever the product asks of it next.',
          screenshots: {
            columns: 2,
            images: [
              {
                src: '/images/cases/sim-racing/corner-investigation.png',
                alt: 'Spatial investigation through a corner',
                caption: 'Spatial question',
              },
              {
                src: '/images/cases/sim-racing/session-arc.png',
                alt: 'Temporal investigation across a session',
                caption: 'Temporal question',
              },
              {
                src: '/images/cases/sim-racing/consistency-overview.png',
                alt: 'Distributional investigation across the lap',
                caption: 'Distributional question',
              },
              {
                src: '/images/cases/sim-racing/handling-state.png',
                alt: 'State-along-line investigation through a corner',
                caption: 'State-along-line question',
              },
            ],
          },
        },
      ],
      outcomeBeat: {
        title: 'What the engagement delivered',
        paragraphs: [
          "A conceptual diagnostic carrying the architectural argument. A working web prototype with the four archetypes. A desktop role redefinition from chat host to capture-and-trailer surface. All designed against the product's existing data layer. All aligned with the long-term direction the founder was building toward.",
          'The 20-hour timebox held. The handoff carried the architectural commitment, the worked archetypes, and a clean list of open questions for the next round.',
        ],
        highlight:
          "The honest test of a design engagement isn't whether it shipped. It's whether the architecture can carry the product where the founder said he wanted to take it.",
      },
    },
  },
  */
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
      visualImage: '/images/cases/brightly/brightly-dashboard.jpeg',
      visualImageAlt: 'Brightly platform dashboard with planned maintenance and at-risk assets',
      metrics: [
        { num: '$1.575B', label: 'Siemens acquisition' },
        { num: '74%', label: 'Customers excited by the future product direction' },
        { num: '5×', label: 'Increase in time on dashboard pages in user testing' },
      ],
      claim:
        'I lead design vision that holds up under acquisition-grade scrutiny.',
      ctaHref: '/work/brightly',
    },
    detail: {
      chips: ['Enterprise', 'Platform Vision', 'Design System', 'B2B SaaS'],
      hook: [
        'Brightly was acquired by Siemens for $1.575B. Before the deal closed, the platform vision was previewed to existing customers: 74% of conference attendees expressed excitement about the future product direction, 36% said they were more likely to renew. User testing on the functional prototypes saw time on dashboard pages increase 5×. NPS verbatims, gathered independently, validated the survey findings.',
        'The work behind those signals: vision design across 12 siloed products at Brightly, anchored to a complete corporate rebrand and a major client conference. A new design language. A unified design system and front-end-agnostic component library. North star designs for the integrated portfolio. A transition plan from siloed products to platform.',
      ],
      sections: [
        {
          title: 'Three surfaces, three arguments',
          subtitle: 'The hero screens, and the design intention behind each',
          paragraphs: [
            'Three hero surfaces did most of the work of carrying the platform claim. Each was a different argument the vision had to make.',
            'The dashboard was the moment a customer landed in the product and saw all of their work in one place: planned maintenance, team availability, at-risk assets, work orders waiting on triage. The decision was that the dashboard had to be role-based, customizable, actionable, and data-driven. Every part of that list answered a specific complaint customers had raised in the research.',
            "Asset health and suggested actions extended the dashboard's logic. Asset health was the system saying which equipment was likely to fail, on what timeline, with what financial exposure: predicted failure, estimated losses, recommended course of action. Suggested actions was the system proposing the next move with the recommended option marked. Together they collapsed the old workflow (jump between tools, read the data yourself, decide alone) into a single surface where the system did the analysis and the operator made the call.",
            'The design system itself was the third surface. A front-end-agnostic component library, branded and unified, paired with the new corporate design language. Not a documentation site. A working library that any product team could pull from regardless of stack, which is what made the platform claim implementable across 12 different products at once.',
          ],
          decisions: [
            {
              title: 'Dashboard principles framed as customer answers.',
              body: 'Role-based, customizable, actionable, data-driven. Each principle answered a specific complaint surfaced in the research mix (Pendo analytics, Aha! product feedback, Client Advisory Boards, client visits, internal SME interviews). The principles were not aesthetic. They were arguments back at the field.',
            },
            {
              title: 'Asset health as a three-part decision support surface.',
              body: 'Predicted failure plus estimated losses plus recommended course of action. The three together turn the surface from "data point about a piece of equipment" into "decision the operator can make right now." The pattern propagated through the suggested actions surface and gave the platform a consistent operator-AI relationship across products.',
            },
            {
              title: 'Component library as front-end agnostic.',
              body: 'A unified design system is worth less than a unified component library, because a design system still has to be re-implemented by every product team. The library was built front-end-agnostic so any product, on any stack, in any office, could pull components directly. That is what made the platform claim implementable rather than aspirational.',
            },
          ],
          italicOutro:
            'Hero screens earn their position by showing what the platform claim looks like when a customer scrolls through it. The argument lives in the screens, not next to them.',
          screenshots: {
            columns: 3,
            images: [
              {
                src: '/images/cases/brightly/brightly-dashboard.jpeg',
                alt: 'Brightly admin dashboard with planned maintenance, work performance, team center, and at-risk assets',
                caption: 'The Dashboard',
              },
              {
                src: '/images/cases/brightly/brightly-asset-health.jpeg',
                alt: 'Asset health surface with predicted failure trend, estimated losses, and recommended actions',
                caption: 'Asset Health',
              },
              {
                src: '/images/cases/brightly/brightly-suggested-actions.jpeg',
                alt: 'Suggested actions modal with options and a recommended action highlighted',
                caption: 'Suggested Actions',
              },
            ],
          },
        },
        {
          title: 'Twelve silos, one platform vision',
          subtitle: 'What the vision had to compress into a single product story',
          paragraphs: [
            "Brightly had assembled a portfolio of 12 siloed software products serving manufacturing, healthcare, education, and government. The portfolio's strategy said \"platform.\" The user experience said twelve different products under one logo, each with its own dashboard, its own data, its own workflows. Customers were saying it directly: poor landing-page experience, products that did not share datasets, disjointed workflows, no clear expectation for what the future looked like.",
            'Two business events anchored the work. A complete corporate rebrand, which gave the design language room to be redrawn from scratch rather than nudged from where it had been. And a major client conference, which set a deadline that everything had to be ready to show to existing customers in functional prototype form.',
            'As Manager of Product Design at Brightly, I led a team of seven designers distributed across Melbourne, London, Noida, Montreal, and the US. The structural work, the executive presentation, and the case for the reframe were mine. A senior designer on the team paired with me on the visual execution; most of what you would see in the prototypes is their craft. The two halves of the work fit together: the architecture decided what to argue, the visual design decided how to argue it.',
            'The deliverables stacked on each other. A new corporate design language anchored to the rebrand. A unified design system built on top. A front-end-agnostic UI component library any product team could implement against. North star designs for the integrated portfolio. A transition plan from current siloed products to the platform shape. The point of the stack was that each layer made the next one implementable rather than aspirational.',
          ],
          decisions: [
            {
              title: 'Tie the vision to two business events, not one.',
              body: 'The rebrand gave the design language permission to break with the past. The client conference gave the prototypes a real deadline and a real audience. Anchoring the vision to both meant the work had business justification on two axes, not just one.',
            },
            {
              title: 'Lead the structure, partner on the craft.',
              body: 'Managing a distributed seven-person design team while running the structural and presentation work meant getting clear on what I owned and what others owned. I led the architecture, the systems thinking, and the case to executives. A senior designer led the visual execution. Both halves had to be excellent for the work to be defensible.',
            },
            {
              title: 'A transition plan, not just a destination.',
              body: 'Vision design is easy to dismiss as aspirational. Pairing the North star designs with a transition plan from current products to platform made the work answerable to engineering: here is what we propose, here is how the existing portfolio gets there from where it is.',
            },
          ],
          italicOutro:
            'Strategic narratives say "platform." Design evidence says what the platform actually looks like when a customer clicks through it, what the design language allows, and how the existing products get there.',
          screenshots: {
            columns: 2,
            images: [
              {
                src: '/images/cases/brightly/brightly-new-brand.jpeg',
                alt: 'New Brightly brand identity with photography treatment showing three customers across industries',
                caption: 'The new brand',
              },
              {
                src: '/images/cases/brightly/brightly-design-system.jpeg',
                alt: 'Lumos Design System rendered as a product page, showing input field states and information graphics',
                caption: 'Design system as a product',
              },
            ],
          },
        },
      ],
      outcomeBeat: {
        title: 'What the work was for',
        paragraphs: [
          'The Chief Product Officer was happy enough with the work to put the prototypes into multiple high-stakes rooms. They went into board presentations supporting funding requests. They went into the acquisition-stage meetings with Siemens leading up to the deal. Brightly was acquired by Siemens for $1.575B.',
          'The design work did not cause the acquisition. It was the part of the story the acquirer needed to see to evaluate whether the platform claim had design proof underneath the strategic narrative.',
        ],
        highlight:
          'Design judgment at the layer above craft is what enterprise design vision actually means. Not making things prettier. Making the strategic claim verifiable before the business commits to it.',
      },
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
      visualImage: '/images/cases/fleet/fleet-yard-map.jpeg',
      visualImageAlt: 'Fleet yard management view with aerial map of dock and yard spots',
      metrics: [
        { num: '3 + 2 → 1', label: 'Tools and forms consolidated to a single workflow' },
        { num: 'Sole UX', label: 'Research, design, and pilot delivery' },
        { num: 'Shipped', label: 'Live with industrial users in cold-storage logistics' },
      ],
      claim:
        'I own design end-to-end on industrial products that have to work in physical-world conditions.',
      ctaHref: '/work/fleet',
    },
    detail: {
      chips: ['Industrial', 'Logistics', '0→1', 'Sole UX'],
      hook: [
        'Sole UX lead on a 0→1 yard-management product at Ndustrial. The shipped pilot consolidated three software tools and two paper forms into a single yard-management interface, deployed at a cold-storage third-party-logistics facility tracking hybrid electric trailers.',
        "Industrial conditions don't tolerate friction. Gloves on. Dust on the screen. Twelve trucks waiting on dock assignments. Every design decision was answerable to whether it survived the dock, not whether it looked clean in design review.",
      ],
      sections: [
        {
          title: 'Three surfaces, one workflow',
          subtitle: 'The hero screens, and the design intention behind each',
          paragraphs: [
            'Three hero surfaces carried the workflow. Each replaced a piece of the old way of doing things. Together they collapsed the jump-between-tools-and-clipboards model into a single screen the yard manager could run their dock from.',
            "The yard management view was the operational center. An aerial map rendered every dock door and yard spot as a chip showing what was plugged in, plugged out, or empty. The trailer list on the left was searchable and sortable. Selecting any chip or list item opened a detail panel alongside the map: trailer ID, carrier, eTRU status, driver, and an audit log, all without losing the manager's sense of the whole yard.",
            'Driver communication moved off radios and phone calls onto text-based messages inside the interface. Asynchronous, recordable, threaded against the trailer. Quick-action templates for the most common messages (load ready for check-out, return to front desk, await further instruction) handled the bulk of routine traffic with one tap.',
            'Check-in was the consolidation made visible. What used to require three software tools and two paper forms became a single modal: pick a spot, confirm the eTRU status, done. When the yard was at capacity, the waitlist absorbed the overflow without breaking the main flow.',
          ],
          decisions: [
            {
              title: 'Consolidation, not aggregation.',
              body: 'Three software tools and two paper forms were not consolidated by bundling them into one screen. They were consolidated by deciding which jobs each had been doing, which jobs the new interface had to do, and which ones could disappear entirely because they had been workarounds in the first place.',
            },
            {
              title: 'Driver comms as text, not radio.',
              body: "Radio works for one person speaking to one driver at a time, in real time, in their general direction. Text works for a yard manager handling twelve trucks in parallel. The change was not a UI choice. It was a choice about which job comms was supposed to do in this product.",
            },
            {
              title: 'Detail alongside the map, not a page away from it.',
              body: "The trailer detail opens as a side panel, not as a navigation. The map stays visible the whole time. That decision keeps the yard manager oriented to the whole facility while drilling into one trailer, which matters because the next decision is almost never about the trailer in isolation. It's about how that trailer fits into the dock assignment, the waitlist, and the eight other trailers waiting their turn.",
            },
          ],
          italicOutro:
            'Three hero screens did the work of replacing three software tools and two paper forms. Each one named what the old way had been doing, what the new way was doing instead, and which job the user was actually trying to get done.',
          screenshots: {
            columns: 2,
            images: [
              {
                src: '/images/cases/fleet/fleet-yard-map.jpeg',
                alt: 'Yard management view with aerial map showing dock and yard spots, trailer list on the left',
                caption: 'Yard map',
              },
              {
                src: '/images/cases/fleet/fleet-trailer-detail.jpeg',
                alt: 'Trailer detail panel with carrier, driver, eTRU status, and audit log, alongside the dock spots',
                caption: 'Trailer detail',
              },
              {
                src: '/images/cases/fleet/fleet-driver-comms.jpeg',
                alt: 'Driver messaging panel with auto-sent appointment confirmation and quick-action templates',
                caption: 'Driver comms',
              },
              {
                src: '/images/cases/fleet/fleet-check-in.jpeg',
                alt: 'Check-in trailer modal with yard spot grid and eTRU trailer indicator, with waitlist fallback',
                caption: 'Check-in',
              },
            ],
          },
        },
        {
          title: 'Sole UX, research through ship',
          subtitle: 'What it took to design end-to-end for an industrial pilot',
          paragraphs: [
            "Sole UX at Ndustrial meant being the only UX resource at the company, not just on this project. Yard management was running in parallel with the Power Quality and Demand Response work for industrial customers, plus whatever else needed design judgment that week. Research, workflow design, visual design, prototypes, hand-off to engineering, pilot support: the work either happened or it didn't get done, across whichever project was loudest at the moment.",
            'Research happened on the dock. The product was not designed in a conference room and shipped to operators to use. It was shaped by watching yard managers work, watching drivers wait, watching paperwork accumulate. The constraints (gloves, dust, time pressure) were not assumptions. They were observations from the people who were going to use the thing.',
            'Industrial conditions shaped every design decision. Every minute spent in the interface was a minute not spent moving a truck, so cognitive load had to come down. The interface had to compete with paper, radios, and walking the dock, and lose less often than it won.',
            "The pilot deployed at one facility. Not an enterprise rollout, not a category-wide product, not a broad-scale launch. One real customer site, with real yard managers running their actual dock through it. That is what 'shipped' meant in this case, and what made the work credible: the interface worked under the actual conditions where it would have to work.",
          ],
          decisions: [
            {
              title: 'Sole UX for the whole company, end to end.',
              body: 'I was the only UX resource at Ndustrial, owning the entire design function for the company while balancing the needs of multiple active projects in parallel. No design partner to defer to, no specialist to hand off to, and no other UX work happening anywhere else in the org that would have gotten done on its own. A different competency than leading a team, and worth claiming as a separate signal.',
            },
            {
              title: 'Research where the work happens.',
              body: 'User research at the customer site was not a methodology choice. It was the only way to know what the actual constraints were. The conditions a yard manager works under cannot be reproduced in an office, and assumptions that get past the conference room get caught on the dock.',
            },
            {
              title: 'Pilot scope as honest framing.',
              body: 'One facility shipping a real pilot is different from a category-wide rollout. Naming the scope (a single customer site, a single pilot) keeps the work credible and lets the reader trust the rest of the case. Overclaiming on scale undermines everything else the case is trying to say.',
            },
          ],
          italicOutro:
            "Industrial design judgment doesn't come from working on industrial products. It comes from being in the rooms where industrial work actually happens. The interface either survives those rooms or it doesn't.",
        },
      ],
      outcomeBeat: {
        title: 'What shipped',
        paragraphs: [
          'The pilot shipped during my tenure at Ndustrial. Yard managers at a cold-storage third-party-logistics facility ran their dock through it instead of jumping between three software tools and two paper forms. The broader Ndustrial program (including shore-power infrastructure for the hybrid electric trailers) continued after I was laid off in mid-2025.',
          "The case here is not about scale. It is about whether an industrial product designed by one person, at one company, for one pilot site, can hold up in real industrial conditions. This one did.",
        ],
        highlight:
          "Industrial design end-to-end means sole UX, research through ship, no specialists to hand off to, and an interface that either survives the dock or it doesn't.",
      },
    },
  },
  {
    slug: 'pqdr',
    name: 'Power Quality and Demand Response',
    tagline: 'AI insight, operator decision. 200+ industrial locations.',
    line: 'ent',
    readingMinutes: 5,
    body: {
      domains: ['Energy', 'Industrial', 'Operator UX'],
      outcome:
        'Operator surfaces for AI-powered energy intelligence. Power Quality and Demand Response as two distinct operator views on one underlying AI system. Deployed across more than 200 industrial sites of a single customer. Penalty avoidance was the structural value, not a measured-savings claim.',
      visualLabel: 'PQ + DR · OPERATOR DASHBOARD',
      visualImage: '/images/cases/pqdr/pq-one-line.png',
      visualImageAlt: 'Power Quality at-a-glance dashboard surfacing high-impact assets and efficiency losses',
      metrics: [
        { num: '200+', label: 'Industrial locations of one customer' },
        { num: '2 surfaces', label: 'Power Quality and Demand Response built on one AI system' },
        { num: 'Operators', label: 'AI surfaces, operators decide' },
      ],
      claim:
        'I design operator-facing surfaces that turn AI insight into industrial-scale operational decisions.',
      ctaHref: '/work/pqdr',
    },
    detail: {
      chips: ['Enterprise', 'AI Insight', 'Operator UX', 'Industrial'],
      hook: [
        'AI-powered energy intelligence at industrial facilities. Operator-facing surfaces deployed across 200+ industrial locations of a single large customer at Ndustrial.',
        'Two distinct surfaces on one underlying AI system. Power Quality, a dashboard where facility managers identify equipment likely causing efficiency losses. Demand Response, an alert surface where operators curtail operations in time to avoid utility penalties that can run into six figures annually. Both fed by the same AI analysis layer underneath.',
      ],
      sections: [
        {
          title: 'Two surfaces, one system',
          subtitle: 'What each surface was designed to make decidable',
          paragraphs: [
            "One AI analysis layer. Two operator-facing surfaces. The decision to split the operator view rather than the AI was structural: the AI did the same kind of analysis in both cases, but the human work it triggered was fundamentally different in shape.",
            'Power Quality was the diagnostic surface. The AI analyzed power quality data across the facility and the dashboard surfaced which equipment was most likely causing efficiency losses. Facility managers could see, at a glance, where their power was being wasted and which assets to investigate first.',
            'Demand Response was the time-sensitive surface. When the utility signaled an impending peak-demand event, the alert surface notified facility or regional managers in time to curtail operations and comply with the program. The penalty for non-compliance with peak-shaving events can run into six figures annually for an industrial site. The interface was designed to make the curtailment decision fast, clear, and accountable.',
            "Treating these as two operator views on one AI system, rather than one combined screen or two separate products, was the move. The AI's job was the same in both cases: analyze the data, surface what mattered. The operator's job was different. Diagnostic decisions take minutes or hours. Demand-response decisions take seconds. The two surfaces let each decision happen at its own speed.",
          ],
          decisions: [
            {
              title: 'Split the operator view, not the AI.',
              body: 'The AI analysis is shared. The decisions it triggers are not. Power Quality is a diagnostic decision (which equipment to investigate next) measured in minutes or hours. Demand Response is a time-sensitive decision (curtail now or pay the penalty) measured in seconds. Pretending one surface could serve both would have made both worse.',
            },
            {
              title: 'Diagnostic surface: surface what matters, not all the data.',
              body: "The Power Quality dashboard's job was to point at the equipment most likely causing efficiency losses, not to show every event in the facility's history. Facility managers were already drowning in data. The AI's job was to filter; the design's job was to make the filter trustworthy.",
            },
            {
              title: 'Time-sensitive surface: design for the window, not the user.',
              body: 'Demand Response had a fixed clock. The utility signal arrived, the curtailment window opened, the penalty avoidance depended on action within that window. The surface had to make the decision visible, the consequences clear, and the action trivial to execute. Anything else competed with the window.',
            },
          ],
          italicOutro:
            "Operator-facing UX for AI insight is not the same problem as designing the AI itself. The AI's correctness is one question. Whether the operator can act on it within the time the situation allows is a different one.",
          screenshots: {
            columns: 2,
            images: [
              {
                src: '/images/cases/pqdr/pq-one-line.png',
                alt: 'Power Quality at-a-glance dashboard surfacing the assets most likely causing efficiency losses',
                caption: 'Power Quality: at a glance',
              },
              {
                src: '/images/cases/pqdr/dr-overview.png',
                alt: 'Demand Response overview showing peak-demand events and curtailment status across facilities',
                caption: 'Demand Response: overview',
              },
            ],
          },
        },
        {
          title: 'AI insight, operator decision',
          subtitle: 'Where AI output meets the people who have to act on it',
          paragraphs: [
            "Designing operator-facing surfaces for AI output is a different competency than designing AI features. The AI engineer's question is whether the model produces correct output. The operator UX designer's question is whether the human downstream can recognize the output, trust it, and act on it within the time the situation allows.",
            "Power Quality and Demand Response were the same answer to two versions of that question. Both surfaces gave the operator a view onto AI-generated analysis. Neither gave the operator the AI itself. The design move in both cases was to find the place where the operator's decision actually happens, then to surface the AI's contribution at that exact place.",
            'Deployed across 200+ industrial locations of one customer, the system met operators where their decisions happened. Facility managers at the site for the diagnostic work. Facility or regional managers in the curtailment window for time-sensitive response. The operator was always the actor. The AI was always the analyst.',
            'The structural value claim is the honest version: penalty avoidance built into the operator decision flow at industrial scale. Measured savings at a given site depended on operational data I never personally saw post-deployment. Naming the structural framing keeps the case credible; claiming dollars I cannot verify would not.',
          ],
          decisions: [
            {
              title: 'Designing for AI output, not designing the AI.',
              body: "Different problem than designing the model. The AI's correctness is one question. Whether the operator can act on what the AI surfaces in the time the situation allows is a different one. Operator UX for AI insight is its own design competency.",
            },
            {
              title: 'The operator is the actor. The AI is the analyst.',
              body: "The system was never designed to replace the operator's judgment. It was designed to make the operator's judgment faster and better informed. Every surface decision followed from that division of labor.",
            },
            {
              title: 'Structural value, not measured savings.',
              body: 'The product was designed to help facilities avoid utility penalties that can run into six figures annually per industrial site. That is the structural framing. Measured savings at a specific site depended on conditions I never saw post-deployment, so the honest version of value is the structural one, not a dollar figure I cannot verify.',
            },
          ],
          italicOutro:
            "The portfolio claim is not 'I shipped a feature that saved X dollars.' It is 'I designed the surfaces that turn AI insight into operator action at industrial scale.' One of those is provable from the design. The other depends on operational data I don't have.",
          screenshots: {
            columns: 2,
            images: [
              {
                src: '/images/cases/pqdr/pq-detail.png',
                alt: 'Power Quality detail view drilling into a specific asset, with event timeline and analysis',
                caption: 'Power Quality: asset detail',
              },
              {
                src: '/images/cases/pqdr/dr-facility-detail.png',
                alt: 'Demand Response facility detail with curtailment window, action, and accountability',
                caption: 'Demand Response: facility detail',
              },
            ],
          },
        },
      ],
      outcomeBeat: {
        title: 'What the system was for',
        paragraphs: [
          'Deployed across more than 200 industrial locations of a single large customer at Ndustrial. Two operator surfaces, Power Quality and Demand Response, running on one AI analysis layer underneath. Designed to help facilities avoid utility penalties that can run into six figures annually for non-compliance with peak-shaving events.',
          'Post-deployment performance data is not mine to claim. I designed the system; I did not personally see how each of the 200+ sites used it after rollout. The honest version of the work is what was shipped and what it was structured to enable, not a measured outcome number.',
        ],
        highlight:
          "Operator UX for AI insight is its own kind of design judgment. The AI can be right and the design can still fail if the operator can't act on what the AI surfaces in the time the situation allows.",
      },
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
  { line: 'ai',   code: 'CS1', title: 'AI Case Studies',         subtitle: '2 stops · AI features and AI as the design medium' },
  { line: 'ent',  code: 'CS2', title: 'Enterprise Case Studies', subtitle: '3 stops · vision, workflows, and operator surfaces' },
  { line: 'pers', code: 'P',   title: 'Personal',                subtitle: '2 stops · who I am off the clock, and how to reach me' },
];

export function casesForLine(line: LineKey): CaseEntry[] {
  return CASES.filter((c) => c.line === line);
}
