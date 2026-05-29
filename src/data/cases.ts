import { t, type L10n } from '../lib/i18n';

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
  num: L10n;
  label: L10n;
  linkText?: string;
  linkHref?: string;
};

export type CaseBody = {
  domains: L10n[];
  outcome: L10n;
  visualLabel: L10n;
  visualImage?: string;
  visualImageAlt?: L10n;
  visualLayout?: 'split' | 'full';
  metrics: CaseMetric[];
  claim: L10n;
  ctaHref: string;
};

export type CaseDecision = { title: L10n; body: L10n };
export type CaseScreenshot = { src: string; alt: L10n; caption?: L10n };
export type CaseScreenshotGrid = { columns: 2 | 3; images: CaseScreenshot[] };

export type CaseSection = {
  title: L10n;
  subtitle: L10n;
  paragraphs: L10n[];
  decisions?: CaseDecision[];
  italicOutro?: L10n;
  tryIts?: L10n[];
  screenshots?: CaseScreenshotGrid;
};

export type CaseDetail = {
  demoUrl?: string;
  chips?: L10n[];
  hook: L10n[];
  sections: CaseSection[];
  outcomeBeat?: {
    title: L10n;
    paragraphs: L10n[];
    highlight?: L10n;
  };
};

export type ContactLink = {
  href: string;
  icon: 'email' | 'linkedin';
  label: L10n;
  value: string;
};

export type GalleryPiece = {
  src: string;
  title: string;
  subtitle: L10n;
};

export type PersonalBody = {
  paragraphs?: L10n[];
  links?: ContactLink[];
  gallery?: GalleryPiece[];
};

