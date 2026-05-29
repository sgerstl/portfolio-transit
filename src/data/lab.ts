import { t, type L10n } from '../lib/i18n';

export type LabType = 'Product' | 'Workflow' | 'Experiment' | 'Evaluation';
export type LabStatus = 'Live' | 'In Progress' | 'Learning' | 'Archived';

export const LAB_TYPE_LABEL: Record<LabType, L10n> = {
  Product: t('Product', 'Produkt'),
  Workflow: t('Workflow', 'Workflow'),
  Experiment: t('Experiment', 'Experiment'),
  Evaluation: t('Evaluation', 'Bewertung'),
};

export const LAB_STATUS_LABEL: Record<LabStatus, L10n> = {
  Live: t('Live', 'Live'),
  'In Progress': t('In Progress', 'In Arbeit'),
  Learning: t('Learning', 'Lernen'),
  Archived: t('Archived', 'Archiviert'),
};

export type LabLink = {
  label: L10n;
  url: string;
};

export type LabEntry = {
  title: L10n;
  type: LabType;
  status: LabStatus;
  summary: L10n;
  tried: L10n;
  learned: L10n;
  didntWork?: L10n;
  forYourTeam?: L10n;
  links?: LabLink[];
  demoUrl?: string;
};

export type LabCategory = {
  name: L10n;
  entries: LabEntry[];
};

