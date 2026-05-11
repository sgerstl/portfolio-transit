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
  heroTitles?: string[];
};

export const LAB_CATEGORIES: LabCategory[] = [
  {
    name: 'Products & Tools',
    heroTitles: ['Epilog: Epilepsy Tracker'],
    entries: [
      {
        title: 'Cal: AI Personal Trainer',
        type: 'Product',
        status: 'Live',
        summary:
          'A fully functional AI training app built in 5 days: 6-week programs, live voice-guided workouts, adaptive to injuries and equipment.',
        tried:
          'Used Claude Sonnet 4.6 to generate structured 6-week training programs from onboarding inputs. Treated the AI prompt as a design artifact, iterating on it like a UI component with heuristic evaluation on the output rather than the code. Directed the full implementation through Claude Code, reviewing live output against design intent in real time.',
        learned:
          'AI accelerates execution but does not replace judgment; it sharpens the demand for it. The feedback loop compresses from days to minutes, and your evaluation criteria become the bottleneck, not production speed. The prompt is the most important design deliverable in an AI-powered product. Every hour spent refining it pays back across every user session.',
        didntWork:
          'The voice control system is functional but rough. Two-tier parsing (local regex with Claude Haiku as fallback) works architecturally, but edge cases (commands fired mid-exercise, background noise triggering transitions) exposed how fragile voice UX is without tight environmental constraints. Still being refined.',
        forYourTeam:
          'Any team shipping AI features needs this distinction: the prompt is a design artifact, not an engineering concern. Owning that gap (deciding what the AI says, in what tone, with what constraints) is a UX responsibility. The quality of AI output is a design outcome.',
        links: [
          { label: 'Interactive demo', url: 'https://cal-demo.scottgerstl.com' },
          { label: 'cal.scottgerstl.com', url: 'https://cal.scottgerstl.com' },
        ],
      },
      {
        title: 'Epilog: Epilepsy Tracker',
        type: 'Product',
        status: 'Live',
        summary:
          'A Progressive Web App for tracking seizures, medication adherence, and generating shareable medical reports, built for a family member living with epilepsy.',
        tried:
          'Designed a medical tracking tool with a specific person in mind. Someone who is logging an event while still recovering from it, trying to recall details that are already fading, and doing it on a phone in a moment of exhaustion. Every interaction was shaped by that reality: short steps, sensible defaults, minimal required fields. The goal was a tool that asks as little as possible while capturing everything that matters.',
        learned:
          'Proximity to the problem changes how you design. When you know the person using the app, you stop optimizing for the average case and start designing for the hard ones. The most valuable feature turned out to be the PDF export, because patients frequently arrive at neurology appointments without organized records of what has been happening. A well-structured report hands the doctor exactly what they need. That was not a technical insight. It came from sitting in the room.',
        demoUrl: 'https://epilog-demo.scottgerstl.com',
      },
      {
        title: 'This Portfolio Site',
        type: 'Product',
        status: 'Live',
        summary:
          'Rebuilt from a Figma Make export to a hand-owned React/Vite project, directed through Claude Code.',
        tried:
          'Used Claude Code to strip out Figma-specific dependencies, wire in proper TypeScript config, move hardcoded values to env vars, and extend the site with new features. Directed implementation in design language and evaluated output against the existing visual system in real time.',
        learned:
          'The designer-developer relationship changes when the AI is the developer. Instead of handoff and wait, it becomes continuous evaluation of live output against design intent. You need clearer mental models of what "right" looks like, and you need to be able to articulate them fast.',
      },
    ],
  },
  {
    name: 'Systems & Workflows',
    heroTitles: ['Employment Panopticon: AI-Powered Job Hunt Command Center'],
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
        title: 'Cal Voice Control: Finding the Right Fallback',
        type: 'Experiment',
        status: 'In Progress',
        summary:
          'Building a reliable voice command system for a live workout app, and learning where the hard limits of voice UX actually are.',
        tried:
          'Implemented a two-tier voice parsing system: local regex handles approximately 90% of commands instantly with no network round-trip, and Claude Haiku handles edge cases as a fallback. Added ElevenLabs TTS for synthesized coaching cues, with IndexedDB caching to avoid re-fetching repeated phrases and browser synthesis as a 6-second timeout fallback.',
        learned:
          'Voice UX in a gym environment is harder than it looks because the failure modes are physical, not digital. A missed "done" command mid-set means the user has to touch their phone between reps, exactly the friction the feature was supposed to eliminate. The architecture is right; the calibration of when to trigger Haiku versus when to ignore ambient noise is still being tuned.',
        didntWork:
          'The 8-second transition window between exercises was swallowing commands. Commands fired twice when the transcript updated incrementally. Haiku triggered on background noise that regex correctly ignored. Each fix revealed a new edge case. This is not a solvable problem; it is a calibration problem that requires real-world testing with real users in actual gyms.',
        forYourTeam:
          'Voice UX requires a different evaluation methodology than visual UX. Heuristic evaluation in a quiet office catches maybe 30% of failure modes. The other 70% only appear under physical use conditions. If your product has voice features, the test environment is part of the design spec, not an afterthought.',
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