export type CaseEntry = {
  slug: CaseSlug;
  name: string;
  tagline: L10n;
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
    tagline: t(
      'AI caught a drug interaction. The neurologist confirmed it.',
      'Die KI hat eine Wechselwirkung erkannt. Der Neurologe hat sie bestätigt.',
    ),
    line: 'ai',
    readingMinutes: 4,
    body: {
      domains: [
        t('Healthcare', 'Gesundheitswesen'),
        t('Personal AI', 'Persönliche KI'),
        t('Wearables-adjacent', 'Wearables-nah'),
      ],
      outcome: t(
        "An app built for one user with epilepsy. It's used daily to log events as the user experiences them. The AI Insights built into the app used the tracked data to surface an adverse drug interaction. A drug prescribed by the user's primary care physician was inhibiting the absorption of the anti-epileptic drugs the user depends on. This information was brought to the neurologist and they confirmed the interaction. The neurologist independently arrived at the same treatment direction the AI had suggested.",
        'Eine App für einen einzigen Nutzer mit Epilepsie. Wird täglich genutzt, um Ereignisse direkt nach dem Erleben zu protokollieren. Die in die App eingebauten KI-Insights haben aus den Daten eine schädliche Wechselwirkung erkannt. Ein vom Hausarzt verschriebenes Medikament hemmte die Aufnahme der Anti-Epileptika, auf die der Nutzer angewiesen ist. Diese Information wurde dem Neurologen vorgelegt, und er hat die Wechselwirkung bestätigt. Der Neurologe ist unabhängig zur selben Behandlungsrichtung gekommen, die die KI vorgeschlagen hatte.',
      ),
      visualLabel: t('EPILOG · INSIGHTS SCREEN', 'EPILOG · INSIGHTS-SCREEN'),
      visualImage: '/images/cases/epilog/epilog-events-framed.png',
      visualImageAlt: t(
        'Epilog app Events screen in an iPhone frame, listing tracked seizures and auras',
        'Epilog App Events-Screen in einem iPhone-Rahmen, mit aufgelisteten Anfällen und Auren',
      ),
      visualLayout: 'split',
      metrics: [
        { num: t('1', '1'), label: t('Active daily user with epilepsy', 'Aktiver Nutzer mit Epilepsie, täglich') },
        {
          num: t('Confirmed', 'Bestätigt'),
          label: t(
            'Neurologist independently reached the same conclusion',
            'Neurologe ist unabhängig zur selben Schlussfolgerung gekommen',
          ),
        },
        {
          num: t('Live', 'Live'),
          label: t('PWA running at', 'PWA läuft unter'),
          linkText: 'epilog-demo.scottgerstl.com',
          linkHref: 'https://epilog-demo.scottgerstl.com',
        },
      ],
      claim: t(
        'I design AI features that produce clinical-grade outcomes. Surfacing patterns a clinician verifies and acts on.',
        'Ich entwerfe KI-Features, die klinisch verwertbare Ergebnisse liefern. Muster zutage bringen, die ein Arzt bestätigen und auf die er reagieren kann.',
      ),
      ctaHref: '/work/epilog',
    },
    detail: {
      demoUrl: 'https://epilog-demo.scottgerstl.com',
      chips: [t('Personal', 'Persönlich'), t('Health', 'Gesundheit'), t('AI', 'KI'), t('PWA', 'PWA')],
      hook: [
        t(
          'A seizure and aura tracker built for a family member. Log an event in seconds, find patterns across months, and surface insights that change a clinical conversation.',
        ),
        t(
          "Its AI analysis caught a drug interaction their GP had missed: a fiber supplement was interfering with their anti-epileptic medication. They brought the finding to their neurologist, stopped the supplement, and seizure activity went down.",
        ),
      ],
      sections: [
        {
          title: t('Understanding the constraint'),
          subtitle: t('What it took to define the right problem'),
          paragraphs: [
            t(
              "Someone you love has epilepsy. You watch them try to log an event after a seizure or aura, still foggy, motor control off, cognitive function not fully back online. The event is over, but the aftermath is real. That's not a user story you write on a whiteboard. It's something you understand by being in the room.",
            ),
            t('Three constraints came out of that proximity:'),
          ],
          decisions: [
            {
              title: t('Log in seconds while still recovering.'),
              body: t(
                "Events get logged in the aftermath, when brain function is still impaired. If the logging flow requires concentration, the data doesn't get captured. This wasn't a performance goal. It was a clinical one.",
              ),
            },
            {
              title: t('Find correlations without being a data analyst.'),
              body: t(
                'The calendar and insights views needed to surface patterns visually, without an interpretation step. A list of events tells you what happened. A calendar tells you what the pattern is.',
              ),
            },
            {
              title: t('Serve the caregiver relationship too.'),
              body: t(
                'Data collected for personal use is only half the value. The other half is the conversation between a patient and their neurologist. Designing for that conversation was a first-class requirement.',
              ),
            },
          ],
          italicOutro: t(
            'AI can build a health tracker in an afternoon. Knowing which three constraints actually matter requires sitting in the room where the problem lives.',
          ),
          tryIts: [
            t(
              'Open the add flow and walk through logging a seizure. Every input is a single gesture: no typing, no scrolling, no decisions that require concentration.',
            ),
          ],
          screenshots: {
            columns: 3,
            images: [
              { src: '/images/cases/epilog/epilog-log-event.jpeg', alt: t('Event type selection'), caption: t('Type selection') },
              { src: '/images/cases/epilog/epilog-aura-details.jpeg', alt: t('Severity and duration'), caption: t('Severity + duration') },
              { src: '/images/cases/epilog/epilog-aura-characteristics.jpeg', alt: t('Characteristics'), caption: t('Characteristics') },
            ],
          },
        },
        {
          title: t('Knowing what to kill'),
          subtitle: t('Why the best design decision was deleting a feature'),
          paragraphs: [
            t(
              "Early on, I built a medication reminder system. Push notifications at dosing times, confirmation flows, the whole pattern you'd expect. It didn't survive first contact with real use.",
            ),
            t(
              "The problem wasn't the reminders. It was the assumption. Most of the time, medication is taken on schedule. Building a system that demanded confirmation twice a day created friction on the 95% of days when everything was fine. The user stopped engaging with the app entirely.",
            ),
            t(
              'So I stripped it out and inverted the model: assume adherence, only capture deviations. A "Missed Dose" event type replaced the entire notification system. One tap when something goes wrong, silence when it doesn\'t.',
            ),
          ],
          italicOutro: t(
            'AI can generate a notification system in minutes. Recognizing that the right move is to delete it requires judgment that only comes from watching someone actually use it.',
          ),
          tryIts: [
            t(
              'Tap the + button and look at the event types. "Missed Medication" is a first-class event, not a setting buried in a menu. That\'s the entire medication tracking system.',
            ),
          ],
        },
        {
          title: t('The outcome'),
          subtitle: t('How the AI caught something a doctor missed'),
          paragraphs: [
            t(
              "The user's seizure activity had been increasing over several weeks. They'd been logging consistently: seizures, auras, missed doses, sleep data from their wearable. They ran the AI analysis.",
            ),
            t(
              "The analysis flagged something unexpected: a potential interaction between psyllium husk, a fiber supplement their GP had prescribed for digestive issues, and their anti-epileptic medication. Psyllium husk can interfere with drug absorption when taken at the same time. The GP hadn't considered this. It's not their domain.",
            ),
            t('The user brought the finding to their neurologist. The neurologist confirmed the concern. They stopped the supplement. Seizure activity decreased.'),
            t(
              "An AI tool, built by one designer, caught something a doctor missed. Not because the AI was smarter than the doctor. Because it had the right data, in the right context, and surfaced the right question.",
            ),
          ],
          italicOutro: t(
            "The AI didn't replace clinical judgment. The designer's job was knowing what data to collect, how to frame the output, and when to get out of the way. That's the part AI can't do for you.",
          ),
          tryIts: [
            t(
              'Open the Insights tab and switch to "AI Analysis." Tap "Analyze my data" to see the kind of output the tool produces. The demo uses a curated dataset, but the structure mirrors real results.',
            ),
            t(
              'Head to the Export tab and tap "Export PDF." The generated report is structured for a neurologist visit: findings, medication history, and event timeline in a format that respects their time.',
            ),
          ],
          screenshots: {
            columns: 2,
            images: [
              { src: '/images/cases/epilog/epilog-summary.jpeg', alt: t('Insights summary'), caption: t('Pattern analysis') },
              { src: '/images/cases/epilog/epilog-export.jpeg', alt: t('PDF export'), caption: t('Clinical PDF export') },
            ],
          },
        },
      ],
    },
  },
  {
    slug: 'cal',
    name: 'Cal',
    tagline: t(
      'AI as deliverable. AI as builder. AI inside the product.',
      'KI als Ergebnis. KI als Erbauer. KI im Produkt selbst.',
    ),
    line: 'ai',
    readingMinutes: 3,
    body: {
      domains: [
        t('Cycling', 'Radsport'),
        t('Personal AI', 'Persönliche KI'),
        t('Practice', 'Praxis'),
      ],
      outcome: t(
        'Workout planning app with AI at three layers: as design deliverable, as builder, and inside the product. Research to shipped in 5 days. Three real users. End-to-end ownership from prompt to PWA.',
        'Workout-Planungs-App mit KI auf drei Ebenen: als Design-Ergebnis, als Erbauer und im Produkt selbst. Von der Recherche bis zur Auslieferung in 5 Tagen. Drei echte Nutzer. End-to-End-Verantwortung vom Prompt bis zur PWA.',
      ),
      visualLabel: t('CAL · LIVE PLAN DEMO', 'CAL · LIVE PLAN DEMO'),
      visualImage: '/images/cases/cal/cal-dashboard.jpeg',
      visualImageAlt: t('Cal app dashboard screen', 'Cal App Dashboard-Screen'),
      visualLayout: 'split',
      metrics: [
        {
          num: t('3', '3'),
          label: t(
            'Layers of AI: as deliverable, as builder, in product',
            'Ebenen von KI: als Ergebnis, als Erbauer, im Produkt',
          ),
        },
        {
          num: t('5 days', '5 Tage'),
          label: t('Research to shipped, end-to-end', 'Von der Recherche bis zur Auslieferung, End-to-End'),
        },
        {
          num: t('Live', 'Live'),
          label: t('Working app at', 'Funktionierende App unter'),
          linkText: 'cal-demo.scottgerstl.com',
          linkHref: 'https://cal-demo.scottgerstl.com',
        },
      ],
      claim: t(
        'I am AI-fluent at every layer of design. Research, analysis, building, shipping.',
        'Ich bin KI-versiert auf jeder Design-Ebene. Recherche, Analyse, Bauen, Ausliefern.',
      ),
      ctaHref: '/work/cal',
    },
    detail: {
      demoUrl: 'https://cal-demo.scottgerstl.com',
      chips: [t('Personal', 'Persönlich'), t('AI', 'KI'), t('Fitness', 'Fitness'), t('PWA', 'PWA')],
      hook: [
        t(
          "The code didn't take long. What took time was everything the AI couldn't do: deciding what to build, evaluating whether the output was trustworthy, and catching the interaction patterns that were technically correct but experientially wrong.",
        ),
        t(
          "When production velocity is cheap, judgment becomes expensive. That's the shift this project is about.",
        ),
      ],
      sections: [
        {
          title: t('When execution is free, judgment is expensive'),
          subtitle: t('What building at speed revealed'),
          paragraphs: [
            t(
              "Cal shipped in 5 days. Claude Code produced functioning UI, wired-up components, and working API integrations faster than any developer handoff I've experienced. But the timeline isn't a boast. It's a data point about where the design effort went.",
            ),
            t(
              'What took time was the evaluation loop. Running each generated plan through the same criteria a human trainer would: Does this progression make sense for someone at this fitness level? Are the rest periods appropriate for the intensity? Would a real athlete trust this enough to follow it for six weeks?',
            ),
            t(
              'Zero visible AI scaffolding. The experience reads as a polished, intentional product, not a prototype. That\'s not because the AI was good enough on its own. It\'s because the evaluation criteria were specific enough to catch what "good enough" actually means.',
            ),
          ],
          italicOutro: t(
            "The role stops being about making things and starts being about deciding what's worth making and whether what was made is good enough.",
          ),
          tryIts: [
            t(
              'Browse the plan overview and tap into a day. The warmup sets, progressive overload, and rest periods are all AI-generated from one profile. Notice how injury accommodations (lower back) shape exercise selection across every session.',
            ),
          ],
          screenshots: {
            columns: 2,
            images: [
              { src: '/images/cases/cal/cal-active-workout.jpeg', alt: t('Active workout'), caption: t('Live workout') },
              { src: '/images/cases/cal/cal-workout-detail.jpeg', alt: t('Workout detail'), caption: t('Workout detail') },
            ],
          },
        },
        {
          title: t('The prompt is the deliverable'),
          subtitle: t("Why the most important design artifact isn't visual"),
          paragraphs: [
            t(
              "The AI prompt for plan generation is a 400-word structured brief that reads more like a creative brief than a software function. It defines Cal's persona, communication style, hard constraints (training days, injuries, equipment), soft constraints (weekly progression themes, RPE modulation), and the exact JSON schema the UI depends on.",
            ),
            t(
              "I treated this prompt the way I'd treat any design artifact: iterating on it, running heuristic evaluations against its output, and refining based on what the AI produced rather than what I expected. The prompt went through more revisions than any single screen in the app.",
            ),
          ],
          decisions: [
            {
              title: t('Persona in two sentences, not two paragraphs.'),
              body: t(
                '"Be direct, technical, and motivational. Avoid mechanical metaphors." That second sentence came from v1 output that read like an instruction manual. One exclusion changed the entire tone.',
              ),
            },
            {
              title: t('"No exceptions" is load-bearing.'),
              body: t(
                '"Max 3 working sets per exercise. No exceptions." Removed that phrase once in testing. The model added a 4th set "for advanced athletes." Constraint specificity replaces judgment calls you don\'t want delegated.',
              ),
            },
            {
              title: t('Phase names over phase numbers.'),
              body: t(
                'Weeks 1-6 became Foundation, Accumulate, Intensify, Peak. Named phases give the model a conceptual anchor for each block. This produced more coherent progressions than numeric targets alone.',
              ),
            },
          ],
          italicOutro: t(
            'Any team shipping AI features needs this distinction: the prompt is a design artifact, not an engineering concern. The quality of AI output is a design outcome.',
          ),
          tryIts: [
            t(
              'Watch the plan generate in the demo. The briefing, week themes, and exercise selections all come from a single structured prompt. Tap into any week to see how constraints like "max 3 working sets" and injury accommodations carry through.',
            ),
          ],
          screenshots: {
            columns: 2,
            images: [
              { src: '/images/cases/cal/cal-plan-overview.jpeg', alt: t('Plan overview'), caption: t('Plan generation') },
              { src: '/images/cases/cal/cal-week-sessions.jpeg', alt: t('Week sessions'), caption: t('Week structure') },
            ],
          },
        },
        {
          title: t('What the voice taught me'),
          subtitle: t('Why the hardest UX problems are physical, not digital'),
          paragraphs: [
            t(
              "The voice control system is the feature I'm most honest about. It works. It's also the roughest part of the app, and the reasons why are instructive.",
            ),
            t(
              'The architecture is sound: two-tier parsing with local regex handling ~90% of commands instantly (no network round-trip) and Claude Haiku as a fallback for edge cases. ElevenLabs TTS for synthesized coaching cues, with IndexedDB caching to avoid re-fetching repeated phrases.',
            ),
            t(
              'The failure modes are physical, not digital. A missed "done" command mid-set means the user has to touch their phone between reps, exactly the friction the feature was supposed to eliminate. Commands fired twice when the transcript updated incrementally. Haiku triggered on background noise that regex correctly ignored. Each fix revealed a new edge case.',
            ),
            t(
              "This isn't a solvable problem in the traditional sense. It's a calibration problem that requires real-world testing with real users in gyms. Heuristic evaluation in a quiet office catches maybe 30% of failure modes. The other 70% only appear under physical use conditions.",
            ),
          ],
          italicOutro: t(
            'Voice UX requires a different evaluation methodology than visual UX. If your product has voice features, the test environment is part of the design spec, not an afterthought.',
          ),
          tryIts: [
            t(
              'Start a workout in the demo, then tap the microphone icon at the bottom of the screen to activate voice control. Try saying "done" to complete a set, or "skip rest" to jump ahead. The two-tier parsing handles most commands locally with no network delay.',
            ),
          ],
          screenshots: {
            columns: 2,
            images: [
              { src: '/images/cases/cal/cal-session-complete.jpeg', alt: t('Session complete'), caption: t('Session summary') },
              { src: '/images/cases/cal/cal-performance.jpeg', alt: t('Performance tracking'), caption: t('Progress tracking') },
            ],
          },
        },
      ],
      outcomeBeat: {
        title: t('What Cal is now'),
        paragraphs: [
          t(
            'Cal runs as the coach I use for my own training. The plans hold up across six-week cycles. Voice control has its rough edges, but it does the one thing it was supposed to do: keeps my hands off the phone between sets. Both plan types, strength and mobility, generate from a single profile, and the two halves of the week support each other instead of competing for attention.',
          ),
        ],
        highlight: t(
          "That's the honest test for an AI-built product. Not whether it shipped fast, but whether it's still the tool you reach for when you have other options.",
        ),
      },
    },
  },
  {
    slug: 'sim-racing',
    name: 'Sim Racing Coach',
    tagline: t(
      'Race-engineer practice, designed into an AI product.',
      'Race-Engineer-Praxis, in ein KI-Produkt eingebaut.',
    ),
    line: 'ai',
    readingMinutes: 6,
    body: {
      domains: [
        t('Motorsports', 'Motorsport'),
        t('AI Products', 'KI-Produkte'),
        t('Domain Depth', 'Domänenwissen'),
      ],
      outcome: t(
        "Design consulting on an AI sim-racing telemetry tool. Reframed the analysis app as the AI agent's workspace, not a chat panel beside it. Designed a race engineer pattern that translates expert practice into UX for sim-racers who don't have an engineer. Four worked archetypes shipped against the product's telemetry schemas.",
        'Designberatung für ein KI-Telemetrie-Tool im Sim-Racing. Die Analyse-App neu gerahmt als Arbeitsfläche des KI-Agenten, nicht als Chat-Panel daneben. Ein Race-Engineer-Pattern entworfen, das Expertenpraxis in UX für Sim-Racer übersetzt, die keinen Ingenieur haben. Vier ausgearbeitete Archetypen ausgeliefert, gegen die Telemetrie-Schemata des Produkts.',
      ),
      visualLabel: t('SIM RACING COACH · TELEMETRY VIEW', 'SIM RACING COACH · TELEMETRIE-ANSICHT'),
      visualImage: '/images/cases/sim-racing/prototype-web-idle.png',
      visualImageAlt: t(
        'Sim Racing Coach web prototype, idle state with agent rail',
        'Sim Racing Coach Web-Prototyp, Idle-Zustand mit Agenten-Rail',
      ),
      metrics: [
        {
          num: t('Domain', 'Domäne'),
          label: t(
            'Race-engineer perspective brought to AI tooling for sim-racers',
            'Race-Engineer-Perspektive in KI-Tools für Sim-Racer eingebracht',
          ),
        },
        {
          num: t('Reframe', 'Umdeutung'),
          label: t(
            'Analysis surface as agent workspace, not chat panel',
            'Analyse-Oberfläche als Agenten-Arbeitsfläche, nicht als Chat-Panel',
          ),
        },
        {
          num: t('4 archetypes', '4 Archetypen'),
          label: t(
            "Worked patterns shipped against the product's telemetry schemas",
            'Ausgearbeitete Muster, ausgeliefert gegen die Telemetrie-Schemata des Produkts',
          ),
        },
      ],
      claim: t(
        'I bring motorsports domain knowledge to AI product design. I use AI to scale expert practice and analysis so drivers at every level can benefit.',
        'Ich bringe Motorsport-Domänenwissen in KI-Produktdesign ein. Ich nutze KI, um Expertenpraxis und Analyse zu skalieren, damit Fahrer auf jedem Niveau profitieren können.',
      ),
      ctaHref: '/work/sim-racing',
    },
    detail: {
      chips: [t('Consulting', 'Beratung'), t('AI', 'KI'), t('Agent UX', 'Agent-UX'), t('Sim-Racing', 'Sim-Racing')],
      hook: [
        t(
          'A founder shipping an AI sim-racing telemetry product asked for a design pass. The product had real telemetry data, a chat agent, and a polished analysis surface. Three working pieces, living in different containers.',
        ),
        t(
          'The user got data, an algorithmic score, and a chat window that could run queries. What they did not get was the experience of being walked through their own session by someone who knew what to look for.',
        ),
      ],
      sections: [
        {
          title: t('The agent and the workspace'),
          subtitle: t('What the product already had, and what it was missing'),
          paragraphs: [
            t(
              'The web app already had an AI surface: ten dimensions scored, each with a short coaching tip, all inside a modal. The desktop capture tool had a chat agent that ran corner queries and returned annotated track visualizations. The analysis surface was dense, accurate, demanding.',
            ),
            t(
              'The team had even shipped the right intent in one agentic feature: click a low-scoring dimension and dots appear on the track marking where the issue occurs. The execution stops halfway. The dots are not labeled. The view does not zoom. The user is left to manually find the corner and read it back to themselves.',
            ),
            t(
              'The agent had the data. The workspace had no agent thinking with the user inside it. Each surface was doing one piece of the job a real race engineer does in a single conversation.',
            ),
          ],
          decisions: [
            {
              title: t('Algorithmic scoring returns a conclusion, not an investigation.'),
              body: t(
                'A number on a dimension hides the analysis that produced it. The analysis is the part a self-coached racer needs to see, not the score.',
              ),
            },
            {
              title: t('A chat agent in a separate window is architecturally severed from the workspace.'),
              body: t(
                'The chat is functional but the user has to carry insights back into their own analysis context by hand. The agent and the work it is supposed to help with are in different rooms.',
              ),
            },
            {
              title: t('An agentic feature that stops halfway is worse than none.'),
              body: t(
                "A few dots on a map without labels or framing tells the user the agent saw something and then declined to explain it. The user does the rest of the agent's job for it.",
              ),
            },
          ],
          italicOutro: t(
            'The product had every ingredient. They were architected as if they belonged to different products.',
          ),
        },
        {
          title: t('Agent-as-workspace'),
          subtitle: t('One structural move that reframed the whole product'),
          paragraphs: [
            t(
              'The reframe was a single architectural commitment. The web app stops being an analysis tool with a chat panel. It becomes an AI agent surface, with the analysis view as the workspace the agent operates inside.',
            ),
            t(
              'Not chat-adjacent-to-data. Not three modes the user toggles between. Three states of one persistent agent rail: idle when the user opens a session and the agent has the floor, investigating when the agent narrates while the workspace annotates, exploring when the agent recedes and the user drives.',
            ),
            t(
              'Under that architecture sits the behavioral spec. A race engineer pattern, not a chat persona. Diagnose before prescribe. One primary correction per cycle. Specificity over generality. Annotate the workspace, do not just describe it. Suggest a follow-up so the conversation has somewhere to go.',
            ),
          ],
          decisions: [
            {
              title: t('Race engineer, not coach.'),
              body: t(
                'Coaching is one of the modes a race engineer operates in. Setup work, strategy, tire management are others. Naming the pattern at the role level keeps the door open wherever the product roadmap goes next, instead of pinning it to one of the modes.',
              ),
            },
            {
              title: t('Three states, not three modes.'),
              body: t(
                "States shift the agent's prominence based on what the user is doing. Modes would have made the user choose. The transitions are the agent's responsibility, not the user's.",
              ),
            },
            {
              title: t('Diagnose before prescribe.'),
              body: t(
                'Tell the user what is wrong before suggesting anything different. The same restraint a real engineer applies, and the restraint that earns trust from a self-coached racer with strong opinions about their own driving.',
              ),
            },
          ],
          italicOutro: t(
            'The architecture is not a coaching tool that will need replacing when the next model arrives. It is the shape of the conversation the user will eventually have with the product wherever it grows.',
          ),
          screenshots: {
            columns: 2,
            images: [
              {
                src: '/images/cases/sim-racing/prototype-web-idle.png',
                alt: t('Web prototype, idle state with agent rail and surfaced findings'),
                caption: t('Web: agent rail with findings surfaced'),
              },
              {
                src: '/images/cases/sim-racing/prototype-desktop-trailer.png',
                alt: t('Desktop prototype, trailer surface with capture and findings preview'),
                caption: t('Desktop: capture and trailer'),
              },
            ],
          },
        },
        {
          title: t('Four worked archetypes'),
          subtitle: t('Proving the pattern across question shapes'),
          paragraphs: [
            t(
              'The pattern is generalizable, but generalizability needs proof. Four archetypes shipped, each handling a different shape of question, all running inside the same shell.',
            ),
            t(
              'Spatial questions: where on the track is this happening? The agent zooms the canvas, labels the moments through a corner, walks through what it sees, suggests the next thread to pull.',
            ),
            t(
              'Temporal questions: where in the session did something change, and why? Same architecture, different canvas, different supporting data, same investigative pattern around it.',
            ),
            t(
              'Distributional questions: how consistent is the driver across the session, and where should they look closer? The agent walks the lap, points out what is working before flagging what is not, then hands the depth navigation to the user.',
            ),
            t(
              'State-along-line questions: what was the car doing as it moved through that moment? A different visualization shape, the same conversational shell around it.',
            ),
            t(
              'The four archetypes were the proof, not the point. The point was that the architecture can carry the kind of question the product roadmap implies but does not yet have a surface for.',
            ),
          ],
          decisions: [
            {
              title: t('Each archetype is a question shape, not a screen.'),
              body: t(
                'Spatial, temporal, distributional, state-along-line. Four examples prove the architecture handles whatever question comes next, not that there are four views to ship.',
              ),
            },
            {
              title: t('Depth navigation lives inside an archetype.'),
              body: t(
                'An overview view and a drill-down view are two states of the same investigation, not two separate ones. The pattern handles the transition without leaving the conversation.',
              ),
            },
            {
              title: t("Designed against the product's existing data."),
              body: t(
                'Each archetype shaped to what the capture layer already produces. The design extends what the team has already built rather than asking for new infrastructure to land first.',
              ),
            },
          ],
          italicOutro: t(
            'The point of working four archetypes was never that there should be four. It was that one architecture can hold whatever the product asks of it next.',
          ),
          screenshots: {
            columns: 2,
            images: [
              {
                src: '/images/cases/sim-racing/corner-investigation.png',
                alt: t('Spatial investigation through a corner'),
                caption: t('Spatial question'),
              },
              {
                src: '/images/cases/sim-racing/session-arc.png',
                alt: t('Temporal investigation across a session'),
                caption: t('Temporal question'),
              },
              {
                src: '/images/cases/sim-racing/consistency-overview.png',
                alt: t('Distributional investigation across the lap'),
                caption: t('Distributional question'),
              },
              {
                src: '/images/cases/sim-racing/handling-state.png',
                alt: t('State-along-line investigation through a corner'),
                caption: t('State-along-line question'),
              },
            ],
          },
        },
      ],
      outcomeBeat: {
        title: t('What the engagement delivered'),
        paragraphs: [
          t(
            "A conceptual diagnostic carrying the architectural argument. A working web prototype with the four archetypes. A desktop role redefinition from chat host to capture-and-trailer surface. All designed against the product's existing data layer. All aligned with the long-term direction the founder was building toward.",
          ),
          t(
            'The 20-hour timebox held. The handoff carried the architectural commitment, the worked archetypes, and a clean list of open questions for the next round.',
          ),
        ],
        highlight: t(
          "The honest test of a design engagement isn't whether it shipped. It's whether the architecture can carry the product where the founder said he wanted to take it.",
        ),
      },
    },
  },
  {
    slug: 'brightly',
    name: 'Brightly',
    tagline: t(
      'Design direction for a $1.575B acquisition.',
      'Designrichtung für eine 1,575 Mrd. $ Übernahme.',
    ),
    line: 'ent',
    readingMinutes: 6,
    body: {
      domains: [
        t('Manufacturing', 'Fertigung'),
        t('Healthcare', 'Gesundheitswesen'),
        t('Education', 'Bildung'),
        t('Government', 'Behörden'),
      ],
      outcome: t(
        'Vision design across 12 siloed products at Brightly. A unified design language and integration model proposed across the portfolio. Designs were used in acquisition-stage presentations to Siemens to demonstrate the platform vision and integration roadmap. Brightly was acquired for $1.575B.',
        'Vision-Design über 12 isolierte Produkte bei Brightly. Eine vereinheitlichte Designsprache und ein Integrationsmodell für das gesamte Portfolio vorgeschlagen. Die Designs wurden in den Akquisitionspräsentationen an Siemens verwendet, um die Plattform-Vision und Integrations-Roadmap zu demonstrieren. Brightly wurde für 1,575 Mrd. $ übernommen.',
      ),
      visualLabel: t('BRIGHTLY · PLATFORM VISION HERO', 'BRIGHTLY · PLATFORM-VISION-HERO'),
      visualImage: '/images/cases/brightly/brightly-dashboard.jpeg',
      visualImageAlt: t(
        'Brightly platform dashboard with planned maintenance and at-risk assets',
        'Brightly Plattform-Dashboard mit geplanter Wartung und gefährdeten Anlagen',
      ),
      metrics: [
        { num: t('$1.575B', '1,575 Mrd. $'), label: t('Siemens acquisition', 'Siemens-Übernahme') },
        {
          num: t('74%', '74 %'),
          label: t(
            'Customers excited by the future product direction',
            'Kunden begeistert von der zukünftigen Produktrichtung',
          ),
        },
        {
          num: t('5×', '5×'),
          label: t(
            'Increase in time on dashboard pages in user testing',
            'Mehr Zeit auf Dashboard-Seiten im User Testing',
          ),
        },
      ],
      claim: t(
        'I lead design vision that holds up under acquisition-grade scrutiny.',
        'Ich führe Design-Visionen an, die einer Akquisitions-Prüfung standhalten.',
      ),
      ctaHref: '/work/brightly',
    },
    detail: {
      chips: [t('Enterprise', 'Enterprise'), t('Platform Vision', 'Plattform-Vision'), t('Design System', 'Designsystem'), t('B2B SaaS', 'B2B-SaaS')],
      hook: [
        t(
          'Brightly was acquired by Siemens for $1.575B. Before the deal closed, the platform vision was previewed to existing customers: 74% of conference attendees expressed excitement about the future product direction, 36% said they were more likely to renew. User testing on the functional prototypes saw time on dashboard pages increase 5×. NPS verbatims, gathered independently, validated the survey findings.',
        ),
        t(
          'The work behind those signals: vision design across 12 siloed products at Brightly, anchored to a complete corporate rebrand and a major client conference. A new design language. A unified design system and front-end-agnostic component library. North star designs for the integrated portfolio. A transition plan from siloed products to platform.',
        ),
      ],
      sections: [
        {
          title: t('Three surfaces, three arguments'),
          subtitle: t('The hero screens, and the design intention behind each'),
          paragraphs: [
            t(
              'Three hero surfaces did most of the work of carrying the platform claim. Each was a different argument the vision had to make.',
            ),
            t(
              'The dashboard was the moment a customer landed in the product and saw all of their work in one place: planned maintenance, team availability, at-risk assets, work orders waiting on triage. The decision was that the dashboard had to be role-based, customizable, actionable, and data-driven. Every part of that list answered a specific complaint customers had raised in the research.',
            ),
            t(
              "Asset health and suggested actions extended the dashboard's logic. Asset health was the system saying which equipment was likely to fail, on what timeline, with what financial exposure: predicted failure, estimated losses, recommended course of action. Suggested actions was the system proposing the next move with the recommended option marked. Together they collapsed the old workflow (jump between tools, read the data yourself, decide alone) into a single surface where the system did the analysis and the operator made the call.",
            ),
            t(
              'The design system itself was the third surface. A front-end-agnostic component library, branded and unified, paired with the new corporate design language. Not a documentation site. A working library that any product team could pull from regardless of stack, which is what made the platform claim implementable across 12 different products at once.',
            ),
          ],
          decisions: [
            {
              title: t('Dashboard principles framed as customer answers.'),
              body: t(
                'Role-based, customizable, actionable, data-driven. Each principle answered a specific complaint surfaced in the research mix (Pendo analytics, Aha! product feedback, Client Advisory Boards, client visits, internal SME interviews). The principles were not aesthetic. They were arguments back at the field.',
              ),
            },
            {
              title: t('Asset health as a three-part decision support surface.'),
              body: t(
                'Predicted failure plus estimated losses plus recommended course of action. The three together turn the surface from "data point about a piece of equipment" into "decision the operator can make right now." The pattern propagated through the suggested actions surface and gave the platform a consistent operator-AI relationship across products.',
              ),
            },
            {
              title: t('Component library as front-end agnostic.'),
              body: t(
                'A unified design system is worth less than a unified component library, because a design system still has to be re-implemented by every product team. The library was built front-end-agnostic so any product, on any stack, in any office, could pull components directly. That is what made the platform claim implementable rather than aspirational.',
              ),
            },
          ],
          italicOutro: t(
            'Hero screens earn their position by showing what the platform claim looks like when a customer scrolls through it. The argument lives in the screens, not next to them.',
          ),
          screenshots: {
            columns: 3,
            images: [
              {
                src: '/images/cases/brightly/brightly-dashboard.jpeg',
                alt: t('Brightly admin dashboard with planned maintenance, work performance, team center, and at-risk assets'),
                caption: t('The Dashboard'),
              },
              {
                src: '/images/cases/brightly/brightly-asset-health.jpeg',
                alt: t('Asset health surface with predicted failure trend, estimated losses, and recommended actions'),
                caption: t('Asset Health'),
              },
              {
                src: '/images/cases/brightly/brightly-suggested-actions.jpeg',
                alt: t('Suggested actions modal with options and a recommended action highlighted'),
                caption: t('Suggested Actions'),
              },
            ],
          },
        },
        {
          title: t('Twelve silos, one platform vision'),
          subtitle: t('What the vision had to compress into a single product story'),
          paragraphs: [
            t(
              "Brightly had assembled a portfolio of 12 siloed software products serving manufacturing, healthcare, education, and government. The portfolio's strategy said \"platform.\" The user experience said twelve different products under one logo, each with its own dashboard, its own data, its own workflows. Customers were saying it directly: poor landing-page experience, products that did not share datasets, disjointed workflows, no clear expectation for what the future looked like.",
            ),
            t(
              'Two business events anchored the work. A complete corporate rebrand, which gave the design language room to be redrawn from scratch rather than nudged from where it had been. And a major client conference, which set a deadline that everything had to be ready to show to existing customers in functional prototype form.',
            ),
            t(
              'As Manager of Product Design at Brightly, I led a team of seven designers distributed across Melbourne, London, Noida, Montreal, and the US. The structural work, the executive presentation, and the case for the reframe were mine. A senior designer on the team paired with me on the visual execution; most of what you would see in the prototypes is their craft. The two halves of the work fit together: the architecture decided what to argue, the visual design decided how to argue it.',
            ),
            t(
              'The deliverables stacked on each other. A new corporate design language anchored to the rebrand. A unified design system built on top. A front-end-agnostic UI component library any product team could implement against. North star designs for the integrated portfolio. A transition plan from current siloed products to the platform shape. The point of the stack was that each layer made the next one implementable rather than aspirational.',
            ),
          ],
          decisions: [
            {
              title: t('Tie the vision to two business events, not one.'),
              body: t(
                'The rebrand gave the design language permission to break with the past. The client conference gave the prototypes a real deadline and a real audience. Anchoring the vision to both meant the work had business justification on two axes, not just one.',
              ),
            },
            {
              title: t('Lead the structure, partner on the craft.'),
              body: t(
                'Managing a distributed seven-person design team while running the structural and presentation work meant getting clear on what I owned and what others owned. I led the architecture, the systems thinking, and the case to executives. A senior designer led the visual execution. Both halves had to be excellent for the work to be defensible.',
              ),
            },
            {
              title: t('A transition plan, not just a destination.'),
              body: t(
                'Vision design is easy to dismiss as aspirational. Pairing the North star designs with a transition plan from current products to platform made the work answerable to engineering: here is what we propose, here is how the existing portfolio gets there from where it is.',
              ),
            },
          ],
          italicOutro: t(
            'Strategic narratives say "platform." Design evidence says what the platform actually looks like when a customer clicks through it, what the design language allows, and how the existing products get there.',
          ),
          screenshots: {
            columns: 2,
            images: [
              {
                src: '/images/cases/brightly/brightly-new-brand.jpeg',
                alt: t('New Brightly brand identity with photography treatment showing three customers across industries'),
                caption: t('The new brand'),
              },
              {
                src: '/images/cases/brightly/brightly-design-system.jpeg',
                alt: t('Lumos Design System rendered as a product page, showing input field states and information graphics'),
                caption: t('Design system as a product'),
              },
            ],
          },
        },
      ],
      outcomeBeat: {
        title: t('What the work was for'),
        paragraphs: [
          t(
            'The Chief Product Officer was happy enough with the work to put the prototypes into multiple high-stakes rooms. They went into board presentations supporting funding requests. They went into the acquisition-stage meetings with Siemens leading up to the deal. Brightly was acquired by Siemens for $1.575B.',
          ),
          t(
            'The design work did not cause the acquisition. It was the part of the story the acquirer needed to see to evaluate whether the platform claim had design proof underneath the strategic narrative.',
          ),
        ],
        highlight: t(
          'Design judgment at the layer above craft is what enterprise design vision actually means. Not making things prettier. Making the strategic claim verifiable before the business commits to it.',
        ),
      },
    },
  },
  {
    slug: 'fleet',
    name: 'Fleet',
    tagline: t(
      'Three tools and two forms, consolidated into one.',
      'Drei Tools und zwei Formulare, zu einem zusammengeführt.',
    ),
    line: 'ent',
    readingMinutes: 5,
    body: {
      domains: [
        t('Logistics', 'Logistik'),
        t('Industrial', 'Industrie'),
        t('Cold Chain', 'Kühlkette'),
      ],
      outcome: t(
        '0→1 industrial fleet operations product. Sole UX designer from initial research through shipped pilot. Consolidated three software tools and two paper forms into a single workflow. Gloves, dust, time pressure.',
        '0→1 Industrie-Flottenmanagement-Produkt. Einziger UX-Designer von der ersten Recherche bis zum ausgelieferten Pilot. Drei Softwaretools und zwei Papierformulare zu einem einzigen Workflow zusammengeführt. Handschuhe, Staub, Zeitdruck.',
      ),
      visualLabel: t('FLEET · WORKFLOW BEFORE & AFTER', 'FLEET · WORKFLOW VORHER & NACHHER'),
      visualImage: '/images/cases/fleet/fleet-yard-map.jpeg',
      visualImageAlt: t(
        'Fleet yard management view with aerial map of dock and yard spots',
        'Fleet Hof-Management-Ansicht mit Luftbild von Dock und Hof-Plätzen',
      ),
      metrics: [
        {
          num: t('3 + 2 → 1', '3 + 2 → 1'),
          label: t(
            'Tools and forms consolidated to a single workflow',
            'Tools und Formulare zu einem Workflow zusammengeführt',
          ),
        },
        {
          num: t('Sole UX', 'Einziger UX'),
          label: t('Research, design, and pilot delivery', 'Recherche, Design und Pilot-Auslieferung'),
        },
        {
          num: t('Shipped', 'Ausgeliefert'),
          label: t(
            'Live with industrial users in cold-storage logistics',
            'Live mit Industrienutzern in der Kühlhauslogistik',
          ),
        },
      ],
      claim: t(
        'I own design end-to-end on industrial products that have to work in physical-world conditions.',
        'Ich verantworte Design End-to-End bei Industrieprodukten, die unter realen Bedingungen funktionieren müssen.',
      ),
      ctaHref: '/work/fleet',
    },
    detail: {
      chips: [t('Industrial', 'Industrie'), t('Logistics', 'Logistik'), t('0→1', '0→1'), t('Sole UX', 'Einziger UX')],
      hook: [
        t(
          'Sole UX lead on a 0→1 yard-management product at Ndustrial. The shipped pilot consolidated three software tools and two paper forms into a single yard-management interface, deployed at a cold-storage third-party-logistics facility tracking hybrid electric trailers.',
        ),
        t(
          "Industrial conditions don't tolerate friction. Gloves on. Dust on the screen. Twelve trucks waiting on dock assignments. Every design decision was answerable to whether it survived the dock, not whether it looked clean in design review.",
        ),
      ],
      sections: [
        {
          title: t('Three surfaces, one workflow'),
          subtitle: t('The hero screens, and the design intention behind each'),
          paragraphs: [
            t(
              'Three hero surfaces carried the workflow. Each replaced a piece of the old way of doing things. Together they collapsed the jump-between-tools-and-clipboards model into a single screen the yard manager could run their dock from.',
            ),
            t(
              "The yard management view was the operational center. An aerial map rendered every dock door and yard spot as a chip showing what was plugged in, plugged out, or empty. The trailer list on the left was searchable and sortable. Selecting any chip or list item opened a detail panel alongside the map: trailer ID, carrier, eTRU status, driver, and an audit log, all without losing the manager's sense of the whole yard.",
            ),
            t(
              'Driver communication moved off radios and phone calls onto text-based messages inside the interface. Asynchronous, recordable, threaded against the trailer. Quick-action templates for the most common messages (load ready for check-out, return to front desk, await further instruction) handled the bulk of routine traffic with one tap.',
            ),
            t(
              'Check-in was the consolidation made visible. What used to require three software tools and two paper forms became a single modal: pick a spot, confirm the eTRU status, done. When the yard was at capacity, the waitlist absorbed the overflow without breaking the main flow.',
            ),
          ],
          decisions: [
            {
              title: t('Consolidation, not aggregation.'),
              body: t(
                'Three software tools and two paper forms were not consolidated by bundling them into one screen. They were consolidated by deciding which jobs each had been doing, which jobs the new interface had to do, and which ones could disappear entirely because they had been workarounds in the first place.',
              ),
            },
            {
              title: t('Driver comms as text, not radio.'),
              body: t(
                'Radio works for one person speaking to one driver at a time, in real time, in their general direction. Text works for a yard manager handling twelve trucks in parallel. The change was not a UI choice. It was a choice about which job comms was supposed to do in this product.',
              ),
            },
            {
              title: t('Detail alongside the map, not a page away from it.'),
              body: t(
                "The trailer detail opens as a side panel, not as a navigation. The map stays visible the whole time. That decision keeps the yard manager oriented to the whole facility while drilling into one trailer, which matters because the next decision is almost never about the trailer in isolation. It's about how that trailer fits into the dock assignment, the waitlist, and the eight other trailers waiting their turn.",
              ),
            },
          ],
          italicOutro: t(
            'Three hero screens did the work of replacing three software tools and two paper forms. Each one named what the old way had been doing, what the new way was doing instead, and which job the user was actually trying to get done.',
          ),
          screenshots: {
            columns: 2,
            images: [
              {
                src: '/images/cases/fleet/fleet-yard-map.jpeg',
                alt: t('Yard management view with aerial map showing dock and yard spots, trailer list on the left'),
                caption: t('Yard map'),
              },
              {
                src: '/images/cases/fleet/fleet-trailer-detail.jpeg',
                alt: t('Trailer detail panel with carrier, driver, eTRU status, and audit log, alongside the dock spots'),
                caption: t('Trailer detail'),
              },
              {
                src: '/images/cases/fleet/fleet-driver-comms.jpeg',
                alt: t('Driver messaging panel with auto-sent appointment confirmation and quick-action templates'),
                caption: t('Driver comms'),
              },
              {
                src: '/images/cases/fleet/fleet-check-in.jpeg',
                alt: t('Check-in trailer modal with yard spot grid and eTRU trailer indicator, with waitlist fallback'),
                caption: t('Check-in'),
              },
            ],
          },
        },
        {
          title: t('Sole UX, research through ship'),
          subtitle: t('What it took to design end-to-end for an industrial pilot'),
          paragraphs: [
            t(
              "Sole UX at Ndustrial meant being the only UX resource at the company, not just on this project. Yard management was running in parallel with the Power Quality and Demand Response work for industrial customers, plus whatever else needed design judgment that week. Research, workflow design, visual design, prototypes, hand-off to engineering, pilot support: the work either happened or it didn't get done, across whichever project was loudest at the moment.",
            ),
            t(
              'Research happened on the dock. The product was not designed in a conference room and shipped to operators to use. It was shaped by watching yard managers work, watching drivers wait, watching paperwork accumulate. The constraints (gloves, dust, time pressure) were not assumptions. They were observations from the people who were going to use the thing.',
            ),
            t(
              'Industrial conditions shaped every design decision. Every minute spent in the interface was a minute not spent moving a truck, so cognitive load had to come down. The interface had to compete with paper, radios, and walking the dock, and lose less often than it won.',
            ),
            t(
              "The pilot deployed at one facility. Not an enterprise rollout, not a category-wide product, not a broad-scale launch. One real customer site, with real yard managers running their actual dock through it. That is what 'shipped' meant in this case, and what made the work credible: the interface worked under the actual conditions where it would have to work.",
            ),
          ],
          decisions: [
            {
              title: t('Sole UX for the whole company, end to end.'),
              body: t(
                'I was the only UX resource at Ndustrial, owning the entire design function for the company while balancing the needs of multiple active projects in parallel. No design partner to defer to, no specialist to hand off to, and no other UX work happening anywhere else in the org that would have gotten done on its own. A different competency than leading a team, and worth claiming as a separate signal.',
              ),
            },
            {
              title: t('Research where the work happens.'),
              body: t(
                'User research at the customer site was not a methodology choice. It was the only way to know what the actual constraints were. The conditions a yard manager works under cannot be reproduced in an office, and assumptions that get past the conference room get caught on the dock.',
              ),
            },
            {
              title: t('Pilot scope as honest framing.'),
              body: t(
                'One facility shipping a real pilot is different from a category-wide rollout. Naming the scope (a single customer site, a single pilot) keeps the work credible and lets the reader trust the rest of the case. Overclaiming on scale undermines everything else the case is trying to say.',
              ),
            },
          ],
          italicOutro: t(
            "Industrial design judgment doesn't come from working on industrial products. It comes from being in the rooms where industrial work actually happens. The interface either survives those rooms or it doesn't.",
          ),
        },
      ],
      outcomeBeat: {
        title: t('What shipped'),
        paragraphs: [
          t(
            'The pilot shipped during my tenure at Ndustrial. Yard managers at a cold-storage third-party-logistics facility ran their dock through it instead of jumping between three software tools and two paper forms. The broader Ndustrial program (including shore-power infrastructure for the hybrid electric trailers) continued after I was laid off in mid-2025.',
          ),
          t(
            'The case here is not about scale. It is about whether an industrial product designed by one person, at one company, for one pilot site, can hold up in real industrial conditions. This one did.',
          ),
        ],
        highlight: t(
          "Industrial design end-to-end means sole UX, research through ship, no specialists to hand off to, and an interface that either survives the dock or it doesn't.",
        ),
      },
    },
  },
  {
    slug: 'pqdr',
    name: 'Power Quality and Demand Response',
    tagline: t(
      'AI insight, operator decision. 200+ industrial locations.',
      'KI-Erkenntnis, Operator-Entscheidung. 200+ Industriestandorte.',
    ),
    line: 'ent',
    readingMinutes: 5,
    body: {
      domains: [
        t('Energy', 'Energie'),
        t('Industrial', 'Industrie'),
        t('Operator UX', 'Operator-UX'),
      ],
      outcome: t(
        'Operator surfaces for AI-powered energy intelligence. Power Quality and Demand Response as two distinct operator views on one underlying AI system. Deployed across more than 200 industrial sites of a single customer. Penalty avoidance was the structural value, not a measured-savings claim.',
        'Operator-Oberflächen für KI-gestützte Energie-Intelligenz. Power Quality und Demand Response als zwei eigenständige Operator-Ansichten auf einem gemeinsamen KI-System. Eingesetzt an mehr als 200 Industriestandorten eines einzigen Kunden. Strafvermeidung war der strukturelle Wert, kein gemessener Einsparungs-Anspruch.',
      ),
      visualLabel: t('PQ + DR · OPERATOR DASHBOARD', 'PQ + DR · OPERATOR-DASHBOARD'),
      visualImage: '/images/cases/pqdr/pq-one-line.png',
      visualImageAlt: t(
        'Power Quality at-a-glance dashboard surfacing high-impact assets and efficiency losses',
        'Power Quality Übersichts-Dashboard mit Anlagen mit hoher Auswirkung und Effizienzverlusten',
      ),
      metrics: [
        {
          num: t('200+', '200+'),
          label: t('Industrial locations of one customer', 'Industriestandorte eines Kunden'),
        },
        {
          num: t('2 surfaces', '2 Oberflächen'),
          label: t(
            'Power Quality and Demand Response built on one AI system',
            'Power Quality und Demand Response auf einem KI-System gebaut',
          ),
        },
        {
          num: t('Operators', 'Operatoren'),
          label: t('AI surfaces, operators decide', 'KI zeigt, Operatoren entscheiden'),
        },
      ],
      claim: t(
        'I design operator-facing surfaces that turn AI insight into industrial-scale operational decisions.',
        'Ich entwerfe Operator-Oberflächen, die KI-Erkenntnisse in betriebliche Entscheidungen auf Industrieskala übersetzen.',
      ),
      ctaHref: '/work/pqdr',
    },
    detail: {
      chips: [t('Enterprise', 'Enterprise'), t('AI Insight', 'KI-Erkenntnis'), t('Operator UX', 'Operator-UX'), t('Industrial', 'Industrie')],
      hook: [
        t(
          'AI-powered energy intelligence at industrial facilities. Operator-facing surfaces deployed across 200+ industrial locations of a single large customer at Ndustrial.',
        ),
        t(
          'Two distinct surfaces on one underlying AI system. Power Quality, a dashboard where facility managers identify equipment likely causing efficiency losses. Demand Response, an alert surface where operators curtail operations in time to avoid utility penalties that can run into six figures annually. Both fed by the same AI analysis layer underneath.',
        ),
      ],
      sections: [
        {
          title: t('Two surfaces, one system'),
          subtitle: t('What each surface was designed to make decidable'),
          paragraphs: [
            t(
              'One AI analysis layer. Two operator-facing surfaces. The decision to split the operator view rather than the AI was structural: the AI did the same kind of analysis in both cases, but the human work it triggered was fundamentally different in shape.',
            ),
            t(
              'Power Quality was the diagnostic surface. The AI analyzed power quality data across the facility and the dashboard surfaced which equipment was most likely causing efficiency losses. Facility managers could see, at a glance, where their power was being wasted and which assets to investigate first.',
            ),
            t(
              'Demand Response was the time-sensitive surface. When the utility signaled an impending peak-demand event, the alert surface notified facility or regional managers in time to curtail operations and comply with the program. The penalty for non-compliance with peak-shaving events can run into six figures annually for an industrial site. The interface was designed to make the curtailment decision fast, clear, and accountable.',
            ),
            t(
              "Treating these as two operator views on one AI system, rather than one combined screen or two separate products, was the move. The AI's job was the same in both cases: analyze the data, surface what mattered. The operator's job was different. Diagnostic decisions take minutes or hours. Demand-response decisions take seconds. The two surfaces let each decision happen at its own speed.",
            ),
          ],
          decisions: [
            {
              title: t('Split the operator view, not the AI.'),
              body: t(
                'The AI analysis is shared. The decisions it triggers are not. Power Quality is a diagnostic decision (which equipment to investigate next) measured in minutes or hours. Demand Response is a time-sensitive decision (curtail now or pay the penalty) measured in seconds. Pretending one surface could serve both would have made both worse.',
              ),
            },
            {
              title: t('Diagnostic surface: surface what matters, not all the data.'),
              body: t(
                "The Power Quality dashboard's job was to point at the equipment most likely causing efficiency losses, not to show every event in the facility's history. Facility managers were already drowning in data. The AI's job was to filter; the design's job was to make the filter trustworthy.",
              ),
            },
            {
              title: t('Time-sensitive surface: design for the window, not the user.'),
              body: t(
                'Demand Response had a fixed clock. The utility signal arrived, the curtailment window opened, the penalty avoidance depended on action within that window. The surface had to make the decision visible, the consequences clear, and the action trivial to execute. Anything else competed with the window.',
              ),
            },
          ],
          italicOutro: t(
            "Operator-facing UX for AI insight is not the same problem as designing the AI itself. The AI's correctness is one question. Whether the operator can act on it within the time the situation allows is a different one.",
          ),
          screenshots: {
            columns: 2,
            images: [
              {
                src: '/images/cases/pqdr/pq-one-line.png',
                alt: t('Power Quality at-a-glance dashboard surfacing the assets most likely causing efficiency losses'),
                caption: t('Power Quality: at a glance'),
              },
              {
                src: '/images/cases/pqdr/dr-overview.png',
                alt: t('Demand Response overview showing peak-demand events and curtailment status across facilities'),
                caption: t('Demand Response: overview'),
              },
            ],
          },
        },
        {
          title: t('AI insight, operator decision'),
          subtitle: t('Where AI output meets the people who have to act on it'),
          paragraphs: [
            t(
              "Designing operator-facing surfaces for AI output is a different competency than designing AI features. The AI engineer's question is whether the model produces correct output. The operator UX designer's question is whether the human downstream can recognize the output, trust it, and act on it within the time the situation allows.",
            ),
            t(
              "Power Quality and Demand Response were the same answer to two versions of that question. Both surfaces gave the operator a view onto AI-generated analysis. Neither gave the operator the AI itself. The design move in both cases was to find the place where the operator's decision actually happens, then to surface the AI's contribution at that exact place.",
            ),
            t(
              'Deployed across 200+ industrial locations of one customer, the system met operators where their decisions happened. Facility managers at the site for the diagnostic work. Facility or regional managers in the curtailment window for time-sensitive response. The operator was always the actor. The AI was always the analyst.',
            ),
            t(
              'The structural value claim is the honest version: penalty avoidance built into the operator decision flow at industrial scale. Measured savings at a given site depended on operational data I never personally saw post-deployment. Naming the structural framing keeps the case credible; claiming dollars I cannot verify would not.',
            ),
          ],
          decisions: [
            {
              title: t('Designing for AI output, not designing the AI.'),
              body: t(
                "Different problem than designing the model. The AI's correctness is one question. Whether the operator can act on what the AI surfaces in the time the situation allows is a different one. Operator UX for AI insight is its own design competency.",
              ),
            },
            {
              title: t('The operator is the actor. The AI is the analyst.'),
              body: t(
                "The system was never designed to replace the operator's judgment. It was designed to make the operator's judgment faster and better informed. Every surface decision followed from that division of labor.",
              ),
            },
            {
              title: t('Structural value, not measured savings.'),
              body: t(
                'The product was designed to help facilities avoid utility penalties that can run into six figures annually per industrial site. That is the structural framing. Measured savings at a specific site depended on conditions I never saw post-deployment, so the honest version of value is the structural one, not a dollar figure I cannot verify.',
              ),
            },
          ],
          italicOutro: t(
            "The portfolio claim is not 'I shipped a feature that saved X dollars.' It is 'I designed the surfaces that turn AI insight into operator action at industrial scale.' One of those is provable from the design. The other depends on operational data I don't have.",
          ),
          screenshots: {
            columns: 2,
            images: [
              {
                src: '/images/cases/pqdr/pq-detail.png',
                alt: t('Power Quality detail view drilling into a specific asset, with event timeline and analysis'),
                caption: t('Power Quality: asset detail'),
              },
              {
                src: '/images/cases/pqdr/dr-facility-detail.png',
                alt: t('Demand Response facility detail with curtailment window, action, and accountability'),
                caption: t('Demand Response: facility detail'),
              },
            ],
          },
        },
      ],
      outcomeBeat: {
        title: t('What the system was for'),
        paragraphs: [
          t(
            'Deployed across more than 200 industrial locations of a single large customer at Ndustrial. Two operator surfaces, Power Quality and Demand Response, running on one AI analysis layer underneath. Designed to help facilities avoid utility penalties that can run into six figures annually for non-compliance with peak-shaving events.',
          ),
          t(
            'Post-deployment performance data is not mine to claim. I designed the system; I did not personally see how each of the 200+ sites used it after rollout. The honest version of the work is what was shipped and what it was structured to enable, not a measured outcome number.',
          ),
        ],
        highlight: t(
          "Operator UX for AI insight is its own kind of design judgment. The AI can be right and the design can still fail if the operator can't act on what the AI surfaces in the time the situation allows.",
        ),
      },
    },
  },
  {
    slug: 'about',
    name: 'About',
    // TODO: EN tagline pending rewrite (no longer matches paragraph 4 after the
    // 2026-05-28 transit-metaphor addition). DE will need a re-translation
    // pass once EN is updated.
    tagline: t('Wheels, speed, freedom.', 'Räder, Tempo, Freiheit.'),
    line: 'pers',
    readingMinutes: 2,
    personal: {
      paragraphs: [
        t(
          'I love wheeled things. Bikes, cars, and even public transit.',
          'Ich liebe alles, was Räder hat. Fahrräder, Autos, und sogar den öffentlichen Nahverkehr.',
        ),
        t(
          "I've built and prepped cars for high performance track driving, driven them at the limit, and coached others to find theirs. Helping someone get fast means understanding what needs to happen, and what can go wrong, before you suggest anything different.",
          'Ich habe Autos für Trackdays gebaut und vorbereitet, sie an ihrer Grenze gefahren und anderen geholfen, ihre eigene zu finden. Jemandem zu helfen, schnell zu werden, heißt zu verstehen, was passieren muss und was schiefgehen kann, bevor man etwas anderes vorschlägt.',
        ),
        t(
          "I've been a cyclist since the 90s. I cut my teeth on mountain bikes, then fell headlong into road cycling, racing, endurance rides, cyclocross, and commuting. Now I'm combining it all, on and off road, in and around Berlin.",
          'Ich bin seit den 90ern Radfahrer. Angefangen habe ich auf dem Mountainbike, dann bin ich Hals über Kopf in Rennrad, Rennen, Langstreckenfahrten, Cyclocross und Pendeln eingestiegen. Jetzt kombiniere ich alles, auf der Straße und abseits davon, in und um Berlin.',
        ),
        t(
          "Public transit is the third wheel, and the reason this site is built around a transit map. A subway has to work for a tourist who doesn't speak the language, a commuter who is late, a kid riding alone, an elderly rider with a cane, a wheelchair user, and somebody running on no sleep at the end of a long day. The route map, the signage, the ticket machine, the platform announcements, and more, all have to clear the same accessibility and clarity bar for every one of those people, in seconds, with no instructions. That is a serious bar.",
          'Der öffentliche Nahverkehr ist das dritte Rad, und der Grund, warum diese Seite um einen Liniennetzplan herum gebaut ist. Eine U-Bahn muss funktionieren, und zwar für eine Touristin, die kein Deutsch spricht, für einen Pendler, der zu spät dran ist, für ein Kind, das alleine fährt, für eine ältere Frau mit Gehstock, für einen Rollstuhlfahrer und für jemanden, der am Ende eines langen Tages auf dem Zahnfleisch geht. Der Liniennetzplan, die Beschilderung, der Fahrkartenautomat, die Bahnsteigansagen und mehr, alles muss für jede dieser Personen dieselbe Latte an Zugänglichkeit und Klarheit nehmen, in Sekunden, ohne Anleitung. Das ist eine hohe Latte.',
        ),
        t(
          'It is also the bar I want to clear with my designs. The transit metaphor here is a statement about what design is for, and not simply a styling choice.',
          'Das ist auch die Latte, die ich mit meinen Designs überspringen will. Die ÖPNV-Metapher hier ist eine Aussage darüber, wofür Design da ist. Und keine bloße Stilfrage.',
        ),
        t('I also like to draw sometimes...', 'Ich zeichne auch manchmal...'),
      ],
      gallery: [
        { src: '/images/gallery/bmw-m3-e30.jpg', title: 'BMW M3 E30', subtitle: t('Digital illustration', 'Digitale Illustration') },
        { src: '/images/gallery/porsche-911-turbo.jpg', title: 'Porsche 911 Turbo', subtitle: t('Digital illustration', 'Digitale Illustration') },
        { src: '/images/gallery/singer-930.jpg', title: 'Singer 930', subtitle: t('Digital illustration', 'Digitale Illustration') },
        { src: '/images/gallery/bmw-m2.jpg', title: 'BMW M2', subtitle: t('Digital illustration', 'Digitale Illustration') },
        { src: '/images/gallery/polestar-2.jpg', title: 'Polestar 2', subtitle: t('Digital illustration', 'Digitale Illustration') },
        { src: '/images/gallery/merc-sl.jpg', title: 'Mercedes SL', subtitle: t('After Shane Baxley', 'Nach Shane Baxley') },
        { src: '/images/gallery/911-night-race.jpg', title: '911 Night Race', subtitle: t('Digital illustration', 'Digitale Illustration') },
      ],
    },
  },
  {
    slug: 'contact',
    name: 'Contact',
    tagline: t('Email or LinkedIn. I read both.', 'E-Mail oder LinkedIn. Ich lese beides.'),
    line: 'pers',
    readingMinutes: 1,
    personal: {
      paragraphs: [
        t(
          'Open to design leadership and senior product design roles, AI product work, and design consulting.',
          'Offen für Design-Führungspositionen und Senior Product Design Rollen, KI-Produktarbeit und Designberatung.',
        ),
      ],
      links: [
        {
          href: 'mailto:scottgerstl@gmail.com',
          icon: 'email',
          label: t('Email', 'E-Mail'),
          value: 'scottgerstl@gmail.com',
        },
        {
          href: 'https://www.linkedin.com/in/scottgerstl',
          icon: 'linkedin',
          label: t('LinkedIn', 'LinkedIn'),
          value: 'linkedin.com/in/scottgerstl',
        },
      ],
    },
  },
];

export const SECTIONS: { line: LineKey; code: string; title: L10n; subtitle: L10n }[] = [
  {
    line: 'ai',
    code: 'CS1',
    title: t('AI Case Studies', 'KI-Fallstudien'),
    subtitle: t(
      '3 stops · AI features, AI products, AI as the design medium',
      '3 Stationen · KI-Features, KI-Produkte, KI als Designmedium',
    ),
  },
  {
    line: 'ent',
    code: 'CS2',
    title: t('Enterprise Case Studies', 'Enterprise-Fallstudien'),
    subtitle: t(
      '3 stops · vision, workflows, and operator surfaces',
      '3 Stationen · Vision, Workflows und Operator-Oberflächen',
    ),
  },
  {
    line: 'pers',
    code: 'P',
    title: t('Personal', 'Persönlich'),
    subtitle: t(
      '2 stops · who I am off the clock, and how to reach me',
      '2 Stationen · wer ich nach Feierabend bin, und wie ich zu erreichen bin',
    ),
  },
];

export function casesForLine(line: LineKey): CaseEntry[] {
  return CASES.filter((c) => c.line === line);
}