export const LAB_CATEGORIES: LabCategory[] = [
  {
    name: t('Products & Tools', 'Produkte & Tools'),
    entries: [
      {
        title: t(
          'Metro Metaphor: A Visual Identity That Reached the Data Structures',
          'Metro-Metapher: Eine visuelle Identität, die bis in die Datenstrukturen reichte',
        ),
        type: 'Experiment',
        status: 'Live',
        summary: t(
          'How a Berlin departure board became the structural identity of the entire site, after five other metaphors fell apart in execution.',
          'Wie eine Berliner Abfahrtstafel zur strukturellen Identität der gesamten Seite wurde, nachdem fünf andere Metaphern in der Umsetzung auseinandergefallen sind.',
        ),
        tried: t(
          'Tried five visual metaphors for the portfolio redesign: vintage transit poster, mission control panel, library, departure board / metro map, and minimalist Swiss design. Each had a hook. Four fell apart in execution. The departure board / metro stuck because the metaphor reached past the brand mark and into the data structures: lines became case categories (CS1 = AI, CS2 = Enterprise, P = Personal), stops became individual cases, ziel became the case name, Lesezeit became the reading time, and the current scroll position became the current stop.',
          'Fünf visuelle Metaphern für das Portfolio-Redesign ausprobiert: Vintage-Transit-Poster, Mission-Control-Panel, Bibliothek, Abfahrtstafel / U-Bahn-Plan und minimalistisches Swiss Design. Jede hatte einen Aufhänger. Vier sind in der Umsetzung auseinandergefallen. Die Abfahrtstafel / U-Bahn ist geblieben, weil die Metapher über die Bildmarke hinaus bis in die Datenstrukturen gereicht hat: Linien wurden Fall-Kategorien (CS1 = KI, CS2 = Enterprise, P = Persönlich), Stationen wurden einzelne Fälle, Ziel wurde der Fall-Name, Lesezeit wurde die Lesedauer, und die aktuelle Scroll-Position wurde der aktuelle Halt.',
        ),
        learned: t(
          "A sustained metaphor is harder than picking a strong one. The first three I tried were visually distinctive but stopped at the brand mark. The departure board worked because every level of the design system had a place in the metaphor's vocabulary. When the metaphor reaches into the data, it stops being decoration and becomes navigation.",
          'Eine durchgehaltene Metapher ist schwerer als eine starke auszuwählen. Die ersten drei, die ich ausprobiert habe, waren visuell markant, aber sind an der Bildmarke stehen geblieben. Die Abfahrtstafel hat funktioniert, weil jede Ebene des Designsystems einen Platz im Vokabular der Metapher hatte. Wenn die Metapher in die Daten reicht, hört sie auf, Dekoration zu sein, und wird zur Navigation.',
        ),
        didntWork: t(
          'Vintage transit poster was beautiful but read as nostalgic, not professional. Mission control was on-brand for AI but felt cliché. Library felt warm but disconnected from technical work. Swiss minimalist disappeared into the page background. The test for whether a metaphor sticks: can you describe a case study\'s information architecture using the metaphor\'s vocabulary without straining? Departure board passed. The others all failed at this exact step.',
          'Vintage-Transit-Poster war schön, las sich aber nostalgisch, nicht professionell. Mission Control war markenkonform für KI, fühlte sich aber wie ein Klischee an. Bibliothek war warm, aber von technischer Arbeit abgekoppelt. Swiss Minimalist ist im Seitenhintergrund verschwunden. Der Test, ob eine Metapher hält: Kann man die Informationsarchitektur einer Fallstudie mit dem Vokabular der Metapher beschreiben, ohne sich zu verbiegen? Abfahrtstafel hat bestanden. Die anderen sind alle an genau diesem Schritt gescheitert.',
        ),
        forYourTeam: t(
          "Visual identity for portfolios benefits from a metaphor that reaches the data structures, not just the surface styling. If you can't name your case studies' major fields in the metaphor's language, you'll fall back on conventional UI patterns and lose the brand.",
          'Visuelle Identität für Portfolios profitiert von einer Metapher, die bis in die Datenstrukturen reicht, nicht nur in das Oberflächen-Styling. Wenn man die wichtigsten Felder seiner Fallstudien nicht in der Sprache der Metapher benennen kann, fällt man auf konventionelle UI-Muster zurück und verliert die Marke.',
        ),
      },
      {
        title: t(
          'Departure Board UX: BVG-Styled Scroll-Linked Navigation',
          'Abfahrtstafel-UX: BVG-Style Scroll-gekoppelte Navigation',
        ),
        type: 'Product',
        status: 'Live',
        summary: t(
          'A persistent navigation element styled as a Berlin train station departure display, updating in real time as visitors scroll through case studies.',
          'Ein dauerhaft sichtbares Navigationselement im Stil einer Berliner Bahnhofs-Abfahrtsanzeige, das sich in Echtzeit aktualisiert, während Besucher durch die Fallstudien scrollen.',
        ),
        tried: t(
          "Built a fixed-position departure board in the top-right corner of every page. Mimics the BVG (Berlin transit authority) departure display: yellow LED-style monospaced text on black, German header labels (Linie, Ziel, Lesezeit). Each case is a stop with a line code, case name, and reading time. A 'Current Stop' indicator updates dynamically as the visitor scrolls, using IntersectionObserver against the case cards on the homepage.",
          'Eine Abfahrtstafel mit fester Position in der oberen rechten Ecke jeder Seite gebaut. Imitiert die BVG-Abfahrtsanzeige: gelbe Monospace-Schrift im LED-Stil auf Schwarz, deutsche Header-Labels (Linie, Ziel, Lesezeit). Jeder Fall ist ein Halt mit einem Linien-Code, Fall-Namen und Lesezeit. Ein „Aktueller Halt"-Indikator aktualisiert sich dynamisch, während der Besucher scrollt, mittels IntersectionObserver gegen die Fall-Karten auf der Startseite.',
        ),
        learned: t(
          "A piece of UI that looks decorative can do real navigation work if it's syntactically familiar. Anyone who has ridden the U-Bahn recognizes the departure-board format instantly. They read it correctly without instructions: Line, Destination, Time. The German labels convert the metaphor from 'transit-themed' to 'located in Berlin.' The board tells the visitor where I am without putting 'Based in Berlin' into copy.",
          'Ein Stück UI, das dekorativ aussieht, kann echte Navigationsarbeit leisten, wenn es syntaktisch vertraut ist. Jeder, der mit der U-Bahn gefahren ist, erkennt das Abfahrtstafel-Format sofort. Sie lesen es ohne Anleitung korrekt: Linie, Ziel, Zeit. Die deutschen Labels verwandeln die Metapher von „transit-thematisch" zu „in Berlin verortet". Die Tafel sagt dem Besucher, wo ich bin, ohne „in Berlin ansässig" in den Text zu schreiben.',
        ),
        didntWork: t(
          "First version updated on every scroll event, which was wasteful and visually flickery. Switched to IntersectionObserver against the case cards, which produces a clean 'you are now at X' signal only when a card crosses the viewport's midline. Also tried rendering the board with bitmap pixel-style text. Looked great in mockup but didn't scale across browsers. Reverted to a clean monospaced webfont with tight letter-spacing.",
          'Die erste Version hat sich bei jedem Scroll-Event aktualisiert, was verschwenderisch und visuell flackerig war. Auf IntersectionObserver gegen die Fall-Karten umgestiegen, was ein sauberes „du bist jetzt bei X"-Signal nur dann erzeugt, wenn eine Karte die Mittellinie des Viewports überquert. Auch versucht, die Tafel mit Bitmap-Pixel-Schrift zu rendern. Sah im Mockup großartig aus, hat aber über Browser hinweg nicht skaliert. Zurück zu einer sauberen Monospace-Webfont mit engem Buchstabenabstand.',
        ),
        forYourTeam: t(
          "Navigation elements that look decorative can still be load-bearing. If a UI element resembles familiar infrastructure (a thermometer, a clock, a departure board, a weather widget), users will read it correctly without instructions. That's a design budget that costs nothing once you commit to the metaphor.",
          'Navigationselemente, die dekorativ aussehen, können trotzdem tragend sein. Wenn ein UI-Element vertrauter Infrastruktur ähnelt (ein Thermometer, eine Uhr, eine Abfahrtstafel, ein Wetter-Widget), lesen Nutzer es ohne Anleitung korrekt. Das ist ein Design-Budget, das nichts kostet, sobald man sich auf die Metapher festlegt.',
        ),
      },
      {
        title: t(
          'Three Portfolio Patterns I Prototyped and Dropped',
          'Drei Portfolio-Muster, die ich prototypisiert und verworfen habe',
        ),
        type: 'Experiment',
        status: 'Archived',
        summary: t(
          'What the redesign tried and rejected: a password wall on case studies, modal-revealed services, and a philosophical hero headline. Three honest did-not-works.',
          'Was das Redesign versucht und verworfen hat: eine Passwort-Sperre für Fallstudien, modal-enthüllte Services und eine philosophische Hero-Überschrift. Drei ehrliche Was-nicht-funktioniert-hats.',
        ),
        tried: t(
          "The old portfolio had three patterns I assumed I'd keep. A password wall on enterprise case studies (rationale: NDA content gating). Modal interactions for surfacing service categories on hover (rationale: keeping the homepage clean). A philosophical hero headline 'The hardest part of software has always been knowing what to build' (rationale: signaling depth). Each had a defensible case. Each tested poorly against the redesign rubric.",
          'Das alte Portfolio hatte drei Muster, von denen ich annahm, dass ich sie behalten würde. Eine Passwort-Sperre auf Enterprise-Fallstudien (Begründung: NDA-Inhalts-Schutz). Modal-Interaktionen zum Hervorbringen von Service-Kategorien beim Hover (Begründung: die Startseite sauber halten). Eine philosophische Hero-Überschrift „Das Schwerste an Software war schon immer, zu wissen, was zu bauen ist" (Begründung: Tiefe signalisieren). Jedes hatte einen verteidigbaren Fall. Jedes hat schlecht gegen die Redesign-Rubrik abgeschnitten.',
        ),
        learned: t(
          "All three failed the same way: they made the visitor do extra work to find out what I do. Hiring managers spend thirty seconds before deciding whether to scroll further. Anything that introduces friction in that window is paying for itself with their time. The redesign's organizing principle became: the page should give a recruiter the answer before they have to ask the question. Every removal followed from that.",
          'Alle drei sind auf dieselbe Weise gescheitert: Sie haben den Besucher zusätzliche Arbeit machen lassen, um herauszufinden, was ich mache. Hiring Manager geben dreißig Sekunden, bevor sie entscheiden, ob sie weiterscrollen. Alles, was in diesem Fenster Reibung einbringt, bezahlt sich mit ihrer Zeit. Das ordnende Prinzip des Redesigns wurde: Die Seite sollte einem Recruiter die Antwort geben, bevor er die Frage stellen muss. Jede Entfernung folgte daraus.',
        ),
        didntWork: t(
          "Password walls signal 'trust me' but read as 'won't show you.' Modals require commitment before reveal; visitors arrived skeptical, and commitment was the wrong direction. Philosophical headlines flatter the writer but force the reader to do interpretation in a five-second window where they should be receiving a claim. Three different rationales, one same failure mode.",
          'Passwort-Sperren signalisieren „vertrau mir", lesen sich aber als „zeige ich dir nicht". Modals erfordern eine Verpflichtung vor der Enthüllung; Besucher kamen skeptisch an, und Verpflichtung war die falsche Richtung. Philosophische Überschriften schmeicheln dem Autor, zwingen aber den Leser in einem Fünf-Sekunden-Fenster zur Interpretation, in dem er einen Anspruch entgegennehmen sollte. Drei verschiedene Begründungen, derselbe Fehlermodus.',
        ),
        forYourTeam: t(
          "The portfolio patterns that get cut are often the ones that felt smart. 'Smart' usually means requires interpretation, which usually means loses the casual reader. Portfolios are casual-reader artifacts. Save the interpretation density for the case study bodies, not the navigation.",
          'Die Portfolio-Muster, die rausgekürzt werden, sind oft die, die sich klug angefühlt haben. „Klug" heißt meist, dass es Interpretation erfordert, was meist heißt, dass man den beiläufigen Leser verliert. Portfolios sind Artefakte für beiläufige Leser. Spar dir die Interpretationsdichte für die Fallstudien-Bodies, nicht für die Navigation.',
        ),
      },
    ],
  },
  {
    name: t('Systems & Workflows', 'Systeme & Workflows'),
    entries: [
      {
        title: t(
          'Employment Panopticon: AI-Powered Job Hunt Command Center',
          'Employment Panopticon: KI-gestütztes Job-Such-Kommandozentrum',
        ),
        type: 'Product',
        status: 'In Progress',
        summary: t(
          'A full-stack job search pipeline that scans Gmail, scores leads with AI, manages companies through a web app, and nudges me via WhatsApp when something needs attention.',
          'Eine Full-Stack-Pipeline für die Jobsuche, die Gmail scannt, Leads mit KI bewertet, Unternehmen über eine Web-App verwaltet und mich per WhatsApp anstößt, wenn etwas Aufmerksamkeit braucht.',
        ),
        tried: t(
          'Outgrew an Obsidian vault and rebuilt the pipeline as a Next.js app on Neon Postgres. Scout scans Gmail every 15 minutes, classifies emails, and uses Claude Haiku to score job listings against my profile. Strong matches become leads automatically. The web app handles the visual pipeline with company details, contacts, history, and a built-in assistant called Jeremy. A reminder system sends WhatsApp nudges for overdue actions.',
          'Bin einem Obsidian-Vault entwachsen und habe die Pipeline als Next.js-App auf Neon Postgres neu gebaut. Scout scannt Gmail alle 15 Minuten, klassifiziert E-Mails und nutzt Claude Haiku, um Stellenanzeigen gegen mein Profil zu bewerten. Starke Treffer werden automatisch zu Leads. Die Web-App handhabt die visuelle Pipeline mit Unternehmensdetails, Kontakten, Verlauf und einem eingebauten Assistenten namens Jeremy. Ein Erinnerungssystem schickt WhatsApp-Anstöße für überfällige Aktionen.',
        ),
        learned: t(
          'Moving to a real database unlocked everything. Once data was structured, every automation (Scout, reminders, Jeremy, enrichment) could plug in independently. Claude appears in five places in this system, each with a different model and purpose. Treating each AI touchpoint as its own design problem, rather than a single "add AI" feature, is what made them reliable.',
          'Der Wechsel zu einer echten Datenbank hat alles freigeschaltet. Sobald die Daten strukturiert waren, konnte jede Automatisierung (Scout, Erinnerungen, Jeremy, Anreicherung) unabhängig andocken. Claude taucht an fünf Stellen in diesem System auf, jede mit einem anderen Modell und einem anderen Zweck. Jeden KI-Touchpoint als eigenes Designproblem zu behandeln, statt als einzelnes „KI hinzufügen"-Feature, ist das, was sie verlässlich gemacht hat.',
        ),
        forYourTeam: t(
          'Map every AI touchpoint as a separate design artifact with its own model selection, prompt, and evaluation criteria. Email classification, job scoring, and conversational Q&A are fundamentally different interaction patterns that happen to share a provider.',
          'Bildet jeden KI-Touchpoint als separates Designartefakt ab, mit eigener Modellauswahl, eigenem Prompt und eigenen Bewertungskriterien. E-Mail-Klassifizierung, Job-Bewertung und konversationelle Q&A sind grundlegend unterschiedliche Interaktionsmuster, die zufällig denselben Anbieter teilen.',
        ),
      },
      {
        title: t(
          'Panopticon: Persistent AI Context System',
          'Panopticon: Persistentes KI-Kontextsystem',
        ),
        type: 'Workflow',
        status: 'Live',
        summary: t(
          'The structured Obsidian vault and session logging system underneath the Employment Panopticon, designed to give Claude persistent memory across projects and conversations.',
          'Der strukturierte Obsidian-Vault und das Session-Logging-System unter dem Employment Panopticon, entworfen, um Claude ein persistentes Gedächtnis über Projekte und Gespräche hinweg zu geben.',
        ),
        tried: t(
          'Built a knowledge vault in Obsidian designed specifically for AI collaboration. Core mechanic: a /wrap slash command that runs a structured debrief at the end of every working session, asking for intention, decisions, and open questions, then writes the entry to a session log and commits it to git automatically. The logs are structured to be synthesized by AI in future sessions, not just read by humans. The vault has since become the knowledge layer for a larger system: company and contact notes feed into the web app, session logs preserve design reasoning across tools, and a WhatsApp assistant can read and write vault files through Google Drive.',
          'Einen Wissens-Vault in Obsidian gebaut, speziell für die KI-Zusammenarbeit entworfen. Kernmechanik: ein /wrap-Slash-Command, der am Ende jeder Arbeits-Session ein strukturiertes Debrief fährt, nach Absicht, Entscheidungen und offenen Fragen fragt, dann den Eintrag in ein Session-Log schreibt und automatisch in Git committet. Die Logs sind so strukturiert, dass sie in zukünftigen Sessions von KI synthetisiert werden, nicht nur von Menschen gelesen. Der Vault ist seitdem zur Wissensebene für ein größeres System geworden: Unternehmens- und Kontaktnotizen fließen in die Web-App, Session-Logs erhalten Design-Begründungen über Tools hinweg, und ein WhatsApp-Assistent kann Vault-Dateien über Google Drive lesen und schreiben.',
        ),
        learned: t(
          'The most valuable thing to capture is not what you built; it is why you built it and what you were uncertain about. Git tracks the what. The session log tracks the why. Keeping both in the same system, versioned together, means you can reconstruct the reasoning behind any decision weeks later. Structure reduces friction: making the debrief a slash command means it actually happens. The vault also proved its value as a foundation layer. When the pipeline moved to a database, the vault did not become obsolete. It became the unstructured complement to structured data, holding the context that does not fit in rows and columns.',
          'Das Wertvollste zum Festhalten ist nicht, was du gebaut hast; es ist, warum du es gebaut hast und worüber du dir unsicher warst. Git verfolgt das Was. Das Session-Log verfolgt das Warum. Beides im selben System zu halten, gemeinsam versioniert, heißt, dass man die Begründung hinter jeder Entscheidung Wochen später rekonstruieren kann. Struktur reduziert Reibung: Das Debrief zu einem Slash-Command zu machen heißt, dass es tatsächlich passiert. Der Vault hat sich auch als Fundament-Ebene bewährt. Als die Pipeline in eine Datenbank umgezogen ist, ist der Vault nicht obsolet geworden. Er wurde zum unstrukturierten Komplement zu strukturierten Daten, das den Kontext hält, der nicht in Zeilen und Spalten passt.',
        ),
        didntWork: t(
          'The system is only as good as the habit. Early entries required prompting to be specific enough to be useful. The question format in /wrap has been refined twice already to pull out design decisions rather than just activity summaries.',
          'Das System ist nur so gut wie die Gewohnheit. Frühe Einträge brauchten Anstöße, um spezifisch genug zu sein, um nützlich zu sein. Das Frageformat in /wrap wurde bereits zweimal verfeinert, um Designentscheidungen herauszuholen statt nur Aktivitätszusammenfassungen.',
        ),
        forYourTeam: t(
          'The same pattern (structured context, committed to version control, queryable by AI) applies at team scale. Product teams that design their AI context deliberately (what goes in, in what format, with what structure) will get dramatically more consistent output than teams treating AI as a stateless Q&A tool. This is an infrastructure problem disguised as a workflow problem.',
          'Dasselbe Muster (strukturierter Kontext, in der Versionskontrolle committet, von KI abfragbar) gilt auf Team-Ebene. Produktteams, die ihren KI-Kontext bewusst entwerfen (was reingeht, in welchem Format, mit welcher Struktur), werden dramatisch konsistentere Ergebnisse bekommen als Teams, die KI als zustandsloses Q&A-Tool behandeln. Das ist ein Infrastruktur-Problem, das als Workflow-Problem getarnt ist.',
        ),
      },
      {
        title: t(
          'Panopticon Assistant: WhatsApp AI Agent',
          'Panopticon Assistant: WhatsApp-KI-Agent',
        ),
        type: 'Product',
        status: 'Live',
        summary: t(
          'A two-way WhatsApp assistant that reads and writes to an Obsidian vault through Google Drive, giving conversational access to a personal knowledge base from a phone.',
          'Ein bidirektionaler WhatsApp-Assistent, der über Google Drive einen Obsidian-Vault liest und beschreibt, was vom Telefon aus konversationellen Zugriff auf eine persönliche Wissensbasis gibt.',
        ),
        tried: t(
          'Built a serverless agent on Vercel that receives WhatsApp messages via Twilio webhook, runs an agentic tool-use loop with Claude Sonnet, and reads/writes vault files through the Google Drive API. The agent has three tools: list folders, read files, and write files. It can look up company pipeline status, update contact notes, capture ideas, and check what is due this week, all from a text message. Conversation history is persisted to Drive so the assistant retains context across messages within a 24-hour window, with a rolling buffer of the last 10 exchanges.',
          'Einen serverless Agenten auf Vercel gebaut, der WhatsApp-Nachrichten über einen Twilio-Webhook empfängt, eine agentische Tool-Use-Schleife mit Claude Sonnet fährt und Vault-Dateien über die Google-Drive-API liest und schreibt. Der Agent hat drei Tools: Ordner auflisten, Dateien lesen und Dateien schreiben. Er kann Unternehmens-Pipeline-Status nachschlagen, Kontaktnotizen aktualisieren, Ideen festhalten und prüfen, was diese Woche ansteht, alles aus einer Textnachricht heraus. Der Gesprächsverlauf wird in Drive persistiert, damit der Assistent den Kontext über Nachrichten hinweg in einem 24-Stunden-Fenster behält, mit einem rollenden Puffer der letzten 10 Austausche.',
        ),
        learned: t(
          "The hardest part of building a WhatsApp agent is not the AI. It is the plumbing. Twilio webhooks timeout after 15 seconds, so the handler must return immediately and process in the background using Vercel's waitUntil. The Google Drive service account needs explicit folder sharing to read the vault, and a separate storage strategy for files the agent creates itself. Conversation persistence sounds simple until the write fails silently and the agent loses all context. Each of these is a 30-minute fix once diagnosed, but the diagnostic loop is slow when your only debugging interface is a text message on your phone.",
          'Das Schwerste am Bauen eines WhatsApp-Agenten ist nicht die KI. Es sind die Rohre. Twilio-Webhooks laufen nach 15 Sekunden aus, also muss der Handler sofort zurückkehren und im Hintergrund über Vercels waitUntil weiterverarbeiten. Das Google-Drive-Service-Account braucht explizites Ordner-Sharing, um den Vault zu lesen, und eine separate Speicher-Strategie für Dateien, die der Agent selbst erzeugt. Gesprächspersistenz klingt einfach, bis der Schreibvorgang still scheitert und der Agent allen Kontext verliert. Jedes davon ist ein 30-Minuten-Fix, sobald diagnostiziert, aber die Diagnoseschleife ist langsam, wenn dein einziges Debugging-Interface eine Textnachricht auf dem Telefon ist.',
        ),
        didntWork: t(
          'The conversation history initially stored in the shared vault folder, which the service account could not write to. Every message appeared to work (the agent responded correctly) but history was silently lost, making the assistant seem amnesiac. The fix was to store history in the service account\'s own Drive root where write access is guaranteed. The error was invisible in the response and only surfaced as a second "something went wrong" message after the actual reply had already been sent.',
          'Der Gesprächsverlauf wurde anfangs im geteilten Vault-Ordner gespeichert, in den das Service-Account nicht schreiben konnte. Jede Nachricht schien zu funktionieren (der Agent hat korrekt geantwortet), aber der Verlauf ging still verloren, sodass der Assistent amnesisch wirkte. Der Fix war, den Verlauf im eigenen Drive-Root des Service-Accounts zu speichern, wo Schreibzugriff garantiert ist. Der Fehler war in der Antwort unsichtbar und tauchte nur als zweite „etwas ist schiefgelaufen"-Nachricht auf, nachdem die eigentliche Antwort bereits gesendet war.',
        ),
        forYourTeam: t(
          'Messaging-based AI agents have a fundamentally different failure surface than web apps. There is no network tab, no console, no visual state to inspect. Every failure mode must be surfaced through the same text channel the user is communicating on, which means error handling is not just engineering hygiene but part of the UX. If your team is building conversational agents, invest in observability from day one. The feedback loop between "something is broken" and "I can see what broke" should be measured in seconds, not sessions.',
          'Messaging-basierte KI-Agenten haben eine grundlegend andere Fehleroberfläche als Web-Apps. Es gibt keinen Network-Tab, keine Konsole, keinen visuellen Zustand zum Inspizieren. Jeder Fehlermodus muss über denselben Textkanal sichtbar gemacht werden, über den der Nutzer kommuniziert, was heißt, dass Fehlerbehandlung nicht nur Engineering-Hygiene ist, sondern Teil der UX. Wenn dein Team konversationelle Agenten baut, investiert vom ersten Tag an in Observability. Die Feedback-Schleife zwischen „etwas ist kaputt" und „ich kann sehen, was kaputt ist" sollte in Sekunden gemessen werden, nicht in Sessions.',
        ),
      },
      {
        title: t(
          'Cowork as Design Collaborator: A Two-Claude Workflow',
          'Cowork als Design-Mitarbeiter: Ein Zwei-Claude-Workflow',
        ),
        type: 'Workflow',
        status: 'Live',
        summary: t(
          'The portfolio redesign was driven by two Claude instances working in parallel. Cowork handled the strategy and editorial work; Warp handled the implementation. Each played to a different affordance.',
          'Das Portfolio-Redesign wurde von zwei parallel arbeitenden Claude-Instanzen vorangetrieben. Cowork hat die Strategie- und Redaktionsarbeit gemacht; Warp hat die Umsetzung gemacht. Jeder hat seine eigene Affordance ausgespielt.',
        ),
        tried: t(
          "Used Claude Cowork (a file-editing, strategy, and writing collaborator) for the substantive design work: case study reviews, copy decisions, structural choices, reading source decks and notes, drafting the scoring rubric, and editing TypeScript content data. In parallel, used Claude in Warp (terminal-based coding collaborator) as the implementation arm: build verification, component layout work, integration changes, image asset handling. I sat between them as the editor and decision-maker, passing state through structured handoff prompts.",
          'Claude Cowork (ein Mitarbeiter für Dateien, Strategie und Texte) für die inhaltliche Designarbeit genutzt: Fallstudien-Reviews, Copy-Entscheidungen, strukturelle Entscheidungen, Quellmaterial und Notizen lesen, die Bewertungsrubrik entwerfen und Content-Daten in TypeScript pflegen. Parallel Claude in Warp (terminal-basierter Coding-Mitarbeiter) als Umsetzungsarm: Build-Verifikation, Komponenten-Layout-Arbeit, Integrationsänderungen, Bildasset-Handhabung. Ich saß zwischen ihnen als Redakteur und Entscheider und habe Zustand über strukturierte Übergabe-Prompts weitergereicht.',
        ),
        learned: t(
          "Different AI collaborators are good at different things, and forcing one to do the other one's job always feels suboptimal. Cowork excels at substantive judgment: reading source materials, scoring against benchmarks, drafting copy with specific voice rules, deciding what should change. Warp excels at implementation: running builds, systematic find-and-replace, executing layout work, running diffs. Separating their roles and writing handoff prompts to bridge them improved both the speed and the output.",
          'Unterschiedliche KI-Mitarbeiter sind gut in unterschiedlichen Dingen, und einen zu zwingen, die Arbeit des anderen zu machen, fühlt sich immer suboptimal an. Cowork glänzt bei inhaltlichem Urteil: Quellmaterial lesen, gegen Benchmarks bewerten, Copy mit spezifischen Voice-Regeln entwerfen, entscheiden, was sich ändern soll. Warp glänzt bei der Umsetzung: Builds laufen lassen, systematisches Find-and-Replace, Layout-Arbeit ausführen, Diffs prüfen. Ihre Rollen zu trennen und Übergabe-Prompts zu schreiben, um sie zu überbrücken, hat sowohl die Geschwindigkeit als auch das Ergebnis verbessert.',
        ),
        didntWork: t(
          "Started by treating both Claudes as interchangeable. The result was Cowork doing implementation work it could do but slower than Warp, and Warp doing copy work it could do but with less judgment than Cowork. Both worked. Both were suboptimal. The fix was a deliberate division of labor and a discipline around writing self-contained handoff prompts between sessions.",
          'Angefangen, beide Claudes als austauschbar zu behandeln. Das Ergebnis war, dass Cowork Umsetzungsarbeit gemacht hat, die er machen konnte, aber langsamer als Warp, und Warp Copy-Arbeit gemacht hat, die er machen konnte, aber mit weniger Urteilsvermögen als Cowork. Beides hat funktioniert. Beides war suboptimal. Der Fix war eine bewusste Arbeitsteilung und eine Disziplin rund um das Schreiben selbsterklärender Übergabe-Prompts zwischen Sessions.',
        ),
        forYourTeam: t(
          "AI collaborators have specializations. A team adopting AI shouldn't pick one tool and force-fit it to every job. Different parts of the work benefit from different AI affordances. Build the workflow around the affordances, not around the brand.",
          'KI-Mitarbeiter haben Spezialisierungen. Ein Team, das KI adoptiert, sollte nicht ein Tool nehmen und es auf jeden Job zwingen. Verschiedene Teile der Arbeit profitieren von verschiedenen KI-Affordances. Baut den Workflow rund um die Affordances, nicht rund um die Marke.',
        ),
      },
      {
        title: t(
          'Anonymizing a Client Case Study Without Losing the Substance',
          'Eine Kunden-Fallstudie anonymisieren, ohne die Substanz zu verlieren',
        ),
        type: 'Workflow',
        status: 'Live',
        summary: t(
          'When an active client engagement needs to live in a portfolio but the client has not reviewed the writeup yet, anonymization is a design problem of its own.',
          'Wenn ein aktives Kunden-Engagement in einem Portfolio leben soll, der Kunde aber den Text noch nicht geprüft hat, ist Anonymisierung ein eigenes Designproblem.',
        ),
        tried: t(
          'Renamed a sim-racing telemetry case study from the actual product name to a descriptive label. Stripped specific feature names (the AI surface name, the chat agent name) and replaced them with generic descriptors. Genericized the four worked archetypes by question shape (spatial, temporal, distributional, state-along-line) rather than by product-internal terms. Kept the architectural reframe and the design moves visible. The case is still recognizable as itself but no longer leaks specifics that would identify the client to a competitor.',
          'Eine Sim-Racing-Telemetrie-Fallstudie vom tatsächlichen Produktnamen auf ein beschreibendes Label umbenannt. Spezifische Feature-Namen (der Name der KI-Oberfläche, der Name des Chat-Agenten) entfernt und durch generische Beschreibungen ersetzt. Die vier ausgearbeiteten Archetypen generisch nach Fragenform (räumlich, zeitlich, verteilungsbezogen, Zustand-entlang-Linie) statt nach produkt-internen Begriffen benannt. Die architektonische Neurahmung und die Designzüge sichtbar gehalten. Der Fall ist immer noch als er selbst erkennbar, aber lässt keine Spezifika mehr durch, die den Kunden gegenüber einem Wettbewerber identifizieren würden.',
        ),
        learned: t(
          "Anonymizing a case study is a constraint that pushes you toward the most defensible version of the design claim. Without the product name to lean on, the case has to stand on the design judgment alone. The reframe ('the agent and the workspace are architecturally separated') is more durable when it's not attached to a specific product's specific features, because the same reframe could apply to other products in the same space. That generality is a feature, not a bug.",
          'Eine Fallstudie zu anonymisieren ist eine Einschränkung, die einen zur verteidigbarsten Version des Design-Anspruchs drängt. Ohne den Produktnamen, auf den man sich stützen kann, muss der Fall allein auf dem Designurteil stehen. Die Neurahmung („der Agent und die Arbeitsfläche sind architektonisch getrennt") ist haltbarer, wenn sie nicht an die spezifischen Features eines spezifischen Produkts gebunden ist, weil dieselbe Neurahmung auf andere Produkte im selben Raum angewendet werden könnte. Diese Allgemeinheit ist ein Feature, kein Bug.',
        ),
        didntWork: t(
          "First draft used direct quotes from the founder. Even paraphrased, attributed quotes risk identification. Reworked to take ownership of the claims rather than attribute them. The result is tighter and less dependent on a third party's voice. If the case can't stand without that quote, the case is leaning on the wrong thing.",
          'Der erste Entwurf hat direkte Zitate vom Gründer verwendet. Selbst paraphrasiert riskieren zugeschriebene Zitate eine Identifizierung. Überarbeitet, um die Ansprüche selbst zu vertreten, statt sie zuzuschreiben. Das Ergebnis ist enger und weniger von der Stimme einer dritten Partei abhängig. Wenn der Fall ohne dieses Zitat nicht stehen kann, lehnt er sich an die falsche Sache an.',
        ),
        forYourTeam: t(
          "Building a portfolio that includes active client engagements requires deciding up front what level of attribution is comfortable. The strongest case studies attribute design moves to the designer, not to overheard client conversations. If you can't say it as yours, it probably shouldn't be in the portfolio.",
          'Ein Portfolio zu bauen, das aktive Kunden-Engagements einschließt, erfordert vorab zu entscheiden, welches Maß an Zuschreibung angenehm ist. Die stärksten Fallstudien schreiben Designzüge dem Designer zu, nicht überhörten Kundengesprächen. Wenn man es nicht als das eigene sagen kann, sollte es wahrscheinlich nicht im Portfolio sein.',
        ),
      },
      {
        title: t(
          'Playable Case Studies: Live Demo Embeds',
          'Spielbare Fallstudien: Live-Demo-Embeds',
        ),
        type: 'Workflow',
        status: 'Live',
        summary: t(
          'Both AI product case studies on this site embed live, fully interactive versions of the apps inside iPhone frames, not screenshots. Designed because AI UX is about behavior, and screenshots hide behavior by definition.',
          'Beide KI-Produkt-Fallstudien auf dieser Seite betten lebendige, voll interaktive Versionen der Apps in iPhone-Rahmen ein, keine Screenshots. So entworfen, weil KI-UX um Verhalten geht, und Screenshots Verhalten per Definition verbergen.',
        ),
        tried: t(
          'Built demo-mode deployments of Cal and Epilog as separate Vercel projects with sanitized data and isolated state. In each expanded case study, the desktop layout is a CSS grid split view: a scrolling six-section narrative on the left, a sticky phone frame on the right with a live iframe of the demo app inside. The frame is a high-resolution iPhone 15 Pro Max PNG overlaid on the iframe with a transparent screen cutout, plus a thin border-ring mask between the iframe and the PNG to hide corner bleed where the app\'s full-width headers and bottom nav painted past the phone\'s rounded screen corners. Mobile drops the iframe entirely and uses inline screenshots at key narrative beats plus an "Explore the app" CTA that opens the demo in a new tab, because a phone inside a phone does not work.',
          'Demo-Mode-Deployments von Cal und Epilog als separate Vercel-Projekte mit bereinigten Daten und isoliertem Zustand gebaut. In jeder erweiterten Fallstudie ist das Desktop-Layout eine CSS-Grid-Split-Ansicht: links eine scrollende Sechs-Abschnitt-Erzählung, rechts ein klebriger Telefon-Rahmen mit einem Live-Iframe der Demo-App darin. Der Rahmen ist ein hochauflösendes iPhone-15-Pro-Max-PNG, über den Iframe gelegt mit einem transparenten Bildschirm-Ausschnitt, plus eine dünne Rahmenring-Maske zwischen Iframe und PNG, um den Eck-Überlauf zu verstecken, wo die Full-Width-Header und die Bottom-Nav der App über die abgerundeten Bildschirm-Ecken des Telefons hinaus gemalt haben. Mobile lässt den Iframe vollständig fallen und nutzt Inline-Screenshots an wichtigen Erzähl-Schlägen plus einen „Die App erkunden"-CTA, der die Demo in einem neuen Tab öffnet, weil ein Telefon im Telefon nicht funktioniert.',
        ),
        learned: t(
          'For AI products, a screenshot lies by omission. The thing that makes an AI feature good or bad is how it behaves: how the plan generates under your inputs, how voice commands miss, how a missed-dose flow feels under the thumb at the end of a long day. Static images let you show the surface and hide the behavior, which is exactly the part a hiring manager needs to evaluate. Embedding the live app forces honesty and lets the reader interrogate the thing directly while reading the argument for why it was built that way. The narrative tells you what to notice; the demo lets you verify.',
          'Für KI-Produkte lügt ein Screenshot durch Auslassung. Das, was ein KI-Feature gut oder schlecht macht, ist, wie es sich verhält: wie der Plan unter deinen Eingaben generiert, wie Sprachbefehle danebengehen, wie sich ein Ablauf nach einer verpassten Dosis am Ende eines langen Tages unter den Fingern anfühlt. Statische Bilder lassen dich die Oberfläche zeigen und das Verhalten verbergen, was genau der Teil ist, den ein Hiring Manager bewerten muss. Die Live-App einzubetten erzwingt Ehrlichkeit und lässt den Leser das Ding direkt befragen, während er das Argument liest, warum es so gebaut wurde. Die Erzählung sagt dir, worauf zu achten ist; die Demo lässt dich verifizieren.',
        ),
        didntWork: t(
          "The first three phone-frame attempts were CSS-only (bezels, border-radius, titanium gradients) and all read as flat and obviously fake. Switching to a photographic frame PNG fixed realism but created the corner-bleed problem: the app's sticky headers and bottom nav painted past the screen's rounded corners, and no amount of iframe border-radius or inset tuning could achieve pixel-precise alignment with the PNG. The fix was an empty div with a thick border in the card background color, sitting between the iframe and the PNG, overlapping the frame's inner edge by a couple of pixels to mask the bleed invisibly. Obvious in hindsight, not while iterating.",
          'Die ersten drei Telefon-Rahmen-Versuche waren nur CSS (Lünetten, Border-Radius, Titanverläufe) und lasen sich alle als flach und offensichtlich gefälscht. Auf ein fotografisches Rahmen-PNG umzusteigen, hat den Realismus gelöst, aber das Eck-Überlauf-Problem erzeugt: Die klebrigen Header und die Bottom-Nav der App haben über die abgerundeten Bildschirm-Ecken hinaus gemalt, und keine Menge an Iframe-Border-Radius oder Inset-Tuning konnte eine pixelgenaue Ausrichtung mit dem PNG erreichen. Der Fix war ein leeres div mit einem dicken Rand in der Karten-Hintergrundfarbe, das zwischen Iframe und PNG sitzt und die innere Kante des Rahmens um ein paar Pixel überlappt, um den Überlauf unsichtbar zu maskieren. Im Nachhinein offensichtlich, beim Iterieren nicht.',
        ),
        forYourTeam: t(
          'Portfolio and marketing sites for AI products should default to embedded live demos over screenshot galleries. When behavior is the product, the medium of presentation has to match the medium of evaluation. A team that accepts screenshot-only case studies for AI work is implicitly asking reviewers to trust the summary over the artifact, which is the opposite of how good design review works. The corollary: design for a demo-mode deployment from day one (sanitized seed data, isolated state, embeddable as an iframe) rather than retrofitting it later.',
          'Portfolio- und Marketing-Seiten für KI-Produkte sollten standardmäßig auf eingebettete Live-Demos statt auf Screenshot-Galerien setzen. Wenn das Verhalten das Produkt ist, muss das Präsentationsmedium dem Bewertungsmedium entsprechen. Ein Team, das nur Screenshot-Fallstudien für KI-Arbeit akzeptiert, bittet die Reviewer implizit, der Zusammenfassung mehr zu vertrauen als dem Artefakt, was das Gegenteil davon ist, wie gutes Design-Review funktioniert. Der Folgesatz: Entwirf für ein Demo-Mode-Deployment vom ersten Tag an (bereinigte Seed-Daten, isolierter Zustand, als Iframe einbettbar), statt es später nachzurüsten.',
        ),
      },
    ],
  },
  {
    name: t('Research & Evaluation', 'Forschung & Bewertung'),
    entries: [
      {
        title: t(
          'Scoring My Old Portfolio: Building a Rubric, Then Designing From the Diagnosis',
          'Mein altes Portfolio bewerten: Eine Rubrik bauen, dann aus der Diagnose entwerfen',
        ),
        type: 'Evaluation',
        status: 'Live',
        summary: t(
          'Built a 9-category rubric against six celebrated portfolios. Scored my old site at 60%. Used the category-level gaps to direct the redesign. Estimated new score: 93%.',
          'Eine 9-Kategorien-Rubrik gegen sechs gefeierte Portfolios gebaut. Meine alte Seite mit 60 % bewertet. Die Lücken auf Kategorie-Ebene genutzt, um das Redesign zu lenken. Geschätzter neuer Score: 93 %.',
        ),
        tried: t(
          "Identified six celebrated designer portfolios as benchmark references: Simon Pan, Robin Noguier, Adham Dannaway, Buzz Usborne, Alin Buda, and James Foo. Derived a 9-category rubric covering first impression, visual craft, content hierarchy, case study quality, voice, technical execution, strategic positioning, conversion, and originality. Scored my old portfolio against each at a 1-to-5 scale. Total: 27 out of 45, or 60%. Compared against Alin Buda's 42 out of 45 (93%), the top reference. The 15-point gap became the redesign brief.",
          'Sechs gefeierte Designer-Portfolios als Benchmark-Referenzen identifiziert: Simon Pan, Robin Noguier, Adham Dannaway, Buzz Usborne, Alin Buda und James Foo. Eine 9-Kategorien-Rubrik abgeleitet, die ersten Eindruck, visuelles Handwerk, Inhalts-Hierarchie, Fallstudien-Qualität, Stimme, technische Umsetzung, strategische Positionierung, Konversion und Originalität abdeckt. Mein altes Portfolio gegen jede auf einer 1-bis-5-Skala bewertet. Gesamt: 27 von 45, also 60 %. Verglichen mit Alin Budas 42 von 45 (93 %), der Top-Referenz. Die 15-Punkte-Lücke wurde zum Redesign-Briefing.',
        ),
        learned: t(
          "Working from a rubric instead of a vibe-based 'redesign my site' brief gave the work an objective compass. Every change could be evaluated against a specific category's score. The biggest single-category jump was Content Hierarchy (2 to 5), achieved by removing password walls, dropping modals, and adopting the single-page scroll-through structure. The smallest gain was Case Study Quality (held at 4), because the prior cases were already strong; the gain came from breadth (five detail pages instead of one) rather than depth per case.",
          'Aus einer Rubrik zu arbeiten statt aus einem stimmungs-basierten „Redesign meine Seite"-Briefing hat der Arbeit einen objektiven Kompass gegeben. Jede Änderung konnte gegen den Score einer bestimmten Kategorie bewertet werden. Der größte Einzelkategorie-Sprung war Inhalts-Hierarchie (2 auf 5), erreicht durch das Entfernen von Passwort-Sperren, das Verwerfen von Modals und die Annahme der Single-Page-Scroll-Through-Struktur. Der kleinste Zugewinn war Fallstudien-Qualität (bei 4 gehalten), weil die vorherigen Fälle bereits stark waren; der Zugewinn kam aus der Breite (fünf Detail-Seiten statt einer) statt aus der Tiefe pro Fall.',
        ),
        didntWork: t(
          'The rubric is opinionated. It privileges scannability, evidence density, and distinctive identity. It under-values depth-on-click for technical readers and accessibility-as-design-statement. The estimated 93% score on the new site is self-assessment against the same opinionated lens. Anyone using a different rubric would score it differently.',
          'Die Rubrik hat eine Meinung. Sie privilegiert Überfliegbarkeit, Evidenz-Dichte und unverwechselbare Identität. Sie unterbewertet Tiefe-beim-Klick für technische Leser und Barrierefreiheit-als-Design-Aussage. Der geschätzte 93 %-Score auf der neuen Seite ist Selbstbewertung gegen dieselbe meinungs-tragende Linse. Jeder, der eine andere Rubrik nutzt, würde es anders bewerten.',
        ),
        forYourTeam: t(
          "Self-assessment against a rubric you wrote yourself is biased. The mitigation is to write the rubric before doing the redesign and to benchmark against external references. That doesn't remove the bias entirely, but it keeps the work honest. Without a rubric, 'this looks better' is the only available standard; with one, the conversation moves to which category moved how many points and why.",
          'Selbstbewertung gegen eine Rubrik, die man selbst geschrieben hat, ist befangen. Die Abmilderung ist, die Rubrik vor dem Redesign zu schreiben und gegen externe Referenzen zu benchmarken. Das entfernt die Befangenheit nicht vollständig, hält die Arbeit aber ehrlich. Ohne Rubrik ist „das sieht besser aus" der einzige verfügbare Maßstab; mit einer verschiebt sich das Gespräch dorthin, welche Kategorie sich um wie viele Punkte verschoben hat und warum.',
        ),
      },
      {
        title: t(
          'Gemini to Claude: Evaluating AI Provider Quality',
          'Von Gemini zu Claude: KI-Anbieter-Qualität bewerten',
        ),
        type: 'Evaluation',
        status: 'Learning',
        summary: t(
          'What switching AI providers mid-project taught me about evaluating LLM output quality as a design decision.',
          'Was mich der Wechsel des KI-Anbieters mitten im Projekt darüber gelehrt hat, LLM-Ausgabequalität als Designentscheidung zu bewerten.',
        ),
        tried: t(
          "Started Cal's plan generation on Gemini 1.5 Flash. Hit persistent reliability issues: API instability, inconsistent output structure, and quality that varied too much session to session to trust as the backbone of a user-facing feature. Switched to Claude Sonnet 4.6 after a structured comparison against the same prompt.",
          'Cals Plan-Generierung auf Gemini 1.5 Flash begonnen. Auf anhaltende Zuverlässigkeitsprobleme gestoßen: API-Instabilität, inkonsistente Ausgabestruktur und Qualität, die sich von Session zu Session zu stark unterschied, um ihr als Rückgrat eines nutzerseitigen Features zu vertrauen. Auf Claude Sonnet 4.6 gewechselt nach einem strukturierten Vergleich gegen denselben Prompt.',
        ),
        learned: t(
          'LLM evaluation is a UX research problem. The criteria that matter are not benchmark scores; they are output consistency (does it produce the same structure reliably?), tone adherence (does it maintain the persona defined?), constraint following (does it respect the rules?), and failure mode character (when it fails, how does it fail?). Claude failed more gracefully and more predictably. That predictability is what makes it usable in production.',
          'LLM-Bewertung ist ein UX-Research-Problem. Die Kriterien, die zählen, sind keine Benchmark-Scores; es sind Ausgabe-Konsistenz (produziert es zuverlässig dieselbe Struktur?), Ton-Treue (hält es die definierte Persona durch?), Einschränkungs-Befolgung (respektiert es die Regeln?) und Fehlermodus-Charakter (wenn es scheitert, wie scheitert es?). Claude ist eleganter und vorhersehbarer gescheitert. Diese Vorhersehbarkeit ist es, was es in Produktion nutzbar macht.',
        ),
        didntWork: t(
          'The evaluation process was informal: prompt, compare, decide. A more rigorous rubric applied earlier would have caught the provider mismatch faster. Treating LLM selection as an engineering decision rather than a design decision cost a few days.',
          'Der Bewertungsprozess war informell: prompten, vergleichen, entscheiden. Eine strengere, früher angewandte Rubrik hätte den Anbieter-Fehlpass schneller erwischt. Die LLM-Auswahl als Engineering-Entscheidung statt als Designentscheidung zu behandeln, hat ein paar Tage gekostet.',
        ),
        forYourTeam: t(
          'Teams evaluating AI providers or models should apply UX research methodology: define evaluation criteria before testing, test against real use cases not benchmarks, and weight failure modes as heavily as success rates. "It usually works" is not a production standard for anything user-facing.',
          'Teams, die KI-Anbieter oder -Modelle bewerten, sollten UX-Research-Methodik anwenden: Bewertungskriterien vor dem Testen definieren, gegen echte Anwendungsfälle testen, nicht gegen Benchmarks, und Fehlermodi genauso schwer gewichten wie Erfolgsraten. „Es funktioniert meistens" ist kein Produktions-Standard für irgendetwas Nutzerseitiges.',
        ),
      },
      {
        title: t('Guitar Practice Guide', 'Gitarren-Übungs-Guide'),
        type: 'Experiment',
        status: 'Archived',
        summary: t(
          'A structured practice app designed to replace aimless noodling with focused sessions that build toward learning a specific song.',
          'Eine strukturierte Übungs-App, entworfen, um ziellose Spielereien durch fokussierte Sessions zu ersetzen, die auf das Lernen eines bestimmten Songs hinarbeiten.',
        ),
        tried: t(
          'Designed a practice system where each session would be purposeful rather than open-ended, with a curated set of lessons covering theory, technique, and musical concepts that all ladder up to a target song. The idea was to give players a clear throughline: not just "practice guitar for 30 minutes" but "here\'s what you\'re working on today and why it matters for the thing you\'re trying to learn."',
          'Ein Übungs-System entworfen, in dem jede Session zielgerichtet sein würde statt offen, mit einem kuratierten Satz von Lektionen, die Theorie, Technik und musikalische Konzepte abdecken, die alle auf einen Ziel-Song hinauflaufen. Die Idee war, Spielern einen klaren Roten Faden zu geben: nicht nur „üb 30 Minuten Gitarre", sondern „hier ist, woran du heute arbeitest, und warum es für das zählt, was du zu lernen versuchst".',
        ),
        learned: t(
          'The concept held up. The technical reality did not. Audio processing turned out to be a much deeper problem than the practice structure itself, and the gap between a good idea and a functional musical tool was wider than the project could absorb at the time. Shelved in favor of more pressing work, but the core problem is still worth solving.',
          'Das Konzept hat gehalten. Die technische Realität nicht. Audio-Verarbeitung hat sich als viel tieferes Problem als die Übungsstruktur selbst herausgestellt, und die Lücke zwischen einer guten Idee und einem funktionalen musikalischen Werkzeug war breiter, als das Projekt zu der Zeit absorbieren konnte. Zugunsten dringenderer Arbeit auf Eis gelegt, aber das Kernproblem ist immer noch lösenswert.',
        ),
        didntWork: t(
          'Audio processing for pitch detection and feedback is a specialized domain with real constraints: latency, noise, and device variation. Underestimated how much of the product depended on solving that before anything else could be validated.',
          'Audio-Verarbeitung für Tonhöhen-Erkennung und Feedback ist eine spezialisierte Domäne mit echten Einschränkungen: Latenz, Rauschen und Geräte-Variation. Unterschätzt, wie viel des Produkts davon abhing, das zu lösen, bevor irgendetwas anderes validiert werden konnte.',
        ),
      },
    ],
  },
];
