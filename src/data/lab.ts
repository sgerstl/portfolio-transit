export type LabType = 'Product' | 'Workflow' | 'Experiment' | 'Evaluation';
export type LabStatus = 'Live' | 'In Progress' | 'Learning' | 'Archived';

export type LabLink = {
  label: string;
  url: string;
};

export type LabEntry = {
  title: string;
  type: LabType;
  status: LabStatus;
  summary: string;
  tried: string;
  learned: string;
  didntWork?: string;
  forYourTeam?: string;
  links?: LabLink[];
  demoUrl?: string;
};

export type LabCategory = {
  name: string;
  entries: LabEntry[];
};

export const LAB_CATEGORIES: LabCategory[] = [
  {
    name: 'Products & Tools',
    entries: [
      {
        title: 'Metro Metaphor: A Visual Identity That Reached the Data Structures',
        type: 'Experiment',
        status: 'Live',
        summary:
          'How a Berlin departure board became the structural identity of the entire site, after five other metaphors fell apart in execution.',
        tried:
          "Tried five visual metaphors for the portfolio redesign: vintage transit poster, mission control panel, library, departure board / metro map, and minimalist Swiss design. Each had a hook. Four fell apart in execution. The departure board / metro stuck because the metaphor reached past the brand mark and into the data structures: lines became case categories (CS1 = AI, CS2 = Enterprise, P = Personal), stops became individual cases, ziel became the case name, Lesezeit became the reading time, and the current scroll position became the current stop.",
        learned:
          "A sustained metaphor is harder than picking a strong one. The first three I tried were visually distinctive but stopped at the brand mark. The departure board worked because every level of the design system had a place in the metaphor's vocabulary. When the metaphor reaches into the data, it stops being decoration and becomes navigation.",
        didntWork:
          "Vintage transit poster was beautiful but read as nostalgic, not professional. Mission control was on-brand for AI but felt cliché. Library felt warm but disconnected from technical work. Swiss minimalist disappeared into the page background. The test for whether a metaphor sticks: can you describe a case study's information architecture using the metaphor's vocabulary without straining? Departure board passed. The others all failed at this exact step.",
        forYourTeam:
          "Visual identity for portfolios benefits from a metaphor that reaches the data structures, not just the surface styling. If you can't name your case studies' major fields in the metaphor's language, you'll fall back on conventional UI patterns and lose the brand.",
      },
      {
        title: 'Departure Board UX: BVG-Styled Scroll-Linked Navigation',
        type: 'Product',
        status: 'Live',
        summary:
          'A persistent navigation element styled as a Berlin train station departure display, updating in real time as visitors scroll through case studies.',
        tried:
          "Built a fixed-position departure board in the top-right corner of every page. Mimics the BVG (Berlin transit authority) departure display: yellow LED-style monospaced text on black, German header labels (Linie, Ziel, Lesezeit). Each case is a stop with a line code, case name, and reading time. A 'Current Stop' indicator updates dynamically as the visitor scrolls, using IntersectionObserver against the case cards on the homepage.",
        learned:
          "A piece of UI that looks decorative can do real navigation work if it's syntactically familiar. Anyone who has ridden the U-Bahn recognizes the departure-board format instantly. They read it correctly without instructions: Line, Destination, Time. The German labels convert the metaphor from 'transit-themed' to 'located in Berlin.' The board tells the visitor where I am without putting 'Based in Berlin' into copy.",
        didntWork:
          "First version updated on every scroll event, which was wasteful and visually flickery. Switched to IntersectionObserver against the case cards, which produces a clean 'you are now at X' signal only when a card crosses the viewport's midline. Also tried rendering the board with bitmap pixel-style text. Looked great in mockup but didn't scale across browsers. Reverted to a clean monospaced webfont with tight letter-spacing.",
        forYourTeam:
          "Navigation elements that look decorative can still be load-bearing. If a UI element resembles familiar infrastructure (a thermometer, a clock, a departure board, a weather widget), users will read it correctly without instructions. That's a design budget that costs nothing once you commit to the metaphor.",
      },
      {
        title: 'Three Portfolio Patterns I Prototyped and Dropped',
        type: 'Experiment',
        status: 'Archived',
        summary:
          'What the redesign tried and rejected: a password wall on case studies, modal-revealed services, and a philosophical hero headline. Three honest did-not-works.',
        tried:
          "The old portfolio had three patterns I assumed I'd keep. A password wall on enterprise case studies (rationale: NDA content gating). Modal interactions for surfacing service categories on hover (rationale: keeping the homepage clean). A philosophical hero headline 'The hardest part of software has always been knowing what to build' (rationale: signaling depth). Each had a defensible case. Each tested poorly against the redesign rubric.",
        learned:
          "All three failed the same way: they made the visitor do extra work to find out what I do. Hiring managers spend thirty seconds before deciding whether to scroll further. Anything that introduces friction in that window is paying for itself with their time. The redesign's organizing principle became: the page should give a recruiter the answer before they have to ask the question. Every removal followed from that.",
        didntWork:
          "Password walls signal 'trust me' but read as 'won't show you.' Modals require commitment before reveal; visitors arrived skeptical, and commitment was the wrong direction. Philosophical headlines flatter the writer but force the reader to do interpretation in a five-second window where they should be receiving a claim. Three different rationales, one same failure mode.",
        forYourTeam:
          "The portfolio patterns that get cut are often the ones that felt smart. 'Smart' usually means requires interpretation, which usually means loses the casual reader. Portfolios are casual-reader artifacts. Save the interpretation density for the case study bodies, not the navigation.",
      },
    ],
  },
  {
    name: 'Systems & Workflows',
    entries: [
      {
        title: 'Employment Panopticon: AI-Powered Job Hunt Command Center',
        type: 'Product',
        status: 'In Progress',
        summary:
          'A full-stack job search pipeline that scans Gmail, scores leads with AI, manages companies through a web app, and nudges me via WhatsApp when something needs attention.',
        tried:
          'Outgrew an Obsidian vault and rebuilt the pipeline as a Next.js app on Neon Postgres. Scout scans Gmail every 15 minutes, classifies emails, and uses Claude Haiku to score job listings against my profile. Strong matches become leads automatically. The web app handles the visual pipeline with company details, contacts, history, and a built-in assistant called Jeremy. A reminder system sends WhatsApp nudges for overdue actions.',
        learned:
          'Moving to a real database unlocked everything. Once data was structured, every automation (Scout, reminders, Jeremy, enrichment) could plug in independently. Claude appears in five places in this system, each with a different model and purpose. Treating each AI touchpoint as its own design problem, rather than a single "add AI" feature, is what made them reliable.',
        forYourTeam:
          'Map every AI touchpoint as a separate design artifact with its own model selection, prompt, and evaluation criteria. Email classification, job scoring, and conversational Q&A are fundamentally different interaction patterns that happen to share a provider.',
      },
      {
        title: 'Panopticon: Persistent AI Context System',
        type: 'Workflow',
        status: 'Live',
        summary:
          'The structured Obsidian vault and session logging system underneath the Employment Panopticon, designed to give Claude persistent memory across projects and conversations.',
        tried:
          'Built a knowledge vault in Obsidian designed specifically for AI collaboration. Core mechanic: a /wrap slash command that runs a structured debrief at the end of every working session, asking for intention, decisions, and open questions, then writes the entry to a session log and commits it to git automatically. The logs are structured to be synthesized by AI in future sessions, not just read by humans. The vault has since become the knowledge layer for a larger system: company and contact notes feed into the web app, session logs preserve design reasoning across tools, and a WhatsApp assistant can read and write vault files through Google Drive.',
        learned:
          'The most valuable thing to capture is not what you built; it is why you built it and what you were uncertain about. Git tracks the what. The session log tracks the why. Keeping both in the same system, versioned together, means you can reconstruct the reasoning behind any decision weeks later. Structure reduces friction: making the debrief a slash command means it actually happens. The vault also proved its value as a foundation layer. When the pipeline moved to a database, the vault did not become obsolete. It became the unstructured complement to structured data, holding the context that does not fit in rows and columns.',
        didntWork:
          'The system is only as good as the habit. Early entries required prompting to be specific enough to be useful. The question format in /wrap has been refined twice already to pull out design decisions rather than just activity summaries.',
        forYourTeam:
          'The same pattern (structured context, committed to version control, queryable by AI) applies at team scale. Product teams that design their AI context deliberately (what goes in, in what format, with what structure) will get dramatically more consistent output than teams treating AI as a stateless Q&A tool. This is an infrastructure problem disguised as a workflow problem.',
      },
      {
        title: 'Panopticon Assistant: WhatsApp AI Agent',
        type: 'Product',
        status: 'Live',
        summary:
          'A two-way WhatsApp assistant that reads and writes to an Obsidian vault through Google Drive, giving conversational access to a personal knowledge base from a phone.',
        tried:
          'Built a serverless agent on Vercel that receives WhatsApp messages via Twilio webhook, runs an agentic tool-use loop with Claude Sonnet, and reads/writes vault files through the Google Drive API. The agent has three tools: list folders, read files, and write files. It can look up company pipeline status, update contact notes, capture ideas, and check what is due this week, all from a text message. Conversation history is persisted to Drive so the assistant retains context across messages within a 24-hour window, with a rolling buffer of the last 10 exchanges.',
        learned:
          "The hardest part of building a WhatsApp agent is not the AI. It is the plumbing. Twilio webhooks timeout after 15 seconds, so the handler must return immediately and process in the background using Vercel's waitUntil. The Google Drive service account needs explicit folder sharing to read the vault, and a separate storage strategy for files the agent creates itself. Conversation persistence sounds simple until the write fails silently and the agent loses all context. Each of these is a 30-minute fix once diagnosed, but the diagnostic loop is slow when your only debugging interface is a text message on your phone.",
        didntWork:
          'The conversation history initially stored in the shared vault folder, which the service account could not write to. Every message appeared to work (the agent responded correctly) but history was silently lost, making the assistant seem amnesiac. The fix was to store history in the service account\'s own Drive root where write access is guaranteed. The error was invisible in the response and only surfaced as a second "something went wrong" message after the actual reply had already been sent.',
        forYourTeam:
          'Messaging-based AI agents have a fundamentally different failure surface than web apps. There is no network tab, no console, no visual state to inspect. Every failure mode must be surfaced through the same text channel the user is communicating on, which means error handling is not just engineering hygiene but part of the UX. If your team is building conversational agents, invest in observability from day one. The feedback loop between "something is broken" and "I can see what broke" should be measured in seconds, not sessions.',
      },
      {
        title: 'Cowork as Design Collaborator: A Two-Claude Workflow',
        type: 'Workflow',
        status: 'Live',
        summary:
          'The portfolio redesign was driven by two Claude instances working in parallel. Cowork handled the strategy and editorial work; Warp handled the implementation. Each played to a different affordance.',
        tried:
          "Used Claude Cowork (a file-editing, strategy, and writing collaborator) for the substantive design work: case study reviews, copy decisions, structural choices, reading source decks and notes, drafting the scoring rubric, and editing TypeScript content data. In parallel, used Claude in Warp (terminal-based coding collaborator) as the implementation arm: build verification, component layout work, integration changes, image asset handling. I sat between them as the editor and decision-maker, passing state through structured handoff prompts.",
        learned:
          'Different AI collaborators are good at different things, and forcing one to do the other one\'s job always feels suboptimal. Cowork excels at substantive judgment: reading source materials, scoring against benchmarks, drafting copy with specific voice rules, deciding what should change. Warp excels at implementation: running builds, systematic find-and-replace, executing layout work, running diffs. Separating their roles and writing handoff prompts to bridge them improved both the speed and the output.',
        didntWork:
          'Started by treating both Claudes as interchangeable. The result was Cowork doing implementation work it could do but slower than Warp, and Warp doing copy work it could do but with less judgment than Cowork. Both worked. Both were suboptimal. The fix was a deliberate division of labor and a discipline around writing self-contained handoff prompts between sessions.',
        forYourTeam:
          "AI collaborators have specializations. A team adopting AI shouldn't pick one tool and force-fit it to every job. Different parts of the work benefit from different AI affordances. Build the workflow around the affordances, not around the brand.",
      },
      {
        title: 'Anonymizing a Client Case Study Without Losing the Substance',
        type: 'Workflow',
        status: 'Live',
        summary:
          'When an active client engagement needs to live in a portfolio but the client has not reviewed the writeup yet, anonymization is a design problem of its own.',
        tried:
          'Renamed a sim-racing telemetry case study from the actual product name to a descriptive label. Stripped specific feature names (the AI surface name, the chat agent name) and replaced them with generic descriptors. Genericized the four worked archetypes by question shape (spatial, temporal, distributional, state-along-line) rather than by product-internal terms. Kept the architectural reframe and the design moves visible. The case is still recognizable as itself but no longer leaks specifics that would identify the client to a competitor.',
        learned:
          "Anonymizing a case study is a constraint that pushes you toward the most defensible version of the design claim. Without the product name to lean on, the case has to stand on the design judgment alone. The reframe ('the agent and the workspace are architecturally separated') is more durable when it's not attached to a specific product's specific features, because the same reframe could apply to other products in the same space. That generality is a feature, not a bug.",
        didntWork:
          "First draft used direct quotes from the founder. Even paraphrased, attributed quotes risk identification. Reworked to take ownership of the claims rather than attribute them. The result is tighter and less dependent on a third party's voice. If the case can't stand without that quote, the case is leaning on the wrong thing.",
        forYourTeam:
          "Building a portfolio that includes active client engagements requires deciding up front what level of attribution is comfortable. The strongest case studies attribute design moves to the designer, not to overheard client conversations. If you can't say it as yours, it probably shouldn't be in the portfolio.",
      },
      {
        title: 'Playable Case Studies: Live Demo Embeds',
        type: 'Workflow',
        status: 'Live',
        summary:
          'Both AI product case studies on this site embed live, fully interactive versions of the apps inside iPhone frames, not screenshots. Designed because AI UX is about behavior, and screenshots hide behavior by definition.',
        tried:
          'Built demo-mode deployments of Cal and Epilog as separate Vercel projects with sanitized data and isolated state. In each expanded case study, the desktop layout is a CSS grid split view: a scrolling six-section narrative on the left, a sticky phone frame on the right with a live iframe of the demo app inside. The frame is a high-resolution iPhone 15 Pro Max PNG overlaid on the iframe with a transparent screen cutout, plus a thin border-ring mask between the iframe and the PNG to hide corner bleed where the app\'s full-width headers and bottom nav painted past the phone\'s rounded screen corners. Mobile drops the iframe entirely and uses inline screenshots at key narrative beats plus an "Explore the app" CTA that opens the demo in a new tab, because a phone inside a phone does not work.',
        learned:
          'For AI products, a screenshot lies by omission. The thing that makes an AI feature good or bad is how it behaves: how the plan generates under your inputs, how voice commands miss, how a missed-dose flow feels under the thumb at the end of a long day. Static images let you show the surface and hide the behavior, which is exactly the part a hiring manager needs to evaluate. Embedding the live app forces honesty and lets the reader interrogate the thing directly while reading the argument for why it was built that way. The narrative tells you what to notice; the demo lets you verify.',
        didntWork:
          "The first three phone-frame attempts were CSS-only (bezels, border-radius, titanium gradients) and all read as flat and obviously fake. Switching to a photographic frame PNG fixed realism but created the corner-bleed problem: the app's sticky headers and bottom nav painted past the screen's rounded corners, and no amount of iframe border-radius or inset tuning could achieve pixel-precise alignment with the PNG. The fix was an empty div with a thick border in the card background color, sitting between the iframe and the PNG, overlapping the frame's inner edge by a couple of pixels to mask the bleed invisibly. Obvious in hindsight, not while iterating.",
        forYourTeam:
          'Portfolio and marketing sites for AI products should default to embedded live demos over screenshot galleries. When behavior is the product, the medium of presentation has to match the medium of evaluation. A team that accepts screenshot-only case studies for AI work is implicitly asking reviewers to trust the summary over the artifact, which is the opposite of how good design review works. The corollary: design for a demo-mode deployment from day one (sanitized seed data, isolated state, embeddable as an iframe) rather than retrofitting it later.',
      },
    ],
  },
  {
    name: 'Research & Evaluation',
    entries: [
      {
        title: 'Scoring My Old Portfolio: Building a Rubric, Then Designing From the Diagnosis',
        type: 'Evaluation',
        status: 'Live',
        summary:
          'Built a 9-category rubric against six celebrated portfolios. Scored my old site at 60%. Used the category-level gaps to direct the redesign. Estimated new score: 93%.',
        tried:
          "Identified six celebrated designer portfolios as benchmark references: Simon Pan, Robin Noguier, Adham Dannaway, Buzz Usborne, Alin Buda, and James Foo. Derived a 9-category rubric covering first impression, visual craft, content hierarchy, case study quality, voice, technical execution, strategic positioning, conversion, and originality. Scored my old portfolio against each at a 1-to-5 scale. Total: 27 out of 45, or 60%. Compared against Alin Buda's 42 out of 45 (93%), the top reference. The 15-point gap became the redesign brief.",
        learned:
          "Working from a rubric instead of a vibe-based 'redesign my site' brief gave the work an objective compass. Every change could be evaluated against a specific category's score. The biggest single-category jump was Content Hierarchy (2 to 5), achieved by removing password walls, dropping modals, and adopting the single-page scroll-through structure. The smallest gain was Case Study Quality (held at 4), because the prior cases were already strong; the gain came from breadth (five detail pages instead of one) rather than depth per case.",
        didntWork:
          'The rubric is opinionated. It privileges scannability, evidence density, and distinctive identity. It under-values depth-on-click for technical readers and accessibility-as-design-statement. The estimated 93% score on the new site is self-assessment against the same opinionated lens. Anyone using a different rubric would score it differently.',
        forYourTeam:
          "Self-assessment against a rubric you wrote yourself is biased. The mitigation is to write the rubric before doing the redesign and to benchmark against external references. That doesn't remove the bias entirely, but it keeps the work honest. Without a rubric, 'this looks better' is the only available standard; with one, the conversation moves to which category moved how many points and why.",
      },
      {
        title: 'Gemini to Claude: Evaluating AI Provider Quality',
        type: 'Evaluation',
        status: 'Learning',
        summary:
          'What switching AI providers mid-project taught me about evaluating LLM output quality as a design decision.',
        tried:
          "Started Cal's plan generation on Gemini 1.5 Flash. Hit persistent reliability issues: API instability, inconsistent output structure, and quality that varied too much session to session to trust as the backbone of a user-facing feature. Switched to Claude Sonnet 4.6 after a structured comparison against the same prompt.",
        learned:
          'LLM evaluation is a UX research problem. The criteria that matter are not benchmark scores; they are output consistency (does it produce the same structure reliably?), tone adherence (does it maintain the persona defined?), constraint following (does it respect the rules?), and failure mode character (when it fails, how does it fail?). Claude failed more gracefully and more predictably. That predictability is what makes it usable in production.',
        didntWork:
          'The evaluation process was informal: prompt, compare, decide. A more rigorous rubric applied earlier would have caught the provider mismatch faster. Treating LLM selection as an engineering decision rather than a design decision cost a few days.',
        forYourTeam:
          'Teams evaluating AI providers or models should apply UX research methodology: define evaluation criteria before testing, test against real use cases not benchmarks, and weight failure modes as heavily as success rates. "It usually works" is not a production standard for anything user-facing.',
      },
      {
        title: 'Guitar Practice Guide',
        type: 'Experiment',
        status: 'Archived',
        summary:
          'A structured practice app designed to replace aimless noodling with focused sessions that build toward learning a specific song.',
        tried:
          'Designed a practice system where each session would be purposeful rather than open-ended, with a curated set of lessons covering theory, technique, and musical concepts that all ladder up to a target song. The idea was to give players a clear throughline: not just "practice guitar for 30 minutes" but "here\'s what you\'re working on today and why it matters for the thing you\'re trying to learn."',
        learned:
          'The concept held up. The technical reality did not. Audio processing turned out to be a much deeper problem than the practice structure itself, and the gap between a good idea and a functional musical tool was wider than the project could absorb at the time. Shelved in favor of more pressing work, but the core problem is still worth solving.',
        didntWork:
          'Audio processing for pitch detection and feedback is a specialized domain with real constraints: latency, noise, and device variation. Underestimated how much of the product depended on solving that before anything else could be validated.',
      },
    ],
  },
];
